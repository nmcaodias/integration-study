/* MCIA de-bias · sections a1–a2. Distractors made plausible/parallel; over-long
 * correct options trimmed (detail -> optionNotes); per-option notes added. */
module.exports = {
  questions: {
    "ia-001": {
      optionEdits: { 0: "The 5-second end-to-end latency target for each order", 2: "Handling the 200-orders-per-second peak throughput", 3: "The 99.95% platform availability target" },
      optionNotes: ["Latency is a non-functional (performance) requirement, not what the system does.", "Correct — 'sync orders to SAP' is the functional requirement: the behaviour delivered.", "Throughput is a non-functional (performance) requirement.", "Availability is a non-functional (reliability) requirement."]
    },
    "ia-002": {
      optionNotes: ["An EU control plane still connects to MuleSoft's cloud; the rule forbids any vendor-cloud connectivity.", "A MuleSoft-hosted control plane means metadata leaves the customer data centres — not allowed.", "Correct — PCE runs the whole control plane on customer infrastructure with customer-hosted runtimes: nothing leaves.", "CloudHub 2.0 private spaces are still MuleSoft-hosted, so metadata leaves the data centres."]
    },
    "ia-003": {
      optionNotes: ["RAML describes REST/HTTP APIs, not event-driven channels.", "OAS 3.0 describes request/response HTTP APIs, not async messaging.", "Correct — AsyncAPI is the spec for event-driven APIs: channels, messages, and schemas.", "WSDL describes SOAP web services, not event-driven messaging."]
    },
    "ia-004": {
      optionEdits: { 0: "Business data payloads flow through the control plane for policy evaluation and logging", 1: "The control plane provides design, deployment, and monitoring; business data flows only in the runtime plane", 2: "The runtime plane must always run in the same network as the control plane", 3: "Runtime Fabric is a deployment option of the control plane, not the runtime plane" },
      optionNotes: ["Business payloads never traverse the control plane; only metadata does.", "Correct — control plane = design/deploy/monitor; business data stays in the runtime plane.", "The runtime plane can run anywhere with outbound connectivity to the control plane.", "Runtime Fabric is a runtime-plane option, not a control-plane one."]
    },
    "ia-005": {
      optionEdits: { 0: "CloudHub 2.0, MuleSoft's fully hosted container platform", 1: "Anypoint Runtime Fabric on the customer's AKS cluster", 2: "A customer-hosted standalone Mule runtime on VMs", 3: "Anypoint Platform Private Cloud Edition (PCE)" },
      optionNotes: ["CloudHub 2.0 runs on MuleSoft's infrastructure, not the customer's AKS.", "Correct — Runtime Fabric runs Mule as containers on the customer's own Kubernetes, managed from the hosted control plane.", "Standalone runtimes aren't containerised on the customer's Kubernetes with control-plane management.", "PCE is a self-hosted control plane, not the container runtime option described."]
    },
    "ia-006": {
      optionEdits: { 0: "Responses must combine data from three separate backend systems", 1: "The API consumers are primarily mobile applications", 2: "Orders must never be lost, even during multi-hour backend outages", 3: "All the systems involved already expose REST APIs" },
      optionNotes: ["Aggregating backends is orchestration; it doesn't require async messaging.", "Consumer type doesn't dictate sync vs async.", "Correct — surviving long outages without losing orders needs durable, buffered async messaging.", "REST availability doesn't push you toward queues."]
    },
    "ia-007": {
      optionEdits: { 0: "It prevents other projects from reusing the System APIs", 1: "Each layer adds a network hop, increasing end-to-end latency", 2: "It makes applying different policies per layer impossible", 3: "Backends can no longer be replaced without changing consumers" },
      optionNotes: ["Layering enables reuse of System APIs, not the opposite.", "Correct — extra layers add hops and latency; that is the real cost to weigh against reuse/decoupling.", "Per-layer policies are a benefit of layering, not a cost.", "Layering decouples consumers from backends, so backends CAN be replaced."]
    },
    "ia-008": {
      optionEdits: { 0: "Queues deliver each message to every consumer; topics deliver to exactly one", 1: "Queues deliver each message to exactly one consumer; topics deliver a copy to every subscriber", 2: "Queues are always in-memory while topics are always persistent by design", 3: "Topics guarantee strict ordering whereas queues can never preserve it" },
      optionNotes: ["That reverses the semantics.", "Correct — queue = one consumer per message (competing consumers); topic/exchange = fan-out to all subscribers.", "Persistence is a config choice, not what distinguishes queues from topics.", "Ordering isn't the distinguishing property here."]
    },
    "ia-009": {
      optionEdits: { 0: "VM queues with persistent queues enabled on the app", 1: "Anypoint MQ for cross-application messaging", 2: "A shared Object Store polled by both applications", 3: "A shared flow invoked across apps via Flow Reference" },
      optionNotes: ["VM queues are intra-application only; they can't connect two separate CloudHub apps.", "Correct — Anypoint MQ is the cross-application, buffered, reliable broker for separate apps.", "Object Store isn't a message broker and adds polling latency.", "Flow Reference works only within one application."]
    },
    "ia-010": {
      optionEdits: { 0: "Competing consumers sharing one work queue", 1: "Claim check for large-payload handoff", 2: "Asynchronous request-reply with correlation IDs", 3: "Publish-subscribe broadcast to all subscribers" },
      optionNotes: ["Competing consumers is about scaling consumption, not deferred replies.", "Claim check offloads large payloads, unrelated to long-running replies.", "Correct — async request-reply with a correlation ID lets the caller get the result later without holding a connection.", "Pub-sub broadcasts events; it isn't a one-caller reply pattern."]
    },
    "ia-011": {
      optionEdits: { 0: "Messages may occasionally arrive already encrypted", 1: "The same message may be delivered more than once", 2: "Messages will always arrive in strict global order", 3: "The broker discards any messages older than 24 hours" },
      optionNotes: ["At-least-once says nothing about encryption.", "Correct — at-least-once means duplicates are possible, so consumers must be idempotent.", "At-least-once doesn't guarantee global ordering.", "Retention is a config, not implied by delivery semantics."]
    },
    "ia-012": {
      optionEdits: { 0: "The order service calls each downstream system sequentially over HTTP", 1: "Publish the event once to an exchange/topic; each system consumes from its own subscription", 2: "Store orders in an Object Store that all three systems poll periodically", 3: "Use Scatter-Gather to call all three systems synchronously in one flow" },
      optionNotes: ["Sequential HTTP couples the producer to every consumer's availability.", "Correct — publish once, fan out via subscriptions; each system consumes independently at its own pace.", "Polling an Object Store is inefficient and not event-driven.", "Scatter-Gather is synchronous and couples the caller to all three."]
    },
    "ia-013": {
      optionEdits: { 0: "Message batching to fit the size limit", 1: "Claim check — store the payload externally and send a reference", 2: "Competing consumers across the subscribers", 3: "Idempotent receiver to drop duplicates" },
      optionNotes: ["Batching groups messages; it doesn't shrink a single 200 MB payload.", "Correct — claim check stores the large payload externally and passes only a reference through the queue.", "Competing consumers is about throughput, not payload size.", "Idempotent receiver handles duplicates, not size limits."]
    },
    "ia-014": {
      optionEdits: { 0: "When the caller cannot proceed without the result and the operation is fast", 1: "When the target system has frequent multi-hour outages to absorb", 2: "When load spikes must be buffered and absorbed downstream", 3: "When many independent systems must react to the same event" },
      optionNotes: ["Correct — sync request-response fits fast operations where the caller needs the answer immediately.", "Frequent outages favour durable async messaging, not sync.", "Buffering spikes is a messaging strength, not sync.", "Fan-out to many reactors is pub-sub, not sync request-response."]
    },
    "ia-074": {
      optionEdits: { 0: "A US control plane paired with CloudHub runtimes", 1: "EU control plane + customer-hosted runtimes registered via Runtime Manager", 2: "Private Cloud Edition paired with CloudHub runtimes", 3: "A GovCloud control plane with Runtime Fabric" },
      optionNotes: ["A US control plane puts metadata outside the EU.", "Correct — EU control plane keeps metadata in-region; customer-hosted runtimes keep the apps in the bank's data centres.", "PCE + CloudHub is contradictory and doesn't meet the EU-metadata + own-DC split.", "GovCloud is a US-region offering, not EU."]
    },
    "ia-075": {
      optionEdits: { 0: "The order service calls each system's REST API in a fixed sequence", 1: "Publish an OrderPlaced event to an exchange/topic; each current and future system subscribes independently", 2: "Export orders to CSV in a nightly batch for each system", 3: "Use Scatter-Gather to call the four current systems at once" },
      optionNotes: ["Hard-wiring calls means editing the producer for every new consumer.", "Correct — pub-sub lets new subscribers join later with no change to the PIM/order integration.", "Nightly CSV is neither timely nor extensible per new consumer.", "Scatter-Gather hard-codes the current systems and is synchronous."]
    },
    "ia-076": {
      optionEdits: { 0: "When the caller cannot proceed without the response and the operation completes quickly", 1: "When the downstream system suffers frequent outages", 2: "When sudden load spikes must be absorbed and smoothed", 3: "When ordering must be preserved across weeks of traffic" },
      optionNotes: ["Correct — sync request-reply suits fast operations where the caller needs the result to continue.", "Frequent outages call for durable async messaging.", "Absorbing spikes is a queue's job, not sync.", "Long-lived ordering is a messaging concern, not sync request-reply."]
    }
  }
};
