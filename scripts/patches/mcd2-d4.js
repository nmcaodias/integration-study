/* MCD2 · d4 — Building Monitorable Mule Applications */
module.exports = {
  sections: {
    d4: {
      topicDocs: {
        "Where each alert lives": "https://docs.mulesoft.com/monitoring/",
        "What to log (and what not to)": "https://docs.mulesoft.com/mule-runtime/latest/logging-in-mule",
        "Anypoint Monitoring vs. Functional Monitoring": "https://docs.mulesoft.com/monitoring/"
      },
      appendNotes: `
<h3>Where each alert lives</h3>
<table>
<tr><th>You want to be alerted when…</th><th>Configured in</th></tr>
<tr><td>The application stops / a worker is unresponsive / deployment failed / CPU or memory threshold</td><td>Runtime Manager (and Anypoint Monitoring metric alerts)</td></tr>
<tr><td>An API's response time, error rate, request count, or a policy violation crosses a threshold</td><td>API Manager alerts</td></tr>
<tr><td>You need to search logs across many apps in one place</td><td>Anypoint Monitoring log management (Titanium)</td></tr>
<tr><td>A scheduled black-box test of a live endpoint fails</td><td>API Functional Monitoring (BAT)</td></tr>
</table>
<p>Rule of thumb: <strong>infrastructure/app lifecycle → Runtime Manager</strong>; <strong>API behaviour → API Manager</strong>; <strong>centralized search &amp; metrics → Anypoint Monitoring</strong>.</p>

<h3>What to log (and what not to)</h3>
<ul>
<li><strong>Do</strong>: log at flow boundaries with the correlation ID; use meaningful <strong>categories</strong> (<code>com.acme.orders.payment</code>) so levels can be tuned per environment; prefer structured (JSON) messages for aggregation.</li>
<li><strong>Don't</strong>: log entire payloads with PII/credentials at INFO — it leaks data and bloats storage. Reserve payload dumps for guarded DEBUG, and mask sensitive fields.</li>
<li><strong>Async vs sync</strong>: async loggers boost throughput (I/O off the processing thread) but can lose the last buffered entries on a hard crash and weaken strict ordering — keep audit/ERROR categories synchronous when durability matters.</li>
</ul>

<h3>Anypoint Monitoring vs. Functional Monitoring</h3>
<ul>
<li><strong>Anypoint Monitoring</strong> — dashboards, metrics, and (Titanium) centralized log management for deployed apps/APIs. Answers "how is it behaving right now?"</li>
<li><strong>API Functional Monitoring (BAT)</strong> — scheduled black-box tests that call endpoints from chosen locations and assert on responses, alerting on failures. Answers "is it working from the consumer's perspective?"</li>
<li><strong>Custom Business Events</strong> — publish named business milestones ("OrderPlaced") with key/value metadata for business-level KPIs in Monitoring, distinct from technical logs/metrics.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> app down → Runtime Manager; 5xx rate / policy violation → API Manager; cross-app log search → Anypoint Monitoring; endpoint health from outside → Functional Monitoring; business KPI → Custom Business Event; trace one transaction across apps → correlation ID.</p>`
    }
  },
  questions: {
    "m2-052": {
      options: [
        "Async logging is slower but preserves strict ordering",
        "Async improves throughput (I/O off the processing thread) but can lose buffered entries on a crash",
        "Async logging encrypts the log entries at rest",
        "There is no practical difference between the two"
      ],
      answer: 1,
      explanation: "Async appenders/loggers decouple I/O from event processing — better performance, but buffered messages can be lost if the JVM dies, and strict ordering guarantees weaken.",
      optionNotes: [
        "Wrong — async is faster, and it weakens (not preserves) ordering.",
        "Correct — throughput gain traded against possible loss on crash and weaker ordering.",
        "Wrong — async logging is about threading, not encryption.",
        "Wrong — there's a real durability/throughput trade-off."
      ]
    },
    "m2-053": {
      options: [
        "It encrypts the message as it passes between applications",
        "It's logged by every app and propagated via headers, tracing one transaction end-to-end",
        "It identifies which CloudHub worker region handled the request",
        "It replaces the need for authentication tokens between apps"
      ],
      answer: 1,
      explanation: "Each event carries a correlationId that propagates across HTTP calls between Mule apps and appears in default log patterns — search it in centralized logs to reconstruct the full journey of one transaction.",
      optionNotes: [
        "Wrong — the correlation ID doesn't encrypt anything.",
        "Correct — it links log entries for one transaction across apps.",
        "Wrong — it isn't a region identifier.",
        "Wrong — it's for tracing, not authentication."
      ]
    },
    "m2-054": {
      options: [
        "In the application's own log4j2.xml file",
        "API alerts in API Manager (and/or metric alerts in Anypoint Monitoring)",
        "In the Anypoint Exchange asset settings",
        "In the API's RAML specification"
      ],
      answer: 1,
      explanation: "API Manager provides API-level alerts (response time, policy violations, request counts, error codes). Anypoint Monitoring adds metric-threshold alerts and dashboards. log4j only writes logs.",
      optionNotes: [
        "Wrong — log4j2.xml controls logging output, not alerts.",
        "Correct — API-behaviour alerts live in API Manager (or Monitoring).",
        "Wrong — Exchange catalogs assets; it doesn't raise runtime alerts.",
        "Wrong — RAML is the contract, not an alerting mechanism."
      ]
    },
    "m2-055": {
      options: [
        "DataWeave syntax errors detected in the flows",
        "Application down, worker not responding, or deployment failed",
        "RAML specification validation failures",
        "Anypoint Exchange asset download counts"
      ],
      answer: 1,
      explanation: "Runtime Manager alerts cover infrastructure/application lifecycle events: app stopped or down, worker unresponsive, deployment success/failure, resource thresholds, and custom application notifications.",
      optionNotes: [
        "Wrong — DataWeave errors surface in logs, not as RM lifecycle alerts.",
        "Correct — these are the app/worker lifecycle conditions RM alerts on.",
        "Wrong — RAML validation is a design-time concern.",
        "Wrong — download counts are an Exchange metric, not an RM alert."
      ]
    },
    "m2-056": {
      options: [
        "To raise Mule errors with custom, application-specific types",
        "To publish named business milestones with metadata (e.g. 'OrderPlaced') visible in Monitoring",
        "To send notification emails to business stakeholders",
        "To generate API documentation pages in Exchange"
      ],
      answer: 1,
      explanation: "Custom Business Events add business KPIs to monitoring — tracking meaningful milestones and key/value metadata, distinct from technical logs and metrics.",
      optionNotes: [
        "Wrong — raising typed errors is Raise Error, not a business event.",
        "Correct — it publishes business milestones with metadata for Monitoring.",
        "Wrong — it doesn't send emails; alerts do that.",
        "Wrong — documentation is generated by publishing specs, not business events."
      ]
    },
    "m2-057": {
      options: [
        "Read each worker's console output individually as needed",
        "Anypoint Monitoring log management, or ship logs via custom Log4j appenders to ELK/Splunk",
        "Store recent log lines in flow variables for later retrieval",
        "Write log messages into the message payload"
      ],
      answer: 1,
      explanation: "Centralize either inside the platform (Anypoint Monitoring / Titanium log search) or externally by adding appenders (HTTP, Socket, Splunk…) to each app's log4j2.xml.",
      optionNotes: [
        "Wrong — per-worker consoles are the opposite of centralized.",
        "Correct — Monitoring log management or external appenders centralize logs.",
        "Wrong — flow variables are per-event memory, not a log store.",
        "Wrong — putting logs in the payload corrupts the data being processed."
      ]
    },
    "m2-058": {
      options: [
        "It cannot be done without redeploying different code per environment",
        "Set the Logger's category to com.acme.orders and set that category's level per environment in log4j2.xml",
        "Use System.out.println inside a DataWeave expression",
        "Raise the root logger to TRACE across every environment"
      ],
      answer: 1,
      explanation: "Custom categories on Logger components plus per-category levels in log4j2.xml give fine-grained control, keeping production logs quiet without touching flow logic.",
      optionNotes: [
        "Wrong — per-category levels make this straightforward.",
        "Correct — a named category with per-environment level configuration.",
        "Wrong — DataWeave has no System.out.println; use the Logger.",
        "Wrong — root=TRACE floods every environment, the opposite of the goal."
      ]
    },
    "m2-059": {
      options: [
        "Unit-test code coverage reports for the application",
        "Scheduled black-box tests that call live endpoints and validate responses, alerting on failures",
        "JVM profiler heap and thread dumps",
        "Automatically generated API reference documentation"
      ],
      answer: 1,
      explanation: "Functional monitoring (BAT) exercises live endpoints on a schedule, asserting on status/behaviour — catching outages and regressions from the consumer's perspective.",
      optionNotes: [
        "Wrong — coverage is an MUnit/build concern, not functional monitoring.",
        "Correct — scheduled black-box endpoint tests with assertions and alerts.",
        "Wrong — profiler dumps are a JVM diagnostic, not functional monitoring.",
        "Wrong — doc generation comes from publishing specs."
      ]
    },
    "m2-089": {
      options: [
        "Remove all Logger components from the application",
        "Switch to Log4j 2 async loggers/appenders — more throughput, but buffered entries can be lost on a crash",
        "Write the log messages into the payload instead of a file",
        "Reduce the maximum size of each rolling log file"
      ],
      answer: 1,
      explanation: "Async logging decouples I/O from event processing. The cost is durability (a crash loses the buffer) and ordering guarantees — keep audit-critical categories synchronous.",
      optionNotes: [
        "Wrong — removing logging destroys observability.",
        "Correct — async logging is the standard remedy, trading some durability.",
        "Wrong — logging to the payload corrupts the data.",
        "Wrong — smaller files don't address the blocking-I/O latency cost."
      ]
    },
    "m2-090": {
      options: [
        "Line up the log entries manually by their timestamps",
        "Search for the correlation ID — Mule propagates it via X-Correlation-ID and logs it by default",
        "Search the logs by matching the payload contents",
        "Turn on TRACE-level logging across all three apps"
      ],
      answer: 1,
      explanation: "The event's correlation ID travels with the request (X-Correlation-ID) and is logged by default patterns in every app — one search reconstructs the end-to-end journey.",
      optionNotes: [
        "Wrong — timestamp matching is error-prone across apps.",
        "Correct — one correlation-ID search links all the entries.",
        "Wrong — payload contents vary and may be masked; the ID is the reliable key.",
        "Wrong — TRACE floods logs without linking the transaction."
      ]
    },
    "m2-091": {
      options: [
        "All three are configured in Runtime Manager",
        "1 = Runtime Manager; 2 = API Manager (or Monitoring); 3 = Anypoint Monitoring log management",
        "All three are configured in API Manager",
        "1 = Exchange; 2 = Design Center; 3 = Anypoint Studio"
      ],
      answer: 1,
      explanation: "Operational app-level alerts live in Runtime Manager; API-level conditions (policy violations, response codes) in API Manager; centralized log search is Anypoint Monitoring's log management feature.",
      optionNotes: [
        "Wrong — API 5xx alerting and cross-app log search aren't RM features.",
        "Correct — RM for app, API Manager for API behaviour, Monitoring for log search.",
        "Wrong — app-down alerting and log search aren't in API Manager.",
        "Wrong — those are design-time tools, not runtime monitoring."
      ]
    },
    "m2-092": {
      options: [
        "Parsing the JVM garbage-collection logs for order counts",
        "Custom Business Events (or structured log fields consumed by monitoring dashboards)",
        "Counting HTTP 200 responses across every endpoint",
        "Reading worker CPU utilization metrics"
      ],
      answer: 1,
      explanation: "The Custom Business Event component publishes named business milestones with metadata (order id, amount), independent of technical metrics. Structured JSON logs aggregated by the monitoring stack are the alternative.",
      optionNotes: [
        "Wrong — GC logs are a JVM concern, not a business metric.",
        "Correct — Custom Business Events (or structured log fields) feed business KPIs.",
        "Wrong — 200 counts are technical and don't equal 'orders processed'.",
        "Wrong — CPU utilization is infrastructure, not a business metric."
      ]
    },
    "m2-117": { optionEdits: {
      0: "Rely on the correlation ID Mule propagates on outbound HTTP calls and log it everywhere",
      2: "Log each application's full payload and match records by comparing their contents" } },
    "m2-118": { optionEdits: {
      0: "An alert in Runtime Manager / Anypoint Monitoring on the app's memory metric",
      3: "In the mule-artifact.json minMuleVersion field of the deployed application" } },
    "m2-119": { optionEdits: {
      0: "A GET /health flow that checks each dependency with short timeouts, returning 200 only if all are up",
      1: "Return 200 from /health unconditionally, since the app being up is what matters most" } },
    "m2-116": { optionEdits: {
      0: "Logging calls return immediately while a background thread writes; throughput rises, recent entries can be lost on crash",
      3: "The runtime ignores AsyncLogger elements entirely unless Anypoint Monitoring is enabled first" } }
  }
};
