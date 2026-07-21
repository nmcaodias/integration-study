/* CCDAK · hands-on Kafka exercises (developer cert — genuinely hands-on: CLI,
 * client config/code, Streams topologies, Connect REST). Each presents a task +
 * given assets; the learner runs it outside the site (terminal / IDE against a
 * local or Docker Kafka) and reveals a model solution. Same schema/feature as
 * the other certs' exercises. 12 exercises weighted to k1 (23%) and k2 (28%). */
module.exports = {
  addExercises: [
    {
      id: "kk-ex-01",
      section: "k1",
      title: "Create and inspect a topic with the CLI",
      level: "easy",
      where: "Terminal (Kafka CLI)",
      task: `<p>Create a topic <code>orders</code> with <strong>6 partitions</strong> and <strong>replication factor 3</strong>, then confirm the partition count, the leader/replica/ISR layout, and that the config took effect. Finally, increase it to 12 partitions and observe what changes.</p>`,
      given: [
        { label: "Cluster", code: "A running Kafka cluster (3 brokers), bootstrap at localhost:9092" }
      ],
      steps: [
        "Create the topic with --partitions 6 --replication-factor 3",
        "Describe it and read the Leader / Replicas / Isr columns per partition",
        "Add partitions with --alter --partitions 12",
        "Note: partitions can only be INCREASED, never decreased, and re-keys the key→partition mapping"
      ],
      solution: [
        { label: "Commands", code: "kafka-topics --bootstrap-server localhost:9092 --create \\\n  --topic orders --partitions 6 --replication-factor 3\n\nkafka-topics --bootstrap-server localhost:9092 --describe --topic orders\n# Topic: orders  PartitionCount: 6  ReplicationFactor: 3\n# Partition: 0  Leader: 1  Replicas: 1,2,3  Isr: 1,2,3  ...\n\nkafka-topics --bootstrap-server localhost:9092 --alter \\\n  --topic orders --partitions 12   # increase only" }
      ],
      solutionNotes: `<p><code>--describe</code> shows, per partition, the <strong>leader</strong> broker (where produce/consume happens), the full <strong>replica</strong> set, and the <strong>ISR</strong> (in-sync replicas). Partition count can only ever be <em>increased</em>; adding partitions changes which partition a given key hashes to, so keyed ordering guarantees only hold for messages produced <em>after</em> the change.</p>`
    },
    {
      id: "kk-ex-02",
      section: "k1",
      title: "Key-based ordering and consumer-group scaling",
      level: "medium",
      where: "Terminal (console producer/consumer)",
      task: `<p>Prove two things with the console tools: (1) messages with the <strong>same key</strong> always land on the same partition (per-key ordering), and (2) within a <strong>consumer group</strong>, partitions are divided among consumers and an extra consumer beyond the partition count sits idle.</p>`,
      given: [
        { label: "Topic", code: "topic 'orders' with 6 partitions (from ex-01)" }
      ],
      steps: [
        "Produce keyed records with parse.key=true and a key separator",
        "Consume with --property print.partition=true to see key→partition stability",
        "Start N consumers sharing --group g1 and watch partition assignment",
        "Start a 7th consumer on 6 partitions and confirm it gets nothing"
      ],
      solution: [
        { label: "Produce keyed, observe partition", code: "kafka-console-producer --bootstrap-server localhost:9092 --topic orders \\\n  --property parse.key=true --property key.separator=:\n> cust-1:order A\n> cust-1:order B      # same key → same partition, ordered\n> cust-2:order C\n\nkafka-console-consumer --bootstrap-server localhost:9092 --topic orders \\\n  --from-beginning --property print.key=true --property print.partition=true" },
        { label: "Group scaling", code: "# run in 3 terminals — they share the 6 partitions (2 each)\nkafka-console-consumer --bootstrap-server localhost:9092 \\\n  --topic orders --group g1\n# a 7th consumer in g1 stays idle: consumers > partitions ⇒ some idle" }
      ],
      solutionNotes: `<p>Kafka orders records <strong>per partition</strong>, and a key is hashed to a fixed partition, so all records for one key are ordered. A <strong>consumer group</strong> splits partitions across its members for parallelism; the maximum useful parallelism equals the partition count, so any consumer beyond that is idle. Different <code>group.id</code>s each get a full independent copy of the stream.</p>`
    },
    {
      id: "kk-ex-03",
      section: "k2",
      title: "Configure a no-loss, no-duplicate producer",
      level: "medium",
      where: "IDE (Java/producer config)",
      task: `<p>Configure a producer so an accepted record is <strong>never lost</strong> and retries can't create <strong>duplicates</strong>, even across leader failovers. State which single setting enables idempotence and what it forces for <code>acks</code> and retries.</p>`,
      given: [
        { label: "Starting (unsafe) config", code: "acks=1\nretries=0\nenable.idempotence=false" }
      ],
      steps: [
        "Set enable.idempotence=true (the master switch for EOS-grade producing)",
        "Confirm it requires acks=all, retries>0, and max.in.flight<=5",
        "Keep min.insync.replicas=2 on an RF=3 topic for durability",
        "Understand the guarantee: exactly-once *per partition* for producer retries"
      ],
      solution: [
        { label: "Producer properties", code: "enable.idempotence=true      # dedups producer retries via PID + sequence\nacks=all                     # implied by idempotence; wait for all ISR\nretries=2147483647           # implied; safe because dedup is on\nmax.in.flight.requests.per.connection=5   # <=5 keeps ordering\n# broker/topic side: replication.factor=3, min.insync.replicas=2" }
      ],
      solutionNotes: `<p><code>enable.idempotence=true</code> is the one switch: the broker tags each producer with a PID and per-partition sequence numbers, so a retried batch is deduplicated. It <em>forces</em> <code>acks=all</code>, positive retries, and <code>max.in.flight ≤ 5</code>. Combined with <code>min.insync.replicas=2</code> on RF=3, an accepted write survives a broker loss and retries never duplicate.</p>`
    },
    {
      id: "kk-ex-04",
      section: "k2",
      title: "At-least-once consumer with manual offset commits",
      level: "medium",
      where: "IDE (Java/consumer code)",
      task: `<p>Write the poll loop for a consumer that must <strong>never lose a record</strong> (at-least-once): disable auto-commit and commit offsets only <em>after</em> the records in a batch are fully processed. Explain why committing before processing would risk loss and why this design can produce duplicates.</p>`,
      given: [
        { label: "Risky pattern to avoid", code: "enable.auto.commit=true   // commits on a timer, possibly before processing" }
      ],
      steps: [
        "Set enable.auto.commit=false",
        "poll() a batch, process every record, THEN commitSync()",
        "On rebalance/crash before commit, the batch is redelivered (at-least-once)",
        "Make processing idempotent since duplicates are possible"
      ],
      solution: [
        { label: "Poll loop", code: "props.put(\"enable.auto.commit\", \"false\");\nwhile (running) {\n  var records = consumer.poll(Duration.ofMillis(500));\n  for (var r : records) {\n    process(r);            // side effects must be idempotent\n  }\n  consumer.commitSync();   // commit ONLY after processing the batch\n}" }
      ],
      solutionNotes: `<p>Committing <strong>after</strong> processing guarantees at-least-once: if the app dies mid-batch, nothing was committed, so the batch replays. Committing <em>before</em> processing (or auto-commit firing on its timer) would advance the offset past unprocessed records — those are lost on a crash. The cost of at-least-once is possible <strong>duplicates</strong>, so downstream effects must be idempotent.</p>`
    },
    {
      id: "kk-ex-05",
      section: "k2",
      title: "Exactly-once consume–transform–produce with transactions",
      level: "hard",
      where: "IDE (Java/transactions)",
      task: `<p>An app reads from <code>input</code>, transforms, and produces to <code>output</code>. Achieve <strong>exactly-once</strong> end-to-end so that on failure neither a duplicate output nor a skipped input occurs. Wire up the transactional producer, and atomically commit the <em>consumer offsets</em> as part of the producer transaction.</p>`,
      given: [
        { label: "Building blocks", code: "producer: transactional.id set\nconsumer: isolation.level=read_committed, enable.auto.commit=false" }
      ],
      steps: [
        "Set a unique transactional.id and call initTransactions()",
        "Per batch: beginTransaction(), produce outputs",
        "sendOffsetsToTransaction(consumedOffsets, groupMetadata) — offsets join the txn",
        "commitTransaction() (or abort on error); consumers read with read_committed"
      ],
      solution: [
        { label: "Transaction loop", code: "producer.initTransactions();\nwhile (running) {\n  var records = consumer.poll(Duration.ofMillis(500));\n  producer.beginTransaction();\n  for (var r : records)\n    producer.send(new ProducerRecord<>(\"output\", transform(r.value())));\n  producer.sendOffsetsToTransaction(\n      offsetsOf(records), consumer.groupMetadata());\n  producer.commitTransaction();   // outputs + input offsets commit atomically\n}\n// consumers of 'output' set isolation.level=read_committed" }
      ],
      solutionNotes: `<p>Exactly-once for consume-transform-produce needs the <strong>output records and the input offsets to commit in one transaction</strong>. <code>sendOffsetsToTransaction</code> folds the consumer's progress into the producer's transaction, so either both happen or neither does. Downstream consumers must use <code>isolation.level=read_committed</code> so they never see aborted output. In Kafka Streams this is one line: <code>processing.guarantee=exactly_once_v2</code>.</p>`
    },
    {
      id: "kk-ex-06",
      section: "k2",
      title: "Avro + Schema Registry with a backward-compatible change",
      level: "hard",
      where: "IDE + Terminal (Schema Registry)",
      task: `<p>Produce Avro records for <code>orders-value</code> using Schema Registry, then evolve the schema by <strong>adding an optional field</strong> under <strong>BACKWARD</strong> compatibility so existing consumers keep working. Show how a consumer resolves the writer schema, and what change would be rejected.</p>`,
      given: [
        { label: "v1 schema (orders-value)", code: "{ \"type\":\"record\", \"name\":\"Order\", \"fields\":[\n  {\"name\":\"id\",\"type\":\"string\"},\n  {\"name\":\"amount\",\"type\":\"double\"} ]}" }
      ],
      steps: [
        "Configure the producer with the KafkaAvroSerializer + schema.registry.url",
        "Evolve v2: add a field WITH a default (required for BACKWARD)",
        "Register/verify compatibility; the serializer embeds the schema ID in each record",
        "A consumer reads the schema ID from the record and fetches that exact writer schema"
      ],
      solution: [
        { label: "v2 schema + why it's compatible", code: "// v2: new field 'currency' has a default → BACKWARD-compatible\n{\"name\":\"currency\",\"type\":\"string\",\"default\":\"USD\"}\n\n// producer config\nvalue.serializer=io.confluent.kafka.serializers.KafkaAvroSerializer\nschema.registry.url=http://localhost:8081\n\n# check compatibility before deploying\ncurl -X POST -H 'Content-Type: application/vnd.schemaregistry.v1+json' \\\n  --data '{\"schema\": \"<v2 escaped>\"}' \\\n  http://localhost:8081/compatibility/subjects/orders-value/versions/latest\n# {\"is_compatible\": true}   ← adding a required field (no default) → false" }
      ],
      solutionNotes: `<p>Each Avro record carries a 5-byte header with the <strong>schema ID</strong>; the consumer fetches <em>that</em> writer schema (not "latest") and deserializes against it, then projects onto its reader schema. Under <strong>BACKWARD</strong> compatibility a new schema must be readable by consumers on the old one — so adding a field needs a <strong>default</strong>, and adding a required field (or removing one) is rejected. Run the compatibility check in CI to block breaking changes.</p>`
    },
    {
      id: "kk-ex-07",
      section: "k3",
      title: "Build a word-count Streams topology",
      level: "medium",
      where: "IDE (Kafka Streams)",
      task: `<p>Write a Kafka Streams topology that reads lines from <code>text-input</code>, splits them into words, and continuously counts each word into <code>word-counts</code>. Identify which parts create an internal <strong>repartition</strong> topic and which create a <strong>changelog</strong> topic.</p>`,
      given: [
        { label: "Topics", code: "input:  text-input  (key: null, value: line of text)\noutput: word-counts (key: word, value: running count)" }
      ],
      steps: [
        "Stream text-input; flatMapValues to split into words",
        "groupBy(word) — the re-key triggers a repartition topic",
        "count() into a KTable — its state store is backed by a changelog topic",
        "toStream().to(\"word-counts\", Produced with Serdes.String/Long)"
      ],
      solution: [
        { label: "Topology", code: "StreamsBuilder b = new StreamsBuilder();\nb.<String,String>stream(\"text-input\")\n .flatMapValues(v -> Arrays.asList(v.toLowerCase().split(\"\\\\W+\")))\n .groupBy((k, word) -> word)          // ⇒ repartition topic\n .count(Materialized.as(\"counts\"))     // ⇒ changelog topic\n .toStream()\n .to(\"word-counts\", Produced.with(Serdes.String(), Serdes.Long()));" }
      ],
      solutionNotes: `<p><code>groupBy</code> re-keys the stream, so Streams inserts an internal <strong>repartition</strong> topic to co-locate identical words on the same task. <code>count()</code> maintains a state store whose fault tolerance comes from an internal <strong>changelog</strong> topic — on restart the store is restored by replaying it. These internal topics are created and managed automatically under the application id.</p>`
    },
    {
      id: "kk-ex-08",
      section: "k3",
      title: "Windowed aggregation with a single result per window",
      level: "hard",
      where: "IDE (Kafka Streams)",
      task: `<p>Count orders per customer in fixed <strong>1-hour tumbling windows</strong>, but emit <strong>only the final result</strong> per window to the sink (not every intermediate update). Use a grace period for late events and suppress intermediates. Explain event-time vs the window close.</p>`,
      given: [
        { label: "Requirement", code: "input: orders (key: customerId)\nwant: exactly one (customer, window) → finalCount, after the window closes" }
      ],
      steps: [
        "groupByKey then windowedBy a 1-hour TimeWindows with a grace period",
        "count() the windowed aggregation",
        "suppress(untilWindowCloses(unbounded())) to emit only finals",
        "Windowing is driven by event time (record timestamps), so late records within grace still count"
      ],
      solution: [
        { label: "Suppressed windowed count", code: "orders.groupByKey()\n  .windowedBy(TimeWindows.ofSizeAndGrace(\n        Duration.ofHours(1), Duration.ofMinutes(10)))\n  .count()\n  .suppress(Suppressed.untilWindowCloses(BufferConfig.unbounded()))\n  .toStream()\n  .to(\"orders-per-hour\");" }
      ],
      solutionNotes: `<p>Tumbling windows are fixed, non-overlapping buckets keyed by <strong>event time</strong>. Without suppression a windowed aggregate emits an update on every record; <code>suppress(untilWindowCloses)</code> holds results until the window (plus its <strong>grace period</strong>) closes and emits one final value. The grace period is what lets a late-but-not-too-late record still be counted before the window is finalized.</p>`
    },
    {
      id: "kk-ex-09",
      section: "k4",
      title: "Run a JDBC source connector with Avro and an SMT",
      level: "hard",
      where: "Terminal (Connect REST API)",
      task: `<p>On a <strong>distributed</strong> Connect cluster, create a JDBC <em>source</em> connector that streams a Postgres table into Kafka as <strong>Avro</strong> (schemas in Schema Registry), <strong>masks</strong> the <code>ssn</code> field, and routes records to a topic prefixed <code>db_</code>. Do it via the REST API and explain where the connector config and offsets are stored.</p>`,
      given: [
        { label: "Cluster", code: "distributed Connect workers behind http://localhost:8083\nSchema Registry at http://localhost:8081" }
      ],
      steps: [
        "POST the connector config to /connectors (not a properties file — distributed uses REST)",
        "Use AvroConverter + schema.registry.url for value conversion",
        "Add a MaskField SMT for ssn and a RegexRouter (or topic.prefix) for db_ topics",
        "Config, offsets, and status live in Connect's internal topics (replicated across workers)"
      ],
      solution: [
        { label: "Create connector", code: "curl -X POST http://localhost:8083/connectors -H 'Content-Type: application/json' -d '{\n  \"name\": \"pg-orders-source\",\n  \"config\": {\n    \"connector.class\": \"io.confluent.connect.jdbc.JdbcSourceConnector\",\n    \"connection.url\": \"jdbc:postgresql://db/app\",\n    \"mode\": \"incrementing\", \"incrementing.column.name\": \"id\",\n    \"table.whitelist\": \"orders\",\n    \"topic.prefix\": \"db_\",\n    \"value.converter\": \"io.confluent.connect.avro.AvroConverter\",\n    \"value.converter.schema.registry.url\": \"http://localhost:8081\",\n    \"transforms\": \"mask\",\n    \"transforms.mask.type\": \"org.apache.kafka.connect.transforms.MaskField$Value\",\n    \"transforms.mask.fields\": \"ssn\"\n  }}'" }
      ],
      solutionNotes: `<p>Distributed Connect is managed entirely through the <strong>REST API</strong>; there are no per-worker properties files for connectors. The cluster stores connector <strong>configs, offsets, and status in internal Kafka topics</strong>, so any worker can pick up a task if another dies. <strong>Converters</strong> (AvroConverter + Schema Registry) handle serialization, while <strong>SMTs</strong> (MaskField, RegexRouter) do lightweight per-record transformation in the pipeline.</p>`
    },
    {
      id: "kk-ex-10",
      section: "k4",
      title: "Make a sink connector skip bad records into a DLQ",
      level: "medium",
      where: "Terminal (Connect REST API)",
      task: `<p>A sink connector keeps dying on the occasional malformed record. Reconfigure it to <strong>tolerate</strong> bad records, route them to a <strong>dead-letter queue</strong> topic with error context, and keep processing the good ones — without losing evidence of what failed.</p>`,
      given: [
        { label: "Current behavior", code: "one bad record → task FAILED → pipeline stops" }
      ],
      steps: [
        "Set errors.tolerance=all so bad records don't kill the task",
        "Set errors.deadletterqueue.topic.name to a DLQ topic",
        "Enable errors.deadletterqueue.context.headers.enable=true for the failure reason",
        "Keep errors.log.enable=true to also log the errors"
      ],
      solution: [
        { label: "Error-handling config", code: "\"errors.tolerance\": \"all\",\n\"errors.deadletterqueue.topic.name\": \"orders-sink-dlq\",\n\"errors.deadletterqueue.topic.replication.factor\": \"3\",\n\"errors.deadletterqueue.context.headers.enable\": \"true\",\n\"errors.log.enable\": \"true\",\n\"errors.log.include.messages\": \"true\"" }
      ],
      solutionNotes: `<p><code>errors.tolerance=all</code> lets the task skip records that fail conversion/transformation instead of dying. Pointing <code>errors.deadletterqueue.topic.name</code> at a DLQ preserves each bad record — and with <code>context.headers.enable=true</code>, the failure reason travels in the record headers so you can triage later. The good records keep flowing, so one poison record no longer halts the pipeline.</p>`
    },
    {
      id: "kk-ex-11",
      section: "k5",
      title: "Test a Streams topology with TopologyTestDriver",
      level: "medium",
      where: "IDE (JUnit + TopologyTestDriver)",
      task: `<p>Write a synchronous unit test for the word-count topology (ex-07) using <strong>TopologyTestDriver</strong> — no running broker. Pipe input records in, read output records out, and assert the counts. Note one class of risk this test can <em>not</em> cover.</p>`,
      given: [
        { label: "Under test", code: "the word-count Topology from kk-ex-07" }
      ],
      steps: [
        "Build the Topology and wrap it in a TopologyTestDriver with test props",
        "Create input/output test topics with the right serdes",
        "pipeInput words, then readValue() from the output topic",
        "Assert running counts; remember TTD can't catch real broker/serde/network issues"
      ],
      solution: [
        { label: "Test", code: "var driver = new TopologyTestDriver(topology, props);\nvar in  = driver.createInputTopic(\"text-input\",\n            new StringSerializer(), new StringSerializer());\nvar out = driver.createOutputTopic(\"word-counts\",\n            new StringDeserializer(), new LongDeserializer());\n\nin.pipeInput(\"kafka streams kafka\");\nassertEquals(2L, out.readKeyValue().value);   // 'kafka' → 1 then 2 ...\n// TTD is in-memory + synchronous: fast and deterministic,\n// but does NOT exercise real brokers, network, or rebalances." }
      ],
      solutionNotes: `<p><strong>TopologyTestDriver</strong> runs a topology in-memory and synchronously, so tests are fast and deterministic — ideal for asserting transformation and windowing logic. What it <em>can't</em> catch are integration risks: real broker behavior, serializer/Schema-Registry wiring, consumer rebalances, and end-to-end delivery. Those need an integration test against an embedded or real cluster.</p>`
    },
    {
      id: "kk-ex-12",
      section: "k6",
      title: "Diagnose consumer lag from the CLI",
      level: "medium",
      where: "Terminal (kafka-consumer-groups)",
      task: `<p>A downstream team reports stale data. Use <code>kafka-consumer-groups</code> to read the group's <strong>current offset</strong>, <strong>log-end offset</strong>, and <strong>lag per partition</strong>, then interpret two patterns: lag growing on <em>one</em> partition only, versus lag growing on <em>all</em> partitions during business hours.</p>`,
      given: [
        { label: "Group", code: "consumer group 'billing-app' on topic 'payments' (12 partitions)" }
      ],
      steps: [
        "Run --describe --group billing-app and read CURRENT-OFFSET, LOG-END-OFFSET, LAG",
        "lag = log-end-offset − current-offset per partition",
        "Lag on ONE partition → a hot key / skew or one stuck consumer/slow record",
        "Lag on ALL partitions in business hours → the group is under-provisioned for peak"
      ],
      solution: [
        { label: "Describe + read lag", code: "kafka-consumer-groups --bootstrap-server localhost:9092 \\\n  --describe --group billing-app\n\n# TOPIC     PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG  CONSUMER-ID\n# payments  0          1000            1000            0    consumer-1\n# payments  7          8400            50120           41720 consumer-3   ← hot\n# ...\n# lag = LOG-END-OFFSET - CURRENT-OFFSET" }
      ],
      solutionNotes: `<p><strong>Consumer lag</strong> is how far behind the head of the log a group is: <code>log-end-offset − current-offset</code>, per partition. Lag isolated to <strong>one</strong> partition points at data skew (a hot key) or a single stuck/slow consumer. Lag rising across <strong>all</strong> partitions at peak means the group can't keep up — add consumers (up to the partition count) or speed up processing. Lag is the number-one health signal for a consumer.</p>`
    }
  ]
};
