/* CCDAK de-bias · section k2 (application development). */
module.exports = {
  questions: {
    "kk-013": {
      optionEdits: {
        0: "Duplicates caused by the application calling send() twice itself",
        1: "Duplicates from the producer's own retries after transient failures, keeping ordering",
        2: "Duplicates on the consumer side after a group rebalance",
        3: "All duplicates anywhere across the end-to-end pipeline"
      },
      optionNotes: [
        "App-level double-sends are the application's bug; idempotence can't see them.",
        "Correct — idempotent producer dedupes retries of the same batch and preserves per-partition order.",
        "Consumer-side duplicates are a commit/EOS concern, not producer idempotence.",
        "It only covers producer retries, not the whole pipeline."
      ]
    },
    "kk-014": {
      optionEdits: {
        0: "Setting enable.idempotence=true on the producer alone",
        1: "Kafka transactions: a transactional.id producer writing output AND committing offsets atomically, with read_committed consumers",
        2: "Using acks=all together with retries=0",
        3: "A manual commitSync() after each processed record"
      },
      optionNotes: [
        "Idempotence dedupes writes but doesn't tie offset commits to output atomically.",
        "Correct — EOS across topics needs transactions (transactional.id + offsets in the txn) and read_committed downstream.",
        "acks/retries affect durability, not atomic consume-transform-produce.",
        "Manual commits are at-least-once, not exactly-once."
      ]
    },
    "kk-015": {
      optionEdits: {
        0: "They are redelivered to the group after the consumer restarts",
        1: "They are lost to this group — the committed offset already moved past them",
        2: "They are automatically moved to a dead-letter queue",
        3: "The broker detects the gap and reprocesses them"
      },
      optionNotes: [
        "The offset was already committed, so they won't be redelivered.",
        "Correct — auto-commit advanced the offset before processing finished, so those records are skipped (at-most-once risk).",
        "Kafka has no built-in DLQ for this; it just moves the offset.",
        "Brokers don't reprocess based on client processing state."
      ]
    },
    "kk-016": {
      optionEdits: {
        0: "session.timeout.ms — heartbeats are being missed",
        1: "max.poll.interval.ms — too long between poll() calls; raise it or lower max.poll.records",
        2: "auto.offset.reset is set incorrectly",
        3: "linger.ms is configured too high for the producer"
      },
      optionNotes: [
        "Heartbeats run on a background thread, so long processing usually trips max.poll.interval first.",
        "Correct — 10-minute batches exceed max.poll.interval.ms; the coordinator evicts the consumer. Raise it or shrink batches.",
        "auto.offset.reset controls start position, not rebalances.",
        "linger.ms is a producer batching setting, unrelated here."
      ]
    },
    "kk-017": {
      optionEdits: {
        0: "On every single consumer restart",
        1: "Only when the group has no valid committed offset (new group, expired, or out-of-range)",
        2: "Whenever the consumer's lag exceeds a threshold",
        3: "Every time the group performs a rebalance"
      },
      optionNotes: [
        "A restarting consumer with committed offsets resumes from them, not from earliest.",
        "Correct — the reset policy applies only when there is no valid committed offset to resume from.",
        "Lag doesn't trigger an offset reset.",
        "Rebalances reassign partitions but keep committed offsets."
      ]
    },
    "kk-018": {
      optionEdits: {
        0: "Set acks=0 so the producer never waits",
        1: "Raise linger.ms and batch.size so larger, better-compressed batches are sent",
        2: "Decrease buffer.memory to force smaller batches",
        3: "Set max.in.flight.requests.per.connection=1"
      },
      optionNotes: [
        "acks=0 boosts throughput but sacrifices durability, not the intended trade-off.",
        "Correct — a little linger plus bigger batches amortizes overhead and improves compression, trading slight latency for throughput.",
        "Shrinking buffer.memory reduces batching and can stall the producer.",
        "max.in.flight=1 lowers throughput to preserve ordering."
      ]
    },
    "kk-019": {
      optionEdits: {
        0: "The new schema must be readable by the old schema; producers upgrade first",
        1: "Consumers on the NEW schema must read data written with the PREVIOUS schema; consumers upgrade first",
        2: "Schemas can never change once registered",
        3: "Both producers and consumers must upgrade simultaneously"
      },
      optionNotes: [
        "That reverses BACKWARD's direction and upgrade order.",
        "Correct — BACKWARD means new-schema consumers can read old data, so consumers upgrade first.",
        "Compatibility modes exist precisely to allow safe evolution.",
        "The point of compatibility is to avoid lock-step upgrades."
      ]
    },
    "kk-020": {
      optionEdits: {
        0: "The full Avro schema is embedded in every single message",
        1: "Each message carries a schema ID; the deserializer fetches and caches that schema from the registry",
        2: "The topic name encodes which schema was used",
        3: "The schema is inferred by guessing from the raw bytes"
      },
      optionNotes: [
        "Embedding the full schema per message would be hugely wasteful — Confluent uses an ID.",
        "Correct — the wire format prefixes a schema ID that the deserializer resolves (and caches) via Schema Registry.",
        "Topic names don't encode schemas.",
        "Deserialization is exact, not guessed."
      ]
    },
    "kk-021": {
      optionEdits: {
        0: "The topic is corrupt and must be recreated from scratch",
        1: "A retriable error: leadership moved (broker restart/rebalance); the producer refreshes metadata and retries",
        2: "The producer's serializer is misconfigured or broken",
        3: "The message exceeded max.request.size and was rejected"
      },
      optionNotes: [
        "Nothing is corrupt; leadership simply moved.",
        "Correct — NotLeaderForPartition is transient during leader changes; the client refreshes metadata and retries automatically.",
        "A serializer fault would fail consistently, not intermittently with eventual success.",
        "An oversize record raises RecordTooLargeException, a different error."
      ]
    },
    "kk-022": {
      optionEdits: {
        0: "Restart the consumer repeatedly until the record gets through",
        1: "Handle the poison record: skip its offset (or use an error-tolerant deserializer) and send it to a DLQ",
        2: "Delete the entire topic to clear the record",
        3: "Reduce fetch.max.bytes so the record isn't fetched"
      },
      optionNotes: [
        "Restarting hits the same poison record and blocks again.",
        "Correct — advance past the bad offset (or tolerate the deserialization error) and route it to a dead-letter topic.",
        "Deleting the topic destroys all data — far too drastic.",
        "fetch.max.bytes controls batch size, not which records are poison."
      ]
    },
    "kk-023": {
      optionEdits: {
        0: "kafka-topics.sh --describe on the topic",
        1: "kafka-consumer-groups.sh --describe --group <name>",
        2: "kafka-console-consumer.sh --from-beginning",
        3: "kafka-configs.sh --describe on the broker"
      },
      optionNotes: [
        "kafka-topics describes partitions/replicas, not group lag.",
        "Correct — kafka-consumer-groups.sh --describe shows current offset, log-end offset, and lag per partition.",
        "The console consumer reads data; it doesn't report lag.",
        "kafka-configs manages configuration, not consumer lag."
      ]
    },
    "kk-024": {
      optionEdits: {
        0: "Per record on the broker, so the benefit is fixed",
        1: "Per batch on the producer (compression.type); larger batches compress better",
        2: "Only on the consumer side after fetching",
        3: "Only when Schema Registry is enabled"
      },
      optionNotes: [
        "Compression is a producer batch operation, not per-record on the broker.",
        "Correct — the producer compresses each batch; bigger batches (linger.ms/batch.size) yield better ratios.",
        "Consumers decompress; they don't originate compression.",
        "Compression is independent of Schema Registry."
      ]
    },
    "kk-025": {
      optionEdits: {
        0: "The Producer API",
        1: "The AdminClient (Admin API)",
        2: "The Kafka Streams API",
        3: "The Connect REST API"
      },
      optionNotes: [
        "The Producer API writes records; it can't manage topics or groups.",
        "Correct — AdminClient creates topics, alters configs, and inspects consumer-group offsets programmatically.",
        "Streams builds processing topologies, not cluster administration.",
        "The Connect REST API manages connectors, not general cluster admin."
      ]
    },
    "kk-068": {
      optionEdits: {
        0: "None — acks=1 is fully durable against any failure",
        1: "If the leader acks then fails before followers replicate, that write is lost on failover",
        2: "Every single produce is at risk of being lost",
        3: "Only consumers can lose data with acks=1"
      },
      optionNotes: [
        "acks=1 waits only for the leader, so it isn't fully durable.",
        "Correct — a leader crash after acking but before replication loses that record on failover.",
        "Only the unreplicated tail is at risk, not every write.",
        "The loss window is on the produce/replication side, not the consumer."
      ]
    },
    "kk-070": {
      optionEdits: {
        0: "enable.auto.commit=true with a short auto-commit interval",
        1: "Process each record FIRST, then commit offsets manually — at-least-once",
        2: "Commit offsets before processing — at-most-once",
        3: "Never commit offsets at all"
      },
      optionNotes: [
        "Auto-commit can advance offsets before processing completes, risking loss.",
        "Correct — commit only after processing gives at-least-once: no loss, possible duplicates (acceptable here).",
        "Committing before processing is at-most-once and can lose records.",
        "Never committing replays everything on every restart."
      ]
    },
    "kk-073": {
      optionEdits: {
        0: "New consumers read old data; consumers upgrade first",
        1: "Data written with the NEW schema is readable by consumers still on the OLD schema; producers upgrade first",
        2: "It says nothing about the order of upgrades",
        3: "Compatibility is guaranteed in both directions forever"
      },
      optionNotes: [
        "That describes BACKWARD, not FORWARD.",
        "Correct — FORWARD means old-schema consumers can read new-schema data, so producers upgrade first.",
        "FORWARD does imply a safe upgrade order (producers first).",
        "FORWARD is one-directional, not both-directional."
      ]
    },
    "kk-074": {
      optionEdits: {
        0: "The 'latest' schema in the registry is always incorrect",
        1: "Records must be decoded with the WRITER'S schema; a topic legitimately holds records of different versions",
        2: "Schema IDs are simply faster to type than names",
        3: "The registry has no concept of a latest schema"
      },
      optionNotes: [
        "'latest' isn't wrong, it's just not necessarily the writer's version.",
        "Correct — decoding needs the exact writer schema; mixed versions coexist, so the embedded ID is authoritative.",
        "It's about correctness, not convenience.",
        "The registry does have 'latest'; it's just not the right choice for decoding old records."
      ]
    },
    "kk-075": {
      optionEdits: {
        0: "The consumer is 1000 records behind on that partition",
        1: "The consumer has a lag of 4200 records on that partition",
        2: "The topic contains exactly 1000 records total",
        3: "The consumer has read ahead of the end of the log"
      },
      optionNotes: [
        "1000 is the current offset, not the lag.",
        "Correct — lag = log-end (5200) − current (1000) = 4200 records.",
        "Offsets are positions, not a record count of the topic.",
        "A consumer cannot be ahead of the log-end offset."
      ]
    }
  }
};
