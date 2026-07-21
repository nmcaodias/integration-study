/* MCIA · length-balance. The bank's tell is "short options are rarely correct"
 * (longest-correct 36%, ratio 1.41x). Extend the top distractor past the correct
 * answer on the questions where the correct option is the longest — the new hard
 * batch (thorough correct answers) plus the worst existing offenders — and trim
 * one over-long new correct option (ia-131). Answers/meaning unchanged. */
module.exports = {
  questions: {
    // --- new hard batch: extend a distractor past the correct answer ---
    "ia-127": { optionEdits: { 1: "Topics can't fan out to multiple independent subscribers at all, so the design fails immediately and must be rebuilt as three separate point-to-point queues, one dedicated to each of inventory, shipping, and analytics" } },
    "ia-128": { optionEdits: { 3: "The design is correct as drawn — skipping the Process layer is the recommended optimization whenever an Experience API needs data from several systems, because a Process API there would only add an unnecessary network hop and latency" } },
    "ia-130": { optionEdits: { 1: "Static IPs solve (2) inbound restriction, but the partner allowlist in (1) actually requires a Dedicated Load Balancer with a custom certificate instead, since only the DLB can present the stable source address the partner's firewall will accept" } },
    "ia-131": {
      optionEdits: {
        0: "MUnit is functional unit testing on a single mocked event; throughput and p95 latency only emerge under concurrent load, so a performance test must verify the NFR",
        2: "MUnit can verify the NFR, but only if the mocks are removed so the test calls the real backends during the CI build, so the measured timings reflect genuine downstream latency rather than mocked responses"
      }
    },
    "ia-132": { optionEdits: { 1: "An XA transaction enlisting the three REST APIs so all three commit or roll back atomically once the car step's outcome is known, with the transaction manager holding every booking open until all providers have confirmed" } },
    "ia-133": { optionEdits: { 1: "Switch the queue to at-most-once delivery so messages are never redelivered, which removes duplicates without any consumer changes because the broker simply drops any message it cannot immediately confirm as delivered" } },
    "ia-134": { optionEdits: { 1: "Add more Mule workers so the app can push the incoming load through to the ERP faster, since horizontally scaling the Mule tier is the standard way to raise end-to-end throughput when a downstream system is slow" } },
    "ia-135": { optionEdits: { 3: "One-way (server) TLS is sufficient for caller identity, because the server certificate presented during the handshake also identifies the client that chose to trust and connect to it, so no client certificate is needed" } },
    "ia-136": { optionEdits: { 1: "Give each app its own independent correlation id and rely on Anypoint Monitoring to mathematically reconstruct the end-to-end chain from log timestamps and payload similarity across the three applications" } },
    "ia-137": { optionEdits: { 3: "Both problems are solved by committing an encrypted properties file that includes the password directly into the repository and having each environment build its own artifact from it at deploy time" } },
    // --- existing offenders where the correct option is the longest ---
    "ia-015": { optionEdits: { 2: "Recompile the app with a production Maven profile that bakes the production database password straight into the packaged artifact" } },
    "ia-076": { optionEdits: { 3: "When strict message ordering must be preserved across weeks of continuous high-volume traffic flowing between the systems" } },
    "ia-027": { optionEdits: { 1: "Queueing messages reliably between two separate applications that require guaranteed delivery" } },
    "ia-095": { optionEdits: { 2: "Anypoint Visualizer's real-time application dependency graph and topology view" } },
    "ia-074": { optionEdits: { 2: "Anypoint Private Cloud Edition paired with CloudHub runtimes hosted in the EU region" } },
    "ia-013": { optionEdits: { 2: "Competing consumers distributed across all of the topic's subscribers" } },
    "ia-057": { optionEdits: { 2: "Average response latency should generally stay acceptable under normal production load" } },
    "ia-112": { optionEdits: { 3: "Raise the JVM heap size on the single existing worker via a Runtime Manager deployment property" } },
    "ia-024": { optionEdits: { 2: "Switching to an Object Store instead of a VM queue for distributing the work across workers" } }
  }
};
