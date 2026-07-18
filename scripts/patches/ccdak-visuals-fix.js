/* CCDAK · add the required explanation field to the new visual questions. */
module.exports = {
  questions: {
    "kk-116": { explanation: "An idempotent producer (acks=all) removes retry duplicates and preserves per-partition order, but end-to-end exactly-once across topics requires transactions and read_committed consumers." },
    "kk-117": { explanation: "errors.tolerance=all plus a dead-letter-queue topic lets a sink connector skip malformed records (routing them, with context headers, to the DLQ) while the task keeps running." },
    "kk-118": { explanation: "Consumer lag = log-end offset − current offset for a partition; here 61240 − 48120 = 13120 records behind, the key signal to monitor and alert on." }
  }
};
