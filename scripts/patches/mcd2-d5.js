/* MCD2 · d5 — Production-Ready APIs and Automated Testing
 * Includes a correctness fix: m2-094's answer key pointed to the wrong option. */
module.exports = {
  sections: {
    d5: {
      topicDocs: {
        "MUnit tools: mock, spy, verify, assert": "https://docs.mulesoft.com/munit/latest/",
        "Coverage as a build gate": "https://docs.mulesoft.com/munit/latest/coverage-concept",
        "Deprecating an API version gracefully": "https://docs.mulesoft.com/api-manager/latest/"
      },
      appendNotes: `
<h3>MUnit tools: mock, spy, verify, assert</h3>
<table>
<tr><th>Tool</th><th>Purpose</th><th>Replaces the processor?</th></tr>
<tr><td><strong>Mock When</strong></td><td>Return a canned payload/attributes — or <em>throw</em> a typed error — instead of running a processor (matched by name/attributes)</td><td>Yes</td></tr>
<tr><td><strong>Spy</strong></td><td>Assert on the event immediately before and/or after a processor runs</td><td>No (it still executes)</td></tr>
<tr><td><strong>Verify Call</strong></td><td>Assert how many times a processor was invoked (times/atLeast/atMost)</td><td>No</td></tr>
<tr><td><strong>Assert That</strong></td><td>Check an expression against a MunitTools matcher (equalTo, notNullValue, hasSize…)</td><td>No</td></tr>
</table>
<p>A test is structured <strong>Behavior → Execution → Validation</strong> (arrange/mocks → invoke the flow → assert). Mock When's <em>then-throw</em> is how you drive error handlers deterministically (e.g. raise <code>HTTP:CONNECTIVITY</code>) instead of relying on a real failure. Expect a specific error from the flow with <code>expectedErrorType</code> on the <code>munit:test</code>.</p>

<h3>Coverage as a build gate</h3>
<pre><code>&lt;plugin&gt;
  &lt;groupId&gt;com.mulesoft.munit.tools&lt;/groupId&gt;
  &lt;artifactId&gt;munit-maven-plugin&lt;/artifactId&gt;
  &lt;configuration&gt;&lt;coverage&gt;
    &lt;runCoverage&gt;true&lt;/runCoverage&gt;
    &lt;failBuild&gt;true&lt;/failBuild&gt;
    &lt;requiredApplicationCoverage&gt;80&lt;/requiredApplicationCoverage&gt;
  &lt;/coverage&gt;&lt;/configuration&gt;
&lt;/plugin&gt;</code></pre>
<p>Tests live in <code>src/test/munit</code>, run in the Maven <strong>test</strong> phase, and are <strong>not packaged</strong> into the deployable JAR. Before/After <strong>Suite</strong> run once per suite; Before/After <strong>Test</strong> run around each test.</p>

<h3>Deprecating an API version gracefully</h3>
<p>A breaking RAML change means a new MAJOR version and a <strong>new API instance</strong> (e.g. <code>/v2</code>). The old version: mark <strong>deprecated</strong> in Exchange/API Manager → stop new access requests → notify existing contract holders with a <strong>sunset date</strong> → retire after the window. Never delete v1 the moment v2 ships, and never silently redirect v1 traffic to v2.</p>
<p class="tip"><strong>Exam tip:</strong> replace a call → Mock When; force an error → Mock When then-throw; count invocations → Verify Call; check a value → Assert That; observe without replacing → Spy; one-time data setup → Before Suite; build-once/deploy-many and gate on coverage before promotion.</p>`
    }
  },
  questions: {
    "m2-061": {
      options: [
        "Setup, Run, and Report phases",
        "Behavior (arrange/mocks), Execution (act), and Validation (assert)",
        "Given, Then, and Finally blocks",
        "Mock, Spy, and Verify stages"
      ],
      answer: 1,
      explanation: "An MUnit test is structured as Behavior → Execution → Validation: prepare input and mocks, invoke the flow under test, then assert on the results.",
      optionNotes: [
        "Wrong — those aren't the MUnit section names.",
        "Correct — Behavior, Execution, Validation.",
        "Wrong — that's BDD-style naming, not MUnit's three blocks.",
        "Wrong — Mock/Spy/Verify are tools used within a test, not its structure."
      ]
    },
    "m2-063": {
      options: [
        "It replaces a processor with a canned stub response",
        "It asserts on the event just before and/or after a processor runs, without replacing it",
        "It records the total test execution time",
        "It captures raw HTTP traffic during the test"
      ],
      answer: 1,
      explanation: "Spy wraps a real processor with before-call and after-call assertions — the processor still executes normally.",
      optionNotes: [
        "Wrong — stubbing is Mock When; Spy doesn't replace the processor.",
        "Correct — Spy asserts around a processor that still executes.",
        "Wrong — Spy isn't a timing tool.",
        "Wrong — Spy inspects the Mule event, not raw HTTP traffic."
      ]
    },
    "m2-064": {
      options: [
        "Rely on manual code review to catch low coverage",
        "Set the munit-maven-plugin coverage section with requiredApplicationCoverage 80 and failBuild true",
        "Add a coverage property to mule-artifact.json",
        "Coverage thresholds cannot fail a Maven build"
      ],
      answer: 1,
      explanation: "The munit-maven-plugin computes coverage (application/resource/flow levels) and can fail the Maven build below thresholds — a standard CI quality gate.",
      optionNotes: [
        "Wrong — manual review isn't an automated gate.",
        "Correct — the plugin's coverage config with failBuild enforces the threshold.",
        "Wrong — mule-artifact.json doesn't configure coverage.",
        "Wrong — coverage gates are exactly what the plugin provides."
      ]
    },
    "m2-065": {
      options: [
        "assert-true with expression #[payload]",
        "Assert That with #[payload] and 'is' #[MunitTools::equalTo('expected')]",
        "Verify Call configured with times 1",
        "A Spy wrapped around a Logger component"
      ],
      answer: 1,
      explanation: "Assert That evaluates an expression against a matcher from MunitTools (equalTo, notNullValue, hasSize…). Verify Call and Spy serve different purposes.",
      optionNotes: [
        "Wrong — assert-true checks a boolean, not equality to a value.",
        "Correct — Assert That + equalTo matcher checks the payload value.",
        "Wrong — Verify Call counts invocations, it doesn't compare values.",
        "Wrong — Spy observes around a processor; it isn't an equality assertion."
      ]
    },
    "m2-067": {
      options: [
        "It can't — simulating errors requires the real system to fail",
        "Configure Mock When to 'Then throw' an error with the desired typeId (e.g. HTTP:CONNECTIVITY)",
        "Physically stop the network adapter during the test run",
        "Use Assert That with an error matcher and nothing else"
      ],
      answer: 1,
      explanation: "Mock When can return an error instead of a payload, letting tests drive error handlers deterministically without real failures.",
      optionNotes: [
        "Wrong — MUnit simulates errors precisely so real systems aren't needed.",
        "Correct — Mock When then-throw raises the typed error deterministically.",
        "Wrong — killing the network is neither deterministic nor repeatable.",
        "Wrong — Assert That checks results; it can't make the operation fail."
      ]
    },
    "m2-068": {
      options: [
        "A single API instance shared across all environments",
        "A separate API instance per environment, each with its own API ID paired via autodiscovery",
        "Policies declared inside the RAML specification",
        "A dedicated CloudHub VPC for the API"
      ],
      answer: 1,
      explanation: "API instances are environment-scoped. The app's autodiscovery API ID must match the instance of its own environment — typically externalized as a property per environment.",
      optionNotes: [
        "Wrong — a shared instance can't enforce policies independently per environment.",
        "Correct — one instance per environment, matched by autodiscovery API ID.",
        "Wrong — policies are applied in API Manager, not the RAML.",
        "Wrong — a VPC is networking, unrelated to per-environment policy enforcement."
      ]
    },
    "m2-069": {
      options: [
        "Email the API's WSDL or spec file to interested teams",
        "Publish the spec to Exchange with docs/examples, enable mocking, and require access requests",
        "Hand consumers the implementation's source code repository",
        "Post the raw CloudHub URL on an internal wiki page"
      ],
      answer: 1,
      explanation: "Exchange is the discovery and self-service surface: documentation, try-it console/mocking, and managed access requests tied to API Manager contracts and SLA tiers.",
      optionNotes: [
        "Wrong — emailing files isn't discoverable or self-service.",
        "Correct — Exchange publishing + mocking + access requests is the pattern.",
        "Wrong — consumers need the contract, not the implementation source.",
        "Wrong — a raw URL bypasses documentation, contracts, and governance."
      ]
    },
    "m2-070": {
      options: [
        "Rebuild the project from source separately for each environment",
        "Build once, store the versioned artifact, deploy the identical JAR per environment, gate on MUnit",
        "Deploy directly from individual developer laptops",
        "Skip the test phase in production deployments to save time"
      ],
      answer: 1,
      explanation: "Build-once/deploy-many guarantees what was tested is what ships. Configuration differences are supplied at deploy time; quality gates (tests, coverage) run before promotion.",
      optionNotes: [
        "Wrong — rebuilding per environment ships something never tested.",
        "Correct — build once, promote the same artifact, gate on tests.",
        "Wrong — laptop deploys aren't reproducible or governed.",
        "Wrong — skipping tests removes the quality gate promotion relies on."
      ]
    },
    "m2-071": {
      options: [
        "Tests live in src/main/mule and are deployed with the application",
        "Tests live in src/test/munit, run in the Maven test phase, and are excluded from the deployable app",
        "MUnit tests must be written in Java, not XML",
        "MUnit tests execute inside API Manager at runtime"
      ],
      answer: 1,
      explanation: "MUnit suites are test resources: executed at build time (Studio or mvn test) and excluded from the production JAR.",
      optionNotes: [
        "Wrong — tests aren't packaged with the app.",
        "Correct — src/test/munit, run at build time, excluded from the JAR.",
        "Wrong — MUnit tests are authored as XML (with optional DataWeave/Java assertions).",
        "Wrong — tests run at build time, not inside API Manager."
      ]
    },
    "m2-072": {
      options: [
        "Delete the old API instance immediately once v2 goes live",
        "Mark it deprecated, block new access, notify consumers with a sunset date, then retire it",
        "Silently redirect all old-version traffic to v2",
        "Remove its documentation but keep it running indefinitely"
      ],
      answer: 1,
      explanation: "Graceful deprecation: signal it (deprecated status), stop new adoption, give consumers a migration window with clear communication, and only then decommission.",
      optionNotes: [
        "Wrong — deleting immediately breaks existing consumers.",
        "Correct — deprecate, block new access, communicate a sunset, then retire.",
        "Wrong — silent redirection breaks consumers on a breaking change.",
        "Wrong — hiding docs while running forever helps no one and never retires it."
      ]
    },
    "m2-093": {
      options: [
        "Assert That evaluated against the resulting payload",
        "Verify Call on the flow-ref processor configured with times=2",
        "Mock When supplying two consecutive then-return values",
        "A Spy that increments a counter variable"
      ],
      answer: 1,
      explanation: "Verify Call asserts invocation counts (times/atLeast/atMost) of a processor matched by name/attributes. Mocks replace behavior; Assert That checks event values; Spy observes before/after but doesn't count.",
      optionNotes: [
        "Wrong — Assert That checks values, not call counts.",
        "Correct — Verify Call with times=2 asserts the invocation count.",
        "Wrong — Mock When replaces behaviour; it doesn't assert counts.",
        "Wrong — Spy observes around a call but isn't a call counter."
      ]
    },
    "m2-094": {
      options: [
        "failBuild true with requiredApplicationCoverage 80 in the munit-maven-plugin coverage section",
        "Installing a dedicated coverage plugin on the Jenkins server",
        "Setting coverage=strict inside mule-artifact.json",
        "It cannot be automated in the Maven build"
      ],
      answer: 0,
      explanation: "The munit-maven-plugin's coverage block (runCoverage, failBuild, requiredApplicationCoverage / ResourceCoverage / FlowCoverage) turns coverage into a build gate during the Maven test phase.",
      optionNotes: [
        "Correct — the plugin's coverage config with failBuild enforces the threshold in the build.",
        "Wrong — the gate is a Maven plugin setting, not a Jenkins-only feature.",
        "Wrong — mule-artifact.json doesn't configure coverage.",
        "Wrong — coverage gating is exactly what the munit-maven-plugin automates."
      ]
    },
    "m2-095": {
      options: [
        "Call the real endpoint and hope it returns a 500 during the test",
        "Mock When on the http:request with 'Then throw' raising HTTP:INTERNAL_SERVER_ERROR",
        "Use Set Payload to put 500 into the payload",
        "Delete the HTTP Request processor from the flow"
      ],
      answer: 1,
      explanation: "Mock When's then-throw (error typeId) deterministically raises the typed error, driving the flow into its error handler so the test can assert the mapped result. Deterministic beats hoping.",
      optionNotes: [
        "Wrong — relying on a real failure is non-deterministic.",
        "Correct — Mock When then-throw raises the typed error reliably.",
        "Wrong — setting the payload to 500 doesn't raise an error type.",
        "Wrong — deleting the processor changes the flow under test."
      ]
    },
    "m2-097": { optionEdits: {
      0: "Update the existing API instance in place with the breaking change",
      1: "Publish the new MAJOR version, create a new instance (/v2), run both during deprecation, notify v1 holders" } },
    "m2-120": { optionEdits: {
      0: "The HTTP Request named 'Get customer' isn't executed; the mock returns the given JSON instead",
      3: "It mocks every processor in the flow at once, not only the named HTTP Request" } },
    "m2-096": {
      optionNotes: [
        "Correct — promote the exact JAR that was built and tested once.",
        "Wrong — a freshly rebuilt JAR per environment was never the one you tested.",
        "Correct — property values and secure keys are injected per environment at deploy time.",
        "Wrong — flow XML is part of the artifact and must not change per environment."
      ]
    }
  }
};
