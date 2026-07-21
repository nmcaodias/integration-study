/* MCIA · classify the 97 unleveled questions.
 * easy   = recall/definition ("which statement is TRUE", "what is X used for")
 * medium = single-concept application to a scenario
 * hard   = multi-concept architecture scenario, a known trap, or a subtle
 *          select-all/matching. Level-only patches. */
const easy = [
  "ia-004", "ia-008", "ia-014", "ia-019", "ia-023", "ia-025", "ia-027",
  "ia-029", "ia-034", "ia-036", "ia-040", "ia-042", "ia-048", "ia-057",
  "ia-061", "ia-071", "ia-076", "ia-097"
];
const hard = [
  "ia-013", "ia-024", "ia-026", "ia-028", "ia-031", "ia-045", "ia-049",
  "ia-054", "ia-056", "ia-074", "ia-077", "ia-080", "ia-082", "ia-083",
  "ia-087", "ia-090", "ia-091", "ia-092", "ia-093"
];
// every other unleveled id -> medium
const all = [];
for (let i = 1; i <= 97; i++) all.push("ia-" + String(i).padStart(3, "0"));

const questions = {};
all.forEach(id => { questions[id] = { level: "medium" }; });
easy.forEach(id => { questions[id] = { level: "easy" }; });
hard.forEach(id => { questions[id] = { level: "hard" }; });
module.exports = { questions };
