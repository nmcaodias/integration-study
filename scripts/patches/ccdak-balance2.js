/* CCDAK · balance round 2. Flip the remaining questions where the correct option
 * is longest (extend a distractor past it) and raise more short distractors on
 * high-ratio items, to bring the bank toward longest-correct <=30% / ratio ~1.33.
 * Distractors stay plausible-but-wrong; answers/meaning unchanged. */
module.exports = {
  questions: {
    // --- flip longest-correct: extend a distractor past the correct answer ---
    "kk-079": { optionEdits: { 2: "It creates a brand-new tumbling window of its own and begins counting all subsequent records into that window instead" } },
    "kk-113": { optionEdits: { 3: "Skip unit tests entirely for the producer code, since only full end-to-end integration tests against a real running broker can ever meaningfully cover the send-and-callback path" } },
    "kk-046": { optionEdits: { 0: "Its tasks are permanently lost until that specific worker process comes back online and rejoins the Connect cluster on its own" } },
    "kk-049": { optionEdits: { 0: "MockConsumer combined with MockProducer, wired together to stand in for the whole topology" } },
    "kk-002": { optionEdits: { 0: "Set acks=all so that every single write is fully replicated across all of the in-sync replicas before it is acknowledged" } },
    "kk-004": { optionEdits: { 0: "Writes will still succeed and be acknowledged even when all three of the partition's replicas are simultaneously unavailable" } },
    "kk-014": { optionEdits: { 0: "Setting enable.idempotence=true on the producer alone, which by itself is entirely sufficient to guarantee exactly-once across the whole consume-transform-produce loop" } },
    "kk-068": { optionEdits: { 0: "None whatsoever — acks=1 is already considered fully durable against any kind of broker or disk failure that could ever occur" } },
    "kk-073": { optionEdits: { 3: "Compatibility is guaranteed automatically in both directions and forever, across every past and future schema version, the moment FORWARD is set on the subject" } },
    "kk-070": { optionEdits: { 0: "enable.auto.commit=true together with a very short auto-commit interval so that offsets are advanced quickly in the background" } },
    "kk-015": { optionEdits: { 0: "They are automatically redelivered to the consumer group as soon as the crashed consumer restarts and rejoins the group" } },
    "kk-056": { optionEdits: { 0: "record-retry-rate; consistently high values on this metric are perfectly normal and never need to be alerted on" } },
    "kk-077": { optionEdits: { 3: "Stream-stream joins never require the two input streams to be co-partitioned on the join key, unlike stream-table joins which always do" } },
    "kk-042": { optionEdits: { 0: "The JDBC source connector always emits Avro-encoded records by default, without needing any converter configuration at all on the connector" } },
    "kk-058": { optionEdits: { 2: "The producer's configured compression codec is silently corrupting some of the record batches it sends downstream to the brokers" } },
    // --- more short-distractor extensions to lower the ratio ---
    "kk-083": { optionEdits: { 2: "Add more brokers to the Kafka and Connect cluster" } },
    "kk-060": { optionEdits: { 2: "Encoded directly into the Kafka topic name itself" } },
    "kk-045": { optionEdits: { 3: "It automatically converts all captured data to Avro format" } },
    "kk-061": { optionEdits: { 2: "Log compaction has deleted the target output topic" } },
    "kk-029": { optionEdits: { 2: "A periodic state snapshot file uploaded to S3" } },
    "kk-102": { optionEdits: { 1: "All null-key records always go to partition 0" } },
    "kk-038": { optionEdits: { 3: "A cron job repeatedly driving the console producer" } },
    "kk-047": { optionEdits: { 3: "They are completely unable to run any source connectors" } },
    "kk-105": { optionEdits: { 2: "KTables cannot ever be joined together, only aggregated" } },
    "kk-090": { optionEdits: { 2: "In the TLS handshakes on each new connection" } }
  }
};
