/* MCIA de-bias · sections a5–a6. */
module.exports = {
  questions: {
    "ia-030": {
      optionEdits: { 0: "A cluster deploys a different application to each node", 1: "A cluster shares state (VM queues, object stores, locks) via a distributed grid and elects a primary; a server group is N independent servers", 2: "A server group provides automatic failover of in-flight messages; a cluster does not", 3: "Clusters exist only on CloudHub; server groups only on-premises" },
      optionNotes: ["A cluster runs the same app across nodes as one logical unit.", "Correct — a cluster shares state through a distributed grid with a primary node; a server group is just independent servers.", "That reverses it — the cluster shares state and can fail over.", "Both are customer-hosted concepts, not CloudHub-only."]
    },
    "ia-031": {
      optionEdits: { 0: "Schedulers run on every node, so you must add locking yourself", 1: "Schedulers and primaryNodeOnly sources run only on the primary node, with automatic re-election on failure", 2: "The load balancer serialises scheduler executions across nodes", 3: "Clusters do not support Scheduler sources at all" },
      optionNotes: ["In a cluster you don't hand-roll locking for schedulers.", "Correct — schedulers/primary-node-only sources fire only on the primary node; a new primary is elected on failure.", "The load balancer handles ingress, not scheduler firing.", "Clusters do support schedulers — on the primary node."]
    },
    "ia-032": {
      optionEdits: { 0: "Deploy normally and rely on the shared load balancer", 1: "Deploy into the VPC and call the workers' internal DNS on 8091/8092, blocking public listener access", 2: "Use static IPs so only known addresses can reach it", 3: "Add an HTTPS listener on port 443 for security" },
      optionNotes: ["The shared load balancer exposes a public endpoint.", "Correct — VPC + internal worker DNS (8091/8092) with the public route blocked keeps it corporate-network-only.", "Static IPs limit egress identity, not inbound public reachability.", "TLS encrypts traffic but doesn't make it private."]
    },
    "ia-033": {
      optionEdits: { 0: "Configure the shared load balancer with the custom certificate", 1: "An Anypoint VPC with a Dedicated Load Balancer holding the custom-domain cert and client-certificate validation", 2: "A CNAME record pointing to the app with no other change", 3: "Static IPs with TLS enabled on the workers" },
      optionNotes: ["The shared load balancer can't host a custom cert or two-way TLS.", "Correct — a DLB (which needs a VPC) serves the vanity domain cert and validates client certificates (mTLS).", "A CNAME alone gives no custom cert or mTLS.", "Static IPs don't provide custom-domain TLS or mTLS."]
    },
    "ia-034": {
      optionEdits: { 0: "On CloudHub, to share an HTTP listener across applications", 1: "On customer-hosted runtimes where co-located apps benefit from shared configs (one HTTP port, shared TLS/DB)", 2: "Whenever more than one application exists in the organisation", 3: "On Runtime Fabric, to reduce the number of containers" },
      optionNotes: ["Domains don't work on CloudHub (isolated workers).", "Correct — domains suit customer-hosted runtimes where co-located apps share a listener/TLS/DB config.", "Having multiple apps isn't itself a reason for a domain.", "Domains aren't a Runtime Fabric container-reduction tool."]
    },
    "ia-035": {
      optionEdits: { 0: "The driver version is wrong; upgrading it fixes the error", 1: "Mule 4 class-loader isolation hides app deps from connectors; declare the driver under sharedLibraries", 2: "The driver must be copied into the runtime's lib folder on CloudHub", 3: "Database connectors require a Mule domain to load drivers" },
      optionNotes: ["It's not a version problem; it's classloader visibility.", "Correct — declare the JDBC driver as a sharedLibrary so the connector's classloader can see it.", "You can't drop jars into CloudHub's runtime lib folder.", "Domains aren't required for the Database connector."]
    },
    "ia-036": {
      optionEdits: { 0: "Each flow owns a dedicated thread pool that must be sized by hand", 1: "Operations declare processing types and are scheduled non-blockingly on shared self-tuning pools, with back-pressure when saturated", 2: "Every event is processed start-to-finish on a single thread", 3: "Blocking calls in custom code have no effect on other flows" },
      optionNotes: ["Mule 4 doesn't use per-flow hand-sized pools.", "Correct — operations declare CPU_LITE/CPU_INTENSIVE/BLOCKING_IO and run on shared self-tuning pools with back-pressure.", "Events hop threads by processing type; they aren't single-threaded end to end.", "Blocking a shared pool absolutely affects other flows."]
    },
    "ia-037": {
      optionEdits: { 0: "Listen directly on port 80 for public traffic", 1: "Bind the listener to ${http.port} (8081), which the platform load balancer forwards from 80/443", 2: "Bind to port 8091 to receive public traffic", 3: "Any port works; CloudHub rewrites it automatically" },
      optionNotes: ["Apps don't bind 80 directly on CloudHub.", "Correct — bind ${http.port} (8081); the shared load balancer forwards 80/443 to it.", "8091/8092 are internal VPC ports, not public.", "The port isn't arbitrary; use the provided ${http.port}."]
    },
    "ia-038": {
      optionEdits: { 0: "A performance test against the real backend", 1: "An MUnit test using Mock When with Then-throw to raise HTTP:CONNECTIVITY and assert the mapped response", 2: "A manual test performed in production", 3: "An integration test that physically unplugs the backend" },
      optionNotes: ["Performance testing doesn't verify error mapping.", "Correct — mock the processor to throw HTTP:CONNECTIVITY, then assert the 503 payload/status deterministically.", "Manual production testing isn't repeatable.", "Physically unplugging a backend is neither deterministic nor unit-level."]
    },
    "ia-039": {
      optionEdits: { 0: "A DataWeave transformation maps all fields correctly", 1: "The mutual-TLS handshake and OAuth token exchange with the partner's real test endpoint work end to end", 2: "A Choice router takes the correct branch per input", 3: "An error handler returns a 400 for validation failures" },
      optionNotes: ["Mapping correctness is a unit (MUnit) concern.", "Correct — real mTLS/OAuth against the partner endpoint can only be proven by an integration test.", "Router branching is unit-testable.", "Error-handler behaviour is unit-testable with MUnit."]
    },
    "ia-040": {
      optionEdits: { 0: "Run them manually before each release from Studio", 1: "Run automatically in the Maven test phase on every build, failing the build when coverage is unmet", 2: "Run them only in production after deployment", 3: "Use them to replace integration and performance testing entirely" },
      optionNotes: ["Manual runs don't gate the pipeline.", "Correct — MUnit runs in the Maven test phase every build, with coverage thresholds that fail the build.", "Running post-deploy in prod defeats the purpose.", "MUnit complements, not replaces, other test levels."]
    },
    "ia-041": {
      optionEdits: { 0: "Extrapolate throughput from MUnit execution times", 1: "Load-test a production-equivalent environment with realistic payloads, pushing past target to find the breaking point", 2: "Test on a developer laptop and multiply by the worker count", 3: "Enable verbose logging in production and watch the numbers" },
      optionNotes: ["MUnit timings don't reflect production performance.", "Correct — validate NFRs by load-testing a prod-equivalent environment and finding the breaking point.", "Laptop-times-workers is not a valid extrapolation.", "Watching prod logs isn't a controlled performance test."]
    },
    "ia-042": {
      optionEdits: { 0: "Unit-testing DataWeave scripts in isolation", 1: "Scheduled black-box tests that call deployed APIs from chosen locations and assert on real responses", 2: "Measuring code coverage of Mule flows", 3: "Load-testing APIs at very high concurrency" },
      optionNotes: ["That's MUnit's job, not functional monitoring.", "Correct — BAT continuously calls deployed APIs from public/private locations and asserts on real responses.", "Coverage is an MUnit/build concern.", "Load testing is a separate performance activity."]
    },
    "ia-082": {
      optionEdits: { 0: "Deploy to a server group instead of a cluster", 1: "In a cluster, polling sources run on the primary node only; on failover a new primary is elected", 2: "File sources cannot be used inside clusters at all", 3: "Set maxConcurrency=1 on the flow" },
      optionNotes: ["A server group won't coordinate single polling; the cluster already does.", "Correct — cluster polling sources run only on the primary node, so each file is processed once.", "File sources work fine in clusters (on the primary).", "maxConcurrency limits parallelism, not duplicate polling across nodes."]
    },
    "ia-084": {
      optionEdits: { 0: "It consumes too much heap memory per event", 1: "CPU_LITE work shares a small thread pool with all flows — blocking it starves the pool and stalls unrelated flows", 2: "It breaks the app's classloader isolation", 3: "It silently disables back-pressure for the flow" },
      optionNotes: ["Memory isn't the core issue; thread starvation is.", "Correct — blocking a CPU_LITE thread starves the small shared pool, stalling other flows.", "It doesn't affect classloader isolation.", "It doesn't disable back-pressure; it clogs threads."]
    },
    "ia-085": {
      optionEdits: { 0: "1=integration test, 2=unit test, 3=MUnit test", 1: "1=MUnit unit test; 2=integration test; 3=performance/soak test on production-like sizing", 2: "All three handled by MUnit unit tests", 3: "All three verified manually in production" },
      optionNotes: ["Mapping is unit-level and the OAuth handshake is integration-level.", "Correct — DataWeave=unit, OAuth handshake=integration, sustained TPS=performance/soak.", "Integration and performance can't be MUnit units.", "Production manual testing isn't the right level for any of these."]
    },
    "ia-086": {
      optionEdits: { 0: "Nothing; sources never execute during MUnit tests", 1: "The flow's real source (e.g. HTTP Listener) starts, so the test can invoke the flow via a real call", 2: "It doubles the reported coverage automatically", 3: "It mocks all sources in the suite" },
      optionNotes: ["Sources can run in MUnit when this option is enabled.", "Correct — 'enable flow sources' starts the real source so you can drive the flow through it instead of a flow-ref.", "It doesn't affect coverage numbers.", "It's the opposite of mocking sources."]
    }
  }
};
