/* MCD2 · d1 — Building Performant and Reliable Mule Applications
 * Notes expansion + de-biased questions (balanced option lengths + optionNotes). */
module.exports = {
  sections: {
    d1: {
      topicDocs: {
        "Choosing a streaming strategy": "https://docs.mulesoft.com/mule-runtime/latest/streaming-about",
        "Retry, redelivery, and reconnection compared": "https://docs.mulesoft.com/mule-runtime/latest/reliability-patterns",
        "Object Store for state and idempotency": "https://docs.mulesoft.com/object-store-connector/latest/",
        "Back-pressure and concurrency": "https://docs.mulesoft.com/mule-runtime/latest/execution-engine"
      },
      appendNotes: `
<h3>Choosing a streaming strategy</h3>
<p>Decide by two questions: <em>how big can the payload get?</em> and <em>how many times is it read?</em></p>
<svg viewBox="0 0 660 150" style="max-width:660px;width:100%" role="img" aria-label="Streaming strategy decision">
  <style>.st-b{fill:none;stroke:currentColor;stroke-width:1.3}.st-t{font:600 12px sans-serif;fill:currentColor}.st-s{font:11px sans-serif;fill:currentColor;opacity:.8}.st-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#stA)}</style>
  <defs><marker id="stA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <rect x="10" y="60" width="120" height="34" rx="6" class="st-b"/><text x="70" y="81" text-anchor="middle" class="st-s">read more than once?</text>
  <rect x="200" y="14" width="150" height="30" rx="6" class="st-b"/><text x="275" y="33" text-anchor="middle" class="st-s">no → non-repeatable</text>
  <rect x="200" y="108" width="150" height="30" rx="6" class="st-b"/><text x="275" y="127" text-anchor="middle" class="st-s">yes → repeatable</text>
  <line x1="130" y1="70" x2="198" y2="34" class="st-a"/><line x1="130" y1="84" x2="198" y2="120" class="st-a"/>
  <rect x="420" y="94" width="230" height="30" rx="6" class="st-b"/><text x="535" y="113" text-anchor="middle" class="st-s">small/bounded → in-memory (fastest)</text>
  <rect x="420" y="128" width="230" height="20" rx="6" class="st-b"/><text x="535" y="142" text-anchor="middle" class="st-s">large/unbounded → file-store</text>
  <line x1="350" y1="123" x2="418" y2="112" class="st-a"/><line x1="350" y1="123" x2="418" y2="136" class="st-a"/>
</svg>
<p>Read-once passthrough (SFTP → S3) wants <strong>non-repeatable</strong> (zero buffering). Multiple consumers on bounded data want <strong>repeatable in-memory</strong>. Multiple consumers on GB-scale data want <strong>repeatable file-store</strong>. An in-memory buffer that overflows its <code>maxBufferSize</code> raises <code>STREAM_MAXIMUM_SIZE_EXCEEDED</code>.</p>

<h3>Retry, redelivery, and reconnection compared</h3>
<table>
<tr><th>Tool</th><th>Retries what</th><th>Level</th><th>Exhaustion error</th></tr>
<tr><td>Reconnection strategy</td><td>The broken <em>connection</em></td><td>Connector config</td><td>*:CONNECTIVITY</td></tr>
<tr><td>Until Successful</td><td>The wrapped <em>processors</em></td><td>Flow scope</td><td>MULE:RETRY_EXHAUSTED</td></tr>
<tr><td>Redelivery policy</td><td>Reprocessing the <em>same inbound message</em></td><td>Listener/source</td><td>MULE:REDELIVERY_EXHAUSTED</td></tr>
</table>
<p>They compose: a reconnection strategy re-establishes a dropped DB connection; Until Successful re-runs a flaky HTTP call; a redelivery policy plus a DLQ stops a poison message from looping forever. <strong>Until Successful runs 1 initial attempt + maxRetries</strong> — so <code>maxRetries=3</code> means 4 executions total.</p>

<h3>Object Store for state and idempotency</h3>
<ul>
<li><strong>Object Store v2</strong> is persistent and <em>shared across all workers</em> of a CloudHub app — the right home for cross-worker, cross-restart state. In-memory stores, flow variables, and static Java fields are per-JVM and lost on restart.</li>
<li>The <strong>Idempotent Message Validator</strong> stores seen IDs in an Object Store and raises <code>MULE:DUPLICATE_MESSAGE</code> on repeats — exactly-once at the entry point.</li>
<li>The <strong>Cache scope</strong> memoizes its inner processors' result by key; on multiple workers use a shared OSv2-backed caching strategy so every worker sees the same cache, and set a TTL to bound staleness. The key must capture everything that makes a response unique (path <em>and</em> query params).</li>
</ul>

<h3>Back-pressure and concurrency</h3>
<p>Mule 4's self-tuning engine applies <strong>back-pressure</strong> when a flow can't keep up: <code>maxConcurrency</code> caps simultaneous executions of a flow, and once the cap is reached the source is throttled — an HTTP Listener answers <strong>503 Service Unavailable</strong> rather than queueing indefinitely. Shape load with <code>maxConcurrency</code> and parallel/batch components; you almost never size thread pools by hand.</p>`
    }
  },
  questions: {
    "m2-002": {
      options: [
        "Loggers cannot serialize a JSON payload for output",
        "The Logger consumed the one-time stream, so the transformer receives an empty one",
        "Non-repeatable streams must always be backed by file storage",
        "The payload was null by the time the Logger evaluated it"
      ],
      answer: 1,
      explanation: "A non-repeatable stream can be read exactly once. The Logger's #[payload] access consumes it, leaving nothing for the next component. Use a repeatable strategy, or don't read the stream before the transform.",
      optionNotes: [
        "Wrong — Loggers serialize JSON fine; the problem is the stream was already read.",
        "Correct — reading a non-repeatable stream once exhausts it for everything downstream.",
        "Wrong — non-repeatable streams do no buffering at all, in memory or on disk.",
        "Wrong — the payload isn't null; it's a stream that has been consumed."
      ]
    },
    "m2-004": {
      options: [
        "It retries establishing the outbound connection to the broker",
        "It limits how often the same message is reprocessed, raising REDELIVERY_EXHAUSTED when exceeded",
        "It guarantees exactly-once delivery across the whole application",
        "It compresses redelivered messages to save queue space"
      ],
      answer: 1,
      explanation: "A redelivery policy protects against poison messages that keep failing: after maxRedeliveryCount attempts it raises MULE:REDELIVERY_EXHAUSTED so you can divert the message (e.g. to a DLQ) instead of looping forever.",
      optionNotes: [
        "Wrong — re-establishing a connection is a reconnection strategy, not redelivery.",
        "Correct — it caps reprocessing of the same message and raises REDELIVERY_EXHAUSTED.",
        "Wrong — exactly-once needs idempotency/acks; redelivery only bounds retries.",
        "Wrong — redelivery has nothing to do with compression."
      ]
    },
    "m2-005": {
      options: [
        "Process the order synchronously and only then return 202 Accepted",
        "Persist the order to a VM queue (or Anypoint MQ) first, ack the client, process from the queue",
        "Store the order in a flow variable and process it in a sub-flow before responding",
        "Wrap the processing logic in a Cache scope keyed on the order id"
      ],
      answer: 1,
      explanation: "The reliable acquisition pattern persists the message to a reliable channel (persistent VM queue, Anypoint MQ, JMS) inside the receiving flow, acknowledges the client, then a separate flow consumes and processes it. A crash after ack cannot lose the order.",
      optionNotes: [
        "Wrong — synchronous processing means a crash mid-processing loses the accepted order.",
        "Correct — persist-then-ack-then-process asynchronously is the reliable acquisition pattern.",
        "Wrong — a flow variable lives only in memory for that event; a crash loses it.",
        "Wrong — a Cache scope memoizes results; it doesn't make acquisition reliable."
      ]
    },
    "m2-006": {
      options: [
        "VM queues always survive an application restart regardless of mode",
        "In-memory VM queues are faster but lost on restart; persistent ones survive at a cost",
        "VM queues can connect two different Mule applications on CloudHub",
        "VM queues need an external message broker to be configured"
      ],
      answer: 1,
      explanation: "The VM connector provides intra-app (or intra-cluster) queues in two modes: transient in-memory (fast, lost on restart) and persistent (survives restarts, slower). Cross-application messaging on CloudHub needs Anypoint MQ or another broker.",
      optionNotes: [
        "Wrong — only PERSISTENT VM queues survive restarts; transient ones don't.",
        "Correct — the transient/persistent trade-off is speed vs durability.",
        "Wrong — VM queues never cross application boundaries; that needs Anypoint MQ/JMS.",
        "Wrong — VM queues are built in; no external broker is required."
      ]
    },
    "m2-007": {
      options: [
        "It is deleted permanently once the delivery limit is reached",
        "It is moved to the dead-letter queue for later inspection or reprocessing",
        "It is re-queued at the front of the original queue to try again",
        "The whole queue is suspended until an operator intervenes"
      ],
      answer: 1,
      explanation: "The DLQ captures messages that repeatedly fail delivery/acknowledgment, so poison messages stop looping while remaining available for analysis or manual replay.",
      optionNotes: [
        "Wrong — a DLQ exists precisely so the message isn't lost.",
        "Correct — over-limit messages are routed to the DLQ.",
        "Wrong — re-queuing at the front is what causes the poison-message loop the DLQ prevents.",
        "Wrong — the queue keeps operating; only the failing message is diverted."
      ]
    },
    "m2-008": {
      options: [
        "Whenever more than one operation runs anywhere in the flow",
        "When one atomic transaction must span multiple resources, e.g. consume JMS and write to a DB",
        "Whenever the flow performs any HTTP Request operation",
        "Whenever the flow contains an Async scope"
      ],
      answer: 1,
      explanation: "A local transaction covers a single resource. XA uses two-phase commit to coordinate multiple resources (JMS + DB) atomically — heavier, needing an XA transaction manager and XA-capable connectors.",
      optionNotes: [
        "Wrong — multiple operations on one resource still use a local transaction.",
        "Correct — spanning multiple transactional resources atomically is what XA is for.",
        "Wrong — HTTP isn't transactional; it never requires XA.",
        "Wrong — Async runs on a copy outside the transaction; it doesn't imply XA."
      ]
    },
    "m2-009": {
      options: [
        "It is rolled back, because an error occurred inside the scope",
        "It is committed, because On Error Continue treats the processing as successful",
        "It stays open until the surrounding flow finishes executing",
        "XA transactions cannot be demarcated by a Try scope at all"
      ],
      answer: 1,
      explanation: "On Error Continue = handled successfully → the transaction commits (the handler's processors even run inside it). On Error Propagate → rollback. Choosing the wrong handler can accidentally commit partial work.",
      optionNotes: [
        "Wrong — rollback is the On Error Propagate outcome, not Continue.",
        "Correct — Continue marks the processing successful, so the transaction commits.",
        "Wrong — the transaction resolves when the Try scope ends, not at flow end.",
        "Wrong — a Try scope can demarcate local or XA transactions."
      ]
    },
    "m2-011": {
      options: [
        "Any payload at all, including one-time non-repeatable streams",
        "Responses to idempotent requests with repeatable (or already-consumed) payloads",
        "Only XML payloads, because they can be re-serialized",
        "Only payloads smaller than 1 MB in total size"
      ],
      answer: 1,
      explanation: "Cache is for idempotent request-response interactions where the same key yields the same response. Cached entries must be re-servable, so unconsumed non-repeatable streams cannot be replayed to later callers.",
      optionNotes: [
        "Wrong — an unconsumed non-repeatable stream can't be replayed from cache.",
        "Correct — idempotent responses with replayable payloads are safe to cache.",
        "Wrong — format doesn't decide cacheability; replayability does.",
        "Wrong — there's no fixed 1 MB rule; the constraint is replayability and a sensible key/TTL."
      ]
    },
    "m2-012": {
      options: [
        "It automatically retries any duplicate messages it detects",
        "It computes an ID per message and raises MULE:DUPLICATE_MESSAGE for IDs already seen (via Object Store)",
        "It validates the payload against a JSON schema before processing",
        "It removes duplicate records found inside a single payload array"
      ],
      answer: 1,
      explanation: "The Idempotent Message Validator enforces exactly-once at the processing level: an ID expression is checked against an Object Store of seen IDs; duplicates raise an error you handle (e.g. return 409).",
      optionNotes: [
        "Wrong — it rejects duplicates, it doesn't retry them.",
        "Correct — ID + Object Store lookup; repeats raise MULE:DUPLICATE_MESSAGE.",
        "Wrong — schema validation is a different component entirely.",
        "Wrong — it dedups across messages over time, not within one array payload."
      ]
    },
    "m2-013": {
      options: [
        "One thread pool per connector, sized manually in every application",
        "A single self-tuning runtime thread pool with back-pressure; manual sizing is rarely needed",
        "One dedicated thread per flow instance, fixed at deployment time",
        "Threads are created and reclaimed by the JVM garbage collector"
      ],
      answer: 1,
      explanation: "Mule 4 replaced Mule 3's manual threading model with a centralized, self-tuning pool and automatic back-pressure. Developers influence concurrency via maxConcurrency on flows, not by sizing pools per app.",
      optionNotes: [
        "Wrong — that's the Mule 3 model; Mule 4 centralizes threading.",
        "Correct — one self-tuning pool with back-pressure; tune via maxConcurrency.",
        "Wrong — flows aren't bound to a fixed dedicated thread.",
        "Wrong — the GC reclaims memory; it doesn't schedule event-processing threads."
      ]
    },
    "m2-014": {
      options: [
        "Enable persistent queues so requests survive a restart",
        "Scale horizontally by adding workers/replicas; CloudHub load-balances across them",
        "Increase the streaming buffer size on the inbound listener",
        "Consolidate all processing logic into a single large flow"
      ],
      answer: 1,
      explanation: "Stateless workloads scale horizontally: more workers behind CloudHub's load balancer. Vertical scaling (a bigger worker) helps too, but horizontal scaling also adds availability.",
      optionNotes: [
        "Wrong — persistence is about durability, not throughput for CPU-bound work.",
        "Correct — add workers/replicas and let the load balancer spread the load.",
        "Wrong — buffer size doesn't add CPU capacity.",
        "Wrong — merging flows doesn't add processing capacity."
      ]
    },
    "m2-015": {
      options: [
        "Each node keeps fully independent object stores and VM queues",
        "Object stores and VM queues are shared cluster-wide; scheduled sources run on the primary node",
        "Clustering is only available when running on CloudHub",
        "Every node in the cluster must run a different application"
      ],
      answer: 1,
      explanation: "A cluster acts as one logical unit: a distributed memory grid backs shared persistent object stores and VM queues, and polling/scheduled sources default to primary-node-only execution to avoid duplicate triggers.",
      optionNotes: [
        "Wrong — the point of a cluster is shared state, not independent stores per node.",
        "Correct — shared cluster-wide state plus primary-node-only scheduling.",
        "Wrong — clustering is a customer-hosted feature; CloudHub isolates workers instead.",
        "Wrong — all nodes run the same app(s) as one logical unit."
      ]
    },
    "m2-016": {
      options: [
        "The number of applications allowed on a single worker",
        "The maximum event instances the flow processes at once; excess triggers back-pressure",
        "The size of the repeatable streaming buffer for the flow",
        "The number of retry attempts for failed operations"
      ],
      answer: 1,
      explanation: "maxConcurrency caps simultaneous executions of a flow. When exceeded, back-pressure applies to the source (e.g. an HTTP Listener returns 503, or a poller slows down).",
      optionNotes: [
        "Wrong — worker density has nothing to do with maxConcurrency.",
        "Correct — it's the cap on concurrent executions, with back-pressure beyond it.",
        "Wrong — buffer size is a streaming-strategy setting, not maxConcurrency.",
        "Wrong — retries are Until Successful/reconnection, not maxConcurrency."
      ]
    },
    "m2-018": {
      options: [
        "A Try scope with an On Error Continue handler around the call",
        "An Until Successful scope with maxRetries=3 and millisBetweenRetries=2000 around the request",
        "A For Each scope configured to iterate exactly three times",
        "A redelivery policy configured on the HTTP Listener source"
      ],
      answer: 1,
      explanation: "Until Successful retries its inner processors with the configured attempts and interval. A redelivery policy protects a listener from reprocessing the same inbound message — a different concern.",
      optionNotes: [
        "Wrong — a Try/Continue handles the error once; it doesn't retry with a delay.",
        "Correct — Until Successful with maxRetries and millisBetweenRetries is exactly this.",
        "Wrong — For Each iterates a collection; it isn't a retry mechanism.",
        "Wrong — redelivery applies to inbound messages, not an outbound call."
      ]
    },
    "m2-074": {
      options: [
        "It is rolled back to the queue and redelivered to the consumer",
        "The transaction commits — Continue marks the flow successful, so the message is consumed and the DB write is lost",
        "It is moved to a dead-letter queue automatically by the runtime",
        "JMS messages are unable to participate in Mule transactions"
      ],
      answer: 1,
      explanation: "On Error Continue keeps the transaction alive and lets it commit — the message is acknowledged despite the failed write. This silent-loss trap is why transactional flows normally use On Error Propagate (rollback → redelivery).",
      optionNotes: [
        "Wrong — rollback/redelivery needs On Error Propagate, not Continue.",
        "Correct — Continue commits the transaction, acking the message while losing the DB write.",
        "Wrong — nothing auto-routes to a DLQ here; the message is simply committed.",
        "Wrong — JMS is a transactional connector and does participate."
      ]
    },
    "m2-075": {
      options: [
        "They are two names for the same retry mechanism",
        "Reconnection retries the connection at the connector level; Until Successful retries the wrapped operations",
        "Until Successful can only be used on message sources",
        "Reconnection persists in-flight messages to disk between attempts"
      ],
      answer: 1,
      explanation: "Reconnection strategies re-establish broken connections (config-level). Until Successful re-executes the processors inside it until they succeed or retries exhaust (MULE:RETRY_EXHAUSTED). They complement each other.",
      optionNotes: [
        "Wrong — they operate at different levels (connection vs processing).",
        "Correct — connection-level retry vs operation-level retry.",
        "Wrong — Until Successful wraps processors, not sources.",
        "Wrong — reconnection re-establishes connections; it doesn't persist messages."
      ]
    },
    "m2-076": {
      options: [
        "Nothing is wrong; persistent VM queues work across separate apps",
        "VM queues never cross application boundaries — use Anypoint MQ (or JMS) for durable inter-app messaging",
        "VM queues would deliver the messages far too quickly to be safe",
        "VM queues require a domain project to be deployed on CloudHub"
      ],
      answer: 1,
      explanation: "VM queues connect flows WITHIN one application only. Inter-application messaging with durability needs a broker: Anypoint MQ (hosted) or JMS. This is one of the most-tested VM facts.",
      optionNotes: [
        "Wrong — VM queues are intra-app; they can't link two apps.",
        "Correct — cross-app durable messaging needs Anypoint MQ or JMS.",
        "Wrong — speed isn't the issue; scope is.",
        "Wrong — domains share configs on customer-hosted runtimes, unrelated to CloudHub VM messaging."
      ]
    },
    "m2-078": {
      options: [
        "An Until Successful scope, with nothing else required",
        "A Cache scope backed by a shared Object Store (OSv2 on CloudHub) with a sensible TTL",
        "An Async scope, plus a couple more workers",
        "A Batch job that aggregates the records first"
      ],
      answer: 1,
      explanation: "The Cache scope memoizes its inner processors' result by key. On multiple workers the default in-memory store gives each worker its own cache, so use a shared OSv2-backed store for consistency; a TTL bounds staleness for daily-changing data.",
      optionNotes: [
        "Wrong — Until Successful retries; it doesn't reduce repeated backend load.",
        "Correct — a Cache scope with a shared OSv2 store and TTL fits reference data.",
        "Wrong — Async just offloads work; it doesn't cache responses.",
        "Wrong — Batch is for large dataset processing, not response caching."
      ]
    }
  }
};
