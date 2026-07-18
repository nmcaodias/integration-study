#!/usr/bin/env node
/* Validates the certification data files in data/.
   Run: node scripts/validate-data.js  (exits non-zero on any problem) */
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const problems = [];
const info = [];

function fail(msg) { problems.push(msg); }

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(path.join(dataDir, "certs.json"), "utf8"));
  if (!Array.isArray(manifest.certs) || manifest.certs.length === 0) fail("certs.json: 'certs' must be a non-empty array");
} catch (e) {
  console.error("FATAL: cannot read data/certs.json: " + e.message);
  process.exit(1);
}

for (const id of manifest.certs) {
  let cert;
  try {
    cert = JSON.parse(fs.readFileSync(path.join(dataDir, id + ".json"), "utf8"));
  } catch (e) {
    fail(`${id}.json: unreadable or invalid JSON (${e.message})`);
    continue;
  }

  // kind "book" entries have no real exam, so 'exam' and section weights don't apply
  const isBook = cert.kind === "book";
  const required = ["id", "name", "short", "vendor", "sections", "questions"];
  if (!isBook) required.push("exam");
  for (const field of required) {
    if (!(field in cert)) fail(`${id}.json: missing '${field}'`);
  }
  if (cert.id !== id) fail(`${id}.json: id '${cert.id}' does not match filename`);
  if ("vendor" in cert && (typeof cert.vendor !== "string" || !cert.vendor.trim())) {
    fail(`${id}.json: vendor must be a non-empty string (used to group certifications on the home page)`);
  }
  if (!isBook && (!cert.exam || !cert.exam.questions || !cert.exam.minutes || !cert.exam.passPct)) {
    fail(`${id}.json: exam must define questions, minutes, passPct`);
  }

  const secIds = new Set();
  let weightSum = 0;
  for (const s of cert.sections || []) {
    if (secIds.has(s.id)) fail(`${id}/${s.id}: duplicate section id`);
    secIds.add(s.id);
    weightSum += s.weight || 0;
    if (!s.weight && !isBook) fail(`${id}/${s.id}: missing weight`);
    if (!s.title) fail(`${id}/${s.id}: missing title`);
    if (!Array.isArray(s.objectives) || !s.objectives.length) fail(`${id}/${s.id}: missing objectives`);
    if (!s.notes || s.notes.length < 500) fail(`${id}/${s.id}: notes missing or suspiciously short`);

    // every <h3> heading must have a matching topicDocs entry (that's what renders the 📖 link);
    // decode entities the way the browser's textContent would
    const decode = t => t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
    const headings = [...(s.notes || "").matchAll(/<h3>([^<]*)<\/h3>/g)].map(m => decode(m[1].trim()));
    for (const h of headings) {
      if (!s.topicDocs || !s.topicDocs[h]) fail(`${id}/${s.id}: heading without topicDocs entry: "${h}"`);
    }
    for (const key of Object.keys(s.topicDocs || {})) {
      if (!headings.includes(key)) fail(`${id}/${s.id}: topicDocs key matches no heading: "${key}"`);
      if (!/^https:\/\//.test(s.topicDocs[key])) fail(`${id}/${s.id}: topicDocs URL not https: "${key}"`);
    }
  }
  // ccdak's official published weights sum to 99
  if (!isBook && weightSum !== 100 && !(id === "ccdak" && weightSum === 99)) {
    fail(`${id}.json: section weights sum to ${weightSum}, expected 100`);
  }

  const qIds = new Set();
  for (const q of cert.questions || []) {
    if (qIds.has(q.id)) fail(`${id}/${q.id}: duplicate question id`);
    qIds.add(q.id);
    if (!secIds.has(q.section)) fail(`${id}/${q.id}: unknown section '${q.section}'`);
    if (!Array.isArray(q.options) || q.options.length < 2) fail(`${id}/${q.id}: needs at least 2 options`);
    if (Array.isArray(q.options) && q.options.length > 5) fail(`${id}/${q.id}: at most 5 options (the app labels options A-E)`);
    const optCount = (q.options || []).length;
    const hasSingle = typeof q.answer === "number";
    const hasMulti = Array.isArray(q.answers);
    if (hasSingle === hasMulti) {
      fail(`${id}/${q.id}: must have exactly one of 'answer' (number) or 'answers' (array)`);
    } else if (hasSingle) {
      if (q.answer < 0 || q.answer >= optCount) fail(`${id}/${q.id}: answer index out of range`);
    } else {
      if (q.answers.length < 1) fail(`${id}/${q.id}: 'answers' must not be empty`);
      if (new Set(q.answers).size !== q.answers.length) fail(`${id}/${q.id}: duplicate indexes in 'answers'`);
      if (q.answers.some(a => typeof a !== "number" || a < 0 || a >= optCount)) {
        fail(`${id}/${q.id}: 'answers' index out of range`);
      }
    }
    if (!q.q || !q.explanation) fail(`${id}/${q.id}: missing question text or explanation`);
    if ("exhibit" in q && (typeof q.exhibit !== "string" || !q.exhibit.trim())) {
      fail(`${id}/${q.id}: exhibit must be a non-empty string`);
    }
    if ("optionNotes" in q) {
      if (!Array.isArray(q.optionNotes) || q.optionNotes.length !== optCount) {
        fail(`${id}/${q.id}: optionNotes must match options length (${optCount})`);
      } else if (q.optionNotes.some(n => typeof n !== "string" || !n.trim())) {
        fail(`${id}/${q.id}: optionNotes entries must be non-empty strings`);
      }
    }
    if ("level" in q && !["easy", "medium", "hard"].includes(q.level)) {
      fail(`${id}/${q.id}: level must be easy, medium, or hard`);
    }
  }

  const cardIds = new Set();
  for (const c of cert.cards || []) {
    if (cardIds.has(c.id)) fail(`${id}/${c.id}: duplicate card id`);
    cardIds.add(c.id);
    if (!secIds.has(c.section)) fail(`${id}/${c.id}: card references unknown section '${c.section}'`);
    if (!c.front || !c.back) fail(`${id}/${c.id}: card needs non-empty front and back`);
    if (String(c.id).startsWith("q:")) fail(`${id}/${c.id}: card ids must not use the reserved 'q:' prefix`);
  }

  info.push(`${id}: ${cert.sections.length} sections (weights ${weightSum}%), ${cert.questions.length} questions, ${(cert.cards || []).length} cards`);
}

info.forEach(l => console.log(l));
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.forEach(p => console.error("  - " + p));
  process.exit(1);
}
console.log("\nAll data files valid.");
