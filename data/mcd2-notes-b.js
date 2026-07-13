// MCD Level 2 — expanded study notes, domains 4–5 (based on docs.mulesoft.com)
window.CERT_DATA.mcd2.sections.push(
  {
    id: "d4",
    title: "Building Monitorable Mule Applications",
    weight: 15,
    objectives: [
      "Configure application logging with Log4j 2 (levels, categories, appenders, async logging)",
      "Write effective, structured log messages with correlation IDs",
      "Use Anypoint Monitoring: built-in and custom dashboards, log search, alerts",
      "Create alerts in Runtime Manager and API Manager (e.g. response time, policy violations)",
      "Track business events and use the Custom Business Event component",
      "Expose application health for external monitoring"
    ],
    notes: `
<h3>Log4j 2 configuration</h3>
<p>Each app owns <code>src/main/resources/log4j2.xml</code>: <strong>appenders</strong> (where logs go) and <strong>loggers</strong> (which categories log at which level).</p>
<pre><code>&lt;Configuration&gt;
  &lt;Appenders&gt;
    &lt;RollingFile name="file" fileName="\${sys:mule.home}/logs/orders-api.log" ...&gt;
      &lt;PatternLayout pattern="%d [%t] %-5p %c - %m%n"/&gt;
    &lt;/RollingFile&gt;
    &lt;!-- ship to an external system: Http, Socket, or a Splunk/ELK appender --&gt;
  &lt;/Appenders&gt;
  &lt;Loggers&gt;
    &lt;AsyncLogger name="com.acme.orders" level="DEBUG"/&gt;   &lt;!-- your categories --&gt;
    &lt;AsyncLogger name="org.mule.runtime.core.internal.processor.LoggerMessageProcessor"
                 level="INFO"/&gt;                            &lt;!-- Logger component output --&gt;
    &lt;AsyncRoot level="INFO"&gt;&lt;AppenderRef ref="file"/&gt;&lt;/AsyncRoot&gt;
  &lt;/Loggers&gt;
&lt;/Configuration&gt;</code></pre>
<ul>
<li><strong>Levels</strong>: ERROR &gt; WARN &gt; INFO &gt; DEBUG &gt; TRACE — a category set to INFO suppresses its DEBUG/TRACE. Tune noisy third-party categories down, your own up, without touching flows.</li>
<li><strong>Sync vs async</strong>: async loggers/appenders don't block event processing → higher throughput, but buffered entries can be lost on a crash and strict ordering weakens. Synchronous logging is the safe-but-slower choice for audit-critical logs.</li>
<li><strong>Logger component</strong>: message (DataWeave), level, and <strong>category</strong> (e.g. <code>com.acme.orders.payment</code>) — always set meaningful categories so operators can filter/level them per environment.</li>
<li><strong>CloudHub:</strong> the platform captures stdout logs with retention limits; to use custom appenders/external log systems, <em>disable CloudHub logs</em> for the app (checkbox in Runtime Manager, subject to org permissions) and ship via your appender. On CloudHub 2.0/RTF, sidecars/log forwarding fill this role.</li>
</ul>

<h3>Correlation and structure</h3>
<ul>
<li>Every event has a <strong>correlationId</strong>, printed by default log patterns. It <strong>propagates across apps</strong> via the <code>X-Correlation-ID</code> HTTP header (HTTP connector sends/reads it automatically) — search it in centralized logs to trace one business transaction end-to-end through the application network.</li>
<li>Prefer <strong>structured (JSON) log messages</strong> with stable fields (event, orderId, status) — machines parse them, dashboards aggregate them. Log at boundaries: received / calling X / completed / failed. <strong>Never log credentials or full sensitive payloads</strong>; mask PII.</li>
</ul>

<h3>Anypoint Monitoring</h3>
<table>
<tr><th>Capability</th><th>What you get</th></tr>
<tr><td>Built-in dashboards</td><td>Per-app metrics out of the box: request volume, response times, error rates, CPU/memory, connector performance</td></tr>
<tr><td>Custom dashboards</td><td>Compose charts over any collected metrics (per app, API, or business metric)</td></tr>
<tr><td>Log management</td><td>Centralized log search across apps; longer retention and advanced features with the <strong>Titanium</strong> subscription</td></tr>
<tr><td>Alerts</td><td>Threshold alerts on metrics (e.g. avg response time &gt; 2s for 5 min, error ratio &gt; 5%)</td></tr>
<tr><td>Functional monitoring (BAT)</td><td>Scheduled <em>black-box tests</em> that call endpoints (from public/private locations) and assert on responses — uptime and behavior from the consumer's perspective</td></tr>
</table>
<p><strong>Anypoint Visualizer</strong> renders the real application network graph (who calls whom) from traffic data — useful for impact analysis and architecture reviews.</p>

<h3>Alerts in Runtime Manager vs API Manager</h3>
<table>
<tr><th>Runtime Manager (operational)</th><th>API Manager (API-level)</th></tr>
<tr><td>Application down / not responding</td><td>Policy violation (e.g. rate-limit exceeded)</td></tr>
<tr><td>Worker not responding / restarted</td><td>Request count threshold</td></tr>
<tr><td>Deployment success/failure</td><td>Response time threshold</td></tr>
<tr><td>Custom application notifications</td><td>Response codes (4xx/5xx ratios)</td></tr>
</table>
<p>Alert channels: email to platform users/arbitrary addresses; alerts have severity and can be scoped per app/API instance and environment.</p>

<h3>Business-level tracking</h3>
<ul>
<li><strong>Custom Business Event</strong> component: publishes a named milestone (e.g. "OrderPlaced") with key/value metadata (order id, amount) — visible in monitoring/analytics, independent of technical logs. Default flow/event tracking can also be enabled per flow ("transaction id" for business correlation).</li>
<li>Health for external monitors: expose a lightweight <code>/health</code> (or use API Functional Monitoring) returning dependency status — load balancers and uptime checks probe it.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> know WHERE each thing is configured — app logging: log4j2.xml; app down alert: Runtime Manager; policy-violation alert: API Manager; cross-app log search: Anypoint Monitoring (Titanium for long retention); tracing one transaction across apps: correlation ID via X-Correlation-ID.</p>`
  },
  {
    id: "d5",
    title: "Production-Ready APIs and Automated Testing",
    weight: 13,
    objectives: [
      "Test applications with MUnit: test suites, asserts, mocks, spies",
      "Set MUnit coverage requirements and run tests in a Maven build",
      "Prepare APIs for production: autodiscovery, policies, contracts",
      "Implement API versioning and deprecation strategies",
      "Integrate builds and deployments into CI/CD pipelines",
      "Govern APIs with Exchange documentation and API instances per environment"
    ],
    notes: `
<h3>MUnit test structure</h3>
<p>Suites are XML files in <code>src/test/munit</code>; each test has three blocks — <strong>Behavior</strong> (arrange), <strong>Execution</strong> (act), <strong>Validation</strong> (assert):</p>
<pre><code>&lt;munit:test name="getFlights-returns-200"&gt;
  &lt;munit:behavior&gt;
    &lt;munit-tools:mock-when processor="db:select"&gt;
      &lt;munit-tools:with-attributes&gt;
        &lt;munit-tools:with-attribute attributeName="doc:name" whereValue="Select flights"/&gt;
      &lt;/munit-tools:with-attributes&gt;
      &lt;munit-tools:then-return&gt;
        &lt;munit-tools:payload value='#[[{"code":"ER38sd"},{"code":"ER45if"}]]'/&gt;
      &lt;/munit-tools:then-return&gt;
    &lt;/munit-tools:mock-when&gt;
  &lt;/munit:behavior&gt;
  &lt;munit:execution&gt;
    &lt;flow-ref name="getFlightsFlow"/&gt;
  &lt;/munit:execution&gt;
  &lt;munit:validation&gt;
    &lt;munit-tools:assert-that expression="#[sizeOf(payload)]"
        is="#[MunitTools::equalTo(2)]"/&gt;
  &lt;/munit:validation&gt;
&lt;/munit:test&gt;</code></pre>
<table>
<tr><th>Component</th><th>Purpose</th></tr>
<tr><td><strong>Mock When</strong></td><td>Replace a processor (matched by name + attributes like <code>doc:name</code>) with a canned payload/attributes/variables — or <strong>Then throw</strong> an error (typeId e.g. <code>HTTP:CONNECTIVITY</code>) to drive error handlers deterministically</td></tr>
<tr><td><strong>Spy</strong></td><td>Assert on the event <em>before</em> and/or <em>after</em> a real processor runs, without replacing it</td></tr>
<tr><td><strong>Verify Call</strong></td><td>Assert a processor was invoked N times / at least / at most</td></tr>
<tr><td><strong>Assert That / Assert Equals / Fail</strong></td><td>Assertions with <code>MunitTools</code> matchers: <code>equalTo</code>, <code>notNullValue</code>, <code>hasSize</code>, <code>containsString</code>, <code>hasKey</code>…</td></tr>
<tr><td><strong>Before/After Suite &amp; Before/After Test</strong></td><td>One-time vs per-test setup/teardown</td></tr>
<tr><td><strong>Set Event</strong></td><td>Build the input event (payload, attributes, vars) for the flow under test</td></tr>
</table>
<ul>
<li>Testing an HTTP-triggered flow: either flow-ref the flow directly with a Set Event that mimics listener attributes, or <em>enable flow sources</em> and call the real endpoint with an HTTP Request inside the test.</li>
<li>Tests can be tagged, ignored, or <strong>parameterized</strong> (run the same suite over multiple input files).</li>
</ul>

<h3>Coverage and the Maven build</h3>
<pre><code>&lt;plugin&gt;
  &lt;groupId&gt;com.mulesoft.munit.tools&lt;/groupId&gt;
  &lt;artifactId&gt;munit-maven-plugin&lt;/artifactId&gt;
  &lt;configuration&gt;
    &lt;coverage&gt;
      &lt;runCoverage&gt;true&lt;/runCoverage&gt;
      &lt;failBuild&gt;true&lt;/failBuild&gt;
      &lt;requiredApplicationCoverage&gt;80&lt;/requiredApplicationCoverage&gt;
      &lt;requiredResourceCoverage&gt;70&lt;/requiredResourceCoverage&gt;
      &lt;requiredFlowCoverage&gt;60&lt;/requiredFlowCoverage&gt;
      &lt;formats&gt;&lt;format&gt;html&lt;/format&gt;&lt;format&gt;json&lt;/format&gt;&lt;/formats&gt;
    &lt;/coverage&gt;
  &lt;/configuration&gt;
&lt;/plugin&gt;</code></pre>
<ul>
<li>MUnit runs in the <strong>test</strong> phase (<code>mvn test</code>); coverage thresholds at application/resource/flow level can <strong>fail the build</strong> — the standard CI quality gate. Tests are excluded from the deployable JAR.</li>
<li>Typical pipeline: commit → <code>mvn clean package</code> (compiles + MUnit + coverage) → publish artifact/spec to Exchange → <code>mvn deploy -DmuleDeploy</code> per environment with injected properties/secrets → smoke/functional tests → promote. Same artifact every stage; Connected App credentials; secure keys from the secret store.</li>
</ul>

<h3>Production readiness checklist</h3>
<ul>
<li><strong>One API instance per environment</strong> in API Manager; the app pairs via <strong>autodiscovery</strong> with an environment-specific <code>api.id</code> property. Policies/SLAs configured per instance.</li>
<li>Baseline policies: an identity policy (client ID enforcement / OAuth / JWT) + rate limiting or spike control; TLS on all endpoints; secure properties for secrets.</li>
<li><strong>Exchange documentation</strong>: portal pages, examples, terms; enable the mocking service for evaluation; consumers self-serve access via contracts and SLA tiers.</li>
<li>Operational: alerts (RM + API Manager), dashboards, correlation-friendly logging, health endpoint, scaling plan (workers/replicas), and MUnit coverage gate in CI.</li>
</ul>

<h3>Versioning and deprecation</h3>
<ul>
<li>Only <strong>MAJOR</strong> versions surface to consumers (URL segment <code>/v2</code> or new instance); MINOR/PATCH stay backwards-compatible. Additive changes (new optional field/resource) must not break clients; contract-breaking changes require a new major version.</li>
<li><strong>Deprecation flow:</strong> release v2 alongside v1 → mark v1 <em>deprecated</em> in Exchange/API Manager (blocks/flags new access requests, signals consumers) → notify contract holders with a sunset date → monitor v1 traffic → retire after the window. Never silently redirect or delete while contracts are active.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> Mock When vs Spy vs Verify is the most-tested MUnit distinction: replace = Mock, observe without replacing = Spy, count calls = Verify. Also memorize the coverage config knobs (<code>failBuild</code>, <code>requiredApplicationCoverage</code>) and that MUnit binds to the Maven <em>test</em> phase.</p>`
  }
);
