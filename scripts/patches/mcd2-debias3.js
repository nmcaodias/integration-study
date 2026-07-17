/* MCD2 · final trim pass — remaining marginal correct-longest questions. */
module.exports = {
  questions: {
    "m2-002": { optionEdits: { 1: "The Logger consumed the one-time stream before the transform" } },
    "m2-013": { optionEdits: { 1: "One self-tuning pool with back-pressure; rarely sized manually" } },
    "m2-014": { optionEdits: { 1: "Add workers/replicas; CloudHub load-balances across them" } },
    "m2-021": { optionEdits: { 1: "A Mule extension packaged as a Mule plugin" } },
    "m2-032": { optionEdits: { 1: "The deployable application JAR under target/" } },
    "m2-033": { optionEdits: { 1: "Reusable RAML/OAS pieces on Exchange, referenced as dependencies by specs" } },
    "m2-038": { optionEdits: { 1: "Add the service's cert to a truststore on the request's TLS context" } },
    "m2-043": { optionEdits: { 1: "Verified locally via JWKS, avoiding a round trip per request" } },
    "m2-049": { optionEdits: { 1: "Per-environment stores and keys, selected via externalized properties" } },
    "m2-053": { optionEdits: { 1: "Logged and propagated across apps to trace one transaction" } },
    "m2-080": { optionEdits: { 1: "The artifact is published to the repo; the app is not deployed" } },
    "m2-083": { optionEdits: { 1: "A parent POM referenced via <parent> in each project" } },
    "m2-102": { optionEdits: { 1: "Back-pressure applies and the HTTP Listener rejects excess requests with 503" } },
    "m2-108": { optionEdits: { 0: "A reusable Mule extension/plugin that gets its own isolated classloader" } },
    "m2-113": { optionEdits: { 0: "Add a tls:key-store with the app's client cert and key" } },
    "m2-115": { optionEdits: { 0: "Encrypt only the ID field via the Cryptography module" } }
  }
};
