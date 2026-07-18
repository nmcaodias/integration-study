/* MCIA de-bias · sections a9–a10. */
module.exports = {
  questions: {
    "ia-058": {
      optionEdits: { 0: "A Client ID enforcement policy on the APIs", 1: "Identity management — federate login via SAML 2.0 or OpenID Connect to the corporate IdP", 2: "Secure configuration properties for secrets", 3: "Anypoint MQ access control lists" },
      optionNotes: ["Client ID enforcement governs API consumers, not platform-user login.", "Correct — federated identity management (SAML/OIDC) authenticates platform users via the corporate IdP with MFA.", "Secure properties protect secrets, not user sign-in.", "MQ ACLs govern queue access, not platform login."]
    },
    "ia-059": {
      optionEdits: { 0: "Nothing — CloudHub validates any OAuth token automatically", 1: "Okta as an external client provider (client management) plus an OAuth/JWT validation policy on the API instances", 2: "A SAML assertion validation policy on the APIs", 3: "Basic authentication using Okta passwords" },
      optionNotes: ["Gateways don't validate arbitrary tokens without configuration.", "Correct — register Okta as the external client provider and apply a token/JWT validation policy on the APIs.", "SAML is for user SSO, not API consumer tokens.", "Basic auth isn't OAuth token validation."]
    },
    "ia-060": {
      optionEdits: { 0: "A developer's personal username and password", 1: "A Connected App using client_credentials with narrowly scoped permissions", 2: "The organisation administrator account", 3: "An SSH key pair for the pipeline" },
      optionNotes: ["Personal credentials break when the person leaves and over-grant access.", "Correct — a scoped Connected App (client_credentials) is the pipeline's non-human identity.", "The org admin account is far too broad.", "SSH keys don't authenticate to the Anypoint control plane APIs."]
    },
    "ia-061": {
      optionEdits: { 0: "DataWeave obfuscation and code signing", 1: "DoS protection, IP allowlists, HTTP limit policies, WAF, Secrets Manager, and perimeter tokenization", 2: "Automatic penetration testing of deployed apps", 3: "Encrypting Object Store v2 content at rest" },
      optionNotes: ["Those aren't Anypoint Security features.", "Correct — Anypoint Security provides edge protections: DoS/IP/WAF/HTTP-limits, Secrets Manager, and tokenization.", "It doesn't run pen tests.", "OSv2 encryption isn't what Anypoint Security provides."]
    },
    "ia-062": {
      optionEdits: { 0: "Move the YAML to a different folder and add a warning comment", 1: "Parameterized queries plus encrypted secure properties with the key injected at deployment", 2: "Base64-encode both the SQL and the passwords", 3: "Add an IP allowlist policy to the API" },
      optionNotes: ["Relocating a plaintext file fixes nothing.", "Correct — parameterized queries stop SQL injection; secure properties (key out-of-band) protect the secrets.", "Base64 is encoding, not security.", "An allowlist doesn't fix injection or plaintext secrets."]
    },
    "ia-063": {
      optionEdits: { 0: "The application log files", 1: "The Anypoint audit log, which records control-plane actions with user, action, object, and timestamp", 2: "Anypoint Monitoring dashboards", 3: "The API's HTTP access logs" },
      optionNotes: ["App logs record runtime events, not who changed a policy.", "Correct — the platform audit log records who changed the policy, when, and on what object.", "Monitoring shows metrics, not administrative changes.", "Access logs record requests, not config changes."]
    },
    "ia-064": {
      optionEdits: { 0: "Internal APIs skip authentication because their callers are internal", 1: "Every API — including System APIs called only by other layers — authenticates callers and uses TLS", 2: "Only Experience APIs need security policies", 3: "Any request originating from inside the VPC is trusted" },
      optionNotes: ["'Internal so trusted' is exactly what zero trust rejects.", "Correct — zero trust means every API authenticates its callers and encrypts traffic, even internally.", "Inner layers need policies too, not just Experience APIs.", "Network location isn't a basis for trust."]
    },
    "ia-065": {
      optionEdits: { 0: "Semantic versioning of the artifact", 1: "Build once, promote the same artifact — env differences belong in externalized properties, not rebuilds", 2: "Test-driven development practice", 3: "Trunk-based development practice" },
      optionNotes: ["Semver is about version numbers, not per-env rebuilds.", "Correct — rebuilding per environment violates build-once/deploy-many; externalize env differences instead.", "TDD is about writing tests first, unrelated here.", "Trunk-based development is a branching model, not this principle."]
    },
    "ia-066": {
      optionEdits: { 0: "mvn clean install on the project", 1: "mvn deploy -DmuleDeploy with a cloudhub2Deployment section (target, env, connected-app creds)", 2: "mvn package -Pprod to build for production", 3: "mvn exchange:publish to publish the asset" },
      optionNotes: ["install builds locally; it doesn't deploy to CloudHub.", "Correct — mvn deploy -DmuleDeploy with the cloudhub2Deployment config deploys the built app.", "package -Pprod just builds; it doesn't deploy.", "exchange:publish publishes an asset, not a deployment."]
    },
    "ia-067": {
      optionEdits: { 0: "Manual clicks documented in a wiki page", 1: "The Anypoint Platform REST APIs and the Anypoint CLI (authenticated via a connected app)", 2: "Editing the control plane database directly", 3: "Exporting and importing Studio projects by hand" },
      optionNotes: ["Manual clicks aren't scriptable automation.", "Correct — the platform REST APIs and Anypoint CLI script instance/policy/deploy tasks.", "There's no supported direct control-plane DB access.", "Studio export/import isn't automation of platform operations."]
    },
    "ia-068": {
      optionEdits: { 0: "Rely on default CloudHub logs, which are retained forever", 1: "Disable CloudHub logging (with org permission) and add a log4j2 appender shipping to Splunk, or use Monitoring log forwarding", 2: "Print the logs into the message payload", 3: "Screenshot the CloudHub log viewer each week" },
      optionNotes: ["CloudHub log retention is limited, not permanent.", "Correct — ship logs to Splunk via a log4j2 appender (or Monitoring log forwarding) for central, long-retention storage.", "Logging to the payload is nonsensical.", "Screenshots aren't a retention strategy."]
    },
    "ia-069": {
      optionEdits: { 0: "Async logging is always worse than synchronous", 1: "Higher throughput/lower latency, but buffered entries can be lost on crash and ordering weakens — keep audit logs sync", 2: "Async loggers permanently double memory usage", 3: "Log4j 2 does not support async logging" },
      optionNotes: ["Async logging has clear benefits; it's a trade-off, not strictly worse.", "Correct — async boosts throughput but risks losing buffered logs on crash; keep audit-critical logs synchronous.", "It doesn't permanently double memory.", "Log4j 2 supports async loggers."]
    },
    "ia-070": {
      optionEdits: { 0: "1=Runtime Manager alert, 2=BAT, 3=Anypoint Monitoring", 1: "1=Anypoint Monitoring dashboards/alerts, 2=Runtime Manager alert, 3=API Functional Monitoring (BAT)", 2: "1=Audit log, 2=Visualizer, 3=Exchange", 3: "1=BAT, 2=Anypoint Monitoring, 3=Runtime Manager" },
      optionNotes: ["Error-rate trending is Monitoring, and correctness-now is BAT — this misassigns them.", "Correct — error rate=Monitoring, deploy failure=Runtime Manager, correctness-now=Functional Monitoring (BAT).", "Audit/Visualizer/Exchange answer none of these operational questions.", "This scrambles the three tools' roles."]
    },
    "ia-071": {
      optionEdits: { 0: "In the flow XML; every deployment increments the major version", 1: "In the Maven POM using semantic versioning; a breaking change increments MAJOR", 2: "In Runtime Manager properties, using time-based versioning", 3: "Versions are unnecessary for internal applications" },
      optionNotes: ["Flow XML isn't where artifact versions live, and per-deploy majors are wrong.", "Correct — version in the POM with semver; a backwards-incompatible change bumps MAJOR.", "Runtime Manager properties aren't the artifact version source.", "Even internal apps need versioning for safe promotion."]
    },
    "ia-072": {
      optionEdits: { 0: "Each application generates its own random correlation ID", 1: "The correlation ID propagates via X-Correlation-ID across HTTP calls and is included in log patterns, so all apps log the same ID", 2: "Correlation requires a shared custom database", 3: "Only CloudHub deployments support correlation IDs" },
      optionNotes: ["Independent random IDs can't be joined across apps.", "Correct — Mule propagates the correlation ID over X-Correlation-ID and logs it, tying the transaction together.", "No shared database is needed.", "Correlation works on any Mule deployment."]
    },
    "ia-093": {
      optionEdits: { 0: "A shared admin account used for both humans and pipelines", 1: "Identity management (SAML/OIDC) for humans + Connected Apps (client_credentials) for pipelines", 2: "Client ID enforcement for both humans and pipelines", 3: "SSH keys for both humans and pipelines" },
      optionNotes: ["A shared admin account violates both requirements.", "Correct — SSO federation for people, scoped Connected Apps for pipelines: no personal credentials in CI.", "Client ID enforcement is an API-consumer policy, not platform login.", "SSH keys don't authenticate to the control plane."]
    },
    "ia-095": {
      optionEdits: { 0: "The application log files", 1: "The Anypoint audit log (UI or query API), exportable to the SIEM", 2: "Anypoint Visualizer's dependency graph", 3: "The Git commit history of the project" },
      optionNotes: ["App logs don't record who deployed or changed policies.", "Correct — the platform audit log captures who deployed and changed policies, exportable to a SIEM.", "Visualizer shows topology, not admin actions.", "Git shows code changes, not platform deployments/policy edits."]
    },
    "ia-096": {
      optionEdits: { 0: "A -> B -> C -> D", 1: "B -> C -> A -> D", 2: "C -> B -> D -> A", 3: "B -> A -> C -> D" },
      optionNotes: ["Deploying before building/publishing the artifact is out of order.", "Correct — build+test (B), publish artifact (C), deploy to test (A), then promote the same artifact to prod (D).", "Publishing before building the tested artifact is wrong.", "Deploying to test before publishing the versioned artifact breaks promotion."]
    },
    "ia-097": {
      optionEdits: { 0: "They are sent to CloudHub's log viewer", 1: "To container stdout, forwarded by the cluster's log-forwarding to the org's logging system (ELK/Splunk)", 2: "They are discarded by default", 3: "Only to Anypoint Monitoring, with no alternative" },
      optionNotes: ["Runtime Fabric doesn't use CloudHub's log viewer.", "Correct — RTF apps log to stdout; the cluster forwards to the central logging system.", "Logs aren't discarded; they go to stdout/forwarding.", "Monitoring is one option, not the only path."]
    }
  }
};
