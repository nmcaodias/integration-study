/* EIP · hands-on "pattern modeling" exercises. EIP is a patterns catalog, so each
 * exercise gives an integration problem + constraints and reveals a model solution
 * composed from Enterprise Integration Patterns. The learner sketches the solution
 * outside the site (whiteboard / their integration tool). Same schema/feature as
 * the other certs' exercises. 11 exercises across the catalog. */
module.exports = {
  addExercises: [
    {
      id: "eip-ex-01",
      section: "b2",
      title: "Choose the integration style for four requirements",
      level: "medium",
      where: "Design — pattern modeling",
      task: `<p>For each requirement pick one of the four integration styles — <strong>File Transfer</strong>, <strong>Shared Database</strong>, <strong>Remote Procedure Invocation</strong>, or <strong>Messaging</strong> — and justify it.</p><ol><li>Nightly bulk export of the full product catalog to a partner.</li><li>Loosely coupled, near-real-time propagation of order events to several systems that may be down at times.</li><li>A caller needs an answer synchronously, right now, from one other system.</li><li>Two apps must always see the exact same customer record with no copy.</li></ol>`,
      given: [
        { label: "The four styles", code: "File Transfer · Shared Database · RPC · Messaging\n(trade-offs: coupling, timeliness, reliability, schema sharing)" }
      ],
      steps: [
        "Ask: how timely, how coupled, how reliable must it be?",
        "Bulk + periodic + simple → File Transfer",
        "Async, decoupled, tolerant of downtime, fan-out → Messaging",
        "Immediate synchronous answer from one system → RPC",
        "One authoritative copy shared live → Shared Database (with its coupling cost)"
      ],
      solution: [
        { label: "Decisions", code: "1) File Transfer  — periodic bulk catalog export, simple + universal.\n2) Messaging      — decoupled, near-real-time, survives outages, fan-out.\n3) RPC            — synchronous request/response for one immediate answer.\n4) Shared Database— single authoritative copy, no duplication (tight coupling)." }
      ],
      solutionNotes: `<p>The four styles trade off <strong>coupling, timeliness, reliability, and schema sharing</strong>. Messaging is the most decoupled and reliable for async fan-out; File Transfer is simplest for periodic bulk; RPC gives immediacy at the cost of tight temporal coupling; a Shared Database removes duplication but couples both apps to one schema. Most real landscapes mix styles — the skill is matching each need to its style.</p>`
    },
    {
      id: "eip-ex-02",
      section: "b6",
      title: "Route orders by type with a Content-Based Router",
      level: "medium",
      where: "Design — pattern modeling",
      task: `<p>Orders arrive on one channel but must go to different processors by type: <code>DIGITAL</code> → fulfilment-digital, <code>PHYSICAL</code> → warehouse, <code>SUBSCRIPTION</code> → billing. New types will appear over time. Design the routing so the sender stays unaware of the recipients, and note how to keep the router from becoming a maintenance bottleneck.</p>`,
      given: [
        { label: "Input", code: "channel 'orders' → { type: DIGITAL|PHYSICAL|SUBSCRIPTION, ... }\ndestinations: fulfilment-digital, warehouse, billing (more later)" }
      ],
      steps: [
        "Insert a Content-Based Router that inspects the order type",
        "Route each message to the one correct destination channel",
        "Keep the sender decoupled — it publishes to 'orders' only",
        "For frequent new types, consider a Dynamic Router so rules aren't hard-coded"
      ],
      solution: [
        { label: "Pattern flow", code: "orders ─► [Content-Based Router]\n              ├─ type=DIGITAL      ─► fulfilment-digital\n              ├─ type=PHYSICAL     ─► warehouse\n              └─ type=SUBSCRIPTION ─► billing\n(new types → add a rule; if that churns, use a Dynamic Router\n where destinations register their own routing rules)" }
      ],
      solutionNotes: `<p>A <strong>Content-Based Router</strong> examines message content and forwards it to the correct channel, keeping the sender ignorant of recipients. Its weakness is that it must know every destination's rule, so it can become a change bottleneck. A <strong>Dynamic Router</strong> fixes that by letting destinations register their own rules with the router, so new types don't require editing the router itself.</p>`
    },
    {
      id: "eip-ex-03",
      section: "b6",
      title: "Split a batch order, process items, recombine the result",
      level: "hard",
      where: "Design — pattern modeling",
      task: `<p>A single order message contains many line items. Each item must be processed independently (priced, stock-checked), then a single order-confirmation must be assembled once <strong>all</strong> items are done — even though they finish out of order. Design this and name the pattern the whole thing forms.</p>`,
      given: [
        { label: "Message", code: "Order{ id, items:[ item1, item2, ... itemN ] }\nneed: one Confirmation{ id, results:[...] } after ALL items processed" }
      ],
      steps: [
        "Splitter breaks the order into one message per line item",
        "Each item flows through the item-processing pipe (in parallel)",
        "Aggregator collects item results, correlating by order id",
        "Aggregator's completeness condition = all N items seen; then emit one Confirmation"
      ],
      solution: [
        { label: "Composed Message Processor", code: "Order ─► [Splitter] ─► item ─► (price + stock check) ─┐\n                       item ─► (price + stock check) ─┤\n                       item ─► (price + stock check) ─┤\n                                                       ▼\n                          [Aggregator] correlate by order id,\n                          complete when all N items collected ─► Confirmation" }
      ],
      solutionNotes: `<p>A <strong>Splitter</strong> emits one message per element; an <strong>Aggregator</strong> re-collects them using a <em>correlation</em> (order id) and a <em>completeness condition</em> (all N items), then publishes a single combined message. Split + independent processing + aggregate is the <strong>Composed Message Processor</strong>; when the items fan out to <em>different</em> systems it's a <strong>Scatter-Gather</strong>. The Aggregator is the stateful part — it must handle out-of-order arrival and decide when it's "done".</p>`
    },
    {
      id: "eip-ex-04",
      section: "b6",
      title: "Get the best quote from several vendors (Scatter-Gather)",
      level: "hard",
      where: "Design — pattern modeling",
      task: `<p>A quote request must be sent to several shipping vendors, and the <strong>cheapest</strong> reply returned to the caller. Vendors respond at different speeds and some may not respond at all. Design the fan-out/fan-in, and decide the completeness strategy given slow/absent vendors.</p>`,
      given: [
        { label: "Requirement", code: "request → N vendors (some slow, some silent)\nreturn: the single best (cheapest) quote within a time budget" }
      ],
      steps: [
        "Use a Recipient List (known vendors) or Publish-Subscribe to fan the request out",
        "Each vendor replies on a reply channel; tag replies with a Correlation Identifier",
        "Aggregator gathers replies for this request id and selects the minimum",
        "Completeness = all responded OR a timeout elapses (don't wait forever)"
      ],
      solution: [
        { label: "Scatter-Gather", code: "request ─► [Recipient List] ─► vendorA ─┐\n                              vendorB ─┤ replies (correlation id)\n                              vendorC ─┘\n                                        ▼\n           [Aggregator] pick MIN(price); complete on all-in OR timeout\n                        ─► best quote back to caller" }
      ],
      solutionNotes: `<p><strong>Scatter-Gather</strong> broadcasts a request and aggregates the responses. The scatter is a <strong>Recipient List</strong> (you name the vendors) or a <strong>Publish-Subscribe Channel</strong> (open-ended). The gather is an <strong>Aggregator</strong> whose <em>completeness condition</em> must tolerate reality: wait for all replies <em>or</em> a timeout, so one silent vendor can't hang the whole request. A <strong>Correlation Identifier</strong> ties each reply back to its request.</p>`
    },
    {
      id: "eip-ex-05",
      section: "b4",
      title: "Make a channel reliable: guaranteed delivery + failure channels",
      level: "hard",
      where: "Design — pattern modeling",
      task: `<p>Payment messages must survive a broker restart, must never silently vanish when a consumer can't process them, and malformed messages must be set aside for inspection rather than blocking the queue. Compose the channel-level reliability patterns and say what each one protects against.</p>`,
      given: [
        { label: "Requirements", code: "survive broker restart · don't lose unprocessable messages ·\nquarantine malformed messages without blocking the channel" }
      ],
      steps: [
        "Guaranteed Delivery — persist messages so a broker crash doesn't lose them",
        "Invalid Message Channel — route messages that fail validation/parsing here",
        "Dead Letter Channel — route messages the system can't deliver/process here",
        "Keep the main channel flowing; humans/automation inspect the side channels"
      ],
      solution: [
        { label: "Reliability composition", code: "producer ─► [Guaranteed Delivery: persistent channel] ─► consumer\n   parse/validate fails ────────────────► Invalid Message Channel\n   cannot be delivered/processed ─────────► Dead Letter Channel\nmain channel keeps flowing; side channels are triaged separately" }
      ],
      solutionNotes: `<p>Three distinct safeguards: <strong>Guaranteed Delivery</strong> persists messages so a crash doesn't lose them; an <strong>Invalid Message Channel</strong> receives messages that don't make sense (bad format/content); a <strong>Dead Letter Channel</strong> receives messages the <em>messaging system</em> can't deliver or that repeatedly fail processing. Separating "malformed" from "undeliverable" keeps the main channel unblocked and makes triage precise.</p>`
    },
    {
      id: "eip-ex-06",
      section: "b4",
      title: "Point-to-Point or Publish-Subscribe?",
      level: "medium",
      where: "Design — pattern modeling",
      task: `<p>Choose the channel type for each case and justify it. (1) A job must be handled by exactly one of several interchangeable workers. (2) An 'order placed' event must reach inventory, analytics, and email — and a new consumer might be added later without touching the producer.</p>`,
      given: [
        { label: "The two channel types", code: "Point-to-Point: one message → exactly one receiver (competing)\nPublish-Subscribe: one message → a copy to every subscriber" }
      ],
      steps: [
        "Ask: should exactly one consumer handle it, or all interested consumers?",
        "Exactly one of many workers → Point-to-Point Channel",
        "Broadcast to all interested + open-ended subscribers → Publish-Subscribe",
        "Note pub-sub lets you add subscribers without changing the producer"
      ],
      solution: [
        { label: "Decisions", code: "1) Point-to-Point Channel — competing workers, each job done once.\n2) Publish-Subscribe Channel — every subscriber gets a copy;\n   inventory/analytics/email each subscribe; add a 4th later\n   with no producer change." }
      ],
      solutionNotes: `<p>A <strong>Point-to-Point Channel</strong> delivers each message to exactly one receiver — ideal for distributing work across <em>Competing Consumers</em>. A <strong>Publish-Subscribe Channel</strong> delivers a copy to every subscriber — ideal for broadcasting events, and it decouples the producer from an open-ended set of consumers so new subscribers appear without producer changes.</p>`
    },
    {
      id: "eip-ex-07",
      section: "b7",
      title: "Mediate three input formats to one internal model",
      level: "hard",
      where: "Design — pattern modeling",
      task: `<p>Three partners send "new customer" in three different formats (CSV, a legacy XML, a partner JSON). Internally, everything should be one consistent shape, and adding a fourth partner later shouldn't ripple through the whole system. Design the transformation approach and name the key pattern that prevents the ripple.</p>`,
      given: [
        { label: "Inputs", code: "partnerA: CSV · partnerB: legacy XML · partnerC: partner JSON\ninternal: one consistent Customer shape for all downstream apps" }
      ],
      steps: [
        "Define a Canonical Data Model — the one internal Customer shape",
        "Give each partner a Normalizer / Message Translator to the canonical shape",
        "Downstream apps only ever see the canonical model",
        "A 4th partner = one new translator, not changes everywhere"
      ],
      solution: [
        { label: "Canonical hub", code: "CSV     ─► [Translator A] ─┐\nXML     ─► [Translator B] ─┼─► Canonical Customer ─► downstream apps\nJSON    ─► [Translator C] ─┘\n(a Normalizer routes+translates varying formats to the canonical model)" }
      ],
      solutionNotes: `<p>A <strong>Message Translator</strong> converts one format to another; a <strong>Normalizer</strong> handles several input formats, translating each to a common one. The pattern that stops N×M translator explosion is the <strong>Canonical Data Model</strong>: every app translates only between its own format and the canonical one, so adding a partner is one new translator — not a change to every downstream consumer.</p>`
    },
    {
      id: "eip-ex-08",
      section: "b7",
      title: "Move a huge attachment through a lightweight pipeline",
      level: "medium",
      where: "Design — pattern modeling",
      task: `<p>Incoming messages carry a 50 MB scanned document, but the routing/processing steps only need a few header fields, and only the final archival step needs the document itself. The message system has a small size limit. Design the flow so the big payload doesn't burden every hop.</p>`,
      given: [
        { label: "Message", code: "{ headers: {...small...}, document: <50 MB blob> }\nrouting steps need headers only; only archival needs the blob" }
      ],
      steps: [
        "Store the large document in an external store, keyed by a token",
        "Replace it in the message with a Claim Check (the token)",
        "Route the slim message through the pipeline on headers alone",
        "At archival, redeem the claim check to re-attach the document"
      ],
      solution: [
        { label: "Claim Check", code: "ingest ─► store blob → get token ─► message = { headers, token }\n         (slim message routes through all steps cheaply)\narchival ─► redeem token → fetch blob → archive with headers" }
      ],
      solutionNotes: `<p>The <strong>Claim Check</strong> pattern parks a large payload in a data store and carries only a lightweight <em>token</em> through the pipeline, re-attaching the data only where it's actually needed. It keeps messages small (fitting size limits, cheaper routing) and can also hide sensitive data from intermediate steps that have no business seeing it.</p>`
    },
    {
      id: "eip-ex-09",
      section: "b8",
      title: "Scale a consumer without double-processing",
      level: "hard",
      where: "Design — pattern modeling",
      task: `<p>A single consumer can't keep up with a payment queue. You need to scale out horizontally, but the upstream may redeliver a message after a crash, and a payment must never be applied twice. Design the endpoint patterns and explain how they combine.</p>`,
      given: [
        { label: "Constraints", code: "one queue, growing backlog · at-least-once delivery (redeliveries) ·\napply each payment exactly once despite parallel consumers + retries" }
      ],
      steps: [
        "Add Competing Consumers on the one channel to scale throughput",
        "Accept that redelivery + parallelism means the same message can arrive again",
        "Add an Idempotent Receiver keyed on the payment id",
        "Skip a payment id already seen; the store must be shared across consumers"
      ],
      solution: [
        { label: "Endpoint composition", code: "payments queue ─► [Competing Consumers]  (N parallel workers)\n                       each worker ─► [Idempotent Receiver]\n                          seen(paymentId)? → skip : apply + record id\n(shared 'seen' store so any worker recognizes a duplicate)" }
      ],
      solutionNotes: `<p><strong>Competing Consumers</strong> put several consumers on one Point-to-Point channel to process messages concurrently — throughput scales, but ordering is lost and redeliveries can duplicate work. An <strong>Idempotent Receiver</strong> makes reprocessing safe by recognizing an already-seen message id (in a store shared by all consumers) and skipping it. Together they give scalable <em>and</em> correct consumption.</p>`
    },
    {
      id: "eip-ex-10",
      section: "b5",
      title: "Correlate asynchronous replies to their requests",
      level: "medium",
      where: "Design — pattern modeling",
      task: `<p>A service sends many requests over messaging and gets replies asynchronously, out of order. Each reply must be matched to the exact request that caused it, and the requester wants replies delivered to a channel <em>it</em> chooses (which may differ per request). Design the message-construction patterns.</p>`,
      given: [
        { label: "Requirement", code: "many in-flight requests, async out-of-order replies\nmatch reply → request; requester dictates where the reply goes" }
      ],
      steps: [
        "Stamp each request with a unique Correlation Identifier",
        "The replier copies that id onto its reply",
        "The requester includes a Return Address naming the reply channel",
        "On reply, match by correlation id to the waiting request/state"
      ],
      solution: [
        { label: "Request-Reply construction", code: "request { correlationId: r-42, returnAddress: replies-svcA, ... }\n   replier processes, then:\nreply   { correlationId: r-42, ... } ─► channel 'replies-svcA'\n   requester matches r-42 to the pending request" }
      ],
      solutionNotes: `<p>Asynchronous request-reply needs two message-construction patterns. A <strong>Correlation Identifier</strong> is a unique token on the request that the replier echoes on the reply, letting the requester match out-of-order replies to their requests. A <strong>Return Address</strong> in the request tells the replier which channel to send the reply to, so the requester controls delivery and the replier stays decoupled from routing.</p>`
    },
    {
      id: "eip-ex-11",
      section: "b9",
      title: "Observe and manage a running message flow",
      level: "medium",
      where: "Design — pattern modeling",
      task: `<p>Operations must (1) inspect messages flowing on a live channel without disturbing them, (2) send control commands (enable/disable, adjust) to components across the system, and (3) retain a copy of every message for later audit/replay. Assign a System Management pattern to each need.</p>`,
      given: [
        { label: "Needs", code: "1) observe live messages without side effects\n2) control components org-wide\n3) keep an auditable copy of all messages" }
      ],
      steps: [
        "Insert a Wire Tap to duplicate messages off a channel for inspection",
        "Use a Control Bus for management/control messages to components",
        "Add a Message Store to persist copies for audit and replay",
        "Keep these off the primary flow so business processing is unaffected"
      ],
      solution: [
        { label: "Management composition", code: "1) [Wire Tap] on the channel → copy to an inspection channel (non-intrusive)\n2) [Control Bus] → enable/disable, reconfigure, collect health from components\n3) [Message Store] → persist every message for audit / replay / analytics" }
      ],
      solutionNotes: `<p>The System Management patterns run <em>alongside</em> the business flow. A <strong>Wire Tap</strong> copies messages off a channel for inspection without altering the original. A <strong>Control Bus</strong> is a separate channel for management/control traffic (start/stop, reconfigure, heartbeat) across distributed components. A <strong>Message Store</strong> retains copies for audit, reporting, and replay — none of which should interfere with primary processing.</p>`
    }
  ]
};
