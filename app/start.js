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
const URL = `http://localhost:${PORT}`;
const noOpen = process.argv.includes("--no-open") || process.env.STUDYROOM_NO_OPEN === "1";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

if (await probe()) {
  console.log(`Studyroom is already running at ${URL}`);
  if (!noOpen) openBrowser(URL);
  process.exit(0);
}

if (!existsSync(path.join(APP, "node_modules"))) {
  // On Windows `npm` is npm.cmd, which Node refuses to spawn directly (EINVAL, the
  // CVE-2024-27980 mitigation) — spawnCommand routes it through cmd.exe. This is the very first
  // thing a Windows user runs, so it is also the first place that would have broken.
  const code = await run("npm", ["install", "--no-audit", "--no-fund"], { cwd: APP }).catch((err) => {
    console.error(`Could not run npm: ${err.message}`);
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
server.on("close", (code) => process.exit(code ?? 0));

for (let i = 0; i < 50; i++) {
  if (await probe()) break;
  await sleep(200);
}
console.log(`Studyroom → ${URL}`);
if (!noOpen) openBrowser(URL);
