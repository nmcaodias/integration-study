/* EIP de-bias · chapters b1–b3. Distractors made plausible/parallel; over-long
 * correct options trimmed; per-option notes added. Answers unchanged. */
module.exports = {
  questions: {
    "eip-101": {
      optionEdits: { 0: "The sender deletes the message after sending so it can no longer be traced anywhere", 1: "The sender puts the message on a channel and continues; the system delivers it, retrying if needed", 2: "The sender broadcasts the message to every application at once and simply ignores any errors", 3: "The message is delivered only if the receiver happens to be online at the moment of sending" },
      optionNotes: ["'Forget' doesn't mean delete or untraceable; the system still handles delivery.", "Correct — the sender hands off to the channel and moves on; the messaging system ensures delivery.", "It isn't broadcast-and-ignore-errors; delivery is reliable, not fire-blind.", "The message is held and retried, so the receiver needn't be online at send time."]
    },
    "eip-103": {
      optionEdits: { 0: "A long-term message archive kept purely for auditing and reporting", 1: "The system persists a message at each hop and retries delivery until it succeeds", 2: "The sender keeps a copy of every message until the receiver acknowledges it in app code", 3: "Forwarding all messages to a backup data center for resilience" },
      optionNotes: ["Store-and-forward is about reliable transit, not an audit archive.", "Correct — each hop persists then forwards, retrying until the next hop accepts it.", "The messaging system (not the application) holds and retries the message.", "It isn't about data-center replication."]
    },
    "eip-105": {
      optionEdits: { 0: "An Information Portal aggregation", 1: "A Data Replication problem", 2: "A Shared Business Function", 3: "A Business-to-Business integration" },
      optionNotes: ["A portal aggregates data for viewing; this is about invoking shared logic.", "Data replication copies data; here systems call one shared operation.", "Correct — one 'credit check' invoked by many systems is a shared business function.", "B2B spans organizations; this is an internal shared function."]
    },
    "eip-106": {
      optionEdits: { 0: "Propagating an address change to five downstream systems as it happens", 1: "Letting a warehouse keep accepting orders while the ERP is down for maintenance", 2: "A one-time migration of an entire 2 TB customer database into a new system", 3: "Smoothing bursty request traffic in front of a slow legacy system" },
      optionNotes: ["Incremental propagation of small changes is a messaging sweet spot.", "Buffering during outages is exactly where messaging shines.", "Correct — bulk one-time data movement suits File Transfer/ETL, not message-by-message.", "Throttling bursts is a classic messaging use."]
    },
    "eip-107": {
      optionEdits: { 0: "Messages cannot carry structured data, so state must live in a database", 1: "The sender's execution context is gone when the reply arrives, so needed state must travel in the messages", 2: "The messaging system caps message depth to prevent runaway recursion", 3: "Handlers therefore have to be written in a stackless language" },
      optionNotes: ["Messages carry structured data fine; the point is the lost context.", "Correct — with no call stack, any state a reply depends on must be carried in the messages themselves.", "There's no such recursion-depth cap involved.", "No special stackless language is required."]
    },
    "eip-108": {
      optionEdits: { 0: "Using as few integration points between systems as possible", 1: "Minimizing the assumptions integrated applications make about each other", 2: "Always preferring asynchronous communication over synchronous", 3: "Encrypting data so applications cannot inspect each other's messages" },
      optionNotes: ["Coupling is about assumptions, not the count of integration points.", "Correct — loose coupling means each side assumes as little as possible about the other.", "Async helps but isn't the definition of loose coupling.", "Encryption is unrelated to coupling."]
    },
    "eip-201": {
      optionEdits: { 0: "File Transfer between the applications", 1: "A Shared Database all applications use", 2: "Remote Procedure Invocation between them", 3: "Messaging over a broker" },
      optionNotes: ["File Transfer leaves consumers with stale, batch-delayed data.", "Correct — a shared database gives instant consistency but forces one agreed schema on everyone.", "RPC shares behavior, not one consistent data store.", "Messaging decouples formats and doesn't impose one schema."]
    },
    "eip-202": {
      optionEdits: { 0: "It requires expensive specialized middleware to run", 1: "Data timeliness — consumers work with stale data between batch exports", 2: "It cannot cross operating-system or platform boundaries", 3: "Files are unable to represent richly structured data" },
      optionNotes: ["File Transfer needs no special middleware — that's part of its appeal.", "Correct — the main weakness is staleness: data is only as fresh as the last batch.", "Files cross platforms easily; that's a strength.", "Files can carry structured data (XML, etc.)."]
    },
    "eip-204": {
      optionEdits: { 0: "That remote calls are inherently secure because they cross process boundaries", 1: "That a remote call can be treated like a local one, hiding that it is far slower and can fail differently", 2: "That every remote interface is automatically versioned for you", 3: "That the callee may process incoming calls in any order it likes" },
      optionNotes: ["The illusion isn't about security.", "Correct — RPC makes a remote call look local, masking latency and new failure modes.", "RPC doesn't auto-version interfaces.", "Ordering isn't the illusion the book warns about."]
    },
    "eip-205": {
      optionEdits: { 0: "File Transfer of shared data", 1: "A Shared Database of record", 2: "Remote Procedure Invocation", 3: "A shared network drive" },
      optionNotes: ["File Transfer shares data, not functionality.", "A shared database shares data while breaking encapsulation.", "Correct — RPC shares functionality while each system keeps its own data encapsulated.", "A shared drive is just file sharing."]
    },
    "eip-206": {
      optionEdits: { 0: "It is the only style that needs no agreement on data format at all", 1: "It offers timely exchange like RPC, decoupled formats via transformation, and no need for both sides up at once", 2: "It is always the cheapest style to build and operate", 3: "It removes the need for any middleware whatsoever" },
      optionNotes: ["Messaging still coordinates formats (often via transformation).", "Correct — it blends RPC's timeliness, format decoupling, and availability decoupling.", "Cost isn't the book's argument.", "Messaging relies on middleware (the broker)."]
    },
    "eip-207": {
      optionEdits: { 0: "Shared Database — so everyone sees the change instantly", 1: "File Transfer — export a price file every night for each system", 2: "Messaging — publish a price-change message; consumers stay decoupled in format and availability", 3: "RPC — call each of the 12 systems' update functions in sequence" },
      optionNotes: ["A shared database forces one schema and couples releases together.", "Nightly files are far too slow for a one-minute requirement.", "Correct — publish once; each consumer reacts decoupled, unable to block the pricing team.", "Sequential RPC couples the producer to every consumer's availability."]
    },
    "eip-208": {
      optionEdits: { 0: "File Transfer > Messaging > Shared Database", 1: "Shared Database ≈ Messaging > File Transfer", 2: "File Transfer > Shared Database > Messaging", 3: "All three offer essentially the same timeliness" },
      optionNotes: ["File Transfer is the least timely, not the most.", "Correct — shared DB and messaging are near-immediate; file transfer lags by its batch interval.", "This inverts the ranking.", "Their timeliness differs markedly."]
    },
    "eip-301": {
      optionEdits: { 0: "Header (used by the messaging system) and body (payload the system ignores)", 1: "Envelope (used by the sender) and letter (used by the receiver)", 2: "Key and value, both used only by the receiver", 3: "Header (used by the receiver) and body (used by the system for routing)" },
      optionNotes: ["Correct — the header carries system metadata; the body is the payload the system doesn't interpret.", "That's an analogy, not the header/body split the book defines.", "A message isn't just a key/value used by the receiver.", "This reverses the roles — the system uses the header, not the body, for routing."]
    },
    "eip-302": {
      optionEdits: { 0: "A router transforms the message body into the destination's format", 1: "A router consumes from one channel and republishes the message unmodified to one of several outputs", 2: "A router merges several input channels into a single output message", 3: "A router persists messages to disk for later auditing" },
      optionNotes: ["Transforming the body is a Message Translator's job, not a router's.", "Correct — a router redirects a message unchanged to one of several output channels.", "Merging inputs is an Aggregator's job.", "Persisting for audit isn't routing."]
    },
    "eip-305": {
      optionEdits: { 0: "Endpoints compress messages to save network bandwidth", 1: "Encapsulating messaging code in one layer keeps the app messaging-unaware, so details can change without rewrites", 2: "The messaging system refuses direct connections for security reasons", 3: "Endpoints are required to make any message transactional" },
      optionNotes: ["Endpoints aren't about compression.", "Correct — endpoints isolate messaging code so the app stays unaware and the plumbing can change freely.", "The system doesn't forbid direct connections; endpoints are a design choice.", "Transactions don't require the endpoint abstraction."]
    },
    "eip-306": {
      optionEdits: { 0: "A physical TCP connection between two specific machines", 1: "A named, logical address in the messaging system that senders write to and receivers read from", 2: "A thread pool that processes incoming messages", 3: "A database table that holds pending work items" },
      optionNotes: ["A channel is logical, not a physical TCP link.", "Correct — a channel is a named logical address that connects senders and receivers.", "It isn't a thread pool.", "It isn't a database table."]
    },
    "eip-307": {
      optionEdits: { 0: "Messages will be duplicated three times to the downstream step", 1: "Messages may leave the enrichment step in a different order than they arrived", 2: "The upstream pipe will refuse to serve concurrent consumers", 3: "The messages' bodies will be silently merged together" },
      optionNotes: ["Competing consumers don't duplicate each message.", "Correct — parallel consumers can finish out of order, so ordering across the step isn't preserved.", "A pipe happily serves multiple competing consumers.", "Bodies aren't merged by parallel processing."]
    },
    "eip-308": {
      optionEdits: { 0: "The Message Channel pattern", 1: "The Message Router pattern", 2: "The Message Translator pattern", 3: "The Message Endpoint pattern" },
      optionNotes: ["A channel moves messages; it doesn't reconcile formats.", "A router redirects; it doesn't translate formats.", "Correct — the Message Translator bridges systems that use different data formats.", "An endpoint connects an app to the system; it doesn't translate."]
    }
  }
};
