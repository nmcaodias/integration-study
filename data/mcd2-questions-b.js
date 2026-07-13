// MCD Level 2 question bank — Part B (domains 3–5)
window.CERT_DATA.mcd2.questions.push(
  // ---- Domain 3: Securing Data ----
  {
    id: "m2-037", section: "d3",
    q: "To expose an HTTPS endpoint, what must the HTTP Listener's TLS context contain at minimum?",
    options: ["A truststore with the client's certificates", "A keystore containing the server's private key and certificate", "Both a keystore and a truststore", "An OAuth client configuration"],
    answer: 1,
    explanation: "The server proves its identity with its keystore (private key + certificate). A truststore on the listener is only needed for two-way TLS, where the server also validates client certificates."
  },
  {
    id: "m2-038", section: "d3",
    q: "A Mule app calls an internal HTTPS service that uses a self-signed certificate, and the HTTP Request fails the TLS handshake. What is the correct fix?",
    options: ["Disable TLS validation in production", "Add the service's certificate to a truststore configured in the HTTP Request's TLS context", "Add a keystore to the HTTP Request", "Change the URL to http://"],
    answer: 1,
    explanation: "The client must trust the server's certificate. Since it isn't signed by a public CA, import it (or its CA) into a truststore referenced by the requester's TLS context. Disabling validation or dropping to HTTP sacrifices security."
  },
  {
    id: "m2-039", section: "d3",
    q: "What distinguishes two-way (mutual) TLS from one-way TLS?",
    options: ["Two-way TLS encrypts in both directions; one-way only encrypts responses", "In two-way TLS the client ALSO presents a certificate that the server validates against its truststore", "Two-way TLS requires OAuth", "One-way TLS does not use certificates"],
    answer: 1,
    explanation: "Both variants encrypt the channel in both directions. The difference is authentication: mutual TLS adds client certificate authentication — server configures a truststore and requires client auth; client configures a keystore."
  },
  {
    id: "m2-040", section: "d3",
    q: "How is an encrypted property referenced in a Mule configuration when using the Secure Configuration Properties module?",
    options: ["${db.password}", "${secure::db.password}", "#[secure(db.password)]", "${encrypted:db.password}"],
    answer: 1,
    explanation: "Secure properties use the secure:: prefix. The module decrypts them at runtime with the key supplied e.g. via -Dsecure.key, which must never be committed to source control."
  },
  {
    id: "m2-041", section: "d3",
    q: "Where should the encryption key for secure configuration properties be provided in production?",
    options: ["Hardcoded in the YAML file next to the encrypted values", "Committed in pom.xml", "Supplied at deployment time (e.g. a runtime property like secure.key set as a hidden/protected property or injected by CI/CD)", "Inside the DataWeave script that reads the property"],
    answer: 2,
    explanation: "The key must stay out of source control and out of the artifact. It is injected at deploy/run time — e.g. a protected property in Runtime Manager or a pipeline secret."
  },
  {
    id: "m2-042", section: "d3",
    q: "Which Mule module encrypts, decrypts, or signs message payloads (data at rest / end-to-end), as opposed to transport encryption?",
    options: ["TLS module", "Cryptography module (PGP, JCE, XML strategies)", "Validation module", "Secure Properties module"],
    answer: 1,
    explanation: "The Cryptography module operates on payloads inside flows — PGP/JCE/XML encryption and signing. TLS protects the transport; secure properties protect configuration values."
  },
  {
    id: "m2-043", section: "d3",
    q: "What is the main advantage of a JWT validation policy over an OAuth token introspection call for each request?",
    options: ["JWTs never expire", "The JWT's signature and claims can be verified locally (e.g. against a JWKS), avoiding a round trip to the authorization server per request", "JWT validation does not require any configuration", "JWTs are encrypted by default"],
    answer: 1,
    explanation: "Signed JWTs are self-contained: the gateway verifies signature, expiry, and claims locally using the issuer's keys, reducing latency and dependency on the auth server. Introspection requires a call per token check."
  },
  {
    id: "m2-044", section: "d3",
    q: "An API must ensure that only registered consumer applications can call it, identified per consumer for rate limiting. Which policy combination is the baseline?",
    options: ["CORS only", "Client ID enforcement (or OAuth), optionally with SLA-based rate limiting tiers", "IP allowlist only", "Header injection policy"],
    answer: 1,
    explanation: "Client ID enforcement (or OAuth 2.0 token enforcement) identifies the consumer application, enabling contracts and per-tier SLA rate limits. IP lists don't identify applications reliably."
  },
  {
    id: "m2-045", section: "d3",
    q: "Which tool creates and manages the keystores and truststores used in Mule TLS contexts?",
    options: ["keytool (JKS/PKCS12 keystores)", "mvn tls:generate", "Anypoint CLI only", "OpenSSH"],
    answer: 0,
    explanation: "The JDK keytool utility generates key pairs, imports certificates, and manages JKS/PKCS12 stores referenced by Mule TLS contexts. (OpenSSL is also common for cert generation/conversion.)"
  },
  {
    id: "m2-046", section: "d3",
    q: "In mule-artifact.json, what is the effect of listing a property name under 'secureProperties'?",
    options: ["The property is encrypted automatically", "Its value is masked/hidden in Runtime Manager and logs instead of being displayed in plain text", "The property becomes read-only", "The property is removed from the artifact"],
    answer: 1,
    explanation: "secureProperties marks properties as sensitive so platform UIs and APIs never display their values. Encryption of stored values is a separate concern (Secure Configuration Properties)."
  },
  {
    id: "m2-047", section: "d3",
    q: "A security review requires that credentials in property files be unreadable in Git AND that TLS be used to the database's REST gateway. Which pair of measures satisfies this?",
    options: ["Base64-encode passwords and use HTTP", "Encrypt property values with the Secure Configuration Properties module and configure a TLS context (truststore) on the outbound HTTP requester", "Store passwords in flow variables and enable CORS", "Use a custom header to carry the password"],
    answer: 1,
    explanation: "Base64 is encoding, not encryption. Proper controls: encrypted secure properties for data at rest in config, and TLS with certificate validation for data in transit."
  },
  {
    id: "m2-048", section: "d3",
    q: "Which statement correctly describes keystore vs truststore usage?",
    options: ["Keystore: certificates you trust; truststore: your private keys", "Keystore: your own identity (private key + certificate); truststore: certificates of parties you trust", "They are interchangeable names for the same file", "Truststores are only used on servers"],
    answer: 1,
    explanation: "Keystore = prove who YOU are. Truststore = decide who you BELIEVE. A file format (JKS/PKCS12) can serve either role; the role depends on how it is referenced in the TLS context."
  },
  {
    id: "m2-049", section: "d3",
    q: "The same API is deployed to dev and prod. Security requires different certificates and encryption keys per environment. What is the recommended setup?",
    options: ["One shared certificate and key for simplicity", "Environment-specific keystores/truststores and secure-property keys, referenced through externalized properties selected at deploy time", "Certificates stored in Exchange", "TLS only in production; HTTP in dev"],
    answer: 1,
    explanation: "Externalize keystore paths, passwords, and secure keys as (secure) properties per environment. Sharing prod secrets with dev violates least privilege; skipping TLS in dev hides configuration issues until production."
  },
  {
    id: "m2-050", section: "d3",
    q: "An OAuth 2.0 access token enforcement policy is applied to an API. What does a request need to succeed?",
    options: ["A client_id query parameter only", "A valid access token (e.g. Authorization: Bearer <token>) issued by the configured authorization provider, with any required scopes", "A username and password in the body", "An encrypted payload"],
    answer: 1,
    explanation: "The policy validates the presented access token against the configured provider (and optionally required scopes); requests without a valid token get 401/403."
  },

  // ---- Domain 4: Monitorable Apps ----
  {
    id: "m2-051", section: "d4",
    q: "Where is logging configured for an individual Mule 4 application?",
    options: ["In mule-artifact.json", "In src/main/resources/log4j2.xml", "In the flow's XML attributes", "In Runtime Manager only"],
    answer: 1,
    explanation: "Each app carries its own Log4j 2 configuration at src/main/resources/log4j2.xml — appenders, log levels per category, and patterns. (On CloudHub, using it fully may require enabling custom log4j.)"
  },
  {
    id: "m2-052", section: "d4",
    q: "What is the trade-off of asynchronous logging compared to synchronous logging?",
    options: ["Async logging is slower but ordered", "Async improves application throughput (logging doesn't block processing) but risks losing buffered entries on a crash and may interleave ordering", "Async logging encrypts logs", "There is no difference"],
    answer: 1,
    explanation: "Async appenders/loggers decouple I/O from event processing — better performance, but buffered messages can be lost if the JVM dies, and strict ordering guarantees weaken."
  },
  {
    id: "m2-053", section: "d4",
    q: "Why is the correlation ID essential in a distributed application network?",
    options: ["It encrypts the message between apps", "It is generated (or propagated via headers like X-Correlation-ID) and logged by every app, letting one business transaction be traced end-to-end across applications", "It identifies the CloudHub worker region", "It replaces authentication tokens"],
    answer: 1,
    explanation: "Each event carries a correlationId that propagates across HTTP calls between Mule apps and appears in default log patterns — search it in centralized logs to reconstruct the full journey of one transaction."
  },
  {
    id: "m2-054", section: "d4",
    q: "A team must be notified when an API's average response time exceeds 2 seconds or when a policy violation occurs. Where are such alerts configured?",
    options: ["In the application's log4j2.xml", "API alerts in API Manager (and/or metric alerts in Anypoint Monitoring)", "In Exchange", "In the RAML specification"],
    answer: 1,
    explanation: "API Manager provides API-level alerts (response time, policy violations, request counts, error codes). Anypoint Monitoring adds metric-threshold alerts and dashboards. log4j only writes logs."
  },
  {
    id: "m2-055", section: "d4",
    q: "Which Runtime Manager alert conditions are typical for operational monitoring of a CloudHub application?",
    options: ["DataWeave syntax errors", "Application down / worker not responding / deployment failed", "RAML validation failures", "Exchange asset downloads"],
    answer: 1,
    explanation: "Runtime Manager alerts cover infrastructure/application lifecycle events: app stopped or down, worker unresponsive, deployment success/failure, and custom application notifications."
  },
  {
    id: "m2-056", section: "d4",
    q: "What is the purpose of the Custom Business Event component?",
    options: ["To raise Mule errors with custom types", "To publish named business milestones with metadata (e.g. 'OrderPlaced', order ID) that are visible in Anypoint Monitoring for business-level tracking", "To send emails to stakeholders", "To create Exchange documentation"],
    answer: 1,
    explanation: "Custom Business Events add business KPIs to monitoring — tracking meaningful milestones and key/value metadata, distinct from technical logs and metrics."
  },
  {
    id: "m2-057", section: "d4",
    q: "Logs from all applications must be searchable in one place, including on CloudHub. Which approaches achieve centralized logging? (best answer)",
    options: ["Read each worker's console individually", "Use Anypoint Monitoring log management, or ship logs via custom Log4j appenders to an external system (ELK, Splunk)", "Store logs in flow variables", "Print logs to the payload"],
    answer: 1,
    explanation: "Centralize either inside the platform (Anypoint Monitoring / Titanium log search) or externally by adding appenders (HTTP, Socket, Splunk...) to each app's log4j2.xml."
  },
  {
    id: "m2-058", section: "d4",
    q: "A Logger component should write order IDs at a category 'com.acme.orders' shown at DEBUG only in dev. How is this achieved?",
    options: ["It cannot be done in Mule 4", "Set the Logger's category to com.acme.orders and configure that category's level (DEBUG in dev, INFO+ in prod) in log4j2.xml per environment", "Use System.out.println in DataWeave", "Change the root logger to TRACE everywhere"],
    answer: 1,
    explanation: "Custom categories on Logger components plus per-category levels in log4j2.xml give fine-grained control, keeping production logs quiet without touching flow logic."
  },
  {
    id: "m2-059", section: "d4",
    q: "What does API Functional Monitoring provide?",
    options: ["Unit test coverage reports", "Scheduled black-box tests that call API endpoints from various locations and validate responses, alerting on failures", "Java profiler dumps", "Automatic API documentation"],
    answer: 1,
    explanation: "Functional monitoring (Blackbox/BAT) exercises live endpoints on a schedule, asserting on status/behavior — catching outages and regressions from the consumer's perspective."
  },
  {
    id: "m2-060", section: "d4",
    q: "Which practice should be AVOIDED when logging in production integrations?",
    options: ["Logging at flow boundaries with correlation IDs", "Structured JSON log messages", "Logging entire sensitive payloads (PII, credentials) at INFO level", "Using log categories per functional area"],
    answer: 2,
    explanation: "Full payload logging leaks sensitive data and bloats storage. Log identifiers and context, mask sensitive fields, and reserve payload dumps for guarded DEBUG scenarios."
  },

  // ---- Domain 5: Production-Ready APIs & Testing ----
  {
    id: "m2-061", section: "d5",
    q: "What are the three blocks of an MUnit test?",
    options: ["Setup, Run, Report", "Behavior (arrange/mocks), Execution (act), Validation (assert)", "Given, Then, Finally", "Mock, Spy, Verify"],
    answer: 1,
    explanation: "An MUnit test is structured as Behavior → Execution → Validation: prepare input and mocks, invoke the flow under test, then assert on the results."
  },
  {
    id: "m2-062", section: "d5",
    q: "A test must run a flow WITHOUT calling the real database. Which MUnit component replaces the Database Select operation with a canned response?",
    options: ["Spy", "Mock When", "Assert That", "Verify Call"],
    answer: 1,
    explanation: "Mock When matches a processor (by name/attributes) and returns the configured payload/attributes/error instead of executing it. Spy observes without replacing; Verify Call counts invocations."
  },
  {
    id: "m2-063", section: "d5",
    q: "What does the MUnit Spy processor do?",
    options: ["Replaces a processor with a stub", "Asserts on the Mule event immediately before and/or after a specific processor executes, without replacing it", "Records test execution time", "Captures HTTP traffic"],
    answer: 1,
    explanation: "Spy wraps a real processor with before-call and after-call assertions — the processor still executes normally."
  },
  {
    id: "m2-064", section: "d5",
    q: "How can a team enforce that builds fail when MUnit test coverage drops below 80%?",
    options: ["Manual code review only", "Configure the munit-maven-plugin coverage section with requiredApplicationCoverage 80 and failBuild true", "Set a property in mule-artifact.json", "Coverage cannot fail a build"],
    answer: 1,
    explanation: "The munit-maven-plugin computes coverage (application/resource/flow levels) and can fail the Maven build below thresholds — a standard CI quality gate."
  },
  {
    id: "m2-065", section: "d5",
    q: "Which MUnit assertion checks that the payload equals a specific value using MUnit matchers?",
    options: ["<assert-true expression=\"payload\"/>", "Assert That with expression #[payload] and 'is' #[MunitTools::equalTo('expected')]", "Verify Call with times 1", "Spy with a Logger"],
    answer: 1,
    explanation: "Assert That evaluates an expression against a matcher from MunitTools (equalTo, notNullValue, hasSize...). Verify Call and Spy serve different purposes."
  },
  {
    id: "m2-066", section: "d5",
    q: "A test suite needs test data loaded once before ALL tests and cleaned afterwards. Which MUnit scopes apply?",
    options: ["Before Test / After Test", "Before Suite / After Suite", "Setup / Teardown flows in the main app", "On Error Continue"],
    answer: 1,
    explanation: "Before/After Suite run once per suite; Before/After Test run around every individual test. Choose suite scopes for one-time setup."
  },
  {
    id: "m2-067", section: "d5",
    q: "How does an MUnit test simulate an error from a mocked connector operation (e.g. HTTP:CONNECTIVITY) to test error handling?",
    options: ["It cannot; errors require real systems", "Configure the Mock When to 'Then throw' an error with the desired typeId (e.g. HTTP:CONNECTIVITY)", "Stop the network adapter during the test", "Use Assert That with an error matcher only"],
    answer: 1,
    explanation: "Mock When can return an error instead of a payload, letting tests drive error handlers deterministically without real failures."
  },
  {
    id: "m2-068", section: "d5",
    q: "Each environment (dev, staging, prod) should enforce policies independently for the same API implementation. What is required in API Manager?",
    options: ["One API instance shared by all environments", "A separate API instance per environment, each with its own API ID paired to the deployed app via autodiscovery", "Policies configured in the RAML", "A CloudHub VPC"],
    answer: 1,
    explanation: "API instances are environment-scoped. The app's autodiscovery api id must match the instance of ITS environment — typically externalized as a property per environment."
  },
  {
    id: "m2-069", section: "d5",
    q: "What is the recommended way to make an API consumable and self-service for other teams once it is production-ready?",
    options: ["Send the WSDL by email", "Publish the spec to Exchange with documentation pages and examples, enable the mocking service, and require access requests (contracts) through Exchange", "Give consumers the implementation source code", "Share the raw CloudHub URL in a wiki"],
    answer: 1,
    explanation: "Exchange is the discovery and self-service surface: documentation, try-it console/mocking, and managed access requests tied to API Manager contracts and SLA tiers."
  },
  {
    id: "m2-070", section: "d5",
    q: "A CI/CD pipeline should promote the SAME tested artifact from staging to production. Which practices support this? (best answer)",
    options: ["Rebuild the project from source for each environment", "Build once, store the versioned artifact (repository/Exchange), deploy the identical JAR per environment with externalized configuration, and gate promotion on MUnit results", "Deploy from developer laptops", "Skip tests in production deployments to save time"],
    answer: 1,
    explanation: "Build-once/deploy-many guarantees what was tested is what ships. Configuration differences are supplied at deploy time; quality gates (tests, coverage) run before promotion."
  },
  {
    id: "m2-071", section: "d5",
    q: "Which statement about MUnit test placement and execution is correct?",
    options: ["Tests live in src/main/mule and deploy with the app", "Tests live in src/test/munit, run in the Maven test phase, and are NOT packaged into the deployable application", "Tests must be written in Java", "Tests run inside API Manager"],
    answer: 1,
    explanation: "MUnit suites are test resources: executed at build time (Studio or mvn test) and excluded from the production JAR."
  },
  {
    id: "m2-072", section: "d5",
    q: "An old API version must be phased out. Which sequence follows recommended practice?",
    options: ["Delete the API instance immediately after v2 goes live", "Mark the old version deprecated in Exchange/API Manager, block new access requests, notify existing consumers with a sunset date, then retire it after the window", "Redirect old traffic to v2 silently", "Remove its documentation but keep it running forever"],
    answer: 1,
    explanation: "Graceful deprecation: signal it (deprecated status), stop new adoption, give consumers a migration window with clear communication, and only then decommission."
  }
);
