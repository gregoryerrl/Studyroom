// Subject discovery + file listing. Pure fs helpers; the folder is the source of truth.
import fs from "node:fs/promises";
import path from "node:path";

const NOT_SUBJECTS = new Set(["docs", "app"]);

const TYPE_BY_EXT = {
  ".pdf": "pdf",
  ".mp4": "video", ".mov": "video", ".mkv": "video", ".webm": "video",
  ".md": "markdown", ".markdown": "markdown",
  ".html": "html", ".htm": "html",
  ".txt": "text", ".srt": "text", ".vtt": "text", ".csv": "text", ".json": "text",
  ".py": "text", ".js": "text", ".ts": "text", ".tex": "text",
};

/** A subject is a top-level dir whose name doesn't start with "." or "_" and isn't docs/app. */
export function isSubjectName(name) {
  return typeof name === "string" && name.length > 0 &&
    !name.startsWith(".") && !name.startsWith("_") && !NOT_SUBJECTS.has(name);
}

export function fileType(name) {
  return TYPE_BY_EXT[path.extname(name).toLowerCase()] ?? "other";
}

/**
 * Real (symlink-resolved) absolute dir for a subject name, or null if the name is invalid or no
 * such directory exists. Real path so the /files/ containment check compares like with like.
 */
export async function subjectDir(root, name) {
  if (!isSubjectName(name) || name.includes("/") || name.includes("\\")) return null;
  const dir = path.join(root, name);
  try {
    return (await fs.stat(dir)).isDirectory() ? await fs.realpath(dir) : null;
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
    if (!e.isDirectory() || !isSubjectName(e.name)) continue;
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
