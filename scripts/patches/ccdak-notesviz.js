/* CCDAK · add one SVG diagram + doc-linked <h3> to k1/k2/k3/k6 (k4 already has
 * one). Reuses topicDocs URLs already present in each section. Unique SVG class
 * prefixes (inline <style> leaks within the page), distinct from existing .kc
 * (k4) and .st/.t: .kp (k1) / .ka (k2) / .kt (k3) / .kl (k6). */
module.exports = {
  sections: {
    k1: {
      appendNotes:
        '\n<h3>Partitions map to consumers in a group</h3>\n' +
        '<p>A consumer group divides a topic\'s partitions among its members, so the maximum useful parallelism equals the partition count. Any consumer beyond that sits idle; a different group.id gets its own full copy of the stream.</p>\n' +
        '<svg viewBox="0 0 640 168" style="max-width:640px;width:100%" role="img" aria-label="Four partitions assigned across consumers in a group">\n' +
        '  <style>.kp-b{fill:none;stroke:currentColor;stroke-width:1.3}.kp-t{font:600 12px sans-serif;fill:currentColor}.kp-s{font:11px sans-serif;fill:currentColor;opacity:.8}.kp-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#kpA)}</style>\n' +
        '  <defs><marker id="kpA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <text class="kp-s" x="70" y="20" text-anchor="middle">topic: orders</text>\n' +
        '  <rect class="kp-b" x="14" y="26" width="112" height="24" rx="4"/><text class="kp-t" x="70" y="43" text-anchor="middle">partition 0</text>\n' +
        '  <rect class="kp-b" x="14" y="56" width="112" height="24" rx="4"/><text class="kp-t" x="70" y="73" text-anchor="middle">partition 1</text>\n' +
        '  <rect class="kp-b" x="14" y="86" width="112" height="24" rx="4"/><text class="kp-t" x="70" y="103" text-anchor="middle">partition 2</text>\n' +
        '  <rect class="kp-b" x="14" y="116" width="112" height="24" rx="4"/><text class="kp-t" x="70" y="133" text-anchor="middle">partition 3</text>\n' +
        '  <text class="kp-s" x="435" y="20" text-anchor="middle">consumer group g1 (2 consumers)</text>\n' +
        '  <rect class="kp-b" x="360" y="34" width="150" height="40" rx="5"/><text class="kp-t" x="435" y="52" text-anchor="middle">consumer A</text><text class="kp-s" x="435" y="68" text-anchor="middle">partitions 0, 1</text>\n' +
        '  <rect class="kp-b" x="360" y="92" width="150" height="40" rx="5"/><text class="kp-t" x="435" y="110" text-anchor="middle">consumer B</text><text class="kp-s" x="435" y="126" text-anchor="middle">partitions 2, 3</text>\n' +
        '  <line class="kp-a" x1="126" y1="38" x2="360" y2="48"/>\n' +
        '  <line class="kp-a" x1="126" y1="68" x2="360" y2="58"/>\n' +
        '  <line class="kp-a" x1="126" y1="98" x2="360" y2="108"/>\n' +
        '  <line class="kp-a" x1="126" y1="128" x2="360" y2="118"/>\n' +
        '  <text class="kp-s" x="628" y="150" text-anchor="end">a 5th consumer (&gt; 4 partitions) would sit idle</text>\n' +
        '</svg>',
      topicDocs: {
        "Partitions map to consumers in a group": "https://docs.confluent.io/platform/current/clients/consumer.html"
      }
    },
    k2: {
      appendNotes:
        '\n<h3>Delivery semantics at a glance</h3>\n' +
        '<p>The guarantee you get is a function of producer and consumer configuration. Pick the row the requirement demands — stronger guarantees cost a little latency and coordination.</p>\n' +
        '<svg viewBox="0 0 640 150" style="max-width:640px;width:100%" role="img" aria-label="At-most-once, at-least-once, exactly-once configuration map">\n' +
        '  <style>.ka-b{fill:none;stroke:currentColor;stroke-width:1.3}.ka-t{font:600 12px sans-serif;fill:currentColor}.ka-s{font:11px sans-serif;fill:currentColor;opacity:.8}</style>\n' +
        '  <rect class="ka-b" x="8" y="14" width="200" height="122" rx="6"/>\n' +
        '  <text class="ka-t" x="108" y="34" text-anchor="middle">At-most-once</text>\n' +
        '  <text class="ka-s" x="108" y="58" text-anchor="middle">commit before process</text>\n' +
        '  <text class="ka-s" x="108" y="78" text-anchor="middle">acks=0/1</text>\n' +
        '  <text class="ka-s" x="108" y="104" text-anchor="middle">may LOSE, no dupes</text>\n' +
        '  <rect class="ka-b" x="220" y="14" width="200" height="122" rx="6"/>\n' +
        '  <text class="ka-t" x="320" y="34" text-anchor="middle">At-least-once</text>\n' +
        '  <text class="ka-s" x="320" y="58" text-anchor="middle">commit after process</text>\n' +
        '  <text class="ka-s" x="320" y="78" text-anchor="middle">acks=all, retries&gt;0</text>\n' +
        '  <text class="ka-s" x="320" y="104" text-anchor="middle">no loss, may DUPLICATE</text>\n' +
        '  <rect class="ka-b" x="432" y="14" width="200" height="122" rx="6"/>\n' +
        '  <text class="ka-t" x="532" y="34" text-anchor="middle">Exactly-once</text>\n' +
        '  <text class="ka-s" x="532" y="58" text-anchor="middle">idempotence + txns</text>\n' +
        '  <text class="ka-s" x="532" y="78" text-anchor="middle">read_committed</text>\n' +
        '  <text class="ka-s" x="532" y="104" text-anchor="middle">no loss, no duplicates</text>\n' +
        '</svg>',
      topicDocs: {
        "Delivery semantics at a glance": "https://docs.confluent.io/kafka/design/delivery-semantics.html"
      }
    },
    k3: {
      appendNotes:
        '\n<h3>A topology and its internal topics</h3>\n' +
        '<p>Re-keying (groupBy/selectKey) inserts a <em>repartition</em> topic; stateful operators (count/aggregate/reduce) back their state store with a <em>changelog</em> topic for fault-tolerant restore.</p>\n' +
        '<svg viewBox="0 0 640 140" style="max-width:640px;width:100%" role="img" aria-label="Streams topology with repartition and changelog topics">\n' +
        '  <style>.kt-b{fill:none;stroke:currentColor;stroke-width:1.3}.kt-t{font:600 12px sans-serif;fill:currentColor}.kt-s{font:11px sans-serif;fill:currentColor;opacity:.8}.kt-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#ktA)}.kt-d{stroke:currentColor;stroke-width:1;stroke-dasharray:4 3}</style>\n' +
        '  <defs><marker id="ktA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="kt-b" x="8" y="52" width="96" height="34" rx="5"/><text class="kt-t" x="56" y="73" text-anchor="middle">source</text>\n' +
        '  <line class="kt-a" x1="104" y1="69" x2="140" y2="69"/>\n' +
        '  <rect class="kt-b" x="142" y="52" width="110" height="34" rx="5"/><text class="kt-t" x="197" y="69" text-anchor="middle">groupBy (re-key)</text>\n' +
        '  <line class="kt-a" x1="252" y1="69" x2="288" y2="69"/>\n' +
        '  <rect class="kt-b" x="290" y="52" width="110" height="34" rx="5"/><text class="kt-t" x="345" y="73" text-anchor="middle">count (KTable)</text>\n' +
        '  <line class="kt-a" x1="400" y1="69" x2="436" y2="69"/>\n' +
        '  <rect class="kt-b" x="438" y="52" width="96" height="34" rx="5"/><text class="kt-t" x="486" y="73" text-anchor="middle">sink</text>\n' +
        '  <line class="kt-d" x1="197" y1="86" x2="197" y2="116"/>\n' +
        '  <text class="kt-s" x="197" y="130" text-anchor="middle">repartition topic</text>\n' +
        '  <line class="kt-d" x1="345" y1="86" x2="345" y2="116"/>\n' +
        '  <text class="kt-s" x="345" y="130" text-anchor="middle">changelog topic</text>\n' +
        '  <text class="kt-s" x="590" y="40" text-anchor="end">internal topics under the application.id</text>\n' +
        '</svg>',
      topicDocs: {
        "A topology and its internal topics": "https://docs.confluent.io/platform/current/streams/concepts.html"
      }
    },
    k6: {
      appendNotes:
        '\n<h3>What consumer lag measures</h3>\n' +
        '<p>Lag is how far a group trails the head of the log on a partition: <code>log-end-offset − current(committed)-offset</code>. Growing lag means the consumer can\'t keep up with the producer.</p>\n' +
        '<svg viewBox="0 0 640 120" style="max-width:640px;width:100%" role="img" aria-label="Consumer lag as the gap between committed offset and log end offset">\n' +
        '  <style>.kl-b{fill:none;stroke:currentColor;stroke-width:1.3}.kl-t{font:600 12px sans-serif;fill:currentColor}.kl-s{font:11px sans-serif;fill:currentColor;opacity:.8}.kl-f{fill:currentColor;opacity:.12}.kl-a{stroke:currentColor;stroke-width:1.1;marker-end:url(#klA)}</style>\n' +
        '  <defs><marker id="klA" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>\n' +
        '  <rect class="kl-b" x="20" y="44" width="600" height="34" rx="4"/>\n' +
        '  <line x1="360" y1="44" x2="360" y2="78" stroke="currentColor" stroke-width="1.3"/>\n' +
        '  <rect class="kl-f" x="360" y="45" width="259" height="32"/>\n' +
        '  <text class="kl-s" x="185" y="65" text-anchor="middle">processed / committed</text>\n' +
        '  <text class="kl-s" x="490" y="65" text-anchor="middle">not yet consumed</text>\n' +
        '  <line class="kl-a" x1="360" y1="96" x2="360" y2="80"/>\n' +
        '  <text class="kl-s" x="360" y="112" text-anchor="middle">current (committed) offset</text>\n' +
        '  <line class="kl-a" x1="619" y1="34" x2="619" y2="43"/>\n' +
        '  <text class="kl-s" x="619" y="26" text-anchor="end">log-end offset (head)</text>\n' +
        '  <text class="kl-t" x="490" y="94" text-anchor="middle">◄ lag ►</text>\n' +
        '</svg>',
      topicDocs: {
        "What consumer lag measures": "https://docs.confluent.io/platform/current/kafka/monitoring.html"
      }
    }
  }
};
