// App state under <root>/.studyroom/: state.json (in-memory source of truth, atomic writes)
// and chats/<Subject>/<chatId>.jsonl (M2). M0 only needs the directories to exist at boot.
import fs from "node:fs/promises";
import path from "node:path";

export async function ensureStateDirs(stateDir) {
  await fs.mkdir(path.join(stateDir, "chats"), { recursive: true });
}

/** Read state.json once at boot; a missing file is an empty state. */
export async function loadState(stateDir) {
  const file = path.join(stateDir, "state.json");
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

/** Atomic write: temp file + rename, so a crash mid-write never leaves a torn state.json. */
export async function saveState(stateDir, state) {
  const file = path.join(stateDir, "state.json");
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(state, null, 2));
  await fs.rename(tmp, file);
}
