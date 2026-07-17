/* MCD1 · second de-bias pass — make a DISTRACTOR the longest option on
 * conceptual questions where the correct answer was the giveaway longest one,
 * and attach optionNotes so every option teaches. Answers unchanged in meaning. */
module.exports = {
  questions: {
    "m1-002": {
      options: [
        "A Center of Excellence (CoE) that centralizes and builds all integrations for every line of business",
        "A Center for Enablement (C4E) that enables teams to build and reuse assets",
        "An Integration Competency Center that reviews and approves every API design before release",
        "An outsourced integration delivery team hired to build the assets under contract"
      ],
      answer: 1,
      explanation: "The C4E is a cross-functional enablement team: it productizes, publishes, and makes assets discoverable, and it measures consumption. Unlike a traditional CoE, it enables other teams rather than doing all the delivery itself.",
      optionNotes: [
        "Wrong — a centralized CoE that builds everything becomes the bottleneck the C4E is meant to avoid.",
        "Correct — the C4E enables self-service reuse and measures consumption.",
        "Wrong — an approval gate on every design is central control, not enablement.",
        "Wrong — outsourcing delivery doesn't create internal reuse or self-service."
      ]
    },
    "m1-008": {
      options: [
        "When identifying one specific, unique resource by its identifier within the URL path",
        "When filtering, sorting, or paginating the set of results from a collection",
        "When sending sensitive credentials that should not appear in the request",
        "Only when the value is optional, since URI parameters are always required"
      ],
      answer: 1,
      explanation: "URI parameters identify a specific resource (/flights/23); query parameters filter, sort, or paginate collections (/flights?destination=SFO). Required vs optional is orthogonal — a query param can be required too.",
      optionNotes: [
        "Wrong — identifying one resource is exactly the URI-parameter case.",
        "Correct — refining a collection's results is what query parameters are for.",
        "Wrong — neither parameter type is a safe place for credentials.",
        "Wrong — query parameters can be required; required/optional isn't the deciding factor."
      ]
    },
    "m1-016": {
      options: [
        "Wrap the HTTP Request in a Try scope and restore the saved payload in its error handler",
        "Set the HTTP Request's target parameter to store the response in a variable",
        "Copy the current payload into the message attributes before making the request",
        "Call the API from a sub-flow so any payload changes are discarded on return"
      ],
      answer: 1,
      explanation: "The target (and target value) parameter stores the operation's output in a variable instead of overwriting the payload — the standard Mule 4 enrichment pattern.",
      optionNotes: [
        "Wrong — a Try scope handles errors; it doesn't preserve the payload across a successful call.",
        "Correct — target stores the response in a variable and leaves the payload intact.",
        "Wrong — attributes are replaced by the request's response too; that's not a safe stash.",
        "Wrong — a sub-flow shares the event; payload changes made there are NOT discarded on return."
      ]
    },
    "m1-017": {
      options: [
        "They persist across an HTTP Request to another Mule application, travelling with the payload",
        "They are cleared whenever the event passes through a Flow Reference call",
        "They persist for the current flow and through Flow References in the same app",
        "They can only store String values, never objects or arrays"
      ],
      answer: 2,
      explanation: "Variables travel with the Mule event through Flow References (and back). They do NOT cross a transport boundary to another application — only the payload and any headers you set are transmitted. Variables can hold any type.",
      optionNotes: [
        "Wrong — crossing to another app over HTTP drops variables; only payload/headers cross.",
        "Wrong — a Flow Reference keeps variables; it doesn't clear them.",
        "Correct — vars live for the flow and pass through Flow References within the same app.",
        "Wrong — variables can hold any type, not just strings."
      ]
    },
    "m1-019": {
      options: [
        "A sub-flow has its own event source, whereas a private flow is triggered only by reference",
        "A private flow has its own error-handling scope; a sub-flow inherits the caller's",
        "A sub-flow can be invoked only once per application; a private flow any number of times",
        "There is no real difference; the two names are interchangeable in Mule 4"
      ],
      answer: 1,
      explanation: "Neither has an event source, but a private flow has its own processing strategy and error handling, while a sub-flow inherits everything from the calling flow (and is slightly more performant).",
      optionNotes: [
        "Wrong — neither a sub-flow nor a private flow has an event source.",
        "Correct — the distinction is error handling: private flow has its own; sub-flow inherits the caller's.",
        "Wrong — both can be referenced any number of times.",
        "Wrong — they behave differently around error handling and transactions."
      ]
    },
    "m1-024": {
      options: [
        "It is required for the application to compile and deploy successfully to the runtime",
        "To improve readability and organize reusable configs referenced by many flows",
        "Global elements only function when placed in a file named global.xml specifically",
        "To make the runtime encrypt those configuration values automatically at deploy"
      ],
      answer: 1,
      explanation: "Global configurations can live in any config file; keeping them in a dedicated file (e.g. global.xml) is a best practice for organization and reuse — a convention, not a requirement.",
      optionNotes: [
        "Wrong — the app compiles regardless of which file holds the globals.",
        "Correct — it's an organizational/reuse convention.",
        "Wrong — global elements work in any config file, whatever it's named.",
        "Wrong — moving configs doesn't encrypt them; secure properties do that."
      ]
    },
    "m1-025": {
      options: [
        "By the physical position and top-to-bottom ordering of the flow in the configuration file",
        "By matching the request's method and resource path to the flow's name",
        "By reading a routing table declared in the project's pom.xml build file",
        "By evaluating a Choice router that the APIkit scaffolder places inside the generated main flow"
      ],
      answer: 1,
      explanation: "APIkit routes by flow naming convention: the generated flow name encodes method + resource (+ config name), e.g. get:\\flights:api-config. Renaming these flows breaks routing.",
      optionNotes: [
        "Wrong — order in the file doesn't determine routing; the flow name does.",
        "Correct — the router maps method + resource path to the matching flow name.",
        "Wrong — pom.xml is the Maven build; it holds no routing table.",
        "Wrong — APIkit uses name-based routing, not a hand-written Choice in the main flow."
      ]
    },
    "m1-030": {
      options: [
        "They are deleted, so every implementation flow must be written again from scratch",
        "They are preserved; APIkit adds flows only for the new resource/method pairs",
        "They are renamed with a version suffix and disconnected from the router",
        "They are moved into a separate backup project for safekeeping"
      ],
      answer: 1,
      explanation: "Regenerating flows from an updated spec adds missing flows for new resources/methods while leaving existing implementation flows intact.",
      optionNotes: [
        "Wrong — existing flows are not deleted on re-scaffold.",
        "Correct — only new resource/method flows are added; yours are kept.",
        "Wrong — flows aren't renamed or disconnected by scaffolding.",
        "Wrong — nothing is moved to a backup project."
      ]
    },
    "m1-033": {
      options: [
        "Sequentially, one route after another, stopping at the first route that fails",
        "Concurrently, sending a copy of the event to every route and awaiting them all",
        "Round-robin, dispatching one route per incoming event in rotation",
        "In parallel, but keeping only the single fastest route's result and discarding the rest"
      ],
      answer: 1,
      explanation: "Scatter-Gather multicasts a copy of the event to all routes in parallel and waits for all of them. Round-robin describes the Round Robin router; keeping the fastest describes nothing Scatter-Gather does.",
      optionNotes: [
        "Wrong — routes run in parallel, not sequentially.",
        "Correct — a copy goes to every route concurrently and the router awaits all.",
        "Wrong — that's the Round Robin router's behavior.",
        "Wrong — every route's result is aggregated, not just the fastest."
      ]
    },
    "m1-034": {
      options: [
        "It sets the payload to the boolean false and continues down the rest of the flow",
        "It throws a Mule error of type VALIDATION:INVALID_NUMBER",
        "It logs a warning message and continues without changing the payload",
        "It silently converts the invalid value to the number 0"
      ],
      answer: 1,
      explanation: "Validation components throw typed Mule errors on failure (VALIDATION namespace) rather than returning booleans, so failures can be handled by error handlers.",
      optionNotes: [
        "Wrong — validators don't return a boolean payload; they raise errors.",
        "Correct — it raises VALIDATION:INVALID_NUMBER on failure.",
        "Wrong — it fails fast with an error, not a warning-and-continue.",
        "Wrong — validators never coerce the value; they only check it."
      ]
    },
    "m1-036": {
      options: [
        "The remaining routes are cancelled and all of their partial results discarded silently",
        "It waits for all routes, then raises a composite routing error",
        "The failed route is automatically retried three times before the router gives up",
        "The failure is ignored and the aggregate simply contains only the successful routes"
      ],
      answer: 1,
      explanation: "All routes run; if any fail, a MULE:COMPOSITE_ROUTING error aggregating the failures is raised (its childErrors hold each route's error). Handling partial failures requires error handling inside the routes (e.g. Try scopes).",
      optionNotes: [
        "Wrong — the other routes still run; nothing is silently discarded.",
        "Correct — it waits for all, then raises COMPOSITE_ROUTING with the failure(s).",
        "Wrong — Scatter-Gather doesn't auto-retry routes.",
        "Wrong — a failure isn't ignored; it surfaces as a composite error."
      ]
    },
    "m1-052": {
      options: [
        "The Mule Database connector rejects any SQL built by string concatenation at runtime",
        "Input parameters prevent SQL injection and let the driver escape and type values",
        "Input parameters make the query execute across shards in parallel automatically",
        "Named parameters are mandatory for every SELECT statement in the connector"
      ],
      answer: 1,
      explanation: "Parameterized queries bind values safely (:code with an input-parameters map), preventing SQL injection and letting the driver handle escaping/typing. Concatenation works but is unsafe.",
      optionNotes: [
        "Wrong — the connector accepts concatenated SQL; it's just dangerous.",
        "Correct — parameters close the injection hole and handle escaping/types.",
        "Wrong — parameters don't parallelize or shard a query.",
        "Wrong — named parameters aren't mandatory; they're the safe best practice."
      ]
    },
    "m1-055": {
      options: [
        "As query parameters appended to the service endpoint URL",
        "By building the expected SOAP body XML with a Transform Message before the operation",
        "As Mule variables that the Web Service Consumer connector reads and injects into the envelope automatically",
        "In the connector's 'arguments' table, one row per SOAP element to send"
      ],
      answer: 1,
      explanation: "The Web Service Consumer expects the payload to be the operation's SOAP body. Studio exposes the operation's metadata so a Transform Message can map data into the correct XML structure; the connector wraps it in the envelope.",
      optionNotes: [
        "Wrong — SOAP arguments go in the XML body, not the URL query string.",
        "Correct — build the SOAP body with DataWeave before the Consume operation.",
        "Wrong — the connector doesn't scrape variables into the envelope for you.",
        "Wrong — there's no 'arguments table'; you supply the body payload."
      ]
    },
    "m1-056": {
      options: [
        "An On New or Updated File listener with a post-process action to move or delete the file",
        "A Scheduler that lists and reads every file in the directory each minute, keeping no processed-state",
        "An HTTP Listener configured to watch the file system for newly created files",
        "A For Each scope wrapped around a File Read operation that runs on a timer"
      ],
      answer: 0,
      explanation: "The File listener triggers per new/updated file; configuring a post-processing action (move, rename, or delete) prevents reprocessing. Without it, the same files get picked up repeatedly.",
      optionNotes: [
        "Correct — an On New/Updated File source plus a move/delete post-action avoids reprocessing.",
        "Wrong — a stateless Scheduler re-reads every file each run, reprocessing them.",
        "Wrong — an HTTP Listener responds to HTTP requests, not filesystem events.",
        "Wrong — a timed For Each over File Read has no per-file trigger or dedup."
      ]
    },
    "m1-062": {
      options: [
        "The record is automatically retried with backoff until it eventually succeeds",
        "The job stops processing further records and proceeds to On Complete",
        "The failure is silently ignored and processing simply continues",
        "The whole Mule application is shut down and must be restarted"
      ],
      answer: 1,
      explanation: "With maxFailedRecords = 0, the first failed record halts the job (it moves to On Complete). Setting it to -1 lets the job continue regardless of failures; later steps can filter with accept policies.",
      optionNotes: [
        "Wrong — Batch doesn't auto-retry the record by default.",
        "Correct — at maxFailedRecords=0 the first failure stops further processing.",
        "Wrong — the failure isn't ignored; it stops the job.",
        "Wrong — the app keeps running; only the job stops."
      ]
    },
    "m1-067": {
      options: [
        "The Mule application failed to start up because of this error",
        "An outbound HTTP Request in the flow received a 404 from the remote service",
        "The application's own inbound HTTP Listener rejected the consumer's incoming request",
        "A DataWeave transform failed because the payload didn't match its declared type"
      ],
      answer: 1,
      explanation: "HTTP:NOT_FOUND with an outbound URL means the app's own HTTP Request call got a 404 from the remote endpoint — start troubleshooting at that request's URL/path.",
      optionNotes: [
        "Wrong — the app is running; it made a call that returned 404.",
        "Correct — an outbound HTTP Request received a 404 from the remote service.",
        "Wrong — a rejected inbound request would come from APIkit/listener validation, not an outbound GET.",
        "Wrong — the error type is HTTP:NOT_FOUND, not a DataWeave error."
      ]
    },
    "m1-081": {
      options: [
        "3306 — values in the packaged configuration file always win over -D system properties",
        "3307 — system/deployment properties override the packaged property files",
        "Neither; the deployment fails because the two values conflict",
        "Both, resolving differently depending on which flow reads it"
      ],
      answer: 1,
      explanation: "Property precedence puts deployment/system properties above packaged property files — exactly how the same JAR is configured differently per environment without rebuilding.",
      optionNotes: [
        "Wrong — files do NOT beat -D; it's the other way around.",
        "Correct — -Ddb.port=3307 overrides the file value, so it resolves to 3307.",
        "Wrong — overriding is expected behavior, not a conflict error.",
        "Wrong — a property resolves to one value app-wide, not per flow."
      ]
    },
    "m1-085": {
      options: [
        "600 ms (the sum of all three routes); the payload is only the last route's result",
        "≈300 ms (the slowest route); an object keyed '0','1','2' holding each route's message",
        "300 ms; a flat array containing the three route payloads in order",
        "100 ms (the fastest route); only the first completed route's payload"
      ],
      answer: 1,
      explanation: "Routes run concurrently, so total ≈ slowest (300 ms). The result is an object keyed by route index where each entry holds that route's full message (attributes + payload) — hence the common 'pluck $.payload' aggregation.",
      optionNotes: [
        "Wrong — parallel routes don't sum; and results from all routes are kept.",
        "Correct — ≈300 ms and an object keyed by route index of route messages.",
        "Wrong — the aggregate is an object keyed by index, not a flat array.",
        "Wrong — the router waits for all routes, not just the fastest."
      ]
    },
    "m1-088": {
      options: [
        "Nothing happens in B; A's own error handler already dealt with the failure completely",
        "The error resurfaces in B at the Flow Reference, triggering B's error handling",
        "B continues processing using A's last successful payload before the failure",
        "B restarts execution from its own event source with the original event"
      ],
      answer: 1,
      explanation: "On Error Propagate re-throws after running its processors. To the caller, the Flow Reference itself fails — so B's error handling (or the default handler) takes over. On Error Continue in A would have let B continue normally.",
      optionNotes: [
        "Wrong — Propagate re-throws, so the failure does reach B.",
        "Correct — it resurfaces at the Flow Reference and triggers B's handling.",
        "Wrong — that would be On Error Continue behavior, not Propagate.",
        "Wrong — errors don't restart a flow from its source."
      ]
    },
    "m1-095": {
      options: [
        "String concatenation is only slightly slower to type than using parameters",
        "Input parameters prevent SQL injection and handle type conversion and escaping safely",
        "Input parameters are what allow a single query to target multiple databases at once",
        "The Mule Database connector rejects any concatenated SQL string and throws an error at runtime"
      ],
      answer: 1,
      explanation: "Parameterized queries separate SQL from data, closing the injection hole and letting the driver handle typing/escaping. The connector accepts concatenated SQL — it's just dangerous.",
      optionNotes: [
        "Wrong — the reason is security, not typing effort.",
        "Correct — parameters prevent injection and handle escaping/typing.",
        "Wrong — parameters don't make a query span multiple databases.",
        "Wrong — the connector accepts concatenated SQL; the risk is injection, not rejection."
      ]
    }
  }
};
