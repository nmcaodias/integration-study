/* MCD1 · s1 — Explaining Application Network Basics
 * Notes expansion + de-biased questions + new exhibit question. */
module.exports = {
  sections: {
    s1: {
      topicDocs: {
        "Point-to-point vs. the application network": "https://docs.mulesoft.com/general/api-led-overview",
        "Benefits of an application network": "https://docs.mulesoft.com/general/api-led-overview",
        "REST principles": "https://docs.mulesoft.com/http-connector/latest/",
        "REST vs. SOAP web services": "https://docs.mulesoft.com/http-connector/latest/",
        "API as a product and its lifecycle": "https://docs.mulesoft.com/general/api-led-overview",
        "Control plane vs. runtime plane": "https://docs.mulesoft.com/general/"
      },
      appendNotes: `
<h3>Point-to-point vs. the application network</h3>
<p>The problem an application network solves is combinatorial. With <strong>point-to-point</strong> integration, connecting <em>n</em> systems that all need to talk to each other trends toward <strong>n·(n−1)/2</strong> bespoke connections; every new system multiplies the work, and every change to one endpoint can break many hand-coded links. An <strong>API-led</strong> approach inverts this: each system is unlocked <em>once</em> by a System API, and everything else composes those reusable contracts, so the marginal cost of the next project falls instead of rising.</p>
<svg viewBox="0 0 640 250" style="max-width:640px;width:100%" role="img" aria-label="Point-to-point spaghetti versus API-led hub">
  <style>.pp-n{fill:none;stroke:currentColor;stroke-width:1.4}.pp-l{stroke:currentColor;stroke-width:1;opacity:.5}.pp-c{stroke:currentColor;stroke-width:1.2;opacity:.9}.pp-t{font:600 13px sans-serif;fill:currentColor}.pp-s{font:11px sans-serif;fill:currentColor;opacity:.7}</style>
  <text x="20" y="20" class="pp-t">Point-to-point (n·(n−1)/2 links)</text>
  <circle cx="70" cy="70" r="14" class="pp-n"/><circle cx="170" cy="55" r="14" class="pp-n"/><circle cx="200" cy="140" r="14" class="pp-n"/><circle cx="100" cy="170" r="14" class="pp-n"/><circle cx="40" cy="130" r="14" class="pp-n"/>
  <line x1="70" y1="70" x2="170" y2="55" class="pp-l"/><line x1="70" y1="70" x2="200" y2="140" class="pp-l"/><line x1="70" y1="70" x2="100" y2="170" class="pp-l"/><line x1="70" y1="70" x2="40" y2="130" class="pp-l"/><line x1="170" y1="55" x2="200" y2="140" class="pp-l"/><line x1="170" y1="55" x2="100" y2="170" class="pp-l"/><line x1="170" y1="55" x2="40" y2="130" class="pp-l"/><line x1="200" y1="140" x2="100" y2="170" class="pp-l"/><line x1="200" y1="140" x2="40" y2="130" class="pp-l"/><line x1="100" y1="170" x2="40" y2="130" class="pp-l"/>
  <text x="360" y="20" class="pp-t">API-led (unlock once, reuse many)</text>
  <circle cx="470" cy="110" r="18" class="pp-n"/><text x="470" y="114" text-anchor="middle" class="pp-s">API</text>
  <circle cx="400" cy="55" r="13" class="pp-n"/><circle cx="545" cy="55" r="13" class="pp-n"/><circle cx="580" cy="140" r="13" class="pp-n"/><circle cx="470" cy="200" r="13" class="pp-n"/><circle cx="380" cy="150" r="13" class="pp-n"/>
  <line x1="470" y1="110" x2="400" y2="55" class="pp-c"/><line x1="470" y1="110" x2="545" y2="55" class="pp-c"/><line x1="470" y1="110" x2="580" y2="140" class="pp-c"/><line x1="470" y1="110" x2="470" y2="200" class="pp-c"/><line x1="470" y1="110" x2="380" y2="150" class="pp-c"/>
</svg>
<p>Because consumers bind to <strong>contracts</strong> (the API specification) rather than to implementations, a System API can be re-pointed from a legacy database to a new SaaS backend without any consumer changing a line of code — the coupling lives at the contract, which stays stable.</p>

<h3>Benefits of an application network</h3>
<table>
<tr><th>Benefit</th><th>Why it follows from API-led connectivity</th></tr>
<tr><td>Faster delivery over time</td><td>Each project reuses existing APIs and contributes new ones, so the next project starts further ahead ("every project delivered faster than the last").</td></tr>
<tr><td>Decentralized, self-serve access</td><td>Teams discover and consume assets in Exchange without filing tickets against a central team.</td></tr>
<tr><td>Increased operational resilience</td><td>Loose coupling and clear contracts localize the blast radius of change and failure.</td></tr>
<tr><td>Visibility and governance</td><td>Traffic flows through managed APIs, so it can be secured, throttled, monitored, and analyzed centrally.</td></tr>
<tr><td>Reuse instead of rebuild</td><td>A System API written once is consumed by many Process and Experience APIs — the network effect that closes the delivery gap.</td></tr>
</table>

<h3>REST principles</h3>
<p>REST (Representational State Transfer) is an architectural style, not a protocol. The properties MCD Level 1 expects you to recognize:</p>
<ul>
<li><strong>Resources addressed by URIs</strong> — nouns, not verbs: <code>/flights</code>, <code>/flights/A320</code>. The HTTP method carries the verb.</li>
<li><strong>Uniform interface</strong> — the same small set of methods (GET/POST/PUT/PATCH/DELETE) works across all resources with consistent semantics.</li>
<li><strong>Statelessness</strong> — every request carries everything the server needs; the server keeps no client session between calls. This is what lets you scale horizontally by adding identical workers behind a load balancer.</li>
<li><strong>Representations</strong> — the same resource can be returned as JSON, XML, etc.; the client negotiates format with the <code>Accept</code> header and declares its body's format with <code>Content-Type</code>.</li>
<li><strong>Cacheability &amp; safe/idempotent methods</strong> — GET is <em>safe</em> (no side effects) and cacheable; PUT and DELETE are <em>idempotent</em> (repeating them lands the same state); POST is neither.</li>
</ul>

<h3>REST vs. SOAP web services</h3>
<table>
<tr><th></th><th>REST</th><th>SOAP</th></tr>
<tr><td>Style</td><td>Architectural style over HTTP</td><td>Strict protocol (envelope) over HTTP, JMS, etc.</td></tr>
<tr><td>Contract</td><td>RAML / OAS (optional but recommended)</td><td>WSDL (required)</td></tr>
<tr><td>Payload</td><td>Usually JSON (also XML, form, binary)</td><td>Always XML SOAP envelope</td></tr>
<tr><td>Consumed in Mule via</td><td>HTTP Request / REST Connector</td><td>Web Service Consumer connector</td></tr>
</table>
<p>On the exam, "generated WSDL / Web Service Consumer / envelope" signals SOAP; "RAML, resources, JSON, HTTP methods" signals REST.</p>

<h3>API as a product and its lifecycle</h3>
<p>A <em>modern</em> API is treated as a <strong>product</strong> with a full lifecycle rather than a one-off endpoint. The design-first lifecycle Anypoint supports:</p>
<svg viewBox="0 0 660 70" style="max-width:660px;width:100%" role="img" aria-label="API product lifecycle">
  <style>.lc-b{fill:none;stroke:currentColor;stroke-width:1.3}.lc-t{font:600 11px sans-serif;fill:currentColor}.lc-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#lcA)}</style>
  <defs><marker id="lcA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <rect x="6" y="20" width="92" height="34" rx="6" class="lc-b"/><text x="52" y="41" text-anchor="middle" class="lc-t">Design</text>
  <rect x="116" y="20" width="92" height="34" rx="6" class="lc-b"/><text x="162" y="41" text-anchor="middle" class="lc-t">Simulate</text>
  <rect x="226" y="20" width="100" height="34" rx="6" class="lc-b"/><text x="276" y="41" text-anchor="middle" class="lc-t">Feedback</text>
  <rect x="344" y="20" width="100" height="34" rx="6" class="lc-b"/><text x="394" y="41" text-anchor="middle" class="lc-t">Implement</text>
  <rect x="462" y="20" width="92" height="34" rx="6" class="lc-b"/><text x="508" y="41" text-anchor="middle" class="lc-t">Deploy</text>
  <rect x="572" y="20" width="82" height="34" rx="6" class="lc-b"/><text x="613" y="41" text-anchor="middle" class="lc-t">Manage</text>
  <line x1="98" y1="37" x2="114" y2="37" class="lc-a"/><line x1="208" y1="37" x2="224" y2="37" class="lc-a"/><line x1="326" y1="37" x2="342" y2="37" class="lc-a"/><line x1="444" y1="37" x2="460" y2="37" class="lc-a"/><line x1="554" y1="37" x2="570" y2="37" class="lc-a"/>
</svg>
<p>Design → simulate (mocking service) → gather consumer feedback → refine the contract; only then implement, deploy, and manage. The point is that consumers validate the <em>contract</em> before anyone writes a flow.</p>

<h3>Control plane vs. runtime plane</h3>
<p>Anypoint Platform separates <strong>where you manage</strong> from <strong>where your apps run</strong>:</p>
<ul>
<li><strong>Control plane</strong> — the management layer: Design Center, Exchange, API Manager, Runtime Manager, Access Management, Monitoring. Hosted by MuleSoft (or, for Anypoint Platform Private Cloud Edition, self-hosted).</li>
<li><strong>Runtime plane</strong> — where Mule runtimes actually execute your apps: <strong>CloudHub</strong> / <strong>CloudHub 2.0</strong> (MuleSoft-hosted iPaaS), <strong>Runtime Fabric</strong> (your containers/Kubernetes, on-prem or in your cloud), or <strong>customer-hosted</strong> standalone Mule servers.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> "apply a policy / create an SLA tier" → API Manager (control plane). "restart or scale workers" → Runtime Manager (control plane) acting on the runtime plane. "the app processes a message" → Mule runtime (runtime plane).</p>`
    }
  },
  questions: {
    // De-bias: correct answer trimmed, distractors made plausible + parallel length.
    "m1-005": {
      options: [
        "Cloud migration has reduced the number of reusable services teams can share",
        "Demand on IT outpaces its delivery capacity because point-to-point integration doesn't scale",
        "Governance reviews add too many approval steps to every integration project",
        "Business units keep changing their requirements after a project is delivered"
      ],
      answer: 1,
      explanation: "Business demand grows fast, but hand-coded point-to-point integration is bespoke and non-reusable, so IT's delivery capacity stays roughly flat — the gap widens. Reusable APIs in an application network let each project go faster than the last, closing it.",
      optionNotes: [
        "Wrong — reduced reuse is a symptom of point-to-point work, not the root cause the delivery gap describes.",
        "Correct — the gap is the widening distance between rising demand and flat delivery capacity caused by non-reusable point-to-point integration.",
        "Wrong — governance overhead is a real friction but not MuleSoft's stated cause of the delivery gap.",
        "Wrong — changing requirements affect any methodology; the delivery gap is specifically about integration not scaling."
      ]
    }
  },
  addQuestions: [
    {
      id: "m1-226",
      section: "s1",
      level: "medium",
      q: "A consumer sends the request shown and receives the response shown. Which statement is correct?",
      exhibit:
        "REQUEST\n" +
        "POST /v1/orders HTTP/1.1\n" +
        "Host: api.acme.com\n" +
        "Content-Type: application/json\n" +
        "Accept: application/json\n" +
        "\n" +
        "{ \"sku\": \"A320\", \"qty\": 2 }\n" +
        "\n" +
        "RESPONSE\n" +
        "HTTP/1.1 201 Created\n" +
        "Location: /v1/orders/8842\n" +
        "Content-Type: application/json\n" +
        "\n" +
        "{ \"id\": 8842, \"status\": \"NEW\" }",
      options: [
        "The client asked for XML but the server ignored the Accept header",
        "201 means the server accepted the request but has not created anything yet",
        "A new order resource was created and its URI is given in the Location header",
        "The request is invalid because POST must not carry a body"
      ],
      answer: 2,
      explanation: "201 Created is the standard response to a successful POST that creates a resource; the new resource's URI is returned in the Location header (/v1/orders/8842). Content-Type states the body's format; Accept requested JSON, which the server honored.",
      optionNotes: [
        "Wrong — Accept was application/json and the response is JSON, so the header was honored.",
        "Wrong — 201 means the resource was created; 202 Accepted is the code for 'accepted, not yet processed'.",
        "Correct — 201 Created plus a Location header pointing at /v1/orders/8842 is the textbook create-resource response.",
        "Wrong — POST routinely carries a body; that is how the new resource's data is sent."
      ]
    }
  ]
};
