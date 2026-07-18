/* MCIA · doc-link relevance audit. Repoint 3 heading links that pointed at a
 * bare/off-topic root to relevant pages already present (200-verified) in the
 * data files. Correct product roots (salesforce/vm/validation/munit/cli/
 * monitoring/dataweave) are kept as-is. topicDocs merges. */
module.exports = {
  sections: {
    a1: {
      topicDocs: {
        "Platform features for web and event-driven APIs": "https://docs.mulesoft.com/general/api-led-overview",
        "Control plane and runtime plane deployment options": "https://docs.mulesoft.com/hosting-home/"
      }
    },
    a2: {
      topicDocs: {
        "Web APIs and HTTP": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods"
      }
    }
  }
};
