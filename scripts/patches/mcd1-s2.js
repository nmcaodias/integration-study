/* MCD1 · s2 — Designing and Consuming APIs */
module.exports = {
  sections: {
    s2: {
      topicDocs: {
        "RAML data types and facets": "https://docs.mulesoft.com/design-center/design-raml-data-types",
        "Securing an API in RAML: securitySchemes": "https://docs.mulesoft.com/design-center/",
        "Status codes an API declares": "https://docs.mulesoft.com/http-connector/latest/",
        "The mocking service in depth": "https://docs.mulesoft.com/design-center/design-mocking-service",
        "Consuming an API from a Mule app": "https://docs.mulesoft.com/http-connector/latest/http-request-ref"
      },
      appendNotes: `
<h3>RAML data types and facets</h3>
<p>Types are the heart of a RAML contract. A type has a base (<code>object</code>, <code>array</code>, <code>string</code>, <code>number</code>, <code>integer</code>, <code>boolean</code>, <code>date-only</code>, <code>datetime</code>, <code>file</code>, or another named type) plus <strong>facets</strong> that constrain values. APIkit validates incoming requests against these facets and returns <strong>400</strong> when they fail.</p>
<table>
<tr><th>Facet</th><th>Applies to</th><th>Meaning</th></tr>
<tr><td><code>required</code></td><td>property</td><td>Present by default; <code>name?:</code> or <code>required: false</code> makes it optional</td></tr>
<tr><td><code>enum</code></td><td>scalar</td><td>Value must be one of a fixed list</td></tr>
<tr><td><code>pattern</code></td><td>string</td><td>Value must match the regex</td></tr>
<tr><td><code>minLength</code> / <code>maxLength</code></td><td>string</td><td>Length bounds</td></tr>
<tr><td><code>minimum</code> / <code>maximum</code></td><td>number</td><td>Value bounds</td></tr>
<tr><td><code>default</code></td><td>any</td><td>Value used when the property is omitted</td></tr>
<tr><td><code>example</code> / <code>examples</code></td><td>type</td><td>Sample instance(s); feed the console and mocking service</td></tr>
</table>
<pre><code>#%RAML 1.0 DataType
type: object
properties:
  id:      integer
  email:
    type: string
    pattern: ".+@.+"
  tier:
    enum: [bronze, silver, gold]
    default: bronze
  nickname?: string          # optional (the ? suffix)</code></pre>
<p>Composite types: <code>Flight[]</code> is an array of Flight; <code>string | number</code> is a union; a type can also <strong>extend</strong> another via <code>type: BaseType</code> and add properties.</p>

<h3>Securing an API in RAML: securitySchemes</h3>
<p>A spec can <em>declare</em> how it is secured so the contract, docs, and generated connector all know. Common schemes: <code>OAuth 2.0</code>, <code>Basic Authentication</code>, <code>Pass Through</code>, and custom <code>x-{name}</code> schemes such as client-id enforcement.</p>
<pre><code>securitySchemes:
  clientId:
    type: Pass Through
    describedBy:
      headers:
        client_id:     { required: true }
        client_secret: { required: true }

/orders:
  get:
    securedBy: [clientId]</code></pre>
<p>Declaring a scheme documents the requirement; the actual enforcement at runtime is done by an <strong>API Manager policy</strong> (e.g. Client ID Enforcement, OAuth 2.0 access-token validation). Contract in RAML, enforcement in API Manager — a frequent exam distinction.</p>

<h3>Status codes an API declares</h3>
<p>Each method lists the responses it can return, per status code, each with its own body/type/example. A well-designed API declares its success <em>and</em> error responses so consumers can code against them:</p>
<table>
<tr><th>Situation</th><th>Typical status</th></tr>
<tr><td>Read succeeded</td><td>200 OK</td></tr>
<tr><td>Resource created (POST)</td><td>201 Created (+ Location header)</td></tr>
<tr><td>Accepted for async processing</td><td>202 Accepted</td></tr>
<tr><td>Validation / malformed request</td><td>400 Bad Request</td></tr>
<tr><td>Missing/invalid credentials</td><td>401 Unauthorized</td></tr>
<tr><td>Authenticated but not allowed</td><td>403 Forbidden</td></tr>
<tr><td>Unknown resource</td><td>404 Not Found</td></tr>
<tr><td>Method not declared on the resource</td><td>405 Method Not Allowed</td></tr>
<tr><td>Rate limit exceeded</td><td>429 Too Many Requests</td></tr>
</table>

<h3>The mocking service in depth</h3>
<p>Toggle <strong>"Mocking service"</strong> in API Designer and the platform stands up a live endpoint that answers requests using the spec's declared <code>examples</code> — no implementation required. This is what makes design-first real: consumers send actual HTTP calls, see representative payloads, and give feedback on the contract before a flow exists. The mock honors declared status codes and validates parameters just like the real APIkit router will.</p>

<h3>Consuming an API from a Mule app</h3>
<ul>
<li><strong>HTTP Request connector</strong> — configure method, host/port/path, headers, query params, and body by hand. Works for any HTTP API.</li>
<li><strong>REST Connector (REST Connect)</strong> — when a spec is published to Exchange, a typed connector with one operation per method is generated automatically; drag it in from Exchange for a higher-level, contract-aware call.</li>
<li><strong>Web Service Consumer</strong> — for SOAP services described by a WSDL (not REST).</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> "publish a RAML and get a draggable connector" → REST Connect. "call a SOAP service" → Web Service Consumer. "call any REST endpoint manually" → HTTP Request.</p>`
    }
  },
  questions: {
    "m1-009": {
      options: [
        "Runtime Manager sandbox workers running a draft build of the app",
        "The mocking service, called from the API console in Exchange or API Designer",
        "The Mule debugger stepping through the flow in Anypoint Studio",
        "API Manager SLA tiers throttling the consumer's requests"
      ],
      answer: 1,
      explanation: "The mocking service simulates the API from its specification and declared examples, so consumers can send real HTTP requests to a mock endpoint from the API console — before any implementation is built. That is the essence of design-first.",
      optionNotes: [
        "Wrong — there is nothing to build or deploy yet; the whole point is to get feedback before implementation.",
        "Correct — the mocking service serves example-based responses from the spec, callable in the API console.",
        "Wrong — the debugger needs a running implementation to step through; none exists at design time.",
        "Wrong — SLA tiers govern a deployed, managed API; they don't let consumers try an unbuilt one."
      ]
    },
    "m1-010": {
      options: [
        "To define a reusable data type shared by request and response bodies",
        "To attach an OAuth 2.0 security scheme to every method of a resource",
        "To define reusable method-level properties (e.g. pagination query params) applied with 'is:'",
        "To split one RAML specification across multiple physical files via !include"
      ],
      answer: 2,
      explanation: "A trait captures reusable method-level patterns — query parameters, headers, responses — and is applied to a method with 'is: [traitName]'. Types define data structures, securitySchemes handle auth, and !include splits files.",
      optionNotes: [
        "Wrong — that describes a DataType (types:), not a trait.",
        "Wrong — auth is declared with securitySchemes/securedBy, not a trait.",
        "Correct — traits are method-level reuse applied with 'is:'; resourceTypes are the resource-level sibling applied with 'type:'.",
        "Wrong — splitting files is what !include does; a trait is a reuse pattern, not a file mechanism."
      ]
    },
    "m1-077": {
      options: [
        "Traits are applied to resources; resourceTypes are applied to methods",
        "Traits are method-level patterns applied with 'is:'; resourceTypes are resource-level patterns applied with 'type:'",
        "Traits hold data-type definitions; resourceTypes hold example instances",
        "They are two names for the same reuse mechanism in RAML 1.0"
      ],
      answer: 1,
      explanation: "A trait captures method-level reuse (pagination, headers, error responses) and is applied with 'is:'. A resourceType captures a whole resource shape (collection/member) and is applied with 'type:'.",
      optionNotes: [
        "Wrong — it is inverted: traits go on methods, resourceTypes on resources.",
        "Correct — 'is:' applies traits to methods; 'type:' applies resourceTypes to resources.",
        "Wrong — data types are declared under types:; examples under examples: — neither is a trait or resourceType.",
        "Wrong — they operate at different scopes (method vs resource) and are not interchangeable."
      ]
    }
  },
  addQuestions: [
    {
      id: "m1-227",
      section: "s2",
      level: "hard",
      q: "A team wants every method in the API to document the same 404 and 429 error responses without repeating the block. Which RAML construct fits, and how is it applied?",
      exhibit:
        "traits:\n" +
        "  standardErrors:\n" +
        "    responses:\n" +
        "      404:\n" +
        "        body:\n" +
        "          application/json:\n" +
        "            example: { \"error\": \"Not found\" }\n" +
        "      429:\n" +
        "        body:\n" +
        "          application/json:\n" +
        "            example: { \"error\": \"Rate limit exceeded\" }\n" +
        "\n" +
        "/flights:\n" +
        "  get:\n" +
        "    is: [ ??? ]\n" +
        "  /{id}:\n" +
        "    get:\n" +
        "      is: [ ??? ]",
      options: [
        "A resourceType, applied to each resource with 'type: standardErrors'",
        "A trait, applied to each method with 'is: [standardErrors]'",
        "A securityScheme, applied with 'securedBy: [standardErrors]'",
        "A DataType fragment, applied with 'type: standardErrors'"
      ],
      answer: 1,
      explanation: "Reusable method-level declarations (here, common error responses) are a trait, applied to a method with 'is: [traitName]'. The '???' placeholders sit under get: methods, confirming method-level application.",
      optionNotes: [
        "Wrong — a resourceType shapes a whole resource and is applied with 'type:' on the resource, not on each method.",
        "Correct — the block declares responses (method-level) and the placeholders are under get: methods, so it is a trait applied with 'is:'.",
        "Wrong — securitySchemes describe authentication, not shared error responses.",
        "Wrong — a DataType defines a data structure; it cannot carry method responses."
      ]
    }
  ]
};
