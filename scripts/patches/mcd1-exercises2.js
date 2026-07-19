/* MCD1 · hands-on exercises (part 2: s3 events, s5 APIkit, s6 routing,
 * s7 error handling, s10 records). */
module.exports = {
  addExercises: [
    {
      id: "m1-ex-07",
      section: "s3",
      title: "Trace payload, vars, and target through a flow",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>Build the flow sketched below, then <strong>predict</strong> the value of <code>payload</code> and <code>vars.stock</code> at the three marked points before running the Debugger to verify. The HTTP Request should call any echo/mock endpoint that returns <code>{\"stock\": 3}</code> (a second flow in the same app works fine).</p>",
      given: [
        { label: "Flow sketch", code: "<flow name=\"orders\">\n  <http:listener path=\"/orders\"/>          <!-- request body: {\"id\": 7} -->\n  <set-variable variableName=\"orderId\" value=\"#[payload.id]\"/>\n  <!-- POINT 1: payload? vars? -->\n  <http:request method=\"GET\" path=\"/inventory\"\n                target=\"stock\"\n                targetValue=\"#[payload.stock]\"/>\n  <!-- POINT 2: payload? vars.stock? -->\n  <ee:transform>  <!-- set payload to {order: vars.orderId, stock: vars.stock} -->\n  </ee:transform>\n  <!-- POINT 3: payload? -->\n</flow>" }
      ],
      steps: [
        "Create the app with both flows (orders + a /inventory flow returning {\"stock\": 3})",
        "Write down your predictions for the three points first",
        "Add breakpoints at each point and run in Debug mode, posting {\"id\": 7} to /orders",
        "Compare the debugger's payload/vars panels with your predictions"
      ],
      solution: [
        { label: "Expected values", code: "POINT 1: payload = {\"id\": 7}          vars.orderId = 7\nPOINT 2: payload = {\"id\": 7}          vars.stock = 3\n         (target=\"stock\" sends the RESPONSE into the var;\n          targetValue picks .stock out of it; payload untouched)\nPOINT 3: payload = {\"order\": 7, \"stock\": 3}" }
      ],
      solutionNotes: "<p>The point of <code>target</code>/<code>targetValue</code> on an operation: the main payload <strong>survives</strong> the HTTP call, and only the variable receives (part of) the response. Without <code>target</code>, POINT 2's payload would have been <code>{\"stock\": 3}</code> and the original order lost. This is one of the most reliable exam traps — build it once and it sticks.</p>"
    },
    {
      id: "m1-ex-08",
      section: "s5",
      title: "Scaffold an API with APIkit and implement two resources",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>Create a Mule project <strong>from the RAML below</strong> (Studio: New Project → import the spec, keep 'Scaffold flows from these API specifications' checked). Then implement the two generated flows against the in-memory account list given, and exercise both from the APIkit Console.</p>",
      given: [
        { label: "accounts.raml", code: "#%RAML 1.0\ntitle: Accounts API\nversion: v1\nmediaType: application/json\n\n/accounts:\n  get:\n    queryParameters:\n      type:\n        required: false\n        enum: [checking, savings]\n  /{accountId}:\n    get:" },
        { label: "Account data (hardcode in a variable or Transform)", code: "[\n  { \"accountId\": \"11\", \"type\": \"checking\", \"owner\": \"Ana\" },\n  { \"accountId\": \"12\", \"type\": \"savings\",  \"owner\": \"Rui\" },\n  { \"accountId\": \"13\", \"type\": \"checking\", \"owner\": \"Eva\" }\n]" }
      ],
      steps: [
        "Import the RAML and scaffold; inspect what APIkit generated: a main flow, a console flow, and one flow per resource/method",
        "In get:\\accounts:accounts-config — return the list, filtered by attributes.queryParams.'type' when present",
        "In get:\\accounts\\(accountId):accounts-config — select the account matching attributes.uriParams.accountId",
        "Run the app, open the APIkit Console, and call: GET /accounts, GET /accounts?type=savings, GET /accounts/12"
      ],
      solution: [
        { label: "get:\\accounts — Transform Message", code: "%dw 2.0\noutput application/json\nvar accounts = [\n  { accountId: \"11\", \"type\": \"checking\", owner: \"Ana\" },\n  { accountId: \"12\", \"type\": \"savings\",  owner: \"Rui\" },\n  { accountId: \"13\", \"type\": \"checking\", owner: \"Eva\" }\n]\n---\nif (attributes.queryParams.'type'?)\n  accounts filter ($.'type' == attributes.queryParams.'type')\nelse accounts" },
        { label: "get:\\accounts\\(accountId) — Transform Message", code: "%dw 2.0\noutput application/json\nvar accounts = [\n  { accountId: \"11\", \"type\": \"checking\", owner: \"Ana\" },\n  { accountId: \"12\", \"type\": \"savings\",  owner: \"Rui\" },\n  { accountId: \"13\", \"type\": \"checking\", owner: \"Eva\" }\n]\n---\n(accounts filter ($.accountId == attributes.uriParams.accountId))[0]" }
      ],
      solutionNotes: "<p>What to notice while doing it: the generated flow names encode <em>method:\\resource:config</em>; the <strong>main flow</strong> owns the HTTP Listener and the APIkit Router — implementation flows have <em>no</em> listener and are reached only through the router; and the router populates <code>attributes.uriParams</code> / <code>attributes.queryParams</code> for you. Sending <code>?type=gold</code> gets rejected by the router with 400 before your flow ever runs — the enum from the RAML at work.</p>"
    },
    {
      id: "m1-ex-09",
      section: "s5",
      title: "Evolve the RAML and re-scaffold without losing work",
      level: "hard",
      where: "Anypoint Studio",
      task: "<p>Extend the Accounts API from the previous exercise: add a <code>POST /accounts</code> operation and a new <code>/transfers</code> resource (POST only) to the RAML, then <strong>re-scaffold</strong> (right-click the API in the APIkit pane → Generate flows, or the Scaffold button). Verify what APIkit adds — and what it leaves alone.</p>",
      given: [
        { label: "RAML additions", code: "/accounts:\n  post:\n    body:\n      type: object\n  # ...existing get + /{accountId} stay as they were\n\n/transfers:\n  post:\n    body:\n      properties:\n        from: string\n        to: string\n        amount: number" }
      ],
      steps: [
        "Before re-scaffolding: note the flows that exist and add a Logger to one implemented flow (a canary for overwrites)",
        "Update the RAML with the two additions and re-scaffold",
        "Confirm post:\\accounts:... and post:\\transfers:... appeared, and that your implemented GET flows (and the canary Logger) are untouched",
        "Implement post:\\transfers to echo {status: \"accepted\", ref: payload.from ++ \"->\" ++ payload.to} and call it from the console"
      ],
      solution: [
        { label: "What re-scaffolding does", code: "ADDED:    post:\\accounts:accounts-config      (new, empty scaffold)\nADDED:    post:\\transfers:accounts-config     (new, empty scaffold)\nUNCHANGED: get:\\accounts:accounts-config       (your implementation kept)\nUNCHANGED: get:\\accounts\\(accountId):accounts-config\nUNCHANGED: main flow + console flow\n\nRule: scaffolding only creates flows that are MISSING for a\nRAML method; it never rewrites an existing flow's contents." },
        { label: "post:\\transfers — Transform Message", code: "%dw 2.0\noutput application/json\n---\n{\n  status: \"accepted\",\n  ref: payload.\"from\" ++ \"->\" ++ payload.to\n}" }
      ],
      solutionNotes: "<p>The sync workflow the exam expects: <em>spec first</em>, then re-scaffold to grow the implementation. APIkit matches flows to RAML methods <strong>by name</strong> — which is also why renaming a generated flow breaks routing (the router can no longer find <code>get:\\accounts:accounts-config</code>) and requests to that method return <strong>404 with APIKIT:NOT_IMPLEMENTED</strong> behaviour. If you try the rename, put it back exactly as generated.</p>"
    },
    {
      id: "m1-ex-10",
      section: "s5",
      title: "Probe APIkit's request validation — map each failure to its error",
      level: "hard",
      where: "Anypoint Studio",
      task: "<p>Using the running Accounts API, send the five requests below with the console, curl, or Postman. For each, <strong>predict</strong> the HTTP status and which layer produces it (APIkit Router vs. your flow), then verify. Fill in a table like the one in the solution.</p>",
      given: [
        { label: "Requests to probe", code: "1. GET  /api/accounts?type=gold          (enum violated)\n2. GET  /api/refunds                     (resource not in RAML)\n3. POST /api/accounts/12                 (method not declared on resource)\n4. POST /api/transfers  body: { \"from\": \"11\" }   (required fields missing)\n5. GET  /api/accounts/99                 (valid per RAML; account doesn't exist)" }
      ],
      steps: [
        "Write your five predictions first (status code + which component rejects it)",
        "Send each request and record the actual status and response body",
        "For #5, look at what your flow returns when the filter matches nothing — and decide what it SHOULD return"
      ],
      solution: [
        { label: "Answer table", code: "#  Request                     Status  Produced by\n1  ?type=gold                  400     APIkit Router (APIKIT:BAD_REQUEST —\n                                       query param fails the RAML enum)\n2  GET /refunds                404     APIkit Router (APIKIT:NOT_FOUND —\n                                       no such resource in the spec)\n3  POST /accounts/12           405     APIkit Router (APIKIT:METHOD_NOT_ALLOWED)\n4  POST /transfers (bad body)  400     APIkit Router (APIKIT:BAD_REQUEST —\n                                       body fails the RAML type) *\n5  GET /accounts/99            200 with empty/null body — YOUR flow's\n                                       problem: the router validated fine;\n                                       return 404 yourself (set an error\n                                       response or raise APP:NOT_FOUND)\n\n* body validation requires the router's validation enabled (default in\n  scaffolded projects: the main flow maps APIKIT errors to responses)" }
      ],
      solutionNotes: "<p>The mental model: the <strong>router enforces the contract</strong> (URI, method, params, body shape) and raises <code>APIKIT:*</code> errors that the scaffolded main flow's error handler maps to 400/404/405/406/415; <strong>business validity</strong> (account 99 doesn't exist) is yours to detect and signal. Distinguishing 'spec-invalid → router, automatic' from 'data-missing → flow, your code' is precisely what the exam's s5 scenario questions test.</p>"
    },
    {
      id: "m1-ex-11",
      section: "s6",
      title: "Route with Choice, fan out with Scatter-Gather",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>Build a quote service: requests carrying <code>{\"type\": \"express\"}</code> go straight to the <em>express</em> subflow; everything else is quoted by <strong>two carriers in parallel</strong> (Scatter-Gather over two subflows) and the response must be a flat array of both quotes. Predict the Scatter-Gather output shape before flattening it.</p>",
      given: [
        { label: "Subflows to create", code: "expressQuote:  set payload to { carrier: \"EXPRESS\", price: 40 }\ncarrierAQuote: set payload to { carrier: \"A\", price: 12 }\ncarrierBQuote: set payload to { carrier: \"B\", price: 15 }" }
      ],
      steps: [
        "Flow: HTTP Listener → Choice (when #[payload.'type' == \"express\"] → flow-ref expressQuote; otherwise branch → Scatter-Gather with two flow-refs)",
        "Run with {\"type\": \"express\"} and confirm the single express quote returns",
        "Run with {\"type\": \"standard\"}, breakpoint AFTER the Scatter-Gather, and inspect the payload shape",
        "Add a Transform after the Scatter-Gather to emit [quoteA, quoteB] as a flat array"
      ],
      solution: [
        { label: "Scatter-Gather raw output (what the debugger shows)", code: "{\n  \"0\": { \"attributes\": ..., \"payload\": { \"carrier\": \"A\", \"price\": 12 } },\n  \"1\": { \"attributes\": ..., \"payload\": { \"carrier\": \"B\", \"price\": 15 } }\n}" },
        { label: "Flatten transform", code: "%dw 2.0\noutput application/json\n---\npayload pluck ($.payload)" }
      ],
      solutionNotes: "<p>Two exam staples in one build: <strong>Choice</strong> executes exactly one route (first matching <code>when</code>, else <code>otherwise</code>), and <strong>Scatter-Gather</strong> runs all routes concurrently, returning an <em>object keyed by route index</em> whose values are full messages (attributes + payload) — not a bare array. <code>pluck ($.payload)</code> is the idiomatic un-nesting. If any route fails, Scatter-Gather raises <code>MULE:COMPOSITE_ROUTING</code> carrying the per-route outcomes.</p>"
    },
    {
      id: "m1-ex-12",
      section: "s7",
      title: "On-Error Continue vs Propagate — observe the difference",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>Build the two-flow app below, then run the same request against <strong>four configurations</strong> and record (a) the HTTP status the client sees, (b) the response body, and (c) whether the parent flow's final Logger runs. Predict all twelve cells before testing.</p>",
      given: [
        { label: "App sketch", code: "<flow name=\"parent\">\n  <http:listener path=\"/go\"/>\n  <flow-ref name=\"child\"/>\n  <logger message=\"PARENT AFTER CHILD\"/>   <!-- does this run? -->\n  <set-payload value='{\"done\": true}'/>\n</flow>\n\n<flow name=\"child\">\n  <raise-error type=\"APP:BOOM\" description=\"kaput\"/>\n  <error-handler>   <!-- vary this -->\n  </error-handler>\n</flow>\n\nConfigs to test:\n1. child has NO error handler\n2. child: on-error-propagate (sets payload {\"handled\":\"propagate\"})\n3. child: on-error-continue  (sets payload {\"handled\":\"continue\"})\n4. child: on-error-continue, and parent ALSO wraps flow-ref in a\n   Try with on-error-propagate" }
      ],
      steps: [
        "Implement the app once; switch the error-handler variant between runs",
        "Record status / body / did-parent-logger-run for each of the four configs",
        "Explain each row in one sentence before checking the solution"
      ],
      solution: [
        { label: "Answer table", code: "#  Config                        Status  Body                      PARENT AFTER CHILD?\n1  no handler                    500     kaput error payload       no\n2  on-error-propagate            500     {\"handled\":\"propagate\"}   no  (handler runs,\n                                                                       error still thrown)\n3  on-error-continue             200     {\"done\": true}            YES (child 'succeeds'\n                                                                       with handler payload,\n                                                                       parent continues)\n4  continue in child, Try+prop.  200     {\"done\": true}            YES (child handled it;\n   in parent                                                           the Try never sees\n                                                                       an error at all)" }
      ],
      solutionNotes: "<p>The rule to internalize: <strong>Propagate</strong> runs its processors <em>and then re-throws</em>, so the caller still fails; <strong>Continue</strong> swallows the error and the flow behaves as if it succeeded — its handler's last payload becomes the flow's result, and execution resumes <em>after</em> the failed component in the caller, not at it. Config 4 shows why: once the child continues, there is no error left for the parent's Try to catch.</p>"
    },
    {
      id: "m1-ex-13",
      section: "s7",
      title: "Try scope with error mapping and typed handlers",
      level: "hard",
      where: "Anypoint Studio",
      task: "<p>A flow calls two risky operations. Requirement: a failure in the <em>first</em> must return 503 with <code>{\"retry\": true}</code>; a failure in the <em>second</em> must return 400 with <code>{\"retry\": false}</code>; both raise the same error type. Solve it with <strong>Try scopes + error mapping</strong>, not by inspecting messages.</p>",
      given: [
        { label: "Starting flow", code: "<flow name=\"risky\">\n  <http:listener path=\"/run\"/>\n  <raise-error type=\"APP:FAIL\" description=\"step one\"/>   <!-- op 1 (simulated) -->\n  <raise-error type=\"APP:FAIL\" description=\"step two\"/>   <!-- op 2 (simulated) -->\n</flow>\n(comment one out to test the other path)" }
      ],
      steps: [
        "Wrap op 1 in a Try; in its configuration map the raised error to a custom type, e.g. APP:TRANSIENT (error mapping on the operation, or re-raise from a handler)",
        "Wrap op 2 in a Try mapping to APP:PERMANENT",
        "Add ONE flow-level error-handler with two on-error-propagate blocks, one per custom type, each setting the required payload and an httpStatus variable",
        "Set the listener's error response status to #[vars.httpStatus] and verify both paths with curl"
      ],
      solution: [
        { label: "Flow (essential XML)", code: "<flow name=\"risky\">\n  <http:listener path=\"/run\" config-ref=\"HTTP_Listener_config\">\n    <http:error-response statusCode=\"#[vars.httpStatus default 500]\"\n                         body=\"#[payload]\"/>\n  </http:listener>\n\n  <try>\n    <raise-error type=\"APP:FAIL\" description=\"step one\"/>\n    <error-handler>\n      <on-error-propagate type=\"APP:FAIL\">\n        <raise-error type=\"APP:TRANSIENT\" description=\"op1 failed\"/>\n      </on-error-propagate>\n    </error-handler>\n  </try>\n\n  <try>\n    <raise-error type=\"APP:FAIL\" description=\"step two\"/>\n    <error-handler>\n      <on-error-propagate type=\"APP:FAIL\">\n        <raise-error type=\"APP:PERMANENT\" description=\"op2 failed\"/>\n      </on-error-propagate>\n    </error-handler>\n  </try>\n\n  <error-handler>\n    <on-error-propagate type=\"APP:TRANSIENT\">\n      <set-variable variableName=\"httpStatus\" value=\"503\"/>\n      <set-payload value='{\"retry\": true}' mimeType=\"application/json\"/>\n    </on-error-propagate>\n    <on-error-propagate type=\"APP:PERMANENT\">\n      <set-variable variableName=\"httpStatus\" value=\"400\"/>\n      <set-payload value='{\"retry\": false}' mimeType=\"application/json\"/>\n    </on-error-propagate>\n  </error-handler>\n</flow>" }
      ],
      solutionNotes: "<p>The technique: give identical low-level errors <em>distinct custom types</em> at the place where you still know the context (which step failed), then let one flow-level handler dispatch on <code>type=</code>. Real connectors support this declaratively via the operation's <strong>error mapping</strong> tab (map <code>HTTP:CONNECTIVITY</code> → <code>APP:TRANSIENT</code>) — the re-raise inside a Try shown here is the simulation-friendly equivalent. Note how each handler is chosen by error type, top to bottom, first match wins.</p>"
    },
    {
      id: "m1-ex-14",
      section: "s10",
      title: "For Each vs Parallel For Each — payload and ordering",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>Process the given list with a <strong>For Each</strong> and then with a <strong>Parallel For Each</strong>, logging <code>payload.id</code> inside each. Predict for both scopes: the log order, and what <code>payload</code> is <em>after</em> the scope completes. Then verify.</p>",
      given: [
        { label: "Input (POST body to your listener)", code: "[ {\"id\": 1}, {\"id\": 2}, {\"id\": 3}, {\"id\": 4} ]" },
        { label: "Inside each scope", code: "<logger message=\"#['processing ' ++ payload.id]\"/>\n<set-payload value=\"#[{ id: payload.id, ok: true }]\"/>" }
      ],
      steps: [
        "Build flow A with For Each, run, note log order and the payload AFTER the scope (breakpoint)",
        "Build flow B with Parallel For Each, same observations",
        "Explain the difference in one sentence each before revealing"
      ],
      solution: [
        { label: "Observed behaviour", code: "For Each:\n  log order: 1,2,3,4 (strictly sequential)\n  payload after scope: the ORIGINAL array [{id:1},...,{id:4}]\n  (per-iteration modifications are discarded; use vars to accumulate)\n\nParallel For Each:\n  log order: interleaved / non-deterministic\n  payload after scope: the COLLECTED results, in input order:\n  [ {id:1, ok:true}, {id:2, ok:true}, {id:3, ok:true}, {id:4, ok:true} ]" }
      ],
      solutionNotes: "<p>The two scopes answer different questions: <strong>For Each</strong> is a sequential side-effect loop whose output payload reverts to the input collection; <strong>Parallel For Each</strong> executes routes concurrently and its output <em>is</em> the list of per-item results (assembled back in input order, even though execution order isn't). If you need each item's result from a For Each, you must stash it in a variable yourself — a favourite exam distinction.</p>"
    },
    {
      id: "m1-ex-15",
      section: "s10",
      title: "Batch job with failing records and an on-complete report",
      level: "hard",
      where: "Anypoint Studio",
      task: "<p>Load the 6 customer records through a <strong>Batch Job</strong>: step 1 validates (reject records with a missing email by raising an error), step 2 'delivers' only the valid ones (Logger), and On Complete logs a summary. Configure <code>max-failed-records</code> so the job survives both bad records, and predict the summary counts before running.</p>",
      given: [
        { label: "Input (POST body)", code: "[\n  { \"name\": \"Ana\", \"email\": \"ana@x.pt\" },\n  { \"name\": \"Rui\" },\n  { \"name\": \"Eva\", \"email\": \"eva@x.pt\" },\n  { \"name\": \"Tom\" },\n  { \"name\": \"Ines\", \"email\": \"ines@x.pt\" },\n  { \"name\": \"Zeca\", \"email\": \"zeca@x.pt\" }\n]" }
      ],
      steps: [
        "Batch Job (maxFailedRecords=-1) → Step 1: Choice or validation raising APP:INVALID when email is null",
        "Step 2: acceptPolicy=NO_FAILURES (only records that survived step 1) with a Logger",
        "On Complete: log payload.totalRecords, payload.successfulRecords, payload.failedRecords",
        "Also note what the FLOW's payload is immediately after the batch:job element, and check the app log's async behaviour"
      ],
      solution: [
        { label: "Predicted results", code: "Step 2 logs: Ana, Eva, Ines, Zeca             (4 records; the 2 failed\n                                               ones are skipped by\n                                               acceptPolicy NO_FAILURES)\nOn Complete summary:\n  totalRecords:      6\n  successfulRecords: 4\n  failedRecords:     2\n\nAfter <batch:job> in the flow: payload is a BatchJobResult-style\nsummary immediately — the job runs ASYNCHRONOUSLY; the caller does\nnot wait for records to finish. maxFailedRecords=-1 means 'never\nstop the job for failed records' (0 would stop at the first)." }
      ],
      solutionNotes: "<p>Batch's exam-critical traits, all visible in this build: record-level error isolation (a bad record fails alone), <code>maxFailedRecords</code> (-1 = unlimited, 0 = stop on first), step <code>acceptPolicy</code> (NO_FAILURES / ONLY_FAILURES / ALL) as the routing between steps, the <strong>On Complete</strong> phase receiving the statistics object rather than the records, and the job's asynchronous hand-off back to the triggering flow.</p>"
    }
  ]
};
