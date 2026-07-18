/* MCPA length-balance · p7–p9 (part 2), including the pre-existing detailed
 * questions pa-073..097 whose correct option was never length-balanced. Trim the
 * over-long correct answers into the distractor band; lift the shortest
 * distractors. Answers/notes unchanged. */
module.exports = {
  questions: {
    "pa-055": { optionEdits: { 1: "The single worker, VPN tunnel, and backend — each needs redundancy" } },
    "pa-058": { optionEdits: { 1: "A Cache scope around only the currency lookup, keyed by pair (~1 h TTL)" } },
    "pa-061": { optionEdits: { 1: "Fall back to last-known-good cached data and flag staleness" } },
    "pa-062": { optionEdits: { 1: "Little — it raises throughput and availability, not single-request latency" } },
    "pa-064": { optionEdits: { 1: "1=API analytics, 2=Anypoint Monitoring, 3=Anypoint Visualizer" } },
    "pa-066": { optionEdits: { 1: "Failures arise anywhere; layered alerts localize the fault to the right API" } },
    "pa-068": { optionEdits: { 1: "Growth in API consumption and reuse across projects and consumers" } },
    "pa-069": {
      optionEdits: {
        1: "Business telemetry driving a custom order-rate dashboard/alert",
        2: "Deployment success and failure notifications",
        3: "VPC flow logs collected for the environment"
      }
    },
    "pa-070": {
      optionEdits: {
        1: "It actively calls the API on a schedule and asserts on real responses",
        2: "It only runs in development environments, never production",
        3: "It is a drop-in replacement for MUnit unit tests"
      }
    },
    "pa-071": { optionEdits: { 1: "Anypoint Visualizer — its live graph shows what calls the degraded node" } },
    "pa-072": { optionEdits: { 1: "Every alert has an owner and SLA-tied threshold; incidents drive reviews" } },
    "pa-073": { optionEdits: { 0: "Self-service reuse of discoverable assets that speeds each new project" } },
    "pa-074": { optionEdits: { 0: "One org with a business group per division, each self-managing its assets" } },
    "pa-076": { optionEdits: { 0: "A trait — a reusable method fragment (is: [pageable]) shared via Exchange" } },
    "pa-077": { optionEdits: { 0: "Publish it as a new major version (/v3), running v2 alongside during deprecation" } },
    "pa-078": {
      optionEdits: {
        0: "The mocking service on the spec in Exchange/API Designer",
        1: "CloudHub autoscaling of the workers",
        2: "The API's MUnit test suite in the pipeline",
        3: "Runtime Manager application logs"
      }
    },
    "pa-080": { optionEdits: { 0: "In a mobile experience API that adapts the process API's canonical response" } },
    "pa-081": { optionEdits: { 0: "Expose the ERP only via system APIs with a stable contract; reimplement them at migration" } },
    "pa-083": { optionEdits: { 0: "Excess is rejected with HTTP 429; requests must carry valid client credentials" } },
    "pa-084": {
      optionEdits: {
        0: "API autodiscovery linking the app to its API instance (api.id + credentials)",
        1: "A CNAME record pointing consumers at the application"
      }
    },
    "pa-085": { optionEdits: { 0: "A enforces each consumer's quota; B smooths spikes to protect the backend" } },
    "pa-086": { optionEdits: { 0: "Consumers request access under a contract an owner approves and can revoke per app" } },
    "pa-087": { optionEdits: { 0: "Front it with a Mule proxy or Flex Gateway and manage its policies in API Manager" } },
    "pa-088": { optionEdits: { 0: "Nothing — same endpoint and contract; interface and implementation are decoupled" } },
    "pa-089": { optionEdits: { 0: "An HTTP caching policy on the instance, serving repeated GETs with a TTL" } },
    "pa-090": { optionEdits: { 0: "Call the three in parallel (Scatter-Gather) so latency approaches the slowest, not the sum" } },
    "pa-091": { optionEdits: { 0: "Deploy at least two workers — CloudHub spreads them across availability zones" } },
    "pa-092": { optionEdits: { 0: "Listen only on the VPC-internal ports the DLB reaches, disabling the public route" } },
    "pa-093": { optionEdits: { 0: "Zero-downtime redeployment — cut over to new workers only once they are healthy" } },
    "pa-094": { optionEdits: { 0: "Set the outbound timeout under the 3 s budget; map timeouts to a graceful error" } },
    "pa-095": { optionEdits: { 0: "The API's SLA (its NFRs); enforced per consumer via SLA tiers and policies" } },
    "pa-096": {
      optionEdits: {
        0: "API analytics — per-client request metrics by resource and method over time",
        2: "A survey sent to registered developer consumers"
      }
    },
    "pa-097": { optionEdits: { 0: "API-level alerts on the instance + infra alerts (CPU/memory) in Runtime Manager" } }
  }
};
