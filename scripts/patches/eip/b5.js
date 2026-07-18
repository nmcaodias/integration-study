/* b5 — Message Construction (book ch. 5) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>Message intent and interaction</h3>
<p>A message is just data on a channel — ch. 5 is about what the sender <em>means</em> by it and how multi-message conversations are held together. Three intents (command, document, event), one conversation shape (request-reply), and header fields that carry the context a call stack would normally hold.</p>

<h3>Command Message</h3>
<p>The message <strong>invokes behavior</strong>: "do this." The body names the operation and carries its parameters (the messaging equivalent of the Command object pattern). Commands are normally sent on a <strong>point-to-point channel</strong> so exactly one receiver executes each one.</p>

<h3>Document Message</h3>
<p>The message <strong>transfers data</strong>: "here is this thing." The receiver decides what to do with it. Content and reliability matter most — losing a document message usually means losing data. A reply carrying query results is a document message.</p>

<h3>Event Message</h3>
<p>The message <strong>announces that something happened</strong>: "this occurred." Usually published on a <strong>publish-subscribe channel</strong>, since events exist to notify whoever cares. For events, <strong>timing matters more than content</strong> — a stale event is often worthless (fine to expire), and the body can be minimal, even empty, if subscribers can fetch details on demand.</p>
<table>
<tr><th></th><th>Command</th><th>Document</th><th>Event</th></tr>
<tr><td>Intent</td><td>Do this</td><td>Here is this</td><td>This happened</td></tr>
<tr><td>Typical channel</td><td>Point-to-point</td><td>Point-to-point</td><td>Publish-subscribe</td></tr>
<tr><td>What matters</td><td>Execution once</td><td>Content, reliability</td><td>Timeliness</td></tr>
</table>

<h3>Request-Reply</h3>
<p>Two applications converse with <strong>a pair of one-way messages over two channels</strong>: the requestor sends a request on the request channel and the replier sends the answer on a reply channel. Each direction is ordinary asynchronous messaging; the "call" is an illusion assembled from the two halves.</p>
<ul>
<li>The requestor can <strong>block waiting</strong> for the reply (making the exchange feel synchronous) or continue working and process the reply via callback.</li>
<li>A request is typically a Command Message; its reply is a Document Message carrying the result — or an exception/error document.</li>
</ul>

<h3>Return Address</h3>
<p>Which channel should the reply go to? The replier must not hardcode it — different requestors (or the same one in different contexts) want replies in different places. The request carries a <strong>Return Address</strong> header: the reply channel the replier should send the answer to. The replier just honors it, like the return address on an envelope.</p>

<h3>Correlation Identifier</h3>
<p>A requestor with several requests outstanding receives a reply — <em>for which request?</em> Each request carries a unique id (often its message id); the replier copies it into the reply's <strong>correlation identifier</strong> field. The requestor matches replies to pending requests by that value. This is the pattern that replaces the call stack's "where was I" in asynchronous conversations.</p>
<p><em>In this app's world:</em> Mule's correlation id travels in the event and message headers automatically; Kafka apps echo a correlation id header between request and reply topics.</p>

<h3>Message Sequence</h3>
<p>Data too large for one message travels as a numbered series. Each message carries three fields: a <strong>sequence identifier</strong> (which series this belongs to), a <strong>position identifier</strong> (where in the series), and a <strong>size or end indicator</strong> (how many there are, or a flag on the last one). The receiver reassembles and knows when it has everything.</p>

<h3>Message Expiration</h3>
<p>Some content has a shelf life — a quote valid for a minute, an event that is only news now. The sender stamps the message with an <strong>expiration</strong> (TTL); if the deadline passes before delivery, the messaging system discards it or moves it to the Dead Letter Channel instead of delivering stale data as if it were fresh.</p>

<h3>Format Indicator</h3>
<p>Formats evolve. So that today's receivers survive tomorrow's senders, each message declares its format: a <strong>version number</strong>, a <strong>foreign key</strong> to a format document, or an embedded <strong>schema reference</strong>. Receivers can then handle multiple versions side by side during migrations.</p>
<p><em>In this app's world:</em> a Confluent Schema Registry id embedded in each Kafka record is a Format Indicator; so is a version field in an API's JSON payloads.</p>`;

const section = {
  id: "b5",
  title: "Message Construction",
  objectives: [
    "Classify messages by intent: command, document, or event",
    "Explain request-reply as two one-way messages over two channels",
    "Use Return Address and Correlation Identifier to hold conversations together",
    "Split large data into a Message Sequence a receiver can reassemble",
    "Apply Message Expiration and Format Indicator for shelf life and versioning"
  ],
  notes,
  topicDocs: {
    "Message intent and interaction": P + "MessageConstructionIntro.html",
    "Command Message": P + "CommandMessage.html",
    "Document Message": P + "DocumentMessage.html",
    "Event Message": P + "EventMessage.html",
    "Request-Reply": P + "RequestReply.html",
    "Return Address": P + "ReturnAddress.html",
    "Correlation Identifier": P + "CorrelationIdentifier.html",
    "Message Sequence": P + "MessageSequence.html",
    "Message Expiration": P + "MessageExpiration.html",
    "Format Indicator": P + "FormatIndicator.html"
  }
};

const questions = [
  {
    id: "eip-501", section: "b5", level: "easy",
    q: "\"OrderShipped\" is published so any interested system can react. Which message intent is this?",
    options: ["Command Message", "Document Message", "Event Message", "Request Message"],
    answer: 2,
    explanation: "It announces that something happened, addressed to whoever cares — an event, typically on a publish-subscribe channel, where timeliness matters more than a rich payload."
  },
  {
    id: "eip-502", section: "b5", level: "medium",
    q: "How does a requestor with many outstanding requests know which request a given reply answers?",
    options: [
      "Replies always arrive in the order the requests were sent",
      "The reply carries a correlation identifier — the unique id of its request, copied over by the replier",
      "The reply repeats the full request body",
      "Each reply arrives on a channel named after the request's timestamp"
    ],
    answer: 1,
    explanation: "The request carries a unique id (often its message id); the replier copies it into the reply's correlation identifier field, and the requestor matches it against its pending requests. Ordering can't be relied on in an asynchronous system."
  },
  {
    id: "eip-503", section: "b5", level: "medium",
    q: "Why does the request message carry a Return Address instead of the replier knowing the reply channel?",
    options: [
      "It encrypts the reply destination",
      "Different requestors (or contexts) need replies on different channels, and the replier shouldn't be coupled to any of them",
      "The messaging system requires it for routing the request",
      "It lets the reply skip the messaging system entirely"
    ],
    answer: 1,
    explanation: "Hardcoding a reply channel in the replier couples it to its callers. With a Return Address header, each request states where its answer should go and the replier simply honors it — like the return address on an envelope."
  },
  {
    id: "eip-504", section: "b5", level: "medium",
    q: "Which THREE fields does each message of a Message Sequence carry?",
    options: [
      "A sequence identifier saying which series it belongs to",
      "A position identifier saying where in the series it is",
      "A size or end indicator so the receiver knows when the series is complete",
      "A checksum of the entire series"
    ],
    answers: [0, 1, 2],
    explanation: "Sequence id + position id + size (or an end flag on the last message) let the receiver group, order, and complete the series. A checksum may be good practice but isn't part of the pattern."
  },
  {
    id: "eip-505", section: "b5", level: "easy",
    q: "What is Request-Reply, structurally?",
    options: [
      "One bidirectional channel carrying both request and reply",
      "A pair of one-way messages: a request on one channel and a reply on another",
      "A synchronous RPC call tunneled through the broker",
      "A single message with two bodies"
    ],
    answer: 1,
    explanation: "Each direction is plain one-way messaging; the conversation is assembled from the two halves (with Return Address and Correlation Identifier holding it together). The requestor may block for the reply or handle it as a callback."
  },
  {
    id: "eip-506", section: "b5", level: "hard",
    q: "A stock-quote message is worthless 30 seconds after it is sent. What does the book recommend, and what happens when the limit passes?",
    options: [
      "Set a Message Expiration; the messaging system discards the message or dead-letters it instead of delivering it stale",
      "Add a timestamp and let every receiver check freshness",
      "Use Guaranteed Delivery so the quote always arrives",
      "Resend the quote every 30 seconds and let duplicates accumulate"
    ],
    answer: 0,
    explanation: "Message Expiration puts the shelf life in the header where the messaging SYSTEM enforces it — expired messages are never delivered as if fresh; they are discarded or parked on the Dead Letter Channel. Receiver-side timestamp checks work but burden every consumer."
  },
  {
    id: "eip-507", section: "b5", level: "hard",
    q: "For an Event Message, why does the book tolerate a minimal — even empty — body?",
    options: [
      "Events are not allowed to carry data",
      "What matters is the timely fact that something happened; subscribers can fetch details on demand if they need them",
      "Empty bodies compress better",
      "Publish-subscribe channels have a small size limit"
    ],
    answer: 1,
    explanation: "An event's value is its timeliness. The notification itself can be slim, with interested subscribers retrieving the current state when they react — trading an extra query for never distributing stale detail."
  },
  {
    id: "eip-508", section: "b5", level: "medium",
    q: "Which mechanisms does the book list for a Format Indicator? (Choose TWO.)",
    options: [
      "A version number carried in each message",
      "A schema reference or foreign key identifying the format document",
      "A digital signature by the sender",
      "The channel's creation date"
    ],
    answers: [0, 1],
    explanation: "Version numbers and format/schema references let receivers recognize which format a message uses and support several formats side by side during migrations — exactly what a schema-registry id in a Kafka record does today."
  }
];

module.exports = { section, questions };
