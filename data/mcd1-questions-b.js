// MCD Level 1 question bank — Part B (sections 7–12)
window.CERT_DATA.mcd1.questions.push(
  // ---- Section 7: Handling Errors ----
  {
    id: "m1-037", section: "s7",
    q: "An HTTP-triggered flow has an On Error Continue scope that matches the raised error. What HTTP response does the caller receive?",
    options: ["A 500 error response, because an error occurred", "The flow's success response (200 by default), with the payload produced by the error handler", "A 400 Bad Request", "No response; the connection is closed"],
    answer: 1,
    explanation: "On Error Continue handles the error and continues as if the flow succeeded, so the HTTP Listener returns its success response. On Error Propagate would return the error (500) response."
  },
  {
    id: "m1-038", section: "s7",
    q: "Flow A calls Flow B via Flow Reference. Flow B raises an error that is handled by an On Error Propagate scope in Flow B. What happens in Flow A?",
    options: ["Flow A continues normally after the Flow Reference", "The error propagates to Flow A, where its error handling (or the default handler) takes over; the rest of Flow A does not execute normally", "Flow A restarts from the beginning", "Flow A receives the error as its payload and continues"],
    answer: 1,
    explanation: "On Error Propagate re-throws the error after running its processors, so the error surfaces at the Flow Reference in Flow A and is handled by Flow A's error handling."
  },
  {
    id: "m1-039", section: "s7",
    q: "Which expression accesses the type of the error that was raised, inside an error handler?",
    options: ["payload.errorType", "error.errorType", "vars.error.type", "attributes.error"],
    answer: 1,
    explanation: "In an error handler, the error object exposes error.errorType, error.description, and error.cause. The payload remains whatever it was when the error occurred."
  },
  {
    id: "m1-040", section: "s7",
    q: "A developer wants one error handler to be used by all flows in the application that do not define their own. What should they configure?",
    options: ["An On Error Continue in every flow", "A Try scope around every flow", "A global error handler referenced as the application's default error handler in the project configuration", "An APIkit console flow"],
    answer: 2,
    explanation: "Define a global error handler (Error Handler global element) and set it as the default error handler in the Mule configuration properties. It applies only to flows without their own handler — it is a fallback, not an addition."
  },
  {
    id: "m1-041", section: "s7",
    q: "What is the purpose of a Try scope?",
    options: ["To retry failed processors automatically", "To handle errors at the level of one or more processors inside a flow, with its own error handling scopes", "To run processors in parallel", "To catch Java exceptions only, not Mule errors"],
    answer: 1,
    explanation: "A Try scope wraps a set of processors and attaches error handling to just that section, enabling processor-level handling (e.g. continue after one risky call fails). It does not retry by itself — that's Until Successful."
  },
  {
    id: "m1-042", section: "s7",
    q: "An error handler has two On Error scopes: the first matches type MULE:ANY, the second matches HTTP:NOT_FOUND. An HTTP:NOT_FOUND error is raised. Which scope handles it?",
    options: ["The second, because it is the most specific match", "The first, because scopes are evaluated in order and MULE:ANY matches everything", "Both scopes execute in order", "Neither; the error propagates"],
    answer: 1,
    explanation: "Error scopes are evaluated top to bottom and the FIRST match wins. Since all errors extend MULE:ANY, the first scope catches everything — specific handlers must be placed before general ones."
  },
  {
    id: "m1-043", section: "s7",
    q: "Why would a developer configure error mapping on a connector operation?",
    options: ["To retry the operation with backoff", "To convert a low-level error (e.g. HTTP:NOT_FOUND) into a custom, application-specific error type (e.g. APP:CUSTOMER_NOT_FOUND)", "To suppress all errors from the operation", "To log the error automatically"],
    answer: 1,
    explanation: "Error mapping renames/reclassifies errors into custom namespaces so error handlers can react to business-meaningful types instead of transport-level ones."
  },

  // ---- Section 8: DataWeave ----
  {
    id: "m1-044", section: "s8",
    q: "Given payload = [{price: 10}, {price: 20}], what does this script return?\n\n%dw 2.0\noutput application/json\n---\npayload map (item, index) -> { p: item.price * 2 }",
    options: ["[{p: 20}, {p: 40}]", "{p: [20, 40]}", "[{price: 20}, {price: 40}]", "An error, because map requires $ syntax"],
    answer: 0,
    explanation: "map transforms each array element with the lambda; named parameters (item, index) are equivalent to $ and $$. Each element becomes an object with key p and doubled price."
  },
  {
    id: "m1-045", section: "s8",
    q: "Which DataWeave expression removes duplicate elements from an array of objects based on their 'id' field?",
    options: ["payload filter $.id", "payload distinctBy $.id", "payload groupBy $.id", "payload orderBy $.id"],
    answer: 1,
    explanation: "distinctBy returns unique elements based on the criteria expression. groupBy would return an object of arrays keyed by id; filter keeps elements matching a boolean."
  },
  {
    id: "m1-046", section: "s8",
    q: "What must be true for a DataWeave script that outputs application/xml?",
    options: ["The body must produce a single root element", "The body must be an array", "All values must be strings", "The script must import dw::xml"],
    answer: 0,
    explanation: "XML documents require exactly one root element, so the top level of the script body must reduce to a single key. Multiple top-level keys or an array cause an error."
  },
  {
    id: "m1-047", section: "s8",
    q: "Which expression converts the string \"2024-03-15\" into a Date and formats today's date as \"15-03-2024\" style output?",
    options: ["\"2024-03-15\" as Date and now() as String {format: \"dd-MM-yyyy\"}", "toDate(\"2024-03-15\") and format(now(), \"dd-MM-yyyy\")", "Date(\"2024-03-15\") and now().format(\"dd-MM-yyyy\")", "\"2024-03-15\" as String {format: Date}"],
    answer: 0,
    explanation: "Type coercion uses the 'as' operator, optionally with format metadata: value as Date, and now() as String {format: \"dd-MM-yyyy\"}."
  },
  {
    id: "m1-048", section: "s8",
    q: "Where should a reusable DataWeave function library be placed, and how is it used in a Transform Message component?",
    options: ["In a .dwl file under src/main/resources (e.g. modules/MyModule.dwl), imported with 'import modules::MyModule'", "In pom.xml as a dependency", "In the flow's error handler", "In a Java class annotated @DataWeave"],
    answer: 0,
    explanation: "Custom modules are .dwl files on the classpath (src/main/resources). Import them in the header: import modules::MyModule (then MyModule::myFun) or import * from modules::MyModule."
  },
  {
    id: "m1-049", section: "s8",
    q: "Which DataWeave function calls another flow from inside a script and returns that flow's payload?",
    options: ["invoke()", "lookup()", "callFlow()", "flowRef()"],
    answer: 1,
    explanation: "lookup(\"flowName\", payload) executes a flow (not a subflow) and returns its resulting payload. It should be used sparingly — errors in the called flow can be hard to handle."
  },
  {
    id: "m1-050", section: "s8",
    q: "Given payload = [{\"dest\":\"SFO\",\"price\":100},{\"dest\":\"LAX\",\"price\":75},{\"dest\":\"SFO\",\"price\":90}], what does 'payload groupBy $.dest' return?",
    options: ["An array sorted by dest", "An object with keys \"SFO\" and \"LAX\", each containing an array of the matching objects", "An array with duplicate destinations removed", "The count of flights per destination"],
    answer: 1,
    explanation: "groupBy returns an object whose keys are the criteria values and whose values are arrays of matching elements: {SFO: [...2 items...], LAX: [...1 item...]}."
  },
  {
    id: "m1-051", section: "s8",
    q: "In a DataWeave script, where are 'var' and 'fun' declarations placed?",
    options: ["In the body, after the --- separator", "In the header, before the --- separator", "In a separate properties file", "Inside #[ ] blocks only"],
    answer: 1,
    explanation: "The header (above ---) holds directives: %dw 2.0, output, var, fun, import, type, ns. The body (below ---) is a single expression producing the output."
  },

  // ---- Section 9: Using Connectors ----
  {
    id: "m1-052", section: "s9",
    q: "Why should a Database Select query use input parameters (e.g. WHERE code = :code) instead of string-concatenating values into the SQL?",
    options: ["Concatenation is not supported by the Database connector", "Input parameters prevent SQL injection and let the driver handle escaping and types", "Input parameters make the query run in parallel", "Named parameters are required for SELECT statements"],
    answer: 1,
    explanation: "Parameterized queries bind values safely (:code with input parameters map #[{code: ...}]), preventing SQL injection. Concatenation works but is unsafe."
  },
  {
    id: "m1-053", section: "s9",
    q: "An HTTP Request operation receives a 404 from the remote REST service. What happens by default?",
    options: ["The payload is set to null and the flow continues", "A Mule error of type HTTP:NOT_FOUND is raised", "The request is retried automatically", "The response body is returned as the payload with no error"],
    answer: 1,
    explanation: "By default only 2xx responses are treated as success; other statuses raise typed errors (HTTP:NOT_FOUND, HTTP:INTERNAL_SERVER_ERROR...). The success range is configurable via the response validator / success status codes."
  },
  {
    id: "m1-054", section: "s9",
    q: "Which connector is used to consume a SOAP web service in Mule 4, and how is it configured?",
    options: ["HTTP Request pointing at the WSDL", "Web Service Consumer, configured with the service's WSDL location, service, port, and address", "SOAPkit Router", "REST Connect connector generated from the WSDL"],
    answer: 1,
    explanation: "The Web Service Consumer connector consumes SOAP services from their WSDL, exposing the SOAP operations. Requests are built as XML — usually with a Transform Message before the operation."
  },
  {
    id: "m1-055", section: "s9",
    q: "How are parameters typically passed to a SOAP web service operation invoked with the Web Service Consumer?",
    options: ["As query parameters on the endpoint URL", "By building the expected SOAP body XML with a Transform Message (DataWeave) before the operation", "As Mule variables that the connector reads automatically", "In the connector's 'arguments' table"],
    answer: 1,
    explanation: "The Web Service Consumer expects the payload to be the operation's SOAP body. Studio exposes the operation's metadata so a Transform Message can map data to the correct XML structure."
  },
  {
    id: "m1-056", section: "s9",
    q: "A flow must process each new CSV file that appears in a directory, then prevent the same file from being processed again. Which approach is correct?",
    options: ["An On New or Updated File listener with a post-processing action (move or delete the file)", "A Scheduler that reads all files every minute with no state", "An HTTP Listener that watches the file system", "A For Each scope around a File Read"],
    answer: 0,
    explanation: "The File listener triggers per new/updated file; configuring post-processing (move to another directory, rename, or delete) prevents reprocessing. Without it, files are picked up repeatedly."
  },
  {
    id: "m1-057", section: "s9",
    q: "What messaging model does a JMS queue provide, in contrast to a JMS topic?",
    options: ["Queues broadcast to all consumers; topics deliver to exactly one", "Queues provide point-to-point delivery (one consumer gets each message); topics provide publish/subscribe (all subscribers get each message)", "Queues are synchronous HTTP; topics are asynchronous", "There is no difference in Mule 4"],
    answer: 1,
    explanation: "Point-to-point (queue): each message is consumed by a single receiver. Pub/sub (topic): every active subscriber receives a copy of each message."
  },

  // ---- Section 10: Processing Records ----
  {
    id: "m1-058", section: "s10",
    q: "What is the payload after a For Each scope finishes processing a collection?",
    options: ["The last element processed", "An array of the results of each iteration", "The original payload that entered the scope", "null"],
    answer: 2,
    explanation: "For Each returns the ORIGINAL payload; payload modifications inside the scope are discarded after it completes. Variables set inside, however, persist."
  },
  {
    id: "m1-059", section: "s10",
    q: "In which Batch Job phase does the payload become a BatchJobResult object with counts of successful and failed records?",
    options: ["Load and Dispatch", "Process", "On Complete", "Aggregate"],
    answer: 2,
    explanation: "On Complete runs once after all records are processed; its payload is the BatchJobResult (processed/successful/failed counts). The original input payload is not available there."
  },
  {
    id: "m1-060", section: "s10",
    q: "How are records processed inside the Process phase of a Batch Job?",
    options: ["Strictly sequentially in input order", "Asynchronously and in parallel across batch steps", "Only one record at a time per application", "In reverse order"],
    answer: 1,
    explanation: "Batch queues each record and processes them in parallel through the steps — a key difference from For Each (sequential). Order of completion is not guaranteed."
  },
  {
    id: "m1-061", section: "s10",
    q: "A batch step must insert records into a database in bulk groups of 100. What component achieves this?",
    options: ["A For Each with batch size 100", "A Batch Aggregator inside the batch step with size 100", "A Scatter-Gather with 100 routes", "The On Complete phase"],
    answer: 1,
    explanation: "The Batch Aggregator collects records within a step into groups (fixed size or streaming) so they can be sent to a target in bulk — e.g. a bulk insert of 100 records."
  },
  {
    id: "m1-062", section: "s10",
    q: "By default (maxFailedRecords = 0), what happens when a record fails inside a Batch Job's Process phase?",
    options: ["The record is retried until it succeeds", "The job stops processing further records and moves to On Complete", "The failure is silently ignored", "The whole application shuts down"],
    answer: 1,
    explanation: "With maxFailedRecords = 0, the first failed record halts the job. Setting it to -1 allows the job to continue regardless of failures; subsequent steps can filter on failed records with accept policies."
  },
  {
    id: "m1-063", section: "s10",
    q: "A flow synchronizes new database rows every hour and must not re-process rows it has already seen, based on their incrementing ID. Which built-in mechanism fits best?",
    options: ["A Choice router comparing IDs", "Automatic watermarking on the On Table Row listener using the ID as the watermark column", "Storing the whole table in a variable", "The Cache scope"],
    answer: 1,
    explanation: "The Database connector's On Table Row source supports automatic watermarking: it stores the highest seen value of the watermark column and only returns newer rows on each poll."
  },
  {
    id: "m1-064", section: "s10",
    q: "When is MANUAL watermarking (using an Object Store) required instead of automatic watermarking?",
    options: ["Whenever a Scheduler is used, because Schedulers reset automatic watermarks", "When the synchronization logic needs a custom marker the source doesn't manage, e.g. comparing a max updated-at value retrieved and stored explicitly each run", "Manual watermarking is never required in Mule 4", "Only when using the File connector"],
    answer: 1,
    explanation: "Automatic watermarking exists only on certain listener sources. When polling with a Scheduler or using custom criteria, you store/retrieve the watermark yourself with Object Store operations."
  },

  // ---- Section 11: Debugging and Troubleshooting ----
  {
    id: "m1-065", section: "s11",
    q: "While debugging in Anypoint Studio with a breakpoint on a processor, what can the developer inspect when execution pauses?",
    options: ["Only the payload", "The full Mule event before that processor executes: payload, attributes, and variables — and evaluate DataWeave expressions", "Only variables set in the current flow", "The compiled Java bytecode"],
    answer: 1,
    explanation: "The Mule debugger shows the entire event as it arrives at the breakpointed processor and includes an expression evaluator for ad-hoc DataWeave."
  },
  {
    id: "m1-066", section: "s11",
    q: "A Mule project fails to build with 'Could not resolve dependencies ... mysql-connector-java'. What is the appropriate fix?",
    options: ["Reinstall Anypoint Studio", "Add (or correct) the JDBC driver dependency in the project's pom.xml so Maven can resolve it", "Copy the JAR into src/main/mule", "Disable Maven in project preferences"],
    answer: 1,
    explanation: "Mule apps are Maven projects; external libraries like database drivers must be declared as dependencies in pom.xml (Studio can add them via the connector config UI)."
  },
  {
    id: "m1-067", section: "s11",
    q: "A log shows: 'ERROR ... Message: HTTP GET on resource http://acme/api/flights failed: not found (404). Error type: HTTP:NOT_FOUND'. What is the most direct conclusion?",
    options: ["The Mule application failed to start", "An outbound HTTP Request in the flow received a 404 from the remote service", "The HTTP Listener rejected an incoming request", "DataWeave failed to transform the payload"],
    answer: 1,
    explanation: "The error type HTTP:NOT_FOUND with an outbound URL indicates the app's own HTTP Request call got a 404 from the remote endpoint — start troubleshooting at that request's URL/path."
  },
  {
    id: "m1-068", section: "s11",
    q: "On which port does the Anypoint Studio embedded Mule debugger listen by default?",
    options: ["8081", "6666", "8080", "1521"],
    answer: 1,
    explanation: "The Mule debugger uses port 6666 by default (configurable in the run configuration). 8081 is the conventional HTTP Listener port."
  },
  {
    id: "m1-069", section: "s11",
    q: "A Logger set to #[payload] prints something like 'org.mule.runtime...ManagedCursorStreamProvider'. Why?",
    options: ["The payload is null", "The payload is a stream; logging shows the stream object unless it is consumed/converted (e.g. write it as a String)", "The Logger is misconfigured to DEBUG level", "The payload is encrypted"],
    answer: 1,
    explanation: "Many connectors return streaming payloads. Logging the raw stream shows the cursor provider object; convert first (e.g. #[payload as String] or output application/json in a transform) to log content."
  },

  // ---- Section 12: Deploying and Managing APIs ----
  {
    id: "m1-070", section: "s12",
    q: "What artifact is produced when a Mule 4 application is packaged for deployment?",
    options: ["A WAR file", "A deployable JAR file containing the application and its dependencies", "A ZIP of the Studio workspace", "A Docker image (always)"],
    answer: 1,
    explanation: "Mule 4 apps package as deployable JARs (mvn package or Studio export). The same artifact can be deployed to CloudHub, Runtime Fabric, or customer-hosted runtimes."
  },
  {
    id: "m1-071", section: "s12",
    q: "Which statement about CloudHub workers is correct?",
    options: ["All applications in an organization share one worker", "A worker is a dedicated instance of Mule hosting one application; you can scale worker size (vCores) or the number of workers", "Workers are only available for APIs managed with autodiscovery", "Worker size cannot be changed after deployment"],
    answer: 1,
    explanation: "Each CloudHub app runs on one or more dedicated workers. Vertical scaling changes worker size; horizontal scaling adds workers (with built-in load balancing)."
  },
  {
    id: "m1-072", section: "s12",
    q: "What is required for API Manager policies to be enforced INSIDE a Mule application (without a separate proxy)?",
    options: ["Nothing; policies always apply automatically", "An API Autodiscovery global element in the app whose API ID matches the API instance in API Manager, plus platform client credentials", "A CloudHub dedicated load balancer", "The APIkit Console must be enabled"],
    answer: 1,
    explanation: "Autodiscovery pairs the running app with the API instance in API Manager (api id + environment client id/secret). The app then downloads and enforces the policies itself."
  },
  {
    id: "m1-073", section: "s12",
    q: "A team wants to enforce rate limiting per consumer with different limits for Gold and Silver customers. What must be configured?",
    options: ["A rate limiting policy only", "SLA tiers in API Manager plus an SLA-based rate limiting policy, which requires client ID enforcement so each consumer is identified", "A spike control policy on the load balancer", "One API instance per customer"],
    answer: 1,
    explanation: "SLA-based rate limiting applies per-tier limits. Consumers register client applications, request access at a tier, and send client_id/client_secret so the policy can identify their tier."
  },
  {
    id: "m1-074", section: "s12",
    q: "What is an API proxy in Anypoint Platform?",
    options: ["A DNS alias for the implementation URL", "A separate application deployed by API Manager that sits in front of the implementation and enforces policies", "A mock service generated from RAML", "A CloudHub VPN"],
    answer: 1,
    explanation: "A proxy is an auto-generated app that receives consumer traffic, applies policies (rate limiting, client enforcement...), and forwards allowed requests to the implementation — governance without touching implementation code."
  },
  {
    id: "m1-075", section: "s12",
    q: "After a client ID enforcement policy is applied, what must consumers do to call the API successfully?",
    options: ["Nothing; the policy only logs usage", "Request access to the API in Exchange to obtain client credentials, then send client_id/client_secret with each request as specified by the policy", "Install a certificate on their machine", "Use the mocking service endpoint instead"],
    answer: 1,
    explanation: "Client ID enforcement rejects requests without valid credentials. Consumers register a client application (request access in Exchange), get approved, and pass the credentials in headers or query params per the policy configuration."
  }
);
