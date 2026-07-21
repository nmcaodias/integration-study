/* EIP · add one SVG diagram + doc-linked <h3> to four core sections (b4 channels,
 * b6 routing, b7 transformation, b8 endpoints) — the patterns book is inherently
 * visual and none of the sections had a diagram. Reuses EIP doc URLs already in
 * those sections. Unique SVG class prefixes (inline <style> leaks within the
 * page): .e4 / .e6 / .e7 / .e8. */
module.exports = {
  sections: {
    b4: {
      appendNotes:
        '\n<h3>Point-to-Point vs Publish-Subscribe</h3>\n' +
        '<p>The core channel choice: deliver each message to <em>exactly one</em> receiver (competing workers), or a <em>copy to every</em> subscriber (event broadcast).</p>\n' +
        '<svg viewBox="0 0 640 150" style="max-width:640px;width:100%" role="img" aria-label="Point-to-point delivers to one receiver, publish-subscribe to all">\n' +
        '  <style>.e4-b{fill:none;stroke:currentColor;stroke-width:1.3}.e4-t{font:600 12px sans-serif;fill:currentColor}.e4-s{font:11px sans-serif;fill:currentColor;opacity:.8}.e4-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#e4A)}.e4-d{stroke:currentColor;stroke-width:1;stroke-dasharray:3 3;marker-end:url(#e4A)}</style>\n' +
        '  <defs><marker id="e4A" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <text class="e4-s" x="160" y="16" text-anchor="middle">Point-to-Point (one receiver)</text>\n' +
        '  <rect class="e4-b" x="16" y="52" width="70" height="30" rx="5"/><text class="e4-t" x="51" y="71" text-anchor="middle">sender</text>\n' +
        '  <line class="e4-a" x1="86" y1="67" x2="140" y2="67"/>\n' +
        '  <rect class="e4-b" x="142" y="52" width="46" height="30" rx="4"/><text class="e4-s" x="165" y="71" text-anchor="middle">queue</text>\n' +
        '  <line class="e4-a" x1="188" y1="60" x2="236" y2="42"/>\n' +
        '  <line class="e4-d" x1="188" y1="74" x2="236" y2="92"/>\n' +
        '  <rect class="e4-b" x="238" y="28" width="70" height="28" rx="5"/><text class="e4-s" x="273" y="46" text-anchor="middle">worker A ✓</text>\n' +
        '  <rect class="e4-b" x="238" y="78" width="70" height="28" rx="5"/><text class="e4-s" x="273" y="96" text-anchor="middle">worker B</text>\n' +
        '  <line x1="330" y1="20" x2="330" y2="130" stroke="currentColor" stroke-width="1" opacity=".4"/>\n' +
        '  <text class="e4-s" x="500" y="16" text-anchor="middle">Publish-Subscribe (copy to all)</text>\n' +
        '  <rect class="e4-b" x="356" y="52" width="70" height="30" rx="5"/><text class="e4-t" x="391" y="71" text-anchor="middle">publisher</text>\n' +
        '  <line class="e4-a" x1="426" y1="67" x2="472" y2="67"/>\n' +
        '  <rect class="e4-b" x="474" y="52" width="40" height="30" rx="4"/><text class="e4-s" x="494" y="71" text-anchor="middle">topic</text>\n' +
        '  <line class="e4-a" x1="514" y1="60" x2="560" y2="34"/>\n' +
        '  <line class="e4-a" x1="514" y1="67" x2="560" y2="67"/>\n' +
        '  <line class="e4-a" x1="514" y1="74" x2="560" y2="100"/>\n' +
        '  <rect class="e4-b" x="562" y="22" width="66" height="24" rx="4"/><text class="e4-s" x="595" y="38" text-anchor="middle">sub 1 ✓</text>\n' +
        '  <rect class="e4-b" x="562" y="55" width="66" height="24" rx="4"/><text class="e4-s" x="595" y="71" text-anchor="middle">sub 2 ✓</text>\n' +
        '  <rect class="e4-b" x="562" y="88" width="66" height="24" rx="4"/><text class="e4-s" x="595" y="104" text-anchor="middle">sub 3 ✓</text>\n' +
        '</svg>',
      topicDocs: {
        "Point-to-Point vs Publish-Subscribe": "https://www.enterpriseintegrationpatterns.com/patterns/messaging/PublishSubscribeChannel.html"
      }
    },
    b6: {
      appendNotes:
        '\n<h3>Content-Based Router at a glance</h3>\n' +
        '<p>One inbound channel, inspected by content, forwarded to exactly one destination — the sender never learns who the recipients are.</p>\n' +
        '<svg viewBox="0 0 640 148" style="max-width:640px;width:100%" role="img" aria-label="A content-based router sends each message to one destination by its content">\n' +
        '  <style>.e6-b{fill:none;stroke:currentColor;stroke-width:1.3}.e6-t{font:600 12px sans-serif;fill:currentColor}.e6-s{font:11px sans-serif;fill:currentColor;opacity:.8}.e6-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#e6A)}</style>\n' +
        '  <defs><marker id="e6A" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="e6-b" x="14" y="58" width="86" height="32" rx="5"/><text class="e6-t" x="57" y="78" text-anchor="middle">orders</text>\n' +
        '  <line class="e6-a" x1="100" y1="74" x2="150" y2="74"/>\n' +
        '  <path class="e6-b" d="M154 74 L200 50 L246 74 L200 98 Z"/>\n' +
        '  <text class="e6-s" x="200" y="70" text-anchor="middle">router</text>\n' +
        '  <text class="e6-s" x="200" y="84" text-anchor="middle">by type</text>\n' +
        '  <line class="e6-a" x1="246" y1="64" x2="430" y2="30"/><text class="e6-s" x="330" y="34" text-anchor="middle">DIGITAL</text>\n' +
        '  <line class="e6-a" x1="246" y1="74" x2="430" y2="74"/><text class="e6-s" x="330" y="68" text-anchor="middle">PHYSICAL</text>\n' +
        '  <line class="e6-a" x1="246" y1="84" x2="430" y2="118"/><text class="e6-s" x="330" y="112" text-anchor="middle">SUBSCRIPTION</text>\n' +
        '  <rect class="e6-b" x="432" y="16" width="150" height="28" rx="5"/><text class="e6-s" x="507" y="34" text-anchor="middle">fulfilment-digital</text>\n' +
        '  <rect class="e6-b" x="432" y="60" width="150" height="28" rx="5"/><text class="e6-s" x="507" y="78" text-anchor="middle">warehouse</text>\n' +
        '  <rect class="e6-b" x="432" y="104" width="150" height="28" rx="5"/><text class="e6-s" x="507" y="122" text-anchor="middle">billing</text>\n' +
        '</svg>',
      topicDocs: {
        "Content-Based Router at a glance": "https://www.enterpriseintegrationpatterns.com/patterns/messaging/ContentBasedRouter.html"
      }
    },
    b7: {
      appendNotes:
        '\n<h3>The Canonical Data Model hub</h3>\n' +
        '<p>Each application translates only between its own format and one shared canonical model, so adding a system is one new translator — not a change everywhere.</p>\n' +
        '<svg viewBox="0 0 640 150" style="max-width:640px;width:100%" role="img" aria-label="Applications translate to and from a shared canonical model">\n' +
        '  <style>.e7-b{fill:none;stroke:currentColor;stroke-width:1.3}.e7-t{font:600 12px sans-serif;fill:currentColor}.e7-s{font:11px sans-serif;fill:currentColor;opacity:.8}.e7-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#e7A)}</style>\n' +
        '  <defs><marker id="e7A" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="e7-b" x="14" y="20" width="96" height="26" rx="5"/><text class="e7-s" x="62" y="37" text-anchor="middle">CSV partner</text>\n' +
        '  <rect class="e7-b" x="14" y="62" width="96" height="26" rx="5"/><text class="e7-s" x="62" y="79" text-anchor="middle">XML partner</text>\n' +
        '  <rect class="e7-b" x="14" y="104" width="96" height="26" rx="5"/><text class="e7-s" x="62" y="121" text-anchor="middle">JSON partner</text>\n' +
        '  <line class="e7-a" x1="110" y1="33" x2="250" y2="66"/>\n' +
        '  <line class="e7-a" x1="110" y1="75" x2="250" y2="75"/>\n' +
        '  <line class="e7-a" x1="110" y1="117" x2="250" y2="84"/>\n' +
        '  <text class="e7-s" x="180" y="52" text-anchor="middle">translators</text>\n' +
        '  <circle class="e7-b" cx="320" cy="75" r="46"/>\n' +
        '  <text class="e7-t" x="320" y="72" text-anchor="middle">Canonical</text>\n' +
        '  <text class="e7-s" x="320" y="88" text-anchor="middle">Customer</text>\n' +
        '  <line class="e7-a" x1="366" y1="75" x2="452" y2="75"/>\n' +
        '  <rect class="e7-b" x="454" y="40" width="170" height="26" rx="5"/><text class="e7-s" x="539" y="57" text-anchor="middle">downstream app 1</text>\n' +
        '  <rect class="e7-b" x="454" y="84" width="170" height="26" rx="5"/><text class="e7-s" x="539" y="101" text-anchor="middle">downstream app 2</text>\n' +
        '</svg>',
      topicDocs: {
        "The Canonical Data Model hub": "https://www.enterpriseintegrationpatterns.com/patterns/messaging/CanonicalDataModel.html"
      }
    },
    b8: {
      appendNotes:
        '\n<h3>Competing Consumers</h3>\n' +
        '<p>Several consumers pull from one channel; each message is handled by exactly one of them, so throughput scales with the number of consumers (at the cost of ordering).</p>\n' +
        '<svg viewBox="0 0 640 140" style="max-width:640px;width:100%" role="img" aria-label="Several competing consumers each take one message from a shared queue">\n' +
        '  <style>.e8-b{fill:none;stroke:currentColor;stroke-width:1.3}.e8-t{font:600 12px sans-serif;fill:currentColor}.e8-s{font:11px sans-serif;fill:currentColor;opacity:.8}.e8-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#e8A)}</style>\n' +
        '  <defs><marker id="e8A" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="e8-b" x="14" y="54" width="80" height="32" rx="5"/><text class="e8-t" x="54" y="74" text-anchor="middle">producer</text>\n' +
        '  <line class="e8-a" x1="94" y1="70" x2="140" y2="70"/>\n' +
        '  <rect class="e8-b" x="142" y="52" width="150" height="36" rx="4"/>\n' +
        '  <text class="e8-s" x="217" y="74" text-anchor="middle">queue: m1 m2 m3 m4 ...</text>\n' +
        '  <line class="e8-a" x1="292" y1="60" x2="360" y2="30"/>\n' +
        '  <line class="e8-a" x1="292" y1="70" x2="360" y2="70"/>\n' +
        '  <line class="e8-a" x1="292" y1="80" x2="360" y2="110"/>\n' +
        '  <rect class="e8-b" x="362" y="16" width="120" height="28" rx="5"/><text class="e8-s" x="422" y="34" text-anchor="middle">consumer 1 → m1</text>\n' +
        '  <rect class="e8-b" x="362" y="56" width="120" height="28" rx="5"/><text class="e8-s" x="422" y="74" text-anchor="middle">consumer 2 → m2</text>\n' +
        '  <rect class="e8-b" x="362" y="96" width="120" height="28" rx="5"/><text class="e8-s" x="422" y="114" text-anchor="middle">consumer 3 → m3</text>\n' +
        '  <text class="e8-s" x="560" y="70" text-anchor="middle">each message<tspan x="560" dy="15">handled once</tspan></text>\n' +
        '</svg>',
      topicDocs: {
        "Competing Consumers": "https://www.enterpriseintegrationpatterns.com/patterns/messaging/CompetingConsumers.html"
      }
    }
  }
};
