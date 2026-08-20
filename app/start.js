#!/usr/bin/env node
// Studyroom launcher — ONE implementation for every OS. `./start` (macOS/Linux) and
// `studyroom.cmd` (Windows) are one-line shims onto this file.
//
// It replaces a bash script that needed `open`, `curl`, `seq`, `sleep`, `trap` and bash itself:
// `open` is macOS-only and none of the others exist in cmd.exe. Node is already a hard
// prerequisite, so moving the logic here can only REMOVE dependencies.
import { existsSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawnCommand, openBrowser } from "./server/platform.js";

const APP = import.meta.dirname;
const PORT = Number(process.env.PORT) || 4321;
// The server binds STUDYROOM_HOST when it is set, so probing and opening a hardcoded localhost was
// wrong in both directions: against a server bound only to a Tailscale address the probe can never
// succeed, and the URL printed at the end is not the one being served. A wildcard bind is the one
// case where the bind address is not a usable URL, so it falls back to localhost.
const BIND = process.env.STUDYROOM_HOST || "localhost";
const HOST = BIND === "0.0.0.0" || BIND === "::" ? "localhost" : BIND;
// A bare IPv6 address has to be bracketed to be a URL. Tailscale hands out an fd7a:… address
// beside the 100.x one and the admin console lists both, so this is reachable by copy-paste;
// unbracketed it produces a malformed URL, the probe fails, and a bind that actually worked is
// reported as "did not answer".
const URL = `http://${HOST.includes(":") ? `[${HOST}]` : HOST}:${PORT}`;
const noOpen = process.argv.includes("--no-open") || process.env.STUDYROOM_NO_OPEN === "1";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Write a line and wait for it to actually flush. `write(chunk, cb)` calls back once the chunk is
 * out, so a `process.exit()` afterwards cannot abandon it — which it otherwise can, because Node's
 * stdio is asynchronous on Windows for both TTYs and pipes. Used only where the message must
 * survive an immediate exit; ordinary logging can stay on console.*.
 */
const say = (stream, msg) => new Promise((r) => stream.write(msg + "\n", r));

/** Is a server already answering there? Resolves true/false and never rejects. */
function probe() {
  return new Promise((resolve) => {
    const req = http.get(`${URL}/api/subjects`, { timeout: 1000 }, (res) => {
      res.resume(); // drain, or the socket stays open and the process won't exit
      resolve(res.statusCode === 200);
    });
    req.on("timeout", () => req.destroy());
    req.on("error", () => resolve(false));
  });
}

/** Run a command to completion with the terminal attached; resolves its exit code. */
function run(name, args, opts = {}) {
  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawnCommand(name, args, { stdio: "inherit", detached: false, ...opts });
    } catch (err) {
      return reject(err);
    }
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 0));
  });
}

// The two exits below stay as `process.exit()` rather than `process.exitCode`: they are top-level,
// so they must STOP the module — setting exitCode would fall through and start a server anyway.
// They use `say()` instead, which waits for the flush, so exiting immediately after cannot truncate
// them on Windows. Truncating this first one is the worse of the two: the user would see an empty
// exit 0 and conclude nothing happened, while the app is up and their browser has already opened.
if (await probe()) {
  await say(process.stdout, `Studyroom is already running at ${URL}`);
  if (!noOpen) openBrowser(URL);
  process.exit(0);
}

if (!existsSync(path.join(APP, "node_modules"))) {
  // On Windows `npm` is npm.cmd, which Node refuses to spawn directly (EINVAL, the
  // CVE-2024-27980 mitigation) — spawnCommand routes it through cmd.exe. This is the very first
  // thing a Windows user runs, so it is also the first place that would have broken.
  const code = await run("npm", ["install", "--no-audit", "--no-fund"], { cwd: APP }).catch(async (err) => {
    await say(process.stderr, `Could not run npm: ${err.message}`);
    return 1;
  });
  if (code !== 0) process.exit(code);
}

// process.execPath rather than a PATH lookup for "node": free, cannot miss, and the server is
// guaranteed the same runtime that is running this file. The argv and cwd deliberately reproduce
// what the old bash `start` produced — `node server/index.js` from inside app/ — because that is
// the shape documented for finding the live server (`pkill -f "node app/server/index.js"` does NOT
// match it; use `lsof -nP -iTCP:4321 -sTCP:LISTEN`), and an hour was lost to that once already.
// detached:false keeps it in this process group, so a terminal Ctrl-C reaches it exactly as the
// old `&`-and-`trap` version did.
const server = spawnCommand(process.execPath, ["server/index.js"], {
  cwd: APP, stdio: "inherit", detached: false,
});

const stop = () => { if (!server.killed) server.kill(); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
process.on("exit", stop);

// Tracks whether the server was ever seen answering. Everything below distinguishes "never came
// up" from "you stopped it", which the exit code alone cannot: a server that fails to bind exits
// 0, and this handler used to forward that as the launcher's own success.
// `up` records that the server was actually seen answering; `gone` that the child exited. Together
// they separate "never came up" from "you stopped it", which the exit code alone cannot: a server
// that fails to bind exits non-zero now, but this handler used to forward any code as success.
// Every exit below sets `process.exitCode` rather than calling `process.exit()`, because Node's
// stdio is asynchronous on Windows and process.exit() would abandon the explanation mid-write.
let up = false;
let gone = false;
server.on("close", (code) => {
  gone = true;
  if (!up) {
    console.error(`The server stopped before it answered at ${URL}.`);
    console.error(`Its own message is above — that is the reason.`);
    process.exitCode = code || 1;
    return;
  }
  process.exitCode = code ?? 0;
});

// `!gone` keeps a child that died immediately from costing ten seconds of pointless probing before
// the launcher notices; the loop's result used to be discarded entirely, so ten seconds of failed
// probes printed success anyway and opened a browser on a URL nothing was serving.
for (let i = 0; i < 50 && !gone; i++) {
  if (await probe()) { up = true; break; }
  await sleep(200);
}

if (!up) {
  if (!gone) { // if the child is gone its own handler has already explained why
    console.error(`Studyroom did not answer at ${URL} within 10 seconds.`);
    if (process.env.STUDYROOM_HOST) {
      console.error(`STUDYROOM_HOST is set to ${process.env.STUDYROOM_HOST}. If that is a Tailscale`);
      console.error(`address, check Tailscale says Connected and that the address is still current.`);
    }
    process.exitCode = 1;
    stop();
  }
} else {
  console.log(`Studyroom → ${URL}`);
  if (!noOpen) openBrowser(URL);
}
