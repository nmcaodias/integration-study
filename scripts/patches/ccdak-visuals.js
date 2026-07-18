/* CCDAK · new exhibit-based (visual) questions. Config snippets across k2/k4/k6
 * with per-option notes and length-balanced options. */
module.exports = {
  addQuestions: [
    {
      id: "kk-116",
      section: "k2",
      level: "medium",
      q: "Refer to the exhibit. What does this producer configuration guarantee, and what does it NOT guarantee?",
      exhibit: "props.put(\"acks\", \"all\");\nprops.put(\"enable.idempotence\", \"true\");\nprops.put(\"retries\", Integer.MAX_VALUE);\n// no transactional.id set",
      options: [
        "No duplicates from retries and no reordering within a partition; NOT end-to-end exactly-once across topics",
        "Exactly-once delivery all the way to the downstream consumers with no further configuration required",
        "That every produced record is delivered to consumers in strict global order across all partitions",
        "Nothing useful, because idempotence has no effect unless transactional.id is also configured on it"
      ],
      answer: 0,
      optionNotes: [
        "Correct — idempotence + acks=all dedupes retries and preserves per-partition order, but EOS across topics needs transactions.",
        "Consumer-side exactly-once needs transactions and read_committed, not just an idempotent producer.",
        "Ordering is per partition only; there is no global cross-partition order.",
        "Idempotence works without transactional.id; the transactional.id is only needed for transactions."
      ]
    },
    {
      id: "kk-117",
      section: "k4",
      level: "medium",
      q: "Refer to the exhibit. What does this sink-connector configuration achieve for malformed records?",
      exhibit: "{\n  \"errors.tolerance\": \"all\",\n  \"errors.deadletterqueue.topic.name\": \"dlq-orders\",\n  \"errors.deadletterqueue.context.headers.enable\": \"true\"\n}",
      options: [
        "Bad records are skipped and routed to dlq-orders with context headers, so the task keeps running",
        "The connector stops its task on the very first malformed record it encounters in the stream",
        "Malformed records are silently dropped with no way to inspect or recover them afterward",
        "Every record, valid or not, is copied into dlq-orders in addition to the target system"
      ],
      answer: 0,
      optionNotes: [
        "Correct — tolerate errors and send failed records (with context headers) to the DLQ topic while the task continues.",
        "That is errors.tolerance=none behavior, the opposite of this config.",
        "The DLQ is exactly what makes the bad records inspectable, not silently dropped.",
        "Only failed records go to the DLQ, not every record."
      ]
    },
    {
      id: "kk-118",
      section: "k6",
      level: "easy",
      q: "Refer to the exhibit (kafka-consumer-groups.sh --describe). What does this row indicate?",
      exhibit: "GROUP       TOPIC     PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG\nbilling     payments  3          48120           61240           13120",
      options: [
        "The consumer is 13120 records behind on partition 3 — lag to monitor and alert on",
        "The topic partition 3 holds exactly 48120 records in total at this moment",
        "The consumer has read 13120 records ahead of the end of the log somehow",
        "The partition has 61240 consumers, one per record, which is far too many"
      ],
      answer: 0,
      optionNotes: [
        "Correct — lag = log-end (61240) − current (48120) = 13120 records behind on that partition.",
        "Current-offset is a position, not the total record count of the partition.",
        "A consumer cannot read past the log-end offset.",
        "Those numbers are offsets, not consumer counts."
      ]
    }
  ]
};
