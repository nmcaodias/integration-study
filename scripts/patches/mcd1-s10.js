/* MCD1 · s10 — Processing Records */
module.exports = {
  sections: {
    s10: {
      topicDocs: {
        "For Each vs. Parallel For Each vs. Batch": "https://docs.mulesoft.com/mule-runtime/latest/for-each-scope-concept",
        "Batch phases in detail": "https://docs.mulesoft.com/mule-runtime/latest/batch-processing-concept",
        "Object Store use cases": "https://docs.mulesoft.com/object-store-connector/latest/"
      },
      appendNotes: `
<h3>For Each vs. Parallel For Each vs. Batch</h3>
<table>
<tr><th></th><th>For Each</th><th>Parallel For Each</th><th>Batch Job</th></tr>
<tr><td>Order</td><td>Sequential</td><td>Concurrent (order not guaranteed)</td><td>Concurrent across steps</td></tr>
<tr><td>Payload after</td><td>Original payload</td><td>Collection of the branch results</td><td>Runs asynchronously; flow continues</td></tr>
<tr><td>Scale</td><td>In-memory, modest sizes</td><td>Modest, parallel</td><td>Large/streamed datasets (millions)</td></tr>
<tr><td>Per-record error handling</td><td>Fails the loop (unless Try inside)</td><td>Aggregates route errors</td><td>Records continue; failures tracked per step</td></tr>
<tr><td>Best for</td><td>Ordered, small batches</td><td>Independent items, faster</td><td>ETL, bulk sync, records that must not stop each other</td></tr>
</table>
<p>Key exam fact: <strong>For Each returns the original payload</strong> (inner payload changes are discarded; variables set inside persist). A Batch Job runs in the background — the triggering flow moves on immediately.</p>

<h3>Batch phases in detail</h3>
<ol>
<li><strong>Load and Dispatch</strong> (implicit) — splits the input into individual records and queues them.</li>
<li><strong>Process</strong> — one or more <strong>batch steps</strong> run records in parallel. Each step can have an <code>acceptExpression</code>/<code>acceptPolicy</code> to skip records, and a <strong>Batch Aggregator</strong> to group records (fixed size, e.g. 100, or streaming) for bulk operations.</li>
<li><strong>On Complete</strong> — runs once after all records finish; receives a <strong>BatchJobResult</strong> with counts (total/successful/failed), not the records themselves. Use it for reporting.</li>
</ol>
<p>Records that fail in a step don't stop the job by default — the job keeps processing others and records the failures, which is exactly why Batch suits large, fault-tolerant syncs.</p>

<h3>Object Store use cases</h3>
<ul>
<li><strong>Manual watermarking</strong> — store the max id/timestamp you've processed and read it back next run.</li>
<li><strong>Idempotency / dedup</strong> — remember keys already handled so retries don't double-process.</li>
<li><strong>Temporary state</strong> — cache a token or lookup with a <strong>TTL</strong> (entryTtl) so it expires.</li>
</ul>
<p>Object Store v2 is the persistent, cross-worker store on CloudHub. Use its Store / Retrieve / Contains / Remove operations.</p>
<p class="tip"><strong>Exam tip:</strong> "only process new rows automatically" → On Table Row watermark; "custom marker or a Scheduler poll" → Object Store manual watermark; "bulk insert groups" → Batch Aggregator; "summary counts after a big job" → On Complete / BatchJobResult.</p>`
    }
  },
  questions: {
    "m1-058": {
      options: [
        "The last element that was processed inside the loop",
        "An array collecting the result of each iteration",
        "The original payload that entered the scope, unchanged",
        "null, because the scope consumes the input collection"
      ],
      answer: 2,
      explanation: "For Each returns the ORIGINAL payload; payload modifications made inside the scope are discarded once it completes. Variables set inside the scope, however, do persist afterward.",
      optionNotes: [
        "Wrong — For Each doesn't reduce the payload to the last element.",
        "Wrong — that's Parallel For Each; plain For Each doesn't collect results.",
        "Correct — the payload entering the scope is what remains after it.",
        "Wrong — the payload is preserved, not nulled."
      ]
    },
    "m1-060": {
      options: [
        "Strictly sequentially, following the original input order",
        "Asynchronously and in parallel across the batch steps",
        "One record at a time, globally, across the whole application",
        "In reverse of the input order, processing newest first"
      ],
      answer: 1,
      explanation: "Batch queues each record and processes them in parallel through the steps — a key difference from For Each, which is sequential. The order of completion is not guaranteed.",
      optionNotes: [
        "Wrong — that's For Each; Batch's Process phase is parallel.",
        "Correct — records flow through the steps asynchronously and in parallel.",
        "Wrong — Batch processes many records concurrently, not one at a time.",
        "Wrong — there's no reverse-order guarantee; completion order is undefined."
      ]
    },
    "m1-061": {
      options: [
        "A For Each scope with its batch size parameter set to 100",
        "A Batch Aggregator inside the batch step, with size 100",
        "A Scatter-Gather configured with 100 parallel routes",
        "Logic placed in the job's On Complete phase"
      ],
      answer: 1,
      explanation: "The Batch Aggregator collects records within a step into groups (fixed size or streaming) so they can be sent to a target in bulk — e.g. a bulk insert of 100 records at a time.",
      optionNotes: [
        "Wrong — For Each iterates one collection; it doesn't group records for a bulk target inside a batch step.",
        "Correct — the Batch Aggregator groups records (size 100) for a bulk operation.",
        "Wrong — Scatter-Gather multicasts one event to fixed routes, not record grouping.",
        "Wrong — On Complete runs once at the end with summary counts, not grouped inserts."
      ]
    },
    "m1-063": {
      options: [
        "A Choice router that compares each row's ID against the previous one",
        "Automatic watermarking on the On Table Row source, keyed on the ID column",
        "Loading the whole table into a variable and diffing it every run",
        "A Cache scope keyed on each row's ID value"
      ],
      answer: 1,
      explanation: "The Database connector's On Table Row source supports automatic watermarking: it stores the highest seen value of the watermark column (the ID) and returns only newer rows on each poll.",
      optionNotes: [
        "Wrong — a Choice router has no memory of previous runs.",
        "Correct — On Table Row watermarking persists the max ID and fetches only newer rows.",
        "Wrong — holding the whole table in a variable doesn't persist across runs and doesn't scale.",
        "Wrong — a Cache scope caches operation results, not a synchronization high-water mark."
      ]
    },
    "m1-064": {
      options: [
        "Whenever a Scheduler is used, because Schedulers reset automatic watermarks each run",
        "When you need a custom marker the source doesn't manage (e.g. store a max updated-at yourself)",
        "Never — Mule 4 always handles watermarking automatically for you",
        "Only when reading files with the File or FTP connector"
      ],
      answer: 1,
      explanation: "Automatic watermarking exists only on certain listener sources. When you poll with a Scheduler or need custom criteria, you store and retrieve the watermark yourself with Object Store operations.",
      optionNotes: [
        "Wrong — Schedulers simply have no automatic watermark; they don't 'reset' one.",
        "Correct — manual watermarking covers custom markers the source can't track automatically.",
        "Wrong — automatic watermarking is limited to specific sources, so manual is sometimes required.",
        "Wrong — the need isn't specific to files; it's about whether the source manages the marker."
      ]
    },
    "m1-097": {
      options: [
        "The original payload that first triggered the batch job",
        "A BatchJobResult with counts: total, successful, and failed records",
        "An array containing every record the job processed",
        "Only the last record that the job processed"
      ],
      answer: 1,
      explanation: "On Complete runs once after all records finish and receives summary statistics only (a BatchJobResult with totalRecords, successfulRecords, failedRecords…). The original payload and the records themselves are not available there.",
      optionNotes: [
        "Wrong — the triggering payload isn't carried into On Complete.",
        "Correct — On Complete gets a BatchJobResult of counts for reporting/logging.",
        "Wrong — the processed records are not passed to On Complete.",
        "Wrong — no single record is available; only the aggregate result."
      ]
    }
  }
};
