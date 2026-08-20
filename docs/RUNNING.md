# Running Studyroom

Studyroom is a local web app — a small Node server on `127.0.0.1:4321` plus a static frontend. It
runs on **macOS, Linux and Windows**. Nothing is uploaded anywhere; the server only ever binds to
localhost, and every study chat is a `claude` process on your own machine.

## 1. What you need

| | Needed for | Notes |
|---|---|---|
| **Node.js 22 or newer** | everything | The one hard requirement. `node --version` |
| **Claude Code CLI** | study chats | The app spawns `claude` once per turn. Log in once with `claude` before starting. |
| ffmpeg + ffprobe | video transcription | Both Whisper engines shell out to ffmpeg to decode audio. |
| a Whisper engine | video transcription | See §3 — one of two, depending on your machine. |
| poppler (`pdftoppm`) | letting Claude read PDFs | Without it, Claude can open text files but not your handouts. |

Everything below the first two rows is optional. The app starts, lists your subjects, previews
files and runs chats without any of them.

### Install

**macOS** (Homebrew)

```sh
brew install node ffmpeg poppler
```

**Debian / Ubuntu**

```sh
sudo apt install nodejs npm ffmpeg poppler-utils     # check `node --version` is >= 22;
                                                     # if not, use nodesource or nvm
```

**Fedora**: `sudo dnf install nodejs ffmpeg poppler-utils` · **Arch**: `sudo pacman -S nodejs npm ffmpeg poppler`

**Windows** (winget)

```powershell
winget install -e --id OpenJS.NodeJS.LTS
winget install -e --id Gyan.FFmpeg
winget install -e --id oschwartz10612.Poppler
```

**Claude Code CLI** — install it per the official instructions at <https://claude.com/claude-code>
(the npm route is `npm install -g @anthropic-ai/claude-code`). Either flavour works: a native
binary (`claude` / `claude.exe`) or the npm package, which on Windows puts a `claude.cmd` shim on
your PATH — the app spawns that shim explicitly, because Node refuses to run a `.cmd` directly.

## 2. Start it

| OS | Command (from the repo root) |
|---|---|
| macOS, Linux | `./start` |
| Windows | `.\studyroom.cmd` |
| anywhere | `node app/start.js` |

That installs the app's one dependency if `app/node_modules` is missing, starts the server, waits
for it to answer and opens `http://localhost:4321`. Ctrl-C stops it. Running it again while a
server is already up just opens the browser.

> **Windows naming note:** the launcher is `studyroom.cmd`, *not* `start.cmd`, because `start` is a
> built-in cmd.exe command — a bare `start` in this folder would run the builtin instead of the
> script. In PowerShell you also need the leading `.\`.

Useful switches:

| | |
|---|---|
| `--no-open` | start the server but don't launch a browser (headless boxes, remote sessions) |
| `PORT=4399` | serve on another port |
| `STUDYROOM_DIR=/path` | use another data root (must contain, or be allowed to create, `subjects/`) |
| `STUDYROOM_HOST=<addr>` | bind another address instead of `127.0.0.1` — see §2a before you use it |
| `cd app && npm start` | run just the server, no launcher, no browser |

### 2a. Reaching it from a tablet or another machine

By default the server binds `127.0.0.1`, so only the machine running it can reach it. A tablet on
the same Wi-Fi gets nothing — that is the intended default, not a bug.

**Read this before overriding it. The app has no authentication of any kind.** There is no login,
no token, no CORS restriction. Anything that can open the port can also:

- `POST /api/subjects/:s/chats/:id/messages`, which **spawns Claude Code with `Write` and `Edit`
  under `--permission-mode dontAsk`** on a prompt it supplies — code execution as you, billed to
  your account;
- `PUT`/`PATCH`/`DELETE` any file under any subject.

Hiding the edit buttons in the UI does **not** address this. The buttons are not the door; the
routes are, and `curl` does not read your CSS.

So do not bind `0.0.0.0` on a network you do not control — and a home or campus Wi-Fi is not a
network you control. Use a private network instead:

```sh
# Tailscale (recommended): install it on both machines, then bind THAT interface, not 0.0.0.0
tailscale ip -4                         # e.g. 100.101.102.103
STUDYROOM_HOST=100.101.102.103 ./start
```

Then open `http://100.101.102.103:4321` on the tablet, which must be signed into the same tailnet.
Only your own devices can route to that address at all, so there is no authorization decision to
get wrong. Pen notes, lecture video, chat and transcription all work, because it is the real
server — the `.mp4` files are local-only and never reach GitHub, so this is the *only* way to watch
a lecture on the tablet.

The machine running `./start` has to stay awake. If that is unacceptable, the app has to be hosted
somewhere, which means solving video storage, Linux transcription and real route-level auth — a
project, not a switch. `0.0.0.0` remains possible for a machine you fully trust, such as an
offline network, but it is never the recommended default.

## 3. Transcription engines

Transcription is optional, and which engine you install depends on your machine:

| Engine | Install | Where it runs |
|---|---|---|
| **mlx-whisper** | `uv tool install mlx-whisper` (or `pipx install mlx-whisper`) | **Apple Silicon only** — MLX is Apple's framework. Fastest option on a Mac. |
| **openai-whisper** | `pip install -U openai-whisper` | **Any OS**, CPU or CUDA GPU. |

The app picks whichever it finds on your PATH, preferring mlx-whisper. Override with:

- `STUDYROOM_WHISPER=mlx` or `STUDYROOM_WHISPER=whisper` — pin one engine.
- `STUDYROOM_WHISPER_MODEL=small` — pin the model.

If neither is installed the Transcribe button answers with one sentence telling you so; nothing
else in the app is affected. Auto-detection skips mlx-whisper unless Node reports an `arm64`
process, even when mlx is on your PATH — on an Intel machine it genuinely cannot run. There is one
false negative: **x64 Node under Rosetta on an Apple Silicon Mac** reports `x64`, so mlx is skipped
there even though it would have worked. `STUDYROOM_WHISPER=mlx` is the override in both cases.

⚠️ **The openai-whisper path has never been executed** — see §5 before relying on it.

**Two things to expect the first time you transcribe with openai-whisper:**

1. **It downloads its model — about 1.5 GB** (`large-v3-turbo`, 1,617,941,637 bytes) into
   `~/.cache/whisper`. The app shows this as a "Downloading the Whisper model" progress line so it
   does not look frozen. It happens once per machine.
2. **On a CPU-only machine, `turbo` is slow** — plan on longer than the lecture itself. Set
   `STUDYROOM_WHISPER_MODEL=small` (or `base`) for a much faster, less accurate pass.

## 4. Windows: two ways to run it

**WSL2 (recommended).** Install Ubuntu under WSL2, then follow the Debian/Ubuntu instructions and
run `./start` inside it. Windows will open `http://localhost:4321` in your normal browser. This
route runs exactly the same code path as Linux and macOS — the one this project actually tests.

**Native Windows.** `.\studyroom.cmd` works with plain Windows Node, no WSL. The app handles the
Windows-specific parts explicitly: PATHEXT lookup for `claude`/`npm`, `.cmd` shims spawned through
cmd.exe with a hand-quoted command line, `taskkill /T` for Cancel, and no console-window flash.
**But see the honesty note below: none of that has been executed on a Windows machine.**

## 5. What has actually been tested where

This project has no automated test suite by design; verification is done by running things. As of
**2026-08-18**:

| Platform | Status |
|---|---|
| macOS 26 (Apple M4) | **Run** — the launcher, chats (including cancel and follow-up turns) and transcription. Transcription only ever ran through **mlx-whisper**. |
| openai-whisper, on any OS | **Never run.** Its flag dialect and output naming were read out of its own source, and the first-run download path was proven against a `tqdm` fixture rather than a real 1.5 GB fetch. Selecting it — including with `STUDYROOM_WHISPER=whisper` on a Mac — puts you on an unexercised path. |
| Linux | **Not run in this session.** The code path is the same POSIX one macOS uses — process groups, `pgrep`, `xdg-open` — with openai-whisper in place of mlx-whisper. |
| Windows (native) | **Not run.** No Windows machine was available. The cmd.exe quoting, `taskkill /T`, PATHEXT resolution and `studyroom.cmd` are written from Node's and cmd.exe's documented behaviour, and the argument-quoting half is unit-checked, but nothing has executed there. |
| Windows (WSL2) | **Not run directly** — it is the Linux row. |

If you hit something on Windows, WSL2 is the fallback with a tested code path behind it.

## 6. Troubleshooting

**"claude was not found on your PATH"** — the CLI is not installed, or not in the PATH the *server*
inherited. Check with `claude --version` in the same terminal you launch from. On Windows, reopen
the terminal after installing so PATH is refreshed.

**Chats answer "You're out of usage credits"** — that is your Claude account, not the app. The
model dropdown in each chat picks which model that chat spawns.

**Port 4321 is already in use** — either Studyroom is already running (the launcher will just open
the browser) or something else has the port. Find it with `lsof -nP -iTCP:4321 -sTCP:LISTEN`
(macOS/Linux) or `netstat -ano | findstr :4321` (Windows), or set `PORT` to something else.

**Claude can't read my PDFs** — install poppler; `pdftoppm -v` should print a version.

**Transcription says no engine is installed** — see §3. If you installed one and still see it, the
binary is not on the server's PATH (`mlx_whisper --help` / `whisper --help` from the same terminal).

**A transcription looks stuck at 0%** — the first openai-whisper run downloads ~1.5 GB; the
progress line will say so. If it says nothing at all for minutes, check your network.

**The browser didn't open** — the URL is always printed. Open it by hand; the server is fine.
