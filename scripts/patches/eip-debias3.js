/* EIP de-bias · chapters b7–b9. */
module.exports = {
  questions: {
    "eip-701": {
      optionEdits: { 0: "A Content Filter", 1: "A Content Enricher", 2: "A Claim Check", 3: "An Envelope Wrapper" },
      optionNotes: ["A Content Filter removes fields; here data must be added.", "Correct — a Content Enricher adds the missing address by looking it up from the id.", "Claim Check stores and retrieves a payload; it doesn't look up new data.", "Envelope Wrapper adds transport wrapping, not business data."]
    },
    "eip-703": {
      optionEdits: { 0: "It signs each message so tampering is detected at the destination", 1: "It stores the payload and passes a slim message with a claim ticket; a later step retrieves it by ticket", 2: "It splits the payload across several messages to fit size limits", 3: "It compresses the body and adds a decompression header" },
      optionNotes: ["Claim Check isn't a signing/integrity mechanism.", "Correct — park the data in a store, carry a ticket, and re-fetch the data when needed.", "It stores externally rather than splitting across messages.", "It isn't compression."]
    },
    "eip-704": {
      optionEdits: { 0: "Translator count drops from up to 132 pairwise to 24 (one in, one out per app)", 1: "Translation is no longer needed anywhere in the system", 2: "The applications must all adopt the canonical format internally", 3: "Each application needs 11 new translators for safety" },
      optionNotes: ["Correct — a canonical model turns N×(N-1) pairwise translators into 2 per app (in/out).", "Translation is still needed — just to/from the canonical model.", "Apps keep their internal formats; only the integration uses canonical.", "The whole point is fewer translators, not more."]
    },
    "eip-705": {
      optionEdits: { 0: "A Splitter chained with an Aggregator", 1: "A router that detects each message's format plus one translator per source, all emitting the common format", 2: "An Envelope Wrapper chained with a Content Filter", 3: "A Claim Check paired with a Datatype Channel" },
      optionNotes: ["Splitter/Aggregator handle message parts, not varied formats.", "Correct — a Normalizer detects the format then applies the matching translator to reach a common format.", "Wrapper+filter don't reconcile multiple input formats.", "Claim Check + Datatype Channel don't normalize formats."]
    },
    "eip-706": {
      optionEdits: { 0: "A reply must be matched back to its original request", 1: "A 2,000-field mainframe record arrives and downstream needs only 12 fields, some nested deep", 2: "Two brokers must exchange messages across a boundary", 3: "A message must survive a broker restart" },
      optionNotes: ["Matching replies is Correlation Identifier, not a Content Filter.", "Correct — trimming a large record down to the few needed fields is the Content Filter's job.", "Bridging brokers is a Messaging Bridge.", "Surviving restarts is Guaranteed Delivery."]
    },
    "eip-707": {
      optionEdits: { 0: "Each envelope also serves as a backup copy of the message", 1: "Each segment (security gateway, WAN, partner network) adds its own envelope, wrapped on entry, unwrapped in reverse on exit", 2: "The receiving application requires two copies of every header", 3: "Nesting is required for the message to be routable at all" },
      optionNotes: ["Envelopes aren't backups.", "Correct — each infrastructure segment imposes its own wrapper, nested and unwrapped in reverse order.", "It isn't about duplicate headers.", "A message is routable without nested envelopes; nesting reflects the segments it crosses."]
    },
    "eip-708": {
      optionEdits: { 0: "A Content Enricher at each routing step", 1: "Claim Check — park the sensitive data, route a slim message with a ticket, re-attach only at the authorized endpoint", 2: "A Message Filter in front of each component", 3: "A Canonical Data Model across the components" },
      optionNotes: ["Enriching would spread the sensitive data further, the opposite of the goal.", "Correct — Claim Check keeps card data out of the intermediaries and restores it only where authorized.", "A filter drops messages; it doesn't hide sensitive fields from later steps.", "A canonical model standardizes formats, not data confidentiality."]
    },
    "eip-801": {
      optionEdits: { 0: "Because messages can be lost; strategies: retries and acknowledgements", 1: "Because retries/redeliveries create duplicates; strategies: track message ids, or make handling naturally idempotent", 2: "Because consumers can crash; strategies: transactions and durable subscriptions", 3: "Because order isn't guaranteed; strategies: resequencing and buffering" },
      optionNotes: ["At-least-once causes duplicates, not loss — that's the driver here.", "Correct — duplicates from redelivery force idempotency: dedupe by id or design idempotent semantics.", "Crash recovery is a different concern from duplicate handling.", "Ordering is a separate problem from idempotency."]
    },
    "eip-802": {
      optionEdits: { 0: "Competing consumers only work on pub-sub; dispatchers only on point-to-point", 1: "Competing consumers let the channel load-balance among independents; a dispatcher is one consumer distributing to performers by its own logic", 2: "A dispatcher discards messages no performer wants; competing consumers never discard", 3: "They are identical except for the number of threads used" },
      optionNotes: ["Competing consumers use point-to-point channels, not pub-sub.", "Correct — competing consumers self-balance off the channel; a dispatcher centrally assigns work to performers.", "Discarding isn't the distinction.", "They differ in control model, not just thread count."]
    },
    "eip-803": {
      optionEdits: { 0: "A selective consumer discards what it doesn't match; a filter leaves it on the channel", 1: "A selective consumer receives only matching messages, leaving the rest; a filter consumes everything and discards non-matches", 2: "A filter is configured at runtime while a selective consumer is not", 3: "There is no real difference between them" },
      optionNotes: ["That reverses their behavior.", "Correct — the selective consumer only takes matching messages (leaving others); a filter consumes all and drops non-matches.", "Configuration timing isn't the distinction.", "They are genuinely different patterns."]
    },
    "eip-804": {
      optionEdits: { 0: "Transactions simply cannot include any network operations", 1: "The request stays invisible inside the uncommitted transaction, so the replier never sees it and the completing reply can't arrive", 2: "Replies are by definition always non-transactional", 3: "Two channels are not allowed to join a single transaction" },
      optionNotes: ["Transactions can include messaging operations; that's not the issue.", "Correct — until commit the request isn't visible, so no reply comes, so the transaction can never complete: a deadlock.", "Replies can be transactional; that's not why this fails.", "The problem is the commit ordering, not a two-channel rule."]
    },
    "eip-805": {
      optionEdits: { 0: "A Selective Consumer", 1: "A Durable Subscriber", 2: "A Polling Consumer", 3: "A Messaging Gateway" },
      optionNotes: ["Selective Consumer filters by content, not downtime.", "Correct — a Durable Subscriber retains messages published while it was offline and delivers them on reconnect.", "Polling only changes how it reads, not retention during downtime.", "A Gateway hides messaging mechanics; it doesn't retain events."]
    },
    "eip-807": {
      optionEdits: { 0: "It compresses all outbound traffic for efficiency", 1: "It exposes a domain-shaped API hiding messaging mechanics, and gives a seam where a dummy makes the app testable without a broker", 2: "It guarantees exactly-once delivery of messages", 3: "It converts between two different message formats" },
      optionNotes: ["A Gateway isn't about compression.", "Correct — it wraps messaging behind a domain API and enables testing with a stub implementation.", "It doesn't provide exactly-once semantics.", "Format conversion is a Translator's job."]
    },
    "eip-808": {
      optionEdits: { 0: "A Messaging Mapper — map the service's objects to messages", 1: "A Service Activator — a component receives request messages, invokes the unchanged service, and replies", 2: "A Transactional Client — wrap the service call in a transaction", 3: "A Channel Adapter — connect the service's database to a channel" },
      optionNotes: ["A Mapper converts between objects and messages but doesn't invoke the service on messages.", "Correct — a Service Activator listens for messages and calls the existing service, so both callers work.", "A Transactional Client manages transactions, not message-triggered invocation.", "A Channel Adapter connects at the data/UI layer, bypassing the service."]
    },
    "eip-809": {
      optionEdits: { 0: "No problem — point-to-point channels preserve order across consumers", 1: "Order across consumers isn't guaranteed; use one consumer or a Dispatcher routing each customer's orders to the same performer", 2: "Duplicates will occur; add an Idempotent Receiver", 3: "The queue will overflow; add a Claim Check" },
      optionNotes: ["Competing consumers break per-customer ordering.", "Correct — to keep order, serialize per customer via a single consumer or a Dispatcher keyed by customer.", "The issue is ordering, not duplicates.", "It's an ordering problem, not a size problem."]
    },
    "eip-901": {
      optionEdits: { 0: "Add a second competing consumer for the monitoring tool", 1: "Insert a Wire Tap that republishes each message to both the destination and an inspection channel", 2: "Enable Guaranteed Delivery on the channel", 3: "Read the receiver's database instead of the channel" },
      optionNotes: ["A competing consumer would steal messages from the real receiver.", "Correct — a Wire Tap duplicates each message to an inspection channel without depriving the receiver.", "Guaranteed Delivery is about durability, not inspection.", "Reading the DB is indirect and misses in-flight messages."]
    },
    "eip-902": {
      optionEdits: { 0: "To hide the requestor's identity from the replier", 1: "So replies return to the proxy, which correlates each with its stored request, records metrics, and forwards it on", 2: "Because two Return Addresses cannot coexist in one header", 3: "To force the replier onto a faster channel" },
      optionNotes: ["Anonymity isn't the purpose.", "Correct — the Smart Proxy intercepts replies to measure and correlate them, then forwards to the real Return Address.", "It's about interception, not a header limitation.", "It isn't about channel speed."]
    },
    "eip-903": {
      optionEdits: { 0: "They are essentially synonyms", 1: "History: the path travelled, carried in each message's header. Store: a central copy of messages for analysis", 2: "History: a database of all messages. Store: a header field", 3: "Both require stopping the message flow to use" },
      optionNotes: ["They are different patterns.", "Correct — History travels in the message (its path); the Store is a central archive for cross-message reporting.", "That reverses the two.", "Neither requires halting the flow."]
    },
    "eip-905": {
      optionEdits: { 0: "A backup route used only when the primary channel fails", 1: "A control-bus-switched router that sends traffic either straight through or via extra validation/debugging steps", 2: "A router that randomly samples messages for QA", 3: "The dedicated channel used for dead letters" },
      optionNotes: ["A Detour isn't a failover route.", "Correct — a Detour can be toggled (via the control bus) to insert validation/debugging steps into the path.", "It's a switched insertion, not random sampling.", "It isn't the dead-letter channel."]
    },
    "eip-907": {
      optionEdits: { 0: "A Message Store", 1: "A Channel Purger", 2: "A Wire Tap", 3: "Message Expiration" },
      optionNotes: ["A Message Store archives messages; it doesn't clear a queue.", "Correct — a Channel Purger removes stale leftover messages before the run.", "A Wire Tap copies messages; it doesn't purge them.", "Expiration relies on per-message TTL, not a deliberate pre-run cleanup."]
    },
    "eip-908": {
      optionEdits: { 0: "Heartbeats simply need to run more frequently", 1: "Liveness monitoring can't verify correctness — inject Test Messages through the live path and check the answers", 2: "The component needs a durable subscription added", 3: "The control bus itself must have failed" },
      optionNotes: ["More frequent heartbeats still only prove liveness, not correctness.", "Correct — a green heartbeat says 'alive', not 'correct'; Test Messages verify actual output.", "Durable subscriptions are unrelated to correctness checking.", "The control bus isn't implicated by a wrong-output-but-alive component."]
    }
  }
};
