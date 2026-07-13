// MCD Level 2 question bank — Part A (domains 1–2)
window.CERT_DATA.mcd2.questions.push(
  // ---- Domain 1: Performant and Reliable Apps ----
  {
    id: "m2-001", section: "d1",
    q: "A Mule app processes unpredictable file sizes, sometimes several GB, and multiple components need to read the payload. Which streaming strategy is most appropriate?",
    options: ["Non-repeatable stream", "Repeatable in-memory stream with a large max buffer", "Repeatable file-stored stream", "Disable streaming entirely"],
    answer: 2,
    explanation: "File-stored repeatable streams buffer to disk past a threshold, so arbitrarily large payloads can be read multiple times without exhausting memory. In-memory buffers risk STREAM_MAXIMUM_SIZE_EXCEEDED; non-repeatable streams can be read only once."
  },
  {
    id: "m2-002", section: "d1",
    q: "A flow using a non-repeatable stream fails when a Logger placed before a Transform Message logs #[payload]. Why?",
    options: ["Loggers cannot serialize JSON", "The Logger consumed the stream, so the transformer receives an already-read (empty) stream", "Non-repeatable streams require file storage", "The payload was null"],
    answer: 1,
    explanation: "Non-repeatable streams can be read exactly once. The Logger's payload access consumes it, leaving nothing for the next component. Use a repeatable strategy or avoid reading the stream twice."
  },
  {
    id: "m2-003", section: "d1",
    q: "What does an Until Successful scope do when its processors keep failing after the configured max retries?",
    options: ["Silently continues the flow", "Throws a MULE:RETRY_EXHAUSTED error", "Restarts the flow from the event source", "Reduces the retry interval and keeps trying forever"],
    answer: 1,
    explanation: "Until Successful retries with the configured wait time up to maxRetries; when exhausted, it raises RETRY_EXHAUSTED, which should be handled (e.g. route the message to a DLQ)."
  },
  {
    id: "m2-004", section: "d1",
    q: "What is the purpose of a redelivery policy configured on a listener (e.g. JMS or VM On New Message)?",
    options: ["It retries the outbound connection", "It limits how many times the same message can be reprocessed after failures, raising REDELIVERY_EXHAUSTED when exceeded", "It guarantees exactly-once delivery", "It compresses redelivered messages"],
    answer: 1,
    explanation: "Redelivery policies protect against 'poison messages' that keep failing: after maxRedeliveryCount attempts, a REDELIVERY_EXHAUSTED error lets you divert the message (e.g. to a dead-letter queue) instead of looping forever."
  },
  {
    id: "m2-005", section: "d1",
    q: "An API must acknowledge received orders immediately and never lose one, even if the app crashes before processing completes. Which design implements the reliable acquisition pattern?",
    options: ["Process the order synchronously, then return 202", "Write the order to a persistent VM queue (or Anypoint MQ) as the first step, return the acknowledgement, and process from the queue asynchronously", "Store the order in a flow variable and process it in a subflow", "Use a Cache scope around the processing logic"],
    answer: 1,
    explanation: "Reliability pattern: persist the message to a reliable channel (persistent VM queue, Anypoint MQ, JMS) inside the receiving flow, acknowledge the client, and let a separate flow consume and process. A crash cannot lose acknowledged messages."
  },
  {
    id: "m2-006", section: "d1",
    q: "Which statement about VM queues is correct?",
    options: ["VM queues always survive application restarts", "In-memory VM queues are faster but lost on restart; persistent VM queues survive restarts at a performance cost", "VM queues can connect two different Mule applications on CloudHub", "VM queues require an external broker"],
    answer: 1,
    explanation: "The VM connector provides intra-app (or intra-cluster) queues in two modes: transient in-memory and persistent. Cross-application messaging on CloudHub needs Anypoint MQ or another broker."
  },
  {
    id: "m2-007", section: "d1",
    q: "In Anypoint MQ, what happens to a message that exceeds the maximum delivery attempts on a queue configured with a dead-letter queue (DLQ)?",
    options: ["It is deleted permanently", "It is moved to the dead-letter queue for later inspection or reprocessing", "It is re-queued at the front", "The queue is suspended"],
    answer: 1,
    explanation: "The DLQ captures messages that repeatedly fail delivery/acknowledgment, preventing poison messages from looping while retaining them for analysis or manual replay."
  },
  {
    id: "m2-008", section: "d1",
    q: "When is an XA transaction required instead of a local transaction?",
    options: ["Whenever more than one operation runs in a flow", "When a single atomic transaction must span multiple transactional resources, e.g. consume a JMS message and write to a database", "When using HTTP Request operations", "When the flow uses async scopes"],
    answer: 1,
    explanation: "Local transactions cover a single resource. XA uses two-phase commit to coordinate multiple resources (JMS + DB) atomically — heavier, requiring an XA transaction manager and XA-capable connectors."
  },
  {
    id: "m2-009", section: "d1",
    q: "A Try scope demarcates a transaction. An error inside is handled by an On Error Continue scope. What happens to the transaction?",
    options: ["It is rolled back", "It is committed, because On Error Continue treats the processing as successful", "It stays open until the flow ends", "XA transactions cannot be used with Try scopes"],
    answer: 1,
    explanation: "On Error Continue = handled successfully → the transaction commits. On Error Propagate → rollback. Choosing the wrong handler can accidentally commit partial work."
  },
  {
    id: "m2-010", section: "d1",
    q: "Which transactional action makes an operation FAIL if there is no active transaction when it executes?",
    options: ["JOIN_IF_POSSIBLE", "ALWAYS_JOIN", "NOT_SUPPORTED", "BEGIN_OR_JOIN"],
    answer: 1,
    explanation: "ALWAYS_JOIN demands an existing transaction and errors without one. JOIN_IF_POSSIBLE joins when present, NOT_SUPPORTED executes outside the transaction."
  },
  {
    id: "m2-011", section: "d1",
    q: "Which payloads are safe to serve from a Cache scope?",
    options: ["Any payload, including streams", "Responses to idempotent requests with repeatable (or consumed) payloads — not one-time non-repeatable streams", "Only XML payloads", "Only payloads smaller than 1 MB"],
    answer: 1,
    explanation: "Cache is for idempotent request-response interactions where the same key yields the same response. Cached entries must be re-servable; unconsumed non-repeatable streams cannot be replayed to later callers."
  },
  {
    id: "m2-012", section: "d1",
    q: "What does the Idempotent Message Validator do?",
    options: ["Retries duplicate messages", "Computes an ID for each message and raises MULE:DUPLICATE_MESSAGE (rejecting the event) when the ID was already seen, using an Object Store", "Validates JSON schemas", "Removes duplicate records inside one payload array"],
    answer: 1,
    explanation: "It enforces exactly-once semantics at the processing level: an ID expression is checked against an Object Store of seen IDs; duplicates raise an error you can handle (e.g. return 409)."
  },
  {
    id: "m2-013", section: "d1",
    q: "How does Mule 4 manage threads for event processing?",
    options: ["One thread pool per connector, sized manually in every app", "A single self-tuning runtime thread pool (UBER) with back-pressure; manual pool tuning is rarely needed", "One thread per flow instance, fixed at deployment", "Threads are managed by the JVM garbage collector"],
    answer: 1,
    explanation: "Mule 4 replaced Mule 3's manual threading model with a centralized, self-tuning pool and automatic back-pressure. Developers influence concurrency via maxConcurrency on flows, not by sizing pools per app."
  },
  {
    id: "m2-014", section: "d1",
    q: "A CPU-intensive Mule app on CloudHub must handle double the load. Requests are stateless. What is the most direct scaling approach?",
    options: ["Enable persistent queues", "Scale horizontally by adding workers/replicas; CloudHub load-balances across them", "Increase the streaming buffer size", "Move all logic into one flow"],
    answer: 1,
    explanation: "Stateless workloads scale horizontally: more workers behind CloudHub's load balancer. Vertical scaling (bigger worker) helps too but horizontal scaling adds availability."
  },
  {
    id: "m2-015", section: "d1",
    q: "In a customer-hosted Mule runtime cluster, which statement is true?",
    options: ["Each node has fully independent object stores and VM queues", "Persistent object stores and VM queues are shared across the cluster via a distributed memory grid, and scheduled sources run only on the primary node by default", "Clustering requires CloudHub", "All nodes must run different applications"],
    answer: 1,
    explanation: "A cluster acts as one logical unit: distributed shared memory backs object stores/VM queues, and polling/scheduled sources default to primary-node-only execution to avoid duplicate triggers."
  },
  {
    id: "m2-016", section: "d1",
    q: "What does setting maxConcurrency on a flow control?",
    options: ["The number of applications on a worker", "The maximum number of event instances the flow processes simultaneously; excess triggers back-pressure", "The size of the streaming buffer", "The number of retry attempts"],
    answer: 1,
    explanation: "maxConcurrency caps simultaneous executions of a flow. When exceeded, back-pressure applies to the source (e.g. HTTP returns 503, or the listener slows polling)."
  },
  {
    id: "m2-017", section: "d1",
    q: "Which DataWeave option streams the OUTPUT of a transformation so downstream components can start consuming before the whole result is built?",
    options: ["output application/json indent=false", "output application/json deferred=true", "output application/json streaming=false", "var stream = true in the header"],
    answer: 1,
    explanation: "deferred=true defers/streams DataWeave output. (The reader property streaming=true enables streaming of the INPUT for sequential-access formats.)"
  },
  {
    id: "m2-018", section: "d1",
    q: "A flow calls a flaky external API. The team wants each call to retry up to 3 times with 2 seconds between attempts before giving up. Which component fits directly?",
    options: ["A Try scope with On Error Continue", "An Until Successful scope with maxRetries=3 and millisBetweenRetries=2000 around the HTTP Request", "A For Each scope with 3 iterations", "A redelivery policy on the HTTP Listener"],
    answer: 1,
    explanation: "Until Successful retries its inner processors with the configured attempts and interval. Redelivery policies protect listeners from reprocessing the same inbound message — a different concern."
  },
  {
    id: "m2-019", section: "d1",
    q: "Which processing choice yields parallel record processing with results collected back into a list, WITHOUT the queueing overhead of a Batch Job?",
    options: ["For Each", "Parallel For Each", "Choice router", "Async scope"],
    answer: 1,
    explanation: "Parallel For Each processes elements concurrently and aggregates results into a list. For Each is sequential; Batch adds persistence/queueing designed for very large datasets."
  },

  // ---- Domain 2: Maintainable & Modular Maven ----
  {
    id: "m2-020", section: "d2",
    q: "Which Maven lifecycle phase runs MUnit tests during a standard Mule application build?",
    options: ["compile", "test", "package", "deploy"],
    answer: 1,
    explanation: "The munit-maven-plugin binds to the test phase, so 'mvn test' (and later phases like package/deploy that include it) executes MUnit suites."
  },
  {
    id: "m2-021", section: "d2",
    q: "What does the <classifier>mule-plugin</classifier> element indicate in a pom.xml dependency?",
    options: ["The dependency is a plain Java library", "The dependency is a Mule extension/connector packaged as a Mule plugin", "The dependency should be excluded from the build", "The dependency is only used in tests"],
    answer: 1,
    explanation: "Mule connectors/modules are Maven artifacts with the mule-plugin classifier so the runtime and packager treat them as Mule extensions rather than ordinary JARs."
  },
  {
    id: "m2-022", section: "d2",
    q: "A team wants every Mule project to inherit the same plugin versions, repositories, and common properties. What is the recommended mechanism?",
    options: ["Copy-paste a template pom.xml into each project", "A parent POM published to Exchange (or a repository), referenced by each project's <parent> element", "Environment variables on each developer machine", "A shared Studio workspace"],
    answer: 1,
    explanation: "A parent POM centralizes build configuration; children inherit and stay consistent. Publishing it to Exchange/private repo makes it resolvable everywhere including CI."
  },
  {
    id: "m2-023", section: "d2",
    q: "How is a Mule application deployed to CloudHub from a CI/CD pipeline using Maven?",
    options: ["mvn clean install -Pcloud", "Configure the mule-maven-plugin with a cloudHubDeployment/cloudhub2Deployment section (target, environment, connected app credentials) and run mvn deploy -DmuleDeploy", "Upload the JAR with FTP", "mvn cloudhub:push"],
    answer: 1,
    explanation: "The mule-maven-plugin handles packaging and deployment; 'mvn deploy -DmuleDeploy' triggers deployment using the plugin's configuration, typically with credentials injected by the pipeline."
  },
  {
    id: "m2-024", section: "d2",
    q: "What credentials should a CI/CD pipeline use to authenticate against Anypoint Platform for automated deployments?",
    options: ["A developer's personal username and password", "A Connected App's client ID and secret with only the required scopes", "The organization admin's session cookie", "No credentials are needed for deployments"],
    answer: 1,
    explanation: "Connected apps provide non-personal, scope-limited, revocable credentials — the recommended practice for automation instead of tying pipelines to human accounts."
  },
  {
    id: "m2-025", section: "d2",
    q: "How does a Mule project consume an asset (e.g. a custom connector) published to Anypoint Exchange via Maven?",
    options: ["Download the JAR manually into src/main/resources", "Add the Exchange Maven repository (with credentials in settings.xml) and declare the asset's GAV as a dependency", "Exchange assets cannot be used in Maven builds", "Reference the asset URL in mule-artifact.json"],
    answer: 1,
    explanation: "Exchange doubles as a Maven repository. With the repo URL and valid credentials/connected app token in settings.xml, assets resolve like any Maven dependency using the org ID as groupId."
  },
  {
    id: "m2-026", section: "d2",
    q: "According to semantic versioning, which change requires incrementing the MAJOR version of an API?",
    options: ["Adding a new optional response field", "Fixing a typo in documentation", "Removing a field from the response or renaming an existing resource (a breaking change)", "Improving performance without changing the contract"],
    answer: 2,
    explanation: "Breaking changes (removing/renaming fields, changing types, removing resources) break existing consumers → MAJOR bump and typically a new API instance/URL (v1 → v2). Backwards-compatible additions are MINOR; fixes are PATCH."
  },
  {
    id: "m2-027", section: "d2",
    q: "Which reuse mechanism allows multiple Mule apps deployed to the SAME customer-hosted runtime to share one HTTP Listener configuration and port?",
    options: ["A parent POM", "A Mule domain project", "Anypoint MQ", "An API fragment"],
    answer: 1,
    explanation: "Domains share connector configurations (HTTP listener, DB config...) among co-deployed apps on customer-hosted runtimes. Not available on CloudHub, where each app is isolated."
  },
  {
    id: "m2-028", section: "d2",
    q: "A team has common DataWeave functions and reusable flows they want to share across many applications with proper versioning. What is the recommended approach?",
    options: ["Copy the files into each project", "Package them as a custom Mule plugin / library, publish it to Exchange, and add it as a versioned dependency in each app", "Email the XML to each team", "Put the flows in the domain project"],
    answer: 1,
    explanation: "Publishing shared code as a versioned Exchange asset gives controlled reuse, discoverability, and upgrade management. Copy-paste drifts; domains only share configurations on the same runtime."
  },
  {
    id: "m2-029", section: "d2",
    q: "What is the purpose of the mule-artifact.json file in a Mule project?",
    options: ["It stores encrypted properties", "It is the application descriptor: minimum Mule runtime version, secure properties list, and packaging metadata", "It defines the API specification", "It configures log4j"],
    answer: 1,
    explanation: "mule-artifact.json declares app metadata such as minMuleVersion and which properties should be treated as secure (masked), used at packaging and deployment time."
  },
  {
    id: "m2-030", section: "d2",
    q: "Which artifacts can be published to Exchange for reuse across projects? (best answer)",
    options: ["Only complete Mule applications", "API specifications, API fragments (traits, types, examples), connectors, templates, examples, and custom policies", "Only RAML files", "Only Java libraries"],
    answer: 1,
    explanation: "Exchange hosts many asset types: specs (RAML/OAS), reusable fragments, REST/custom connectors, application templates and examples, custom policies, and more."
  },
  {
    id: "m2-031", section: "d2",
    q: "A build must produce different property values for dev and prod WITHOUT rebuilding the artifact per environment. What is the recommended pattern?",
    options: ["One Maven profile per environment that bakes values into the JAR", "One deployable artifact; environment-specific YAML files selected at deploy time via a property (e.g. -Denv=prod), with secrets injected as secure/hidden properties", "Separate Git branches per environment", "Hardcode both configs and toggle with a Choice router"],
    answer: 1,
    explanation: "Build once, deploy many: the same JAR is promoted through environments, with configuration externalized and selected at deployment. Baking env values into artifacts undermines promotion integrity."
  },
  {
    id: "m2-032", section: "d2",
    q: "What does 'mvn clean package' produce for a Mule 4 project?",
    options: ["A site report", "The deployable application JAR under target/, after compiling and running tests", "A Docker image", "An Exchange asset"],
    answer: 1,
    explanation: "clean removes target/, then package compiles, runs the test phase (MUnit), and assembles the deployable mule-application JAR in target/."
  },
  {
    id: "m2-033", section: "d2",
    q: "Which statement about API fragments is correct?",
    options: ["Fragments must be duplicated in every API spec", "Reusable RAML/OAS pieces (data types, traits, examples) can be published to Exchange once and referenced as dependencies from multiple API specifications", "Fragments are only usable in OAS 3", "Fragments are Mule runtime plugins"],
    answer: 1,
    explanation: "API fragments are versioned Exchange assets. Specifications import them, so common types/traits evolve in one place and stay consistent across APIs."
  },
  {
    id: "m2-034", section: "d2",
    q: "Where should Anypoint Exchange repository credentials for Maven builds be stored?",
    options: ["In the project's pom.xml committed to Git", "In the Maven settings.xml (or injected by the CI system as secrets), never committed to source control", "In mule-artifact.json", "In a YAML property file inside the app"],
    answer: 1,
    explanation: "Repository credentials belong in settings.xml / CI secret stores. Committing credentials to the POM leaks them to anyone with repo access."
  },
  {
    id: "m2-035", section: "d2",
    q: "The groupId used when publishing an asset to Anypoint Exchange must be...",
    options: ["com.mulesoft", "the Anypoint organization ID (business group ID)", "any unique string", "the developer's username"],
    answer: 1,
    explanation: "Exchange maps Maven coordinates to your org: the groupId must be the organization/business group ID so the asset lands in the right Exchange catalog."
  },
  {
    id: "m2-036", section: "d2",
    q: "A breaking change forces a new major API version. What should happen to the existing v1 consumers?",
    options: ["v1 is deleted immediately", "v1 keeps running as its own API instance; v2 is released separately; v1 is deprecated with a communicated sunset period before removal", "v1 consumers are auto-migrated to v2", "v1 traffic is redirected to v2 silently"],
    answer: 1,
    explanation: "Major versions coexist as separate instances so consumers migrate on their own schedule. Deprecation in Exchange/API Manager plus clear communication precedes eventual retirement."
  }
);
