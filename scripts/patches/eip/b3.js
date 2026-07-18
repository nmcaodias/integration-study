/* b3 — Messaging Systems: the six root patterns (book ch. 3) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>The six root patterns</h3>
<p>Ch. 3 introduces the six patterns every other chapter elaborates. Together they answer the basic questions of any messaging solution:</p>
<table>
<tr><th>Question</th><th>Root pattern</th><th>Elaborated in</th></tr>
<tr><td>How do applications connect?</td><td>Message Channel</td><td>Messaging Channels (ch. 4)</td></tr>
<tr><td>What do they exchange?</td><td>Message</td><td>Message Construction (ch. 5)</td></tr>
<tr><td>How do we chain processing steps?</td><td>Pipes and Filters</td><td>— (architectural style)</td></tr>
<tr><td>How does a message find its way?</td><td>Message Router</td><td>Message Routing (ch. 7)</td></tr>
<tr><td>How do formats get reconciled?</td><td>Message Translator</td><td>Message Transformation (ch. 8)</td></tr>
<tr><td>How does an app touch the messaging system?</td><td>Message Endpoint</td><td>Messaging Endpoints (ch. 10)</td></tr>
</table>

<h3>Message Channel</h3>
<p>Applications don't magically find each other's data: the sender writes to a <strong>channel</strong>, a named, logical address inside the messaging system, and the receiver reads from it. Channels are cheap but not free (each needs memory/disk and administration), and the set of channels tends to be <strong>designed up front</strong> — an application's channel layout is its messaging API.</p>
<ul>
<li>Channels are <strong>unidirectional</strong> and <strong>typed by agreement</strong>: everyone on a channel knows what kind of messages travel there (see Datatype Channel).</li>
<li>The two fundamental kinds — <strong>Point-to-Point</strong> (one receiver consumes each message) and <strong>Publish-Subscribe</strong> (every subscriber gets a copy) — are the subject of ch. 4.</li>
</ul>

<h3>Message</h3>
<p>A <strong>message</strong> is the atomic unit the channel transmits: a <strong>header</strong> (routing/handling metadata used by the messaging system) plus a <strong>body</strong> (the payload, opaque to the messaging system). Any data becomes a message when the sender packages it; what the message <em>means</em> — a command, a document, or an event — is the sender's declaration of intent (ch. 5).</p>
<ul>
<li>Large data travels as a <strong>sequence</strong> of messages (Message Sequence) or by reference (Claim Check).</li>
<li>Messages that can no longer be useful can be given an <strong>expiration</strong> (Message Expiration).</li>
</ul>

<h3>Pipes and Filters</h3>
<p>One delivery often needs several independent steps (decrypt, de-duplicate, authenticate, transform). <strong>Pipes and Filters</strong> chains self-contained processing steps (<strong>filters</strong>) with channels (<strong>pipes</strong>) so each step reads a message, works, and writes the result onward.</p>
<ul>
<li><strong>Composability</strong> is the payoff: steps can be added, removed, and reordered without touching the others, because every filter exposes the same interface — messages in, messages out.</li>
<li>Independent filters can run on <strong>different machines</strong> and be <strong>scaled individually</strong> (run three instances of the slow step — order across a chain then goes away unless restored with a Resequencer).</li>
<li>The cost: each pipe adds queuing/serialization overhead, and end-to-end debugging spans multiple components (ch. 11's patterns help).</li>
</ul>

<h3>Message Router</h3>
<p>A <strong>Message Router</strong> is a filter whose job is purely to decide <em>which channel gets the message next</em> — it consumes from one channel and republishes, unmodified, to one of several output channels based on a condition. Routing concentrates the "where does this go" knowledge in one place instead of burdening every sender.</p>
<ul>
<li>Routers decouple senders from destinations, but a landscape stitched together by many routers can obscure the overall flow — Message History (ch. 11) is the antidote.</li>
<li>Ch. 7 catalogs the varieties: content-based, filtering, dynamic, fan-out (Recipient List), splitters/aggregators, and process-level coordination.</li>
</ul>

<h3>Message Translator</h3>
<p>Applications rarely agree on data formats, and integration must not force them to. A <strong>Message Translator</strong> sits between endpoints and converts one message format into another. Translation happens at distinct <strong>levels</strong>, and a real transformer often works at several at once:</p>
<table>
<tr><th>Level</th><th>Deals with</th><th>Example</th></tr>
<tr><td>Transport</td><td>How bytes move</td><td>JMS ↔ HTTP</td></tr>
<tr><td>Data representation</td><td>How data is encoded</td><td>XML ↔ JSON ↔ fixed-width, encryption, compression</td></tr>
<tr><td>Data types</td><td>Field types and domains</td><td>date string ↔ epoch, "M/F" ↔ boolean</td></tr>
<tr><td>Data structure</td><td>Entities and relationships</td><td>one customer record ↔ header + detail records</td></tr>
</table>
<p><em>In this app's world:</em> DataWeave is a Message Translator engine — one <code>transform</code> step usually reconciles representation, types, and structure in a single script.</p>

<h3>Message Endpoint</h3>
<p>Applications don't speak "messaging" natively. A <strong>Message Endpoint</strong> is the code that connects an application to the messaging system — it encapsulates sending/receiving so the rest of the application stays messaging-unaware. An endpoint is either a sender or a receiver; ch. 10 catalogs the receiving disciplines (polling vs. event-driven, competing vs. dispatched, durable, idempotent, transactional).</p>
<ul>
<li>Keeping messaging knowledge inside endpoints means the messaging layer can change without rewriting the application — the same motivation as a data-access layer for databases.</li>
<li>Connector operations and listeners in Mule, and producers/consumers in Kafka clients, are exactly this pattern: the endpoint code the application links against.</li>
</ul>`;

const section = {
  id: "b3",
  title: "Messaging Systems",
  objectives: [
    "Name the six root patterns and the question each answers",
    "Explain channels as designed, logical, typed addresses",
    "Describe Pipes and Filters and what composability buys",
    "Distinguish a router (redirects unmodified) from a translator (changes format)",
    "Explain the four levels of transformation and the endpoint's encapsulation role"
  ],
  notes,
  topicDocs: {
    "The six root patterns": P + "MessagingComponentsIntro.html",
    "Message Channel": P + "MessageChannel.html",
    "Message": P + "Message.html",
    "Pipes and Filters": P + "PipesAndFilters.html",
    "Message Router": P + "MessageRouter.html",
    "Message Translator": P + "MessageTranslator.html",
    "Message Endpoint": P + "MessageEndpoint.html"
  }
};

const questions = [
  {
    id: "eip-301", section: "b3", level: "easy",
    q: "What are the two parts of a message, and who uses each?",
    options: [
      "Header (used by the messaging system) and body (payload the messaging system ignores)",
      "Envelope (used by the sender) and letter (used by the receiver)",
      "Key and value, both used only by the receiver",
      "Header (used by the receiver) and body (used by the messaging system for routing)"
    ],
    answer: 0,
    explanation: "The header carries the metadata the messaging system needs to move the message (destination, ids, expiration); the body is the application payload, which the messaging system treats as opaque bytes."
  },
  {
    id: "eip-302", section: "b3", level: "medium",
    q: "What distinguishes a Message Router from a general filter in a pipes-and-filters chain?",
    options: [
      "A router transforms the message body into the destination's format",
      "A router consumes from one channel and republishes the message unmodified to one of several output channels",
      "A router merges several input channels into one output message",
      "A router persists messages for auditing"
    ],
    answer: 1,
    explanation: "A router's only job is deciding the next channel — it does not modify the message. Changing content is the translator's job; merging messages is the aggregator's."
  },
  {
    id: "eip-303", section: "b3", level: "medium",
    q: "Which THREE benefits does the Pipes and Filters style provide?",
    options: [
      "Steps can be added, removed, or reordered without changing the other steps",
      "Individual steps can be scaled by running multiple instances",
      "End-to-end latency is always lower than doing everything in one component",
      "Steps can be distributed across machines"
    ],
    answers: [0, 1, 3],
    explanation: "The uniform interface (messages in, messages out) makes filters composable, individually scalable, and distributable. Latency is the trade-off, not a benefit — every pipe adds queuing and serialization overhead."
  },
  {
    id: "eip-304", section: "b3", level: "hard",
    q: "An XML order document must become a fixed-width mainframe record: dates reformatted from ISO to YYYYDDD, and the customer's nested address flattened into the record. Which transformation levels are involved? (Choose THREE.)",
    options: [
      "Data representation (XML to fixed-width)",
      "Data types (ISO date to YYYYDDD)",
      "Data structure (nested address flattened)",
      "Transport (the wire protocol changes)"
    ],
    answers: [0, 1, 2],
    explanation: "Representation covers the encoding (XML vs. fixed-width), types cover individual field formats (the date), and structure covers reshaping entities (flattening the nested address). Nothing in the scenario says the transport changed."
  },
  {
    id: "eip-305", section: "b3", level: "medium",
    q: "Why does the book insist applications talk to the messaging system only through Message Endpoints?",
    options: [
      "Endpoints compress messages to save bandwidth",
      "Encapsulating messaging code in one layer keeps the application messaging-unaware, so the messaging details can change without rewriting the app",
      "The messaging system refuses direct connections for security reasons",
      "Endpoints are required to make messages transactional"
    ],
    answer: 1,
    explanation: "It's the same argument as a data-access layer: isolate the specialized API in one place. The application calls its own methods; the endpoint code turns those into sends and receives."
  },
  {
    id: "eip-306", section: "b3", level: "easy",
    q: "In messaging terms, what is a channel?",
    options: [
      "A physical TCP connection between two machines",
      "A named, logical address inside the messaging system that senders write to and receivers read from",
      "A thread pool that processes messages",
      "A database table holding pending work"
    ],
    answer: 1,
    explanation: "Channels are logical addresses, decoupled from physical machines. The sender knows the channel name and the message format — not who reads it or where they run."
  },
  {
    id: "eip-307", section: "b3", level: "hard",
    q: "Three instances of a slow enrichment filter are deployed to drain a backlog. What consequence should the designer anticipate?",
    options: [
      "Messages will be duplicated three times downstream",
      "Messages may leave the enrichment step in a different order than they arrived",
      "The upstream pipe will reject concurrent consumers",
      "The messages' bodies will be merged"
    ],
    answer: 1,
    explanation: "Parallel instances process at different speeds, so completion order diverges from arrival order. If downstream steps need the original order, a Resequencer must restore it — a classic pipes-and-filters trade-off."
  },
  {
    id: "eip-308", section: "b3", level: "medium",
    q: "Which root pattern answers the question \"how can systems using different data formats communicate\"?",
    options: ["Message Channel", "Message Router", "Message Translator", "Message Endpoint"],
    answer: 2,
    explanation: "The translator converts between message formats so neither side must adopt the other's. Routers move messages unchanged, channels connect, endpoints attach applications to the messaging system."
  }
];

module.exports = { section, questions };
