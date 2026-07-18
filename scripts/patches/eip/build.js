/* Assembles data/eip.json from the per-section modules b1.js … b9.js + cards.js */
const fs = require("fs");
const path = require("path");

const sections = [];
const questions = [];
for (let i = 1; i <= 9; i++) {
  const m = require("./b" + i + ".js");
  sections.push(m.section);
  questions.push(...m.questions);
}
const cards = require("./cards.js");

const cert = {
  id: "eip",
  kind: "book",
  vendor: "Books",
  short: "EIP",
  name: "Enterprise Integration Patterns",
  book: { authors: "Gregor Hohpe & Bobby Woolf", year: 2003 },
  sections,
  questions,
  cards
};

const out = path.join(__dirname, "..", "..", "..", "data", "eip.json");
fs.writeFileSync(out, JSON.stringify(cert, null, 1) + "\n");
console.log("Wrote", out, "—", sections.length, "sections,", questions.length, "questions,", cards.length, "cards");
