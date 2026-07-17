/* MCD1 · third de-bias pass — worst-margin questions (correct answer was the
 * obvious longest). These already carry optionNotes/explanations, so trimming
 * the correct OPTION text loses no teaching value; one plausible distractor is
 * lengthened so it becomes the longest option. Meaning/answers unchanged. */
module.exports = {
  questions: {
    "m1-155": { optionEdits: {
      0: "HTTP 500 — it propagates to the main flow whose handler has no VALIDATION mapping",
      1: "HTTP 400 automatically, because APIkit always classifies validation failures as client bad requests",
      2: "HTTP 200 with an empty response body",
      3: "The request hangs until the client eventually times out" } },
    "m1-207": { optionEdits: {
      0: "The payload is a stream; log #[payload as String] to see its content (this consumes it)",
      2: "The Logger's level is set too low, so it prints the object's class name instead of the content" } },
    "m1-178": { optionEdits: {
      0: "One typed operation per method with DataSense metadata, not hand-built request URLs",
      1: "It is the only supported way to call secured HTTPS endpoints from within a Mule application" } },
    "m1-225": { optionEdits: {
      0: "Hidden Runtime Manager properties, plus secureProperties in mule-artifact.json",
      1: "Encrypting the packaged JAR file so property values cannot be read from it at rest" } },
    "m1-220": { optionEdits: {
      0: "Scale out to multiple workers so the load balancer keeps it available during restarts",
      1: "Deploy a single much larger worker with additional vCores to absorb the restart window" } },
    "m1-173": { optionEdits: {
      0: "A Transform before the Consume operation shows the WSDL-derived SOAP body to map",
      1: "The developer must read the WSDL by hand and write the entire SOAP envelope as a string" } },
    "m1-150": { optionEdits: {
      0: "Map each operation's HTTP:NOT_FOUND to a custom type, then handle those types",
      1: "Compare the error.description text inside a when expression to tell the two apart" } },
    "m1-141": { optionEdits: {
      0: "A unique id set when the source creates the event, carried through the flow",
      1: "A random value that every processor regenerates as the event passes through it" } },
    "m1-200": { optionEdits: {
      0: "The watermark tracks the highest id seen, so only newer rows are emitted each poll",
      3: "They are decorative; without them the source would still re-read the entire table each poll" } },
    "m1-189": { optionEdits: {
      0: "Each route ran on its own event copy; those vars aren't merged into the flow's vars",
      3: "Setting variables inside a Scatter-Gather route raises a MULE:COMPOSITE_ROUTING error" } },
    "m1-128": { optionEdits: {
      0: "Set an httpStatus variable or the listener's response status field; otherwise it returns 200",
      1: "APIkit reads the RAML and automatically returns 201 Created for every POST implementation flow" } },
    "m1-222": { optionEdits: {
      0: "Edit the policy on the API instance in API Manager; no redeploy needed",
      1: "Rebuild the Mule application and redeploy it with the new rate-limit value baked in" } },
    "m1-127": { optionEdits: {
      0: "Right-click the API in Studio → Scaffold flows; existing flows are preserved",
      3: "Nothing — APIkit picks up spec changes at runtime and adds the flows automatically" } },
    "m1-168": { optionEdits: {
      0: "One example reused across methods and specs, maintained in one place",
      2: "NamedExample fragments are validated by the platform while inline examples are not checked" } },
    "m1-215": { optionEdits: {
      0: "All files in src/main/mule combine into one app at deploy; globals centralize config",
      3: "Global elements must be redefined inside every configuration file that references them" } },
    "m1-135": { optionEdits: {
      0: "Database result metadata; the Select replaced the listener attributes",
      1: "The original HTTP Listener attributes (headers, queryParams), still present unchanged" } },
    "m1-161": { optionEdits: {
      0: "Design → simulate with the mock → gather feedback → validate the contract",
      2: "Deploy an API proxy first, then design, then mock, and finally implement the flows" } },
    "m1-210": { optionEdits: {
      0: "src/main/resources/log4j2.xml; categories match logger names to set level/appender",
      1: "mule-artifact.json, where logger category settings are ignored by the runtime at startup" } },
    "m1-157": { optionEdits: {
      0: "Mule's default handler logs and propagates it; the client gets a 500",
      3: "The error is stored for later reprocessing by the runtime's built-in dead-letter queue" } },
    "m1-129": { optionEdits: {
      0: "APIkit rejects it with APIKIT:BAD_REQUEST (400); the URI param fails type validation",
      2: "The router returns 404 Not Found because flight ABC does not exist in the backend database" } },
    "m1-202": { optionEdits: {
      0: "Persistent queues for crash survival; maxFailedRecords=-1 for tolerance; On Complete report",
      2: "Crash survival = maxFailedRecords; tolerance = persistent queues; report = accept policies filter" } },
    "m1-209": { optionEdits: {
      0: "An earlier processor (1 or 2) throws before execution reaches the breakpoint",
      1: "Breakpoints only take effect on Transform Message components, not on Choice routers" } },
    "m1-181": { optionEdits: {
      0: "Adds the driver's groupId/artifactId/version to pom.xml so it loads at runtime",
      3: "Adds only a <sharedLibraries> entry to the pom, without the Maven dependency itself" } },
    "m1-163": { optionEdits: {
      0: "Publish the DataType fragment to Exchange and add it to each spec as a dependency (uses:)",
      2: "Define the type once in the first API and have every other API reference that API's live URL" } },
    "m1-224": { optionEdits: {
      0: "A deployable application JAR in target/ (after MUnit tests run)",
      3: "Nothing is produced unless the -DmuleDeploy flag is supplied to Maven" } },
    "m1-176": { optionEdits: {
      0: "The Database connector's On Table Row listener (polls using a watermark column)",
      2: "A JMS On New Message listener subscribed to the database's change-notification topic" } },
    "m1-136": { optionEdits: {
      0: "Transform Message — it can set multiple outputs: the payload and any variables",
      1: "Set Variable — it can also transform and replace the current payload at the same time" } },
    "m1-185": { optionEdits: {
      0: "First Successful — tries routes in order until one completes without error",
      3: "Choice with a when condition on vars.attempt that counts and routes the retries" } },
    "m1-100": { optionEdits: {
      1: "Request access in Exchange for a client app + tier, then send its credentials each call",
      0: "Nothing; the SLA rate-limiting policy only monitors and reports on the traffic in the background" } },
    "m1-151": { optionEdits: {
      0: "Raise Error with a custom type like APP:ORDER_REJECTED and a description",
      3: "A Choice route whose branch logs the reason and then ends the flow quietly" } },
    "m1-143": { optionEdits: {
      0: "Each processor produces a NEW event; components never modify the event in place",
      3: "Immutability means the event and its data cannot be passed across flow boundaries" } },
    "m1-206": { optionEdits: {
      0: "Type it into the debugger's expression evaluator against the paused event",
      3: "DataWeave expressions cannot be evaluated while execution is paused on a breakpoint" } }
  }
};
