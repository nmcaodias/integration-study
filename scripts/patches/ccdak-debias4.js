/* CCDAK de-bias · section k4 (Kafka Connect). */
module.exports = {
  questions: {
    "kk-038": {
      optionEdits: {
        0: "Write a custom producer and consumer application for each system",
        1: "Kafka Connect: a source connector for PostgreSQL and a sink connector for Elasticsearch, config-driven",
        2: "A Kafka Streams app making JDBC calls directly",
        3: "A cron job driving the console producer"
      },
      optionNotes: [
        "Custom apps are exactly the code Connect exists to avoid.",
        "Correct — Connect's source and sink connectors move data in/out of Kafka with configuration, not custom code.",
        "Streams is for processing, not connector-style ingestion/egress.",
        "A cron+console-producer pipeline is brittle and unscalable."
      ]
    },
    "kk-039": {
      optionEdits: {
        0: "In local files on each individual worker",
        1: "In internal Kafka topics (config, offset, status) shared by the worker group",
        2: "In ZooKeeper alongside cluster metadata",
        3: "In the Schema Registry"
      },
      optionNotes: [
        "Local files are standalone-mode behavior, not distributed.",
        "Correct — distributed Connect persists config/offsets/status in internal Kafka topics shared by the group.",
        "Connect doesn't use ZooKeeper for this.",
        "Schema Registry stores schemas, not connector state."
      ]
    },
    "kk-040": {
      optionEdits: {
        0: "By editing server.properties and restarting the brokers",
        1: "Via the Connect REST API — POST the config; also for status, pause/resume, restart, delete",
        2: "Only through the ZooKeeper command-line tools",
        3: "By placing a config file on each worker manually"
      },
      optionNotes: [
        "Connectors aren't broker configs.",
        "Correct — the Connect REST API manages the full connector lifecycle.",
        "ZooKeeper CLIs don't manage connectors.",
        "Manual per-worker files are standalone-style, not distributed management."
      ]
    },
    "kk-041": {
      optionEdits: {
        0: "A connector and a task are the same thing",
        1: "The connector is the job definition; it splits work into tasks (up to tasks.max) run across workers",
        2: "Tasks manage and schedule the workers",
        3: "One task always maps to exactly one topic"
      },
      optionNotes: [
        "They are distinct: definition vs. unit of execution.",
        "Correct — the connector defines the job and divides it into tasks (the parallelism unit) spread over workers.",
        "Workers host tasks, not the other way around.",
        "Task-to-topic mapping isn't fixed at one-to-one."
      ]
    },
    "kk-042": {
      optionEdits: {
        0: "The JDBC connector always emits Avro by default",
        1: "Set value.converter=AvroConverter with value.converter.schema.registry.url — converters are separate from connectors",
        2: "Use the StringConverter for values",
        3: "Enable errors.tolerance=all on the connector"
      },
      optionNotes: [
        "Format is chosen by the converter, not baked into the connector.",
        "Correct — the Avro converter + registry URL controls serialization independently of the connector.",
        "StringConverter produces plain strings, not schema-managed Avro.",
        "Error tolerance is about bad records, not serialization format."
      ]
    },
    "kk-043": {
      optionEdits: {
        0: "A separate custom Kafka Streams job in the pipeline",
        1: "Single Message Transforms (SMTs) chained in the connector config (e.g. MaskField + a router)",
        2: "Broker-side message interceptors",
        3: "Schema Registry compatibility rules"
      },
      optionNotes: [
        "That adds an external processing step, which the question rules out.",
        "Correct — SMTs mask/route records inline within the connector, no extra app needed.",
        "Brokers don't transform record contents.",
        "Compatibility rules govern schema evolution, not masking/routing."
      ]
    },
    "kk-044": {
      optionEdits: {
        0: "Set errors.tolerance=none so failures stop the task",
        1: "errors.tolerance=all with errors.deadletterqueue.topic.name — failed records go to a DLQ",
        2: "Set tasks.max=1 to serialize processing",
        3: "Switch key.converter to StringConverter"
      },
      optionNotes: [
        "tolerance=none is the failing default behavior, not the fix.",
        "Correct — tolerate errors and route bad records to a DLQ topic (with context headers) for later inspection.",
        "Reducing tasks doesn't handle malformed records.",
        "Changing the converter doesn't quarantine bad records."
      ]
    },
    "kk-045": {
      optionEdits: {
        0: "It needs no connector or infrastructure at all",
        1: "It reads the DB transaction log: captures every change (incl. DELETEs) with low latency and little table load",
        2: "It works even while the database is completely stopped",
        3: "It automatically converts all data to Avro"
      },
      optionNotes: [
        "CDC still runs as a connector (e.g. Debezium).",
        "Correct — log-based CDC captures all changes including deletes, with low latency and minimal query load.",
        "It reads the live DB's log; the DB must be running.",
        "Serialization format is a converter choice, not a CDC feature."
      ]
    },
    "kk-046": {
      optionEdits: {
        0: "Its tasks are lost until that worker comes back online",
        1: "The remaining workers rebalance and resume its tasks from offsets stored in Kafka",
        2: "All connectors restart from the very beginning of history",
        3: "The cluster stops accepting REST API calls"
      },
      optionNotes: [
        "Distributed Connect is fault-tolerant; tasks don't just wait.",
        "Correct — surviving workers take over the failed worker's tasks, resuming from Kafka-stored offsets.",
        "Work resumes from committed offsets, not from scratch.",
        "The remaining workers keep serving the REST API."
      ]
    },
    "kk-047": {
      optionEdits: {
        0: "They are the recommended choice for production simplicity",
        1: "They run in one process with offsets in a local file — no fault tolerance or scaling; fine for dev/test",
        2: "They store their offsets in Kafka automatically",
        3: "They are unable to run source connectors"
      },
      optionNotes: [
        "Standalone lacks fault tolerance, so it isn't a production recommendation.",
        "Correct — single process, local-file offsets, no HA or scale-out — suitable for development and testing.",
        "Local-file offsets are exactly what makes it non-distributed.",
        "Standalone can run source connectors."
      ]
    },
    "kk-081": {
      optionEdits: {
        0: "Set value.converter=StringConverter for the records",
        1: "value.converter=AvroConverter with value.converter.schema.registry.url pointing at the registry",
        2: "Set errors.tolerance=none on the sink",
        3: "Always pin tasks.max=1 for sinks"
      },
      optionNotes: [
        "StringConverter can't decode Avro records.",
        "Correct — the Avro converter plus the registry URL is what lets the sink read Schema-Registry Avro.",
        "Error tolerance is unrelated to reading Avro.",
        "tasks.max is a scaling knob, not an Avro requirement."
      ]
    },
    "kk-082": {
      optionEdits: {
        0: "In __consumer_offsets, like ordinary consumer groups",
        1: "In the Connect cluster's offset storage topic (connect-offsets)",
        2: "In a local file on each worker",
        3: "In the Schema Registry"
      },
      optionNotes: [
        "Source offsets are Connect-specific, not consumer-group offsets.",
        "Correct — distributed source offsets live in the connect-offsets internal topic.",
        "Local files are standalone-mode behavior.",
        "Schema Registry stores schemas, not source offsets."
      ]
    },
    "kk-083": {
      optionEdits: {
        0: "Add more partitions to the source topic",
        1: "Raise tasks.max (up to 8, the partition count) so tasks consume in parallel across workers",
        2: "Add more brokers to the cluster",
        3: "Reduce the topic's replication factor"
      },
      optionNotes: [
        "Adding partitions is disruptive and not the first, cheapest step.",
        "Correct — with 8 partitions, raising tasks.max up to 8 parallelizes the sink across workers immediately.",
        "More brokers doesn't help a single-task sink keep up.",
        "Lowering replication reduces durability and doesn't add throughput."
      ]
    }
  }
};
