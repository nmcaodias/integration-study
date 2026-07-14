// MuleSoft Platform Integration Architect (Mule-Arch-202) — study notes, sections 1–5
window.CERT_DATA = window.CERT_DATA || {};
window.CERT_DATA.mcia = {
  id: "mcia",
  name: "Salesforce Certified MuleSoft Platform Integration Architect (Mule-Arch-202)",
  short: "Integration Architect",
  exam: { questions: 60, minutes: 120, passPct: 70 },
  questions: [],
  sections: [
    {
      id: "a1",
      title: "Initiating Integration Solutions on Anypoint Platform",
      weight: 8,
      topicDocs: {
        "Functional vs non-functional requirements": "https://docs.mulesoft.com/general/api-led-overview",
        "Platform features for web and event-driven APIs": "https://docs.mulesoft.com/general/",
        "Control plane and runtime plane deployment options": "https://docs.mulesoft.com/runtime-fabric/latest/"
      },
      objectives: [
        "Differentiate between functional and non-functional requirements for integration solutions",
        "Select features of Anypoint Platform for designing and managing web and event-driven APIs",
        "Select deployment options of the Anypoint Platform control plane and runtime plane"
      ],
      notes: `
<h3>Functional vs non-functional requirements</h3>
<p>Architects translate stakeholder needs into two distinct categories, and exam scenarios expect you to classify them instantly:</p>
<table>
<tr><th>Functional (WHAT the solution does)</th><th>Non-functional (HOW WELL it does it)</th></tr>
<tr><td>"Sync orders from the webshop to SAP", "expose customer data to the mobile app", "transform X to canonical format Y", business rules, validations, routing logic</td><td>Performance (throughput, latency), scalability, availability/HA, disaster recovery (RTO/RPO), reliability (zero message loss), security (authN/Z, encryption, compliance), maintainability, observability, capacity</td></tr>
</table>
<p><strong>NFRs drive architecture.</strong> Two solutions with identical functional requirements look completely different when one needs 99.99% availability and zero message loss and the other is a nightly batch. Most MCIA exam questions are NFR-driven: "must not lose messages" → persistent queues + transactions; "must respond in &lt; 500 ms" → caching/streaming decisions; "must survive a region outage" → DR design.</p>

<h3>Platform features for web and event-driven APIs</h3>
<table>
<tr><th>Need</th><th>Anypoint Platform feature</th></tr>
<tr><td>Design REST API contracts</td><td>API Designer (RAML / OAS), mocking service</td></tr>
<tr><td>Design event-driven/async API contracts</td><td><strong>AsyncAPI</strong> specifications (supported in Design Center/Exchange alongside RAML and OAS)</td></tr>
<tr><td>Share and discover reusable assets</td><td>Anypoint Exchange (specs, fragments, connectors, templates, examples)</td></tr>
<tr><td>Implement APIs and integrations</td><td>Anypoint Studio / Code Builder, APIkit (REST + SOAP), Mule SDK for custom connectors</td></tr>
<tr><td>Govern and secure deployed APIs</td><td>API Manager (instances, policies, contracts, SLA tiers, analytics)</td></tr>
<tr><td>Cloud messaging between apps</td><td>Anypoint MQ (standard + FIFO queues, exchanges, DLQs)</td></tr>
<tr><td>Deploy, scale, operate apps</td><td>Runtime Manager + Anypoint Monitoring / Visualizer</td></tr>
<tr><td>Identity, access, org structure</td><td>Access Management (business groups, environments, roles, connected apps, identity/client providers)</td></tr>
</table>

<h3>Control plane and runtime plane deployment options</h3>
<p>Anypoint Platform separates the <strong>control plane</strong> (design, deploy, manage, monitor — Design Center, Exchange, Management Center) from the <strong>runtime plane</strong> (where Mule apps execute and process data).</p>
<table>
<tr><th>Control plane options</th><th>Notes</th></tr>
<tr><td>MuleSoft-hosted (US or EU)</td><td>Standard SaaS control plane; EU control plane keeps management data in Europe</td></tr>
<tr><td>Anypoint Platform PCE (Private Cloud Edition)</td><td>Customer-hosted control plane for strict data-residency/air-gapped requirements; reduced feature set</td></tr>
</table>
<table>
<tr><th>Runtime plane option</th><th>Managed by</th><th>Characteristics</th></tr>
<tr><td><strong>CloudHub (1.0 / 2.0)</strong></td><td>MuleSoft (iPaaS)</td><td>Fully managed on AWS; workers (CH1) or replicas in private spaces (CH2); fastest to adopt, least operational burden</td></tr>
<tr><td><strong>Runtime Fabric (RTF)</strong></td><td>Customer infrastructure, MuleSoft-managed orchestration</td><td>Container service (Kubernetes-based) on customer's cloud (EKS/AKS/GKE, self-managed K8s) or VMs/bare metal; cloud control plane manages it; supports Anypoint Security edge features</td></tr>
<tr><td><strong>Customer-hosted (hybrid)</strong></td><td>Customer</td><td>Standalone Mule runtimes on customer servers/VMs, registered with the control plane via Runtime Manager agent; supports clusters, server groups, domains</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> match constraints to planes: "management metadata must stay in the EU" → EU control plane; "no connectivity to any MuleSoft cloud allowed" → PCE + customer-hosted runtimes; "we want containers on our own AWS but platform-managed deployments" → Runtime Fabric; "minimum ops effort" → CloudHub. Remember: <em>business data flows only through the runtime plane</em> — the MuleSoft-hosted control plane sees metadata, not your payloads.</p>`
    },
    {
      id: "a2",
      title: "Designing Architecture Using Integration Paradigms",
      weight: 10,
      topicDocs: {
        "API-led connectivity as an architecture": "https://docs.mulesoft.com/general/api-led-overview",
        "Web APIs and HTTP": "https://docs.mulesoft.com/http-connector/latest/",
        "Event-driven APIs and message brokers": "https://docs.mulesoft.com/mq/",
        "Common messaging patterns": "https://docs.mulesoft.com/mule-runtime/latest/reliability-patterns"
      },
      objectives: [
        "Create high-level integration architectures using API-led Connectivity",
        "Create high-level integration architectures using web APIs and HTTP",
        "Create high-level integration architectures using event-driven APIs and message brokers",
        "Design Mule applications and integration solutions using common messaging patterns and technologies"
      ],
      notes: `
<h3>API-led connectivity as an architecture</h3>
<p>The three-layer model (Experience / Process / System — see the MCD L1 notes for the diagram) is the default MuleSoft answer to "how do we structure the application network." As an <em>architect</em>, know its trade-offs, not just its shape:</p>
<ul>
<li><strong>Benefits:</strong> reuse (System APIs serve many projects), decoupling (backends can be swapped behind stable contracts), independent scaling and ownership per layer, governance points at each boundary.</li>
<li><strong>Costs:</strong> extra network hops add latency; more deployable units to operate and version; not every flow needs all three layers (a simple pass-through may justify collapsing layers — architecture is about <em>justified</em> exceptions).</li>
<li>Layers are enforced organizationally (naming, Exchange catalogs, C4E guidance), not by the platform itself.</li>
</ul>

<h3>Web APIs and HTTP</h3>
<ul>
<li><strong>Synchronous request-response</strong> over HTTP(S) is the right paradigm when the caller needs the answer NOW (UI interactions, validations, lookups). Latency budgets add up across layers — an Experience→Process→System chain has three sequential hops.</li>
<li>REST maturity: resources + verbs + status codes; idempotency of PUT/DELETE/GET matters for retry design (safe to retry) vs POST (needs idempotency keys or dedup).</li>
<li>HTTP-based integration couples <em>availability</em>: if the backend is down, the caller fails (unless you add async buffering). This "temporal coupling" is the core argument for messaging in reliability scenarios.</li>
</ul>

<h3>Event-driven APIs and message brokers</h3>
<ul>
<li><strong>Message brokers decouple in time</strong>: producers publish; consumers process when able. Load spikes are buffered; consumers can be down without losing data; producers don't know consumers.</li>
<li>Broker options in scope: <strong>Anypoint MQ</strong> (MuleSoft-hosted: standard queues, FIFO queues, message <em>exchanges</em> for fan-out, DLQs, ack modes), <strong>JMS</strong> brokers (ActiveMQ, IBM MQ — queues and topics), <strong>VM queues</strong> (intra-app only), and externally Kafka for high-volume event streaming.</li>
<li><strong>Event-driven APIs</strong> are contracts over async channels, described with <strong>AsyncAPI</strong>: instead of "GET /orders", the contract says "the OrderCreated event is published on channel X with this schema".</li>
<li>Queue vs topic/exchange semantics: <em>queue</em> = each message consumed by ONE consumer (point-to-point, competing consumers scale horizontally); <em>topic/exchange</em> = each subscriber gets a COPY (pub-sub, broadcast).</li>
</ul>

<h3>Common messaging patterns</h3>
<table>
<tr><th>Pattern</th><th>What it solves</th><th>MuleSoft realization</th></tr>
<tr><td>Point-to-point</td><td>Reliable handoff to exactly one processor</td><td>Anypoint MQ / JMS queue, VM queue</td></tr>
<tr><td>Publish-subscribe</td><td>Broadcast one event to many independent consumers</td><td>JMS topic, Anypoint MQ message exchange</td></tr>
<tr><td>Competing consumers</td><td>Scale consumption horizontally</td><td>Multiple workers/nodes consuming one queue</td></tr>
<tr><td>Asynchronous request-reply</td><td>Get an answer without blocking/temporal coupling</td><td>Request queue + reply queue, correlation ID carried in messages (JMS <code>JMSCorrelationID</code> / MQ properties)</td></tr>
<tr><td>Dead-letter queue</td><td>Park poison messages for inspection</td><td>Anypoint MQ DLQ (delivery-count based), JMS broker DLQs, redelivery policy + custom DLQ flow</td></tr>
<tr><td>Idempotent receiver</td><td>Tolerate duplicate delivery (at-least-once brokers)</td><td>Idempotent Message Validator backed by Object Store</td></tr>
<tr><td>Claim check</td><td>Keep large payloads out of the broker</td><td>Store payload (S3/DB), send reference message</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> the sync-vs-async decision is the most common scenario question. Caller needs the result to proceed → HTTP request-response. "Must not lose orders even if the ERP is down for hours" / "handle Black Friday spikes" / "notify N systems" → broker-based async. And remember every at-least-once delivery system implies <em>duplicates are possible</em> — pair it with idempotency.</p>`
    },
    {
      id: "a3",
      title: "Designing and Developing Mule Applications",
      weight: 15,
      topicDocs: {
        "Setting Mule application properties": "https://docs.mulesoft.com/mule-runtime/latest/configuring-properties",
        "Core routers and fundamental features": "https://docs.mulesoft.com/mule-runtime/latest/about-components",
        "The Salesforce Connector": "https://docs.mulesoft.com/salesforce-connector/latest/",
        "Common features of core connectors": "https://docs.mulesoft.com/mule-runtime/latest/reconnection-strategy-about",
        "Metadata sources for Transform Message (DataSense)": "https://docs.mulesoft.com/dataweave/latest/",
        "Canonical (common) data models": "https://docs.mulesoft.com/general/api-led-overview",
        "Validating data": "https://docs.mulesoft.com/validation-connector/latest/"
      },
      objectives: [
        "Select among available options for setting Mule application properties",
        "Select and use fundamental features available to all Mule applications",
        "Design Mule applications using core routers",
        "Describe the fundamental features of the Salesforce Connector",
        "Design Mule applications using common features of core connectors",
        "Select and use the available sources of metadata in the Transform Message component",
        "Design Mule applications and integration solutions using a Common/Canonical Data Model",
        "Correctly apply methods for validating data in Mule applications"
      ],
      notes: `
<h3>Setting Mule application properties</h3>
<p>Property values can come from several places; know the precedence (highest wins):</p>
<ol>
<li><strong>Deployment properties</strong> — set in Runtime Manager (or Maven plugin deployment config); survive restarts, per-environment, can be hidden/masked.</li>
<li><strong>System properties</strong> — JVM <code>-D</code> arguments (e.g. <code>-Denv=dev</code> in Studio run configurations, <code>wrapper.conf</code> on standalone).</li>
<li><strong>Environment variables</strong> — referenced via <code>\${...}</code> when configured, or DataWeave <code>Mule::p()</code>.</li>
<li><strong>Property files</strong> in the app (<code>\${env}.yaml</code> pattern) — the packaged defaults.</li>
</ol>
<p>Secrets belong in <strong>secure properties</strong> (encrypted files + runtime key) or platform secret stores — never plaintext in the JAR. <code>mule-artifact.json</code>'s <code>secureProperties</code> masks values in Runtime Manager.</p>

<h3>Core routers and fundamental features</h3>
<p>All the MCD-level building blocks are assumed: flows/subflows, error handling, Choice, Scatter-Gather, First Successful, Round Robin, Until Successful, For Each / Parallel For Each, Batch. The architect angle is <em>selection</em>: Scatter-Gather for parallel aggregation (latency = slowest branch), First Successful for failover chains, Until Successful for transient-failure retries, Batch for very large datasets with record-level reliability. Choose the simplest construct that meets the NFR.</p>

<h3>The Salesforce Connector</h3>
<table>
<tr><th>Capability</th><th>Details</th></tr>
<tr><td>CRUD + query operations</td><td>Query (SOQL), Query All, Create, Update, Upsert (external ID!), Delete; result paging is automatic (auto-paging streams)</td></tr>
<tr><td>Bulk operations</td><td>Bulk API v2 (Create job / upload / query) for very large volumes — async jobs, higher governor-limit efficiency than record-by-record</td></tr>
<tr><td>Event sources</td><td><strong>Subscribe Channel</strong> (streaming API), platform events, Change Data Capture (CDC) — receive events pushed from Salesforce; replay IDs support resuming</td></tr>
<tr><td>Publishing events</td><td>Publish platform events into Salesforce's event bus</td></tr>
<tr><td>Authentication</td><td>Basic (username+password+token), OAuth 2.0 flows including <strong>JWT bearer</strong> for server-to-server</td></tr>
</table>
<p>Architectural notes: respect Salesforce <strong>governor/API limits</strong> — prefer Bulk API for mass loads, cache reference data, and remember the Streaming API is effectively single-consumer per subscription (a Mule <em>cluster</em> runs it on the primary node only to avoid duplicates).</p>

<h3>Common features of core connectors</h3>
<ul>
<li><strong>Reconnection strategies</strong> on every connector config: none / standard (count × frequency) / forever — retries the <em>connection</em>, not the operation.</li>
<li><strong>Connection pooling</strong> (DB and others), <strong>timeouts</strong> (connection vs response), <strong>TLS contexts</strong>, <strong>proxy configs</strong>.</li>
<li><strong>Operations vs sources</strong>; sources may support watermarking, <code>primaryNodeOnly</code>, and redelivery policies.</li>
<li><strong>Streaming</strong> of results (repeatable streams; auto-paging for object streams) and <strong>target variables</strong> to enrich without clobbering the payload.</li>
</ul>

<h3>Metadata sources for Transform Message (DataSense)</h3>
<p>DataWeave design-time metadata (the trees in the Transform UI) can come from:</p>
<ul>
<li><strong>Connector-provided metadata</strong> — operations declare their input/output types (e.g. Salesforce object fields, DB columns after query execution, WSDL types).</li>
<li><strong>API specifications</strong> — APIkit propagates RAML/OAS types into flows.</li>
<li><strong>Custom metadata types</strong> — defined in the project (Metadata Types dialog) from JSON/XML <em>schemas</em> or <em>examples</em>, CSV definitions, object structures; attached to components' input/output.</li>
<li><strong>Sample data</strong> — provide sample payloads to preview transformations live.</li>
</ul>
<p>Metadata is a <em>design-time</em> aid only — it doesn't validate at runtime.</p>

<h3>Canonical (common) data models</h3>
<ul>
<li>A <strong>Canonical Data Model (CDM)</strong> defines one shared representation (e.g. "Customer") so N systems need N mappings (each to/from the CDM) instead of N×(N−1) point-to-point mappings.</li>
<li><strong>Benefits:</strong> fewer mappings at scale, shared vocabulary, natural fit for the Process layer of API-led.</li>
<li><strong>Costs / cautions:</strong> enterprise-wide CDMs are notoriously hard to agree and version; they can become bloated lowest-common-denominator models. Modern practice favors <em>bounded contexts</em> — smaller canonical models per business domain, published as reusable types in Exchange — over one giant model.</li>
<li>In Mule: CDM types live as RAML/JSON schema fragments in Exchange; System APIs translate system formats ↔ CDM; Process APIs speak CDM only.</li>
</ul>

<h3>Validating data</h3>
<table>
<tr><th>Method</th><th>Where it fits</th></tr>
<tr><td>APIkit router validation</td><td>Requests validated against the RAML/OAS contract at the edge (types, required params) — free, contract-driven</td></tr>
<tr><td>Validation module</td><td>Explicit business checks in flows; raises typed VALIDATION errors; composable with All/Any</td></tr>
<tr><td>JSON / XML schema validation</td><td>JSON Schema validation operation, XML module schema validation for document-level structural checks</td></tr>
<tr><td>DataWeave <code>fail()</code> / custom checks</td><td>Inline assertions inside transformations (use sparingly; prefer explicit validators)</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> "validate incoming requests against the API contract" → APIkit (don't hand-code it). "Validate a business rule mid-flow and return a typed error" → Validation module. Upsert-by-external-ID and Bulk API v2 are the Salesforce Connector facts most often tested.</p>`
    },
    {
      id: "a4",
      title: "Designing for Persistence Requirements",
      weight: 10,
      topicDocs: {
        "VM queues across deployment options": "https://docs.mulesoft.com/vm-connector/latest/",
        "Object Stores across deployment options": "https://docs.mulesoft.com/object-store/",
        "Stateful components backed by Object Stores": "https://docs.mulesoft.com/mule-runtime/latest/cache-scope"
      },
      objectives: [
        "Design Mule applications using VM queues and the VM Connector in all deployment options",
        "Design Mule applications using Object Stores, the OS Connector, and OS services in all deployment options",
        "Design solutions using stateful components that may be configured with an Object Store"
      ],
      notes: `
<h3>VM queues across deployment options</h3>
<ul>
<li>VM queues connect flows <strong>within one Mule application</strong> (never between different apps — use Anypoint MQ/JMS for that). Publish / Listener / Consume operations; queues are <strong>transient</strong> (in-memory, fast, lost on crash) or <strong>persistent</strong> (survive restart).</li>
<li><strong>Standalone runtime:</strong> persistent queues use local disk — reliable on that one server.</li>
<li><strong>Cluster:</strong> VM queues (transient AND persistent) live in the <strong>distributed shared memory grid</strong> — any node can consume, giving load balancing across nodes; "persistent" in a cluster means replicated in the grid's backup, not on disk.</li>
<li><strong>CloudHub 1.0:</strong> enabling "persistent queues" for an app backs VM queues with a cloud queueing service — messages survive worker restarts and are shared <em>across workers of that app</em> (this is also how multi-worker apps distribute VM-queued work). Without it, VM queues are per-worker in-memory.</li>
<li><strong>CloudHub 2.0:</strong> persistent VM queues are <strong>not supported</strong> — use Anypoint MQ for durable messaging.</li>
</ul>

<h3>Object Stores across deployment options</h3>
<ul>
<li>An <strong>Object Store</strong> is key-value state owned by an app: OS Connector operations (store/retrieve/contains/remove/clear), TTLs, and per-store config (persistent vs in-memory, max entries).</li>
<li><strong>Standalone:</strong> in-memory or file-persistent stores on the server; in a <strong>cluster</strong>, stores live in the shared grid — all nodes see the same state (this is what makes idempotency and watermarks work cluster-wide).</li>
<li><strong>CloudHub — Object Store v2 (OSv2):</strong> platform service, shared across an app's workers, replicated within the region. Key facts: entry <strong>TTL up to 30 days maximum</strong> (default and cap), value size limit 10 MB, rate-limited API (bursts throttled), accessible via the <strong>OSv2 REST API</strong> too (external tools can read/write, e.g. to seed or inspect state).</li>
<li>Object Stores are for <em>state</em>, not messaging and not a database: watermarks, dedup IDs, cached lookups, tokens, counters. If you're storing business records, use a database.</li>
</ul>

<h3>Stateful components backed by Object Stores</h3>
<table>
<tr><th>Component</th><th>State it keeps in an OS</th><th>Architect concern</th></tr>
<tr><td>Cache scope</td><td>Cached responses by key</td><td>Choose the OS: in-memory per node (fast, inconsistent across nodes) vs shared/persistent (consistent, slower); TTL/invalidation strategy</td></tr>
<tr><td>Idempotent Message Validator</td><td>Seen message IDs</td><td>MUST use a shared OS in clusters/multi-worker apps, or duplicates slip through on other nodes</td></tr>
<tr><td>Watermarks (manual or source-managed)</td><td>Last-synced key/timestamp</td><td>Shared OS so any node resumes correctly; think about reset procedures</td></tr>
<tr><td>Until Successful / redelivery counters, OAuth token caches</td><td>Retry counts, tokens</td><td>Mostly automatic; be aware they exist when sizing OS usage</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> the classic trap is state that works on one worker but breaks when scaled: an idempotency check or watermark in a per-node in-memory store fails on 2+ workers/nodes. Multi-instance ⇒ shared store (OSv2 on CloudHub, cluster grid on-prem). And "reliable messaging between two CloudHub 2.0 apps" is Anypoint MQ — not VM, not OSv2.</p>`
    },
    {
      id: "a5",
      title: "Designing for the Runtime Plane Technology Architecture",
      weight: 15,
      topicDocs: {
        "Mule runtime clusters": "https://docs.mulesoft.com/mule-runtime/latest/mule-high-availability-ha-clusters",
        "CloudHub networking": "https://docs.mulesoft.com/cloudhub/cloudhub-networking-guide",
        "Runtime domains — when they help": "https://docs.mulesoft.com/mule-runtime/latest/shared-resources",
        "Mule 4 class loader isolation": "https://docs.mulesoft.com/mule-runtime/latest/about-classloading-isolation",
        "The reactive event processing model": "https://docs.mulesoft.com/mule-runtime/latest/execution-engine"
      },
      objectives: [
        "Analyze the mode of operation of a Mule runtime cluster vs other deployment options",
        "Design CloudHub solutions using CloudHub's network features",
        "Choose Mule runtime domains only where their capabilities clearly help",
        "Design applications making effective use of Mule 4 class loader isolation",
        "Describe the Mule 4 reactive event processing model"
      ],
      notes: `
<h3>Mule runtime clusters</h3>
<figure><img src="images/cluster.png" alt="A Mule cluster: nodes connected through a distributed shared memory grid"><figcaption>Cluster nodes share state through a distributed shared memory grid <em>(source: docs.mulesoft.com)</em></figcaption></figure>
<ul>
<li>A <strong>cluster</strong> (customer-hosted only) is a set of Mule runtimes acting as one unit via a <strong>distributed shared memory grid</strong> (Hazelcast). Shared: persistent + transient <strong>VM queues</strong>, <strong>Object Stores</strong>, and the runtime <strong>LockFactory</strong>. Model is <strong>active-active</strong> — all nodes process events.</li>
<li>The <strong>primary node</strong> exclusively runs Schedulers and sources marked <code>primaryNodeOnly</code> (JMS topic listeners, Salesforce streaming, file polling…) so polling/subscription isn't duplicated. If the primary fails, another node is elected.</li>
<li>Failure handling: in-flight work on a dead node is recoverable because queued messages live in the grid; other nodes pick them up.</li>
<li><strong>Quorum</strong> protects against split-brain when a cluster spans zones: only the partition with the majority keeps working (applies to Object Store operations).</li>
<li><strong>Cluster vs server group:</strong> a server group is just a deployment target (same app on N independent servers) — <em>no shared state, no primary node</em>. Idempotency, shared VM queues, and single-consumer sources only work correctly on a cluster (or with external shared infrastructure).</li>
<li>Requirements: ≥2 nodes, reliable LAN, TCP 5701–5703 between nodes (+UDP multicast if enabled).</li>
</ul>

<h3>CloudHub networking</h3>
<figure><img src="images/ch-networking-guide.png" alt="CloudHub networking: shared load balancer in front of workers, optional VPC, external and internal worker DNS records"><figcaption>CloudHub: load balancer → workers, optional Anypoint VPC, and the three DNS record families <em>(source: docs.mulesoft.com)</em></figcaption></figure>
<ul>
<li><strong>Workers</strong> are dedicated VMs (per app) in a MuleSoft-managed AWS account; multi-worker apps are load-balanced and spread across availability zones automatically.</li>
<li><strong>Shared load balancer (SLB):</strong> <code>myapp.&lt;region&gt;.cloudhub.io</code> on 80/443 forwards to worker port <strong>8081/8082</strong> (listeners must bind <code>\${http.port}</code>/<code>\${https.port}</code>). Idle timeout ~300 s; no custom domains/certs.</li>
<li><strong>Anypoint VPC:</strong> a private network for your workers, connectable to your data center via <strong>VPN or AWS DirectConnect/peering</strong>. Inside a VPC, workers expose <strong>internal-only ports 8091/8092</strong> (<code>\${http.private.port}</code>) reachable via <code>mule-worker-internal-myapp...</code> DNS — the standard way to make APIs private.</li>
<li><strong>Dedicated load balancer (DLB):</strong> deployed into your VPC; gives custom domains + your TLS certs (incl. two-way TLS), mapping rules, and routes to workers' internal ports. Public SLB access can then be blocked via VPC firewall rules.</li>
<li><strong>Static IPs</strong> can be enabled per app for allowlisting by partners (public IPs only, not inside VPC).</li>
<li>CloudHub 2.0 equivalents: <strong>private spaces</strong> (≈VPC + ingress), replicas instead of workers.</li>
</ul>

<h3>Runtime domains — when they help</h3>
<p>Domains (customer-hosted standalone/cluster only) share global configs — most usefully a shared <strong>HTTP listener</strong> (one port for many apps on the same runtime), shared TLS contexts, DB configs. Choose them ONLY when apps co-located on one runtime genuinely benefit (port sharing, config dedup); costs: domain redeploys affect all apps, tighter coupling, not portable to CloudHub/RTF (each app there is isolated).</p>

<h3>Mule 4 class loader isolation</h3>
<ul>
<li>Mule 4 isolates classloaders in a hierarchy: <strong>runtime</strong> classes, each <strong>plugin/connector's</strong> classes, and the <strong>application's</strong> classes are separated — apps only see the runtime's exported API and their own dependencies, so a connector's internal libraries can't clash with the app's versions (the Mule 3 "jar hell" fix).</li>
<li>Consequences to design for: a JAR the <em>app</em> declares is invisible to <em>connectors</em> — JDBC drivers / JMS client JARs must be declared as <strong>sharedLibraries</strong> in the mule-maven-plugin so they're loaded where the connector can see them.</li>
<li>Custom code (Java) that must be reused across apps → package as a library or a <strong>Mule plugin</strong> (classifier <code>mule-plugin</code>) which gets its own isolated classloader; <code>mule-artifact.json</code> can export packages/resources deliberately.</li>
</ul>

<h3>The reactive event processing model</h3>
<ul>
<li>Mule 4's execution engine is <strong>non-blocking / reactive</strong>: flows don't own threads; events are scheduled onto a small number of shared thread pools (consolidated into the single self-tuning <strong>UBER</strong> pool in current runtimes).</li>
<li>Each operation declares a <strong>processing type</strong>: <code>CPU_LITE</code> (quick, non-blocking — most processors), <code>CPU_INTENSIVE</code> (heavy compute, e.g. large transforms), <code>BLOCKING_IO</code> (waits on I/O, e.g. JDBC). The runtime schedules each on appropriate threads — a few hundred threads can serve thousands of concurrent events because waiting doesn't hold a thread (non-blocking HTTP, async connectors).</li>
<li><strong>Back-pressure:</strong> when concurrency limits are hit, sources are told to slow down (HTTP returns 503). Shape concurrency with <code>maxConcurrency</code> on flows rather than custom thread pools; per-flow pool tuning is a Mule 3 habit that no longer applies.</li>
<li>Implication for design: never block inside CPU_LITE custom code (Thread.sleep, sync HTTP calls in Java) — it starves the shared pools and stalls seemingly unrelated flows.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> cluster vs server group (shared state + primary node vs neither) is a guaranteed topic. For CloudHub scenarios map requirement→feature: private API → VPC + internal DNS (8091/8092); custom domain/mutual TLS → DLB; partner IP allowlisting → static IPs; on-prem connectivity → VPN into the VPC. For class loading, the answer to "connector can't find the driver class" is always sharedLibraries.</p>`
    }
  ]
};
