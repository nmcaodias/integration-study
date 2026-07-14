// Confluent Certified Developer for Apache Kafka (CCDAK) — study notes, sections 1–3
window.CERT_DATA = window.CERT_DATA || {};
window.CERT_DATA.ccdak = {
  id: "ccdak",
  name: "Confluent Certified Developer for Apache Kafka",
  short: "CCDAK",
  exam: { questions: 60, minutes: 90, passPct: 70 },
  questions: [],
  sections: [
    {
      id: "k1",
      title: "Apache Kafka Fundamentals",
      weight: 23,
      topicDocs: {
        "Topics, partitions, and offsets": "https://kafka.apache.org/documentation/#intro_concepts_and_terms",
        "Brokers, replication, and the ISR": "https://kafka.apache.org/documentation/#replication",
        "Message keys and partition assignment": "https://docs.confluent.io/platform/current/clients/producer.html",
        "Consumer groups": "https://docs.confluent.io/platform/current/clients/consumer.html",
        "Retention and log compaction": "https://kafka.apache.org/documentation/#compaction",
        "Delivery semantics": "https://docs.confluent.io/kafka/design/delivery-semantics.html",
        "Kafka security basics": "https://docs.confluent.io/platform/current/security/overview.html",
        "KRaft and the control plane": "https://kafka.apache.org/documentation/#kraft"
      },
      objectives: [
        "Explain Kafka's data model: topics, partitions, offsets, and ordering",
        "Describe brokers, replication, leaders/followers, and the ISR",
        "Explain message keys, key hashing, and partition assignment",
        "Describe consumer groups and how partitions are distributed",
        "Explain data retention and log compaction",
        "Compare delivery semantics: at-most-once, at-least-once, exactly-once",
        "Describe Kafka security fundamentals (encryption, authentication, authorization)"
      ],
      notes: `
<h3>Topics, partitions, and offsets</h3>
<figure><img src="images/kafka-log-anatomy.png" alt="A topic split into three partitions, each an ordered append-only log with sequential offsets; writes append to the end"><figcaption>A topic is a set of partitions; each partition is an ordered, append-only log with sequential offsets <em>(source: kafka.apache.org)</em></figcaption></figure>
<ul>
<li>A <strong>topic</strong> is a named stream of records, split into <strong>partitions</strong>. Each partition is an <em>ordered, immutable, append-only log</em>; each record in it gets a sequential <strong>offset</strong>.</li>
<li><strong>Ordering is guaranteed only WITHIN a partition</strong> — never across partitions of a topic. If a use case needs total order for a set of records (e.g. all events of one customer), those records must share a partition (⇒ same key).</li>
<li>Consumers track their position as <em>the next offset to read</em> per partition; reading does NOT remove data (Kafka is a log, not a queue) — many independent consumer groups read the same data.</li>
<li>Partition count = the topic's <strong>maximum parallelism</strong> for a consumer group. Partitions can be <em>added</em> later (breaks key→partition mapping for existing keys!) but never removed.</li>
<li>Records are key/value pairs plus a timestamp and optional <strong>headers</strong> (metadata for tracing, routing, schema hints — not used for partitioning).</li>
</ul>

<h3>Brokers, replication, and the ISR</h3>
<ul>
<li>A cluster is a set of <strong>brokers</strong>; each partition lives on brokers as one <strong>leader</strong> replica plus <code>replication.factor − 1</code> <strong>follower</strong> replicas. All produce/consume traffic goes through the <strong>leader</strong> (followers replicate by fetching).</li>
<li>The <strong>ISR (in-sync replicas)</strong> is the set of replicas fully caught up with the leader. On leader failure, a new leader is elected <em>from the ISR</em> — no data loss if the ISR had the data.</li>
<li><code>min.insync.replicas</code> (broker/topic config): the minimum ISR size for writes with <code>acks=all</code> to succeed. The classic durable setup: <strong>RF=3, min.insync.replicas=2, acks=all</strong> — tolerates one broker down while never acknowledging a write held by fewer than 2 replicas; producers get <code>NotEnoughReplicasException</code> if the ISR shrinks below 2.</li>
<li><strong>Unclean leader election</strong> (electing a non-ISR replica) trades data loss for availability; it is disabled by default.</li>
</ul>

<h3>Message keys and partition assignment</h3>
<ul>
<li>Producer partitioning: <strong>key present</strong> → <code>partition = murmur2(key) % numPartitions</code> — the same key ALWAYS lands on the same partition (ordering per key). <strong>Key = null</strong> → sticky partitioning: the producer fills a batch to one random partition, then switches (efficient round-robin-ish distribution).</li>
<li>A producer can also set the partition explicitly or plug a custom <code>Partitioner</code>.</li>
<li>Design consequence: choose keys with enough <strong>cardinality</strong> to spread load; a low-cardinality key (e.g. country) creates hot partitions. Changing partition count remaps keys — plan partitions up front for keyed topics.</li>
</ul>

<h3>Consumer groups</h3>
<figure><img src="images/kafka-consumer-groups.png" alt="A four-partition topic consumed by group A (two consumers, two partitions each) and group B (four consumers, one partition each)"><figcaption>Each group divides the partitions among its members; every group gets all the data <em>(source: kafka.apache.org)</em></figcaption></figure>
<ul>
<li>Consumers with the same <code>group.id</code> form a <strong>consumer group</strong>: each partition is assigned to <strong>exactly one consumer in the group</strong>. More consumers than partitions ⇒ the extras sit <strong>idle</strong>.</li>
<li>Different groups are independent — each receives every record (pub-sub across groups, queue-like within a group).</li>
<li>Group membership is coordinated by a broker acting as <strong>group coordinator</strong>; consumers heartbeat, and joins/leaves/failures trigger a <strong>rebalance</strong> (partition reassignment). Committed offsets are stored in the internal <code>__consumer_offsets</code> topic.</li>
</ul>

<h3>Retention and log compaction</h3>
<table>
<tr><th>Cleanup policy</th><th>Behavior</th><th>Use case</th></tr>
<tr><td><code>delete</code> (default)</td><td>Segments older than <code>retention.ms</code> (default 7 days) or beyond <code>retention.bytes</code> are deleted — regardless of consumption</td><td>Event streams, telemetry</td></tr>
<tr><td><code>compact</code></td><td>Keeps <strong>at least the latest record per key</strong>; older values for the same key are eventually removed; a <code>null</code> value ("tombstone") deletes the key</td><td>Changelogs, table-like state (latest value per entity)</td></tr>
<tr><td><code>compact,delete</code></td><td>Both: compaction plus time/size-based expiry</td><td>Bounded changelogs</td></tr>
</table>
<p>Retention is per topic; consumers must keep up or re-read from what still exists (<code>auto.offset.reset</code> decides where a group starts with no valid offset: <code>earliest</code> or <code>latest</code>).</p>

<h3>Delivery semantics</h3>
<table>
<tr><th>Semantics</th><th>How it happens</th><th>Cost</th></tr>
<tr><td>At-most-once</td><td>Commit/ack BEFORE processing (or producer with acks=0) — failures lose data, never duplicate</td><td>Data loss possible</td></tr>
<tr><td>At-least-once</td><td>Process THEN commit; producer retries — failures re-deliver</td><td>Duplicates possible ⇒ consumers should be idempotent</td></tr>
<tr><td>Exactly-once</td><td>Idempotent producer + <strong>transactions</strong> (Kafka-to-Kafka), consumer <code>isolation.level=read_committed</code></td><td>Some latency/throughput overhead; EOS applies to Kafka↔Kafka pipelines (external sinks still need idempotency)</td></tr>
</table>

<h3>Kafka security basics</h3>
<ul>
<li><strong>Encryption in transit:</strong> TLS between clients and brokers (and inter-broker); listeners defined per protocol (PLAINTEXT, SSL, SASL_SSL…).</li>
<li><strong>Authentication:</strong> SASL mechanisms — <code>PLAIN</code> (username/password, over TLS!), <code>SCRAM-SHA-256/512</code>, <code>GSSAPI</code> (Kerberos), <code>OAUTHBEARER</code> — or mutual TLS (client certificates).</li>
<li><strong>Authorization:</strong> <strong>ACLs</strong> per principal on resources (topic, group, cluster) and operations (Read, Write, Create…). A typical client needs Read on the topic + Read on its consumer group, or Write on the topic to produce.</li>
<li>Clients configure this with <code>security.protocol</code>, <code>sasl.mechanism</code>, <code>sasl.jaas.config</code>, plus truststore/keystore settings.</li>
</ul>

<h3>KRaft and the control plane</h3>
<p>Kafka's metadata (topics, partitions, leaders, configs) was historically coordinated by <strong>ZooKeeper</strong>; modern Kafka uses <strong>KRaft</strong> — brokers/controllers run the Raft consensus protocol internally, removing ZooKeeper entirely (default since Kafka 4.0). For a developer the client APIs are unchanged; know that cluster metadata and controller election are internal (a <em>controller quorum</em>) and that administration happens via the <strong>Admin API</strong>/CLI tools.</p>
<p class="tip"><strong>Exam tip:</strong> the most-tested fundamentals: ordering only within a partition; same key → same partition; consumers &gt; partitions ⇒ idle consumers; RF=3 + min.insync.replicas=2 + acks=all tolerates exactly one broker loss; compaction keeps the latest value per key (tombstones delete). Memorize these cold.</p>`
    },
    {
      id: "k2",
      title: "Apache Kafka Application Development",
      weight: 28,
      topicDocs: {
        "The producer: send path and key configs": "https://docs.confluent.io/platform/current/clients/producer.html",
        "Idempotence and transactions (EOS)": "https://docs.confluent.io/kafka/design/delivery-semantics.html",
        "The consumer: poll loop, commits, rebalancing": "https://docs.confluent.io/platform/current/clients/consumer.html",
        "Serialization and Schema Registry": "https://docs.confluent.io/platform/current/schema-registry/fundamentals/avro.html",
        "Error handling: retriable vs non-retriable": "https://docs.confluent.io/platform/current/clients/producer.html",
        "Admin API and CLI tools": "https://kafka.apache.org/documentation/#adminapi",
        "Compression and batching": "https://kafka.apache.org/documentation/#producerconfigs"
      },
      objectives: [
        "Configure and tune producers (acks, batching, retries, idempotence)",
        "Implement exactly-once semantics with idempotent producers and transactions",
        "Configure and tune consumers (poll loop, offset commits, rebalancing)",
        "Use serializers/deserializers and Schema Registry with Avro/JSON/Protobuf",
        "Handle retriable and non-retriable errors in clients",
        "Use the Admin API and command-line tools",
        "Apply compression and batching for throughput"
      ],
      notes: `
<h3>The producer: send path and key configs</h3>
<p><code>send()</code> is asynchronous: records go through the (key/value) <strong>serializer</strong> → <strong>partitioner</strong> → an in-memory <strong>batch per partition</strong> (<code>buffer.memory</code>), and a background I/O thread ships batches. A callback (or the returned Future) reports success (RecordMetadata) or failure.</p>
<table>
<tr><th>Config</th><th>Meaning</th></tr>
<tr><td><code>acks</code></td><td><code>0</code> = fire-and-forget; <code>1</code> = leader has written it; <code>all</code> = all in-sync replicas have it (durable; pair with min.insync.replicas)</td></tr>
<tr><td><code>retries</code> / <code>delivery.timeout.ms</code></td><td>Automatic retry of transient failures; delivery.timeout.ms bounds the whole attempt</td></tr>
<tr><td><code>enable.idempotence</code></td><td>Broker de-duplicates producer retries (sequence numbers) — no duplicates from retries, per-partition ordering preserved; default true in modern clients</td></tr>
<tr><td><code>max.in.flight.requests.per.connection</code></td><td>Concurrent unacked requests; with idempotence ≤5 ordering is still guaranteed</td></tr>
<tr><td><code>linger.ms</code> / <code>batch.size</code></td><td>Wait up to linger.ms to fill batches up to batch.size — the main throughput/latency trade-off knobs</td></tr>
<tr><td><code>compression.type</code></td><td>none / gzip / snappy / lz4 / zstd — compresses whole batches</td></tr>
</table>

<h3>Idempotence and transactions (EOS)</h3>
<ul>
<li><strong>Idempotent producer</strong> = no duplicates <em>from retries</em> on one producer session. It does NOT dedupe application-level re-sends.</li>
<li><strong>Transactions</strong>: set a stable <code>transactional.id</code>, then <code>initTransactions() → beginTransaction() → send(...) + sendOffsetsToTransaction(...) → commitTransaction()</code>. Enables atomic <em>consume-transform-produce</em>: output records and consumed-offset commits succeed or abort together.</li>
<li>Downstream consumers must set <code>isolation.level=read_committed</code> to skip aborted records (default is read_uncommitted).</li>
<li>Exactly-once applies Kafka-to-Kafka; writing to an external DB still needs idempotent writes or its own transaction coordination.</li>
</ul>

<h3>The consumer: poll loop, commits, rebalancing</h3>
<pre><code>while (true) {
  ConsumerRecords&lt;K,V&gt; records = consumer.poll(Duration.ofMillis(250));
  for (ConsumerRecord&lt;K,V&gt; rec : records) process(rec);
  consumer.commitSync();          // manual at-least-once
}</code></pre>
<ul>
<li><strong>Offset commits:</strong> <code>enable.auto.commit=true</code> commits every <code>auto.commit.interval.ms</code> during poll (risk: commits records not yet processed → possible loss on crash). Manual <code>commitSync()</code> (blocking, retried) or <code>commitAsync()</code> (fast, no retry) AFTER processing gives at-least-once.</li>
<li><strong>Liveness:</strong> heartbeats (background thread) within <code>session.timeout.ms</code> keep membership; <code>max.poll.interval.ms</code> caps time between polls — exceed it (slow processing) and the group evicts the consumer, causing a rebalance. Tune it, or lower <code>max.poll.records</code>.</li>
<li><strong>Rebalancing:</strong> assignment strategies include range, round-robin, sticky, and <strong>cooperative-sticky</strong> (incremental — only moved partitions stop, no global stop-the-world). A <code>ConsumerRebalanceListener</code> lets you commit/cleanup on revocation.</li>
<li><code>auto.offset.reset</code> (earliest/latest/none) applies only when the group has NO valid committed offset.</li>
<li>Consumers are <strong>not thread-safe</strong> — one consumer per thread; scale by adding consumers (up to partition count).</li>
</ul>

<h3>Serialization and Schema Registry</h3>
<ul>
<li>Producers serialize keys/values to bytes; consumers must deserialize with a compatible scheme. Common formats: <strong>Avro</strong>, <strong>JSON Schema</strong>, <strong>Protobuf</strong> (all supported by Confluent SerDes) — plus primitives (String, Long…).</li>
<li><strong>Schema Registry</strong> stores versioned schemas per <strong>subject</strong> (default: <code>&lt;topic&gt;-key</code> / <code>&lt;topic&gt;-value</code>); the wire format is a magic byte + <strong>schema ID</strong> + payload — consumers fetch schemas by ID and cache them.</li>
<li><strong>Compatibility modes</strong> govern schema evolution:</li>
</ul>
<table>
<tr><th>Mode</th><th>New schema can be used to read…</th><th>Safe changes</th><th>Upgrade order</th></tr>
<tr><td>BACKWARD (default)</td><td>data written with the previous schema</td><td>delete fields, add optional fields (with defaults)</td><td>Consumers first</td></tr>
<tr><td>FORWARD</td><td>old schema reads data written with the new one</td><td>add fields, delete optional fields</td><td>Producers first</td></tr>
<tr><td>FULL</td><td>both directions</td><td>only add/remove optional fields with defaults</td><td>Any order</td></tr>
</table>
<p>*_TRANSITIVE variants check against ALL previous versions, not just the latest.</p>

<h3>Error handling: retriable vs non-retriable</h3>
<table>
<tr><th>Retriable (client retries automatically)</th><th>Non-retriable (fix required)</th></tr>
<tr><td>LeaderNotAvailable / NotLeaderForPartition, NetworkException, NotEnoughReplicas, timeouts — transient cluster events</td><td>SerializationException, RecordTooLargeException (&gt; max.request.size / message.max.bytes), AuthorizationException, InvalidTopicException</td></tr>
</table>
<p>Producer: rely on retries + idempotence for the left column; catch and handle (log/DLQ/alert) the right. Consumer: a poison record that fails deserialization will fail on EVERY poll — catch it, skip past it (seek beyond, or use an error-handling deserializer) and route it to a dead-letter topic.</p>

<h3>Admin API and CLI tools</h3>
<ul>
<li><strong>AdminClient</strong>: programmatic create/describe/delete topics, alter configs, list consumer groups and their offsets/lag, manage ACLs.</li>
<li>CLI equivalents: <code>kafka-topics.sh</code> (--create --partitions --replication-factor / --describe), <code>kafka-console-producer.sh</code> / <code>kafka-console-consumer.sh</code> (--from-beginning, --group), <code>kafka-consumer-groups.sh</code> (--describe shows per-partition <strong>LAG</strong>; --reset-offsets), <code>kafka-configs.sh</code>.</li>
</ul>

<h3>Compression and batching</h3>
<ul>
<li>Compression is set on the <strong>producer</strong> (whole-batch compression); brokers usually store batches as-is; consumers decompress. Bigger batches (higher linger.ms/batch.size) compress better — compounding throughput gains at a small latency cost.</li>
<li>zstd/lz4 are the modern favorites (good ratio/CPU balance); gzip best ratio, most CPU.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> favorite questions — what acks=all requires (paired min.insync.replicas); idempotence stopping retry duplicates but transactions being needed for consume-transform-produce EOS; auto-commit's data-loss window vs manual commit-after-processing; max.poll.interval.ms evictions on slow processing; BACKWARD compatibility = consumers upgrade first; and the retriable/non-retriable split.</p>`
    },
    {
      id: "k3",
      title: "Apache Kafka Streams",
      weight: 12,
      topicDocs: {
        "Topology, tasks, and threads": "https://docs.confluent.io/platform/current/streams/concepts.html",
        "KStream, KTable, GlobalKTable": "https://docs.confluent.io/platform/current/streams/concepts.html",
        "Stateful processing: state stores and internal topics": "https://kafka.apache.org/documentation/streams/",
        "Windowing and time": "https://docs.confluent.io/platform/current/streams/concepts.html",
        "Joins": "https://kafka.apache.org/documentation/streams/",
        "Processing guarantees": "https://docs.confluent.io/kafka/design/delivery-semantics.html"
      },
      objectives: [
        "Describe the Streams processing topology, tasks, and threading model",
        "Choose between KStream, KTable, and GlobalKTable",
        "Use stateful operations: aggregations, state stores, and internal topics",
        "Apply windowing (tumbling, hopping, sliding, session) and time semantics",
        "Join streams and tables correctly",
        "Configure processing guarantees (at-least-once, exactly-once)"
      ],
      notes: `
<h3>Topology, tasks, and threads</h3>
<ul>
<li>Kafka Streams is a <strong>client library</strong> (plain Java app — no cluster to install; deploy like any app, e.g. in Docker/Kubernetes). A <strong>topology</strong> is the graph of sources → processors → sinks built with the DSL (<code>StreamsBuilder</code>) or Processor API.</li>
<li>The topology is split into <strong>tasks</strong> — one per input partition — the unit of parallelism. Tasks are distributed over <code>num.stream.threads</code> and over all app instances sharing the same <code>application.id</code> (which is also the consumer group id). <strong>Max parallelism = input partition count</strong>; extra instances/threads idle.</li>
<li>Scaling out = start another instance with the same application.id: tasks (and their state) migrate automatically.</li>
</ul>

<h3>KStream, KTable, GlobalKTable</h3>
<table>
<tr><th></th><th>KStream</th><th>KTable</th><th>GlobalKTable</th></tr>
<tr><td>Semantics</td><td>Event stream — every record is an independent fact ("orders placed")</td><td>Changelog — latest value per key ("current price per product"); updates overwrite</td><td>Like KTable but FULLY replicated to every instance</td></tr>
<tr><td>Reads topic</td><td>All partitions split across tasks</td><td>All partitions split across tasks</td><td>Every instance reads ALL partitions</td></tr>
<tr><td>Join keying</td><td colspan="2">Stream-stream and stream-table joins require <strong>co-partitioning</strong> (same key, same partition count)</td><td>Join on any key (via mapper) — no co-partitioning needed</td></tr>
<tr><td>Typical use</td><td>Transformations, enrichment events</td><td>Aggregation results, reference data that updates</td><td>Small, broadly needed lookup data</td></tr>
</table>

<h3>Stateful processing: state stores and internal topics</h3>
<ul>
<li>Stateful operations (<code>count</code>, <code>aggregate</code>, <code>reduce</code>, joins, windowing) keep local <strong>state stores</strong> (RocksDB on disk by default, in-memory optional).</li>
<li>Every state store is backed by a compacted <strong>changelog topic</strong> in Kafka — the source of truth. On instance failure/migration, state is <strong>restored by replaying the changelog</strong>; <code>num.standby.replicas</code> keeps warm copies to shorten failover.</li>
<li>Re-keying operations (<code>groupBy</code>, <code>selectKey</code> before an aggregation/join) create internal <strong>repartition topics</strong> so records with the same new key meet in the same task.</li>
<li>State is queryable in-process (<strong>interactive queries</strong>) for serving lookups without an external DB.</li>
</ul>

<h3>Windowing and time</h3>
<table>
<tr><th>Window</th><th>Shape</th><th>Example</th></tr>
<tr><td>Tumbling</td><td>Fixed size, non-overlapping</td><td>Count per 5 minutes</td></tr>
<tr><td>Hopping</td><td>Fixed size, overlapping (size + advance)</td><td>5-min window advancing every 1 min</td></tr>
<tr><td>Sliding</td><td>Bound to record pairs within a time difference</td><td>Joins/aggregations over "within 30 s of each other"</td></tr>
<tr><td>Session</td><td>Activity-based, closed by an inactivity gap</td><td>User sessions with 10-min idle gap</td></tr>
</table>
<ul>
<li>Streams operates on <strong>event time</strong> by default (record timestamps; custom <code>TimestampExtractor</code> possible), not wall-clock arrival time.</li>
<li>Late/out-of-order records within the window's <strong>grace period</strong> still update it; results are continuously refined (use <code>suppress()</code> to emit only the final result when a window closes).</li>
</ul>

<h3>Joins</h3>
<ul>
<li><strong>Stream–stream</strong> joins are always <em>windowed</em> (records must occur within the window) and support inner/left/outer.</li>
<li><strong>Stream–table</strong> joins enrich events with the table's <em>current</em> value for the key (inner/left).</li>
<li><strong>Table–table</strong> joins produce an updating joined table.</li>
<li>Except with GlobalKTables, join inputs must be <strong>co-partitioned</strong>: same key space and the SAME number of partitions — otherwise Streams throws or requires an explicit repartition.</li>
</ul>

<h3>Processing guarantees</h3>
<ul>
<li><code>processing.guarantee=at_least_once</code> (default) — duplicates possible after failures.</li>
<li><code>processing.guarantee=exactly_once_v2</code> — wraps the consume-process-produce cycle (including state-store changelogs) in Kafka transactions; requires brokers ≥ 2.5, adds modest overhead. This is the one-line EOS switch for Streams apps.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> classic questions — tasks = input partitions (adding instances beyond that does nothing); KTable = latest value per key (vs KStream = every event); GlobalKTable = fully replicated, no co-partitioning; state restored from changelog topics; exactly_once_v2 as the EOS setting; tumbling vs hopping vs session recognition from a scenario.</p>`
    }
  ]
};
