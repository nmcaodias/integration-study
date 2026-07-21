/* CCDAK · classify the 90 unleveled questions (kk-001..kk-090).
 * easy   = recall/definition; medium = single-concept application;
 * hard   = multi-concept scenario, a known trap, or a subtle select-all.
 * Level-only patches. */
const easy = [
  "kk-006", "kk-010", "kk-012", "kk-023", "kk-025", "kk-037",
  "kk-040", "kk-047", "kk-054", "kk-055"
];
const hard = [
  "kk-004", "kk-005", "kk-009", "kk-011", "kk-014", "kk-015",
  "kk-022", "kk-028", "kk-033", "kk-043", "kk-066", "kk-067",
  "kk-072", "kk-078", "kk-080", "kk-090"
];
const all = [];
for (let i = 1; i <= 90; i++) all.push("kk-" + String(i).padStart(3, "0"));

const questions = {};
all.forEach(id => { questions[id] = { level: "medium" }; });
easy.forEach(id => { questions[id] = { level: "easy" }; });
hard.forEach(id => { questions[id] = { level: "hard" }; });
module.exports = { questions };
