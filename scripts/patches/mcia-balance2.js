/* MCIA · second light balance round. Raise the shortest distractor on high-ratio
 * questions where the correct option is NOT the longest, to pull the bank ratio
 * toward ~1.3x without reintroducing a longest-correct tell. Distractors stay
 * plausible-but-wrong; meaning/answers unchanged. */
module.exports = {
  questions: {
    "ia-063": { optionEdits: { 0: "The application log files written by each running Mule worker" } },
    "ia-065": { optionEdits: { 2: "Test-driven development practice for building the application" } },
    "ia-097": { optionEdits: { 2: "They are discarded by default unless a file appender is configured" } },
    "ia-084": { optionEdits: { 2: "It breaks the app's classloader isolation between the deployed modules" } },
    "ia-118": { optionEdits: { 1: "Double the process API's worker count to push more load downstream" } },
    "ia-050": { optionEdits: { 3: "Deleting messages that fail to process so the queue keeps flowing" } },
    "ia-047": { optionEdits: { 2: "It only works with the HTTP connector and no other transport" } },
    "ia-059": { optionEdits: { 3: "Basic authentication using each consumer's Okta account password" } },
    "ia-042": { optionEdits: { 2: "Measuring code coverage of Mule flows during the unit-test phase" } },
    "ia-061": { optionEdits: { 0: "DataWeave source obfuscation and application code signing" } },
    "ia-092": { optionEdits: { 2: "Lower the ERP's request timeouts so failing calls return faster" } },
    "ia-056": { optionEdits: { 2: "A Scatter-Gather fanning out across all of the records at once" } },
    "ia-038": { optionEdits: { 2: "A manual test performed by hand against the production system" } },
    "ia-086": { optionEdits: { 3: "It mocks all of the flow's sources across the whole test suite" } },
    "ia-122": { optionEdits: { 3: "Reviewing the monitoring dashboards manually every single morning" } }
  }
};
