// MuleSoft Platform Integration Architect question bank — Part B (sections a6–a10)
window.CERT_DATA.mcia.questions.push(
  // ---- Section a6: Automated Tests ----
  {
    id: "ia-038", section: "a6",
    q: "A test must verify that when the backend returns HTTP:CONNECTIVITY, the flow maps it to a 503 response with a specific JSON body. Which test level and technique fit?",
    options: ["Performance test against the real backend", "MUnit test using Mock When with Then-throw to raise HTTP:CONNECTIVITY, asserting the resulting payload and status", "Manual test in production", "Integration test that physically unplugs the backend"],
    answer: 1,
    explanation: "Error-path logic is unit-testable: mock the failing operation and make it throw the typed error, then assert the error-handler output. Deterministic, fast, runs in every build — exactly what MUnit's Then-throw exists for."
  },
  {
    id: "ia-039", section: "a6",
    q: "Which requirement is BEST verified with integration testing rather than MUnit?",
    options: ["A DataWeave transformation maps all fields correctly", "The mutual-TLS handshake and OAuth token exchange with the partner's real test endpoint work end to end", "A Choice router takes the correct branch for each input", "An error handler returns a 400 for validation failures"],
    answer: 1,
    explanation: "Certificates, trust chains, and token exchanges depend on real infrastructure and cannot be meaningfully mocked — that's interaction risk, the domain of integration testing. The other options are pure flow logic, ideal for MUnit."
  },
  {
    id: "ia-040", section: "a6",
    q: "How should MUnit tests participate in a CI/CD pipeline?",
    options: ["Run manually before each release from Studio", "Run automatically in the Maven test phase on every build, with coverage thresholds that fail the build when unmet", "Run only in production after deployment", "Replace integration and performance testing entirely"],
    answer: 1,
    explanation: "The munit-maven-plugin binds to the test phase; requiredApplicationCoverage/failBuild turn coverage into a quality gate. MUnit complements — never replaces — integration and performance tests."
  },
  {
    id: "ia-041", section: "a6",
    q: "The NFR states 500 requests/second with p95 latency under 300 ms. What is the correct way to validate this before go-live?",
    options: ["Extrapolate from MUnit execution times", "Load-test a production-equivalent environment (same vCores/replicas, realistic payloads) while observing metrics, pushing past the target to find the breaking point", "Test on a developer laptop and multiply by the number of workers", "Enable verbose logging in production and watch"],
    answer: 1,
    explanation: "Performance results only transfer from production-like sizing and realistic traffic. MUnit measures logic, not capacity; laptop numbers don't scale linearly; verbose production logging changes the very performance you're measuring."
  },
  {
    id: "ia-042", section: "a6",
    q: "What is API Functional Monitoring (BAT) used for?",
    options: ["Unit-testing DataWeave scripts", "Scheduled black-box tests that call deployed APIs from public or private locations and assert on real responses, continuously", "Measuring code coverage of Mule flows", "Load-testing APIs at high concurrency"],
    answer: 1,
    explanation: "BAT monitors deployed APIs' functional behavior on a schedule — the 'is it actually working right now, from where consumers sit' check. Coverage is MUnit's job; load testing uses dedicated tools."
  },

  // ---- Section a7: Reliability Requirements ----
  {
    id: "ia-043", section: "a7",
    q: "A process must update a database AND publish to a JMS queue atomically — both succeed or both roll back. Which mechanism supports this?",
    options: ["A local (single resource) transaction", "An XA transaction spanning the DB and JMS operations", "Until Successful around both operations", "Two separate Try scopes"],
    answer: 1,
    explanation: "Atomicity across TWO different transactional resources (DB + JMS) requires XA two-phase commit. Local transactions cover one resource only; Until Successful retries but offers no atomicity."
  },
  {
    id: "ia-044", section: "a7",
    q: "A flow must call an external REST API (no transaction support) and guarantee the order is eventually recorded there despite failures. Which design is appropriate?",
    options: ["Wrap the HTTP call in an XA transaction", "Persist the order to a queue first, consume transactionally, call the API with retries, and design the API call to be idempotent", "Use a local transaction on the HTTP connector", "Call the API inside a Cache scope"],
    answer: 1,
    explanation: "HTTP cannot join transactions. The reliable pattern is store-and-forward: persist first (queue), consume under a transaction so failures roll the message back, retry the call, and make it idempotent so redelivery is safe."
  },
  {
    id: "ia-045", section: "a7",
    q: "A travel booking spans three systems (flight, hotel, car) over APIs and may take minutes. If the car booking fails, the flight and hotel must be undone. Which pattern fits?",
    options: ["XA transaction across the three APIs", "Compensation (saga): each step has a compensating action executed when a later step fails", "One local transaction per API", "Scatter-Gather with a timeout"],
    answer: 1,
    explanation: "Long-running multi-system processes over non-transactional APIs cannot lock resources for minutes — sagas execute compensating actions (cancel flight, cancel hotel) to restore consistency. XA is impossible over plain HTTP APIs."
  },
  {
    id: "ia-046", section: "a7",
    q: "Which trio correctly matches the mechanism to its level?",
    options: ["Reconnection strategy = message level; redelivery policy = connection level; Until Successful = flow level", "Reconnection strategy = connection level; Until Successful = operation retries in-flow; redelivery policy = per-message attempts at the source, feeding a DLQ when exhausted", "All three are interchangeable", "Until Successful = connection level; the others are equivalent"],
    answer: 1,
    explanation: "Reconnection re-establishes broken CONNECTIONS; Until Successful retries the wrapped OPERATIONS synchronously in memory; a redelivery policy counts processing failures of the SAME MESSAGE and raises REDELIVERY_EXHAUSTED for DLQ routing."
  },
  {
    id: "ia-047", section: "a7",
    q: "Why is Until Successful alone NOT sufficient for a zero-message-loss requirement?",
    options: ["It cannot retry more than 3 times", "The retried event is held in memory — an app crash or restart during retries loses it; durability needs a persistent queue", "It only works with HTTP", "It commits transactions automatically"],
    answer: 1,
    explanation: "Until Successful is an in-memory, in-flow retry. Zero-loss guarantees require the message to be PERSISTED (queue/broker) before acknowledgment, so a crash can't destroy the only copy."
  },
  {
    id: "ia-048", section: "a7",
    q: "What is the correct distinction between high availability and disaster recovery?",
    options: ["They are synonyms", "HA = redundancy and automatic failover within a deployment against component failure; DR = ability to restore service after losing a whole site/region, measured by RTO and RPO", "DR is achieved automatically by running two CloudHub workers", "HA applies only to customer-hosted deployments"],
    answer: 1,
    explanation: "Two workers in one region give HA — and die together if the region does. DR is the cross-site/region recovery capability with explicit recovery-time (RTO) and data-loss (RPO) objectives."
  },
  {
    id: "ia-049", section: "a7",
    q: "An architect designs DR for a CloudHub-based solution with a 1-hour RTO. Which fact must the design account for?",
    options: ["CloudHub automatically replicates applications to a second region", "Object Store v2 and Anypoint MQ data are regional — the DR region needs its own instances and a strategy for state/messages, plus app deployment and DNS switchover within the hour", "Only the control plane needs a DR plan", "Static IPs move automatically across regions"],
    answer: 1,
    explanation: "CloudHub does not auto-replicate apps or platform services across regions. DR design must cover redeployment (automated pipelines help), regional state (OSv2, MQ queues), endpoint switchover (DNS/DLB), and testing the runbook against RTO/RPO."
  },
  {
    id: "ia-050", section: "a7",
    q: "Messages that repeatedly fail processing must not block the queue and must be kept for analysis. Which combination implements this?",
    options: ["Until Successful with infinite retries", "A redelivery policy (or broker max-delivery count) that routes exhausted messages to a dead-letter queue", "On Error Continue that swallows the error", "Deleting failing messages"],
    answer: 1,
    explanation: "Poison-message handling = bounded delivery attempts + DLQ. Anypoint MQ does this broker-side (maxDeliveries → DLQ); Mule-side, REDELIVERY_EXHAUSTED can be handled to publish to a DLQ. Infinite retries block; swallowing loses data."
  },

  // ---- Section a8: Performance Requirements ----
  {
    id: "ia-051", section: "a8",
    q: "An API aggregates three independent backend calls, each ~400 ms. The p95 latency target is 600 ms. What design change gets closest to the target?",
    options: ["Call the backends sequentially and hope for cache hits", "Call the three backends concurrently with Scatter-Gather so total ≈ the slowest call", "Add more CloudHub workers", "Increase the HTTP timeout"],
    answer: 1,
    explanation: "Sequential = ~1200 ms; concurrent = ~400 ms (slowest branch). Parallelizing independent calls is the latency lever here — more workers raise throughput, not per-request latency."
  },
  {
    id: "ia-052", section: "a8",
    q: "Which scaling approach is correct for a stateless API that must go from 300 to 900 requests/second?",
    options: ["Vertical scaling only — triple the vCore size", "Horizontal scaling — more workers/replicas behind the load balancer (statelessness makes this safe), validated by a load test", "Rewrite all flows as batch jobs", "Increase maxConcurrency to 900 on one worker"],
    answer: 1,
    explanation: "Throughput scales best horizontally for stateless apps. Bigger single workers hit diminishing returns; maxConcurrency doesn't add capacity, it only bounds concurrency on existing capacity."
  },
  {
    id: "ia-053", section: "a8",
    q: "A 10 GB CSV file must be transformed and forwarded by a worker with 2 GB of memory. Which combination makes this feasible?",
    options: ["Read the file fully and increase JVM heap", "Repeatable file-stored streaming plus DataWeave streaming (streaming=true / deferred output) so data flows through in chunks", "Parallel For Each over all rows in memory", "Base64-encode the file first"],
    answer: 1,
    explanation: "File-stored repeatable streams buffer only a small window in memory (spilling to disk), and DataWeave streaming processes records sequentially in one pass with deferred output — the payload never fully materializes."
  },
  {
    id: "ia-054", section: "a8",
    q: "A downstream ERP can safely handle only 50 concurrent requests, but the Mule app receives thousands. How should the architect protect the ERP?",
    options: ["Add more Mule workers so requests finish faster", "Bound concurrency toward the ERP (maxConcurrency / queue-based buffering) so excess load waits instead of overwhelming it", "Reduce the ERP's timeout", "Use non-repeatable streams"],
    answer: 1,
    explanation: "The bottleneck is the ERP, not Mule — adding Mule capacity makes the overload WORSE. Throttle at the boundary: maxConcurrency on the flow/operation, or buffer via a queue and consume at the ERP's safe rate."
  },
  {
    id: "ia-055", section: "a8",
    q: "Which situation defeats streaming and forces the full payload into memory?",
    options: ["Passing the stream to a single downstream write", "Logging #[payload] mid-flow and then transforming it with random access to all records", "Using repeatable file-stored streams", "Setting deferred=true on the writer"],
    answer: 1,
    explanation: "Logging the payload consumes/materializes it, and DataWeave random access (indexing around, sorting, groupBy over everything) requires the whole dataset. Streaming survives only sequential, single-pass style processing."
  },
  {
    id: "ia-056", section: "a8",
    q: "Millions of records arrive nightly; processing must survive an app restart mid-run and tolerate individual record failures without stopping. Which construct is designed for exactly this?",
    options: ["Parallel For Each", "Batch Job (persistent record queues, record-level error handling, resume after restart)", "Scatter-Gather", "Until Successful around a For Each"],
    answer: 1,
    explanation: "Batch jobs queue records persistently, process them in parallel, tolerate per-record failures (maxFailedRecords), and resume after crashes — none of which Parallel For Each or Scatter-Gather provide."
  },
  {
    id: "ia-057", section: "a8",
    q: "Which metric formulation belongs in a performance NFR?",
    options: ["\"The API should feel fast\"", "\"p95 latency ≤ 300 ms at 500 requests/second sustained, with payloads up to 100 KB\"", "\"Average latency should be OK at normal load\"", "\"As fast as possible\""],
    answer: 1,
    explanation: "Testable NFRs quantify percentile latency, throughput, and conditions. Averages hide tail latency; vague words can't be verified by a performance test."
  },

  // ---- Section a9: Security Requirements ----
  {
    id: "ia-058", section: "a9",
    q: "Corporate policy: platform users must sign in to Anypoint Platform through the company IdP with MFA. Which platform capability implements this?",
    options: ["Client ID enforcement policy", "Identity management — federate login via SAML 2.0 or OpenID Connect to the external IdP", "Secure configuration properties", "Anypoint MQ access control"],
    answer: 1,
    explanation: "Identity management federates HUMAN login to an external IdP (SAML/OIDC), where MFA is enforced. Client ID enforcement authenticates API consumers, not platform users."
  },
  {
    id: "ia-059", section: "a9",
    q: "API consumers must obtain OAuth tokens from the company's existing Okta authorization server, and gateways must validate those tokens. What is configured?",
    options: ["Nothing — CloudHub validates any OAuth token", "Okta as an external client provider (client management), plus an OAuth token enforcement / JWT validation policy on the API instances", "A SAML assertion policy", "Basic authentication with Okta passwords"],
    answer: 1,
    explanation: "Client management delegates client registration/tokens to the external OAuth provider; the API-level policy (OAuth enforcement or JWT validation against Okta's keys) makes gateways verify the tokens. SAML federates platform users, not API clients."
  },
  {
    id: "ia-060", section: "a9",
    q: "A CI/CD pipeline needs credentials to deploy applications and configure API instances. What is the recommended credential type?",
    options: ["A developer's username and password", "A Connected App using the client_credentials grant with narrowly scoped permissions", "The organization administrator account", "An SSH key"],
    answer: 1,
    explanation: "Connected apps are the machine identity for platform automation: scoped, rotatable, auditable, and not tied to a person who might leave or change password. Personal/admin accounts in pipelines are an anti-pattern."
  },
  {
    id: "ia-061", section: "a9",
    q: "Which capabilities belong to Anypoint Security (edge security for Runtime Fabric)?",
    options: ["DataWeave obfuscation and code signing", "DoS protection, IP allowlists, HTTP limit policies, Web Application Firewall, Secrets Manager, and tokenization at the perimeter", "Automatic penetration testing", "Encrypting Object Store v2 content"],
    answer: 1,
    explanation: "Anypoint Security hardens the RTF perimeter: edge policies (DoS, IP, HTTP limits, WAF), a Secrets Manager vault for TLS material, and a tokenization service replacing sensitive fields before they reach apps."
  },
  {
    id: "ia-062", section: "a9",
    q: "A security review finds SQL built by string concatenation with user input, and passwords in plaintext YAML. Which pair of fixes addresses both?",
    options: ["Move the YAML to a different folder and add a comment", "Parameterized queries (DB input parameters) and encrypted secure configuration properties with the key injected at deployment", "Base64-encode both", "An IP allowlist policy"],
    answer: 1,
    explanation: "Input parameters eliminate SQL injection; secure properties encrypt secrets at rest with the key supplied at deploy time (never packaged). Base64 is encoding, not encryption; IP filtering addresses neither issue."
  },
  {
    id: "ia-063", section: "a9",
    q: "Compliance asks: \"Show who changed the rate-limiting policy on the production API instance last month.\" Where is this answered?",
    options: ["Application log files", "The Anypoint Platform audit log (UI or query API), which records control-plane actions with user, action, object, and timestamp", "Anypoint Monitoring dashboards", "The API's access logs"],
    answer: 1,
    explanation: "Policy changes are control-plane actions captured by the platform audit log — exportable to SIEM via its API. App logs and monitoring cover runtime traffic, not administrative changes."
  },
  {
    id: "ia-064", section: "a9",
    q: "Which practice reflects zero-trust thinking INSIDE an application network?",
    options: ["Internal APIs skip authentication because callers are internal", "Every API — including System APIs called only by other layers — authenticates its callers and uses TLS", "Only Experience APIs need policies", "Trust any request originating from the VPC"],
    answer: 1,
    explanation: "Zero trust assumes any layer can be compromised: internal hops still get authN/Z (client credentials/JWT) and encrypted transport. 'Internal = trusted' is the assumption attackers exploit for lateral movement."
  },

  // ---- Section a10: DevOps and Operations ----
  {
    id: "ia-065", section: "a10",
    q: "Which CI/CD principle is violated by building a separate JAR per environment with environment-specific Maven profiles?",
    options: ["Semantic versioning", "Build once, promote the same artifact — environment differences belong in externalized properties, not rebuilds", "Test-driven development", "Trunk-based development"],
    answer: 1,
    explanation: "Rebuilding per environment means production runs an artifact that was never tested. The tested artifact should be promoted unchanged, with per-environment configuration injected as properties/secrets at deploy time."
  },
  {
    id: "ia-066", section: "a10",
    q: "Which Maven command/config combination deploys an already-built Mule application to CloudHub 2.0 from a pipeline?",
    options: ["mvn clean install", "mvn deploy -DmuleDeploy with a cloudhub2Deployment section (target, environment, connected app credentials) in the mule-maven-plugin", "mvn package -Pprod", "mvn exchange:publish"],
    answer: 1,
    explanation: "The mule-maven-plugin's deployment configs drive platform deployments; -DmuleDeploy switches mvn deploy from 'publish to repository' to 'deploy the app'. Plain deploy without it publishes the artifact to the Maven repo (e.g., Exchange)."
  },
  {
    id: "ia-067", section: "a10",
    q: "An operations team wants to script creation of API instances, application of policies, and app deployments across environments. Which platform capabilities are designed for this?",
    options: ["Manual clicks documented in a wiki", "Anypoint Platform REST APIs and the Anypoint CLI (authenticated via a connected app)", "Editing the control plane database", "Exporting/importing Studio projects"],
    answer: 1,
    explanation: "Everything the UI does is exposed via platform APIs; the Anypoint CLI wraps them for scripting. Together with the Maven plugins they make the full API lifecycle automatable."
  },
  {
    id: "ia-068", section: "a10",
    q: "Central security requires all production application logs in the corporate Splunk with multi-year retention. On CloudHub 1.0, what is the standard approach?",
    options: ["Rely on default CloudHub logs, which retain data forever", "Disable CloudHub logging for the app (requires org permission) and configure a log4j2 appender that ships logs to Splunk — or use Anypoint Monitoring log forwarding where licensed", "Print logs to the payload", "Screenshot the log viewer weekly"],
    answer: 1,
    explanation: "CloudHub's built-in logs have size/retention limits and live in the platform. Enterprise aggregation uses custom log4j2 appenders (Splunk HEC/HTTP) after disabling platform log capture, or Titanium-tier Anypoint Monitoring capabilities."
  },
  {
    id: "ia-069", section: "a10",
    q: "Async loggers are proposed for a high-throughput app. What is the trade-off to document?",
    options: ["Async logging is always worse", "Higher throughput and lower latency, but buffered entries can be lost on a crash and strict ordering weakens — keep audit-critical logs synchronous", "Async loggers double memory permanently", "Log4j 2 does not support async"],
    answer: 1,
    explanation: "Async appenders/loggers decouple logging I/O from event processing — faster, but a JVM crash can drop what's still buffered. Logs with evidentiary value should stay synchronous."
  },
  {
    id: "ia-070", section: "a10",
    q: "Match the operational question to the right tool: (1) Is the app's error rate rising? (2) Did the deployment fail? (3) Is the API returning correct data right now from the consumer's perspective?",
    options: ["1=Runtime Manager alert, 2=BAT, 3=Anypoint Monitoring", "1=Anypoint Monitoring dashboards/alerts, 2=Runtime Manager alert, 3=API Functional Monitoring (BAT)", "1=Audit log, 2=Visualizer, 3=Exchange", "1=BAT, 2=Anypoint Monitoring, 3=Runtime Manager"],
    answer: 1,
    explanation: "Metrics trends/alerts = Anypoint Monitoring; deployment/app-status events = Runtime Manager alerts; continuous functional verification from outside = BAT. Visualizer maps dependencies; the audit log records admin actions."
  },
  {
    id: "ia-071", section: "a10",
    q: "Where should the version number of a Mule application artifact be managed, and what should trigger a MAJOR increment?",
    options: ["In the flow XML; every deployment increments major", "In the Maven POM using semantic versioning; a backwards-incompatible (breaking) change increments MAJOR", "In Runtime Manager properties; time-based versioning", "Versions are unnecessary for internal apps"],
    answer: 1,
    explanation: "The POM version (semver) identifies the artifact through the pipeline and in repositories/Exchange. Breaking changes bump MAJOR (and for APIs surface as a new instance/URL); features bump MINOR; fixes bump PATCH."
  },
  {
    id: "ia-072", section: "a10",
    q: "A correlation ID must allow tracing one business transaction across an Experience API, a Process API, and two System APIs in centralized logs. What makes this work in Mule 4?",
    options: ["Each app generates its own random ID", "The event's correlation ID is propagated across HTTP calls via the X-Correlation-ID header and included in log patterns, so all apps log the same ID", "Correlation requires a custom database", "Only CloudHub supports correlation"],
    answer: 1,
    explanation: "Mule propagates the correlation ID automatically over the HTTP connector (X-Correlation-ID) and default log patterns include it — searching that ID in the central log store reconstructs the full journey across apps."
  }
);
