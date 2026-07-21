/* MCPA · balance the new hard batch. All 11 new questions had the correct option
 * as the longest (thorough answers), pushing longest-correct to 35%. Extend the
 * top distractor past the correct answer on each so the correct option is no
 * longer identifiable by length. Meaning/answers unchanged. */
module.exports = {
  questions: {
    "pa-102": { optionEdits: { 1: "Business groups are the correct unit per API, but the team also forgot to create one dedicated environment per API, which is what actually enables promotion and reusable asset sharing across all forty of the separate groups" } },
    "pa-103": { optionEdits: { 1: "The changes are genuinely minor; consumers broke only because they failed to re-import the updated API specification from Exchange after the release and regenerate their client code against the new contract" } },
    "pa-104": { optionEdits: { 1: "This is the correct role of a System API — expose the backend exactly as it is — and the coupling concern belongs only to the Experience layer, which is the sole place where consumer-facing contracts are ever meant to be stabilized against backend change" } },
    "pa-105": { optionEdits: { 1: "Policy order has no effect on an API instance because all applied policies are evaluated simultaneously, so the real problem must be a missing autodiscovery binding between the deployed application and its API instance in this environment" } },
    "pa-106": { optionEdits: { 1: "Two separate API instances in different environments, because a single API instance can only ever expose exactly one SLA tier to all of its consumers at once, so evaluators and partners can never share the same published API" } },
    "pa-107": { optionEdits: { 1: "Promoting the same artifact across environments is unsupported for autodiscovery, so TEST must instead be given a separately rebuilt artifact that has its own environment-specific api.id compiled directly into the packaged application at build time" } },
    "pa-108": { optionEdits: { 3: "The API should instead be moved to Runtime Fabric, because a public Experience API can never be safely hosted on CloudHub without the additional network isolation that only a customer-managed Kubernetes runtime plane is able to provide" } },
    "pa-109": { optionEdits: { 1: "The only single point of failure is the shared load balancer, so replacing it with a dedicated load balancer removes every availability risk in this topology, since the load balancer is the sole component through which all inbound traffic must pass" } },
    "pa-110": { optionEdits: { 1: "The shared load balancer is sufficient, since it already supports custom domains and mutual TLS for any CloudHub application at no extra cost, which makes provisioning a dedicated load balancer an unnecessary expense for this particular partner integration" } },
    "pa-111": { optionEdits: { 3: "Caching per-user data is fine as long as the TTL is lowered to just a few seconds, which prevents cross-user leakage because each entry expires well before a second user could ever be served another user's cached response" } },
    "pa-112": { optionEdits: { 1: "A Runtime Manager CPU and memory alert will catch it, because returning incorrect data always drives measurable extra resource usage that the alert can detect, since any deviation in output correctness is reflected proportionally in the worker's consumption" } }
  }
};
