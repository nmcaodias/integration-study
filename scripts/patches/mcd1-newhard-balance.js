/* MCD1 · length-balance the new/upgraded hard questions: extend the top
 * distractor just past the correct answer in ~13 questions so the bank's
 * longest-correct guard stays in the 25-40% band. Answers unchanged. */
module.exports = {
  questions: {
    "m1-232": { optionEdits: { 2: "The router forwards the raw, unvalidated request straight to the implementation flows, which must each re-validate every parameter against the RAML themselves before use" } },
    "m1-235": { optionEdits: { 1: "A is required whenever query parameters must be validated at runtime, because the APIkit router is only able to validate URI parameters against the published specification" } },
    "m1-240": { optionEdits: { 1: "Coerce the payload with 'as String' at the top of the script so DataWeave can process the whole file efficiently as one contiguous block of in-memory text" } },
    "m1-244": { optionEdits: { 1: "payload = { \"stock\": 9 } while attributes keep the original listener metadata untouched so the eventual HTTP response can still be correlated with it" } },
    "m1-245": { optionEdits: { 2: "No error is raised — Scatter-Gather returns the successful routes in the result object and silently omits the failed route from the aggregated payload entirely" } },
    "m1-246": { optionEdits: { 2: "Requests 1 and 3 — a missing tier field is treated as premium because null comparisons in when expressions match permissively rather than strictly" } },
    "m1-247": { optionEdits: { 1: "A single object keyed by column name holding parallel arrays of values per column, safe to log because the connector always materializes its results fully before returning" } },
    "m1-249": { optionEdits: { 3: "0 records reach step2, because any record failure inside a step immediately aborts all of the remaining steps for the whole running batch job instance" } },
    "m1-046": { optionEdits: { 2: "map cannot be used at all when the output format is XML; a For Each scope must build the repeated elements one at a time and append them to a variable instead" } },
    "m1-068": { optionEdits: { 2: "The application must be repackaged with a special debug classifier before deployment so that breakpoints can bind to the processor locations at runtime" } },
    "m1-070": { optionEdits: { 1: "It is a WAR file that must be dropped into a servlet container such as Tomcat running alongside the Mule runtime services layer to become servable" } },
    "m1-097": { optionEdits: { 1: "It runs once per successful record, receiving each of the 7 surviving records as its payload in turn so they can be individually acknowledged" } },
    "m1-013": { optionEdits: { 3: "queryParams.dryRun is already a Boolean value, because Mule coerces recognizable true/false literals automatically when the request is received" } }
  }
};
