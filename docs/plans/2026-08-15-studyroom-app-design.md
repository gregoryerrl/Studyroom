# Studyroom — Design Doc

**Date:** 2026-08-15
**For:** the bot-hq agent (or any Claude session) that will build this app. Read this whole file before writing code.
**Status:** approved starting point. Owner: Gregory (gregoryerrl).

## 1. What this is

Studyroom is a small local web app that helps Gregory study for university using the materials already sitting in `~/Studyroom`. Each top-level folder there is one course (currently `AI201` — Artificial Intelligence, and `AI211` — linear algebra; more will be added each semester by simply creating folders). The app is a viewer + a per-subject Claude chat: Claude runs as the **Claude Code CLI** (`claude`) with its working directory pinned to the subject folder, so it reads the actual PDFs itself with its own Read/Grep tools — no RAG pipeline, no embeddings, no API keys.

**Guiding principles (do not violate):**

- **Nothing fancy. 100% practical.** Fewest moving parts that work. No database server, no auth, no cloud, no Docker, no build pipeline unless unavoidable.
- **The folder is the source of truth.** Adding a subject = `mkdir`. Adding materials = dropping files in. The app never requires registration steps and never modifies source materials.
- **Claude CLI, not the API.** The app shells out to `claude` (Claude Code, installed and logged in). This rides the existing Claude subscription — never introduce `ANTHROPIC_API_KEY` handling or Anthropic SDK calls.
- **Artifacts accumulate as plain files.** Everything Claude produces (summaries, quizzes, flashcards) is written into `<subject>/_generated/` as markdown, so it's portable, greppable, and becomes study material itself.

## 2. Environment (verified 2026-08-15)

| Fact | Value |
|---|---|
| Machine | macOS 26.5.2, Apple M4, 24 GB RAM |
| Node | v22.14.0 (no bun) |
| Claude CLI | 2.1.233, installed and authenticated |
| poppler (`pdftoppm`/`pdftotext`) | **MISSING — must install** |
| Data dir | `~/Studyroom` (subjects: `AI201`, `AI211`); materials are PDFs (incl. one 400+ page textbook `mml-book.pdf`) plus lecture videos (`.mp4`, hundreds of MB each) |
| Data-dir git remote | `https://github.com/gregoryerrl/Studyroom.git` — `~/Studyroom` is a git repo tracking this doc (and whatever Gregory chooses to add: materials, `_generated/`). `.studyroom/` state and chat logs are gitignored. |
| App repo (to create) | `~/Projects/studyroom` |
| Reference codebase | `~/Projects/bot-hq` (Rust/Tauri; source of all CLI patterns below) |

**Setup prerequisites (M0, before anything else):**

```sh
brew install poppler   # Claude Code renders PDF pages via pdftoppm; without this it cannot read the course PDFs
mkdir -p ~/Projects/studyroom && cd ~/Projects/studyroom && git init
```

Verify PDF reading works before building the chat: run `claude -p "Read the first 2 pages of 'CHAPTER 1 Systems of Linear Equations - handouts.pdf' and quote one sentence." --output-format text` from inside `~/Studyroom/AI211`. If it can't read the PDF, stop and fix that first — the whole app depends on it.

## 3. v1 scope

1. **Dashboard** — subjects auto-discovered from `$STUDYROOM_DIR` (default `~/Studyroom`). A subject is any top-level directory whose name does not start with `.` or `_` and is not `docs`. Show per-subject file count and whether `_generated/` has content.
2. **Subject page** — file list (materials + `_generated/` in its own section) with in-browser preview: PDFs via `<embed src>` (browser-native viewer), videos via `<video controls>` (Express static serves HTTP Range requests natively, so seeking works with zero extra code), markdown rendered (vendor `marked.min.js` locally, no CDN), text/code as `<pre>`.
3. **Chat per subject** — a conversation with Claude grounded in that subject's folder. Streams responses, shows tool activity ("Reading mml-book.pdf…"), survives server restarts (history + session resume are persisted).
4. **Quick actions** — buttons that send a canned prompt into the same chat: *Summarize a file*, *Quiz me*, *Make flashcards*, *Explain a concept*. Outputs saved by Claude into `_generated/`.
5. **Cancel button** — kills the running turn.

**Explicit non-goals for v1 (backlog, do not build now):** spaced-repetition review UI, flashcard flip cards, exam calendar / syllabus parsing, progress tracking, context-usage meter, parallel chats per subject, mobile, multi-user, tests beyond the acceptance checks listed in §9.

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

Suggested repo layout (keep it this small):

```
~/Projects/studyroom/
  server/
    index.js        # express app, routes
    subjects.js     # discovery + file listing
    claude.js       # spawn/parse/cancel — the §6 code lives here
    store.js        # state.json + chat JSONL read/append
    prompts.js      # system prompt + quick-action templates (§7)
  public/           # index.html, subject.html, app.js, style.css, vendor/marked.min.js
  package.json      # deps: express only (add nothing without a reason)
```

## 5. Data conventions

- `$STUDYROOM_DIR` (env, default `~/Studyroom`) — the data root. The app repo lives elsewhere (`~/Projects/studyroom`).
- `<root>/<Subject>/` — materials, owned by Gregory. **The app and Claude never modify or delete these.**
- `<root>/<Subject>/_generated/` — Claude's outputs, markdown files named `<type>-<topic>-<YYYY-MM-DD>.md` (e.g. `flashcards-eigenvalues-2026-08-15.md`). Claude creates this dir itself via its Write tool.
- `<root>/.studyroom/state.json` — `{ "subjects": { "AI211": { "claudeSessionId": "<uuid>" } } }`. Keep state in memory as the source of truth and persist with an atomic write (temp file + rename); never re-read the file mid-run. Node's single thread plus per-subject keys make parallel turns across subjects safe. Server boot creates `.studyroom/` and `.studyroom/chats/` if missing.
- `<root>/.studyroom/chats/<Subject>.jsonl` — one JSON object per line: `{ "ts": <ms>, "kind": "user"|"assistant"|"tool_use"|"error", "text"?, "tool"? }`. UI renders history from this file; "New chat" archives it to `<Subject>-<timestamp>.jsonl` and clears the session id.
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
- One turn at a time per subject (in-memory busy flag per subject; return 409 if busy). Turns in *different* subjects may run in parallel — the M4/24GB machine handles several fine.

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

The CLI owns conversation state. Per subject: capture `session_id` from the `init` event → store in `state.json` → pass `--resume <uuid>` on the next spawn. Overwrite the stored id on every init (idempotent — a resumed session reports the same id family). "New chat" = clear the stored id. This survives app restarts and reboots; transcripts live under `~/.claude/projects/`.

### 6.4 Errors, retry, cancel

- **Failure:** `result.is_error || result.api_error_status != null`. Transient HTTP statuses worth ONE automatic retry (2s delay): `408 425 429 500 502 503 504 529`. A retry is a fresh spawn with identical argv — but re-read the stored session id first, since an `init` event may have landed before the failure. If the retry also fails, treat it as permanent. Everything else (400/401/403/404/413/422) is permanent immediately — surface it in the chat as an error bubble.
- **Cancel:** `process.kill(-child.pid, "SIGKILL")` — negative pid kills the whole process group (this is why `detached: true`). Then release the busy flag. Context already accumulated is safe: the next message just `--resume`s. Also cancel when the browser aborts the streaming request (`req.on("close", …)`).
- **No wall-clock timeout on turns** — Claude legitimately spends minutes on "summarize chapter 7". The Cancel button is the timeout. (One-shot utility spawns, if any are added, should get hard 60s timeouts.)
- **Exit without `result` event** (crash): treat as error, release the busy flag, keep whatever text already streamed.

## 7. Prompts

### 7.1 Per-subject system prompt (regenerated each spawn into `.studyroom/<subject>-system-prompt.txt`)

```
You are a study assistant for the university course "<SUBJECT_NAME>".
Your working directory is this course's materials folder. Ground every answer in
these materials; cite the source file and page number(s) you used.

Rules:
- Large PDFs (like mml-book.pdf) must be read in specific page ranges, never whole.
- When asked to produce a study artifact (summary, quiz, flashcards), write it to
  _generated/<type>-<topic>-<date>.md and say the filename in your reply.
- Never modify, rename, or delete any file outside _generated/.
- Flashcards format: repeated blocks of "Q: ..." / "A: ..." separated by blank lines.
- Quiz format: numbered questions, then an "## Answers" section at the end.
- Keep explanations at the level of a student preparing for exams: worked examples
  over abstract prose.
- You cannot open video files (.mp4). If asked about a lecture video, say so and
  answer from the PDFs and notes instead.
```

`<SUBJECT_NAME>` is the folder name; if a syllabus PDF exists, mention it: "The file <name> is the course syllabus."

### 7.2 Quick actions (client-side prompt templates sent as normal chat messages)

- **Summarize:** `Summarize "<file>"<, pages X–Y if PDF over ~30 pages>. Save to _generated/ and give me the key points inline.`
- **Quiz me:** `Create a 10-question quiz (mix of multiple choice and short answer) on <topic or file>. Save to _generated/. Show me the questions only; I'll answer here in chat, then you grade me against the key.`
- **Flashcards:** `Create ~20 flashcards on <topic or file> in the Q:/A: format. Save to _generated/ and show them inline.`
- **Explain:** `Explain <concept> as if preparing me for an exam: definition, intuition, one worked example from the course materials, common pitfalls. Cite where in the materials it's covered.`

The quiz flow deliberately stays inside the chat (Claude grades follow-up answers via `--resume` context) — no dedicated quiz engine in v1.

## 8. HTTP API

| Route | Method | Behavior |
|---|---|---|
| `/api/subjects` | GET | discovered subjects with file counts |
| `/api/subjects/:s/files` | GET | `{ materials: [...], generated: [...] }` (name, size, mtime) |
| `/files/:s/*` | GET | raw file serve for previews (path-traversal-safe: resolve + verify inside subject dir) |
| `/api/subjects/:s/chat` | GET | chat history (parsed JSONL) |
| `/api/subjects/:s/chat` | POST | body `{ message }`; responds with plain **NDJSON** (`Content-Type: application/x-ndjson`): one JSON object per line, `{kind:"text"|"tool_use"|"done"|"error", ...}`. This is NOT SSE — no `data:` prefixes, no blank-line framing; the client splits on `\n`. Browser reads it via `fetch` + `ReadableStream` (POST can't use EventSource). Client abort = cancel. 409 if subject busy. |
| `/api/subjects/:s/chat/reset` | POST | archive JSONL, clear session id; 409 if subject busy (same flag as chat) |
| `/api/subjects/:s/cancel` | POST | kill the running turn's process group |

Bind to `127.0.0.1:4321` only. JSONL persistence timing: the user message when the POST arrives; `tool_use` lines as they stream; at `result`, one assistant line with all text blocks concatenated in arrival order. History must survive a mid-turn crash with at least the user side intact.

## 9. Build plan (execute in order; each milestone is independently verifiable)

**M0 — Scaffold + discovery.** Prereqs from §2 (poppler!, git init). Express server, subject discovery, file listing, static file serve, `.studyroom/` + `chats/` created at boot, bare dashboard page.
*Accept:* (1) `curl localhost:4321/api/subjects` lists AI201 + AI211 and ignores `docs/`, dotfolders; (2) a PDF opens in the browser via `/files/AI211/...`; (3) **the §2 claude-reads-a-PDF one-liner passes from inside `AI211/`** — this proves poppler before any chat code exists; M0 is not done until it passes.

**M1 — Subject page + previews.** File list UI, PDF embed, video player, markdown rendering, `_generated/` section (empty state fine — and treat a *missing* `_generated/` dir as empty rather than erroring; it doesn't exist until Claude first writes to it).
*Accept:* can open `mml-book.pdf`, play a lecture `.mp4` with seeking, and view a rendered markdown file from the UI.

**M2 — Chat.** §6 in full: spawn, stream to browser, session persistence, resume, cancel, error bubbles, JSONL history.
*Accept:* (1) ask "what files do you have?" → Claude lists the actual PDFs; (2) ask a follow-up referencing the first answer, **restart the server between the two messages** → Claude still has context (proves `--resume` path); (3) ask it to quote from a PDF page (proves poppler); (4) Cancel mid-turn leaves the app responsive and the next message works.
*If claude errors immediately:* run the same command by hand in a terminal (print the exact spawned argv in server logs at debug level) — flag typos and permission-mode issues show up instantly there. *If the resume check (2) fails:* confirm `state.json` actually holds a uuid after the first turn and that the logged argv of the second turn contains `--resume <that uuid>`.

**M3 — Quick actions + generated artifacts.** §7.2 buttons, `_generated/` listing refreshes after a turn completes.
*Accept:* "Make flashcards on eigenvalues" produces a `Q:/A:` file in `AI211/_generated/` that renders in the file view.

**M4 (optional polish) — Flashcard renderer.** Parse `Q:/A:` markdown into click-to-reveal cards on the subject page. No scheduling logic.

## 10. Kicking this off with bot-hq

1. Do §2 prerequisites (poppler, `git init ~/Projects/studyroom`).
2. Open a bot-hq session with working directory `~/Projects/studyroom`.
3. First message: *"Read ~/Studyroom/docs/plans/2026-08-15-studyroom-app-design.md and implement M0 exactly as specified. Stop after M0 acceptance checks pass."* Then proceed milestone by milestone.
4. Copy this doc into the app repo (`docs/DESIGN.md`) at M0 so the project is self-describing. The canonical, evolving copy stays here in the Studyroom repo (`github.com/gregoryerrl/Studyroom`) — commit doc changes there as decisions change.

## 11. Verified vs. verify-before-relying

**Verified** (in production in bot-hq on this machine/CLI): `-p`, `--output-format stream-json`, `--verbose` (required with `-p` + stream-json), `--append-system-prompt-file`, `--resume <uuid>` (with `-p`), `--permission-mode dontAsk`, `--allowedTools` / `--disallowedTools` (space-separated single arg; deny beats allow), `--dangerously-skip-permissions` (don't use here), `--mcp-config` + `--strict-mcp-config` (not needed in v1), stream-json event shapes in §6.2, `system/init.session_id` capture, `result.is_error`/`api_error_status` semantics, process-group kill.

**Not verified — check `claude --help` before using:** `--include-partial-messages` (would give token-level streaming instead of per-message chunks; nice-to-have), `--session-id` (bot-hq deliberately doesn't use it), `--model` flag vs `ANTHROPIC_MODEL` env (v1 needs neither — default model is fine).

**Deep-dive pointers into bot-hq** (for the builder, if something behaves oddly): spawn flags `src/agents/spawn.rs:1220-1452`; stream parsing `src/agents/events.rs:12-163`; resume capture/replay `src/core/duo.rs:934-950` + `src/core/session.rs:1572`; event schema notes `docs/stream-json-events.md`; permission rationale `src/agents/spawn.rs:1278-1346`. Do **not** copy bot-hq's context-meter, sequencer, or supervisor code — out of scope per §3.
