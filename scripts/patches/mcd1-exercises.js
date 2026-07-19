/* MCD1 · hands-on exercises (part 1: s2 RAML, s8 DataWeave).
 * Done OUTSIDE the site — Anypoint Studio / DataWeave Playground; the app shows
 * the use case, given assets, and a revealable model solution. */
module.exports = {
  addExercises: [
    {
      id: "m1-ex-01",
      section: "s2",
      title: "Design a flights API spec from scratch",
      level: "medium",
      where: "API Designer / any RAML editor",
      task: "<p>American Flights wants a REST API for its flight inventory. Write a <strong>RAML 1.0</strong> specification that covers:</p><ul><li><code>GET /flights</code> — list flights, with an <em>optional</em> query parameter <code>destination</code> restricted to <code>SFO</code>, <code>LAX</code> or <code>CLE</code></li><li><code>POST /flights</code> — create a flight from a JSON body</li><li><code>GET /flights/{ID}</code> — fetch one flight by ID</li></ul><p>Define a reusable <code>Flight</code> data type (ID number optional on create; code, price, departureDate required) and give the collection GET a response example. Then open the spec in API Designer's mocking service and call all three operations.</p>",
      given: [
        { label: "A flight resource (JSON)", code: "{\n  \"ID\": 1,\n  \"code\": \"ER38sd\",\n  \"price\": 400.00,\n  \"departureDate\": \"2024/03/20\",\n  \"origin\": \"MUA\",\n  \"destination\": \"SFO\"\n}" }
      ],
      steps: [
        "Create the spec in Design Center (or a local .raml file) starting with #%RAML 1.0, title, and version",
        "Declare the Flight type under types:, marking ID optional (ID?) and the rest required",
        "Add /flights with get: (query parameter with enum) and post: (body of type Flight)",
        "Add the nested /{ID} resource with get:",
        "Turn on the mocking service and send one request per operation, including ?destination=SFO"
      ],
      solution: [
        { label: "api.raml", code: "#%RAML 1.0\ntitle: American Flights API\nversion: v1\nmediaType: application/json\n\ntypes:\n  Flight:\n    type: object\n    properties:\n      ID?: integer\n      code: string\n      price: number\n      departureDate: string\n      origin: string\n      destination: string\n\n/flights:\n  get:\n    queryParameters:\n      destination:\n        required: false\n        enum: [SFO, LAX, CLE]\n    responses:\n      200:\n        body:\n          type: Flight[]\n          example: [{ ID: 1, code: \"ER38sd\", price: 400.00, departureDate: \"2024/03/20\", origin: \"MUA\", destination: \"SFO\" }]\n  post:\n    body:\n      type: Flight\n    responses:\n      201:\n        body:\n          type: Flight\n  /{ID}:\n    get:\n      responses:\n        200:\n          body:\n            type: Flight" }
      ],
      solutionNotes: "<p>Key details the exam probes: <code>ID?</code> makes a property optional (create requests have no ID yet); <code>enum</code> on a query parameter makes APIkit reject other values with <strong>400 Bad Request</strong> later; <code>Flight[]</code> declares an array of a named type; and the nested <code>/{ID}</code> resource declares a <em>URI parameter</em> implicitly. If your mock returned the example for <code>GET /flights</code>, the spec is wired correctly.</p>"
    },
    {
      id: "m1-ex-02",
      section: "s2",
      title: "Refactor a spec with a trait, resourceType, and securityScheme",
      level: "hard",
      where: "API Designer / any RAML editor",
      task: "<p>The spec below repeats pagination parameters and 404 responses on every collection. Refactor it so nothing is declared twice:</p><ul><li>a <code>pageable</code> <strong>trait</strong> supplying <code>offset</code>/<code>limit</code> query parameters</li><li>a <code>collection</code> <strong>resourceType</strong> supplying the standard <code>get</code>/<code>post</code> pair</li><li>a <code>basicAuth</code> <strong>securityScheme</strong> applied to the whole API</li></ul>",
      given: [
        { label: "Repetitive spec (excerpt)", code: "/customers:\n  get:\n    queryParameters:\n      offset: { type: integer, default: 0 }\n      limit:  { type: integer, default: 50 }\n  post:\n    body: { type: Customer }\n/orders:\n  get:\n    queryParameters:\n      offset: { type: integer, default: 0 }\n      limit:  { type: integer, default: 50 }\n  post:\n    body: { type: Order }" }
      ],
      steps: [
        "Declare traits: with pageable holding the two query parameters",
        "Declare resourceTypes: with collection using the <<resourcePathName>> / <<item>> parameters",
        "Declare securitySchemes: basicAuth with type Basic Authentication",
        "Apply them: securedBy at API level, type: { collection: ... } and is: [pageable] per resource",
        "Confirm both resources still validate and show the parameters in the documentation pane"
      ],
      solution: [
        { label: "api.raml (refactored)", code: "#%RAML 1.0\ntitle: Store API\nversion: v1\nsecuredBy: [basicAuth]\n\nsecuritySchemes:\n  basicAuth:\n    type: Basic Authentication\n    description: Send credentials in the Authorization header.\n\ntraits:\n  pageable:\n    queryParameters:\n      offset: { type: integer, default: 0 }\n      limit:  { type: integer, default: 50 }\n\nresourceTypes:\n  collection:\n    get:\n      is: [pageable]\n      responses:\n        200:\n          body: { type: <<item>>[] }\n    post:\n      body: { type: <<item>> }\n      responses:\n        201:\n          body: { type: <<item>> }\n\n/customers:\n  type: { collection: { item: Customer } }\n/orders:\n  type: { collection: { item: Order } }" }
      ],
      solutionNotes: "<p><strong>Traits</strong> package method-level behaviour (applied with <code>is:</code>); <strong>resourceTypes</strong> template whole resources (applied with <code>type:</code>) and can take parameters like <code>&lt;&lt;item&gt;&gt;</code>; <strong>securitySchemes</strong> declare auth and are activated with <code>securedBy</code>. Publishing these as an Exchange fragment is how an organization standardizes pagination across all its APIs — the exact reuse story the exam expects you to know.</p>"
    },
    {
      id: "m1-ex-03",
      section: "s8",
      title: "Reshape and filter orders with map",
      level: "medium",
      where: "DataWeave Playground",
      task: "<p>Transform the order list so that the output contains <strong>only shipped orders</strong>, each reshaped to <code>{ orderId, customer, total }</code> where <code>total</code> is the sum of <code>quantity × price</code> across the order's items, rounded to 2 decimals.</p>",
      given: [
        { label: "Input payload (JSON)", code: "[\n  { \"id\": \"A-100\", \"status\": \"SHIPPED\", \"buyer\": { \"name\": \"Ana\" },\n    \"items\": [ { \"sku\": \"K1\", \"quantity\": 2, \"price\": 10.5 },\n                { \"sku\": \"K2\", \"quantity\": 1, \"price\": 4.25 } ] },\n  { \"id\": \"A-101\", \"status\": \"PENDING\", \"buyer\": { \"name\": \"Rui\" },\n    \"items\": [ { \"sku\": \"K9\", \"quantity\": 5, \"price\": 2 } ] },\n  { \"id\": \"A-102\", \"status\": \"SHIPPED\", \"buyer\": { \"name\": \"Eva\" },\n    \"items\": [ { \"sku\": \"K1\", \"quantity\": 1, \"price\": 10.5 } ] }\n]" },
        { label: "Expected output", code: "[\n  { \"orderId\": \"A-100\", \"customer\": \"Ana\", \"total\": 25.25 },\n  { \"orderId\": \"A-102\", \"customer\": \"Eva\", \"total\": 10.5 }\n]" }
      ],
      steps: [
        "Open the DataWeave Playground and paste the input payload",
        "Filter to SHIPPED orders, then map each into the target shape",
        "Compute total with sum over the items (or reduce), and match the expected output exactly"
      ],
      solution: [
        { label: "transform.dwl", code: "%dw 2.0\noutput application/json\n---\npayload\n  filter ((order) -> order.status == \"SHIPPED\")\n  map ((order) -> {\n    orderId: order.id,\n    customer: order.buyer.name,\n    total: sum(order.items map ($.quantity * $.price))\n  })" }
      ],
      solutionNotes: "<p><code>filter</code> before <code>map</code> keeps the pipeline readable; <code>$</code> is the anonymous lambda parameter inside <code>map</code>. <code>sum()</code> over the mapped line values replaces a manual <code>reduce</code>. Small syntax slips the exam loves: forgetting the parentheses around the lambda, and using <code>=</code> instead of <code>:</code> inside the object constructor.</p>"
    },
    {
      id: "m1-ex-04",
      section: "s8",
      title: "Group line items into per-customer totals",
      level: "hard",
      where: "DataWeave Playground",
      task: "<p>Turn the flat list of line items into one object <strong>per customer</strong>, with that customer's item count and grand total, ordered by total descending.</p>",
      given: [
        { label: "Input payload (JSON)", code: "[\n  { \"customer\": \"Ana\", \"sku\": \"K1\", \"amount\": 21.00 },\n  { \"customer\": \"Rui\", \"sku\": \"K9\", \"amount\": 10.00 },\n  { \"customer\": \"Ana\", \"sku\": \"K2\", \"amount\": 4.25 },\n  { \"customer\": \"Eva\", \"sku\": \"K1\", \"amount\": 10.50 },\n  { \"customer\": \"Rui\", \"sku\": \"K1\", \"amount\": 31.50 }\n]" },
        { label: "Expected output", code: "[\n  { \"customer\": \"Rui\", \"items\": 2, \"total\": 41.5 },\n  { \"customer\": \"Ana\", \"items\": 2, \"total\": 25.25 },\n  { \"customer\": \"Eva\", \"items\": 1, \"total\": 10.5 }\n]" }
      ],
      steps: [
        "groupBy customer — inspect the intermediate result first (an object keyed by customer name)",
        "Convert that object back into an array with pluck",
        "Compute items (sizeOf) and total (sum) per group, then orderBy total descending"
      ],
      solution: [
        { label: "transform.dwl", code: "%dw 2.0\noutput application/json\n---\n(payload groupBy ((item) -> item.customer)\n  pluck ((group, name) -> {\n    customer: name as String,\n    items: sizeOf(group),\n    total: sum(group.amount)\n  }))\n  orderBy ((entry) -> -entry.total)" }
      ],
      solutionNotes: "<p>The canonical trio: <code>groupBy</code> produces an object of arrays, <code>pluck</code> walks an object's (value, key) pairs back into an array, and <code>orderBy</code> with a negated key sorts descending (DataWeave has no 'desc' flag). <code>group.amount</code> uses the multi-value selector to collect every amount in the group — no explicit map needed before <code>sum</code>.</p>"
    },
    {
      id: "m1-ex-05",
      section: "s8",
      title: "XML to JSON: attributes, namespaces, and nulls",
      level: "medium",
      where: "DataWeave Playground",
      task: "<p>Convert the XML order document to the JSON shape shown. Note that <code>id</code> and <code>currency</code> come from XML <strong>attributes</strong>, and that items missing a <code>note</code> element must not produce a <code>null</code> field in the output.</p>",
      given: [
        { label: "Input payload (XML)", code: "<order id=\"A-100\">\n  <customer>Ana</customer>\n  <items>\n    <item sku=\"K1\">\n      <qty>2</qty>\n      <price currency=\"EUR\">10.50</price>\n      <note>gift wrap</note>\n    </item>\n    <item sku=\"K2\">\n      <qty>1</qty>\n      <price currency=\"EUR\">4.25</price>\n    </item>\n  </items>\n</order>" },
        { label: "Expected output (JSON)", code: "{\n  \"orderId\": \"A-100\",\n  \"customer\": \"Ana\",\n  \"lines\": [\n    { \"sku\": \"K1\", \"qty\": 2, \"price\": 10.5, \"currency\": \"EUR\", \"note\": \"gift wrap\" },\n    { \"sku\": \"K2\", \"qty\": 1, \"price\": 4.25, \"currency\": \"EUR\" }\n  ]\n}" }
      ],
      steps: [
        "Select attributes with the @ selector (payload.order.@id)",
        "Map items with the multi-element selector payload.order.items.*item",
        "Coerce qty/price to numbers with 'as Number'",
        "Add skipNullOn=\"everywhere\" to the output directive so absent notes disappear"
      ],
      solution: [
        { label: "transform.dwl", code: "%dw 2.0\noutput application/json skipNullOn=\"everywhere\"\n---\n{\n  orderId: payload.order.@id,\n  customer: payload.order.customer,\n  lines: payload.order.items.*item map ((it) -> {\n    sku: it.@sku,\n    qty: it.qty as Number,\n    price: it.price as Number,\n    currency: it.price.@currency,\n    note: it.note\n  })\n}" }
      ],
      solutionNotes: "<p>Selectors under test: <code>@attr</code> for attributes, <code>*item</code> to force an array even when only one element repeats, and <code>as Number</code> because XML text is always String. <code>skipNullOn=\"everywhere\"</code> on the <em>writer</em> removes the <code>note: null</code> that the second item would otherwise produce — quieter than wrapping every field in an if.</p>"
    },
    {
      id: "m1-ex-06",
      section: "s8",
      title: "Build a SKU lookup with flatten and reduce",
      level: "hard",
      where: "DataWeave Playground",
      task: "<p>Each warehouse reports its own stock list. Produce a single object mapping every SKU to its <strong>total quantity across all warehouses</strong>.</p>",
      given: [
        { label: "Input payload (JSON)", code: "[\n  { \"warehouse\": \"LIS\", \"stock\": [ { \"sku\": \"K1\", \"qty\": 4 }, { \"sku\": \"K2\", \"qty\": 1 } ] },\n  { \"warehouse\": \"OPO\", \"stock\": [ { \"sku\": \"K1\", \"qty\": 3 }, { \"sku\": \"K9\", \"qty\": 7 } ] },\n  { \"warehouse\": \"FAO\", \"stock\": [ { \"sku\": \"K2\", \"qty\": 5 } ] }\n]" },
        { label: "Expected output", code: "{\n  \"K1\": 7,\n  \"K2\": 6,\n  \"K9\": 7\n}" }
      ],
      steps: [
        "Collect every stock line into one array (flatten over payload.stock, or flatMap)",
        "Fold that array into an object with reduce, adding each line's qty to the accumulator entry",
        "Check the accumulator seed and the dynamic key syntax — the two classic stumbling points"
      ],
      solution: [
        { label: "transform.dwl", code: "%dw 2.0\noutput application/json\n---\nflatten(payload.stock) reduce ((line, acc = {}) ->\n  acc ++ { (line.sku): (acc[line.sku] default 0) + line.qty }\n)" }
      ],
      solutionNotes: "<p>Three ideas combine here: <code>payload.stock</code> multi-selects every warehouse's array (an array of arrays) and <code>flatten</code> collapses it; <code>reduce</code> with an explicit <code>acc = {}</code> seed folds lines into one object; and <code>(line.sku):</code> — parentheses around the key — makes the key <em>dynamic</em>. <code>acc ++ {…}</code> overwrites the SKU's entry each pass because <code>++</code> keeps the right-hand duplicate. <code>default 0</code> handles the first sighting of a SKU.</p>"
    }
  ]
};
