/* CCDAK de-bias · section k1 (Kafka fundamentals). Distractors rewritten to be
 * plausible and parallel-length; over-long correct options trimmed (detail moves
 * to optionNotes); per-option notes added. Answers unchanged. */
module.exports = {
  questions: {
    "kk-001": {
      optionEdits: {
        0: "Total order is maintained across the whole topic regardless of partition",
        2: "Ordering is guaranteed per broker across all of its partitions",
        3: "No ordering is guaranteed once a topic has multiple partitions"
      },
      optionNotes: [
        "Kafka provides no global cross-partition ordering.",
        "Correct — records are strictly ordered by offset within each partition, not across the topic.",
        "Ordering is per partition, not per broker; a broker hosts many partitions.",
        "There is a guarantee — within a single partition records are strictly ordered."
      ]
    },
    "kk-002": {
      optionEdits: {
        0: "Set acks=all so every write is fully replicated before ack",
        1: "Use the customer ID as the record key so a customer's events hash to one partition",
        2: "Use a single-partition topic so all customer events share one log",
        3: "Enable compression to keep related events batched together"
      },
      optionNotes: [
        "acks governs durability, not ordering or which partition a record lands in.",
        "Correct — keying by customer ID routes all of that customer's events to the same partition, preserving order.",
        "A single partition preserves order but destroys parallelism; keying is the scalable answer.",
        "Compression affects size, not partition routing."
      ]
    },
    "kk-003": {
      optionEdits: {
        1: "All 8 consumers share the partitions round-robin per record",
        2: "The consumer group fails to start with too many members",
        3: "Kafka automatically adds 2 partitions to balance the group"
      },
      optionNotes: [
        "Correct — a partition goes to at most one consumer per group, so with 6 partitions two of the 8 consumers stay idle.",
        "Partitions are not split per record across consumers; each partition has one owner in the group.",
        "Extra consumers are allowed; they simply get no assignment.",
        "Kafka never auto-adds partitions to match consumer count."
      ]
    },
    "kk-004": {
      optionEdits: {
        0: "Writes still succeed even if all three replicas are unavailable",
        1: "Every acknowledged write is on at least 2 replicas, surviving one broker failure",
        2: "Exactly-once delivery of each record to consumers",
        3: "Consumers may read from follower replicas for lower latency"
      },
      optionNotes: [
        "With acks=all and min.insync=2, writes fail if fewer than 2 replicas are in sync.",
        "Correct — acks=all + min.insync.replicas=2 means acked data lives on 2+ replicas and tolerates one broker loss.",
        "This is a durability guarantee, not exactly-once consumer delivery.",
        "By default consumers read only from the leader, not followers."
      ]
    },
    "kk-005": {
      optionEdits: {
        0: "Writes continue normally against the single remaining in-sync replica",
        1: "Writes fail with NotEnoughReplicas errors until the ISR recovers",
        2: "Data is silently redirected to a different topic partition",
        3: "Consumers also immediately stop being able to read the partition"
      },
      optionNotes: [
        "min.insync.replicas=2 forbids acking against just one replica.",
        "Correct — with only one in-sync replica, acks=all writes are rejected (NotEnoughReplicas) until the ISR recovers.",
        "Kafka never silently reroutes data to another topic.",
        "Reads can continue from the leader; it is writes that are blocked."
      ]
    },
    "kk-006": {
      optionEdits: {
        0: "Records older than retention.ms are deleted regardless of their key",
        1: "Kafka retains at least the latest value per key; a null value (tombstone) deletes a key",
        2: "The log segments are transparently compressed with zstd",
        3: "Only records that consumers have already read are removed"
      },
      optionNotes: [
        "That describes delete retention, not compaction.",
        "Correct — compaction keeps the most recent value per key; a null-value tombstone marks a key for removal.",
        "Compaction is about keys, not byte-level compression.",
        "Compaction is independent of what consumers have read."
      ]
    },
    "kk-007": {
      optionEdits: {
        0: "The two applications split the topic's records between them",
        1: "Each group receives ALL records; within a group, partitions divide among its consumers",
        2: "Only the first group to subscribe receives the topic's data",
        3: "Both groups must be configured with identical consumer counts"
      },
      optionNotes: [
        "Different group.ids do not share records; each group gets the full stream.",
        "Correct — every consumer group independently receives all records; partitions are split only within a group.",
        "All subscribed groups receive data, not just the first.",
        "Groups are independent; their consumer counts need not match."
      ]
    },
    "kk-008": {
      optionEdits: {
        0: "security.protocol=PLAINTEXT combined with a topic ACL",
        1: "security.protocol=SASL_SSL, sasl.mechanism=SCRAM-SHA-512, JAAS credentials, and a broker truststore",
        2: "compression.type=ssl to encrypt the payloads",
        3: "enable.idempotence=true to secure the producer writes"
      },
      optionNotes: [
        "PLAINTEXT gives no TLS; ACLs are authorization, not the transport/auth mechanism.",
        "Correct — SASL_SSL + SCRAM mechanism + JAAS credentials + a truststore is the standard secured-client config.",
        "There is no 'ssl' compression codec; compression is not security.",
        "Idempotence prevents duplicate writes; it does nothing for authentication or encryption."
      ]
    },
    "kk-009": {
      optionEdits: {
        0: "The topic has far too many partitions for the consumer",
        1: "The client's principal lacks the required ACLs (Read on the topic and on the group)",
        2: "The consumer is configured with the wrong compression codec",
        3: "The consumer left auto.offset.reset unset"
      },
      optionNotes: [
        "Partition count doesn't cause an authorization exception.",
        "Correct — TopicAuthorizationException means the principal is missing Read ACLs on the topic (and its group).",
        "A wrong codec causes deserialization issues, not an authorization error.",
        "auto.offset.reset affects starting position, not authorization."
      ]
    },
    "kk-010": {
      optionEdits: {
        0: "An external etcd cluster manages the metadata",
        1: "KRaft — an internal Raft-based controller quorum managing cluster metadata",
        2: "A relational database stores the cluster metadata",
        3: "The Schema Registry took over metadata duties"
      },
      optionNotes: [
        "Kafka does not use etcd for metadata.",
        "Correct — KRaft replaces ZooKeeper with an internal Raft controller quorum for metadata.",
        "Metadata is not stored in an external RDBMS.",
        "Schema Registry manages schemas, not cluster metadata."
      ]
    },
    "kk-011": {
      optionEdits: {
        0: "Nothing changes — Kafka rebalances the existing data automatically",
        1: "New records for a key may hash to a different partition, breaking per-key ordering at the boundary",
        2: "All previously stored data in the topic is deleted",
        3: "Producers must be restarted before any records will flow"
      },
      optionNotes: [
        "Kafka does not move existing records when partitions are added.",
        "Correct — adding partitions changes the hash mapping, so a key's new records may land elsewhere, breaking ordering.",
        "Existing data is retained, not deleted.",
        "Producers pick up the new partitions via metadata refresh, no restart required."
      ]
    },
    "kk-012": {
      optionEdits: {
        0: "They determine which partition a record is written to",
        1: "They carry metadata (correlation IDs, trace context, schema hints) alongside key and value",
        2: "They store the record's offset within the partition",
        3: "They hold the compressed form of the payload"
      },
      optionNotes: [
        "Partitioning is driven by the key/partitioner, not headers.",
        "Correct — headers carry side-band metadata (tracing, routing hints) without affecting key, value, or partitioning.",
        "Offsets are assigned by the broker, not stored in headers.",
        "Compression applies to the batch, not to a header field."
      ]
    },
    "kk-064": {
      optionEdits: {
        0: "Any replica of the partition, chosen at random",
        1: "The partition LEADER handles all produces and, by default, consumes; followers only replicate",
        2: "Producers use the leader while consumers read from followers",
        3: "The controller broker handles all client traffic"
      },
      optionNotes: [
        "Clients don't pick replicas at random; they target the leader.",
        "Correct — the partition leader serves reads and writes by default; followers just replicate.",
        "By default both produce and consume go to the leader (follower fetching is an opt-in feature).",
        "The controller manages metadata, not client data traffic."
      ]
    },
    "kk-065": {
      optionEdits: {
        0: "Only 3 of the 8 partitions end up being consumed",
        1: "The 8 partitions are distributed across the 3 consumers (e.g. 3/3/2); all are consumed",
        2: "Each of the 3 consumers is assigned all 8 partitions",
        3: "The group fails because consumer count must divide partition count"
      },
      optionNotes: [
        "All partitions are assigned; none are skipped.",
        "Correct — the 8 partitions spread across the 3 consumers (uneven is fine); every partition is consumed.",
        "Each partition has a single owner in the group, not all consumers.",
        "There is no requirement that consumers evenly divide partitions."
      ]
    },
    "kk-066": {
      optionEdits: {
        0: "All four records are retained after compaction",
        1: "(k1,v3) only — k2's tombstone eventually removes k2 entirely",
        2: "(k1,v1) and (k2,v2) — the first value per key wins",
        3: "(k1,v3) and (k2,null) are retained forever"
      },
      optionNotes: [
        "Compaction keeps the latest value per key, not every record.",
        "Correct — k1 keeps v3 (latest); the k2 tombstone removes k2 after the delete-retention window.",
        "Compaction keeps the latest value, not the first.",
        "Tombstones are eventually purged; they are not retained forever."
      ]
    }
  }
};
