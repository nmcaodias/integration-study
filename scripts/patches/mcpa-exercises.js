/* MCPA · hands-on "design walkthrough" exercises (platform-architect / governance
 * exam, not coding). Each presents a scenario + constraints + given assets; the
 * learner works the design outside the site (Anypoint Platform / Design Center /
 * API Manager) and reveals a model design with rationale. Same schema/feature as
 * the MCD/MCIA exercises. 11 exercises weighted to heavy sections (p5 17%,
 * p4/p9 12%, p6/p7 11%). */
module.exports = {
  addExercises: [
    {
      id: "pa-ex-01",
      section: "p2",
      title: "Organize business groups, environments, and roles for three teams",
      level: "medium",
      where: "Design — Anypoint Platform (Access Management)",
      task: `<p>A company has three delivery teams (Payments, Orders, Partners) that must not see each other's applications, plus a shared platform team. Each team needs Design → Sandbox → Production promotion. Design the org structure: <strong>business groups</strong>, <strong>environments</strong>, and <strong>role assignments</strong> — and say what identity vs. client management each requires.</p>`,
      given: [
        { label: "Constraints", code: "3 delivery teams, isolated from each other\n1 shared platform (C4E) team owning standards + reusable assets\nEach team: Design, Sandbox, Production environments\nCorporate SSO for humans; partner apps get their own credentials" }
      ],
      steps: [
        "Create a business group per team so assets/apps are isolated by group",
        "Within each group, create Sandbox + Production environments (Design Center is org-wide)",
        "Map roles per environment (Developer in Sandbox, restricted Deploy in Production)",
        "Wire corporate SSO as identity management for platform users",
        "Use client management (e.g. external OAuth) for the partner applications' credentials"
      ],
      solution: [
        { label: "Target structure", code: "Org root\n ├─ BG: Payments   → env: Sandbox, Production   roles per env\n ├─ BG: Orders     → env: Sandbox, Production\n ├─ BG: Partners   → env: Sandbox, Production\n └─ Platform/C4E: owns shared Exchange assets + governance\nIdentity mgmt: corporate SSO (SAML/OIDC) for humans\nClient mgmt: OAuth provider for API consumer apps (partner credentials)" }
      ],
      solutionNotes: `<p><strong>Business groups</strong> isolate teams' apps and assets; <strong>environments</strong> (Sandbox/Production) isolate deployments and API instances within a group. <strong>Identity management</strong> is how <em>people</em> sign in to the platform (corporate SSO); <strong>client management</strong> is how <em>consumer applications</em> obtain credentials/tokens — two different federations. Remember business data never flows through the MuleSoft-hosted control plane; only metadata does.</p>`
    },
    {
      id: "pa-ex-02",
      section: "p3",
      title: "Design a reusable API spec with fragments and publish to Exchange",
      level: "medium",
      where: "Design — Design Center / Exchange",
      task: `<p>Three APIs will share the same <code>Money</code> and <code>Address</code> data types and a standard error response. Design the API specification so those definitions are authored once and reused, then decide how consumers discover and depend on it. What gets published to Exchange, and how is a breaking change signalled?</p>`,
      given: [
        { label: "Shared shapes", code: "Money   { amount: number, currency: string }\nAddress { line1, line2?, city, country }\nStandardError { code, message, correlationId }\nUsed by: Orders API, Payments API, Shipping API" }
      ],
      steps: [
        "Author the shared types + error as a reusable RAML/OAS fragment (a data-type/library fragment)",
        "Publish the fragment to Exchange as its own versioned asset",
        "Reference it from each API spec via a dependency, not by copy-paste",
        "Version with semver: additive = minor, breaking (rename/remove) = major",
        "Publish each API spec to Exchange so consumers discover and request access"
      ],
      solution: [
        { label: "Reuse structure", code: "Exchange asset: common-types (fragment) v1.2.0\n   #%RAML 1.0 Library\n   types: { Money: ..., Address: ..., StandardError: ... }\n\nOrders API spec:\n   uses: common-types   # dependency on the published fragment\n   /orders: ... responses use StandardError\nBreaking change to Money (e.g. rename currency) → common-types v2.0.0" }
      ],
      solutionNotes: `<p>Reuse lives in <strong>fragments published to Exchange</strong>, referenced as dependencies so a fix propagates instead of drifting across copies. <strong>Semantic versioning</strong> communicates compatibility: additive changes are a minor bump (consumers keep working), while renames/removals are a major bump. Exchange is the discovery + dependency surface — the fragment and each API are versioned assets there.</p>`
    },
    {
      id: "pa-ex-03",
      section: "p3",
      title: "Idempotency and optimistic concurrency for an HTTP API",
      level: "hard",
      where: "Design — API specification",
      task: `<p>Design the correctness semantics for a Wallet API. Decide, for each case, the right HTTP mechanism: (1) a client retries a <code>PUT /accounts/{id}</code> after a network timeout; (2) a client retries a <code>POST /transfers</code> after a timeout; (3) two clients must not overwrite each other's edit to the same account.</p>`,
      given: [
        { label: "Operations", code: "PUT  /accounts/{id}     (replace account profile)\nPOST /transfers         (create a money transfer)\nGET/PUT with concurrent editors on /accounts/{id}" }
      ],
      steps: [
        "Classify each verb: is it idempotent by definition?",
        "PUT is idempotent → a retry is safe as-is",
        "POST is not idempotent → require an idempotency key so a retry doesn't double-create",
        "For concurrent edits, use ETag + If-Match so a stale update is rejected (412)"
      ],
      solution: [
        { label: "Decisions", code: "1) PUT retry: safe — PUT is idempotent by definition, no extra mechanism.\n2) POST retry: require Idempotency-Key header; server dedups on it so a\n   retried transfer is created at most once.\n3) Concurrent edits: server returns an ETag on GET; client sends\n   If-Match: <etag> on PUT → 412 Precondition Failed if it changed." }
      ],
      solutionNotes: `<p>HTTP semantics do the heavy lifting: <strong>PUT</strong> is idempotent so retries are safe; <strong>POST</strong> is not, so a stable <strong>idempotency key</strong> makes a retry create at most once. <strong>Optimistic concurrency</strong> uses <strong>ETag + If-Match</strong> to reject an update built on stale data (412), preventing lost updates without locking.</p>`
    },
    {
      id: "pa-ex-04",
      section: "p4",
      title: "Decompose a business process into System, Process, and Experience APIs",
      level: "medium",
      where: "Design — whiteboard / Anypoint Platform",
      task: `<p>"Place order" must read the customer from Salesforce, check stock in an inventory DB, create the order in SAP, and be consumed by a web app and a partner B2B channel. Decompose it into <strong>System</strong>, <strong>Process</strong>, and <strong>Experience</strong> APIs and justify where reuse comes from.</p>`,
      given: [
        { label: "Systems + channels", code: "Back ends: Salesforce (customer), Inventory DB, SAP (order)\nChannels: Web checkout, Partner B2B (bulk)" }
      ],
      steps: [
        "Wrap each back end in a System API that hides its protocol/format",
        "Put the 'place order' orchestration (read customer + check stock + create order) in a Process API",
        "Shape one Experience API per channel over the Process API",
        "Verify dependencies point downward: Experience → Process → System only"
      ],
      solution: [
        { label: "Layering", code: "Experience:  Web Checkout API      Partner B2B API\n                     \\                 /\nProcess:              Place Order API   (orchestration)\n                   /        |         \\\nSystem:   Salesforce API  Inventory API  SAP Orders API" }
      ],
      solutionNotes: `<p>Reuse concentrates in the <strong>System</strong> and <strong>Process</strong> layers: both channels reuse one Place Order Process API, which reuses the System APIs. Experience APIs are deliberately channel-specific (payload/protocol/auth tailored) and not reused. Putting orchestration in an Experience API — or letting a System API call another System API — are the anti-patterns to avoid.</p>`
    },
    {
      id: "pa-ex-05",
      section: "p4",
      title: "Bounded-context data models vs one enterprise model",
      level: "hard",
      where: "Design — whiteboard",
      task: `<p>An architect proposes a single enterprise-wide canonical data model (one <code>Customer</code>, one <code>Product</code>, …) spanning all 14 domains, so every API speaks the same types. Critique this and propose the alternative, including how APIs in different contexts interoperate.</p>`,
      given: [
        { label: "Proposal", code: "One org-wide canonical model for all 14 domains.\nEvery System/Process/Experience API imports the same giant type library." }
      ],
      steps: [
        "Note the coupling: one shared model means every change ripples across all domains",
        "Prefer smaller per-domain (bounded-context) models owned by each domain",
        "Interoperate by mapping at the boundaries (a Process/Experience API maps between contexts)",
        "Reserve shared fragments for genuinely universal primitives (Money, Address)"
      ],
      solution: [
        { label: "Recommendation", code: "Per-bounded-context models:\n  Sales.Customer   ≠   Billing.Customer   ≠   Support.Customer\n  each owned + evolved by its domain team\nInteroperation: map between contexts at the API boundary\nShared: only universal primitives as small Exchange fragments\nAvoid: one 14-domain canonical model (release-locks every team)" }
      ],
      solutionNotes: `<p>A single enterprise model becomes a coordination bottleneck — every domain must agree on every change, and unrelated domains are release-locked together. <strong>Bounded contexts</strong> let each domain own a model that fits its language, and APIs <strong>map at the boundary</strong>. Share only truly universal primitives as small fragments, not an all-encompassing schema.</p>`
    },
    {
      id: "pa-ex-06",
      section: "p5",
      title: "Design policies, SLA tiers, and the client-contract flow for an API",
      level: "hard",
      where: "Design — API Manager",
      task: `<p>A public Orders API must: authenticate consumer apps, throttle them by paid tier (Free = 10 rps, Gold = 200 rps), and require approval before a partner can call it. Design the API Manager governance: which <strong>policies</strong>, which <strong>SLA tiers</strong>, and the <strong>client application → contract</strong> approval flow.</p>`,
      given: [
        { label: "Requirements", code: "Authenticate the calling app (client id/secret)\nTiers: Free 10 rps, Gold 200 rps\nPartner access requires explicit approval\nEnforcement on the running Mule app (not a separate proxy)" }
      ],
      steps: [
        "Apply Client ID Enforcement so only registered apps can call",
        "Define SLA tiers (Free/Gold) with their rate limits, and apply the Rate-Limiting-SLA policy",
        "Require tier requests to be approved → the consumer's client application gets a contract",
        "Bind enforcement to the running app via autodiscovery (api.id + platform creds)"
      ],
      solution: [
        { label: "Governance design", code: "API instance (Orders API, Production)\n  policy: Client ID Enforcement\n  policy: Rate-Limiting-SLA  → tiers: Free(10rps), Gold(200rps)\n  SLA tier requests: manual approval ON\nConsumer flow:\n  register client app → request access to a tier →\n  architect approves → contract issued (client_id/secret) →\n  app calls with credentials; limits enforced per tier\nEnforcement: autodiscovery pairs the Mule app to this instance" }
      ],
      solutionNotes: `<p>Governance is layered policy on the <strong>API instance</strong>: Client ID Enforcement establishes identity, the <strong>Rate-Limiting-SLA</strong> policy ties throttling to <strong>SLA tiers</strong>, and requiring approval turns each consumer into a reviewed <strong>contract</strong> bound to a client application. <strong>Autodiscovery</strong> connects the policies to the running implementation. Trying to hand-code rate limits in the flow loses central governance and analytics.</p>`
    },
    {
      id: "pa-ex-07",
      section: "p5",
      title: "Embedded autodiscovery vs an API proxy for policy enforcement",
      level: "medium",
      where: "Design — API Manager",
      task: `<p>Two APIs need policies enforced. (1) A Mule 4 app the team builds and deploys itself. (2) A legacy HTTP backend the team cannot modify or redeploy as a Mule app. Choose the enforcement approach for each and explain the trade-off.</p>`,
      given: [
        { label: "Options", code: "A) Embedded enforcement via autodiscovery (policies run inside the Mule app)\nB) API Proxy (a generated Mule app sits in front of the backend)" }
      ],
      steps: [
        "If you own and deploy the Mule app → embed enforcement via autodiscovery (no extra hop)",
        "If the backend can't be a Mule app → put an API Proxy in front to enforce policies",
        "Weigh the proxy's extra network hop/latency against not touching the backend",
        "Either way, policies live on the API instance in API Manager"
      ],
      solution: [
        { label: "Decisions", code: "1) Team-built Mule app → autodiscovery (embedded):\n     api.id + platform creds pair the app to its instance;\n     policies enforced in-process, no extra hop.\n2) Unmodifiable legacy backend → API Proxy:\n     generated Mule proxy enforces policies in front of it;\n     accept one extra hop for governance you couldn't add otherwise." }
      ],
      solutionNotes: `<p>Both enforce the same API-Manager policies, but differ in placement. <strong>Autodiscovery</strong> embeds enforcement inside an app you control — no extra hop, lowest latency. An <strong>API Proxy</strong> is the answer when you can't modify the backend: it fronts it with a generated Mule app, at the cost of an extra network hop. Choose by whether you can deploy the implementation as a Mule app.</p>`
    },
    {
      id: "pa-ex-08",
      section: "p6",
      title: "Pick the runtime plane and decide whether a VPC is required",
      level: "medium",
      where: "Design — Anypoint Platform",
      task: `<p>An API implementation must: connect to an on-prem database over a private link, be reachable at <code>api.acme.com</code> with the company's own TLS certificate, and otherwise be low-ops. Choose the runtime plane and the network features, and state how policy enforcement and config differ per environment.</p>`,
      given: [
        { label: "Requirements", code: "Private connectivity to an on-prem DB (no public exposure)\nCustom domain api.acme.com + company TLS certificate\nLow operational burden preferred\nSame artifact promoted Sandbox → Production" }
      ],
      steps: [
        "Low-ops + MuleSoft-hosted workers → CloudHub, but private DB access forces a VPC",
        "Provision an Anypoint VPC with VPN/peering to reach the on-prem DB privately",
        "Add a Dedicated Load Balancer to serve api.acme.com with the company certificate",
        "Externalize per-env config + secure properties; pair each env via autodiscovery"
      ],
      solution: [
        { label: "Design", code: "Runtime plane: CloudHub (low-ops, MuleSoft-hosted workers)\n  + Anypoint VPC (VPN/peering) → private on-prem DB access\n  + Dedicated Load Balancer → api.acme.com with company TLS cert\nConfig: {env}.properties + secure.key at deploy; same artifact per env\nEnforcement: autodiscovery (own api.id + creds per environment)" }
      ],
      solutionNotes: `<p>Private access, VPN, or a custom-domain/custom-TLS requirement all point to an <strong>Anypoint VPC</strong> (+ a <strong>Dedicated Load Balancer</strong> for the certificate) on top of CloudHub. The same build is promoted across environments with only config/secrets differing, and <strong>autodiscovery</strong> binds each environment's app to its own API instance. "Private access / VPN / DLB / custom TLS" are the VPC trigger words.</p>`
    },
    {
      id: "pa-ex-09",
      section: "p7",
      title: "A CloudHub topology that eliminates single points of failure",
      level: "hard",
      where: "Design — CloudHub",
      task: `<p>A revenue-critical API on CloudHub currently runs as one worker behind the shared load balancer, with an in-memory Object Store for idempotency and a custom domain requirement. Redesign it to remove every single point of failure while keeping idempotency correct across instances.</p>`,
      given: [
        { label: "Current (fragile) setup", code: "1 worker · shared load balancer · in-memory Object Store\n· custom domain needed · loses in-flight state on restart" }
      ],
      steps: [
        "Run at least 2 workers so a worker/AZ loss doesn't take the API down",
        "Move idempotency state to Object Store v2 (shared across workers), not in-memory",
        "Use a Dedicated Load Balancer for the custom domain + controlled TLS",
        "Place it in a VPC if private connectivity/allowlisting is needed"
      ],
      solution: [
        { label: "Resilient topology", code: "≥2 CloudHub workers (spread across AZs)  ── DLB (custom domain, TLS)\n        │                    │\n   both share Object Store v2 (idempotency keys, cross-worker)\n   in a VPC when private access / IP control is required\nSPOFs removed: single worker, in-memory state, shared-LB constraints" }
      ],
      solutionNotes: `<p>Eliminating SPOFs on CloudHub means <strong>≥2 workers</strong> (survive a worker/AZ loss), <strong>shared state in Object Store v2</strong> instead of in-memory (so idempotency holds across instances and restarts), and a <strong>Dedicated Load Balancer</strong> for custom domain/TLS. A single worker or on-heap state are the classic single points of failure the exam probes.</p>`
    },
    {
      id: "pa-ex-10",
      section: "p8",
      title: "Meet an availability and latency goal with caching and scaling",
      level: "medium",
      where: "Design — Anypoint Platform",
      task: `<p>An Experience API must hit p95 < 300 ms and 99.9% availability. Profiling shows: (a) a reference-data lookup that changes hourly is called on every request; (b) responses to a popular public GET are identical for 60 s; (c) one worker occasionally saturates at peak. Prescribe one mechanism per problem — and name one thing that would NOT help.</p>`,
      given: [
        { label: "Levers available", code: "Cache scope (in-flow) · HTTP Caching policy (API Manager) ·\nObject Store (state) · horizontal scaling (more workers)" }
      ],
      steps: [
        "Cache the in-flow reference lookup with a Cache scope + TTL",
        "Cache the public GET responses at the edge with the HTTP Caching policy",
        "Add workers for availability/throughput at peak (not to speed a single request)",
        "Note: more workers does NOT reduce single-request latency"
      ],
      solution: [
        { label: "Prescriptions", code: "a) Reference lookup on every request → Cache scope (TTL ~1h) in the flow.\nb) Identical public GET for 60 s → HTTP Caching policy at the API instance.\nc) Worker saturates at peak → horizontal scale (more workers) for\n   throughput + availability.\nNOT helpful: adding workers to make one request faster." }
      ],
      solutionNotes: `<p>Match the tool to the goal: a <strong>Cache scope</strong> removes a repeated in-flow lookup; the <strong>HTTP Caching policy</strong> serves identical responses at the edge; <strong>horizontal scaling</strong> buys throughput and availability, not lower single-request latency. Object Store is for <em>state</em> ("remember the last processed record"), not caching. The trap is expecting more workers to speed up an individual request.</p>`
    },
    {
      id: "pa-ex-11",
      section: "p9",
      title: "Design an alerting scheme across the application network",
      level: "medium",
      where: "Design — Anypoint Platform (Monitoring)",
      task: `<p>Operations needs to be alerted for: (1) the app has stopped / worker crashed; (2) an API's 5xx rate or a policy violation spikes; (3) end-to-end 'is the checkout API functionally correct right now?'; (4) searching all production logs across apps for one transaction. Map each to the right tool and signal.</p>`,
      given: [
        { label: "Tools", code: "Runtime Manager alerts · API Manager alerts/analytics ·\nAnypoint Monitoring (metrics + log management) ·\nAPI Functional Monitoring (BAT synthetic tests)" }
      ],
      steps: [
        "App down / worker crash / CPU-memory → Runtime Manager alert",
        "5xx rate / policy violation / SLA breach on an API → API Manager alert/analytics",
        "Functional correctness of a live endpoint → API Functional Monitoring (BAT)",
        "Cross-app log search by correlation id → Anypoint Monitoring log management"
      ],
      solution: [
        { label: "Mapping", code: "1) App stopped / worker crash      → Runtime Manager alert\n2) 5xx rate / policy violation     → API Manager alert + analytics\n3) 'functionally correct now?'     → API Functional Monitoring (BAT)\n4) Search all prod logs, one txn   → Anypoint Monitoring (log mgmt,\n                                      trace by correlation id)" }
      ],
      solutionNotes: `<p>Each plane owns a different signal: <strong>Runtime Manager</strong> watches the deployed worker (up/down, CPU/memory); <strong>API Manager</strong> watches the API instance (5xx, policy violations, SLA); <strong>Functional Monitoring (BAT)</strong> answers "is it correct right now?" with synthetic calls; <strong>Anypoint Monitoring</strong> aggregates metrics and logs for cross-app tracing. Picking the wrong plane is the common mistake.</p>`
    }
  ]
};
