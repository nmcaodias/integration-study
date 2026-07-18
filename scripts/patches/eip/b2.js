/* b2 — Integration Styles (book ch. 2) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>Choosing an integration style</h3>
<p>Ch. 2 defines the four root options for connecting applications and the criteria for choosing between them. Every later pattern in the book elaborates the fourth style. The decision criteria:</p>
<ul>
<li><strong>Application coupling</strong> — how many assumptions the integrated apps must share (interfaces, schemas, availability).</li>
<li><strong>Intrusiveness</strong> — how much each application must be changed to participate.</li>
<li><strong>Technology</strong> — how much specialized software/hardware the approach requires.</li>
<li><strong>Data format</strong> — how the parties agree on (and evolve) the format of exchanged data.</li>
<li><strong>Data timeliness</strong> — how quickly a change in one system is seen by the others.</li>
<li><strong>Data or functionality</strong> — does the approach share only data, or also invoke behavior?</li>
<li><strong>Asynchronicity</strong> — can the parties work without waiting for each other?</li>
</ul>
<table>
<tr><th>Style</th><th>Shares</th><th>Timeliness</th><th>Coupling</th></tr>
<tr><td>File Transfer</td><td>Data</td><td>Low (batch intervals)</td><td>Low-ish (file format)</td></tr>
<tr><td>Shared Database</td><td>Data</td><td>High (instant)</td><td>High (one schema for all)</td></tr>
<tr><td>Remote Procedure Invocation</td><td>Functionality</td><td>High</td><td>High (interface + availability)</td></tr>
<tr><td>Messaging</td><td>Data <em>and</em> functionality</td><td>High (near-real-time)</td><td>Low</td></tr>
</table>

<h3>File Transfer</h3>
<p>One application periodically <strong>exports a file</strong>, another <strong>imports</strong> it. Universal (every platform reads files), zero extra middleware, and the file format is the only contract — integrators need no knowledge of the applications' internals.</p>
<ul>
<li>The chores are on you: agreeing file naming conventions and directories, deciding <em>who deletes the file</em>, locking so a half-written file isn't read, and coping with the same file processed twice.</li>
<li><strong>Timeliness is the weakness</strong>: exports happen on a schedule (nightly, weekly), so consumers work with stale data and updates effectively arrive in batches. Shortening the interval multiplies files and collisions until file transfer degenerates into a poor man's messaging.</li>
<li>Still the right answer when: bulk data, existing tooling, crossing organizations (B2B file drops), or when staleness genuinely doesn't matter.</li>
</ul>

<h3>Shared Database</h3>
<p>All applications read and write <strong>one database</strong>; data is always consistent and instantly visible to everyone — no stale copies, transactions manage concurrent updates.</p>
<ul>
<li>The price is <strong>schema coupling</strong>: one schema must satisfy every application, which turns every schema change into a multi-team negotiation — and packaged applications generally refuse to work against a foreign schema at all.</li>
<li>The database becomes a <strong>performance and availability bottleneck</strong>, especially distributed across sites.</li>
<li>It shares <em>data only</em>: there is no way to invoke another application's behavior, so business rules around the data get duplicated in every app.</li>
</ul>

<h3>Remote Procedure Invocation</h3>
<p>Each application exposes functions others can call remotely (RPC/RMI/web service call). Unlike shared files or a shared schema, this preserves <strong>encapsulation</strong>: the owner of the data mediates every access and can apply its business logic.</p>
<ul>
<li>But it's <strong>synchronous and tightly coupled</strong>: the caller blocks, the callee must be available at that instant, and both depend on the interface definition.</li>
<li>The deeper trap: RPC makes a remote call <em>look</em> local, tempting developers to ignore that it is orders of magnitude slower and can fail in ways a local call cannot. Sequencing many fine-grained remote calls also performs terribly.</li>
<li>Works for genuine request/response needs between two systems that are reliably up together; brittle as the backbone of a many-system landscape.</li>
</ul>

<h3>Messaging</h3>
<p>Applications exchange <strong>small, frequent, asynchronous messages</strong> over channels. This combines the best properties of the other styles: near-real-time timeliness (unlike files), decoupled formats via transformation (unlike a shared schema), and the ability to invoke behavior (like RPC) without temporal coupling.</p>
<ul>
<li>Sender and receiver don't need to be up at the same time; the channel buffers and the messaging system retries — reliability over unreliable networks is built in.</li>
<li>Transformers between endpoints let each application keep its own internal format; the shared contract shrinks to the message format on the channel.</li>
<li>The cost: asynchronous, event-driven programming is genuinely harder to design, test, and debug — which is why the rest of the book is a catalog of patterns for doing it well.</li>
</ul>
<p><em>In this app's world:</em> a Mule app calling SaaS APIs over HTTP is Remote Procedure Invocation; the same app dropping events on Anypoint MQ or Kafka is Messaging; a nightly SFTP batch job is File Transfer. Real landscapes mix styles deliberately.</p>`;

const section = {
  id: "b2",
  title: "Integration Styles",
  objectives: [
    "Name the four integration styles and what each shares (data vs. functionality)",
    "Compare the styles on coupling, timeliness, and complexity",
    "Explain the operational chores and staleness problem of File Transfer",
    "Explain why Shared Database couples schemas and bottlenecks performance",
    "Explain why RPC's local-call illusion is dangerous, and what Messaging fixes"
  ],
  notes,
  topicDocs: {
    "Choosing an integration style": P + "IntegrationStylesIntro.html",
    "File Transfer": P + "FileTransferIntegration.html",
    "Shared Database": P + "SharedDataBaseIntegration.html",
    "Remote Procedure Invocation": P + "EncapsulatedSynchronousIntegration.html",
    "Messaging": P + "Messaging.html"
  }
};

const questions = [
  {
    id: "eip-201", section: "b2", level: "easy",
    q: "Which integration style keeps data instantly consistent for all applications but forces them all to agree on one schema?",
    options: ["File Transfer", "Shared Database", "Remote Procedure Invocation", "Messaging"],
    answer: 1,
    explanation: "A shared database gives everyone the same, always-current data — but the single schema must satisfy every application, so any change becomes a negotiation among all of them, and packaged apps often can't participate at all."
  },
  {
    id: "eip-202", section: "b2", level: "medium",
    q: "What is the principal weakness of File Transfer as an integration style?",
    options: [
      "It requires expensive middleware",
      "Data timeliness — consumers work with stale data between batch exports",
      "It cannot cross platform boundaries",
      "Files cannot represent structured data"
    ],
    answer: 1,
    explanation: "Files are universal and need no special infrastructure, but they are produced on a schedule. Between exports, every consumer sees out-of-date data, and shortening the interval just multiplies files, collisions and processing overhead."
  },
  {
    id: "eip-203", section: "b2", level: "medium",
    q: "Which TWO operational questions does File Transfer force the integrators to answer themselves?",
    options: [
      "Who deletes the file after processing, and how to avoid reading a half-written file",
      "How to correlate a reply with its request",
      "How to elect a leader among consumers",
      "How to name files and directories so producers and consumers find them"
    ],
    answers: [0, 3],
    explanation: "File transfer has no middleware to manage the handoff, so naming conventions, locking against partial reads, cleanup, and duplicate processing are all left to the applications. Correlation and leader election belong to messaging, not file exchange."
  },
  {
    id: "eip-204", section: "b2", level: "hard",
    q: "The book criticizes RPC for creating a dangerous illusion. What is it?",
    options: [
      "That remote calls are secure because they cross process boundaries",
      "That a remote call can be treated like a local call, hiding that it is far slower and can fail in ways a local call cannot",
      "That every remote interface is versioned automatically",
      "That the callee can process calls in any order"
    ],
    answer: 1,
    explanation: "RPC's whole point is making remote invocation look like a normal function call. But the network makes it orders of magnitude slower and adds failure modes (timeouts, partial failure) that local calls don't have — designs that ignore this are brittle and slow."
  },
  {
    id: "eip-205", section: "b2", level: "medium",
    q: "Which style shares FUNCTIONALITY rather than just data, while keeping the data owner's encapsulation?",
    options: ["File Transfer", "Shared Database", "Remote Procedure Invocation", "A shared network drive"],
    answer: 2,
    explanation: "With RPC, others invoke functions the owning application exposes, so its business logic always mediates access to its data. File transfer and shared database expose raw data, bypassing the owner's logic entirely."
  },
  {
    id: "eip-206", section: "b2", level: "medium",
    q: "Why does the book present Messaging as combining the strengths of the other three styles?",
    options: [
      "It is the only style that needs no agreement on data format",
      "It offers timely, frequent exchange like RPC, decoupled formats via transformation, and no requirement that both sides be up at once",
      "It is always the cheapest option to operate",
      "It removes the need for any middleware"
    ],
    answer: 1,
    explanation: "Messaging delivers small data packets near-real-time (fixing file transfer's staleness), lets transformers reconcile formats (fixing the shared schema problem), can trigger behavior in the receiver (like RPC), and is asynchronous and store-and-forward (fixing RPC's temporal coupling). Its cost is a harder programming model — and it definitely still needs middleware."
  },
  {
    id: "eip-207", section: "b2", level: "hard",
    q: "A retailer must push each price change to 12 downstream systems within a minute, without those systems being able to block the pricing team's releases. Which style fits best, and why?",
    options: [
      "Shared Database — everyone sees the change instantly",
      "File Transfer — export a price file every night",
      "Messaging — publish a price-change message; each consumer stays decoupled in format and availability",
      "RPC — call each of the 12 systems' update functions in sequence"
    ],
    answer: 2,
    explanation: "The requirements are timeliness (minutes, not nightly), independence of the 12 consumers (no shared schema to negotiate, no lock-step availability), and one-to-many distribution — the messaging profile. A shared database would couple all 13 teams to one schema; sequential RPC couples releases and availability to all 12 consumers."
  },
  {
    id: "eip-208", section: "b2", level: "easy",
    q: "Match the timeliness ranking the book implies, from most immediate to least:",
    options: [
      "File Transfer > Messaging > Shared Database",
      "Shared Database ≈ Messaging > File Transfer",
      "File Transfer > Shared Database > Messaging",
      "All three offer the same timeliness"
    ],
    answer: 1,
    explanation: "A shared database exposes changes the instant they commit, and messaging propagates them within moments; file transfer waits for the next batch export, which may be hours or days away."
  }
];

module.exports = { section, questions };
