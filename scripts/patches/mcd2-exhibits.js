/* MCD2 · new visual/exhibit questions (flows, transactions, TLS, secure config,
 * log4j, MUnit). All de-biased with parallel option lengths + optionNotes. */
module.exports = {
  addQuestions: [
    {
      id: "m2-123",
      section: "d1",
      level: "hard",
      q: "A transactional Try scope wraps a JMS consume and a DB insert. The DB insert fails. Given the error handler shown, what happens to the JMS message and the DB write?",
      exhibit:
        "<try transactionalAction=\"ALWAYS_BEGIN\">\n" +
        "  <jms:consume config-ref=\"JMS\" destination=\"orders\"/>\n" +
        "  <db:insert config-ref=\"DB\"> ... </db:insert>   <!-- fails -->\n" +
        "  <error-handler>\n" +
        "    <on-error-continue type=\"DB:CONNECTIVITY\">\n" +
        "      <logger message=\"swallowed\"/>\n" +
        "    </on-error-continue>\n" +
        "  </error-handler>\n" +
        "</try>",
      options: [
        "Both roll back: the message returns to the queue and the DB write is undone",
        "The transaction commits: the message is acked and the failed DB write is simply lost",
        "Only the DB write rolls back; the JMS message is redelivered anyway",
        "The runtime throws because JMS cannot join a Try-scope transaction"
      ],
      answer: 1,
      explanation: "On Error Continue marks the processing successful, so the transaction commits — the JMS message is acknowledged even though the DB insert failed and produced nothing. Use On Error Propagate to roll back and let the message redeliver.",
      optionNotes: [
        "Wrong — rollback needs On Error Propagate; Continue commits.",
        "Correct — Continue commits, acking the message and losing the DB write.",
        "Wrong — a single transaction commits or rolls back as a unit; you can't split it here.",
        "Wrong — JMS is transactional and joins the Try-scope transaction fine."
      ]
    },
    {
      id: "m2-124",
      section: "d1",
      level: "medium",
      q: "An HTTP-triggered flow is built as shown for reliable acquisition. If the app crashes right after the HTTP 202 is returned but before processing finishes, what is the outcome?",
      exhibit:
        "<flow name=\"receive\">\n" +
        "  <http:listener path=\"/orders\"/>\n" +
        "  <vm:publish config-ref=\"VM\" queueName=\"orders\" queueType=\"PERSISTENT\"/>\n" +
        "  <set-payload value='#[{accepted: true}]' />   <!-- 202 to caller -->\n" +
        "</flow>\n" +
        "<flow name=\"process\">\n" +
        "  <vm:listener config-ref=\"VM\" queueName=\"orders\" transactionalAction=\"ALWAYS_BEGIN\"/>\n" +
        "  ... processing ...\n" +
        "</flow>",
      options: [
        "The accepted order is lost because the response was already sent",
        "The order survives in the persistent queue and is processed after restart",
        "The caller receives an HTTP 500 because processing never completed",
        "The order is processed twice, once per flow, on restart"
      ],
      answer: 1,
      explanation: "Reliable acquisition persists the message (persistent VM queue) before acknowledging, then processes it in a separate transactional flow. A crash after the ack doesn't lose the order — it stays queued and is processed once the app restarts.",
      optionNotes: [
        "Wrong — persisting before ack is exactly what prevents the loss.",
        "Correct — the persistent queue holds the order until it's processed after restart.",
        "Wrong — the caller already got its 202; the crash doesn't change that response.",
        "Wrong — the transactional consumer processes each message once, not twice."
      ]
    },
    {
      id: "m2-125",
      section: "d3",
      level: "medium",
      q: "The secure configuration shown is used, and the app is started with -M-Dmule.key=s3cret. How must db.password be referenced elsewhere in the config?",
      exhibit:
        "<secure-properties:config name=\"Secure\"\n" +
        "    file=\"config/secure-${env}.yaml\" key=\"${mule.key}\">\n" +
        "  <secure-properties:encrypt algorithm=\"AES\" mode=\"CBC\"/>\n" +
        "</secure-properties:config>\n" +
        "\n" +
        "# config/secure-dev.yaml\n" +
        "db:\n" +
        "  password: \"![k1lFactpJ+4wJb2rcvUkMg==]\"",
      options: [
        "As ${db.password}, the same as any ordinary property",
        "As ${secure::db.password}, using the mandatory secure:: prefix",
        "As #[secure(db.password)] inside a DataWeave expression",
        "As ${encrypted:db.password} to trigger decryption"
      ],
      answer: 1,
      explanation: "Every property in a secure-properties file is referenced with the mandatory secure:: prefix — ${secure::db.password} — even properties that aren't encrypted. The value is decrypted at runtime using the key supplied by ${mule.key}.",
      optionNotes: [
        "Wrong — a plain ${db.password} won't resolve for a secure-file property.",
        "Correct — the secure:: prefix is mandatory for secure-file properties.",
        "Wrong — there's no secure() DataWeave function for this; it's a property placeholder.",
        "Wrong — the prefix is secure::, not encrypted:."
      ]
    },
    {
      id: "m2-126",
      section: "d4",
      level: "medium",
      q: "Given this log4j2.xml, where will the Logger output for category com.acme.orders at level DEBUG go, and will it appear?",
      exhibit:
        "<Loggers>\n" +
        "  <AsyncLogger name=\"com.acme.orders\" level=\"INFO\"/>\n" +
        "  <AsyncRoot level=\"WARN\">\n" +
        "    <AppenderRef ref=\"file\"/>\n" +
        "  </AsyncRoot>\n" +
        "</Loggers>",
      options: [
        "It appears in the file, because the root appender captures everything",
        "It is suppressed, because the com.acme.orders category is set to INFO",
        "It appears only if Anypoint Monitoring is enabled for the app",
        "It causes a startup error because DEBUG is not a valid level"
      ],
      answer: 1,
      explanation: "A DEBUG message is below the category's configured INFO level, so it is filtered out before any appender is consulted. Raise com.acme.orders to DEBUG (typically only in dev) to see it.",
      optionNotes: [
        "Wrong — level filtering happens before the appender; the entry never reaches the file.",
        "Correct — INFO on that category suppresses DEBUG/TRACE.",
        "Wrong — logging levels are independent of Anypoint Monitoring.",
        "Wrong — DEBUG is a valid Log4j level; nothing errors."
      ]
    },
    {
      id: "m2-127",
      section: "d5",
      level: "hard",
      q: "An MUnit test contains the components shown. What does the test actually verify?",
      exhibit:
        "<munit:test name=\"placeOrder-test\">\n" +
        "  <munit:execution>\n" +
        "    <flow-ref name=\"placeOrder\"/>\n" +
        "  </munit:execution>\n" +
        "  <munit:validation>\n" +
        "    <munit-tools:verify-call processor=\"flow-ref\" times=\"2\">\n" +
        "      <munit-tools:with-attributes>\n" +
        "        <munit-tools:with-attribute attributeName=\"name\" whereValue=\"notify\"/>\n" +
        "      </munit-tools:with-attributes>\n" +
        "    </munit-tools:verify-call>\n" +
        "  </munit:validation>\n" +
        "</munit:test>",
      options: [
        "That the placeOrder flow returns a payload equal to 2",
        "That the 'notify' flow-ref was invoked exactly twice during the run",
        "That the 'notify' flow is mocked to run only twice",
        "That the test retries the placeOrder flow twice on failure"
      ],
      answer: 1,
      explanation: "Verify Call asserts an invocation count for a processor matched by attributes — here the flow-ref named 'notify' must have been called exactly twice. It doesn't replace behaviour (that's Mock When) or check payload values (that's Assert That).",
      optionNotes: [
        "Wrong — payload equality is Assert That, not Verify Call.",
        "Correct — Verify Call with times=2 asserts the 'notify' call count.",
        "Wrong — Verify Call asserts counts; it doesn't mock or limit execution.",
        "Wrong — MUnit doesn't retry the flow; Verify Call only counts invocations."
      ]
    }
  ]
};
