# Integration Study

A self-contained web app to study for integration certifications:
**MuleSoft Certified Developer – Level 1**, **Level 2**, the
**MuleSoft Platform Integration Architect**, the **MuleSoft Platform Architect**,
and the **Confluent Certified Developer for Apache Kafka (CCDAK)**.

No build step and no backend — a static site whose content lives in JSON files, with optional
cross-device progress sync through a private GitHub Gist.

## Use it

- **Hosted (any device):** https://nmcaodias.github.io/integration-study/
- **Locally:** the app loads its data with `fetch()`, so it needs to be served over HTTP —
  opening `index.html` straight from disk won't work. From the project folder run either:
  ```
  python -m http.server
  ```
  or `npx serve`, then open http://localhost:8000.

## Features

- **Study notes** — in-depth notes and official exam objectives for every exam section
  of all five certifications, with diagrams from the official MuleSoft and Apache Kafka
  documentation (stored locally in `images/`) and a 📖 link on every sub-topic heading
  to its official documentation page.
- **Practice quizzes** — 10 questions per quiz; pick a topic (or all) and a difficulty; instant
  feedback with explanations after every answer. Per-topic accuracy is tracked on the
  certification page.
- **Weak-areas practice** — a 🎯 button on each certification page builds a quiz from your
  worst-performing and least-practiced questions, using the stats the app already tracks.
- **Spaced-repetition flashcards** — 🃏 per certification: authored fact cards plus every
  question you answer wrongly becomes a card automatically. Reviews are scheduled with an
  SM-2-style algorithm (Again/Hard/Good/Easy; keys 1–4, Space reveals) and sync across
  devices like all other progress.
- **Exam readiness score** — each certification page shows a transparent readiness
  percentage (30% bank coverage + 45% weighted accuracy + 25% recent exam result) with a
  breakdown and the sections to focus on next.
- **Exam simulation** — timed mock exam mirroring the real format, drawn according to the
  official topic weightings: question flagging, a navigator grid, auto-submit on timeout,
  a per-topic score report, and a review of every incorrect answer. Attempts are saved.
- **Realistic questions** — answer options are shuffled on every attempt, and banks include
  multi-select ("select all that apply") questions scored all-or-nothing like real exams.
  Detailed exam-style questions add code/config **exhibits**, per-option explanations of
  why each answer is right or wrong, and difficulty tags (with a difficulty filter in the
  quiz setup).
- **Keyboard shortcuts** (desktop) — 1–9 select/toggle options, Enter next/check,
  ←/→ navigate the exam, F flags a question.
- **Cross-device sync** — see below.
- **Dark/light theme** — toggle with the 🌓 button.

## Progress sync across devices

Progress is always saved in the browser (`localStorage`). To sync it across devices, the app
can mirror it into a **private GitHub Gist** you own:

1. Open **⚙ Sync & backup** in the app.
2. Create a GitHub token with permission for **Gists (read and write)** only — the Sync page
   links to the right settings screen.
3. Paste the token and connect. The app finds (or creates) a private gist named
   `integration-study-progress` and merges its contents with local progress.
4. Repeat on each device with the same token (or another token of the same account).

Changes are pushed automatically a few seconds after each answer/exam; other devices merge on
load. The token is stored only in each browser's localStorage and is used exclusively for the
Gist API. The Sync page also offers **export/import** of a progress file — handy as a backup
or to migrate progress from an old local copy.

## Content is data

All certification content lives in `data/`:

- `data/certs.json` — the manifest: which certification files to load.
- `data/mcd1.json`, `data/mcd2.json`, `data/mcia.json`, `data/ccdak.json`, `data/mcpa.json` —
  one file per certification: exam metadata, a `vendor` (groups certifications on the home
  page, e.g. "MuleSoft" / "Confluent"), sections (title, weight, objectives, notes HTML,
  `topicDocs` documentation links), and the question bank.

### Adding your own questions

Append to the `questions` array of the certification's JSON file:

```json
{
  "id": "m1-999",
  "section": "s3",
  "q": "Question text?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 1,
  "explanation": "Why the answer is correct."
}
```

`id` must be unique; `section` must be an existing section id (L1 `s1`–`s12`, L2 `d1`–`d5`,
Integration Architect `a1`–`a10`, CCDAK `k1`–`k6`, Platform Architect `p1`–`p9`); `answer`
is the 0-based index of the correct option. For a multi-select question, replace `answer`
with `"answers": [0, 2]` (array of correct indexes — scored all-or-nothing). A whole new
certification = a new JSON file with the same shape plus an entry in `data/certs.json`.

Optional question fields for detailed exam-style questions:

- `"exhibit"` — a code/config/log block (string, newlines preserved) shown between the
  question text and the options.
- `"optionNotes"` — array (same length as `options`) explaining why each option is
  right or wrong; shown after answering in quizzes and in the exam review.
- `"level"` — `"easy"`, `"medium"`, or `"hard"` (untagged questions count as medium for
  the quiz difficulty filter).

Flashcards live in each file's optional `cards` array:

```json
{ "id": "m1-c999", "section": "s3", "front": "Question side", "back": "Answer side" }
```

Card ids must not start with `q:` (reserved for auto-cards generated from missed questions).

Run `node scripts/validate-data.js` to check the data files (unique ids, valid section
references, answer indexes, weights, documentation-link coverage). The same check runs in CI
on every push (`.github/workflows/validate.yml`).

## Resetting progress

Every certification page has a **Reset progress** card: reset the notes-read marks, the quiz
stats (per-topic percentages and the readiness score), the exam history, or everything —
each reset is timestamped so it propagates through sync instead of being restored by the
next merge. As a last resort, local progress lives under the `mulesoft-study-v1` key in
localStorage, and the sync copy is the `integration-study-progress` gist at
https://gist.github.com.
