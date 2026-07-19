/* MCD1 · new hard questions across s3/s6/s7/s8/s9/s10/s12 — exhibit-heavy,
 * multi-concept scenarios in the real exam's style. */
module.exports = {
  addQuestions: [
    {
      id: "m1-238", section: "s8", level: "hard",
      q: "Refer to the exhibit. What does the script output?",
      exhibit: "%dw 2.0\noutput application/json\nvar data = [\n  { \"team\": \"A\", \"pts\": 3 },\n  { \"team\": \"B\", \"pts\": 1 },\n  { \"team\": \"A\", \"pts\": 0 },\n  { \"team\": \"B\", \"pts\": 3 }\n]\n---\ndata groupBy $.team\n     mapObject ((v, k) -> { (k): sum(v.pts) })",
      options: [
        "{ \"A\": 3, \"B\": 4 }",
        "[ { \"A\": 3 }, { \"B\": 4 } ]",
        "{ \"A\": [3, 0], \"B\": [1, 3] }",
        "{ \"team\": 7 }"
      ],
      answer: 0,
      optionNotes: [
        "Correct — groupBy yields { A: [...], B: [...] }; mapObject rebuilds it with each key mapped to sum(v.pts), where v.pts multi-selects the group's values.",
        "mapObject returns an object, not an array of objects (that would be pluck).",
        "That's the intermediate groupBy result before the mapObject collapses each group.",
        "Keys are the team values, and the sums stay per-group."
      ],
      explanation: "groupBy → object of arrays; mapObject((value, key) -> {(key): ...}) transforms it in place; v.pts uses the multi-value selector across the group's objects. Chains like this are core exam DataWeave."
    },
    {
      id: "m1-239", section: "s8", level: "hard",
      q: "Refer to the exhibit. Which expression produces EXACTLY the wanted output?",
      exhibit: "payload = { \"a\": 1, \"b\": null, \"c\": 3 }\nwanted  = { \"a\": 1, \"c\": 3 }",
      options: [
        "payload filterObject ((v) -> v != null)",
        "payload filter ((v) -> v != null)",
        "payload map ((v) -> if (v != null) v else {})",
        "payload -- { b: null }"
      ],
      answer: 0,
      optionNotes: [
        "Correct — filterObject keeps an object's entries whose value passes the predicate.",
        "filter operates on arrays; applied to an object it doesn't drop entries this way.",
        "map is for arrays and would not return an object of the wanted shape.",
        "-- removes by matching key:value pairs, but hardcodes 'b' — it doesn't generalize to any null."
      ],
      explanation: "Object counterparts matter: filterObject / mapObject / pluck work on objects the way filter / map work on arrays. Removing null-valued entries generically is filterObject with a value predicate (or the writer's skipNullOn)."
    },
    {
      id: "m1-240", section: "s8", level: "hard",
      q: "A Transform's input payload is a 400 MB CSV stream read by a File listener. The script is 'output application/json --- payload map (...)' and works in tests but exhausts worker memory in production. Which change keeps the transformation but bounds memory?",
      options: [
        "Enable streaming on the CSV reader (streaming=true) and deferred output on the writer, keeping access strictly sequential",
        "Coerce the payload with 'as String' first so DataWeave can process the file as one contiguous block of text",
        "Wrap the Transform in an Async scope so the main flow's thread is not blocked while the mapping runs",
        "Raise the JVM heap via a deployment property, since DataWeave always materializes its input before mapping"
      ],
      answer: 0,
      optionNotes: [
        "Correct — reader streaming plus deferred writer output lets map process record-by-record without materializing 400 MB, as long as access is single-pass and in order.",
        "as String forces the whole file into memory — the opposite of the goal.",
        "Async moves the work to another thread; the memory profile is unchanged.",
        "Heap-sizing is a band-aid; DataWeave can stream when configured to."
      ],
      explanation: "For large sequential data: reader property streaming=true, writer deferred=true, and a script that reads forward only. That combination is what turns map into a bounded-memory pipeline."
    },
    {
      id: "m1-241", section: "s7", level: "hard",
      q: "Refer to the exhibit. The client POSTs to /go. What response does it receive?",
      exhibit: "<flow name=\"go\">\n  <http:listener path=\"/go\"/>\n  <try>\n    <raise-error type=\"APP:X\"/>\n    <error-handler>\n      <on-error-continue type=\"APP:X\">\n        <set-payload value='\"try handled\"'/>\n      </on-error-continue>\n    </error-handler>\n  </try>\n  <raise-error type=\"APP:Y\"/>\n  <error-handler>\n    <on-error-continue type=\"APP:X\">\n      <set-payload value='\"flow handled X\"'/>\n    </on-error-continue>\n  </error-handler>\n</flow>",
      options: [
        "500 error response — APP:Y propagates because the flow handler only matches APP:X",
        "200 with \"flow handled X\" — the flow-level handler catches whatever the Try passed on",
        "200 with \"try handled\" — the Try's payload becomes the final response and APP:Y is skipped",
        "500 — the second raise-error re-triggers the Try scope's handler, which cannot run twice"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the Try handles APP:X and execution continues to raise APP:Y; the flow's only handler matches APP:X, so APP:Y is unhandled → error response (500).",
        "Handlers match by type — APP:Y doesn't match the APP:X handler.",
        "After the Try continues, execution proceeds and hits the second error.",
        "The Try's handler is out of scope for errors raised after the Try."
      ],
      explanation: "Trace it step by step: Try swallows APP:X (continue), flow resumes, APP:Y is raised, no matching handler exists at flow level → the default propagation produces the error response. Type-matching is exact, not 'any'."
    },
    {
      id: "m1-242", section: "s7", level: "hard",
      q: "An HTTP Request operation is configured with error mapping HTTP:NOT_FOUND → APP:NO_CUSTOMER. The flow's error handler has scopes for HTTP:NOT_FOUND (first) and APP:NO_CUSTOMER (second). The remote API returns 404. Which scope runs?",
      options: [
        "The APP:NO_CUSTOMER scope — mapping replaces the error's type before handlers evaluate, so HTTP:NOT_FOUND no longer matches",
        "The HTTP:NOT_FOUND scope — mapping only adds an alias while handlers still see the original connector error type first",
        "Both scopes in order — a mapped error carries two types, and every matching scope in the handler chain executes",
        "Neither scope — mapped custom types can only be matched inside the Try scope that surrounds the mapped operation"
      ],
      answer: 0,
      optionNotes: [
        "Correct — error mapping rewrites the raised type at the operation; handlers evaluate against APP:NO_CUSTOMER, so the first scope no longer matches and the second does.",
        "The original type is replaced, not aliased.",
        "Exactly one handler scope runs — the first whose type matches.",
        "Mapped types are ordinary error types, matchable in any handler."
      ],
      explanation: "Error mapping converts the operation's raised error into the custom type before any handler sees it — which is precisely how identical low-level errors from different operations become distinguishable by type."
    },
    {
      id: "m1-243", section: "s3", level: "hard",
      q: "Refer to the exhibit. What are the payload and vars.original in flowB's Logger, and in flowA's Logger?",
      exhibit: "<flow name=\"flowA\">\n  <http:listener path=\"/a\"/>          <!-- request body: \"start\" -->\n  <set-variable variableName=\"original\" value=\"#[payload]\"/>\n  <flow-ref name=\"flowB\"/>\n  <logger/>                            <!-- flowA logger -->\n</flow>\n<flow name=\"flowB\">\n  <set-payload value='\"changed\"'/>\n  <set-variable variableName=\"original\" value='\"overwritten\"'/>\n  <logger/>                            <!-- flowB logger -->\n</flow>",
      options: [
        "flowB: payload \"changed\", vars.original \"overwritten\"; flowA afterwards: payload \"changed\", vars.original \"overwritten\"",
        "flowB: payload \"changed\", vars.original \"overwritten\"; flowA afterwards: payload \"start\", vars.original \"start\"",
        "flowB: payload \"changed\", vars.original \"start\"; flowA afterwards: payload \"changed\", vars.original \"start\"",
        "flowB: payload \"start\", vars.original \"overwritten\"; flowA afterwards: payload \"start\", vars.original \"overwritten\""
      ],
      answer: 0,
      optionNotes: [
        "Correct — a Flow Reference passes the whole event; changes to payload AND vars made in the called flow travel back with it.",
        "Nothing resets on return — the caller continues with the modified event.",
        "flowB overwrote the variable before logging, so it logs \"overwritten\".",
        "set-payload ran before flowB's logger; it logs \"changed\"."
      ],
      explanation: "Flow Reference is a same-event call: the target flow receives payload, attributes, and vars, and every mutation it makes — including variables — is visible to the caller afterwards. No isolation happens."
    },
    {
      id: "m1-244", section: "s3", level: "hard",
      q: "Refer to the exhibit. After the HTTP Request completes, which parts of the event changed?",
      exhibit: "Before the operation:\n  payload    = { \"order\": 1 }\n  attributes = HTTP listener attributes (method, queryParams, ...)\n  vars.note  = \"keep me\"\n\n<http:request method=\"GET\" path=\"/stock\"/>   <!-- no target -->\nResponse: 200, body { \"stock\": 9 }, header x-node: b2",
      options: [
        "payload = { \"stock\": 9 } and attributes now hold the RESPONSE metadata (status 200, headers); vars.note is unchanged",
        "payload = { \"stock\": 9 } while attributes keep the original listener metadata for the eventual HTTP response",
        "payload is unchanged and the response body is stored under attributes.body; vars.note is unchanged",
        "payload = { \"stock\": 9 }, attributes are cleared to null, and vars are reset by the operation boundary"
      ],
      answer: 0,
      optionNotes: [
        "Correct — without a target, the operation replaces payload with the response body AND swaps attributes for response metadata (statusCode, headers); variables always survive.",
        "Attributes don't stay — the listener metadata is gone after the operation (a classic surprise).",
        "There is no attributes.body; the body becomes the payload.",
        "Attributes are replaced, not nulled, and vars are never reset by operations."
      ],
      explanation: "Every connector operation rewrites the message: response body → payload, response metadata → attributes. Only vars persist untouched — which is why anything needed later (like original queryParams) must be saved to a var before the call."
    },
    {
      id: "m1-245", section: "s6", level: "hard",
      q: "Refer to the exhibit. One Scatter-Gather route fails. What does the flow's error handler receive?",
      exhibit: "<scatter-gather>\n  <route> <flow-ref name=\"quoteA\"/> </route>   <!-- succeeds: {price: 12} -->\n  <route> <raise-error type=\"APP:DOWN\"/> </route>\n</scatter-gather>",
      options: [
        "A MULE:COMPOSITE_ROUTING error whose errorMessage carries per-route results: the APP:DOWN failure and quoteA's successful message",
        "The raw APP:DOWN error immediately, because the first route failure aborts the other routes and propagates as-is",
        "No error — Scatter-Gather returns the successful routes and silently omits the failed route from the result object",
        "A MULE:EXPRESSION error, since the aggregation step cannot merge a failed route into the composite payload"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Scatter-Gather waits for all routes, then raises COMPOSITE_ROUTING; the error's message exposes which routes failed (and the successes), so handlers can salvage partial results.",
        "Other routes still run to completion; the failure is reported compositely, not immediately.",
        "A failed route is an error, not a silent omission.",
        "COMPOSITE_ROUTING is the specific type for this situation."
      ],
      explanation: "On any route failure Scatter-Gather completes the rest and raises MULE:COMPOSITE_ROUTING carrying per-route outcomes — the detail that lets an error handler distinguish and even use the successful branches."
    },
    {
      id: "m1-246", section: "s6", level: "hard",
      q: "Refer to the exhibit. Which requests reach the 'premium' route?",
      exhibit: "<choice>\n  <when expression=\"#[payload.tier == 'premium' and payload.total > 100]\">\n    <!-- premium route -->\n  </when>\n  <when expression=\"#[payload.total > 100]\">\n    <!-- bulk route -->\n  </when>\n  <otherwise> <!-- standard route --> </otherwise>\n</choice>\n\n(1) { \"tier\": \"premium\", \"total\": 250 }\n(2) { \"tier\": \"premium\", \"total\": 80 }\n(3) { \"total\": 250 }",
      options: [
        "Only request 1 — request 2 fails the total check and falls to otherwise; request 3 matches the second when (bulk)",
        "Requests 1 and 2 — the tier value alone is enough once any when expression references it in the router",
        "Requests 1 and 3 — a missing tier field is treated as premium because null comparisons match permissively",
        "Only request 3 — evaluation is bottom-up, so the bulk route consumes request 1 before premium is checked"
      ],
      answer: 0,
      optionNotes: [
        "Correct — when expressions evaluate top-down, whole-expression: 1 passes both conditions; 2 fails total>100 and no later when matches it, so otherwise; 3 skips the first (tier is null ≠ 'premium') and matches the second.",
        "Both conditions in the expression must hold — tier alone isn't enough.",
        "null == 'premium' is false; missing fields never match equality.",
        "Choice evaluates top-down and executes exactly the first match."
      ],
      explanation: "Choice = ordered guard evaluation, first full match wins, otherwise as fallback. Tracing concrete payloads through the guards — including null field behaviour — is exactly how the exam frames it."
    },
    {
      id: "m1-247", section: "s9", level: "hard",
      q: "Refer to the exhibit. What does the flow's payload look like right after the Select, and what must the developer watch out for when logging it?",
      exhibit: "<db:select config-ref=\"Database_Config\">\n  <db:sql>SELECT id, email FROM users WHERE plan = :plan</db:sql>\n  <db:input-parameters>#[{ plan: attributes.queryParams.plan }]</db:input-parameters>\n</db:select>\n<logger message=\"#[payload]\"/>",
      options: [
        "An array of row objects ([{id:.., email:..}, ...]) delivered as a streamed result set — logging #[payload] can consume the stream or print a cursor reference",
        "A single object keyed by column name holding arrays of values per column, safe to log because the connector always materializes results",
        "A JDBC ResultSet Java object that must be converted with a Transform before any Mule component can access the row data",
        "A string of comma-separated rows, since the Database connector serializes tabular results to CSV for downstream compatibility"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Select yields a list of maps (one per row), typically as a repeatable/streamed result; naively logging the payload may show a cursor provider or force full consumption.",
        "Results are row-oriented objects, not column arrays.",
        "The connector already maps rows to Mule-friendly maps.",
        "No CSV serialization happens."
      ],
      explanation: "db:select returns an array of row-maps and streams it; the input-parameters map (:plan) is the injection-safe way to bind values. The 'cursor in the log' surprise is the streaming footgun to recognize."
    },
    {
      id: "m1-248", section: "s9", level: "hard",
      q: "A flow calls a REST backend with an HTTP Request. Requirements: a 404 from the backend must NOT raise an error (it is a valid 'no data' answer), but 5xx responses must still fail the flow. Which configuration achieves this?",
      options: [
        "Set the operation's response validator / success expression so 2xx and 404 count as success while other statuses raise errors",
        "Wrap the operation in a Try scope with On Error Continue for all HTTP errors, then inspect the status code manually afterwards",
        "Enable the 'never throw' option on the requester so no status raises errors, relying on the caller to check every response",
        "Add error mapping from HTTP:NOT_FOUND to MULE:ANY so the default handler treats the 404 as an ordinary successful outcome"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the requester's success-status configuration (e.g. allowing 200-299 plus 404) makes 404 a non-error response while 5xx still raises HTTP errors.",
        "Continue-for-everything also swallows the 5xx failures the flow must surface.",
        "Disabling all status validation silently accepts 5xx too.",
        "Mapping to MULE:ANY doesn't make an error succeed — it just retypes it."
      ],
      explanation: "The HTTP requester validates response status; customizing which codes count as success is the precise tool for 'this status is business-normal, that one is a failure' — no error-handler gymnastics needed."
    },
    {
      id: "m1-249", section: "s10", level: "hard",
      q: "Refer to the exhibit. How many records reach step2, and what is in vars.tag there?",
      exhibit: "<batch:job jobName=\"sync\" maxFailedRecords=\"-1\">\n  <batch:process-records>\n    <batch:step name=\"step1\">\n      <set-variable variableName=\"tag\" value=\"#['s1-' ++ payload.id]\"/>\n      <choice>\n        <when expression=\"#[payload.bad]\"><raise-error type=\"APP:BAD\"/></when>\n        <otherwise><logger/></otherwise>\n      </choice>\n    </batch:step>\n    <batch:step name=\"step2\" acceptPolicy=\"NO_FAILURES\">\n      <logger message=\"#[vars.tag]\"/>\n    </batch:step>\n  </batch:process-records>\n</batch:job>\n\nInput: 5 records, 2 with bad=true",
      options: [
        "3 records reach step2, each logging its own 's1-<id>' — record variables set in step1 stay with that record across steps",
        "5 records reach step2, because maxFailedRecords=-1 instructs later steps to accept previously failed records too",
        "3 records reach step2 but vars.tag is null — variables are cleared at every step boundary inside a batch job",
        "0 records reach step2, because any record failure in a step aborts the remaining steps for the whole job instance"
      ],
      answer: 0,
      optionNotes: [
        "Correct — acceptPolicy NO_FAILURES admits only the 3 clean records, and a variable set during a record's processing is a record variable that travels with it to later steps.",
        "maxFailedRecords keeps the JOB alive; it doesn't override a step's accept policy.",
        "Record variables persist across steps for the same record.",
        "Record-level failures don't abort the job when maxFailedRecords allows them."
      ],
      explanation: "Two batch mechanics in one: step acceptPolicy filters records by their failure history (NO_FAILURES skips the 2 bad ones), and vars inside batch processing are per-record state carried from step to step."
    },
    {
      id: "m1-250", section: "s10", level: "hard",
      q: "A Scheduler flow syncs rows using automatic watermarking on an On Table Row source (watermark column: last_modified). The team redeploys the app and observes ALL rows being re-synced once. What is the most likely cause and remedy?",
      options: [
        "The watermark is stored in an in-memory object store that redeploys wipe; use a persistent object store so the marker survives",
        "Automatic watermarking always resets on every poll cycle; switch the source to poll less frequently to limit reprocessing",
        "The watermark column type is DATETIME, which automatic watermarking cannot compare; switch to an incrementing numeric ID",
        "The source caches rows internally per deployment; add an Idempotent Message Validator to drop the duplicate rows instead"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the watermark lives in an object store; if that store isn't persistent, a redeploy loses the marker and the next poll starts from scratch. Persist it and re-syncs stop.",
        "Watermarks persist between polls by design — that's their whole purpose.",
        "DATETIME columns work fine for watermarking.",
        "Deduplication treats the symptom; the lost watermark is the cause."
      ],
      explanation: "Automatic watermarking = the source persisting 'the highest value seen' in an object store. Whether that survives restarts and redeploys is an object-store persistence question — the operational detail behind 'why did everything re-sync?'."
    },
    {
      id: "m1-251", section: "s12", level: "hard",
      q: "An API implementation with an Autodiscovery element is deployed to CloudHub. In API Manager, a Rate Limiting policy is configured on the API instance, but calls to the app are NOT being rate limited, and the instance shows no application paired. Which combination of causes explains this?",
      options: [
        "The api.id property doesn't match the instance, or the app lacks valid Anypoint platform client credentials — so the app never registered for policy enforcement",
        "Rate limiting on CloudHub requires deploying the separate auto-generated proxy application, since embedded enforcement only works on customer-hosted runtimes",
        "The policy was applied at the environment level instead of the instance level, which only affects APIs created after the policy existed",
        "The HTTP Listener uses the shared load balancer, whose connection reuse bypasses gateway policy evaluation for keep-alive requests"
      ],
      answer: 0,
      optionNotes: [
        "Correct — embedded enforcement needs the pairing to succeed: matching api.id plus platform client ID/secret on the runtime. Either being wrong leaves the instance unpaired and policies unenforced.",
        "Embedded (autodiscovery) enforcement works on CloudHub; a proxy is the alternative, not a requirement.",
        "Policies are configured per instance; this environment-level story isn't how it works.",
        "The shared load balancer doesn't bypass policy enforcement."
      ],
      explanation: "Autodiscovery pairing has two moving parts — the right api.id for that environment's instance and valid platform credentials. An unpaired instance means the gateway inside the app never fetches or enforces its policies."
    }
  ]
};
