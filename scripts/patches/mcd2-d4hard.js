/* MCD2 · d4 (monitoring/logging) hard coverage was thin (4 of 22). Add three
 * distinct hard exhibit/scenario questions that don't shadow existing d4:
 *  m2-148  structured JSON layout for log aggregation (vs 126 routing / 116 async)
 *  m2-149  correlation-ID propagation FAILURE diagnosis (vs 053/090/117 "how to trace")
 *  m2-150  Anypoint Monitoring/APM vs Functional Monitoring/BAT for a 200-but-wrong
 *          correctness regression (vs 059 "what does it provide")
 * Top distractor kept >= correct length to hold the bank's length balance. */
module.exports = {
  addQuestions: [
    {
      id: "m2-148",
      section: "d4",
      level: "hard",
      q: "Refer to the exhibit. Operations ingests every app's logs into a central ELK stack and needs to filter and aggregate on the order id and correlation id as fields. What does this log4j2 change accomplish?",
      exhibit: "<Console name=\"CONSOLE\" target=\"SYSTEM_OUT\">\n  <JsonLayout compact=\"true\" eventEol=\"true\" properties=\"true\"/>\n</Console>\n<!-- previously: <PatternLayout pattern=\"%d %p %c{1} %m%n\"/> -->\n<!-- Logger writes: LOGGER.info(\"order received\", orderId, correlationId) via ThreadContext -->",
      options: [
        "Each log event is emitted as one structured JSON object with the ThreadContext values as named fields, so the aggregator can index and query them directly instead of regex-parsing a flat line",
        "It compresses the log output so the central store uses less disk, but the aggregator still has to grok-parse each flat message line to pull the order id out of the text",
        "It switches logging to asynchronous mode, which is what lets the ELK stack receive fields, since only async appenders can attach ThreadContext to an event",
        "It routes the order-id logs to a dedicated file appender that the aggregator tails, keeping them out of the main console stream"
      ],
      answer: 0,
      optionNotes: [
        "Correct — JsonLayout with properties=\"true\" serialises each event (message, level, and ThreadContext/MDC values) as a structured JSON object, so an aggregator indexes them as first-class fields without regex parsing.",
        "JsonLayout is about structure, not compression; the whole point is to AVOID grok/regex parsing of a flat line.",
        "Layout and appender async-ness are independent; JsonLayout does not make logging async, and sync appenders carry ThreadContext fine.",
        "A layout changes the record's format, not its routing — routing is an appender/logger concern."
      ],
      explanation: "Centralized log tooling queries on fields, not free text. A JsonLayout with properties=\"true\" emits each event as structured JSON including ThreadContext (MDC) entries like orderId/correlationId, so ELK indexes them as fields — far more reliable than grok-parsing a PatternLayout line. It is orthogonal to sync/async and to appender routing."
    },
    {
      id: "m2-149",
      section: "d4",
      level: "hard",
      q: "A correlation id set on the inbound HTTP Listener appears in App A's logs, but the trace breaks: App B (called by App A) logs a different correlation id. Both apps aggregate to Anypoint Monitoring. What is the most likely cause?",
      exhibit: "App A flow:\n  <http:listener .../>                <!-- Mule sets correlationId here -->\n  <logger message=\"#[correlationId]\"/>  <!-- shows e.g. 4f0c... -->\n  <http:request path=\"/b\" .../>        <!-- calls App B -->\n\nApp B flow:\n  <http:listener .../>                <!-- new listener -->\n  <logger message=\"#[correlationId]\"/>  <!-- shows a DIFFERENT id -->",
      options: [
        "App A's HTTP Request isn't forwarding App A's correlation id to App B (e.g. no X-Correlation-ID header), so App B's listener mints a brand-new id instead of continuing the existing trace",
        "Anypoint Monitoring assigns each application its own independent correlation id namespace, so two apps can never share the same correlation id value across an HTTP call by design",
        "The correlation id resets because App B runs on a different CloudHub worker; correlation ids are worker-scoped and cannot survive a network hop between workers",
        "App B is logging the messageId rather than the correlationId, so the value only looks different but the underlying trace is actually still linked"
      ],
      answer: 0,
      optionNotes: [
        "Correct — a correlation id only propagates if it's carried on the wire. If App A's HTTP Request doesn't send X-Correlation-ID, App B's listener has nothing to adopt and generates a fresh id, snapping the trace.",
        "Monitoring doesn't namespace correlation ids per app; a propagated id is shared across the hop — that's the whole point.",
        "Correlation ids are per-event, not per-worker; a network hop doesn't reset them when the header is propagated.",
        "The exhibit shows #[correlationId] in both apps, not messageId; the ids genuinely differ because none was propagated."
      ],
      explanation: "End-to-end tracing depends on the correlation id travelling on the request. Mule's HTTP Request will forward it via X-Correlation-ID when configured to, and a receiving listener adopts an incoming X-Correlation-ID as the event's correlation id. If it isn't propagated, the downstream listener mints a new one and the trace splits — exactly the symptom shown."
    },
    {
      id: "m2-150",
      section: "d4",
      level: "hard",
      q: "A deploy introduces a logic bug: the Orders API still returns HTTP 200 quickly, but the totals in the body are wrong. Infra metrics (CPU, memory, response time, error rate) all look healthy. Which monitoring approach is designed to catch THIS class of regression?",
      options: [
        "API Functional Monitoring (BAT) — scheduled synthetic tests that call the endpoint and assert on the response body/schema, so a wrong-but-200 payload fails a functional check",
        "Anypoint Monitoring's built-in dashboards and threshold alerts on CPU, memory, latency and error rate, which surface any regression because a wrong payload always moves one of those infrastructure signals",
        "A Runtime Manager alert on the 'application stopped responding' condition, since a payload that fails validation downstream will eventually make the app stop responding",
        "Log-level alerting that emails the team whenever an INFO log line is written for an order, letting a human read each response and spot the wrong total"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Functional Monitoring (BAT) runs synthetic requests and asserts on the actual response (status, body, schema), so a fast 200 carrying wrong data fails the assertion even when infra metrics are green.",
        "Infra metrics are correctness-blind: a wrong total costs no extra CPU/latency and returns 200, so none of those thresholds move.",
        "The app hasn't stopped responding — it responds fast with a 200; that alert never fires.",
        "Alerting on every INFO line is noise, not detection, and relies on a human catching a wrong number in a flood of logs."
      ],
      explanation: "Infrastructure/APM monitoring answers 'is it up and fast?' — it can't see that a 200 body is wrong. API Functional Monitoring (BAT) answers 'is it correct?' by issuing scheduled synthetic calls and asserting on the response, so a correctness regression that keeps returning a healthy-looking 200 is exactly what it catches."
    }
  ]
};
