/* MCD2 · hands-on exercises (part 2: d3 security, d4 monitoring, d5 testing). */
module.exports = {
  addExercises: [
    {
      id: "m2-ex-07",
      section: "d3",
      title: "Encrypt secrets with the Secure Properties module",
      level: "medium",
      where: "Anypoint Studio (Secure Properties Tool)",
      task: "<p>A properties file holds a plaintext database password committed to Git. Move it to <strong>encrypted secure properties</strong> so the artifact is safe to share, with the decryption key supplied at deploy time (never in the repo).</p>",
      given: [
        { label: "config.yaml (before)", code: "db:\n  user: app\n  password: S3cr3tP@ss   # plaintext, in Git — must be fixed" }
      ],
      steps: [
        "Encrypt the value with the Secure Properties Tool (algorithm Blowfish/AES) to get an ![...] ciphertext",
        "Store the ciphertext in config.yaml and reference it via a Secure Configuration Properties element",
        "Read the value in the app with ${secure::db.password}",
        "Supply the key ONLY at deploy time via -Dsecure.key=... (or a hidden platform property), never committed"
      ],
      solution: [
        { label: "config.yaml (after)", code: "db:\n  user: app\n  password: \"![qW8v...ciphertext...==]\"" },
        { label: "app.xml + run", code: "<secure-properties:config name=\"Secure_Props\"\n    file=\"config.yaml\" key=\"${secure.key}\">\n  <secure-properties:encrypt algorithm=\"Blowfish\" mode=\"CBC\"/>\n</secure-properties:config>\n\n<db:config ...><db:my-connection password=\"${secure::db.password}\"/></db:config>\n\n<!-- deploy:  -Dsecure.key=THEKEY   (or a hidden CloudHub property) -->" }
      ],
      solutionNotes: "<p>The whole point of encrypting properties is defeated if the <strong>key</strong> travels with the artifact (or in the same repo). The <code>![...]</code> ciphertext is safe to commit; the key is supplied out-of-band — a startup argument, CI/CD secret, or platform property marked hidden. Reference encrypted values with the <code>secure::</code> prefix. A common failure to recognize: <code>Could not resolve placeholder secure::db.password</code> means the key/config wasn't provided.</p>"
    },
    {
      id: "m2-ex-08",
      section: "d3",
      title: "Configure two-way TLS for a partner mutual-auth API",
      level: "hard",
      where: "Anypoint Studio",
      task: "<p>An HTTP Request to a partner API fails the TLS handshake with <code>Received fatal alert: certificate_required</code>. The partner enforces <strong>mutual TLS</strong>. Configure a TLS context so your app presents a client certificate <em>and</em> trusts the partner's CA.</p>",
      given: [
        { label: "Given", code: "- keystore.jks : your client key + cert (present to the partner)\n- truststore.jks : the partner's CA cert (to validate their server)\n- Current config has NO tls:context on the requester" }
      ],
      steps: [
        "Add a tls:context to the HTTP Request config",
        "Configure tls:key-store (your identity) so the app can present a client certificate",
        "Configure tls:trust-store (the partner's CA) so the app validates the partner's server cert",
        "Re-run and confirm the handshake completes"
      ],
      solution: [
        { label: "HTTP Request config with mTLS", code: "<http:request-config name=\"Partner\">\n  <http:request-connection host=\"partner.example.com\" port=\"443\" protocol=\"HTTPS\">\n    <tls:context>\n      <tls:key-store type=\"jks\" path=\"keystore.jks\"\n                     keyPassword=\"${secure::ks.key}\" password=\"${secure::ks.pass}\"/>\n      <tls:trust-store type=\"jks\" path=\"truststore.jks\"\n                       password=\"${secure::ts.pass}\"/>\n    </tls:context>\n  </http:request-connection>\n</http:request-config>" }
      ],
      solutionNotes: "<p>Mutual TLS needs both halves: the <strong>key-store</strong> holds your identity (the client cert you present — its absence caused <code>certificate_required</code>), and the <strong>trust-store</strong> holds the CA you use to validate the partner's server. One-way TLS configures only the trust-store. Note the passwords themselves are pulled from secure properties, tying this exercise back to secrets management.</p>"
    },
    {
      id: "m2-ex-09",
      section: "d4",
      title: "Structured logging: async loggers, levels, and a JSON layout",
      level: "medium",
      where: "Anypoint Studio (log4j2.xml)",
      task: "<p>Tune an app's <code>log4j2.xml</code>: make application logs <strong>async</strong> for throughput, quiet the runtime to WARN, keep your package at INFO, and emit a layout that includes the <strong>correlation ID</strong> so one transaction can be traced across apps.</p>",
      given: [
        { label: "Requirements", code: "- com.acme.orders  -> INFO, asynchronous\n- org.mule.runtime -> WARN\n- every log line must include the correlationId\n- audit logger com.acme.audit must stay SYNCHRONOUS (no loss on crash)" }
      ],
      steps: [
        "Use AsyncLogger for com.acme.orders and a plain Logger for com.acme.audit",
        "Set org.mule.runtime to WARN",
        "Add %X{correlationId} to the PatternLayout (or use a JSON layout)",
        "Explain the async trade-off you are accepting"
      ],
      solution: [
        { label: "log4j2.xml (essential parts)", code: "<Appenders>\n  <RollingFile name=\"file\" fileName=\"app.log\" ...>\n    <PatternLayout pattern=\"%d %-5p [%X{correlationId}] %c{1} - %m%n\"/>\n  </RollingFile>\n</Appenders>\n<Loggers>\n  <AsyncLogger name=\"com.acme.orders\" level=\"INFO\"/>\n  <Logger name=\"com.acme.audit\" level=\"INFO\" additivity=\"false\">\n    <AppenderRef ref=\"file\"/>\n  </Logger>\n  <AsyncLogger name=\"org.mule.runtime\" level=\"WARN\"/>\n  <Root level=\"INFO\"><AppenderRef ref=\"file\"/></Root>\n</Loggers>" }
      ],
      solutionNotes: "<p><code>%X{correlationId}</code> pulls Mule's correlation ID from the thread context so a single search returns a transaction's lines across apps (Mule propagates it via the X-Correlation-ID header). <strong>Async</strong> loggers raise throughput and lower latency, but buffered entries can be lost on a crash and strict ordering weakens — so audit-critical logs stay <strong>synchronous</strong>. That selective-sync decision is the exam's favourite async-logging nuance.</p>"
    },
    {
      id: "m2-ex-10",
      section: "d4",
      title: "Emit a business-level metric with Custom Business Events",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>Operations wants to alert when fewer than 100 orders/hour flow through the platform — a <strong>business</strong> signal, independent of CPU/HTTP health. Instrument the order flow so this can be tracked and alerted in Anypoint Monitoring.</p>",
      given: [
        { label: "Given", code: "- The order flow processes each order and knows payload.orderId and payload.amount\n- Alert target: orders-per-hour and total order value" }
      ],
      steps: [
        "Add a Custom Business Event (tracking:transaction) to the order flow",
        "Attach tracking metadata: the orderId (KPI identifier) and amount (a numeric tracking value)",
        "Explain where this surfaces (Anypoint Monitoring business events / custom dashboards) vs. infra metrics",
        "Note what would NOT work: a CPU alert says nothing about order volume"
      ],
      solution: [
        { label: "Flow fragment", code: "<flow name=\"process-order\">\n  ...\n  <tracking:transaction name=\"OrderProcessed\">\n    <tracking:meta-data key=\"orderId\" value=\"#[payload.orderId]\"/>\n    <tracking:meta-data key=\"amount\"  value=\"#[payload.amount]\"/>\n  </tracking:transaction>\n</flow>" }
      ],
      solutionNotes: "<p>Custom Business Events attach business KPIs (order id, value) to a transaction so they surface in Anypoint Monitoring dashboards and alerts — the right tool when the requirement is about <em>business</em> throughput, not technical health. Infrastructure metrics (CPU, memory, HTTP 5xx) cannot answer 'are enough orders flowing?'. Recognizing that gap is exactly what the monitoring objective tests.</p>"
    },
    {
      id: "m2-ex-11",
      section: "d5",
      title: "Write an MUnit test with Mock When and Assert That",
      level: "medium",
      where: "Anypoint Studio (MUnit)",
      task: "<p>Unit-test <code>getFlightsFlow</code> without a real database. Mock the <code>db:select</code> to return two canned rows, run the flow, and assert the response has size 2 — all with no broker or DB.</p>",
      given: [
        { label: "Flow under test", code: "<flow name=\"getFlightsFlow\">\n  <http:listener path=\"/flights\"/>\n  <db:select doc:name=\"Select flights\" config-ref=\"DB\">\n    <db:sql>SELECT code FROM flights</db:sql>\n  </db:select>\n</flow>" }
      ],
      steps: [
        "Create a suite under src/test/munit",
        "Behavior: mock-when the db:select (matched by doc:name) to then-return a 2-element payload",
        "Execution: flow-ref getFlightsFlow",
        "Validation: assert-that sizeOf(payload) equalTo 2"
      ],
      solution: [
        { label: "getFlights-test.xml", code: "<munit:test name=\"getFlights-returns-200\">\n  <munit:behavior>\n    <munit-tools:mock-when processor=\"db:select\">\n      <munit-tools:with-attributes>\n        <munit-tools:with-attribute attributeName=\"doc:name\" whereValue=\"Select flights\"/>\n      </munit-tools:with-attributes>\n      <munit-tools:then-return>\n        <munit-tools:payload value='#[[{code:\"ER38sd\"},{code:\"ER45if\"}]]'/>\n      </munit-tools:then-return>\n    </munit-tools:mock-when>\n  </munit:behavior>\n  <munit:execution>\n    <flow-ref name=\"getFlightsFlow\"/>\n  </munit:execution>\n  <munit:validation>\n    <munit-tools:assert-that expression=\"#[sizeOf(payload)]\"\n        is=\"#[MunitTools::equalTo(2)]\"/>\n  </munit:validation>\n</munit:test>" }
      ],
      solutionNotes: "<p>The MUnit shape is Behavior → Execution → Validation (arrange/mock → act → assert). <strong>Mock When</strong> replaces a processor matched by name/attributes with a canned result, so the DB never runs; <strong>Assert That</strong> checks an expression against a <code>MunitTools</code> matcher. To drive an error path instead, Mock When's <em>then-throw</em> raises a typed error (e.g. <code>DB:CONNECTIVITY</code>) deterministically.</p>"
    },
    {
      id: "m2-ex-12",
      section: "d5",
      title: "Verify interactions with Spy and Verify Call",
      level: "hard",
      where: "Anypoint Studio (MUnit)",
      task: "<p>A flow should call the audit logger <strong>exactly once</strong> and must enrich the event before the HTTP request runs. Write MUnit assertions that (a) <strong>verify</strong> the audit processor was called once, and (b) <strong>spy</strong> the event just before the HTTP Request to assert a header was set — without replacing either processor.</p>",
      given: [
        { label: "Flow under test", code: "<flow name=\"submit\">\n  <flow-ref name=\"audit\" doc:name=\"Audit\"/>\n  <set-variable variableName=\"traceId\" value=\"#[uuid()]\"/>\n  <http:request doc:name=\"Send\" .../>\n</flow>" }
      ],
      steps: [
        "Verify Call: assert the 'Audit' flow-ref was invoked times=1",
        "Spy the 'Send' HTTP Request: in the before-block assert vars.traceId is not null",
        "Note the distinction: Mock replaces, Spy observes without replacing, Verify counts"
      ],
      solution: [
        { label: "submit-test.xml (assertions)", code: "<munit:validation>\n  <munit-tools:verify-call processor=\"flow-ref\" times=\"1\">\n    <munit-tools:with-attributes>\n      <munit-tools:with-attribute attributeName=\"doc:name\" whereValue=\"Audit\"/>\n    </munit-tools:with-attributes>\n  </munit-tools:verify-call>\n</munit:validation>\n\n<munit-tools:spy processor=\"http:request\">\n  <munit-tools:with-attributes>\n    <munit-tools:with-attribute attributeName=\"doc:name\" whereValue=\"Send\"/>\n  </munit-tools:with-attributes>\n  <munit-tools:before-call>\n    <munit-tools:assert-that expression=\"#[vars.traceId]\"\n        is=\"#[MunitTools::notNullValue()]\"/>\n  </munit-tools:before-call>\n</munit-tools:spy>" }
      ],
      solutionNotes: "<p>The most-tested MUnit distinction: <strong>Mock When</strong> replaces a processor; <strong>Spy</strong> observes the event immediately before/after a processor that still runs; <strong>Verify Call</strong> asserts how many times a processor executed (times/atLeast/atMost). Here Verify proves the audit call happened once, and Spy checks state at a point in the flow without altering behaviour.</p>"
    },
    {
      id: "m2-ex-13",
      section: "d5",
      title: "Gate the build on MUnit coverage",
      level: "medium",
      where: "Any editor / Maven",
      task: "<p>CI must <strong>fail the build</strong> when MUnit coverage drops below thresholds. Configure the munit-maven-plugin so coverage runs, enforces 80% application / 70% resource / 60% flow coverage, and breaks <code>mvn test</code> when unmet.</p>",
      given: [
        { label: "Given", code: "- Tests live in src/test/munit and pass\n- Pipeline runs 'mvn clean test'\n- Requirement: fail the build below the thresholds above" }
      ],
      steps: [
        "Add the coverage block to the munit-maven-plugin configuration",
        "Set runCoverage=true and failBuild=true",
        "Set requiredApplicationCoverage / requiredResourceCoverage / requiredFlowCoverage",
        "Confirm mvn test fails when a flow is under-covered"
      ],
      solution: [
        { label: "pom.xml (munit-maven-plugin)", code: "<plugin>\n  <groupId>com.mulesoft.munit.tools</groupId>\n  <artifactId>munit-maven-plugin</artifactId>\n  <configuration>\n    <coverage>\n      <runCoverage>true</runCoverage>\n      <failBuild>true</failBuild>\n      <requiredApplicationCoverage>80</requiredApplicationCoverage>\n      <requiredResourceCoverage>70</requiredResourceCoverage>\n      <requiredFlowCoverage>60</requiredFlowCoverage>\n      <formats><format>html</format><format>json</format></formats>\n    </coverage>\n  </configuration>\n</plugin>" }
      ],
      solutionNotes: "<p>MUnit binds to the Maven <strong>test</strong> phase; the coverage block with <code>failBuild=true</code> turns coverage into a CI quality gate — the build breaks below the application/resource/flow thresholds. Tests are excluded from the deployable JAR. The typical pipeline is <code>mvn clean package</code> (compile + MUnit + coverage) → publish → <code>mvn deploy -DmuleDeploy</code> per environment, promoting the same artifact.</p>"
    }
  ]
};
