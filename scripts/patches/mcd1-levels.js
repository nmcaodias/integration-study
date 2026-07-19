/* MCD1 · classify the 100 unleveled questions (the original bank batch).
 * easy = pure recall/definition; medium = single-concept application;
 * hard = multi-concept reasoning or a known trap. Level-only patches. */
const easy = [
  "m1-001", "m1-004", "m1-007", "m1-010", "m1-013", "m1-014", "m1-018",
  "m1-023", "m1-028", "m1-039", "m1-041", "m1-046", "m1-051", "m1-058",
  "m1-059", "m1-065", "m1-068", "m1-070", "m1-080", "m1-094", "m1-097",
  "m1-099"
];
const hard = [
  "m1-036", "m1-037", "m1-038", "m1-042", "m1-062", "m1-064", "m1-072",
  "m1-073", "m1-081", "m1-083", "m1-085", "m1-087", "m1-088", "m1-089",
  "m1-092", "m1-098"
];
const medium = [
  "m1-002", "m1-003", "m1-005", "m1-006", "m1-008", "m1-009", "m1-011",
  "m1-012", "m1-015", "m1-016", "m1-017", "m1-019", "m1-020", "m1-021",
  "m1-022", "m1-024", "m1-025", "m1-026", "m1-027", "m1-029", "m1-030",
  "m1-031", "m1-032", "m1-033", "m1-034", "m1-035", "m1-040", "m1-043",
  "m1-044", "m1-045", "m1-047", "m1-048", "m1-049", "m1-050", "m1-052",
  "m1-053", "m1-054", "m1-055", "m1-056", "m1-057", "m1-060", "m1-061",
  "m1-063", "m1-066", "m1-067", "m1-069", "m1-071", "m1-074", "m1-075",
  "m1-076", "m1-077", "m1-078", "m1-079", "m1-082", "m1-084", "m1-086",
  "m1-090", "m1-091", "m1-093", "m1-095", "m1-096", "m1-100"
];

const questions = {};
easy.forEach(id => { questions[id] = { level: "easy" }; });
medium.forEach(id => { questions[id] = { level: "medium" }; });
hard.forEach(id => { questions[id] = { level: "hard" }; });
module.exports = { questions };
