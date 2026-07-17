/* MCD1 · s9 — Using Connectors */
module.exports = {
  sections: {
    s9: {
      topicDocs: {
        "Config vs. operation, and connection pooling": "https://docs.mulesoft.com/mule-runtime/latest/connectors",
        "Reconnection strategies": "https://docs.mulesoft.com/mule-runtime/latest/reconnection-strategies-about",
        "Database connector: parameters and bulk": "https://docs.mulesoft.com/db-connector/latest/"
      },
      appendNotes: `
<h3>Config vs. operation, and connection pooling</h3>
<p>Each connector splits into a reusable <strong>configuration</strong> (a global element: host, credentials, pool settings, reconnection) and the <strong>operations</strong> that reference it (Select, Insert; Read, Write; Publish, Consume). Configuring once and referencing everywhere means the runtime can pool and reuse connections instead of opening one per call. <strong>DataSense</strong> reads the connector's metadata (a DB table's columns, a SOAP operation's schema) so DataWeave shows the exact input/output structure at design time.</p>

<h3>Reconnection strategies</h3>
<p>A connection can drop (DB restart, network blip). The connector's <strong>reconnection strategy</strong> decides what happens:</p>
<table>
<tr><th>Strategy</th><th>Behavior</th></tr>
<tr><td>None (default)</td><td>Fail immediately; the operation raises a CONNECTIVITY error</td></tr>
<tr><td>Standard (reconnect)</td><td>Retry a fixed number of times with a frequency, then give up</td></tr>
<tr><td>reconnect-forever</td><td>Keep retrying at the frequency until it succeeds</td></tr>
</table>
<p>Reconnection also governs <strong>app startup</strong>: with "reconnect on startup" a failed initial connection can be retried instead of aborting deployment. A drop that isn't recovered surfaces as a <code>MULE:CONNECTIVITY</code> (or connector-specific <code>*:CONNECTIVITY</code>) error your handler can catch.</p>

<h3>Database connector: parameters and bulk</h3>
<p>Always use <strong>parameterized</strong> queries (<code>:name</code> placeholders bound from <code>Input Parameters</code>) rather than string-concatenating values — it prevents SQL injection and lets the driver reuse prepared statements:</p>
<pre><code>&lt;db:select config-ref="DB"&gt;
  &lt;db:sql&gt;SELECT * FROM flights WHERE destination = :dest&lt;/db:sql&gt;
  &lt;db:input-parameters&gt;#[{ dest: attributes.queryParams.destination }]&lt;/db:input-parameters&gt;
&lt;/db:select&gt;</code></pre>
<ul>
<li><strong>Select</strong> returns a list of row objects as the payload.</li>
<li><strong>Bulk operations</strong> (Bulk Insert/Update) run one statement over many parameter sets — far faster than looping single inserts.</li>
<li>The connector auto-commits per operation unless it participates in a transaction (e.g. inside a transactional Try scope).</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> SOAP → Web Service Consumer (needs a WSDL); many rows to insert → Bulk operation; connection may drop → configure a reconnection strategy and catch <code>*:CONNECTIVITY</code>.</p>`
    }
  },
  questions: {
    "m1-054": {
      options: [
        "An HTTP Request operation pointed directly at the service's WSDL URL",
        "Web Service Consumer, configured with the WSDL location, service, port, and address",
        "A SOAPkit Router scaffolded from the WSDL, the SOAP equivalent of APIkit",
        "A REST Connector generated from the WSDL by REST Connect on publish"
      ],
      answer: 1,
      explanation: "The Web Service Consumer connector consumes SOAP services from their WSDL, exposing the SOAP operations. You build the request body as XML — usually with a Transform Message before the Consume operation — and the connector handles the envelope.",
      optionNotes: [
        "Wrong — a raw HTTP Request would force you to hand-build the whole SOAP envelope.",
        "Correct — Web Service Consumer reads the WSDL (service/port/address) and exposes the operations.",
        "Wrong — there is no 'SOAPkit Router'; APIkit for SOAP scaffolds a service, not a client.",
        "Wrong — REST Connect generates a REST connector from a REST spec, not a SOAP client from a WSDL."
      ]
    },
    "m1-057": {
      options: [
        "Queues broadcast each message to every consumer; topics deliver each message to exactly one",
        "Queues are point-to-point (one consumer per message); topics are publish/subscribe (each subscriber gets a copy)",
        "Queues are synchronous calls over HTTP; topics are asynchronous delivery over JMS",
        "There is no functional difference between a JMS queue and a JMS topic in Mule 4"
      ],
      answer: 1,
      explanation: "Point-to-point (queue): each message is consumed by exactly one receiver. Publish/subscribe (topic): every active subscriber receives its own copy of each message.",
      optionNotes: [
        "Wrong — this is inverted; broadcasting to all is the topic behavior.",
        "Correct — queue = point-to-point (one consumer), topic = pub/sub (all subscribers).",
        "Wrong — both are JMS messaging models, unrelated to HTTP sync/async.",
        "Wrong — queues and topics have genuinely different delivery semantics."
      ]
    },
    "m1-096": {
      options: [
        "It generates REST endpoints and a RAML specification from a WSDL",
        "Given a WSDL it exposes the SOAP operations, and a Transform before Consume shows the expected body as metadata",
        "It requires you to hand-write the full SOAP envelope, including all namespaces",
        "It supports only one-way, fire-and-forget SOAP operations"
      ],
      answer: 1,
      explanation: "Web Service Consumer reads the WSDL (service/port/address) and publishes operation metadata via DataSense, so a Transform Message before the Consume operation shows exactly the XML body to build. The envelope itself is handled by the connector.",
      optionNotes: [
        "Wrong — WSC consumes SOAP; it doesn't turn a WSDL into REST endpoints.",
        "Correct — WSDL-driven operations plus DataSense metadata for the request body.",
        "Wrong — the connector builds the envelope; you supply only the body.",
        "Wrong — it supports request-response operations too, not just one-way."
      ]
    }
  }
};
