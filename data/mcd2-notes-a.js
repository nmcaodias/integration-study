// MCD Level 2 — expanded study notes, domains 1–3 (based on docs.mulesoft.com)
window.CERT_DATA = window.CERT_DATA || {};
window.CERT_DATA.mcd2 = {
  id: "mcd2",
  name: "MuleSoft Certified Developer – Level 2 (Mule 4)",
  short: "MCD Level 2",
  exam: { questions: 60, minutes: 120, passPct: 70 },
  questions: [],
  sections: [
    {
      id: "d1",
      title: "Building Performant and Reliable Mule Applications",
      weight: 27,
      topicDocs: {
        "Streaming in Mule 4": "https://docs.mulesoft.com/mule-runtime/latest/streaming-about",
        "Reliability patterns": "https://docs.mulesoft.com/mule-runtime/latest/reliability-patterns",
        "Transactions": "https://docs.mulesoft.com/mule-runtime/latest/transaction-management",
        "Performance and scaling": "https://docs.mulesoft.com/mule-runtime/latest/execution-engine"
      },
      docs: [
        { label: "Streaming in Mule 4", url: "https://docs.mulesoft.com/mule-runtime/latest/streaming-about" },
        { label: "Reliability patterns", url: "https://docs.mulesoft.com/mule-runtime/latest/reliability-patterns" },
        { label: "Transaction management", url: "https://docs.mulesoft.com/mule-runtime/latest/transaction-management" },
        { label: "Until Successful scope", url: "https://docs.mulesoft.com/mule-runtime/latest/until-successful-scope" }
      ],
      objectives: [
        "Use streaming (repeatable and non-repeatable) to process large payloads",
        "Tune streaming strategies: in-memory vs file-stored buffers",
        "Implement reliability patterns: Until Successful, redelivery policies, dead-letter queues",
        "Use VM queues and Anypoint MQ for asynchronous, reliable processing",
        "Manage transactions (local and XA) and transactional scopes",
        "Use the Cache scope and idempotency (Idempotent Message Validator)",
        "Understand thread pools, back-pressure, and horizontal/vertical scaling",
        "Design for high availability: clustering and multiple workers"
      ],
      notes: `
<h3>Streaming in Mule 4</h3>
<p>Components that return <code>InputStream</code> or streamable collections (File, FTP, Database, HTTP, Sockets, Salesforce…) stream by default, and Mule wraps them in <strong>repeatable streams</strong> so multiple components can read the same content.</p>
<table>
<tr><th>Strategy</th><th>How it works</th><th>Defaults</th><th>Trade-offs</th></tr>
<tr><td><strong>Repeatable file-stored</strong> (EE default)</td><td>Buffers in memory up to a threshold, then overflows to a temp file on disk</td><td>512 KB in-memory buffer (<code>inMemorySize</code>)</td><td>Handles any size; disk I/O cost beyond the buffer</td></tr>
<tr><td><strong>Repeatable in-memory</strong> (CE default)</td><td>Buffers in memory, expanding as needed up to a max</td><td>initial 512 KB, +512 KB increments (<code>initialBufferSize</code>, <code>bufferSizeIncrement</code>, <code>maxInMemorySize</code>)</td><td>Fastest; raises <code>STREAM_MAXIMUM_SIZE_EXCEEDED</code> if max is hit</td></tr>
<tr><td><strong>Non-repeatable</strong></td><td>No buffering — the raw stream, readable ONCE</td><td>—</td><td>Lowest memory/latency; a second read fails or gets an empty/consumed stream</td></tr>
</table>
<pre><code>&lt;file:read path="huge.csv"&gt;
  &lt;repeatable-file-store-stream inMemorySize="1" bufferUnit="MB"/&gt;
&lt;/file:read&gt;

&lt;http:request ...&gt;
  &lt;non-repeatable-stream/&gt;   &lt;!-- read-once optimization --&gt;
&lt;/http:request&gt;</code></pre>
<ul>
<li><strong>Streamed objects</strong> (auto-paging connectors like Database/Salesforce) buffer by <em>instance count</em>, not bytes: in-memory default <strong>500 objects</strong> (+100 increments); the EE file-store variant serializes overflow with Kryo.</li>
<li><strong>DataWeave</strong>: reader property <code>streaming=true</code> processes input sequentially (CSV/JSON — access data in order, single pass); writer property <code>deferred=true</code> streams output downstream before the whole result is materialized.</li>
<li>Gotchas: logging <code>#[payload]</code>, the debugger's payload preview, or multiple concurrent reads of a <em>non-repeatable</em> stream consume it. Repeatable streams solve this at the cost of buffering.</li>
</ul>

<h3>Reliability patterns</h3>
<figure><img src="images/reliability-pattern.png" alt="Reliable acquisition flow: receive message, add to VM queue, respond; application logic flow consumes from the queue transactionally"><figcaption>The reliable acquisition pattern: accept + persist first, process asynchronously afterwards <em>(source: docs.mulesoft.com)</em></figcaption></figure>
<ul>
<li><strong>Reliable acquisition flow:</strong> couple a non-transactional source (HTTP) with a transactional/persistent channel: receive → <strong>write to a persistent VM queue</strong> (or JMS/Anypoint MQ) → acknowledge the caller. A separate <strong>application logic flow</strong> consumes from the queue with <code>transactionalAction="ALWAYS_BEGIN"</code> — if processing fails, the message rolls back to the queue instead of being lost.</li>
<li><strong>VM queues:</strong> intra-app (or intra-cluster) messaging. <code>queueType="PERSISTENT"</code> survives restarts using file-based storage (standalone runtimes) — no extra software; in-memory (TRANSIENT) is faster but lost on crash. Publish with <code>sendCorrelationId="ALWAYS"</code> to keep end-to-end tracing.</li>
<li><strong>Until Successful:</strong> wraps processors and retries them until success, up to <code>maxRetries</code> with <code>millisBetweenRetries</code>; exhaustion raises <code>MULE:RETRY_EXHAUSTED</code>. For synchronous in-flow retries (flaky API call).</li>
<li><strong>Reconnection strategies</strong> (on connector configs): retry the <em>connection</em> (count/frequency or forever) — distinct from retrying the operation.</li>
<li><strong>Redelivery policy</strong> (on listeners): counts how many times the <em>same message</em> fails processing; exceeding <code>maxRedeliveryCount</code> raises <code>MULE:REDELIVERY_EXHAUSTED</code> — handle it by parking the message in a <strong>dead-letter queue (DLQ)</strong> for inspection/replay.</li>
<li><strong>Anypoint MQ</strong> (hosted cloud messaging): standard queues, <strong>FIFO queues</strong> (ordering), <strong>message exchanges</strong> (fan-out pub/sub), ack modes (IMMEDIATE / AUTO / MANUAL), delivery-count-based <strong>DLQ routing</strong>, and a subscriber <strong>circuit breaker</strong>. Use it for cross-app messaging on CloudHub (VM queues don't cross apps).</li>
<li>File-based sources: enable watermarking and avoid deleting/moving the file until downstream processing completes — the file itself is the reprocessing safety net.</li>
</ul>

<h3>Transactions</h3>
<table>
<tr><th></th><th>Single Resource (local)</th><th>XA (Extended Architecture)</th></tr>
<tr><td>Scope</td><td>ONE resource: all operations from the same connector using the same global config</td><td>MULTIPLE resources as one atomic unit (e.g. JMS + Database)</td></tr>
<tr><td>Protocol</td><td>Native resource transaction</td><td>Two-phase commit (transaction manager required)</td></tr>
<tr><td>Performance</td><td>Fast</td><td>Slower, heavier</td></tr>
<tr><td>Nesting</td><td>Not supported</td><td>Supported</td></tr>
</table>
<p><strong>Transactional actions</strong> (source or Try scope): <code>ALWAYS_BEGIN</code> (start new; error if nesting a single-resource tx), <code>ALWAYS_JOIN</code> (must join an existing tx, error if none), <code>BEGIN_OR_JOIN</code>, <code>JOIN_IF_POSSIBLE</code> (join if present), <code>NOT_SUPPORTED</code> (run outside the tx), <code>INDIFFERENT</code>/<code>NONE</code>.</p>
<ul>
<li>Only transactional connectors participate: <strong>JMS, VM, Database</strong> (and JDBC-based). HTTP, File, SFTP are NOT transactional.</li>
<li>A <strong>Try scope</strong> starts a transaction inside a flow whose source is non-transactional (e.g. HTTP-triggered flow wrapping two DB writes).</li>
<li><strong>Rollback semantics with error handlers:</strong> an error reaching an <strong>On Error Propagate</strong> that is at the level owning the transaction → <strong>rollback</strong>; handled by <strong>On Error Continue</strong> → the transaction stays alive and <strong>commits</strong> (the handler's processors even run inside it). Choosing Continue by accident can commit partial work — classic exam trap.</li>
</ul>

<h3>Performance and scaling</h3>
<ul>
<li>Mule 4 uses a single <strong>self-tuning thread pool (UBER)</strong> with automatic <strong>back-pressure</strong> — when the app can't keep up, sources are throttled (HTTP returns 503). You rarely size pools; you shape concurrency with <code>maxConcurrency</code> on flows and batch/parallel components.</li>
<li><strong>Cache scope:</strong> stores the result of its inner processors in an Object Store keyed by a hash of the message (or a custom key). Serve repeated idempotent requests without recomputing; entries need repeatable/consumable payloads and a sensible TTL/invalidation strategy (Invalidate Cache / Invalidate Key operations).</li>
<li><strong>Idempotent Message Validator:</strong> computes an ID (<code>idExpression</code>) per message, stores seen IDs in an Object Store, and raises <code>MULE:DUPLICATE_MESSAGE</code> for repeats — exactly-once protection at the entry point.</li>
<li><strong>Scaling:</strong> vertical = larger workers (more vCores/memory per instance); horizontal = more workers/replicas with automatic load balancing (CloudHub) — also the availability play. Stateless apps scale horizontally best; shared state must live in external stores (Object Store v2, DB, MQ), never in memory.</li>
<li><strong>Clustering</strong> (customer-hosted): nodes form one logical unit over a distributed in-memory grid — persistent object stores and VM queues are shared cluster-wide; <strong>scheduled/polling sources run on the primary node only</strong> by default to avoid duplicate triggering.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> pick the right reliability tool: retry an operation now → Until Successful; survive app crash without losing accepted messages → persistent queue + transaction (reliable acquisition); stop poison messages → redelivery policy + DLQ; atomic write to two systems → XA. And know the streaming defaults (512 KB buffers, 500 objects).</p>`
    },
    {
      id: "d2",
      title: "Maintainable and Modular Mule Applications (Maven)",
      weight: 25,
      topicDocs: {
        "POM anatomy of a Mule project": "https://docs.mulesoft.com/mule-runtime/latest/mmp-concept",
        "Maven lifecycle (what runs when)": "https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html",
        "Exchange as a Maven repository": "https://docs.mulesoft.com/exchange/to-publish-assets-maven",
        "Reuse mechanisms — pick the right one": "https://docs.mulesoft.com/mule-runtime/latest/shared-resources",
        "Versioning and configuration": "https://semver.org/"
      },
      docs: [
        { label: "Mule Maven plugin", url: "https://docs.mulesoft.com/mule-runtime/latest/mmp-concept" },
        { label: "Publish assets to Exchange with Maven", url: "https://docs.mulesoft.com/exchange/to-publish-assets-maven" }
      ],
      objectives: [
        "Explain the Maven lifecycle and the POM structure of a Mule project",
        "Use the mule-maven-plugin to package and deploy applications",
        "Manage dependencies, including Mule plugins and shared Java libraries",
        "Create and consume reusable connectors/modules from Exchange",
        "Externalize common configuration with parent POMs and properties",
        "Version assets meaningfully (semantic versioning) and publish to Exchange",
        "Structure applications for reuse: domains, libraries, and API fragments"
      ],
      notes: `
<h3>POM anatomy of a Mule project</h3>
<pre><code>&lt;project&gt;
  &lt;groupId&gt;com.acme&lt;/groupId&gt;            &lt;!-- org id when publishing to Exchange --&gt;
  &lt;artifactId&gt;orders-sapi&lt;/artifactId&gt;
  &lt;version&gt;1.2.0&lt;/version&gt;
  &lt;packaging&gt;mule-application&lt;/packaging&gt;

  &lt;build&gt;&lt;plugins&gt;
    &lt;plugin&gt;
      &lt;groupId&gt;org.mule.tools.maven&lt;/groupId&gt;
      &lt;artifactId&gt;mule-maven-plugin&lt;/artifactId&gt;
      &lt;extensions&gt;true&lt;/extensions&gt;
      &lt;configuration&gt;
        &lt;sharedLibraries&gt;                 &lt;!-- expose a JAR to connectors --&gt;
          &lt;sharedLibrary&gt;
            &lt;groupId&gt;com.mysql&lt;/groupId&gt;&lt;artifactId&gt;mysql-connector-j&lt;/artifactId&gt;
          &lt;/sharedLibrary&gt;
        &lt;/sharedLibraries&gt;
        &lt;cloudhub2Deployment&gt;
          &lt;uri&gt;https://anypoint.mulesoft.com&lt;/uri&gt;
          &lt;target&gt;Cloudhub-US-East-2&lt;/target&gt;
          &lt;environment&gt;\${env}&lt;/environment&gt;
          &lt;connectedAppClientId&gt;\${ca.id}&lt;/connectedAppClientId&gt;
          &lt;connectedAppClientSecret&gt;\${ca.secret}&lt;/connectedAppClientSecret&gt;
          &lt;connectedAppGrantType&gt;client_credentials&lt;/connectedAppGrantType&gt;
        &lt;/cloudhub2Deployment&gt;
      &lt;/configuration&gt;
    &lt;/plugin&gt;
  &lt;/plugins&gt;&lt;/build&gt;

  &lt;dependencies&gt;
    &lt;dependency&gt;                          &lt;!-- a connector = mule-plugin --&gt;
      &lt;groupId&gt;org.mule.connectors&lt;/groupId&gt;
      &lt;artifactId&gt;mule-http-connector&lt;/artifactId&gt;
      &lt;version&gt;1.9.x&lt;/version&gt;
      &lt;classifier&gt;mule-plugin&lt;/classifier&gt;
    &lt;/dependency&gt;
  &lt;/dependencies&gt;
&lt;/project&gt;</code></pre>
<ul>
<li><strong>Classifiers matter:</strong> <code>mule-plugin</code> marks Mule extensions/connectors; API specs from Exchange use <code>raml</code> / <code>oas</code> / <code>raml-fragment</code> classifiers; plain Java JARs have none.</li>
<li><strong>Shared libraries:</strong> ordinary JAR dependencies are isolated from connectors by Mule's classloading. Drivers used BY a connector (JDBC driver, JMS client) must be listed under <code>sharedLibraries</code> or the connector can't see them — a frequent real-world and exam gotcha.</li>
</ul>

<h3>Maven lifecycle (what runs when)</h3>
<table>
<tr><th>Phase</th><th>Mule project effect</th></tr>
<tr><td><code>clean</code></td><td>Delete <code>target/</code></td></tr>
<tr><td><code>compile</code></td><td>Compile/validate app resources</td></tr>
<tr><td><code>test</code></td><td><strong>Run MUnit suites</strong> (munit-maven-plugin), compute coverage</td></tr>
<tr><td><code>package</code></td><td>Build the deployable JAR in <code>target/</code></td></tr>
<tr><td><code>install</code></td><td>Copy artifact to the local repository (~/.m2)</td></tr>
<tr><td><code>deploy</code></td><td>Publish to a remote repository (Exchange) — and with <code>-DmuleDeploy</code>, the mule-maven-plugin <strong>deploys the app</strong> to the configured target instead</td></tr>
</table>
<p>Deployment targets supported by the plugin: <code>cloudHubDeployment</code> (CH 1.0), <code>cloudhub2Deployment</code>, <code>rtfDeployment</code> (Runtime Fabric), <code>armDeployment</code> (customer-hosted via Runtime Manager agent), <code>standaloneDeployment</code>. Credentials should be a <strong>Connected App</strong> (client_credentials grant, minimal scopes) — never personal accounts in CI.</p>

<h3>Exchange as a Maven repository</h3>
<ul>
<li><strong>Consume:</strong> add the Exchange repo URL to the POM/settings and credentials to <code>settings.xml</code> (<code>&lt;server&gt;</code> with connected app or username/token). Exchange assets then resolve like any dependency.</li>
<li><strong>Publish:</strong> set <code>groupId = your Anypoint organization ID</code>, add Exchange as <code>distributionManagement</code>, run <code>mvn deploy</code>. Works for applications (templates/examples), custom connectors, API specs, and fragments.</li>
</ul>

<h3>Reuse mechanisms — pick the right one</h3>
<table>
<tr><th>Need</th><th>Mechanism</th></tr>
<tr><td>Same build config/plugin versions everywhere</td><td><strong>Parent POM</strong> (published to Exchange/repo; children use <code>&lt;parent&gt;</code>)</td></tr>
<tr><td>Shared Java utilities</td><td>Plain JAR dependency (+ sharedLibraries if connectors need it)</td></tr>
<tr><td>Reusable flows/operations with versioning</td><td>Custom <strong>Mule plugin</strong> / connector (Mule SDK or packaged module) on Exchange</td></tr>
<tr><td>Shared connector configs on one runtime</td><td><strong>Domain project</strong> (customer-hosted only)</td></tr>
<tr><td>Shared API types/traits/examples</td><td><strong>API fragments</strong> on Exchange, imported by specs</td></tr>
<tr><td>Shared DataWeave functions</td><td>DW library module (.dwl) packaged and published as a dependency</td></tr>
</table>

<h3>Versioning and configuration</h3>
<ul>
<li><strong>Semantic versioning</strong> MAJOR.MINOR.PATCH: breaking change → MAJOR (new API instance/URL, e.g. <code>/v2</code>); backwards-compatible feature → MINOR; fix → PATCH. Adding an optional field is minor; removing/renaming/retyping is major.</li>
<li><strong>Build once, deploy many:</strong> one artifact promoted through dev→test→prod. Environment differences via <code>\${env}.yaml</code> property files + deploy-time properties; secrets encrypted (secure properties) or injected by the pipeline; <code>mule-artifact.json</code>'s <code>secureProperties</code> list masks values in Runtime Manager.</li>
<li><code>mule-artifact.json</code> also pins <code>minMuleVersion</code> — deployment to an older runtime fails fast.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> memorize the lifecycle order and what <code>mvn deploy -DmuleDeploy</code> does vs plain <code>mvn deploy</code> (app deployment vs repository publish). Know why a JDBC driver goes in <code>sharedLibraries</code>, and that Exchange's groupId = organization ID.</p>`
    },
    {
      id: "d3",
      title: "Securing Data",
      weight: 20,
      topicDocs: {
        "TLS building blocks": "https://docs.mulesoft.com/mule-runtime/latest/tls-configuration",
        "Secure configuration properties": "https://docs.mulesoft.com/mule-runtime/latest/secure-configuration-properties",
        "Payload-level cryptography": "https://docs.mulesoft.com/mule-runtime/latest/cryptography",
        "API security policies (API Manager)": "https://docs.mulesoft.com/mule-gateway/policies-included-directory"
      },
      docs: [
        { label: "TLS configuration", url: "https://docs.mulesoft.com/mule-runtime/latest/tls-configuration" },
        { label: "Secure configuration properties", url: "https://docs.mulesoft.com/mule-runtime/latest/secure-configuration-properties" },
        { label: "Cryptography module", url: "https://docs.mulesoft.com/mule-runtime/latest/cryptography" },
        { label: "Included policies directory", url: "https://docs.mulesoft.com/mule-gateway/policies-included-directory" }
      ],
      objectives: [
        "Configure one-way and two-way (mutual) TLS on HTTP listeners and requesters",
        "Create and use keystores and truststores",
        "Encrypt property files with the Mule Secure Configuration Properties module",
        "Use the Cryptography module to encrypt/decrypt and sign payloads",
        "Apply security-related API policies (OAuth 2.0, JWT validation, client ID enforcement)",
        "Protect sensitive data in transit and at rest across environments"
      ],
      notes: `
<h3>TLS building blocks</h3>
<ul>
<li>A <strong>TLS Context</strong> (<code>tls:context</code>) is a reusable global element referenced by TLS-capable connectors (HTTP, FTPS, Email, Sockets…). It can hold a <strong>keystore</strong> (<code>tls:key-store</code>) and/or a <strong>truststore</strong> (<code>tls:trust-store</code>).</li>
<li><strong>Keystore = your identity</strong>: private key + certificate. Two passwords: the store's and the key's (<code>keyPassword</code>). <strong>Truststore = who you believe</strong>: public certificates of trusted parties/CAs. By default Mule trusts the JRE's CA truststore, so public-CA certificates need no custom truststore.</li>
<li>Formats: <strong>JKS</strong> (default), <strong>PKCS12</strong>, JCEKS — created and managed with <code>keytool</code> (match the JDK version the runtime uses).</li>
</ul>
<svg viewBox="0 0 640 240" style="max-width:640px;width:100%" role="img" aria-label="One-way vs two-way TLS">
  <style>.t-b{fill:none;stroke:currentColor;stroke-width:1.5}.t-t{font:600 13px sans-serif;fill:currentColor}.t-s{font:11.5px sans-serif;fill:currentColor;opacity:.75}.t-a{stroke:currentColor;stroke-width:1.2;marker-end:url(#tArr)}</style>
  <defs><marker id="tArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <text x="10" y="24" class="t-t">One-way TLS</text>
  <rect x="10" y="36" width="180" height="60" rx="8" class="t-b"/><text x="24" y="60" class="t-t">Client</text><text x="24" y="80" class="t-s">truststore (validate server)</text>
  <rect x="450" y="36" width="180" height="60" rx="8" class="t-b"/><text x="464" y="60" class="t-t">Server</text><text x="464" y="80" class="t-s">keystore (prove identity)</text>
  <line x1="192" y1="58" x2="446" y2="58" class="t-a"/><text x="240" y="50" class="t-s">server presents certificate</text>
  <text x="10" y="144" class="t-t">Two-way (mutual) TLS</text>
  <rect x="10" y="156" width="180" height="70" rx="8" class="t-b"/><text x="24" y="180" class="t-t">Client</text><text x="24" y="198" class="t-s">truststore + keystore</text>
  <rect x="450" y="156" width="180" height="70" rx="8" class="t-b"/><text x="464" y="180" class="t-t">Server</text><text x="464" y="198" class="t-s">keystore + truststore</text>
  <line x1="192" y1="176" x2="446" y2="176" class="t-a"/><text x="240" y="168" class="t-s">server certificate →</text>
  <line x1="446" y1="206" x2="192" y2="206" class="t-a"/><text x="240" y="222" class="t-s">← client certificate</text>
</svg>
<table>
<tr><th>Scenario</th><th>Listener (server) needs</th><th>Requester (client) needs</th></tr>
<tr><td>Expose HTTPS (one-way)</td><td>Keystore</td><td>Truststore only if the cert isn't publicly trusted</td></tr>
<tr><td>Call HTTPS with private/self-signed cert</td><td>—</td><td>Truststore with that cert/CA</td></tr>
<tr><td>Mutual TLS</td><td>Keystore + truststore, client auth required</td><td>Keystore + truststore</td></tr>
</table>
<ul>
<li><code>insecure="true"</code> on a truststore disables validation — <strong>prototyping only, never production</strong>.</li>
<li>Protocols/ciphers restricted at two levels: runtime (<code>tls-default.conf</code> in <code>$MULE_HOME/conf</code>, or FIPS mode with <code>tls-fips140-2.conf</code>) and app (<code>enabledProtocols</code>, <code>enabledCipherSuites</code>) — a protocol must be enabled in <em>both</em> to be used.</li>
</ul>

<h3>Secure configuration properties</h3>
<ol>
<li>Encrypt values with the <strong>Secure Properties Tool</strong> JAR: <code>java -cp secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool string encrypt AES CBC myKey "myPassword"</code>. Methods: <code>string</code> (one value), <code>file</code> (each value in a file), <code>file-level</code> (the whole file). Algorithms: AES (typical), Blowfish, DES(ede)…; modes: <strong>CBC (default)</strong>, CFB, ECB, OFB.</li>
<li>Put the result in the properties file wrapped as <code>![encryptedValue]</code> — no spaces/characters after the bracket (trailing spaces break decryption):
<pre><code>db:
  password: "![kD8s2n...==]"</code></pre></li>
<li>Add a <strong>Secure Properties Config</strong> global element (Mule Secure Configuration Properties module): file, key <code>\${secure.key}</code>, algorithm/mode matching the encryption.</li>
<li>Reference with the <strong>mandatory <code>secure::</code> prefix</strong> — for every property in a secure file, even unencrypted ones: <code>\${secure::db.password}</code>.</li>
<li>Pass the key at deploy time, never in code: <code>-Dsecure.key=myKey</code> / a <em>hidden</em> Runtime Manager property / CI-injected secret.</li>
</ol>
<p><code>mule-artifact.json</code>'s <code>secureProperties</code> array additionally <strong>masks</strong> named properties in Runtime Manager UIs/APIs (masking ≠ encryption — you typically want both).</p>

<h3>Payload-level cryptography</h3>
<p>The <strong>Cryptography module</strong> protects data at rest / end-to-end (beyond transport TLS): <strong>PGP</strong> (encrypt/decrypt/sign/verify with key rings), <strong>JCE</strong> (symmetric/asymmetric Java crypto), <strong>XML</strong> (XML encryption/signature). Use when files or messages must remain encrypted wherever they land (e.g. PGP-encrypt a file before SFTP upload).</p>

<h3>API security policies (API Manager)</h3>
<table>
<tr><th>Policy</th><th>What it validates</th><th>Notes</th></tr>
<tr><td>Client ID enforcement</td><td>client_id/client_secret of a registered, contracted consumer</td><td>Identity of the <em>application</em>; enables SLA tiers</td></tr>
<tr><td>OAuth 2.0 access token enforcement</td><td>Bearer token against the authorization server (introspection)</td><td>Supports scopes; needs the provider configured</td></tr>
<tr><td>JWT validation</td><td>Signed JWT locally: signature (JWKS or shared secret), expiry, audience/claims</td><td>No per-request round trip to the provider — lower latency</td></tr>
<tr><td>Basic authentication</td><td>Username/password (simple/LDAP)</td><td>Legacy/internal use</td></tr>
<tr><td>IP allowlist / blocklist</td><td>Source IP</td><td>Network-level complement, not identity</td></tr>
</table>
<p><strong>Defense in depth:</strong> TLS for transport → gateway policies for authN/authZ and abuse control → secure properties for configuration secrets → cryptography for payloads → per-environment keys/certs (never share prod secrets with dev). HTTPS should also protect the connection between a proxy/gateway and the backend ("last mile").</p>
<p class="tip"><strong>Exam tip:</strong> map the failure to the missing piece — handshake fails calling a self-signed service → client truststore; server must identify callers by certificate → mutual TLS (server adds truststore + requires client auth); "decryption fails" with correct key → check <code>![...]</code> wrapping/trailing spaces and algorithm/mode match; property readable in RM UI → add to <code>secureProperties</code>.</p>`
    }
  ]
};
