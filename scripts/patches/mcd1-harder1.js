/* MCD1 · difficulty upgrade, part 1 (8 of 15). Rework pure-recall questions
 * into scenario/exhibit versions. Options are fully rewritten (answer index set
 * explicitly); length kept balanced so the de-bias metrics hold. */
module.exports = {
  questions: {
    "m1-001": {
      level: "hard",
      q: "Refer to the exhibit. An architect assigns each requirement to an API-led layer. Which assignment follows the model?",
      exhibit: "R1: expose the SAP customer master as a clean, reusable API\nR2: orchestrate 'create customer' across SAP + the loyalty platform\nR3: return a trimmed JSON shape sized for the mobile app's screens",
      options: [
        "R1=System, R2=Process, R3=Experience",
        "R1=Process, R2=System, R3=Experience",
        "R1=System, R2=Experience, R3=Process",
        "R1=Experience, R2=Process, R3=System"
      ],
      answer: 0,
      optionNotes: [
        "Correct — unlock the backend (System), orchestrate across systems (Process), shape per channel (Experience).",
        "Orchestration across two systems is Process-layer work, not System.",
        "Channel-specific shaping is the Experience layer's job, not Process.",
        "This inverts the model end to end."
      ],
      explanation: "The three-layer heuristic: System APIs unlock and insulate backends, Process APIs compose them into business capabilities, Experience APIs adapt those capabilities to one channel's needs."
    },
    "m1-004": {
      level: "medium",
      q: "A developer new to the team must find the existing Customer API specification, read its documentation, and try realistic responses against it before any implementation exists. Where does all of this happen?",
      options: [
        "Anypoint Exchange — discover the spec, read its portal docs, call the mocking service",
        "Runtime Manager — locate the deployed application and inspect its live endpoints",
        "Anypoint Monitoring — trace real traffic to learn the API's response shapes",
        "Anypoint Studio — import the project source and run the flows locally to test"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Exchange is the discovery portal: published specs, generated documentation, and the mocking service for try-it-out calls.",
        "Runtime Manager manages deployments; there may be nothing deployed yet.",
        "Monitoring observes real traffic — none exists before implementation.",
        "Studio needs the source; discovery and mocked try-outs don't."
      ],
      explanation: "Exchange is where published API specs are discovered and consumed: auto-generated documentation, examples, and the mocking service let consumers exercise the contract before a single flow is built."
    },
    "m1-007": {
      level: "hard",
      q: "Refer to the exhibit. Which RAML fragment correctly declares 'get one flight by ID, optionally filtering the seat class by query parameter'?",
      exhibit: "A)  /flights/{ID}:\n      get:\n        queryParameters:\n          class:\n            required: false\n\nB)  /flights/:ID:\n      get:\n        queryParameters:\n          class:\n\nC)  /flights?ID:\n      get:\n        uriParameters:\n          class:\n\nD)  /flights/[ID]:\n      get:\n        headers:\n          class:",
      options: [
        "Fragment A",
        "Fragment B",
        "Fragment C",
        "Fragment D"
      ],
      answer: 0,
      optionNotes: [
        "Correct — {ID} declares the URI parameter; 'class' as an optional query parameter under the method.",
        ":ID is Express/OpenAPI-path style, not RAML.",
        "?ID isn't a resource path, and uriParameters can't declare a query filter.",
        "[ID] isn't RAML syntax, and a header isn't a query filter."
      ],
      explanation: "RAML URI parameters use curly braces in the resource path (/flights/{ID}); query parameters are declared per-method under queryParameters with required: false for optional ones."
    },
    "m1-013": {
      level: "medium",
      q: "Refer to the exhibit (a debugger snapshot). Which statement about this Mule event is correct?",
      exhibit: "payload:    { \"id\": 7, \"status\": \"NEW\" }\nattributes: { method: \"POST\", queryParams: { dryRun: \"true\" },\n              headers: { host: \"...\", content-type: \"application/json\" } }\nvars:       { retryCount: 0 }",
      options: [
        "attributes carry the transport metadata and are replaced by the next connector operation",
        "vars.retryCount travels with the request to any external system the flow calls next",
        "payload and attributes always change together as one immutable unit through the flow",
        "queryParams.dryRun is a Boolean because Mule coerces recognizable literals on receipt"
      ],
      answer: 0,
      optionNotes: [
        "Correct — attributes hold the current transport's metadata, and each connector operation replaces them with its own (e.g. an HTTP Request swaps in the response's status/headers).",
        "Variables are internal to the Mule app; they are not transmitted to external systems.",
        "They change independently — a Set Payload touches only the payload.",
        "Query parameter values arrive as strings; \"true\" needs an explicit coercion."
      ],
      explanation: "A Mule message = payload + attributes; attributes are transport metadata that each passing operation replaces, vars are app-internal event state, and inbound parameter values are strings until coerced."
    },
    "m1-018": {
      level: "medium",
      q: "Refer to the exhibit. Which single line logs the customer's name from the JSON payload correctly?",
      exhibit: "1) <logger message=\"${payload.customer.name}\"/>\n2) <logger message=\"#[payload.customer.name]\"/>\n3) <logger message=\"payload.customer.name\"/>\n4) <logger message=\"{{payload.customer.name}}\"/>",
      options: [
        "Line 2 — #[…] marks an inline DataWeave expression",
        "Line 1 — ${…} evaluates expressions against the event",
        "Line 3 — Logger fields are evaluated as DataWeave by default",
        "Line 4 — {{…}} is Mule 4's expression interpolation syntax"
      ],
      answer: 0,
      optionNotes: [
        "Correct — #[…] is the expression marker; inside it, full DataWeave runs against the event.",
        "${…} is reserved for configuration property placeholders, resolved at startup, not event data.",
        "Without #[…] the field is a literal string and logs the text itself.",
        "{{…}} has no meaning in Mule 4 component fields."
      ],
      explanation: "#[…] embeds DataWeave in any component field and is evaluated per event; ${…} resolves configuration properties at deployment time — mixing the two up is a classic exam trap."
    },
    "m1-023": {
      level: "hard",
      q: "Refer to the exhibit. db.host is defined in config.yaml, registered via a Configuration Properties element. Which usages resolve it correctly?",
      exhibit: "1) <db:config host=\"${db.host}\" .../>          <!-- XML attribute -->\n2) <db:config host=\"p('db.host')\" .../>         <!-- XML attribute -->\n3) Transform Message:  { host: p('db.host') }   <!-- DataWeave body -->\n4) Transform Message:  { host: ${db.host} }     <!-- DataWeave body -->",
      options: [
        "1 and 3",
        "2 and 4",
        "1 and 4",
        "2 and 3"
      ],
      answer: 0,
      optionNotes: [
        "Correct — ${…} placeholders work in XML configuration attributes; inside DataWeave you call the p() function.",
        "Reversed: p() as a bare XML attribute value is just a literal string, and ${…} is not DataWeave syntax.",
        "${…} inside a DataWeave body doesn't parse.",
        "p('…') in an XML attribute is not evaluated (it isn't inside #[…])."
      ],
      explanation: "Two worlds, two syntaxes: XML attributes take ${property} placeholders resolved at startup; DataWeave scripts read the same properties with p('property'). Each syntax is invalid in the other context."
    },
    "m1-039": {
      level: "medium",
      q: "An error handler must log lines like 'HTTP:NOT_FOUND — HTTP GET on resource ... failed: not found (404)'. Which expression builds the first part, before the dash?",
      options: [
        "#[error.errorType.namespace ++ ':' ++ error.errorType.identifier]",
        "#[error.description.namespace ++ ':' ++ error.description.identifier]",
        "#[payload.errorType.namespace ++ ':' ++ payload.errorType.identifier]",
        "#[error.cause.namespace ++ ':' ++ error.cause.identifier]"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the error object exposes errorType with namespace and identifier fields; description holds the human text after the dash.",
        "description is a string (the message), not a structured type.",
        "The failed event's payload is unrelated to the error's type.",
        "cause is the underlying Java exception, not the typed namespace:identifier pair."
      ],
      explanation: "Inside a handler, error.errorType.namespace / .identifier give the structured type (HTTP, NOT_FOUND) and error.description the message — the exact fields the default log format prints."
    },
    "m1-046": {
      level: "hard",
      q: "Refer to the exhibit. The transform must output the XML shown, but the script fails. Why, and what is the fix?",
      exhibit: "Input:  { \"items\": [ { \"id\": 1 }, { \"id\": 2 } ] }\nWanted: <order><item>1</item><item>2</item></order>\n\nScript:\n%dw 2.0\noutput application/xml\n---\npayload.items map ((it) -> item: it.id)",
      options: [
        "The body yields an array with repeated keys; wrap it in a root: { order: { (payload.items map ((it) -> item: it.id)) } }",
        "XML output needs dw::xml imported in the header before any element can be written by the script",
        "map cannot be used when the output is XML; a For Each scope must build the elements one at a time",
        "The item values are numbers and XML requires quoting them as strings before serialization"
      ],
      answer: 0,
      optionNotes: [
        "Correct — XML needs exactly one root element, and the {( … )} idiom spreads the mapped key:value pairs as repeated child elements inside it.",
        "No import is needed to write XML.",
        "map works fine for XML — the structure, not the function, is the problem.",
        "Numbers serialize to text content automatically."
      ],
      explanation: "Two XML rules combine: a single root element is mandatory, and repeated elements are produced by spreading an array of key:value objects with {( … )} inside the root."
    }
  }
};
