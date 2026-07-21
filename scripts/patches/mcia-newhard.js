/* MCIA · 12 new hard architect scenarios (ids ia-126..ia-137), several
 * exhibit-based, spread across sections and chosen NOT to duplicate existing
 * topics (checked against the bank). Options authored so the correct answer is
 * not the longest; a light balance pass follows. */
module.exports = {
  addQuestions: [
    {
      id: "ia-126", section: "a1", level: "hard",
      q: "A firm must deploy 60 Mule apps. Constraints: (1) MuleSoft should manage the control plane; (2) some apps must run inside the firm's existing GKE clusters for data residency; (3) other apps are public SaaS integrations with spiky load and the firm wants zero infrastructure to operate for those. What runtime-plane split best satisfies all three?",
      options: [
        "Runtime Fabric on the firm's GKE for the residency-bound apps, and CloudHub 2.0 for the zero-ops SaaS integrations — one control plane over both",
        "CloudHub 2.0 for every app, since the control plane is MuleSoft-managed and that already keeps all data inside MuleSoft's compliant regions for residency",
        "Runtime Fabric for every app on the firm's GKE, because a single runtime plane is simpler and CloudHub cannot be governed by the same control plane",
        "A customer-hosted hybrid deployment on VMs for all 60 apps, so the firm controls the compute everywhere and avoids managing any Kubernetes"
      ],
      answer: 0,
      optionNotes: [
        "Correct — RTF keeps the residency-bound apps on the firm's own GKE, while CloudHub 2.0 gives zero-ops hosting for the SaaS integrations; both are managed by the one Anypoint control plane.",
        "CloudHub 2.0 hosts compute on MuleSoft's side — it doesn't put workloads inside the firm's GKE, so residency (2) fails.",
        "Forcing everything onto RTF adds ops for the SaaS apps the firm wanted zero-ops for, and CloudHub IS governed by the same control plane.",
        "Hybrid on VMs maximizes ops burden — the opposite of the zero-ops goal for the SaaS integrations."
      ],
      explanation: "The control plane is always MuleSoft-managed; the runtime plane is the choice. A mixed estate is normal: Runtime Fabric where compute must live in the customer's network (residency), CloudHub 2.0 where zero-ops hosting is wanted — all under one control plane."
    },
    {
      id: "ia-127", section: "a2", level: "hard",
      q: "Order events must (a) be delivered to inventory, shipping, and analytics — each an independent consumer — AND (b) be processed by each consumer in strict per-customer order. An architect proposes a single topic with three subscribers. What is the flaw, and the fix?",
      options: [
        "Fan-out is fine, but strict ordering needs a partition/queue key per customer so one customer's events serialize; a plain topic doesn't guarantee per-consumer processing order under concurrency",
        "Topics can't fan out to multiple independent subscribers at all, so the design fails immediately and must use three separate point-to-point queues",
        "There is no flaw — a topic with multiple subscribers inherently preserves total ordering for every subscriber, so both requirements are already met",
        "Ordering is impossible in any asynchronous system, so requirement (b) must be dropped and the design switched entirely to synchronous request/reply"
      ],
      answer: 0,
      optionNotes: [
        "Correct — pub/sub gives the fan-out, but per-customer ordering requires keying events (partition/message-group) so a customer's events are handled sequentially; concurrent consumers otherwise reorder them.",
        "Topics are exactly how you fan out to independent subscribers — that part of the design is right.",
        "A topic does not guarantee per-subscriber total order once consumers process concurrently.",
        "Ordering is achievable with keyed partitions/message groups; you don't have to abandon async."
      ],
      explanation: "Fan-out and ordering are separate concerns. A topic handles the fan-out; strict per-entity order needs a partition or message-group key so events for the same customer are serialized, while different customers still process in parallel."
    },
    {
      id: "ia-128", section: "a3", level: "hard",
      q: "Refer to the exhibit. Review this proposed API-led design for a new mobile checkout. What is the primary architectural problem?",
      exhibit: "Mobile Experience API\n   ├─► System API: Salesforce (customer)\n   ├─► System API: SAP (order)     ◄── called directly\n   └─► System API: Inventory DB\n(no Process API; the Experience API orchestrates all three System APIs itself)",
      options: [
        "Orchestration and aggregation live in the Experience API, so the checkout logic can't be reused by web or partner channels — that business capability belongs in a Process API",
        "An Experience API is not allowed to call more than one System API, so the design is invalid and must be collapsed into a single monolithic app",
        "System APIs must never be called by anything except other System APIs, so the Experience API should call a fourth System API that wraps the other three",
        "The design is correct as drawn — skipping the Process layer is the recommended optimization whenever an Experience API needs data from several systems"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the reusable 'place order' orchestration is trapped in a channel-specific Experience API; web/partner channels would have to reimplement it. It belongs in a Process API.",
        "An Experience API may call multiple sources; the issue is where the orchestration lives, not the count.",
        "System APIs are called by Process (and sometimes Experience) APIs; 'only System calls System' is wrong and couples back ends.",
        "Skipping the Process layer for reusable orchestration is the anti-pattern, not an optimization."
      ],
      explanation: "API-led reuse comes from the System and Process layers. Putting cross-system orchestration inside an Experience API makes it channel-specific and non-reusable — the checkout capability should be a Process API that every channel's Experience API calls."
    },
    {
      id: "ia-129", section: "a4", level: "hard",
      q: "A dedup design fronts a flow with an Idempotent Message Validator backed by Object Store v2. Under a Black-Friday burst the app starts processing duplicates that it correctly rejected at lower volume. Nothing else changed. What is the most likely cause?",
      options: [
        "The burst exceeds Object Store v2's API rate limit, so some existence checks fail/throttle and fall through as 'not seen', letting duplicates pass",
        "Object Store v2 entries silently exceeded their 30-day TTL exactly during the burst, so every key expired at once and dedup stopped working",
        "Idempotent Message Validators stop functioning above a fixed message size, and burst messages are always larger than steady-state ones",
        "Object Store v2 automatically replicates across regions during high load, and the replica returns stale 'not seen' answers for every key"
      ],
      answer: 0,
      optionNotes: [
        "Correct — OSv2 is a rate-limited managed service; a burst can hit its TPS ceiling, and if checks throttle/error and aren't handled, messages slip through as first-seen.",
        "TTL expiry is time-based, not triggered by load; it wouldn't align with the burst.",
        "There is no message-size cutoff that disables the validator; size isn't the variable here.",
        "OSv2 doesn't auto-replicate across regions; that's a DR gap, not a burst behavior."
      ],
      explanation: "Object Store v2 has API rate limits. Correctness that holds at low volume but breaks under a spike points at throttled store operations — design for the TPS ceiling (batching, backpressure, or a store sized for peak), and fail safe when a check errors rather than treating it as 'not seen'."
    },
    {
      id: "ia-130", section: "a5", level: "hard",
      q: "A CloudHub app must (1) call a partner API that allowlists a fixed set of source IPs, and (2) accept inbound traffic only from the customer's corporate network. An architect plans to use CloudHub static IPs for BOTH requirements. Where is the mistake?",
      options: [
        "Static IPs solve (1) outbound allowlisting, but restricting inbound to the corporate network needs an Anypoint VPC (VPN/peering) plus load-balancer/firewall rules — static IPs don't gate inbound",
        "Static IPs solve (2) inbound restriction, but the partner allowlist in (1) actually requires a Dedicated Load Balancer with a custom certificate instead",
        "Static IPs cannot be used for either requirement on CloudHub; both need Runtime Fabric with an ingress controller",
        "There is no mistake — a single pool of CloudHub static IPs governs both inbound source filtering and outbound source identity simultaneously"
      ],
      answer: 0,
      optionNotes: [
        "Correct — static IPs give the app a stable OUTBOUND source address for partner allowlisting; INBOUND network restriction requires a VPC (VPN/peering) with firewall/LB rules.",
        "Reversed — static IPs are about outbound identity, not inbound gating; a DLB+cert is for custom domain/TLS, not the partner allowlist.",
        "Static IPs are a valid CloudHub feature for outbound; RTF isn't required for (1).",
        "One mechanism can't do both; inbound and outbound controls are different features."
      ],
      explanation: "A classic inbound/outbound trap. Static IPs stabilize the app's OUTBOUND address (for a partner's allowlist). Limiting INBOUND traffic to the corporate network is a VPC + VPN/peering + firewall/LB concern. They're separate controls."
    },
    {
      id: "ia-131", section: "a6", level: "hard",
      q: "Refer to the exhibit. A team adds this MUnit test to enforce the '500 req/s, p95 < 300 ms' NFR in the CI build. Why is this the wrong approach, and what should verify the NFR?",
      exhibit: "<munit:test name=\"latency-slo\">\n  <munit:execution>\n    <flow-ref name=\"getProduct\"/>\n  </munit:execution>\n  <munit:validation>\n    <munit-tools:assert-that\n       expression=\"#[vars.elapsedMs]\" is=\"#[MunitTools::lessThan(300)]\"/>\n  </munit:validation>\n</munit:test>",
      options: [
        "MUnit is functional unit testing on a single event with mocked dependencies; throughput and p95 latency are only meaningful under concurrent load, so a performance test against a representative environment must verify the NFR",
        "The assertion is correct but must use greaterThan(300) instead of lessThan(300) to properly fail slow responses, after which MUnit does verify the throughput NFR",
        "MUnit can verify the NFR, but only if the mocks are removed so the test calls the real backends during the CI build",
        "Performance NFRs can't be tested at all before production, so the requirement should be monitored live and dropped from pre-release verification"
      ],
      answer: 0,
      optionNotes: [
        "Correct — MUnit exercises one event with mocked I/O; a single-request timing assertion says nothing about 500 req/s or p95. Load/performance testing against a representative env is the right level.",
        "The operator isn't the problem — a single mocked-path timing check can't represent throughput or p95 regardless of comparison.",
        "Calling real backends in unit tests makes them non-hermetic and flaky, and still doesn't generate concurrent load.",
        "Performance NFRs are verifiable pre-prod via load testing; they shouldn't be dropped."
      ],
      explanation: "Right test, wrong level. MUnit proves functional correctness on individual events with mocks; throughput and percentile latency are emergent under concurrency and belong in a performance/load test against a representative environment — not a CI unit assertion."
    },
    {
      id: "ia-132", section: "a7", level: "hard",
      q: "A booking spans flight, hotel, and car — three separate REST APIs, none transactional — and may take minutes. If the car reservation fails, the already-confirmed flight and hotel must be undone. Which approach correctly guarantees consistency?",
      options: [
        "A saga: perform each step and, on a later failure, run compensating actions (cancel flight, cancel hotel) — since XA can't span external REST calls and long-running work can't hold a transaction",
        "An XA transaction enlisting the three REST APIs so all three commit or roll back atomically once the car step's outcome is known",
        "Wrap all three calls in a single Until Successful scope so a car failure automatically retries until every system agrees",
        "A local transaction on the flight database that also covers the hotel and car API calls, rolling all three back together on failure"
      ],
      answer: 0,
      optionNotes: [
        "Correct — with non-transactional, long-running REST steps you can't hold a distributed transaction; the saga pattern uses explicit compensating actions to undo completed steps.",
        "XA needs XA-capable resources; external REST APIs can't be enlisted, and a minutes-long transaction is untenable.",
        "Until Successful retries a transient failure; it doesn't undo the already-confirmed flight and hotel.",
        "A local transaction covers one resource (the DB) — it can't roll back external hotel/car API calls."
      ],
      explanation: "Across non-transactional services and long durations, distributed ACID (XA) is impossible. The saga pattern achieves eventual consistency through compensating transactions that semantically undo completed steps when a later step fails."
    },
    {
      id: "ia-133", section: "a7", level: "hard",
      q: "Refer to the exhibit. A payment consumer reads from an at-least-once queue and charges a card. Occasionally a customer is charged twice. What design change fixes it?",
      exhibit: "<jms:listener config-ref=\"JMS\" destination=\"payments\"/>   <!-- at-least-once -->\n  <flow-ref name=\"chargeCard\"/>   <!-- calls payment gateway -->\n  <!-- no dedup; a redelivered message charges again -->",
      options: [
        "Make the consumer idempotent: dedup on the payment's stable id (Idempotent Message Validator over a persistent store) before charging, so a redelivered message is recognized and skipped",
        "Switch the queue to at-most-once delivery so messages are never redelivered, which removes duplicates without any consumer changes",
        "Wrap the chargeCard call in an Until Successful scope, which prevents the broker from redelivering the message a second time",
        "Increase the JMS acknowledgment timeout so the broker waits longer before considering the message unacknowledged and redelivering it"
      ],
      answer: 0,
      optionNotes: [
        "Correct — at-least-once implies possible redelivery, so the consumer must dedup on a stable payment id before the side-effecting charge to make processing exactly-once in effect.",
        "At-most-once risks LOSING payments (no redelivery on genuine failures) — unacceptable for charges, and most brokers guarantee at-least-once.",
        "Until Successful is about retrying a failing call; it doesn't stop broker redelivery of the whole message.",
        "A longer ack timeout reduces some redeliveries but can't eliminate them; correctness still requires idempotency."
      ],
      explanation: "At-least-once delivery means duplicates are inevitable. The only robust fix for a side-effecting operation like a charge is an idempotent receiver keyed on a stable id, checked against a persistent store before the operation runs."
    },
    {
      id: "ia-134", section: "a8", level: "hard",
      q: "During load testing a Mule app scales cleanly, but a downstream ERP that tolerates only 50 concurrent requests begins returning errors as load rises. Requests must not be dropped. Which design most directly protects the ERP?",
      options: [
        "Bound concurrency toward the ERP (a limited-concurrency pool / throttle) and buffer the overflow in a queue, draining at the ERP's safe rate so nothing is lost",
        "Add more Mule workers so the app can push the incoming load through to the ERP faster and clear the backlog",
        "Remove any concurrency limits in the Mule app so requests reach the ERP as quickly as possible and spend less time queued",
        "Switch every ERP call to fire-and-forget so the Mule app never waits on the ERP and load-test errors disappear"
      ],
      answer: 0,
      optionNotes: [
        "Correct — the ERP is the constraint, so cap concurrency to its safe limit and absorb the surplus in a durable buffer, applying backpressure and draining at a sustainable rate.",
        "More Mule workers push MORE concurrent load at the ERP — it makes the overload worse.",
        "Removing limits floods the ERP past 50 concurrent — exactly the failure being observed.",
        "Fire-and-forget hides errors but still overloads the ERP and loses the ability to confirm/retry — data can be lost."
      ],
      explanation: "When a downstream system is the bottleneck, scale the caller to its limit, not past it: throttle/limit concurrency to the ERP's safe ceiling and buffer overflow (queue) so surplus is levelled out rather than dropped. Adding workers or removing limits amplifies the overload."
    },
    {
      id: "ia-135", section: "a9", level: "hard",
      q: "A partner integration requires proof of the CALLER'S identity at the transport layer (not just an application credential). A team plans to satisfy it with the Client ID Enforcement policy alone. What's the gap, and the correct control?",
      options: [
        "Client ID Enforcement authenticates an application credential in the message, not the transport peer; proving the caller at the transport layer requires mutual TLS (the client presents a certificate)",
        "Client ID Enforcement already authenticates the TLS peer, so nothing more is needed once the policy is applied to the API instance",
        "Transport-layer caller identity is provided by a Rate-Limiting-SLA policy, which ties each caller's certificate to an SLA tier",
        "One-way (server) TLS is sufficient for caller identity, because the server certificate presented during the handshake also identifies the client"
      ],
      answer: 0,
      optionNotes: [
        "Correct — client-id/secret is an application-level credential; transport-level caller identity means the client presents its own certificate, i.e. mutual (two-way) TLS.",
        "Client ID Enforcement checks a credential in the request, not the TLS peer's certificate.",
        "Rate limiting throttles calls; it doesn't establish transport identity.",
        "One-way TLS authenticates the SERVER to the client, not the client to the server."
      ],
      explanation: "Application identity (client id/secret via a policy) and transport identity (who terminated the TLS handshake) are different layers. 'Prove the caller at the transport layer' means mutual TLS, where the client presents a certificate the server validates."
    },
    {
      id: "ia-136", section: "a10", level: "hard",
      q: "Refer to the exhibit. Support can trace a transaction inside each app, but cannot stitch one business transaction across the Experience → Process → System chain. What must change?",
      exhibit: "Experience API  →  Process API  →  System API\nEach app: log4j2 pattern = \"%d %-5p %c - %m%n\"\nEach HTTP Request: default headers (no correlation id forwarded)",
      options: [
        "Propagate a single correlation id across the HTTP calls (send X-Correlation-ID downstream) and include %X{correlationId} in every app's log pattern, so all three apps' logs share one traceable id",
        "Give each app its own independent correlation id and rely on Anypoint Monitoring to mathematically reconstruct the end-to-end chain from timestamps",
        "Switch all three apps to asynchronous loggers, since only async logging can carry a correlation id across an HTTP boundary",
        "Move all three apps into a single deployable so there is only one log file and no correlation id is needed at all"
      ],
      answer: 0,
      optionNotes: [
        "Correct — end-to-end tracing needs the SAME correlation id carried on the wire (X-Correlation-ID) and emitted in each app's log pattern (%X{correlationId}) so logs across apps join on one id.",
        "Independent ids can't be stitched; timestamps don't reliably correlate concurrent transactions.",
        "Async vs sync logging is unrelated to propagating a correlation id across HTTP.",
        "Collapsing three APIs into one destroys the API-led layering to solve a logging-config problem."
      ],
      explanation: "Cross-app tracing requires a correlation id that (1) travels on the downstream HTTP calls and (2) appears in each app's log layout via %X{correlationId}. Mule propagates/accepts X-Correlation-ID when wired to; without it each app logs its own id and the chain can't be joined."
    },
    {
      id: "ia-137", section: "a10", level: "hard",
      q: "Refer to the exhibit. A CI/CD pipeline for CloudHub embeds credentials and rebuilds the artifact per environment. Identify the two problems and the correct design.",
      exhibit: "# Jenkinsfile (per env)\nsh 'mvn clean package -Denv=prod'          # rebuild per environment\nsh 'mvn deploy -DmuleDeploy \\\n     -Danypoint.username=deployerBob \\\n     -Danypoint.password=Sup3rSecret!'      # personal creds in the script",
      options: [
        "Build once and promote the same artifact with per-env config injected at deploy; and replace personal credentials with a Connected App secret pulled from the CI secret store",
        "Rebuilding per environment is fine for CloudHub, but the credentials should be a second personal account so deployments aren't tied to Bob",
        "The credentials are fine since they're passed as Maven properties; only the per-environment rebuild needs to be removed",
        "Both problems are solved by committing an encrypted properties file (including the password) into the repo and building per environment from it"
      ],
      answer: 0,
      optionNotes: [
        "Correct — build-once/promote-many preserves 'tested == deployed', and a Connected App (machine identity) with its secret from the CI vault removes personal credentials from the script.",
        "A rebuild per env breaks the tested-artifact guarantee, and swapping one personal account for another still isn't a machine identity.",
        "Passing a personal password as a property still exposes it in the script/logs; and the per-env rebuild is also wrong.",
        "Committing any password (even 'encrypted') to the repo is a leak, and per-env rebuild remains an anti-pattern."
      ],
      explanation: "Two anti-patterns: rebuilding per environment (breaks build-once/promote-many, so the deployed artifact isn't the tested one) and embedding personal credentials (should be a Connected App machine identity with its secret injected from the CI secret store at deploy time)."
    }
  ]
};
