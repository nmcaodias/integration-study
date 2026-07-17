/* MCD2 · d2 — Maintainable and Modular Mule Applications (Maven) */
module.exports = {
  sections: {
    d2: {
      topicDocs: {
        "Classloader isolation and sharedLibraries": "https://docs.mulesoft.com/mule-runtime/latest/mmp-concept",
        "mvn deploy vs. mvn deploy -DmuleDeploy": "https://docs.mulesoft.com/mule-runtime/latest/deploy-to-cloudhub-2",
        "Semantic versioning decisions": "https://docs.mulesoft.com/api-governance/latest/"
      },
      appendNotes: `
<h3>Classloader isolation and sharedLibraries</h3>
<p>Mule 4 gives every connector/plugin its <strong>own isolated classloader</strong>, so a connector cannot see JARs on the application classloader. That is why a JDBC driver declared as an ordinary <code>&lt;dependency&gt;</code> still throws <code>ClassNotFoundException</code> when the Database connector initializes — the driver is loaded by the <em>connector's</em> classloader, which can't reach the app's. The fix is to export it via <code>sharedLibraries</code>:</p>
<pre><code>&lt;plugin&gt;
  &lt;groupId&gt;org.mule.tools.maven&lt;/groupId&gt;
  &lt;artifactId&gt;mule-maven-plugin&lt;/artifactId&gt;
  &lt;configuration&gt;
    &lt;sharedLibraries&gt;
      &lt;sharedLibrary&gt;
        &lt;groupId&gt;com.mysql&lt;/groupId&gt;
        &lt;artifactId&gt;mysql-connector-j&lt;/artifactId&gt;
      &lt;/sharedLibrary&gt;
    &lt;/sharedLibraries&gt;
  &lt;/configuration&gt;
&lt;/plugin&gt;</code></pre>
<p>The <code>&lt;dependency&gt;</code> is still required; <code>sharedLibraries</code> just makes it visible to connectors. Same story for JMS client libraries and other driver-style JARs.</p>

<h3>mvn deploy vs. mvn deploy -DmuleDeploy</h3>
<table>
<tr><th>Command</th><th>What happens</th></tr>
<tr><td><code>mvn deploy</code></td><td>Publishes the artifact to the Maven repository in <code>distributionManagement</code> (e.g. Exchange). The app is NOT deployed to a runtime.</td></tr>
<tr><td><code>mvn deploy -DmuleDeploy</code></td><td>Switches the mule-maven-plugin into deployment mode and deploys the app to the configured target (cloudhub2Deployment, rtfDeployment, armDeployment, standaloneDeployment).</td></tr>
</table>
<p>Two very different operations sharing one Maven phase — a favourite exam distinction. CI credentials should be a <strong>Connected App</strong> (client_credentials grant, minimal scopes), supplied from the pipeline's secret store or <code>settings.xml</code>, never committed to the POM.</p>

<h3>Semantic versioning decisions</h3>
<table>
<tr><th>Change to the API contract</th><th>Bump</th></tr>
<tr><td>Add an optional field or a new resource; add an optional query param</td><td>MINOR</td></tr>
<tr><td>Documentation fix, internal refactor, perf improvement (contract unchanged)</td><td>PATCH</td></tr>
<tr><td>Remove/rename a field, change a type, make an optional field required, remove a resource</td><td>MAJOR (new instance, e.g. <code>/v2</code>)</td></tr>
</table>
<p>Major versions coexist as separate API instances so consumers migrate on their own schedule; the old version is deprecated with a communicated sunset before removal.</p>
<p class="tip"><strong>Exam tip:</strong> ClassNotFound from a connector → sharedLibraries; publish an asset → groupId = org ID + Exchange in distributionManagement; deploy an app from CI → mule-maven-plugin + <code>-DmuleDeploy</code> + Connected App creds from a secret store.</p>`
    }
  },
  questions: {
    "m2-022": {
      options: [
        "Copy-paste a template pom.xml into each new project and keep them in sync by hand",
        "A parent POM published to Exchange/a repository, referenced by each project's <parent>",
        "Set the shared values as environment variables on every developer's machine",
        "Keep all projects open in one shared Anypoint Studio workspace"
      ],
      answer: 1,
      explanation: "A parent POM centralizes build configuration (plugin versions, repositories, properties); children inherit and stay consistent. Publishing it to Exchange/a private repo makes it resolvable everywhere, including CI.",
      optionNotes: [
        "Wrong — copy-paste drifts immediately; that's the problem a parent POM solves.",
        "Correct — a shared parent POM is the standard inheritance mechanism.",
        "Wrong — env vars aren't build config and don't travel to CI reliably.",
        "Wrong — a workspace is an IDE concept, not shared build configuration."
      ]
    },
    "m2-023": {
      options: [
        "Run mvn clean install with a custom -Pcloud profile",
        "Configure the mule-maven-plugin's cloudhub2Deployment section and run mvn deploy -DmuleDeploy",
        "Upload the packaged JAR to the worker over FTP",
        "Invoke the mvn cloudhub:push goal from the pipeline"
      ],
      answer: 1,
      explanation: "The mule-maven-plugin handles packaging and deployment; 'mvn deploy -DmuleDeploy' triggers deployment using the plugin's configuration (target, environment, Connected App credentials), typically injected by the pipeline.",
      optionNotes: [
        "Wrong — install just copies to the local repo; a profile alone doesn't deploy.",
        "Correct — cloudhub2Deployment config + mvn deploy -DmuleDeploy.",
        "Wrong — CloudHub isn't deployed to by FTP upload.",
        "Wrong — there's no cloudhub:push goal; deployment is via the mule-maven-plugin."
      ]
    },
    "m2-024": {
      options: [
        "A developer's personal Anypoint username and password",
        "A Connected App's client ID and secret with only the scopes it needs",
        "The organization administrator's active session cookie",
        "No credentials are required for automated deployments"
      ],
      answer: 1,
      explanation: "Connected apps provide non-personal, scope-limited, revocable credentials — the recommended practice for automation, instead of tying pipelines to human accounts.",
      optionNotes: [
        "Wrong — personal accounts break when the person leaves and over-grant access.",
        "Correct — a scoped Connected App is the automation-friendly credential.",
        "Wrong — session cookies are short-lived and not meant for automation.",
        "Wrong — deployments always require authentication."
      ]
    },
    "m2-025": {
      options: [
        "Download the asset's JAR manually into src/main/resources",
        "Add the Exchange Maven repo (creds in settings.xml) and declare the asset's GAV as a dependency",
        "Exchange assets cannot be consumed from a Maven build at all",
        "Reference the asset's Exchange URL inside mule-artifact.json"
      ],
      answer: 1,
      explanation: "Exchange doubles as a Maven repository. With the repo URL and valid credentials/connected app token in settings.xml, assets resolve like any Maven dependency, using the organization ID as groupId.",
      optionNotes: [
        "Wrong — manual JAR copying bypasses versioning and isn't the Maven way.",
        "Correct — Exchange repo + credentials in settings.xml + GAV dependency.",
        "Wrong — Exchange is a Maven repo, so assets resolve normally.",
        "Wrong — mule-artifact.json is the app descriptor, not a dependency resolver."
      ]
    },
    "m2-026": {
      options: [
        "Adding a new optional field to the response body",
        "Removing a response field or renaming an existing resource (a breaking change)",
        "Fixing a typo in the API's documentation",
        "Improving performance without changing the contract at all"
      ],
      answer: 1,
      explanation: "Breaking changes (removing/renaming fields, changing types, removing resources) break existing consumers → MAJOR bump and typically a new API instance/URL (v1 → v2). Backwards-compatible additions are MINOR; fixes are PATCH.",
      optionNotes: [
        "Wrong — an optional addition is backwards compatible → MINOR.",
        "Correct — removing/renaming breaks consumers → MAJOR.",
        "Wrong — a doc fix is PATCH.",
        "Wrong — an internal perf change with no contract change is PATCH."
      ]
    },
    "m2-028": {
      options: [
        "Copy the DataWeave files and flows into each project that needs them",
        "Package them as a Mule plugin/library, publish to Exchange, and add it as a versioned dependency",
        "Email the reusable XML to each team when it changes",
        "Place the shared flows inside a domain project"
      ],
      answer: 1,
      explanation: "Publishing shared code as a versioned Exchange asset gives controlled reuse, discoverability, and upgrade management. Copy-paste drifts; domains only share configurations on the same customer-hosted runtime.",
      optionNotes: [
        "Wrong — copying loses versioning and drifts across projects.",
        "Correct — a versioned Exchange plugin/library dependency is the reuse pattern.",
        "Wrong — emailing XML is neither versioned nor discoverable.",
        "Wrong — domains share connector configs, not reusable flows/DW libraries."
      ]
    },
    "m2-029": {
      options: [
        "It stores the application's encrypted secure property values",
        "It is the application descriptor: minMuleVersion, secureProperties list, and packaging metadata",
        "It defines the API's RAML/OAS specification for the app",
        "It configures the Log4j 2 appenders and loggers"
      ],
      answer: 1,
      explanation: "mule-artifact.json declares app metadata such as minMuleVersion and which properties should be treated as secure (masked), used at packaging and deployment time.",
      optionNotes: [
        "Wrong — it lists which properties are secure but doesn't store their encrypted values.",
        "Correct — it's the app descriptor (minMuleVersion, secureProperties, packaging).",
        "Wrong — the API spec is a RAML/OAS file, not mule-artifact.json.",
        "Wrong — logging config lives in log4j2.xml."
      ]
    },
    "m2-030": {
      options: [
        "Only complete, deployable Mule applications",
        "API specs, fragments (traits/types/examples), connectors, templates, examples, and custom policies",
        "Only RAML specification files",
        "Only plain Java libraries packaged as JARs"
      ],
      answer: 1,
      explanation: "Exchange hosts many asset types: specs (RAML/OAS), reusable fragments, REST/custom connectors, application templates and examples, custom policies, and more.",
      optionNotes: [
        "Wrong — far more than whole applications can be published.",
        "Correct — Exchange catalogs specs, fragments, connectors, templates, policies, etc.",
        "Wrong — RAML is one of many asset types, not the only one.",
        "Wrong — Java libraries are just one possibility among many."
      ]
    },
    "m2-031": {
      options: [
        "One Maven profile per environment that bakes the values into each JAR",
        "One artifact plus environment YAML files selected at deploy time (-Denv=prod), secrets injected securely",
        "A separate long-lived Git branch holding each environment's config",
        "Hardcode every environment's config and switch with a Choice router at runtime"
      ],
      answer: 1,
      explanation: "Build once, deploy many: the same JAR is promoted through environments, with configuration externalized and selected at deployment. Baking env values into artifacts undermines promotion integrity.",
      optionNotes: [
        "Wrong — per-env JARs mean you no longer promote the tested artifact.",
        "Correct — one artifact + externalized, deploy-time-selected config is the pattern.",
        "Wrong — config branches drift and complicate promotion.",
        "Wrong — hardcoding all configs bloats the artifact and leaks secrets."
      ]
    },
    "m2-032": {
      options: [
        "A generated Maven site report under target/site",
        "The deployable application JAR under target/, after compiling and running tests",
        "A container image ready to push to a registry",
        "A published Exchange asset in the organization catalog"
      ],
      answer: 1,
      explanation: "clean removes target/, then package compiles, runs the test phase (MUnit), and assembles the deployable mule-application JAR in target/.",
      optionNotes: [
        "Wrong — a site report is a different goal, not package output.",
        "Correct — package produces the deployable JAR in target/.",
        "Wrong — packaging a Mule app doesn't build a Docker image.",
        "Wrong — publishing to Exchange is mvn deploy, not package."
      ]
    },
    "m2-033": {
      options: [
        "Fragments must be duplicated inside every API specification that uses them",
        "Reusable RAML/OAS pieces published once to Exchange and referenced as dependencies by many specs",
        "Fragments are only supported by OAS 3.0 specifications",
        "Fragments are Mule runtime plugins deployed with the app"
      ],
      answer: 1,
      explanation: "API fragments are versioned Exchange assets. Specifications import them, so common types/traits evolve in one place and stay consistent across APIs.",
      optionNotes: [
        "Wrong — the whole point is to avoid duplication.",
        "Correct — publish once, reference as a dependency from many specs.",
        "Wrong — fragments work with RAML too, not only OAS 3.",
        "Wrong — fragments are design-time spec pieces, not runtime plugins."
      ]
    },
    "m2-034": {
      options: [
        "In the project's pom.xml, committed to the Git repository",
        "In Maven settings.xml or injected by CI as secrets, never committed to source control",
        "In the mule-artifact.json application descriptor",
        "In a YAML property file bundled inside the application"
      ],
      answer: 1,
      explanation: "Repository credentials belong in settings.xml / a CI secret store. Committing credentials to the POM leaks them to anyone with repository access.",
      optionNotes: [
        "Wrong — committing credentials to the POM leaks them.",
        "Correct — settings.xml or CI secrets, kept out of version control.",
        "Wrong — mule-artifact.json isn't a credential store.",
        "Wrong — bundling creds in the app ships secrets with the artifact."
      ]
    },
    "m2-035": {
      options: [
        "The fixed value com.mulesoft for all organizations",
        "The Anypoint organization (business group) ID",
        "Any unique string the developer chooses",
        "The publishing developer's Anypoint username"
      ],
      answer: 1,
      explanation: "Exchange maps Maven coordinates to your org: the groupId must be the organization/business group ID so the asset lands in the correct Exchange catalog.",
      optionNotes: [
        "Wrong — com.mulesoft is MuleSoft's own namespace, not yours.",
        "Correct — the groupId is your organization/business group ID.",
        "Wrong — an arbitrary string won't map the asset to your org.",
        "Wrong — usernames aren't used as the groupId."
      ]
    },
    "m2-036": {
      options: [
        "v1 is deleted immediately when v2 is published",
        "v1 keeps running as its own instance; v2 releases separately; v1 is deprecated with a sunset period",
        "v1 consumers are automatically migrated to v2 by the platform",
        "v1 traffic is silently redirected to v2 endpoints"
      ],
      answer: 1,
      explanation: "Major versions coexist as separate instances so consumers migrate on their own schedule. Deprecation in Exchange/API Manager plus clear communication precedes eventual retirement.",
      optionNotes: [
        "Wrong — deleting v1 immediately breaks existing consumers.",
        "Correct — coexist, deprecate, communicate a sunset, then retire.",
        "Wrong — consumers migrate themselves; there's no auto-migration of client code.",
        "Wrong — silent redirection would break consumers on the breaking change."
      ]
    },
    "m2-079": {
      options: [
        "The declared driver version is incompatible with the connector",
        "Classloader isolation hides app JARs from connectors — declare the driver under sharedLibraries too",
        "MySQL access requires deploying a domain project",
        "The dependency's scope must be set to 'test'"
      ],
      answer: 1,
      explanation: "Connectors run in their own classloaders and cannot see application JARs. sharedLibraries (groupId/artifactId under the mule-maven-plugin configuration) exports the driver to them.",
      optionNotes: [
        "Wrong — a version mismatch gives a different error, not this classloading one.",
        "Correct — export the driver via sharedLibraries so the connector's classloader sees it.",
        "Wrong — domains share configs; they don't fix classloading.",
        "Wrong — 'test' scope would remove the driver from the runtime entirely."
      ]
    },
    "m2-080": {
      options: [
        "The application is deployed to CloudHub 2.0 using the plugin config",
        "The artifact is published to the Maven repository (e.g. Exchange); the app is NOT deployed",
        "Both the repository publish and the runtime deploy happen together",
        "The build fails because the configuration is ambiguous"
      ],
      answer: 1,
      explanation: "Plain 'mvn deploy' = repository publication. Adding -DmuleDeploy switches the mule-maven-plugin into deployment mode, deploying to the configured target instead. Two different operations sharing one Maven phase.",
      optionNotes: [
        "Wrong — deployment to the runtime needs -DmuleDeploy.",
        "Correct — without -DmuleDeploy it only publishes to the repository.",
        "Wrong — it's one or the other, not both.",
        "Wrong — the build succeeds; it just publishes rather than deploys."
      ]
    },
    "m2-083": {
      options: [
        "Copy-paste the pom.xml between projects whenever it changes",
        "A parent POM published to the repository, referenced via <parent> in each project",
        "Shared environment variables on each build machine",
        "A domain project shared by the applications"
      ],
      answer: 1,
      explanation: "Parent POMs centralize build configuration (pluginManagement, properties, repositories). Each app declares <parent> and inherits. Domains share RUNTIME configs on customer-hosted runtimes — a different concern.",
      optionNotes: [
        "Wrong — copy-paste drifts across projects.",
        "Correct — a shared parent POM referenced via <parent>.",
        "Wrong — env vars aren't build configuration.",
        "Wrong — domains share runtime configs, not Maven build settings."
      ]
    }
  }
};
