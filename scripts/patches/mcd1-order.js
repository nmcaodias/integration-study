/* MCD1 · reorder sections into the official Salesforce Certified MuleSoft
 * Developer exam-outline order. The stored order had Routing/Errors/Transforming
 * before Connectors/Records; the outline is:
 *   1 Creating Application Networks (7%)            -> s1
 *   2 Designing APIs (8%)                           -> s2
 *   3 Accessing and Modifying Mule Events (10%)     -> s3
 *   4 Structuring Mule Applications (10%)           -> s4
 *   5 Building API Implementation Interfaces (7%)   -> s5
 *   6 Using Connectors (10%)                        -> s9
 *   7 Processing Records (10%)                      -> s10
 *   8 Transforming Data (10%)                       -> s8
 *   9 Routing Events (8%)                           -> s6
 *  10 Handling Errors (8%)                          -> s7
 *  11 Debugging and Troubleshooting (5%)            -> s11
 *  12 Deploying and Managing APIs and Integrations (7%) -> s12
 * Section ids are unchanged (question/exercise FKs stay valid); only array
 * order changes, which is what the app renders by. */
module.exports = {
  sectionOrder: ["s1", "s2", "s3", "s4", "s5", "s9", "s10", "s8", "s6", "s7", "s11", "s12"]
};
