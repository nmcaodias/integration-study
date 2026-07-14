// Confluent Certified Developer for Apache Kafka (CCDAK) — study notes, sections 4–6
window.CERT_DATA.ccdak.sections.push(
  {
    id: "k4",
    title: "Kafka Connect",
    weight: 15,
    topicDocs: {
      "What Connect is and when to use it": "https://docs.confluent.io/platform/current/connect/index.html",
      "Workers: standalone vs distributed": "https://docs.confluent.io/platform/current/connect/index.html",
      "Connectors, tasks, and scaling": "https://developer.confluent.io/courses/kafka-connect/intro/",
      "Converters and Schema Registry": "https://docs.confluent.io/platform/current/connect/index.html",
      "Single Message Transforms (SMTs)": "https://docs.confluent.io/platform/current/connect/transforms/overview.html",
      "Error handling and dead letter queues": "https://docs.confluent.io/platform/current/connect/index.html",
      "Change Data Capture (CDC)": "https://developer.confluent.io/courses/kafka-connect/intro/"
    },
    objectives: [
      "Explain Kafka Connect's purpose: source and sink integration without custom code",
      "Compare standalone and distributed worker deployments",
      "Configure connectors and scale them with tasks",
      "Choose converters and integrate Schema Registry",
      "Apply Single Message Transforms",
      "Configure error tolerance and dead letter queues",
      "Describe CDC (change data capture) with source connectors"
    ],
    notes: `
<h3>What Connect is and when to use it</h3>
<svg viewBox="0 0 660 170" style="max-width:660px;width:100%" role="img" aria-label="Kafka Connect pipeline">
  <style>.kc-b{fill:none;stroke:currentColor;stroke-width:1.5}.kc-t{font:600 13px sans-serif;fill:currentColor}.kc-s{font:11px sans-serif;fill:currentColor;opacity:.75}.kc-a{stroke:currentColor;stroke-width:1.4;marker-end:url(#kcArr)}</style>
  <defs><marker id="kcArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <rect x="8" y="55" width="110" height="60" rx="8" class="kc-b"/><text x="24" y="82" class="kc-t">Database</text><text x="24" y="100" class="kc-s">(external system)</text>
  <rect x="158" y="45" width="130" height="80" rx="8" class="kc-b" style="fill:rgba(14,111,190,.10)"/><text x="172" y="75" class="kc-t">Source</text><text x="172" y="92" class="kc-t">connector</text><text x="172" y="110" class="kc-s">Connect worker</text>
  <rect x="328" y="35" width="120" height="100" rx="8" class="kc-b" style="fill:rgba(30,142,78,.10)"/><text x="352" y="80" class="kc-t">Kafka</text><text x="344" y="98" class="kc-s">topics</text>
  <rect x="488" y="45" width="120" height="80" rx="8" class="kc-b" style="fill:rgba(14,111,190,.10)"/><text x="502" y="75" class="kc-t">Sink</text><text x="502" y="92" class="kc-t">connector</text><text x="502" y="110" class="kc-s">Connect worker</text>
  <line x1="120" y1="85" x2="154" y2="85" class="kc-a"/><line x1="290" y1="85" x2="324" y2="85" class="kc-a"/><line x1="450" y1="85" x2="484" y2="85" class="kc-a"/>
  <text x="614" y="80" class="kc-s">→ S3,</text><text x="614" y="94" class="kc-s">Elastic,</text><text x="614" y="108" class="kc-s">DB…</text>
</svg>
<ul>
<li>Kafka Connect is the framework for <strong>configuration-driven integration</strong> between Kafka and external systems: <strong>source connectors</strong> pull data INTO Kafka; <strong>sink connectors</strong> push data OUT of Kafka. No custom producer/consumer code — you deploy a connector plugin and give it a JSON/properties config.</li>
<li>Connect handles the hard parts for you: offset tracking (where the source left off / what the sink has written), scaling, fault tolerance, retries, schemas, and transformation hooks. Prefer it over hand-written glue code whenever a connector exists.</li>
</ul>

<h3>Workers: standalone vs distributed</h3>
<table>
<tr><th></th><th>Standalone</th><th>Distributed</th></tr>
<tr><td>Processes</td><td>One worker process</td><td>Cluster of workers sharing a <code>group.id</code></td></tr>
<tr><td>Config/offsets stored</td><td>Local files</td><td>Internal Kafka topics (config, offsets, status)</td></tr>
<tr><td>Fault tolerance / scaling</td><td>None — the process IS the system</td><td>Work is rebalanced across workers; add workers to scale</td></tr>
<tr><td>Management</td><td>Properties file at startup</td><td><strong>REST API</strong> (create/pause/resume/delete connectors, view status)</td></tr>
<tr><td>Use</td><td>Dev, testing, one-off local jobs</td><td>Anything production</td></tr>
</table>

<h3>Connectors, tasks, and scaling</h3>
<ul>
<li>A <strong>connector</strong> instance is the logical job (e.g. "this database → these topics"); it divides work into <strong>tasks</strong> — the actual units that copy data, spread across workers.</li>
<li><code>tasks.max</code> caps parallelism; the effective task count also depends on the source's dividable units (e.g. number of tables, or a JDBC source may cap at one task) and, for sinks, the topic's partitions.</li>
<li>Failed tasks can be restarted via the REST API (<code>/connectors/&lt;name&gt;/status</code>, <code>/restart</code>).</li>
</ul>

<h3>Converters and Schema Registry</h3>
<ul>
<li><strong>Converters</strong> translate between Connect's internal data representation and the bytes in Kafka: <code>key.converter</code> / <code>value.converter</code> set per worker or per connector. Common: <code>AvroConverter</code>, <code>ProtobufConverter</code>, <code>JsonSchemaConverter</code> (all with <code>...converter.schema.registry.url</code>), plain <code>JsonConverter</code> (optionally with embedded schemas), <code>StringConverter</code>.</li>
<li>Converters are chosen INDEPENDENTLY of the connector — the same JDBC source can write Avro or JSON depending on converter config. Mismatched converters between producer side and consumer side are the classic "deserialization garbage" root cause.</li>
</ul>

<h3>Single Message Transforms (SMTs)</h3>
<ul>
<li>Lightweight, per-record transformations applied in the connector pipeline (source: before writing to Kafka; sink: before writing to the target): rename/mask/insert fields, route records to different topics, cast types, extract keys, filter records.</li>
<li>Configured as a chain: <code>transforms=mask,route</code> with per-transform classes/settings. For anything heavier (joins, aggregations, lookups) use a stream processor (Kafka Streams) between source and sink instead of stretching SMTs.</li>
</ul>

<h3>Error handling and dead letter queues</h3>
<ul>
<li><code>errors.tolerance=none</code> (default — task fails on a bad record) vs <code>all</code> (skip and continue).</li>
<li><strong>Sink connectors</strong> can route failed records to a <strong>dead letter queue topic</strong>: <code>errors.deadletterqueue.topic.name</code> (+ <code>context.headers.enable</code> to attach failure reasons as headers). DLQs apply to sinks, not sources.</li>
<li><code>errors.retry.timeout</code> enables retries of transient failures before tolerance/DLQ handling kicks in.</li>
</ul>

<h3>Change Data Capture (CDC)</h3>
<ul>
<li>CDC source connectors (e.g. <strong>Debezium</strong>) read a database's <strong>transaction log</strong> (not query polling) and publish every row-level INSERT/UPDATE/DELETE as an event — low latency, no load on tables, captures deletes.</li>
<li>Contrast with JDBC source polling (periodic SELECTs with an incrementing/timestamp column): simpler, but misses deletes, adds DB load, and has poll-interval latency.</li>
<li>CDC events conventionally carry before/after images; deletes are followed by tombstones for compacted topics — pairing naturally with KTable-style consumption.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> distributed workers store config/offsets/status in internal Kafka topics and are managed over REST — standalone uses local files; that contrast is heavily tested. So are: tasks as the unit of parallelism (tasks.max), converters being independent of connectors, DLQs being a SINK feature, and log-based CDC vs polling trade-offs.</p>`
  },
  {
    id: "k5",
    title: "Application Testing",
    weight: 8,
    topicDocs: {
      "Unit testing producers and consumers": "https://kafka.apache.org/documentation/",
      "Testing Kafka Streams topologies": "https://docs.confluent.io/platform/current/streams/developer-guide/test-streams.html",
      "Integration testing with real brokers": "https://docs.confluent.io/platform/current/streams/developer-guide/test-streams.html",
      "Testing schema evolution": "https://docs.confluent.io/platform/current/schema-registry/fundamentals/avro.html"
    },
    objectives: [
      "Unit test producer and consumer logic with mocks",
      "Test Kafka Streams topologies with TopologyTestDriver",
      "Design integration tests against real (containerized/embedded) brokers",
      "Test schema compatibility before deployment"
    ],
    notes: `
<h3>Unit testing producers and consumers</h3>
<ul>
<li>The Kafka clients library ships test doubles: <strong>MockProducer</strong> and <strong>MockConsumer</strong> — no broker needed.</li>
<li><strong>MockProducer</strong> records everything your code sends (<code>history()</code>) and can simulate success or failure of sends (<code>errorNext(exception)</code>) — assert what was produced, to which topic/partition, with which key, and that callbacks/error paths behave.</li>
<li><strong>MockConsumer</strong> lets tests seed assigned partitions, records, and end offsets, then verifies the poll-loop logic: processing, commit behavior, rebalance listener handling.</li>
<li>Structure application code so the Kafka client is injected — logic classes take a <code>Producer&lt;K,V&gt;</code>/<code>Consumer&lt;K,V&gt;</code> interface, tests pass the mock, production passes the real client.</li>
</ul>

<h3>Testing Kafka Streams topologies</h3>
<pre><code>TopologyTestDriver driver = new TopologyTestDriver(builder.build(), props);
TestInputTopic&lt;String, Order&gt; in =
    driver.createInputTopic("orders", stringSerde.serializer(), orderSerde.serializer());
TestOutputTopic&lt;String, Long&gt; out =
    driver.createOutputTopic("order-counts", stringSerde.deserializer(), longSerde.deserializer());

in.pipeInput("cust-1", order1);
in.pipeInput("cust-1", order2);
assertEquals(2L, out.readKeyValue().value);   // synchronous, deterministic</code></pre>
<ul>
<li><strong>TopologyTestDriver</strong> executes the topology <em>synchronously without any broker</em>: pipe records into <strong>TestInputTopic</strong>s, read results from <strong>TestOutputTopic</strong>s, and query state stores directly (<code>driver.getKeyValueStore(...)</code>).</li>
<li>It controls <strong>time explicitly</strong> — advance wall-clock/event time to test windowing, grace periods, and suppression deterministically (no sleeps, no flakiness).</li>
</ul>

<h3>Integration testing with real brokers</h3>
<ul>
<li>Unit tests can't cover: real serialization against a Schema Registry, security handshakes, rebalancing behavior, transactions, connector configs. For those, run a REAL Kafka in the test: <strong>Testcontainers</strong> (Kafka container per test class — today's standard), embedded Kafka utilities, or a shared test cluster.</li>
<li>Keep them separate from unit tests (slower, resource-heavy); make topics unique per run; assert with consumers polling until a timeout rather than fixed sleeps.</li>
<li>Test failure modes deliberately: kill the container to observe retry/idempotence behavior; produce poison records to verify DLQ paths.</li>
</ul>

<h3>Testing schema evolution</h3>
<ul>
<li>Before deploying a producer with a changed schema, verify compatibility against the registry: the Schema Registry <strong>compatibility check REST endpoint</strong> (or Maven plugin <code>schema-registry:test-compatibility</code>) validates a candidate schema against the subject's configured mode (BACKWARD/FORWARD/FULL) — wire this into CI so incompatible changes fail the build, not production consumers.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> map tool to layer — MockProducer/MockConsumer for client logic, <strong>TopologyTestDriver</strong> (with TestInputTopic/TestOutputTopic) for Streams topologies without a broker, Testcontainers/embedded Kafka for integration concerns, and registry compatibility checks in CI for schema changes. TopologyTestDriver's deterministic time control for window testing is a favorite question.</p>`
  },
  {
    id: "k6",
    title: "Application Observability",
    weight: 13,
    topicDocs: {
      "Client metrics via JMX": "https://docs.confluent.io/platform/current/kafka/monitoring.html",
      "Consumer lag — the number-one signal": "https://docs.confluent.io/platform/current/kafka/monitoring.html",
      "Producer health metrics": "https://docs.confluent.io/platform/current/kafka/monitoring.html",
      "Logging, tracing, and interceptors": "https://docs.confluent.io/platform/current/kafka/monitoring.html",
      "Troubleshooting common scenarios": "https://docs.confluent.io/platform/current/clients/consumer.html"
    },
    objectives: [
      "Expose and collect client metrics (JMX) for producers, consumers, and Streams",
      "Monitor consumer lag and alert on it",
      "Track producer health: errors, retries, latency, throughput",
      "Use logging, tracing, and interceptors for end-to-end visibility",
      "Troubleshoot common client-side problems from metrics"
    ],
    notes: `
<h3>Client metrics via JMX</h3>
<ul>
<li>All Kafka clients (producer, consumer, Streams, Connect) expose metrics through <strong>JMX MBeans</strong>; scrape them with your monitoring stack (Prometheus JMX exporter, etc.). Metrics exist per client, per topic, and per node.</li>
<li>Kafka Streams adds thread/task/processor/state-store metrics (<code>metrics.recording.level</code> controls granularity); Connect exposes connector/task status and throughput metrics.</li>
<li>Watch BOTH sides: client metrics tell you how YOUR app behaves; broker-side metrics (under-replicated partitions, request handler idle %) tell you about the cluster — a developer is expected to read the client side fluently.</li>
</ul>

<h3>Consumer lag — the number-one signal</h3>
<ul>
<li><strong>Lag = log end offset − committed/current offset</strong>, per partition: how far behind the consumer is. Growing lag means the app can't keep up (or stopped).</li>
<li>Sources: consumer metric <code>records-lag-max</code>, <code>kafka-consumer-groups.sh --describe --group app</code> (shows CURRENT-OFFSET, LOG-END-OFFSET, LAG per partition), and external lag exporters (e.g. Burrow) for fleet-wide monitoring.</li>
<li>Alert on <em>sustained growth</em>, not momentary spikes. Remedies: faster processing (batch/parallelize the work), more consumers (up to partition count), more partitions (planned!), or tuning <code>max.poll.records</code>/processing pipeline.</li>
<li>Also watch <strong>rebalance metrics</strong> (rebalance rate, time-between-poll) — frequent rebalances often masquerade as lag problems.</li>
</ul>

<h3>Producer health metrics</h3>
<table>
<tr><th>Metric</th><th>What it tells you</th></tr>
<tr><td><code>record-error-rate</code></td><td>Sends that ultimately FAILED (post-retries) — should be ~0; alert otherwise</td></tr>
<tr><td><code>record-retry-rate</code></td><td>Transient trouble being retried — early warning of cluster/network issues</td></tr>
<tr><td><code>request-latency-avg/max</code></td><td>Broker round-trip time — rising latency precedes buffer exhaustion</td></tr>
<tr><td><code>batch-size-avg</code>, <code>records-per-request-avg</code>, <code>compression-rate-avg</code></td><td>Batching efficiency — small batches = tune linger.ms/batch.size</td></tr>
<tr><td><code>buffer-available-bytes</code> / <code>bufferpool-wait-time</code></td><td>buffer.memory pressure — send() will start blocking (max.block.ms) when exhausted</td></tr>
</table>

<h3>Logging, tracing, and interceptors</h3>
<ul>
<li>Client logs (log4j/slf4j) surface warnings you should not ignore: rebalances, disconnections, expired transactions, slow commits.</li>
<li><strong>Message headers</strong> carry correlation/trace IDs across the pipeline; standard practice is W3C/OpenTelemetry trace context propagated producer → consumer so one business transaction is traceable end to end.</li>
<li><strong>Interceptors</strong> (<code>ProducerInterceptor</code> / <code>ConsumerInterceptor</code>) hook onSend/onConsume for cross-cutting telemetry (count, tag, trace) without touching business code — this is how Confluent Monitoring interceptors work.</li>
<li>End-to-end latency = event timestamp vs processing time at the consumer — measure it; per-hop metrics alone hide pipeline delays.</li>
</ul>

<h3>Troubleshooting common scenarios</h3>
<table>
<tr><th>Symptom</th><th>Likely cause → check</th></tr>
<tr><td>Lag grows on ALL partitions</td><td>Processing too slow overall → processing time per record, thread pool, downstream calls</td></tr>
<tr><td>Lag grows on ONE partition</td><td>Hot key/skewed partitioning, or one stuck consumer → key distribution, that consumer's logs</td></tr>
<tr><td>Consumer keeps leaving the group</td><td>poll() gaps exceed <code>max.poll.interval.ms</code> → reduce max.poll.records or speed up processing</td></tr>
<tr><td>Duplicates downstream</td><td>At-least-once + rebalances/crashes between processing and commit → idempotent handling or EOS/transactions</td></tr>
<tr><td>Producer TimeoutException, buffer full</td><td>Cluster slow/unreachable or produce rate &gt; capacity → request latency, cluster health, buffer.memory</td></tr>
<tr><td>Consumer gets garbage / DeserializationException</td><td>Serializer/converter mismatch or schema change → producer serializer vs consumer deserializer, registry compatibility</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> consumer LAG is the metric the exam cares most about — know its definition, where to read it (metrics + kafka-consumer-groups.sh --describe), and the remediation options. Producer-side, record-error-rate vs record-retry-rate (failed vs retried) is the classic pair. And every "consumer evicted from group" scenario resolves to max.poll.interval.ms.</p>`
  }
);
