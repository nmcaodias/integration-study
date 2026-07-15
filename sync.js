/* Integration Study — progress sync via a private GitHub Gist.
   Self-contained: only touches the progress localStorage key and the GitHub API.
   app.js talks to it through window.SYNC. */
(function () {
  "use strict";

  const STORE_KEY = "mulesoft-study-v1";
  const TOKEN_KEY = "integration-study-gh-token";
  const GIST_KEY = "integration-study-gist-id";
  const GIST_DESC = "integration-study-progress";
  const GIST_FILE = "progress.json";
  const API = "https://api.github.com";
  const PUSH_DEBOUNCE_MS = 3000;

  let pushTimer = null;
  let status = localStorage.getItem(TOKEN_KEY) ? "idle" : "off";

  function setStatus(s, detail) {
    status = s;
    const el = document.getElementById("sync-status");
    if (el) {
      const icon = { off: "", idle: "✓", syncing: "⟳", error: "⚠" }[s] || "";
      const title = detail || {
        off: "Sync not connected",
        idle: "Progress synced",
        syncing: "Syncing…",
        error: "Sync error"
      }[s] || "";
      el.textContent = icon;
      el.title = title;
      el.className = "sync-" + s;
    }
  }

  const token = () => localStorage.getItem(TOKEN_KEY);
  const gistId = () => localStorage.getItem(GIST_KEY);

  async function gh(path, opts = {}) {
    const res = await fetch(API + path, {
      ...opts,
      headers: {
        "Accept": "application/vnd.github+json",
        "Authorization": "Bearer " + token(),
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
      }
    });
    if (!res.ok) {
      const hint = res.status === 401 ? " (invalid or expired token)"
        : res.status === 403 ? " (token lacks Gists permission, or rate-limited)"
        : res.status === 404 ? " (gist not found or token cannot see gists)" : "";
      throw new Error("GitHub API error " + res.status + hint);
    }
    return res.status === 204 ? null : res.json();
  }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function writeLocal(state) { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

  /* Merge two progress states: union of read sections, per-question max of
     attempts/correct, exams concatenated and de-duplicated by date, and
     spaced-repetition entries by latest review timestamp. */
  function mergeCert(a, b) {
    a = a || {}; b = b || {};
    const read = Object.assign({}, a.read || {}, b.read || {});
    const qstats = {};
    new Set([...Object.keys(a.qstats || {}), ...Object.keys(b.qstats || {})]).forEach(k => {
      const x = (a.qstats || {})[k] || { a: 0, c: 0 };
      const y = (b.qstats || {})[k] || { a: 0, c: 0 };
      qstats[k] = { a: Math.max(x.a || 0, y.a || 0), c: Math.max(x.c || 0, y.c || 0) };
    });
    const seen = new Set();
    const exams = [...(a.exams || []), ...(b.exams || [])]
      .filter(e => e && e.date && !seen.has(e.date) && seen.add(e.date))
      .sort((x, y) => (x.date < y.date ? -1 : 1));
    const srs = {};
    new Set([...Object.keys(a.srs || {}), ...Object.keys(b.srs || {})]).forEach(k => {
      const x = (a.srs || {})[k], y = (b.srs || {})[k];
      srs[k] = !x ? y : !y ? x : ((y.t || 0) > (x.t || 0) ? y : x); // latest review wins
    });
    return { read, qstats, exams, srs };
  }
  function merge(a, b) {
    a = a || {}; b = b || {};
    const out = {};
    new Set([...Object.keys(a), ...Object.keys(b)]).forEach(id => {
      out[id] = mergeCert(a[id], b[id]);
    });
    return out;
  }

  async function findOrCreateGist() {
    const gists = await gh("/gists?per_page=100");
    const found = gists.find(g => g.description === GIST_DESC && g.files && g.files[GIST_FILE]);
    if (found) {
      localStorage.setItem(GIST_KEY, found.id);
      return found.id;
    }
    const created = await gh("/gists", {
      method: "POST",
      body: JSON.stringify({
        description: GIST_DESC,
        public: false,
        files: { [GIST_FILE]: { content: JSON.stringify(readLocal()) } }
      })
    });
    localStorage.setItem(GIST_KEY, created.id);
    return created.id;
  }

  async function pull() {
    const g = await gh("/gists/" + gistId());
    const file = g.files && g.files[GIST_FILE];
    if (!file) return {};
    let content = file.content;
    if (file.truncated) content = await (await fetch(file.raw_url)).text();
    try { return JSON.parse(content) || {}; } catch (e) { return {}; }
  }

  async function push() {
    await gh("/gists/" + gistId(), {
      method: "PATCH",
      body: JSON.stringify({
        files: { [GIST_FILE]: { content: JSON.stringify(readLocal()) } }
      })
    });
  }

  window.SYNC = {
    isConnected: () => !!(token() && gistId()),
    status: () => status,
    gistId,
    merge,
    readLocal,

    initStatus() { setStatus(status); },

    /* Store the token, locate/create the gist, and do a first two-way sync.
       On failure everything is rolled back so the device stays disconnected. */
    async connect(tok) {
      localStorage.setItem(TOKEN_KEY, (tok || "").trim());
      setStatus("syncing");
      try {
        await findOrCreateGist();
        await this.pullAndMerge();
      } catch (e) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(GIST_KEY);
        setStatus("off");
        throw e;
      }
    },

    disconnect() {
      clearTimeout(pushTimer);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(GIST_KEY);
      setStatus("off");
    },

    /* Remote + local -> merged; written locally AND pushed back. */
    async pullAndMerge() {
      if (!this.isConnected()) return;
      setStatus("syncing");
      try {
        const merged = merge(readLocal(), await pull());
        writeLocal(merged);
        await push();
        setStatus("idle");
      } catch (e) {
        setStatus("error", String(e.message || e));
        throw e;
      }
    },

    /* Called by app.js on every save(); batches rapid changes into one PATCH. */
    schedulePush() {
      if (!this.isConnected()) return;
      clearTimeout(pushTimer);
      setStatus("syncing");
      pushTimer = setTimeout(async () => {
        try { await push(); setStatus("idle"); }
        catch (e) { setStatus("error", String(e.message || e)); }
      }, PUSH_DEBOUNCE_MS);
    },

    async syncNow() {
      clearTimeout(pushTimer);
      await this.pullAndMerge();
    }
  };
})();
