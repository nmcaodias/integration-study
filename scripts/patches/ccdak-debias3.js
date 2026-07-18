/* CCDAK de-bias · section k3 (Kafka Streams). */
module.exports = {
  questions: {
    "kk-026": {
      optionEdits: {
        0: "All 10 instances receive tasks and process data in parallel",
        1: "Only 8 instances get tasks — parallelism is capped by input partitions; 2 stay idle",
        2: "The application fails to start with more instances than partitions",
        3: "Kafka automatically adds partitions to use all instances"
      },
      optionNotes: [
        "Tasks are bounded by input partitions, so not all 10 can get work.",
        "Correct — one task per input partition caps parallelism at 8; the extra 2 instances stay idle standbys.",
        "Extra instances are fine; they just hold no active tasks.",
        "Streams never auto-adds partitions."
      ]
    },
    "kk-027": {
      optionEdits: {
        0: "A KStream, where every record is an independent event",
        1: "A KTable — a changelog where each key holds its latest value",
        2: "A windowed KStream aggregation",
        3: "A repartition topic between operators"
      },
      optionNotes: [
        "A KStream models an unbounded event flow, not current state per key.",
        "Correct — 'current value per key over time' is a KTable (changelog semantics).",
        "A window bounds time; it doesn't model latest-value-per-key.",
        "A repartition topic is plumbing, not a state abstraction."
      ]
    },
    "kk-028": {
      optionEdits: {
        0: "A KTable join, requiring co-partitioning on the same key",
        1: "A GlobalKTable join — fully replicated to each instance, joinable on any key via a key mapper",
        2: "A windowed stream-stream join",
        3: "A simple merge of the two KStreams"
      },
      optionNotes: [
        "A KTable join needs co-partitioning on matching keys, which we want to avoid.",
        "Correct — a small GlobalKTable is replicated everywhere and joins on any field without repartitioning.",
        "Stream-stream joins are for two event streams in a window, not reference enrichment.",
        "Merge interleaves streams; it doesn't enrich by lookup."
      ]
    },
    "kk-029": {
      optionEdits: {
        0: "A relational database that the user configures",
        1: "A compacted changelog topic in Kafka; state is restored by replaying it (standbys speed recovery)",
        2: "A periodic snapshot file uploaded to S3",
        3: "Nothing — state is simply lost on failure"
      },
      optionNotes: [
        "State stores are backed by Kafka, not an external RDBMS.",
        "Correct — a compacted changelog topic durably backs the store; recovery replays it (standby replicas shorten it).",
        "There is no S3 snapshotting in core Streams fault tolerance.",
        "State is recoverable, not lost."
      ]
    },
    "kk-030": {
      optionEdits: {
        0: "A hopping window of size 5 min advancing every 1 min",
        1: "A tumbling window of 5 minutes",
        2: "A session window with a 5-minute inactivity gap",
        3: "A sliding window over the records"
      },
      optionNotes: [
        "Hopping windows overlap; these buckets are non-overlapping.",
        "Correct — fixed, non-overlapping, equal-size buckets are tumbling windows.",
        "Session windows are activity-driven, not fixed intervals.",
        "Sliding windows are for join/aggregation over relative time, not fixed buckets."
      ]
    },
    "kk-031": {
      optionEdits: {
        0: "A tumbling 30-minute window",
        1: "Session windows with a 30-minute inactivity gap",
        2: "A hopping window advancing every 30 minutes",
        3: "No windowing is needed for this"
      },
      optionNotes: [
        "Tumbling windows are fixed-time, not gap-of-inactivity based.",
        "Correct — activity separated by a 30-minute idle gap is exactly a session window.",
        "Hopping windows are fixed/overlapping, not inactivity-based.",
        "Sessionization inherently requires windowing."
      ]
    },
    "kk-032": {
      optionEdits: {
        0: "enable.idempotence=true on the underlying producer",
        1: "processing.guarantee=exactly_once_v2",
        2: "isolation.level=read_committed on the consumer",
        3: "acks=all on the producer"
      },
      optionNotes: [
        "Idempotence is necessary but not the Streams-level EOS switch.",
        "Correct — processing.guarantee=exactly_once_v2 turns on end-to-end EOS in Streams.",
        "read_committed is a consumer read setting, not the Streams guarantee toggle.",
        "acks=all is durability, not exactly-once processing."
      ]
    },
    "kk-033": {
      optionEdits: {
        0: "It fails at startup because re-keying isn't allowed",
        1: "It writes the re-keyed stream through an internal repartition topic so equal keys share a task",
        2: "It broadcasts every record to every task",
        3: "It ignores the new key and joins on the old one"
      },
      optionNotes: [
        "Re-keying is fully supported.",
        "Correct — a repartition topic reshuffles by the new key so matching keys co-locate before the join.",
        "Broadcasting isn't how a keyed join co-locates data.",
        "The new key is honored, not ignored."
      ]
    },
    "kk-034": {
      optionEdits: {
        0: "Wall-clock time when the record is processed",
        1: "Event time from the record's timestamp (customizable via a TimestampExtractor)",
        2: "The broker's disk-flush time",
        3: "The time the consumer polled the record"
      },
      optionNotes: [
        "Processing (wall-clock) time is not the default; event time is.",
        "Correct — windowing uses record event time by default, overridable with a TimestampExtractor.",
        "Disk-flush time is unrelated to windowing.",
        "Poll time isn't the windowing clock."
      ]
    },
    "kk-035": {
      optionEdits: {
        0: "Poll less frequently so fewer updates are emitted",
        1: "Use suppress() to hold updates until the window closes, emitting only the final value",
        2: "Set linger.ms very high on the sink producer",
        3: "Route the aggregation through a GlobalKTable"
      },
      optionNotes: [
        "Poll frequency doesn't control intermediate window emissions.",
        "Correct — suppress(untilWindowCloses) buffers and emits only the final per-window result.",
        "linger.ms batches network sends; it doesn't collapse window updates.",
        "A GlobalKTable is for replicated lookups, not final-result suppression."
      ]
    },
    "kk-036": {
      optionEdits: {
        0: "It cannot scale out without a full redeployment",
        1: "Start more instances with the SAME application.id — tasks and state migrate automatically",
        2: "Give each instance a different group.id",
        3: "Increase the changelog topic's replication factor"
      },
      optionNotes: [
        "Streams scales elastically at runtime by adding members.",
        "Correct — new instances sharing application.id join the group and receive rebalanced tasks (with their state).",
        "Distinct group.ids would break the shared processing group.",
        "Replication factor is durability, not scaling."
      ]
    },
    "kk-037": {
      optionEdits: {
        0: "A server process that must be installed on each Kafka broker",
        1: "A standard Java app using a client library — deployed anywhere, with no processing cluster to install",
        2: "A plugin that runs inside ZooKeeper",
        3: "A managed service available only on Confluent Cloud"
      },
      optionNotes: [
        "Streams runs in your app, not on the brokers.",
        "Correct — it's a library-based JVM app you deploy like any other (VMs/Docker/K8s); no separate cluster.",
        "It has nothing to do with ZooKeeper internals.",
        "Streams is open-source, not a cloud-only service."
      ]
    },
    "kk-077": {
      optionEdits: {
        0: "There is no meaningful difference between them",
        1: "Stream-table joins enrich each event with the table's CURRENT value; stream-stream joins pair events within a time WINDOW",
        2: "Stream-table joins require a time window to work",
        3: "Stream-stream joins never require co-partitioning"
      },
      optionNotes: [
        "They differ fundamentally in windowing and semantics.",
        "Correct — table joins are windowless current-value lookups; stream-stream joins match within a window.",
        "Stream-table joins are windowless.",
        "Stream-stream joins require co-partitioned inputs."
      ]
    },
    "kk-078": {
      optionEdits: {
        0: "Nothing can help; the 50 GB of state is simply lost",
        1: "num.standby.replicas >= 1 — warm state copies let tasks migrate near-instantly instead of replaying 50 GB",
        2: "A larger producer batch.size on the app",
        3: "Enabling exactly_once_v2 processing"
      },
      optionNotes: [
        "State is recoverable from the changelog; the goal is to avoid a slow replay.",
        "Correct — standby replicas keep warm copies elsewhere, so failover doesn't replay the whole changelog.",
        "batch.size affects producing, not state recovery.",
        "EOS is about correctness, not recovery speed."
      ]
    },
    "kk-079": {
      optionEdits: {
        0: "It is dropped as a late record",
        1: "It updates its correct, already-formed window because it is within the grace period",
        2: "It creates a brand-new window of its own",
        3: "Streams crashes on the late record"
      },
      optionNotes: [
        "Within the grace period it is not dropped.",
        "Correct — a record 5 min late with a 10-min grace still lands in and updates its original window.",
        "It joins the existing window, not a new one.",
        "Late records are handled gracefully, not fatal."
      ]
    }
  }
};
