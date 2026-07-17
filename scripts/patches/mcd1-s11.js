/* MCD1 · s11 — Debugging and Troubleshooting Mule Applications */
module.exports = {
  sections: {
    s11: {
      topicDocs: {
        "The Studio debugger workflow": "https://docs.mulesoft.com/studio/latest/visual-debugger",
        "Anatomy of a log line": "https://docs.mulesoft.com/mule-runtime/latest/logging-in-mule",
        "Common failure signatures": "https://docs.mulesoft.com/mule-runtime/latest/troubleshooting"
      },
      appendNotes: `
<h3>The Studio debugger workflow</h3>
<ul>
<li>A breakpoint pauses <strong>before</strong> the selected processor runs, so you inspect the <em>incoming</em> event.</li>
<li>The debugger panes show <strong>payload, attributes, and variables</strong>, and include an <strong>expression evaluator</strong> for ad-hoc DataWeave against the paused event.</li>
<li><strong>Step over</strong> runs the current processor and pauses at the next; use it to see a Transform's <em>result</em>.</li>
<li><strong>Conditional breakpoints</strong> pause only when an expression is true (e.g. <code>#[payload.id == 42]</code>) — handy in loops.</li>
</ul>

<h3>Anatomy of a log line</h3>
<pre><code>INFO  2026-01-05 10:22:31,441 [http-listener.01] [event: a1b2-...]
      org.mule.runtime.core...LoggerMessageProcessor: Got flight SFO</code></pre>
<table>
<tr><th>Field</th><th>Meaning</th></tr>
<tr><td><code>INFO</code></td><td>Log level (TRACE/DEBUG/INFO/WARN/ERROR)</td></tr>
<tr><td>timestamp</td><td>When the line was written</td></tr>
<tr><td><code>[http-listener.01]</code></td><td>Thread processing the event</td></tr>
<tr><td><code>[event: …]</code></td><td>Correlation ID — trace one request across log lines</td></tr>
<tr><td>logger / message</td><td>Source category and the text you logged</td></tr>
</table>
<p>Logging is configured in <code>src/main/resources/log4j2.xml</code> (levels per package, appenders, async logging). On CloudHub, logs are viewed in <strong>Runtime Manager</strong> and searchable in <strong>Anypoint Monitoring</strong>; the correlation ID is the key to following a single transaction.</p>

<h3>Common failure signatures</h3>
<table>
<tr><th>Symptom in the log/build</th><th>Likely cause &amp; fix</th></tr>
<tr><td>Could not resolve dependencies … <code>mysql-connector-java</code></td><td>Missing driver in <code>pom.xml</code> → add the dependency</td></tr>
<tr><td><code>Address already in use</code> on startup</td><td>Port taken → change the listener port or free it</td></tr>
<tr><td><code>*:CONNECTIVITY</code> at runtime</td><td>Backend unreachable/credentials → check config, add a reconnection strategy</td></tr>
<tr><td>Logger prints <code>ManagedCursorStreamProvider@…</code></td><td>Payload is a stream → convert (e.g. <code>payload as String</code>) before logging</td></tr>
<tr><td><code>You called 'as' with String but expected Object</code></td><td>Wrong MIME type / DataWeave type mismatch → set the correct input type</td></tr>
</table>
<p class="tip"><strong>Exam tip:</strong> a log line showing a Java class name where you expected data almost always means a <em>stream</em>; the fix is to consume/convert it, mindful that materializing a large stream loads it into memory.</p>`
    }
  },
  questions: {
    "m1-065": {
      options: [
        "Only the current payload value at that point in the flow",
        "The full incoming event — payload, attributes, and variables — plus a DataWeave evaluator",
        "Only the variables that were set earlier in the current flow",
        "The compiled Java bytecode of the running Mule application"
      ],
      answer: 1,
      explanation: "The Mule debugger shows the entire event as it arrives at the breakpointed processor (payload, attributes, variables) and includes an expression evaluator for ad-hoc DataWeave against that event.",
      optionNotes: [
        "Wrong — it shows far more than just the payload.",
        "Correct — the whole event is inspectable, plus a DataWeave expression evaluator.",
        "Wrong — attributes and payload are visible too, not only variables.",
        "Wrong — the debugger works at the Mule event level, not bytecode."
      ]
    },
    "m1-066": {
      options: [
        "Reinstall Anypoint Studio to refresh its bundled plugins",
        "Add or correct the JDBC driver dependency in the project's pom.xml so Maven can resolve it",
        "Copy the driver JAR manually into the src/main/mule folder",
        "Disable the Maven nature of the project in Studio preferences"
      ],
      answer: 1,
      explanation: "Mule apps are Maven projects; external libraries like database drivers must be declared as dependencies in pom.xml so Maven can download them (Studio can add them via the connector's config UI).",
      optionNotes: [
        "Wrong — reinstalling Studio doesn't add a missing library.",
        "Correct — declare the driver in pom.xml so Maven resolves it.",
        "Wrong — dropping a JAR into src/main/mule isn't how Mule resolves dependencies.",
        "Wrong — disabling Maven breaks dependency resolution entirely."
      ]
    },
    "m1-069": {
      options: [
        "The payload is null, so Mule prints a placeholder object",
        "The payload is a repeatable stream; the log shows the cursor object until it's consumed/converted",
        "The Logger's level is set to DEBUG instead of INFO",
        "The payload was encrypted by a security policy before logging"
      ],
      answer: 1,
      explanation: "Many connectors return streaming payloads. Logging the raw stream prints the cursor-provider object; convert it first (e.g. #[payload as String], or a Transform to application/json) to log the actual content — mindful of memory for large streams.",
      optionNotes: [
        "Wrong — a null payload logs as null, not a stream-provider class name.",
        "Correct — a streaming payload logs as its cursor object until consumed/converted.",
        "Wrong — log level changes verbosity, not how a stream renders.",
        "Wrong — encryption isn't why a class name appears; streaming is."
      ]
    },
    "m1-099": {
      options: [
        "The event as it looks AFTER the transform has finished executing",
        "The event as it ARRIVES at the transform (before it runs), with payload, attributes, and vars inspectable",
        "Only the payload value, without attributes or variables",
        "The compiled Java bytecode generated from the DataWeave script"
      ],
      answer: 1,
      explanation: "Breakpoints pause BEFORE the selected processor runs, so you inspect the incoming event and can evaluate DataWeave against it. Use Step Over to run the transform and see its result.",
      optionNotes: [
        "Wrong — the pause is before execution; step over to see the after state.",
        "Correct — the incoming event is shown, fully inspectable, before the transform runs.",
        "Wrong — attributes and variables are shown too.",
        "Wrong — the debugger shows the event, not generated bytecode."
      ]
    }
  },
  addQuestions: [
    {
      id: "m1-229",
      section: "s11",
      level: "medium",
      q: "A developer sees these two log lines for one request. What is the most likely problem, and where should they look first?",
      exhibit:
        "INFO  2026-01-05 10:22:31,441 [http-listener.01] [event: a1b2c3]\n" +
        "      ...LoggerMessageProcessor: Incoming order for customer 8842\n" +
        "ERROR 2026-01-05 10:22:31,455 [http-listener.01] [event: a1b2c3]\n" +
        "      ...DefaultMessagingExceptionStrategy:\n" +
        "      HTTP:NOT_FOUND, GET http://crm/customers/8842 returned 404",
      options: [
        "The application failed to start; check the port configuration in the HTTP Listener",
        "The CRM lookup for customer 8842 returned 404; check the request path and whether the record exists",
        "The two lines are unrelated because they came from different requests",
        "A DataWeave type mismatch occurred; check the Transform's output MIME type"
      ],
      answer: 1,
      explanation: "Both lines share the same correlation id (event: a1b2c3), so they trace one request: an HTTP Request to the CRM for customer 8842 returned 404, raising HTTP:NOT_FOUND. Look at the request path/existence of the record — and consider mapping HTTP:NOT_FOUND to a business error.",
      optionNotes: [
        "Wrong — the app is clearly running; it logged and then failed on a downstream call.",
        "Correct — same correlation id, and the error is a 404 from the CRM customer lookup.",
        "Wrong — the identical [event: a1b2c3] id proves they're the same request.",
        "Wrong — the error type is HTTP:NOT_FOUND, not a DataWeave/type error."
      ]
    }
  ]
};
