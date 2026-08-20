import { execFile } from "node:child_process";
import { createInterface } from "node:readline";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { IS_WINDOWS, findExecutable, spawnCommand, killTree } from "./platform.js";

/**
 * The two transcription engines and everything that differs between them. mlx-whisper is
 * Apple-Silicon-only — that is what MLX *is* — so every other OS needs openai-whisper, which runs
 * the same weights behind a different CLI dialect.
 *
 * Read out of openai-whisper 20250625's own source rather than guessed: flags are underscore-style;
 * there is no `--output_name` because `utils.py:94-98` writes `<output_dir>/<audio stem>.<ext>`,
 * and `stem` below is exactly that basename, so the SRT lands where the mlx branch puts it;
 * `--model turbo` is the same large-v3-turbo checkpoint (`__init__.py:30-31`); and `--verbose`
 * defaults to True, so the per-segment lines this file parses are printed either way.
 *
 * Both set condition-on-previous-text OFF. Whisper feeds each segment's text back as context by
 * default, which is what seeds its repetition loops — and on Lecture 1 a loop derailed the decoder
 * so badly that it stopped at 42:33 of 73:31 and still exited 0. Measured directly: with the flag
 * the same file transcribes straight past that point. Costs a little cross-segment coherence; buys
 * the other 42% of the lecture.
 */
const ENGINES = {
  mlx: {
    bin: "mlx_whisper",
    model: "mlx-community/whisper-large-v3-turbo",
    // huggingface_hub checks the model repo online BEFORE falling back to the cache. On a host with
    // a dead IPv6 route that hangs in SYN_SENT — observed here as a transcription pinned at 0% CPU
    // for 6+ minutes having burnt 0.65s total. The model is cached and §6.5 says this runs fully
    // offline, so force it.
    env: { HF_HUB_OFFLINE: "1" },
    args: (o) => [
      o.input,
      "--model", o.model,
      "--output-dir", o.outDir,
      "--output-name", o.stem, // explicit, so the SRT path is known rather than derived
      "--output-format", "srt",
      "--verbose", "True",
      "--condition-on-previous-text", "False",
      ...(o.language ? ["--language", o.language] : []),
      ...(o.translate ? ["--task", "translate"] : []),
    ],
  },
  whisper: {
    bin: "whisper",
    model: "turbo",
    env: {},
    args: (o) => [
      o.input,
      "--model", o.model,
      "--output_dir", o.outDir,
      "--output_format", "srt",
      "--verbose", "True",
      "--condition_on_previous_text", "False",
      ...(o.language ? ["--language", o.language] : []),
      ...(o.translate ? ["--task", "translate"] : []),
    ],
  },
};

/**
 * Which engine this machine will use: `STUDYROOM_WHISPER` pins one by name, otherwise the first
 * one actually installed. `STUDYROOM_WHISPER_MODEL` overrides the model — a CPU-only box wants
 * `small`, not `turbo`. Returns null when there is nothing to run, which is a supported answer:
 * the route turns it into one sentence instead of an ENOENT from inside a stream.
 */
export function pickEngine() {
  const wanted = process.env.STUDYROOM_WHISPER;
  for (const name of wanted ? [wanted] : Object.keys(ENGINES)) {
    // hasOwn, not truthiness: ENGINES.constructor and ENGINES.__proto__ are INHERITED and truthy,
    // so a bare lookup hands back an object with no `bin` and findExecutable(undefined) throws —
    // a 500 out of the one route whose whole job is to answer 400 with advice. Reproduced.
    if (!Object.hasOwn(ENGINES, name)) continue;
    const engine = ENGINES[name];
    // Auto-detection only. MLX runs on Apple Silicon and nowhere else, so an Intel Mac (or Node
    // under Rosetta) with mlx_whisper on PATH would pick it and die in a Python traceback instead
    // of falling through to openai-whisper. An explicit STUDYROOM_WHISPER=mlx still wins.
    if (!wanted && name === "mlx" && process.arch !== "arm64") continue;
    if (!findExecutable(engine.bin)) continue;
    return { name, ...engine, model: process.env.STUDYROOM_WHISPER_MODEL || engine.model };
  }
  return null;
}

/** Why pickEngine() came back empty, in one sentence the user can act on. */
export function engineError() {
  const wanted = process.env.STUDYROOM_WHISPER;
  if (wanted && !Object.hasOwn(ENGINES, wanted)) return `STUDYROOM_WHISPER=${wanted} is not a known engine — use "mlx" or "whisper".`;
  if (wanted) return `STUDYROOM_WHISPER=${wanted} is set, but ${ENGINES[wanted].bin} is not on this machine's PATH — see docs/RUNNING.md.`;
  // Otherwise "install one" would be advice to install something already sitting on this PATH.
  if (findExecutable(ENGINES.mlx.bin) && process.arch !== "arm64") {
    return "mlx-whisper is installed but only runs on Apple Silicon — install openai-whisper, or set STUDYROOM_WHISPER=mlx to try it anyway. See docs/RUNNING.md.";
  }
  return "No transcription engine is installed — add mlx-whisper (Apple Silicon only) or openai-whisper (any OS). See docs/RUNNING.md.";
}

// Match the argv the app actually spawns, NOT the bare word: `pgrep -f mlx_whisper` also matches
// any shell or editor whose command line merely contains that string (reproduced — it matched an
// unrelated bash), and a false positive here is a 409 the user has no way to clear. The `.` spans
// both dialects: mlx writes `--output-format`, openai-whisper `--output_format`.
const RUNNING_PATTERN = "(mlx_)?whisper .*--output.format srt";

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

/**
 * Is some other transcription already running? Returns a pid, or null.
 *
 * POSIX only. The portable guard is `index.js`'s module-level `transcribing` lock, which covers
 * every platform; this is the EXTRA that catches a job outliving a server restart — reachable when
 * one run takes ~73 minutes. WHAT WINDOWS LOSES, stated plainly: there, such a job is invisible, so
 * the new server starts a second one and two multi-gigabyte models load at once. A PowerShell/CIM
 * equivalent was considered and left out — nothing in this session can test it, and DECISIONS.md's
 * stray-job entry already ruled that a guard which can 409 with no way to clear it is worse than
 * the gap it closes.
 */
export function findStrayJob() {
  if (IS_WINDOWS) return Promise.resolve(null);
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
  if (segments.length === 0) return null;
  // Silence must mean exactly one thing. Without a duration the check CANNOT run, and an absent
  // warning would otherwise read as "coverage fine" in the one artifact whose whole risk is
  // looking complete when it isn't — doubly so because that same run also has no progress
  // percentage, so both safety nets are out at once.
  if (!duration) return "⚠️ Coverage unverified — ffprobe returned no duration for this video, so there is no way to tell whether Whisper reached the end. Check the last timestamp below against the actual recording.";
  const lastEnd = segments[segments.length - 1].end;
  const missing = duration - lastEnd;
  // Trigger on the MISSING TAIL, not a flat percentage. The only benign gap ever measured here is
  // Lecture 2's 60.6 s of trailing silence (1.6%); a truncation cost 31 minutes. The percentage
  // floor catches proportional loss on long lectures (3% of 73 min ≈ 2.2 min), and the absolute
  // floor stops a short clip's ordinary trailing silence from crying wolf (3% of 10 min is 18 s).
  // Asymmetry is deliberate: a false alarm is a note Gregory dismisses, a miss silently poisons
  // every digest and quiz built on the file.
  if (missing <= Math.max(duration * 0.03, 60)) return null;
  // floor, not round: at the boundary Math.round would print "95% covered" for a 94.9% run and
  // contradict the threshold in the same sentence.
  return `⚠️ INCOMPLETE: Whisper stopped at ${formatHMS(lastEnd)} of ${formatHMS(duration)} (${Math.floor((lastEnd / duration) * 100)}% covered, ${formatHMS(missing)} missing). The rest of this lecture is NOT transcribed — do not treat this as the full recording. Re-run with a different setting, or transcribe the remainder separately.`;
}

/**
 * Segments → the transcript format the reference file established: H1 naming the video, the
 * italic provenance note, an optional coverage warning, then paragraphs opening with a bold
 * [HH:MM:SS] marker. Looping duplicates are collapsed (see the ring below).
 */
export function toMarkdown(segments, videoName, dateISO, warning = null, model = "whisper") {
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
    `_Auto-transcribed with Whisper (${model}) on ${dateISO}. May contain recognition errors; repeated segments (silence hallucinations) were collapsed._`,
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
 * Returns { cancel() }, which kills the whole tree: both engines shell out to ffmpeg, so killing
 * only the parent leaves ffmpeg decoding a multi-hundred-megabyte file.
 *
 * `engine` comes from pickEngine() and is resolved ONCE, by the route — detecting it again here
 * would be a second place for the two CLI dialects to drift apart.
 */
export function transcribe({ subjectDir, relPath, language, translate, engine }, on) {
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
  let stderrBuf = ""; // the incomplete trailing segment between two 'data' events
  let lastKey = null;
  let lastDownloadPct = -1;

  // openai-whisper fetches its model on first use (1,617,941,637 B for `turbo`) and tqdm draws that
  // bar on STDERR, redrawn with \r and never a \n — so it reaches neither the stdout line parser
  // below nor a \n-based splitter, and a first run on a fresh machine sits at 0% for minutes
  // looking hung. It is matched FIRST and kept OUT of the error tail: 2048 characters of bar frames
  // would evict the real error, and `.split("\n").pop()` over a \r-only stream hands back the whole
  // blob as one "line". mlx never reaches this — HF_HUB_OFFLINE makes it fail rather than download.
  const DOWNLOAD_LINE = /^\s*(\d+)%\|/;

  /** One stderr segment: a download frame becomes progress, anything else is error evidence. */
  const feedLine = (line) => {
    if (!line.trim()) return;
    const m = DOWNLOAD_LINE.exec(line);
    if (!m) {
      stderrTail = (stderrTail + line + "\n").slice(-2048); // drain, or the child blocks on a full pipe
      return;
    }
    const pct = Number(m[1]);
    if (pct === lastDownloadPct) return; // one event per whole percent, not per redraw
    lastDownloadPct = pct;
    on.progress({ pct: null, at: null, text: `Downloading the Whisper model (~1.5 GB, first run only) — ${pct}%` });
  };

  const feedStderr = (chunk) => {
    const parts = (stderrBuf + chunk).split(/[\r\n]/);
    stderrBuf = parts.pop() ?? ""; // tqdm's newest frame has no terminator yet; hold it back
    for (const part of parts) feedLine(part);
  };

  /** Last real line of stderr, split on BOTH terminators so nothing can collapse into one blob. */
  const lastStderrLine = () => stderrTail.split(/[\r\n]/).map((l) => l.trim()).filter(Boolean).pop() ?? "";

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
      if (!engine) throw new Error(engineError()); // the route resolves it; this is the belt
      await fs.mkdir(outDir, { recursive: true });
      // A SIGKILLed server never runs the cleanup below, so clear any leftover before starting.
      await fs.unlink(partialPath).catch(() => {});
      // The SRT is scratch: it goes to a temp dir, never into the git-tracked _generated/.
      tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "studyroom-srt-"));

      const duration = await probeDuration(videoAbs);
      const args = engine.args({ input: videoAbs, outDir: tmpDir, stem, model: engine.model, language, translate });

      console.debug(`[whisper] spawn (${relPath}, engine=${engine.name}, duration=${duration ?? "unknown"}) ${engine.bin} ${args.slice(1).join(" ")}`);
      child = spawnCommand(engine.bin, args, {
        cwd: subjectDir,
        env: {
          ...process.env,
          // Python block-buffers print() when stdout is a pipe, so without this the per-segment
          // lines arrive in ~8KB bursts (or only at exit) and the progress bar sits still and
          // then lurches. Verified: with it, output is immediate.
          PYTHONUNBUFFERED: "1",
          ...engine.env,
        },
        stdio: ["ignore", "pipe", "pipe"],
      });

      child.on("error", (err) => finish({ error: `Could not start ${engine.bin}: ${err.message}` }));
      child.stderr.on("data", (chunk) => feedStderr(String(chunk)));

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
        feedLine(stderrBuf); // the last frame/line never got a terminator
        stderrBuf = "";
        if (code !== 0) {
          const tail = lastStderrLine();
          return finish({ error: `${engine.bin} exited (code ${code}${signal ? `, ${signal}` : ""})${tail ? `: ${tail}` : ""}` });
        }
        try {
          const srt = await fs.readFile(path.join(tmpDir, `${stem}.srt`), "utf8");
          const segments = parseSrt(srt);
          if (segments.length === 0) return finish({ error: `${engine.bin} produced no segments.` });
          const warning = coverageWarning(segments, duration);
          if (warning) console.warn(`[whisper] ${relPath}: ${warning}`);
          const markdown = toMarkdown(segments, videoName, new Date().toISOString().slice(0, 10), warning, engine.model);
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
      if (child?.pid) killTree(child);
      else finish({ error: "Cancelled." });
    },
  };
}
