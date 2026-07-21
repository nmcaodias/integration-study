/* CCDAK · 12 new hard Kafka scenarios (ids kk-119..kk-130), several exhibit-
 * based, spread across sections and chosen NOT to duplicate existing topics
 * (checked against the bank). Weighted to k2 (28%). Options authored so the
 * correct answer is not the longest; a balance pass follows. */
module.exports = {
  addQuestions: [
    {
      id: "kk-119", section: "k1", level: "hard",
      q: "A topic has replication.factor=3 and unclean.leader.election.enable=true. The leader for a partition fails while its two followers are behind (out of ISR). What happens, and what is the trade-off?",
      options: [
        "An out-of-sync replica can be elected leader to restore availability, but records the old leader had that this replica lacked are lost — availability is chosen over durability",
        "Production halts for that partition until the original leader returns, guaranteeing no data loss because only in-sync replicas can ever become leader",
        "The partition is permanently unavailable and must be manually recreated, since a partition cannot survive the loss of its leader under any configuration",
        "All three replicas are declared leaders simultaneously and reconcile later, so both full availability and zero data loss are preserved"
      ],
      answer: 0,
      optionNotes: [
        "Correct — unclean.leader.election.enable=true lets an out-of-sync replica become leader, restoring availability at the cost of losing records it never replicated.",
        "That describes unclean.leader.election.enable=FALSE (the safe default), which keeps the partition unavailable rather than losing data.",
        "The partition isn't destroyed; a replica takes over — the question is whether an out-of-sync one is allowed to.",
        "There is always exactly one leader per partition; multiple simultaneous leaders don't exist."
      ],
      explanation: "unclean.leader.election trades durability for availability. With it enabled, an out-of-sync replica may be elected leader when no ISR is available, so the partition stays writable but any records only the failed leader held are lost. The safe default (false) keeps the partition offline until an in-sync replica is available."
    },
    {
      id: "kk-120", section: "k1", level: "hard",
      q: "Refer to the exhibit. To raise throughput, a team increases a keyed topic's partitions from 4 to 8 while producers keep using customer id as the key. What breaks, and what stays intact?",
      exhibit: "topic 'events'  key=customerId  partitions 4 → 8 (altered)\nproducers unchanged; consumers rely on per-customer ordering",
      options: [
        "Existing keys now hash to different partitions, so a customer's new records may land on a different partition than their old ones — per-customer ordering is only guaranteed for records written after the change",
        "Nothing changes for ordering because Kafka automatically migrates each key's historical records to keep every key on its original partition",
        "All ordering is permanently lost for every key, so the only fix is to delete the topic and recreate it with 8 partitions from the start",
        "Throughput cannot increase at all, because a consumer group is still limited to the original 4 partitions regardless of the new count"
      ],
      answer: 0,
      optionNotes: [
        "Correct — partition = hash(key) % partitionCount, so changing the count remaps keys; ordering holds within a partition, so only post-change records for a key are guaranteed ordered relative to each other.",
        "Kafka does NOT migrate existing records; old data stays where it was written.",
        "Ordering isn't globally destroyed — per-partition order is intact; the issue is a key can now span two partitions across the change.",
        "Adding partitions does raise the parallelism ceiling; a group can now use up to 8 consumers."
      ],
      explanation: "A key maps to a partition via hash(key) % partitionCount. Increasing the count changes that mapping, so a key's future records can land on a new partition while its history stays put. Kafka never repartitions existing data, so per-key ordering is only assured for records produced after the change — a classic reason to over-provision partitions up front for keyed topics."
    },
    {
      id: "kk-121", section: "k2", level: "hard",
      q: "Refer to the exhibit. A team believes these settings guarantee no data loss, yet after a broker failure some acknowledged records vanish. Why?",
      exhibit: "producer: acks=all , enable.idempotence=true\ntopic:    replication.factor=3\nbroker:   min.insync.replicas=1",
      options: [
        "With min.insync.replicas=1, acks=all is satisfied by just the leader, so a record can be acknowledged while on only one broker and lost if that broker fails before a follower replicates it",
        "acks=all is being overridden by enable.idempotence, which silently downgrades the effective acks to 1 and causes the loss",
        "replication.factor=3 is too low for durability; only replication.factor=5 with acks=all can prevent acknowledged records from being lost",
        "The loss is impossible with these settings, so the records were never actually acknowledged and the application misreported success"
      ],
      answer: 0,
      optionNotes: [
        "Correct — acks=all waits for all IN-SYNC replicas, but min.insync.replicas=1 lets the ISR shrink to just the leader, so an ack can mean 'on one broker only'. Set min.insync.replicas=2 on RF=3.",
        "Idempotence requires acks=all; it doesn't downgrade it.",
        "RF=3 is standard and sufficient; the weak link is min.insync.replicas, not the replication factor.",
        "The loss is entirely possible precisely because of min.insync.replicas=1."
      ],
      explanation: "acks=all means 'all in-sync replicas', and min.insync.replicas sets how small the ISR may shrink while still accepting writes. At min.insync.replicas=1 the ISR can be just the leader, so an acknowledged record may exist on only one broker and be lost if it fails. Durable config on RF=3 is acks=all AND min.insync.replicas=2."
    },
    {
      id: "kk-122", section: "k2", level: "hard",
      q: "Refer to the exhibit. Records for the same key occasionally appear out of order downstream. What causes this, and the correct fix?",
      exhibit: "producer: enable.idempotence=false\n          retries=5\n          max.in.flight.requests.per.connection=5\n          acks=all",
      options: [
        "With retries and max.in.flight>1 but idempotence off, a retried batch can be written after a later batch that already succeeded, reordering records; enable.idempotence=true (or set max.in.flight=1) fixes it",
        "acks=all is what reorders records under load; lowering it to acks=1 restores ordering while keeping durability",
        "Reordering is unavoidable in Kafka for any keyed topic, so consumers must always sort records by an embedded timestamp themselves",
        "The retries setting is too low; raising retries to a much larger value guarantees ordering regardless of in-flight requests"
      ],
      answer: 0,
      optionNotes: [
        "Correct — without idempotence, a failed batch retried while up to 5 requests are in flight can land after a later batch, reordering the key; idempotence preserves order for max.in.flight ≤ 5 (or set max.in.flight=1).",
        "acks doesn't control ordering; lowering it weakens durability and doesn't fix reordering.",
        "Kafka DOES preserve per-partition order; reordering here is a producer-config artifact, not inherent.",
        "More retries increases the reordering window, not fixes it."
      ],
      explanation: "Multiple in-flight requests plus retries without idempotence allows a retried batch to be appended after a later successful one, reordering a key's records. Enabling idempotence makes the broker order batches by sequence number (safe up to max.in.flight=5); alternatively max.in.flight=1 serializes them at a throughput cost."
    },
    {
      id: "kk-123", section: "k2", level: "hard",
      q: "A producer writes with transactions (exactly-once), but a downstream consumer still sees records that belong to aborted transactions. What is misconfigured?",
      options: [
        "The consumer is using the default isolation.level=read_uncommitted; it must be set to read_committed to skip records from aborted or in-flight transactions",
        "The producer forgot to call initTransactions(), so its commits silently behave like plain sends that the consumer then reads",
        "The topic must have log compaction enabled for transactional markers to be honored by consumers",
        "Transactions only work within a single partition, so any multi-partition write always leaks aborted records to consumers"
      ],
      answer: 0,
      optionNotes: [
        "Correct — read_uncommitted (the consumer default) returns aborted/uncommitted records too; read_committed makes the consumer honor transaction markers and skip them.",
        "Missing initTransactions would fail the transactional producer outright, not leak aborted records to a reader.",
        "Compaction is unrelated to transactional visibility.",
        "Transactions span multiple partitions/topics atomically; that's the whole point."
      ],
      explanation: "Exactly-once has two sides: the transactional producer AND consumers reading with isolation.level=read_committed. The default read_uncommitted returns records regardless of commit/abort, so a reader sees aborted output. Setting read_committed makes the consumer respect transaction markers and only deliver committed records."
    },
    {
      id: "kk-124", section: "k2", level: "hard",
      q: "Refer to the exhibit. Subject 'orders-value' is set to FULL compatibility. Which proposed change is allowed?",
      exhibit: "current: { id:string, amount:double, note:string (has default \"\") }\nFULL = must be both backward- AND forward-compatible",
      options: [
        "Removing the 'note' field, because it has a default — under FULL, adding or removing a field is only safe when that field has a default value",
        "Adding a required field 'currency' with no default, since FULL compatibility specifically permits new required fields",
        "Renaming 'amount' to 'total', because renames are treated as compatible under FULL as long as the type is unchanged",
        "Changing 'amount' from double to string, since FULL compatibility allows widening a numeric field to text"
      ],
      answer: 0,
      optionNotes: [
        "Correct — under FULL (backward AND forward), you may add or remove a field only if it has a default, so removing the defaulted 'note' is allowed.",
        "A new required field with no default breaks backward compatibility, so FULL rejects it.",
        "A rename is a remove + add of a non-defaulted field — breaking under FULL.",
        "Changing a field's type is not a compatible change."
      ],
      explanation: "FULL compatibility requires a change to be both backward- and forward-compatible, which limits you to adding or removing fields that carry a default. Removing the defaulted 'note' qualifies; adding a required field, renaming, or changing a type all violate one direction or the other."
    },
    {
      id: "kk-125", section: "k3", level: "hard",
      q: "Refer to the exhibit. A KStream-KStream join between 'clicks' and 'impressions' produces no output even though matching keys exist within the window. What is the most likely cause?",
      exhibit: "clicks:       12 partitions\nimpressions:  6 partitions\njoin: clicks.join(impressions, ..., JoinWindows.ofTimeDifference(5m))",
      options: [
        "The two streams aren't co-partitioned — a KStream-KStream join requires both topics to have the same number of partitions (and same partitioning) so matching keys share a task",
        "JoinWindows of 5 minutes is too short for a stream-stream join, which requires a minimum window of at least 1 hour to emit results",
        "Stream-stream joins are not supported in Kafka Streams at all; only KStream-KTable joins can produce output",
        "The join fails because clicks has more partitions than impressions, and the stream with fewer partitions must always be the left side"
      ],
      answer: 0,
      optionNotes: [
        "Correct — join inputs must be co-partitioned (same partition count and key partitioning); with 12 vs 6, matching keys land on different tasks and never meet. Repartition one side to match.",
        "There is no 1-hour minimum; a 5-minute window is fine when inputs are co-partitioned.",
        "KStream-KStream joins are fully supported (windowed).",
        "Left/right side by partition count isn't a rule; the requirement is equal partitioning on both sides."
      ],
      explanation: "Kafka Streams joins require co-partitioned inputs: same number of partitions and the same keying, so records with the same key are handled by the same task. With 12 vs 6 partitions, keys map to different tasks and never join. Repartition one topic (e.g. via through/repartition) to match, and both streams must share a key type."
    },
    {
      id: "kk-126", section: "k3", level: "hard",
      q: "Refer to the exhibit. A 1-hour tumbling window uses a 10-minute grace and suppress(untilWindowCloses). A record arrives with an event time 25 minutes after its window ended. How is it handled?",
      exhibit: "windowedBy(TimeWindows.ofSizeAndGrace(1h, 10m))\n  .count().suppress(untilWindowCloses(unbounded()))",
      options: [
        "It is dropped as a late record — it arrived after the window plus its 10-minute grace period closed, and the suppressed final result was already emitted",
        "It reopens the closed window, recomputes the count, and emits a corrected result downstream in place of the earlier one",
        "It is redirected into the next 1-hour window and counted there instead, so no data is ever discarded",
        "It is buffered indefinitely until a matching window is created, because suppress with unbounded buffer never drops records"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a record later than window-end + grace is dropped; suppress had already emitted the window's final value once it closed.",
        "Closed windows aren't reopened; that's exactly what the grace period + suppression prevent.",
        "Late records aren't moved to a later window — windowing is by event time, not arrival.",
        "The unbounded buffer bounds memory, not lateness; records past the grace are still dropped."
      ],
      explanation: "The grace period defines how long after a window's end late records are still accepted. Beyond window-end + grace, records are dropped, and suppress(untilWindowCloses) emits exactly one final result when that boundary passes. A record 25 minutes late for a window with 10 minutes of grace is simply discarded."
    },
    {
      id: "kk-127", section: "k4", level: "hard",
      q: "Refer to the exhibit. A JDBC source connector is set tasks.max=8 to go faster, but Connect only ever runs a few tasks. Why, and what actually raises source throughput here?",
      exhibit: "connector: JdbcSourceConnector\ntasks.max: 8\nmode: incrementing, table.whitelist: orders   (one table)",
      options: [
        "tasks.max is an upper bound, not a guarantee — a JDBC source parallelizes by table, so a single whitelisted table yields one task; add more tables (or split the source) to use more tasks",
        "Connect always runs exactly one task per connector regardless of tasks.max, so parallelism must come from deploying multiple identical connectors instead",
        "The workers are out of threads; raising tasks.max works only after increasing the JVM thread pool on every Connect worker",
        "tasks.max above the number of Connect workers is ignored, so throughput rises only by adding more worker nodes to the cluster"
      ],
      answer: 0,
      optionNotes: [
        "Correct — tasks.max caps task count, but the connector decides how many tasks it can split into; a JDBC source keys parallelism to tables, so one table = one task. More tables enable more tasks.",
        "Connectors can run many tasks (e.g. one per table); it isn't fixed at one.",
        "It isn't a worker thread-pool limit; it's the connector's own task division by table.",
        "Adding workers spreads existing tasks but won't create more tasks than the connector defines."
      ],
      explanation: "tasks.max is a ceiling; the connector itself decides how many tasks it can meaningfully create. A JDBC source parallelizes per table, so one whitelisted table produces one task no matter how high tasks.max is. To use more tasks, give it more tables or run multiple source connectors; a sink, by contrast, parallelizes up to the topic's partition count."
    },
    {
      id: "kk-128", section: "k4", level: "hard",
      q: "Refer to the exhibit. A sink connector reads a topic whose records were produced with the Avro serializer, but the sink writes garbled data / throws errors. What is misconfigured?",
      exhibit: "producer wrote records with KafkaAvroSerializer (Schema Registry)\nsink connector: value.converter=org.apache.kafka.connect.storage.StringConverter",
      options: [
        "The sink's value.converter must match how the data was written — use AvroConverter with the Schema Registry URL, not StringConverter, so the bytes are deserialized correctly",
        "The producer should not have used Avro; the fix is to re-produce all data with the StringSerializer so the sink's StringConverter matches",
        "Converters are only about the key; the value is always passed through untouched, so the value.converter setting cannot be the cause",
        "The sink needs errors.tolerance=all, which will transparently convert the Avro bytes into strings as they are read"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the converter must match the on-the-wire format. Avro-encoded values (schema-id header + Avro bytes) require the AvroConverter + Schema Registry; StringConverter misinterprets the bytes.",
        "Re-producing everything as strings throws away the schema benefits and isn't the fix — configure the sink's converter to match.",
        "Converters apply to both key and value; value.converter absolutely governs value deserialization.",
        "errors.tolerance skips bad records; it doesn't transcode Avro into strings."
      ],
      explanation: "A converter defines the serialization format at the Connect boundary and must match how records were written. Avro records carry a schema-id header plus Avro-encoded bytes, so the sink needs the AvroConverter pointed at the same Schema Registry. StringConverter treats the bytes as text and corrupts them — a converter mismatch, not a data problem."
    },
    {
      id: "kk-129", section: "k6", level: "hard",
      q: "Refer to the exhibit. Per-hop metrics look healthy, but a low-traffic consumer sees seconds of extra latency. Which settings explain it?",
      exhibit: "consumer: fetch.min.bytes=1048576   (1 MB)\n          fetch.max.wait.ms=5000\ntopic traffic: a few small records per second",
      options: [
        "The broker waits up to fetch.max.wait.ms for fetch.min.bytes to accumulate; at low traffic 1 MB rarely fills quickly, so each fetch stalls near 5 s — lower fetch.min.bytes or fetch.max.wait.ms",
        "fetch.min.bytes only affects throughput, never latency, so these settings cannot cause the delay; the latency must originate in the network layer",
        "The consumer is committing offsets too often, and the fix is to raise auto.commit.interval.ms so fetches stop blocking",
        "max.poll.records is too low, forcing many tiny polls; raising it removes the multi-second latency regardless of the fetch settings"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a fetch returns when fetch.min.bytes is available OR fetch.max.wait.ms elapses; with little traffic the 1 MB threshold isn't met, so fetches wait the full 5 s. Reduce either value for low-latency reads.",
        "fetch.min.bytes directly trades latency for efficiency; it's the cause here, not the network.",
        "Commit frequency doesn't gate fetch latency in this way.",
        "max.poll.records caps records per poll; it doesn't create the 5 s fetch wait."
      ],
      explanation: "A consumer fetch returns as soon as fetch.min.bytes of data is available or fetch.max.wait.ms passes, whichever comes first. With high fetch.min.bytes (1 MB) and low traffic, the threshold is rarely met, so nearly every fetch blocks for the full 5-second wait. For latency-sensitive, low-volume topics, lower fetch.min.bytes (e.g. 1) or fetch.max.wait.ms."
    },
    {
      id: "kk-130", section: "k6", level: "hard",
      q: "Refer to the exhibit. Monitoring shows UnderReplicatedPartitions jump above zero after one broker restarts. What does this indicate and what is the risk?",
      exhibit: "kafka.server:type=ReplicaManager,name=UnderReplicatedPartitions = 37\ncluster: 3 brokers, several RF=3 / min.insync.replicas=2 topics",
      options: [
        "37 partitions have fewer in-sync replicas than their replication factor; while ISR is shrunk, durability is reduced and any partition that drops below min.insync.replicas will reject produces with acks=all",
        "It means 37 partitions have permanently lost data and must be restored from a backup before producing can resume",
        "Under-replicated partitions are purely informational and never affect producers, since acks=all only checks the leader replica",
        "It indicates 37 consumers have fallen behind; the metric is a per-consumer lag counter unrelated to replication"
      ],
      answer: 0,
      optionNotes: [
        "Correct — under-replicated means ISR < replication.factor; durability is temporarily lower and, if a partition's ISR falls below min.insync.replicas, acks=all produces fail until replicas catch up.",
        "It signals replicas catching up, not permanent data loss; it typically clears as the broker re-syncs.",
        "acks=all waits for all IN-SYNC replicas, so a shrunk ISR does affect producers — this is not merely informational.",
        "Under-replicated partitions are a replication metric, not consumer lag."
      ],
      explanation: "UnderReplicatedPartitions > 0 means some partitions have fewer in-sync replicas than their replication factor — normal briefly after a broker restart as replicas re-sync, but a durability warning while it persists. If a partition's ISR drops below min.insync.replicas, acks=all produces are rejected (NotEnoughReplicas), so a sustained non-zero value needs investigation."
    }
  ]
};
