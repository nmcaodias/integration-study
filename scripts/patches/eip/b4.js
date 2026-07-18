/* b4 — Messaging Channels (book ch. 4) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>Channel decisions</h3>
<p>Ch. 4 is about the choices you make when laying out channels: one-to-one or one-to-many delivery, how receivers know what a message contains, what happens to messages that can't be processed or delivered, how far to push reliability, and how non-messaging applications and foreign messaging systems join in. Channels are <strong>designed</strong>: their names and purposes are agreed up front and form the application's messaging contract.</p>

<h3>Point-to-Point Channel</h3>
<p>Exactly <strong>one receiver consumes each message</strong>. Multiple receivers may listen, but the channel ensures only one of them gets any given message — which is what makes Competing Consumers (ch. 10) safe without any coordination between the consumers.</p>
<ul>
<li>Use for commands and document transfers where processing each message once is essential (orders, payments).</li>
<li>A queue in JMS/Anypoint MQ is a point-to-point channel; a Kafka topic consumed by <em>one consumer group</em> behaves point-to-point per group.</li>
</ul>

<h3>Publish-Subscribe Channel</h3>
<p>The channel delivers <strong>a copy of each message to every subscriber</strong>. The sender publishes once; each subscriber has, in effect, its own private output channel from which it consumes its copy.</p>
<ul>
<li>Use for event notification — the publisher neither knows nor cares how many listeners exist, so new consumers can be added without touching the publisher.</li>
<li>Subscriptions are normally only active while the subscriber is connected; a Durable Subscriber (ch. 10) keeps the copy queued through disconnects.</li>
<li>A JMS topic is publish-subscribe; a Kafka topic consumed by <em>several consumer groups</em> is publish-subscribe across the groups.</li>
</ul>

<h3>Datatype Channel</h3>
<p>How does a receiver know how to parse what it gets? By contract: <strong>all messages on a given channel carry the same type of data</strong> — a separate channel per data type. The channel name itself tells the receiver what to expect, without inspecting each message.</p>
<ul>
<li>Alternatives when separate channels are too expensive: a Format Indicator inside the message, or a Selective Consumer per type on one channel.</li>
</ul>

<h3>Invalid Message Channel</h3>
<p>When a <strong>receiver</strong> gets a message that is syntactically fine for the messaging system but <strong>senseless to the application</strong> — wrong type, missing fields, values that fail validation — it should not silently drop it, endlessly retry it, or crash. It moves it to a designated <strong>Invalid Message Channel</strong> where an operator or monitoring tool can inspect the failures.</p>
<ul>
<li>The decision is made by <em>application code</em>, based on message <em>content</em>. That is the crucial contrast with the Dead Letter Channel.</li>
</ul>

<h3>Dead Letter Channel</h3>
<p>When the <strong>messaging system</strong> determines it <strong>cannot deliver</strong> a message — the destination doesn't exist, the message expired, delivery was retried too often — it moves the message to the <strong>Dead Letter Channel</strong> rather than discarding it.</p>
<ul>
<li>Invalid Message Channel = receiver rejects <em>content</em> it cannot process. Dead Letter Channel = messaging system gives up on <em>delivery</em>. Same shape (a parking channel plus monitoring), different decider and different reason.</li>
<li>Anypoint MQ and most brokers call this the DLQ; wiring an alert on it is standard operational practice.</li>
</ul>

<h3>Guaranteed Delivery</h3>
<p>Make the store in store-and-forward <strong>persistent</strong>: the message is written to disk at every hop before the send is acknowledged, so it survives crashes and restarts of the messaging system itself.</p>
<ul>
<li>The trade is <strong>performance for durability</strong> — every message costs disk I/O. Not everything deserves it: losing one reading from a sensor that reports every second may be fine, losing an order is not.</li>
<li>Retention limits still apply in practice (disk space, message TTLs); "guaranteed" means surviving failures, not surviving forever.</li>
</ul>

<h3>Channel Adapter</h3>
<p>Many applications you must integrate were never written for messaging. A <strong>Channel Adapter</strong> is a component that connects such an application to a channel by hooking into what the application does expose:</p>
<ul>
<li><strong>User interface adapter</strong> — drives the app's screens (screen scraping); fragile but sometimes the only option.</li>
<li><strong>Business logic adapter</strong> — calls the app's published API; the preferred hook when one exists.</li>
<li><strong>Database adapter</strong> — watches or writes the app's database directly (e.g. triggers, change capture); powerful but bypasses the app's logic.</li>
</ul>
<p>Adapters typically emit whatever structure the application yields, so a Message Translator usually follows. Mule connectors (Database, File, SFTP, Salesforce…) are channel adapters in exactly this sense; so are Kafka Connect source/sink connectors.</p>

<h3>Messaging Bridge</h3>
<p>Enterprises end up with more than one messaging system (a merger, a package that ships with its own broker). A <strong>Messaging Bridge</strong> is a set of paired channel adapters connecting two messaging systems, forwarding messages from channels on one to corresponding channels on the other — so applications on each side keep using their native broker.</p>

<h3>Message Bus</h3>
<p>The architectural endgame of ch. 4: a <strong>Message Bus</strong> is the combination of (1) a <strong>common communication infrastructure</strong> (the channels), (2) a shared <strong>Canonical Data Model</strong> so participants understand each other, and (3) a <strong>common command structure</strong> so requests look uniform. Applications plug into the bus with adapters and can be added or removed without affecting the others — the bus works like a distributed, application-level backplane.</p>`;

const section = {
  id: "b4",
  title: "Messaging Channels",
  objectives: [
    "Choose between point-to-point and publish-subscribe delivery semantics",
    "Explain how datatype channels tell receivers what to expect",
    "Distinguish the Invalid Message Channel from the Dead Letter Channel",
    "Weigh Guaranteed Delivery's durability against its performance cost",
    "Connect non-messaging applications (Channel Adapter), foreign brokers (Messaging Bridge), and describe what makes a Message Bus"
  ],
  notes,
  topicDocs: {
    "Channel decisions": P + "MessagingChannelsIntro.html",
    "Point-to-Point Channel": P + "PointToPointChannel.html",
    "Publish-Subscribe Channel": P + "PublishSubscribeChannel.html",
    "Datatype Channel": P + "DatatypeChannel.html",
    "Invalid Message Channel": P + "InvalidMessageChannel.html",
    "Dead Letter Channel": P + "DeadLetterChannel.html",
    "Guaranteed Delivery": P + "GuaranteedMessaging.html",
    "Channel Adapter": P + "ChannelAdapter.html",
    "Messaging Bridge": P + "MessagingBridge.html",
    "Message Bus": P + "MessageBus.html"
  }
};

const questions = [
  {
    id: "eip-401", section: "b4", level: "medium",
    q: "An order message arrives with a negative quantity. The receiving application cannot process it. Where should the message go, and who decides?",
    options: [
      "The Dead Letter Channel — the messaging system decides",
      "The Invalid Message Channel — the receiving application decides, based on the message's content",
      "Back to the sender's channel for automatic correction",
      "It should be discarded to keep the queue clean"
    ],
    answer: 1,
    explanation: "The messaging system delivered the message just fine; it's the CONTENT the application can't accept. That's the Invalid Message Channel, and the receiver makes the call. The Dead Letter Channel is for messages the messaging system itself fails to DELIVER (expired, no destination, too many retries)."
  },
  {
    id: "eip-402", section: "b4", level: "medium",
    q: "Which situations send a message to the Dead Letter Channel? (Choose TWO.)",
    options: [
      "The message expires before it can be delivered",
      "The receiver's validation rejects the payload",
      "The destination queue does not exist or delivery retries are exhausted",
      "The message is larger than the receiver's preferred size"
    ],
    answers: [0, 2],
    explanation: "Dead-lettering is the messaging system's move when DELIVERY fails: expiration, unknown destination, retry exhaustion. Payload validation failures are the receiver's decision and belong on the Invalid Message Channel."
  },
  {
    id: "eip-403", section: "b4", level: "easy",
    q: "Five services all need to react to every \"customer address changed\" event. Which channel type fits?",
    options: [
      "Point-to-Point Channel",
      "Publish-Subscribe Channel",
      "Dead Letter Channel",
      "Datatype Channel"
    ],
    answer: 1,
    explanation: "Publish-subscribe delivers a copy of each message to every subscriber — one publish, five deliveries, and a sixth consumer can be added without touching the publisher. Point-to-point would give the event to only one of the five."
  },
  {
    id: "eip-404", section: "b4", level: "medium",
    q: "What does Guaranteed Delivery add to ordinary store-and-forward, and at what cost?",
    options: [
      "It encrypts messages; the cost is CPU",
      "It persists messages to disk at every hop so they survive broker crashes; the cost is performance",
      "It adds automatic ordering; the cost is throughput",
      "It guarantees the receiver processes the message exactly once; the cost is duplicate detection"
    ],
    answer: 1,
    explanation: "Ordinary store-and-forward may hold messages in memory, which a crash wipes out. Guaranteed delivery makes the store persistent, surviving restarts — at the price of disk I/O per message. It says nothing about exactly-once processing; that's the Idempotent Receiver's territory."
  },
  {
    id: "eip-405", section: "b4", level: "hard",
    q: "You must integrate a packaged application that exposes no API, but its database schema is documented. Which Channel Adapter approach does the book describe for this, and what caveat comes with it?",
    options: [
      "A user-interface adapter; caveat: it is the most robust option",
      "A database adapter; caveat: it bypasses the application's business logic",
      "A business-logic adapter; caveat: it requires source code access",
      "A messaging bridge; caveat: it needs a second broker"
    ],
    answer: 1,
    explanation: "A database adapter reads (or watches) the app's tables directly — practical when no API exists, but writes made this way skip the application's validation and business rules. A business-logic adapter is preferred when an API exists; UI adapters (screen scraping) are the fragile last resort."
  },
  {
    id: "eip-406", section: "b4", level: "medium",
    q: "Which THREE ingredients does the book say make up a Message Bus?",
    options: [
      "A common communication infrastructure (the channels)",
      "A Canonical Data Model shared by the participants",
      "A common command structure so requests look uniform",
      "A central orchestration engine that calls each application in turn"
    ],
    answers: [0, 1, 2],
    explanation: "Bus = shared channels + shared data model + shared command structure; applications attach via adapters and can come and go independently. Central orchestration is the Process Manager pattern — deliberately not required for a bus."
  },
  {
    id: "eip-407", section: "b4", level: "easy",
    q: "Why would you give each message type its own channel (Datatype Channel)?",
    options: [
      "To make the messaging system validate the payload schema",
      "So the receiver knows from the channel alone how to interpret every message it gets",
      "To increase total throughput",
      "Because publish-subscribe requires it"
    ],
    answer: 1,
    explanation: "The channel becomes the type declaration: all messages on it share one format, so receivers need no per-message inspection. The alternatives when channels are too costly are a Format Indicator in each message or Selective Consumers."
  },
  {
    id: "eip-408", section: "b4", level: "hard",
    q: "After a merger, half the company runs on MSMQ and half on a JMS broker, and orders must flow between them. Which pattern applies?",
    options: [
      "Message Bus — replace both with one new broker",
      "Messaging Bridge — paired adapters forwarding messages between corresponding channels of the two systems",
      "Channel Adapter — connect MSMQ directly to the JMS applications",
      "Datatype Channel — one channel per company"
    ],
    answer: 1,
    explanation: "A Messaging Bridge is precisely the connection between two messaging systems: adapters on each side forward between corresponding channels so every application keeps its native broker. Replacing both systems is rarely realistic, and a single Channel Adapter connects an APPLICATION, not a broker, to a channel."
  }
];

module.exports = { section, questions };
