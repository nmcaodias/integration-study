/* MCIA de-bias · sections a3–a4. */
module.exports = {
  questions: {
    "ia-015": {
      optionEdits: { 0: "Edit the YAML file inside the deployed JAR by hand", 1: "Set a deployment property in Runtime Manager, which overrides packaged file values", 2: "Recompile the app with a production Maven profile", 3: "Hardcode both values and pick with a Choice router" },
      optionNotes: ["Editing inside a deployed JAR isn't repeatable or safe.", "Correct — a Runtime Manager deployment property overrides the packaged value without a rebuild.", "Recompiling breaks build-once/deploy-many.", "Hardcoding env values into the artifact is exactly the anti-pattern."]
    },
    "ia-016": {
      optionEdits: { 0: "Individual Create operations inside a For Each loop", 1: "Bulk API v2 job operations for large loads", 2: "The Subscribe Channel streaming source", 3: "A SOQL Query All repeated inside a loop" },
      optionNotes: ["Per-record Creates burn API calls and are far too slow for 5M records.", "Correct — Bulk API v2 batches large data loads efficiently within API limits.", "Subscribe Channel receives events; it doesn't bulk-load.", "Looping SOQL is for reads, not efficient writes."]
    },
    "ia-017": {
      optionEdits: { 0: "A Query operation driven by a Scheduler", 1: "Upsert using an external ID field", 2: "Subscribe Channel / Change Data Capture event source", 3: "A Bulk API v2 query job on a timer" },
      optionNotes: ["Scheduled queries are polling — the opposite of push.", "Upsert writes records; it doesn't receive changes.", "Correct — Subscribe Channel/CDC pushes record changes to Mule in near real time without polling.", "A bulk query job is batch polling, not real-time push."]
    },
    "ia-018": {
      optionEdits: { 0: "Create, inserting every record as new", 1: "Update, modifying existing records only", 2: "Upsert using the external ID field", 3: "Merge, combining duplicate records" },
      optionNotes: ["Create fails when the record already exists.", "Update fails when the record doesn't yet exist.", "Correct — Upsert on an external ID inserts or updates by matching the ERP number, ideal for sync.", "Merge is for de-duplicating existing records, not sync."]
    },
    "ia-019": {
      optionEdits: { 0: "It validates payloads at runtime and rejects non-conforming messages", 1: "It provides design-time type information to guide the mapping", 2: "It encrypts field values that are marked sensitive", 3: "It generates MUnit tests for the transformation automatically" },
      optionNotes: ["DataSense is design-time metadata, not a runtime validator.", "Correct — DataSense supplies design-time input/output types (from connectors, specs, schemas, samples) to assist mapping.", "It doesn't encrypt anything.", "It doesn't generate tests."]
    },
    "ia-020": {
      optionEdits: { 0: "Each system needs one mapping to/from the canonical model instead of to every other system", 1: "Transformations become unnecessary anywhere in the integration", 2: "All systems must migrate their internal schemas to the canonical model", 3: "The number of mappings grows quadratically with systems" },
      optionNotes: ["Correct — a canonical model turns N×N pairwise mappings into N mappings to a shared model.", "Mappings are still needed, just fewer and to one model.", "Systems keep their internal schemas; only the integration maps to canonical.", "The canonical model reduces mappings from quadratic toward linear."]
    },
    "ia-021": {
      optionEdits: { 0: "Exchange cannot store large RAML data types", 1: "One all-encompassing model is slow to agree/version and yields bloated lowest-common-denominator types", 2: "DataWeave cannot transform very large objects", 3: "Canonical models only work for XML payloads" },
      optionNotes: ["Exchange stores fragments fine; size isn't the issue.", "Correct — a single enterprise model is a committee bottleneck and produces bloated compromise types; bounded contexts evolve independently.", "DataWeave handles large objects.", "Canonical models are format-agnostic."]
    },
    "ia-022": {
      optionEdits: { 0: "Write DataWeave checks with fail() at the start of every flow", 1: "Rely on the APIkit Router's validation against the imported specification", 2: "Add an Is Not Null validator for each field", 3: "Validate only in the downstream backend system" },
      optionNotes: ["Hand-written checks duplicate what the contract already declares.", "Correct — APIkit validates requests against the RAML/OAS automatically, rejecting bad input at the edge.", "Per-field validators are tedious and drift from the contract.", "Backend validation is too late and duplicates the contract."]
    },
    "ia-023": {
      optionEdits: { 0: "VM queues can connect flows across two different CloudHub applications", 1: "VM queues connect flows within a single Mule application only", 2: "VM queues are always persistent by default", 3: "VM queues require an external message broker" },
      optionNotes: ["VM queues are intra-app; they can't bridge separate apps.", "Correct — VM queues connect flows inside one application (or its cluster), not across apps.", "Persistence is opt-in, not automatic.", "VM queues are built in — no external broker."]
    },
    "ia-024": {
      optionEdits: { 0: "Setting the VM queue's queueType to TRANSIENT", 1: "Enabling persistent queues for the application in Runtime Manager", 2: "Switching to an Object Store instead of a queue", 3: "Nothing — it already works in-memory by default" },
      optionNotes: ["TRANSIENT is in-memory per worker — lost on restart, not shared.", "Correct — persistent queues make VM messages durable and consumable across all workers.", "Object Store isn't a work queue.", "In-memory VM queues are per-worker and lost on restart."]
    },
    "ia-025": {
      optionEdits: { 0: "Entries have a maximum time-to-live of 30 days", 1: "It cannot be accessed by more than one worker", 2: "It can only store plain string values", 3: "It is wiped on every application restart" },
      optionNotes: ["Correct — OSv2 caps entry TTL at 30 days, a real design constraint.", "OSv2 is shared across an app's workers, not single-worker.", "OSv2 stores serializable values, not only strings.", "OSv2 persists across restarts and redeploys."]
    },
    "ia-026": {
      optionEdits: { 0: "A server group where each node keeps its own in-memory Object Store", 1: "A cluster, so the Object Store lives in the shared distributed memory grid", 2: "A server group with persistent file-based Object Stores per node", 3: "Any deployment — the validator is always global by default" },
      optionNotes: ["Per-node in-memory stores don't see each other's IDs, so duplicates slip through.", "Correct — a cluster shares the Object Store across nodes, so dedup works globally.", "Per-node file stores are still isolated per node.", "The validator is only as global as its Object Store's scope."]
    },
    "ia-027": {
      optionEdits: { 0: "Primary storage for customer order records", 1: "Queueing messages between two applications", 2: "Storing the last-synced timestamp (watermark) for an incremental sync", 3: "Long-term archival of processed files" },
      optionNotes: ["Object Store isn't a system of record for business data.", "It isn't a message broker between apps.", "Correct — small operational state like a sync watermark is a textbook Object Store use.", "It isn't durable archival storage (30-day TTL)."]
    },
    "ia-028": {
      optionEdits: { 0: "A default in-memory Object Store on each worker", 1: "A custom Object Store backed by Object Store v2, shared across workers", 2: "A transient VM queue as the cache backing", 3: "Disable caching — consistency is impossible on CloudHub" },
      optionNotes: ["Per-worker in-memory caches diverge across workers.", "Correct — an OSv2-backed caching strategy is shared, so every worker sees the same cached results.", "A VM queue isn't a cache store.", "Consistent caching is entirely possible with a shared OSv2 store."]
    },
    "ia-029": {
      optionEdits: { 0: "Persistent VM queues are supported exactly as on CloudHub 1.0", 1: "Persistent VM queues aren't supported; use Anypoint MQ for durable messaging", 2: "Object Store v2 is unavailable on CloudHub 2.0", 3: "Replicas cannot share Object Store v2 state" },
      optionNotes: ["CloudHub 2.0 dropped persistent VM queues.", "Correct — on CloudHub 2.0, durable messaging moves to Anypoint MQ; VM queues aren't persistent.", "OSv2 is available on CloudHub 2.0.", "Replicas do share OSv2 state."]
    },
    "ia-078": {
      optionEdits: { 0: "DataWeave cannot handle very large data types", 1: "Agreement/versioning across every team makes it slow and bloated; bounded models evolve independently", 2: "Exchange cannot store more than 10 data types", 3: "Canonical models only work with XML payloads" },
      optionNotes: ["DataWeave isn't the limitation.", "Correct — a single enterprise model is slow to agree and bloated; per-domain bounded models evolve independently.", "Exchange has no such limit.", "Canonical models are format-agnostic."]
    },
    "ia-080": {
      optionEdits: { 0: "The Idempotent Message Validator itself is broken", 1: "Nothing — in a cluster the object store is shared, so duplicates must come from elsewhere (idExpression collisions or expiry)", 2: "Clusters don't support object stores at all", 3: "The validator only works when deployed on CloudHub" },
      optionNotes: ["The validator isn't broken; the setup is actually correct for a cluster.", "Correct — a cluster shares the object store, so this should dedup; look for id-expression collisions or TTL expiry instead.", "Clusters fully support shared object stores.", "The validator works on customer-hosted clusters too."]
    }
  }
};
