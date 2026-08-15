# Studyroom — Design Doc

**Date:** 2026-08-15
**For:** the bot-hq agent (or any Claude session) that will build this app. Read this whole file before writing code.
**Status:** approved starting point. Owner: Gregory (gregoryerrl).

## 0. Builder autonomy — read this first

**Do not ask Gregory questions during the build. Execute.** Every decision is either specified in this doc or explicitly delegated to you:

- For any detail this doc doesn't specify, choose the **simplest option consistent with §1's principles**, record it as one line in `docs/DECISIONS.md` (create that file at M0), and keep going. Gregory reviews DECISIONS.md instead of being interrupted.
- Never expand scope beyond the current milestone. §3's non-goals stay non-goals even when tempting.
- The only valid stopping points: (a) a milestone's acceptance checks all pass — stop and report; (b) an acceptance check cannot be made to pass after genuine debugging attempts — write the blocker and what you tried into DECISIONS.md, stop and report. Never stop to ask permission for work this doc already prescribes.
- All preferences below (§4 look & feel, layout, launch, git posture) were decided with Gregory on 2026-08-15 — do not re-litigate them.

## 1. What this is

Studyroom is a small local web app that helps Gregory study for university using the materials already sitting in `~/Studyroom`. Each top-level folder there is one course (currently `AI201` — Artificial Intelligence, and `AI211` — linear algebra; more will be added each semester by simply creating folders). The app is a viewer + a per-subject Claude chat: Claude runs as the **Claude Code CLI** (`claude`) with its working directory pinned to the subject folder, so it reads the actual PDFs itself with its own Read/Grep tools — no RAG pipeline, no embeddings, no API keys.

Beyond Q&A, the app is a **digest engine**: its job is to make Gregory *really* nail the knowledge in any material he drops in, whatever kind of learner the topic demands — so every material (PDF chapter, lecture transcript, topic) can be turned into new study artifacts in multiple modes: visual explainers (diagrams, concept maps), structured notes, technically deep worked examples, flashcards, quizzes. All generation is tuned by a learner profile (§7.0). A research action extends past the course materials via web search, saved with sources.

**Guiding principles (do not violate):**

- **Nothing fancy. 100% practical.** Fewest moving parts that work. No database server, no auth, no cloud, no Docker, no build pipeline unless unavoidable.
- **The folder is the source of truth.** Adding a subject = `mkdir`. Adding materials = dropping files in. The app never requires registration steps and never modifies source materials.
- **Claude CLI, not the API.** The app shells out to `claude` (Claude Code, installed and logged in). This rides the existing Claude subscription — never introduce `ANTHROPIC_API_KEY` handling or Anthropic SDK calls.
- **Artifacts accumulate as plain files.** Everything Claude produces (summaries, quizzes, flashcards) is written into `<subject>/_generated/` as markdown, so it's portable, greppable, and becomes study material itself.
- **bot-hq is a flag reference, not an architecture.** This doc borrowed its *verified CLI invocations and stream-json parsing* — nothing else. No retry supervisors, no watchdogs, no PID reapers, no event buses, no queues. If a mechanism smells like orchestration, it doesn't belong here; the error path is "show the error, let Gregory press the button again."

## 2. Environment (verified 2026-08-15)

| Fact | Value |
|---|---|
| Machine | macOS 26.5.2, Apple M4, 24 GB RAM |
| Node | v22.14.0 (no bun) |
| Claude CLI | 2.1.233, installed and authenticated |
| poppler (`pdftoppm`/`pdftotext`) | installed 2026-08-15 (pdftoppm 26.08.0) |
| ffmpeg | installed (`/opt/homebrew/bin/ffmpeg`) |
| uv | installed; Python 3.14 present |
| mlx-whisper (local transcription) | installed 2026-08-15; `whisper-large-v3-turbo` model already downloaded |
| Claude-reads-a-PDF check | **PASSED** 2026-08-15 — quoted AI211 Chapter 1 objectives correctly |
| Reference transcript | `AI201/_generated/transcripts/Lecture_2_Intelligent_Agents.md` already exists (produced by hand-running §6.5's exact pipeline) — M4's output format must match it |
| Data dir | `~/Studyroom` (subjects: `AI201`, `AI211`); materials are PDFs (incl. one 400+ page textbook `mml-book.pdf`) plus lecture videos (`.mp4`, hundreds of MB each) |
| Git remote | `https://github.com/gregoryerrl/Studyroom.git` (private) — `~/Studyroom` is ONE repo holding everything: this doc, the materials, transcripts, `_generated/` artifacts, and the app itself. `.studyroom/` state, chat logs, `node_modules/`, and videos are gitignored. |
| App location | `~/Studyroom/app/` — built inside this same repo; there is **no** separate app repo |
| Reference codebase | `~/Projects/bot-hq` (Rust/Tauri; source of all CLI patterns below) |

**Setup prerequisites: ALL DONE as of 2026-08-15.** poppler and mlx-whisper are installed and verified, the Whisper model is downloaded, and the repo exists and is pushed. There is nothing to install or create before M0 — start building in `app/`.

Verify PDF reading works before building the chat: run `claude -p "Read the first 2 pages of 'CHAPTER 1 Systems of Linear Equations - handouts.pdf' and quote one sentence." --output-format text` from inside `~/Studyroom/AI211`. If it can't read the PDF, stop and fix that first — the whole app depends on it.

## 3. v1 scope

1. **Dashboard** — subjects auto-discovered from `$STUDYROOM_DIR`. A subject is any top-level directory whose name does not start with `.` or `_` and is not `docs` or `app`. Show per-subject file count and whether `_generated/` has content.
2. **Subject page** — **split view**: left pane holds the file list and the preview, right pane holds the chat, both always visible (read the material and talk about it simultaneously). Preview per type: PDFs via `<embed src>` (browser-native viewer), videos via `<video controls>` (Express static serves HTTP Range requests natively, so seeking works with zero extra code), markdown rendered (vendor `marked.min.js` locally, no CDN), text/code as `<pre>`, and `_generated/*.html` visual explainers in a **sandboxed iframe** (`<iframe sandbox src=…>` — CSS and inline SVG render, scripts are blocked; §7.1 forbids Claude from using JS in explainers anyway).
3. **Chats per subject (ChatGPT-style list)** — each subject holds a **list of chats**, each an independent Claude conversation with its own memory. Two kinds, both grounded in the subject folder: **general** (covers all materials) and **focused** (dedicated to one material — created from a file's "New focused chat" action; mechanically it's the same spawn with an extra system-prompt line steering it to that file, so it can still pull context from siblings). A slim chat switcher sits at the top of the chat pane: chat titles (default = first message truncated to ~40 chars, renameable inline), newest-active first, plus New chat. Every chat streams responses, shows tool activity ("Reading mml-book.pdf…"), and survives server restarts (history + per-chat session resume are persisted).
4. **Study actions** — buttons that send canned prompts (§7.2) into the same chat, every one of them tuned by the learner profile (§7.0): **Digest** (the flagship — one button turns a file/topic into a complete study kit: notes + visual explainer + worked examples + flashcards + quiz), *Summarize*, *Quiz me*, *Make flashcards*, *Explain a concept*, *Visual explainer* (a self-contained HTML page with inline SVG diagrams — for visual learning), *Research* (web-grounded, beyond the course materials, saved with source URLs). Outputs saved by Claude into `_generated/`.
5. **Transcribe** — a button on each video file. Claude cannot watch or hear video (model limitation, all current models), so the app runs **local Whisper** (§6.5) to produce a timestamped transcript in `_generated/transcripts/`; from then on the lecture is ordinary text material the chat reads, quotes, and quizzes from. Videos without a transcript show a "not transcribed yet" badge.
6. **Cancel button** — kills the running turn.

**Explicit non-goals for v1 (backlog, do not build now):** spaced-repetition review UI, flashcard flip cards, exam calendar / syllabus parsing, progress tracking, context-usage meter, parallel chats per subject, mobile, multi-user, auto-transcribe on file add (manual button only), slide/keyframe extraction from videos (ffmpeg frames → images Claude *can* read; do later if transcripts prove insufficient for slide-heavy lectures), clickable transcript timestamps that seek the video player, tests beyond the acceptance checks listed in §9.

## 4. Architecture

**Chosen approach: Node + Express + vanilla static frontend, spawn-per-turn CLI.**

Alternatives considered: (a) Vite+React frontend — nicer DX but adds a build step; not needed for ~4 screens (switching later is cheap because the frontend only talks to the HTTP API in §8); (b) long-lived `claude` processes with `--input-format stream-json` stdin, as bot-hq does — that buys warm-cache multi-turn latency and mid-turn interrupts at the cost of stdin pumps, watchdogs, and a retry supervisor. bot-hq needs that for multi-agent turn-taking; a single-user study chat does not. **Spawn one `claude -p` process per message, resume context with `--resume`.** Recommendation is (chosen); revisit only if per-turn startup latency actually annoys in practice.

```
Browser (static HTML/JS, fetch + streamed responses)
   │  HTTP :4321
   ▼
server.js (Express)
   ├─ static: frontend files + /files/<subject>/* (materials, _generated)
   ├─ REST: subjects, files, chat history
   ├─ POST chat → spawn `claude -p …` (cwd = subject dir) → parse stream-json stdout
   │       → stream text/tool events to browser → persist to chat log at turn end
   └─ state: ~/Studyroom/.studyroom/  (state.json + chats/<subject>.jsonl)
```

Suggested layout (keep it this small — everything under `app/` in this repo):

```
~/Studyroom/app/
  server/
    index.js        # express app, routes
    subjects.js     # discovery + file listing
    claude.js       # spawn/parse/cancel — the §6 code lives here
    store.js        # state.json + chat JSONL read/append
    prompts.js      # system prompt + quick-action templates (§7)
  public/           # index.html, subject.html, app.js, style.css, vendor/marked.min.js
  package.json      # deps: express only (add nothing without a reason)
```

Plus **`./start`** at the **repo root** (not inside `app/`): a small bash script that installs deps if `app/node_modules/` is missing, starts the server, and opens `http://localhost:4321` (`open` on macOS). That's Gregory's day-to-day entry point.

**Look & feel (decided — do not redesign):** light, clean, academic. Paper-like reading surfaces, generous whitespace, a readable serif for rendered content (markdown, transcripts) with the system sans for UI chrome, one restrained accent color, plain CSS — no Tailwind, no CSS framework, no dark mode in v1. Avoid generic AI-app aesthetics (purple gradients, glassmorphism, cookie-cutter card grids); this should feel like a quiet study desk, not a SaaS landing page. Dashboard is a simple subject list/grid.

## 5. Data conventions

- `$STUDYROOM_DIR` (env) — the data root; defaults to **the parent directory of `app/`** (i.e. the repo root), so the repo works wherever it's cloned. The app lives inside the data root at `app/`.
- `<root>/<Subject>/` — materials, owned by Gregory. **The app and Claude never modify or delete these.**
- `<root>/<Subject>/_generated/` — Claude's outputs, markdown files named `<type>-<topic>-<YYYY-MM-DD>.md` (e.g. `flashcards-eigenvalues-2026-08-15.md`). Claude creates this dir itself via its Write tool.
- `<root>/<Subject>/_generated/transcripts/<video-basename>.md` — app-produced (not Claude-produced) lecture transcripts, §6.5. Text, small, and **committed to git** — the durable, searchable form of the un-pushable videos.
- `<root>/<Subject>/_generated/digest-<topic>-<date>/` — a Digest action's study kit: `notes.md`, `visual.html`, `worked-examples.md`, `flashcards.md`, `quiz.md`.
- `<root>/profile.md` — the learner profile (§7.0). A top-level *file*, so subject discovery (directories only) is unaffected. Committed.
- `<root>/.studyroom/state.json` — per-chat records, nested by subject: `{ "subjects": { "AI211": { "chats": [ { "id": "<uuid>", "title": "...", "claudeSessionId": "<uuid>|null", "focus": "<relative file path>|null", "createdAt": <ms>, "updatedAt": <ms> } ] } } }`. Chat `id` = `crypto.randomUUID()`. Keep state in memory as the source of truth and persist with an atomic write (temp file + rename); never re-read the file mid-run. Server boot creates `.studyroom/` and `.studyroom/chats/` if missing.
- `<root>/.studyroom/chats/<Subject>/<chatId>.jsonl` — one JSON object per line: `{ "ts": <ms>, "kind": "user"|"assistant"|"tool_use"|"error", "text"?, "tool"? }`. UI renders history from this file. Deleting a chat moves its JSONL to `chats/<Subject>/archive/` and removes its state entry.
- **Git:** `~/Studyroom` is a git repo (remote above, private); PDFs and docs are committed. `.gitignore` covers `.DS_Store`, `.studyroom/` (machine state + private chat logs), and **video files** — lecture videos exceed GitHub's 100 MB hard per-file limit and stay local-only (Git LFS is the escape hatch if remote backup is ever needed, but its free tier won't survive a semester of lectures). The app never runs git, and Claude can't either (Bash is denied, §6.1).

## 6. Claude CLI integration — the core of the app

These patterns are lifted from bot-hq's working integration (`~/Projects/bot-hq/src/agents/spawn.rs`, `events.rs`; empirical event schema in `~/Projects/bot-hq/docs/stream-json-events.md` with raw captures in `docs/stream-json-samples/`). All flags below are in production use on this exact machine and CLI version — trust them.

### 6.1 Spawning a turn

```js
// server/claude.js
import { spawn } from "node:child_process";

export function spawnTurn({ subjectDir, prompt, systemPromptFile, resumeId }) {
  const args = [
    "-p", prompt,
    "--output-format", "stream-json",
    "--verbose",                        // REQUIRED when combining -p with stream-json output
    "--append-system-prompt-file", systemPromptFile,
    "--permission-mode", "dontAsk",     // headless: never prompt; unlisted tools are denied
    "--allowedTools", "Read Grep Glob Write Edit WebSearch WebFetch TodoWrite",
    "--disallowedTools", "Bash Task NotebookEdit",  // no shell, no subagents — deny wins over allow
  ];
  if (resumeId) args.push("--resume", resumeId);   // --resume coexists with -p; value skips the picker

  return spawn("claude", args, {
    cwd: subjectDir,       // ALWAYS pin cwd — this is what grounds Claude in the course materials.
    env: process.env,      // inherit: claude finds its own login. Never set ANTHROPIC_* vars.
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,        // own process group → cancel can kill claude AND its tool children
  });
}
```

Rules that came from bot-hq's scar tissue:

- **Always pin `cwd`, never inherit.** An unpinned cwd makes Claude adopt whatever repo/CLAUDE.md it lands in.
- **Permission posture:** `--dangerously-skip-permissions` disables deny rules entirely, so it can never enforce a tool boundary. `dontAsk` + allowlist + denylist is the only mechanical option, and it fails closed. Studyroom needs Write/Edit (for `_generated/`) but has no reason to grant Bash — so don't.
- The system prompt goes via `--append-system-prompt-file <path>` (write it to `<root>/.studyroom/<subject>-system-prompt.txt` — the same `.studyroom/` dir as §5, under the data root, not the app repo — before each spawn). The file form avoids argv-length issues and is what bot-hq uses; the inline `--append-system-prompt` also exists if ever preferred.
- One turn at a time **per chat** (in-memory busy flag per chat id; return 409 if that chat is busy). Different chats — same subject or not — may run turns in parallel; they're independent Claude sessions, and the M4/24GB machine handles several fine. (If parallel `_generated/` writes ever collide in practice, serialize per subject then — not before.)

### 6.2 Parsing stdout (newline-delimited stream-json)

```js
import readline from "node:readline";

const rl = readline.createInterface({ input: child.stdout });
rl.on("line", (raw) => {
  const line = raw.trim();
  if (!line) return;
  let ev;
  try { ev = JSON.parse(line); } catch { console.warn("bad stream-json line, skipping"); return; }
  // ^ a bad line must never kill the pump — log and skip.

  if (ev.type === "system" && ev.subtype === "init") {
    saveSessionId(subject, ev.session_id);          // THE session-continuity mechanism, see 6.3
  } else if (ev.type === "assistant") {
    for (const block of ev.message?.content ?? []) {
      if (block.type === "text")     emit({ kind: "text", text: block.text });
      if (block.type === "tool_use") emit({ kind: "tool_use", tool: block.name, input: block.input });
      // block.type === "thinking" → drop it
    }
  } else if (ev.type === "result") {
    const failed = ev.is_error || ev.api_error_status != null;  // a non-"success" subtype alone is NOT failure
    finishTurn({ failed, ev });
  }
  // other types (rate_limit_event, user/tool_result, unknown) → ignore; schema may grow, so
  // unknown event types must be silently tolerated.
});
child.stderr.on("data", (d) => console.debug(`[claude] ${d}`));  // drain stderr or the child can block
```

Event cheat-sheet (one process = one turn; events arrive in this rough order):

| stdout event | Meaning | App action |
|---|---|---|
| `system` / `subtype:"init"` | boot; carries `session_id`, `cwd`, `model` | persist `session_id` immediately |
| `assistant` (repeats) | one API call's message; `content[]` holds `text` / `tool_use` / `thinking` blocks | stream text + tool activity to browser |
| `user` (repeats) | tool results echoed back | ignore (or show for debugging) |
| `result` | turn finished; `is_error`, `api_error_status`, `subtype` | close stream, persist assistant message, release busy flag |

### 6.3 Conversation continuity

The CLI owns conversation state. **Per chat**: capture `session_id` from the `init` event → store on that chat's record in `state.json` → pass `--resume <uuid>` on that chat's next spawn. Overwrite the stored id on every init (idempotent — a resumed session reports the same id family). A brand-new chat simply has `claudeSessionId: null` and spawns without `--resume`. This survives app restarts and reboots; transcripts live under `~/.claude/projects/`.

### 6.4 Errors, retry, cancel

- **Failure:** `result.is_error || result.api_error_status != null`. Show it as an error bubble and stop. **No automatic retries** — retry policies are bot-hq supervision machinery this app doesn't need; Gregory just presses send again (the session id is already saved if `init` arrived, so nothing is lost).
- **Cancel:** `process.kill(-child.pid, "SIGKILL")` — negative pid kills the whole process group (this is why `detached: true`). Then release the busy flag. Context already accumulated is safe: the next message just `--resume`s. Also cancel when the browser aborts the streaming request (`req.on("close", …)`).
- **No wall-clock timeout on turns** — Claude legitimately spends minutes on "summarize chapter 7". The Cancel button is the timeout. (One-shot utility spawns, if any are added, should get hard 60s timeouts.)
- **Exit without `result` event** (crash): treat as error, release the busy flag, keep whatever text already streamed.
- **No shutdown reaper.** Every child runs in `-p` mode and terminates itself at the end of its single turn — if the server dies mid-turn, the worst case is one claude process quietly finishing and exiting on its own. `detached: true` exists for exactly one reason: so the Cancel button can kill the whole process group. Don't build PID registries or signal handlers.

### 6.5 Sibling pipeline: video transcription (local Whisper — Claude is not involved)

Claude has no video/audio input, so lecture videos become material via a one-time local transcription. Same spawn-and-stream machinery as §6.1/§6.2, different binary:

- **Command:** `mlx_whisper <subjectDir>/<video>.mp4 --model mlx-community/whisper-large-v3-turbo --output-dir <tmp> --output-format srt` (mlx-whisper decodes the mp4's audio itself via ffmpeg — no manual extraction step). **All flags verified against the installed CLI on 2026-08-15**, model already downloaded; runs fully offline.
- **Language:** Whisper auto-detects — lectures may be English or Filipino/Taglish (Tagalog `tl` is fully supported; Lecture 2 turned out to be English). Expose two optional request fields: `language` (ISO code, pins detection when auto-detect misfires on code-switched audio → `--language tl`) and `translate` (boolean → `--task translate`, which makes Whisper output English directly). Default: auto-detect, no translation — keep the original wording; Claude reads Taglish fine and §7.1 has it respond in English regardless.
- **Post-process:** parse the SRT (`index / HH:MM:SS,mmm --> … / text` blocks) into markdown at `_generated/transcripts/<video-basename>.md`: title line naming the source video, then paragraphs with a bold `[HH:MM:SS]` marker at least every ~30 seconds. **Collapse consecutive segments with identical text** — Whisper hallucinates repeat loops during trailing silence (observed on Lecture 2: "Thanks for today." × ~60). The existing reference transcript (§2) was produced by exactly this pipeline; match its format.
- **Concurrency:** ONE transcription at a time globally (it saturates the GPU/ANE) — global busy flag, 409 otherwise. Chat turns may run concurrently with it.
- **Progress:** stream mlx_whisper's stderr/stdout lines to the browser over the same NDJSON pattern (`{kind:"progress", line}` … `{kind:"done", path}`); on the M4 expect a fraction of the lecture's runtime.
- **Idempotent:** skip (return the existing path) if the transcript already exists; a `force: true` body field re-runs it. Cancel = kill the process group, delete partial output.
- Never modify the video; treat transcripts as append-only material once written (Claude may read them, not edit them — they're under `_generated/` but the §7.1 rules only permit Claude to *create new* files there).

## 7. Prompts

### 7.0 Learner profile — `<root>/profile.md`

A freeform markdown file where Gregory describes how he learns best (visual, technical depth, language preferences, what kinds of questions help). The server appends it to **every** system prompt under a `## How Gregory learns best` heading, so all chat answers and generated artifacts are tailored without per-request ceremony. A starter version exists at `~/Studyroom/profile.md` — Gregory edits it over time; treat a missing file as empty. This one file is the "no matter what kind of learner I am" mechanism: changing it changes how everything is generated from then on.

### 7.1 Per-subject system prompt (regenerated each spawn into `.studyroom/<subject>-system-prompt.txt`)

```
You are a study assistant for the university course "<SUBJECT_NAME>".
Your working directory is this course's materials folder. Ground every answer in
these materials; cite the source file and page number(s) you used.

Rules:
- Large PDFs (like mml-book.pdf) must be read in specific page ranges, never whole.
- When asked to produce a study artifact (summary, quiz, flashcards), write it to
  _generated/<type>-<topic>-<date>.md and say the filename in your reply.
- Never modify, rename, or delete existing files anywhere. You may only CREATE new
  files, and only inside _generated/ (not in _generated/transcripts/ — that
  directory is written by the app and is read-only to you).
- Flashcards format: repeated blocks of "Q: ..." / "A: ..." separated by blank lines.
- Quiz format: numbered questions, then an "## Answers" section at the end.
- Keep explanations at the level of a student preparing for exams: worked examples
  over abstract prose.
- Video files (.mp4) cannot be opened directly. Lecture transcripts live in
  _generated/transcripts/ — read those when asked about a lecture, and cite the
  [HH:MM:SS] timestamps. If a lecture has no transcript yet, say so and suggest
  pressing Transcribe on it in the app.
- Visual explainers: a single self-contained .html file — inline CSS and inline
  SVG only. No JavaScript, no external resources (no CDN scripts, fonts, or
  remote images). Diagram relationships spatially; minimal prose.
- Materials may be in English or Filipino/Taglish. Respond and generate
  artifacts in English unless asked otherwise; quote original wording when
  precision matters.
```

After these rules the server appends `## How Gregory learns best` + the contents of `<root>/profile.md` (§7.0). For a **focused chat** (§3.3) it also appends: `This chat is dedicated to "<focus file>". Ground your answers primarily in that file; treat the other materials as supporting context.`

`<SUBJECT_NAME>` is the folder name; if a syllabus PDF exists, mention it: "The file <name> is the course syllabus."

### 7.2 Quick actions (client-side prompt templates sent as normal chat messages)

- **Summarize:** `Summarize "<file>"<, pages X–Y if PDF over ~30 pages>. Save to _generated/ and give me the key points inline.`
- **Quiz me:** `Create a 10-question quiz (mix of multiple choice and short answer) on <topic or file>. Save to _generated/. Show me the questions only; I'll answer here in chat, then you grade me against the key.`
- **Flashcards:** `Create ~20 flashcards on <topic or file> in the Q:/A: format. Save to _generated/ and show them inline.`
- **Explain:** `Explain <concept> as if preparing me for an exam: definition, intuition, one worked example from the course materials, common pitfalls. Cite where in the materials it's covered.`
- **Digest (flagship):** `Create a complete study kit for <file or topic> in _generated/digest-<topic>-<date>/ with these files: notes.md (structured summary of the material), visual.html (self-contained visual explainer per the rules: concept map of how the ideas relate, diagrams of the key mechanisms), worked-examples.md (step-by-step solved problems with the reasoning spelled out), flashcards.md (Q:/A: format), quiz.md (questions + "## Answers"). Ground everything in the actual material and tailor it to my learner profile. When done, list each file with a one-line description.`
- **Visual explainer:** `Create a self-contained visual explainer for <topic> at _generated/visual-<topic>-<date>.html. Inline CSS + inline SVG only, no JavaScript. Show the structure spatially: concept maps, flow diagrams, labeled figures. Text only where a diagram can't carry it.`
- **Research:** `Research <question> using web search. Cross-reference what you find with the course materials where relevant, and note agreements or differences. Save a note to _generated/research-<topic>-<date>.md with a "## Sources" section listing every URL used. Give me the key findings inline.`

**Targeting (how `<file>`/`<topic>` get filled):** clicking a file in the left pane selects it as the action context — file-scoped actions (Summarize, file-level Digest, Flashcards on a file) use the selected file. Topic-scoped actions (Explain, Research, topic-level Digest) show a single-line text input inline. No modals, no multi-step wizards. Actions always send into the **currently active chat**; in a focused chat, the focus file is the default action context.

The quiz flow deliberately stays inside the chat (Claude grades follow-up answers via `--resume` context) — no dedicated quiz engine in v1.

## 8. HTTP API

| Route | Method | Behavior |
|---|---|---|
| `/api/subjects` | GET | discovered subjects with file counts |
| `/api/subjects/:s/files` | GET | `{ materials: [...], generated: [...] }` (relative path, size, mtime) — **recursive** within the subject, so materials can be organized into subfolders (e.g. `AI201/videos/`); UI groups by subfolder |
| `/files/:s/*` | GET | raw file serve for previews (path-traversal-safe: resolve + verify inside subject dir) |
| `/api/subjects/:s/chats` | GET | list the subject's chats (id, title, focus, updatedAt), newest-updated first |
| `/api/subjects/:s/chats` | POST | body `{ focus? }` (relative file path or omitted for general); creates a chat, returns its record |
| `/api/subjects/:s/chats/:id` | GET | that chat's history (parsed JSONL) |
| `/api/subjects/:s/chats/:id` | PATCH | body `{ title }` — rename |
| `/api/subjects/:s/chats/:id` | DELETE | archive the JSONL (per §5) and remove the chat; 409 if that chat is busy |
| `/api/subjects/:s/chats/:id/messages` | POST | body `{ message }`; responds with plain **NDJSON** (`Content-Type: application/x-ndjson`): one JSON object per line, `{kind:"text"|"tool_use"|"done"|"error", ...}`. This is NOT SSE — no `data:` prefixes, no blank-line framing; the client splits on `\n`. Browser reads it via `fetch` + `ReadableStream` (POST can't use EventSource). Client abort = cancel. 409 if that chat is busy. |
| `/api/subjects/:s/chats/:id/cancel` | POST | kill that chat's running turn (process group) |
| `/api/subjects/:s/transcribe` | POST | body `{ file, force?, language?, translate? }` (§6.5 language options); runs §6.5, responds with the same NDJSON progress stream (`progress`/`done`/`error`). 409 if any transcription is already running (global, not per-subject). Client abort = cancel + partial-output cleanup. |

Bind to `127.0.0.1:4321` only. JSONL persistence timing: the user message when the POST arrives; `tool_use` lines as they stream; at `result`, one assistant line with all text blocks concatenated in arrival order. History must survive a mid-turn crash with at least the user side intact.

## 9. Build plan (execute in order; each milestone is independently verifiable)

**M0 — Scaffold + discovery.** Prereqs are already done (§2). Create `docs/DECISIONS.md` (§0). Scaffold everything under `app/`: Express server, subject discovery, file listing, static file serve, `.studyroom/` + `chats/` created at boot, bare dashboard page, and the root `./start` script (§4). `node_modules/` is already gitignored.
*Accept:* (1) `./start` from the repo root brings the app up and opens the browser; (2) `curl localhost:4321/api/subjects` lists AI201 + AI211 and ignores `docs/`, `app/`, dotfolders; (3) a PDF opens in the browser via `/files/AI211/...`; (4) **the §2 claude-reads-a-PDF one-liner passes from inside `AI211/`** (it passed 2026-08-15 — re-run to confirm nothing drifted); M0 is not done until all four pass.

**M1 — Subject page + previews.** File list UI, PDF embed, video player, markdown rendering, `_generated/` section (empty state fine — and treat a *missing* `_generated/` dir as empty rather than erroring; it doesn't exist until Claude first writes to it).
*Accept:* can open `mml-book.pdf`, play a lecture `.mp4` with seeking, and view a rendered markdown file from the UI.

**M2 — Chats.** §6 in full plus the chat list: chat CRUD (create general/focused, rename, delete, switcher UI), spawn, stream to browser, per-chat session persistence, resume, cancel, error bubbles, per-chat JSONL history.
*Accept:* (1) ask "what files do you have?" → Claude lists the actual PDFs; (2) ask a follow-up referencing the first answer, **restart the server between the two messages** → Claude still has context (proves the per-chat `--resume` path); (3) ask it to quote from a PDF page (proves poppler); (4) Cancel mid-turn leaves the app responsive and the next message works; (5) **two chats in the same subject hold independent contexts** — tell chat A one fact, confirm chat B doesn't know it, and both survive a server restart; (6) a chat focused on `mml-book.pdf` answers a generic question by grounding in that book specifically.
*If claude errors immediately:* run the same command by hand in a terminal (print the exact spawned argv in server logs at debug level) — flag typos and permission-mode issues show up instantly there. *If the resume check (2) fails:* confirm `state.json` actually holds a uuid after the first turn and that the logged argv of the second turn contains `--resume <that uuid>`.

**M3 — Study actions + generated artifacts.** §7.0 profile loading, all §7.2 buttons, `_generated/` listing refreshes after a turn completes, HTML explainers render in the sandboxed iframe.
*Accept:* (1) "Make flashcards on eigenvalues" produces a `Q:/A:` file in `AI211/_generated/` that renders in the file view; (2) the Digest action on AI211 Chapter 7 produces the full kit folder including a `visual.html` that displays diagrams in the iframe; (3) a Research action produces a note with a `## Sources` section of URLs (proves WebSearch works under the §6.1 permission flags); (4) editing `profile.md` visibly changes the style of the next generation.

**M4 — Video transcription.** mlx-whisper is already installed, flags verified, model downloaded (§2, §11) — and a reference transcript from this exact pipeline already exists; match its format. §6.5 in full: Transcribe button + badge, progress stream, SRT→markdown with dedupe, global single-job lock.
*Accept:* (1) transcribing `AI201/Lecture_2_Intelligent_Agents.mp4` (the shorter one) produces `_generated/transcripts/Lecture_2_Intelligent_Agents.md` with `[HH:MM:SS]` markers; (2) asking the AI201 chat "what did Lecture 2 cover? quote it with timestamps" gets an answer quoting the transcript; (3) starting a second transcription while one runs returns 409.

**M5 (optional polish) — Flashcard renderer.** Parse `Q:/A:` markdown into click-to-reveal cards on the subject page. No scheduling logic.

## 10. Kicking this off with bot-hq

1. Prerequisites are all done (§2) — nothing to install or create.
2. Open a bot-hq session with working directory `~/Studyroom` (this repo).
3. First message: *"Read docs/plans/2026-08-15-studyroom-app-design.md and implement M0 exactly as specified — build the app inside app/. Stop after M0 acceptance checks pass."* Then proceed milestone by milestone.
4. This doc lives in the same repo as the code — keep it updated and committed as decisions change during the build.

## 11. Verified vs. verify-before-relying

**Verified** (in production in bot-hq on this machine/CLI): `-p`, `--output-format stream-json`, `--verbose` (required with `-p` + stream-json), `--append-system-prompt-file`, `--resume <uuid>` (with `-p`), `--permission-mode dontAsk`, `--allowedTools` / `--disallowedTools` (space-separated single arg; deny beats allow), `--dangerously-skip-permissions` (don't use here), `--mcp-config` + `--strict-mcp-config` (not needed in v1), stream-json event shapes in §6.2, `system/init.session_id` capture, `result.is_error`/`api_error_status` semantics, process-group kill.

**Not verified — check `claude --help` before using:** `--include-partial-messages` (would give token-level streaming instead of per-message chunks; nice-to-have), `--session-id` (bot-hq deliberately doesn't use it), `--model` flag vs `ANTHROPIC_MODEL` env (v1 needs neither — default model is fine).

**mlx-whisper: fully verified 2026-08-15.** All §6.5 flags confirmed against the installed CLI (`--model`, `--output-dir`, `--output-format srt`, `--language`, `--task translate`); it accepts the `.mp4` directly; the whole pipeline was run by hand on `Lecture_2_Intelligent_Agents.mp4`, producing the reference transcript named in §2 (62 min of clean English; the only defect was the trailing-silence repeat loop that §6.5's dedupe rule handles). Fallback if it ever breaks: `brew install whisper-cpp` + ggml model + `ffmpeg -i in.mp4 -ar 16000 -ac 1 out.wav` extraction, same post-processing.

**Deep-dive pointers into bot-hq** (for the builder, if something behaves oddly): spawn flags `src/agents/spawn.rs:1220-1452`; stream parsing `src/agents/events.rs:12-163`; resume capture/replay `src/core/duo.rs:934-950` + `src/core/session.rs:1572`; event schema notes `docs/stream-json-events.md`; permission rationale `src/agents/spawn.rs:1278-1346`. Do **not** copy bot-hq's context-meter, sequencer, or supervisor code — out of scope per §3.
