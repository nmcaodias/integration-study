/* MCPA · new exhibit-based (visual) questions, mirroring the MCD1/MCD2 pass.
 * Four config/diagram exhibits across high-weight sections (p4/p5/p7/p9), with
 * per-option notes and length-balanced options. */
module.exports = {
  addQuestions: [
    {
      id: "pa-098",
      section: "p5",
      level: "medium",
      q: "Refer to the exhibit. The application deploys successfully, but its API instance shows as 'Unregistered' in API Manager and no policies are enforced. Which cause best fits this configuration?",
      exhibit: "<!-- global.xml -->\n<api-gateway:autodiscovery apiId=\"${api.id}\" flowRef=\"orders-main\"/>\n\n# deploy-time properties (prod)\napi.id=17206543\nanypoint.platform.client_id=6f2a...\nanypoint.platform.client_secret=b91c...",
      options: [
        "The api.id value does not match the API instance ID for this environment",
        "The flowRef names a private subflow instead of the app's main flow",
        "Autodiscovery also needs the RAML to be re-published to Exchange first",
        "The platform client_id and client_secret must be unique per worker"
      ],
      answer: 0,
      optionNotes: [
        "Correct — api.id must equal the target environment's instance ID; an id from another environment leaves the app unregistered.",
        "A wrong flowRef fails the deployment rather than silently leaving the instance unregistered.",
        "Re-publishing the spec isn't required for autodiscovery to bind a running app to its instance.",
        "One Connected App credential pair is used per environment, not per worker."
      ],
      explanation: "Autodiscovery binds a running app to its API instance via api.id plus platform credentials; the classic 'Unregistered' cause is an api.id that doesn't match the instance in that environment."
    },
    {
      id: "pa-099",
      section: "p7",
      level: "easy",
      q: "Refer to the exhibit. The API must survive both a single worker failure and an availability-zone outage. What is the minimal change to this deployment?",
      exhibit: "CloudHub deployment:\n  workers: 1\n  vCores: 1.0\n  region: us-east-1\n  persistent-queues: disabled",
      options: [
        "Increase to at least two workers so CloudHub spreads them across availability zones",
        "Move the deployment to a different CloudHub region that offers more availability zones",
        "Increase the single worker to 4 vCores to add processing headroom",
        "Enable persistent queues so in-flight messages survive a restart"
      ],
      answer: 0,
      optionNotes: [
        "Correct — two or more workers are auto-distributed across AZs and load-balanced, covering both worker and AZ failure.",
        "Every CloudHub region already provides multiple AZs; the gap is worker count, not region.",
        "A bigger single worker is still one point of failure in one AZ.",
        "Persistent queues protect in-flight messages, not the availability of the application."
      ],
      explanation: "High availability on CloudHub comes from running multiple workers (auto-spread across AZs), not from vertical sizing or queue persistence."
    },
    {
      id: "pa-100",
      section: "p9",
      level: "medium",
      q: "Refer to the exhibit. Where is each of these alerts configured?",
      exhibit: "Alert requirements:\n  A) page when API response-time p95 > 800 ms\n  B) page when worker CPU > 85% for 5 min\n  C) page when a policy is violated > 100x/min",
      options: [
        "A and C in API Manager (API-level); B in Runtime Manager / Anypoint Monitoring",
        "All three configured in Runtime Manager, since it owns every runtime and API alert",
        "All three configured in API Manager, since they all ultimately concern the API",
        "A and B in API Manager; C in Runtime Manager as a security event"
      ],
      answer: 0,
      optionNotes: [
        "Correct — response-time and policy-violation alerts are API-Manager API alerts; worker CPU is Runtime Manager / Monitoring.",
        "Runtime Manager doesn't own API response-time or policy-violation alerts.",
        "Worker CPU is an infrastructure metric that API Manager doesn't alert on.",
        "This reverses the split — CPU belongs in Runtime Manager and policy violations in API Manager."
      ],
      explanation: "API-level SLA and policy alerts live in API Manager; worker/infrastructure alerts live in Runtime Manager and Anypoint Monitoring — different failure classes, different homes."
    },
    {
      id: "pa-101",
      section: "p4",
      level: "medium",
      q: "Refer to the exhibit. A new 'Partner Orders' channel needs the same order-placement logic. Which addition follows API-led connectivity?",
      exhibit: "Current design:\n  Web xAPI     -> Orders pAPI -> Orders sAPI (SAP)\n                              \\-> Shipping sAPI (FedEx)\n  Mobile xAPI  -> Orders pAPI",
      options: [
        "Add a Partner xAPI that calls the existing Orders pAPI, reusing its orchestration",
        "Add a Partner xAPI that calls the Orders and Shipping sAPIs directly for speed",
        "Duplicate the Orders pAPI orchestration inside a new Partner pAPI",
        "Let the Partner channel call the Orders pAPI's SAP backend directly"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a thin Experience API per channel reuses the one Process API; that reuse is exactly what the layers exist for.",
        "Skipping the Process API scatters orchestration and consistency logic into the channel.",
        "Duplicating the Process logic invites drift and double maintenance.",
        "Channels must not reach past the layers into a System API's backend."
      ],
      explanation: "New channels get a thin Experience API over the existing Process API; the orchestration lives once in the pAPI and is reused."
    }
  ]
};
