// MCD Level 1 — expanded study notes, sections 1–6 (based on docs.mulesoft.com)
window.CERT_DATA = window.CERT_DATA || {};
window.CERT_DATA.mcd1 = {
  id: "mcd1",
  name: "MuleSoft Certified Developer – Level 1",
  short: "MCD Level 1",
  exam: { questions: 60, minutes: 120, passPct: 70 },
  questions: [],
  sections: [
    {
      id: "s1",
      title: "Explaining Application Network Basics",
      weight: 7,
      topicDocs: {
        "The IT delivery gap": "https://docs.mulesoft.com/general/api-led-overview",
        "API-led connectivity — the three layers": "https://docs.mulesoft.com/general/api-led-overview",
        "Modern APIs": "https://docs.mulesoft.com/general/api-led-overview",
        "Center for Enablement (C4E)": "https://docs.mulesoft.com/general/",
        "HTTP fundamentals": "https://docs.mulesoft.com/http-connector/latest/",
        "Anypoint Platform components": "https://docs.mulesoft.com/general/"
      },
      docs: [
        { label: "API-led connectivity overview", url: "https://docs.mulesoft.com/general/api-led-overview" },
        { label: "Anypoint Platform docs", url: "https://docs.mulesoft.com/general/" }
      ],
      objectives: [
        "Explain MuleSoft's proposal for closing the IT delivery gap",
        "Describe the characteristics and benefits of modern APIs and API-led connectivity",
        "Describe the role of a Center for Enablement (C4E)",
        "Define the basic elements of HTTP requests and responses",
        "Describe the capabilities and high-level components of Anypoint Platform"
      ],
      notes: `
<h3>The IT delivery gap</h3>
<p>Business demand on IT grows every year (new channels, SaaS apps, mobile, IoT), but IT delivery capacity stays roughly flat when every project is a custom <strong>point-to-point integration</strong>. Point-to-point creates tight coupling: every new connection is bespoke code, changes ripple unpredictably, and nothing is reusable. The gap between what the business asks for and what IT can deliver keeps widening.</p>
<p><strong>MuleSoft's proposal:</strong> build an <strong>application network</strong> — a network of applications, data, and devices connected with <em>reusable, discoverable, self-serve APIs</em>. Key properties of an application network:</p>
<ul>
<li>It is <strong>built incrementally</strong>, project by project ("bendable, not breakable"). Each project consumes existing APIs and contributes new ones, so delivery gets <em>faster</em> over time.</li>
<li>Nodes are <strong>loosely coupled</strong>: consumers depend on API contracts, not implementations, so implementations can change without breaking consumers.</li>
<li>Assets are <strong>discoverable and self-serve</strong> through Anypoint Exchange — teams find and reuse instead of rebuilding.</li>
<li>It is <strong>recomposable</strong>: existing APIs are rewired into new products and channels quickly.</li>
</ul>

<h3>API-led connectivity — the three layers</h3>
<svg viewBox="0 0 620 300" style="max-width:620px;width:100%" role="img" aria-label="API-led connectivity layers">
  <style>.al-box{fill:none;stroke:currentColor;stroke-width:1.5;rx:8}.al-t{font:600 14px sans-serif;fill:currentColor}.al-s{font:12px sans-serif;fill:currentColor;opacity:.75}.al-a{stroke:currentColor;stroke-width:1.2;marker-end:url(#alArr)}</style>
  <defs><marker id="alArr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <rect x="10" y="10" width="600" height="80" class="al-box" style="fill:rgba(14,111,190,.10)"/>
  <text x="24" y="38" class="al-t">Experience APIs</text>
  <text x="24" y="60" class="al-s">Reconfigure data for a specific channel: mobile app, web storefront, partner portal</text>
  <rect x="10" y="110" width="600" height="80" class="al-box" style="fill:rgba(0,162,223,.10)"/>
  <text x="24" y="138" class="al-t">Process APIs</text>
  <text x="24" y="160" class="al-s">Orchestrate and shape data; business logic independent of source systems and channels</text>
  <rect x="10" y="210" width="600" height="80" class="al-box" style="fill:rgba(30,142,78,.10)"/>
  <text x="24" y="238" class="al-t">System APIs</text>
  <text x="24" y="260" class="al-s">Unlock core systems of record (DBs, SaaS, legacy) and insulate consumers from change</text>
  <line x1="310" y1="90" x2="310" y2="108" class="al-a"/><line x1="310" y1="190" x2="310" y2="208" class="al-a"/>
</svg>
<ul>
<li><strong>System APIs</strong> — mediate access to a core system (one system, canonical data model). They hide complexity (SOAP, JDBC, proprietary formats) and shield consumers from system changes/migrations.</li>
<li><strong>Process APIs</strong> — encapsulate business processes that interact with and shape data across systems (e.g. "create order" touching CRM + ERP). They are independent of both the source systems and the delivery channels.</li>
<li><strong>Experience APIs</strong> — reconfigure data so it is easily consumed by its intended audience/channel, without duplicating process logic per channel.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> given a scenario ("an API that aggregates customer data from three systems for a mobile app"), be able to place each API in the correct layer. Aggregation/orchestration → Process; channel-specific shaping → Experience; direct system unlock → System.</p>

<h3>Modern APIs</h3>
<p>MuleSoft describes <em>modern APIs</em> as having three characteristics: they are treated as <strong>products</strong> (designed for and marketed to consumers, with a lifecycle), they are <strong>discoverable and self-describing</strong> (documentation, specs, examples in Exchange), and they are <strong>managed</strong> (secured, monitored, governed with policies and SLAs).</p>

<h3>Center for Enablement (C4E)</h3>
<p>A <strong>C4E</strong> is a cross-functional team (IT + line-of-business members) that <em>enables</em> the rest of the organization instead of delivering everything itself:</p>
<ul>
<li>Builds and publishes reusable assets (APIs, templates, examples, best-practice guides) as <strong>products</strong>.</li>
<li>Establishes and evangelizes best practices; supports and trains project teams.</li>
<li><strong>Measures consumption</strong> of assets (KPIs like reuse rate) — the network's value grows with reuse.</li>
</ul>
<p>Contrast with a traditional <strong>Center of Excellence (CoE)</strong>: a CoE centralizes delivery ("do it for the teams"), which becomes a bottleneck; a C4E decentralizes delivery and centralizes enablement.</p>

<h3>HTTP fundamentals</h3>
<table>
<tr><th>Method</th><th>Purpose</th><th>Has body?</th><th>Idempotent?</th></tr>
<tr><td>GET</td><td>Retrieve a resource/collection</td><td>No</td><td>Yes (safe)</td></tr>
<tr><td>POST</td><td>Create a resource / process data</td><td>Yes</td><td>No</td></tr>
<tr><td>PUT</td><td>Replace a resource at a known URI (create-or-replace)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>PATCH</td><td>Partially update a resource</td><td>Yes</td><td>No (in general)</td></tr>
<tr><td>DELETE</td><td>Remove a resource</td><td>No</td><td>Yes</td></tr>
</table>
<p>An HTTP <strong>request</strong> = method + URI (+ query string) + protocol version + headers + optional body. An HTTP <strong>response</strong> = status line + headers + optional body. Common status codes:</p>
<table>
<tr><th>Code</th><th>Meaning</th></tr>
<tr><td>200 / 201 / 202 / 204</td><td>OK / Created / Accepted (async) / No Content</td></tr>
<tr><td>301 / 304</td><td>Moved Permanently / Not Modified</td></tr>
<tr><td>400 / 401 / 403 / 404 / 405 / 415 / 429</td><td>Bad Request / Unauthorized (not authenticated) / Forbidden (not authorized) / Not Found / Method Not Allowed / Unsupported Media Type / Too Many Requests (rate limit)</td></tr>
<tr><td>500 / 502 / 503 / 504</td><td>Internal Server Error / Bad Gateway / Service Unavailable / Gateway Timeout</td></tr>
</table>

<h3>Anypoint Platform components</h3>
<table>
<tr><th>Area</th><th>Component</th><th>What it does</th></tr>
<tr><td rowspan="2">Design</td><td>Design Center (API Designer)</td><td>Web tool to write API specifications (RAML/OAS) and build fragments; includes the mocking service</td></tr>
<tr><td>Anypoint Studio / Code Builder</td><td>Desktop/cloud IDEs to implement, test, and debug Mule applications</td></tr>
<tr><td>Share &amp; discover</td><td>Anypoint Exchange</td><td>Catalog of reusable assets: specs, fragments, connectors, templates, examples, custom policies; generates API portals and REST Connect connectors</td></tr>
<tr><td rowspan="4">Manage (control plane)</td><td>API Manager</td><td>Create/manage API instances, apply policies, SLA tiers, contracts, alerts, proxies</td></tr>
<tr><td>Runtime Manager</td><td>Deploy, manage, scale, and monitor applications on any deployment target</td></tr>
<tr><td>Access Management</td><td>Users, roles, permissions, business groups, environments, connected apps</td></tr>
<tr><td>Anypoint Monitoring / Visualizer</td><td>Dashboards, logs, alerts / real-time visualization of the application network</td></tr>
<tr><td>Run (runtime plane)</td><td>Mule runtime</td><td>Runs apps on CloudHub (MuleSoft-hosted), Runtime Fabric (containers), or customer-hosted servers</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> know which component does what. "Where do consumers discover and request access to an API?" → Exchange. "Where are policies applied?" → API Manager. "Where do you scale workers?" → Runtime Manager.</p>`
    },
    {
      id: "s2",
      title: "Designing and Consuming APIs",
      weight: 8,
      topicDocs: {
        "The design-first API lifecycle": "https://docs.mulesoft.com/design-center/design-create-publish-api-specs",
        "RAML essentials": "https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md",
        "Reuse in RAML": "https://docs.mulesoft.com/exchange/asset-types",
        "Consuming APIs": "https://docs.mulesoft.com/exchange/"
      },
      docs: [
        { label: "Design an API spec (Design Center)", url: "https://docs.mulesoft.com/design-center/design-create-publish-api-specs" },
        { label: "RAML 1.0 specification", url: "https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md" }
      ],
      objectives: [
        "Describe the lifecycle of the modern API (design, simulate, feedback, validate)",
        "Use RAML to define API resources, nested resources, and methods",
        "Identify when to use query parameters vs URI parameters",
        "Use RAML to define request/response bodies, headers, and status codes",
        "Use RAML to define reusable data types and format-independent examples",
        "Formulate RESTful requests from a RAML API specification"
      ],
      notes: `
<h3>The design-first API lifecycle</h3>
<p>Modern APIs are designed <em>before</em> they are implemented: <strong>design → simulate → get feedback → validate</strong>, iterating until consumers agree the contract is right. Only then is the API implemented, tested, deployed, and managed. Tools per stage:</p>
<ul>
<li><strong>Design</strong> — API Designer (Design Center) writing RAML or OAS.</li>
<li><strong>Simulate</strong> — the <strong>mocking service</strong> serves responses straight from the spec's <code>examples</code>, giving consumers a live endpoint before any code exists.</li>
<li><strong>Feedback</strong> — publish to <strong>Exchange</strong>; consumers explore the auto-generated API console/portal and comment.</li>
<li><strong>Validate</strong> — refine the spec until it is stable; it becomes the contract that APIkit later enforces.</li>
</ul>

<h3>RAML essentials</h3>
<pre><code>#%RAML 1.0
title: American Flights API
version: v1
baseUri: http://localhost:8081/api

types:
  AmericanFlight: !include dataTypes/american-flight.raml

/flights:
  get:
    queryParameters:
      destination:
        required: false
        enum: [SFO, LAX, CLE]
    responses:
      200:
        body:
          application/json:
            type: AmericanFlight[]
            examples: !include examples/AmericanFlightsExample.raml
  post:
    body:
      application/json:
        type: AmericanFlight
    responses:
      201:
        body:
          application/json:
            example: {"message": "Flight added"}
  /{ID}:
    get:
      responses:
        200:
          body:
            application/json:
              type: AmericanFlight
    put:
    delete:</code></pre>
<ul>
<li>RAML is <strong>YAML-based</strong>: indentation defines nesting, and it is case-sensitive.</li>
<li><strong>Resources</strong> begin with <code>/</code>; nesting a resource under another creates a sub-path (<code>/flights/{ID}</code>).</li>
<li><strong>URI parameters</strong> use <code>{curlyBraces}</code> and identify a <em>specific resource</em>. <strong>Query parameters</strong> are declared under a method's <code>queryParameters:</code> and <em>filter/sort/paginate</em> collections. Rule of thumb: identity → URI parameter; refinement of a result set → query parameter.</li>
<li>Each method can declare <code>headers:</code>, <code>body:</code> (per media type), and <code>responses:</code> (per status code, each with its own body/type/example).</li>
</ul>

<h3>Reuse in RAML</h3>
<table>
<tr><th>Mechanism</th><th>Scope</th><th>Example use</th></tr>
<tr><td><code>types:</code> / DataType fragment</td><td>Data structures</td><td><code>type: AmericanFlight</code> shared by requests and responses</td></tr>
<tr><td>NamedExample fragment</td><td>Example instances</td><td>One example file reused by several methods (format-independent)</td></tr>
<tr><td><code>traits:</code> (applied with <code>is:</code>)</td><td>Method-level patterns</td><td>Pagination query params, standard error responses, auth headers</td></tr>
<tr><td><code>resourceTypes:</code> (applied with <code>type:</code>)</td><td>Resource-level patterns</td><td>Standard "collection" and "member" resource shapes</td></tr>
<tr><td>Library (<code>uses:</code>)</td><td>Bundle of types/traits/etc.</td><td>Common enterprise definitions shared across specs</td></tr>
<tr><td>Overlay / Extension</td><td>Whole spec</td><td>Add annotations/translations (overlay) or environment additions (extension) without touching the master spec</td></tr>
</table>
<p>Fragments (<code>#%RAML 1.0 DataType</code>, <code>Trait</code>, <code>NamedExample</code>…) can live in separate files included with <code>!include</code>, or be published to <strong>Exchange as reusable assets</strong> and imported into many API specs as dependencies.</p>
<p>A RAML <strong>data type</strong> defines fields, types, and constraints:</p>
<pre><code>#%RAML 1.0 DataType
type: object
properties:
  ID: integer
  code:
    type: string
    pattern: "[A-Z]{3}\\\\d{3}"
  price:
    type: number
    required: false</code></pre>

<h3>Consuming APIs</h3>
<ul>
<li>To call an API from a spec: match method + full path (baseUri + resource) + required parameters/headers/body. E.g. from the spec above: <code>GET http://localhost:8081/api/flights?destination=SFO</code> or <code>POST /api/flights</code> with a JSON AmericanFlight body.</li>
<li>When a spec is published to Exchange, <strong>REST Connect</strong> automatically generates a <strong>REST Connector</strong> (one operation per method) that can be dragged into a Mule flow — an alternative to configuring raw HTTP Request operations.</li>
<li>The <strong>API console</strong> (in Design Center or Exchange) and the <strong>mocking service</strong> let anyone try requests without an implementation.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> expect questions that show a RAML snippet and ask which request is valid (correct path nesting, query vs URI parameter, required vs optional). Read the indentation carefully — it defines what belongs to what.</p>`
    },
    {
      id: "s3",
      title: "Accessing and Modifying Mule Events",
      weight: 10,
      topicDocs: {
        "Anatomy of a Mule event": "https://docs.mulesoft.com/mule-runtime/latest/about-mule-event",
        "The golden rule of attributes": "https://docs.mulesoft.com/mule-runtime/latest/about-mule-event",
        "Accessing event data with DataWeave": "https://docs.mulesoft.com/dataweave/latest/dataweave-selectors",
        "Setting event data": "https://docs.mulesoft.com/mule-runtime/latest/dataweave",
        "Enrichment with target parameters": "https://docs.mulesoft.com/mule-runtime/latest/target-variables"
      },
      docs: [
        { label: "Mule events", url: "https://docs.mulesoft.com/mule-runtime/latest/about-mule-event" },
        { label: "DataWeave selectors", url: "https://docs.mulesoft.com/dataweave/latest/dataweave-selectors" }
      ],
      objectives: [
        "Describe the Mule event data structure (message payload, attributes, variables)",
        "Use transformers to set the payload, attributes, and variables",
        "Write DataWeave expressions to access and modify payload, attributes, and variables",
        "Enrich Mule events using target parameters"
      ],
      notes: `
<h3>Anatomy of a Mule event</h3>
<figure><img src="images/mule-concepts-d46f9.png" alt="Mule event structure: a Mule event contains a Mule message (attributes + payload) and variables"><figcaption>The Mule event: a <strong>Mule message</strong> (payload + attributes) plus <strong>variables</strong> <em>(source: docs.mulesoft.com)</em></figcaption></figure>
<ul>
<li><strong>Payload</strong> — the body/data being processed. Can be any type: JSON, XML, Java object, stream…</li>
<li><strong>Attributes</strong> — metadata that arrived with the message. For an HTTP Listener: <code>attributes.queryParams</code>, <code>attributes.uriParams</code>, <code>attributes.headers</code>, <code>attributes.method</code>, <code>attributes.requestPath</code>. For a File listener: file name, size, timestamps.</li>
<li><strong>Variables (vars)</strong> — data <em>you</em> attach to the event; they live for the rest of the flow and travel through Flow References.</li>
</ul>
<p>The Mule event is <strong>immutable</strong> — every change creates a new event instance behind the scenes. Practically, this means each processor receives the event produced by the previous one.</p>
<figure><img src="images/about-mule-event-2724e.png" alt="An event source triggers a flow; the Mule event travels through each event processor in order"><figcaption>An <strong>event source</strong> (HTTP Listener, Scheduler, On New or Updated File…) creates the event; it then travels through each <strong>event processor</strong> in order <em>(source: docs.mulesoft.com)</em></figcaption></figure>

<h3>The golden rule of attributes</h3>
<p>Every time the event passes through a <strong>connector operation</strong> (HTTP Request, Database Select, File Read…), the message is <em>replaced</em>: the payload becomes the operation's result AND the <strong>attributes are replaced</strong> with metadata about that result (e.g. HTTP response status and headers). If you need the original query params later, <strong>save them to a variable first</strong>.</p>

<h3>Accessing event data with DataWeave</h3>
<pre><code>payload                              // whole payload
payload.customer.lastName            // field navigation
payload[0].price                     // array index
attributes.queryParams.destination   // ?destination=SFO
attributes.uriParams.ID              // /flights/{ID}
attributes.headers.'client_id'       // request header
vars.myVar                           // a variable
vars.order.items[0]                  // variables hold any structure
correlationId                        // event correlation ID
message                              // the whole message (payload+attributes)</code></pre>
<p>Inline expressions inside component fields use <code>#[ ... ]</code>, e.g. a Logger message of <code>#['Got flight ' ++ attributes.uriParams.ID]</code>. Property placeholders (<code>\${http.port}</code>) are resolved at startup and are NOT DataWeave.</p>

<h3>Setting event data</h3>
<table>
<tr><th>Component</th><th>Sets</th><th>Notes</th></tr>
<tr><td>Transform Message</td><td>payload, any variable, attributes</td><td>Full DataWeave script per output; the primary transformation tool</td></tr>
<tr><td>Set Payload</td><td>payload</td><td>Value field accepts literals or <code>#[expressions]</code>; can set MIME type</td></tr>
<tr><td>Set Variable</td><td>one variable</td><td>Name + value (literal or expression)</td></tr>
<tr><td>Remove Variable</td><td>—</td><td>Deletes a variable from the event</td></tr>
</table>

<h3>Enrichment with target parameters</h3>
<p>Most connector operations expose <strong>target</strong> and <strong>target value</strong> parameters. Setting <code>target = flightData</code> (and optionally <code>targetValue = #[payload.data]</code>) stores the operation's result in <code>vars.flightData</code> and <strong>leaves the current payload untouched</strong> — the Mule 4 replacement for Mule 3's message enricher. Use it whenever you must combine "what I have" with "what another system returns".</p>
<p class="tip"><strong>Exam tip:</strong> after an HTTP Request with <code>target=response</code>, the payload is <em>unchanged</em> and <code>vars.response</code> holds the response body. Without a target, payload = response body and attributes = response metadata. Both facts are heavily tested.</p>`
    },
    {
      id: "s4",
      title: "Structuring Mule Applications",
      weight: 10,
      topicDocs: {
        "Project structure": "https://docs.mulesoft.com/mule-runtime/latest/package-a-mule-application",
        "Property placeholders": "https://docs.mulesoft.com/mule-runtime/latest/configuring-properties",
        "Global configurations": "https://docs.mulesoft.com/mule-runtime/latest/global-elements",
        "Flows, private flows, subflows": "https://docs.mulesoft.com/mule-runtime/latest/about-flows",
        "Async scope": "https://docs.mulesoft.com/mule-runtime/latest/async-scope-reference",
        "Domain projects": "https://docs.mulesoft.com/mule-runtime/latest/shared-resources"
      },
      docs: [
        { label: "Flows and subflows", url: "https://docs.mulesoft.com/mule-runtime/latest/about-flows" },
        { label: "Configuring properties", url: "https://docs.mulesoft.com/mule-runtime/latest/configuring-properties" },
        { label: "Shared resources (domains)", url: "https://docs.mulesoft.com/mule-runtime/latest/shared-resources" }
      ],
      objectives: [
        "Parameterize an application using property placeholders",
        "Define and reuse global configurations in an application",
        "Break an application into multiple flows using flow references, private flows, and subflows",
        "Specify what data is persisted between flows and across a flow reference",
        "Describe the purpose of domain projects"
      ],
      notes: `
<h3>Project structure</h3>
<pre><code>my-app/
├── pom.xml                     &lt;- Maven build (dependencies, plugins)
├── mule-artifact.json          &lt;- app descriptor (minMuleVersion, secureProperties)
└── src/
    ├── main/
    │   ├── mule/               &lt;- Mule configuration XMLs (flows, global elements)
    │   └── resources/          &lt;- properties files, DW modules, examples, log4j2.xml
    └── test/
        ├── munit/              &lt;- MUnit test suites
        └── resources/</code></pre>

<h3>Property placeholders</h3>
<p>Externalize anything environment-specific (hosts, ports, credentials, paths):</p>
<pre><code># src/main/resources/config/dev.yaml
db:
  host: "dev-db.acme.com"
  port: "3306"
http:
  listener:
    port: "8081"</code></pre>
<ul>
<li>Register the file with a <strong>Configuration properties</strong> global element. Parameterize the file name itself to switch environments: <code>config/\${env}.yaml</code>, then run with <code>-Denv=dev</code> (in Studio: Run Configuration → VM arguments <code>-Denv=dev -M-Denv=dev</code> pattern for Maven).</li>
<li>Reference values as <code>\${db.host}</code> in any configuration field, or <code>p('db.host')</code> inside DataWeave.</li>
<li>Precedence: deployment/system properties (<code>-D</code>, Runtime Manager properties) <strong>override</strong> file values — this is how the same JAR runs in every environment.</li>
<li>Secrets should use <em>secure</em> configuration properties (encrypted) — covered in depth in MCD L2, but know they exist and use the <code>secure::</code> prefix.</li>
</ul>

<h3>Global configurations</h3>
<p>Connector configurations (HTTP Listener config, HTTP Request config, Database config…) are <strong>global elements</strong>: defined once, referenced by any number of operations. Best practice is to keep them in a dedicated config file (e.g. <code>global.xml</code>) so they're easy to find and reuse across the app's XML files — all files are combined at deployment.</p>

<h3>Flows, private flows, subflows</h3>
<table>
<tr><th></th><th>Flow</th><th>Private flow</th><th>Subflow</th></tr>
<tr><td>Event source</td><td>Yes (optional but typical)</td><td>No</td><td>No</td></tr>
<tr><td>Own error handling</td><td>Yes</td><td>Yes</td><td><strong>No</strong> — inherits caller's</td></tr>
<tr><td>Invoked by</td><td>Source or Flow Reference</td><td>Flow Reference</td><td>Flow Reference</td></tr>
<tr><td>Performance</td><td>—</td><td>—</td><td>Slightly faster (no extra context)</td></tr>
<tr><td>Callable from DataWeave <code>lookup()</code></td><td>Yes</td><td>Yes</td><td><strong>No</strong></td></tr>
</table>
<p>A <strong>Flow Reference</strong> passes the <em>entire event</em> (payload + attributes + variables) into the referenced flow synchronously. Changes made there (payload, new variables) <strong>return to the caller</strong>. This is fundamentally different from crossing a <strong>transport boundary</strong>:</p>
<ul>
<li>App A calls App B over HTTP → only the payload (and headers you set) cross; <strong>variables and attributes do NOT</strong>.</li>
<li>App B receives a brand-new event with its own attributes (from B's HTTP Listener) and empty vars.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> "A flow sets var X then calls another flow in the same app via Flow Reference — is X visible?" YES. "…calls another Mule app via HTTP Request — is X visible there?" NO.</p>

<h3>Async scope</h3>
<p>The <strong>Async scope</strong> runs its processors in a separate thread and the flow continues immediately — use it for fire-and-forget work (audit logging, notifications) that shouldn't delay the response. The async branch gets a <em>copy</em> of the event; its changes don't come back.</p>

<h3>Domain projects</h3>
<p>A <strong>Mule domain</strong> is a special project that holds shared global configurations. Applications deployed to the <em>same customer-hosted runtime</em> can reference one domain and share, e.g., a single HTTP Listener config — meaning several apps share one port. Domains reduce duplicated config and resource usage, but: <strong>not supported on CloudHub</strong> (each CloudHub app runs isolated on its own worker), all apps must be deployed alongside the domain, and redeploying the domain restarts its apps.</p>`
    },
    {
      id: "s5",
      title: "Building API Implementation Interfaces",
      weight: 7,
      topicDocs: {
        "Manual RESTful interfaces": "https://docs.mulesoft.com/http-connector/latest/",
        "APIkit": "https://docs.mulesoft.com/apikit/latest/",
        "How the APIkit Router works": "https://docs.mulesoft.com/apikit/latest/",
        "Keeping spec and implementation in sync": "https://docs.mulesoft.com/apikit/latest/",
        "REST Connect connectors": "https://docs.mulesoft.com/exchange/"
      },
      docs: [
        { label: "APIkit", url: "https://docs.mulesoft.com/apikit/latest/" }
      ],
      objectives: [
        "Manually create a RESTful interface for a Mule application",
        "Generate a REST Connector from a RAML specification",
        "Describe the features and benefits of APIkit",
        "Use APIkit to create implementation flows from a RAML file",
        "Describe how requests are routed through flows generated by APIkit"
      ],
      notes: `
<h3>Manual RESTful interfaces</h3>
<p>You can hand-build an interface: one HTTP Listener per resource/method (paths like <code>/flights/{ID}</code>, listener metadata gives <code>attributes.uriParams</code>), or one listener with wildcard path (<code>/*</code>) plus Choice routers on <code>attributes.requestPath</code> and <code>attributes.method</code>. It works, but you must implement validation, error responses, and routing yourself — and nothing guarantees you stay in sync with the API specification. That is the problem <strong>APIkit</strong> solves.</p>

<h3>APIkit</h3>
<p>APIkit is an open-source toolkit that <strong>scaffolds a Mule application from an API specification</strong> (RAML or OAS; newer versions also support AsyncAPI, GraphQL, OData, SOAP via APIkit for SOAP). Import the spec from Exchange or the filesystem into a Mule project, and scaffolding generates:</p>
<ul>
<li>The <strong>main flow</strong>: HTTP Listener (default path <code>/api/*</code>) → <strong>APIkit Router</strong>, plus an error handler with mappings for the standard APIkit errors.</li>
<li><strong>One implementation flow per resource/method pair</strong>, named by strict convention: <code>get:\\flights:american-flights-api-config</code>, <code>get:\\flights\\(ID):american-flights-api-config</code>, <code>post:\\flights:application\\json:american-flights-api-config</code> (the media type appears when a request body is declared). <strong>The flow name is the routing contract — never rename it.</strong></li>
<li>A <strong>console flow</strong> exposing the interactive API console (default path <code>/console/*</code>).</li>
</ul>

<h3>How the APIkit Router works</h3>
<ol>
<li><strong>Validates</strong> each incoming request against the specification: path exists, method allowed, required query params/headers present, body matches the declared type.</li>
<li><strong>Routes</strong> valid requests to the implementation flow whose <em>name</em> matches the method + resource (+ media type) + router config name.</li>
<li>Populates <code>attributes.uriParams</code> and <code>attributes.queryParams</code>.</li>
<li><strong>Serializes</strong> the flow's output as the HTTP response; sets the status code (200 by default, or whatever the flow sets in <code>attributes</code> / the listener's response builder).</li>
</ol>
<p>Validation failures raise typed errors mapped by the generated error handler:</p>
<table>
<tr><th>APIkit error</th><th>HTTP status</th></tr>
<tr><td>APIKIT:BAD_REQUEST</td><td>400</td></tr>
<tr><td>APIKIT:NOT_FOUND</td><td>404</td></tr>
<tr><td>APIKIT:METHOD_NOT_ALLOWED</td><td>405</td></tr>
<tr><td>APIKIT:NOT_ACCEPTABLE</td><td>406</td></tr>
<tr><td>APIKIT:UNSUPPORTED_MEDIA_TYPE</td><td>415</td></tr>
<tr><td>APIKIT:NOT_IMPLEMENTED</td><td>501</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> a request for a resource that exists in the spec but has no implementation flow yet → the scaffolded flow returns the spec's example (if scaffolded with examples) — while a path that isn't in the spec at all → <code>APIKIT:NOT_FOUND</code> → 404. A missing required query param → <code>APIKIT:BAD_REQUEST</code> → 400.</p>

<h3>Keeping spec and implementation in sync</h3>
<ul>
<li>Update the RAML → right-click the API in Studio → <em>Scaffold flows from these API specifications</em>: new resource/method pairs get new flows; existing implementation flows are preserved.</li>
<li>The spec can be kept as a <strong>design library dependency from Exchange</strong>, so implementation always tracks the published contract version.</li>
</ul>

<h3>REST Connect connectors</h3>
<p>When an API specification is published to <strong>Exchange</strong>, the platform auto-generates a <strong>REST Connector</strong> (REST Connect). Consumers add it from Exchange to their Mule project and get one typed operation per method — with fields for parameters and metadata for DataSense — instead of hand-configuring HTTP Request URLs. If the connector can't be generated, consumers can still download the spec or call the API with plain HTTP Request.</p>`
    },
    {
      id: "s6",
      title: "Routing Events",
      weight: 8,
      topicDocs: {
        "Choice router — conditional, exactly one route": "https://docs.mulesoft.com/mule-runtime/latest/choice-router-concept",
        "Scatter-Gather — concurrent multicast": "https://docs.mulesoft.com/mule-runtime/latest/scatter-gather-concept",
        "Other routers (know they exist)": "https://docs.mulesoft.com/mule-runtime/latest/choice-router-concept",
        "Validation module": "https://docs.mulesoft.com/validation-connector/latest/"
      },
      docs: [
        { label: "Choice router", url: "https://docs.mulesoft.com/mule-runtime/latest/choice-router-concept" },
        { label: "Scatter-Gather", url: "https://docs.mulesoft.com/mule-runtime/latest/scatter-gather-concept" },
        { label: "Validation module", url: "https://docs.mulesoft.com/validation-connector/latest/" }
      ],
      objectives: [
        "Use the Choice router to route events based on conditional logic",
        "Use the Scatter-Gather router to multicast events",
        "Validate data using the Validation module"
      ],
      notes: `
<h3>Choice router — conditional, exactly one route</h3>
<pre><code>&lt;choice&gt;
  &lt;when expression="#[payload.destination == 'SFO']"&gt;
    ... route 1 ...
  &lt;/when&gt;
  &lt;when expression="#[payload.destination == 'LAX']"&gt;
    ... route 2 ...
  &lt;/when&gt;
  &lt;otherwise&gt;
    ... default route ...
  &lt;/otherwise&gt;
&lt;/choice&gt;</code></pre>
<ul>
<li>Routes are evaluated <strong>top to bottom</strong>; the <strong>first</strong> expression returning <code>true</code> wins — order your conditions from most to least specific.</li>
<li>If nothing matches and there is no <code>otherwise</code>, the event continues unchanged past the router.</li>
<li>Equivalent to if / else-if / else. For value-based transformation, a DataWeave <code>if/else</code> or <code>match</code> inside a Transform is often cleaner than a Choice.</li>
</ul>

<h3>Scatter-Gather — concurrent multicast</h3>
<ul>
<li>Sends a <strong>copy of the event to every route concurrently</strong> (minimum two routes) and <strong>waits for all</strong> to finish (configurable <code>timeout</code>).</li>
<li>The result is a new payload: an <strong>object keyed by route index</strong>, each entry holding that route's full Mule message:</li>
</ul>
<pre><code>{
  "0": { "attributes": {...}, "payload": [ ...route 0 result... ] },
  "1": { "attributes": {...}, "payload": [ ...route 1 result... ] }
}</code></pre>
<p>Typical aggregation after the router:</p>
<pre><code>%dw 2.0
output application/json
---
flatten(payload pluck $.payload)   // merge all route payloads into one array</code></pre>
<ul>
<li><strong>Error behavior:</strong> all routes still run; if any fail, the router raises <code>MULE:COMPOSITE_ROUTING</code> aggregating each route's error. To tolerate partial failure, put a Try scope (with On Error Continue) <em>inside</em> the failing-prone routes.</li>
<li>Use when independent calls can run in parallel (e.g. query three airline systems and combine results) — total time ≈ slowest route, not the sum.</li>
</ul>

<h3>Other routers (know they exist)</h3>
<table>
<tr><th>Router</th><th>Behavior</th></tr>
<tr><td>First Successful</td><td>Tries routes in order until one completes without error (failover pattern)</td></tr>
<tr><td>Round Robin</td><td>One route per event, rotating through routes (simple load distribution)</td></tr>
</table>

<h3>Validation module</h3>
<p>Validators check a condition and, on failure, <strong>throw a Mule error in the <code>VALIDATION</code> namespace</strong> (they don't return booleans). This "fail fast with a typed error" style pairs naturally with error handlers and APIkit (map to 400 responses).</p>
<ul>
<li>Common validators: <em>Is true / Is false, Is not blank string / Is blank string, Is not null / Is null, Is number, Is email, Is IP, Matches regex, Is elapsed, Is not elapsed</em>.</li>
<li>Each validator lets you customize the error message; the raised type is specific, e.g. <code>VALIDATION:INVALID_BOOLEAN</code>, <code>VALIDATION:BLANK_STRING</code>, <code>VALIDATION:INVALID_EMAIL</code>.</li>
<li><em>All / Any</em> validators combine several validations into one result.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> "Route a copy of the message to ALL of these systems" → Scatter-Gather. "Route to ONE system depending on a field" → Choice. "Reject requests with an invalid email, returning a clear error" → Validation + error handler. Also remember Scatter-Gather's output shape — questions love asking what the payload looks like afterwards.</p>`
    }
  ]
};
