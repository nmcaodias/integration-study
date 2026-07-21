/* MCPA · add one small SVG diagram + doc-linked <h3> to the four heavyweight
 * sections (p4 API-led layering, p5 governance flow, p7 CloudHub HA topology,
 * p9 where each alert lives). Reuses topicDocs URLs already in those sections.
 * Unique SVG class prefixes (inline <style> leaks document-wide), distinct from
 * existing .st/.t and MCIA's .ip/.rp/.rl/.bp: .la (p4) / .gv (p5) / .ch (p7) /
 * .aw (p9). */
module.exports = {
  sections: {
    p4: {
      appendNotes:
        '\n<h3>Layers and the direction of reuse</h3>\n' +
        '<p>Dependencies point downward only: Experience APIs call Process APIs, Process APIs call System APIs. Reuse concentrates in the lower layers; Experience APIs stay channel-specific.</p>\n' +
        '<svg viewBox="0 0 640 168" style="max-width:640px;width:100%" role="img" aria-label="Experience over Process over System API layers">\n' +
        '  <style>.la-b{fill:none;stroke:currentColor;stroke-width:1.3}.la-t{font:600 12px sans-serif;fill:currentColor}.la-s{font:11px sans-serif;fill:currentColor;opacity:.8}.la-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#laA)}</style>\n' +
        '  <defs><marker id="laA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="la-b" x="120" y="12" width="180" height="34" rx="5"/>\n' +
        '  <text class="la-t" x="210" y="33" text-anchor="middle">Web Experience API</text>\n' +
        '  <rect class="la-b" x="340" y="12" width="180" height="34" rx="5"/>\n' +
        '  <text class="la-t" x="430" y="33" text-anchor="middle">Partner Experience API</text>\n' +
        '  <line class="la-a" x1="210" y1="46" x2="300" y2="70"/>\n' +
        '  <line class="la-a" x1="430" y1="46" x2="340" y2="70"/>\n' +
        '  <rect class="la-b" x="230" y="72" width="180" height="34" rx="5"/>\n' +
        '  <text class="la-t" x="320" y="93" text-anchor="middle">Place Order Process API</text>\n' +
        '  <line class="la-a" x1="270" y1="106" x2="150" y2="130"/>\n' +
        '  <line class="la-a" x1="320" y1="106" x2="320" y2="130"/>\n' +
        '  <line class="la-a" x1="370" y1="106" x2="490" y2="130"/>\n' +
        '  <rect class="la-b" x="60" y="132" width="170" height="30" rx="5"/>\n' +
        '  <text class="la-t" x="145" y="151" text-anchor="middle">Salesforce System API</text>\n' +
        '  <rect class="la-b" x="240" y="132" width="160" height="30" rx="5"/>\n' +
        '  <text class="la-t" x="320" y="151" text-anchor="middle">Inventory System API</text>\n' +
        '  <rect class="la-b" x="410" y="132" width="170" height="30" rx="5"/>\n' +
        '  <text class="la-t" x="495" y="151" text-anchor="middle">SAP Orders System API</text>\n' +
        '  <text class="la-s" x="600" y="90" text-anchor="end">reuse ↑ lives here</text>\n' +
        '</svg>',
      topicDocs: {
        "Layers and the direction of reuse": "https://docs.mulesoft.com/general/api-led-overview"
      }
    },
    p5: {
      appendNotes:
        '\n<h3>How governance is applied to an API</h3>\n' +
        '<p>Policies and SLA tiers live on the API <em>instance</em> in API Manager; a consumer\'s client application requests a tier and gets a contract; autodiscovery binds that instance to the running implementation.</p>\n' +
        '<svg viewBox="0 0 640 150" style="max-width:640px;width:100%" role="img" aria-label="API instance with policies and SLA tiers, client contract, autodiscovery">\n' +
        '  <style>.gv-b{fill:none;stroke:currentColor;stroke-width:1.3}.gv-t{font:600 12px sans-serif;fill:currentColor}.gv-s{font:11px sans-serif;fill:currentColor;opacity:.8}.gv-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#gvA)}.gv-d{stroke:currentColor;stroke-width:1;stroke-dasharray:4 3}</style>\n' +
        '  <defs><marker id="gvA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="gv-b" x="210" y="14" width="220" height="72" rx="6"/>\n' +
        '  <text class="gv-t" x="320" y="34" text-anchor="middle">API instance (API Manager)</text>\n' +
        '  <text class="gv-s" x="320" y="54" text-anchor="middle">policies: Client ID · Rate-Limit-SLA</text>\n' +
        '  <text class="gv-s" x="320" y="72" text-anchor="middle">SLA tiers: Free / Gold</text>\n' +
        '  <rect class="gv-b" x="14" y="26" width="150" height="48" rx="6"/>\n' +
        '  <text class="gv-t" x="89" y="46" text-anchor="middle">Client application</text>\n' +
        '  <text class="gv-s" x="89" y="64" text-anchor="middle">requests a tier</text>\n' +
        '  <line class="gv-a" x1="164" y1="50" x2="210" y2="50"/>\n' +
        '  <text class="gv-s" x="187" y="42" text-anchor="middle">contract</text>\n' +
        '  <rect class="gv-b" x="476" y="26" width="150" height="48" rx="6"/>\n' +
        '  <text class="gv-t" x="551" y="46" text-anchor="middle">Mule implementation</text>\n' +
        '  <text class="gv-s" x="551" y="64" text-anchor="middle">enforces policies</text>\n' +
        '  <line class="gv-d" x1="430" y1="50" x2="476" y2="50"/>\n' +
        '  <text class="gv-s" x="453" y="42" text-anchor="middle">autodiscovery</text>\n' +
        '  <text class="gv-s" x="320" y="112" text-anchor="middle">api.id + platform credentials pair the running app to this instance</text>\n' +
        '  <text class="gv-s" x="320" y="130" text-anchor="middle">tier request → approval → contract (client_id / secret) → enforced limits</text>\n' +
        '</svg>',
      topicDocs: {
        "How governance is applied to an API": "https://docs.mulesoft.com/api-manager/latest/latest-overview-concept"
      }
    },
    p7: {
      appendNotes:
        '\n<h3>An HA CloudHub topology</h3>\n' +
        '<p>Remove single points of failure: run two or more workers across availability zones, share state in Object Store v2, and front them with a Dedicated Load Balancer (custom domain/TLS) — inside a VPC when private access is needed.</p>\n' +
        '<svg viewBox="0 0 640 168" style="max-width:640px;width:100%" role="img" aria-label="Two CloudHub workers behind a dedicated load balancer sharing Object Store v2">\n' +
        '  <style>.ch-b{fill:none;stroke:currentColor;stroke-width:1.3}.ch-t{font:600 12px sans-serif;fill:currentColor}.ch-s{font:11px sans-serif;fill:currentColor;opacity:.8}.ch-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#chA)}.ch-d{stroke:currentColor;stroke-width:1;stroke-dasharray:5 4}</style>\n' +
        '  <defs><marker id="chA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="ch-d" x="14" y="40" width="612" height="118" rx="8"/>\n' +
        '  <text class="ch-s" x="24" y="56">Anypoint VPC (when private access / IP control needed)</text>\n' +
        '  <rect class="ch-b" x="234" y="16" width="172" height="30" rx="5"/>\n' +
        '  <text class="ch-t" x="320" y="35" text-anchor="middle">Dedicated Load Balancer</text>\n' +
        '  <line class="ch-a" x1="290" y1="46" x2="170" y2="72"/>\n' +
        '  <line class="ch-a" x1="350" y1="46" x2="470" y2="72"/>\n' +
        '  <rect class="ch-b" x="86" y="74" width="170" height="40" rx="5"/>\n' +
        '  <text class="ch-t" x="171" y="92" text-anchor="middle">Worker 1</text>\n' +
        '  <text class="ch-s" x="171" y="108" text-anchor="middle">AZ a</text>\n' +
        '  <rect class="ch-b" x="384" y="74" width="170" height="40" rx="5"/>\n' +
        '  <text class="ch-t" x="469" y="92" text-anchor="middle">Worker 2</text>\n' +
        '  <text class="ch-s" x="469" y="108" text-anchor="middle">AZ b</text>\n' +
        '  <rect class="ch-b" x="234" y="124" width="172" height="30" rx="5"/>\n' +
        '  <text class="ch-t" x="320" y="143" text-anchor="middle">Object Store v2 (shared)</text>\n' +
        '  <line class="ch-a" x1="171" y1="114" x2="270" y2="128"/>\n' +
        '  <line class="ch-a" x1="469" y1="114" x2="370" y2="128"/>\n' +
        '</svg>',
      topicDocs: {
        "An HA CloudHub topology": "https://docs.mulesoft.com/cloudhub/cloudhub-fabric"
      }
    },
    p9: {
      appendNotes:
        '\n<h3>Where each alert lives</h3>\n' +
        '<p>Pick the plane that owns the signal: the deployed worker (Runtime Manager), the API instance and its policies (API Manager), aggregated telemetry and logs across apps (Anypoint Monitoring), or synthetic correctness checks (Functional Monitoring).</p>\n' +
        '<svg viewBox="0 0 640 150" style="max-width:640px;width:100%" role="img" aria-label="Which plane owns which monitoring signal">\n' +
        '  <style>.aw-b{fill:none;stroke:currentColor;stroke-width:1.3}.aw-t{font:600 12px sans-serif;fill:currentColor}.aw-s{font:11px sans-serif;fill:currentColor;opacity:.8}</style>\n' +
        '  <rect class="aw-b" x="8" y="14" width="150" height="122" rx="6"/>\n' +
        '  <text class="aw-t" x="83" y="34" text-anchor="middle">Runtime Manager</text>\n' +
        '  <text class="aw-s" x="83" y="58" text-anchor="middle">app stopped</text>\n' +
        '  <text class="aw-s" x="83" y="76" text-anchor="middle">worker crash</text>\n' +
        '  <text class="aw-s" x="83" y="94" text-anchor="middle">CPU / memory</text>\n' +
        '  <rect class="aw-b" x="166" y="14" width="150" height="122" rx="6"/>\n' +
        '  <text class="aw-t" x="241" y="34" text-anchor="middle">API Manager</text>\n' +
        '  <text class="aw-s" x="241" y="58" text-anchor="middle">5xx rate</text>\n' +
        '  <text class="aw-s" x="241" y="76" text-anchor="middle">policy violation</text>\n' +
        '  <text class="aw-s" x="241" y="94" text-anchor="middle">SLA breach</text>\n' +
        '  <rect class="aw-b" x="324" y="14" width="150" height="122" rx="6"/>\n' +
        '  <text class="aw-t" x="399" y="34" text-anchor="middle">Anypoint Monitoring</text>\n' +
        '  <text class="aw-s" x="399" y="58" text-anchor="middle">cross-app logs</text>\n' +
        '  <text class="aw-s" x="399" y="76" text-anchor="middle">trace by corr. id</text>\n' +
        '  <text class="aw-s" x="399" y="94" text-anchor="middle">metrics dashboards</text>\n' +
        '  <rect class="aw-b" x="482" y="14" width="150" height="122" rx="6"/>\n' +
        '  <text class="aw-t" x="557" y="34" text-anchor="middle">Functional Monitoring</text>\n' +
        '  <text class="aw-s" x="557" y="58" text-anchor="middle">synthetic calls</text>\n' +
        '  <text class="aw-s" x="557" y="76" text-anchor="middle">"correct right now?"</text>\n' +
        '  <text class="aw-s" x="557" y="94" text-anchor="middle">200-but-wrong</text>\n' +
        '</svg>',
      topicDocs: {
        "Where each alert lives": "https://docs.mulesoft.com/monitoring/"
      }
    }
  }
};
