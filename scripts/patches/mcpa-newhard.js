/* MCPA · 11 new hard platform-architect scenarios (ids pa-102..pa-112), several
 * exhibit-based, spread across sections and chosen NOT to duplicate existing
 * topics (checked against the bank). Options authored so the correct answer is
 * not the longest (bank bias is a healthy 1.25x). */
module.exports = {
  addQuestions: [
    {
      id: "pa-102", section: "p2", level: "hard",
      q: "A platform team creates a NEW business group for every single API so each can be 'isolated', ending up with 40 business groups. Six months in, sharing reusable assets and running Dev→Prod promotion has become painful. What is the design mistake?",
      options: [
        "Business groups should model organizational/ownership boundaries, not individual APIs; isolation between an app's stages is what environments are for, and over-fragmenting groups blocks reuse and complicates access",
        "Business groups are the correct unit per API, but the team forgot to also create one environment per API, which is what actually enables promotion and asset sharing",
        "The mistake is using business groups at all — everything should live in the root organization, and isolation should be achieved purely through per-API roles",
        "Nothing is wrong with the structure; 40 business groups is the expected outcome for 40 APIs, and the promotion pain simply means more automation is required"
      ],
      answer: 0,
      optionNotes: [
        "Correct — business groups model ownership/organizational boundaries (teams, lines of business); an app's Dev/Test/Prod isolation is the job of environments. A group per API fragments the org and blocks cross-group reuse.",
        "Environments isolate stages within a group; adding one per API doesn't fix the over-fragmentation and isn't how promotion is meant to work.",
        "Flattening everything to root loses legitimate team isolation; the fix is right-sized groups plus environments, not zero groups.",
        "40 groups for 40 APIs is the anti-pattern causing the pain, not an expected outcome."
      ],
      explanation: "Business groups partition the organization by ownership (teams/LOBs) and carry their own environments and role assignments. Per-stage isolation is what environments provide. Creating a group per API fragments governance, blocks asset reuse across groups, and multiplies access-management overhead."
    },
    {
      id: "pa-103", section: "p3", level: "hard",
      q: "Refer to the exhibit. Consumers of the Orders API break after this release even though only a 'minor' version bump was published. What went wrong?",
      exhibit: "v1.3.0  →  v1.4.0   (published as a MINOR bump)\n- response field `status` renamed  \"OPEN\" → state: \"OPEN\"   (field renamed)\n- required request field `currency` added (no default)",
      options: [
        "Both changes are breaking — a renamed response field and a new required request field — so this had to be a MAJOR version; labelling it minor misled consumers into upgrading without code changes",
        "The changes are genuinely minor; consumers broke only because they failed to re-import the API specification from Exchange after the release",
        "Renaming a field is a minor change, but adding any request field at all is always a major change, so only the second change was mislabelled",
        "Semantic versioning doesn't apply to REST APIs, so the version number is irrelevant and the breakage is unrelated to how it was labelled"
      ],
      answer: 0,
      optionNotes: [
        "Correct — renaming a response field and adding a required request field both break existing consumers, so semver demands a MAJOR bump; a minor label signals backward compatibility that isn't there.",
        "Re-importing doesn't help when the contract changed incompatibly; the version was mislabelled.",
        "Renaming a field IS breaking (consumers read the old name); the rule stated is wrong.",
        "Semver absolutely applies to API contracts and is how compatibility is communicated."
      ],
      explanation: "Under semantic versioning, backward-incompatible changes (renaming/removing fields, adding required inputs) require a MAJOR bump. Publishing them as a minor version tells consumers it's safe to upgrade in place, which is exactly why they broke."
    },
    {
      id: "pa-104", section: "p4", level: "hard",
      q: "Refer to the exhibit. A System API over SAP exposes SAP's native structures directly to all consumers. Multiple Process and Experience APIs now depend on these shapes. Why is this a problem, and what should a System API expose?",
      exhibit: "SAP System API  GET /orders/{id}  ->  { MANDT, VBELN, ERDAT, NETWR, WAERK, ... }\n(raw SAP IDoc/table field names passed straight through to every consumer)",
      options: [
        "A System API should present a clean, stable abstraction of the underlying system; leaking SAP's native field names couples every consumer to SAP so any SAP change ripples outward and a future SAP replacement breaks everyone",
        "This is the correct role of a System API — expose the backend exactly as-is — and the coupling concern belongs only to the Experience layer",
        "The problem is purely naming; renaming the fields to camelCase while keeping the same structure fully removes the coupling to SAP",
        "System APIs must add orchestration, so the fix is to have this API also call the Inventory and Billing systems and merge their data"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a System API's job is to unlock a system behind a stable, technology-neutral contract; passing raw SAP fields couples consumers to SAP and defeats the insulation the layer exists to provide.",
        "Exposing the backend raw is the anti-pattern; the System layer is precisely where you insulate consumers from it.",
        "camelCase alone still exposes SAP's structure/semantics; a stable abstraction, not cosmetic renaming, is needed.",
        "Orchestration across systems belongs in a Process API, not a System API — that would couple back ends together."
      ],
      explanation: "The System layer exists to hide a backend behind a stable, canonical-ish contract so consumers don't couple to it. Leaking SAP's native field names propagates every SAP change to all consumers and makes a future SAP replacement a breaking event for the whole network."
    },
    {
      id: "pa-105", section: "p5", level: "hard",
      q: "Refer to the exhibit. An API instance has these policies but unauthenticated callers are still consuming the rate-limit budget and occasionally reaching the backend. What is the cause?",
      exhibit: "Applied policy order:\n  1. Rate Limiting - SLA   (200 req/min)\n  2. Client ID Enforcement\n  3. JWT Validation",
      options: [
        "Client ID Enforcement / JWT Validation must run BEFORE rate limiting so unauthenticated requests are rejected first; with rate limiting first, invalid calls are counted (and can pass) before identity is ever checked",
        "Policy order has no effect on an API instance — all applied policies evaluate simultaneously — so the real problem must be a missing autodiscovery binding",
        "The order is correct; the issue is that Rate Limiting - SLA should be replaced with basic Rate Limiting, after which unauthenticated calls are blocked automatically",
        "JWT Validation must always be the very first policy, and moving only it to the top resolves the issue regardless of where client-id enforcement sits"
      ],
      answer: 0,
      optionNotes: [
        "Correct — authentication/identity policies should precede rate limiting so unauthenticated traffic is rejected before consuming budget or reaching the backend; order matters and is evaluated top-down.",
        "Applied policies execute in order, not simultaneously; ordering is exactly the lever here.",
        "Switching SLA→basic rate limiting doesn't add authentication; identity policies still need to run first.",
        "It's not just JWT — client-id enforcement must also precede rate limiting; fixing one policy's position isn't sufficient."
      ],
      explanation: "Gateway policies execute in their applied order. Authentication and client-id policies must precede rate limiting so unauthenticated or unidentified requests are rejected before they consume the SLA budget or slip through toward the backend."
    },
    {
      id: "pa-106", section: "p5", level: "hard",
      q: "A public API will be offered to anonymous evaluators (self-service, throttled hard) and to vetted partners (higher limits, must be approved). The architect wants both onboarding paths on one API. Which governance design fits?",
      options: [
        "Two SLA tiers on the same API — a Free tier with auto-approval and low limits, and a Partner tier requiring manual approval with higher limits — each issuing a contract to the requesting client application",
        "Two separate API instances in different environments, since a single API instance can only ever expose one SLA tier to all consumers at once",
        "A single tier with a very high limit plus a custom policy that inspects each caller's company name to decide their rate at runtime",
        "No tiers at all — approve every client application manually and rely on the analytics dashboard to spot anyone exceeding a fair-use limit after the fact"
      ],
      answer: 0,
      optionNotes: [
        "Correct — SLA tiers model exactly this: a Free tier (auto-approved, low limit) and a Partner tier (manual approval, higher limit), each producing a per-application contract on the one API.",
        "One API instance can define multiple SLA tiers; separate environments/instances aren't required.",
        "Hand-rolling rate decisions from company names in a custom policy is fragile and bypasses the built-in tier/contract model.",
        "After-the-fact analytics doesn't enforce limits; tiers enforce them and automate the differing approval paths."
      ],
      explanation: "SLA tiers are designed for differentiated access on a single API: define a Free tier (auto-approved, low limits) and a Partner tier (manual approval, higher limits). Each consumer's client application requests a tier and receives a contract that the Rate-Limiting-SLA policy enforces."
    },
    {
      id: "pa-107", section: "p6", level: "hard",
      q: "Refer to the exhibit. A pipeline promotes the SAME artifact across environments, but in TEST the API instance shows 'Unregistered' and its policies aren't enforced, while DEV works. What is the most likely cause?",
      exhibit: "app packaged once; promoted DEV → TEST → PROD\nautodiscovery apiId = ${api.id}\nDEV  props: api.id=1001 , client_id/secret = <dev connected app>\nTEST props: api.id=1001 , client_id/secret = <dev connected app>   # copied from DEV",
      options: [
        "TEST is pointing at DEV's api.id and DEV's platform credentials, so it never pairs with the TEST API instance; each environment needs its own api.id plus a Connected App scoped to that environment",
        "Promoting the same artifact across environments is unsupported for autodiscovery, so TEST must be given a separately rebuilt artifact with its api.id compiled in",
        "The api.id is correct; 'Unregistered' only means the TEST worker hasn't finished starting, and it will pair automatically within a few hours with no change",
        "Autodiscovery can pair only one environment per application, so enabling it in DEV permanently prevents TEST from ever registering"
      ],
      answer: 0,
      optionNotes: [
        "Correct — TEST reuses DEV's api.id and Connected App, so it registers against DEV's instance (or none in TEST); each environment must supply its own api.id and env-scoped platform credentials.",
        "Build-once/promote-many is exactly right; the fix is per-env config, not a rebuild.",
        "'Unregistered' reflects a pairing failure, not a slow start; it won't self-heal without correct config.",
        "Autodiscovery pairs per environment via that environment's api.id/credentials; DEV doesn't lock out TEST."
      ],
      explanation: "Autodiscovery pairs a running app to its API instance using api.id plus platform (Connected App) credentials for THAT environment. Copying DEV's values into TEST makes TEST target the wrong instance, so its own instance stays Unregistered and unenforced. Config differs per environment; the artifact does not."
    },
    {
      id: "pa-108", section: "p6", level: "hard",
      q: "A team plans to place a purely public, stateless Experience API — no private connectivity, no custom domain, no IP allowlisting — inside a new Anypoint VPC 'for security'. What is the best architectural feedback?",
      options: [
        "A VPC adds cost and network complexity without benefit here; it's justified by private connectivity, VPN/peering, custom DLB/TLS, or IP control — none of which this API needs, so security should come from policies and TLS instead",
        "Correct call — every production API must run in a VPC regardless of its connectivity needs, as that is the only way to apply API Manager policies",
        "A VPC is required specifically because the API is stateless, since stateless apps cannot be isolated at the load-balancer layer otherwise",
        "The API should instead be moved to Runtime Fabric, because a public Experience API can never be safely hosted on CloudHub"
      ],
      answer: 0,
      optionNotes: [
        "Correct — VPCs exist for private connectivity, VPN/peering, dedicated LB/custom TLS, or IP control; a public API needing none of those gains nothing, so secure it with API Manager policies and TLS.",
        "Policies are applied via API Manager/autodiscovery regardless of VPC; a VPC isn't required to govern an API.",
        "Statelessness has nothing to do with needing a VPC.",
        "A public Experience API is perfectly fine on CloudHub; RTF isn't warranted here."
      ],
      explanation: "An Anypoint VPC is warranted by private connectivity, VPN/peering, a dedicated load balancer with custom TLS, or inbound IP control. An API with none of those requirements gains only cost and complexity from a VPC — its security comes from API Manager policies and TLS."
    },
    {
      id: "pa-109", section: "p7", level: "hard",
      q: "Refer to the exhibit. Identify the single points of failure in this revenue-critical CloudHub deployment and the correct remediations.",
      exhibit: "[ shared LB ] → [ 1 worker ] → [ in-memory Object Store ] → [ 1 on-prem DB via 1 VPN tunnel ]",
      options: [
        "Single worker, in-memory state, and a single VPN tunnel are all SPOFs: run ≥2 workers across AZs, move state to Object Store v2, and provision redundant VPN tunnels (and a DLB if custom domain/TLS is needed)",
        "The only SPOF is the shared load balancer; replacing it with a dedicated load balancer removes every availability risk in this topology",
        "There are no SPOFs because CloudHub automatically replicates a single worker across availability zones behind the scenes",
        "The in-memory Object Store is the only concern; increasing the single worker's vCore size resolves the availability requirement"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a lone worker, on-heap state, and one VPN tunnel each fail independently; remediate with ≥2 workers across AZs, Object Store v2 for shared state, and redundant tunnels (DLB for custom domain/TLS).",
        "A DLB alone leaves the single worker, in-memory state, and single tunnel as SPOFs.",
        "A single worker is a SPOF; CloudHub does not silently run two for you.",
        "Bigger vCores add capacity, not redundancy; one worker is still a SPOF."
      ],
      explanation: "High availability means no single component whose loss takes the system down. Here the lone worker, the in-memory Object Store, and the single VPN tunnel are all SPOFs — fixed by multiple workers across AZs, shared Object Store v2 state, and redundant connectivity."
    },
    {
      id: "pa-110", section: "p7", level: "hard",
      q: "A partner integration requires that callers authenticate with a client CERTIFICATE at the transport layer, terminated under the company's own domain and certificate on CloudHub. Which load-balancer choice and capability meet this?",
      options: [
        "A Dedicated Load Balancer, which can present the company's custom certificate and be configured for two-way (mutual) TLS so clients must present a valid certificate — the shared load balancer can't do custom certs or mTLS",
        "The shared load balancer, since it already supports custom domains and mutual TLS for any CloudHub application at no additional cost",
        "A Dedicated Load Balancer, but only for the custom domain; client-certificate authentication must instead be handled by a Client ID Enforcement policy",
        "Neither load balancer can do this on CloudHub; the app must move to Runtime Fabric to terminate mutual TLS"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a Dedicated Load Balancer presents custom certificates and supports two-way TLS, requiring clients to present a valid certificate; the shared LB supports neither custom certs nor mTLS.",
        "The shared LB does not offer custom certificates or mutual TLS.",
        "Client ID Enforcement is an application-credential policy, not transport-level certificate auth; the DLB itself does mTLS.",
        "CloudHub's DLB terminates mutual TLS; moving to RTF isn't required."
      ],
      explanation: "Transport-level client-certificate auth (mutual TLS) plus a custom domain/certificate on CloudHub requires a Dedicated Load Balancer, which supports custom certs and two-way TLS. The shared load balancer offers neither, and client-id enforcement is a different (application) layer."
    },
    {
      id: "pa-111", section: "p8", level: "hard",
      q: "Refer to the exhibit. An HTTP Caching policy is applied to speed up a per-user endpoint, but users start seeing each other's data. What is wrong, and the correct fix?",
      exhibit: "GET /me/orders   (returns the caller's own orders; Authorization: Bearer <user>)\nHTTP Caching policy: cacheKey = request path only  (Authorization ignored)",
      options: [
        "The cache key ignores the user identity, so one user's cached response is served to others; either include the user/authorization in the cache key or don't cache per-user, authenticated responses at all",
        "HTTP caching never works with Authorization headers, so the only fix is to remove authentication from the endpoint entirely",
        "The policy is correct; the leak is caused by the backend and is unrelated to how the cache key is defined",
        "Caching per-user data is fine as long as the TTL is lowered to a few seconds, which prevents cross-user leakage"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a cache key of path-only collapses all users onto one entry; include the user identity in the key, or simply don't cache personalized authenticated responses.",
        "Caching can vary by Authorization/user; you don't have to strip auth — you must key on it.",
        "The leak is a direct consequence of the path-only cache key, not the backend.",
        "A short TTL still serves one user's entry to another within the window; it doesn't fix cross-user leakage."
      ],
      explanation: "A cache is only correct if its key captures everything the response varies by. A per-user response keyed on path alone serves the first user's data to everyone. Include the user/authorization in the key, or don't cache personalized authenticated responses — reserve edge caching for shared, non-personalized content."
    },
    {
      id: "pa-112", section: "p9", level: "hard",
      q: "After a deploy, the Checkout API still returns HTTP 200 quickly and all infrastructure metrics (CPU, memory, latency, error rate) are green, but the order totals in responses are wrong. Which monitoring capability is designed to catch this, and why won't the metric alerts?",
      options: [
        "API Functional Monitoring (BAT) — scheduled synthetic calls that assert on the response body/schema — catches a wrong-but-200 payload, whereas metric alerts only watch infrastructure signals that a correctness bug doesn't move",
        "A Runtime Manager CPU/memory alert will catch it, because returning wrong data always drives measurable extra resource usage the alert can detect",
        "An API Manager 5xx-rate alert will catch it, since a wrong total is internally treated as a server error and surfaces in the 5xx metrics",
        "No tool can detect this before customers report it, so the only option is to add more verbose logging and have an engineer read the logs continuously"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Functional Monitoring issues synthetic requests and asserts on the actual response, so a fast, healthy-looking 200 with wrong data fails the check even when infra metrics are green.",
        "A wrong total costs no extra CPU/memory; infra alerts stay green.",
        "A logic bug that returns 200 doesn't raise the 5xx rate; API Manager metrics won't flag it.",
        "Functional Monitoring detects exactly this proactively; continuous manual log-reading isn't the design answer."
      ],
      explanation: "Infrastructure/metric alerts answer 'is it up and fast?' — they can't see that a 200 body is wrong. API Functional Monitoring (BAT) answers 'is it correct right now?' via scheduled synthetic calls that assert on the response, so a correctness regression returning a healthy-looking 200 is exactly what it catches."
    }
  ]
};
