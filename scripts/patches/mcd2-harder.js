/* MCD2 · difficulty upgrade: rework 12 recall questions into scenario/exhibit
 * versions with per-option notes. Options fully rewritten (answer index set);
 * lengths kept balanced so the de-bias metrics hold. */
module.exports = {
  questions: {
    "m2-003": {
      level: "hard",
      q: "Refer to the exhibit. The external API is down for the entire run. What does the caller of this flow ultimately receive?",
      exhibit: "<until-successful maxRetries=\"3\" millisBetweenRetries=\"2000\">\n  <http:request method=\"POST\" path=\"/charge\"/>   <!-- always 503 -->\n</until-successful>\n<logger message=\"charged\"/>\n<!-- no error handler in the flow -->",
      options: [
        "An error response after ~4 failed attempts, because Until Successful raises MULE:RETRY_EXHAUSTED and nothing handles it",
        "A success response — Until Successful eventually gives up quietly and lets the flow continue to the Logger",
        "A success response after the retries, because the scope suppresses the connectivity error once retries end",
        "No response at all — the flow keeps retrying the failing request forever until the worker is restarted"
      ],
      answer: 0,
      optionNotes: [
        "Correct — 1 initial attempt + 3 retries all fail, so the scope raises MULE:RETRY_EXHAUSTED; with no handler it propagates as an error response.",
        "Exhaustion is an error, not a silent continue — the Logger is never reached.",
        "The error is raised, not suppressed, when retries are exhausted.",
        "Retries are bounded by maxRetries; it does not loop forever."
      ],
      explanation: "Until Successful runs 1 + maxRetries attempts (4 here) and raises MULE:RETRY_EXHAUSTED on exhaustion. Unhandled, that becomes the flow's error response — the downstream Logger never executes."
    },
    "m2-010": {
      level: "hard",
      q: "Refer to the exhibit. An HTTP-triggered flow (no transaction) reaches this operation. What happens?",
      exhibit: "<flow name=\"main\">\n  <http:listener path=\"/go\"/>   <!-- non-transactional source -->\n  <db:insert transactionalAction=\"ALWAYS_JOIN\">\n    <db:sql>INSERT ...</db:sql>\n  </db:insert>\n</flow>",
      options: [
        "The operation fails, because ALWAYS_JOIN requires an existing transaction and there is none to join",
        "The operation starts a new transaction of its own and commits the insert when it completes",
        "The operation runs outside any transaction, exactly as NOT_SUPPORTED would behave here",
        "The whole flow is rejected at deploy time, because HTTP sources cannot contain database operations"
      ],
      answer: 0,
      optionNotes: [
        "Correct — ALWAYS_JOIN demands an active transaction; with a non-transactional HTTP source, there is none, so it errors.",
        "That is BEGIN_OR_JOIN / ALWAYS_BEGIN behaviour, not ALWAYS_JOIN.",
        "Running outside a transaction is NOT_SUPPORTED; ALWAYS_JOIN instead fails.",
        "The app deploys fine; the failure is at runtime, by design of the action."
      ],
      explanation: "Transactional actions differ precisely here: ALWAYS_BEGIN starts one, BEGIN_OR_JOIN joins-or-starts, JOIN_IF_POSSIBLE joins if present, and ALWAYS_JOIN errors when no transaction exists — as it does under a plain HTTP source."
    },
    "m2-017": {
      level: "medium",
      q: "A DataWeave transform builds a large JSON array that a downstream HTTP Request streams onward. To let the request start sending before the whole array is materialized in memory, which writer property is set?",
      options: [
        "deferred=true on the output directive, so the result streams downstream as it is produced",
        "indent=false on the output directive, so the smaller payload fits in memory more easily",
        "streaming=false on the output directive, forcing sequential single-pass writing",
        "A header line 'var stream = true' enabling stream mode for the whole script"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the writer property deferred=true streams output so consumers can begin before the full result is built.",
        "indent only affects formatting/size, not streaming behaviour.",
        "streaming is a reader property (true enables sequential input reads); streaming=false doesn't defer output.",
        "There is no such 'var stream' directive."
      ],
      explanation: "Two DataWeave streaming knobs: the reader's streaming=true processes input sequentially (single pass), and the writer's deferred=true streams the OUTPUT downstream before the whole result is materialized — the property this scenario needs."
    },
    "m2-020": {
      level: "medium",
      q: "A CI pipeline runs 'mvn clean package' and expects MUnit tests (with the coverage gate) to run and be able to fail the build. In which Maven phase does that happen, and is the result packaged?",
      options: [
        "MUnit runs in the test phase (before package) and its results/coverage can fail the build; tests are excluded from the JAR",
        "MUnit runs in the package phase alongside JAR assembly, and the tests are bundled into the deployable artifact",
        "MUnit runs in the deploy phase against the target environment, so 'package' alone never executes them",
        "MUnit runs in the compile phase so failures stop compilation, and test sources are compiled into the JAR"
      ],
      answer: 0,
      optionNotes: [
        "Correct — MUnit binds to the test phase (which package depends on), coverage can fail the build there, and tests aren't packaged into the deployable JAR.",
        "Tests run before packaging, not during it, and are excluded from the artifact.",
        "test runs as part of package; it doesn't wait for a deploy phase.",
        "compile precedes test; MUnit isn't a compile-phase concern and test sources aren't shipped."
      ],
      explanation: "Maven's lifecycle runs test before package; MUnit (and its failBuild coverage gate) execute in test, and the deployable JAR excludes tests — which is why 'mvn clean package' both tests and builds."
    },
    "m2-021": {
      level: "medium",
      q: "Refer to the exhibit. What does this dependency bring into the project, and how does it differ from a plain jar dependency?",
      exhibit: "<dependency>\n  <groupId>com.acme</groupId>\n  <artifactId>common-error-handling</artifactId>\n  <version>1.2.0</version>\n  <classifier>mule-plugin</classifier>\n</dependency>",
      options: [
        "A Mule extension/plugin whose flows and configs become usable in the app — a plain jar would only add Java classes",
        "A test-only helper library, because the mule-plugin classifier scopes the dependency to the test phase",
        "A container image layer that the mule-maven-plugin unpacks into the deployable artifact at build time",
        "An Exchange asset reference resolved at deploy time only, with no effect on the local build"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the mule-plugin classifier marks a Mule extension/connector/reusable module, making its Mule components available, not just Java classes.",
        "The classifier isn't a test scope; scope is a separate element.",
        "It isn't a container image; it's a Mule plugin artifact.",
        "It's a normal build dependency, resolved at build time."
      ],
      explanation: "The mule-plugin classifier distinguishes a Mule extension (connector or reusable library of flows/configs) from an ordinary jar — it's how a project consumes reusable Mule assets, e.g. a shared error-handling library published to Exchange."
    },
    "m2-037": {
      level: "medium",
      q: "A team configures an HTTP Listener for HTTPS. They add only a truststore to its TLS context and the listener won't serve TLS. What is minimally required, and why?",
      options: [
        "A keystore with the server's private key and certificate — the server must present an identity; a truststore alone can't do that",
        "Both a keystore and a truststore are always mandatory on a listener, even for plain one-way TLS",
        "Only a truststore, containing the CA that signed the clients' certificates the server will trust",
        "An OAuth client configuration, because HTTPS on a listener is enabled through token enforcement"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a TLS server presents a certificate, so the listener needs a keystore (private key + cert); one-way TLS needs nothing more.",
        "A truststore is only needed for mutual TLS (validating client certs), not for plain HTTPS.",
        "A truststore validates others' certs; it can't provide the server's own identity.",
        "TLS and OAuth are independent; OAuth doesn't enable HTTPS."
      ],
      explanation: "One-way TLS: the server proves its identity with a keystore (private key + certificate). A truststore is only required to validate the other side's certificate, i.e. for mutual TLS on the listener."
    },
    "m2-039": {
      level: "medium",
      q: "A partner requires that your Mule app authenticate to their API with a client certificate, and you must also validate their server. Moving from one-way to two-way TLS on the requester, what changes?",
      options: [
        "You add a keystore (your client identity) alongside the truststore; one-way TLS used only the truststore",
        "You add a truststore for the first time; one-way TLS on a requester needs neither store configured",
        "You switch the protocol from HTTPS to a mutual-TLS-only scheme; certificates are otherwise identical",
        "You move both certificates into a single keystore, because two-way TLS forbids a separate truststore"
      ],
      answer: 0,
      optionNotes: [
        "Correct — mutual TLS adds a keystore holding your client cert to present, on top of the truststore that validates the partner's server.",
        "One-way TLS to an HTTPS server already needs a truststore (unless the CA is default-trusted); the new piece is the keystore.",
        "The protocol is still HTTPS; mutual TLS is about presenting a client cert, not a different scheme.",
        "Keystore and truststore remain distinct roles; they aren't merged."
      ],
      explanation: "One-way TLS validates the server (truststore). Two-way (mutual) TLS additionally makes the client present its own certificate (keystore), which the server validates — the extra keystore is the whole difference."
    },
    "m2-040": {
      level: "medium",
      q: "Refer to the exhibit. db.password is stored encrypted via the Secure Configuration Properties module. Which reference in the DB config resolves it correctly?",
      exhibit: "config.yaml:  db.password: \"![qW8v...==]\"\n<secure-properties:config name=\"Secure\" file=\"config.yaml\" key=\"${secure.key}\"/>",
      options: [
        "${secure::db.password}",
        "${db.password}",
        "#[secure(db.password)]",
        "${encrypted:db.password}"
      ],
      answer: 0,
      optionNotes: [
        "Correct — encrypted values are referenced with the secure:: prefix so the module decrypts them at resolution time.",
        "The plain ${db.password} placeholder won't route through the secure-properties decryptor.",
        "That isn't valid placeholder syntax, and secrets aren't read as a DataWeave function here.",
        "There is no 'encrypted:' prefix; the correct one is 'secure::'."
      ],
      explanation: "The Secure Configuration Properties module resolves encrypted values through the secure:: prefix (${secure::db.password}); the ![...] ciphertext stays in the file while the key is supplied out-of-band at deploy time."
    },
    "m2-051": {
      level: "medium",
      q: "A developer needs category 'com.acme.orders' at DEBUG in dev but WARN in prod, writing to a rolling file, without changing any flow. Where and how is this done?",
      options: [
        "In src/main/resources/log4j2.xml — a per-environment Logger for that category plus the appender it writes to",
        "In mule-artifact.json, by listing the category under a logging section resolved per environment",
        "In each Logger component's XML attributes in the flow, setting a different level per deployment",
        "In Runtime Manager only, since application log configuration cannot live in the project"
      ],
      answer: 0,
      optionNotes: [
        "Correct — application logging is configured in log4j2.xml: define a Logger for the category at the wanted level and reference the file appender.",
        "mule-artifact.json is the app descriptor; it doesn't configure log categories/levels.",
        "Log levels are set in log4j2.xml, not per-Logger-component in the flow.",
        "log4j2.xml lives in the project; Runtime Manager isn't the only option."
      ],
      explanation: "Per-application logging lives in src/main/resources/log4j2.xml: category Loggers with levels and appender references. Swapping the packaged file (or using properties) gives different levels per environment without touching flows."
    },
    "m2-062": {
      level: "medium",
      q: "An MUnit test for getFlightsFlow must (a) not hit the real database and (b) force the flow down its error path to assert the mapping. Which MUnit feature covers BOTH, and how?",
      options: [
        "Mock When on the db:select — return canned rows normally, or use Then throw to raise a typed error for the error-path test",
        "Spy on the db:select — observe the event before and after the real query so the database is never actually called",
        "Verify Call on the db:select — asserting it ran zero times guarantees the database is bypassed during the test",
        "Assert That on the payload — a matcher on the result both mocks the database and drives the error handler"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Mock When replaces the processor: then-return gives canned data, then-throw raises a typed error (e.g. DB:CONNECTIVITY) to test error handling deterministically.",
        "Spy observes a processor that still runs, so the real DB would be called.",
        "Verify Call counts invocations; it neither replaces the operation nor injects an error.",
        "Assert That checks values; it doesn't replace a processor or throw."
      ],
      explanation: "Mock When is the one that replaces a processor: then-return for canned success data, then-throw to raise a specific error type — covering both the no-DB and the error-path requirements. Spy observes, Verify counts, Assert checks."
    },
    "m2-066": {
      level: "medium",
      q: "An MUnit suite seeds reference data once before all its tests and cleans it up once afterwards; separately, each test needs a fresh mock reset. Which scopes apply to each need?",
      options: [
        "Before/After Suite for the one-time seed and cleanup; Before/After Test for the per-test reset",
        "Before/After Test for the one-time seed; Before/After Suite for the per-test reset",
        "Setup/Teardown flows in the main application, invoked from every test in order",
        "On Error Continue around each test, which both seeds data and resets mocks between runs"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Before/After Suite run once per suite (seed/cleanup); Before/After Test run around each individual test (per-test reset).",
        "That reverses the two scopes' granularity.",
        "MUnit uses its own Before/After scopes, not main-app setup flows.",
        "On Error Continue is error handling, not test lifecycle setup."
      ],
      explanation: "MUnit lifecycle scopes: Before/After Suite bracket the whole suite (one-time data setup/teardown), while Before/After Test bracket each test (per-test arrangement) — matching 'once for all' vs 'each test' needs."
    }
  }
};
