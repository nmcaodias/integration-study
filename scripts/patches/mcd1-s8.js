/* MCD1 · s8 — Transforming Data with DataWeave */
module.exports = {
  sections: {
    s8: {
      topicDocs: {
        "Iteration functions at a glance": "https://docs.mulesoft.com/dataweave/latest/dw-core-functions",
        "Null handling and defaults": "https://docs.mulesoft.com/dataweave/latest/dataweave-cookbook-defaults",
        "Producing XML: attributes and repeated elements": "https://docs.mulesoft.com/dataweave/latest/dataweave-formats-xml"
      },
      appendNotes: `
<h3>Iteration functions at a glance</h3>
<table>
<tr><th>Function</th><th>Input → output</th><th>Lambda params</th></tr>
<tr><td><code>map</code></td><td>array → array (same length)</td><td>(item, index) / <code>$</code>, <code>$$</code></td></tr>
<tr><td><code>mapObject</code></td><td>object → object</td><td>(value, key, index)</td></tr>
<tr><td><code>filter</code></td><td>array → array (subset)</td><td>(item, index); keep when true</td></tr>
<tr><td><code>reduce</code></td><td>array → single accumulated value</td><td>(item, accumulator)</td></tr>
<tr><td><code>groupBy</code></td><td>array → object of arrays</td><td>(item, index) → key</td></tr>
<tr><td><code>distinctBy</code></td><td>array → array (dedup)</td><td>(item, index) → identity</td></tr>
<tr><td><code>orderBy</code></td><td>array → array (sorted)</td><td>(item, index) → sort key</td></tr>
<tr><td><code>pluck</code></td><td>object → array</td><td>(value, key, index)</td></tr>
</table>
<p>Reading trap: in an array <code>map</code>, <code>$</code> is the <em>item</em> and <code>$$</code> is the <em>index</em>; in object functions (<code>mapObject</code>, <code>pluck</code>), <code>$</code> is the <em>value</em> and <code>$$</code> the <em>key</em>. Getting these backwards is the single most common DataWeave mistake on the exam.</p>

<h3>Null handling and defaults</h3>
<ul>
<li><code>payload.name default "N/A"</code> — substitute when the left side is null or missing.</li>
<li><code>payload.address.city</code> — navigating a missing key yields <code>null</code>, not an error (unlike some languages).</li>
<li><code>payload.items[0]?</code> and functions like <code>isEmpty</code>, <code>orElse</code> guard optional data.</li>
<li>A selector on a key that appears many times: <code>payload.*item</code> returns all matching values as an array; <code>payload..author</code> (descendants) searches at any depth.</li>
</ul>

<h3>Producing XML: attributes and repeated elements</h3>
<p>XML output has two things JSON doesn't: a <strong>single required root</strong> and the distinction between elements and <strong>attributes</strong>. Repeated elements come from spreading an array with <code>{( … )}</code>; attributes use the <code>@( … )</code> syntax:</p>
<pre><code>%dw 2.0
output application/xml
---
order @(id: payload.id): {
  (payload.items map (item) -> line: {
    sku: item.sku,
    qty: item.qty
  })
}</code></pre>
<p>Produces <code>&lt;order id="…"&gt;&lt;line&gt;…&lt;/line&gt;&lt;line&gt;…&lt;/line&gt;&lt;/order&gt;</code>. Forgetting the single root, or trying to output a bare array as XML, is why <code>output application/xml --- payload</code> fails for array payloads.</p>
<p class="tip"><strong>Exam tip:</strong> match the function to the output <em>shape</em>: same-length list → map; subset → filter; one value → reduce; object of buckets → groupBy; object → array → pluck. Then check <code>$</code>/<code>$$</code>.</p>`
    }
  },
  questions: {
    "m1-045": {
      optionNotes: [
        "Wrong — filter keeps elements where the expression is true; $.id (a value) isn't a boolean dedup.",
        "Correct — distinctBy removes duplicates using the identity expression ($.id).",
        "Wrong — groupBy returns an object of arrays keyed by id, not a deduplicated array.",
        "Wrong — orderBy sorts by the key; it doesn't remove duplicates."
      ]
    },
    "m1-051": {
      optionNotes: [
        "Wrong — the body (after ---) is the single output expression, not where you declare var/fun.",
        "Correct — var, fun, import, output, type, ns all go in the header, above the ---.",
        "Wrong — declarations live in the script header, not an external properties file.",
        "Wrong — #[ ] is how you embed DataWeave in XML config, not where var/fun are declared."
      ]
    },
    "m1-094": {
      optionNotes: [
        "Wrong — it's the other way around for arrays.",
        "Correct — in an array lambda $ is the current item and $$ is its index.",
        "Wrong — $ and $$ are lambda params, not the event's payload/attributes.",
        "Wrong — key/namespace aren't what $ and $$ mean in a map lambda."
      ]
    },
    "m1-048": {
      options: [
        "In a .dwl module under src/main/resources, imported with 'import modules::MyModule'",
        "As a dependency entry inside the project's pom.xml build file",
        "Inside the flow's error handler so the functions load on failure",
        "In a Java class, annotated so DataWeave can call its methods directly"
      ],
      answer: 0,
      explanation: "Custom modules are .dwl files on the classpath (src/main/resources, e.g. modules/MyModule.dwl). Import them in the header with 'import modules::MyModule' (then MyModule::myFun) or 'import * from modules::MyModule'.",
      optionNotes: [
        "Correct — a .dwl module on the classpath, imported in the script header.",
        "Wrong — pom.xml declares build dependencies, not DataWeave functions.",
        "Wrong — the error handler is unrelated to where reusable DW lives.",
        "Wrong — DataWeave modules are .dwl files, not annotated Java classes."
      ]
    },
    "m1-050": {
      options: [
        "An array of the objects sorted alphabetically by their dest value",
        "An object with keys 'SFO' and 'LAX', each an array of the matching objects",
        "An array with duplicate destinations removed, one entry per dest",
        "An object giving the count of flights for each distinct destination"
      ],
      answer: 1,
      explanation: "groupBy returns an object whose keys are the criteria values and whose values are arrays of matching elements: {SFO: [...2 items...], LAX: [...1 item...]}.",
      optionNotes: [
        "Wrong — that's orderBy; groupBy buckets rather than sorts.",
        "Correct — an object keyed by dest, each key holding an array of matches.",
        "Wrong — that's distinctBy; groupBy keeps all elements, grouped.",
        "Wrong — counting requires a further step (e.g. mapObject sizeOf); groupBy alone keeps the arrays."
      ]
    },
    "m1-091": {
      options: [
        "An array of arrays, with one inner array per destination",
        "An object keyed by destination value, each holding an array of matching flights",
        "A single flight object produced for each distinct destination",
        "A number equal to the count of distinct destinations"
      ],
      answer: 1,
      explanation: "groupBy returns an object keyed by the grouping criteria; each key maps to the array of elements sharing that key. To get arrays back out, follow with pluck or mapObject.",
      optionNotes: [
        "Wrong — the result is an object keyed by value, not an array of arrays.",
        "Correct — object keys are the destinations; each value is the array of matching flights.",
        "Wrong — each key holds an array (possibly of one), not a single object.",
        "Wrong — groupBy returns the grouped object, not a count."
      ]
    },
    "m1-092": {
      options: [
        "'25/12/2025' as Date — relying on ISO parsing of the string",
        "('25/12/2025' as Date {format: 'dd/MM/yyyy'}) as String {format: 'yyyy-MM-dd'}",
        "'25/12/2025' as String {format: 'yyyy-MM-dd'} — reformatting in one step",
        "toDate('25/12/2025') using DataWeave's default date parser"
      ],
      answer: 1,
      explanation: "Reformatting a non-ISO date string is two coercions: parse with the input format (as Date {format: 'dd/MM/yyyy'}), then format with the output format (as String {format: 'yyyy-MM-dd'}). A bare 'as Date' fails because the string isn't ISO-8601.",
      optionNotes: [
        "Wrong — 'as Date' expects ISO-8601; '25/12/2025' won't parse without a format.",
        "Correct — parse with the input format, then format with the output format.",
        "Wrong — you can't reformat a plain string; you must parse to Date first.",
        "Wrong — there's no such default that reparses dd/MM/yyyy into ISO here."
      ]
    },
    "m1-093": {
      options: [
        "XML cannot represent numeric values without an accompanying schema",
        "XML needs a single root element, and the repeated array items must be wrapped with {( … )}",
        "DataWeave is unable to produce application/xml output at all",
        "The input must also be XML for an XML output to be valid"
      ],
      answer: 1,
      explanation: "An XML document needs exactly one root, and arrays must become repeated elements — typically items: {(payload.items map (i) -> item: {id: i.id})}. The {( )} syntax spreads the array as repeated keys inside the root.",
      optionNotes: [
        "Wrong — XML represents numbers fine; the issue is document structure.",
        "Correct — one root plus {( … )} to spread the array into repeated elements.",
        "Wrong — DataWeave outputs XML readily when the shape is valid.",
        "Wrong — output format is independent of input format."
      ]
    }
  }
};
