/* MCD1 · s3 — Accessing and Modifying Mule Events */
module.exports = {
  sections: {
    s3: {
      topicDocs: {
        "Attributes by event source": "https://docs.mulesoft.com/mule-runtime/latest/about-mule-event",
        "Payload MIME type and encoding": "https://docs.mulesoft.com/mule-runtime/latest/dataweave-formats",
        "Variable scope and lifetime": "https://docs.mulesoft.com/mule-runtime/latest/about-mule-event"
      },
      appendNotes: `
<h3>Attributes by event source</h3>
<p>Attributes are strongly typed to whatever produced the message, so the same <code>attributes.</code> prefix exposes very different fields depending on the source or the last operation:</p>
<table>
<tr><th>Source / operation</th><th>Useful attributes</th></tr>
<tr><td>HTTP Listener</td><td><code>method</code>, <code>requestPath</code>, <code>queryParams</code>, <code>uriParams</code>, <code>headers</code>, <code>queryString</code></td></tr>
<tr><td>HTTP Request (response)</td><td><code>statusCode</code>, <code>reasonPhrase</code>, <code>headers</code></td></tr>
<tr><td>On New / Updated File, File Read</td><td><code>fileName</code>, <code>path</code>, <code>size</code>, <code>creationTime</code>, <code>lastModifiedTime</code></td></tr>
<tr><td>Database Select</td><td>(payload holds rows; attributes are minimal)</td></tr>
<tr><td>JMS / VM / Anypoint MQ</td><td>message id, correlation id, delivery/redelivery metadata</td></tr>
</table>
<p>This is why the <em>golden rule</em> matters: a Logger placed after an HTTP Request sees <code>attributes.statusCode</code>, not the original <code>attributes.queryParams</code> — those were replaced. Capture them in a variable before the operation if you still need them.</p>

<h3>Payload MIME type and encoding</h3>
<p>A payload carries not just bytes but a <strong>MIME type</strong> (e.g. <code>application/json</code>) and encoding. DataWeave reads the input based on that MIME type, so setting it correctly matters: if an HTTP body arrives as <code>text/plain</code> but is really JSON, <code>payload.field</code> won't navigate until you tell Mule it's JSON. Set the output type in a Transform Message's <code>output</code> directive, or on <strong>Set Payload</strong> via its MIME-type option. Mismatched types are a common cause of "expected object but got string" errors.</p>

<h3>Variable scope and lifetime</h3>
<ul>
<li>A variable set with <strong>Set Variable</strong> lives for the rest of the flow <em>and</em> travels into flows called via <strong>Flow Reference</strong> — the called flow sees and can modify the same variables.</li>
<li>Variables do <strong>not</strong> automatically cross an HTTP boundary: calling another app over HTTP sends only payload/headers, not your <code>vars</code>.</li>
<li>Because the event is immutable, "changing" a variable actually produces a new event; within a single flow you simply read the latest value.</li>
<li><code>Remove Variable</code> deletes one; there is no implicit clearing of variables between processors.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> a Flow Reference shares variables with the parent; an HTTP Request does not. Given a diagram where a sub-flow sets <code>vars.x</code>, the caller can read <code>vars.x</code> afterward only if it was a Flow Reference, not an HTTP call.</p>`
    }
  },
  questions: {
    "m1-015": {
      options: [
        "They are preserved unchanged from the original inbound request",
        "They are merged with the response headers, keeping the request metadata too",
        "They are replaced with metadata from the HTTP response (status code and headers)",
        "They are automatically copied into flow variables and then cleared"
      ],
      answer: 2,
      explanation: "Every connector operation that returns a message replaces the attributes with metadata about ITS result. After an HTTP Request the attributes hold the response status code and headers; the original query params are gone unless you saved them first.",
      optionNotes: [
        "Wrong — the golden rule: a connector operation replaces attributes, it does not preserve them.",
        "Wrong — nothing merges old and new; the previous attributes are fully replaced.",
        "Correct — attributes become the HTTP response metadata (statusCode, headers, reasonPhrase).",
        "Wrong — Mule never auto-copies attributes into variables; you must do that explicitly (e.g. before the request)."
      ]
    }
  }
};
