# Integration Study

A self-contained web app to study for integration certifications, starting with
**MuleSoft Certified Developer – Level 1** and **Level 2 (Mule 4)**.
No server, no build step — everything runs in your browser, and progress is saved in `localStorage`.

## How to run

Double-click `index.html` (or right-click → Open with → your browser). That's it.

## Features

- **Study notes** — condensed notes and official exam objectives for every exam section
  (12 sections for L1, 5 weighted domains for L2). Mark sections as read.
- **Practice quizzes** — pick a topic (or all) and a question count; instant feedback with
  explanations after every answer. Per-topic accuracy is tracked on the certification page.
- **Exam simulation** — timed mock exam mirroring the real format (120-minute countdown,
  70% to pass), question flagging, a navigator grid, auto-submit on timeout, a per-topic
  score report, and a review of every incorrect answer. Attempts are saved to history.
- **Dark/light theme** — toggle with the 🌓 button.

## Adding your own questions

Questions live in `data/mcd1-questions-*.js` and `data/mcd2-questions-*.js`.
Each one is a plain object — copy the pattern:

```js
{
  id: "m1-999",            // unique id
  section: "s3",           // must match a section id in the notes file
  q: "Question text?",
  options: ["Option A", "Option B", "Option C", "Option D"],
  answer: 1,               // index of the correct option (0-based)
  explanation: "Why the answer is correct."
}
```

Section ids: L1 uses `s1`–`s12` (see `data/mcd1-notes-a.js` / `-b.js`), L2 uses `d1`–`d5`
(see `data/mcd2-notes-a.js` / `-b.js`). Study notes include diagrams from the official
MuleSoft documentation (stored locally in `images/`). You can also add a whole new certification by creating a new
entry in `window.CERT_DATA` following the same shape and adding its `<script>` tags to
`index.html`.

## Resetting progress

Progress is stored under the `mulesoft-study-v1` key in your browser's localStorage.
Clear it from DevTools (Application → Local Storage) to start fresh, or use the
"Clear history" button on each exam-history page for exam attempts only.
