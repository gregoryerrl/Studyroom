# Studyroom

Gregory's university study repo. Each folder in [`subjects/`](subjects/) is one course (`AI201`, `AI211`, …); materials live inside them, and Claude-generated study artifacts accumulate in each course's `_generated/`.

- **App:** lives in [`app/`](app/) (built per the design doc). Run it with `./start` (`.\studyroom.cmd` on Windows) from this directory. Courses and their files are managed from the app itself — add a subject on the dashboard, then upload, write, rename or archive files on its page. Nothing the app removes is erased: it moves to `.studyroom/archive/`.
- **Design doc:** [`docs/plans/2026-08-15-studyroom-app-design.md`](docs/plans/2026-08-15-studyroom-app-design.md) — the source of truth for how the app works and gets built.
- **Learner profile:** [`profile.md`](profile.md) — tunes how all study materials are generated.

Lecture videos are local-only (over GitHub's file-size limit); their transcripts are committed instead.

## Running it

It runs on **macOS, Linux and Windows**. You need [Node.js](https://nodejs.org/) 22 or newer and the [Claude Code CLI](https://claude.com/claude-code) on your `PATH`. Then, from this directory:

| macOS, Linux | Windows | anywhere |
|---|---|---|
| `./start` | `.\studyroom.cmd` | `node app/start.js` |

That installs the app's one dependency if needed, starts the server on `http://localhost:4321` and opens it. Optional extras: `ffmpeg` plus a Whisper engine (`mlx-whisper` on Apple Silicon, `openai-whisper` anywhere else) for transcribing lecture videos, and `poppler` (`pdftoppm`) so Claude can read PDFs.

**[`docs/RUNNING.md`](docs/RUNNING.md)** is the setup guide: per-OS install commands, the two transcription engines, the Windows notes, and a plain statement of what has actually been tested where.

**[`docs/TABLET.md`](docs/TABLET.md)** walks through using Studyroom on a tablet, step by step — Tailscale on both devices, finding the address, starting the server on it, and sharing the machine with someone else.

Add a subject on the dashboard, then drag your own files onto its page. Nothing in `subjects/` is required for the app to run — it lists whatever is there.

## Course materials, copyright and reuse

**The application is mine; the study materials are not.**

The code and documentation in this repository — [`app/`](app/), `start`, `studyroom.cmd`, and [`docs/`](docs/) — are my own work and are MIT-licensed. See [LICENSE](LICENSE).

**Everything under [`subjects/`](subjects/) is different.** Those are course materials: lecture slides, handouts, syllabi, textbooks, recordings and their transcripts. **All rights in them remain with their respective authors, instructors and publishers** — some carry a commercial publisher's copyright notice on the page itself. They sit here only so that this app has something to study against, they are used for personal, non-commercial study, and **no license, permission, endorsement or affiliation is granted or implied** by their presence in this repository.

The same goes for anything under a `_generated/` folder. Those are machine-generated study aids — summaries, flashcards, quizzes, transcripts — derived from the materials above. They may contain errors, they are no substitute for the source, and no claim is made over the underlying content.

Where a rights holder asks for something specific, that request is honoured: the authors of *Mathematics for Machine Learning*, for instance, ask that people link to <https://mml-book.com>.

This is a personal study project. It is **not affiliated with, endorsed by, or an official publication of** the University of the Philippines Diliman or any other institution.

**If you are an author, instructor or rights holder and you would like something taken down, just ask and it will be removed** — open an issue on this repository or email <gregoryerrl@gmail.com>.
