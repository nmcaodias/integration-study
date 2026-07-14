// MuleSoft Platform Integration Architect question bank — Part A (sections a1–a5)
window.CERT_DATA.mcia.questions.push(
  // ---- Section a1: Initiating Integration Solutions ----
  {
    id: "ia-001", section: "a1",
    q: "An integration must sync orders from a webshop to SAP within 5 seconds, handle 200 orders/second at peak, and remain available 99.95% of the time. Which of these is the FUNCTIONAL requirement?",
    options: ["The 5-second latency target", "Syncing orders from the webshop to SAP", "Handling 200 orders/second at peak", "The 99.95% availability target"],
    answer: 1,
    explanation: "Functional requirements describe WHAT the solution does (sync orders webshop→SAP). Latency, throughput, and availability describe HOW WELL it must do it — they are non-functional requirements, and they are what drives the architecture."
  },
  {
    id: "ia-002", section: "a1",
    q: "A regulator requires that ALL data related to an integration platform — including management metadata such as deployment settings and API definitions — must remain inside the customer's own data centers, with no connectivity to any vendor cloud. Which Anypoint Platform setup satisfies this?",
    options: ["EU control plane with CloudHub runtimes in an EU region", "MuleSoft-hosted control plane with Runtime Fabric on-premises", "Anypoint Platform Private Cloud Edition (PCE) with customer-hosted runtimes", "CloudHub 2.0 private spaces with a VPN to the data center"],
    answer: 2,
    explanation: "Only PCE puts the CONTROL PLANE itself on customer infrastructure. The EU control plane and RTF options still use a MuleSoft-hosted control plane (management metadata flows to it), which the requirement forbids."
  },
  {
    id: "ia-003", section: "a1",
    q: "A team needs to design the contract for an event-driven API delivered over Anypoint MQ, describing its channels and message schemas. Which specification format is intended for this?",
    options: ["RAML 1.0", "OpenAPI Specification (OAS) 3.0", "AsyncAPI", "WSDL 2.0"],
    answer: 2,
    explanation: "AsyncAPI describes event-driven/asynchronous APIs — channels, messages, and schemas — and is supported alongside RAML and OAS in Design Center/Exchange. RAML and OAS describe synchronous web APIs; WSDL describes SOAP services."
  },
  {
    id: "ia-004", section: "a1",
    q: "Which statement about the Anypoint Platform control plane and runtime plane is TRUE?",
    options: ["Business data payloads flow through the control plane for policy evaluation", "The control plane provides design, deployment, and monitoring; business data flows only through the runtime plane", "The runtime plane must always run in the same network as the control plane", "Runtime Fabric is a control plane deployment option"],
    answer: 1,
    explanation: "The control plane (Design Center, Exchange, Management Center) manages metadata; actual message payloads are processed only in the runtime plane (CloudHub, RTF, customer-hosted). Policies are enforced in the runtime plane too — the gateway pulls policy configuration from the control plane."
  },
  {
    id: "ia-005", section: "a1",
    q: "An organization wants to run Mule applications as containers on its own Azure Kubernetes Service cluster while still deploying and managing them from the MuleSoft-hosted control plane. Which runtime plane option fits?",
    options: ["CloudHub 2.0", "Anypoint Runtime Fabric", "A customer-hosted standalone runtime", "Anypoint Platform PCE"],
    answer: 1,
    explanation: "Runtime Fabric is the container-based runtime plane that runs on customer infrastructure (EKS/AKS/GKE or self-managed) while being orchestrated from the Anypoint control plane. CloudHub runs on MuleSoft's AWS; standalone runtimes aren't containers-as-a-service; PCE is a control plane option."
  },
  {
    id: "ia-006", section: "a1",
    q: "Which requirement would MOST strongly push an architecture toward asynchronous, queue-based integration rather than synchronous HTTP calls?",
    options: ["Responses must include data from three backend systems", "The API consumers are mobile applications", "Orders must never be lost, even during multi-hour backend outages", "All systems expose REST APIs"],
    answer: 2,
    explanation: "Zero message loss across long backend outages requires store-and-forward persistence (queues) — synchronous HTTP fails when the backend is down. Aggregating three backends can be done synchronously (Scatter-Gather); the other options don't force async."
  },

  // ---- Section a2: Integration Paradigms ----
  {
    id: "ia-007", section: "a2",
    q: "An architect proposes System, Process, and Experience API layers for a new solution. What is a legitimate COST of this API-led layering that the architect should acknowledge?",
    options: ["It prevents reuse of the System APIs by other projects", "Each layer adds a network hop, increasing end-to-end latency", "It makes it impossible to apply different policies per layer", "Backends can no longer be replaced without changing consumers"],
    answer: 1,
    explanation: "Layering adds hops and operational units — that's the trade-off paid for reuse, decoupling, and independent evolution. The other options state the opposite of API-led benefits."
  },
  {
    id: "ia-008", section: "a2",
    q: "Which delivery semantics difference correctly distinguishes a queue from a topic/message exchange?",
    options: ["Queues deliver each message to every consumer; topics deliver to exactly one", "Queues deliver each message to exactly one consumer; topics/exchanges deliver a copy to every subscriber", "Queues are always in-memory; topics are always persistent", "Topics guarantee ordering; queues cannot"],
    answer: 1,
    explanation: "Point-to-point (queue): one message → one consumer, enabling competing consumers. Pub-sub (topic/exchange): each subscriber receives its own copy. Persistence and ordering are orthogonal configuration concerns."
  },
  {
    id: "ia-009", section: "a2",
    q: "Two Mule applications deployed as separate CloudHub applications must exchange messages reliably with buffering. Which technology is appropriate?",
    options: ["VM queues with persistent queues enabled", "Anypoint MQ", "An Object Store shared between the applications", "A shared flow invoked by Flow Reference"],
    answer: 1,
    explanation: "VM queues never cross application boundaries, Object Stores are state (not messaging) and are per-app, and Flow References work only inside one app. Anypoint MQ is the platform's hosted broker for inter-application messaging."
  },
  {
    id: "ia-010", section: "a2",
    q: "A caller must trigger long-running processing (minutes) in another system and later receive the result without holding an open connection. Which messaging pattern applies?",
    options: ["Competing consumers", "Claim check", "Asynchronous request-reply with correlation IDs", "Publish-subscribe broadcast"],
    answer: 2,
    explanation: "Async request-reply uses a request queue and a reply queue; the correlation ID carried on the messages lets the requester match each reply to its request. Competing consumers is about scaling consumption; claim check is about large payloads."
  },
  {
    id: "ia-011", section: "a2",
    q: "An event-driven design uses a broker with at-least-once delivery. What consequence MUST the consuming Mule application be designed for?",
    options: ["Messages may arrive encrypted", "The same message may be delivered more than once", "Messages will always arrive in order", "The broker will discard messages older than 24 hours"],
    answer: 1,
    explanation: "At-least-once delivery means redelivery after failures/timeouts is possible — duplicates are a fact of life. Consumers need idempotency (e.g., Idempotent Message Validator with a shared Object Store, or naturally idempotent operations)."
  },
  {
    id: "ia-012", section: "a2",
    q: "Order events must fan out to inventory, shipping, and analytics systems, each processing independently at its own pace. Which design fits best?",
    options: ["The order service calls each system sequentially over HTTP", "Publish the event once to a message exchange/topic; each system consumes from its own subscription/queue", "Store orders in an Object Store that all systems poll", "Use Scatter-Gather to call all three systems synchronously"],
    answer: 1,
    explanation: "Pub-sub via an exchange/topic decouples producers from N independent consumers in time and availability. HTTP chains and Scatter-Gather couple availability and latency; Object Store polling abuses a state store as a broker."
  },
  {
    id: "ia-013", section: "a2",
    q: "A 200 MB file must be referenced in a message flowing through Anypoint MQ, which has a much smaller message size limit. Which pattern applies?",
    options: ["Message batching", "Claim check — store the payload externally and send a reference", "Competing consumers", "Idempotent receiver"],
    answer: 1,
    explanation: "The claim check pattern stores the large payload in a suitable store (S3, database, file share) and sends only a reference/claim ticket through the broker; the consumer redeems the reference to fetch the payload."
  },
  {
    id: "ia-014", section: "a2",
    q: "When is a synchronous HTTP request-response interaction the RIGHT paradigm choice?",
    options: ["When the caller cannot proceed without the result and the operation is fast", "When the target system has frequent multi-hour outages", "When load spikes must be buffered and absorbed", "When many systems must react to the same event"],
    answer: 0,
    explanation: "Synchronous interaction suits fast operations whose result the caller needs immediately (lookups, validations, UI calls). Outage tolerance, buffering, and fan-out all point to asynchronous messaging."
  },

  // ---- Section a3: Designing and Developing Mule Applications ----
  {
    id: "ia-015", section: "a3",
    q: "The same application JAR is promoted from test to production. In production, the DB password differs and must override the value packaged in the properties file. Which mechanism achieves this WITHOUT rebuilding?",
    options: ["Editing the YAML file inside the deployed JAR", "Setting a deployment property in Runtime Manager, which overrides packaged file values", "Recompiling with a production Maven profile", "Hardcoding both values with a Choice router"],
    answer: 1,
    explanation: "Deployment/system properties take precedence over packaged property files — that's the build-once-deploy-many mechanism. Editing JARs or rebuilding per environment defeats artifact promotion."
  },
  {
    id: "ia-016", section: "a3",
    q: "Which Salesforce Connector capability should an architect choose to load 5 million records nightly into Salesforce with efficient API usage?",
    options: ["Individual Create operations inside a For Each", "Bulk API v2 job operations", "The Subscribe Channel source", "SOQL Query All in a loop"],
    answer: 1,
    explanation: "Bulk API v2 is designed for large volumes: asynchronous jobs, batched server-side processing, and far better governor/API-limit efficiency than per-record calls. Subscribe Channel is for receiving events, not loading data."
  },
  {
    id: "ia-017", section: "a3",
    q: "A flow must receive Salesforce record changes in near real time without polling. Which connector feature applies?",
    options: ["Query operation on a Scheduler", "Upsert with external ID", "Subscribe Channel / Change Data Capture event source", "Bulk API v2 query job"],
    answer: 2,
    explanation: "The Salesforce Connector's streaming sources (Subscribe Channel for platform events/CDC channels) receive pushed events with replay support — the event-driven alternative to scheduled SOQL polling."
  },
  {
    id: "ia-018", section: "a3",
    q: "Records from several source systems must be synchronized into Salesforce, and records may already exist there. The integration knows each record's ERP number, held in a Salesforce external ID field. Which operation is designed for this?",
    options: ["Create", "Update", "Upsert using the external ID field", "Merge"],
    answer: 2,
    explanation: "Upsert with an external ID creates the record if the external ID is unknown and updates it if it exists — one idempotent operation, no pre-query needed. This is the canonical pattern for syncing by business key."
  },
  {
    id: "ia-019", section: "a3",
    q: "What is the role of metadata (DataSense) shown in the Transform Message component?",
    options: ["It validates payloads at runtime and rejects non-conforming messages", "It provides design-time type information (from connectors, API specs, schemas, or samples) to guide mapping", "It encrypts field values marked sensitive", "It generates MUnit tests automatically"],
    answer: 1,
    explanation: "DataSense metadata is a design-time aid: connector-declared types, API spec types, custom metadata from schemas/examples, and sample data drive the mapping UI and preview. It does NOT enforce anything at runtime — runtime validation needs APIkit/Validation/schema checks."
  },
  {
    id: "ia-020", section: "a3",
    q: "An organization integrating 8 systems point-to-point suffers from the number of transformations (each pair mapped directly). What does introducing a Canonical Data Model change?",
    options: ["Each system now needs one mapping to/from the canonical model instead of mappings to every other system", "Transformations are no longer needed anywhere", "All systems must migrate their internal schemas to the canonical model", "The number of mappings grows quadratically"],
    answer: 0,
    explanation: "With a CDM, mappings grow linearly (N mappings to/from the model) instead of ~N² point-to-point. Systems keep their internal models; System APIs translate at the boundary. The trade-off is governance effort on the shared model."
  },
  {
    id: "ia-021", section: "a3",
    q: "Why is one giant enterprise-wide canonical model often discouraged in favor of smaller per-domain models (bounded contexts)?",
    options: ["Exchange cannot store large RAML types", "Agreeing and versioning a single all-encompassing model across every team is slow and produces bloated lowest-common-denominator types", "DataWeave cannot transform large objects", "Canonical models only work for XML payloads"],
    answer: 1,
    explanation: "The classic CDM failure mode is organizational: one model for everything becomes huge, contested, and slow to change. Bounded-context models per business domain, published as Exchange fragments, keep types focused and independently versionable."
  },
  {
    id: "ia-022", section: "a3",
    q: "Incoming API requests must be rejected when required fields are missing or types are wrong, exactly as declared in the RAML contract. What is the BEST way to get this validation?",
    options: ["Write DataWeave checks with fail() at the start of every flow", "Rely on the APIkit Router's validation against the imported specification", "Add an Is Not Null validator per field", "Validate in the backend system instead"],
    answer: 1,
    explanation: "The APIkit Router validates requests against the spec (types, required params, body) and raises APIKIT:BAD_REQUEST automatically — contract-driven, zero hand-written code, always in sync with the published RAML. Hand-coded checks duplicate the contract and drift."
  },

  // ---- Section a4: Persistence Requirements ----
  {
    id: "ia-023", section: "a4",
    q: "Which statement about VM queues is TRUE?",
    options: ["VM queues can connect flows across two different Mule applications on CloudHub", "VM queues connect flows within one Mule application only", "VM queues are always persistent", "VM queues require an external broker"],
    answer: 1,
    explanation: "VM queues are intra-application. For inter-application messaging use Anypoint MQ or JMS. Queues are transient by default and can be configured persistent; no external broker is involved."
  },
  {
    id: "ia-024", section: "a4",
    q: "A CloudHub 1.0 application scales to 3 workers and uses VM queues to distribute internal work. What makes messages published to the VM queue consumable by ALL workers and able to survive worker restarts?",
    options: ["Setting queueType=TRANSIENT", "Enabling persistent queues for the application in Runtime Manager", "Using an Object Store instead", "Nothing — this works by default in-memory"],
    answer: 1,
    explanation: "On CloudHub 1.0, enabling persistent queues backs VM queues with a cloud queueing service shared across the app's workers and durable across restarts. Default in-memory VM queues are per-worker and lost on restart."
  },
  {
    id: "ia-025", section: "a4",
    q: "Which limitation applies to Object Store v2 on CloudHub?",
    options: ["Entries have a maximum time-to-live of 30 days", "It cannot be accessed by more than one worker", "It only stores string values", "It is wiped on every application restart"],
    answer: 0,
    explanation: "OSv2 caps TTL at 30 days (also the default). It IS shared across an app's workers and survives restarts (that's its purpose); values up to 10 MB, various types. It's also rate-limited and exposes a REST API."
  },
  {
    id: "ia-026", section: "a4",
    q: "An Idempotent Message Validator must deduplicate messages processed by a 4-node customer-hosted deployment. Which deployment/config combination actually prevents duplicates across all nodes?",
    options: ["A server group with each node's default in-memory Object Store", "A cluster, so the Object Store lives in the shared distributed memory grid", "A server group with persistent file-based Object Stores on each node", "Any deployment — the validator is always global"],
    answer: 1,
    explanation: "Dedup state must be SHARED. In a cluster, Object Stores are in the distributed grid so every node sees the same seen-IDs. In a server group each node has independent stores (memory or file) — a duplicate hitting another node passes."
  },
  {
    id: "ia-027", section: "a4",
    q: "Which is an appropriate use of an Object Store?",
    options: ["Primary storage for customer order records", "Queueing messages between two applications", "Storing the last-synced timestamp (watermark) for an incremental sync", "Long-term archival of processed files"],
    answer: 2,
    explanation: "Object Stores hold lightweight app state: watermarks, dedup IDs, cached values, tokens. Business records belong in a database; inter-app messaging belongs on a broker; archives belong in file/blob storage."
  },
  {
    id: "ia-028", section: "a4",
    q: "A Cache scope must return consistent cached results no matter which of an app's multiple CloudHub workers serves the request. How should its caching strategy be configured?",
    options: ["Default in-memory Object Store on each worker", "A custom Object Store backed by Object Store v2 (shared across workers)", "A transient VM queue", "Disable caching — consistency is impossible on CloudHub"],
    answer: 1,
    explanation: "Per-worker in-memory stores give different workers different cache contents (inconsistent hits/misses). Backing the Cache scope's strategy with OSv2 shares entries across all workers of the app."
  },
  {
    id: "ia-029", section: "a4",
    q: "Which statement about persistence on CloudHub 2.0 is TRUE?",
    options: ["Persistent VM queues are supported exactly as on CloudHub 1.0", "Persistent VM queues are not supported; durable messaging should use Anypoint MQ", "Object Store v2 is unavailable on CloudHub 2.0", "Replicas cannot share Object Store state"],
    answer: 1,
    explanation: "CloudHub 2.0 does not offer the CH1 persistent VM queue feature — the platform direction for durable messaging is Anypoint MQ. OSv2 remains available and shared across replicas."
  },

  // ---- Section a5: Runtime Plane Technology Architecture ----
  {
    id: "ia-030", section: "a5",
    q: "What distinguishes a Mule runtime CLUSTER from a server group?",
    options: ["A cluster deploys different applications to each node", "A cluster shares state (VM queues, Object Stores, locks) through a distributed memory grid and elects a primary node; a server group is just N independent servers", "A server group provides automatic failover of in-flight messages; a cluster does not", "Clusters are available on CloudHub; server groups are not"],
    answer: 1,
    explanation: "The cluster's distributed shared memory grid (Hazelcast) and primary-node election are exactly what a server group lacks. Server groups merely deploy the same app to independent servers — no shared state, no coordination. Both are customer-hosted concepts."
  },
  {
    id: "ia-031", section: "a5",
    q: "A flow's Scheduler must fire exactly once per interval even though the app runs on a 3-node cluster. What ensures this?",
    options: ["Schedulers run on every node; you must add locking manually", "Schedulers and primaryNodeOnly sources run only on the cluster's primary node, with automatic re-election on failure", "The load balancer serializes scheduler executions", "Clusters do not support Schedulers"],
    answer: 1,
    explanation: "The cluster designates one primary node that exclusively runs Schedulers and primary-node-only sources (JMS topics, streaming subscriptions, polling). If the primary dies, another node is elected — no duplicate triggering, no manual locks."
  },
  {
    id: "ia-032", section: "a5",
    q: "An API on CloudHub must be reachable ONLY from the corporate network (connected via VPN to an Anypoint VPC), not from the internet. Which design achieves this?",
    options: ["Deploy normally and rely on the shared load balancer", "Deploy into the VPC and have clients call the workers' internal DNS (mule-worker-internal-…) on port 8091/8092, blocking public listener access", "Use static IPs so only known addresses can call", "Add an HTTPS listener on port 443"],
    answer: 1,
    explanation: "Inside an Anypoint VPC, workers expose internal-only ports 8091/8092 reachable via the mule-worker-internal DNS name — accessible only from the VPC and networks connected to it (VPN/peering). The shared LB and 8081/8082 are the PUBLIC paths; static IPs identify the app outbound/inbound but don't make it private."
  },
  {
    id: "ia-033", section: "a5",
    q: "A customer needs its CloudHub APIs served under api.acme.com with its own TLS certificate, including two-way TLS from partners. What is required?",
    options: ["Configure the shared load balancer with a custom certificate", "An Anypoint VPC with a Dedicated Load Balancer configured with the custom domain's certificate and client-certificate validation", "A CNAME record pointing to the app with no other changes", "Static IPs with TLS enabled"],
    answer: 1,
    explanation: "Custom domains and custom/mutual TLS terminate at a Dedicated Load Balancer, which requires an Anypoint VPC. The shared LB only serves *.cloudhub.io with MuleSoft's certificate and no client-cert validation."
  },
  {
    id: "ia-034", section: "a5",
    q: "When are Mule runtime DOMAINS a justified choice?",
    options: ["On CloudHub, to share an HTTP listener across applications", "On customer-hosted runtimes where co-located applications clearly benefit from shared configs such as one HTTP listener port or shared TLS/DB configs", "Whenever more than one application exists in an organization", "On Runtime Fabric, to reduce container count"],
    answer: 1,
    explanation: "Domains exist only on customer-hosted standalone/cluster runtimes. They help when multiple apps on the SAME runtime should share resources (one port, common configs) — at the cost of coupling (domain redeploy affects all apps) and zero portability to CloudHub/RTF."
  },
  {
    id: "ia-035", section: "a5",
    q: "A Mule app declares the MySQL JDBC driver as a normal Maven dependency, yet the Database connector fails with a class-not-found error at runtime. Why, and what fixes it?",
    options: ["The driver version is wrong; upgrade it", "Mule 4 class loader isolation hides application dependencies from connectors; declare the driver under sharedLibraries in the mule-maven-plugin", "The driver must be copied into the Mule runtime's lib folder on CloudHub", "Database connectors require domains"],
    answer: 1,
    explanation: "Class loader isolation separates app, plugin, and runtime classloaders — a connector cannot see the app's JARs. sharedLibraries exports the driver so the connector's classloader can load it. This is THE canonical class-loading exam scenario."
  },
  {
    id: "ia-036", section: "a5",
    q: "Which statement correctly describes the Mule 4 execution engine?",
    options: ["Each flow owns a dedicated thread pool that must be sized manually", "Operations declare processing types (CPU_LITE, CPU_INTENSIVE, BLOCKING_IO) and are scheduled non-blockingly on shared self-tuning pools; back-pressure throttles sources when saturated", "Every event is processed start-to-finish on a single thread", "Blocking calls inside custom code have no effect on other flows"],
    answer: 1,
    explanation: "Mule 4 is reactive: shared self-tuning pools (UBER), per-operation processing types, non-blocking waits, and back-pressure (e.g., HTTP 503) replace Mule 3's per-flow thread tuning. Blocking inside CPU_LITE code starves the shared pools and harms unrelated flows."
  },
  {
    id: "ia-037", section: "a5",
    q: "A CloudHub app with 2 workers behind the shared load balancer must expose its HTTP listener correctly. Which port configuration is required?",
    options: ["Listen on port 80 directly", "Bind the listener to ${http.port} (8081), which the platform load balancer forwards from 80/443", "Bind to port 8091 for public traffic", "Any port works; CloudHub rewrites it"],
    answer: 1,
    explanation: "CloudHub's shared LB forwards public 80/443 to worker port 8081/8082 — apps must bind ${http.port}/${https.port}. Ports 8091/8092 are the VPC-internal private listener ports."
  }
);
