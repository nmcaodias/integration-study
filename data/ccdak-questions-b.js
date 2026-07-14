// CCDAK question bank — Part B (sections k4–k6)
window.CERT_DATA.ccdak.questions.push(
  // ---- Section k4: Kafka Connect ----
  {
    id: "kk-038", section: "k4",
    q: "Data must be copied continuously from a PostgreSQL database into Kafka, and from Kafka into Elasticsearch, with minimal custom code. What is the recommended approach?",
    options: ["Write a custom producer and consumer application", "Kafka Connect: a source connector for PostgreSQL and a sink connector for Elasticsearch, both configuration-driven", "Kafka Streams with JDBC calls", "A cron job with the console producer"],
    answer: 1,
    explanation: "This is Kafka Connect's exact purpose: existing connectors handle offsets, retries, scaling, and schemas via configuration. Custom clients re-implement all of that; Streams is for processing, not system integration."
  },
  {
    id: "kk-039", section: "k4",
    q: "Where does a DISTRIBUTED Kafka Connect cluster store connector configurations, source offsets, and status?",
    options: ["Local files on each worker", "In internal Kafka topics (config, offset, and status topics) shared by the worker group", "In ZooKeeper", "In Schema Registry"],
    answer: 1,
    explanation: "Distributed mode keeps its state in Kafka itself, which is what makes workers stateless and fault-tolerant — any worker can pick up work. Standalone mode is the one using local files."
  },
  {
    id: "kk-040", section: "k4",
    q: "How is a connector created and managed in a distributed Connect cluster?",
    options: ["Editing server.properties and restarting brokers", "Via the Connect REST API — POST the connector config; use it also for status, pause/resume, restart, delete", "Only through ZooKeeper CLI", "By placing a file on each worker"],
    answer: 1,
    explanation: "Distributed Connect is managed at runtime over its REST interface (e.g., POST /connectors, GET /connectors/<name>/status). Standalone workers take properties files at startup instead."
  },
  {
    id: "kk-041", section: "k4",
    q: "What is the relationship between a connector and its tasks?",
    options: ["They are the same thing", "The connector is the logical job definition; it splits the work into tasks (bounded by tasks.max) that run distributed across workers — the actual unit of parallelism", "Tasks manage workers", "One task always equals one topic"],
    answer: 1,
    explanation: "Connector = coordination + config; tasks = the parallel data-copying units. Effective parallelism is also limited by the source's divisible units (tables, files) or the topic's partitions for sinks."
  },
  {
    id: "kk-042", section: "k4",
    q: "A JDBC source connector must write Avro records with schemas managed centrally. What configuration achieves this?",
    options: ["The JDBC connector always writes Avro", "Set value.converter=io.confluent.connect.avro.AvroConverter with value.converter.schema.registry.url — converters are independent of the connector", "Use StringConverter", "Enable errors.tolerance=all"],
    answer: 1,
    explanation: "Converters translate Connect's internal records to bytes and are configured separately from the connector logic — the same connector can emit Avro, Protobuf, JSON Schema, or plain JSON depending on converter settings."
  },
  {
    id: "kk-043", section: "k4",
    q: "Field 'ssn' must be masked and records routed to a per-region topic as they flow through a connector — no external processing step. What mechanism does Connect provide?",
    options: ["A custom Kafka Streams job", "Single Message Transforms (SMTs) chained in the connector config (e.g., MaskField + a routing transform)", "Broker interceptors", "Schema Registry compatibility rules"],
    answer: 1,
    explanation: "SMTs apply lightweight per-record transformations inside the connector pipeline. For heavier logic (joins, aggregation) you'd use a stream processor between source and sink instead."
  },
  {
    id: "kk-044", section: "k4",
    q: "A sink connector keeps dying on malformed records. It must skip them but keep them for later inspection. Which configuration applies?",
    options: ["errors.tolerance=none", "errors.tolerance=all with errors.deadletterqueue.topic.name (and context headers enabled) — failed records go to a DLQ topic", "tasks.max=1", "key.converter=StringConverter"],
    answer: 1,
    explanation: "Tolerance 'all' keeps the task alive past bad records, and the DLQ topic (a SINK-connector feature) captures each failure — with reasons in headers when enabled — instead of silently dropping it."
  },
  {
    id: "kk-045", section: "k4",
    q: "Compared with a polling JDBC source, what advantage does log-based CDC (e.g., Debezium) provide?",
    options: ["It requires no connector at all", "It reads the database's transaction log: captures every change including DELETEs, with low latency and minimal load on tables", "It works without the database running", "It converts data to Avro automatically"],
    answer: 1,
    explanation: "Polling misses deletes, adds query load, and is bounded by the poll interval. Reading the transaction log streams every committed row change (with before/after images), which is why CDC is preferred for database replication into Kafka."
  },
  {
    id: "kk-046", section: "k4",
    q: "One worker in a 3-worker distributed Connect cluster crashes. What happens to the tasks it was running?",
    options: ["They are lost until the worker returns", "The remaining workers rebalance and take over the failed worker's connectors/tasks, resuming from offsets stored in Kafka", "All connectors restart from the beginning of history", "The cluster stops accepting REST calls"],
    answer: 1,
    explanation: "Because config/offsets/status live in Kafka topics, workers are interchangeable: the group rebalances the failed worker's tasks and they resume from their last committed source offsets."
  },
  {
    id: "kk-047", section: "k4",
    q: "Which statement about standalone Connect workers is TRUE?",
    options: ["They are recommended for production for simplicity", "They run in a single process with offsets in a local file — no fault tolerance or horizontal scaling; fine for development and testing", "They store offsets in Kafka automatically", "They cannot run source connectors"],
    answer: 1,
    explanation: "Standalone = one process, local offset storage, no failover — a dev/test convenience. Production runs distributed mode for fault tolerance, scaling, and REST management."
  },

  // ---- Section k5: Application Testing ----
  {
    id: "kk-048", section: "k5",
    q: "Producer callback logic (success metrics, error handling) must be unit-tested without a broker. Which tool fits?",
    options: ["Testcontainers Kafka", "MockProducer — records sent messages for assertions and can simulate send failures (errorNext)", "kafka-console-producer", "TopologyTestDriver"],
    answer: 1,
    explanation: "MockProducer is the in-memory test double from kafka-clients: assert on history(), drive callbacks with simulated success/failure — no broker, no network, deterministic."
  },
  {
    id: "kk-049", section: "k5",
    q: "Which combination tests a Kafka Streams topology synchronously without any running Kafka cluster?",
    options: ["MockConsumer + MockProducer", "TopologyTestDriver with TestInputTopic and TestOutputTopic", "kafka-consumer-groups.sh", "A three-broker Testcontainers cluster"],
    answer: 1,
    explanation: "TopologyTestDriver executes the topology in-process: pipe records via TestInputTopic, assert results from TestOutputTopic, and query state stores directly — fast, deterministic unit tests for Streams logic."
  },
  {
    id: "kk-050", section: "k5",
    q: "A tumbling-window aggregation with a grace period must be tested deterministically, including late-arrival behavior. How?",
    options: ["Thread.sleep() in the test until the window closes", "Use TopologyTestDriver's explicit time control — pipe records with chosen timestamps and advance wall-clock time to trigger window closing", "Run it in production and watch", "Windows cannot be tested"],
    answer: 1,
    explanation: "The test driver lets you SET record timestamps and advance time programmatically, so window boundaries, grace periods, and suppress() emissions are exercised deterministically — no sleeps, no flakiness."
  },
  {
    id: "kk-051", section: "k5",
    q: "Which risks are NOT covered by mocks and the TopologyTestDriver, and therefore need an integration test with a real broker (e.g., Testcontainers)?",
    options: ["Branching logic in a topology", "Security handshakes, real Schema Registry (de)serialization, transactions, and rebalance behavior", "A map() transformation", "Callback code on send"],
    answer: 1,
    explanation: "Interaction-level concerns — auth/TLS, registry round-trips, transactional semantics, group coordination — only exist against real infrastructure. Pure logic belongs in fast unit tests; keep both layers."
  },
  {
    id: "kk-052", section: "k5",
    q: "How should schema changes be prevented from breaking production consumers?",
    options: ["Deploy and monitor for errors", "Check candidate schemas against the registry's compatibility mode in CI (compatibility REST endpoint or schema-registry:test-compatibility Maven goal) so incompatible changes fail the build", "Disable compatibility checking", "Use StringSerializer everywhere"],
    answer: 1,
    explanation: "Schema Registry can validate a proposed schema against the subject's BACKWARD/FORWARD/FULL rules before anything is deployed — wiring that check into CI catches breaking changes at build time."
  },
  {
    id: "kk-053", section: "k5",
    q: "What design choice makes producer/consumer application code easy to unit test?",
    options: ["Instantiating KafkaProducer inside every method", "Injecting the Producer/Consumer interface into the logic class, so tests pass MockProducer/MockConsumer and production passes real clients", "Making all methods static", "Testing only via the CLI"],
    answer: 1,
    explanation: "Dependency injection against the client INTERFACES is what lets the same logic run with mocks in tests. Hard-coded client construction forces integration tests for everything."
  },

  // ---- Section k6: Application Observability ----
  {
    id: "kk-054", section: "k6",
    q: "What exactly is consumer lag for a partition?",
    options: ["The time since the consumer last polled", "Log end offset minus the consumer's current/committed offset — how many records behind the consumer is", "The number of rebalances per hour", "Bytes in the fetch buffer"],
    answer: 1,
    explanation: "Lag counts unconsumed records between the partition's newest offset and the consumer's position. Persistent lag growth is THE signal that consumption can't keep up with production."
  },
  {
    id: "kk-055", section: "k6",
    q: "How do Kafka clients expose their metrics for collection?",
    options: ["They write CSV files", "Via JMX MBeans (per client/topic/node), typically scraped by agents like the Prometheus JMX exporter", "Only through Confluent Control Center", "Metrics must be coded manually"],
    answer: 1,
    explanation: "Producer, consumer, Streams, and Connect all register JMX metrics out of the box; monitoring stacks scrape them. Streams adds thread/task/store metrics with configurable recording levels."
  },
  {
    id: "kk-056", section: "k6",
    q: "Which producer metric indicates messages that ultimately FAILED delivery after exhausting retries, and what should its value be?",
    options: ["record-retry-rate; high values are normal", "record-error-rate; it should be ~0 and alerted on otherwise", "batch-size-avg; should be 0", "compression-rate-avg; should be 1"],
    answer: 1,
    explanation: "record-error-rate counts definitive send failures — data loss from the app's perspective, so alert on any sustained non-zero value. record-retry-rate is the early-warning cousin: transient trouble being retried."
  },
  {
    id: "kk-057", section: "k6",
    q: "Lag grows steadily on exactly ONE of a topic's 12 partitions. What is the most likely cause to investigate first?",
    options: ["The whole cluster is undersized", "A hot key skewing traffic to that partition (or one stuck/slow consumer instance) — check key distribution and that assignee's health", "Schema Registry is down", "linger.ms is too high"],
    answer: 1,
    explanation: "Uniform problems raise lag everywhere; single-partition lag points to skew (one key getting disproportionate traffic) or the specific consumer assigned to it. Key cardinality/hashing is the classic culprit."
  },
  {
    id: "kk-058", section: "k6",
    q: "Duplicates appear downstream after consumer crashes, even though processing is correct. The metrics show frequent rebalances. What is the explanation?",
    options: ["Kafka randomly duplicates data", "At-least-once consumption: records processed but not yet committed before the crash/rebalance are redelivered — make handling idempotent or adopt transactions/EOS", "The producer's compression corrupts batches", "Lag is negative"],
    answer: 1,
    explanation: "Between processing and offset commit there is always a redelivery window under at-least-once. Frequent rebalances widen it. Fixes: idempotent writes keyed on record identity, or exactly-once processing where applicable."
  },
  {
    id: "kk-059", section: "k6",
    q: "How can telemetry (counting, tracing) be added to every produced and consumed record WITHOUT modifying business code?",
    options: ["Fork the Kafka client library", "Configure ProducerInterceptor / ConsumerInterceptor classes via interceptor.classes — hooks that observe records on send and on consume", "Add a broker plugin", "Enable DEBUG logging"],
    answer: 1,
    explanation: "Interceptors are the client-side extension point for cross-cutting observability (Confluent's monitoring interceptors use it). They see records in the send/consume path with zero business-code changes."
  },
  {
    id: "kk-060", section: "k6",
    q: "A trace ID must follow one business transaction from the HTTP request, through the producer, into a consumer three services away. Where does the trace context travel in Kafka?",
    options: ["In the message key (replacing the business key)", "In message HEADERS (e.g., W3C/OpenTelemetry trace context), propagated producer → consumer", "In the topic name", "It cannot cross Kafka"],
    answer: 1,
    explanation: "Headers are the metadata channel: tracing libraries inject context on produce and extract it on consume, keeping the trace intact — without abusing the key (which would change partitioning!)."
  },
  {
    id: "kk-061", section: "k6",
    q: "A producer starts throwing TimeoutException and bufferpool-wait-time climbs. What is happening?",
    options: ["Consumers are lagging", "The producer generates data faster than the cluster accepts it (or brokers are slow/unreachable): batches back up in buffer.memory until send() blocks and times out", "Log compaction deleted the topic", "The consumer group rebalanced"],
    answer: 1,
    explanation: "buffer.memory fills when the I/O thread can't drain batches fast enough — from broker slowness, network issues, or plain overproduction. Check request-latency and cluster health; consumer lag is unrelated to producer buffering."
  },
  {
    id: "kk-062", section: "k6",
    q: "Which end-to-end health check catches pipeline delay that per-component metrics can miss?",
    options: ["Broker CPU usage", "End-to-end latency: compare the record's event timestamp with the time it is finally processed by the last consumer", "Topic partition count", "Number of connectors deployed"],
    answer: 1,
    explanation: "Each hop can look healthy while queueing between hops accumulates delay. Measuring event-time-to-final-processing spans the entire pipeline — the metric that reflects what the business actually experiences."
  }
);
