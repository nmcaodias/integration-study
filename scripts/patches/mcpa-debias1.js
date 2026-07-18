/* MCPA de-bias · sections p1–p2 (single-answer).
 * The correct option was the only long, fully-qualified answer while distractors
 * were terse stubs — a length tell once options shuffle at display. Rewrite the
 * distractors to be plausible and parallel in length/specificity, trim a few
 * over-long correct options, and add per-option notes. Answer keys unchanged. */
module.exports = {
  questions: {
    "pa-001": {
      optionEdits: {
        0: "Rewrite it as a Mule application so autodiscovery can enforce the policies inside the runtime",
        2: "Embed the Anypoint autodiscovery element in the Node.js service so it registers with API Manager",
        3: "Nothing extra — API Manager discovers and polices any HTTP endpoint on the network automatically"
      },
      optionNotes: [
        "A full rewrite is unnecessary — a gateway governs the service as-is; rewriting is cost without benefit.",
        "Correct — non-Mule implementations join the governed network behind an API-Manager proxy or Flex Gateway that enforces the policies.",
        "Autodiscovery is a Mule-runtime capability; a Node.js process cannot host the autodiscovery element.",
        "Policies never apply automatically; an endpoint is governed only once it sits behind a managed API instance."
      ]
    },
    "pa-002": {
      optionEdits: {
        0: "System API; it would be an anti-pattern the moment it began orchestrating logic across several other APIs",
        2: "Process API; it becomes an anti-pattern when tied to one specific channel's data shape",
        3: "It sits outside the three-layer model, since API-led connectivity has no place for channel-specific facades"
      },
      optionNotes: [
        "System APIs unlock one backend; orchestrating across APIs is Process-layer work, not the violation described.",
        "Correct — channel-specific shaping over a Process API is the Experience layer; reaching into backends or hoarding logic breaks it.",
        "Process APIs are deliberately channel-agnostic; being channel-specific is an Experience trait, not a Process anti-pattern.",
        "It does fit — a channel-specific facade over a Process API is exactly an Experience API."
      ]
    },
    "pa-003": {
      optionEdits: {
        0: "The running Mule worker or replica that hosts the deployed API implementation",
        1: "A managed deployment of one API specification version in a specific environment — what policies, SLA tiers, contracts, and alerts attach to",
        2: "The RAML/OAS specification document authored in Design Center before deployment",
        3: "A registered consumer application that holds a contract and client credentials"
      },
      optionNotes: [
        "That's a runtime unit in Runtime Manager, not the governance object in API Manager.",
        "Correct — the instance is the governed deployment of a spec version per environment; policies/tiers/contracts/alerts hang off it.",
        "The spec is the design artifact; the instance is what you create in API Manager from it.",
        "A client application consumes an instance via a contract; it isn't the instance itself."
      ]
    },
    "pa-004": {
      optionEdits: {
        0: "Runtime Manager and Access Management, where deployments and org permissions are administered",
        2: "Anypoint Studio only, importing the API's connector to start building against it",
        3: "Design Center, where the API specification is authored and the mocking service lives"
      },
      optionNotes: [
        "Those are operator/admin tools; a consumer discovering an API starts in Exchange, not Runtime Manager.",
        "Correct — consumers find, read, mock, and request access to the API in Exchange, then use its portal/console.",
        "Studio is for builders; a consumer doesn't need the IDE to discover or request access.",
        "Design Center is for API designers/authors, not consumers seeking access to a published API."
      ]
    },
    "pa-006": {
      optionEdits: {
        0: "More vCores, so the teams have capacity to deploy additional integrations",
        2: "A larger Exchange entitlement to hold more published assets across the teams",
        3: "Switching deployments to Runtime Fabric to standardize the runtime plane"
      },
      optionNotes: [
        "Capacity isn't the gap — reuse and standards are; more vCores won't create consistency.",
        "Correct — a C4E sets shared standards, curates reusable assets, and measures consumption to drive reuse.",
        "Exchange size isn't limiting reuse; the missing piece is the operating model that drives publishing/consuming.",
        "RTF is a deployment choice; it doesn't address inconsistent standards or near-zero reuse."
      ]
    },
    "pa-008": {
      optionEdits: {
        0: "A container-based deployment technology for running Mule apps on Kubernetes",
        1: "MuleSoft's delivery methodology built around business outcomes, technology delivery, and organizational enablement (Catalyst Knowledge Hub playbooks)",
        2: "A monitoring and observability product within the Anypoint Platform suite",
        3: "A RAML/OAS linting tool that enforces API design standards during authoring"
      },
      optionNotes: [
        "That describes a Runtime Fabric-style deployment target, not Catalyst.",
        "Correct — Catalyst is MuleSoft's outcomes-driven delivery methodology, with playbooks in the Knowledge Hub.",
        "Monitoring is Anypoint Monitoring/Visualizer; Catalyst is a methodology, not a product.",
        "Linting is a design-time tooling concern, unrelated to the Catalyst methodology."
      ]
    },
    "pa-009": {
      optionEdits: {
        0: "US control plane with CloudHub workers in the Frankfurt region for the claim payloads",
        2: "Private Cloud Edition for metadata plus CloudHub for the claim payloads",
        3: "EU control plane with CloudHub US-East workers, encrypting claim payloads in transit and at rest"
      },
      optionNotes: [
        "A US control plane puts management metadata outside the EU, violating the first requirement.",
        "Correct — EU control plane keeps metadata in-region; customer-hosted/RTF runtimes keep payloads in the German data centers.",
        "PCE is a self-managed control plane; the need is EU-region metadata, and CloudHub payloads would still leave the DCs.",
        "US-East workers process payloads outside Germany; encryption doesn't satisfy residency for the payload location."
      ]
    },
    "pa-010": {
      optionEdits: {
        0: "API specifications and fragments published to Exchange",
        1: "Deployment configurations and application properties",
        3: "Monitoring and analytics metadata from deployed apps"
      },
      optionNotes: [
        "Specs live in the control plane (Exchange/Design Center) — it does process these.",
        "Deployment configuration is control-plane data used to orchestrate runtimes.",
        "Correct — runtime payloads stay in the runtime plane; the MuleSoft control plane never sees business data.",
        "Monitoring metadata is aggregated in the control plane; it's metadata, not the payloads themselves."
      ]
    },
    "pa-011": {
      optionEdits: {
        0: "Both map to identity management, since both authenticate against the same Azure AD",
        1: "Users -> identity management (SAML/OIDC federation); API consumers -> client management (Azure AD as external OAuth client provider) with token-validating policies",
        2: "Both map to client management, since Azure AD issues the OAuth tokens involved",
        3: "Neither integration is supported; Anypoint federates only its own identity provider"
      },
      optionNotes: [
        "Platform-user login is identity management, but consumer OAuth is client management — different capabilities.",
        "Correct — user federation is identity management; external OAuth for consumers is client management plus a token policy.",
        "User authentication isn't client management; only the API-consumer side maps there.",
        "Both are supported — Anypoint federates identity providers and integrates external OAuth client providers."
      ]
    },
    "pa-012": {
      optionEdits: {
        0: "In the MuleSoft control plane region where the platform is administered",
        2: "Replicated globally across all Anypoint regions for low-latency access",
        3: "On the developer's machine until the application is redeployed"
      },
      optionNotes: [
        "They're runtime-plane services; the control plane holds metadata, not MQ/OS data.",
        "Correct — MQ and Object Store v2 data live in the runtime region you provision, which matters for residency and DR.",
        "There's no global replication; data stays in its provisioned region.",
        "These are hosted platform services, not local developer state."
      ]
    }
  }
};
