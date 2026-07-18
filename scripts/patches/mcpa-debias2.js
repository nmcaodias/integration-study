/* MCPA de-bias · sections p3–p4 (single-answer). Distractors made plausible and
 * parallel-length; per-option notes added; some over-long correct options trimmed. */
module.exports = {
  questions: {
    "pa-013": {
      optionEdits: {
        0: "The Mule project source code that implements the API's flows",
        2: "The worker size and vCore allocation chosen at deploy time",
        3: "The flow and processor names inside the implementation"
      },
      optionNotes: [
        "Consumers never see the implementation source; it can change freely behind a stable contract.",
        "Correct — consumers depend on the published spec (contract) in Exchange, so changing it is what breaks them.",
        "Worker sizing is an operational detail invisible to consumers.",
        "Internal flow names are implementation detail, decoupled from the contract."
      ]
    },
    "pa-015": {
      optionEdits: {
        0: "One MINOR version bump, since both are additive schema refinements",
        1: "The type change is BREAKING -> a new MAJOR version (new instance, e.g. /v2); the optional field alone would have been MINOR",
        2: "Two PATCH bumps, one per field touched in the response",
        3: "No version change — response schema edits don't affect the contract"
      },
      optionNotes: [
        "A type change from date to date-time breaks existing consumers, so it can't be MINOR.",
        "Correct — the breaking type change forces a new MAJOR version; a lone optional field would only be MINOR.",
        "PATCH is for non-contract fixes; changing a field's type is a breaking contract change.",
        "Response schema is part of the contract; a breaking change absolutely requires versioning."
      ]
    },
    "pa-016": {
      optionEdits: {
        0: "Force both teams onto one enterprise-wide Customer model they must share",
        1: "Keep each context's model and translate explicitly at the API boundary (System/Process APIs act as the anti-corruption layer)",
        2: "Let each API return the raw backend format and push mapping onto consumers",
        3: "Store both models in one shared database and reconcile them there"
      },
      optionNotes: [
        "A single enterprise model over genuinely different domains creates a committee bottleneck and lossy compromises.",
        "Correct — preserve each bounded context and translate at the boundary; the API layer is the anti-corruption layer.",
        "Leaking raw backend formats couples consumers to internals — the opposite of the goal.",
        "One shared database re-creates the tight coupling bounded contexts are meant to avoid."
      ]
    },
    "pa-018": {
      optionEdits: {
        0: "The server locks the record while a client is editing it",
        1: "The server versions the entity with an ETag; clients send If-Match on updates, and a stale ETag is rejected with 412 Precondition Failed",
        2: "Clients coordinate updates through a shared message queue",
        3: "It cannot be prevented in a stateless REST API"
      },
      optionNotes: [
        "Server-side locking is pessimistic and stateful — not the HTTP-native optimistic approach.",
        "Correct — ETag + If-Match implements optimistic concurrency; a stale version is rejected with 412.",
        "Queues serialize work but aren't the HTTP concurrency mechanism the question asks about.",
        "REST prevents it natively via conditional requests (ETag/If-Match)."
      ]
    },
    "pa-019": {
      optionEdits: {
        0: "Copy-paste the type definitions into each RAML that needs them",
        1: "Publish them as API fragments (RAML libraries/data types) in Exchange and import them as dependencies in each spec",
        2: "Define a shared database schema all APIs read the types from",
        3: "Maintain one giant enterprise spec containing every API and its types"
      },
      optionNotes: [
        "Copy-paste drifts across specs and defeats reuse and central updates.",
        "Correct — publish reusable types as Exchange fragments and import them as versioned dependencies.",
        "A database schema is a runtime concern, not a way to share API type definitions.",
        "One monolithic spec couples unrelated APIs and blocks independent evolution."
      ]
    },
    "pa-020": {
      optionEdits: {
        1: "Customers SAPI (Salesforce) + Marketing SAPI (Marketo) + a Customer Registration PAPI orchestrating both + a Web Registration xAPI for the site",
        0: "One API that connects to Salesforce and Marketo and serves the site directly",
        2: "Two Experience APIs, each calling one backend and returning to the site",
        3: "A single DataGraph endpoint federating Salesforce and Marketo"
      },
      optionNotes: [
        "One do-everything API collapses the layers and loses reuse and separation of concerns.",
        "Correct — System APIs per backend, a Process API orchestrating the registration, and an Experience API for the site.",
        "Experience APIs shouldn't call backends directly; orchestration belongs in a Process API.",
        "DataGraph federates read queries; it doesn't orchestrate a multi-step write process with side effects."
      ]
    },
    "pa-022": {
      optionEdits: {
        0: "A new Process API running four Scatter-Gather branches to assemble the page",
        1: "Anypoint DataGraph: unify the four APIs into one graph and let the client query exactly the fields it needs in one request",
        2: "Four separate REST calls made directly from the mobile app",
        3: "A nightly ETL batch job pre-assembling the Customer 360 view"
      },
      optionNotes: [
        "A hand-built aggregator works but is more code to own than DataGraph for read-only field selection.",
        "Correct — DataGraph federates the read-only APIs so the client fetches just the fields it needs in one query.",
        "Four client-side calls push orchestration and latency onto the app.",
        "Batch ETL serves stale data and adds a store to maintain — wrong for a live page."
      ]
    },
    "pa-023": {
      optionEdits: {
        0: "When aggregating read-only data across several REST APIs",
        1: "When the operation UPDATES multiple systems and needs business rules and compensation logic",
        2: "When consumers want to select only specific fields",
        3: "When the source APIs are already published in Exchange"
      },
      optionNotes: [
        "Read-only aggregation is exactly DataGraph's sweet spot.",
        "Correct — multi-system writes with orchestration/compensation belong in a Process API, not DataGraph.",
        "Field selection is a core DataGraph benefit, not a disqualifier.",
        "Being in Exchange is a prerequisite for DataGraph, not a reason to avoid it."
      ]
    },
    "pa-024": {
      optionEdits: {
        0: "The raw SAP IDoc structures exactly as SAP emits them",
        1: "A clean canonical model of the ORDER bounded context, hiding SAP's native representation",
        2: "The mobile app's display-specific model",
        3: "Whatever DataWeave produces from the SAP response by default"
      },
      optionNotes: [
        "Leaking IDoc structures couples every consumer to SAP internals.",
        "Correct — a System API exposes a clean canonical model of its domain, insulating consumers from the backend.",
        "Channel-specific shaping belongs in an Experience API, not a System API.",
        "An accidental default mapping is not a deliberate, stable contract."
      ]
    },
    "pa-026": {
      optionEdits: {
        0: "Duplicate the order-placement logic inside each channel's Experience API",
        1: "The logic lives ONCE in the Place Order Process API; each channel gets a thin Experience API doing only its formatting",
        2: "Have both channels call the System APIs directly and orchestrate themselves",
        3: "Let the kiosk reuse the web channel's Experience API unchanged"
      },
      optionNotes: [
        "Duplicating logic per channel invites drift and double maintenance.",
        "Correct — shared logic in one Process API; each channel's Experience API only reshapes the response.",
        "Bypassing the Process API scatters orchestration into channels.",
        "Reusing one channel's Experience API forces the wrong response shape on the other."
      ]
    },
    "pa-027": {
      optionEdits: {
        0: "Keep it as-is; every call must traverse all three API-led layers",
        1: "Question the layer: a pure pass-through adds latency and ops cost without value — let the Experience API call the System API directly (layers are a means, not a mandate)",
        2: "Convert the pass-through Process API into a scheduled batch job",
        3: "Merge all three APIs into a single combined API"
      },
      optionNotes: [
        "The three layers are guidance, not a rule that every call must cross all of them.",
        "Correct — a value-free pass-through should be removed; skip the layer rather than pay its cost.",
        "Batching changes the interaction model and doesn't address the needless hop.",
        "Merging everything discards the reuse and separation the layers provide where they do add value."
      ]
    },
    "pa-028": {
      optionEdits: {
        0: "salesforce-api-v2-final",
        2: "Mobile Customers API",
        3: "CRM Helper Service"
      },
      optionNotes: [
        "Encodes the tool and a version label but not the layer or business capability.",
        "Correct — 'Customers System API (Salesforce)' names the capability, the layer, and the backing system.",
        "Implies an Experience/channel API, misrepresenting a System API over Salesforce.",
        "Vague and non-standard; conveys neither layer nor domain."
      ]
    }
  }
};
