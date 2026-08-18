// Claude Code CLI integration (design doc §6): spawn one `claude -p` per turn, parse the
// newline-delimited stream-json on stdout, resume context with --resume. No retries, no
// timeouts, no reapers — the Cancel button is the timeout, the error bubble is the recovery.
import readline from "node:readline";
import path from "node:path";
import { spawnCommand, killTree } from "./platform.js";

const ALLOWED_TOOLS = "Read Grep Glob Write Edit WebSearch WebFetch TodoWrite";
const DENIED_TOOLS = "Bash Task NotebookEdit"; // deny wins over allow: no shell, no subagents

/**
 * Environment for a spawned turn: the user's own env (so claude finds its own login; ANTHROPIC_* is
 * never set here) MINUS anything a parent Claude Code harness injected — CLAUDECODE,
 * CLAUDE_CODE_SESSION_ID, CLAUDE_CODE_MAX_OUTPUT_TOKENS, CLAUDE_CODE_EXECPATH, … — so the app behaves
 * the same whether `./start` ran from a plain terminal or from inside another Claude Code session
 * (CLAUDE_CONFIG_DIR is the user's own setting and is kept). One knob is ADDED: Claude Code's
 * auto-memory is keyed by the git ROOT (~/Studyroom), so without it every study chat would share notes
 * with each other AND with coding sessions on this repo — verified 2026-08-15 (a "remember this" in
 * chat A surfaced in chat B via ~/.claude/projects/-Users-gregoryerrl-Studyroom/memory/).
 */
function childEnv() {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (/^(CLAUDECODE|CLAUDE_CODE_|CLAUDE_)/.test(key) && key !== "CLAUDE_CONFIG_DIR") continue;
    env[key] = value;
  }
  env.CLAUDE_CODE_DISABLE_AUTO_MEMORY = "1";
  return env;
}

/**
 * Run one turn. `on` handlers:
 *   init(sessionId)            — the CLI's session id (persist it; --resume it next time)
 *   delta(text)                — token-level text as it streams (display only)
 *   text(text)                 — a completed text block (authoritative; persist these)
 *   toolUse(name, input)       — Claude called a tool
 *   result({ failed, message }) — turn finished (exactly once, also on crash/cancel)
 * Returns { cancel() } which kills the whole process group.
 */
export function runTurn({ subjectDir, prompt, systemPromptFile, resumeId, model, effort }, on) {
  const args = [
    "-p", // the prompt itself goes in on stdin, not argv — see the spawn below
    "--output-format", "stream-json",
    "--verbose", // REQUIRED when combining -p with stream-json output
    "--include-partial-messages", // token-level deltas (verified on 2.1.233); full blocks still follow
    "--append-system-prompt-file", systemPromptFile,
    "--permission-mode", "dontAsk", // headless: never prompt; unlisted tools are denied
    "--allowedTools", ALLOWED_TOOLS,
    "--disallowedTools", DENIED_TOOLS,
  ];
  // Unset → nothing appended, so a chat left on "inherit" spawns exactly as it did before this
  // existed. Never ANTHROPIC_* (§6.1) — these are spawn flags, so the user's shell stays untouched.
  if (model) args.push("--model", model);
  if (effort) args.push("--effort", effort);
  if (resumeId) args.push("--resume", resumeId);
  console.debug(`[claude] spawn (cwd=${subjectDir}) claude ${args.join(" ")} <stdin ${JSON.stringify(prompt.slice(0, 60))}`);

  let child;
  try {
    // The prompt arrives on STDIN rather than as an argv element (verified 2026-08-18: `claude -p`
    // reads it there). On Windows an npm-installed `claude` is a .cmd shim, which can only be
    // spawned through cmd.exe — and cmd.exe re-parses the command line, so putting arbitrary user
    // text (quotes, &, newlines) on it is a liability. It also sidesteps the ~32k command-line
    // ceiling there. spawnCommand sets its own detached/windowsHide per platform.
    child = spawnCommand("claude", args, {
      cwd: subjectDir, // ALWAYS pin cwd — this grounds Claude in the course materials
      env: childEnv(),
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch (err) {
    // Not installed / not on PATH. Reported through the normal result path so this function's
    // contract holds: it always returns { cancel } and always emits exactly one result. The
    // microtask matters — a synchronous result would land before the caller has stored the handle.
    queueMicrotask(() => on.result({ failed: true, message: err.message }));
    return { cancel() {} };
  }
  // A child that dies before reading turns this write into EPIPE, and an unhandled EPIPE on a
  // stream takes the whole server down.
  child.stdin.on("error", () => {});
  child.stdin.end(prompt);

  let done = false;
  let stderrTail = "";
  const finish = (r) => {
    if (done) return;
    done = true;
    on.result(r);
  };

  const rl = readline.createInterface({ input: child.stdout });
  rl.on("line", (raw) => {
    const line = raw.trim();
    if (!line) return;
    let ev;
    try {
      ev = JSON.parse(line);
    } catch {
      console.warn("[claude] bad stream-json line, skipping");
      return; // a bad line must never kill the pump
    }
    if (ev.type === "system" && ev.subtype === "init") {
      // init reports the model actually in use — surfaced to the UI so the dropdown can never
      // claim a model the turn isn't running. NOTE: init carries no effort field, so the effort
      // setting cannot be confirmed the same way; the UI labels it "requested" for that reason.
      if (ev.session_id) on.init(ev.session_id, ev.model ?? null);
    } else if (ev.type === "assistant") {
      for (const block of ev.message?.content ?? []) {
        if (block.type === "text") on.text(block.text);
        else if (block.type === "tool_use") on.toolUse(block.name, block.input ?? {});
        // thinking blocks are dropped
      }
    } else if (ev.type === "stream_event") {
      const e = ev.event;
      if (e?.type === "content_block_delta" && e.delta?.type === "text_delta" && e.delta.text) on.delta(e.delta.text);
    } else if (ev.type === "result") {
      const failed = Boolean(ev.is_error) || ev.api_error_status != null; // a non-"success" subtype alone is NOT failure
      const message = failed ? (typeof ev.result === "string" && ev.result ? ev.result : `Claude reported an error (${ev.subtype ?? "unknown"})`) : null;
      finish({ failed, message });
    }
    // other types (user/tool_result, rate_limit_event, system/hook_*, unknown) → ignore
  });

  child.stderr.on("data", (d) => {
    stderrTail = (stderrTail + d).slice(-2000); // drain stderr (or the child can block); keep the tail for error text
  });
  child.on("error", (err) => {
    finish({ failed: true, message: `Could not start claude: ${err.message}` });
  });
  child.on("close", (code, signal) => {
    if (done) return;
    // Exit without a result event: crash or kill. Treat as error; text already streamed is kept by the caller.
    const why = signal ? `killed (${signal})` : `exited with code ${code}`;
    const tail = stderrTail.trim() ? `\n${stderrTail.trim().split("\n").slice(-3).join("\n")}` : "";
    finish({ failed: true, message: `claude ${why} before finishing the turn.${tail}` });
  });

  return {
    cancel() {
      killTree(child); // the whole process group off Windows, taskkill /T on it
    },
  };
}

/** Short human label for a tool call, shown as chat activity ("Reading mml-book.pdf (pages 40–60)"). */
export function toolLabel(name, input = {}) {
  const base = (p) => (typeof p === "string" && p ? path.basename(p) : "");
  switch (name) {
    case "Read": {
      const pages = input.pages ? ` (pages ${input.pages})` : input.offset ? ` (from line ${input.offset})` : "";
      return `Reading ${base(input.file_path) || "a file"}${pages}`;
    }
    case "Grep": return `Searching for “${input.pattern ?? ""}”${input.path ? ` in ${base(input.path)}` : ""}`;
    case "Glob": return `Listing ${input.pattern ?? "files"}`;
    case "Write": return `Writing ${base(input.file_path) || "a file"}`;
    case "Edit": return `Editing ${base(input.file_path) || "a file"}`;
    case "WebSearch": return `Searching the web: ${input.query ?? ""}`;
    case "WebFetch": {
      let host = "";
      try { host = new URL(input.url).host; } catch { /* ignore */ }
      return `Fetching ${host || "a page"}`;
    }
    case "TodoWrite": return "Planning the steps";
    default: return `Using ${name}`;
  }
}
