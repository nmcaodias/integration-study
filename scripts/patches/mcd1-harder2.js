/* MCD1 · difficulty upgrade, part 2 (remaining 7 of 15). */
module.exports = {
  questions: {
    "m1-051": {
      level: "medium",
      q: "Refer to the exhibit. The script fails to compile. What is wrong?",
      exhibit: "%dw 2.0\noutput application/json\n---\nvar rate = 1.2\nfun label(s) = upper(s)\n{\n  price: payload.price * rate,\n  name: label(payload.name)\n}",
      options: [
        "var and fun must be declared in the header, before the --- separator",
        "fun requires an explicit return type annotation before it can compile",
        "var cannot hold a decimal literal without an 'as Number' coercion",
        "The object constructor must come before any function declarations"
      ],
      answer: 0,
      optionNotes: [
        "Correct — declarations (var, fun, import, ns) belong in the header; the body after --- is a single expression.",
        "Return types are optional in DataWeave functions.",
        "Decimal literals are valid Numbers as-is.",
        "Ordering inside the body isn't the issue — declarations simply can't live there."
      ],
      explanation: "A DataWeave script = header (directives and declarations) + --- + exactly one body expression. Moving var/fun below the separator is a compile error the exam likes to show as a broken script."
    },
    "m1-058": {
      level: "hard",
      q: "Refer to the exhibit. What are payload and vars.sum immediately after the For Each scope completes?",
      exhibit: "<set-variable variableName=\"sum\" value=\"#[0]\"/>\n<foreach collection=\"#[[1, 2, 3]]\">\n  <set-variable variableName=\"sum\" value=\"#[vars.sum + payload]\"/>\n  <set-payload value=\"#[payload * 10]\"/>\n</foreach>",
      options: [
        "payload = [1, 2, 3] and vars.sum = 6",
        "payload = [10, 20, 30] and vars.sum = 6",
        "payload = [1, 2, 3] and vars.sum = 0",
        "payload = 30 and vars.sum = 6"
      ],
      answer: 0,
      optionNotes: [
        "Correct — For Each restores the original collection as payload afterwards, but variables set inside persist, so the accumulation survives.",
        "Per-iteration payload changes are discarded when the scope ends.",
        "Variables written inside the scope DO persist — sum ends at 6.",
        "The last iteration's payload (30) is not kept either; the original array returns."
      ],
      explanation: "The two halves of the For Each contract: the scope's output payload is the input collection (modifications inside are discarded), while variables are shared with the outer flow — which is exactly how you accumulate results."
    },
    "m1-068": {
      level: "medium",
      q: "A developer wants to debug a Mule app running on a local standalone runtime (not launched from Studio) using the Studio debugger. What must be true?",
      options: [
        "The runtime must enable the debugger agent, and Studio attaches a Remote Mule Application debug configuration to its port (6666 by default)",
        "Nothing special — Studio automatically discovers and attaches to any Mule runtime that is running on the same machine",
        "The application must be repackaged with a special debug classifier before deployment so breakpoints can bind at runtime",
        "Remote debugging works only for CloudHub deployments, because standalone runtimes never expose a debugger endpoint"
      ],
      answer: 0,
      optionNotes: [
        "Correct — enable the debugger on the runtime side, then attach Studio's remote debug configuration to the agent's port (default 6666).",
        "Attachment is explicit — Studio doesn't auto-discover external runtimes.",
        "No special packaging is involved in debugging.",
        "It's the reverse: local/standalone runtimes support it; debugging into CloudHub is not how this works."
      ],
      explanation: "Studio debugs its embedded runtime automatically; for an external runtime you enable the debugger agent and attach via a Remote Mule Application configuration to the agent port, 6666 by default."
    },
    "m1-070": {
      level: "medium",
      q: "A CI pipeline runs 'mvn clean package' on a Mule 4 project. Which statement about the produced artifact is correct?",
      options: [
        "It is a deployable JAR (mule-application classifier) bundling the app, its config, and dependencies — the same file CloudHub and Runtime Manager accept",
        "It is a WAR file that must be dropped into a servlet container such as Tomcat running alongside the Mule runtime services",
        "It is only an intermediate build folder; deployable artifacts can be exported exclusively from Anypoint Studio's UI menus",
        "It is a Docker image, because Mule 4 applications are always container images regardless of the chosen deployment target"
      ],
      answer: 0,
      optionNotes: [
        "Correct — packaging yields the deployable mule-application JAR, deployable as-is to CloudHub or any Mule runtime.",
        "Mule apps are not servlet WARs.",
        "Maven produces the same deployable artifact Studio's export does — that's what CI uses.",
        "Container images are one deployment option, not the build artifact."
      ],
      explanation: "mvn package on a Mule project produces the deployable JAR (classifier mule-application) containing flows, resources, and dependencies — the unit every deployment target consumes, and the artifact you promote through environments."
    },
    "m1-080": {
      level: "hard",
      q: "Refer to the exhibit. Which set of expressions retrieves the three marked values from the request?",
      exhibit: "GET /api/flights/AA123?seats=2\nAuthorization: Bearer abc\n\nwanted: (1) the flight ID   (2) the seats value as a Number\n        (3) the Authorization header",
      options: [
        "attributes.uriParams.'ID', attributes.queryParams.seats as Number, attributes.headers.authorization",
        "attributes.queryParams.'ID', attributes.uriParams.seats as Number, attributes.headers.Authorization",
        "payload.'ID', attributes.queryParams.seats, attributes.headers.'Bearer'",
        "attributes.uriParams.'ID', attributes.queryParams.seats, payload.headers.authorization"
      ],
      answer: 0,
      optionNotes: [
        "Correct — path templates land in uriParams, the query string in queryParams (strings — coerce for math), and header keys are matched case-insensitively (conventionally lowercase).",
        "uriParams and queryParams are swapped here.",
        "A GET's payload is empty; none of these values live there.",
        "seats stays a String without the coercion, and headers are attributes, not payload."
      ],
      explanation: "HTTP Listener attributes: uriParams for {templates}, queryParams for the query string, headers with case-insensitive keys — and every one of those values is a String until explicitly coerced."
    },
    "m1-094": {
      level: "hard",
      q: "Refer to the exhibit. What does the script output?",
      exhibit: "%dw 2.0\noutput application/json\nvar input = { a: 10, b: 20 }\n---\n{\n  mapped:  [1, 2] map ($ * 10),\n  objMap:  input mapObject { ($$): $ + 1 },\n  plucked: input pluck $$\n}",
      options: [
        "{ \"mapped\": [10, 20], \"objMap\": { \"a\": 11, \"b\": 21 }, \"plucked\": [\"a\", \"b\"] }",
        "{ \"mapped\": [10, 20], \"objMap\": { \"11\": \"a\", \"21\": \"b\" }, \"plucked\": [10, 20] }",
        "{ \"mapped\": [0, 10], \"objMap\": { \"a\": 11, \"b\": 21 }, \"plucked\": [0, 1] }",
        "{ \"mapped\": [10, 20], \"objMap\": { \"a\": 10, \"b\": 20 }, \"plucked\": [\"a\", \"b\"] }"
      ],
      answer: 0,
      optionNotes: [
        "Correct — in map, $ is the value; in mapObject and pluck, $ is the value and $$ the KEY, so ($$): $ + 1 keeps keys and bumps values, and pluck $$ lists the keys.",
        "($$): $ + 1 puts $$ in key position — keys stay a/b; values change.",
        "map's $ is the value, not the index ($$ would be the index there).",
        "objMap adds 1 to each value; this shows them unchanged."
      ],
      explanation: "The $-parameters shift meaning by function: map → $ value, $$ index; mapObject/pluck → $ value, $$ key ($$$ index in pluck). Reading ($$): as 'use the key' unlocks most of these puzzles."
    },
    "m1-097": {
      level: "medium",
      q: "A Batch Job (maxFailedRecords = -1) processes 10 records; 3 fail in step 1. Which statement about the On Complete phase is correct?",
      options: [
        "It runs once with a BatchJobResult payload reporting total 10, successful 7, failed 3 — not with the records themselves",
        "It runs once per successful record, receiving each of the 7 surviving records as its payload in turn",
        "It is skipped entirely, because a batch job only reaches On Complete when every record has succeeded",
        "It receives the 3 failed records as an array so that they can be routed to a dead-letter destination"
      ],
      answer: 0,
      optionNotes: [
        "Correct — On Complete fires once, after processing, with the statistics object (totalRecords, successfulRecords, failedRecords).",
        "It is a once-per-job phase, not per-record.",
        "With maxFailedRecords=-1 failures don't stop the job, and On Complete runs regardless.",
        "The records aren't delivered there — only the counts; failed-record handling belongs in the steps."
      ],
      explanation: "On Complete is the job's summary phase: one execution, one BatchJobResult payload with the counts — a favourite spot for reporting, never for per-record processing."
    }
  }
};
