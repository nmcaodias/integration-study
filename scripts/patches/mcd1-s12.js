/* MCD1 · s12 — Deploying and Managing APIs */
module.exports = {
  sections: {
    s12: {
      topicDocs: {
        "Two enforcement models: proxy vs. autodiscovery": "https://docs.mulesoft.com/api-manager/latest/",
        "Policy categories": "https://docs.mulesoft.com/api-manager/latest/policies-landing-page",
        "Deployment targets recap": "https://docs.mulesoft.com/runtime-manager/deployment-strategies"
      },
      appendNotes: `
<h3>Two enforcement models: proxy vs. autodiscovery</h3>
<p>API Manager can enforce policies in two ways. Either it deploys an <strong>API proxy</strong> in front of your implementation, or your implementation enforces policies itself via <strong>autodiscovery</strong> — no separate app.</p>
<svg viewBox="0 0 660 200" style="max-width:660px;width:100%" role="img" aria-label="Proxy model versus autodiscovery model">
  <style>.dm-b{fill:none;stroke:currentColor;stroke-width:1.3}.dm-t{font:600 12px sans-serif;fill:currentColor}.dm-s{font:11px sans-serif;fill:currentColor;opacity:.8}.dm-a{stroke:currentColor;stroke-width:1.2;marker-end:url(#dmA)}</style>
  <defs><marker id="dmA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <text x="10" y="16" class="dm-t">Proxy model</text>
  <rect x="10" y="34" width="70" height="34" rx="6" class="dm-b"/><text x="45" y="55" text-anchor="middle" class="dm-s">consumer</text>
  <rect x="120" y="34" width="90" height="34" rx="6" class="dm-b"/><text x="165" y="51" text-anchor="middle" class="dm-s">proxy</text><text x="165" y="64" text-anchor="middle" class="dm-s">(policies)</text>
  <rect x="250" y="34" width="100" height="34" rx="6" class="dm-b"/><text x="300" y="55" text-anchor="middle" class="dm-s">implementation</text>
  <line x1="80" y1="51" x2="118" y2="51" class="dm-a"/><line x1="210" y1="51" x2="248" y2="51" class="dm-a"/>
  <text x="10" y="118" class="dm-t">Autodiscovery model</text>
  <rect x="10" y="136" width="70" height="34" rx="6" class="dm-b"/><text x="45" y="157" text-anchor="middle" class="dm-s">consumer</text>
  <rect x="120" y="136" width="160" height="34" rx="6" class="dm-b"/><text x="200" y="153" text-anchor="middle" class="dm-s">implementation</text><text x="200" y="166" text-anchor="middle" class="dm-s">enforces policies itself</text>
  <line x1="80" y1="153" x2="118" y2="153" class="dm-a"/>
  <rect x="360" y="120" width="150" height="30" rx="6" class="dm-b"/><text x="435" y="139" text-anchor="middle" class="dm-s">API Manager (control)</text>
  <line x1="360" y1="140" x2="282" y2="150" class="dm-a"/><text x="330" y="180" class="dm-s">pairs by API ID + creds</text>
</svg>
<p>Autodiscovery needs an <strong>API Autodiscovery</strong> global element whose <em>API ID</em> matches the instance in API Manager, plus the environment's platform client id/secret. The app then downloads and applies its policies at runtime — governance without a proxy hop.</p>

<h3>Policy categories</h3>
<table>
<tr><th>Category</th><th>Examples</th></tr>
<tr><td>Identity</td><td>Client ID Enforcement, OAuth 2.0 access-token validation, JWT validation, Basic Auth</td></tr>
<tr><td>Traffic control</td><td>Rate Limiting, Rate Limiting–SLA, Spike Control</td></tr>
<tr><td>Network / security</td><td>IP allowlist / blocklist, HTTP header injection/removal, CORS</td></tr>
<tr><td>Transformation</td><td>Message/header manipulation policies</td></tr>
</table>
<p><strong>Rate Limiting</strong> applies one flat limit; <strong>Rate Limiting–SLA</strong> applies per-<em>tier</em> limits and therefore requires client identification (Client ID Enforcement) so the policy knows which tier a caller belongs to. <strong>Spike Control</strong> smooths bursts by queuing/delaying rather than rejecting.</p>

<h3>Deployment targets recap</h3>
<table>
<tr><th>Target</th><th>Hosted by</th><th>Notes</th></tr>
<tr><td>CloudHub / CloudHub 2.0</td><td>MuleSoft (iPaaS)</td><td>Workers/replicas, built-in load balancer, Object Store v2, easiest ops</td></tr>
<tr><td>Runtime Fabric</td><td>You (containers/K8s)</td><td>Your cloud or on-prem; isolation and portability</td></tr>
<tr><td>Customer-hosted</td><td>You (standalone Mule)</td><td>Full control; you manage the servers (and can use domains)</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> per-consumer tiered limits → SLA tiers + Rate Limiting–SLA + Client ID Enforcement. Enforce policy without a proxy → autodiscovery (matching API ID). One deployable JAR runs on all three targets.</p>`
    }
  },
  questions: {
    "m1-070": {
      options: [
        "A WAR file to drop into a servlet container",
        "A deployable JAR containing the application and its dependencies",
        "A ZIP archive of the entire Anypoint Studio workspace",
        "A Docker image, which is always required for deployment"
      ],
      answer: 1,
      explanation: "Mule 4 apps package as deployable JARs (mvn package, or Studio export). The same artifact can be deployed unchanged to CloudHub, Runtime Fabric, or a customer-hosted runtime.",
      optionNotes: [
        "Wrong — Mule 4 doesn't package as a WAR.",
        "Correct — the deployable artifact is a JAR with the app and dependencies.",
        "Wrong — the workspace ZIP is source, not a deployable artifact.",
        "Wrong — Docker isn't required; the JAR deploys to multiple targets."
      ]
    },
    "m1-071": {
      options: [
        "All applications in the organization share one common worker",
        "A worker is a dedicated Mule instance for one app; scale by worker size (vCores) or count",
        "Workers exist only for APIs that use API autodiscovery",
        "Worker size is fixed and cannot be changed after the app is deployed"
      ],
      answer: 1,
      explanation: "Each CloudHub app runs on one or more dedicated workers. Vertical scaling changes worker size (vCores); horizontal scaling adds workers, with built-in load balancing across them.",
      optionNotes: [
        "Wrong — workers are dedicated per app, not shared org-wide.",
        "Correct — a worker hosts one app; you scale size and/or number.",
        "Wrong — workers are unrelated to whether autodiscovery is used.",
        "Wrong — worker size can be changed by redeploying with a new setting."
      ]
    },
    "m1-072": {
      options: [
        "Nothing extra; API Manager policies always apply to any running app automatically",
        "An API Autodiscovery element whose API ID matches the instance in API Manager, plus platform credentials",
        "A CloudHub dedicated load balancer placed in front of the application",
        "The APIkit Console must be enabled on the application"
      ],
      answer: 1,
      explanation: "Autodiscovery pairs the running app with the API instance in API Manager (matching API ID + environment client id/secret). The app then downloads and enforces its policies itself, without a separate proxy.",
      optionNotes: [
        "Wrong — policies don't attach to an app by themselves; it must be paired.",
        "Correct — autodiscovery (matching API ID + credentials) lets the app enforce policies in place.",
        "Wrong — a load balancer routes traffic; it doesn't pair an app with its API instance.",
        "Wrong — the APIkit Console is docs/testing, unrelated to policy enforcement."
      ]
    },
    "m1-073": {
      options: [
        "A single rate limiting policy applying one flat limit to everyone",
        "SLA tiers plus an SLA-based rate limiting policy, which needs client ID enforcement to identify consumers",
        "A spike control policy applied on the dedicated load balancer",
        "A separate API instance deployed for each customer segment"
      ],
      answer: 1,
      explanation: "SLA-based rate limiting applies per-tier limits. Consumers register client applications and request access at a tier, sending client_id/client_secret so the policy can identify their tier and apply the right limit.",
      optionNotes: [
        "Wrong — a flat rate limit can't differ by Gold vs Silver.",
        "Correct — SLA tiers + Rate Limiting–SLA + Client ID Enforcement gives per-consumer tiered limits.",
        "Wrong — spike control smooths bursts; it isn't per-tier limiting.",
        "Wrong — duplicating the API per customer isn't how tiered limits are done."
      ]
    },
    "m1-074": {
      options: [
        "A DNS alias that points consumers directly at the implementation URL",
        "A separate app deployed by API Manager that fronts the implementation and enforces policies",
        "A mock service auto-generated from the API's RAML specification",
        "A VPN tunnel between CloudHub and the customer's network"
      ],
      answer: 1,
      explanation: "A proxy is an auto-generated app that receives consumer traffic, applies policies (rate limiting, client enforcement…), and forwards allowed requests to the implementation — governance without touching implementation code.",
      optionNotes: [
        "Wrong — a proxy is a running app that enforces policy, not a DNS alias.",
        "Correct — it sits in front of the implementation and applies policies before forwarding.",
        "Wrong — that describes the mocking service, not a proxy.",
        "Wrong — a proxy isn't a network VPN."
      ]
    },
    "m1-075": {
      options: [
        "Nothing; the client ID enforcement policy only records usage in the background",
        "Request access in Exchange for credentials, then send client_id/client_secret on each request",
        "Install a client TLS certificate on the calling machine first",
        "Switch to calling the API's mocking service endpoint instead"
      ],
      answer: 1,
      explanation: "Client ID enforcement rejects requests without valid credentials. Consumers register a client application (request access in Exchange), get approved, and pass client_id/client_secret in headers or query params as the policy specifies.",
      optionNotes: [
        "Wrong — the policy blocks uncredentialed calls; it doesn't merely log.",
        "Correct — obtain credentials via the Exchange access request, then send them each call.",
        "Wrong — a TLS client cert is a different mechanism, not what this policy needs.",
        "Wrong — the mock is a design-time simulation, not a way past the policy."
      ]
    },
    "m1-100": {
      options: [
        "Nothing; the SLA policy only monitors and reports on traffic",
        "Request access in Exchange with a client app and an approved tier, then send its credentials each call",
        "Add their public IP address to the API's allow-list",
        "Deploy and run their own copy of the API instance"
      ],
      answer: 1,
      explanation: "SLA-based policies identify consumers by client credentials issued through the Exchange access-request flow (client app + tier + approved contract). Requests without valid credentials get 401; requests over the tier limit get 429.",
      optionNotes: [
        "Wrong — SLA rate limiting enforces limits, it doesn't merely monitor.",
        "Correct — a client app + approved tier + credentials on each request is required.",
        "Wrong — IP allow-listing is a different policy and doesn't establish a tier.",
        "Wrong — consumers call the managed instance; they don't deploy their own."
      ]
    }
  }
};
