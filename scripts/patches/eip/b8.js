/* b8 — Messaging Endpoints (book ch. 10) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>Endpoint responsibilities</h3>
<p>Endpoints are where applications actually touch the messaging system, and ch. 10 is mostly about the <strong>receiving side</strong>, where the real decisions live: does the app pull or get pushed? one consumer or many? does it filter? does it survive disconnects? can it cope with duplicates? is messaging work transactional? Two patterns (Gateway, Mapper) structure the <em>code</em>; the rest govern <em>consumption semantics</em>.</p>

<h3>Messaging Gateway</h3>
<p>Wrap all messaging-specific code behind a narrow, domain-shaped API: the application calls <code>getCreditScore(customer)</code>, and the <strong>gateway</strong> turns that into send/receive mechanics. Gateways come in two flavors — <strong>synchronous</strong> (blocks until the reply arrives; convenient, hides the asynchrony) and <strong>asynchronous</strong> (returns immediately, delivers the result via callback/event). A gateway is also the natural seam for testing: swap in a dummy gateway and the application runs without any messaging system.</p>

<h3>Messaging Mapper</h3>
<p>Domain objects and messages have different shapes and different reasons to change. A <strong>Messaging Mapper</strong> moves data between them while keeping both sides ignorant of each other — the messaging analog of an O/R mapper, living outside both the domain object and the messaging layer. (Contrast with the Message Translator: the translator converts <em>between two message formats</em> inside the messaging layer; the mapper crosses the object ↔ message boundary.)</p>

<h3>Transactional Client</h3>
<p>Sends and receives can join a <strong>transaction</strong>: a sent message isn't visible until commit; a received message isn't removed until commit, and a rollback puts it back. The valuable shapes:</p>
<ul>
<li><strong>Receive + process atomically</strong> — e.g. consume a message and update a database in one unit, so a crash mid-processing redelivers instead of losing work.</li>
<li><strong>Batches</strong> — send or receive groups all-or-nothing.</li>
<li>The caution: a transaction cannot usefully span an entire <em>request-reply conversation</em> — the request would be held invisible inside the transaction until commit, so the reply could never arrive. Transactions wrap individual sends/receives, not conversations.</li>
</ul>

<h3>Polling Consumer</h3>
<p>The application asks for messages <strong>when it is ready</strong> — a loop of receive() calls. Polling gives natural throttling (you consume at your own pace) at the cost of latency between polls and busy work when the channel is empty; one thread per polled channel adds up.</p>

<h3>Event-Driven Consumer</h3>
<p>The messaging system <strong>pushes</strong>: the application registers a callback that is invoked per message as it arrives. Lowest latency, no idle polling — but the consumer must be prepared to be driven at the channel's pace (see Competing Consumers for scaling out, and throttling concerns if it can be overwhelmed).</p>

<h3>Competing Consumers</h3>
<p>Run <strong>multiple consumers on one Point-to-Point Channel</strong>; each message is consumed by exactly one of them. Throughput scales horizontally and a dead consumer's share flows to the others — the channel itself does the load balancing. The price: <strong>processing order is no longer guaranteed</strong> across consumers, and each consumer must be written as if it were alone (no shared state via message order).</p>
<p><em>In this app's world:</em> a Kafka consumer group is competing consumers per partition; multiple Mule workers draining one Anypoint MQ queue are the same.</p>

<h3>Message Dispatcher</h3>
<p>When you want <strong>one consumer</strong> to receive messages but <strong>your own logic</strong> to spread the work: the dispatcher consumes and hands each message to one of several <strong>performers</strong> (worker threads/objects). Use it when distribution needs application knowledge (e.g. all messages of one customer to the same performer) or when the channel can't support competing consumers — it also works on a publish-subscribe channel, where competing consumers would each get every message.</p>

<h3>Selective Consumer</h3>
<p>A consumer that receives <strong>only messages matching its selection criteria</strong> (a header-based selector), letting several consumer types share one channel. Non-matching messages are <em>left for other consumers</em> — unlike a Message Filter, which consumes and <em>discards</em> non-matches. Beware messages no consumer selects: they sit on the channel forever (park them via a catch-all or purge them).</p>

<h3>Durable Subscriber</h3>
<p>A plain subscription only receives while connected — miss the window, miss the message. A <strong>Durable Subscriber</strong>'s subscription outlives its connection: the channel saves messages published while it is away and delivers them when it reconnects. Durability starts at <em>first subscription</em> (nothing before that is retroactively available) and lasts until explicitly unsubscribed.</p>
<p><em>In this app's world:</em> a JMS durable subscription; in Kafka, every consumer group is effectively durable — offsets persist while the group is offline.</p>

<h3>Idempotent Receiver</h3>
<p>Reliable delivery means <strong>at-least-once</strong>: retries and redeliveries produce duplicates. An <strong>Idempotent Receiver</strong> makes duplicates harmless, either by <strong>de-duplication</strong> — track processed message ids and skip repeats — or by making the <strong>message semantics naturally idempotent</strong> ("set balance to 100" survives a replay; "add 10" does not).</p>
<p><em>In this app's world:</em> Mule's idempotent-message-validator with an Object Store is the de-dup variant; Kafka's idempotent producer applies the same idea broker-side.</p>

<h3>Service Activator</h3>
<p>An application exposes a useful service — how can it be invoked <em>both</em> synchronously by local callers <em>and</em> via messaging? A <strong>Service Activator</strong> receives a request message, unpacks it, invokes the ordinary (synchronous) service, and packages the result as the reply message. The service itself stays messaging-unaware and remains callable directly; the activator is just one more doorway.</p>`;

const section = {
  id: "b8",
  title: "Messaging Endpoints",
  objectives: [
    "Structure endpoint code with Messaging Gateway and Messaging Mapper",
    "Use transactions for atomic receive-and-process, and know why they can't span request-reply",
    "Choose polling vs. event-driven consumption",
    "Scale with Competing Consumers or control distribution with a Message Dispatcher",
    "Handle selection, disconnects, and duplicates: Selective Consumer, Durable Subscriber, Idempotent Receiver, and expose services with a Service Activator"
  ],
  notes,
  topicDocs: {
    "Endpoint responsibilities": P + "MessagingEndpointsIntro.html",
    "Messaging Gateway": P + "MessagingGateway.html",
    "Messaging Mapper": P + "MessagingMapper.html",
    "Transactional Client": P + "TransactionalClient.html",
    "Polling Consumer": P + "PollingConsumer.html",
    "Event-Driven Consumer": P + "EventDrivenConsumer.html",
    "Competing Consumers": P + "CompetingConsumers.html",
    "Message Dispatcher": P + "MessageDispatcher.html",
    "Selective Consumer": P + "MessageSelector.html",
    "Durable Subscriber": P + "DurableSubscription.html",
    "Idempotent Receiver": P + "IdempotentReceiver.html",
    "Service Activator": P + "MessagingAdapter.html"
  }
};

const questions = [
  {
    id: "eip-801", section: "b8", level: "medium",
    q: "Why does at-least-once delivery make the Idempotent Receiver pattern necessary, and what are its two strategies?",
    options: [
      "Because messages can be lost; strategies: retries and acknowledgements",
      "Because retries and redeliveries create duplicates; strategies: de-duplicate by tracking message ids, or design message semantics to be naturally idempotent",
      "Because consumers can crash; strategies: transactions and durable subscriptions",
      "Because order isn't guaranteed; strategies: resequencing and buffering"
    ],
    answer: 1,
    explanation: "Reliable messaging retries until acknowledged, so the same message can arrive twice. Either remember processed ids and skip repeats, or make replays harmless (\"set balance to 100\" vs. \"add 10\")."
  },
  {
    id: "eip-802", section: "b8", level: "medium",
    q: "What is the difference between Competing Consumers and a Message Dispatcher?",
    options: [
      "Competing consumers work on publish-subscribe channels; dispatchers only on point-to-point",
      "With competing consumers the channel load-balances among independent consumers; a dispatcher is one consumer that distributes messages to performers using its own logic",
      "A dispatcher discards messages no performer wants; competing consumers never discard",
      "They are identical except for thread count"
    ],
    answer: 1,
    explanation: "Competing consumers let the point-to-point channel decide who gets each message. A dispatcher takes control of that decision — useful when distribution needs application knowledge (same customer → same performer) or on a pub-sub channel, where competing consumers would each receive every message."
  },
  {
    id: "eip-803", section: "b8", level: "medium",
    q: "How does a Selective Consumer differ from a Message Filter?",
    options: [
      "A selective consumer discards what it doesn't match; a filter leaves it on the channel",
      "A selective consumer receives only matching messages and leaves the rest for other consumers; a filter consumes everything and discards non-matches",
      "A filter is configured at runtime; a selective consumer is not",
      "There is no difference"
    ],
    answer: 1,
    explanation: "The selector guards RECEPTION — non-matching messages stay available to other consumers sharing the channel. The filter is a pipe component that swallows what doesn't qualify. Watch for messages no consumer selects: they accumulate forever."
  },
  {
    id: "eip-804", section: "b8", level: "hard",
    q: "Why can't a transaction usefully span an entire request-reply exchange?",
    options: [
      "Transactions cannot include network operations",
      "The request stays invisible inside the uncommitted transaction, so the replier never sees it and the reply that would complete the transaction can never arrive",
      "Replies are always non-transactional",
      "Two channels cannot join one transaction"
    ],
    answer: 1,
    explanation: "A transactional send only becomes visible at commit. If the transaction also waited for the reply before committing, it would deadlock: no commit → no visible request → no reply → no commit. Transactions wrap individual sends/receives (or receive+process units), not conversations."
  },
  {
    id: "eip-805", section: "b8", level: "easy",
    q: "A subscriber must not miss events published while it is down for nightly maintenance. Which pattern applies?",
    options: ["Selective Consumer", "Durable Subscriber", "Polling Consumer", "Messaging Gateway"],
    answer: 1,
    explanation: "A durable subscription outlives the connection: the channel retains messages published during the disconnect and delivers them on reconnect. Note durability starts at first subscription and ends only when explicitly unsubscribed."
  },
  {
    id: "eip-806", section: "b8", level: "medium",
    q: "Which TWO trade-offs distinguish a Polling Consumer from an Event-Driven Consumer?",
    options: [
      "Polling lets the application consume at its own pace (built-in throttling); event-driven can be overwhelmed at the channel's pace",
      "Polling adds latency and idle work between polls; event-driven reacts immediately per message",
      "Event-driven consumers cannot participate in transactions",
      "Polling consumers only work on publish-subscribe channels"
    ],
    answers: [0, 1],
    explanation: "Pull = self-paced but latent and thread-hungry; push = immediate but paced by the channel. Both can be transactional, and both work on either channel kind."
  },
  {
    id: "eip-807", section: "b8", level: "medium",
    q: "What does a Messaging Gateway do for the application, besides tidiness?",
    options: [
      "It compresses all outbound traffic",
      "It exposes a domain-shaped API hiding all messaging mechanics, and provides the seam where a dummy implementation makes the app testable without a messaging system",
      "It guarantees exactly-once delivery",
      "It converts between two message formats"
    ],
    answer: 1,
    explanation: "The app calls getCreditScore(customer); the gateway does the send/receive/correlate dance (synchronously or via callback). Because messaging hides behind an interface, tests swap in a stub gateway — no broker required."
  },
  {
    id: "eip-808", section: "b8", level: "hard",
    q: "A synchronous credit-scoring service must also be invocable by message, while local code keeps calling it directly. Which pattern, and how?",
    options: [
      "Messaging Mapper — map the service's objects to messages",
      "Service Activator — a component receives request messages, invokes the unchanged service, and sends the result back as the reply",
      "Transactional Client — wrap the service call in a transaction",
      "Channel Adapter — connect the service's database to a channel"
    ],
    answer: 1,
    explanation: "The activator is an extra doorway: unpack request → call the ordinary synchronous service → package reply. The service stays messaging-unaware and both access paths coexist."
  },
  {
    id: "eip-809", section: "b8", level: "hard",
    q: "Four competing consumers drain one order queue. Orders for the same customer must be processed in submission order. What is the problem, and the book-aligned fix?",
    options: [
      "No problem — point-to-point channels preserve processing order across consumers",
      "Order across consumers isn't guaranteed; use a single consumer or a Message Dispatcher that routes each customer's orders to the same performer",
      "Duplicates will occur; add an Idempotent Receiver",
      "The queue will overflow; add a Claim Check"
    ],
    answer: 1,
    explanation: "Competing consumers trade ordering for throughput — two orders for one customer can complete out of order on different consumers. Serializing per customer needs controlled distribution: one consumer, or a dispatcher with customer-affinity (Kafka gets the same effect by keying the partition on customer id)."
  }
];

module.exports = { section, questions };
