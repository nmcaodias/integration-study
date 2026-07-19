/* MCD2 · hands-on exercises (part 1: d1 performance/reliability, d2 Maven).
 * Done OUTSIDE the site — Anypoint Studio / DataWeave Playground; the app shows
 * the use case, given assets, and a revealable model solution. */
module.exports = {
  addExercises: [
    {
      id: "m2-ex-01",
      section: "d1",
      title: "Reliable acquisition: never lose an accepted order",
      level: "hard",
      where: "Anypoint Studio",
      task: "<p>An HTTP-triggered flow accepts orders but must <strong>never lose one</strong>, even if the downstream ERP call fails or the app restarts mid-processing. Build the <em>reliable acquisition</em> pattern: accept + persist first, process asynchronously afterwards.</p><ul><li>An <strong>acquisition flow</strong> that receives the order, writes it to a <strong>persistent VM queue</strong>, and immediately returns <code>202 Accepted</code>.</li><li>A separate <strong>processing flow</strong> whose VM Listener consumes the queue with <code>transactionalAction=\"ALWAYS_BEGIN\"</code> and calls a (failable) ERP subflow.</li></ul><p>Then prove it: make the ERP call fail and confirm the message returns to the queue instead of being lost.</p>",
      given: [
        { label: "Acquisition flow (sketch)", code: "<flow name=\"accept-order\">\n  <http:listener path=\"/orders\"/>\n  <!-- publish to VM, then respond 202 -->\n  <http:response statusCode=\"202\"/>\n</flow>" },
        { label: "Failable ERP subflow", code: "<sub-flow name=\"callErp\">\n  <raise-error type=\"APP:ERP_DOWN\"/>   <!-- toggle to simulate an outage -->\n</sub-flow>" }
      ],
      steps: [
        "Create a VM config with a PERSISTENT queue named 'orders'",
        "Acquisition flow: vm:publish to 'orders', then set the HTTP response to 202",
        "Processing flow: vm:listener on 'orders' with transactionalAction=ALWAYS_BEGIN, then flow-ref callErp",
        "Run with the ERP subflow raising an error; watch the message roll back and redeliver",
        "Remove the raise-error and confirm the order is processed exactly once"
      ],
      solution: [
        { label: "app.xml (essential parts)", code: "<vm:config name=\"VM\">\n  <vm:queues>\n    <vm:queue queueName=\"orders\" queueType=\"PERSISTENT\"/>\n  </vm:queues>\n</vm:config>\n\n<flow name=\"accept-order\">\n  <http:listener config-ref=\"HTTP\" path=\"/orders\"/>\n  <vm:publish config-ref=\"VM\" queueName=\"orders\"/>\n  <set-payload value='#[{accepted: true}]'/>\n  <http:response statusCode=\"202\"/>\n</flow>\n\n<flow name=\"process-order\">\n  <vm:listener config-ref=\"VM\" queueName=\"orders\"\n               transactionalAction=\"ALWAYS_BEGIN\"/>\n  <flow-ref name=\"callErp\"/>\n  <logger message=\"#['delivered ' ++ (payload.id default '?')]\"/>\n</flow>" }
      ],
      solutionNotes: "<p>The pattern splits a non-transactional source (HTTP) from transactional processing. Because the VM queue is <strong>persistent</strong> and the listener <strong>begins a transaction</strong>, a failure anywhere in <code>process-order</code> rolls the message back onto the queue for redelivery — the caller already got its 202, so nothing is lost. Contrast with calling the ERP directly inside <code>accept-order</code>: an outage there would fail the client's request and drop the order.</p>"
    },
    {
      id: "m2-ex-02",
      section: "d1",
      title: "Bound a fragile backend with Until Successful + idempotency",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>A flow calls a flaky payment API that occasionally returns transient errors. Requirement: retry it a few times before giving up, but the payment operation is <strong>not idempotent</strong>, so a naive retry could double-charge. Build a retrying call that is safe.</p>",
      given: [
        { label: "Given", code: "- Payment API: POST /charge  (sometimes 503, succeeds on retry)\n- Each request carries a unique orderId in the payload\n- A double charge for the same orderId is unacceptable" }
      ],
      steps: [
        "Wrap the HTTP Request in an Until Successful scope (maxRetries=3, millisBetweenRetries=2000)",
        "Make the call idempotent from the API's side by sending an idempotency key header derived from orderId",
        "Decide what to do when retries are exhausted (MULE:RETRY_EXHAUSTED) — route to a DLQ or alert",
        "Confirm: on a transient 503 it retries; on repeated success for the same key the backend charges once"
      ],
      solution: [
        { label: "Flow fragment", code: "<until-successful maxRetries=\"3\" millisBetweenRetries=\"2000\">\n  <http:request method=\"POST\" path=\"/charge\" config-ref=\"Payment\">\n    <http:headers>#[{ 'Idempotency-Key': payload.orderId }]</http:headers>\n  </http:request>\n</until-successful>\n<error-handler>\n  <on-error-propagate type=\"MULE:RETRY_EXHAUSTED\">\n    <vm:publish queueName=\"payment-dlq\" config-ref=\"VM\"/>\n  </on-error-propagate>\n</error-handler>" }
      ],
      solutionNotes: "<p>Until Successful runs 1 initial attempt + <code>maxRetries</code>, so <code>maxRetries=3</code> means up to 4 calls; exhaustion raises <code>MULE:RETRY_EXHAUSTED</code>. Retrying a non-idempotent operation is only safe if the <em>receiver</em> can dedupe — hence the idempotency key. Retries alone don't make an operation safe; the key is what prevents the double charge.</p>"
    },
    {
      id: "m2-ex-03",
      section: "d1",
      title: "Choose and configure a streaming strategy for a 2 GB file",
      level: "medium",
      where: "Anypoint Studio",
      task: "<p>A flow reads a 2 GB CSV from SFTP, and <strong>two</strong> downstream components each need to read the full stream. Configure streaming so the app doesn't run out of memory <em>and</em> both consumers can read it. Then change the requirement to a single read-once passthrough and adjust.</p>",
      given: [
        { label: "Given", code: "- Source: <sftp:read path=\"huge.csv\"/>\n- Consumer 1: a DataWeave transform\n- Consumer 2: a Logger of a summary\n- Worker memory is limited (well under 2 GB)" }
      ],
      steps: [
        "Because two components read it, the stream must be REPEATABLE — pick repeatable file-stored streaming",
        "Set a small inMemorySize so most of the 2 GB spills to disk instead of RAM",
        "Then, for the alternative single-read case, switch to a non-repeatable stream and explain the trade-off"
      ],
      solution: [
        { label: "Repeatable, two readers", code: "<sftp:read path=\"huge.csv\" config-ref=\"SFTP\">\n  <repeatable-file-store-stream inMemorySize=\"1\" bufferUnit=\"MB\"/>\n</sftp:read>\n<!-- both the Transform and the Logger can now read the payload -->" },
        { label: "Non-repeatable, single reader", code: "<sftp:read path=\"huge.csv\" config-ref=\"SFTP\">\n  <non-repeatable-stream/>\n</sftp:read>\n<!-- fastest, lowest memory; the payload can be read ONCE -->" }
      ],
      solutionNotes: "<p>Two questions pick the strategy: <em>how big?</em> and <em>read how many times?</em> Multiple reads → repeatable (buffered so it can replay); huge payload → file-store variant with a small in-memory threshold so it overflows to disk. Read-once passthrough → non-repeatable (zero buffering, lowest memory) — but a second read then fails. Logging <code>#[payload]</code> mid-flow secretly consumes a non-repeatable stream: a classic exam trap.</p>"
    },
    {
      id: "m2-ex-04",
      section: "d1",
      title: "Atomic write to two systems with an XA transaction",
      level: "hard",
      where: "Anypoint Studio",
      task: "<p>A flow must consume a JMS message and insert derived rows into a database so that <strong>both commit or both roll back</strong> — a failure after the DB insert must return the message to the queue. Configure it correctly, then prove the rollback.</p>",
      given: [
        { label: "Given", code: "- Source: JMS listener on queue 'events'\n- Then: <db:insert> into an audit table\n- Then: a step that can fail (raise APP:BOOM to test)\n- Requirement: JMS redelivery AND DB rollback together" }
      ],
      steps: [
        "Configure BOTH the JMS and Database connectors for XA transactions",
        "Set the JMS listener's transactionalAction to ALWAYS_BEGIN (it starts the XA transaction)",
        "Put the db:insert and the failing step inside that transactional scope",
        "Raise APP:BOOM after the insert; confirm the row is NOT committed and the JMS message is redelivered"
      ],
      solution: [
        { label: "Flow (essential parts)", code: "<jms:listener config-ref=\"JMS_XA\" destination=\"events\"\n              transactionalAction=\"ALWAYS_BEGIN\"\n              transactionType=\"XA\"/>\n<db:insert config-ref=\"DB_XA\">\n  <db:sql>INSERT INTO audit(payload) VALUES(:p)</db:sql>\n  <db:input-parameters>#[{ p: write(payload,'application/json') }]</db:input-parameters>\n</db:insert>\n<raise-error type=\"APP:BOOM\"/>   <!-- both JMS + DB roll back -->" }
      ],
      solutionNotes: "<p>An XA (two-phase commit) transaction spans multiple resources as one atomic unit — only <strong>transactional</strong> connectors (JMS, VM, Database) can enrol; HTTP/File/SFTP cannot. The source with <code>ALWAYS_BEGIN</code> owns the transaction; an error reaching an <strong>On Error Propagate</strong> at that level rolls everything back, so the DB insert is undone and the JMS message redelivered. Watch the trap: an <strong>On Error Continue</strong> would <em>commit</em> the partial work instead.</p>"
    },
    {
      id: "m2-ex-05",
      section: "d2",
      title: "Standardize builds with a Mule parent POM",
      level: "medium",
      where: "Any editor / Maven",
      task: "<p>Three Mule projects duplicate the same plugin versions, repository definitions, and common properties. Create a <strong>parent POM</strong> they can all inherit from so those are declared once, and show how a child references it.</p>",
      given: [
        { label: "Duplicated across every child pom.xml", code: "<properties>\n  <app.runtime>4.4.0</app.runtime>\n  <mule.maven.plugin.version>4.1.1</mule.maven.plugin.version>\n</properties>\n<!-- + the same <pluginRepositories> and <distributionManagement> block -->" }
      ],
      steps: [
        "Create a new Maven module with <packaging>pom</packaging> holding the shared properties, pluginManagement, and repositories",
        "Deploy/install the parent so children can resolve it",
        "In each child pom.xml, add a <parent> element pointing at it and delete the now-inherited blocks",
        "Confirm a child still builds with mvn clean package, inheriting everything"
      ],
      solution: [
        { label: "parent/pom.xml", code: "<project>\n  <groupId>com.acme</groupId>\n  <artifactId>mule-parent</artifactId>\n  <version>1.0.0</version>\n  <packaging>pom</packaging>\n  <properties>\n    <app.runtime>4.4.0</app.runtime>\n    <mule.maven.plugin.version>4.1.1</mule.maven.plugin.version>\n  </properties>\n  <build><pluginManagement>...</pluginManagement></build>\n  <pluginRepositories>...</pluginRepositories>\n  <distributionManagement>...</distributionManagement>\n</project>" },
        { label: "child/pom.xml", code: "<parent>\n  <groupId>com.acme</groupId>\n  <artifactId>mule-parent</artifactId>\n  <version>1.0.0</version>\n</parent>\n<artifactId>orders-api</artifactId>\n<!-- properties, pluginManagement, repos all inherited -->" }
      ],
      solutionNotes: "<p>A <code>pom</code>-packaged parent is the standard Maven mechanism for organization-wide consistency: declare plugin versions, repositories, and properties once and inherit them everywhere. Children override only what differs. This is exam-relevant for 'maintainable and modular' — the alternative (copy-paste) is exactly the drift the objective warns against.</p>"
    },
    {
      id: "m2-ex-06",
      section: "d2",
      title: "Publish and consume a reusable module via Exchange",
      level: "hard",
      where: "Anypoint Studio / Maven",
      task: "<p>Twelve apps re-implement the same error-response formatting and logging. Package it <strong>once</strong> as a reusable Mule plugin/library, publish it to <strong>Exchange</strong>, and consume it from another app as a dependency — no copy-paste.</p>",
      given: [
        { label: "The shared logic (today copy-pasted)", code: "<sub-flow name=\"format-error\">\n  <ee:transform>...standard error envelope...</ee:transform>\n  <logger level=\"ERROR\" message=\"#[payload]\"/>\n</sub-flow>" }
      ],
      steps: [
        "Create a Mule project containing the shared flows; give it a groupId/artifactId and a proper version",
        "Configure Exchange as the distribution repository and run mvn deploy to publish it as a reusable asset",
        "In a consumer app, add it as a dependency (from Exchange) in pom.xml",
        "Reference the imported sub-flow from the consumer's flows and build"
      ],
      solution: [
        { label: "Library pom.xml (publish)", code: "<distributionManagement>\n  <repository>\n    <id>exchange</id>\n    <url>https://maven.anypoint.mulesoft.com/api/v3/organizations/${orgId}/maven</url>\n  </repository>\n</distributionManagement>\n<!-- then: mvn deploy  (authenticated via a connected app / settings.xml) -->" },
        { label: "Consumer pom.xml (reuse)", code: "<dependency>\n  <groupId>${orgId}</groupId>\n  <artifactId>common-error-handling</artifactId>\n  <version>1.0.0</version>\n  <classifier>mule-plugin</classifier>\n</dependency>" }
      ],
      solutionNotes: "<p>Publishing shared code as a <strong>versioned Exchange asset</strong> gives controlled reuse, discoverability, and upgrade management across teams — the opposite of copy-paste drift. The <code>mule-plugin</code> classifier makes the artifact's flows/configs importable; consumers pin a version and upgrade deliberately. This is the 'modular applications' story the exam expects, and it's why one giant app-of-everything is the wrong answer.</p>"
    }
  ]
};
