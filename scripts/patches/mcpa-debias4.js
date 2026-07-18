/* MCPA de-bias · sections p6–p7 (single-answer, deployment/HA). */
module.exports = {
  questions: {
    "pa-042": {
      optionEdits: {
        0: "Proxies support a larger set of policies than embedded enforcement",
        1: "No extra network hop or separate app to operate — policies run inside the implementation itself",
        2: "Embedded enforcement needs no platform credentials",
        3: "Only proxies are capable of rate limiting"
      },
      optionNotes: [
        "Both enforcement modes support the same policy set; that isn't the advantage.",
        "Correct — embedded enforcement avoids a separate proxy app and its network hop.",
        "Embedded still needs Anypoint client credentials plus api.id to register.",
        "Rate limiting works in both proxy and embedded modes."
      ]
    },
    "pa-044": {
      optionEdits: {
        0: "CloudHub — with no operational trade-offs to consider",
        1: "Runtime Fabric — platform-managed deployments on customer infrastructure, but the customer owns cluster operations (nodes, upgrades, capacity)",
        2: "Private Cloud Edition, which is operationally identical to CloudHub",
        3: "Customer-hosted standalone runtimes, the only supported option here"
      },
      optionNotes: [
        "CloudHub runs on MuleSoft's infrastructure, not the customer's AWS/K8s account.",
        "Correct — Runtime Fabric gives control-plane-managed deployments on customer infra; the customer runs the cluster.",
        "PCE is a self-managed control plane and is not identical to CloudHub operationally.",
        "Standalone runtimes work but aren't the platform-managed K8s option the scenario asks for."
      ]
    },
    "pa-045": {
      optionEdits: {
        0: "1=integration test, 2=unit test, 3=integration test",
        1: "1=MUnit unit test, 2=integration test against the managed instance (policy behavior), 3=MUnit unit test",
        2: "All three covered by MUnit unit tests",
        3: "All three covered by integration tests"
      },
      optionNotes: [
        "Router branch selection and DataWeave null handling are unit-level, not integration.",
        "Correct — logic/mapping are MUnit units; policy enforcement on the deployed instance is an integration test.",
        "Policy enforcement can only be verified against the deployed, managed instance — not a pure unit test.",
        "Pure logic and mapping are wasteful to test only at the integration level."
      ]
    },
    "pa-046": {
      optionEdits: {
        0: "Manual Studio exports uploaded through Runtime Manager by hand",
        1: "A CI server driving mule-maven-plugin (build/deploy) + munit-maven-plugin (test/coverage gates) + Exchange as artifact repo, authenticated with a Connected App",
        2: "Scheduled FTP uploads of the JAR to each worker",
        3: "Copying built JARs between environments manually"
      },
      optionNotes: [
        "Manual exports aren't a repeatable automated pipeline.",
        "Correct — CI + mule-maven-plugin + munit-maven-plugin + Exchange, authenticated by a Connected App.",
        "FTP to workers bypasses the platform's deploy and governance tooling.",
        "Hand-copying artifacts breaks build-once/deploy-many and traceability."
      ]
    },
    "pa-047": {
      optionEdits: {
        0: "Re-running the MUnit unit suite that already passed at build time",
        1: "A smoke/functional test calling the deployed instance's endpoints (optionally BAT monitors) and asserting real responses",
        2: "Checking the built JAR's file size is within range",
        3: "Re-reading the RAML specification for syntax errors"
      },
      optionNotes: [
        "MUnit ran pre-deploy against mocks; it doesn't prove the live deployment works.",
        "Correct — a smoke/functional test hits the deployed endpoints and asserts real responses before promotion.",
        "JAR size tells you nothing about runtime behavior.",
        "RAML linting is a design-time check, not post-deploy verification."
      ]
    },
    "pa-048": {
      optionEdits: {
        0: "Rebuilding per environment is simply slower than reusing a JAR",
        1: "Only the promoted artifact was actually tested; rebuilds risk deploying something different (dependencies, timing) to production — environment differences belong in externalized configuration",
        2: "Maven does not permit rebuilding the same module twice",
        3: "Mule JARs are technically impossible to rebuild"
      },
      optionNotes: [
        "Speed is minor; the real risk is shipping an untested artifact.",
        "Correct — promote the one tested artifact; rebuilds can differ, and env specifics belong in externalized config.",
        "Maven can rebuild freely; the issue is trust, not tooling limits.",
        "JARs can be rebuilt; doing so just yields a potentially different, untested artifact."
      ]
    },
    "pa-049": {
      optionEdits: {
        0: "A single 4-vCore worker sized for peak load",
        1: "Multiple smaller workers (horizontal scaling) behind the load balancer — throughput scales out and a worker loss doesn't take the API down",
        2: "A single 0.1-vCore worker with autoscaling disabled",
        3: "Vertical scaling of one worker only"
      },
      optionNotes: [
        "One big worker is a single point of failure and caps HA.",
        "Correct — small requests at high TPS with HA favor multiple workers (scale-out + resilience).",
        "A single tiny worker neither sustains high TPS nor provides availability.",
        "Vertical scaling adds capacity to one instance but no redundancy."
      ]
    },
    "pa-050": {
      optionEdits: {
        0: "Many 0.1-vCore workers sharing the load",
        1: "A larger worker (vertical scaling) for memory headroom — plus streaming so the file never fully materializes",
        2: "The shared load balancer to spread the work",
        3: "More availability zones for the deployment"
      },
      optionNotes: [
        "Many tiny workers can't each hold an 800 MB file in memory.",
        "Correct — low TPS but large payloads call for a bigger worker plus streaming to bound memory.",
        "A load balancer distributes requests; it doesn't solve per-request memory needs.",
        "More AZs add availability, not the memory headroom a large file requires."
      ]
    },
    "pa-051": {
      optionEdits: {
        0: "Object Store v2 for cross-worker shared state",
        1: "Enabling persistent queues for the application",
        2: "The dedicated load balancer in front of the workers",
        3: "Static IP addresses for the application"
      },
      optionNotes: [
        "Object Store shares state but isn't the VM-queue durability/consumption mechanism asked about.",
        "Correct — persistent queues make VM messages survive restarts and be consumable across both workers.",
        "A DLB handles ingress routing, not queue durability.",
        "Static IPs address egress identity, not message persistence."
      ]
    },
    "pa-054": {
      optionEdits: {
        0: "Mule event variables held in flight during processing",
        1: "In-memory (transient) VM queue contents",
        2: "Object Store v2 entries and persistent-queue messages",
        3: "The payload of the request currently being processed"
      },
      optionNotes: [
        "In-flight variables live in the worker's memory and are lost on crash.",
        "Transient VM queues aren't persisted, so their contents don't survive a crash.",
        "Correct — Object Store v2 and persistent queues are durable, surviving a worker crash without extra design.",
        "An in-progress request's payload is in memory and is lost if the worker dies."
      ]
    },
    "pa-055": {
      optionEdits: {
        0: "None — CloudHub provides high availability by default here",
        1: "The single worker, the single VPN tunnel, and the single backend — each needs redundancy or an accepted, documented risk",
        2: "Only the single worker is a point of failure",
        3: "Only the single VPN tunnel is a point of failure"
      },
      optionNotes: [
        "A one-worker, one-tunnel, one-backend chain is not HA by default.",
        "Correct — all three single elements are SPOFs; each needs redundancy or an explicit accepted risk.",
        "The worker isn't the only SPOF — the tunnel and backend are too.",
        "The tunnel is one SPOF among three, not the only one."
      ]
    },
    "pa-056": {
      optionEdits: {
        0: "It is impossible to host two apps under one domain on port 443",
        1: "A Dedicated Load Balancer with mapping rules routing paths to each app's workers (VPC required)",
        2: "Two shared load balancers, one per application",
        3: "A Mule domain project shared between the apps"
      },
      optionNotes: [
        "It's entirely possible with a Dedicated Load Balancer.",
        "Correct — a DLB (which requires a VPC) maps /orders and /customers to each app under one domain on 443.",
        "The shared load balancer can't serve a custom domain with path routing; and you don't get two of them.",
        "A domain project shares runtime configuration, not external URL routing."
      ]
    }
  }
};
