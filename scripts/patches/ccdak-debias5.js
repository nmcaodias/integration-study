/* CCDAK de-bias · sections k5 (testing) + k6 (observability). */
module.exports = {
  questions: {
    "kk-048": {
      optionEdits: {
        0: "A Testcontainers-based real Kafka broker",
        1: "MockProducer — records sent messages for assertions and can simulate failures via errorNext",
        2: "The kafka-console-producer CLI tool",
        3: "The TopologyTestDriver for Streams"
      },
      optionNotes: [
        "Testcontainers spins up a real broker — heavier than a unit test needs.",
        "Correct — MockProducer runs in-process, captures sends, and can inject failures for callback tests.",
        "The console producer is a CLI, not a unit-test harness.",
        "TopologyTestDriver tests Streams topologies, not a plain producer callback."
      ]
    },
    "kk-049": {
      optionEdits: {
        0: "MockConsumer combined with MockProducer",
        1: "TopologyTestDriver with TestInputTopic and TestOutputTopic",
        2: "The kafka-consumer-groups.sh CLI",
        3: "A three-broker Testcontainers cluster"
      },
      optionNotes: [
        "Mocks test plain clients, not a full topology synchronously.",
        "Correct — TopologyTestDriver with Test I/O topics drives a topology in-process with no broker.",
        "That CLI inspects groups; it doesn't run topologies.",
        "A real cluster is an integration test, not the synchronous in-process option."
      ]
    },
    "kk-050": {
      optionEdits: {
        0: "Thread.sleep() in the test until the window naturally closes",
        1: "Use TopologyTestDriver's explicit time control — pipe records at chosen timestamps and advance time",
        2: "Run it in production and observe the outcome",
        3: "Accept that windows cannot be tested deterministically"
      },
      optionNotes: [
        "Sleeping is flaky and wall-clock dependent.",
        "Correct — the driver lets you set record timestamps and advance time to deterministically close windows.",
        "Testing in production isn't deterministic verification.",
        "Windows are testable precisely because of the driver's time control."
      ]
    },
    "kk-051": {
      optionEdits: {
        0: "Branching (branch/split) logic in a topology",
        1: "Security handshakes, real Schema Registry (de)serialization, transactions, and rebalance behavior",
        2: "A simple map() transformation on records",
        3: "Producer send callback code"
      },
      optionNotes: [
        "Branching is pure topology logic the driver covers.",
        "Correct — security, real serialization, transactions, and rebalances need a real broker to exercise.",
        "map() is unit-testable with the driver.",
        "Callbacks are covered by MockProducer."
      ]
    },
    "kk-052": {
      optionEdits: {
        0: "Deploy the change and monitor production for errors",
        1: "Check candidate schemas against the registry's compatibility mode in CI so incompatible changes fail the build",
        2: "Disable compatibility checking to avoid friction",
        3: "Use StringSerializer everywhere to sidestep schemas"
      },
      optionNotes: [
        "Discovering breakage in production is too late.",
        "Correct — a CI compatibility check (REST endpoint or Maven goal) fails incompatible schemas before release.",
        "Disabling checks removes the very safety net you want.",
        "Dropping schemas abandons the guarantees Schema Registry provides."
      ]
    },
    "kk-053": {
      optionEdits: {
        0: "Instantiate a KafkaProducer inside every method that sends",
        1: "Inject the Producer/Consumer interface into the logic so tests pass mocks and prod passes real clients",
        2: "Make all the methods static for simplicity",
        3: "Test the application only through the CLI tools"
      },
      optionNotes: [
        "Constructing clients inline makes code hard to isolate in tests.",
        "Correct — dependency injection of the client interface lets tests substitute MockProducer/MockConsumer.",
        "Static methods hinder mocking and injection.",
        "CLI-only testing can't unit-test business logic."
      ]
    },
    "kk-054": {
      optionEdits: {
        0: "The elapsed time since the consumer last polled",
        1: "Log-end offset minus the consumer's committed offset — how many records behind it is",
        2: "The number of group rebalances per hour",
        3: "The number of bytes sitting in the fetch buffer"
      },
      optionNotes: [
        "Lag is a record count, not a time-since-poll.",
        "Correct — lag = log-end offset − current/committed offset for the partition.",
        "Rebalance frequency is a different health signal.",
        "Fetch buffer bytes are unrelated to lag."
      ]
    },
    "kk-055": {
      optionEdits: {
        0: "They periodically write metrics to CSV files",
        1: "Via JMX MBeans per client/topic/node, typically scraped by agents like the Prometheus JMX exporter",
        2: "Only through Confluent Control Center",
        3: "Metrics must be instrumented manually in code"
      },
      optionNotes: [
        "Clients don't emit CSV metrics.",
        "Correct — Kafka clients expose metrics as JMX MBeans, commonly scraped into Prometheus.",
        "Control Center is one consumer of metrics, not the only path.",
        "The client library already exposes metrics; no manual coding needed."
      ]
    },
    "kk-056": {
      optionEdits: {
        0: "record-retry-rate; high values are perfectly normal",
        1: "record-error-rate; it should be about 0 and alerted on otherwise",
        2: "batch-size-avg; it should be 0",
        3: "compression-rate-avg; it should be 1"
      },
      optionNotes: [
        "Retries can succeed; retry-rate isn't final failure.",
        "Correct — record-error-rate counts sends that failed after retries; it should sit near 0 and be alerted.",
        "batch-size-avg is a tuning metric, not a failure indicator.",
        "compression-rate-avg measures ratio, not delivery failure."
      ]
    },
    "kk-057": {
      optionEdits: {
        0: "The whole cluster is undersized and needs more brokers",
        1: "A hot key skewing traffic to that partition (or one slow consumer) — check key distribution and that assignee",
        2: "The Schema Registry is down",
        3: "linger.ms is configured too high"
      },
      optionNotes: [
        "One-partition skew points to data/consumer imbalance, not overall sizing.",
        "Correct — a hot key or one slow/stuck consumer explains lag isolated to a single partition.",
        "A registry outage would affect all partitions, not one.",
        "linger.ms is a producer setting unrelated to single-partition lag."
      ]
    },
    "kk-058": {
      optionEdits: {
        0: "Kafka randomly duplicates data on its own",
        1: "At-least-once: records processed but not yet committed before the crash are redelivered — make handling idempotent or use EOS",
        2: "The producer's compression is corrupting batches",
        3: "The reported consumer lag has gone negative"
      },
      optionNotes: [
        "Kafka doesn't duplicate arbitrarily; the model explains it.",
        "Correct — uncommitted-but-processed records replay after a rebalance; fix with idempotent handling or transactions.",
        "Compression doesn't cause logical duplicates.",
        "Negative lag isn't a real condition here."
      ]
    },
    "kk-059": {
      optionEdits: {
        0: "Fork and patch the Kafka client library",
        1: "Configure ProducerInterceptor / ConsumerInterceptor via interceptor.classes to observe records",
        2: "Add a custom plugin on the broker",
        3: "Turn on DEBUG logging for the clients"
      },
      optionNotes: [
        "Forking the library is unnecessary and unmaintainable.",
        "Correct — interceptors registered via interceptor.classes hook send/consume without touching business code.",
        "Broker plugins can't instrument client-side records per app.",
        "DEBUG logging is noisy and not structured telemetry."
      ]
    },
    "kk-060": {
      optionEdits: {
        0: "In the message key, replacing the business key",
        1: "In message HEADERS (e.g. W3C/OpenTelemetry trace context), propagated producer to consumer",
        2: "Encoded into the topic name itself",
        3: "It cannot cross a Kafka boundary at all"
      },
      optionNotes: [
        "Overloading the key would break partitioning by business key.",
        "Correct — trace context travels in headers, carried from producer to consumer across services.",
        "Topic names can't carry per-record trace context.",
        "Trace context propagates fine via headers."
      ]
    },
    "kk-061": {
      optionEdits: {
        0: "The consumers on the other side are lagging",
        1: "The producer outpaces the cluster (or brokers are slow): batches fill buffer.memory until send() blocks and times out",
        2: "Log compaction deleted the target topic",
        3: "The consumer group performed a rebalance"
      },
      optionNotes: [
        "Consumer lag doesn't cause producer buffer waits.",
        "Correct — rising bufferpool-wait-time means the producer can't hand off fast enough; the buffer fills and send() times out.",
        "Compaction doesn't delete topics or block producers.",
        "Consumer rebalances don't stall the producer buffer."
      ]
    },
    "kk-062": {
      optionEdits: {
        0: "Broker CPU utilization",
        1: "End-to-end latency: compare the record's event timestamp with when the last consumer processes it",
        2: "The topic's partition count",
        3: "The number of connectors deployed"
      },
      optionNotes: [
        "Broker CPU is a component metric that misses cross-hop delay.",
        "Correct — event-timestamp-to-processing latency catches pipeline delay that per-component metrics hide.",
        "Partition count is static config, not a health signal.",
        "Connector count says nothing about latency."
      ]
    },
    "kk-085": {
      optionEdits: {
        0: "Run the app against production and wait for a real failure",
        1: "MockProducer with errorNext(new TimeoutException(...)) to force the send callback to fail",
        2: "Physically disconnect the network cable mid-test",
        3: "Set acks=0 and hope a failure occurs"
      },
      optionNotes: [
        "Waiting for real failures is non-deterministic.",
        "Correct — MockProducer.errorNext injects a specific exception so the failure path runs deterministically.",
        "Yanking the network isn't a repeatable unit test.",
        "acks=0 changes durability, not deterministic failure injection."
      ]
    },
    "kk-086": {
      optionEdits: {
        0: "Only manually, just before major releases",
        1: "In CI on every schema change — validating the candidate against the subject's compatibility mode",
        2: "Inside the consumer at runtime",
        3: "Nowhere — the registry blocks bad schemas at produce time anyway"
      },
      optionNotes: [
        "Manual pre-release checks miss most changes.",
        "Correct — automated CI compatibility checks on every change catch breaks before they ship.",
        "Runtime consumer checks are too late to prevent deployment.",
        "Relying on produce-time rejection lets bad changes reach production first."
      ]
    },
    "kk-088": {
      optionEdits: {
        0: "The brokers are the bottleneck",
        1: "Per-record processing: 4 consumers x (1000/80) ~ 50 rec/s vs 100/s incoming — process faster or add parallelism",
        2: "The network between clients and brokers",
        3: "The Schema Registry is the constraint"
      },
      optionNotes: [
        "Brokers aren't implicated by this arithmetic.",
        "Correct — 80 ms/record caps 4 consumers near 50 rec/s against 100 rec/s in; speed up or parallelize processing.",
        "The network isn't the limiter here.",
        "Schema Registry isn't the throughput bottleneck."
      ]
    },
    "kk-089": {
      optionEdits: {
        0: "Broker-side plugins installed on each broker",
        1: "Producer/Consumer interceptors registered via interceptor.classes",
        2: "A custom partitioner implementation",
        3: "A higher fetch.max.bytes setting"
      },
      optionNotes: [
        "Broker plugins don't instrument per-app client records.",
        "Correct — interceptors add counting/tracing at send and consume without changing business code.",
        "A partitioner routes records; it doesn't add telemetry.",
        "fetch.max.bytes is a fetch-size tuning, not instrumentation."
      ]
    },
    "kk-090": {
      optionEdits: {
        0: "In DNS resolution between services",
        1: "As QUEUEING between hops (lag at intermediate topics) — found by comparing event vs processing time per stage",
        2: "In TLS handshakes on each connection",
        3: "In log-segment rotation on the brokers"
      },
      optionNotes: [
        "DNS wouldn't account for 45 s of end-to-end delay.",
        "Correct — the time hides as queueing/lag at intermediate topics; per-stage timestamp comparison locates it.",
        "TLS handshakes are milliseconds, not tens of seconds.",
        "Log rotation doesn't add pipeline latency."
      ]
    }
  }
};
