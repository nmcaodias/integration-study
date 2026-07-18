/* b6 — Message Routing (book ch. 7) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>The routing catalog</h3>
<p>Routers move messages to the right place without the sender knowing where that is. Ch. 7 climbs from simple routers to composed ones to architectural ones. Two axes to keep straight: <strong>stateless vs. stateful</strong> (most routers look at one message at a time; Aggregator and Resequencer must remember messages), and <strong>fixed vs. dynamic</strong> (is the routing rule wired in, configured, or learned at runtime?).</p>

<h3>Content-Based Router</h3>
<p>Examines a message and forwards it to <strong>exactly one</strong> of several channels based on its content (order type, region, amount). Centralizes the "who handles what" decision so senders stay ignorant of the specialization downstream. Keep the routing logic <em>maintainable and externally configurable</em> — it tends to change with the business.</p>
<p><em>In this app's world:</em> Mule's Choice router is a content-based router.</p>

<h3>Message Filter</h3>
<p>A router with <strong>one output channel and a binary decision</strong>: pass the message on, or drop it. Use it to subscribe broadly (e.g. to a pub-sub firehose) and keep only what you care about. A <em>stateful</em> variant drops duplicates (the flip side of Idempotent Receiver).</p>
<ul>
<li>Contrast with Content-Based Router: the CBR chooses <em>between destinations</em> and loses nothing; the filter has one destination and <em>discards</em> what doesn't qualify.</li>
<li>Broadcast + a filter at each recipient ("reactive filtering") is the decentralized alternative to one all-knowing CBR ("predictive routing") — more autonomy and easier to add recipients, at the cost of traffic and trust in each recipient's filter.</li>
</ul>

<h3>Dynamic Router</h3>
<p>A router whose rule base is <strong>built at runtime</strong>: potential recipients announce themselves (and their criteria) on a <strong>control channel</strong>, and the router stores those rules. You get CBR efficiency without maintaining the rules centrally — recipients self-register. The price: harder to reason about, since routing behavior emerges from whoever registered.</p>

<h3>Recipient List</h3>
<p>Inspects the message, <strong>computes a list of recipients</strong>, and sends a copy to each. It is the dynamic middle ground between a fixed pub-sub broadcast and a single-destination CBR — like the To: line of an e-mail.</p>

<h3>Splitter</h3>
<p>Breaks one composite message (an order with line items) into a <strong>series of individual messages</strong>, each processable on its own. Mark the pieces with Message Sequence fields (or a correlation id back to the original) if they must be recombined or tracked.</p>

<h3>Aggregator</h3>
<p>The reverse of the splitter — and the chapter's most demanding pattern, because it is <strong>stateful</strong>: it collects related messages and publishes one combined result. Every aggregator makes three design decisions:</p>
<ul>
<li><strong>Correlation</strong> — which incoming messages belong together? (usually a correlation id)</li>
<li><strong>Completeness condition</strong> — when is a group ready to publish? <em>Wait for all</em>; <em>timeout</em> (publish what arrived); <em>first best</em> (first acceptable answer wins); <em>timeout with override</em>; or an <em>external event</em>.</li>
<li><strong>Aggregation algorithm</strong> — how are the pieces condensed? (pick the best one, concatenate them, compute a summary…)</li>
</ul>
<p>Plan for the awkward cases: stragglers arriving after their group closed, and groups that never complete.</p>

<h3>Resequencer</h3>
<p>Parallel processing and competing consumers reorder messages. A <strong>Resequencer</strong> buffers out-of-order messages and re-emits them in order using their sequence numbers — stateful like the aggregator, but it <em>doesn't modify or combine</em> messages, only reorders them. Watch the buffer: a missing message can stall everything behind it (bound the buffer, or use timeouts).</p>

<h3>Composed Message Processor</h3>
<p>A composite: <strong>Splitter → (Content-Based) Router → parallel processors → Aggregator</strong>. Use it when the elements of one message each need different handling — split an order, route each line item to the right inventory system, and aggregate the answers into one reply.</p>

<h3>Scatter-Gather</h3>
<p>Send one message to <strong>multiple recipients</strong> (via Publish-Subscribe Channel or Recipient List) and <strong>aggregate their replies</strong> into one message. The auction shape: broadcast a quote request to vendors, gather bids, pick the best. Composed Message Processor and Scatter-Gather differ mainly in fan-out: split one message's parts vs. send the same message to many parties.</p>
<p><em>In this app's world:</em> Mule's Scatter-Gather router is this pattern with a wait-for-all aggregator built in.</p>

<h3>Routing Slip</h3>
<p>When each message needs its own <em>sequence</em> of processing steps, compute the itinerary up front and <strong>attach it to the message</strong>; each step does its work, marks itself done, and forwards to the next entry on the slip. Like a routing slip stapled to an office document.</p>
<ul>
<li>Great for: per-message step selection from a linear library of steps (validations, format conversions).</li>
<li>Limits: the route is fixed once attached, and it must be <strong>sequential</strong> — no branching on intermediate results, no parallelism, and a broken component can strand messages with their slips.</li>
</ul>

<h3>Process Manager</h3>
<p>When the flow needs <strong>branches decided mid-flight, parallel legs, or loops</strong>, a central Process Manager maintains the state of each process instance: it receives each intermediate result, consults its process definition, and dispatches the next step(s). This is hub-and-spoke orchestration — the engine behind BPM tools.</p>
<ul>
<li>Trade-offs vs. Routing Slip: maximal flexibility and central visibility, but a central point of state (and potential bottleneck) plus real design work — process definitions, instance correlation, crash recovery.</li>
<li>The progression to remember: fixed pipeline → Routing Slip (per-message linear route) → Process Manager (dynamic, branching, stateful orchestration).</li>
</ul>

<h3>Message Broker</h3>
<p>The architectural pattern of the chapter: a central component that <strong>receives messages from senders and routes them to the correct receivers</strong>, so applications know only the broker, not each other — hub-and-spoke instead of point-to-point spaghetti. A real broker is composed from the chapter's routers plus translators, usually normalizing to a Canonical Data Model at the hub. The risk to manage: the broker becoming a monolithic bottleneck that quietly accumulates business logic.</p>`;

const section = {
  id: "b6",
  title: "Message Routing",
  objectives: [
    "Choose among Content-Based Router, Message Filter, Recipient List, and Dynamic Router",
    "Split and recombine composite messages (Splitter, Aggregator) and restore order (Resequencer)",
    "Make the aggregator's three design decisions: correlation, completeness, algorithm",
    "Compose routers: Composed Message Processor and Scatter-Gather",
    "Pick the right process pattern: pipeline vs. Routing Slip vs. Process Manager, and explain the Message Broker architecture"
  ],
  notes,
  topicDocs: {
    "The routing catalog": P + "MessageRoutingIntro.html",
    "Content-Based Router": P + "ContentBasedRouter.html",
    "Message Filter": P + "Filter.html",
    "Dynamic Router": P + "DynamicRouter.html",
    "Recipient List": P + "RecipientList.html",
    "Splitter": P + "Sequencer.html",
    "Aggregator": P + "Aggregator.html",
    "Resequencer": P + "Resequencer.html",
    "Composed Message Processor": P + "DistributionAggregate.html",
    "Scatter-Gather": P + "BroadcastAggregate.html",
    "Routing Slip": P + "RoutingTable.html",
    "Process Manager": P + "ProcessManager.html",
    "Message Broker": P + "MessageBroker.html"
  }
};

const questions = [
  {
    id: "eip-601", section: "b6", level: "medium",
    q: "Which THREE design decisions must every Aggregator make?",
    options: [
      "Correlation — which incoming messages belong together",
      "Completeness — when a group is ready to publish",
      "Aggregation algorithm — how the collected messages are condensed into one",
      "Compression — how the result is encoded on the wire"
    ],
    answers: [0, 1, 2],
    explanation: "Correlation, completeness condition (wait-for-all, timeout, first-best, timeout-with-override, external event), and the aggregation algorithm are the aggregator's three defining choices. Wire encoding is not part of the pattern."
  },
  {
    id: "eip-602", section: "b6", level: "easy",
    q: "What distinguishes a Message Filter from a Content-Based Router?",
    options: [
      "A filter transforms the message; a router does not",
      "A filter has one output channel and discards non-matching messages; a router chooses among several outputs and discards nothing",
      "A filter is stateful; a router never is",
      "Nothing — they are two names for the same pattern"
    ],
    answer: 1,
    explanation: "The CBR always delivers the message somewhere — it picks the destination. The filter's decision is pass-or-drop on a single output. (A duplicate-eliminating filter is a stateful VARIANT, but statefulness isn't the defining difference.)"
  },
  {
    id: "eip-603", section: "b6", level: "hard",
    q: "A quote request must go to all approved vendors, and the best bid received within 30 seconds should be returned. Which pattern combination is this?",
    options: [
      "Splitter + Resequencer",
      "Scatter-Gather: broadcast (or Recipient List) + an Aggregator with a timeout completeness condition and a best-bid algorithm",
      "Content-Based Router + Message Filter",
      "Routing Slip through each vendor in sequence"
    ],
    answer: 1,
    explanation: "Send one message to many parties, gather replies, condense to one answer = Scatter-Gather. The 30-second window is the aggregator's timeout completeness condition; picking the best bid is its aggregation algorithm. A routing slip would visit vendors one after another — wrong shape entirely."
  },
  {
    id: "eip-604", section: "b6", level: "medium",
    q: "When does the book steer you from a Routing Slip to a Process Manager? (Choose TWO.)",
    options: [
      "When the path must branch based on intermediate processing results",
      "When steps must run in parallel and be joined later",
      "When the steps are known before processing starts and are strictly sequential",
      "When there are more than three steps"
    ],
    answers: [0, 1],
    explanation: "The routing slip is fixed at the start and strictly linear — exactly the case option C describes, where it shines. Mid-flight branching and parallel legs need central state per process instance, which is the Process Manager's job. Step count alone is irrelevant."
  },
  {
    id: "eip-605", section: "b6", level: "medium",
    q: "What makes the Aggregator and Resequencer different from most other routers in this chapter?",
    options: [
      "They modify message bodies",
      "They are stateful — they must store messages across deliveries before they can emit output",
      "They require publish-subscribe channels",
      "They can only be implemented in a broker, never in an application"
    ],
    answer: 1,
    explanation: "A CBR or filter can decide per message and forget. The aggregator holds partial groups and the resequencer buffers out-of-order messages — both must manage state, which brings persistence, memory, and never-completing-group concerns. (The resequencer, notably, does NOT modify messages — it only reorders them.)"
  },
  {
    id: "eip-606", section: "b6", level: "hard",
    q: "How does a Dynamic Router learn where to send messages?",
    options: [
      "It broadcasts every message and measures which recipient answers fastest",
      "Potential recipients announce their criteria on a control channel, and the router stores these rules in its rule base",
      "An administrator edits its configuration file for each new recipient",
      "It reads the recipient from each message's Return Address"
    ],
    answer: 1,
    explanation: "The defining feature is self-registration: recipients publish their routing criteria to the router's control channel at startup (or on change), so routing stays efficient like a CBR without centrally maintained rules."
  },
  {
    id: "eip-607", section: "b6", level: "medium",
    q: "An order containing many line items must have each item checked by a different inventory system, with one confirmation returned. Which composite pattern is this?",
    options: [
      "Scatter-Gather",
      "Composed Message Processor — split the order, route each item, aggregate the results",
      "Message Broker",
      "Dynamic Router"
    ],
    answer: 1,
    explanation: "The elements of ONE message need different handling: Splitter breaks the order apart, a router sends each item to the right system, an Aggregator reassembles one reply. Scatter-Gather instead sends the SAME message to multiple parties."
  },
  {
    id: "eip-608", section: "b6", level: "medium",
    q: "What is the architectural promise of a Message Broker, and its main risk?",
    options: [
      "Promise: no middleware needed; risk: message loss",
      "Promise: senders and receivers know only the hub, ending point-to-point spaghetti; risk: the broker becomes a monolithic bottleneck accumulating business logic",
      "Promise: guaranteed ordering; risk: slow consumers",
      "Promise: automatic schema evolution; risk: vendor lock-in"
    ],
    answer: 1,
    explanation: "Hub-and-spoke decouples every application from every other — at the price of centralization: the hub must scale, stay available, and be governed so integration logic doesn't quietly turn into business logic nobody owns."
  },
  {
    id: "eip-609", section: "b6", level: "hard",
    q: "A resequencer sits behind three competing consumers. Message #17 is lost upstream. What is the operational risk?",
    options: [
      "Messages #18 and beyond are delivered twice",
      "The resequencer buffers everything after #16 indefinitely, stalling the stream and growing its buffer",
      "The resequencer reorders #18 in front of #16",
      "Nothing — resequencers handle gaps transparently"
    ],
    answer: 1,
    explanation: "A resequencer cannot emit #18 before #17 without violating order, so a permanent gap stalls the stream and fills the buffer. Real designs bound the buffer and use timeouts or gap-skipping rules — the same never-complete problem the aggregator faces."
  }
];

module.exports = { section, questions };
