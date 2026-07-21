/* MCIA · add one small SVG diagram + doc-linked <h3> to four heavyweight
 * sections (a2 paradigm choice, a5 runtime-plane topology, a7 reliability
 * ladder, a10 build-once/promote). Reuses topicDocs URLs already in the bank.
 * Each SVG uses a unique class prefix (inline <style> leaks document-wide):
 * .ip (a2) / .rp (a5) / .rl (a7) / .bp (a10). */
module.exports = {
  sections: {
    a2: {
      appendNotes:
        '\n<h3>Sync or async — a decision map</h3>\n' +
        '<p>Two questions settle most integration-paradigm choices: does the caller need the answer in the same call, and must the work survive a downstream outage or fan out to many consumers?</p>\n' +
        '<svg viewBox="0 0 640 170" style="max-width:640px;width:100%" role="img" aria-label="Synchronous vs asynchronous decision map">\n' +
        '  <style>.ip-b{fill:none;stroke:currentColor;stroke-width:1.3}.ip-t{font:600 12px sans-serif;fill:currentColor}.ip-s{font:11px sans-serif;fill:currentColor;opacity:.8}.ip-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#ipA)}</style>\n' +
        '  <defs><marker id="ipA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="ip-b" x="232" y="10" width="176" height="34" rx="5"/>\n' +
        '  <text class="ip-t" x="320" y="31" text-anchor="middle">Caller needs answer now?</text>\n' +
        '  <line class="ip-a" x1="232" y1="27" x2="150" y2="62"/>\n' +
        '  <text class="ip-s" x="168" y="52">yes</text>\n' +
        '  <line class="ip-a" x1="408" y1="27" x2="490" y2="62"/>\n' +
        '  <text class="ip-s" x="452" y="52">no</text>\n' +
        '  <rect class="ip-b" x="44" y="64" width="212" height="40" rx="5"/>\n' +
        '  <text class="ip-t" x="150" y="80" text-anchor="middle">Sync HTTP request/reply</text>\n' +
        '  <text class="ip-s" x="150" y="96" text-anchor="middle">caller blocks, gets result</text>\n' +
        '  <rect class="ip-b" x="384" y="64" width="212" height="40" rx="5"/>\n' +
        '  <text class="ip-t" x="490" y="84" text-anchor="middle">Must survive outage / fan out?</text>\n' +
        '  <line class="ip-a" x1="440" y1="104" x2="360" y2="132"/>\n' +
        '  <text class="ip-s" x="384" y="124">yes</text>\n' +
        '  <rect class="ip-b" x="200" y="132" width="320" height="30" rx="5"/>\n' +
        '  <text class="ip-t" x="360" y="151" text-anchor="middle">Async broker / durable queue — pub/sub, store-and-forward</text>\n' +
        '  <text class="ip-s" x="600" y="124" text-anchor="end">at-least-once ⇒ idempotency</text>\n' +
        '</svg>',
      topicDocs: {
        "Sync or async — a decision map": "https://docs.mulesoft.com/mule-runtime/latest/reliability-patterns"
      }
    },
    a5: {
      appendNotes:
        '\n<h3>Where do the apps run?</h3>\n' +
        '<p>The control plane (design, deploy, monitor) is always MuleSoft-managed. What differs is the <em>runtime plane</em> — who owns the compute the apps execute on. That ownership question decides CloudHub vs Runtime Fabric vs hybrid.</p>\n' +
        '<svg viewBox="0 0 640 176" style="max-width:640px;width:100%" role="img" aria-label="Runtime plane options by who owns the compute">\n' +
        '  <style>.rp-b{fill:none;stroke:currentColor;stroke-width:1.3}.rp-t{font:600 12px sans-serif;fill:currentColor}.rp-s{font:11px sans-serif;fill:currentColor;opacity:.8}.rp-d{stroke:currentColor;stroke-width:1;stroke-dasharray:4 3}</style>\n' +
        '  <rect class="rp-b" x="8" y="8" width="624" height="30" rx="5"/>\n' +
        '  <text class="rp-t" x="320" y="27" text-anchor="middle">Anypoint control plane — MuleSoft-managed (design · deploy · monitor)</text>\n' +
        '  <line class="rp-d" x1="8" y1="50" x2="632" y2="50"/>\n' +
        '  <text class="rp-s" x="320" y="64" text-anchor="middle">runtime plane — who owns the compute?</text>\n' +
        '  <rect class="rp-b" x="8" y="74" width="200" height="94" rx="6"/>\n' +
        '  <text class="rp-t" x="108" y="94" text-anchor="middle">CloudHub 2.0</text>\n' +
        '  <text class="rp-s" x="108" y="116" text-anchor="middle">MuleSoft-hosted</text>\n' +
        '  <text class="rp-s" x="108" y="134" text-anchor="middle">workers + private space</text>\n' +
        '  <text class="rp-s" x="108" y="156" text-anchor="middle">least ops, fastest</text>\n' +
        '  <rect class="rp-b" x="220" y="74" width="200" height="94" rx="6"/>\n' +
        '  <text class="rp-t" x="320" y="94" text-anchor="middle">Runtime Fabric</text>\n' +
        '  <text class="rp-s" x="320" y="116" text-anchor="middle">customer&apos;s own k8s</text>\n' +
        '  <text class="rp-s" x="320" y="134" text-anchor="middle">data stays in-network</text>\n' +
        '  <text class="rp-s" x="320" y="156" text-anchor="middle">residency / private link</text>\n' +
        '  <rect class="rp-b" x="432" y="74" width="200" height="94" rx="6"/>\n' +
        '  <text class="rp-t" x="532" y="94" text-anchor="middle">Hybrid</text>\n' +
        '  <text class="rp-s" x="532" y="116" text-anchor="middle">Mule on customer VMs</text>\n' +
        '  <text class="rp-s" x="532" y="134" text-anchor="middle">most control</text>\n' +
        '  <text class="rp-s" x="532" y="156" text-anchor="middle">most ops to run</text>\n' +
        '</svg>',
      topicDocs: {
        "Where do the apps run?": "https://docs.mulesoft.com/cloudhub/cloudhub-networking-guide"
      }
    },
    a7: {
      appendNotes:
        '\n<h3>The reliability ladder</h3>\n' +
        '<p>Match the mechanism to the failure duration. Transient blips climb the left rungs; long outages or "must not lose it even if the app restarts" force you to the durable, persisted rungs on the right.</p>\n' +
        '<svg viewBox="0 0 640 128" style="max-width:640px;width:100%" role="img" aria-label="Reliability mechanisms from transient to durable">\n' +
        '  <style>.rl-b{fill:none;stroke:currentColor;stroke-width:1.3}.rl-t{font:600 12px sans-serif;fill:currentColor}.rl-s{font:11px sans-serif;fill:currentColor;opacity:.8}.rl-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#rlA)}</style>\n' +
        '  <defs><marker id="rlA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <text class="rl-s" x="12" y="20">transient failure</text>\n' +
        '  <text class="rl-s" x="628" y="20" text-anchor="end">long outage / restart-safe</text>\n' +
        '  <line class="rl-a" x1="12" y1="30" x2="628" y2="30"/>\n' +
        '  <rect class="rl-b" x="8" y="44" width="150" height="56" rx="5"/>\n' +
        '  <text class="rl-t" x="83" y="64" text-anchor="middle">Reconnection</text>\n' +
        '  <text class="rl-s" x="83" y="84" text-anchor="middle">connector retries</text>\n' +
        '  <rect class="rl-b" x="166" y="44" width="150" height="56" rx="5"/>\n' +
        '  <text class="rl-t" x="241" y="64" text-anchor="middle">Until Successful</text>\n' +
        '  <text class="rl-s" x="241" y="84" text-anchor="middle">in-memory retry</text>\n' +
        '  <rect class="rl-b" x="324" y="44" width="150" height="56" rx="5"/>\n' +
        '  <text class="rl-t" x="399" y="64" text-anchor="middle">Transaction</text>\n' +
        '  <text class="rl-s" x="399" y="84" text-anchor="middle">atomic commit/rollback</text>\n' +
        '  <rect class="rl-b" x="482" y="44" width="150" height="56" rx="5"/>\n' +
        '  <text class="rl-t" x="557" y="64" text-anchor="middle">Persistent queue</text>\n' +
        '  <text class="rl-s" x="557" y="84" text-anchor="middle">store-and-forward + DLQ</text>\n' +
        '</svg>',
      topicDocs: {
        "The reliability ladder": "https://docs.mulesoft.com/mule-runtime/latest/reliability-patterns"
      }
    },
    a10: {
      appendNotes:
        '\n<h3>Build once, promote many</h3>\n' +
        '<p>One artifact is built and tested a single time, then the <em>same</em> jar is promoted through environments — only configuration and secrets differ per stage. Rebuilding per environment breaks "tested equals deployed".</p>\n' +
        '<svg viewBox="0 0 640 132" style="max-width:640px;width:100%" role="img" aria-label="Build once then promote the same artifact">\n' +
        '  <style>.bp-b{fill:none;stroke:currentColor;stroke-width:1.3}.bp-t{font:600 12px sans-serif;fill:currentColor}.bp-s{font:11px sans-serif;fill:currentColor;opacity:.8}.bp-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#bpA)}</style>\n' +
        '  <defs><marker id="bpA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="bp-b" x="8" y="46" width="150" height="46" rx="5"/>\n' +
        '  <text class="bp-t" x="83" y="66" text-anchor="middle">package + MUnit</text>\n' +
        '  <text class="bp-s" x="83" y="83" text-anchor="middle">one jar → Exchange</text>\n' +
        '  <line class="bp-a" x1="158" y1="69" x2="196" y2="69"/>\n' +
        '  <rect class="bp-b" x="198" y="46" width="126" height="46" rx="5"/>\n' +
        '  <text class="bp-t" x="261" y="66" text-anchor="middle">DEV</text>\n' +
        '  <text class="bp-s" x="261" y="83" text-anchor="middle">dev props</text>\n' +
        '  <line class="bp-a" x1="324" y1="69" x2="360" y2="69"/>\n' +
        '  <rect class="bp-b" x="362" y="46" width="126" height="46" rx="5"/>\n' +
        '  <text class="bp-t" x="425" y="66" text-anchor="middle">TEST</text>\n' +
        '  <text class="bp-s" x="425" y="83" text-anchor="middle">test props</text>\n' +
        '  <line class="bp-a" x1="488" y1="69" x2="524" y2="69"/>\n' +
        '  <rect class="bp-b" x="526" y="46" width="106" height="46" rx="5"/>\n' +
        '  <text class="bp-t" x="579" y="66" text-anchor="middle">PROD</text>\n' +
        '  <text class="bp-s" x="579" y="83" text-anchor="middle">prod + secure::</text>\n' +
        '  <text class="bp-s" x="320" y="24" text-anchor="middle">same artifact — only config, secrets, and api.id change per env</text>\n' +
        '  <text class="bp-s" x="320" y="116" text-anchor="middle">-Dmule.env selects props · secure.key at deploy · autodiscovery pairs each env</text>\n' +
        '</svg>',
      topicDocs: {
        "Build once, promote many": "https://docs.mulesoft.com/mule-runtime/latest/mmp-concept"
      }
    }
  }
};
