# Decisions log

One line per detail the design doc (`docs/plans/2026-08-15-studyroom-app-design.md`) left open, per its §0: the builder picks the simplest option consistent with §1 and records it here instead of asking. Append-only, newest at the bottom. Format: `- YYYY-MM-DD (Mx) — decision — why`.

- 2026-08-15 (M0) — Express 5.x (5.2.1 installed, current major); wildcard routes therefore use the named form `/files/:s/*path` and `req.params.path` is an array of segments — no reason to start on the previous major.
- 2026-08-15 (M0) — ES modules (`"type": "module"`), paths via `import.meta.dirname` — matches the doc's `import` samples; `__dirname` doesn't exist in ESM.
- 2026-08-15 (M0) — Subject page URL is `/subjects/<name>` (serves `public/subject.html`); dashboard cards link there. M0 ships a placeholder page; M1 fills it.
- 2026-08-15 (M0) — File-listing entries are `{ path, name, size, mtime, type }` (`mtime` in ms; `type` ∈ pdf|video|markdown|html|text|other by extension) so the UI can pick a preview without re-deriving it. Symlinks are skipped.
- 2026-08-15 (M0) — Dotfiles/dot-directories inside subject folders (e.g. `.DS_Store`) are hidden from listings and counts and are refused (403) under `/files/`.
- 2026-08-15 (M0) — `./start` reuses an already-running server on :4321 (just opens the browser) instead of failing with EADDRINUSE; it does not source nvm — `node` is on PATH in Gregory's terminal.
- 2026-08-15 (M0) — Note for M2: the claude CLI loads `CLAUDE.md` from every parent directory, and both `/Users/gregoryerrl/CLAUDE.md` and `~/.claude/CLAUDE.md` sit above every subject dir, so spawned chats inherit them regardless of this repo (today they only carry git-commit rules — harmless). Keeping the repo root CLAUDE.md-free is still required; at M2, ask a fresh chat what instructions it loaded.
