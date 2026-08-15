// Studyroom server — Express, static frontend, subject/file API, raw file serving.
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { listSubjects, subjectDir, listFiles } from "./subjects.js";
import { ensureStateDirs } from "./store.js";

const HERE = import.meta.dirname;
const ROOT = path.resolve(process.env.STUDYROOM_DIR || path.join(HERE, "..", ".."));
const STATE_DIR = path.join(ROOT, ".studyroom");
const PUBLIC = path.join(HERE, "..", "public");
const HOST = "127.0.0.1";
const PORT = 4321;

await ensureStateDirs(STATE_DIR);

const app = express();
app.disable("x-powered-by");
app.use(express.static(PUBLIC));

/** Resolve :s to its directory, or answer 404 and return null. */
async function requireSubject(req, res) {
  const dir = await subjectDir(ROOT, req.params.s);
  if (!dir) res.status(404).json({ error: `no such subject: ${req.params.s}` });
  return dir;
}

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

app.listen(PORT, HOST, () => {
  console.log(`Studyroom → http://${HOST}:${PORT}  (root: ${ROOT})`);
});
