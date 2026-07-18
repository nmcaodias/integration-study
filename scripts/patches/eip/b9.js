/* b9 — System Management (book ch. 11) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>Operating a messaging solution</h3>
<p>A distributed, asynchronous system can't be debugged with a stack trace. Ch. 11's patterns give operators eyes and hands: a management backbone (Control Bus), ways to inspect traffic without disturbing it (Wire Tap, Message History, Message Store), a request-reply tracker (Smart Proxy), and active testing tools (Test Message, Channel Purger, Detour).</p>

<h3>Control Bus</h3>
<p>Manage the messaging system <strong>with messaging itself</strong>: a separate set of channels connecting every component to a central management console. Over the control bus flow <strong>configuration changes</strong> (routing rules, channel assignments), <strong>heartbeats and status</strong>, <strong>test messages and control commands</strong> (start/stop, inject, purge), and exception notifications. Keeping the control bus separate from the application channels means management still works when business traffic is jammed.</p>

<h3>Detour</h3>
<p>A context-sensitive router, flipped by the control bus, that sends messages either straight through or <strong>via a detour of extra steps</strong> — validation, logging, debugging taps. In normal operation the detour is off and costs nothing; when investigating, operations flips the switch and traffic runs through the inspection path.</p>

<h3>Wire Tap</h3>
<p>How do you see messages on a point-to-point channel without consuming them away from the real receiver? Insert a <strong>Wire Tap</strong>: a simple component that consumes each message and republishes it to <em>two</em> channels — the original destination and a <strong>secondary channel</strong> for inspection (a fixed two-entry Recipient List). The main flow is undisturbed; analyzers, loggers and debuggers feed off the copy.</p>
<p><em>In this app's world:</em> Mule's Wire Tap-style logging via Async scope, or a Kafka consumer group added purely for monitoring, do exactly this.</p>

<h3>Message History</h3>
<p>In a loosely coupled system nobody knows a message's full path — which is the point, until something misbehaves. <strong>Message History</strong> has every component append itself to a list carried <em>in the message header</em>: an itinerary of everything the message passed through. Invaluable for tracing pub-sub fan-outs ("why did this system receive that?") without central infrastructure.</p>

<h3>Message Store</h3>
<p>History travels with one message; analysis needs the view <em>across</em> messages. A <strong>Message Store</strong> copies every message (or its essentials) to a central database as it travels — typically via a Wire Tap feeding the store asynchronously, so the main flow doesn't wait. That enables reporting, auditing, and message-level analytics; kept with Message History data, it reconstructs end-to-end flows.</p>

<h3>Smart Proxy</h3>
<p>You want to track request-reply services — but if you insert a monitor in front of a replier, replies go back to each requestor's own Return Address and slip past you. A <strong>Smart Proxy</strong> intercepts requests, <strong>stores each request's original Return Address</strong>, replaces it with its own reply channel, and forwards the request. Replies therefore come back to the proxy, which correlates them with the stored requests (by correlation id), records what it needs (latency, outcome), and forwards each reply to the original Return Address.</p>

<h3>Test Message</h3>
<p>Heartbeats prove a component is <em>alive</em> — not that it computes correctly. Inject <strong>test messages</strong> into the live flow and check the answers. The pattern's working parts: a <strong>test data generator</strong>, a <strong>test message injector</strong> (inserts test traffic among the real), a <strong>test message separator</strong> (pulls test outputs out of the result stream — e.g. flagged by a header), and a <strong>test data verifier</strong> comparing actual against expected results.</p>

<h3>Channel Purger</h3>
<p>Leftover messages on a channel poison tests and can break restarting systems (a stale command executes on boot). A <strong>Channel Purger</strong> removes unwanted messages from a channel — wholesale, or selectively by criteria — typically driven from the control bus before test runs or during recovery.</p>`;

const section = {
  id: "b9",
  title: "System Management",
  objectives: [
    "Manage components over a Control Bus separate from application traffic",
    "Inspect live traffic without disturbing it: Wire Tap, Message History, Message Store",
    "Track request-reply exchanges with a Smart Proxy",
    "Verify correctness in production with Test Messages and clean up with a Channel Purger",
    "Toggle inspection paths on demand with a Detour"
  ],
  notes,
  topicDocs: {
    "Operating a messaging solution": P + "SystemManagementIntro.html",
    "Control Bus": P + "ControlBus.html",
    "Detour": P + "Detour.html",
    "Wire Tap": P + "WireTap.html",
    "Message History": P + "MessageHistory.html",
    "Message Store": P + "MessageStore.html",
    "Smart Proxy": P + "SmartProxy.html",
    "Test Message": P + "TestMessage.html",
    "Channel Purger": P + "ChannelPurger.html"
  }
};

const questions = [
  {
    id: "eip-901", section: "b9", level: "medium",
    q: "How do you inspect messages flowing on a point-to-point channel without depriving the real receiver of them?",
    options: [
      "Add a second competing consumer for the monitoring tool",
      "Insert a Wire Tap that republishes each message to both the original destination and a secondary inspection channel",
      "Enable Guaranteed Delivery on the channel",
      "Read the receiver's database instead"
    ],
    answer: 1,
    explanation: "A competing consumer would STEAL messages from the receiver — each point-to-point message goes to only one consumer. The wire tap duplicates: original flow undisturbed, copy on a secondary channel for loggers and analyzers."
  },
  {
    id: "eip-902", section: "b9", level: "hard",
    q: "Why does a Smart Proxy replace the Return Address on requests it forwards?",
    options: [
      "To hide the requestor's identity from the replier",
      "So replies come back to the proxy — which then correlates each reply with its stored request, records metrics, and forwards it to the requestor's original Return Address",
      "Because two Return Addresses cannot coexist in one header",
      "To force the replier to use a faster channel"
    ],
    answer: 1,
    explanation: "Without the swap, replies would go straight to each requestor's own reply channel and the proxy would never see them. Storing the original address and substituting its own is the trick that lets it observe both halves of every exchange."
  },
  {
    id: "eip-903", section: "b9", level: "medium",
    q: "Message History vs. Message Store — what does each give you?",
    options: [
      "They are synonyms",
      "History: the path travelled, carried in each message's header. Store: a central copy of messages for reporting and analysis across messages",
      "History: a database of all messages. Store: a header field",
      "Both require stopping the message flow"
    ],
    answer: 1,
    explanation: "History rides along inside the message — perfect for tracing one message's route (especially through pub-sub). The store persists message data centrally — perfect for questions across many messages. Together they reconstruct end-to-end flows."
  },
  {
    id: "eip-904", section: "b9", level: "medium",
    q: "Which kinds of traffic does the book put on the Control Bus? (Choose THREE.)",
    options: [
      "Configuration changes such as routing rules",
      "Heartbeats and component status",
      "Test messages and control commands (start/stop, inject, purge)",
      "The application's business messages"
    ],
    answers: [0, 1, 2],
    explanation: "The control bus is the management network: configuration, liveness, testing, exceptions. Business traffic stays on its own channels — precisely so management keeps working when application channels are backed up."
  },
  {
    id: "eip-905", section: "b9", level: "medium",
    q: "What is a Detour?",
    options: [
      "A backup route used when the primary channel fails",
      "A control-bus-switched router that sends traffic either straight through or via extra validation/debugging steps",
      "A router that randomly samples messages for QA",
      "The channel used for dead letters"
    ],
    answer: 1,
    explanation: "In normal operation messages take the direct path at no extra cost; when operators flip the switch over the control bus, traffic runs through the inspection steps. Failover routing is a different concern (First Successful-style routers)."
  },
  {
    id: "eip-906", section: "b9", level: "hard",
    q: "Which FOUR parts make up the Test Message pattern?",
    options: [
      "Test data generator",
      "Test message injector",
      "Test message separator plus a test data verifier",
      "A dedicated test broker isolated from production"
    ],
    answers: [0, 1, 2],
    explanation: "Generate test data, inject it among live traffic, separate test outputs from real results (e.g. by a header flag), and verify actual vs. expected. The point is testing the REAL production path — a separate broker would defeat it. (Separator and verifier are listed together here, making the four parts.)"
  },
  {
    id: "eip-907", section: "b9", level: "easy",
    q: "Before an integration test run, the order queue still holds messages from last night's aborted run. Which pattern applies?",
    options: ["Message Store", "Channel Purger", "Wire Tap", "Message Expiration"],
    answer: 1,
    explanation: "The purger removes leftover messages so the test starts from a known-clean state. Expiration only helps if the old messages carried a TTL when they were sent."
  },
  {
    id: "eip-908", section: "b9", level: "medium",
    q: "A component's heartbeat is green, yet its output is wrong. What does the book conclude from this scenario?",
    options: [
      "Heartbeats should run more frequently",
      "Liveness monitoring can't verify correctness — inject Test Messages through the live path and verify the answers",
      "The component needs a durable subscription",
      "The control bus has failed"
    ],
    answer: 1,
    explanation: "A heartbeat proves the process is up, not that its logic is right (stale reference data, a bad deployment). Test messages exercise the real processing path and let a verifier compare actual results with expected ones."
  }
];

module.exports = { section, questions };
