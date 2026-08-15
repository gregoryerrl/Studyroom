// Studyroom server — Express, static frontend, subject/file API, raw file serving, chats.
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { listSubjects, subjectDir, listFiles } from "./subjects.js";
import * as store from "./store.js";
import { buildSystemPrompt, defaultTitle } from "./prompts.js";
import { runTurn, toolLabel } from "./claude.js";

const HERE = import.meta.dirname;
const ROOT = path.resolve(process.env.STUDYROOM_DIR || path.join(HERE, "..", ".."));
const STATE_DIR = path.join(ROOT, ".studyroom");
const PUBLIC = path.join(HERE, "..", "public");
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 4321; // env override is a dev affordance (scratch trees beside the real server)

await store.init(STATE_DIR);

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.static(PUBLIC));

/** Resolve :s to its directory, or answer 404 and return null. */
async function requireSubject(req, res) {
  const dir = await subjectDir(ROOT, req.params.s);
  if (!dir) res.status(404).json({ error: `no such subject: ${req.params.s}` });
  return dir;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Resolve :id to a chat record of :s, or answer 404 and return null. */
function requireChat(req, res) {
  const chat = UUID.test(req.params.id) ? store.getChat(req.params.s, req.params.id) : null;
  if (!chat) res.status(404).json({ error: "no such chat" });
  return chat;
}

/** Fire-and-forget persistence inside stream handlers: log, never throw into the pump. */
const bg = (p) => p.catch((err) => console.error("[store]", err));

async function readProfile() {
  try {
    return await fs.readFile(path.join(ROOT, "profile.md"), "utf8");
  } catch {
    return ""; // a missing profile is simply empty
  }
}

// ---------- subjects & files ----------

app.get("/api/subjects", async (req, res) => {
  res.json(await listSubjects(ROOT));
});

app.get("/api/subjects/:s/files", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  res.json(await listFiles(dir));
});

// Raw materials + _generated for previews. Path-traversal-safe: realpath the target (so `..`
// AND symlinks are resolved on disk), then require it to sit inside the subject's real dir.
// `send` gives Range (video seeking), ETag, content-type.
app.get("/files/:s/*path", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  const rel = Array.isArray(req.params.path) ? req.params.path.join("/") : String(req.params.path);
  let abs;
  try {
    abs = await fs.realpath(path.resolve(dir, rel));
  } catch (err) {
    const missing = err.code === "ENOENT" || err.code === "ENOTDIR";
    return res.status(missing ? 404 : 500).json({ error: missing ? "no such file" : err.message });
  }
  if (!abs.startsWith(dir + path.sep)) return res.status(403).json({ error: "path outside subject" });
  res.sendFile(abs, { dotfiles: "deny" }, (err) => {
    if (err && !res.headersSent) res.status(err.status || 500).json({ error: err.message });
  });
});

app.get("/subjects/:s", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  res.sendFile(path.join(PUBLIC, "subject.html"));
});

// ---------- chats ----------

const busy = new Map(); // chatId → { cancel() } while a turn is running (one turn at a time per chat)

app.get("/api/subjects/:s/chats", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  res.json(store.listChats(req.params.s).map((c) => ({ ...c, busy: busy.has(c.id) })));
});

app.post("/api/subjects/:s/chats", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  let focus = null;
  if (req.body?.focus != null) {
    focus = String(req.body.focus);
    const { materials, generated } = await listFiles(dir);
    if (![...materials, ...generated].some((f) => f.path === focus)) return res.status(404).json({ error: "no such file to focus on" });
  }
  res.status(201).json(await store.createChat(req.params.s, { focus }));
});

app.get("/api/subjects/:s/chats/:id", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  const chat = requireChat(req, res);
  if (!chat) return;
  res.json({ chat: { ...chat, busy: busy.has(chat.id) }, history: await store.readHistory(req.params.s, chat.id) });
});

app.patch("/api/subjects/:s/chats/:id", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  const chat = requireChat(req, res);
  if (!chat) return;
  const title = typeof req.body?.title === "string" ? req.body.title.replace(/\s+/g, " ").trim().slice(0, 80) : "";
  if (!title) return res.status(400).json({ error: "title required" });
  res.json(await store.updateChat(req.params.s, chat.id, { title }));
});

app.delete("/api/subjects/:s/chats/:id", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  const chat = requireChat(req, res);
  if (!chat) return;
  if (busy.has(chat.id)) return res.status(409).json({ error: "this chat is busy — cancel or wait first" });
  await store.deleteChat(req.params.s, chat.id);
  res.status(204).end();
});

app.post("/api/subjects/:s/chats/:id/cancel", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  const chat = requireChat(req, res);
  if (!chat) return;
  const running = busy.get(chat.id);
  running?.cancel();
  res.json({ ok: true, wasRunning: Boolean(running) });
});

// One turn: persist the user line, write the prompt file, spawn claude, stream NDJSON
// ({kind:"delta"|"text"|"tool_use"|"done"|"error"}), persist tool_use lines as they arrive and
// ONE assistant line at the end. Client abort = cancel. 409 while the chat is busy.
app.post("/api/subjects/:s/chats/:id/messages", async (req, res) => {
  const dir = await requireSubject(req, res);
  if (!dir) return;
  const chat = requireChat(req, res);
  if (!chat) return;
  const subject = req.params.s;
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
  try {
    await store.appendChatLine(subject, chat.id, { kind: "user", text: message });
    if (!chat.title) await store.updateChat(subject, chat.id, { title: defaultTitle(message) });
    const { materials } = await listFiles(dir);
    const syllabusFile = materials.find((m) => /syllabus/i.test(m.name))?.name ?? null;
    await fs.writeFile(promptPath, buildSystemPrompt({ subject, syllabusFile, profileText: await readProfile(), focus: chat.focus }));
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
    { subjectDir: dir, prompt: message, systemPromptFile: promptPath, resumeId: chat.claudeSessionId },
    {
      init: (sid) => bg(store.updateChat(subject, chat.id, { claudeSessionId: sid })),
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

app.listen(PORT, HOST, () => {
  console.log(`Studyroom → http://${HOST}:${PORT}  (root: ${ROOT})`);
});
