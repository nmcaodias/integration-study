/* MCIA · new exhibit-based (visual) questions across a4/a5/a7, with per-option
 * notes, explanation, and length-balanced options. */
module.exports = {
  addQuestions: [
    {
      id: "ia-123",
      section: "a5",
      level: "medium",
      q: "Refer to the exhibit. The application runs on a 3-node customer-hosted cluster. What does this scheduler configuration guarantee?",
      exhibit: "<flow name=\"nightlySync\">\n  <scheduler>\n    <scheduling-strategy>\n      <fixed-frequency frequency=\"3600000\"/>\n    </scheduling-strategy>\n  </scheduler>\n  <!-- deployed to a 3-node cluster -->\n</flow>",
      options: [
        "It fires on the primary node only, so the sync runs once per interval across the cluster",
        "It fires on all three nodes at once, so you must add distributed locking yourself here",
        "It fires on a randomly chosen node each interval, which can occasionally double-run",
        "It refuses to start at all, because Scheduler sources are unsupported inside clusters"
      ],
      answer: 0,
      optionNotes: [
        "Correct — in a cluster, Scheduler (primaryNodeOnly) sources run on the primary node only; a new primary is elected on failover.",
        "Cluster schedulers don't fire on every node; that's the problem clustering already solves.",
        "It isn't random per interval; it's pinned to the elected primary.",
        "Schedulers are supported in clusters — on the primary node."
      ],
      explanation: "Polling and Scheduler sources are primaryNodeOnly in a cluster, so a fixed-frequency scheduler fires exactly once per interval cluster-wide, with automatic re-election on primary failure."
    },
    {
      id: "ia-124",
      section: "a7",
      level: "medium",
      q: "Refer to the exhibit. A failure occurs during the Database insert. Given this configuration, what happens to the consumed JMS message and the DB work?",
      exhibit: "<jms:listener config-ref=\"JMS\" destination=\"orders\"\n              transactionalAction=\"ALWAYS_BEGIN\"/>\n<db:insert config-ref=\"DB\"> ... </db:insert>\n<!-- both connectors configured for XA -->",
      options: [
        "Both roll back together — the DB insert is undone and the message returns to the queue",
        "The DB insert is committed while the message is still acknowledged and removed",
        "Only the message rolls back; the partial database insert is left committed as-is",
        "Neither is affected because JMS and databases cannot share one transaction"
      ],
      answer: 0,
      optionNotes: [
        "Correct — an XA transaction spanning JMS + DB rolls both back atomically, returning the message to the queue.",
        "XA prevents a committed DB write alongside a lost message; both fail together.",
        "XA is atomic across resources, so the DB insert can't stay committed alone.",
        "XA exists precisely so JMS and a database can commit/roll back as one unit."
      ],
      explanation: "With both connectors configured for XA and the source beginning the transaction, the JMS consume and the DB insert are one atomic unit: a failure rolls back the insert and redelivers the message."
    },
    {
      id: "ia-125",
      section: "a4",
      level: "easy",
      q: "Refer to the exhibit. Operations require that messages already accepted into this VM queue survive a CloudHub worker restart. What must be true?",
      exhibit: "<vm:publish config-ref=\"VM_Config\" queueName=\"work\"/>\n<!-- CloudHub 1.0 app, 2 workers -->\n<!-- Runtime Manager: Persistent Queues = ? -->",
      options: [
        "Persistent Queues must be enabled for the application in Runtime Manager",
        "The worker size must be increased so that restarts happen much less often",
        "The queue must be set to transient mode with a larger in-memory buffer",
        "Each message must first be copied into a flow variable before processing"
      ],
      answer: 0,
      optionNotes: [
        "Correct — enabling persistent queues makes VM messages durable across restarts and consumable by all workers.",
        "A bigger worker doesn't make in-memory messages survive a restart.",
        "Transient (in-memory) queues are exactly what's lost on restart.",
        "A flow variable lives in memory and is lost with the worker."
      ],
      explanation: "In-memory VM queues are lost on worker restart; enabling Persistent Queues in Runtime Manager makes accepted messages durable and shareable across the app's workers."
    }
  ]
};
