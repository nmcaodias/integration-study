/* MCD1 · make context-dependent questions self-contained.
 * m1-133 and m1-145 referenced a sibling question ("same flow"), which breaks
 * when questions are shuffled or shown as an isolated flashcard. Reword the
 * prompt and put the full flow in each exhibit. Answers/options unchanged. */
module.exports = {
  questions: {
    "m1-133": {
      q: "An HTTP Request is configured with target and targetValue as shown. What are the payload and vars.inventory after it completes?",
      exhibit:
        "<flow name=\"orders\">\n" +
        "  <http:listener path=\"/orders\"/>          <!-- request body: {\"id\": 7} -->\n" +
        "  <http:request method=\"GET\" path=\"/inventory\"\n" +
        "                target=\"inventory\"\n" +
        "                targetValue=\"#[payload.stock]\"/>   <!-- HTTP response: {\"stock\": 3} -->\n" +
        "</flow>"
    },
    "m1-145": {
      q: "An HTTP-triggered flow calls a backend that throws HTTP:NOT_FOUND, then the error handler shown runs. What does the client receive?",
      exhibit:
        "<flow name=\"main\">\n" +
        "  <http:listener path=\"/data\"/>\n" +
        "  <http:request path=\"/backend\"/>          <!-- throws HTTP:NOT_FOUND -->\n" +
        "  <set-payload value='{\"ok\": true}'/>\n" +
        "  <error-handler>\n" +
        "    <on-error-propagate type=\"HTTP:NOT_FOUND\">\n" +
        "      <set-payload value='{\"fallback\": true}'/>\n" +
        "    </on-error-propagate>\n" +
        "  </error-handler>\n" +
        "</flow>"
    }
  }
};
