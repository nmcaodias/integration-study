/* EIP · additional light de-bias. The bank still carried a length tell
 * (longest-correct 34% / ratio 1.35x) after the original pass. Extend the top
 * distractor past the correct answer on the questions where the correct option
 * was longest. No new questions, no level changes (EIP is already fully leveled).
 * Answers/meaning unchanged. */
module.exports = {
  questions: {
    "eip-407": { optionEdits: { 0: "So the messaging system can validate each payload's schema against the channel's declared datatype for you" } },
    "eip-202": { optionEdits: { 2: "It fundamentally cannot cross operating-system or hardware-platform boundaries between the two systems" } },
    "eip-307": { optionEdits: { 0: "Messages will be silently duplicated three times over to the downstream processing step in the pipeline" } },
    "eip-704": { optionEdits: { 2: "Every application must additionally adopt the shared canonical format for all of its own internal processing" } },
    "eip-708": { optionEdits: { 3: "Apply a single shared Canonical Data Model across all four of the intermediate routing components that sit along the path" } },
    "eip-505": { optionEdits: { 0: "One bidirectional channel carrying both the request and the correlated reply back over the same single link" } },
    "eip-810": { optionEdits: { 1: "Every consumer receives its own separate copy of every message, tripling the total downstream processing work" } },
    "eip-807": { optionEdits: { 0: "It transparently compresses all outbound message traffic in order to save network bandwidth across the entire system" } },
    "eip-608": { optionEdits: { 2: "Promise: it guarantees strict global message ordering; risk: one slow consumer can stall the entire pipeline for everyone" } },
    "eip-301": { optionEdits: { 3: "Header (used by the receiver) and body (used by the messaging system itself for routing decisions)" } },
    "eip-809": { optionEdits: { 0: "There is no problem at all, because point-to-point channels always preserve strict processing order across every competing consumer" } },
    "eip-902": { optionEdits: { 2: "Because two entirely different Return Addresses simply cannot ever coexist within one single message header at the same time" } }
  }
};
