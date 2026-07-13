// MCD Level 1 question bank — Part A (sections 1–6)
window.CERT_DATA.mcd1.questions.push(
  // ---- Section 1: Application Network Basics ----
  {
    id: "m1-001", section: "s1",
    q: "In API-led connectivity, which layer is responsible for unlocking data from core systems of record and insulating consumers from changes to those systems?",
    options: ["Experience API layer", "Process API layer", "System API layer", "Orchestration API layer"],
    answer: 2,
    explanation: "System APIs sit closest to core systems (databases, SaaS, legacy). They expose the underlying data in a canonical way and shield upstream consumers from changes to those systems. Process APIs orchestrate; Experience APIs tailor data for specific channels."
  },
  {
    id: "m1-002", section: "s1",
    q: "A company wants to enable reuse and self-service of integration assets across lines of business, publish best practices, and measure asset consumption. According to MuleSoft, what organizational model should be established?",
    options: ["A Center of Excellence (CoE) that builds all integrations centrally", "A Center for Enablement (C4E) that enables teams to build and consume reusable assets", "An Integration Competency Center that approves every API design", "An outsourced integration delivery team"],
    answer: 1,
    explanation: "The C4E is a cross-functional enablement team: it ensures assets are productized, published, discoverable, and consumed, and it measures that consumption. Unlike a traditional CoE, it enables other teams rather than doing all delivery itself."
  },
  {
    id: "m1-003", section: "s1",
    q: "Which HTTP method and characteristic combination is correct according to standard REST conventions?",
    options: ["GET requests include a request body describing the query", "POST requests are idempotent and used to retrieve resources", "PUT requests replace/update a resource at a known URI and are idempotent", "DELETE requests must always include a request body"],
    answer: 2,
    explanation: "PUT updates (or creates) a resource at a known URI, and repeating the same PUT yields the same result (idempotent). GET and DELETE conventionally carry no body, and POST (create/process) is not idempotent."
  },
  {
    id: "m1-004", section: "s1",
    q: "Which Anypoint Platform component is used to discover, share, and reuse assets such as API specifications, connectors, and templates?",
    options: ["Runtime Manager", "Anypoint Exchange", "API Designer", "Anypoint Monitoring"],
    answer: 1,
    explanation: "Exchange is the marketplace/catalog of reusable assets. Runtime Manager deploys and manages apps, API Designer creates specs, and Anypoint Monitoring provides dashboards and alerts."
  },
  {
    id: "m1-005", section: "s1",
    q: "What is the primary cause of the 'IT delivery gap' that MuleSoft's application network approach aims to close?",
    options: ["Businesses request fewer projects while IT capacity grows", "The demand on IT grows much faster than IT's delivery capacity with point-to-point integration", "Cloud providers limit the number of APIs a company can build", "Developers refuse to document their code"],
    answer: 1,
    explanation: "Business demands on IT grow rapidly, but custom point-to-point integration doesn't scale, so IT delivery capacity stays roughly flat. Reusable APIs in an application network let each project deliver faster than the last, closing the gap."
  },
  {
    id: "m1-006", section: "s1",
    q: "A web storefront needs data aggregated from several process APIs, formatted specifically for its UI. In API-led connectivity, where should this channel-specific formatting logic live?",
    options: ["In the System API layer", "In the Experience API layer", "In the database stored procedures", "In an API proxy policy"],
    answer: 1,
    explanation: "Experience APIs reconfigure data for the needs of a specific channel or end user experience (web, mobile, partner). System APIs unlock core systems and Process APIs hold channel-agnostic business logic."
  },

  // ---- Section 2: Designing and Consuming APIs ----
  {
    id: "m1-007", section: "s2",
    q: "In a RAML specification, what is the correct way to define a URI parameter for retrieving a single flight by its ID?",
    options: ["/flights?ID: get:", "/flights/{ID}: with a nested get: method", "/flights/:ID: with a nested get: method", "/flights/[ID]: with a nested get: method"],
    answer: 1,
    explanation: "RAML nests resources, and URI parameters are declared with curly braces: /flights/{ID}. The :ID syntax belongs to other frameworks (e.g. Express), and square brackets are not valid RAML."
  },
  {
    id: "m1-008", section: "s2",
    q: "When should a query parameter be used instead of a URI parameter in an API design?",
    options: ["When identifying a specific, unique resource", "When filtering or restricting the set of results returned from a collection", "When sending sensitive credentials", "When the value is required for the request to succeed"],
    answer: 1,
    explanation: "URI parameters identify a specific resource (/flights/23); query parameters filter, sort, or paginate collections (/flights?destination=SFO). Required vs optional is orthogonal — query params can be required too, but resource identity belongs in the URI."
  },
  {
    id: "m1-009", section: "s2",
    q: "An API design team wants consumers to try an API and give feedback before any implementation is built. What Anypoint Platform feature makes this possible?",
    options: ["The mocking service, exercised from the API console in Exchange or API Designer", "Runtime Manager sandbox workers", "The Mule debugger", "API Manager SLA tiers"],
    answer: 0,
    explanation: "The mocking service simulates the API from its specification and example data, so consumers can send real HTTP requests to a mock endpoint from the API console — a key part of the design-first lifecycle (design, simulate, get feedback, validate)."
  },
  {
    id: "m1-010", section: "s2",
    q: "In RAML, what is the purpose of a trait?",
    options: ["To define a reusable data type for request bodies", "To define a reusable set of method-level properties, such as pagination query parameters, applied with 'is:'", "To secure the API with OAuth", "To split the RAML file into multiple physical files"],
    answer: 1,
    explanation: "Traits capture reusable method-level patterns (query params, headers, responses) and are applied to methods with 'is: [traitName]'. resourceTypes do the same at resource level; types define data structures; !include splits files."
  },
  {
    id: "m1-011", section: "s2",
    q: "A RAML spec defines: /flights: get: queryParameters: destination: enum: [SFO, LAX, CLE]. Which request is valid against this API?",
    options: ["GET /flights/destination/SFO", "GET /flights?destination=SFO", "POST /flights with body {\"destination\": \"SFO\"}", "GET /flights?dest=SFO"],
    answer: 1,
    explanation: "destination is defined as a query parameter of the GET /flights method, so it is passed as ?destination=SFO. The parameter name must match exactly, and it is not a URI path segment."
  },
  {
    id: "m1-012", section: "s2",
    q: "Which RAML fragment type is used to define a reusable data structure that can be published to Exchange and referenced from multiple API specifications?",
    options: ["NamedExample fragment", "DataType fragment", "Trait fragment", "Overlay fragment"],
    answer: 1,
    explanation: "A DataType fragment defines a reusable type (e.g. AmericanFlight). NamedExample holds example instances, Traits hold method patterns, and Overlays/Extensions modify existing specs."
  },

  // ---- Section 3: Accessing and Modifying Mule Events ----
  {
    id: "m1-013", section: "s3",
    q: "What are the two main parts of a Mule message?",
    options: ["Payload and variables", "Payload and attributes", "Headers and body", "Inbound properties and outbound properties"],
    answer: 1,
    explanation: "A Mule message = payload (the data) + attributes (metadata such as HTTP query params and headers). Variables belong to the Mule event, alongside the message. Inbound/outbound properties were Mule 3 concepts."
  },
  {
    id: "m1-014", section: "s3",
    q: "A flow receives an HTTP request with the query parameter ?code=SFO. Which DataWeave expression accesses its value?",
    options: ["payload.code", "attributes.queryParams.code", "vars.queryParams.code", "message.inboundProperties.code"],
    answer: 1,
    explanation: "HTTP metadata like query parameters, URI parameters, and headers is stored in the message attributes: attributes.queryParams.code. The payload holds the request body, and vars are only what you set yourself."
  },
  {
    id: "m1-015", section: "s3",
    q: "What happens to the attributes of a Mule message when the event passes through an HTTP Request operation?",
    options: ["They are preserved unchanged", "They are merged with the response headers", "They are replaced by new attributes from the HTTP response (status code, headers, etc.)", "They are copied into flow variables automatically"],
    answer: 2,
    explanation: "Every connector operation that returns a message replaces the attributes with metadata about ITS result — after an HTTP Request, attributes contain the response status code and headers. Save anything you need first (e.g. in a variable)."
  },
  {
    id: "m1-016", section: "s3",
    q: "A developer needs to call an external API to get a currency rate but must keep the current payload intact for the next processor. What is the recommended approach?",
    options: ["Wrap the HTTP Request in a Try scope", "Set the target parameter of the HTTP Request operation to store the response in a variable", "Copy the payload into the attributes first", "Use a subflow so payload changes are discarded"],
    answer: 1,
    explanation: "The target (and target value) parameter stores the operation's output in a variable instead of overwriting the payload — the standard Mule 4 enrichment pattern."
  },
  {
    id: "m1-017", section: "s3",
    q: "Which statement about flow variables (vars) is true?",
    options: ["They persist across an HTTP Request call to another Mule application", "They are lost when the event passes through a Flow Reference", "They persist for the current flow and through Flow References within the same application", "They can only store String values"],
    answer: 2,
    explanation: "Variables travel with the Mule event through Flow References (and back). They do NOT cross a transport boundary to another application — only the payload and any headers you explicitly set are transmitted. Variables can hold any type."
  },
  {
    id: "m1-018", section: "s3",
    q: "In an event processor's field, what syntax embeds a DataWeave expression inline?",
    options: ["${payload.name}", "#[payload.name]", "{{payload.name}}", "%[payload.name]"],
    answer: 1,
    explanation: "Inline DataWeave expressions use #[ ... ]. The ${ } syntax is for property placeholders resolved at startup, not runtime expressions."
  },

  // ---- Section 4: Structuring Mule Applications ----
  {
    id: "m1-019", section: "s4",
    q: "What is the difference between a subflow and a private flow?",
    options: ["A subflow has an event source; a private flow does not", "A private flow has its own error handling scope; a subflow does not and inherits the caller's", "A subflow can only be called once per application", "There is no difference; the names are interchangeable"],
    answer: 1,
    explanation: "Neither has an event source, but a private flow has its own processing strategy and error handling, while a subflow inherits everything from the calling flow (and is slightly more performant)."
  },
  {
    id: "m1-020", section: "s4",
    q: "When a Flow Reference calls another flow in the same application, what data does the called flow receive?",
    options: ["Only the payload", "The payload and attributes but not variables", "The entire Mule event: payload, attributes, and variables", "A copy of the event; changes are discarded on return"],
    answer: 2,
    explanation: "A Flow Reference passes the whole Mule event, and any changes made by the referenced flow (payload, variables) come back to the calling flow. This differs from crossing a transport boundary, where only the payload is sent."
  },
  {
    id: "m1-021", section: "s4",
    q: "A developer wants database credentials to differ between dev and prod without changing code. What is the recommended Mule 4 approach?",
    options: ["Hardcode both sets and use a Choice router", "Store values in YAML properties files (e.g. dev.yaml, prod.yaml) selected by a system property like -Denv=dev, referenced with ${db.user}", "Store credentials in the flow name", "Use DataWeave vars in every connector configuration"],
    answer: 1,
    explanation: "Property placeholders externalize configuration. A common pattern is per-environment YAML files whose name is built from an env system property: <file>${env}.yaml</file>, referenced via ${db.user} in configs and p('db.user') in DataWeave."
  },
  {
    id: "m1-022", section: "s4",
    q: "What is the purpose of a Mule domain project?",
    options: ["To bundle multiple applications into one deployable JAR", "To share global configurations (like an HTTP Listener config and port) among applications deployed to the same customer-hosted Mule runtime", "To enable CloudHub applications to share vCores", "To group APIs in Exchange"],
    answer: 1,
    explanation: "Domains let apps on the same customer-hosted runtime share resources such as HTTP Listener configurations (port sharing) and connections. Domains are not supported on CloudHub, where each app runs on its own worker."
  },
  {
    id: "m1-023", section: "s4",
    q: "In DataWeave, how do you read a value from a configuration properties file registered in the application?",
    options: ["vars.db_host", "p('db.host')", "properties.db.host", "${db.host} inside the DataWeave body"],
    answer: 1,
    explanation: "In DataWeave scripts, use the p() function: p('db.host'). The ${db.host} placeholder syntax works in component configuration fields, not inside DataWeave expressions."
  },
  {
    id: "m1-024", section: "s4",
    q: "Why would a developer move connector configurations into a separate global elements XML file?",
    options: ["It is required for the application to compile", "To improve readability and organize reusable configurations referenced by many flows", "Global elements only work in a separate file", "To encrypt the configurations"],
    answer: 1,
    explanation: "Global configurations can live in any config file; keeping them in a dedicated file (e.g. global.xml) is a best practice for organization and reuse. It's a convention, not a requirement."
  },

  // ---- Section 5: Building API Implementation Interfaces ----
  {
    id: "m1-025", section: "s5",
    q: "When APIkit generates flows from a RAML specification, how does the APIkit Router determine which flow handles a request?",
    options: ["By the flow's position in the configuration file", "By matching the request's method and resource path to the flow's name (e.g. get:\\flights:api-config)", "By reading a routing table in the pom.xml", "By evaluating a Choice router inside the main flow"],
    answer: 1,
    explanation: "APIkit routes by flow naming convention: the generated flow name encodes method, resource (and config name). Renaming these flows breaks routing."
  },
  {
    id: "m1-026", section: "s5",
    q: "A request violates the API specification (a required query parameter is missing). What does the APIkit Router do by default?",
    options: ["Routes the request anyway and lets the implementation fail", "Raises an APIKIT:BAD_REQUEST error, which the generated error handler maps to a 400 response", "Returns a 500 response with no body", "Silently drops the request"],
    answer: 1,
    explanation: "The APIkit Router validates requests against the spec. Invalid requests raise APIKIT:BAD_REQUEST, and the scaffolded error handlers return the corresponding HTTP status (400)."
  },
  {
    id: "m1-027", section: "s5",
    q: "What does the anypoint platform automatically generate when a RAML API specification is published to Exchange, making the API easy to consume from Studio?",
    options: ["A SOAP WSDL", "A REST Connector (via REST Connect) with one operation per method", "A Java SDK", "An APIkit error handler"],
    answer: 1,
    explanation: "REST Connect generates a connector from the published spec. Developers add it to their project from Exchange and get typed operations instead of hand-configured HTTP Request calls."
  },
  {
    id: "m1-028", section: "s5",
    q: "Inside an APIkit-generated implementation flow for GET /flights/{ID}, how is the ID value accessed?",
    options: ["payload.ID", "attributes.uriParams.ID", "vars.ID", "attributes.queryParams.ID"],
    answer: 1,
    explanation: "URI parameters extracted by the router are placed in attributes.uriParams. Query parameters go to attributes.queryParams."
  },
  {
    id: "m1-029", section: "s5",
    q: "Which statement describes a benefit of generating an API interface with APIkit rather than building it manually?",
    options: ["APIkit removes the need for an HTTP Listener", "APIkit guarantees zero-downtime deployments", "The interface stays consistent with the specification, and request validation plus error handling scaffolding come for free", "APIkit automatically writes the implementation logic for each resource"],
    answer: 2,
    explanation: "APIkit scaffolds routing flows, validates requests against the spec, and generates standard error handlers. Business logic still has to be implemented by the developer."
  },
  {
    id: "m1-030", section: "s5",
    q: "A developer regenerates APIkit flows after the RAML spec added a new resource. What happens to existing implementation flows?",
    options: ["They are deleted and must be rewritten", "They are preserved; APIkit adds flows only for the new resource/method pairs", "They are renamed with a version suffix", "They are moved to a backup project"],
    answer: 1,
    explanation: "Regenerating flows from an updated spec adds missing flows for new resources/methods while leaving existing implementation flows intact."
  },

  // ---- Section 6: Routing Events ----
  {
    id: "m1-031", section: "s6",
    q: "In a Choice router with three 'when' routes and a default route, the event matches the conditions of both the first and second routes. What happens?",
    options: ["Both matching routes execute in parallel", "Only the first matching route executes", "The default route executes because the match is ambiguous", "An error is raised"],
    answer: 1,
    explanation: "The Choice router executes exactly one route: the FIRST whose expression evaluates true. If none match, the otherwise/default route runs."
  },
  {
    id: "m1-032", section: "s6",
    q: "What payload does a Scatter-Gather return after all its routes complete successfully?",
    options: ["The payload of the last route only", "An array of payloads in route order", "An object with keys \"0\", \"1\", ... each containing that route's Mule message (payload and attributes)", "The original request payload unchanged"],
    answer: 2,
    explanation: "Scatter-Gather aggregates results into an object keyed by route index; each value holds that route's message. Developers typically follow it with DataWeave like flatten(payload pluck $.payload) to merge results."
  },
  {
    id: "m1-033", section: "s6",
    q: "How does the Scatter-Gather router process its routes?",
    options: ["Sequentially, stopping at the first failure", "Concurrently, sending a copy of the event to every route and waiting for all to complete", "Round-robin, one route per incoming event", "Only the fastest route's result is kept"],
    answer: 1,
    explanation: "Scatter-Gather multicasts a copy of the event to all routes in parallel and waits for all of them. Round-robin describes the Round Robin router; 'first successful' describes First Successful."
  },
  {
    id: "m1-034", section: "s6",
    q: "What happens when an 'Is number' validation component from the Validation module receives a non-numeric string?",
    options: ["It sets the payload to false", "It throws a Mule error of type VALIDATION:INVALID_NUMBER", "It logs a warning and continues", "It converts the value to 0"],
    answer: 1,
    explanation: "Validation components throw typed Mule errors on failure (VALIDATION namespace) rather than returning booleans, so failures can be handled by error handlers."
  },
  {
    id: "m1-035", section: "s6",
    q: "A flow must route an order to exactly one of three handlers based on payload.orderType, with a fallback for unknown types. Which component fits best?",
    options: ["Scatter-Gather", "Choice router with three when routes and a default route", "For Each scope", "First Successful router"],
    answer: 1,
    explanation: "Conditional single-route dispatching with a fallback is exactly the Choice router's job. Scatter-Gather would send the order to ALL handlers."
  },
  {
    id: "m1-036", section: "s6",
    q: "By default, what happens if one route inside a Scatter-Gather fails?",
    options: ["The other routes are cancelled and their results discarded silently", "Scatter-Gather waits for all routes, then raises a composite routing error containing the failure(s)", "The failed route is retried three times", "The failure is ignored and the aggregate contains only successful routes"],
    answer: 1,
    explanation: "All routes run; if any fail, a COMPOSITE_ROUTING error aggregating the failures is raised. Handling partial failures requires error handling inside the routes (e.g. Try scopes)."
  }
);
