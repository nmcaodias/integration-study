/* b1 — Messaging Foundations (book Introduction + ch. 1) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>What is messaging?</h3>
<p><strong>Messaging</strong> is a technology for high-speed, asynchronous, program-to-program communication with reliable delivery. Programs communicate by sending packets of data called <strong>messages</strong> to each other through <strong>channels</strong> (also called queues) — logical pathways that connect the programs. A sender writes a message to a channel and moves on (<em>send and forget</em>); the <strong>messaging system</strong> (message-oriented middleware, MOM) takes responsibility for moving the message to the receiver, retrying behind the scenes until it succeeds — much like e-mail for programs.</p>
<ul>
<li>A <strong>message</strong> has two parts: a <strong>header</strong> (metadata the messaging system uses: origin, destination, ids) and a <strong>body</strong> (the payload, which the messaging system ignores).</li>
<li>The messaging system is to messaging what a database is to data: dedicated infrastructure that does one job — <em>move messages reliably</em> — so applications don't have to.</li>
<li>The five messaging concepts the whole book builds on: <strong>channels</strong>, <strong>messages</strong>, <strong>pipes and filters</strong> (multi-step delivery), <strong>routing</strong>, <strong>transformation</strong>, plus <strong>endpoints</strong> that connect applications to it all.</li>
</ul>

<h3>Why use messaging?</h3>
<p>Compared with the alternatives (file transfer, shared database, RPC), messaging buys you:</p>
<ul>
<li><strong>Remote communication</strong> — data that lives in one process becomes available to others, without the two sharing memory.</li>
<li><strong>Platform and language integration</strong> — the channel is the common denominator between .NET, Java, legacy and SaaS worlds.</li>
<li><strong>Asynchronous communication</strong> — send and forget; the sender doesn't wait for the receiver.</li>
<li><strong>Variable timing</strong> — sender and receiver run at their own pace; the channel buffers the difference.</li>
<li><strong>Throttling</strong> — a receiver consumes requests at its own maximum rate instead of being overloaded.</li>
<li><strong>Reliable communication</strong> — <em>store and forward</em>: the messaging system persists the message at each hop and retries delivery after failures.</li>
<li><strong>Disconnected operation</strong> — apps can work offline and synchronize when reconnected.</li>
<li><strong>Mediation</strong> — apps integrate with the messaging system, not with each other; it becomes the point where routing and translation happen.</li>
<li><strong>Thread management</strong> — no blocked threads waiting for a slow partner; replies come back when they come back.</li>
</ul>
<p><em>In this app's world:</em> Anypoint MQ, VM queues and JMS give Mule apps exactly these properties, and a Kafka topic is a (log-based) channel.</p>

<h3>Challenges of asynchronous messaging</h3>
<ul>
<li><strong>Complex programming model</strong> — logic is split across event-driven handlers; a request and its reply are separate messages handled by separate code.</li>
<li><strong>Sequence issues</strong> — messages sent in order can arrive out of order; if steps depend on each other you must manage sequencing yourself.</li>
<li><strong>Synchronous scenarios</strong> — some interactions genuinely need an immediate answer (a user waiting for a fare search); bridging sync and async adds work.</li>
<li><strong>Performance overhead</strong> — packaging, transmitting, unpacking every message costs something; messaging is for frequent, small packets, not for migrating a huge existing data set in one go.</li>
<li><strong>Limited platform support / vendor lock-in</strong> — proprietary messaging systems historically didn't interoperate; bridging them is its own problem (see Messaging Bridge).</li>
</ul>

<h3>Thinking asynchronously</h3>
<p>A phone call is synchronous: both parties must be available at the same time, and the caller waits. Voicemail is asynchronous: the caller leaves a message and gets on with life; the callee processes it later and calls back. Messaging works like voicemail. The consequences take getting used to:</p>
<ul>
<li>There is <strong>no call stack</strong> — the sender's context is gone by the time the reply arrives, so any state the reply needs must travel in the messages themselves (see Correlation Identifier, Return Address).</li>
<li>Work happens <strong>concurrently</strong> — while a request is in flight the sender does other things; results arrive later via a <strong>callback</strong>.</li>
<li>Subprocedures become <em>fire-and-forget</em> steps whose results, if any, come back as new events.</li>
</ul>

<h3>Integration challenges and loose coupling</h3>
<p>Integration is hard for reasons that never go away: <strong>networks are slow and unreliable</strong> (orders of magnitude slower than a local call, and they fail), <strong>any two applications differ</strong> (language, platform, data format), and <strong>change is inevitable</strong> — an integration must not shatter when one side evolves. The antidote is <strong>loose coupling</strong>: minimizing the assumptions integrated applications make about each other.</p>
<ul>
<li>A local function call assumes: same process, same time (callee available now), same language, agreed parameter types, one fixed location. Each assumption is <em>coupling</em>.</li>
<li>Loosening them: an <strong>asynchronous channel</strong> removes the same-time assumption; a <strong>self-contained message</strong> in an agreed, platform-neutral <strong>common format</strong> removes language and type-system assumptions; addressing a <strong>logical channel name</strong> instead of a physical machine removes the location assumption.</li>
<li>The price: more moving parts, less determinism, a harder-to-follow call flow. Loose coupling is a trade, not a free lunch — the book's advice is to use the <em>loosest coupling that still meets the requirements</em>, not maximum looseness everywhere.</li>
</ul>

<h3>1-minute EAI: from RPC to messaging</h3>
<p>The book's warm-up example wires two systems together three ways:</p>
<table>
<tr><th>Approach</th><th>What still couples the systems</th></tr>
<tr><td>Shared function call (one codebase)</td><td>Everything: same process, language, types, availability</td></tr>
<tr><td>RPC (e.g. RMI, SOAP call)</td><td>Location (an address to call), <em>temporal availability</em> (callee must be up <em>now</em>), data format of the interface, and the illusion that a remote call is as safe as a local one</td></tr>
<tr><td>Asynchronous channel + self-describing message</td><td>Only the channel name and the message format — sender and receiver no longer need to be up at the same time or know each other's location</td></tr>
</table>
<p>RPC looks like integration but keeps the fragility of tight coupling over an unreliable network; a channel with a well-defined message format is what actually decouples the two sides.</p>

<h3>The wide world of integration</h3>
<p>Ch. 1 sketches six problem classes that all get called "integration" — knowing which one you're solving frames every later pattern choice:</p>
<ul>
<li><strong>Information portal</strong> — one screen aggregating data from many systems.</li>
<li><strong>Data replication</strong> — keeping copies of the same data in sync across systems.</li>
<li><strong>Shared business function</strong> — one implementation of a function (e.g. credit check) used by many systems.</li>
<li><strong>Service-oriented architecture</strong> — shared functions managed as discoverable, contracted services.</li>
<li><strong>Distributed business process</strong> — one business transaction spanning multiple systems, coordinated end to end.</li>
<li><strong>Business-to-business integration</strong> — any of the above, but the other side belongs to a different company (standards and slow/unreliable links matter even more).</li>
</ul>`;

const section = {
  id: "b1",
  title: "Messaging Foundations",
  objectives: [
    "Explain what messaging is and what a messaging system (MOM) does",
    "List the advantages messaging has over file transfer, shared database, and RPC",
    "Recognize the challenges asynchronous messaging introduces",
    "Explain loose coupling and which assumptions each mechanism removes",
    "Classify an integration problem (portal, replication, shared function, SOA, distributed process, B2B)"
  ],
  notes,
  topicDocs: {
    "What is messaging?": P + "Introduction.html",
    "Why use messaging?": P + "Introduction.html",
    "Challenges of asynchronous messaging": P + "Introduction.html",
    "Thinking asynchronously": P + "Introduction.html",
    "Integration challenges and loose coupling": P + "Chapter1.html",
    "1-minute EAI: from RPC to messaging": P + "Chapter1.html",
    "The wide world of integration": P + "Chapter1.html"
  }
};

const questions = [
  {
    id: "eip-101", section: "b1", level: "easy",
    q: "In messaging, what does \"send and forget\" mean?",
    options: [
      "The sender deletes the message after sending so it cannot be traced",
      "The sender writes the message to a channel and continues working; the messaging system delivers it, retrying as needed",
      "The sender broadcasts the message to every application and ignores errors",
      "The message is delivered only if the receiver is online at the moment of sending"
    ],
    answer: 1,
    explanation: "The sender's only job is to hand the message to the channel. From then on the messaging system owns delivery — it stores the message and forwards it (retrying after failures) until the receiver consumes it, like e-mail for programs."
  },
  {
    id: "eip-102", section: "b1", level: "medium",
    q: "Which THREE of these are benefits the book attributes to messaging?",
    options: [
      "Variable timing — sender and receiver each run at their own pace",
      "Throttling — a receiver consumes requests at its own maximum rate",
      "A simpler programming model than synchronous calls",
      "Disconnected operation — work offline, synchronize later"
    ],
    answers: [0, 1, 3],
    explanation: "Variable timing, throttling, and disconnected operation are all classic messaging benefits (along with remote communication, platform integration, asynchrony, reliability, mediation, and thread management). The programming model is the opposite of simpler — the book lists it as messaging's first challenge."
  },
  {
    id: "eip-103", section: "b1", level: "medium",
    q: "What does \"store and forward\" refer to?",
    options: [
      "A message archive kept for auditing and reporting",
      "The messaging system persisting a message at each hop and retrying delivery until it succeeds",
      "The sender keeping a copy of every message until the receiver acknowledges it in the application code",
      "Forwarding messages to a backup data center"
    ],
    answer: 1,
    explanation: "Store and forward is the delivery mechanism that makes messaging reliable: the messaging system stores the message (memory or disk), forwards it toward the receiver, and repeats after any failure — without the applications doing anything."
  },
  {
    id: "eip-104", section: "b1", level: "hard",
    q: "Two applications are integrated with a synchronous RPC call instead of messaging. Which coupling problems remain? (Choose TWO.)",
    options: [
      "The caller and callee must both be available at the same time",
      "The two applications must be written in the same language",
      "The caller depends on the callee's interface and data format",
      "The two applications must run on the same machine"
    ],
    answers: [0, 2],
    explanation: "RPC removes the same-process and (mostly) same-language assumptions, but keeps temporal coupling — the callee must be up when the call is made — and interface/format coupling. It also hides that a remote call is far slower and less reliable than a local one, which is the book's core criticism."
  },
  {
    id: "eip-105", section: "b1", level: "medium",
    q: "A company wants one implementation of \"credit check\" that its ordering, leasing, and onboarding systems all invoke. Which integration problem class is this?",
    options: [
      "Information portal",
      "Data replication",
      "Shared business function",
      "Business-to-business integration"
    ],
    answer: 2,
    explanation: "Providing one function used by many systems is the shared business function class. A portal aggregates data on a screen, replication keeps copies of data in sync, and B2B crosses company boundaries — different problems that call for different patterns."
  },
  {
    id: "eip-106", section: "b1", level: "medium",
    q: "Which scenario is messaging LEAST suited for?",
    options: [
      "Propagating an address change to five downstream systems as it happens",
      "Letting a warehouse system keep accepting orders while the ERP is down for maintenance",
      "A one-time migration of an entire 2 TB customer database into a new system",
      "Smoothing bursty request traffic in front of a slow legacy system"
    ],
    answer: 2,
    explanation: "Messaging shines for frequent, small, immediate packets of data — not for bulk-moving a huge data set, where per-message overhead dominates and a bulk load (file transfer / ETL) is the right tool. The other three are textbook messaging wins (timeliness, disconnected operation, throttling)."
  },
  {
    id: "eip-107", section: "b1", level: "hard",
    q: "Why does the book say there is \"no call stack\" in asynchronous messaging, and what follows from it?",
    options: [
      "Messages cannot carry structured data, so state must be stored in a database",
      "The sender's execution context is gone when the reply arrives, so state a reply needs must travel in the messages themselves",
      "The messaging system limits message depth to prevent recursion",
      "Handlers must be written in a stackless language"
    ],
    answer: 1,
    explanation: "With a synchronous call, the call stack holds where to return to and all local state. Asynchronously, the reply is a brand-new message processed later — possibly by another thread or process — so patterns like Return Address and Correlation Identifier exist to carry that lost context inside the messages."
  },
  {
    id: "eip-108", section: "b1", level: "easy",
    q: "According to the book, what is loose coupling?",
    options: [
      "Using as few integration points as possible",
      "Minimizing the assumptions integrated applications make about each other",
      "Always preferring asynchronous communication",
      "Encrypting data so applications cannot inspect each other's messages"
    ],
    answer: 1,
    explanation: "Coupling is measured in assumptions: about location, availability, language, data format. Loose coupling reduces those assumptions (channel names instead of addresses, self-contained messages in a common format, asynchrony) — at the price of a more complex, less deterministic system."
  }
];

module.exports = { section, questions };
