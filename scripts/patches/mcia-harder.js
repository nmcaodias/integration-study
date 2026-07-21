/* MCIA · complete per-option notes on the 9 select-all questions that lacked
 * them (the only questions in the bank missing optionNotes). Notes are parallel
 * to options; correct indexes per each question's `answers` array. No answer or
 * wording changes. (The bank's recall questions already have well-formed
 * distractors + notes from the earlier de-bias pass, so no upgrades needed.) */
module.exports = {
  questions: {
    "ia-073": { optionNotes: [
      "NFR — a latency/performance target: how well the system must operate, not what it does.",
      "Functional — enriching records with credit scores is a capability the system performs.",
      "NFR — availability / fault tolerance (survive an AZ loss).",
      "NFR — a security standard governing how well data must be protected."
    ] },
    "ia-077": { optionNotes: [
      "Correct — platform events are pushed to a Subscribe channel in near real time.",
      "Correct — Change Data Capture streams record-change events as they happen, no polling.",
      "Scheduled SOQL every 5s is periodic pull, not event-driven push.",
      "Bulk API v2 query is for large batch extracts, not real-time change capture."
    ] },
    "ia-079": { optionNotes: [
      "Correct — connectors declare their input/output types, which DataSense reads at design time.",
      "Correct — an API specification imported via APIkit supplies message types.",
      "Correct — custom metadata types defined from a schema or example feed DataSense.",
      "DataSense is design-time; it does not inspect live production payloads."
    ] },
    "ia-081": { optionNotes: [
      "Correct — OSv2 caps entry TTL at 30 days, so design around expiry.",
      "Correct — the OSv2 API is rate-limited, so plan access patterns/TPS.",
      "Correct — values are shared across the app's workers within the region.",
      "OSv2 does not automatically replicate across regions — that gap is a DR concern to design for."
    ] },
    "ia-083": { optionNotes: [
      "Correct — an Anypoint VPC peered/VPN'd to the corporate network keeps traffic internal.",
      "Correct — a Dedicated Load Balancer serves the custom domain with the company's certificate.",
      "Correct — firewall/network design ensures only internal paths reach the workers.",
      "Static IPs enable outbound allowlisting; they don't restrict inbound to the corporate network."
    ] },
    "ia-088": { optionNotes: [
      "Correct — two workers across AZs give HA against worker/AZ failure.",
      "False — two workers in one region do NOT protect against losing the whole region; that's DR.",
      "Correct — DR needs a second region, a regional-state strategy (OSv2, MQ), and endpoint switchover.",
      "Correct — RTO and RPO are the DR objectives agreed with the business."
    ] },
    "ia-089": { optionNotes: [
      "Correct — Anypoint MQ maxDeliveries routes poison messages to a DLQ.",
      "Correct — a redelivery policy raising REDELIVERY_EXHAUSTED, handled by publishing to a dead-letter destination, preserves the payload and reason.",
      "Infinite retries block the queue on a poison message — the opposite of the requirement.",
      "On Error Continue that discards the message loses the payload and failure reason."
    ] },
    "ia-090": { optionNotes: [
      "Correct — caching stable System responses at the Process layer removes per-request latency.",
      "Correct — collapsing a Process layer that adds no orchestration removes a hop.",
      "Correct — Scatter-Gather runs independent backend calls concurrently, cutting wall-clock latency.",
      "More workers add throughput/capacity, not lower per-request latency when time is spent waiting downstream."
    ] },
    "ia-094": { optionNotes: [
      "Correct — edge policies (DoS protection, HTTP limits, WAF) are Anypoint Security, enforced at the RTF edge.",
      "Correct — perimeter tokenization of sensitive fields is an Anypoint Security capability.",
      "Client ID enforcement is a standard API Manager policy — not Anypoint Security.",
      "Correct — Secrets Manager for TLS keystores/secrets is part of Anypoint Security."
    ] }
  }
};
