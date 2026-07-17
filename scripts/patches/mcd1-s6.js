/* MCD1 · s6 — Routing Events */
module.exports = {
  sections: {
    s6: {
      topicDocs: {
        "Choosing a router": "https://docs.mulesoft.com/mule-runtime/latest/choice-router-concept",
        "Combining validators (All / Any)": "https://docs.mulesoft.com/validations-module/latest/"
      },
      appendNotes: `
<h3>Choosing a router</h3>
<svg viewBox="0 0 640 210" style="max-width:640px;width:100%" role="img" aria-label="Choice sends to one route; Scatter-Gather sends a copy to all">
  <style>.rt-b{fill:none;stroke:currentColor;stroke-width:1.3}.rt-t{font:600 12px sans-serif;fill:currentColor}.rt-s{font:11px sans-serif;fill:currentColor;opacity:.75}.rt-a{stroke:currentColor;stroke-width:1.2;marker-end:url(#rtA)}.rt-d{stroke:currentColor;stroke-width:1.2;stroke-dasharray:4 3;opacity:.45}</style>
  <defs><marker id="rtA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <text x="10" y="16" class="rt-t">Choice — exactly one route</text>
  <rect x="10" y="30" width="70" height="34" rx="6" class="rt-b"/><text x="45" y="51" text-anchor="middle" class="rt-s">event</text>
  <rect x="120" y="30" width="60" height="34" rx="6" class="rt-b"/><text x="150" y="51" text-anchor="middle" class="rt-s">choice</text>
  <line x1="80" y1="47" x2="118" y2="47" class="rt-a"/>
  <rect x="230" y="4" width="80" height="26" rx="6" class="rt-b"/><text x="270" y="21" text-anchor="middle" class="rt-s">route A</text>
  <rect x="230" y="38" width="80" height="26" rx="6" class="rt-b"/><text x="270" y="55" text-anchor="middle" class="rt-s">route B</text>
  <rect x="230" y="72" width="80" height="26" rx="6" class="rt-b"/><text x="270" y="89" text-anchor="middle" class="rt-s">otherwise</text>
  <line x1="180" y1="47" x2="228" y2="17" class="rt-a"/><line x1="180" y1="47" x2="228" y2="51" class="rt-d"/><line x1="180" y1="47" x2="228" y2="85" class="rt-d"/>
  <text x="360" y="16" class="rt-t">Scatter-Gather — a copy to every route</text>
  <rect x="360" y="30" width="70" height="34" rx="6" class="rt-b"/><text x="395" y="51" text-anchor="middle" class="rt-s">event</text>
  <rect x="470" y="30" width="50" height="34" rx="6" class="rt-b"/><text x="495" y="51" text-anchor="middle" class="rt-s">S-G</text>
  <line x1="430" y1="47" x2="468" y2="47" class="rt-a"/>
  <rect x="560" y="10" width="70" height="24" rx="6" class="rt-b"/><text x="595" y="26" text-anchor="middle" class="rt-s">route 0</text>
  <rect x="560" y="44" width="70" height="24" rx="6" class="rt-b"/><text x="595" y="60" text-anchor="middle" class="rt-s">route 1</text>
  <line x1="520" y1="47" x2="558" y2="22" class="rt-a"/><line x1="520" y1="47" x2="558" y2="56" class="rt-a"/>
  <text x="360" y="92" class="rt-s">solid = taken · dashed = not taken</text>
</svg>
<table>
<tr><th>Scenario</th><th>Router</th></tr>
<tr><td>Send to ONE handler based on a field, with a fallback</td><td>Choice (+ otherwise)</td></tr>
<tr><td>Call several systems in parallel and combine results</td><td>Scatter-Gather</td></tr>
<tr><td>Try backups in order until one succeeds (failover)</td><td>First Successful</td></tr>
<tr><td>Spread events evenly across routes over time</td><td>Round Robin</td></tr>
</table>

<h3>Combining validators (All / Any)</h3>
<p>The <strong>All</strong> validator runs several validations and fails if <em>any</em> fail (collecting the errors); the <strong>Any</strong> validator passes if <em>at least one</em> succeeds. Both still follow the fail-fast model — on failure they raise a <code>VALIDATION</code>-namespace error rather than returning a boolean — so they slot cleanly into an error handler that maps to a 400 response.</p>`
    }
  },
  questions: {
    "m1-032": {
      options: [
        "The payload of the last route only, replacing all the others",
        "A flat array of the route payloads, in route order",
        "An object keyed by route index ('0','1',…), each holding that route's message",
        "The original request payload, passed through unchanged by the router"
      ],
      answer: 2,
      explanation: "Scatter-Gather aggregates into an object keyed by route index; each value holds that route's full Mule message (payload + attributes). Developers usually follow it with DataWeave such as flatten(payload pluck $.payload) to merge results.",
      optionNotes: [
        "Wrong — every route's result is kept, not just the last one.",
        "Wrong — the aggregate is an object keyed by index, not a flat array (you flatten it yourself afterward).",
        "Correct — an object with keys '0','1',… each containing that route's message.",
        "Wrong — the router produces a new aggregated payload, not the untouched request."
      ]
    },
    "m1-035": {
      options: [
        "A Scatter-Gather, so every one of the three handlers processes the order",
        "A Choice router with three when routes and an otherwise fallback",
        "A For Each scope that iterates over the order and its items",
        "A First Successful router that tries each handler until one works"
      ],
      answer: 1,
      explanation: "Dispatching to exactly one route based on a field, with a fallback for unknown values, is the Choice router's job. Scatter-Gather would send the order to all handlers; First Successful is for failover, not conditional routing.",
      optionNotes: [
        "Wrong — Scatter-Gather multicasts to all routes; the order would hit every handler.",
        "Correct — conditional single-route dispatch with a default is exactly Choice.",
        "Wrong — For Each iterates a collection; it doesn't pick one handler by type.",
        "Wrong — First Successful is a failover pattern, not conditional routing on a field."
      ]
    },
    "m1-086": {
      options: [
        "Validators return true or false for use directly in a Choice router expression",
        "Validators throw a typed VALIDATION error on failure and pass the event through on success",
        "Validators automatically correct the invalid data and then continue the flow",
        "Validators only function inside APIkit-generated implementation flows"
      ],
      answer: 1,
      explanation: "Validation components are fail-fast: on failure they raise a typed error such as VALIDATION:INVALID_EMAIL (catchable by an error handler); on success the event continues unchanged. They do not return booleans.",
      optionNotes: [
        "Wrong — validators raise errors, they don't return booleans for Choice.",
        "Correct — typed VALIDATION error on failure, pass-through on success.",
        "Wrong — validators never mutate the data; they only check it.",
        "Wrong — validators work in any flow, not just APIkit ones."
      ]
    }
  },
  addQuestions: [
    {
      id: "m1-228",
      section: "s6",
      level: "hard",
      q: "A Scatter-Gather calls two airline systems, then a Transform runs the script shown on its output. Given the aggregated payload, what does the script produce?",
      exhibit:
        "PAYLOAD after Scatter-Gather:\n" +
        "{\n" +
        "  \"0\": { \"attributes\": {…}, \"payload\": [ { \"f\": \"UA1\" } ] },\n" +
        "  \"1\": { \"attributes\": {…}, \"payload\": [ { \"f\": \"DL2\" }, { \"f\": \"DL9\" } ] }\n" +
        "}\n" +
        "\n" +
        "SCRIPT:\n" +
        "%dw 2.0\n" +
        "output application/json\n" +
        "---\n" +
        "flatten(payload pluck $.payload)",
      options: [
        "[ { \"f\": \"UA1\" }, { \"f\": \"DL2\" }, { \"f\": \"DL9\" } ]",
        "{ \"0\": [ { \"f\": \"UA1\" } ], \"1\": [ { \"f\": \"DL2\" }, { \"f\": \"DL9\" } ] }",
        "[ [ { \"f\": \"UA1\" } ], [ { \"f\": \"DL2\" }, { \"f\": \"DL9\" } ] ]",
        "[ \"UA1\", \"DL2\", \"DL9\" ]"
      ],
      answer: 0,
      explanation: "pluck collects each route's .payload into an array of arrays; flatten merges them into a single array of flight objects. The keys ('0','1') are dropped by pluck, and the objects are preserved (not reduced to strings).",
      optionNotes: [
        "Correct — pluck yields [[UA1],[DL2,DL9]] and flatten merges to one array of the three objects.",
        "Wrong — that is the input shape; pluck+flatten specifically removes the index keys.",
        "Wrong — that is the result of pluck alone; flatten collapses the outer nesting.",
        "Wrong — the objects keep their structure; nothing projects them down to the 'f' string."
      ]
    }
  ]
};
