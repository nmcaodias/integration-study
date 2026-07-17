/* MCD1 · s5 — Building API Implementation Interfaces */
module.exports = {
  sections: {
    s5: {
      topicDocs: {
        "The generated flow naming convention": "https://docs.mulesoft.com/apikit/latest/",
        "The APIkit main flow and error mappings": "https://docs.mulesoft.com/apikit/latest/",
        "Manual routing vs APIkit": "https://docs.mulesoft.com/apikit/latest/"
      },
      appendNotes: `
<h3>The generated flow naming convention</h3>
<p>APIkit routes <strong>by flow name</strong>, so the names it scaffolds are a contract, not decoration. The pattern is <code>method:\\resource(:mediaType):routerConfigName</code>:</p>
<table>
<tr><th>Spec resource + method</th><th>Generated flow name</th></tr>
<tr><td>GET /flights</td><td><code>get:\\flights:api-config</code></td></tr>
<tr><td>GET /flights/{ID}</td><td><code>get:\\flights\\(ID):api-config</code></td></tr>
<tr><td>POST /flights (JSON body)</td><td><code>post:\\flights:application\\json:api-config</code></td></tr>
</table>
<p>The media-type segment (<code>application\\json</code>) appears only when the method declares a request body, which lets one resource have different flows per content type. Rename any of these and the router raises <code>APIKIT:NOT_IMPLEMENTED</code> (501) for that operation.</p>

<h3>The APIkit main flow and error mappings</h3>
<p>Scaffolding produces a main flow plus an error handler that turns each APIkit validation error into the right HTTP status. Conceptually:</p>
<pre><code>&lt;flow name="api-main"&gt;
  &lt;http:listener path="/api/*" config-ref="api-httpListenerConfig"/&gt;
  &lt;apikit:router config-ref="api-config"/&gt;
  &lt;error-handler&gt;
    &lt;on-error-propagate type="APIKIT:BAD_REQUEST"&gt;
      &lt;set-variable variableName="httpStatus" value="400"/&gt;
      &lt;set-payload value='#[{ "error": error.description }]'/&gt;
    &lt;/on-error-propagate&gt;
    &lt;on-error-propagate type="APIKIT:NOT_FOUND"&gt;   ... 404 ...
    &lt;on-error-propagate type="APIKIT:METHOD_NOT_ALLOWED"&gt; ... 405 ...
  &lt;/error-handler&gt;
&lt;/flow&gt;</code></pre>
<p>You customize these mappings (payload shape, extra logging) but keep the <em>types</em> aligned with the router's errors.</p>

<h3>Manual routing vs APIkit</h3>
<table>
<tr><th></th><th>Manual (Listener + Choice)</th><th>APIkit</th></tr>
<tr><td>Routing</td><td>You write Choice on path/method</td><td>Generated from the spec, by flow name</td></tr>
<tr><td>Validation</td><td>You implement it</td><td>Automatic against the RAML/OAS</td></tr>
<tr><td>Error responses</td><td>Hand-built</td><td>Scaffolded mappings (400/404/405/…)</td></tr>
<tr><td>Stays in sync with spec</td><td>No guarantee</td><td>Re-scaffold preserves your flows</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> choose APIkit whenever the scenario mentions a RAML/OAS spec and "consistent with the contract" or "validate automatically"; choose manual only for trivial or non-spec endpoints.</p>`
    }
  },
  questions: {
    "m1-026": {
      options: [
        "Routes the request anyway and lets the implementation flow fail on the missing value",
        "Raises APIKIT:BAD_REQUEST, which the generated error handler maps to a 400 response",
        "Returns a 500 Internal Server Error because validation happens after routing",
        "Silently drops the request and closes the connection with no response"
      ],
      answer: 1,
      explanation: "The APIkit Router validates each request against the spec before routing. A missing required query parameter raises APIKIT:BAD_REQUEST, and the scaffolded error handler returns HTTP 400.",
      optionNotes: [
        "Wrong — the router validates first; it does not route an invalid request onward.",
        "Correct — contract violations become APIKIT:BAD_REQUEST → 400.",
        "Wrong — validation happens at the router, and the mapped status is 400, not 500.",
        "Wrong — the caller always gets a response; here a 400 with an error body."
      ]
    },
    "m1-027": {
      options: [
        "A SOAP WSDL describing the API's operations and message types",
        "A REST Connector (via REST Connect) with one typed operation per method",
        "A compiled Java client SDK packaged as a downloadable JAR",
        "An APIkit error handler pre-mapped to the standard HTTP status codes"
      ],
      answer: 1,
      explanation: "Publishing a REST spec to Exchange triggers REST Connect, which generates a REST Connector with one operation per method. Consumers drag it in from Exchange and get typed operations instead of hand-configured HTTP Request calls.",
      optionNotes: [
        "Wrong — WSDL is for SOAP services; a RAML/OAS spec yields a REST Connector.",
        "Correct — REST Connect auto-generates a typed connector from the published spec.",
        "Wrong — no Java SDK is produced; the artifact is a Mule connector.",
        "Wrong — the error handler is scaffolded by APIkit inside the implementing app, not generated by Exchange on publish."
      ]
    },
    "m1-029": {
      options: [
        "It removes the need for an HTTP Listener in the application",
        "It guarantees zero-downtime deployments of the API",
        "The interface stays in sync with the spec, with request validation and error scaffolding for free",
        "It writes the business logic for each resource so no coding is required"
      ],
      answer: 2,
      explanation: "APIkit scaffolds routing flows from the spec, validates requests automatically, and generates standard error handlers — so the interface tracks the contract. The business logic in each implementation flow is still up to the developer.",
      optionNotes: [
        "Wrong — APIkit still uses an HTTP Listener in front of the router.",
        "Wrong — deployment strategy is unrelated to APIkit scaffolding.",
        "Correct — contract-consistency plus free validation and error scaffolding are the core benefits.",
        "Wrong — APIkit generates the interface, not the business logic."
      ]
    },
    "m1-083": {
      options: [
        "They still work — APIkit tracks flows by an internal id, not the name",
        "The router can no longer find the flow; the name IS the routing contract (NOT_IMPLEMENTED/501)",
        "They are automatically redirected to the API console flow at /console/*",
        "They fail request validation and return a 400 Bad Request to the caller"
      ],
      answer: 1,
      explanation: "The APIkit Router maps a request to an implementation flow by name (method:\\resource:config). Renaming breaks the mapping, so that operation surfaces as APIKIT:NOT_IMPLEMENTED (501).",
      optionNotes: [
        "Wrong — there is no separate internal id; the name is the mapping key.",
        "Correct — the naming convention is the routing contract; break it and the router can't find the flow.",
        "Wrong — the console flow serves /console/*, unrelated to a renamed implementation flow.",
        "Wrong — the request is valid; the failure is a missing implementation (501), not a 400."
      ]
    },
    "m1-084": {
      options: [
        "It forwards the request; enum validation is the implementation flow's responsibility",
        "It rejects the request with APIKIT:BAD_REQUEST, mapped to a 400 response",
        "It returns 404 Not Found because the value is not a known resource",
        "It strips the invalid parameter and continues with the enum's default value"
      ],
      answer: 1,
      explanation: "An out-of-enum query parameter violates the contract. The router raises APIKIT:BAD_REQUEST before routing, and the generated error handler maps it to HTTP 400.",
      optionNotes: [
        "Wrong — the router validates enums itself; it doesn't defer to the flow.",
        "Correct — a value outside the declared enum is a bad request → 400.",
        "Wrong — the resource exists; only the parameter value is invalid, so it's 400 not 404.",
        "Wrong — the router rejects invalid values rather than silently substituting a default."
      ]
    }
  }
};
