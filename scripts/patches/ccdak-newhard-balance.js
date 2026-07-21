/* CCDAK · balance. (1) All 12 new hard questions had the correct option longest
 * (thorough answers) — extend the top distractor past the answer on each. (2) The
 * bank ratio was 1.45x from short distractors on many existing questions — raise
 * the shortest distractor on high-ratio items where the correct option is NOT the
 * longest. Distractors stay plausible-but-wrong; answers/meaning unchanged. */
module.exports = {
  questions: {
    // --- new hard batch: extend a distractor past the correct answer ---
    "kk-119": { optionEdits: { 1: "Production halts for that partition until the original leader returns, guaranteeing zero data loss because only a fully in-sync replica can ever be elected as the new partition leader" } },
    "kk-120": { optionEdits: { 1: "Nothing changes for ordering, because Kafka automatically migrates each key's historical records onto the newly added partitions so that every key stays on its original single partition" } },
    "kk-121": { optionEdits: { 1: "acks=all is being silently overridden by enable.idempotence, which downgrades the effective acknowledgement level to 1 and is therefore the actual source of the acknowledged-but-lost records" } },
    "kk-122": { optionEdits: { 2: "Reordering is fundamentally unavoidable in Kafka for any keyed topic, so every consumer must always re-sort the records it reads by an embedded application timestamp before processing them" } },
    "kk-123": { optionEdits: { 1: "The producer forgot to call initTransactions() during startup, so all of its transactional commits silently behave like ordinary plain sends that the downstream consumer then reads as normal" } },
    "kk-124": { optionEdits: { 2: "Renaming the 'amount' field to 'total' is allowed, because field renames are treated as fully compatible changes under FULL compatibility as long as the underlying field type is left unchanged" } },
    "kk-125": { optionEdits: { 3: "The join fails only because 'clicks' has more partitions than 'impressions', and in a stream-stream join the stream with fewer partitions must always be supplied as the left-hand side" } },
    "kk-126": { optionEdits: { 1: "It reopens the already-closed window, recomputes the aggregate count including the late record, and emits a corrected final result downstream in place of the value that was emitted earlier" } },
    "kk-127": { optionEdits: { 1: "Kafka Connect always runs exactly one task per connector regardless of the tasks.max value, so any additional source parallelism must instead come from deploying several identical connectors side by side" } },
    "kk-128": { optionEdits: { 1: "The producer should never have used Avro in the first place; the correct fix is to re-produce all of the existing data with the plain StringSerializer so that the sink's StringConverter matches it" } },
    "kk-129": { optionEdits: { 2: "The consumer is committing its offsets far too frequently, and the correct fix is to raise auto.commit.interval.ms substantially so that the offset commits stop blocking each fetch request" } },
    "kk-130": { optionEdits: { 1: "It means those 37 partitions have already permanently lost committed data, and producing to them cannot safely resume until each one has been fully restored from an external backup" } },
    // --- existing offenders: raise the shortest distractor to lower the ratio ---
    "kk-062": { optionEdits: { 0: "Broker CPU utilization averaged across the whole cluster" } },
    "kk-057": { optionEdits: { 2: "The Schema Registry is unreachable for that partition's records" } },
    "kk-090": { optionEdits: { 0: "In DNS resolution between the client and the broker services" } },
    "kk-028": { optionEdits: { 2: "A windowed stream-stream join keyed on the reference id" } },
    "kk-093": { optionEdits: { 1: "Set acks=all on the producer for every topic it writes to" } },
    "kk-051": { optionEdits: { 3: "Producer send-callback code paths and their success metrics" } },
    "kk-086": { optionEdits: { 2: "Inside the consumer at runtime as each record arrives" } },
    "kk-081": { optionEdits: { 3: "Always pin tasks.max=1 for sink connectors on every topic" } },
    "kk-043": { optionEdits: { 2: "Broker-side message interceptors applied to each topic" } },
    "kk-078": { optionEdits: { 3: "Enabling exactly_once_v2 processing on the application" } },
    "kk-041": { optionEdits: { 2: "Tasks manage and schedule the worker processes in the cluster" } },
    "kk-059": { optionEdits: { 2: "Add a custom plugin on the broker for every topic" } },
    "kk-039": { optionEdits: { 3: "In the Schema Registry alongside the registered subjects" } },
    "kk-048": { optionEdits: { 3: "The TopologyTestDriver harness for Streams topologies" } }
  }
};
