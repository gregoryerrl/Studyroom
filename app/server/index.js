// Studyroom server — Express, static frontend, subject/file API, raw file serving, chats.
import express from "express";
import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";
import {
  listSubjects, subjectDir, listFiles, fileEntry, fileType, findSubject, nameError, portabilityError, resolveInSubject,
} from "./subjects.js";
import * as store from "./store.js";
import { buildSystemPrompt, defaultTitle } from "./prompts.js";
import { runTurn, toolLabel } from "./claude.js";
import { transcribe, findStrayJob, pickEngine, engineError } from "./transcribe.js";

const HERE = import.meta.dirname;
const ROOT = path.resolve(process.env.STUDYROOM_DIR || path.join(HERE, "..", ".."));
const STATE_DIR = path.join(ROOT, ".studyroom");
const PUBLIC = path.join(HERE, "..", "public");
// Loopback by default, so nothing about the local workflow changes and the server stays
// unreachable from the network unless you deliberately say otherwise. The override takes an
// ADDRESS, not a flag, because the right answer is almost always a specific interface — your
// Tailscale IP — rather than 0.0.0.0. There is no authentication anywhere in this app: the chat
// route spawns Claude Code with Write and Edit under --permission-mode dontAsk, and PUT writes
// arbitrary files under a subject. Binding 0.0.0.0 hands both to every host on the network.
//
// `||` HERE IS DELIBERATE AND SECURITY-RELEVANT — do not "modernize" it to `??`. An empty string
// is not nullish, so under `??` a set-but-empty STUDYROOM_HOST (a shell wrapper, a blank .env
// line, `docker -e STUDYROOM_HOST=`) reaches app.listen() as "" — and listen(port, "") binds `::`,
// the IPv6 wildcard, i.e. EVERY interface. Measured 2026-08-20: `*:4394` at the socket. That is a
// silent fail-open on the one variable whose whole documentation says don't bind everything.
// `||` coerces "" back to loopback; verified the same day, empty value still bound 127.0.0.1 only
// and was unreachable from the machine's LAN address.
const HOST = process.env.STUDYROOM_HOST || "127.0.0.1";
const PORT = Number(process.env.PORT) || 4321; // env override is a dev affordance (scratch trees beside the real server)

// Subjects live in their own directory so the data root stays tidy: <root>/ keeps profile.md and
// .studyroom/, <root>/subjects/ holds one folder per course. Created on boot so a fresh clone
// lists nothing rather than depending on readdir failing, then REALPATH'd — subjectDir() returns
// real paths, and a rename that mixed a real source with a non-real destination would move a
// subject somewhere else entirely if any parent were a symlink.
await fs.mkdir(path.join(ROOT, "subjects"), { recursive: true });
const SUBJECTS = await fs.realpath(path.join(ROOT, "subjects"));

await store.init(STATE_DIR);

const app = express();
app.disable("x-powered-by");
app.use(express.static(PUBLIC));

// Registered explicitly rather than globally, because the file-write routes below MUST see an
// untouched request stream — see the comment above them.
const jsonBody = express.json({ limit: "1mb" });

/**
 * Resolve :s to { dir, name }, or answer 404 and return null. `name` is the CANONICAL on-disk
 * name: macOS is case-insensitive but realpath does not fix case, so "/api/subjects/ai201/chats"
 * used to answer 200 with zero chats while AI201 had two. Canonicalizing in this one place means
 * only the real name ever reaches the store, so no route can key a second, empty chat bucket.
 */
async function requireSubject(req, res) {
  const subject = await subjectDir(SUBJECTS, req.params.s);
  if (!subject) res.status(404).json({ error: `no such subject: ${req.params.s}` });
  return subject;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Resolve :id to a chat record of `subject`, or answer 404 and return null. */
function requireChat(req, res, subject) {
  const chat = UUID.test(req.params.id) ? store.getChat(subject, req.params.id) : null;
  if (!chat) res.status(404).json({ error: "no such chat" });
  return chat;
}

/** Fire-and-forget persistence inside stream handlers: log, never throw into the pump. */
const bg = (p) => p.catch((err) => console.error("[store]", err));

/** The `*path` param, as one posix-relative string. */
const relParam = (req) => (Array.isArray(req.params.path) ? req.params.path.join("/") : String(req.params.path));

/** Local timestamp for archive folder names — toISOString() is UTC and stamps yesterday here after 16:00. */
function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

async function isFile(abs) {
  return fs.stat(abs).then((st) => st.isFile(), () => false);
}

function sendError(res, err) {
  res.status(err.status || 500).json({ error: err.message });
}

async function readProfile() {
  try {
    return await fs.readFile(path.join(ROOT, "profile.md"), "utf8");
  } catch {
    return ""; // a missing profile is simply empty
  }
}

// ---------- file mutation (registered BEFORE the JSON body parser) ----------
//
// express.json() consumes AND ends the request stream for `application/json`, so a route that
// pipes `req` never fires: measured on express 5.2.1, a .json upload hung forever with nothing
// written and a stranded temp file (and a 1.1 MB one got 413 from the parser's own limit). .json
// is an editable type here, and fetch(body: File) takes its Content-Type from File.type, so the
// drag-drop path hits exactly that. Registering these first keeps their bodies untouched; PATCH
// takes the parser explicitly because it genuinely wants JSON.

/** 409 while mlx_whisper is reading this exact file — archiving it mid-run pulls the source away. */
function transcribeConflict(res, subject, rel) {
  if (transcribing?.subject === subject && transcribing.file === rel) {
    res.status(409).json({ error: `${rel} is being transcribed right now — cancel that first` });
    return true;
  }
  return false;
}

// Upload or save: the raw body IS the file. One PUT per file, streamed to disk — no multipart
// parser, no dependency, and a 350 MB video never lands in memory.
app.put("/api/subjects/:s/files/*path", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  let target;
  try {
    target = await resolveInSubject(subject.dir, relParam(req), { mkdirs: true, portable: true });
  } catch (err) {
    return sendError(res, err);
  }
  if (transcribeConflict(res, subject.name, target.rel)) return;

  const existed = await isFile(target.abs);
  if (existed && req.query.overwrite !== "1") {
    // `code` so the client can tell THIS 409 from the transcribe-conflict one above and offer to
    // replace — matching on the message text would break the moment the wording changes.
    return res.status(409).json({ error: "a file with that name already exists", code: "exists" });
  }

  // Atomic: stream into a dotfile temp beside the target, rename on success. The dotfile is hidden
  // from walk() so a stray temp never shows in the UI, and *.part is gitignored so an aborted
  // 350 MB upload can never be staged.
  const tmp = path.join(target.parent, `.${path.basename(target.abs)}.part`);
  await fs.rm(tmp, { force: true }); // a SIGKILLed server never runs the cleanup below
  const out = createWriteStream(tmp);
  let settled = false;
  const fail = (status, message) => {
    if (settled) return;
    settled = true;
    out.destroy();
    fs.rm(tmp, { force: true }).catch(() => {});
    if (!res.headersSent) res.status(status).json({ error: message });
  };
  // 'res' close, not 'req' — req 'close' fires as soon as the body is read on Node >= 16.
  res.on("close", () => { if (!res.writableFinished) fail(499, "upload aborted"); });
  req.on("error", (err) => fail(400, err.message));
  out.on("error", (err) => fail(500, err.message));
  out.on("finish", async () => {
    if (settled) return;
    settled = true;
    try {
      await fs.rename(tmp, target.abs);
      res.status(existed ? 200 : 201).json(await fileEntry(subject.dir, target.rel));
    } catch (err) {
      await fs.rm(tmp, { force: true }).catch(() => {});
      if (!res.headersSent) sendError(res, err);
    }
  });
  req.pipe(out);
});

// Rename/move within the subject.
app.patch("/api/subjects/:s/files/*path", jsonBody, async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  let from, to;
  try {
    from = await resolveInSubject(subject.dir, relParam(req));
    to = await resolveInSubject(subject.dir, req.body?.path, { mkdirs: true, portable: true });
  } catch (err) {
    return sendError(res, err);
  }
  if (transcribeConflict(res, subject.name, from.rel)) return;
  const source = await fs.stat(from.abs).catch(() => null);
  if (!source?.isFile()) return res.status(404).json({ error: "no such file" });
  // Compare inodes, not paths: on a case-insensitive filesystem "notes.md" → "Notes.md" stats the
  // SAME file, and a path-equality check would answer 409 on a legitimate case-only rename.
  const clash = await fs.stat(to.abs).catch(() => null);
  if (clash && !(clash.ino === source.ino && clash.dev === source.dev)) {
    return res.status(409).json({ error: "a file with that name already exists" });
  }
  try {
    await fs.rename(from.abs, to.abs);
  } catch (err) {
    return sendError(res, err);
  }
  await store.retargetFocus(subject.name, from.rel, to.rel);
  res.json(await fileEntry(subject.dir, to.rel));
});

// Delete = archive-move, never rm: the file goes to .studyroom/archive/files/<Subject>/<stamp>/,
// which is gitignored and restorable by hand. Nothing the app does destroys a material.
app.delete("/api/subjects/:s/files/*path", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  let target;
  try {
    target = await resolveInSubject(subject.dir, relParam(req));
  } catch (err) {
    return sendError(res, err);
  }
  if (transcribeConflict(res, subject.name, target.rel)) return;
  if (!(await isFile(target.abs))) return res.status(404).json({ error: "no such file" });
  const dest = store.archivePath("files", subject.name, stamp(), target.rel);
  try {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.rename(target.abs, dest);
  } catch (err) {
    return sendError(res, err);
  }
  res.status(204).end();
});

app.use(jsonBody); // everything from here on parses JSON bodies normally

// ---------- subjects & files ----------

async function subjectRecord(name) {
  const { materials, generated } = await listFiles(path.join(SUBJECTS, name));
  return { name, fileCount: materials.length, hasGenerated: generated.length > 0 };
}

/** Why a subject can't be renamed/archived right now, or null. */
function subjectBusy(name) {
  if (transcribing?.subject === name) return `a transcription is running in ${name} — wait for it or cancel it`;
  if (store.listChats(name).some((c) => busy.has(c.id))) return `a chat in ${name} is mid-answer — wait for it or cancel it`;
  return null;
}

app.get("/api/subjects", async (req, res) => {
  res.json(await listSubjects(SUBJECTS));
});

app.post("/api/subjects", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const bad = nameError(name) ?? portabilityError(name);
  if (bad) return res.status(400).json({ error: bad });
  const clash = await findSubject(SUBJECTS, name);
  if (clash) return res.status(409).json({ error: `a subject named ${clash} already exists` });
  try {
    await fs.mkdir(path.join(SUBJECTS, name)); // non-recursive: EEXIST is a real answer, not a no-op
  } catch (err) {
    return res.status(err.code === "EEXIST" ? 409 : 500).json({ error: err.message });
  }
  res.status(201).json({ name, fileCount: 0, hasGenerated: false });
});

app.patch("/api/subjects/:s", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const bad = nameError(name) ?? portabilityError(name);
  if (bad) return res.status(400).json({ error: bad });
  if (name === subject.name) return res.json(await subjectRecord(name));
  // findSubject matches case-insensitively, so a clash resolving to THIS subject is a case-only
  // rename ("ai201" → "AI201") and must be allowed through.
  const clash = await findSubject(SUBJECTS, name);
  if (clash && clash !== subject.name) return res.status(409).json({ error: `a subject named ${clash} already exists` });
  const blocked = subjectBusy(subject.name);
  if (blocked) return res.status(409).json({ error: blocked });
  try {
    await fs.rename(subject.dir, path.join(SUBJECTS, name));
  } catch (err) {
    return sendError(res, err);
  }
  await store.renameSubjectState(subject.name, name);
  res.json(await subjectRecord(name));
});

app.delete("/api/subjects/:s", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  const blocked = subjectBusy(subject.name);
  if (blocked) return res.status(409).json({ error: blocked });
  // Archive-move, never rm: materials/ and chats/ land together under one restorable folder.
  const dest = store.archivePath("subjects", `${subject.name}-${stamp()}`);
  try {
    await fs.mkdir(dest, { recursive: true });
    await fs.rename(subject.dir, path.join(dest, "materials"));
  } catch (err) {
    return sendError(res, err);
  }
  await store.archiveSubjectState(subject.name, dest);
  res.status(204).end();
});

app.get("/api/subjects/:s/files", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  res.json(await listFiles(subject.dir));
});

// Raw materials + _generated for previews. Path-traversal-safe: realpath the target (so `..`
// AND symlinks are resolved on disk), then require it to sit inside the subject's real dir.
// `send` gives Range (video seeking), ETag, content-type.
app.get("/files/:s/*path", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  let abs;
  try {
    abs = await fs.realpath(path.resolve(subject.dir, relParam(req)));
  } catch (err) {
    const missing = err.code === "ENOENT" || err.code === "ENOTDIR";
    return res.status(missing ? 404 : 500).json({ error: missing ? "no such file" : err.message });
  }
  if (!abs.startsWith(subject.dir + path.sep)) return res.status(403).json({ error: "path outside subject" });

  // Two overrides on the way out, both keyed on the SAME classifier the listing uses, so there is
  // no second extension list to drift out of step with TYPE_BY_EXT. `send` returns early if a
  // Content-Type is already set, so setting one here sticks.
  const kind = fileType(path.basename(abs));
  // 1. Text-ish files must SHOW when opened in a new tab, not download. send's mime table gives
  //    .md `text/markdown` (which browsers download) and nothing at all for .py/.ts/.tex (so
  //    octet-stream). Every in-app read of this route uses fetch().text(), which ignores the type.
  //    Keep the charset — the lecture transcripts are UTF-8 and would mojibake without it.
  if (kind === "markdown" || kind === "text") res.type("text/plain; charset=utf-8");
  // 2. Anything the browser might treat as a scriptable DOCUMENT gets the same sandbox the in-app
  //    preview already applies via <iframe sandbox>. ALLOWLIST, not denylist: nameError() permits
  //    any extension, and `other` is everything TYPE_BY_EXT doesn't name — .svg (image/svg+xml)
  //    and .xhtml (application/xhtml+xml) are scriptable top-level and both land there — so this
  //    fails closed for the next unknown extension. pdf/video are excluded to keep their native
  //    viewers; markdown/text are inert as text/plain above. NEVER add allow-same-origin beside
  //    allow-scripts: that combination defeats the sandbox entirely.
  //    `image` is raster-only (svg stays in `other`) so nothing here is scriptable, but the header
  //    costs nothing — sandbox does not affect <img> loading, and a sandboxed PNG still renders when
  //    opened in a new tab — so it is applied anyway rather than carving out an exception.
  if (kind === "html" || kind === "other" || kind === "image") res.set("Content-Security-Policy", "sandbox");

  // The error callback answers JSON, but express only defaults that Content-Type when none is
  // set — so on the (unreachable in practice) TOCTOU-ENOENT path it inherits text/plain from
  // above. fetch().json() ignores the type, so this is noted rather than restructured.
  res.sendFile(abs, { dotfiles: "deny" }, (err) => {
    if (err && !res.headersSent) res.status(err.status || 500).json({ error: err.message });
  });
});

app.get("/subjects/:s", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  res.sendFile(path.join(PUBLIC, "subject.html"));
});

// ---------- chats ----------

const busy = new Map(); // chatId → { cancel() } while a turn is running (one turn at a time per chat)

app.get("/api/subjects/:s/chats", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  res.json(store.listChats(subject.name).map((c) => ({ ...c, busy: busy.has(c.id) })));
});

app.post("/api/subjects/:s/chats", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  let focus = null;
  if (req.body?.focus != null) {
    focus = String(req.body.focus);
    const { materials, generated } = await listFiles(subject.dir);
    if (![...materials, ...generated].some((f) => f.path === focus)) return res.status(404).json({ error: "no such file to focus on" });
  }
  res.status(201).json(await store.createChat(subject.name, { focus }));
});

app.get("/api/subjects/:s/chats/:id", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  const chat = requireChat(req, res, subject.name);
  if (!chat) return;
  res.json({ chat: { ...chat, busy: busy.has(chat.id) }, history: await store.readHistory(subject.name, chat.id) });
});

app.patch("/api/subjects/:s/chats/:id", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  const chat = requireChat(req, res, subject.name);
  if (!chat) return;
  const body = req.body ?? {};
  const patch = {};
  if ("title" in body) {
    const title = typeof body.title === "string" ? body.title.replace(/\s+/g, " ").trim().slice(0, 80) : "";
    if (!title) return res.status(400).json({ error: "title required" });
    patch.title = title;
  }
  // Allow-listed against the same arrays the dropdown renders from. Not a shell-injection guard
  // (spawn is array-form, no shell) — it turns a bad value into a 400 naming the field instead of
  // an opaque CLI failure at spawn time. null/"" clears back to inheriting settings.json.
  for (const [field, allowed] of [["model", store.MODELS], ["effort", store.EFFORTS]]) {
    if (!(field in body)) continue;
    const value = body[field];
    if (value === null || value === "") { patch[field] = null; continue; }
    if (!allowed.includes(value)) return res.status(400).json({ error: `${field} must be one of: ${allowed.join(", ")}` });
    patch[field] = value;
  }
  if (Object.keys(patch).length === 0) return res.status(400).json({ error: "nothing to update" });
  res.json(await store.updateChat(subject.name, chat.id, patch));
});

app.delete("/api/subjects/:s/chats/:id", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  const chat = requireChat(req, res, subject.name);
  if (!chat) return;
  if (busy.has(chat.id)) return res.status(409).json({ error: "this chat is busy — cancel or wait first" });
  await store.deleteChat(subject.name, chat.id);
  res.status(204).end();
});

app.post("/api/subjects/:s/chats/:id/cancel", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  const chat = requireChat(req, res, subject.name);
  if (!chat) return;
  const running = busy.get(chat.id);
  running?.cancel();
  res.json({ ok: true, wasRunning: Boolean(running) });
});

// One turn: persist the user line, write the prompt file, spawn claude, stream NDJSON
// ({kind:"delta"|"text"|"tool_use"|"done"|"error"}), persist tool_use lines as they arrive and
// ONE assistant line at the end. Client abort = cancel. 409 while the chat is busy.
app.post("/api/subjects/:s/chats/:id/messages", async (req, res) => {
  const found = await requireSubject(req, res);
  if (!found) return;
  const { dir, name: subject } = found;
  const chat = requireChat(req, res, subject);
  if (!chat) return;
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ error: "message required" });
  if (busy.has(chat.id)) return res.status(409).json({ error: "this chat is busy — cancel or wait for the current answer" });
  busy.set(chat.id, { cancel() {} }); // reserve before the awaits below
  let finished = false;
  let clientGone = false;
  // `res` 'close' fires when the connection drops before the response completed → the browser
  // aborted (Cancel button or tab closed). (`req` 'close' would fire as soon as the body was read.)
  res.on("close", () => {
    if (!finished) {
      clientGone = true;
      busy.get(chat.id)?.cancel();
    }
  });

  const promptPath = store.promptFile(chat.id);
  let focus = chat.focus;
  try {
    await store.appendChatLine(subject, chat.id, { kind: "user", text: message });
    if (!chat.title) await store.updateChat(subject, chat.id, { title: defaultTitle(message) });
    const { materials, generated } = await listFiles(dir);
    const syllabusFile = materials.find((m) => /syllabus/i.test(m.name))?.name ?? null;
    // focus is validated once at chat creation and interpolated into every prompt thereafter, so a
    // focus file that has since been deleted or archived would steer the whole chat at a file that
    // is not there. Re-check it against the listing we already have and drop it if it is gone.
    if (focus && ![...materials, ...generated].some((f) => f.path === focus)) {
      await store.updateChat(subject, chat.id, { focus: null });
      focus = null;
    }
    await fs.writeFile(promptPath, buildSystemPrompt({ subject, syllabusFile, profileText: await readProfile(), focus }));
  } catch (err) {
    busy.delete(chat.id);
    return res.status(500).json({ error: err.message });
  }

  res.status(200).set({
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();
  const send = (obj) => {
    if (!res.writableEnded) res.write(`${JSON.stringify(obj)}\n`);
  };

  const texts = []; // completed text blocks, in arrival order (this is what gets persisted)
  const finish = async ({ failed = false, message: errText = null, cancelled = false } = {}) => {
    if (finished) return;
    finished = true;
    busy.delete(chat.id);
    try {
      const full = texts.join("\n\n");
      if (full) await store.appendChatLine(subject, chat.id, { kind: "assistant", text: full });
      if (cancelled) {
        await store.appendChatLine(subject, chat.id, { kind: "error", text: "Cancelled." });
        send({ kind: "error", text: "Cancelled." });
      } else if (failed) {
        await store.appendChatLine(subject, chat.id, { kind: "error", text: errText });
        send({ kind: "error", text: errText });
      } else {
        send({ kind: "done" });
      }
      await store.updateChat(subject, chat.id, {}); // bump updatedAt: newest-active first
    } catch (err) {
      console.error("[chat] finishing turn:", err);
      send({ kind: "error", text: `Could not save this turn: ${err.message}` });
    } finally {
      if (!res.writableEnded) res.end(); // the browser must never be left on an open stream
    }
  };

  const turn = runTurn(
    {
      subjectDir: dir,
      prompt: message,
      systemPromptFile: promptPath,
      resumeId: chat.claudeSessionId,
      model: chat.model ?? null,
      effort: chat.effort ?? null,
    },
    {
      init: (sid, model) => {
        bg(store.updateChat(subject, chat.id, { claudeSessionId: sid }));
        // Report the model the turn is ACTUALLY running, so the head can never show a model the
        // CLI ignored (e.g. if --resume were to pin the original one).
        if (model) send({ kind: "model", text: model });
      },
      delta: (text) => send({ kind: "delta", text }),
      text: (text) => {
        texts.push(text);
        send({ kind: "text", text });
      },
      toolUse: (name, input) => {
        const label = toolLabel(name, input);
        bg(store.appendChatLine(subject, chat.id, { kind: "tool_use", tool: name, text: label }));
        send({ kind: "tool_use", tool: name, text: label });
      },
      result: ({ failed, message: errText }) => bg(finish({ failed, message: errText })),
    },
  );
  const cancel = () => {
    turn.cancel();
    bg(finish({ cancelled: true }));
  };
  busy.set(chat.id, { cancel });
  if (clientGone) cancel(); // the browser went away while we were preparing the prompt
});

// ---------- transcription (§6.5) ----------

// ONE job at a time GLOBALLY — it saturates the GPU/ANE. Deliberately NOT the per-chat `busy`
// map above: that is keyed by chat and this lock spans every subject.
let transcribing = null; // { subject, file, cancel() } while a job runs

app.post("/api/subjects/:s/transcribe", async (req, res) => {
  const subject = await requireSubject(req, res);
  if (!subject) return;
  const dir = subject.dir;
  const { file, force = false, language = null, translate = false } = req.body ?? {};

  // The path is client-supplied and we are about to exec a subprocess on it, so it must be a
  // MEMBER of the listing rather than a path we join. That is containment by construction:
  // walk() skips dotfiles (subjects.js) and only emits Dirent.isFile() entries, which is
  // false for symlinks — so nothing outside the subject dir can appear here to be chosen.
  const { materials } = await listFiles(dir);
  const entry = materials.find((m) => m.path === file);
  if (!entry) return res.status(404).json({ error: "no such file in this subject" });
  if (entry.type !== "video") return res.status(400).json({ error: "only video files can be transcribed" });

  const stem = entry.name.replace(/\.[^.]+$/, "");
  const rel = path.posix.join("_generated", "transcripts", `${stem}.md`);
  if (!force) {
    const existing = await fs.stat(path.join(dir, rel)).then(() => true).catch(() => false);
    if (existing) return res.json({ kind: "done", path: rel, skipped: true });
  }

  if (transcribing) return res.status(409).json({ error: `already transcribing ${transcribing.file} — wait or cancel it` });
  const stray = await findStrayJob();
  if (stray) return res.status(409).json({ error: `a transcription (pid ${stray}) is already running outside this server — wait for it or stop it` });
  // Resolved HERE, and once: this is the last point at which a plain status code can still be sent
  // (the lock below is only cleared inside settle(), and the NDJSON head goes out right after it,
  // so a `return res.status(...)` past either line would strand the lock or throw HEADERS_SENT).
  // Passing it down also keeps engine detection to a single site — two would be where the mlx and
  // openai-whisper flag dialects eventually drift apart.
  const engine = pickEngine();
  if (!engine) return res.status(400).json({ error: engineError() });
  // `subject` is recorded so the file/subject mutation routes can 409 against a running job.
  transcribing = { subject: subject.name, file, cancel() {} }; // reserve before any await below

  res.writeHead(200, {
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
  });
  const send = (obj) => {
    if (!res.writableEnded) res.write(`${JSON.stringify(obj)}\n`);
  };
  let done = false;
  const settle = (obj) => {
    if (done) return;
    done = true;
    transcribing = null;
    send(obj);
    if (!res.writableEnded) res.end();
  };

  const job = transcribe(
    { subjectDir: dir, relPath: file, language, translate, engine },
    {
      progress: (p) => send({ kind: "progress", ...p }),
      done: ({ path: outPath }) => settle({ kind: "done", path: outPath }),
      error: ({ message }) => settle({ kind: "error", text: message }),
    },
  );
  transcribing = { subject: subject.name, file, cancel: job.cancel };
  // 'res' close, not 'req' — req fires as soon as the body is read on Node >= 16.
  res.on("close", () => { if (!done) job.cancel(); });
});

app.listen(PORT, HOST, () => {
  console.log(`Studyroom → http://${HOST}:${PORT}  (root: ${ROOT}, subjects: ${SUBJECTS})`);
});
