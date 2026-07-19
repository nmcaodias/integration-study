/* MCD2 · 20 new hard questions (m2-128..147) across d1-d5 — exhibit-heavy,
 * multi-concept scenarios in the real exam's style. */
module.exports = {
  addQuestions: [
    {
      id: "m2-128", section: "d1", level: "hard",
      q: "Refer to the exhibit. The DB write fails. Given the handler shown, what happens to the JMS message and the partial DB work?",
      exhibit: "<jms:listener destination=\"orders\" transactionalAction=\"ALWAYS_BEGIN\" transactionType=\"LOCAL\"/>\n<db:insert .../>            <!-- fails here -->\n<error-handler>\n  <on-error-continue type=\"DB:CONNECTIVITY\">\n    <logger message=\"handled\"/>\n  </on-error-continue>\n</error-handler>",
      options: [
        "The transaction COMMITS and the JMS message is acknowledged — On Error Continue treats processing as successful, so the failure is swallowed",
        "The transaction rolls back and the JMS message is redelivered, because any error inside a transactional scope forces a rollback",
        "Only the DB operation rolls back; the JMS message is still acknowledged independently of the transaction outcome",
        "The message moves straight to a dead-letter queue, because a DB error inside a JMS transaction is unrecoverable"
      ],
      answer: 0,
      optionNotes: [
        "Correct — On Error Continue marks the flow successful, so the transaction commits and the message is acked; the failed DB write is simply lost.",
        "That's On Error PROPAGATE behaviour; Continue does the opposite.",
        "The DB and JMS are in one transaction — they can't commit/rollback independently.",
        "Nothing routes to a DLQ here; Continue quietly acknowledges."
      ],
      explanation: "The classic transaction trap: On Error Propagate at the transaction level rolls back (message redelivered); On Error Continue commits (message acked), silently discarding the partial work. Choosing Continue by accident commits incomplete transactions."
    },
    {
      id: "m2-129", section: "d1", level: "hard",
      q: "An HTTP-triggered flow sets maxConcurrency=\"2\". Ten requests arrive simultaneously, each taking ~5 seconds. What does a client of the 9th request observe, and why?",
      options: [
        "It waits — back-pressure queues requests beyond the concurrency cap; if the source can't keep up it may eventually answer 503",
        "It is rejected immediately with 429 Too Many Requests, because maxConcurrency enforces a hard rate limit",
        "It runs in parallel anyway — maxConcurrency limits threads, not concurrent flow executions, so all ten proceed",
        "It fails fast with a connectivity error, because Mule refuses to buffer requests beyond the configured maximum"
      ],
      answer: 0,
      optionNotes: [
        "Correct — maxConcurrency caps simultaneous flow executions; excess requests wait under back-pressure, and a saturated HTTP source can return 503.",
        "maxConcurrency isn't a rate-limiting policy; 429 comes from SLA/rate policies.",
        "It limits concurrent executions of the flow, not just threads.",
        "Requests are back-pressured/queued, not immediately failed."
      ],
      explanation: "maxConcurrency shapes load by capping concurrent flow executions; Mule 4's self-tuning engine applies back-pressure to the source when the cap is reached, and an HTTP Listener ultimately answers 503 rather than running unbounded work."
    },
    {
      id: "m2-130", section: "d1", level: "hard",
      q: "Two CloudHub applications must exchange work so that no message is lost even if the consumer app is down for several hours. A developer proposes persistent VM queues. What is wrong, and what is the fix?",
      options: [
        "VM queues are intra-application only and can't bridge two apps; use Anypoint MQ (or JMS) for durable cross-app messaging",
        "Nothing is wrong — persistent VM queues on CloudHub are shared across applications in the same environment",
        "VM queues work across apps but aren't durable; enable Guaranteed Delivery on the VM connector to fix it",
        "The proposal fails only because CloudHub disables VM queues entirely; switch to Object Store v2 as the channel"
      ],
      answer: 0,
      optionNotes: [
        "Correct — VM queues connect flows within one app (or its cluster); cross-app durable messaging needs Anypoint MQ or JMS.",
        "VM queues are not shared across separate CloudHub apps.",
        "There's no cross-app VM delivery to make durable; the scope is the problem.",
        "Object Store isn't a message broker; MQ/JMS is the right channel."
      ],
      explanation: "VM queues are an intra-application (or intra-cluster) transport — they never cross application boundaries. Durable messaging between separate apps, surviving long consumer outages, is Anypoint MQ or JMS with persistence and a DLQ."
    },
    {
      id: "m2-131", section: "d1", level: "hard",
      q: "Refer to the exhibit. A reference-data API is hit thousands of times per hour; data changes daily. The app runs on 3 CloudHub workers. Why does this caching config fail to reduce backend load as expected?",
      exhibit: "<ee:cache cachingStrategy-ref=\"Caching_Strategy\"/>\n<caching-strategy name=\"Caching_Strategy\">\n  <!-- default in-memory object store, no TTL set -->\n</caching-strategy>",
      options: [
        "The default in-memory store is per-worker, so each of the 3 workers keeps its own cache; back it with a shared OSv2 store and set a TTL",
        "Cache scope cannot be used for HTTP responses at all; only an API Manager HTTP Caching policy reduces backend load",
        "The cache never populates because a TTL is mandatory; without one, Mule refuses to store any entry",
        "Caching only helps for non-idempotent requests, so reference-data GETs are ignored by the Cache scope"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a default in-memory caching strategy is per-worker; across 3 workers you get 3 caches with ~⅓ the hit rate. Use an OSv2-backed shared strategy and a sensible TTL.",
        "Cache scope absolutely caches flow results including HTTP responses.",
        "A missing TTL means entries don't expire, not that nothing is stored.",
        "Idempotent GETs are exactly what the Cache scope serves."
      ],
      explanation: "On multiple workers, a per-worker in-memory cache fragments the hit rate. A shared Object Store v2-backed caching strategy (plus a TTL matching the daily change) is what actually cuts backend load across all workers."
    },
    {
      id: "m2-132", section: "d1", level: "hard",
      q: "A flow must process each of 4 million database rows in parallel, collecting the results into a list, must survive an app restart mid-run, and must isolate individual record failures without stopping. Which construct fits, and why not Parallel For Each?",
      options: [
        "A Batch Job — persistent record queues survive restarts and isolate per-record failures; Parallel For Each keeps records in memory and can't resume",
        "Parallel For Each with maxConcurrency tuned high — it collects results in order and its checkpoints let it resume after a restart",
        "A For Each scope inside Until Successful, so each record is retried and the loop resumes from its last index after a restart",
        "Scatter-Gather over the row set, because its per-route error aggregation provides record-level failure isolation and restart recovery"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Batch Job persists records, isolates per-record errors, and resumes after restart; that's exactly what millions-of-records reliable processing needs.",
        "Parallel For Each holds its collection in memory and has no restart recovery.",
        "For Each is sequential and has no persistent checkpointing across restarts.",
        "Scatter-Gather runs a fixed set of routes on one event, not millions of records with recovery."
      ],
      explanation: "Batch Job is purpose-built for large, resilient record processing: persistent record queues (survive restarts), record-level error handling (maxFailedRecords), and phased processing. Parallel For Each is for a bounded in-memory collection with no recovery."
    },
    {
      id: "m2-133", section: "d2", level: "hard",
      q: "Refer to the exhibit. The MySQL driver is declared as a normal dependency, yet the Database connector throws ClassNotFoundException at runtime. Why, and what is the fix?",
      exhibit: "<dependency>\n  <groupId>com.mysql</groupId>\n  <artifactId>mysql-connector-j</artifactId>\n  <version>8.3.0</version>\n</dependency>\n<!-- Database connector: MySQL — fails with ClassNotFoundException at runtime -->",
      options: [
        "Mule 4 classloader isolation hides app dependencies from connectors; declare the driver under sharedLibraries in the mule-maven-plugin",
        "The driver version is incompatible with the connector; upgrading it resolves the missing class at runtime",
        "The dependency scope is test; changing it to compile makes the driver visible to the Database connector",
        "The driver must be copied into the Mule runtime's lib folder on CloudHub, because JDBC drivers can't be packaged in the app"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Mule 4 isolates classloaders, so a connector can't see an app dependency unless it's exported via sharedLibraries in the mule-maven-plugin.",
        "It's a visibility problem, not a version mismatch.",
        "Scope isn't the issue; the driver still wouldn't be exported to the connector.",
        "You can't drop jars into CloudHub's runtime lib; sharedLibraries is the mechanism."
      ],
      explanation: "Mule 4's classloader isolation keeps application dependencies invisible to connectors. A JDBC driver must be declared under <sharedLibraries> in the mule-maven-plugin so it is exported to the Database connector's classloader."
    },
    {
      id: "m2-134", section: "d2", level: "hard",
      q: "Refer to the exhibit. A pipeline runs 'mvn deploy' (no -DmuleDeploy). The pom has BOTH a distributionManagement repo and a cloudhub2Deployment section. What happens?",
      exhibit: "pom.xml:\n  <distributionManagement>... Exchange/Nexus repo ...</distributionManagement>\n  <mule-maven-plugin>\n    <configuration><cloudhub2Deployment>...</cloudhub2Deployment></configuration>\n  </mule-maven-plugin>\n\nCommand:  mvn deploy",
      options: [
        "The artifact is published to the configured repository, but the application is NOT deployed to CloudHub — that needs -DmuleDeploy",
        "The application is deployed to CloudHub 2.0 and also published to the repository, because both sections are configured",
        "The build fails, because a pom cannot contain both distributionManagement and a cloudhub2Deployment at once",
        "Nothing is published or deployed; 'mvn deploy' without -DmuleDeploy only validates the deployment configuration"
      ],
      answer: 0,
      optionNotes: [
        "Correct — plain 'mvn deploy' runs Maven's deploy phase (publish to the repo); the mule-maven-plugin only deploys the app when -DmuleDeploy is set.",
        "Without -DmuleDeploy the app deployment doesn't trigger.",
        "Both sections coexisting is normal and valid.",
        "The Maven deploy phase does publish the artifact; it isn't a no-op."
      ],
      explanation: "'mvn deploy' runs the standard Maven deploy phase (artifact → repository via distributionManagement). The mule-maven-plugin's application deployment is only activated by the -DmuleDeploy flag; without it, you publish but don't deploy."
    },
    {
      id: "m2-135", section: "d2", level: "hard",
      q: "An API team must ship a change that removes a deprecated field and renames a resource, while dozens of consumers still call the current version. Which release approach and versioning are correct?",
      options: [
        "It's a breaking change → new MAJOR version (e.g. /v2) released alongside v1; deprecate v1, notify holders with a sunset date, then retire",
        "It's backwards-compatible → a MINOR bump republished in place, since consumers can ignore fields they don't use",
        "Increment only the PATCH version and republish the same instance, because field removals don't affect existing clients",
        "Delete the field immediately from the live version and email consumers, since deprecation windows apply only to whole APIs"
      ],
      answer: 0,
      optionNotes: [
        "Correct — removing a field / renaming a resource is breaking → new MAJOR version alongside v1, with a managed deprecate→notify→retire lifecycle.",
        "Field removal and resource rename are breaking, not MINOR-compatible.",
        "Breaking changes are never PATCH; and they can't safely republish in place.",
        "You never silently break live consumers; v1 runs during the sunset window."
      ],
      explanation: "Semantic versioning: additive/optional = MINOR, breaking (remove field, rename resource) = MAJOR. Ship v2 beside v1, mark v1 deprecated in Exchange/API Manager, notify contract holders with a sunset date, then retire after the window."
    },
    {
      id: "m2-136", section: "d2", level: "medium",
      q: "Refer to the exhibit. Which change to this RAML is backwards-compatible (MINOR) rather than breaking (MAJOR)?",
      exhibit: "/orders:\n  get:\n    queryParameters:\n      status: { enum: [NEW, SHIPPED] }\n    responses:\n      200:\n        body: { type: Order[] }",
      options: [
        "Adding a new OPTIONAL query parameter (e.g. limit) and a new optional field to the Order response type",
        "Removing the 'status' query parameter and deleting an existing field from the Order type",
        "Adding a new REQUIRED query parameter that every existing consumer must now send",
        "Changing the response body from Order[] to a single Order object with a different shape"
      ],
      answer: 0,
      optionNotes: [
        "Correct — additive, optional changes don't break existing consumers, so they are MINOR.",
        "Removing a parameter or a response field is breaking (MAJOR).",
        "A new required parameter breaks callers that don't send it (MAJOR).",
        "Changing the response structure is breaking (MAJOR)."
      ],
      explanation: "Backwards-compatible = additive and optional (new optional param, new optional response field). Anything that removes, renames, or newly requires something breaks existing consumers and forces a MAJOR version."
    },
    {
      id: "m2-137", section: "d3", level: "hard",
      q: "Refer to the exhibit. The HTTPS request to a partner fails with 'PKIX path building failed'. The partner's certificate is signed by their private CA. What is the fix?",
      exhibit: "<http:request-config name=\"Partner\">\n  <http:request-connection host=\"partner.example.com\" port=\"443\" protocol=\"HTTPS\"/>\n  <!-- no tls:context configured -->\n</http:request-config>",
      options: [
        "Add a tls:context with a trust-store containing the partner's private CA certificate so the JVM can build the trust chain",
        "Add a tls:context with a key-store containing your client certificate, since PKIX errors mean the server wants mutual TLS",
        "Disable certificate validation on the requester (insecure=true) permanently, as private CAs can't be validated",
        "Switch the request protocol from HTTPS to HTTP, because private-CA certificates are unsupported by Mule"
      ],
      answer: 0,
      optionNotes: [
        "Correct — PKIX path building failed means the CA isn't trusted; add the partner's CA to a trust-store on the request's TLS context.",
        "PKIX path building is about trusting the server's chain (trust-store), not presenting a client cert (key-store).",
        "Disabling validation is insecure and not the correct fix.",
        "Downgrading to HTTP abandons security and isn't required."
      ],
      explanation: "'PKIX path building failed' is a trust problem: the JVM can't chain the server's certificate to a trusted CA. Adding the partner's CA to a trust-store on the requester's TLS context lets validation succeed."
    },
    {
      id: "m2-138", section: "d3", level: "hard",
      q: "A file written to a partner's SFTP server must remain encrypted at rest there and be decryptable ONLY by the partner. TLS already protects the transfer. Which mechanism meets the at-rest requirement?",
      options: [
        "PGP-encrypt the payload with the partner's PUBLIC key (Cryptography module) before writing; only their private key can decrypt it",
        "Rely on the SFTP transport's TLS, since an encrypted channel also guarantees the file is encrypted at rest",
        "Encrypt the payload with your own Secure Properties key so the file is protected wherever it lands",
        "Apply a JWT validation policy to the SFTP endpoint so only the partner can read the written file"
      ],
      answer: 0,
      optionNotes: [
        "Correct — PGP with the partner's public key gives end-to-end at-rest encryption only they (with the matching private key) can undo.",
        "TLS protects data in transit, not at rest on the destination disk.",
        "Your own key would let you (not only the partner) decrypt, and isn't shared with them.",
        "JWT policies govern API access, not file-at-rest encryption."
      ],
      explanation: "Transport security (TLS) ≠ at-rest security. The Cryptography module's PGP strategy encrypts the payload for a specific recipient using their public key, so the file stays encrypted on the partner's server and only their private key decrypts it."
    },
    {
      id: "m2-139", section: "d3", level: "hard",
      q: "Refer to the exhibit. A deployment fails at startup. What is the most likely cause and remedy?",
      exhibit: "Startup error:\n  Could not resolve placeholder 'secure::db.password'\n\nconfig.yaml:  db.password: \"![k9Xv...==]\"\n<secure-properties:config file=\"config.yaml\" key=\"${secure.key}\"/>",
      options: [
        "The decryption key (secure.key) wasn't supplied at deploy time, so the module can't resolve secure:: values — provide it as a hidden property or -D argument",
        "The ciphertext in config.yaml is malformed; re-encrypting the value without the ![...] wrapper will fix resolution",
        "The property must be referenced as ${db.password}; the secure:: prefix is only used inside DataWeave scripts",
        "Secure properties can't be used for database passwords; move the value into mule-artifact.json instead"
      ],
      answer: 0,
      optionNotes: [
        "Correct — an unresolved secure:: placeholder at startup means the key was missing; supply secure.key at deploy time (hidden RM property / CI secret / -D).",
        "The ![...] wrapper is required for encrypted values, not the cause.",
        "secure:: is exactly the right reference for encrypted config properties.",
        "Secure properties are the recommended home for DB passwords; mule-artifact.json isn't."
      ],
      explanation: "'Could not resolve placeholder secure::…' means the secure-properties module couldn't decrypt — almost always because the key wasn't provided. The key lives out-of-band (deploy-time argument / hidden platform property), never in the repo."
    },
    {
      id: "m2-140", section: "d3", level: "medium",
      q: "For a Mule HTTPS Listener, which keystore/truststore configuration implements MUTUAL TLS (the server also authenticates the client)?",
      options: [
        "A key-store (server identity) plus a trust-store of accepted client CAs, with client authentication required on the TLS context",
        "A key-store only, because the server already proves its identity and clients don't need to present certificates",
        "A trust-store only, containing the server's own certificate for clients to validate against",
        "Two separate HTTPS listeners — one for the server certificate and one for validating client certificates"
      ],
      answer: 0,
      optionNotes: [
        "Correct — mutual TLS on a listener needs the server's key-store, a trust-store of client CAs, and client-auth required so the server validates presented client certs.",
        "A key-store alone is one-way TLS; the client isn't authenticated.",
        "A trust-store doesn't hold the server's identity, and one alone can't serve TLS.",
        "One listener with the right TLS context handles it; you don't split into two."
      ],
      explanation: "Mutual TLS on a listener = server key-store (its identity) + trust-store (the client CAs it accepts) + client authentication required, so the handshake validates both directions."
    },
    {
      id: "m2-141", section: "d4", level: "hard",
      q: "Refer to the exhibit. Map each operational need to where it is configured.",
      exhibit: "1) Alert when the CloudHub app stops responding\n2) Alert when the API returns >5% 5xx responses\n3) Search one business transaction's logs across 3 apps",
      options: [
        "1=Runtime Manager alert, 2=API Manager alert, 3=centralized logging searched by correlation ID",
        "1=API Manager alert, 2=Runtime Manager alert, 3=Anypoint Visualizer dependency graph",
        "1=Anypoint Monitoring, 2=Runtime Manager alert, 3=API Manager analytics per client",
        "1=Runtime Manager alert, 2=Anypoint Visualizer, 3=API Manager alert on response codes"
      ],
      answer: 0,
      optionNotes: [
        "Correct — worker/app health → Runtime Manager; API response-code/SLA alerts → API Manager; cross-app tracing → centralized logs keyed on the propagated correlation ID.",
        "That swaps the app-health and API-alert homes.",
        "The 5xx alert is API Manager, and cross-app tracing is by correlation ID, not per-client analytics.",
        "Visualizer shows topology; the 5xx alert is API Manager, not there."
      ],
      explanation: "Three distinct tools: Runtime Manager for application/worker health, API Manager for API-level (response time, error ratio, policy) alerts, and centralized logging searched by the propagated correlation ID to reconstruct one transaction across apps."
    },
    {
      id: "m2-142", section: "d4", level: "hard",
      q: "A high-throughput app misses its latency SLA; profiling blames synchronous file logging. The team switches to async loggers. Which follow-up is REQUIRED to stay correct?",
      options: [
        "Keep audit/compliance-critical loggers synchronous, because async buffers can be lost on a crash and ordering weakens",
        "Nothing further — async logging is strictly better, so all loggers including audit should be made asynchronous",
        "Disable the correlation ID in the pattern layout, since async loggers cannot populate the thread context map",
        "Move all logging to DEBUG level, because async loggers only improve throughput at DEBUG and below"
      ],
      answer: 0,
      optionNotes: [
        "Correct — async trades durability/ordering for throughput, so audit-critical logs must stay synchronous to avoid loss on a crash.",
        "Async isn't strictly better; buffered entries can be lost, which matters for audit.",
        "Async loggers still carry %X{correlationId}; no need to disable it.",
        "Log level is independent of the async/sync trade-off."
      ],
      explanation: "Async logging raises throughput and lowers latency but can lose buffered entries on a crash and relaxes strict ordering — so anything audit- or compliance-critical stays synchronous. That selective decision is the exam's async-logging nuance."
    },
    {
      id: "m2-143", section: "d4", level: "medium",
      q: "Operations needs a dashboard of 'orders processed per hour' and 'total order value' — business metrics, not CPU/memory. Which mechanism feeds these, and what would NOT work?",
      options: [
        "Custom Business Events (or structured log fields) attaching order id/value to the transaction; infra metrics like CPU can't measure order volume",
        "Runtime Manager CPU and memory alerts, which can be relabeled to represent order throughput on the dashboard",
        "Anypoint Visualizer, whose dependency graph counts the orders flowing between the connected APIs",
        "API Manager rate-limiting counters, since the number of throttled requests equals the number of orders"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Custom Business Events carry business KPIs (order id, amount) into Monitoring; technical metrics can't answer a business-volume question.",
        "CPU/memory are infrastructure signals unrelated to order counts.",
        "Visualizer shows topology, not business counts.",
        "Rate-limit counters measure throttling, not orders processed."
      ],
      explanation: "Business KPIs need business instrumentation: Custom Business Events (or structured log metrics) attach order id/value to transactions for Monitoring dashboards and alerts. Infrastructure metrics (CPU, memory, throttle counts) can't report order throughput."
    },
    {
      id: "m2-144", section: "d5", level: "hard",
      q: "Refer to the exhibit. What does this MUnit configuration accomplish, and what does it NOT verify?",
      exhibit: "<munit-tools:mock-when processor=\"http:request\">\n  <munit-tools:with-attributes>\n    <munit-tools:with-attribute attributeName=\"doc:name\" whereValue=\"Get customer\"/>\n  </munit-tools:with-attributes>\n  <munit-tools:then-return>\n    <munit-tools:payload value='#[{ id: 1, name: \"Ana\" }]'/>\n  </munit-tools:then-return>\n</munit-tools:mock-when>",
      options: [
        "It replaces the 'Get customer' HTTP Request with a canned customer, so the flow runs with no real call — but it doesn't assert the request was made or with what",
        "It asserts that the HTTP Request returned exactly this customer, failing the test if the real endpoint differs",
        "It verifies the 'Get customer' request was invoked once and captures its outbound headers for later assertions",
        "It spies on the HTTP Request, letting the real call run while recording the response for the validation block"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Mock When substitutes a canned response so no real call happens; verifying the call occurred needs a separate Verify Call.",
        "Mock When injects data; it doesn't assert against a real endpoint.",
        "Counting invocations is Verify Call, not Mock When.",
        "Mock When replaces the processor; Spy is what lets the real call run."
      ],
      explanation: "Mock When (then-return) replaces a processor with canned output for isolation — the real HTTP endpoint is never touched. To check the call happened (and how many times), you add Verify Call; to observe without replacing, Spy."
    },
    {
      id: "m2-145", section: "d5", level: "hard",
      q: "An MUnit test must drive getOrderFlow down its error-mapping branch by making the HTTP Request behave as if the remote returned 500. How is this done, and why not a real call?",
      options: [
        "Mock When on the http:request with Then throw raising HTTP:INTERNAL_SERVER_ERROR — deterministic, with no dependency on a live endpoint",
        "Point the HTTP Request at a URL known to return 500 and assert the mapped response, keeping the test realistic",
        "Wrap the test in On Error Continue so any real failure is caught and the error branch is exercised",
        "Set the flow's maxConcurrency to 0 so the request times out, which triggers the same error-mapping branch"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Mock When's Then throw raises the exact error type deterministically, with no live dependency, so the error path is tested reliably.",
        "Relying on a real 500 endpoint is flaky and non-deterministic.",
        "On Error Continue in the test doesn't drive the flow's own error mapping under test.",
        "maxConcurrency=0 isn't how you simulate a downstream 500."
      ],
      explanation: "Mock When with Then throw injects a specific error type (e.g. HTTP:INTERNAL_SERVER_ERROR) so error handlers and mappings are exercised deterministically, with no real endpoint — the standard way to unit-test error paths."
    },
    {
      id: "m2-146", section: "d5", level: "hard",
      q: "The same API implementation is deployed to dev, staging, and prod, and each environment must enforce its own policies and SLA tiers independently. What must be true in API Manager and the app?",
      options: [
        "One API instance per environment, each with its own api.id; the app pairs to the right instance via autodiscovery using an environment-specific property",
        "A single shared API instance across all environments, with policies toggled per environment by a deployment flag",
        "One API instance total, with the app choosing policies at runtime based on the Mule environment variable",
        "No API instance is needed — policies applied to the app's RAML travel with the deployable artifact per environment"
      ],
      answer: 0,
      optionNotes: [
        "Correct — governance hangs off the instance, so you need one instance per environment, each with its own api.id that the app matches via environment-specific autodiscovery.",
        "A shared instance can't hold independent per-environment policies/tiers.",
        "One instance total can't enforce different policies per environment.",
        "Policies live on the API instance in API Manager, not in the RAML/artifact."
      ],
      explanation: "Policies, SLA tiers, and contracts attach to an API instance. Independent per-environment enforcement means one instance per environment, each with its own api.id, paired to the running app through autodiscovery using an environment-specific api.id property."
    },
    {
      id: "m2-147", section: "d5", level: "medium",
      q: "A CI/CD pipeline promotes a Mule app from staging to production. Which artifact should be promoted unchanged, and what should differ between the two environments?",
      options: [
        "Promote the exact versioned JAR built and tested once; only externalized properties/secrets differ, injected at deploy time",
        "Rebuild the app from source for production with a prod Maven profile, so production-specific values are compiled in",
        "Promote the JAR but re-run MUnit against production data first, so the tests validate the live environment",
        "Promote a fresh JAR per environment and keep the same properties, since configuration must be identical across environments"
      ],
      answer: 0,
      optionNotes: [
        "Correct — build once, deploy many: promote the one tested artifact; environment differences live in externalized config/secrets applied at deploy.",
        "Rebuilding per environment risks shipping something different from what was tested.",
        "Running MUnit against production data isn't the promotion model; the tested artifact moves as-is.",
        "Config must differ per environment (URLs, keys); the artifact stays the same."
      ],
      explanation: "Build-once/deploy-many: the exact artifact that passed tests is promoted unchanged through environments, with only externalized properties and secrets varying at deploy time — rebuilding per environment breaks the guarantee that prod runs what was tested."
    }
  ]
};
