/* MCD2 · length-balance the new/upgraded questions so the bank's longest-correct
 * guard returns to ~30-40% (the difficulty pass pushed it to 52%). Extend the
 * top distractor past the correct answer; trim a few very-long correct options.
 * Ratio was already fine (1.15x). Answers/meaning unchanged. */
module.exports = {
  questions: {
    // --- extend the top distractor past the correct answer ---
    "m2-137": { optionEdits: { 1: "Add a tls:context with a key-store holding your client certificate, since a PKIX error means the server is demanding mutual TLS" } },
    "m2-147": { optionEdits: { 3: "Promote a fresh JAR per environment while keeping the same properties, since configuration must be identical across all environments" } },
    "m2-010": { optionEdits: { 3: "The whole flow is rejected at deploy time, because an HTTP source cannot contain any database operations at all" } },
    "m2-017": { optionEdits: { 1: "indent=false on the output directive, so the resulting smaller payload fits into worker memory much more easily" } },
    "m2-039": { optionEdits: { 2: "You switch the protocol from HTTPS to a dedicated mutual-TLS-only scheme; the certificates involved are otherwise identical" } },
    "m2-066": { optionEdits: { 3: "On Error Continue around each individual test, which both seeds the data and resets the mocks between every run" } },
    "m2-142": { optionEdits: { 1: "Nothing further is needed — async logging is strictly better, so all loggers including the audit logger should be made asynchronous" } },
    "m2-062": { optionEdits: { 1: "Spy on the db:select — observe the event before and after the real query runs, so the database is never actually called at all" } },
    "m2-141": { optionEdits: { 3: "1=Runtime Manager alert, 2=Anypoint Visualizer, 3=API Manager alert on the response status codes" } },
    "m2-130": { optionEdits: { 3: "The proposal fails only because CloudHub disables VM queues entirely; switch to Object Store v2 as the messaging channel instead" } },
    "m2-133": { optionEdits: { 3: "The driver must be copied into the Mule runtime's lib folder on CloudHub, because JDBC drivers cannot be packaged inside the app artifact" } },
    "m2-134": { optionEdits: { 1: "The application is deployed to CloudHub 2.0 and also published to the repository, because both configuration sections are present" } },
    "m2-020": { optionEdits: { 1: "MUnit runs in the package phase alongside JAR assembly, and the compiled tests are bundled into the deployable JAR artifact" } },
    "m2-021": { optionEdits: { 1: "A test-only helper library, because the mule-plugin classifier scopes the dependency only to the Maven test phase" } },
    "m2-003": { optionEdits: { 1: "A success response — Until Successful eventually gives up quietly and lets the flow continue on to the Logger downstream" } },
    "m2-051": { optionEdits: { 1: "In mule-artifact.json, by listing the logger category under a logging section that is resolved separately per environment" } },
    "m2-136": { optionEdits: { 1: "Removing the 'status' query parameter and deleting an existing field from the Order response type entirely" } },
    "m2-129": { optionEdits: { 2: "It runs in parallel anyway — maxConcurrency limits threads, not concurrent flow executions, so all ten of them proceed at once" } },
    "m2-135": { optionEdits: { 3: "Delete the field immediately from the live version and email the consumers, since deprecation windows apply only to whole retired APIs" } },
    "m2-140": { optionEdits: { 1: "A key-store only, because the server already proves its own identity and the clients don't need to present any certificates" } },
    "m2-131": { optionEdits: { 1: "Cache scope cannot be used for HTTP responses at all; only an API Manager HTTP Caching policy can reduce the backend load here" } },
    "m2-138": { optionEdits: { 1: "Rely on the SFTP transport's TLS, since an encrypted transfer channel also guarantees the file is fully encrypted at rest afterwards" } },
    "m2-145": { optionEdits: { 1: "Point the HTTP Request at a real URL known to return 500 and assert the mapped response, which keeps the whole test more realistic" } },
    "m2-037": { optionEdits: { 2: "Only a truststore, containing the CA that signed the client certificates that the listener is willing to trust during the handshake" } },
    // --- trim very-long correct options into the distractor band ---
    "m2-128": { optionEdits: { 0: "It COMMITS and the message is acked — On Error Continue treats the flow as successful, so the failed DB write is silently lost" } },
    "m2-132": { optionEdits: { 0: "A Batch Job — persistent record queues survive restarts and isolate per-record failures, which Parallel For Each can't do" } },
    "m2-139": { optionEdits: { 0: "The decryption key (secure.key) wasn't supplied at deploy time, so secure:: values can't be resolved at startup" } },
    "m2-143": { optionEdits: { 0: "Custom Business Events attaching order id/value to the transaction; CPU/infra metrics can't measure order volume", 1: "Runtime Manager CPU and memory alerts, which can be relabeled to represent order throughput on the operations dashboard" } },
    "m2-144": { optionEdits: { 0: "The flow's real source (its HTTP Listener) starts, so the test drives the flow through a real HTTP call rather than a flow-ref" } },
    "m2-146": { optionEdits: { 0: "The api.id doesn't match this environment's instance, or the platform credentials are missing/wrong — so pairing failed" } }
  }
};
