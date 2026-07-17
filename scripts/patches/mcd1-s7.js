/* MCD1 · s7 — Handling Errors */
module.exports = {
  sections: {
    s7: {
      topicDocs: {
        "How an error is routed": "https://docs.mulesoft.com/mule-runtime/latest/error-handling",
        "Error handler resolution order": "https://docs.mulesoft.com/mule-runtime/latest/error-handling",
        "Try scope and transactions": "https://docs.mulesoft.com/mule-runtime/latest/try-scope-concept",
        "Raise Error and Error Mapping": "https://docs.mulesoft.com/mule-runtime/latest/raise-error-component-reference"
      },
      appendNotes: `
<h3>How an error is routed</h3>
<p>When a processor throws, the event leaves the normal path and enters the flow's error handler. The handler tries each <strong>On Error</strong> scope top-to-bottom; the first whose <code>type</code>/<code>when</code> matches runs. What happens <em>after</em> the scope depends on which kind it is:</p>
<svg viewBox="0 0 660 220" style="max-width:660px;width:100%" role="img" aria-label="Error routing: propagate re-throws, continue resumes as success">
  <style>.eh-b{fill:none;stroke:currentColor;stroke-width:1.3}.eh-t{font:600 12px sans-serif;fill:currentColor}.eh-s{font:11px sans-serif;fill:currentColor;opacity:.8}.eh-a{stroke:currentColor;stroke-width:1.2;marker-end:url(#ehA)}</style>
  <defs><marker id="ehA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <rect x="10" y="90" width="90" height="34" rx="6" class="eh-b"/><text x="55" y="111" text-anchor="middle" class="eh-s">processor</text>
  <text x="55" y="140" text-anchor="middle" class="eh-s">throws</text>
  <rect x="140" y="90" width="100" height="34" rx="6" class="eh-b"/><text x="190" y="107" text-anchor="middle" class="eh-s">error</text>
  <text x="190" y="120" text-anchor="middle" class="eh-s">handler</text>
  <line x1="100" y1="107" x2="138" y2="107" class="eh-a"/>
  <rect x="290" y="40" width="150" height="40" rx="6" class="eh-b"/><text x="365" y="57" text-anchor="middle" class="eh-t">On Error Propagate</text><text x="365" y="72" text-anchor="middle" class="eh-s">runs, then RE-THROWS</text>
  <rect x="290" y="132" width="150" height="40" rx="6" class="eh-b"/><text x="365" y="149" text-anchor="middle" class="eh-t">On Error Continue</text><text x="365" y="164" text-anchor="middle" class="eh-s">runs, then SUCCEEDS</text>
  <line x1="240" y1="100" x2="288" y2="66" class="eh-a"/><line x1="240" y1="114" x2="288" y2="150" class="eh-a"/>
  <rect x="490" y="40" width="160" height="40" rx="6" class="eh-b"/><text x="570" y="57" text-anchor="middle" class="eh-s">error response</text><text x="570" y="72" text-anchor="middle" class="eh-s">(HTTP 500 by default)</text>
  <rect x="490" y="132" width="160" height="40" rx="6" class="eh-b"/><text x="570" y="149" text-anchor="middle" class="eh-s">success response</text><text x="570" y="164" text-anchor="middle" class="eh-s">(HTTP 200 by default)</text>
  <line x1="440" y1="60" x2="488" y2="60" class="eh-a"/><line x1="440" y1="152" x2="488" y2="152" class="eh-a"/>
</svg>
<p><strong>Propagate</strong> = "handle, then keep failing" (the caller sees an error). <strong>Continue</strong> = "handle, then pretend success" (the caller sees the handler's payload as a normal response). This single choice decides the caller's HTTP status.</p>

<h3>Error handler resolution order</h3>
<table>
<tr><th>Step</th><th>What is checked</th></tr>
<tr><td>1</td><td>Is the failing processor inside a <strong>Try scope</strong>? If so, the Try's error handler gets first refusal.</td></tr>
<tr><td>2</td><td>Otherwise the <strong>flow's own error handler</strong> is used.</td></tr>
<tr><td>3</td><td>Within a handler, On Error scopes are tried <strong>top to bottom</strong>; first matching <code>type</code>/<code>when</code> wins. All types extend <code>MULE:ANY</code>, so a MULE:ANY scope placed first makes later scopes unreachable — order specific → general.</td></tr>
<tr><td>4</td><td>No handler anywhere → the <strong>default error handler</strong> propagates (logs + error response). A configured <em>global</em> default handler substitutes here.</td></tr>
</table>

<h3>Try scope and transactions</h3>
<p>A <strong>Try scope</strong> wraps a group of processors so you can attach error handling to just that section — e.g. one risky HTTP call that should be tolerated with On Error Continue while the rest of the flow keeps its own handling. A Try can also manage a <strong>transaction</strong> (<code>Transactional Action</code>: ALWAYS_BEGIN / BEGIN_OR_JOIN), committing on success and rolling back on error. Note it is <em>not</em> a retry mechanism — that is <strong>Until Successful</strong>.</p>

<h3>Raise Error and Error Mapping</h3>
<p>Two ways to produce your own error types:</p>
<pre><code>&lt;!-- Raise Error: throw a typed error on purpose --&gt;
&lt;raise-error type="APP:INVALID_ORDER"
             description="Order total must be positive"/&gt;

&lt;!-- Error Mapping: reclassify an operation's error --&gt;
&lt;http:request config-ref="HTTP_Request" path="/customers/{id}"&gt;
  &lt;error-mapping sourceType="HTTP:NOT_FOUND"
                 targetType="APP:CUSTOMER_NOT_FOUND"/&gt;
&lt;/http:request&gt;</code></pre>
<p>Mapping lets downstream error handlers react to <em>business</em> types (APP:CUSTOMER_NOT_FOUND) instead of transport types (HTTP:NOT_FOUND). Raise Error is for enforcing your own rules.</p>
<p class="tip"><strong>Exam tip:</strong> On Error Continue → caller sees 200 (handler's payload). On Error Propagate → caller sees the error (500 by default). First matching scope wins, so put specific types above MULE:ANY.</p>`
    }
  },
  questions: {
    "m1-037": {
      options: [
        "A 500 Internal Server Error, because an error occurred somewhere in the flow",
        "The flow's success response (200 by default), carrying the error handler's payload",
        "A 400 Bad Request, because the event was rejected part-way through the flow",
        "No response at all; the HTTP Listener closes the connection on error"
      ],
      answer: 1,
      explanation: "On Error Continue handles the error and completes the flow as if it had succeeded, so the HTTP Listener returns its success response (200 by default) with whatever payload the error handler produced. On Error Propagate is what returns a 500.",
      optionNotes: [
        "Wrong — that is the On Error Propagate outcome, not Continue.",
        "Correct — Continue resumes the success path; the caller gets 200 with the handler's payload.",
        "Wrong — 400 would come from request validation, not from a handled error.",
        "Wrong — the listener still responds; Continue produces a normal success response."
      ]
    },
    "m1-038": {
      options: [
        "Flow A continues normally after the Flow Reference, ignoring the error",
        "The error surfaces at the Flow Reference and Flow A's handler (or the default) takes over",
        "Flow A restarts from the beginning with the original inbound event",
        "Flow A receives the error object as its payload and keeps executing"
      ],
      answer: 1,
      explanation: "On Error Propagate runs its processors and then re-throws, so the error emerges at the Flow Reference in Flow A and is handled by Flow A's error handling (or the default handler). The rest of Flow A's normal path does not run.",
      optionNotes: [
        "Wrong — a propagated error is not swallowed; Flow A cannot just continue normally.",
        "Correct — propagate re-throws into the caller, where Flow A's handling takes over.",
        "Wrong — errors don't restart a flow.",
        "Wrong — that would be On Error Continue behavior in Flow B, not Propagate."
      ]
    },
    "m1-040": {
      options: [
        "An On Error Continue scope added individually to every flow",
        "A Try scope wrapped around the body of every flow in the app",
        "A global Error Handler element set as the application's default error handler",
        "An APIkit console flow that intercepts otherwise-unhandled errors"
      ],
      answer: 2,
      explanation: "Define a global Error Handler element and set it as the app's default error handler in the configuration. It is used only by flows that don't declare their own handler — a fallback, not an addition to existing handlers.",
      optionNotes: [
        "Wrong — that repeats a handler everywhere instead of one shared default.",
        "Wrong — a Try scope handles a section, not an app-wide default.",
        "Correct — a global default error handler is exactly the app-wide fallback.",
        "Wrong — the console flow serves API docs; it doesn't handle errors."
      ]
    },
    "m1-041": {
      options: [
        "To retry a group of failed processors automatically until they succeed",
        "To handle errors around a specific group of processors, with its own On Error scopes",
        "To run its inner processors in parallel across separate threads",
        "To catch only Java exceptions, ignoring Mule error types"
      ],
      answer: 1,
      explanation: "A Try scope wraps a set of processors and attaches error handling to just that section, enabling processor-level handling (e.g. tolerate one risky call). It does not retry by itself — Until Successful does that.",
      optionNotes: [
        "Wrong — retrying is Until Successful; a Try scope handles, it doesn't loop.",
        "Correct — scoped error handling for a group of processors is the Try scope's purpose.",
        "Wrong — parallel execution is Scatter-Gather/Async, not Try.",
        "Wrong — Try handles Mule errors (which wrap Java exceptions), not just Java."
      ]
    },
    "m1-042": {
      options: [
        "The second scope, because HTTP:NOT_FOUND is the most specific matching type",
        "The first scope, because scopes are evaluated in order and MULE:ANY matches everything",
        "Both scopes execute, the general one running after the specific one",
        "Neither scope; the unmatched error propagates to the caller"
      ],
      answer: 1,
      explanation: "On Error scopes are evaluated top to bottom and the first match wins. Since every error extends MULE:ANY, the first scope catches everything — so specific handlers must be placed before general ones.",
      optionNotes: [
        "Wrong — order beats specificity; the earlier MULE:ANY scope matches first.",
        "Correct — first match wins, and MULE:ANY (placed first) matches every error.",
        "Wrong — only one On Error scope handles an error, not both.",
        "Wrong — MULE:ANY matches, so the error is handled, not propagated unmatched."
      ]
    },
    "m1-043": {
      options: [
        "To retry the operation with an increasing backoff delay between attempts",
        "To convert a low-level error (HTTP:NOT_FOUND) into a custom type (APP:CUSTOMER_NOT_FOUND)",
        "To suppress every error the operation might raise so the flow never fails",
        "To automatically write the operation's error to the application log"
      ],
      answer: 1,
      explanation: "Error mapping reclassifies an operation's error into a custom, business-meaningful namespace, so error handlers can react to types like APP:CUSTOMER_NOT_FOUND instead of transport-level HTTP:NOT_FOUND.",
      optionNotes: [
        "Wrong — retry/backoff is Until Successful and reconnection strategies, not error mapping.",
        "Correct — mapping renames an error into a custom application type.",
        "Wrong — mapping reclassifies errors; it doesn't swallow them.",
        "Wrong — logging is done by a Logger or the error handler, not by mapping."
      ]
    },
    "m1-087": {
      options: [
        "The On Error Propagate, because HTTP:NOT_FOUND is the more specific type",
        "The On Error Continue, because scopes match in order and MULE:ANY comes first",
        "Both scopes execute, running in top-to-bottom order",
        "Neither scope; the error escapes the handler entirely"
      ],
      answer: 1,
      explanation: "On Error scopes are checked top to bottom, first match wins. A MULE:ANY scope placed first swallows every error, making later scopes unreachable — so order specific types before general ones.",
      optionNotes: [
        "Wrong — specificity doesn't override order; the earlier MULE:ANY wins.",
        "Correct — the first scope (On Error Continue on MULE:ANY) matches first and handles it.",
        "Wrong — a single error is handled by exactly one scope.",
        "Wrong — MULE:ANY matches, so the error is handled (as a success, via Continue)."
      ]
    }
  }
};
