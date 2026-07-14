// MuleSoft Platform Integration Architect (Mule-Arch-202) — study notes, sections 6–10
window.CERT_DATA.mcia.sections.push(
  {
    id: "a6",
    title: "Designing Automated Tests for Mule Applications",
    weight: 5,
    topicDocs: {
      "MUnit test suites": "https://docs.mulesoft.com/munit/latest/",
      "Integration and performance testing": "https://docs.mulesoft.com/api-functional-monitoring/"
    },
    objectives: [
      "Design unit test suites using MUnit and Studio's related features",
      "Identify test scenarios best addressed by integration testing or performance testing"
    ],
    notes: `
<h3>MUnit test suites</h3>
<p>MUnit is the unit-test layer (see the MCD L2 notes for full component detail — mocks, spies, verify, Set Event, coverage). The architect-level view is what belongs in each test level and how MUnit fits a pipeline:</p>
<ul>
<li><strong>Unit tests (MUnit):</strong> exercise a flow's logic with <em>all external dependencies mocked</em> (Mock When on connector operations, Then-throw to drive error paths). Deterministic, fast, run on every build (<code>mvn test</code>), enforce <strong>coverage gates</strong> (fail the build below a required application/resource/flow coverage). Studio generates suite skeletons, records tests from flows (RTF of test data), and shows coverage reports.</li>
<li>Design guidance: one suite per Mule config file; test error handling explicitly (mock a thrown <code>HTTP:CONNECTIVITY</code>, assert the mapped error response); parameterize suites for input variants; keep tests independent (Before/After Test resets state).</li>
</ul>

<h3>Integration and performance testing</h3>
<table>
<tr><th>Test type</th><th>Answers</th><th>Typical tooling</th></tr>
<tr><td>Unit (MUnit)</td><td>Is my flow logic correct in isolation?</td><td>MUnit + munit-maven-plugin in CI</td></tr>
<tr><td>Integration</td><td>Does the deployed app work against REAL dependencies (auth, TLS, contracts, network)?</td><td>Deployed test environment; API tests (BAT/Newman/RestAssured); stubbed partners where real ones unavailable</td></tr>
<tr><td>Functional monitoring</td><td>Is the API behaving correctly IN production, continuously?</td><td>API Functional Monitoring (BAT) scheduled monitors from public/private locations</td></tr>
<tr><td>Performance</td><td>Does it meet throughput/latency/capacity NFRs? Where does it break?</td><td>Load tools (JMeter, Gatling) against a prod-like environment; observe with Anypoint Monitoring</td></tr>
</table>
<ul>
<li>Choose <strong>integration testing</strong> when the risk is in the <em>interaction</em>: authentication handshakes, certificate chains, API contract mismatches, queue wiring, end-to-end flows across layers. Mocks would hide exactly what you need to verify.</li>
<li>Choose <strong>performance testing</strong> when the requirement is quantitative (X TPS at Y ms p95, N-hour soak without degradation). Test on production-equivalent sizing (same vCores/replicas), include realistic payload sizes, test past the target to find the breaking point, and validate horizontal scaling assumptions.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> match the question's risk to the level: "verify the flow maps errors correctly" → MUnit with a mocked failure. "Verify mutual TLS to the partner works" → integration test (can't be mocked meaningfully). "Verify 500 TPS with p95 &lt; 300 ms" → performance test on prod-like infrastructure — never extrapolate from a laptop or MUnit.</p>`
  },
  {
    id: "a7",
    title: "Designing for Reliability Requirements",
    weight: 8,
    topicDocs: {
      "Transactions — and their alternatives": "https://docs.mulesoft.com/mule-runtime/latest/transaction-management",
      "Until Successful, reconnection, redelivery": "https://docs.mulesoft.com/mule-runtime/latest/until-successful-scope",
      "High availability vs disaster recovery": "https://docs.mulesoft.com/mule-runtime/latest/mule-high-availability-ha-clusters",
      "Reliability patterns with queues": "https://docs.mulesoft.com/mule-runtime/latest/reliability-patterns"
    },
    objectives: [
      "Select alternatives to traditional transactions where appropriate",
      "Use Until Successful, reconnection strategies, and redelivery policies appropriately",
      "Differentiate disaster recovery from high availability in all deployment options",
      "Design solutions using local and XA transactions where connectors support them"
    ],
    notes: `
<h3>Transactions — and their alternatives</h3>
<p>Local (single-resource) and XA transactions work as covered in MCD L2 (VM, JMS, DB participate; HTTP/File/SFTP don't; XA = two-phase commit across resources, heavier). The architect skill is knowing when NOT to use them:</p>
<table>
<tr><th>Alternative</th><th>Idea</th><th>Use when</th></tr>
<tr><td><strong>Idempotency + retries</strong></td><td>Make the operation safe to repeat; then at-least-once delivery + redelivery replaces atomicity</td><td>Target is an API/system without transaction support (HTTP, SaaS)</td></tr>
<tr><td><strong>Reliable messaging (store-and-forward)</strong></td><td>Persist the message first (queue), process asynchronously, ack only on success</td><td>Zero message loss across unreliable steps; decoupling wanted anyway</td></tr>
<tr><td><strong>Compensation (saga)</strong></td><td>Each step has an undo action executed if a later step fails</td><td>Long-running multi-system processes where locking is impossible (book flight + hotel; cancel flight if hotel fails)</td></tr>
<tr><td><strong>Eventual consistency</strong></td><td>Accept temporary divergence; converge via events/reconciliation</td><td>Cross-system data sync where strict consistency isn't a business requirement</td></tr>
</table>
<p>XA across systems is a last resort: it requires all parties to support it, holds locks, performs poorly, and still can't include HTTP APIs — most modern integration reliability is queues + idempotency + compensation.</p>

<h3>Until Successful, reconnection, redelivery</h3>
<ul>
<li><strong>Reconnection strategy</strong> (connector config): re-establish a broken <em>connection</em> (count/frequency or forever). First line of defense against network blips; applies to sources and operations.</li>
<li><strong>Until Successful</strong> (scope): retry the <em>operations inside it</em> up to maxRetries with a fixed interval; exhaustion raises RETRY_EXHAUSTED. Synchronous, in-flow, best for short transient failures. Beware: the event is held in memory during retries — not a persistence mechanism.</li>
<li><strong>Redelivery policy</strong> (on a source): counts failed processing attempts of the <em>same message</em>; beyond maxRedeliveryCount raises REDELIVERY_EXHAUSTED → route to a DLQ. Protects consumers from poison messages; pairs with broker-side delivery counts (Anypoint MQ maxDeliveries → DLQ).</li>
</ul>

<h3>High availability vs disaster recovery</h3>
<table>
<tr><th></th><th>High availability (HA)</th><th>Disaster recovery (DR)</th></tr>
<tr><td>Protects against</td><td>Component failure (a worker, node, AZ)</td><td>Loss of a whole site/region</td></tr>
<tr><td>Mechanism</td><td>Redundancy + automatic failover <em>within</em> the deployment</td><td>Ability to restore service <em>elsewhere</em>: standby environment, backups, runbooks</td></tr>
<tr><td>Measured by</td><td>Uptime (99.9…%)</td><td><strong>RTO</strong> (time to recover) and <strong>RPO</strong> (data loss tolerance)</td></tr>
<tr><td>CloudHub</td><td>≥2 workers (auto-distributed across AZs), platform restarts failed workers</td><td>Deploy/redeploy apps to another <em>region</em>; DNS switch; replicate external state (OSv2 and MQ are per-region!)</td></tr>
<tr><td>RTF / customer-hosted</td><td>Multiple replicas/nodes, clusters, load balancers</td><td>Second data center or region: active-passive (warm standby) or active-active; replicate brokers/DBs; restore from IaC + artifact repos</td></tr>
</table>
<p>Key architect points: HA does not give you DR (two workers in one region die with the region); DR drills and documented RTO/RPO matter more than tooling; stateful services (queues, object stores, databases) dominate DR design — stateless Mule apps are easy to redeploy, their state is not.</p>

<h3>Reliability patterns with queues</h3>
<figure><img src="images/reliability-pattern.png" alt="Reliable acquisition: accept and persist to a queue, then process asynchronously in a transactional consumer flow"><figcaption>Reliable acquisition: persist first, ack the caller, process asynchronously under a transaction <em>(source: docs.mulesoft.com)</em></figcaption></figure>
<p>The reliable-acquisition pattern (persist → ack → process, consuming transactionally so failures roll messages back) is the standard zero-loss design. On CloudHub use Anypoint MQ (or CH1 persistent VM queues within one app); customer-hosted can use persistent VM queues, JMS brokers, or MQ.</p>
<p class="tip"><strong>Exam tip:</strong> Reconnection = connection-level; Until Successful = operation-level, in-memory; redelivery policy = message-level at the source. "Bank requires atomic write to its own two Oracle schemas" → XA (or same-connection local tx). "Must not lose orders if the ERP is down all weekend" → queue-based store-and-forward, not Until Successful (the app could restart and lose the in-flight event).</p>`
  },
  {
    id: "a8",
    title: "Designing for Performance Requirements",
    weight: 7,
    topicDocs: {
      "Meeting performance and capacity goals": "https://docs.mulesoft.com/mule-runtime/latest/execution-engine",
      "Streaming design choices": "https://docs.mulesoft.com/mule-runtime/latest/streaming-about",
      "Processing very large message sequences": "https://docs.mulesoft.com/mule-runtime/latest/batch-processing-concept"
    },
    objectives: [
      "Design Mule applications and solutions to meet performance and capacity goals",
      "Design Mule applications using Mule's streaming features",
      "Design Mule applications to process large sequences/streams of messages"
    ],
    notes: `
<h3>Meeting performance and capacity goals</h3>
<ul>
<li>Start from the NFR numbers: target <strong>throughput</strong> (TPS), <strong>latency</strong> (p95/p99, not average), payload sizes, concurrency, growth. Capacity design = translating those into vCores/replicas/nodes with headroom.</li>
<li><strong>Scale up</strong> (bigger workers — helps CPU-heavy transforms and large in-memory buffers) vs <strong>scale out</strong> (more workers/replicas — helps throughput and availability; requires stateless design or shared state, see a4).</li>
<li>Latency levers: fewer network hops (collapse layers where justified), <strong>caching</strong> (Cache scope / HTTP caching policy for repeated reads), parallelism (Scatter-Gather, Parallel For Each), connection pooling & keep-alive, avoid re-parsing (DataWeave once).</li>
<li>Throughput levers: async decoupling (accept fast, process from queue), horizontal scaling with competing consumers, batch/bulk APIs of target systems (e.g. Salesforce Bulk v2 instead of per-record calls), <code>maxConcurrency</code> tuned to what the backend can take (protect it — a fast Mule app can DoS a slow backend).</li>
<li>Measure, don't guess: performance-test on production-equivalent sizing; monitor thread starvation and back-pressure signals (503s) in Anypoint Monitoring.</li>
</ul>

<h3>Streaming design choices</h3>
<p>Full mechanics in MCD L2 d1 (file-stored vs in-memory vs non-repeatable, 512 KB defaults, object streaming at 500 instances). The architect decisions:</p>
<ul>
<li>Payloads larger than memory → <strong>repeatable file-stored</strong> streams (EE default) with buffer sized to the common case; only go <strong>non-repeatable</strong> when the flow genuinely reads once (pure pass-through) and you need maximum efficiency.</li>
<li>DataWeave <code>streaming=true</code> for sequential single-pass transforms of huge CSV/JSON; <code>deferred=true</code> writer to stream output downstream while still producing.</li>
<li>Watch the "stream consumers": logging payloads, multiple reads without repeatable streams, and DataWeave random access all force full materialization.</li>
</ul>

<h3>Processing very large message sequences</h3>
<table>
<tr><th>Approach</th><th>Strengths</th><th>Watch out</th></tr>
<tr><td>Streaming + For Each</td><td>Simple sequential processing of a large stream</td><td>Sequential = slow for big volumes</td></tr>
<tr><td>Parallel For Each</td><td>Concurrent, aggregated results</td><td>Whole collection in memory; no persistence</td></tr>
<tr><td><strong>Batch Job</strong></td><td>Queued + parallel + persistent (survives restart), record-level error tolerance, aggregators for bulk upserts</td><td>EE only; async (fire-and-forget from the triggering flow); On Complete has no original payload</td></tr>
<tr><td>Queue-based fan-out</td><td>Split into messages on MQ/JMS; competing consumers scale elastically across apps</td><td>Needs broker + idempotency; ordering only with FIFO queues</td></tr>
<tr><td>Source paging/watermarking</td><td>Pull in chunks (DB paging, API pagination) instead of one giant read</td><td>Chunk-size tuning; resume logic</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> "millions of records nightly, must survive a restart mid-run, invalid records must not stop the rest" → Batch Job. "10 GB file through a 1 GB-heap worker" → file-stored repeatable streaming (+ DW streaming), never load-into-memory answers. "Backend can only take 50 TPS" → throttle with maxConcurrency / queue buffering, not more workers.</p>`
  },
  {
    id: "a9",
    title: "Designing for Security Requirements",
    weight: 8,
    topicDocs: {
      "Securing access to the control plane and APIs": "https://docs.mulesoft.com/access-management/",
      "Anypoint Security at the edge": "https://docs.mulesoft.com/anypoint-security/",
      "Countering application vulnerabilities": "https://docs.mulesoft.com/mule-runtime/latest/secure-configuration-properties",
      "Audit logging on Anypoint Platform": "https://docs.mulesoft.com/access-management/audit-logging"
    },
    objectives: [
      "Design secure access to the Anypoint Platform control plane and APIs",
      "Design secure edge access using Anypoint Security",
      "Analyze and counteract potential security vulnerabilities of Mule applications",
      "Recognize the audit logging capabilities of Anypoint Platform"
    ],
    notes: `
<h3>Securing access to the control plane and APIs</h3>
<ul>
<li><strong>Access Management</strong> structures the org: <strong>business groups</strong> (asset/permission boundaries), <strong>environments</strong> (design/sandbox/production), <strong>teams/roles</strong> with least-privilege permission sets per product.</li>
<li><strong>Identity management (SSO for humans):</strong> federate platform login to your IdP via <strong>SAML 2.0 or OpenID Connect</strong>; enforce MFA at the IdP.</li>
<li><strong>Client management (tokens for apps):</strong> configure an external <strong>OAuth 2.0 / OpenID Connect client provider</strong> (Okta, Azure AD, PingFederate) so API client credentials and tokens come from your IdP; policies (OAuth enforcement / JWT validation) then validate those tokens at the gateway.</li>
<li><strong>Connected apps</strong> replace user credentials for automation (CI/CD, CLI, platform API calls): client_credentials grant, scoped narrowly, rotatable secrets.</li>
<li>API access design: identity policy (client-id / OAuth / JWT) + authorization (scopes/claims) + TLS everywhere, per environment-specific API instance.</li>
</ul>

<h3>Anypoint Security at the edge</h3>
<ul>
<li><strong>Anypoint Security</strong> (separate license, <strong>Runtime Fabric</strong>-targeted) adds a hardened perimeter in front of the runtime plane:</li>
<li><strong>Edge policies:</strong> DoS protection (rate-based), IP allowlists/blocklists, HTTP limits (header/payload size constraints), Web Application Firewall (OWASP CRS signatures) — enforced at dedicated edge gateways <em>before</em> traffic reaches Mule apps.</li>
<li><strong>Secrets Manager:</strong> platform vault for TLS keystores/truststores and shared secrets, referenced by DLBs/edge/apps instead of embedding key material.</li>
<li><strong>Tokenization service:</strong> replaces sensitive fields (PAN, PII) with format-preserving tokens at the edge so downstream apps never hold the real values.</li>
<li>On CloudHub (no Anypoint Security): approximate the perimeter with DLB + VPC firewall rules, API policies (rate limiting, IP allowlist), and WAF/CDN services in front.</li>
</ul>

<h3>Countering application vulnerabilities</h3>
<table>
<tr><th>Risk</th><th>Countermeasure</th></tr>
<tr><td>Injection (SQL/expression)</td><td>Parameterized DB queries (input parameters), validate/allowlist inputs, never concatenate user data into queries or scripts</td></tr>
<tr><td>Secrets exposure</td><td>Secure configuration properties (encrypted), secureProperties masking, secrets vaults, no secrets in logs or code</td></tr>
<tr><td>Data in transit</td><td>TLS on every hop (including gateway→backend "last mile"), mutual TLS for partner/system trust, strong protocols/ciphers only</td></tr>
<tr><td>Sensitive data exposure</td><td>Mask/omit PII in logs, encrypt sensitive payload fields (Crypto module), tokenization at the edge</td></tr>
<tr><td>Vulnerable dependencies</td><td>Patch runtime versions, scan dependencies, track connector updates</td></tr>
<tr><td>Excessive trust</td><td>Validate at every boundary (APIkit contract validation), authenticate internal callers too (zero trust), least-privilege system accounts</td></tr>
</table>

<h3>Audit logging on Anypoint Platform</h3>
<ul>
<li>The platform's <strong>audit log</strong> records who did what, when, to which object across control-plane products: logins, deployments, API instance/policy changes, contract approvals, permission changes…</li>
<li>Accessible in Access Management UI and via the <strong>Audit Log query API</strong> for export into SIEM tools; retention is platform-managed (about two years) — export if you must keep longer.</li>
<li>Audit logs cover <em>platform actions</em> (control plane); <em>business/transaction logging</em> is your application logs and monitoring — a distinction the exam likes.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> map the requirement to the layer — "platform users must log in with corporate SSO" → identity management (SAML/OIDC); "API consumers get tokens from our Okta" → client management/external OAuth provider; "block oversized requests and OWASP attacks before they hit apps (RTF)" → Anypoint Security edge policies; "prove who changed the prod policy" → platform audit log.</p>`
  },
  {
    id: "a10",
    title: "Applying DevOps Practices and Operating Solutions",
    weight: 14,
    topicDocs: {
      "CI/CD pipelines with MuleSoft Maven plugins": "https://docs.mulesoft.com/mule-runtime/latest/mmp-concept",
      "Automating interactions with the platform": "https://docs.mulesoft.com/anypoint-cli/latest/",
      "Logging configurations across deployment options": "https://docs.mulesoft.com/mule-runtime/latest/logging-in-mule",
      "Anypoint Monitoring across deployment options": "https://docs.mulesoft.com/monitoring/"
    },
    objectives: [
      "Design CI/CD pipelines for Mule applications using MuleSoft-provided Maven plugins",
      "Identify features for automating interactions with Anypoint Platform",
      "Design logging configurations of Mule applications in all deployment options",
      "Identify Anypoint Monitoring features in all deployment options"
    ],
    notes: `
<h3>CI/CD pipelines with MuleSoft Maven plugins</h3>
<p>The canonical pipeline (tool-agnostic — Jenkins/GitHub Actions/Azure DevOps all drive the same Maven core):</p>
<ol>
<li><strong>Commit</strong> → trigger build.</li>
<li><strong>Build & unit test:</strong> <code>mvn clean package</code> — compiles, runs <strong>MUnit</strong> via munit-maven-plugin, enforces coverage gates (fail the build), produces the deployable JAR once.</li>
<li><strong>Publish:</strong> version the artifact (semver) and <code>mvn deploy</code> it to a repository (<strong>Exchange</strong> as Maven repo, groupId = org ID, or Nexus/Artifactory).</li>
<li><strong>Deploy per environment:</strong> <code>mvn deploy -DmuleDeploy</code> with the <strong>mule-maven-plugin</strong>'s target config (cloudHubDeployment / cloudhub2Deployment / rtfDeployment / armDeployment / standaloneDeployment), injecting environment properties and secure keys from the pipeline's secret store. Same artifact promoted dev→test→prod — never rebuilt.</li>
<li><strong>Post-deploy:</strong> smoke/integration tests, then promote.</li>
</ol>
<ul>
<li>Authenticate as a <strong>Connected App</strong> (client_credentials) in <code>settings.xml</code>/plugin config — no personal accounts in automation.</li>
<li>API lifecycle in the pipeline: publish the spec to Exchange, create/configure the API instance and policies via automation, pair the app by autodiscovery (api.id per environment).</li>
</ul>

<h3>Automating interactions with the platform</h3>
<table>
<tr><th>Tool</th><th>Use for</th></tr>
<tr><td><strong>Anypoint Platform APIs</strong> (REST)</td><td>Everything the UI does: ARM (Runtime Manager), API Manager, Exchange, Access Management — the foundation all other tools call</td></tr>
<tr><td><strong>Anypoint CLI</strong></td><td>Scriptable command-line access (deployments, API instances, policies, VPCs) for pipelines and ops scripts</td></tr>
<tr><td><strong>Maven plugins</strong></td><td>mule-maven-plugin (package/deploy), munit-maven-plugin (test/coverage), exchange publication</td></tr>
<tr><td>Provider ecosystems</td><td>Terraform-style IaC and CI plugins built on the platform APIs (recognize the concept)</td></tr>
</table>

<h3>Logging configurations across deployment options</h3>
<ul>
<li>Every app ships <code>log4j2.xml</code>: appenders + per-category levels; <strong>async loggers</strong> for throughput (accepting small crash-loss risk) vs sync for audit-grade logs. Correlation IDs in patterns; JSON layouts for machine parsing (details in MCD L2 d4).</li>
<li><strong>CloudHub:</strong> platform captures console output (retention/size limits, searchable in Runtime Manager). For enterprise log aggregation, either use Anypoint Monitoring log management (Titanium) or <em>disable CloudHub logging</em> (org permission required) and ship logs with a custom appender (Splunk/ELK/HTTP).</li>
<li><strong>Runtime Fabric:</strong> app logs go to the container stdout and are forwarded by the cluster's log forwarding setup (e.g. to ELK/Splunk); Anypoint Monitoring agents can publish metrics/logs to the control plane.</li>
<li><strong>Customer-hosted:</strong> you own everything: file appenders + rotation, forwarders/agents into your central logging, and disk housekeeping.</li>
</ul>

<h3>Anypoint Monitoring across deployment options</h3>
<ul>
<li><strong>Built-in dashboards</strong> (all targets, agent-based on hybrid/RTF): app metrics — inbound/outbound throughput, response times, errors, JVM/CPU/memory; API analytics from gateways.</li>
<li><strong>Custom dashboards & alerts:</strong> compose metrics, set threshold alerts (error ratio, response time, CPU) with notification channels.</li>
<li><strong>Log management</strong> (Titanium subscription): centralized search over app logs with longer retention.</li>
<li><strong>Functional monitoring (BAT):</strong> scheduled black-box API checks from public/private locations validating real behavior in production.</li>
<li>Complementary: <strong>Runtime Manager alerts</strong> (app down, worker unresponsive, deployment failed), <strong>API Manager alerts</strong> (policy violations, response codes), <strong>Visualizer</strong> (live dependency graph of the application network).</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> pipeline questions almost always test: build ONCE and promote the same artifact; MUnit+coverage gates in the build stage; Connected App credentials; environment differences via properties, not rebuilds. Operations questions: know which tool answers "app down?" (RM alert), "API abused?" (API Manager alert/analytics), "search all prod logs" (Anypoint Monitoring log management), "is the API functionally OK right now?" (BAT).</p>`
  }
);
