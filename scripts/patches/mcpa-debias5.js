/* MCPA de-bias · sections p8–p9 (single-answer, quality/monitoring). */
module.exports = {
  questions: {
    "pa-057": {
      optionEdits: {
        0: "A Cache scope inside the implementation's flow",
        1: "An HTTP Caching policy on the API instance in API Manager",
        2: "A larger worker to serve the read volume faster",
        3: "An Object Store watermark on the product data"
      },
      optionNotes: [
        "A Cache scope lives in the code, so tuning it means changing the implementation.",
        "Correct — the HTTP Caching policy is owner-configurable on the instance without touching the implementation.",
        "A bigger worker adds capacity but isn't the configurable caching mechanism required.",
        "Watermarking tracks sync progress; it isn't a response cache."
      ]
    },
    "pa-058": {
      optionEdits: {
        0: "An HTTP Caching policy applied to the whole API instance",
        1: "A Cache scope wrapping just the currency lookup, keyed by currency pair, TTL ~1 h (shared object store if multi-worker)",
        2: "Setting maxConcurrency=1 on the flow",
        3: "Moving the lookup into a Batch Job"
      },
      optionNotes: [
        "A policy on the whole API caches every response, not just the one expensive call.",
        "Correct — a Cache scope around only the currency lookup, keyed by pair with a ~1 h TTL, optimizes exactly that call.",
        "maxConcurrency throttles concurrency; it doesn't cache a result.",
        "A Batch Job is for bulk record processing, not memoizing a single lookup."
      ]
    },
    "pa-061": {
      optionEdits: {
        0: "Fail immediately with a 500 when the backend is unavailable",
        1: "Fallback to last-known-good cached data (e.g., First Successful: live call, then cache read) with staleness indicated where appropriate",
        2: "Retry the backend indefinitely until it recovers",
        3: "Queue incoming GET requests until the backend returns"
      },
      optionNotes: [
        "Failing hard contradicts the goal of degrading gracefully to stale data.",
        "Correct — fall back to cached last-known-good data (First Successful) and signal staleness where it matters.",
        "Infinite retries hang the caller instead of returning something useful.",
        "Queuing GETs stalls responses rather than serving cached data now."
      ]
    },
    "pa-062": {
      optionEdits: {
        0: "It reduces p99 latency roughly linearly with worker count",
        1: "Approximately nothing — it raises throughput and availability; single-request latency needs caching, parallelism, or fewer hops",
        2: "It roughly doubles single-request latency",
        3: "It eliminates latency entirely"
      },
      optionNotes: [
        "Adding workers doesn't speed up one sequential request chain.",
        "Correct — horizontal scaling helps throughput/availability; per-request latency needs caching, parallelism, or fewer hops.",
        "More workers don't add latency to a single request either.",
        "Latency can't be eliminated; work still takes time on the critical path."
      ]
    },
    "pa-064": {
      optionEdits: {
        0: "1=Visualizer, 2=Exchange, 3=API analytics",
        1: "1=API Manager analytics, 2=Anypoint Monitoring, 3=Anypoint Visualizer",
        2: "1=Runtime Manager, 2=Visualizer, 3=Functional Monitoring",
        3: "All three answered from the application log files"
      },
      optionNotes: [
        "Exchange doesn't show worker memory, and Visualizer isn't the traffic-by-consumer source.",
        "Correct — consumer traffic -> API analytics; worker memory trend -> Monitoring; live call graph -> Visualizer.",
        "Runtime Manager isn't the per-consumer traffic source, and BAT/Functional Monitoring isn't the call graph.",
        "Raw logs can't readily give per-consumer share, memory trends, or the dependency graph."
      ]
    },
    "pa-066": {
      optionEdits: {
        0: "Configuring more alerts simply signals a thorough operations team",
        1: "Failures originate anywhere in the chain; layer-specific alerts localize the fault (a System API breach often precedes and explains the Experience API breach)",
        2: "Experience APIs are the only layer that supports alerts",
        3: "Process APIs never fail, so alerting them is redundant"
      },
      optionNotes: [
        "Volume of alerts isn't the point; localizing faults is.",
        "Correct — layered alerts pinpoint where a failure starts, since a System API issue often explains the Experience symptom.",
        "All layers support alerts, not just Experience.",
        "Process APIs can and do fail; assuming otherwise leaves a blind spot."
      ]
    },
    "pa-067": {
      optionEdits: {
        0: "Policy violation count exceeded on an API instance",
        1: "Application/worker not responding or a deployment failed",
        2: "Response-time SLA breach on an API instance",
        3: "4xx error-ratio threshold crossed on an API"
      },
      optionNotes: [
        "Policy-violation alerts are API Manager's domain.",
        "Correct — worker health and deployment status are Runtime Manager alerts.",
        "SLA response-time breaches are tracked in API Manager.",
        "4xx ratio thresholds are API-Manager-level API alerts."
      ]
    },
    "pa-068": {
      optionEdits: {
        0: "The total lines of DataWeave written across projects",
        1: "Growth in API consumption and reuse — consumers per API, share of projects consuming existing APIs, traffic on reused assets",
        2: "The number of workers deployed platform-wide",
        3: "The average built JAR size across applications"
      },
      optionNotes: [
        "Lines of code is an activity metric, not a value/reuse outcome.",
        "Correct — reuse and consumption growth is the network's value story for leadership.",
        "Worker count measures spend/footprint, not delivered value.",
        "JAR size is a build detail irrelevant to network value."
      ]
    },
    "pa-069": {
      optionEdits: {
        0: "Worker CPU utilization alerts in Runtime Manager",
        1: "Business-level telemetry: custom business events or structured log metrics feeding a custom dashboard/alert on the order rate",
        2: "Deployment success/failure notifications",
        3: "VPC flow logs for the environment"
      },
      optionNotes: [
        "CPU is technical health and says nothing about order throughput.",
        "Correct — a business KPI needs business telemetry (custom events/metrics) driving a dashboard/alert on order rate.",
        "Deployment notifications are lifecycle events, not business volume.",
        "Flow logs describe network traffic, not business order counts."
      ]
    },
    "pa-070": {
      optionEdits: {
        0: "It is a cheaper alternative to metric-based alerting",
        1: "It actively CALLS the API on a schedule from chosen locations and asserts on real responses — catching functional breakage even when traffic-based metrics look normal",
        2: "It only runs in development environments",
        3: "It is a replacement for MUnit unit tests"
      },
      optionNotes: [
        "Cost isn't the distinction; active synthetic testing is.",
        "Correct — Functional Monitoring (BAT) actively calls the API on a schedule and asserts on responses, catching silent breakage.",
        "It runs against real deployed environments, not just dev.",
        "It complements MUnit; it doesn't replace unit testing."
      ]
    },
    "pa-071": {
      optionEdits: {
        0: "Reading every application's pom.xml for dependencies",
        1: "Anypoint Visualizer — the live dependency graph shows what calls the degraded node",
        2: "Browsing the Exchange asset list for related APIs",
        3: "Opening the RAML files to infer the relationships"
      },
      optionNotes: [
        "poms show build dependencies, not the live runtime call graph.",
        "Correct — Visualizer's live dependency graph shows the blast radius around a degraded node fastest.",
        "Exchange lists assets but not live runtime call relationships.",
        "RAML describes contracts, not who is actually calling whom at runtime."
      ]
    },
    "pa-072": {
      optionEdits: {
        0: "Collecting dashboards that no team owns or reviews",
        1: "Every alert has an owning team and a threshold tied to an SLA; incidents feed review of thresholds, capacity, and design (e.g., adding fallbacks where alerts fire repeatedly)",
        2: "Disabling alerts that fire too often to reduce noise",
        3: "Monitoring only the production environment"
      },
      optionNotes: [
        "Unowned dashboards produce no action or improvement.",
        "Correct — owned alerts tied to SLAs, with incidents feeding threshold/capacity/design reviews, close the loop.",
        "Muting noisy alerts hides problems instead of fixing them.",
        "Monitoring prod alone misses issues that should be caught earlier."
      ]
    }
  }
};
