/* MCD2 · point off-topic / generic-landing heading links at genuinely relevant
 * pages — the same audit run on MCD1 in b7c8e52.
 *
 * Only the 6 headings whose link pointed at an unrelated page or a bare product
 * root are repointed; each new target is a page that already appears (and was
 * HTTP-200 verified) elsewhere in the data files, so no new/unverified URL is
 * introduced. topicDocs is merged by apply-patches.js, so only the changed
 * headings are listed. Notes/questions are untouched.
 *
 *   d2 Semantic versioning decisions      api-governance (off-topic) -> semver.org
 *   d1 Object Store for state/idempotency  connector root -> Object Store v2 service
 *   d4 Where each alert lives              monitoring root -> Runtime Manager alerts
 *   d4 Monitoring vs. Functional Monitoring monitoring root -> Functional Monitoring
 *   d5 MUnit tools: mock/spy/verify/assert  munit root -> MUnit test concept
 *   d5 Deprecating an API version gracefully api-manager root -> API Manager overview
 */
module.exports = {
  sections: {
    d1: {
      topicDocs: {
        "Object Store for state and idempotency":
          "https://docs.mulesoft.com/object-store/"
      }
    },
    d2: {
      topicDocs: {
        "Semantic versioning decisions": "https://semver.org/"
      }
    },
    d4: {
      topicDocs: {
        "Where each alert lives":
          "https://docs.mulesoft.com/runtime-manager/alerts-on-runtime-manager",
        "Anypoint Monitoring vs. Functional Monitoring":
          "https://docs.mulesoft.com/api-functional-monitoring/"
      }
    },
    d5: {
      topicDocs: {
        "MUnit tools: mock, spy, verify, assert":
          "https://docs.mulesoft.com/munit/latest/munit-test-concept",
        "Deprecating an API version gracefully":
          "https://docs.mulesoft.com/api-manager/latest/latest-overview-concept"
      }
    }
  }
};
