# Studyroom

Gregory's university study repo. Each folder in [`subjects/`](subjects/) is one course (`AI201`, `AI211`, …); materials live inside them, and Claude-generated study artifacts accumulate in each course's `_generated/`.

- **App:** lives in [`app/`](app/) (built per the design doc). Run it with `./start` from this directory. Courses and their files are managed from the app itself — add a subject on the dashboard, then upload, write, rename or archive files on its page. Nothing the app removes is erased: it moves to `.studyroom/archive/`.
- **Design doc:** [`docs/plans/2026-08-15-studyroom-app-design.md`](docs/plans/2026-08-15-studyroom-app-design.md) — the source of truth for how the app works and gets built.
- **Learner profile:** [`profile.md`](profile.md) — tunes how all study materials are generated.

Lecture videos are local-only (over GitHub's file-size limit); their transcripts are committed instead.
