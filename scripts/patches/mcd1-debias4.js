/* MCD1 · fourth de-bias pass — remaining worst-margin (mostly exhibit) questions.
 * All have optionNotes/explanations, so the correct option is trimmed (detail
 * preserved in the reveal) and/or a plausible distractor lengthened. */
module.exports = {
  questions: {
    "m1-077": { optionEdits: {
      1: "Traits apply to methods via 'is:'; resourceTypes to resources via 'type:'" } },
    "m1-099": { optionEdits: {
      1: "The incoming event before the transform runs, fully inspectable" } },
    "m1-105": { optionEdits: {
      0: "It fails / invalid XML — the array must be wrapped as repeated elements with {( ... )}" } },
    "m1-124": { optionEdits: {
      3: "get:/orders, post:/orders, get:/orders/{orderId} — the RAML paths, not the APIkit flow names" } },
    "m1-138": { optionEdits: {
      0: "vars.status='pending', original payload — the async branch ran on a copy" } },
    "m1-147": { optionEdits: {
      0: "Scope 1 — MULE:ANY matches first, top-down" } },
    "m1-148": { optionEdits: {
      0: "Flow continues past the Try; vars.enriched='false'" } },
    "m1-152": { optionEdits: {
      0: "Flow a: all errors. Flow b: none — a defined handler replaces the default",
      3: "Neither flow — a global handler must be explicitly referenced from within each flow" } },
    "m1-159": { optionEdits: {
      0: "The trait's offset & limit query params merge into GET /flights" } },
    "m1-162": { optionEdits: {
      0: "200 returns a JSON Flight array; example from a NamedExample fragment" } },
    "m1-164": { optionEdits: {
      0: "A addresses one flight by path, B filters the list" } },
    "m1-167": { optionEdits: {
      0: "Requests resolve to /v2/orders; {version} comes from the version property",
      1: "The client must send the API version in a custom request header on every call" } },
    "m1-170": { optionEdits: {
      0: "It concatenates user input into SQL (injection); use an input parameter :dest instead",
      1: "SELECT * is forbidden by the Mule Database connector and must list columns explicitly" } },
    "m1-174": { optionEdits: {
      0: "Post-process the file: move, rename, or delete it after processing",
      2: "A Transform Message placed inside the listener to mark files as processed" } },
    "m1-187": { optionEdits: {
      0: "VALIDATION:INVALID_EMAIL is thrown; the logger does not run" } },
    "m1-192": { optionEdits: {
      0: "The original payload; the flow continues while the batch runs asynchronously",
      1: "The BatchJobResult object holding total, successful, and failed record counts" } },
    "m1-194": { optionEdits: {
      0: "R skips step 2 but enters step 3 (builds the error report)" } },
    "m1-195": { optionEdits: {
      0: "Collect records into groups of 200 for one bulk call per group",
      1: "To deliberately slow down processing so downstream rate limits aren't exceeded" } },
    "m1-199": { optionEdits: {
      0: "An os:store writing the new max timestamp to 'lastSync' after success",
      3: "Nothing — the os:retrieve alone is enough to maintain the watermark automatically" } },
    "m1-203": { optionEdits: {
      0: "Iterates over payload.orders (not the root), giving the insert 50-element chunks",
      3: "The batchSize attribute converts the For Each scope into a Batch Job automatically" } },
    "m1-204": { optionEdits: {
      0: "The Transform in POST /orders failed converting 'ABC' to a Number",
      2: "The target database column is defined with the wrong data type for the value" } },
    "m1-205": { optionEdits: {
      0: "Supply the missing property in the env file or as a -D property",
      2: "Add the property directly inside the flow XML as a hardcoded variable value" } },
    "m1-219": { optionEdits: {
      0: "Decrypted at runtime using a deployment key; secure:: is required",
      1: "The password is stored in plain text, just tagged with a marker prefix" } }
  }
};
