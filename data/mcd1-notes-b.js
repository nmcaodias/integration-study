// MCD Level 1 — expanded study notes, sections 7–12 (based on docs.mulesoft.com)
window.CERT_DATA.mcd1.sections.push(
  {
    id: "s7",
    title: "Handling Errors",
    objectives: [
      "Describe the default error handling in a Mule application",
      "Define a custom global default error handler and identify when it is used",
      "Compare and contrast On Error Continue and On Error Propagate scopes",
      "Handle errors at the application, flow, and processor level",
      "Describe the data structure of the Mule Error object",
      "Map errors to custom application errors"
    ],
    notes: `
<h3>Two kinds of errors</h3>
<ul>
<li><strong>System errors</strong> — occur outside event processing (app startup failure, a connection lost while idle). No Mule event is involved, so <em>no error handler can catch them</em>; Mule logs them and applies reconnection strategies.</li>
<li><strong>Messaging errors</strong> — thrown while an event is processed in a flow. These are what you handle with error handlers.</li>
</ul>

<h3>The Mule Error object</h3>
<p>When a processor fails, execution jumps to error handling and the event gains an <code>error</code> object:</p>
<table>
<tr><th>Field</th><th>Contents</th></tr>
<tr><td><code>error.errorType</code></td><td>Namespace + identifier, e.g. <code>HTTP:NOT_FOUND</code>, <code>VALIDATION:INVALID_EMAIL</code></td></tr>
<tr><td><code>error.description</code></td><td>Human-readable description of what failed</td></tr>
<tr><td><code>error.cause</code></td><td>The underlying Java exception</td></tr>
<tr><td><code>error.errorMessage</code></td><td>For some connectors, a Mule message describing the failing response (e.g. the HTTP error body)</td></tr>
<tr><td><code>error.childErrors</code></td><td>Aggregated errors (e.g. from Scatter-Gather composite routing)</td></tr>
</table>
<p><strong>Error types form a hierarchy.</strong> Every error extends <code>MULE:ANY</code>. Examples: <code>HTTP:NOT_FOUND</code> and <code>HTTP:CONNECTIVITY</code> are HTTP-namespace types; <code>HTTP:CONNECTIVITY</code> also extends <code>MULE:CONNECTIVITY</code>. Handling a parent type catches all of its children. Special types: <code>MULE:UNKNOWN</code> (unmatchable except by ANY), <code>MULE:CRITICAL</code> (not handleable at all).</p>
<figure><img src="images/error-handling-39be7.png" alt="When a processor fails, the event is routed to the matching On Error scope inside the flow's error handler"><figcaption>A failing processor routes the event into the flow's Error Handler; the rest of the flow is skipped <em>(source: docs.mulesoft.com)</em></figcaption></figure>

<h3>Default behavior (no error handler anywhere)</h3>
<p>Mule applies the built-in default error handler, which <strong>propagates</strong> the error: it is logged, the flow stops, and the source gets the error response — an HTTP Listener returns <strong>500</strong> with the error description.</p>

<h3>On Error Propagate vs On Error Continue</h3>
<table>
<tr><th></th><th>On Error Propagate</th><th>On Error Continue</th></tr>
<tr><td>After handler runs</td><td><strong>Re-throws</strong> the error up</td><td>Continues as if the flow <strong>succeeded</strong></td></tr>
<tr><td>Rest of the flow</td><td>Skipped</td><td>Skipped (handler output becomes the flow result)</td></tr>
<tr><td>HTTP Listener returns</td><td><strong>Error response (500 by default)</strong> — body can be customized in the handler</td><td><strong>Success response (200)</strong> with the handler's payload</td></tr>
<tr><td>When called via Flow Reference</td><td>Error surfaces in the calling flow at the Flow Reference</td><td>Caller continues normally after the Flow Reference</td></tr>
</table>
<figure><img src="images/mruntime-on-error-continue.png" alt="On Error Continue: the error handler executes and the flow returns a success response to the source"><figcaption>On Error Continue: the handler's result is returned as a <em>success</em> response <em>(source: docs.mulesoft.com)</em></figcaption></figure>
<p>Each On Error scope can match on: <code>type</code> (one or more error types, comma-separated) and/or <code>when</code> (a DataWeave boolean, e.g. <code>#[error.errorType.identifier == 'NOT_FOUND']</code>). Within an error handler, scopes are checked <strong>in order; first match wins</strong> — put specific types before general ones. An unmatched error behaves as if the handler didn't exist (bubbles to the next level).</p>

<h3>Three levels of handling</h3>
<ol>
<li><strong>Processor level — Try scope.</strong> Wrap one or more processors; attach its own error handler. Classic use: let one optional call fail (On Error Continue in the Try) while the rest of the flow proceeds.</li>
<li><strong>Flow level.</strong> Each flow (and private flow) has an error handling section with its own On Error scopes.</li>
<li><strong>Application level — global default error handler.</strong> Define a global <code>error-handler</code> element and set it as the app's default in the configuration (Global Elements → Configuration → Default Error Handler). It applies <em>only</em> to flows that define <strong>no</strong> error handling of their own — it's a fallback, never an addition. Subflows never have their own handling; they always use the caller's context.</li>
</ol>

<h3>Raising and mapping errors</h3>
<ul>
<li><strong>Raise Error</strong> component throws a custom error explicitly: type like <code>APP:ORDER_INVALID</code> plus a description — useful after a business rule check.</li>
<li><strong>Error mapping</strong> (on any connector operation, "Error Mapping" tab) converts a source type into a custom one: e.g. map <code>HTTP:NOT_FOUND</code> from a customer-service call to <code>APP:CUSTOMER_NOT_FOUND</code>. Handlers can then react to business-meaningful types, and two different calls that both might 404 become distinguishable.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> the most-tested scenarios: (1) which HTTP status the client sees for Continue vs Propagate; (2) what happens in the CALLING flow when a referenced flow's handler is Continue vs Propagate; (3) first-match-wins ordering with <code>MULE:ANY</code> placed first (it swallows everything). Trace them slowly — they're free points once you know the rules.</p>`
  },
  {
    id: "s8",
    title: "Transforming Data with DataWeave",
    objectives: [
      "Write DataWeave scripts to convert JSON, XML, and Java data structures",
      "Use DataWeave functions (including map, filter, orderBy, groupBy)",
      "Define and use DataWeave variables, functions, and custom data types",
      "Use DataWeave modules and coerce/format strings, numbers, and dates",
      "Call Mule flows from DataWeave scripts (lookup)"
    ],
    notes: `
<h3>Script anatomy</h3>
<pre><code>%dw 2.0                          // header: version
output application/json          // header: output format
import * from dw::core::Strings // header: imports
var taxRate = 1.23               // header: variables
fun withTax(n: Number) = n * taxRate   // header: functions
type Money = Number { format: "#,##0.00" } // header: custom types
---
payload map (item, index) -> {   // body: ONE expression
  id: index,
  total: withTax(item.price) as Money
}</code></pre>
<p>Output formats: <code>application/json</code>, <code>application/xml</code>, <code>application/java</code>, <code>application/csv</code>, <code>text/plain</code>… The body is a single expression; everything reusable goes in the header.</p>

<h3>Selectors</h3>
<table>
<tr><th>Selector</th><th>Example</th><th>Returns</th></tr>
<tr><td>Single value</td><td><code>payload.flight.price</code></td><td>Value of the key</td></tr>
<tr><td>Index / range</td><td><code>payload[0]</code>, <code>payload[1 to 3]</code>, <code>payload[-1]</code></td><td>Element(s); -1 is the last</td></tr>
<tr><td>Multi-value</td><td><code>payload.*flight</code></td><td>Array of ALL matching keys (essential for repeated XML elements)</td></tr>
<tr><td>Descendants</td><td><code>payload..price</code></td><td>All 'price' values at any depth</td></tr>
<tr><td>XML attribute</td><td><code>payload.flight.@code</code></td><td>Attribute value</td></tr>
<tr><td>Key existence</td><td><code>payload.customer?</code></td><td>true/false</td></tr>
</table>

<h3>Core functions (dw::Core is auto-imported)</h3>
<pre><code>payload map (f) -> { code: f.code }        // transform each array element ($, $$ = value, index)
payload filter ($.price &lt; 500)             // keep matching elements
payload orderBy $.price                    // ascending sort
(payload orderBy $.price)[-1 to 0]         // descending (reverse)
payload groupBy $.destination              // object of arrays keyed by criteria
payload distinctBy $.code                  // remove duplicates
payload reduce ((item, acc = 0) -> acc + item.price)   // fold to a single value
flatten([[1,2],[3]])                       // [1,2,3]
payload.book mapObject (v, k) -> { (upper(k)): v }     // transform object entries
payload pluck (v, k) -> { key: k, value: v }           // object -> array
"a,b,c" splitBy ","    /  ["a","b"] joinBy "-"
sizeOf(payload)  /  isEmpty(payload)  /  payload contains "SFO"
if (payload.price > 100) "expensive" else "cheap"
payload.customer.name default "Anonymous"  // fallback for null</code></pre>
<p>Concatenate with <code>++</code> (strings, arrays, objects). String helpers live in <code>dw::core::Strings</code> (<code>capitalize</code>, <code>camelize</code>…), array helpers in <code>dw::core::Arrays</code>.</p>

<h3>Working with XML</h3>
<ul>
<li>XML output requires a <strong>single root element</strong>; multiple top-level keys fail.</li>
<li>Repeated elements: reading — use <code>*</code> (<code>payload.flights.*flight</code>); writing from an array inside an object, wrap with <code>{( ... )}</code>:</li>
</ul>
<pre><code>%dw 2.0
output application/xml
---
flights: {
  (payload map (f) -> flight @(code: f.code): { price: f.price })
}</code></pre>
<ul>
<li><code>@(name: value)</code> writes XML attributes; <code>payload.el.@name</code> reads them. Namespaces are declared in the header with <code>ns</code>.</li>
<li>CSV: reader/writer properties like <code>header=false</code>, <code>separator='|'</code> are set on the format line: <code>output application/csv separator="|"</code>.</li>
</ul>

<h3>Type coercion and formatting</h3>
<pre><code>"123" as Number                          // 123
price as String {format: "###.00"}       // "1250.00"
"2024-03-15" as Date                     // Date object
now() as String {format: "yyyy-MM-dd"}   // formatted timestamp
"15/03/2024" as Date {format: "dd/MM/yyyy"}  // parse a non-ISO date
now() + |P1D|                            // date arithmetic with periods
|2024-03-15| as String {format: "MMM d"} // date literal</code></pre>
<p>Common coercion chain for reformatting a date string: <em>parse</em> with one format (<code>as Date {format: ...}</code>) then <em>output</em> with another (<code>as String {format: ...}</code>).</p>

<h3>Variables, functions, modules, lookup</h3>
<ul>
<li><code>var</code>/<code>fun</code> in the header; <code>do { ... }</code> creates local scopes inside the body.</li>
<li>Reusable libraries: a <code>.dwl</code> file in <code>src/main/resources</code> (e.g. <code>modules/Utils.dwl</code>) → <code>import modules::Utils</code> then <code>Utils::myFun(x)</code>, or <code>import * from modules::Utils</code> for unqualified use.</li>
<li><code>lookup("flowName", payload)</code> invokes a <strong>flow</strong> (not a subflow) and returns its payload — handy but use sparingly (harder error handling, hidden coupling).</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> practice reading scripts and predicting output shape: <code>map</code> → array, <code>groupBy</code> → object of arrays, <code>pluck</code> → array, <code>mapObject</code> → object, <code>reduce</code> → single value. And remember <code>$</code>=value, <code>$$</code>=key/index.</p>`
  },
  {
    id: "s9",
    title: "Using Connectors",
    objectives: [
      "Retrieve data from a database with the Database connector, including parameterized queries",
      "Retrieve data from a REST service using HTTP Request or a REST Connector",
      "Use a Web Service Consumer to consume SOAP web services",
      "Use the Transform Message component to pass parameters to a SOAP web service",
      "List, read, and write files with the File and FTP connectors",
      "Publish and consume JMS messages"
    ],
    notes: `
<h3>Database connector</h3>
<ul>
<li>Operations: <strong>Select, Insert, Update, Delete, Bulk insert/update/delete, Stored procedure, Execute DDL</strong>; sources: <strong>On Table Row</strong> (polling with watermark).</li>
<li>The JDBC driver is a Maven dependency (Studio adds it via the config's "Configure" button). Connection can be generic (URL + driver class) or vendor-specific; supports connection pooling.</li>
<li><strong>Always parameterize queries</strong> — input parameters prevent SQL injection and handle escaping/typing:</li>
</ul>
<pre><code>SELECT * FROM american
WHERE toAirport = :destination AND price &lt; :maxPrice
-- Input parameters:
#[{ destination: attributes.queryParams.destination,
    maxPrice: 500 }]</code></pre>
<ul>
<li>Select returns an array of objects (one per row) — typically followed by a Transform. Insert/Update return affected-row counts and generated keys in the payload/attributes.</li>
</ul>

<h3>HTTP Request &amp; REST connectors</h3>
<ul>
<li>Config holds base host/port/protocol (parameterize with properties); the operation sets method, path, headers, query params (fields or a DataWeave map), and body (current payload by default).</li>
<li><strong>Response validation:</strong> only 2xx (and 3xx per config) count as success; a 404 raises <code>HTTP:NOT_FOUND</code>, a 500 raises <code>HTTP:INTERNAL_SERVER_ERROR</code>, connection failures raise <code>HTTP:CONNECTIVITY</code>. The "success status codes" setting can widen what's accepted (e.g. <code>200..404</code> to handle 404 without errors).</li>
<li>After the call: payload = response body, attributes = status code + reason + headers (the previous attributes are gone!).</li>
<li>A <strong>REST Connector</strong> from Exchange (REST Connect) is the typed alternative: one operation per method with DataSense metadata. Authentication schemes (basic, OAuth, client id enforcement headers) configured on the connector config.</li>
</ul>

<h3>Web Service Consumer (SOAP)</h3>
<ul>
<li>Configure with the <strong>WSDL</strong> (location, service, port, address) — the connector exposes each SOAP operation.</li>
<li>The payload sent must be the <strong>SOAP body XML</strong> for the operation. Because the connector publishes metadata from the WSDL, a <strong>Transform Message placed before the Consume operation</strong> shows the expected XML structure as output metadata — map your data to it (namespaces included).</li>
<li>SOAP faults raise errors (<code>WSC:SOAP_FAULT</code>); headers can be set via the operation's "headers" DataWeave.</li>
</ul>

<h3>File / FTP / SFTP connectors</h3>
<ul>
<li>Operations: <strong>List, Read, Write, Copy, Move, Delete, Create directory</strong>; source: <strong>On New or Updated File</strong> (polls a directory).</li>
<li>Listener best practices: set <em>post-processing</em> — <strong>Move to another directory</strong> and/or <strong>rename</strong>, or auto-delete — so the same file isn't reprocessed; use matching rules (filename pattern) to select files. <em>Watermark</em> mode (file timestamps) can restrict to new/updated files.</li>
<li>Write operation: path + content (defaults to payload); modes: OVERWRITE, APPEND, CREATE_NEW. List returns an array of file messages; each message's attributes carry file name/size/timestamps.</li>
<li>FTP/SFTP mirror the File operations over remote protocols (SFTP = SSH; FTPS = TLS).</li>
</ul>

<h3>JMS connector</h3>
<ul>
<li>Messaging styles: <strong>queues = point-to-point</strong> (one consumer receives each message), <strong>topics = publish/subscribe</strong> (every subscriber gets a copy).</li>
<li>Operations: <strong>Publish</strong>, <strong>Consume</strong> (one message, on demand), <strong>Publish-Consume</strong> (request-reply over queues); source: <strong>On New Message</strong> (listener).</li>
<li>Why messaging: decouples producer from consumer in time and availability, buffers load spikes, enables async processing and reliable delivery (acknowledgements, persistent messages, transactions).</li>
<li>Message = body + properties (custom headers) + JMS headers (correlation id, reply-to). Attributes after Consume/On New Message expose these.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> match the connector to the scenario: database table sync → Database + On Table Row; existing SOAP service → Web Service Consumer (never HTTP Request); nightly CSV drop in a folder → File listener with move-after-processing; decouple two flows/apps with buffering → JMS (or VM within one app).</p>`
  },
  {
    id: "s10",
    title: "Processing Records",
    objectives: [
      "List and compare the methods for processing individual records in a collection",
      "Use the For Each scope to process records",
      "Use the Batch Job scope (with Batch Steps and Batch Aggregator) to process records",
      "Use the Scheduler component and connector listeners to trigger flows",
      "Use watermarking (automatic and manual) to synchronize data",
      "Persist and share data using the Object Store"
    ],
    notes: `
<h3>Choosing a record-processing tool</h3>
<table>
<tr><th></th><th>For Each</th><th>Parallel For Each</th><th>Batch Job</th></tr>
<tr><td>Execution</td><td>Sequential, one at a time</td><td>Concurrent</td><td>Parallel, queued, async</td></tr>
<tr><td>Output</td><td><strong>Original payload</strong> (changes inside discarded)</td><td>Array of each iteration's result</td><td>BatchJobResult (in On Complete)</td></tr>
<tr><td>On record error</td><td>Stops processing (unless handled)</td><td>Collects failures; composite error</td><td>Configurable (maxFailedRecords); record-level tolerance</td></tr>
<tr><td>Persistence / restart</td><td>No</td><td>No</td><td>Yes — records go to persistent queues; job resumes after crash</td></tr>
<tr><td>Best for</td><td>Small collections, side effects in order</td><td>Independent medium workloads</td><td>Very large datasets, near-real-time sync, reliability (EE only)</td></tr>
</table>
<p>For Each notes: splits on <code>#[payload]</code> by default (configurable collection expression); batch size option groups elements; <strong>variables set inside persist</strong> after the scope, payload changes do not.</p>

<h3>Batch Job — three phases</h3>
<figure><img src="images/mruntime-batch-job-overview.png" alt="Batch job phases: Load and Dispatch, Process, On Complete"><figcaption>Load and Dispatch → Process (batch steps) → On Complete <em>(source: docs.mulesoft.com)</em></figcaption></figure>
<ol>
<li><strong>Load and Dispatch</strong> (implicit): splits the input (Java Iterables/Iterators/Arrays, JSON or XML arrays) into <strong>records</strong> and queues them into a persistent batch queue, creating the <em>batch job instance</em>. The flow that triggered the job <strong>continues immediately</strong> (the original payload moves on; the job runs asynchronously).</li>
<li><strong>Process</strong>: each record moves through the <strong>Batch Steps</strong> in parallel (block size defaults to 100 records per thread batch). Per step:
  <ul>
  <li><strong>Accept Expression</strong> — DataWeave condition a record must satisfy to enter the step.</li>
  <li><strong>Accept Policy</strong> — <code>ALL</code>, <code>NO_FAILURES</code> (default), <code>ONLY_FAILURES</code> — a final step with ONLY_FAILURES implements per-record error reporting.</li>
  <li><strong>Batch Aggregator</strong> (optional, inside a step) — accumulates records into arrays of fixed <code>size</code> (e.g. bulk upsert 100 at a time) or <code>streaming</code> (all records, one pass).</li>
  <li>Record-level <strong>variables</strong> set in one step are visible for the same record in later steps; variables from the Process phase do <em>not</em> reach On Complete.</li>
  </ul></li>
<li><strong>On Complete</strong>: runs once; payload is a <strong>BatchJobResult</strong> — <code>totalRecords, processedRecords, successfulRecords, failedRecords, loadedRecords</code>… Use it to log/report. The original payload is NOT available here.</li>
</ol>
<p><strong>Error tolerance:</strong> <code>maxFailedRecords = 0</code> (default) stops the job at the first failed record; <code>-1</code> tolerates unlimited failures; <code>N</code> stops after N. Failed records skip remaining steps unless a step's accept policy includes failures.</p>

<h3>Triggering flows</h3>
<ul>
<li><strong>Scheduler</strong>: <em>Fixed frequency</em> (every N ms/sec/min, with start delay) or <em>Cron expression</em> (e.g. <code>0 0 2 * * ?</code> = 02:00 daily). If a run is still executing when the next tick fires, the new one is skipped for that flow instance.</li>
<li><strong>Connector listeners</strong>: On New or Updated File, On New Message (JMS/VM/Anypoint MQ), On Table Row (Database) — event-driven alternatives to polling with a Scheduler.</li>
</ul>

<h3>Watermarking — sync only what's new</h3>
<ul>
<li><strong>Automatic:</strong> built into some sources. <em>On Table Row</em>: choose a <strong>watermark column</strong> (incrementing id or timestamp) — the connector persists the max seen value and adds it to the query filter each poll. <em>On New or Updated File</em>: timestamp-based watermark option.</li>
<li><strong>Manual:</strong> when logic is custom (e.g. Scheduler + HTTP "get changes since X"): read the stored watermark from an <strong>Object Store</strong>, query with it, then store the new max. Components: <code>os:retrieve</code> (with defaultValue), <code>os:store</code>.</li>
</ul>

<h3>Object Store</h3>
<ul>
<li>Key/value persistence per app: operations <strong>Store, Retrieve (with default), Contains, Remove, Clear</strong>; entries can have TTL. Backing: in-memory or persistent; on CloudHub, Object Store v2.</li>
<li>Used by: manual watermarks, Cache scope, Idempotent Message Validator, custom state (counters, tokens).</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> classic questions — "what is the payload after For Each?" (the original), "where do you see failed record counts?" (On Complete's BatchJobResult), "how do you process only failed records in the last step?" (accept policy ONLY_FAILURES), and "sync new records hourly without duplicates" (watermarking).</p>`
  },
  {
    id: "s11",
    title: "Debugging and Troubleshooting Mule Applications",
    objectives: [
      "Use breakpoints to inspect a Mule event at runtime",
      "Install missing Maven dependencies",
      "Read and decipher Mule log error messages"
    ],
    notes: `
<h3>The Mule debugger</h3>
<ul>
<li>Right-click a processor → <em>Add breakpoint</em>, then <strong>Debug As → Mule Application</strong>. The debugger connects on port <strong>6666</strong> by default (changeable in the debug configuration).</li>
<li>When paused, the <strong>Mule Debugger view</strong> shows the event <em>as it arrives at</em> the breakpointed processor: payload, attributes, variables, error (if any).</li>
<li>The <strong>expression evaluator</strong> runs arbitrary DataWeave against the paused event (e.g. test <code>payload.items filter $.qty > 0</code> before writing it into a transform).</li>
<li>Step controls: step over / step into (e.g. into a referenced flow) / resume. <em>Careful with streams:</em> viewing a streamed payload in the debugger can consume it.</li>
<li>Breakpoints can be <strong>conditional</strong> (a DataWeave expression) and can be set on exception (break when an error is raised).</li>
</ul>

<h3>Maven dependency problems</h3>
<ul>
<li>Symptoms: build fails with <code>Could not resolve dependencies</code> / <code>ClassNotFoundException</code> at runtime / Studio error markers on connector operations.</li>
<li>Fixes: declare the missing artifact in <code>pom.xml</code> (for JDBC drivers, Studio's Database config UI offers to add it); check the version exists; verify the repository is reachable and credentials in <code>settings.xml</code> are valid (needed for Exchange-hosted assets); force a refresh with <code>mvn clean install -U</code> or Studio → right-click project → Mule → Update project dependencies.</li>
<li>Connector dependencies from Exchange are added automatically when dragged from the Mule Palette ("Search in Exchange").</li>
</ul>

<h3>Reading Mule logs</h3>
<p>Logging is <strong>Log4j 2</strong> (<code>src/main/resources/log4j2.xml</code>); Studio console shows the same output as <code>logs/mule_ee.log</code> style files. A log line contains: timestamp, <strong>level</strong> (ERROR/WARN/INFO/DEBUG/TRACE), thread, logger category, event correlation id, and message. A typical error block:</p>
<pre><code>ERROR 2026-05-01 10:15:32,481 [[MuleRuntime].uber.04: [training-app].get:\\flights:api-config...]
********************************************************************
Message               : HTTP GET on resource 'http://acme:8081/api/flights' failed: not found (404)
Error type            : HTTP:NOT_FOUND
Element               : get:\\flights:api-config/processors/1 @ training-app
...(stack trace)...</code></pre>
<ul>
<li><strong>Message</strong> + <strong>Error type</strong> tell you <em>what</em>; <strong>Element</strong> tells you <em>which processor in which flow</em>. Read these before the stack trace.</li>
<li>The thread name reveals the flow; the correlation id groups all lines of one event's journey.</li>
<li><strong>Logger component:</strong> set message (<code>#[...]</code> expressions), level, and category (e.g. <code>com.acme.flights</code>) — categories are filtered/leveled in log4j2.xml. Logging a streamed payload prints a cursor object (e.g. <code>ManagedCursorStreamProvider</code>) unless converted: <code>#[payload as String]</code> or transform first — and beware that doing so consumes/loads the stream.</li>
<li>Common startup errors: port already in use (another app on 8081), invalid listener path, unresolved property placeholder (<code>Couldn't find configuration property value for key</code>).</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> given a log excerpt, identify the failing component and error type. Remember: the debugger shows the event BEFORE the selected processor runs, and the default debugger port is 6666.</p>`
  },
  {
    id: "s12",
    title: "Deploying and Managing APIs",
    objectives: [
      "Package Mule applications for deployment",
      "Deploy applications to CloudHub",
      "Use API Manager to create and deploy API proxies",
      "Connect an API implementation to API Manager using autodiscovery",
      "Restrict access with policies, client ID enforcement, and SLA tiers"
    ],
    notes: `
<h3>Packaging</h3>
<ul>
<li>A Mule 4 app packages as a <strong>deployable JAR</strong>: <code>mvn clean package</code> (or Studio → Export → Anypoint Studio Project to Mule Deployable Archive). It bundles the app XMLs, resources, and dependencies; <code>mule-artifact.json</code> declares <code>minMuleVersion</code> and secure properties.</li>
<li>The <strong>same JAR</strong> deploys to any target: CloudHub, Runtime Fabric, or customer-hosted runtimes (hybrid). Configuration differences come from properties, not rebuilds.</li>
</ul>

<h3>CloudHub deployment</h3>
<ul>
<li>Deploy from Studio (Anypoint Platform → Deploy), <strong>Runtime Manager</strong> (upload JAR), Anypoint CLI, or Maven. Choose: region, runtime version, <strong>worker size</strong> (0.1 / 0.2 / 1 / 2 / 4 … vCores) and <strong>number of workers</strong>.</li>
<li><strong>Vertical scaling</strong> = bigger workers; <strong>horizontal scaling</strong> = more workers with automatic load balancing across them. Multiple workers also give high availability.</li>
<li>App URL: <code>&lt;appname&gt;.&lt;region&gt;.cloudhub.io</code>; app names are unique per region. Set/override <strong>properties</strong> in Runtime Manager (Settings → Properties) — values there beat the packaged files; mark sensitive ones as hidden.</li>
<li>Runtime Manager also provides: logs, restart/stop, static IPs, schedules management (manage Scheduler-triggered flows), and alerts (app down, deployment failed…).</li>
</ul>

<h3>Managing APIs — API Manager</h3>
<p>API Manager governs <strong>API instances</strong> (an API spec version deployed to an environment). Two ways to bring an implementation under management:</p>
<table>
<tr><th></th><th>API proxy</th><th>Autodiscovery (basic endpoint)</th></tr>
<tr><td>What runs</td><td>A separate proxy app generated and deployed by API Manager in front of the implementation</td><td>The implementation itself registers with API Manager</td></tr>
<tr><td>Where policies execute</td><td>In the proxy</td><td>Inside the implementation app</td></tr>
<tr><td>Code changes</td><td>None</td><td>Add an <strong>API Autodiscovery</strong> global element</td></tr>
<tr><td>Use when</td><td>Implementation can't be modified / non-Mule backend</td><td>Mule implementation you control (avoids extra hop)</td></tr>
</table>
<p><strong>Autodiscovery requirements:</strong> the app declares <code>&lt;api-gateway:autodiscovery apiId="\${api.id}" flowRef="main-flow"/&gt;</code> where the <code>apiId</code> matches the API instance in API Manager for THAT environment, and the runtime has Anypoint Platform <strong>client credentials</strong> (client id/secret of the environment, set as properties <code>anypoint.platform.client_id</code>/<code>client_secret</code> — automatic on CloudHub deployments from the same org). Status turns green ("Active") in API Manager when paired; policies are then pulled and enforced by the app.</p>

<h3>Policies</h3>
<table>
<tr><th>Policy</th><th>Purpose</th></tr>
<tr><td>Rate limiting / Rate limiting SLA-based</td><td>Cap requests per window (globally, or per client tier)</td></tr>
<tr><td>Spike control</td><td>Smooth bursts (queue/delay instead of hard reject)</td></tr>
<tr><td>Client ID enforcement</td><td>Require client_id/client_secret from registered consumers</td></tr>
<tr><td>OAuth 2.0 / JWT validation / Basic auth</td><td>Authentication and authorization</td></tr>
<tr><td>IP allowlist / blocklist</td><td>Network-level restriction</td></tr>
<tr><td>CORS, Header injection/removal</td><td>Cross-origin support, header manipulation</td></tr>
</table>
<ul>
<li>Policies are applied per API instance in API Manager — <strong>no redeployment of the app</strong> is needed; gateways poll and apply them. Custom policies can be published to Exchange.</li>
<li><strong>Resource-level policies</strong> can target specific methods/paths instead of the whole API.</li>
</ul>

<h3>Client ID enforcement, contracts and SLA tiers</h3>
<ol>
<li>Define <strong>SLA tiers</strong> on the API instance (e.g. Gold: 1000 req/min auto-approved; Silver: 100 req/min manual approval).</li>
<li>A consumer finds the API in <strong>Exchange</strong> and <strong>requests access</strong> with (or creating) a <em>client application</em>, choosing a tier → this creates a <strong>contract</strong> once approved, and the client app gets <strong>client_id + client_secret</strong>.</li>
<li>With <strong>client ID enforcement</strong> (or SLA-based rate limiting) applied, requests must carry the credentials (headers or query params per policy config, e.g. <code>client_id</code>/<code>client_secret</code> headers); the gateway identifies the consumer, checks the contract, and applies the tier's limits. Violations → <strong>401</strong> (invalid credentials) or <strong>429</strong> (over the limit).</li>
</ol>
<p class="tip"><strong>Exam tip:</strong> know the request-access flow order (Exchange → client app → tier → contract → credentials) and that SLA-based rate limiting REQUIRES a client-identifying policy. Also: policies apply per environment-specific API instance, and changing policies never requires redeploying the Mule app.</p>`
  }
);
