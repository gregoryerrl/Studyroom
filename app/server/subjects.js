// Subject discovery + file listing + write-path safety. Pure fs helpers; the folder is the
// source of truth. Subjects live in <root>/subjects/, so every directory in there is a subject —
// there is no exclusion list any more, only the "." / "_" name rules below.
import fs from "node:fs/promises";
import path from "node:path";

const TYPE_BY_EXT = {
  ".pdf": "pdf",
  ".mp4": "video", ".mov": "video", ".mkv": "video", ".webm": "video",
  ".md": "markdown", ".markdown": "markdown",
  ".html": "html", ".htm": "html",
  ".txt": "text", ".srt": "text", ".vtt": "text", ".csv": "text", ".json": "text",
  ".py": "text", ".js": "text", ".ts": "text", ".tex": "text",
};

/** Types the in-app editor may open: we can edit exactly what we can render as text. */
const EDITABLE_TYPES = new Set(["markdown", "text", "html"]);

const MAX_NAME = 64;

/** Give an Error an HTTP status so routes can answer with it instead of a blanket 500. */
export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/**
 * Why `name` cannot be a subject folder, or null if it can. ONE validator, shared by subjectDir
 * and the create/rename routes — so a name the app will create is always a name the app can
 * resolve afterwards. Spaces are fine ("Machine Learning" is a plausible course).
 */
export function nameError(name) {
  if (typeof name !== "string" || name.length === 0) return "name required";
  if (name !== name.trim()) return "name cannot start or end with whitespace";
  if (name.length > MAX_NAME) return `name must be ${MAX_NAME} characters or fewer`;
  if (name.startsWith(".") || name.startsWith("_")) return "name cannot start with '.' or '_'"; // also excludes "." and ".."
  if (name.includes("/") || name.includes("\\")) return "name cannot contain a slash";
  if (hasControlChar(name)) return "name cannot contain control characters";
  return null;
}

/** Control characters (U+0000 through U+001F) are legal in POSIX filenames and wreck every display. */
function hasControlChar(s) {
  for (const ch of s) if (ch.codePointAt(0) < 0x20) return true;
  return false;
}

export function fileType(name) {
  return TYPE_BY_EXT[path.extname(name).toLowerCase()] ?? "other";
}

export function isEditable(name) {
  return EDITABLE_TYPES.has(fileType(name));
}

/**
 * The real on-disk directory name matching `name` case-INSENSITIVELY, or null.
 * macOS filesystems are case-insensitive but fs.realpath does NOT canonicalize case, so
 * "ai201" resolves to AI201's directory while keying a second, empty chat bucket in state.json
 * (measured: /api/subjects/ai201/chats answered 200 with zero chats while AI201 had two).
 * Every route resolves :s through here, so only the canonical name ever reaches the store.
 */
export async function findSubject(root, name) {
  if (nameError(name)) return null;
  const lower = name.toLowerCase();
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return null;
  }
  const hit = entries.find((e) => e.isDirectory() && !nameError(e.name) && e.name.toLowerCase() === lower);
  return hit?.name ?? null;
}

/**
 * { dir, name } for a subject — dir symlink-resolved (so the /files/ containment checks compare
 * like with like), name canonical. null if there is no such subject.
 */
export async function subjectDir(root, name) {
  const canonical = await findSubject(root, name);
  if (!canonical) return null;
  const dir = path.join(root, canonical);
  try {
    if (!(await fs.stat(dir)).isDirectory()) return null;
    return { dir: await fs.realpath(dir), name: canonical };
  } catch {
    return null;
  }
}

/** [{ name, fileCount, hasGenerated }] for every subject under root, sorted by name. */
export async function listSubjects(root) {
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch {
    return [];
  }
  const subjects = [];
  for (const e of entries) {
    if (!e.isDirectory() || nameError(e.name)) continue;
    const { materials, generated } = await listFiles(path.join(root, e.name));
    subjects.push({ name: e.name, fileCount: materials.length, hasGenerated: generated.length > 0 });
  }
  return subjects.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Recursive listing of one subject dir.
 * materials = everything except _generated/; generated = the contents of _generated/ (missing dir = []).
 * Entry: { path (posix, relative to the subject dir), name, size, mtime (ms), type }.
 * Dotfiles/dot-dirs and symlinks are skipped.
 */
export async function listFiles(dir) {
  const materials = await walk(dir, "", [], (rel) => rel === "_generated");
  const generated = await walk(path.join(dir, "_generated"), "_generated", [], null);
  const byPath = (a, b) => a.path.localeCompare(b.path);
  return { materials: materials.sort(byPath), generated: generated.sort(byPath) };
}

async function walk(dir, base, out, skipDir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out; // missing or unreadable dir → nothing to list
  }
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (skipDir && skipDir(rel)) continue;
      await walk(abs, rel, out, skipDir);
    } else if (e.isFile()) {
      const st = await fs.stat(abs);
      out.push({ path: rel, name: e.name, size: st.size, mtime: Math.round(st.mtimeMs), type: fileType(e.name) });
    }
  }
  return out;
}

/** One file's listing-shaped entry, or null if it is not a file there. */
export async function fileEntry(dir, rel) {
  try {
    const st = await fs.stat(path.join(dir, rel));
    if (!st.isFile()) return null;
    const name = path.posix.basename(rel);
    return { path: rel, name, size: st.size, mtime: Math.round(st.mtimeMs), type: fileType(name) };
  } catch {
    return null;
  }
}

/**
 * Resolve a client-supplied relative path for a WRITE inside a subject → { abs, parent, rel }.
 * Throws an Error carrying .status.
 *
 * The read route (/files/:s/*) realpaths the TARGET, which on a write does not exist yet. So this
 * realpaths the PARENT and requires that to sit inside the subject's real dir, then rebuilds abs
 * from the real parent — a symlinked intermediate directory therefore cannot redirect the write.
 * Both sides must be real paths: on macOS /tmp is itself a symlink to /private/tmp, so comparing a
 * real path against a raw one 403s a perfectly legitimate location.
 */
export async function resolveInSubject(dir, rel, { mkdirs = false } = {}) {
  const parts = String(rel ?? "").split("/").filter((p) => p.length > 0);
  if (parts.length === 0) throw httpError(400, "file path required");
  for (const part of parts) {
    // Rejecting a leading "." kills ".." traversal AND dotfiles in one rule — and a written dotfile
    // would be invisible in the UI anyway, since walk() skips them.
    if (part.startsWith(".")) throw httpError(400, "path segments cannot start with '.'");
    if (part.includes("\\")) throw httpError(400, "path cannot contain a backslash");
    if (part.length > MAX_NAME) throw httpError(400, `each path segment must be ${MAX_NAME} characters or fewer`);
    if (hasControlChar(part)) throw httpError(400, "path cannot contain control characters");
  }
  const relPath = parts.join("/");
  const abs = path.resolve(dir, relPath);
  const parent = path.dirname(abs);
  if (mkdirs) await fs.mkdir(parent, { recursive: true });
  let realParent;
  try {
    realParent = await fs.realpath(parent);
  } catch {
    throw httpError(404, "no such folder in this subject");
  }
  if (realParent !== dir && !realParent.startsWith(dir + path.sep)) throw httpError(403, "path outside subject");
  return { abs: path.join(realParent, path.basename(abs)), parent: realParent, rel: relPath };
}
