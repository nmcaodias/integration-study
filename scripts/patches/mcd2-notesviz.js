/* MCD2 · d2/d4/d5 notes had no diagram (d1/d3 each have one). Append one small
 * SVG + <h3> heading to each, and wire the heading into topicDocs (reusing URLs
 * already present in the bank). SVG <style> blocks leak document-wide, so each
 * uses a unique class prefix (.pp / .aw / .mu) distinct from existing .st/.t. */
module.exports = {
  sections: {
    d2: {
      appendNotes:
        '\n<h3>Build once, promote many</h3>\n' +
        '<p>The same artifact (one JAR from <code>mvn deploy</code>) moves through environments unchanged; only the externalized configuration differs per stage. You never rebuild per environment.</p>\n' +
        '<svg viewBox="0 0 640 130" style="max-width:640px;width:100%" role="img" aria-label="Build once, promote the same JAR across environments">\n' +
        '  <style>.pp-b{fill:none;stroke:currentColor;stroke-width:1.3}.pp-t{font:600 12px sans-serif;fill:currentColor}.pp-s{font:11px sans-serif;fill:currentColor;opacity:.8}.pp-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#ppA)}</style>\n' +
        '  <defs><marker id="ppA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="pp-b" x="8" y="46" width="120" height="42" rx="5"/>\n' +
        '  <text class="pp-t" x="68" y="63" text-anchor="middle">mvn deploy</text>\n' +
        '  <text class="pp-s" x="68" y="79" text-anchor="middle">one JAR + Exchange</text>\n' +
        '  <line class="pp-a" x1="128" y1="67" x2="176" y2="67"/>\n' +
        '  <rect class="pp-b" x="178" y="46" width="128" height="42" rx="5"/>\n' +
        '  <text class="pp-t" x="242" y="63" text-anchor="middle">DEV</text>\n' +
        '  <text class="pp-s" x="242" y="79" text-anchor="middle">dev.* properties</text>\n' +
        '  <line class="pp-a" x1="306" y1="67" x2="342" y2="67"/>\n' +
        '  <rect class="pp-b" x="344" y="46" width="128" height="42" rx="5"/>\n' +
        '  <text class="pp-t" x="408" y="63" text-anchor="middle">TEST</text>\n' +
        '  <text class="pp-s" x="408" y="79" text-anchor="middle">test.* properties</text>\n' +
        '  <line class="pp-a" x1="472" y1="67" x2="508" y2="67"/>\n' +
        '  <rect class="pp-b" x="510" y="46" width="122" height="42" rx="5"/>\n' +
        '  <text class="pp-t" x="571" y="63" text-anchor="middle">PROD</text>\n' +
        '  <text class="pp-s" x="571" y="79" text-anchor="middle">prod.* + secure::</text>\n' +
        '  <text class="pp-s" x="320" y="26" text-anchor="middle">same artifact — configuration is the only thing that changes</text>\n' +
        '  <text class="pp-s" x="320" y="112" text-anchor="middle">-Dmule.env selects the property file at deploy time</text>\n' +
        '</svg>',
      topicDocs: {
        "Build once, promote many": "https://docs.mulesoft.com/mule-runtime/latest/mmp-concept"
      }
    },
    d4: {
      appendNotes:
        '\n<h3>Where each alert lives</h3>\n' +
        '<p>Pick the plane that owns the signal: the deployed worker (Runtime Manager), the API instance and its policies (API Manager), or aggregated telemetry across apps (Anypoint Monitoring / Functional Monitoring).</p>\n' +
        '<svg viewBox="0 0 640 170" style="max-width:640px;width:100%" role="img" aria-label="Which plane owns which operational signal">\n' +
        '  <style>.aw-b{fill:none;stroke:currentColor;stroke-width:1.3}.aw-t{font:600 12px sans-serif;fill:currentColor}.aw-s{font:11px sans-serif;fill:currentColor;opacity:.8}</style>\n' +
        '  <rect class="aw-b" x="8" y="14" width="196" height="142" rx="6"/>\n' +
        '  <text class="aw-t" x="106" y="34" text-anchor="middle">Runtime Manager</text>\n' +
        '  <text class="aw-s" x="106" y="58" text-anchor="middle">app stopped / crashed</text>\n' +
        '  <text class="aw-s" x="106" y="78" text-anchor="middle">CPU / memory thresholds</text>\n' +
        '  <text class="aw-s" x="106" y="98" text-anchor="middle">deployment status</text>\n' +
        '  <text class="aw-s" x="106" y="130" text-anchor="middle">(the worker)</text>\n' +
        '  <rect class="aw-b" x="222" y="14" width="196" height="142" rx="6"/>\n' +
        '  <text class="aw-t" x="320" y="34" text-anchor="middle">API Manager</text>\n' +
        '  <text class="aw-s" x="320" y="58" text-anchor="middle">5xx rate on the API</text>\n' +
        '  <text class="aw-s" x="320" y="78" text-anchor="middle">policy violations</text>\n' +
        '  <text class="aw-s" x="320" y="98" text-anchor="middle">rate-limit / SLA breach</text>\n' +
        '  <text class="aw-s" x="320" y="130" text-anchor="middle">(the API instance)</text>\n' +
        '  <rect class="aw-b" x="436" y="14" width="196" height="142" rx="6"/>\n' +
        '  <text class="aw-t" x="534" y="34" text-anchor="middle">Monitoring / Functional</text>\n' +
        '  <text class="aw-s" x="534" y="58" text-anchor="middle">cross-app log search</text>\n' +
        '  <text class="aw-s" x="534" y="78" text-anchor="middle">trace by correlation ID</text>\n' +
        '  <text class="aw-s" x="534" y="98" text-anchor="middle">synthetic 200-but-wrong</text>\n' +
        '  <text class="aw-s" x="534" y="130" text-anchor="middle">(across apps)</text>\n' +
        '</svg>',
      topicDocs: {
        "Where each alert lives": "https://docs.mulesoft.com/runtime-manager/alerts-on-runtime-manager"
      }
    },
    d5: {
      appendNotes:
        '\n<h3>MUnit test phases</h3>\n' +
        '<p>An MUnit test reads top to bottom in three phases. Set up doubles in Behavior, run the flow in Execution, then check outcomes in Validation — mocks/spies are declared before the flow runs; asserts and verifies come after.</p>\n' +
        '<svg viewBox="0 0 640 120" style="max-width:640px;width:100%" role="img" aria-label="MUnit Behavior then Execution then Validation">\n' +
        '  <style>.mu-b{fill:none;stroke:currentColor;stroke-width:1.3}.mu-t{font:600 12px sans-serif;fill:currentColor}.mu-s{font:11px sans-serif;fill:currentColor;opacity:.8}.mu-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#muA)}</style>\n' +
        '  <defs><marker id="muA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="mu-b" x="8" y="40" width="182" height="48" rx="6"/>\n' +
        '  <text class="mu-t" x="99" y="60" text-anchor="middle">Behavior</text>\n' +
        '  <text class="mu-s" x="99" y="78" text-anchor="middle">mock-when · spy · set-event</text>\n' +
        '  <line class="mu-a" x1="190" y1="64" x2="226" y2="64"/>\n' +
        '  <rect class="mu-b" x="228" y="40" width="182" height="48" rx="6"/>\n' +
        '  <text class="mu-t" x="319" y="60" text-anchor="middle">Execution</text>\n' +
        '  <text class="mu-s" x="319" y="78" text-anchor="middle">flow-ref / real source runs</text>\n' +
        '  <line class="mu-a" x1="410" y1="64" x2="446" y2="64"/>\n' +
        '  <rect class="mu-b" x="448" y="40" width="184" height="48" rx="6"/>\n' +
        '  <text class="mu-t" x="540" y="60" text-anchor="middle">Validation</text>\n' +
        '  <text class="mu-s" x="540" y="78" text-anchor="middle">assert-that · verify-call</text>\n' +
        '  <text class="mu-s" x="320" y="24" text-anchor="middle">doubles declared before the run · outcomes checked after</text>\n' +
        '</svg>',
      topicDocs: {
        "MUnit test phases": "https://docs.mulesoft.com/munit/latest/munit-test-concept"
      }
    }
  }
};
