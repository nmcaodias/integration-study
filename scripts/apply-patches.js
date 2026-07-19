#!/usr/bin/env node
/* Applies hand-authored content patches to a data/<cert>.json file.
 *
 *   node scripts/apply-patches.js <cert> <patches-file>
 *
 * The patches file is a CommonJS module exporting:
 *   {
 *     questions: { "<qid>": { options?, answer?, answers?, explanation?,
 *                             optionNotes?, level?, exhibit?, q? }, ... },
 *     sections:  { "<sid>": { notes?, topicDocs?(merged), objectives? }, ... },
 *     addQuestions: [ { full question object }, ... ],  // optional
 *     addExercises: [ { full exercise object }, ... ],  // optional
 *     exercises: { "<exId>": { partial exercise patch }, ... }  // optional
 *   }
 *
 * Only the keys present on a patch are changed; everything else is preserved.
 * Writes back with the file's original 1-space indentation, then the caller
 * should run scripts/validate-data.js. */
const fs = require("fs");
const path = require("path");

const [cert, patchFile] = process.argv.slice(2);
if (!cert || !patchFile) {
  console.error("usage: node scripts/apply-patches.js <cert> <patches-file>");
  process.exit(1);
}

const dataPath = path.join(__dirname, "..", "data", cert + ".json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const patches = require(path.resolve(patchFile));

const qById = new Map(data.questions.map(q => [q.id, q]));
const sById = new Map(data.sections.map(s => [s.id, s]));

let changed = 0;
const notes = [];

// ---- question patches -------------------------------------------------
for (const [qid, patch] of Object.entries(patches.questions || {})) {
  const q = qById.get(qid);
  if (!q) { console.error("!! unknown question id: " + qid); process.exit(1); }
  // optionEdits: { "<index>": "new text" } — replace individual option strings in place
  if (patch.optionEdits) {
    for (const [idx, text] of Object.entries(patch.optionEdits)) {
      const i = Number(idx);
      if (!q.options[i]) { console.error(`!! ${qid}: optionEdits index ${i} out of range`); process.exit(1); }
      q.options[i] = text;
    }
    delete patch.optionEdits;
  }
  for (const [k, v] of Object.entries(patch)) q[k] = v;
  // if options changed, an 'answer'/'answers' should have been supplied too
  if (patch.options && patch.answer === undefined && patch.answers === undefined) {
    console.error(`!! ${qid}: options changed without answer/answers`); process.exit(1);
  }
  // keep answer/answers mutually exclusive
  if (patch.answers !== undefined) delete q.answer;
  if (patch.answer !== undefined) delete q.answers;
  changed++;
}

// ---- new questions ----------------------------------------------------
for (const nq of patches.addQuestions || []) {
  if (qById.has(nq.id)) { console.error("!! addQuestions id already exists: " + nq.id); process.exit(1); }
  data.questions.push(nq);
  qById.set(nq.id, nq);
  changed++;
}

// ---- hands-on exercises -----------------------------------------------
const xById = new Map((data.exercises || []).map(x => [x.id, x]));
for (const nx of patches.addExercises || []) {
  if (xById.has(nx.id)) { console.error("!! addExercises id already exists: " + nx.id); process.exit(1); }
  data.exercises = data.exercises || [];
  data.exercises.push(nx);
  xById.set(nx.id, nx);
  changed++;
}
for (const [xid, patch] of Object.entries(patches.exercises || {})) {
  const x = xById.get(xid);
  if (!x) { console.error("!! unknown exercise id: " + xid); process.exit(1); }
  for (const [k, v] of Object.entries(patch)) x[k] = v;
  changed++;
}

// ---- section patches --------------------------------------------------
for (const [sid, patch] of Object.entries(patches.sections || {})) {
  const s = sById.get(sid);
  if (!s) { console.error("!! unknown section id: " + sid); process.exit(1); }
  if (patch.notes !== undefined) s.notes = patch.notes;
  if (patch.appendNotes) s.notes = s.notes + patch.appendNotes;
  if (patch.objectives !== undefined) s.objectives = patch.objectives;
  if (patch.topicDocs) s.topicDocs = { ...(s.topicDocs || {}), ...patch.topicDocs };
  changed++;
}

// ---- light local sanity (full check is validate-data.js) --------------
for (const q of data.questions) {
  if (q.optionNotes && q.optionNotes.length !== q.options.length) {
    console.error(`!! ${q.id}: optionNotes length ${q.optionNotes.length} != options ${q.options.length}`);
    process.exit(1);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 1));
console.log(`Applied ${changed} patch(es) to ${cert}.json`);
notes.forEach(n => console.log("  " + n));
