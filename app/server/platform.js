// Every OS-specific branch in the server lives HERE, so `claude.js`, `transcribe.js` and the
// launcher stay one code path each. Three facts shape the file, all of them Windows facts:
//
//  1. A PATH lookup must try PATHEXT — `claude` on Windows is `claude.exe` (native installer) or
//     `claude.cmd` (npm), and neither is found by asking for the bare name.
//  2. Node REFUSES to spawn a `.cmd`/`.bat` directly: EINVAL, the CVE-2024-27980 mitigation
//     (Node 18.20.2/20.12.2/21.7.3 and later). Those need a shell.
//  3. Once a shell is involved Node applies NO quoting — `normalizeSpawnArguments` joins
//     [file, ...args] with spaces — so a single argv element containing spaces SPLITS. That would
//     silently turn `--disallowedTools "Bash Task NotebookEdit"` into `--disallowedTools Bash`
//     plus two stray words, i.e. Task and NotebookEdit stop being denied and the app's only
//     sandbox quietly stops existing. So we never pass `shell: true`; we build the command line.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const IS_WINDOWS = process.platform === "win32";

/** cmd.exe treats all of these as token separators or operators, so anything holding one is quoted. */
const NEEDS_QUOTES = /[\s"&|<>^()%!,;=]/;

/**
 * Quote one argument for a cmd.exe command line. Windows filenames cannot contain `"`, so there is
 * no escape hole — the doubling is belt-and-braces for a value that came from somewhere else.
 * KNOWN LIMIT: cmd.exe expands %VAR% even inside double quotes, so a data root whose path contains
 * a percent sign would break. Pathological, and it fails loudly (the path simply won't exist).
 */
export function quoteWin(arg) {
  const s = String(arg);
  return NEEDS_QUOTES.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function isExecutableFile(p) {
  try {
    if (!fs.statSync(p).isFile()) return false;
    if (IS_WINDOWS) return true; // Windows has no x-bit; PATHEXT already decided what is runnable
    fs.accessSync(p, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Absolute path of `name` on PATH, or null. A name that already contains a separator is treated as
 * a path and only checked. On Windows every PATHEXT suffix is tried, and PATH entries may be
 * quoted (`"C:\Program Files\..."`), which `path.join` would otherwise carry into the candidate.
 *
 * The bare name is tried LAST on Windows, and only when it already carries a PATHEXT suffix.
 * Trying it first found the extensionless bash script the Node installer ships for cygwin
 * (`nodejs\npm`, no suffix) in preference to the `npm.cmd` beside it. Windows cannot execute
 * that file, so the launcher's very first step on a fresh clone died with ENOENT (measured
 * 2026-08-20). cmd.exe itself only ever runs what PATHEXT lists; this now matches it.
 */
export function findExecutable(name) {
  if (name.includes("/") || (IS_WINDOWS && name.includes("\\"))) {
    return isExecutableFile(name) ? path.resolve(name) : null;
  }
  const dirs = (process.env.PATH ?? "").split(IS_WINDOWS ? ";" : ":").filter(Boolean);
  const pathext = (process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD").split(";").filter(Boolean);
  // "claude.exe" must still resolve as itself; "npm" must never resolve to an extensionless file.
  const named = pathext.some((e) => name.toLowerCase().endsWith(e.toLowerCase()));
  const exts = IS_WINDOWS ? (named ? [...pathext, ""] : pathext) : [""];
  for (const dir of dirs) {
    const base = IS_WINDOWS ? dir.replace(/^"|"$/g, "") : dir;
    for (const ext of exts) {
      const candidate = path.join(base, name + ext);
      if (isExecutableFile(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * spawn() that also works when the target is a Windows .cmd/.bat shim. THROWS (rather than emitting
 * a late 'error' event) when the binary is not on PATH, so callers can report "not installed"
 * differently from "started and then failed" — the two need different advice.
 *
 * `detached` defaults to true off Windows (own process group, so killTree can take the tool
 * children with it) and is forced off on Windows, where `detached` means "new console window".
 */
export function spawnCommand(name, args = [], opts = {}) {
  const exe = findExecutable(name);
  if (!exe) {
    const err = new Error(`${name} was not found on your PATH — see docs/RUNNING.md`);
    err.code = "ENOENT";
    throw err;
  }
  const ext = path.extname(exe).toLowerCase();
  const viaShim = IS_WINDOWS && (ext === ".cmd" || ext === ".bat");
  const detached = viaShim || IS_WINDOWS ? false : (opts.detached ?? true);

  const child = viaShim
    // ComSpec + verbatim, NOT `shell: true`: same effect, except the command line is ours to quote.
    // cmd /s strips the first and last quote of the /c string and runs the rest as written.
    ? spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `"${[exe, ...args].map(quoteWin).join(" ")}"`], {
        ...opts, detached: false, windowsHide: true, windowsVerbatimArguments: true,
      })
    : spawn(exe, args, { ...opts, detached, windowsHide: true });

  // Read by killTree: `process.kill(-pid)` addresses a process GROUP, and a child that is not a
  // group leader has none of its own — the call throws ESRCH and kills nothing at all.
  child.detachedGroup = detached;
  return child;
}

/** Kill a child AND its descendants (claude's tool children; whisper's ffmpeg). */
export function killTree(child) {
  if (!child?.pid) return;
  try {
    if (IS_WINDOWS) {
      // The pid may be cmd.exe's rather than the tool's, so /T (tree) is not optional here.
      spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
    } else if (child.detachedGroup) {
      process.kill(-child.pid, "SIGKILL");
    } else {
      child.kill("SIGKILL");
    }
  } catch {
    /* already gone */
  }
}

/**
 * Open a URL in the user's browser. Deliberately NOT spawnCommand: a missing opener (a headless
 * Linux box) is not an error worth throwing — the launcher prints the URL either way.
 */
export function openBrowser(url) {
  const [cmd, args] = IS_WINDOWS
    ? [process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", "start", "", url]]
    : process.platform === "darwin"
      ? ["open", [url]]
      : ["xdg-open", [url]];
  try {
    const child = spawn(cmd, args, { stdio: "ignore", detached: !IS_WINDOWS, windowsHide: true });
    child.on("error", () => {});
    child.unref();
  } catch {
    /* no browser here; the caller has already printed the URL */
  }
}
