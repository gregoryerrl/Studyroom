import { spawn, execFile } from "node:child_process";
import { createInterface } from "node:readline";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const MODEL = "mlx-community/whisper-large-v3-turbo";
// Match the argv the app actually spawns, NOT the bare word: `pgrep -f mlx_whisper` also matches
// any shell or editor whose command line merely contains that string (reproduced — it matched an
// unrelated bash), and a false positive here is a 409 the user has no way to clear.
const RUNNING_PATTERN = "mlx_whisper .*--output-format srt";

/** Seconds of media, or null when ffprobe is missing or says nothing. Null is a supported state. */
export function probeDuration(absPath) {
  return new Promise((resolve) => {
    execFile("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration",
      "-of", "default=noprint_wrappers=1:nokey=1",
      absPath,
    ], (err, stdout) => {
      const seconds = Number.parseFloat(String(stdout).trim());
      resolve(err || !Number.isFinite(seconds) || seconds <= 0 ? null : seconds);
    });
  });
}

/** Is some other transcription already running? Returns a pid, or null. */
export function findStrayJob() {
  return new Promise((resolve) => {
    execFile("pgrep", ["-f", RUNNING_PATTERN], (err, stdout) => {
      const pid = String(stdout).trim().split("\n").filter(Boolean)[0];
      resolve(pid ? Number(pid) : null);
    });
  });
}

// Hours are OPTIONAL, and the two producers disagree — verified against a real run, not assumed:
//   SRT   `00:00:02,000`  — always has hours (writers.py:203 sets always_include_hours = True)
//   stdout `00:02.000`    — omits them below one hour (transcribe.py:39 `if hours > 0`)
// A pattern requiring HH: matches nothing for the first hour of a lecture, so the progress bar
// would sit dead until 01:00:00 and only then start moving.
const HMS = /^(?:(\d+):)?(\d{1,2}):(\d{2})[.,](\d{1,3})$/;
/** "HH:MM:SS,mmm", "HH:MM:SS.mmm" or "MM:SS.mmm" → seconds. NaN when unparseable. */
export function parseTimestamp(s) {
  const m = HMS.exec(String(s).trim());
  if (!m) return Number.NaN;
  return Number(m[1] ?? 0) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4].padEnd(3, "0")) / 1000;
}

/** seconds → "HH:MM:SS" for the transcript's paragraph markers. */
export function formatHMS(seconds) {
  const t = Math.max(0, Math.floor(seconds));
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(Math.floor(t / 3600))}:${pad(Math.floor(t / 60) % 60)}:${pad(t % 60)}`;
}

/**
 * Comparison key for collapsing CONSECUTIVE duplicates. The written text keeps its original form;
 * only the key is normalized, so `Thanks for today.` and `Thanks for today` collapse together —
 * a decoder looping on trailing silence has no reason to punctuate each repeat identically.
 */
export function dedupeKey(text) {
  return String(text).trim().replace(/\s+/g, " ").replace(/[.,!?;:…]+$/u, "").toLowerCase();
}

/** SRT blocks (`index / start --> end / text…`) → [{ start, end, text }]. */
export function parseSrt(srt) {
  const out = [];
  for (const block of String(srt).replace(/\r\n/g, "\n").trim().split(/\n{2,}/)) {
    const lines = block.split("\n");
    const arrow = lines.findIndex((l) => l.includes("-->"));
    if (arrow === -1) continue;
    const [rawStart, rawEnd] = lines[arrow].split("-->");
    const start = parseTimestamp(rawStart);
    const end = parseTimestamp(rawEnd);
    const text = lines.slice(arrow + 1).join(" ").trim();
    if (!Number.isFinite(start) || !text) continue;
    out.push({ start, end: Number.isFinite(end) ? end : start, text });
  }
  return out;
}

const PARAGRAPH_SECONDS = 30; // §6.5: a bold marker at least every ~30s
const LOOP_RING = 6;            // how many recent lines to compare against
const LOOP_WINDOW_SECONDS = 90; // a repeat within this window is a decoder loop, not a callback

/**
 * Whisper can stop early and still exit 0 — observed on Lecture 1, which decodes fine in ffmpeg
 * for 73:31 but produced segments only to 42:33 after a repetition loop derailed the decoder.
 * The result is a transcript that READS complete, so every study artifact built from it would
 * silently cover 58% of the lecture. Returns a note to embed, or null when coverage looks sane.
 */
export function coverageWarning(segments, duration) {
  if (!duration || segments.length === 0) return null;
  const lastEnd = segments[segments.length - 1].end;
  if (lastEnd >= duration * 0.95) return null;
  return `⚠️ INCOMPLETE: Whisper stopped at ${formatHMS(lastEnd)} of ${formatHMS(duration)} (${Math.round((lastEnd / duration) * 100)}% covered). The rest of this lecture is NOT transcribed — do not treat this as the full recording. Re-run with a different setting, or transcribe the remainder separately.`;
}

/**
 * Segments → the transcript format the reference file established: H1 naming the video, the
 * italic provenance note, an optional coverage warning, then paragraphs opening with a bold
 * [HH:MM:SS] marker. Looping duplicates are collapsed (see the ring below).
 */
export function toMarkdown(segments, videoName, dateISO, warning = null) {
  const kept = [];
  const recent = []; // [{ key, start }] — a short window, newest last
  for (const seg of segments) {
    const key = dedupeKey(seg.text);
    if (!key) continue;
    // Drop a repeat only when the SAME line recurs inside LOOP_WINDOW_SECONDS. That covers the
    // plain consecutive loop §6.5 describes AND the alternating one Lecture 1 actually produces
    // ("So consumers do make suboptimal decisions." / "They are influenced by moods, by emotions."
    // × 7), which a consecutive-only check cannot see because no two adjacent lines match.
    // Bounded by time and by ring size so a genuine callback later in the lecture still survives.
    if (recent.some((r) => r.key === key && seg.start - r.start <= LOOP_WINDOW_SECONDS)) continue;
    recent.push({ key, start: seg.start });
    while (recent.length > LOOP_RING) recent.shift();
    kept.push(seg);
  }
  const paragraphs = [];
  for (const seg of kept) {
    const current = paragraphs[paragraphs.length - 1];
    if (!current || seg.start - current.start >= PARAGRAPH_SECONDS) {
      paragraphs.push({ start: seg.start, parts: [seg.text] });
    } else {
      current.parts.push(seg.text);
    }
  }
  const body = paragraphs.map((p) => `**[${formatHMS(p.start)}]** ${p.parts.join(" ").replace(/\s+/g, " ").trim()}`);
  return [
    `# Transcript — ${videoName}`,
    "",
    `_Auto-transcribed with Whisper (${MODEL}) on ${dateISO}. May contain recognition errors; repeated segments (silence hallucinations) were collapsed._`,
    ...(warning ? ["", `**${warning}**`] : []),
    "",
    ...body,
    "",
  ].join("\n\n").replace(/\n{3,}/g, "\n\n");
}

// `[HH:MM:SS.mmm --> HH:MM:SS.mmm] text` — what --verbose True prints per segment on STDOUT.
// (--verbose defaults to True, which DISABLES tqdm's frame-counter bar; these lines are richer
// and newline-delimited, so no carriage-return handling is needed.)
const PROGRESS_LINE = /^\[((?:\d+:)?\d{1,2}:\d{2}[.,]\d+)\s*-->\s*((?:\d+:)?\d{1,2}:\d{2}[.,]\d+)\]\s*(.*)$/;

/**
 * Transcribe one video. `on` handlers:
 *   progress({ pct, at, text })  — pct is null when the duration is unknown (indeterminate bar)
 *   done({ path })               — the markdown was renamed into place
 *   error({ message })           — failed; no markdown was written
 * Returns { cancel() }, which kills the whole process group: mlx_whisper shells out to ffmpeg,
 * so killing only the parent leaves ffmpeg decoding a multi-hundred-megabyte file.
 */
export function transcribe({ subjectDir, relPath, language, translate }, on) {
  const videoAbs = path.join(subjectDir, relPath);
  const videoName = path.basename(relPath);
  const stem = videoName.replace(/\.[^.]+$/, "");
  const outDir = path.join(subjectDir, "_generated", "transcripts");
  const finalPath = path.join(outDir, `${stem}.md`);
  // Dotfile: walk() skips names starting with "." (subjects.js:78), so a leftover is invisible to
  // the app — but _generated/ is git-tracked, so it would still show up in `git status`.
  const partialPath = path.join(outDir, `.${stem}.md.partial`);

  let child = null;
  let cancelled = false;
  let settled = false;
  let tmpDir = null;
  let stderrTail = "";
  let lastKey = null;

  const finish = async (result) => {
    if (settled) return;
    settled = true;
    if (tmpDir) await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    if (result.error) {
      await fs.unlink(partialPath).catch(() => {});
      on.error({ message: result.error });
    } else {
      on.done({ path: result.path, warning: result.warning ?? null });
    }
  };

  (async () => {
    try {
      await fs.mkdir(outDir, { recursive: true });
      // A SIGKILLed server never runs the cleanup below, so clear any leftover before starting.
      await fs.unlink(partialPath).catch(() => {});
      // The SRT is scratch: it goes to a temp dir, never into the git-tracked _generated/.
      tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "studyroom-srt-"));

      const duration = await probeDuration(videoAbs);
      const args = [
        videoAbs,
        "--model", MODEL,
        "--output-dir", tmpDir,
        "--output-name", stem, // explicit, so the SRT path is known rather than derived
        "--output-format", "srt",
        "--verbose", "True",
        // Whisper feeds each segment's text back as context by default, which is what seeds its
        // repetition loops — and on Lecture 1 a loop derailed the decoder so badly that it stopped
        // at 42:33 of 73:31 and still exited 0. Measured directly: with this flag the same file
        // transcribes straight past that point. Costs a little cross-segment coherence; buys the
        // other 42% of the lecture.
        "--condition-on-previous-text", "False",
      ];
      if (language) args.push("--language", language);
      if (translate) args.push("--task", "translate");

      console.debug(`[whisper] spawn (${relPath}, duration=${duration ?? "unknown"}) mlx_whisper ${args.slice(1).join(" ")}`);
      child = spawn("mlx_whisper", args, {
        cwd: subjectDir,
        env: {
          ...process.env,
          // Python block-buffers print() when stdout is a pipe, so without this the per-segment
          // lines arrive in ~8KB bursts (or only at exit) and the progress bar sits still and
          // then lurches. Verified: with it, output is immediate.
          PYTHONUNBUFFERED: "1",
          // huggingface_hub checks the model repo online BEFORE falling back to the cache. On a
          // host with a dead IPv6 route that hangs in SYN_SENT until the TCP timeout — observed
          // here as a transcription pinned at 0% CPU for 6+ minutes having burnt 0.65s total.
          // The model is already cached and §6.5 says this runs fully offline, so force it.
          HF_HUB_OFFLINE: "1",
        },
        stdio: ["ignore", "pipe", "pipe"],
        detached: true,
      });

      child.on("error", (err) => finish({ error: `Could not start mlx_whisper: ${err.message}` }));
      child.stderr.on("data", (chunk) => {
        stderrTail = (stderrTail + chunk).slice(-2048); // drain, or the child can block on a full pipe
      });

      createInterface({ input: child.stdout }).on("line", (line) => {
        const m = PROGRESS_LINE.exec(line.trim());
        if (!m) return;
        const key = dedupeKey(m[3]);
        if (key && key === lastKey) return; // don't scroll 60 identical lines past the user
        lastKey = key;
        const end = parseTimestamp(m[2]);
        const pct = duration && Number.isFinite(end) ? Math.min(100, Math.round((end / duration) * 100)) : null;
        on.progress({ pct, at: Number.isFinite(end) ? formatHMS(end) : null, text: m[3] });
      });

      child.on("close", async (code, signal) => {
        if (settled) return;
        if (cancelled) return finish({ error: "Cancelled." });
        if (code !== 0) {
          return finish({ error: `mlx_whisper exited (code ${code}${signal ? `, ${signal}` : ""})${stderrTail ? `: ${stderrTail.trim().split("\n").pop()}` : ""}` });
        }
        try {
          const srt = await fs.readFile(path.join(tmpDir, `${stem}.srt`), "utf8");
          const segments = parseSrt(srt);
          if (segments.length === 0) return finish({ error: "mlx_whisper produced no segments." });
          const warning = coverageWarning(segments, duration);
          if (warning) console.warn(`[whisper] ${relPath}: ${warning}`);
          const markdown = toMarkdown(segments, videoName, new Date().toISOString().slice(0, 10), warning);
          // Write beside the target, then rename: an interrupted run must leave NO file rather
          // than a truncated one, since the format has no terminator and _generated/ is committed.
          await fs.writeFile(partialPath, markdown);
          await fs.rename(partialPath, finalPath);
          await finish({ path: path.posix.join("_generated", "transcripts", `${stem}.md`), warning });
        } catch (err) {
          await finish({ error: `Could not write the transcript: ${err.message}` });
        }
      });
    } catch (err) {
      await finish({ error: err.message });
    }
  })();

  return {
    cancel() {
      cancelled = true;
      if (child?.pid) {
        try { process.kill(-child.pid, "SIGKILL"); } catch { /* already gone */ }
      } else {
        finish({ error: "Cancelled." });
      }
    },
  };
}
