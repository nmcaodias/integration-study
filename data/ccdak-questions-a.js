// CCDAK question bank — Part A (sections k1–k3)
window.CERT_DATA.ccdak.questions.push(
  // ---- Section k1: Kafka Fundamentals ----
  {
    id: "kk-001", section: "k1",
    q: "A topic has 6 partitions. Which ordering guarantee does Kafka provide for its records?",
    options: ["Total order across the whole topic", "Order is guaranteed only within each partition", "Order is guaranteed per broker", "No ordering guarantees at all"],
    answer: 1,
    explanation: "Each partition is an ordered append-only log, but there is no coordination of order ACROSS partitions. Records that must be ordered relative to each other must share a partition — which is why they are given the same key."
  },
  {
    id: "kk-002", section: "k1",
    q: "All events for a given customer must be processed in order. How is this achieved when producing?",
    options: ["Set acks=all", "Use the customer ID as the message key so all of a customer's events hash to the same partition", "Use a single-partition topic for all customers", "Enable compression"],
    answer: 1,
    explanation: "Keyed records are partitioned by murmur2(key) % numPartitions, so one customer's events always land on the same partition and stay ordered. A single partition would also work but destroys parallelism for all customers."
  },
  {
    id: "kk-003", section: "k1",
    q: "A consumer group with 8 consumers reads a topic with 6 partitions. What happens?",
    options: ["Two consumers remain idle with no partitions assigned", "All 8 consumers share partitions in round-robin per record", "The group fails to start", "Kafka automatically adds 2 partitions"],
    answer: 0,
    explanation: "Within a group each partition goes to exactly one consumer, so at most 6 consumers can be active on 6 partitions — the extra 2 get nothing. Partition count is the group's maximum parallelism."
  },
  {
    id: "kk-004", section: "k1",
    q: "A topic is configured with replication.factor=3 and min.insync.replicas=2, and producers use acks=all. What does this setup guarantee?",
    options: ["Writes succeed even if all three replicas are down", "Every acknowledged write exists on at least 2 replicas, and the topic tolerates one broker failure without losing acknowledged data", "Exactly-once delivery to consumers", "Consumers read from follower replicas"],
    answer: 1,
    explanation: "acks=all waits for all in-sync replicas, and min.insync.replicas=2 refuses writes if fewer than 2 are in sync. One broker can fail (ISR=2 still meets the minimum); acknowledged data always exists on ≥2 replicas. This is the canonical durability configuration."
  },
  {
    id: "kk-005", section: "k1",
    q: "With min.insync.replicas=2 on an RF=3 topic, two brokers holding replicas of a partition go down. What do producers using acks=all experience?",
    options: ["Writes continue normally against the single remaining replica", "Writes fail with NotEnoughReplicas errors until the ISR recovers", "Data is silently redirected to another topic", "Consumers also stop being able to read"],
    answer: 1,
    explanation: "The ISR (1) is below min.insync.replicas (2), so acks=all produces are rejected — availability is sacrificed to protect durability. Reads of already-committed data can continue from the remaining leader."
  },
  {
    id: "kk-006", section: "k1",
    q: "Which statement describes log compaction (cleanup.policy=compact)?",
    options: ["Records older than retention.ms are deleted regardless of key", "Kafka eventually retains at least the most recent value for each key; a null-value record (tombstone) marks a key for deletion", "The log is compressed with zstd", "Only consumed records are removed"],
    answer: 1,
    explanation: "Compaction is per-key retention of the latest value — turning a topic into a durable changelog (great for table-like state). Tombstones delete keys. Time/size deletion is the 'delete' policy; consumption never removes data."
  },
  {
    id: "kk-007", section: "k1",
    q: "Two different applications, each with its own group.id, consume the same topic. How is data delivered?",
    options: ["The applications split the records between them", "Each application (group) receives ALL records; within each group, partitions are divided among its consumers", "Only the first group to subscribe receives data", "Both groups must have identical consumer counts"],
    answer: 1,
    explanation: "Consumer groups are independent — Kafka is pub-sub across groups and queue-like within a group. Each group maintains its own offsets in __consumer_offsets."
  },
  {
    id: "kk-008", section: "k1",
    q: "Which combination of client settings secures a connection to a SASL/SCRAM-secured cluster over TLS?",
    options: ["security.protocol=PLAINTEXT with an ACL", "security.protocol=SASL_SSL, sasl.mechanism=SCRAM-SHA-512, sasl.jaas.config with the credentials, plus a truststore for the broker certificates", "compression.type=ssl", "enable.idempotence=true"],
    answer: 1,
    explanation: "SASL_SSL = SASL authentication over a TLS-encrypted channel; the mechanism and JAAS config carry the SCRAM credentials, and the truststore validates the brokers. ACLs then authorize the authenticated principal."
  },
  {
    id: "kk-009", section: "k1",
    q: "A consumer application is denied with a TopicAuthorizationException although the topic exists. What is the most likely cause?",
    options: ["The topic has too many partitions", "The client's principal lacks the required ACLs (e.g., Read on the topic and Read on the consumer group)", "The consumer uses the wrong compression codec", "auto.offset.reset is unset"],
    answer: 1,
    explanation: "Authorization errors are ACL problems: a consuming principal needs Read on the topic AND Read on its group. Authentication succeeded (otherwise the error would be an authentication failure)."
  },
  {
    id: "kk-010", section: "k1",
    q: "What replaaced ZooKeeper's role in modern Kafka clusters (Kafka 4.x)?",
    options: ["An external etcd cluster", "KRaft — an internal Raft-based controller quorum managing cluster metadata", "A relational database", "Schema Registry"],
    answer: 1,
    explanation: "KRaft mode has Kafka manage its own metadata via a Raft consensus quorum of controllers — no external ZooKeeper. Client APIs are unaffected; it's a cluster architecture change."
  },
  {
    id: "kk-011", section: "k1",
    q: "Partitions are added to an existing topic whose producers use keyed messages. What is the consequence?",
    options: ["Nothing — Kafka rebalances old data automatically", "New records for a key may map to a DIFFERENT partition than that key's older records, breaking per-key ordering across the boundary", "All old data is deleted", "Producers must restart before any records flow"],
    answer: 1,
    explanation: "Partitioning is hash(key) % numPartitions — changing numPartitions changes the mapping. Existing data stays where it was, so a key's history spans partitions and ordered consumption per key is broken across the change. Plan partition counts up front for keyed topics."
  },
  {
    id: "kk-012", section: "k1",
    q: "What are Kafka message headers for?",
    options: ["Determining which partition a record goes to", "Carrying metadata (correlation IDs, trace context, schema hints) alongside the key and value without affecting partitioning", "Storing the record's offset", "Compressing the payload"],
    answer: 1,
    explanation: "Headers are key/value metadata attached to records — used for tracing, routing hints, and provenance. Partitioning uses the message key, not headers."
  },

  // ---- Section k2: Application Development ----
  {
    id: "kk-013", section: "k2",
    q: "What does enable.idempotence=true on a producer actually prevent?",
    options: ["Duplicates caused by the application calling send() twice", "Duplicates caused by the producer's own retries after transient failures, while preserving per-partition ordering", "Duplicates on the consumer side after rebalances", "All duplicates end-to-end"],
    answer: 1,
    explanation: "Idempotence gives each producer session sequence numbers so broker-side retry duplicates are discarded. It does NOT dedupe application-level re-sends nor consumer-side reprocessing — those need transactions or idempotent consumers."
  },
  {
    id: "kk-014", section: "k2",
    q: "A consume-transform-produce application must achieve exactly-once semantics from input topic to output topic. What is required?",
    options: ["enable.idempotence=true alone", "Kafka transactions: a transactional.id producer sending output AND committing consumed offsets in the same transaction, with downstream consumers using isolation.level=read_committed", "acks=all with retries=0", "Manual commitSync after each record"],
    answer: 1,
    explanation: "EOS for read-process-write means the output records and the input offset commit are atomic — that's sendOffsetsToTransaction inside a transaction. read_committed consumers then ignore aborted attempts. Idempotence alone only covers producer retry duplicates."
  },
  {
    id: "kk-015", section: "k2",
    q: "A consumer with enable.auto.commit=true crashes AFTER auto-commit ran but BEFORE it finished processing the last polled batch. What happens to those records?",
    options: ["They are redelivered after restart", "They are lost to this group — the committed offset already moved past them", "They are moved to a dead letter queue", "The broker reprocesses them"],
    answer: 1,
    explanation: "Auto-commit can commit offsets for records not yet processed, creating an at-most-once window. To get at-least-once, commit manually AFTER processing (commitSync/commitAsync)."
  },
  {
    id: "kk-016", section: "k2",
    q: "A consumer processing takes up to 10 minutes per batch, and the group keeps rebalancing with 'consumer left the group' messages. Which setting is being violated?",
    options: ["session.timeout.ms — heartbeats are missing", "max.poll.interval.ms — too much time passes between poll() calls; raise it or reduce max.poll.records", "auto.offset.reset", "linger.ms"],
    answer: 1,
    explanation: "Heartbeats run on a background thread, so session.timeout isn't the issue — the poll-interval timer is. If poll() isn't called within max.poll.interval.ms (default 5 min), the consumer is evicted. Raise the limit, shrink batches, or speed up processing."
  },
  {
    id: "kk-017", section: "k2",
    q: "When does auto.offset.reset=earliest take effect?",
    options: ["On every consumer restart", "Only when the group has no valid committed offset for a partition (new group, expired offsets, or out-of-range)", "Whenever lag exceeds a threshold", "Every time a rebalance happens"],
    answer: 1,
    explanation: "auto.offset.reset is the FALLBACK position. With valid committed offsets, consumption always resumes from them — earliest/latest only applies when no usable offset exists."
  },
  {
    id: "kk-018", section: "k2",
    q: "Which producer configuration change increases throughput at the cost of a little latency?",
    options: ["acks=0", "Increase linger.ms (e.g., 5–100 ms) and batch.size so larger, better-compressed batches are sent", "Decrease buffer.memory", "max.in.flight=1"],
    answer: 1,
    explanation: "linger.ms deliberately waits to fill batches; bigger batches amortize request overhead and compress better — the standard throughput knob. acks=0 trades DURABILITY (not just latency) and isn't a batching improvement."
  },
  {
    id: "kk-019", section: "k2",
    q: "In Schema Registry, subject 'orders-value' uses BACKWARD compatibility. What does registering a new schema version require, and which side upgrades first?",
    options: ["New schema must be readable by the OLD schema; producers upgrade first", "Consumers using the NEW schema must be able to read data written with the PREVIOUS schema (e.g., deleted fields / added optional fields); consumers upgrade first", "Schemas can never change", "Both sides must upgrade simultaneously"],
    answer: 1,
    explanation: "BACKWARD = new reader, old data. Consumers deploy the new schema first and can still read what current producers write; then producers may upgrade. FORWARD is the reverse (producers first); FULL is both."
  },
  {
    id: "kk-020", section: "k2",
    q: "How does a consumer know which Avro schema a record was written with, using the Confluent wire format?",
    options: ["The full schema is embedded in every message", "Each message carries a schema ID; the deserializer fetches (and caches) that schema from Schema Registry", "The topic name encodes the schema", "Schemas are guessed from the bytes"],
    answer: 1,
    explanation: "The wire format is magic byte + 4-byte schema ID + payload — compact messages, with the schema itself stored once in the registry and cached client-side after first fetch."
  },
  {
    id: "kk-021", section: "k2",
    q: "A producer intermittently logs NotLeaderForPartitionException but messages eventually arrive. What is happening?",
    options: ["The topic is corrupt and must be recreated", "A retriable error: partition leadership moved (broker restart/rebalance); the producer refreshes metadata and retries automatically", "The producer's serializer is broken", "The message exceeded max.request.size"],
    answer: 1,
    explanation: "Leadership changes are normal transient cluster events — classic RETRIABLE errors the client handles with retries + metadata refresh. Serialization and record-too-large errors are non-retriable and would fail every attempt."
  },
  {
    id: "kk-022", section: "k2",
    q: "A consumer hits a record that always throws SerializationException, blocking the partition. What is the standard remedy?",
    options: ["Restart the consumer until it works", "Catch/handle the poison record: skip past its offset (or use an error-tolerant deserializer) and publish it to a dead-letter topic for analysis", "Delete the topic", "Reduce fetch.max.bytes"],
    answer: 1,
    explanation: "Deserialization failures are non-retriable — the same bytes fail forever, so retrying blocks the partition. Skip-and-DLQ keeps the pipeline flowing while preserving the bad record for investigation."
  },
  {
    id: "kk-023", section: "k2",
    q: "Which tool shows a consumer group's current offset, log-end offset, and lag per partition from the command line?",
    options: ["kafka-topics.sh --describe", "kafka-consumer-groups.sh --describe --group <name>", "kafka-console-consumer.sh --from-beginning", "kafka-configs.sh --describe"],
    answer: 1,
    explanation: "kafka-consumer-groups.sh --describe lists each partition's CURRENT-OFFSET, LOG-END-OFFSET and LAG (plus member assignments) — also the tool for --reset-offsets. kafka-topics.sh describes topic structure, not group positions."
  },
  {
    id: "kk-024", section: "k2",
    q: "Where is producer-side compression applied, and what maximizes its benefit?",
    options: ["Per record on the broker; benefit is fixed", "Per batch on the producer (compression.type); larger batches (linger.ms/batch.size) compress better", "Only consumers can compress", "Compression requires Schema Registry"],
    answer: 1,
    explanation: "The producer compresses whole batches before sending; brokers typically store them compressed and consumers decompress. Because compression works on batch payloads, better batching directly improves ratio and throughput."
  },
  {
    id: "kk-025", section: "k2",
    q: "Which API creates topics, alters configurations, and lists consumer-group offsets programmatically?",
    options: ["Producer API", "AdminClient (Admin API)", "Streams API", "Connect REST API"],
    answer: 1,
    explanation: "AdminClient is the management API for cluster resources: topics, configs, ACLs, consumer groups and their offsets. The Connect REST API manages connectors only."
  },

  // ---- Section k3: Kafka Streams ----
  {
    id: "kk-026", section: "k3",
    q: "A Kafka Streams application reads a topic with 8 partitions. The team deploys 10 instances (1 stream thread each) for throughput. What happens?",
    options: ["All 10 instances process data", "Only 8 instances get tasks — parallelism is capped by input partitions; 2 instances stay idle", "The app fails to start", "Kafka adds partitions automatically"],
    answer: 1,
    explanation: "Streams creates one task per input partition; tasks are the unit of parallelism distributed across instances/threads sharing the application.id. Beyond 8 active workers there is nothing to assign."
  },
  {
    id: "kk-027", section: "k3",
    q: "Which abstraction models 'the current price of each product, updated over time'?",
    options: ["KStream — every record is an independent event", "KTable — a changelog where each key holds its latest value", "A windowed KStream", "A repartition topic"],
    answer: 1,
    explanation: "Latest-value-per-key semantics is exactly a KTable: new records for a key UPDATE the table. A KStream would treat every price change as a separate immutable event."
  },
  {
    id: "kk-028", section: "k3",
    q: "A stream must be enriched with a small reference dataset (200 rows) on a key different from the stream's key, without repartitioning. Which construct fits?",
    options: ["KTable join (co-partitioned)", "GlobalKTable join — fully replicated to each instance and joinable on any key via a key mapper", "Windowed stream-stream join", "Merge of two KStreams"],
    answer: 1,
    explanation: "GlobalKTables are replicated in full to every instance, so joins don't require co-partitioning and can use an arbitrary join key. Perfect for small lookup data; regular KTable joins need same key + same partition count."
  },
  {
    id: "kk-029", section: "k3",
    q: "What backs a Kafka Streams state store for fault tolerance?",
    options: ["A relational database configured by the user", "A compacted changelog topic in Kafka; after failure, state is restored by replaying it (standby replicas shorten recovery)", "A snapshot file uploaded to S3", "Nothing — state is lost on failure"],
    answer: 1,
    explanation: "Every state store writes its updates to a changelog topic. On task migration/failure the store is rebuilt from that topic; num.standby.replicas maintains warm copies to cut restore time."
  },
  {
    id: "kk-030", section: "k3",
    q: "Count user clicks in fixed, non-overlapping 5-minute buckets. Which window type is this?",
    options: ["Hopping window (size 5 min, advance 1 min)", "Tumbling window of 5 minutes", "Session window with 5-minute gap", "Sliding window"],
    answer: 1,
    explanation: "Tumbling = fixed size, no overlap (each event in exactly one window). Hopping overlaps (size + smaller advance); session windows are activity-based with an inactivity gap; sliding relates records within a time difference."
  },
  {
    id: "kk-031", section: "k3",
    q: "Group user activity into sessions that end after 30 minutes of inactivity. Which window applies?",
    options: ["Tumbling 30-minute window", "Session windows with a 30-minute inactivity gap", "Hopping window advancing 30 minutes", "No windowing needed"],
    answer: 1,
    explanation: "Session windows are dynamic: they extend while events keep arriving and close when the gap (30 min) elapses without activity — precisely the sessionization use case."
  },
  {
    id: "kk-032", section: "k3",
    q: "What configuration turns on exactly-once processing in a Kafka Streams application?",
    options: ["enable.idempotence=true", "processing.guarantee=exactly_once_v2", "isolation.level=read_committed", "acks=all"],
    answer: 1,
    explanation: "Streams wraps its consume-process-produce cycle (including changelog writes) in transactions when processing.guarantee=exactly_once_v2 is set — the one-line EOS switch. The other settings are pieces Streams manages internally."
  },
  {
    id: "kk-033", section: "k3",
    q: "Before a stream-stream join, one stream is re-keyed with selectKey(). What does Streams do to make the join correct?",
    options: ["Fails at startup", "Writes the re-keyed stream through an internal repartition topic so equal keys land in the same task", "Broadcasts all records to every task", "Ignores the new key"],
    answer: 1,
    explanation: "After a key change, records with the same new key may sit in different partitions. Streams inserts a repartition topic to shuffle them so join/aggregation tasks see all records for a key. (Joins also require equal partition counts — co-partitioning.)"
  },
  {
    id: "kk-034", section: "k3",
    q: "By default, which notion of time drives Kafka Streams windowing?",
    options: ["Wall-clock time when the record is processed", "Event time from the record's timestamp (customizable with a TimestampExtractor)", "Broker disk-flush time", "The consumer's poll time"],
    answer: 1,
    explanation: "Streams windows on record timestamps (event time), so out-of-order and late records still fall into their correct windows (within the grace period). Processing time would make results depend on when the app happens to run."
  },
  {
    id: "kk-035", section: "k3",
    q: "A windowed aggregation emits multiple intermediate updates per window, but the sink should receive only one final result per window. What is the idiomatic solution?",
    options: ["Poll less often", "Use suppress() to hold updates until the window closes (grace period elapsed), emitting only the final value", "Set linger.ms high on the producer", "Use a GlobalKTable"],
    answer: 1,
    explanation: "Streams refines window results continuously; suppress(untilWindowCloses) buffers them and forwards only the final result when the window plus grace period ends."
  },
  {
    id: "kk-036", section: "k3",
    q: "How does a Kafka Streams application scale out at runtime?",
    options: ["It cannot scale without redeployment", "Start additional instances with the SAME application.id — tasks and their state migrate automatically to the new members", "Change group.id per instance", "Increase replication factor"],
    answer: 1,
    explanation: "application.id doubles as the consumer group id: new instances join the group, the tasks rebalance across members, and state stores are rebuilt/migrated (changelogs, standbys). Same mechanism in reverse handles instance loss."
  },
  {
    id: "kk-037", section: "k3",
    q: "What is a Kafka Streams application, operationally?",
    options: ["A server process installed on each Kafka broker", "A standard Java application using a client library — deployed like any app (VMs, Docker, Kubernetes), with no processing cluster to install", "A plugin inside ZooKeeper", "A managed Confluent Cloud-only service"],
    answer: 1,
    explanation: "Streams is a library, not a cluster: the topology runs inside your own JVM processes, coordinated through Kafka itself. Deployment is ordinary application deployment — which is exactly why it fits Docker/Kubernetes pipelines."
  }
);
