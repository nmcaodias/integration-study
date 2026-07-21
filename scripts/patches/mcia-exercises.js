/* MCIA · hands-on "design walkthrough" exercises (architect exam, not coding).
 * Each presents a scenario + constraints + given assets; the learner works the
 * decision outside the site (whiteboard / Anypoint Platform / Studio) and reveals
 * a model architecture with rationale. Same schema/feature as the MCD exercises.
 * 12 exercises weighted to the heavy sections (a3/a5 15%, a10 14%, a2/a4 10%). */
module.exports = {
  addExercises: [
    {
      id: "ia-ex-01",
      section: "a2",
      title: "Decompose a monolithic order flow into API-led layers",
      level: "medium",
      where: "Design — Anypoint Platform / whiteboard",
      task: `<p>A single Mule app pulls customer data from Salesforce, inventory from an AS/400 database, and pushes orders to SAP — all wired directly together. New channels (a mobile app, a partner portal) now need the same order capability, and the team keeps re-integrating the same back ends.</p><p>Redesign it as <strong>API-led connectivity</strong>. Decide which APIs belong in the <em>System</em>, <em>Process</em>, and <em>Experience</em> layers, and justify where reuse actually comes from.</p>`,
      given: [
        { label: "Current couplings", code: "Salesforce  ─┐\nAS/400 DB   ─┼─► [one Mule app] ─► SAP\n(partner)   ─┘\n\nChannels needing 'place order': web, mobile, partner portal" }
      ],
      steps: [
        "List the back-end systems — each becomes a System API that hides its protocol/format",
        "Identify the reusable business capability ('place order') that orchestrates several System APIs → Process API",
        "Map each channel to an Experience API shaped for that channel's payload/auth",
        "Check the dependency direction: Experience → Process → System, never sideways or upward"
      ],
      solution: [
        { label: "Target layering", code: "Experience:  Web Orders API   Mobile Orders API   Partner Orders API\n                     \\             |              /\nProcess:              ─────  Place Order API  ─────   (orchestration,\n                     /             |              \\    aggregation)\nSystem:      Salesforce API    Inventory API    SAP Orders API\n                (System APIs wrap each back end)" }
      ],
      solutionNotes: `<p>Reuse lives in the <strong>System</strong> and <strong>Process</strong> layers: the three channels share one Place Order Process API, which in turn reuses the System APIs. Experience APIs are deliberately <em>not</em> reused — they exist to tailor payload, protocol and security per channel. The trap is putting orchestration in an Experience API (blocks reuse) or letting a System API call another System API (couples back ends). Dependencies always point downward.</p>`
    },
    {
      id: "ia-ex-02",
      section: "a2",
      title: "Synchronous request/reply vs event-driven — pick per requirement",
      level: "hard",
      where: "Design — whiteboard",
      task: `<p>Three requirements land for the same platform. For <strong>each</strong>, choose synchronous HTTP request/reply or asynchronous broker-based messaging, and name the delivery/idempotency implication.</p><ol><li>A checkout page needs the order total back <em>now</em> to render the confirmation.</li><li>An accepted order must fan out to fulfilment, billing, and analytics — each owned by a different team.</li><li>Black-Friday spikes of 20× must not drop orders even if SAP is slow.</li></ol>`,
      given: [
        { label: "Options in play", code: "A) HTTP request/reply (caller blocks, gets the result)\nB) Publish to Anypoint MQ / broker (fire-and-forget, N consumers)\nC) Queue-based store-and-forward in front of the slow system" }
      ],
      steps: [
        "Ask 'does the caller need the answer in the same call?' → yes ⇒ sync",
        "Ask 'do multiple independent consumers need the same event?' → yes ⇒ pub/sub async",
        "Ask 'must it survive a downstream outage/spike?' → yes ⇒ durable queue in front, decouple ingest from processing",
        "For any at-least-once path, add an idempotency key so duplicates are safe"
      ],
      solution: [
        { label: "Decisions", code: "1) Sync HTTP request/reply — caller needs the total in-band.\n2) Async pub/sub (broker) — one publish, three independent subscribers;\n   at-least-once ⇒ each consumer must be idempotent.\n3) Async queue store-and-forward — accept + persist + 202, drain to SAP\n   at its own pace; buffer absorbs the spike, retries the outage." }
      ],
      solutionNotes: `<p>The decision hinges on <em>who needs the answer and when</em>, and <em>what must survive failure</em>. Async buys decoupling, fan-out and load-levelling — but every at-least-once system implies possible duplicates, so idempotency is not optional. The classic trap is making (3) synchronous: a slow SAP then stalls the checkout thread pool and drops orders under load.</p>`
    },
    {
      id: "ia-ex-03",
      section: "a3",
      title: "Design an idempotent receiver for a retrying partner",
      level: "hard",
      where: "Anypoint Studio (design)",
      task: `<p>A partner POSTs orders and <strong>retries on any timeout</strong>, so the same order id can arrive 2–3 times. Downstream, each order must hit SAP <strong>exactly once</strong>. Design the receive path so retries are safe, using platform building blocks rather than custom SQL.</p>`,
      given: [
        { label: "Incoming request", code: "POST /orders  { \"orderId\": \"A-1007\", \"lines\": [...] }\nPartner retries the identical body on timeout." },
        { label: "Building blocks available", code: "Idempotent Message Validation filter · Object Store v2 · Anypoint MQ" }
      ],
      steps: [
        "Choose the dedup key — the partner's stable orderId, not a generated messageId",
        "Front the flow with an Idempotent Message Validation filter backed by Object Store v2",
        "On a duplicate key, short-circuit with 200/duplicate-ack instead of re-processing",
        "Set the Object Store TTL to at least the partner's maximum retry window"
      ],
      solution: [
        { label: "Receive path", code: "<os:object-store name=\"seenOrders\" persistent=\"true\"\n                 entryTtl=\"24\" entryTtlUnit=\"HOURS\"/>\n\n<flow name=\"receive-order\">\n  <http:listener path=\"/orders\"/>\n  <idempotent-message-validator\n       idExpression=\"#[payload.orderId]\"\n       objectStore=\"seenOrders\"\n       onDuplicate=\"...ack 200, stop...\"/>\n  <flow-ref name=\"postToSap\"/>   <!-- only reached for first-seen ids -->\n</flow>" }
      ],
      solutionNotes: `<p>Idempotency belongs at the <strong>receiver</strong>, keyed on a value the sender controls and repeats (orderId). Object Store v2 gives a shared, persistent seen-set that survives restarts and works across CloudHub replicas; the TTL must cover the retry window or a late retry slips through. Keying on a per-request messageId would defeat the whole thing — every retry would look new.</p>`
    },
    {
      id: "ia-ex-04",
      section: "a4",
      title: "Persistence choice: Object Store vs database vs external cache",
      level: "medium",
      where: "Design — whiteboard",
      task: `<p>Pick the persistence mechanism for each need, on a CloudHub deployment with 3 replicas. Justify why the others are wrong.</p><ol><li>Dedup keys for idempotency, ~1 KB each, must be shared across all 3 replicas, expire after 24h.</li><li>An OAuth token cache refreshed every hour, read on nearly every request.</li><li>The authoritative order history queried with complex joins and reporting.</li></ol>`,
      given: [
        { label: "Candidates", code: "Object Store v2 (managed KV, shared, TTL)\nExternal DB (relational, durable, queryable)\nIn-memory / on-heap cache (per replica, fast, volatile)" }
      ],
      steps: [
        "Ask: shared across replicas? volatile-ok? queryable? how big / how long?",
        "Small shared KV with TTL, no joins ⇒ Object Store v2",
        "Hot read-through cache where a miss is cheap to rebuild ⇒ in-memory (accept per-replica copies)",
        "Authoritative, relational, reportable ⇒ external database"
      ],
      solution: [
        { label: "Mapping", code: "1) Object Store v2 — shared across replicas + native TTL, tiny values.\n2) In-memory cache — per-replica is fine; a miss just re-fetches the token.\n3) External database — durable system of record, supports joins/reporting." }
      ],
      solutionNotes: `<p>On-heap state is <strong>not</strong> shared across CloudHub replicas, so using it for dedup (1) would let a duplicate through on another worker. Object Store v2 is the right shared-KV-with-TTL, but it is not a query engine — don't push order history (3) into it. And don't reach for a database for a volatile hourly token (2) when a cheap-to-rebuild in-memory cache is faster and simpler.</p>`
    },
    {
      id: "ia-ex-05",
      section: "a5",
      title: "Choose a runtime plane: CloudHub vs RTF vs hybrid",
      level: "hard",
      where: "Design — Anypoint Platform",
      task: `<p>A bank must deploy 40 Mule apps. Hard constraints: data must stay inside their own network; some apps call an on-prem mainframe over a private link; they want MuleSoft to manage the control plane but run workloads on <strong>their own</strong> Kubernetes. Recommend a runtime-plane topology and say what handles inbound TLS and private connectivity.</p>`,
      given: [
        { label: "Options", code: "CloudHub 2.0 (MuleSoft-hosted workers, shared/private space)\nRuntime Fabric on customer's EKS/AKS/GKE (self-managed compute)\nHybrid: Mule runtimes on customer VMs + Anypoint control plane" }
      ],
      steps: [
        "Separate control plane (design/manage/monitor) from runtime plane (where apps execute)",
        "Map the 'must run in our own network / our own k8s' constraint to the runtime plane",
        "Decide inbound: an ingress/DLB terminates or passes through TLS to the apps",
        "Decide private egress: private link/VPN from that plane to the mainframe"
      ],
      solution: [
        { label: "Recommendation", code: "Runtime Fabric on the bank's own Kubernetes:\n  • Control plane stays MuleSoft-managed (mgmt, deploy, monitoring).\n  • Workloads run inside the bank's network → data residency met.\n  • RTF inbound gateway / load balancer terminates TLS to the apps.\n  • Private link / VPN from the RTF cluster to the on-prem mainframe.\nCloudHub 2.0 rejected: compute is MuleSoft-hosted, not the bank's k8s." }
      ],
      solutionNotes: `<p>The deciding constraint is <strong>who owns the compute</strong>. "Run on our own Kubernetes, keep data in our network" points squarely at Runtime Fabric, which keeps the runtime plane in the customer's infrastructure while MuleSoft still runs the control plane. CloudHub 2.0 would host the workers on MuleSoft's side, violating residency. Hybrid works too but adds VM management the bank didn't ask for; RTF is the cleaner fit for a container platform they already run.</p>`
    },
    {
      id: "ia-ex-06",
      section: "a5",
      title: "Horizontal scale vs a cluster — which HA model?",
      level: "medium",
      where: "Design — whiteboard",
      task: `<p>Two apps need high availability. Choose <strong>load-balanced independent replicas</strong> or a <strong>Mule cluster</strong> for each, and explain the difference.</p><ol><li>A stateless REST API fronting a database — just needs to survive a node loss and scale with load.</li><li>A polling File/DB inbound job plus in-memory Object Store that must have a single, consistent view and fail over without double-processing.</li></ol>`,
      given: [
        { label: "The two models", code: "Replicas + LB: N independent runtimes, no shared state, scale out.\nCluster: runtimes act as one — shared VM queues, HA polling primary,\n         in-memory Object Store replicated across nodes." }
      ],
      steps: [
        "Ask: does the app need shared runtime state or single-poller semantics?",
        "Stateless + horizontally scalable ⇒ replicas behind a load balancer",
        "Shared in-memory state / primary-poll election ⇒ cluster",
        "Prefer replicas when you can push state to Object Store v2 / a DB instead"
      ],
      solution: [
        { label: "Decisions", code: "1) Replicas behind a load balancer — stateless, scales linearly,\n   any replica serves any request; a lost node just drops from the pool.\n2) Cluster — the polling source runs on one primary (no double-poll),\n   in-memory Object Store is shared, and it fails over to another node." }
      ],
      solutionNotes: `<p>Clustering exists for <strong>shared runtime state and single-active semantics</strong> (HA primary polling, replicated in-memory Object Store, shared VM queues). A stateless API gains nothing from it and is simpler and cheaper as load-balanced replicas. Modern designs often dodge clustering entirely by externalising state (Object Store v2, a DB), which lets you scale as plain replicas even on CloudHub.</p>`
    },
    {
      id: "ia-ex-07",
      section: "a7",
      title: "Never lose an order while the ERP is down all weekend",
      level: "hard",
      where: "Design — Anypoint Platform",
      task: `<p>Orders arrive 24/7 over HTTP. The ERP is periodically down for long windows (hours). Requirement: <strong>zero order loss</strong>, and the app itself may restart during the outage. Design the reliability approach and explain why an in-flow retry scope is <em>not</em> enough.</p>`,
      given: [
        { label: "Two candidate approaches", code: "A) Until Successful scope wrapping the ERP call (retry in memory)\nB) Store-and-forward: accept → durable queue → separate consumer\n   drains to ERP with reconnection/redelivery" }
      ],
      steps: [
        "Note the failure that matters: the app can restart mid-outage",
        "In-memory retry state is lost on restart ⇒ Until Successful alone can drop the event",
        "Persist the accepted order first (durable queue / Anypoint MQ), ack the caller",
        "Drain with a consumer that reconnects and redelivers until ERP is back"
      ],
      solution: [
        { label: "Design", code: "HTTP accept  ─►  publish to durable queue (Anypoint MQ)  ─►  202\n                                   │\n            consumer: dequeue ─► ERP call ─► ack on success\n                       └─ on failure: redeliver / DLQ after N tries\nSurvives app restart (queue is persistent) and long ERP outages." }
      ],
      solutionNotes: `<p>Until Successful retries in <strong>memory</strong> — a runtime restart during the weekend outage loses every in-flight event. For "must not lose it even if the app restarts", the accepted work has to be <strong>persisted before you ack the caller</strong>, then drained asynchronously with reconnection and a dead-letter path. Until Successful is the right tool for short, transient blips, not multi-hour outages.</p>`
    },
    {
      id: "ia-ex-08",
      section: "a7",
      title: "Transaction boundary across JMS and a database",
      level: "hard",
      where: "Anypoint Studio (design)",
      task: `<p>A flow consumes a JMS message, writes two rows to a database, then acknowledges JMS. A crash must never leave the DB written but the message un-acked (reprocess → duplicate rows) <strong>or</strong> the message acked but the DB not written (lost work). Choose the transaction strategy and state its cost.</p>`,
      given: [
        { label: "Resources", code: "1 JMS queue (consume + ack)\n1 relational DB (two inserts)\nBoth support XA; the DB insert is the only DB work." }
      ],
      steps: [
        "Count the transactional resources that must commit atomically → JMS + DB = 2",
        "Single-resource local tx can't span both ⇒ consider XA",
        "Enable an XA transaction so JMS ack and DB commit are all-or-nothing",
        "Weigh the cost: XA adds coordination overhead and needs XA-capable resources"
      ],
      solution: [
        { label: "Strategy", code: "XA transaction spanning the JMS session and the JDBC connection:\n  begin XA ─► consume JMS ─► insert row 1 ─► insert row 2\n           ─► commit (JMS ack + DB commit together)\nCrash before commit ⇒ message redelivered, no partial DB write." }
      ],
      solutionNotes: `<p>Two independent transactional resources that must succeed or fail together is the textbook case for an <strong>XA</strong> transaction — a single local transaction can only cover one resource. The trade-off is real: XA needs XA-capable JMS/DB and adds two-phase-commit latency, so only reach for it when atomicity genuinely spans resources. If only the DB work were transactional, a local transaction would do.</p>`
    },
    {
      id: "ia-ex-09",
      section: "a8",
      title: "Tune throughput: caching, parallelism, and payload size",
      level: "medium",
      where: "Anypoint Studio (design)",
      task: `<p>An Experience API aggregates a product from three back ends per request and is missing its latency SLA under load. Profiling shows: (a) a reference-data call that changes hourly is made on every request; (b) the three back-end calls run sequentially; (c) a 30 MB catalog file is loaded fully into memory. Propose one fix for each without changing the back ends.</p>`,
      given: [
        { label: "Hotspots", code: "a) GET /reference on every request (hourly-stable data)\nb) call A → then B → then C (independent of each other)\nc) payload = whole 30 MB file read into memory" }
      ],
      steps: [
        "Cache the hourly-stable reference data (Cache scope / OS-backed) with a TTL",
        "Run the three independent calls concurrently (Scatter-Gather / parallel)",
        "Stream the large file instead of materialising it (repeatable streaming)",
        "Re-measure; confirm thread pool and memory pressure drop"
      ],
      solution: [
        { label: "Fixes", code: "a) Cache scope with ~1h TTL over the reference call (Object Store backing).\nb) Scatter-Gather the three independent back-end calls → wall time ≈ slowest\n   one, not the sum.\nc) Enable streaming (repeatable file/stream) so the 30 MB flows in chunks." }
      ],
      solutionNotes: `<p>Three orthogonal levers: <strong>cache</strong> to remove repeated work on stable data, <strong>parallelise</strong> independent I/O so latency is the max not the sum, and <strong>stream</strong> large payloads to cap memory. The trap on (b) is parallelising calls that actually depend on each other; on (c), a non-repeatable stream breaks if something needs to read the payload twice — use repeatable streaming when downstream re-reads.</p>`
    },
    {
      id: "ia-ex-10",
      section: "a9",
      title: "Layer the security controls for a partner-facing API",
      level: "hard",
      where: "Design — API Manager / Anypoint Platform",
      task: `<p>A partner-facing API on CloudHub must: authenticate partners, cap each partner's call rate, guarantee the caller is a known partner at the transport level, and never expose back-end credentials in the app. Assign each requirement to the right control and layer, and note what stays out of the Mule code.</p>`,
      given: [
        { label: "Controls available", code: "Client ID Enforcement policy · Rate-Limiting/SLA policy ·\nMutual TLS (two-way) · Secure Properties (encrypted config) ·\nautodiscovery (pairs app ↔ API instance for policy enforcement)" }
      ],
      steps: [
        "Authenticate the app/partner identity ⇒ Client ID Enforcement policy",
        "Throttle per partner ⇒ Rate-Limiting-SLA tied to their SLA tier",
        "Prove the transport-level caller ⇒ mutual TLS at the edge",
        "Keep back-end secrets out of code ⇒ Secure Properties, resolved at deploy",
        "Wire policies to the running app ⇒ autodiscovery (api.id + platform creds)"
      ],
      solution: [
        { label: "Mapping", code: "Authn partner          → Client ID Enforcement policy (API Manager)\nPer-partner throttle   → Rate-Limiting-SLA policy + SLA tiers\nKnown caller (transport)→ Mutual TLS (two-way) at the edge / DLB\nNo creds in code       → Secure Properties (encrypted), key at deploy\nEnforcement binding    → autodiscovery pairs app to its API instance" }
      ],
      solutionNotes: `<p>Security is layered, not one control: <strong>policies</strong> (client-id, rate-limit) live on the API instance in API Manager and are bound to the running app via <strong>autodiscovery</strong>; <strong>mutual TLS</strong> proves the caller at the transport layer; <strong>secure properties</strong> keep back-end secrets out of the artifact. The common trap is trying to enforce rate-limiting or client-id inside the Mule flow by hand instead of applying a managed policy — losing central governance and analytics.</p>`
    },
    {
      id: "ia-ex-11",
      section: "a10",
      title: "Build once, promote many with externalized config",
      level: "medium",
      where: "CI/CD — Maven / Anypoint Platform",
      task: `<p>Design a pipeline that builds a Mule app <strong>once</strong> and promotes the <em>same artifact</em> to DEV → TEST → PROD, where only configuration and secrets differ per environment, and the app auto-registers with the correct API instance in each. What must NOT be rebuilt per environment, and how are secrets handled?</p>`,
      given: [
        { label: "Pipeline sketch", code: "mvn clean package        # once → one .jar\nmvn deploy -DmuleDeploy  # per env, same jar, env-specific props\n# per-env: {env}.properties + secure.key + Connected App creds" }
      ],
      steps: [
        "Build/test once → a single immutable artifact published to Exchange",
        "Externalise per-env values into {env}.properties, secrets via Secure Properties",
        "Deploy the same jar to each env, selecting the property set at deploy time",
        "Give each env its own api.id + platform credentials so autodiscovery pairs correctly",
        "Never rebuild per environment — a rebuild breaks 'tested == deployed'"
      ],
      solution: [
        { label: "Pipeline", code: "Stage 1 (once):  package + MUnit + publish artifact to Exchange\nStage 2 (per env): deploy SAME artifact with\n    -Dmule.env=dev|test|prod   (selects {env}.properties)\n    -Dsecure.key=****          (decrypts secure:: values)\n    api.id + Connected App creds for that env's API instance\nResult: one build, config-only differences, autodiscovery pairs each env." }
      ],
      solutionNotes: `<p>The core DevOps principle is <strong>build-once / promote-many</strong>: the artifact that passed tests is the exact artifact that reaches PROD, so nothing but configuration changes across stages. Secrets stay encrypted via Secure Properties with the key supplied at deploy, and each environment carries its own api.id + platform credentials so autodiscovery binds the app to the right API instance. Rebuilding per environment silently invalidates your testing and is the anti-pattern this design exists to prevent.</p>`
    },
    {
      id: "ia-ex-12",
      section: "a6",
      title: "MUnit strategy for a layered app: what to mock, what to assert",
      level: "medium",
      where: "Anypoint Studio (MUnit)",
      task: `<p>A Process API orchestrates two System API calls and maps the result. Design its MUnit test suite so it runs in CI with <strong>no live back ends</strong>, proves the mapping and error handling, and gates the build on coverage. Decide what to mock, what to assert/verify, and how coverage enforces quality.</p>`,
      given: [
        { label: "Flow under test", code: "process-order:\n  call SystemA (HTTP Request) ─► call SystemB (HTTP Request)\n  ─► DataWeave transform ─► return\n  error handler maps SYS:CONNECTIVITY → 503" }
      ],
      steps: [
        "Mock both HTTP Requests (Mock When) so tests are hermetic and deterministic",
        "Assert the transformed payload for the happy path (Assert That)",
        "Force a connectivity error on a mock and assert the 503 mapping",
        "Verify each System API call happened as expected (Verify Call)",
        "Add the munit-maven-plugin coverage gate so CI fails under the threshold"
      ],
      solution: [
        { label: "Suite outline", code: "test happy-path:\n  mock-when SystemA → fixture A;  mock-when SystemB → fixture B\n  run process-order\n  assert-that payload == expected mapping\n  verify-call SystemA times(1); verify-call SystemB times(1)\n\ntest error-path:\n  mock-when SystemA → throw SYS:CONNECTIVITY\n  run; assert http.status == 503\n\npom: munit-maven-plugin coverage (e.g. failBuild=true, min 80%)" }
      ],
      solutionNotes: `<p>Unit tests must be <strong>hermetic</strong>: mock every outbound connector so the suite runs in CI with no live systems and is deterministic. Assert on the <em>outputs</em> (the mapped payload, the mapped error status), and Verify the interactions you care about. Coverage as a <strong>build gate</strong> (munit-maven-plugin, failBuild on threshold) is what keeps quality from eroding over time — a suite nobody enforces rots.</p>`
    }
  ]
};
