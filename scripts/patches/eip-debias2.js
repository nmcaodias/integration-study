/* EIP de-bias · chapters b4–b6. */
module.exports = {
  questions: {
    "eip-401": {
      optionEdits: { 0: "The Dead Letter Channel, and the messaging system decides", 1: "The Invalid Message Channel, and the receiving application decides based on content", 2: "Back to the sender's channel for automatic correction", 3: "It should simply be discarded to keep the queue clean" },
      optionNotes: ["Dead Letter is for system-level delivery failures, not content the app judges invalid.", "Correct — the application routes content it can't process to the Invalid Message Channel.", "There's no automatic sender-side correction.", "Discarding loses the message and its diagnostic value."]
    },
    "eip-403": {
      optionEdits: { 0: "A Point-to-Point Channel to each service", 1: "A Publish-Subscribe Channel for the event", 2: "A Dead Letter Channel for the event", 3: "A Datatype Channel per message type" },
      optionNotes: ["Point-to-point delivers to one consumer, not all five.", "Correct — pub-sub delivers a copy of each event to every interested subscriber.", "Dead Letter is for undeliverable messages.", "Datatype channels segregate by type, not fan-out to many."]
    },
    "eip-404": {
      optionEdits: { 0: "It encrypts messages in transit; the cost is extra CPU", 1: "It persists messages to disk at each hop so they survive broker crashes; the cost is performance", 2: "It adds automatic ordering of messages; the cost is throughput", 3: "It guarantees the receiver processes each message exactly once; the cost is duplicate detection" },
      optionNotes: ["Guaranteed Delivery is about durability, not encryption.", "Correct — messages are written to disk so a crash doesn't lose them, at a throughput cost.", "It doesn't add ordering.", "It ensures delivery, not exactly-once processing."]
    },
    "eip-405": {
      optionEdits: { 0: "A user-interface adapter; caveat: it is actually the most robust option", 1: "A database adapter; caveat: it bypasses the application's business logic", 2: "A business-logic adapter; caveat: it needs source-code access", 3: "A messaging bridge; caveat: it requires a second broker" },
      optionNotes: ["UI-level adapters are the most fragile, not the most robust.", "Correct — going at the database skips the app's validations and business rules, the key caveat.", "There's no code access here — only the schema is documented.", "A bridge connects two messaging systems, not an app with no API."]
    },
    "eip-407": {
      optionEdits: { 0: "So the messaging system validates the payload's schema for you", 1: "So the receiver knows from the channel alone how to interpret every message it gets", 2: "To increase the total throughput of the system", 3: "Because publish-subscribe channels require one type each" },
      optionNotes: ["The channel doesn't perform schema validation.", "Correct — one type per channel lets the receiver infer meaning from the channel itself.", "It isn't a throughput optimization.", "Pub-sub doesn't require one type per channel."]
    },
    "eip-408": {
      optionEdits: { 0: "A Message Bus — replace both systems with one new broker", 1: "A Messaging Bridge — paired adapters forwarding messages between the two systems' channels", 2: "A Channel Adapter — connect MSMQ directly to the JMS applications", 3: "A Datatype Channel — one channel per company" },
      optionNotes: ["You don't rip-and-replace both brokers after a merger.", "Correct — a Messaging Bridge links the two brokers, forwarding between corresponding channels.", "A Channel Adapter connects an app to messaging, not two brokers together.", "Datatype channels don't bridge separate messaging systems."]
    },
    "eip-501": {
      optionEdits: { 0: "A Command Message", 1: "A Document Message", 2: "An Event Message", 3: "A Request Message" },
      optionNotes: ["A command tells a specific receiver to act; this just announces a fact.", "A document message transfers data without implying a reaction.", "Correct — 'OrderShipped' announces something happened for any interested subscriber: an event.", "A request expects a reply; an event doesn't."]
    },
    "eip-502": {
      optionEdits: { 0: "Replies always arrive in the same order the requests were sent", 1: "The reply carries a correlation identifier — the request's unique id, copied over by the replier", 2: "The reply repeats the full original request body for matching", 3: "Each reply arrives on a channel named after the request's timestamp" },
      optionNotes: ["Reply ordering isn't guaranteed, so order can't identify the request.", "Correct — the Correlation Identifier ties a reply back to its specific request.", "Echoing the whole body is wasteful and unnecessary.", "Timestamp-named channels aren't how correlation works."]
    },
    "eip-503": {
      optionEdits: { 0: "It encrypts the reply destination for security", 1: "Different requestors need replies on different channels, and the replier shouldn't be coupled to any", 2: "The messaging system requires it to route the request itself", 3: "It lets the reply skip the messaging system entirely" },
      optionNotes: ["Return Address is about decoupling, not encryption.", "Correct — the requestor names its own reply channel, so the replier stays decoupled from it.", "The request routes without it; the address is for the reply.", "Replies still go through the messaging system."]
    },
    "eip-505": {
      optionEdits: { 0: "One bidirectional channel carrying both the request and the reply", 1: "A pair of one-way messages: a request on one channel and a reply on another", 2: "A synchronous RPC call tunneled through the broker", 3: "A single message that carries two separate bodies" },
      optionNotes: ["Channels are one-way; request-reply uses two of them.", "Correct — it's two one-way messages over two channels, request and reply.", "It isn't a tunneled synchronous RPC.", "It's two messages, not one message with two bodies."]
    },
    "eip-506": {
      optionEdits: { 0: "Set a Message Expiration; the system discards or dead-letters it instead of delivering stale", 1: "Add a timestamp and let every receiver check freshness itself", 2: "Use Guaranteed Delivery so the quote always eventually arrives", 3: "Resend the quote every 30 seconds and let duplicates accumulate" },
      optionNotes: ["Correct — Message Expiration lets the system drop/dead-letter a message that's no longer timely.", "Pushing freshness checks onto every receiver duplicates effort and is error-prone.", "Guaranteed Delivery ensures arrival, not timeliness — it can still be stale.", "Flooding with resends creates duplicates without solving staleness."]
    },
    "eip-507": {
      optionEdits: { 0: "Events are not permitted to carry any data at all", 1: "What matters is the timely fact that something happened; subscribers can fetch details on demand", 2: "Empty message bodies compress more efficiently", 3: "Publish-subscribe channels enforce a small size limit" },
      optionNotes: ["Events may carry data; a minimal body is a choice, not a rule.", "Correct — the notification's value is the timely fact; details can be pulled if needed.", "Compression isn't the reason.", "Pub-sub doesn't impose a tiny size limit."]
    },
    "eip-602": {
      optionEdits: { 0: "A filter transforms the message body while a router does not", 1: "A filter has one output and discards non-matching messages; a router picks among outputs and discards nothing", 2: "A filter is stateful while a router is never stateful", 3: "Nothing — they are two names for the same pattern" },
      optionNotes: ["Neither transforms the body; that's a Translator.", "Correct — a Message Filter drops what doesn't match; a Content-Based Router redirects everything to a chosen output.", "Statefulness isn't the distinction.", "They are distinct patterns."]
    },
    "eip-603": {
      optionEdits: { 0: "A Splitter followed by a Resequencer", 1: "Scatter-Gather: broadcast (or Recipient List) plus an Aggregator with a timeout and a best-bid rule", 2: "A Content-Based Router feeding a Message Filter", 3: "A Routing Slip visiting each vendor in sequence" },
      optionNotes: ["Splitter/Resequencer handles one message's parts, not parallel vendor bids.", "Correct — broadcast to vendors, then aggregate the best bid within a timeout: Scatter-Gather.", "Router+filter selects a path; it doesn't collect competing replies.", "A Routing Slip is sequential, not a parallel solicitation."]
    },
    "eip-605": {
      optionEdits: { 0: "They modify the bodies of the messages they handle", 1: "They are stateful — they must store messages across deliveries before emitting output", 2: "They require publish-subscribe channels to work", 3: "They can only ever be implemented inside a broker" },
      optionNotes: ["They don't alter bodies.", "Correct — Aggregator and Resequencer hold messages (state) until they can emit a result.", "They don't require pub-sub.", "They can live in an application, not only a broker."]
    },
    "eip-606": {
      optionEdits: { 0: "It broadcasts every message and measures which recipient answers fastest", 1: "Recipients announce their criteria on a control channel, and the router stores these in its rule base", 2: "An administrator edits its configuration file for each new recipient", 3: "It reads the target from each message's Return Address field" },
      optionNotes: ["It doesn't race recipients by speed.", "Correct — a Dynamic Router builds its rule base from recipients' self-announced criteria on a control channel.", "The point is to avoid manual reconfiguration per recipient.", "Return Address is for replies, not dynamic routing rules."]
    },
    "eip-607": {
      optionEdits: { 0: "A plain Scatter-Gather", 1: "A Composed Message Processor — split the order, route each item, aggregate the results", 2: "A Message Broker hub", 3: "A Dynamic Router" },
      optionNotes: ["Scatter-Gather broadcasts one message; here the order is split into items first.", "Correct — split, route each item to the right inventory system, then aggregate into one confirmation.", "A broker is a hub topology, not this split/route/aggregate composite.", "A Dynamic Router chooses a destination; it doesn't split and aggregate."]
    },
    "eip-608": {
      optionEdits: { 0: "Promise: no middleware needed; risk: message loss", 1: "Promise: senders/receivers know only the hub, ending point-to-point spaghetti; risk: the hub becomes a bottleneck accreting logic", 2: "Promise: guaranteed ordering; risk: slow consumers stall it", 3: "Promise: automatic schema evolution; risk: vendor lock-in" },
      optionNotes: ["A broker IS middleware; that's not its promise.", "Correct — the hub decouples endpoints but risks becoming a monolithic bottleneck full of business logic.", "Ordering isn't the broker's headline promise.", "Schema evolution isn't what a broker guarantees."]
    },
    "eip-609": {
      optionEdits: { 0: "Messages #18 and beyond get delivered twice each", 1: "It buffers everything after #16 indefinitely, stalling the stream and growing its buffer", 2: "It reorders #18 ahead of the missing #16", 3: "Nothing — resequencers handle gaps transparently" },
      optionNotes: ["A lost message doesn't cause duplicates downstream.", "Correct — waiting for the missing #17, the resequencer buffers indefinitely and stalls.", "It won't emit #18 before #17 arrives — that's the whole problem.", "Gaps are exactly what a resequencer can't handle transparently."]
    }
  }
};
