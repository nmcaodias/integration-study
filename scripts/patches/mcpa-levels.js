/* MCPA · classify the 72 unleveled questions (pa-001..pa-072).
 * easy   = recall/definition; medium = single-concept application;
 * hard   = multi-concept governance/architecture scenario, a known trap, or a
 *          subtle select-all/matching. Level-only patches. */
const easy = [
  "pa-003", "pa-008", "pa-010", "pa-012", "pa-042", "pa-046", "pa-070"
];
const hard = [
  "pa-009", "pa-022", "pa-025", "pa-031", "pa-037", "pa-039",
  "pa-041", "pa-043", "pa-051", "pa-055", "pa-060"
];
const all = [];
for (let i = 1; i <= 72; i++) all.push("pa-" + String(i).padStart(3, "0"));

const questions = {};
all.forEach(id => { questions[id] = { level: "medium" }; });
easy.forEach(id => { questions[id] = { level: "easy" }; });
hard.forEach(id => { questions[id] = { level: "hard" }; });
module.exports = { questions };
