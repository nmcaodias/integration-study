/* MCIA de-bias · sections a7–a8. */
module.exports = {
  questions: {
    "ia-043": {
      optionEdits: { 0: "A local (single-resource) transaction on one connector", 1: "An XA transaction spanning the DB and JMS operations", 2: "Until Successful wrapped around both operations", 3: "Two separate Try scopes, one per operation" },
      optionNotes: ["A local transaction covers one resource, not DB + JMS together.", "Correct — XA (two-phase commit) makes the DB and JMS operations atomic across resources.", "Until Successful retries; it doesn't give cross-resource atomicity.", "Independent Try scopes commit separately, not atomically."]
    },
    "ia-044": {
      optionEdits: { 0: "Wrap the external HTTP call in an XA transaction", 1: "Persist to a queue, consume transactionally, call the API with retries, and make the call idempotent", 2: "Use a local transaction on the HTTP connector", 3: "Call the API inside a Cache scope for durability" },
      optionNotes: ["HTTP can't join an XA transaction.", "Correct — durable queue + transactional consume + idempotent retried call guarantees eventual, exactly-once-effect recording.", "HTTP isn't transactional, so a local transaction doesn't apply.", "A Cache scope doesn't provide delivery durability."]
    },
    "ia-045": {
      optionEdits: { 0: "An XA transaction spanning the three booking APIs", 1: "Compensation (saga): each step has a compensating action run when a later step fails", 2: "One local transaction per API call", 3: "Scatter-Gather with an overall timeout" },
      optionNotes: ["APIs over HTTP can't participate in XA, and long waits make it impractical.", "Correct — a saga runs compensating actions (cancel flight/hotel) when a later step fails.", "Local transactions don't span independent remote systems.", "Scatter-Gather parallelises calls but doesn't undo completed steps."]
    },
    "ia-046": {
      optionEdits: { 0: "Reconnection = message level; redelivery = connection level; Until Successful = flow level", 1: "Reconnection = connection level; Until Successful = in-flow operation retries; redelivery = per-message source attempts feeding a DLQ", 2: "All three are interchangeable mechanisms", 3: "Until Successful = connection level; the others are equivalent" },
      optionNotes: ["That mislabels every mechanism's level.", "Correct — reconnection retries connections, Until Successful retries operations, redelivery counts per-message source attempts (then DLQ).", "They target different failure levels, not interchangeable.", "Until Successful retries operations, not connections."]
    },
    "ia-047": {
      optionEdits: { 0: "It can retry at most three times before giving up", 1: "The retried event is held in memory — a crash during retries loses it; durability needs a persistent queue", 2: "It only works with the HTTP connector", 3: "It commits transactions automatically on success" },
      optionNotes: ["The retry count is configurable; that's not the gap.", "Correct — Until Successful holds the event in memory, so a crash mid-retry loses it; use a persistent queue for zero loss.", "It works with any processors, not just HTTP.", "It doesn't manage transactions."]
    },
    "ia-048": {
      optionEdits: { 0: "They are essentially synonyms in practice", 1: "HA = redundancy/failover within a deployment; DR = restoring service after losing a whole site/region (RTO/RPO)", 2: "DR is achieved automatically by running two CloudHub workers", 3: "HA applies only to customer-hosted deployments" },
      optionNotes: ["HA and DR address different failure scopes.", "Correct — HA handles component failure within a site; DR handles losing an entire site/region, measured by RTO/RPO.", "Two workers give HA in one region, not cross-region DR.", "HA applies to CloudHub and customer-hosted alike."]
    },
    "ia-049": {
      optionEdits: { 0: "CloudHub automatically replicates applications to a second region", 1: "OSv2 and Anypoint MQ are regional — the DR region needs its own instances, state/message strategy, app deploy, and DNS switch within the hour", 2: "Only the control plane needs a disaster-recovery plan", 3: "Static IPs move automatically across regions on failover" },
      optionNotes: ["CloudHub doesn't auto-replicate apps across regions.", "Correct — regional state (OSv2/MQ) means DR needs its own instances plus deployment and DNS switchover inside the RTO.", "The apps and their state need DR planning, not just the control plane.", "Static IPs are region-scoped and don't migrate automatically."]
    },
    "ia-050": {
      optionEdits: { 0: "Until Successful configured with infinite retries", 1: "A redelivery policy (or broker max-delivery count) routing exhausted messages to a dead-letter queue", 2: "On Error Continue that swallows the error", 3: "Deleting messages that fail to process" },
      optionNotes: ["Infinite retries block the queue on a poison message.", "Correct — cap redeliveries and route exhausted messages to a DLQ for analysis without blocking.", "Swallowing the error loses the message and its cause.", "Deleting failures destroys the evidence."]
    },
    "ia-051": {
      optionEdits: { 0: "Call the backends sequentially and rely on cache hits", 1: "Call the three backends concurrently with Scatter-Gather so total ≈ the slowest call", 2: "Add more CloudHub workers to the deployment", 3: "Increase the HTTP request timeout" },
      optionNotes: ["Sequential calls sum the latencies (~1200 ms).", "Correct — parallelising with Scatter-Gather makes total latency approach the slowest single call (~400 ms).", "More workers add throughput, not lower single-request latency.", "A bigger timeout doesn't reduce latency."]
    },
    "ia-052": {
      optionEdits: { 0: "Vertical scaling only — triple the vCore size of one worker", 1: "Horizontal scaling — more workers/replicas behind the load balancer (safe because stateless), validated by load test", 2: "Rewrite all the flows as batch jobs", 3: "Raise maxConcurrency to 900 on a single worker" },
      optionNotes: ["Vertical scaling has a ceiling and no added redundancy.", "Correct — a stateless API scales out horizontally behind the load balancer; validate with a load test.", "Batch jobs are for bulk processing, not request throughput.", "One worker at maxConcurrency=900 still bottlenecks on that instance."]
    },
    "ia-053": {
      optionEdits: { 0: "Read the whole file into memory and increase the JVM heap", 1: "Repeatable file-stored streaming plus DataWeave streaming so data flows through in chunks", 2: "Parallel For Each over all rows loaded into memory", 3: "Base64-encode the file before processing it" },
      optionNotes: ["A 10 GB file won't fit in 2 GB of heap.", "Correct — file-stored + DataWeave streaming processes the file in bounded chunks.", "Loading all rows in memory defeats streaming.", "Base64 enlarges the payload and doesn't help memory."]
    },
    "ia-054": {
      optionEdits: { 0: "Add more Mule workers so requests finish faster", 1: "Bound concurrency toward the ERP (maxConcurrency / queue buffering) so excess load waits", 2: "Reduce the ERP's request timeout", 3: "Switch to non-repeatable streams to save memory" },
      optionNotes: ["More workers push MORE load at the ERP, worsening it.", "Correct — cap concurrency toward the ERP so excess requests wait instead of overwhelming it.", "A shorter timeout just fails requests, not protects the ERP.", "Stream type doesn't limit ERP concurrency."]
    },
    "ia-055": {
      optionEdits: { 0: "Passing the stream straight to a single downstream write", 1: "Logging #[payload] mid-flow and then transforming it with random access to all records", 2: "Using repeatable file-stored streams for the payload", 3: "Setting deferred=true on the DataWeave writer" },
      optionNotes: ["A single passthrough write keeps streaming intact.", "Correct — logging the whole payload (or random-access processing) materialises the stream in memory.", "File-stored streams are exactly how you avoid this.", "deferred=true streams output, aiding not defeating streaming."]
    },
    "ia-056": {
      optionEdits: { 0: "A Parallel For Each over the records", 1: "A Batch Job (persistent record queues, record-level error handling, resume after restart)", 2: "A Scatter-Gather across the records", 3: "Until Successful wrapped around a For Each" },
      optionNotes: ["Parallel For Each holds records in memory and doesn't resume after a crash.", "Correct — Batch Job persists records, isolates per-record failures, and resumes after restart.", "Scatter-Gather is for a fixed set of parallel routes, not millions of records.", "Until Successful retries operations, not resilient bulk processing."]
    },
    "ia-057": {
      optionEdits: { 0: "\"The API should feel fast to users\"", 1: "\"p95 latency <= 300 ms at 500 req/s sustained, payloads up to 100 KB\"", 2: "\"Average latency should be OK under normal load\"", 3: "\"As fast as possible under all conditions\"" },
      optionNotes: ["'Feels fast' isn't measurable.", "Correct — a good NFR is specific and testable: percentile, throughput, and payload bounds.", "'OK' and 'normal load' are undefined.", "'As fast as possible' sets no target to verify."]
    },
    "ia-087": {
      optionEdits: { 0: "An XA transaction spanning the HTTP call and MQ publish", 1: "Call the payment API first (idempotent, retried); publish the MQ confirmation only on confirmed success", 2: "Publish the confirmation first, then call the payment API", 3: "Scatter-Gather to the API and MQ simultaneously" },
      optionNotes: ["HTTP can't join XA, so this ordering guarantee isn't available that way.", "Correct — payment first (idempotent + retried), confirm only after success; retry from a durable source before publish.", "Confirming first risks a confirmation with no payment.", "Parallel calls can't guarantee the payment-before-confirmation ordering."]
    },
    "ia-091": {
      optionEdits: { 0: "A For Each over the full result set held in memory", 1: "Streamed DB select feeding a Batch Job with a Batch Aggregator sized for Bulk API v2", 2: "A Parallel For Each with 8 million entries in memory", 3: "One HTTP call to Salesforce per row" },
      optionNotes: ["8M rows won't fit in memory.", "Correct — stream the select into a Batch Job, aggregating into Bulk API v2 batches for efficient upserts.", "Parallel For Each over 8M in memory exhausts heap.", "Per-row calls blow through API limits."]
    },
    "ia-092": {
      optionEdits: { 0: "Add more Mule workers to the deployment", 1: "Constrain concurrency toward the ERP (maxConcurrency, queue buffering at its safe rate)", 2: "Lower the ERP's request timeouts", 3: "Retry ERP failures more aggressively" },
      optionNotes: ["More workers increase pressure on the fragile ERP.", "Correct — throttle toward the ERP so Mule absorbs load the ERP can't take.", "Shorter timeouts just fail faster.", "Aggressive retries add more load to an overwhelmed system."]
    }
  }
};
