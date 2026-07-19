/* EIP · new exhibit-based (visual) questions with small pattern diagrams,
 * per-option notes, explanation, and length-balanced options. */
module.exports = {
  addQuestions: [
    {
      id: "eip-109",
      section: "b6",
      level: "medium",
      q: "Refer to the exhibit. One input channel feeds a component that sends each message unchanged to exactly one of three output channels based on its type. Which pattern is shown?",
      exhibit: "            +-- typeA --> [ Channel A ]\n[ in ] --> ( ? ) --+-- typeB --> [ Channel B ]\n            +-- typeC --> [ Channel C ]\n(message body is not modified)",
      options: [
        "Content-Based Router — it inspects each message and forwards it unchanged to one output",
        "Message Translator — it converts each message into the destination system's format",
        "Aggregator — it collects the three inputs and combines them into one output message",
        "Publish-Subscribe Channel — it sends a copy of every message to all three outputs"
      ],
      answer: 0,
      optionNotes: [
        "Correct — routing an unmodified message to one of several outputs by its content is a Content-Based Router.",
        "A Translator changes format; here the body is untouched.",
        "An Aggregator combines many messages into one; this splits one to many outputs.",
        "Pub-sub fans a copy to all subscribers; a router picks exactly one."
      ],
      explanation: "A Content-Based Router examines a message and forwards it, unchanged, to exactly one of several output channels — distinct from a Translator (changes format), an Aggregator (combines), or pub-sub (copies to all)."
    },
    {
      id: "eip-610",
      section: "b6",
      level: "medium",
      q: "Refer to the exhibit. Each incoming order is broken into its line items, each item is processed by the right system, and the results are recombined into a single response. Which composite pattern is this?",
      exhibit: "[ order ] --> (Splitter) --> item --> (Router) --> systemX\n                                item --> (Router) --> systemY\n                     ... --> (Aggregator) --> [ one response ]",
      options: [
        "Composed Message Processor — split, route each part, then aggregate the results",
        "Routing Slip — attach an itinerary and pass the whole order through each step in turn",
        "Process Manager — a central hub drives each step based on intermediate results",
        "Message Broker — a hub that all systems connect to instead of each other"
      ],
      answer: 0,
      optionNotes: [
        "Correct — split into items, route each, then aggregate into one reply is the Composed Message Processor.",
        "A Routing Slip passes one whole message sequentially through steps; it doesn't split into parts.",
        "A Process Manager coordinates branching workflows, not this fixed split/route/aggregate.",
        "A Message Broker is a topology (hub), not this split-and-recombine processor."
      ],
      explanation: "The Composed Message Processor combines a Splitter, per-item routing, and an Aggregator to process the parts of one message and recombine them into a single result."
    },
    {
      id: "eip-810",
      section: "b8",
      level: "easy",
      q: "Refer to the exhibit. Three consumers all read from the same point-to-point queue to share the load. What consequence must the design account for?",
      exhibit: "                 +--> [ Consumer 1 ]\n[ orders queue ] +--> [ Consumer 2 ]\n                 +--> [ Consumer 3 ]\n(one point-to-point queue, competing consumers)",
      options: [
        "Messages may be processed out of their original order, since consumers run in parallel",
        "Every consumer receives a copy of every message, tripling the downstream work",
        "The queue will reject the second and third consumers as duplicate subscribers",
        "Delivery becomes exactly-once automatically because the load is shared out"
      ],
      answer: 0,
      optionNotes: [
        "Correct — Competing Consumers scale throughput but sacrifice ordering, since messages finish in parallel.",
        "Point-to-point gives each message to one consumer, not a copy to all (that's pub-sub).",
        "A point-to-point queue happily supports multiple competing consumers.",
        "Sharing load doesn't change delivery semantics to exactly-once."
      ],
      explanation: "Competing Consumers on one point-to-point channel load-balance messages (each to a single consumer) and raise throughput, but parallel processing means overall message order is no longer preserved."
    }
  ]
};
