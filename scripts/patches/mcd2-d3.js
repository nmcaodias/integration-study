/* MCD2 · d3 — Securing Data */
module.exports = {
  sections: {
    d3: {
      topicDocs: {
        "Choosing the right security control": "https://docs.mulesoft.com/mule-runtime/latest/security",
        "TLS handshake troubleshooting": "https://docs.mulesoft.com/mule-runtime/latest/tls-configuration",
        "Masking vs. encryption of properties": "https://docs.mulesoft.com/mule-runtime/latest/secure-configuration-properties"
      },
      appendNotes: `
<h3>Choosing the right security control</h3>
<table>
<tr><th>Requirement</th><th>Control</th></tr>
<tr><td>Encrypt the channel (data in transit)</td><td>TLS context (HTTPS/FTPS/…)</td></tr>
<tr><td>Server proves its identity</td><td>Keystore on the server (listener)</td></tr>
<tr><td>Also authenticate the client by certificate</td><td>Mutual TLS: keystore + truststore + client-auth required</td></tr>
<tr><td>Keep config secrets unreadable in Git/artifact</td><td>Secure Configuration Properties (encrypted <code>![...]</code>, <code>secure::</code>)</td></tr>
<tr><td>Keep a payload/field encrypted at rest</td><td>Cryptography module (PGP/JCE/XML)</td></tr>
<tr><td>Identify/authorize API consumers</td><td>API Manager policies (Client ID, OAuth, JWT)</td></tr>
</table>
<p>Common trap: <strong>TLS protects transit only</strong> — a file lands decrypted at the destination. If it must stay encrypted at rest, PGP-encrypt the payload with the recipient's public key before sending.</p>

<h3>TLS handshake troubleshooting</h3>
<table>
<tr><th>Symptom</th><th>Cause &amp; fix</th></tr>
<tr><td>PKIX path building failed / cert not trusted (as client)</td><td>Add the server's cert/CA to the requester's <strong>truststore</strong></td></tr>
<tr><td><code>Received fatal alert: certificate_required</code> (as client)</td><td>Server enforces mutual TLS → add a <strong>keystore</strong> (your client cert + key) to the request's TLS context</td></tr>
<tr><td>Handshake fails exposing HTTPS (as server)</td><td>Listener missing its <strong>keystore</strong> (server identity)</td></tr>
<tr><td>Works with <code>insecure="true"</code> only</td><td>Trust is misconfigured — fix the truststore; never ship <code>insecure</code> to prod</td></tr>
</table>

<h3>Masking vs. encryption of properties</h3>
<p>Two independent mechanisms, often used together:</p>
<ul>
<li><strong>Secure Configuration Properties module</strong> (in-app) — values are <em>encrypted</em> in the file as <code>![...]</code> and referenced with <code>secure::</code>; decrypted at runtime with a key supplied at startup (<code>-M-Dmule.key=…</code>). Protects secrets in source control and the artifact.</li>
<li><strong><code>secureProperties</code> array in mule-artifact.json</strong> — names deployment properties the platform should <em>mask</em> in the Runtime Manager UI/API and encrypt at rest. Masking ≠ encryption of your config file; you typically want both.</li>
</ul>
<p class="tip"><strong>Exam tip:</strong> "certificate_required" → client keystore (mutual TLS); "PKIX/not trusted" → client truststore; "readable in RM UI" → secureProperties; "unreadable in Git" → Secure Properties module; "encrypted at rest after SFTP" → PGP via Cryptography module.</p>`
    }
  },
  questions: {
    "m2-038": {
      options: [
        "Disable TLS certificate validation on the requester in production",
        "Add the service's certificate to a truststore configured on the HTTP Request's TLS context",
        "Attach a keystore holding the app's own private key to the request",
        "Rewrite the endpoint URL to use plain http:// instead"
      ],
      answer: 1,
      explanation: "The client must trust the server's certificate. Since it isn't signed by a public CA, import it (or its CA) into a truststore referenced by the requester's TLS context. Disabling validation or dropping to HTTP sacrifices security.",
      optionNotes: [
        "Wrong — disabling validation removes the protection TLS provides.",
        "Correct — trust the self-signed cert via a truststore on the requester.",
        "Wrong — a keystore proves your identity; it doesn't make you trust the server.",
        "Wrong — switching to HTTP abandons encryption entirely."
      ]
    },
    "m2-041": {
      options: [
        "Hardcoded in the YAML file right next to the encrypted values",
        "Supplied at deployment time (e.g. a hidden Runtime Manager property or CI-injected secret)",
        "Committed inside the project's pom.xml for reproducible builds",
        "Embedded in the DataWeave script that reads the property"
      ],
      answer: 1,
      explanation: "The key must stay out of source control and out of the artifact. It is injected at deploy/run time — e.g. a protected property in Runtime Manager or a pipeline secret.",
      optionNotes: [
        "Wrong — storing the key with the ciphertext defeats the encryption.",
        "Correct — inject the key at deploy time, never packaged with the data.",
        "Wrong — the pom.xml is in source control; the key must not be.",
        "Wrong — putting the key in a script still ships it inside the artifact."
      ]
    },
    "m2-042": {
      options: [
        "The TLS module, which secures the transport channel",
        "The Cryptography module (PGP, JCE, and XML strategies)",
        "The Validation module, which checks message content",
        "The Secure Properties module, which guards configuration"
      ],
      answer: 1,
      explanation: "The Cryptography module operates on payloads inside flows — PGP/JCE/XML encryption and signing. TLS protects the transport; secure properties protect configuration values.",
      optionNotes: [
        "Wrong — TLS protects transit, not payloads at rest.",
        "Correct — the Cryptography module encrypts/decrypts/signs payloads.",
        "Wrong — the Validation module checks conditions; it doesn't encrypt.",
        "Wrong — Secure Properties protects config values, not message payloads."
      ]
    },
    "m2-043": {
      options: [
        "JWT-based tokens are configured to never expire, avoiding refreshes",
        "The signature and claims are verified locally (via JWKS), avoiding a round trip per request",
        "JWT validation needs no configuration at all to work",
        "JWTs are always encrypted by default, unlike opaque tokens"
      ],
      answer: 1,
      explanation: "Signed JWTs are self-contained: the gateway verifies signature, expiry, and claims locally using the issuer's keys, reducing latency and dependency on the auth server. Introspection requires a call per token check.",
      optionNotes: [
        "Wrong — JWTs do expire; that's part of what's validated.",
        "Correct — local verification via JWKS avoids per-request introspection calls.",
        "Wrong — JWT validation still needs issuer keys/claims configured.",
        "Wrong — a signed JWT is not necessarily encrypted; the benefit is local verification."
      ]
    },
    "m2-044": {
      options: [
        "A CORS policy applied to the API instance",
        "Client ID enforcement (or OAuth), optionally with SLA-based rate-limiting tiers",
        "An IP allowlist restricting which networks may call",
        "A header injection policy adding a tracking header"
      ],
      answer: 1,
      explanation: "Client ID enforcement (or OAuth 2.0 token enforcement) identifies the consumer application, enabling contracts and per-tier SLA rate limits. IP lists don't reliably identify applications.",
      optionNotes: [
        "Wrong — CORS controls browser cross-origin calls, not consumer identity.",
        "Correct — Client ID/OAuth identifies the consumer and enables SLA tiers.",
        "Wrong — IPs don't identify a consumer application reliably.",
        "Wrong — header injection adds headers; it doesn't authenticate consumers."
      ]
    },
    "m2-045": {
      options: [
        "keytool, the JDK utility for JKS/PKCS12 keystores",
        "A dedicated mvn tls:generate Maven goal",
        "The Anypoint CLI, which is the only supported option",
        "OpenSSH's ssh-keygen command exclusively"
      ],
      answer: 0,
      explanation: "The JDK keytool utility generates key pairs, imports certificates, and manages JKS/PKCS12 stores referenced by Mule TLS contexts. (OpenSSL is also common for cert generation/conversion.)",
      optionNotes: [
        "Correct — keytool manages the JKS/PKCS12 stores TLS contexts reference.",
        "Wrong — there is no mvn tls:generate goal for this.",
        "Wrong — the Anypoint CLI doesn't manage keystores.",
        "Wrong — ssh-keygen makes SSH keys, not TLS keystores."
      ]
    },
    "m2-046": {
      options: [
        "The property's value is automatically encrypted in the file",
        "Its value is masked/hidden in Runtime Manager and logs instead of shown in plain text",
        "The property becomes read-only and cannot be overridden",
        "The property is stripped out of the deployable artifact"
      ],
      answer: 1,
      explanation: "secureProperties marks properties as sensitive so platform UIs and APIs never display their values. Encryption of stored values is a separate concern (the Secure Configuration Properties module).",
      optionNotes: [
        "Wrong — masking isn't encryption; encryption is the Secure Properties module's job.",
        "Correct — it hides/masks the value in RM UIs and APIs.",
        "Wrong — it doesn't make the property read-only.",
        "Wrong — the property still exists and is used; it's just masked."
      ]
    },
    "m2-047": {
      options: [
        "Base64-encode the passwords and call the gateway over plain HTTP",
        "Encrypt values with the Secure Properties module and add a truststore TLS context on the requester",
        "Store the passwords in flow variables and enable CORS on the API",
        "Carry the password in a custom HTTP header on each request"
      ],
      answer: 1,
      explanation: "Base64 is encoding, not encryption. Proper controls: encrypted secure properties for data at rest in config, and TLS with certificate validation for data in transit.",
      optionNotes: [
        "Wrong — Base64 is reversible encoding and HTTP isn't encrypted.",
        "Correct — encrypted secure properties (at rest) + TLS with a truststore (in transit).",
        "Wrong — flow variables don't protect Git-stored secrets, and CORS is unrelated.",
        "Wrong — a header still travels in plain text without TLS and doesn't protect config."
      ]
    },
    "m2-048": {
      options: [
        "Keystore holds certificates you trust; truststore holds your private keys",
        "Keystore holds your identity (private key + certificate); truststore holds certs you trust",
        "They are interchangeable names for the same file on disk",
        "Truststores are only ever used on the server side"
      ],
      answer: 1,
      explanation: "Keystore = prove who YOU are. Truststore = decide who you BELIEVE. A file format (JKS/PKCS12) can serve either role; the role depends on how it's referenced in the TLS context.",
      optionNotes: [
        "Wrong — that's the two reversed.",
        "Correct — keystore = your identity; truststore = whom you trust.",
        "Wrong — same format, but different roles by how they're referenced.",
        "Wrong — clients use truststores too (to validate servers)."
      ]
    },
    "m2-049": {
      options: [
        "One shared certificate and encryption key across all environments for simplicity",
        "Per-environment keystores/truststores and secure keys, selected via externalized deploy-time properties",
        "Store all certificates as assets in Anypoint Exchange",
        "Use TLS only in production and plain HTTP in dev"
      ],
      answer: 1,
      explanation: "Externalize keystore paths, passwords, and secure keys as (secure) properties per environment. Sharing prod secrets with dev violates least privilege; skipping TLS in dev hides configuration issues until production.",
      optionNotes: [
        "Wrong — sharing prod secrets with dev breaks least privilege.",
        "Correct — per-environment stores/keys via externalized properties.",
        "Wrong — Exchange is an asset catalog, not a per-env secret store.",
        "Wrong — dropping TLS in dev hides TLS misconfig until prod."
      ]
    },
    "m2-050": {
      options: [
        "A client_id supplied as a query parameter only",
        "A valid access token (Authorization: Bearer …) from the configured provider, with any required scopes",
        "A username and password sent in the request body",
        "An encrypted request payload the gateway decrypts"
      ],
      answer: 1,
      explanation: "The policy validates the presented access token against the configured provider (and optionally required scopes); requests without a valid token get 401/403.",
      optionNotes: [
        "Wrong — OAuth needs a token, not just a client_id query param.",
        "Correct — a valid bearer access token with required scopes.",
        "Wrong — basic credentials are a different policy, not OAuth token enforcement.",
        "Wrong — payload encryption isn't what this policy checks."
      ]
    },
    "m2-084": {
      options: [
        "Set insecure=true on the requester, including in production",
        "Add the partner's CA certificate to a truststore referenced by the request's TLS context",
        "Add a keystore holding the application's own private key",
        "Change the endpoint URL from https:// to http://"
      ],
      answer: 1,
      explanation: "PKIX errors mean the presented certificate isn't trusted. The CLIENT needs a truststore containing the private CA. A keystore (own identity) is only needed for mutual TLS; insecure=true is for prototyping only.",
      optionNotes: [
        "Wrong — insecure=true disables validation and must not reach production.",
        "Correct — trust the private CA via the requester's truststore.",
        "Wrong — a keystore is only for presenting your own identity (mutual TLS).",
        "Wrong — dropping to HTTP removes encryption."
      ]
    },
    "m2-086": {
      options: [
        "Enable TLS on the SFTP connection to the partner",
        "PGP-encrypt the payload with the partner's PUBLIC key (Cryptography module) before writing",
        "Move the credentials into secure configuration properties",
        "Apply a JWT validation policy to the transfer"
      ],
      answer: 1,
      explanation: "TLS/SFTP protect data in transit only — the file lands decrypted. PGP-encrypting the payload with the partner's public key keeps it protected at rest; only the partner's private key can decrypt.",
      optionNotes: [
        "Wrong — SFTP/TLS secure transit; the file is decrypted on arrival.",
        "Correct — PGP with the partner's public key keeps the file encrypted at rest.",
        "Wrong — secure properties protect config, not the transferred file.",
        "Wrong — JWT validation is an API auth policy, unrelated to file encryption."
      ]
    },
    "m2-087": {
      options: [
        "None; the two policies are just aliases for each other",
        "JWT validation verifies the token locally (JWKS/expiry/claims); OAuth enforcement introspects it against the provider",
        "OAuth enforcement can only be used with SOAP services",
        "JWT validation additionally requires client certificates"
      ],
      answer: 1,
      explanation: "Self-contained JWTs can be verified at the gateway with the provider's public keys (JWKS) — no per-request round trip, lower latency. Opaque OAuth tokens must be introspected against the authorization server.",
      optionNotes: [
        "Wrong — they work differently (local verification vs introspection).",
        "Correct — local JWT verification vs per-request OAuth introspection.",
        "Wrong — OAuth enforcement isn't SOAP-specific.",
        "Wrong — JWT validation doesn't require client certificates."
      ]
    },
    "m2-088": {
      options: [
        "Listener configured with a truststore only",
        "Listener with a keystore (its identity) + truststore (trusted client certs), requiring client auth",
        "Listener with a keystore only and nothing on the clients",
        "No certificates are needed to enable mutual TLS"
      ],
      answer: 1,
      explanation: "Two-way TLS means both sides authenticate: the server proves identity from its keystore AND validates client certificates against its truststore (with client auth required). Clients need their own keystore + a truststore for the server.",
      optionNotes: [
        "Wrong — a truststore alone can't prove the server's own identity.",
        "Correct — keystore + truststore + required client auth on the listener.",
        "Wrong — that's one-way TLS; clients must present certs for mutual TLS.",
        "Wrong — mutual TLS is entirely certificate-based."
      ]
    },
    "m2-085": {
      optionNotes: [
        "Correct — encrypted values are wrapped as ![encryptedValue] in the file.",
        "Correct — every property in a secure file uses the secure:: prefix, even plain ones.",
        "Correct — the key is passed at deploy time, never packaged with the data.",
        "Wrong — storing the key in the same file would defeat the encryption entirely."
      ]
    }
  }
};
