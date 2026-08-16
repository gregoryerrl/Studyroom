// App state under <root>/.studyroom/:
//   state.json                       — per-subject chat records; in-memory is the source of truth,
//                                      persisted with atomic, serialized writes (never re-read mid-run)
//   chats/<Subject>/<chatId>.jsonl   — one JSON object per line: { ts, kind, text?, tool? }
//   chats/<Subject>/archive/         — JSONL of deleted chats
//   prompt-<chatId>.txt              — the system prompt written before each spawn
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

let stateDir = null;
let state = { subjects: {} };
let saving = Promise.resolve(); // single writer: saves run one after another, in call order
let saveSeq = 0;

/** Boot: create the directories and load state.json once. */
export async function init(dir) {
  stateDir = dir;
  await fs.mkdir(path.join(stateDir, "chats"), { recursive: true });
  state = await loadState(stateDir);
  if (!state.subjects || typeof state.subjects !== "object") state.subjects = {};
}

/** Read state.json; a missing file is an empty state; bad JSON is a loud, clear error. */
export async function loadState(dir) {
  const file = path.join(dir, "state.json");
  let raw;
  try {
    raw = await fs.readFile(file, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return { subjects: {} };
    throw err;
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`${file} is not valid JSON (${err.message}) — fix or delete it, then restart`);
  }
}

/**
 * Atomic + serialized write of state.json: the snapshot is serialized NOW, written to a
 * unique temp file, then renamed into place; concurrent callers queue behind each other
 * (parallel chat turns all call this) so no two writes race on the same temp name.
 */
export function saveState(dir = stateDir, snapshot = state) {
  const file = path.join(dir, "state.json");
  const tmp = `${file}.${process.pid}.${++saveSeq}.tmp`;
  const json = JSON.stringify(snapshot, null, 2);
  saving = saving
    .catch(() => {})
    .then(async () => {
      await fs.writeFile(tmp, json);
      await fs.rename(tmp, file);
    });
  return saving;
}

// ---------- chat records ----------

function subjectState(subject) {
  return (state.subjects[subject] ??= { chats: [] });
}

/** Chats of a subject, most recently updated first. */
export function listChats(subject) {
  return [...subjectState(subject).chats].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getChat(subject, id) {
  return subjectState(subject).chats.find((c) => c.id === id) ?? null;
}

/**
 * Model/effort values the app will pass to the CLI. Exported so the PATCH route and the client's
 * dropdown render from ONE list and cannot drift apart.
 *
 * DEFAULT_MODEL is deliberately not null: inheriting ~/.claude/settings.json resolves to
 * claude-fable-5[1m], which is out of usage credits, so a null default would hand every new chat
 * the exact "out of usage credits" error this dropdown exists to escape. "" means inherit, and
 * stays available as an explicit choice.
 */
export const MODELS = ["opus", "sonnet", "haiku", "fable"];
export const EFFORTS = ["low", "medium", "high", "xhigh", "max"];
export const DEFAULT_MODEL = "opus";

export async function createChat(subject, { focus = null } = {}) {
  const now = Date.now();
  const chat = { id: crypto.randomUUID(), title: null, claudeSessionId: null, focus, model: DEFAULT_MODEL, effort: null, createdAt: now, updatedAt: now };
  subjectState(subject).chats.push(chat);
  await saveState();
  return chat;
}

/** Patch a chat record (title, claudeSessionId, …); bumps updatedAt. Returns the record or null. */
export async function updateChat(subject, id, patch) {
  const chat = getChat(subject, id);
  if (!chat) return null;
  Object.assign(chat, patch, { updatedAt: Date.now() });
  await saveState();
  return chat;
}

/** Remove the record, archive its history, drop its prompt file. */
export async function deleteChat(subject, id) {
  const chats = subjectState(subject).chats;
  const i = chats.findIndex((c) => c.id === id);
  if (i < 0) return false;
  chats.splice(i, 1);
  await saveState();
  const archiveDir = path.join(stateDir, "chats", subject, "archive");
  await fs.mkdir(archiveDir, { recursive: true });
  try {
    await fs.rename(chatFile(subject, id), path.join(archiveDir, `${id}.jsonl`));
  } catch (err) {
    if (err.code !== "ENOENT") throw err; // a chat that never got a message has no file
  }
  await fs.rm(promptFile(id), { force: true });
  return true;
}

// ---------- subject-level moves ----------
// Chat records AND their JSONL directory are keyed by the subject NAME, so a subject rename or
// archive has to be followed here or every chat of that subject is orphaned.

/** Where archived material goes: <stateDir>/archive/<...parts>. Gitignored, restorable by hand. */
export function archivePath(...parts) {
  return path.join(stateDir, "archive", ...parts);
}

export async function renameSubjectState(from, to) {
  if (from === to) return;
  if (state.subjects[from]) {
    state.subjects[to] = state.subjects[from];
    delete state.subjects[from];
    await saveState();
  }
  try {
    await fs.rename(path.join(stateDir, "chats", from), path.join(stateDir, "chats", to));
  } catch (err) {
    if (err.code !== "ENOENT") throw err; // a subject nobody has chatted in has no directory
  }
}

/** Drop the chat records, move their JSONL beside the archived materials, drop the prompt files. */
export async function archiveSubjectState(subject, destDir) {
  const chats = state.subjects[subject]?.chats ?? [];
  delete state.subjects[subject];
  await saveState();
  await fs.mkdir(destDir, { recursive: true });
  try {
    await fs.rename(path.join(stateDir, "chats", subject), path.join(destDir, "chats"));
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
  await Promise.all(chats.map((c) => fs.rm(promptFile(c.id), { force: true })));
}

/**
 * Follow a file rename. A focused chat stores `focus` as a path relative to the subject dir and
 * prompts.js interpolates it into every system prompt, so a renamed file would leave the prompt
 * pointing at something that no longer exists. Deliberately does NOT go through updateChat:
 * renaming a file must not reorder the newest-active-first chat list.
 */
export async function retargetFocus(subject, fromRel, toRel) {
  const hits = subjectState(subject).chats.filter((c) => c.focus === fromRel);
  if (hits.length === 0) return 0;
  for (const chat of hits) chat.focus = toRel;
  await saveState();
  return hits.length;
}

// ---------- history (JSONL) ----------

function chatFile(subject, id) {
  return path.join(stateDir, "chats", subject, `${id}.jsonl`);
}

export function promptFile(id) {
  return path.join(stateDir, `prompt-${id}.txt`);
}

export async function appendChatLine(subject, id, line) {
  const file = chatFile(subject, id);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.appendFile(file, `${JSON.stringify({ ts: Date.now(), ...line })}\n`);
}

/** Parsed history lines; a torn last line (crash mid-write) is skipped, not fatal. */
export async function readHistory(subject, id) {
  let raw;
  try {
    raw = await fs.readFile(chatFile(subject, id), "utf8");
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
  const out = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line));
    } catch {
      /* skip torn line */
    }
  }
  return out;
}
