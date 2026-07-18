/* MCPA · doc-link relevance audit (same pass as MCD2's mcd2-doclinks.js).
 * Repoint 8 heading links that pointed at a bare product root or an off-topic
 * page. Every target already appears (HTTP-200 verified) elsewhere in the data
 * files, so no new/unverified URL is introduced. topicDocs merges. */
module.exports = {
  sections: {
    p1: {
      topicDocs: {
        "Anypoint Platform capabilities": "https://docs.mulesoft.com/general/glossary"
      }
    },
    p2: {
      topicDocs: {
        "Center for Enablement (C4E) in practice": "https://www.salesforce.com/blog/what-is-a-center-for-enablement/",
        "MuleSoft Catalyst": "https://docs.mulesoft.com/general/api-led-overview",
        "Platform hosting options and data residency": "https://docs.mulesoft.com/hosting-home/"
      }
    },
    p3: {
      topicDocs: {
        "Semantic versioning decisions": "https://semver.org/",
        "Idempotency and optimistic concurrency in HTTP": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods"
      }
    },
    p6: {
      topicDocs: {
        "Choosing runtime plane hosting": "https://docs.mulesoft.com/hosting-home/",
        "Testing: unit vs integration": "https://docs.mulesoft.com/munit/latest/munit-test-concept"
      }
    }
  }
};
