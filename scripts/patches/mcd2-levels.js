/* MCD2 · classify the 97 unleveled questions.
 * easy = recall/definition; medium = single-concept application;
 * hard = multi-concept scenario or a known trap. Level-only patches. */
const easy = [
  "m2-003", "m2-010", "m2-017", "m2-020", "m2-021", "m2-032", "m2-037",
  "m2-039", "m2-040", "m2-045", "m2-051", "m2-060", "m2-061", "m2-062",
  "m2-066", "m2-082"
];
const hard = [
  "m2-005", "m2-008", "m2-009", "m2-014", "m2-026", "m2-031", "m2-036",
  "m2-043", "m2-047", "m2-049", "m2-070", "m2-073", "m2-074", "m2-076",
  "m2-077", "m2-078", "m2-079", "m2-080", "m2-081", "m2-084", "m2-086",
  "m2-087", "m2-088", "m2-091", "m2-095", "m2-096"
];
// everything else unleveled -> medium
const allUnleveled = [];
for (let i = 1; i <= 97; i++) allUnleveled.push("m2-" + String(i).padStart(3, "0"));

const questions = {};
allUnleveled.forEach(id => { questions[id] = { level: "medium" }; });
easy.forEach(id => { questions[id] = { level: "easy" }; });
hard.forEach(id => { questions[id] = { level: "hard" }; });
module.exports = { questions };
