/* MCD2 · fix two duplicates the new-hard batch introduced.
 * m2-144 was a near-clone of m2-120 (both Mock When "what does it accomplish");
 * m2-146 overlapped m2-068 (both "one API instance per environment"). Rework
 * each into a distinct d5 hard topic. */
module.exports = {
  questions: {
    "m2-144": {
      q: "Refer to the exhibit. What does enabling flow sources change about how this MUnit test runs?",
      exhibit: "<munit:test name=\"submit-order-endToEnd\">\n  <munit:enable-flow-sources>\n    <munit:enable-flow-source value=\"submitOrderFlow\"/>\n  </munit:enable-flow-sources>\n  <munit:execution>\n    <http:request method=\"POST\" path=\"/orders\" .../>   <!-- real call into the listener -->\n  </munit:execution>\n  <munit:validation>...</munit:validation>\n</munit:test>",
      options: [
        "The flow's real event source (its HTTP Listener) starts during the test, so the test can drive the flow through an actual HTTP call instead of a flow-ref",
        "It mocks the flow's source so the test needs no input event at all, and the flow runs once automatically on suite start",
        "It doubles the reported coverage by executing the flow's source path a second time after the assertions run",
        "It disables every other flow's source in the app so only the flow under test can receive any events during the run"
      ],
      answer: 0,
      optionNotes: [
        "Correct — 'enable flow sources' starts the real source (e.g. HTTP Listener), letting the test exercise the flow through a genuine request rather than a flow-ref.",
        "It's the opposite of mocking the source — the real source runs.",
        "It doesn't affect coverage accounting.",
        "It enables the named flow's source; it doesn't disable others."
      ],
      explanation: "By default an MUnit test drives a flow with a flow-ref (the source doesn't run). Enabling flow sources starts the real source so you can test end-to-end through the actual endpoint — useful for verifying listener/APIkit behaviour, at the cost of a heavier, less isolated test."
    },
    "m2-146": {
      q: "Refer to the exhibit. The app deploys successfully, but its API instance shows 'Unregistered' in API Manager and the rate-limiting policy is not enforced. What is the most likely cause?",
      exhibit: "<api-gateway:autodiscovery apiId=\"${api.id}\" flowRef=\"api-main\"/>\n\n# deploy-time properties (prod)\napi.id=17206543\nanypoint.platform.client_id=6f2a...\nanypoint.platform.client_secret=b91c...",
      options: [
        "The api.id doesn't match the instance for this environment, or the platform client credentials are missing/wrong — so autodiscovery never paired the app",
        "Policies must be declared inside the app's RAML; an API Manager instance cannot enforce a rate-limiting policy on its own",
        "Embedded autodiscovery can't enforce policies on CloudHub; a separate API proxy application must be deployed in front of the app",
        "Rate limiting requires a dedicated Anypoint VPC, and no API instance will register until that VPC exists"
      ],
      answer: 0,
      optionNotes: [
        "Correct — autodiscovery pairs the app to its instance via api.id + platform credentials; a wrong api.id (or bad/missing creds) leaves the instance Unregistered and policies unenforced.",
        "Policies live on the API instance in API Manager, not the RAML — that isn't the cause.",
        "Embedded enforcement via autodiscovery works on CloudHub; a proxy is an alternative, not a requirement.",
        "A VPC is unrelated to autodiscovery registration."
      ],
      explanation: "Autodiscovery registers a running app with its API instance using api.id plus platform client credentials. If the api.id points at the wrong (or another environment's) instance, or the credentials are missing/invalid, the instance stays 'Unregistered' and its policies are never enforced."
    }
  }
};
