/* MCD1 · s4 — Structuring Mule Applications */
module.exports = {
  sections: {
    s4: {
      topicDocs: {
        "The application descriptor (mule-artifact.json)": "https://docs.mulesoft.com/mule-runtime/latest/application-descriptor",
        "Splitting configuration across files": "https://docs.mulesoft.com/mule-runtime/latest/mule-app-structure",
        "Choosing flow, sub-flow, or private flow": "https://docs.mulesoft.com/mule-runtime/latest/about-flows"
      },
      appendNotes: `
<h3>The application descriptor (mule-artifact.json)</h3>
<p>Every Mule 4 app has a <code>mule-artifact.json</code> at its root describing the deployable artifact to the runtime:</p>
<pre><code>{
  "minMuleVersion": "4.4.0",
  "secureProperties": ["db.password", "api.token"],
  "configs": ["global.xml", "order-api.xml"],
  "redeploymentEnabled": true
}</code></pre>
<ul>
<li><code>minMuleVersion</code> — the runtime refuses to deploy on an older version.</li>
<li><code>secureProperties</code> — names of properties to keep encrypted/hidden (their values live in secure config).</li>
<li>Build settings (dependencies, packaging) live in <code>pom.xml</code>; the descriptor is about the <em>runtime artifact</em>, not the Maven build.</li>
</ul>

<h3>Splitting configuration across files</h3>
<p>All XML files under <code>src/main/mule/</code> are <strong>combined into one application</strong> at deploy time, so you are free to organize by concern: <code>global.xml</code> for connector configs and property placeholders, one file per API/flow group, <code>error.xml</code> for a shared error handler. Flow Reference, global-config references, and error-handler references all resolve across files. This keeps large apps navigable without changing runtime behavior.</p>

<h3>Choosing flow, sub-flow, or private flow</h3>
<table>
<tr><th>Need</th><th>Use</th></tr>
<tr><td>An entry point triggered by a source (HTTP, Scheduler…)</td><td>Flow (with a source)</td></tr>
<tr><td>Reusable logic that must run under the caller's error handling and transaction</td><td>Sub-flow</td></tr>
<tr><td>Reusable logic that needs its own error handling</td><td>Private flow</td></tr>
<tr><td>Fire-and-forget work that must not delay the response</td><td>Async scope</td></tr>
<tr><td>Callable from DataWeave <code>lookup()</code></td><td>Flow or private flow (never a sub-flow)</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> the giveaway for sub-flow vs private flow is <em>error handling</em> and <em>transactions</em> — a sub-flow is inlined into the caller (shares both); a private flow is its own processing scope (its own error handler).</p>`
    }
  },
  questions: {
    "m1-020": {
      options: [
        "Only the payload, as if it had crossed an HTTP transport boundary",
        "The payload and attributes, but a fresh empty set of variables",
        "The entire Mule event — payload, attributes, and variables",
        "A private copy of the event whose changes are discarded on return"
      ],
      answer: 2,
      explanation: "A Flow Reference passes the whole Mule event, and any changes the referenced flow makes (payload, new variables) come back to the caller. Crossing a transport boundary (HTTP) is what strips variables and gives a new event.",
      optionNotes: [
        "Wrong — that describes an HTTP call between apps, not a Flow Reference within one app.",
        "Wrong — variables travel through a Flow Reference; they are not reset.",
        "Correct — the referenced flow receives and can modify the full event, and the changes return to the caller.",
        "Wrong — a Flow Reference is not a copy; the Async scope is what gets a discarded copy."
      ]
    },
    "m1-021": {
      options: [
        "Hardcode both credential sets and select one at runtime with a Choice router",
        "Put each environment's values in a YAML properties file chosen by -Denv, read as ${db.user}",
        "Store the credentials inside the flow name and parse them out at startup",
        "Set the credentials as flow variables at the beginning of every flow"
      ],
      answer: 1,
      explanation: "Property placeholders externalize configuration: per-environment YAML files (dev.yaml, prod.yaml) whose name is built from an env system property (config/${env}.yaml), referenced with ${db.user} in configs and p('db.user') in DataWeave. The same JAR then runs everywhere.",
      optionNotes: [
        "Wrong — hardcoding both sets still requires a code change to add an environment and leaks secrets into the artifact.",
        "Correct — externalized, environment-selected property files are the standard Mule 4 approach.",
        "Wrong — flow names are identifiers, not a configuration store.",
        "Wrong — repeating credentials as variables in every flow duplicates config and doesn't externalize it per environment."
      ]
    },
    "m1-022": {
      options: [
        "To bundle several applications together into one single deployable JAR file",
        "To let apps on the same customer-hosted runtime share global configs, e.g. one HTTP Listener port",
        "To allow CloudHub applications on separate workers to pool and share vCores",
        "To group related API specifications and connectors together inside Exchange"
      ],
      answer: 1,
      explanation: "A Mule domain holds shared global configurations so multiple apps on the same customer-hosted runtime can share resources such as an HTTP Listener config (port sharing) and connections. Domains are not supported on CloudHub, where each app is isolated on its own worker.",
      optionNotes: [
        "Wrong — each app is still its own artifact; a domain shares config, it doesn't merge apps into one JAR.",
        "Correct — shared global configs (ports, connections) across co-located customer-hosted apps is exactly what a domain provides.",
        "Wrong — CloudHub workers are isolated and cannot share a domain or vCores.",
        "Wrong — grouping assets is Exchange's job; a domain is a runtime construct, not a catalog."
      ]
    }
  }
};
