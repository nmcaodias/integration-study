/* b7 — Message Transformation (book ch. 8) */
const P = "https://www.enterpriseintegrationpatterns.com/patterns/messaging/";

const notes = `
<h3>Why transformation patterns</h3>
<p>Ch. 3's Message Translator said formats can be reconciled; ch. 8 catalogs the specific jobs: complying with infrastructure envelopes, adding missing data, removing excess data, shrinking payloads, taming many formats into one, and — architecturally — deciding what the shared format between applications should be.</p>

<h3>Envelope Wrapper</h3>
<p>Messaging infrastructures impose their own envelope: required headers, security tokens, encryption, size framing. An <strong>Envelope Wrapper</strong> packs the application message into the infrastructure's envelope on the way in, and a matching <strong>unwrapper</strong> restores the original on the way out — so applications stay ignorant of the plumbing's dress code. Envelopes routinely nest (a message wrapped for the WAN inside a wrapper for the security gateway), unwrapped in reverse order like nested parcels.</p>

<h3>Content Enricher</h3>
<p>The target needs data the incoming message doesn't have (the message has a customer id; the target wants the full address). A <strong>Content Enricher</strong> obtains the missing data — <em>computing</em> it, pulling it from its <em>environment</em>, or querying an <em>external system</em> — and outputs the augmented message.</p>
<p><em>In this app's world:</em> a Mule flow that looks up data mid-flow and stores it via <code>target</code> variables, then merges it into the payload, is a content enricher.</p>

<h3>Content Filter</h3>
<p>The mirror image: the message carries <strong>more than the receiver should see or handle</strong> — verbose tree structures, sensitive fields, whole sections irrelevant downstream. A <strong>Content Filter</strong> removes and simplifies, leaving the essentials. (Don't confuse with the <em>Message</em> Filter of ch. 7, which drops or passes <em>whole messages</em>; the Content Filter reshapes the <em>inside</em> of one message.)</p>

<h3>Claim Check</h3>
<p>Enricher and filter combined into a storage protocol, for when the full payload shouldn't travel every hop:</p>
<ol>
<li>Store the message data in a persistent store, keyed by a claim ticket.</li>
<li>Pass a slim message carrying just the <strong>claim check</strong> (and whatever routing needs).</li>
<li>Downstream, a Content Enricher uses the ticket to retrieve the full data when it's actually needed.</li>
</ol>
<p>Use it to cut message size across many intermediate steps, or to keep <strong>sensitive data out of intermediate components</strong> — like a luggage check: carry the stub, not the suitcase.</p>

<h3>Normalizer</h3>
<p>Many senders, each with its own format, one receiver expectation. A <strong>Normalizer</strong> is a composite: a router detects each incoming message's format and dispatches it to the <strong>matching Message Translator</strong>, so whatever arrives leaves in the one common format. The routing usually keys off a Format Indicator (or schema detection), not per-sender channels.</p>

<h3>Canonical Data Model</h3>
<p>With N applications translating pairwise, you head toward <strong>N×(N−1) translators</strong> (every producer format to every consumer format). A <strong>Canonical Data Model</strong> introduces an application-independent format as the hub: each application translates only <em>to</em> and <em>from</em> the canonical form — <strong>2N translators</strong>, and a new application costs 2 more instead of 2N more.</p>
<ul>
<li>The trade: designing (and governing!) a data model everyone accepts is organizationally hard, every hop pays double translation, and the canonical model itself must be versioned.</li>
<li>The book's advice: canonical models earn their keep as the number of integrated applications grows; for two or three apps, direct translation is simpler.</li>
<li><em>In this app's world:</em> API-led connectivity's layer contracts play this role in MuleSoft land; in Kafka land, a governed subject in Schema Registry is the canonical form of a topic.</li>
</ul>`;

const section = {
  id: "b7",
  title: "Message Transformation",
  objectives: [
    "Wrap and unwrap infrastructure envelopes without touching application content",
    "Add missing data with a Content Enricher and strip excess with a Content Filter",
    "Shrink payloads and protect sensitive data with a Claim Check",
    "Normalize many inbound formats to one with a router + translators",
    "Explain when a Canonical Data Model beats pairwise translation (2N vs. N×(N−1))"
  ],
  notes,
  topicDocs: {
    "Why transformation patterns": P + "MessageTransformationIntro.html",
    "Envelope Wrapper": P + "EnvelopeWrapper.html",
    "Content Enricher": P + "DataEnricher.html",
    "Content Filter": P + "ContentFilter.html",
    "Claim Check": P + "StoreInLibrary.html",
    "Normalizer": P + "Normalizer.html",
    "Canonical Data Model": P + "CanonicalDataModel.html"
  }
};

const questions = [
  {
    id: "eip-701", section: "b7", level: "easy",
    q: "A message carries a customer id, but the shipping system needs the full delivery address. Which pattern applies?",
    options: ["Content Filter", "Content Enricher", "Claim Check", "Envelope Wrapper"],
    answer: 1,
    explanation: "The message lacks data its target requires, so an enricher obtains it (here, by querying the customer system) and emits the augmented message. The filter does the opposite — it removes data."
  },
  {
    id: "eip-702", section: "b7", level: "medium",
    q: "From which THREE sources can a Content Enricher obtain the missing data?",
    options: [
      "Computing it from data already in the message",
      "Its own environment (configuration, system clock, host identity)",
      "Querying an external system or database",
      "The intended receiver, which mails the data back after delivery"
    ],
    answers: [0, 1, 2],
    explanation: "Computation, environment, and an external resource are the book's three sources. Asking the receiver after delivery would defeat the point — the enrichment must happen before the message reaches the target."
  },
  {
    id: "eip-703", section: "b7", level: "medium",
    q: "How does the Claim Check pattern work?",
    options: [
      "It signs each message so tampering is detected at the destination",
      "It stores the payload in a persistent store and passes a slim message with a claim ticket; a later step retrieves the data by ticket when needed",
      "It splits the payload across several messages for size limits",
      "It compresses the body and adds a decompression header"
    ],
    answer: 1,
    explanation: "Check the luggage, carry the stub: intermediate steps handle a lightweight reference, and only the component that needs the full data claims it back — cutting message size across hops and keeping sensitive content out of components that shouldn't see it."
  },
  {
    id: "eip-704", section: "b7", level: "hard",
    q: "Twelve applications each parse the other eleven's formats today. What does moving to a Canonical Data Model change?",
    options: [
      "Translator count drops from up to 132 pairwise translators to 24 (one in, one out per application)",
      "Translation is no longer needed anywhere",
      "The apps must all adopt the canonical format internally",
      "Each app needs 11 new translators for safety"
    ],
    answer: 0,
    explanation: "Pairwise: N×(N−1) = 12×11 = 132 directional translators in the worst case. Canonical: 2N = 24, and application #13 costs 2 translators instead of 24. Apps keep their internal formats — they translate at their edges; that indirection is the whole pattern."
  },
  {
    id: "eip-705", section: "b7", level: "medium",
    q: "What is a Normalizer composed of?",
    options: [
      "A splitter and an aggregator",
      "A router that detects each message's format plus a set of translators, one per source format, all emitting the common format",
      "An envelope wrapper chained with a content filter",
      "A claim check and a datatype channel"
    ],
    answer: 1,
    explanation: "Detect, dispatch, translate: the router recognizes which format arrived (typically via a Format Indicator) and hands the message to the translator for that format, so heterogeneous input becomes one normalized output."
  },
  {
    id: "eip-706", section: "b7", level: "medium",
    q: "Which scenario calls for a Content Filter?",
    options: [
      "A reply must be matched to its request",
      "A mainframe response arrives as a 2,000-field record of which downstream needs 12 fields, some of them nested deep in the structure",
      "Two brokers must exchange messages",
      "A message must survive a broker restart"
    ],
    answer: 1,
    explanation: "Removing irrelevant fields and flattening cumbersome hierarchy down to the essentials is exactly the content filter's job — simplifying the inside of one message (unlike the ch. 7 Message Filter, which passes or drops whole messages)."
  },
  {
    id: "eip-707", section: "b7", level: "hard",
    q: "Why do Envelope Wrappers routinely come in nested pairs across an integration path?",
    options: [
      "Each envelope doubles as a backup of the message",
      "Each infrastructure segment (security gateway, WAN transport, partner network) imposes its own envelope, wrapped on entry and unwrapped in reverse order on exit",
      "The receiving application requires two copies of every header",
      "Nesting is required for the message to be routable at all"
    ],
    answer: 1,
    explanation: "A message crossing several infrastructure domains gets dressed for each in turn — like a letter in an envelope inside a courier pouch. Wrappers add compliance layers going in; unwrappers peel them in reverse coming out, leaving the application message untouched."
  },
  {
    id: "eip-708", section: "b7", level: "medium",
    q: "A message must pass through four intermediate routing steps, but its payload contains card data those components must not see. Which pattern does the book suggest?",
    options: [
      "Content Enricher at each step",
      "Claim Check — park the sensitive data, route a slim message with the ticket, and re-attach the data only at the authorized endpoint",
      "Message Filter in front of each component",
      "Canonical Data Model"
    ],
    answer: 1,
    explanation: "Besides shrinking messages, the claim check's second classic use is data protection: intermediate components handle only a reference, and the sensitive payload reappears only where it is entitled to."
  }
];

module.exports = { section, questions };
