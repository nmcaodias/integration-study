/* MCD1 · new hard questions for s5 "Building API Implementation Interfaces"
 * (the user's weakest exam section): 8 exhibit-heavy scenario questions on
 * APIkit routing, validation, scaffolding, and the manual alternative. */
module.exports = {
  addQuestions: [
    {
      id: "m1-230", section: "s5", level: "hard",
      q: "Refer to the exhibit. Which flow does the APIkit Router invoke for the request, and what does attributes.uriParams contain there?",
      exhibit: "RAML:\n/items:\n  get:\n  /{itemId}:\n    get:\n    /reviews:\n      get:\n\nRequest: GET /api/items/A7/reviews",
      options: [
        "get:\\items\\(itemId)\\reviews:api-config, with uriParams = { itemId: \"A7\" }",
        "get:\\items\\(itemId):api-config, with uriParams = { itemId: \"A7/reviews\" }",
        "get:\\items:api-config, with uriParams = { itemId: \"A7\", sub: \"reviews\" }",
        "get:\\reviews:api-config, with uriParams = { itemId: \"A7\" }"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the deepest matching resource wins, its flow name encodes the whole nested path, and each {template} segment becomes one uriParams entry.",
        "Path templates match exactly one segment; A7/reviews can't bind to {itemId}.",
        "There is no partial match with leftovers — routing is to a full declared path.",
        "Flow names include the full nested path from the root, not just the leaf."
      ],
      explanation: "APIkit names flows after the complete method + nested path (get:\\items\\(itemId)\\reviews:config) and routes by longest exact match; every {template} in the path appears as its own uriParams key."
    },
    {
      id: "m1-231", section: "s5", level: "hard",
      q: "Refer to the exhibit. The RAML and the implementation disagree. What happens to each request?",
      exhibit: "RAML declares:            Implementation flows present:\n  GET  /flights              get:\\flights:api-config      (implemented)\n  POST /flights              (no post:\\flights flow)\n  GET  /airports             get:\\airports:api-config     (implemented)\n\nRequests: (1) POST /api/flights    (2) DELETE /api/airports",
      options: [
        "(1) 501 APIKIT:NOT_IMPLEMENTED — declared but no flow; (2) 405 APIKIT:METHOD_NOT_ALLOWED — method not in the spec",
        "(1) 405 APIKIT:METHOD_NOT_ALLOWED for the missing flow; (2) 501 APIKIT:NOT_IMPLEMENTED for the undeclared method",
        "Both return 404 APIKIT:NOT_FOUND because the router treats them as unroutable requests",
        "(1) 400 APIKIT:BAD_REQUEST since the body can't be validated; (2) 405 APIKIT:METHOD_NOT_ALLOWED"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a spec'd method with no matching flow is NOT_IMPLEMENTED (501); a method absent from the spec on an existing resource is METHOD_NOT_ALLOWED (405).",
        "Reversed — 405 is about the contract, 501 about the missing implementation.",
        "404 is for resources that don't exist in the spec at all; both paths exist.",
        "No body validation happens for a method that has no implementation to route to."
      ],
      explanation: "Two distinct gaps, two distinct errors: contract says yes but no flow exists → APIKIT:NOT_IMPLEMENTED/501; contract itself doesn't allow the method → APIKIT:METHOD_NOT_ALLOWED/405."
    },
    {
      id: "m1-232", section: "s5", level: "hard",
      q: "Refer to the exhibit. The main flow is shown. Which statement about this APIkit application's anatomy is correct?",
      exhibit: "<flow name=\"api-main\">\n  <http:listener config-ref=\"HTTP_Listener_config\" path=\"/api/*\"/>\n  <apikit:router config-ref=\"api-config\"/>\n  <error-handler>\n    <on-error-propagate type=\"APIKIT:BAD_REQUEST\">...</on-error-propagate>\n    <on-error-propagate type=\"APIKIT:NOT_FOUND\">...</on-error-propagate>\n    ...\n  </error-handler>\n</flow>",
      options: [
        "Only api-main has a listener; implementation flows are reached through the router, and their unhandled errors bubble back to this error handler",
        "Each implementation flow also has its own HTTP Listener on a sub-path, which the router registers when the application starts",
        "The router forwards the raw request to implementation flows, which must each re-validate parameters against the RAML themselves",
        "The error handler shown runs only for errors raised inside api-main itself, never for errors from the implementation flows"
      ],
      answer: 0,
      optionNotes: [
        "Correct — one listener + router in the main flow; implementation flows are listener-less and their propagated errors surface here, where APIKIT mappings live.",
        "Implementation flows have no sources at all.",
        "The router validates against the spec before invoking the flow.",
        "Errors propagating out of routed flows surface at the router — inside this flow — so this handler does catch them."
      ],
      explanation: "The scaffolded topology: main flow = listener + router + APIKIT error mappings; implementation flows are private, validated-input targets whose propagated errors return to the main flow's handler."
    },
    {
      id: "m1-233", section: "s5", level: "hard",
      q: "A RAML declares POST /orders with a body of type Order (quantity: integer, required). A client sends a valid JSON body but quantity is the string \"two\". The implementation flow contains only a Logger. What is the outcome?",
      options: [
        "400 — the router rejects the body against the RAML type before the flow runs, so the Logger never executes",
        "200 — JSON parses successfully, so the request reaches the flow and the Logger runs with the string in place",
        "500 — the Logger throws a type conversion error when it touches the malformed quantity field at runtime",
        "415 — a body whose field types don't match the declared media type's schema is an unsupported media type"
      ],
      answer: 0,
      optionNotes: [
        "Correct — body validation against the declared RAML type happens in the router; a type violation raises APIKIT:BAD_REQUEST (400) and the implementation never executes.",
        "Parsing as JSON isn't enough — the typed contract is enforced.",
        "The flow is never reached, so nothing in it can fail.",
        "415 is about the Content-Type header, not field-level type errors."
      ],
      explanation: "Router validation covers the declared body type, not just its syntax: wrong field types raise APIKIT:BAD_REQUEST before any implementation logic runs — the contract is the gate."
    },
    {
      id: "m1-234", section: "s5", level: "hard",
      q: "Refer to the exhibit. After re-scaffolding against the updated RAML, which flows exist and which requests succeed?",
      exhibit: "Before: RAML had GET /a (implemented, custom logic added)\nRAML now:\n  /a:\n    get:\n  /b:\n    get:\n\nDeveloper actions: re-scaffold, then DELETE the RAML's /a resource\n(without re-scaffolding again). App restarted.",
      options: [
        "Flows for get /a (with its custom logic) and get /b both exist; GET /a now returns 404 because the spec no longer declares it",
        "Only the get /b flow exists — re-scaffolding after the deletion automatically removed the obsolete get /a flow and its logic",
        "Both flows exist and both requests succeed, because the router routes by flow name regardless of the current specification",
        "Neither request succeeds — editing the RAML after scaffolding invalidates the router configuration until flows are regenerated"
      ],
      answer: 0,
      optionNotes: [
        "Correct — scaffolding only adds missing flows (get /b), never deletes; but routing follows the CURRENT spec, so the undeclared /a is now 404 even though its flow lingers.",
        "Scaffolding never removes flows — orphans stay until a developer deletes them.",
        "The spec governs what is routable; an orphaned flow is unreachable.",
        "The app runs fine; only the removed resource stops being served."
      ],
      explanation: "Two independent facts: the scaffolder is add-only (orphan flows survive spec deletions), and the router validates/routes against the current RAML — so a deleted resource 404s even while its old flow still exists."
    },
    {
      id: "m1-235", section: "s5", level: "hard",
      q: "Refer to the exhibit. A team is choosing between the two designs for a 3-resource API. Which trade-off statement is accurate?",
      exhibit: "Design A (manual):\n  three flows, each with its own HTTP Listener\n  (/flights, /airports, /bookings), hand-written validation\n\nDesign B (APIkit):\n  one listener + router scaffolded from a RAML with the\n  same three resources",
      options: [
        "A gives full control but validation and spec drift are on the team; B keeps the contract enforced and in sync at the cost of the RAML-first workflow",
        "A is required whenever query parameters must be validated, because the router can only validate URI parameters against the specification",
        "B prevents any custom logic in the implementation flows, so teams needing business logic per resource must always choose A",
        "A and B behave identically at runtime, because the router is only a design-time convenience that disappears from the built artifact"
      ],
      answer: 0,
      optionNotes: [
        "Correct — manual interfaces mean hand-rolled validation and a spec that drifts from code; APIkit enforces the RAML (validation, error mapping) but assumes spec-first discipline.",
        "The router validates query parameters, headers, and bodies too.",
        "Implementation flows are exactly where custom logic goes.",
        "The router is a runtime component enforcing the contract on every request."
      ],
      explanation: "The design decision the objective tests: manual = flexibility with maintenance and drift risk; APIkit = generated, spec-synchronized interface with validation and error scaffolding for free."
    },
    {
      id: "m1-236", section: "s5", level: "hard",
      q: "A RAML resource GET /reports declares responses only for application/json. A client sends 'Accept: application/xml'. Separately, another client POSTs to /reports with 'Content-Type: text/csv', which the RAML doesn't declare for the body. Which errors do the two requests raise?",
      options: [
        "Accept mismatch → APIKIT:NOT_ACCEPTABLE (406); undeclared Content-Type → APIKIT:UNSUPPORTED_MEDIA_TYPE (415)",
        "Accept mismatch → APIKIT:UNSUPPORTED_MEDIA_TYPE (415); undeclared Content-Type → APIKIT:NOT_ACCEPTABLE (406)",
        "Both requests raise APIKIT:BAD_REQUEST (400), the router's generic error for any header-level contract violation",
        "Neither fails — media type negotiation is advisory in APIkit and both requests reach the implementation flows"
      ],
      answer: 0,
      optionNotes: [
        "Correct — 406 NOT_ACCEPTABLE is 'I can't produce what you Accept'; 415 UNSUPPORTED_MEDIA_TYPE is 'I don't take the body format you sent'.",
        "Reversed — the two media-type errors point in opposite directions.",
        "The router raises the specific media-type errors, not generic 400s, for these.",
        "The router enforces declared media types; both requests are rejected."
      ],
      explanation: "The media-type pair to keep straight: Accept the API can't satisfy → 406 NOT_ACCEPTABLE; request body Content-Type the API doesn't declare → 415 UNSUPPORTED_MEDIA_TYPE. Both are router-raised, before your flow."
    },
    {
      id: "m1-237", section: "s5", level: "hard",
      q: "Refer to the exhibit. A developer publishes this RAML to Exchange, and a second team imports the resulting asset into their Studio project. What exactly does the second team get, and what do they NOT get?",
      exhibit: "#%RAML 1.0\ntitle: Flights API\nversion: v1\n/flights:\n  get:\n    responses:\n      200:\n        body:\n          type: Flight[]",
      options: [
        "They get a REST Connector with a typed 'Get flights' operation (metadata for DataSense); they do not get any implementation flows",
        "They get the scaffolded implementation flows ready to deploy; they do not get connector operations, which require certification first",
        "They get a shared library of DataWeave scripts generated from the types; they do not get anything callable from a flow",
        "They get a proxy application that fronts the API; they do not get design-time metadata until the API is also deployed"
      ],
      answer: 0,
      optionNotes: [
        "Correct — publishing a REST spec triggers REST Connect: consumers install a generated connector whose operations mirror the methods, with full DataSense metadata. Implementation stays with the API's own team.",
        "Scaffolding happens in the implementing project, not for consumers.",
        "No DataWeave library is generated from a spec.",
        "Proxies are an API Manager deployment concern, unrelated to importing the asset."
      ],
      explanation: "REST Connect turns every REST API spec published to Exchange into a ready-made connector for consumers — typed operations and design-time metadata — cleanly separating consuming an API from implementing it."
    }
  ]
};
