/* CCDAK · doc-link relevance audit. Repoint 4 heading links that pointed at a
 * bare docs root at a more specific page already present (200-verified) in the
 * data files. topicDocs merges. */
module.exports = {
  sections: {
    k3: {
      topicDocs: {
        "Stateful processing: state stores and internal topics": "https://docs.confluent.io/platform/current/streams/concepts.html",
        "Joins": "https://docs.confluent.io/platform/current/streams/concepts.html"
      }
    },
    k4: {
      topicDocs: {
        "Connectors, tasks, and scaling": "https://docs.confluent.io/platform/current/connect/index.html"
      }
    },
    k5: {
      topicDocs: {
        "Unit testing producers and consumers": "https://docs.confluent.io/platform/current/clients/producer.html"
      }
    }
  }
};
