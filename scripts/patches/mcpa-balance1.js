/* MCPA length-balance · p1–p7 (part 1). The correct option was still the longest
 * even after distractor rewrites, leaving a length tell. Trim the over-long
 * correct answers into the distractor band (the full explanation now lives in
 * optionNotes) and lift the shortest distractors. Answers/notes unchanged. */
module.exports = {
  questions: {
    "pa-002": { optionEdits: { 1: "Experience API; it's an anti-pattern if it calls backends directly or hoards business logic" } },
    "pa-003": { optionEdits: { 1: "A managed deployment of one API spec version in a specific environment" } },
    "pa-006": { optionEdits: { 1: "A Center for Enablement that sets shared standards and curates reusable assets" } },
    "pa-008": { optionEdits: { 1: "MuleSoft's outcomes-driven delivery methodology with Knowledge Hub playbooks" } },
    "pa-011": { optionEdits: { 1: "Users -> identity management (federation); consumers -> client management + a token policy" } },
    "pa-012": { optionEdits: { 1: "In the runtime-plane region where they are provisioned (a residency/DR factor)" } },
    "pa-015": { optionEdits: { 1: "Breaking type change -> new MAJOR version (the optional field alone would be MINOR)" } },
    "pa-016": { optionEdits: { 1: "Keep each context's model; translate at the API boundary (anti-corruption layer)" } },
    "pa-018": {
      optionEdits: {
        1: "The server ETags the entity; a stale If-Match update is rejected with 412",
        3: "It cannot be prevented without pessimistic server-side record locking"
      }
    },
    "pa-019": { optionEdits: { 1: "Publish them as reusable API fragments in Exchange and import them as dependencies" } },
    "pa-020": { optionEdits: { 1: "System APIs for Salesforce/Marketo + a Process API orchestrating them + a Web xAPI" } },
    "pa-022": { optionEdits: { 1: "Anypoint DataGraph: query exactly the fields needed across the four APIs in one request" } },
    "pa-023": { optionEdits: { 1: "When the operation UPDATES multiple systems and needs compensation logic" } },
    "pa-024": { optionEdits: { 1: "A clean canonical ORDER model that hides SAP's native representation" } },
    "pa-026": { optionEdits: { 1: "Logic lives once in the Place Order Process API; each channel gets a thin xAPI" } },
    "pa-027": { optionEdits: { 1: "Drop it: a value-free pass-through adds latency and cost with no benefit" } },
    "pa-029": { optionEdits: { 1: "One API instance per environment, each with its own api.id and policies" } },
    "pa-030": { optionEdits: { 1: "Spike control — it smooths bursts by briefly delaying within limits" } },
    "pa-031": { optionEdits: { 1: "Automated org/environment-level policies applied to every API instance" } },
    "pa-032": {
      optionEdits: {
        0: "1=API proxy, 2=embedded gateway, 3=API proxy",
        1: "1=embedded autodiscovery, 2=API-Manager proxy, 3=Flex Gateway",
        2: "All three enforced through a Flex Gateway at the edge"
      }
    },
    "pa-033": { optionEdits: { 1: "Secrets in the URL get cached, logged, and stored in browser history" } },
    "pa-035": {
      optionEdits: {
        1: "Find it in Exchange, request access with an app, pick a tier, use the issued credentials",
        2: "Deploy a personal proxy in front of the API to obtain access"
      }
    },
    "pa-037": { optionEdits: { 1: "At every layer — each instance enforces its own auth/limits (zero trust)" } },
    "pa-038": { optionEdits: { 1: "It applies only to the matched methods/paths, not to other operations" } },
    "pa-039": {
      optionEdits: {
        0: "Basic authentication against the corporate user directory",
        1: "JWT validation — verified locally via JWKS, with no per-request round trip",
        3: "IP allowlisting of the known consumer networks"
      }
    },
    "pa-040": { optionEdits: { 1: "API Manager analytics — calls attributed to client apps by their credentials" } },
    "pa-042": { optionEdits: { 1: "No extra hop or separate app — policies run inside the implementation" } },
    "pa-044": { optionEdits: { 1: "Runtime Fabric — platform-managed on customer-owned cluster infrastructure" } },
    "pa-045": {
      optionEdits: {
        1: "MUnit units for router/mapping; an integration test for policy enforcement",
        2: "All three are covered by MUnit unit tests alone",
        3: "All three are covered by integration tests alone"
      }
    },
    "pa-046": { optionEdits: { 1: "CI + mule-maven-plugin + munit + Exchange, authenticated by a Connected App" } },
    "pa-047": { optionEdits: { 1: "A smoke test calling the deployed endpoints and asserting real responses" } },
    "pa-048": { optionEdits: { 1: "Only the promoted artifact was tested; rebuilds risk shipping something untested" } },
    "pa-049": {
      optionEdits: {
        1: "Multiple smaller workers (horizontal scale-out) for throughput and HA",
        3: "Vertical scaling of a single large worker"
      }
    },
    "pa-050": {
      optionEdits: {
        0: "Many small 0.1-vCore workers sharing the load",
        1: "A larger worker (vertical scaling) for memory headroom, plus streaming"
      }
    }
  }
};
