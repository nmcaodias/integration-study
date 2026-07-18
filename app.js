/* MuleSoft Certification Study App — SPA logic */
(function () {
  "use strict";

  let CERTS = {};
  let CERT_IDS = [];
  const STORE_KEY = "mulesoft-study-v1";
  const app = document.getElementById("app");
  const topnav = document.getElementById("topnav");

  /* ---------------- State & persistence ---------------- */
  function blankCertState() {
    return { read: {}, qstats: {}, exams: [], srs: {}, resets: {} };
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const s = raw ? JSON.parse(raw) : {};
      CERT_IDS.forEach(id => {
        if (!s[id]) s[id] = blankCertState();
        if (!s[id].srs) s[id].srs = {};       // backfill for saves from before flashcards
        if (!s[id].resets) s[id].resets = {}; // backfill for saves from before progress resets
      });
      return s;
    } catch (e) {
      const s = {};
      CERT_IDS.forEach(id => { s[id] = blankCertState(); });
      return s;
    }
  }
  let state = null;
  let saveWarned = false;
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      // quota / private mode: keep the in-memory session usable instead of
      // throwing inside the click handler that called us
      if (!saveWarned) { saveWarned = true; console.warn("Could not persist progress:", e); }
    }
    if (window.SYNC) SYNC.schedulePush();
  }

  // transient (not persisted) session state for the active quiz/exam
  let session = null;

  /* ---------------- Helpers ---------------- */
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const letters = ["A", "B", "C", "D", "E"];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const QUIZ_SIZE = 10; // every practice quiz is exactly this long (or the whole pool if smaller)

  // multi-select support: a question has either `answer` (number) or `answers` (array)
  function isMulti(q) { return Array.isArray(q.answers); }
  function levelOf(q) { return q.level || "medium"; }
  const LEVEL_PILL = { easy: "ok", medium: "info", hard: "warn" };
  function levelPill(q) {
    return q.level ? `<span class="pill ${LEVEL_PILL[levelOf(q)]}">${levelOf(q)}</span>` : "";
  }
  function exhibitHtml(q) {
    return q.exhibit ? `<pre class="exhibit"><code>${esc(q.exhibit)}</code></pre>` : "";
  }
  function answerSet(q) { return isMulti(q) ? q.answers : [q.answer]; }
  function setEq(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    const s = new Set(a);
    return b.every(x => s.has(x));
  }
  function correctLetters(q, order) {
    return answerSet(q).map(x => letters[order ? order.indexOf(x) : x]).sort().join(", ");
  }
  function makeOrders(questions) {
    return questions.map(q => shuffle(q.options.map((_, i) => i)));
  }

  function sectionById(cert, sid) {
    return cert.sections.find(s => s.id === sid);
  }

  function certStats(certId) {
    const cert = CERTS[certId];
    const cs = state[certId];
    const perSection = {};
    cert.sections.forEach(s => { perSection[s.id] = { attempts: 0, correct: 0, total: 0 }; });
    cert.questions.forEach(q => {
      perSection[q.section].total++;
      const st = cs.qstats[q.id];
      if (st && st.a > 0) {
        perSection[q.section].attempts++;
        if (st.c > 0) perSection[q.section].correct++;
      }
    });
    let attempted = 0, correct = 0;
    Object.values(perSection).forEach(p => { attempted += p.attempts; correct += p.correct; });
    const readCount = cert.sections.filter(s => cs.read[s.id]).length;
    const bestExam = cs.exams.reduce((b, e) => Math.max(b, e.pct), 0);
    return { perSection, attempted, correct, totalQ: cert.questions.length, readCount, bestExam, examCount: cs.exams.length };
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  /* ---------------- Spaced repetition (SM-2 lite) ---------------- */
  const DAY_MS = 24 * 60 * 60 * 1000;
  const NEW_CARDS_PER_SESSION = 15;

  // rating: 0=Again 1=Hard 2=Good 3=Easy — returns the updated srs entry
  function srsRate(entry, rating) {
    const e = entry || { ease: 2.5, ivl: 0, reps: 0 };
    let { ease, ivl, reps } = e;
    if (rating === 0) {          // Again
      reps = 0; ivl = 0; ease = Math.max(1.3, ease - 0.2);
    } else if (rating === 1) {   // Hard
      ivl = Math.max(1, ivl * 1.2); ease = Math.max(1.3, ease - 0.15); reps++;
    } else if (rating === 2) {   // Good
      ivl = reps === 0 ? 1 : ivl * ease; reps++;
    } else {                     // Easy
      ivl = reps === 0 ? 4 : ivl * ease * 1.3; ease = ease + 0.15; reps++;
    }
    ivl = Math.round(ivl * 10) / 10;
    return { ease: Math.round(ease * 100) / 100, ivl, reps, due: Date.now() + ivl * DAY_MS, t: Date.now() };
  }

  /* A reviewable card: authored ({id, section, front, back}) or an auto-card built
     from a question the user answered incorrectly (id "q:<questionId>"). */
  function cardById(cert, cardId) {
    if (cardId.startsWith("q:")) {
      const q = cert.questions.find(x => x.id === cardId.slice(2));
      if (!q) return null;
      return {
        id: cardId, section: q.section, auto: true,
        front: q.q + (q.exhibit ? "\n\n" + q.exhibit : "") + "\n\n" + q.options.map((o, i) => letters[i] + ". " + o).join("\n"),
        back: "Answer: " + answerSet(q).map(i => letters[i] + ". " + q.options[i]).join(" · ") + "\n\n" + q.explanation
      };
    }
    const c = (cert.cards || []).find(x => x.id === cardId);
    return c ? { ...c, auto: false } : null;
  }

  /* Due queue = all cards whose srs entry is due, plus up to NEW_CARDS_PER_SESSION
     authored cards never seen before. Auto-cards only exist once missed (srs entry
     created by the quiz/exam hook). */
  function buildFlashQueue(certId) {
    const cert = CERTS[certId];
    const srs = state[certId].srs;
    const now = Date.now();
    const due = Object.keys(srs)
      .filter(id => srs[id].due <= now && cardById(cert, id))
      .sort((a, b) => srs[a].due - srs[b].due);
    const fresh = shuffle((cert.cards || []).filter(c => !srs[c.id]).map(c => c.id))
      .slice(0, NEW_CARDS_PER_SESSION);
    return due.concat(fresh);
  }

  function flashCounts(certId) {
    const cert = CERTS[certId];
    const srs = state[certId].srs;
    const now = Date.now();
    let due = 0, future = Infinity;
    Object.keys(srs).forEach(id => {
      if (!cardById(cert, id)) return;
      if (srs[id].due <= now) due++;
      else future = Math.min(future, srs[id].due);
    });
    const fresh = (cert.cards || []).filter(c => !srs[c.id]).length;
    return { due, fresh: Math.min(fresh, NEW_CARDS_PER_SESSION), freshTotal: fresh, nextDue: future };
  }

  // hook: a wrongly answered question becomes a due flashcard
  function enqueueMissedQuestion(certId, questionId) {
    const srs = state[certId].srs;
    const id = "q:" + questionId;
    if (!srs[id]) srs[id] = { ease: 2.5, ivl: 0, reps: 0, due: Date.now(), t: Date.now() };
  }

  /* ---------------- Exam readiness ---------------- */
  function readiness(certId) {
    const cert = CERTS[certId];
    const cs = state[certId];
    const totalWeight = cert.sections.reduce((t, s) => t + (s.weight || 0), 0) || cert.sections.length;
    let coverageW = 0, accuracyW = 0;
    const perSection = [];
    cert.sections.forEach(sec => {
      const w = (sec.weight || (totalWeight / cert.sections.length)) / totalWeight;
      let attempted = 0, correctSum = 0, attemptSum = 0, total = 0;
      cert.questions.forEach(q => {
        if (q.section !== sec.id) return;
        total++;
        const st = cs.qstats[q.id];
        if (st && st.a > 0) { attempted++; attemptSum += st.a; correctSum += st.c; }
      });
      const coverage = total ? attempted / total : 0;
      const accuracy = attemptSum ? correctSum / attemptSum : 0;
      coverageW += w * coverage;
      accuracyW += w * accuracy;
      perSection.push({ sec, coverage, accuracy, attempted, total });
    });
    const cutoff = Date.now() - 30 * DAY_MS;
    const examEvidence = cs.exams
      .filter(e => new Date(e.date).getTime() >= cutoff)
      .reduce((b, e) => Math.max(b, e.pct), 0) / 100;
    const score = Math.round(100 * (0.30 * coverageW + 0.45 * accuracyW + 0.25 * examEvidence));
    const verdict = score >= 85 ? ["ready — book it", "ok"]
      : score >= 75 ? ["nearly ready", "ok"]
      : score >= 50 ? ["getting there", "warn"]
      : ["building foundations", "info"];
    // weakest sections: lowest (accuracy weighted by how attempted they are)
    const weakest = perSection
      .map(p => ({ ...p, weakScore: 0.6 * p.accuracy + 0.4 * p.coverage }))
      .sort((a, b) => a.weakScore - b.weakScore)
      .slice(0, 3);
    return { score, verdict, coverageW, accuracyW, examEvidence, weakest };
  }

  function bar(pct, cls) {
    return `<div class="bar"><div class="${cls || ""}" style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
  }

  /* Reset one topic: its notes-read mark, its questions' stats, and their
     auto-flashcards. A topic stamp (resets.topics) plus per-question tombstones
     (resets.q) let the sync merge honour the reset instead of resurrecting the
     old entries from another device. Returns true if the user confirmed. */
  function resetTopic(certId, sid) {
    const cert = CERTS[certId];
    const sec = sectionById(cert, sid);
    if (!confirm(`Reset progress for "${sec.title}" (notes read + quiz stats)? This also applies to your other synced devices.`)) return false;
    const cs = state[certId];
    const now = Date.now();
    cs.resets.topics = cs.resets.topics || {};
    cs.resets.q = cs.resets.q || {};
    cs.resets.topics[sid] = now;
    delete cs.read[sid];
    cert.questions.forEach(q => {
      if (q.section !== sid) return;
      delete cs.qstats[q.id];
      delete cs.srs["q:" + q.id];
      cs.resets.q[q.id] = now;
    });
    save();
    return true;
  }

  /* ---------------- Router ---------------- */
  function route() {
    if (!state) return; // data still loading (boot() calls route when ready)
    // leaving an unfinished exam? keep session only for its own route
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\//, "").split("/").filter(Boolean);
    stopTimer();
    window.scrollTo(0, 0);
    if (parts[0] === "sync") return renderSync();
    if (parts[0] === "flash") return renderFlash(parts[1]);
    if (parts.length === 0) return renderHome();
    if (parts[0] === "cert" && CERTS[parts[1]]) return renderCert(parts[1]);
    if (parts[0] === "notes" && CERTS[parts[1]] && sectionById(CERTS[parts[1]], parts[2])) return renderNotes(parts[1], parts[2]);
    if (parts[0] === "quiz" && CERTS[parts[1]]) return renderQuizSetup(parts[1]);
    if (parts[0] === "quizrun") return session && session.mode === "quiz" ? renderQuizQuestion() : go("#/");
    if (parts[0] === "exam" && CERTS[parts[1]]) return renderExamIntro(parts[1]);
    if (parts[0] === "examrun") return session && session.mode === "exam" ? renderExamQuestion() : go("#/");
    if (parts[0] === "history" && CERTS[parts[1]]) return renderHistory(parts[1]);
    renderHome();
  }
  function go(hash) { location.hash = hash; }
  window.addEventListener("hashchange", route);

  function vendorGroups() {
    // manifest order of first appearance
    const groups = [];
    CERT_IDS.forEach(id => {
      const v = CERTS[id].vendor || "Other";
      let g = groups.find(x => x.vendor === v);
      if (!g) { g = { vendor: v, ids: [] }; groups.push(g); }
      g.ids.push(id);
    });
    return groups;
  }

  function setNav(certId) {
    topnav.innerHTML = vendorGroups().map(g => {
      const activeIn = g.ids.includes(certId);
      return `
      <div class="nav-group">
        <button class="nav-drop ${activeIn ? "active" : ""}" aria-haspopup="true" aria-expanded="false">${esc(g.vendor)} <span class="caret">▾</span></button>
        <div class="nav-menu">
          ${g.ids.map(id => `<a href="#/cert/${id}" class="${certId === id ? "active" : ""}">${esc(CERTS[id].short)}</a>`).join("")}
        </div>
      </div>`;
    }).join("");
    topnav.querySelectorAll(".nav-drop").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const group = btn.parentElement;
        const wasOpen = group.classList.contains("open");
        closeNavMenus();
        if (!wasOpen) {
          group.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      };
    });
  }
  function closeNavMenus() {
    topnav.querySelectorAll(".nav-group.open").forEach(x => {
      x.classList.remove("open");
      const b = x.querySelector(".nav-drop");
      if (b) b.setAttribute("aria-expanded", "false");
    });
  }
  // any click outside the nav closes open menus (navigating re-renders the nav anyway)
  document.addEventListener("click", closeNavMenus);

  /* ---------------- Views ---------------- */
  function renderHome() {
    setNav(null);
    let html = "";
    vendorGroups().forEach(g => {
      let cards = "";
      g.ids.forEach(id => {
        const c = CERTS[id];
        const st = certStats(id);
        const pctSeen = st.totalQ ? Math.round(100 * st.attempted / st.totalQ) : 0;
        cards += `
        <a class="card card-link" href="#/cert/${id}">
          <h2>${esc(c.name)}</h2>
          <p class="muted">${c.exam.questions} questions · ${c.exam.minutes} min · ${c.exam.passPct}% to pass</p>
          <div class="mt-1">
            <div class="muted">Notes read: ${st.readCount}/${c.sections.length}</div>
            <div class="muted">Questions attempted: ${st.attempted}/${st.totalQ}</div>
            ${bar(pctSeen)}
            ${st.examCount ? `<span class="pill ${st.bestExam >= c.exam.passPct ? "ok" : "warn"}">Best exam: ${st.bestExam}%</span>` : `<span class="pill">No exam attempts yet</span>`}
          </div>
        </a>`;
      });
      html += `<h2 class="vendor-head">${esc(g.vendor)}</h2><div class="grid-2">${cards}</div>`;
    });
    app.innerHTML = `
      <h1>Integration Study</h1>
      <p class="subtitle">Pick a certification to study its topics, take practice quizzes, or run a full timed exam simulation.</p>
      ${html}`;
  }

  function renderCert(certId) {
    setNav(certId);
    const cert = CERTS[certId];
    const st = certStats(certId);
    const cs = state[certId];

    let rows = "";
    cert.sections.forEach(sec => {
      const p = st.perSection[sec.id];
      const acc = p.attempts ? Math.round(100 * p.correct / p.attempts) : null;
      rows += `
      <div class="topic-row">
        <div class="t-title">
          <a href="#/notes/${certId}/${sec.id}">${esc(sec.title)}</a>${(() => {
            const d = sec.docs && sec.docs.length ? sec.docs[0].url
              : sec.topicDocs ? Object.values(sec.topicDocs)[0] : null;
            return d ? ` <a class="doc-link" href="${d}" target="_blank" rel="noopener" title="Official documentation">📖</a>` : "";
          })()}
          <div class="t-meta">${sec.weight ? sec.weight + "% of exam · " : ""}${p.total} questions${cs.read[sec.id] ? " · ✅ notes read" : ""}</div>
        </div>
        <div class="t-stats">
          ${acc === null ? '<span class="pill">not attempted</span>' :
            `<span class="pill ${acc >= 70 ? "ok" : "bad"}">${acc}% correct</span>`}
          <button class="icon-btn topic-reset" data-sid="${sec.id}" title="Reset this topic's progress">↺</button>
        </div>
      </div>`;
    });

    const lastExams = cs.exams.slice(-3).reverse().map(e =>
      `<span class="pill ${e.pass ? "ok" : "bad"}">${e.pct}%</span>`).join(" ");
    const rd = readiness(certId);
    const fc = flashCounts(certId);

    app.innerHTML = `
      <h1>${esc(cert.name)}</h1>
      <p class="subtitle">Real exam: ${cert.exam.questions} questions · ${cert.exam.minutes} minutes · ${cert.exam.passPct}% to pass</p>
      <div class="btn-row" style="margin-bottom:1.2rem">
        <a class="btn" href="#/quiz/${certId}">📝 Practice quiz</a>
        <button class="btn" id="weak-quiz" title="15 questions picked from your weakest and least-practiced areas">🎯 Practice weak areas</button>
        <a class="btn" href="#/flash/${certId}">🃏 Flashcards${fc.due + fc.fresh ? ` <span class="pill warn">${fc.due + fc.fresh}</span>` : ""}</a>
        <a class="btn" href="#/exam/${certId}">⏱️ Exam simulation</a>
        <a class="btn secondary" href="#/history/${certId}">📈 Exam history ${lastExams ? "· " + lastExams : ""}</a>
      </div>
      ${st.attempted ? "" : `<p class="muted" style="margin-bottom:1rem">🎯 Weak-areas practice gets smarter as you answer questions — right now it's mostly random.</p>`}
      <div class="card readiness">
        <h2>Exam readiness <span class="pill ${rd.verdict[1]}">${rd.score}% · ${rd.verdict[0]}</span></h2>
        <div class="ready-bars">
          <div class="ready-row"><span>Coverage <small class="muted">(30%) — how much of the bank you've attempted</small></span>${bar(Math.round(100 * rd.coverageW))}</div>
          <div class="ready-row"><span>Accuracy <small class="muted">(45%) — weighted by exam topic weights</small></span>${bar(Math.round(100 * rd.accuracyW))}</div>
          <div class="ready-row"><span>Recent exam <small class="muted">(25%) — best simulation in the last 30 days</small></span>${bar(Math.round(100 * rd.examEvidence))}</div>
        </div>
        ${st.attempted ? `<p class="muted" style="margin-top:.6rem">Focus next: ${rd.weakest.map(w =>
          `<strong>${esc(w.sec.title)}</strong> (${Math.round(100 * w.accuracy)}% accuracy · ${Math.round(100 * w.coverage)}% attempted)`).join(" · ")}</p>`
        : `<p class="muted" style="margin-top:.6rem">Take quizzes and exam simulations to build up this score.</p>`}
      </div>
      <div class="card">
        <h2>Topics</h2>
        ${rows}
      </div>
      <div class="card reset-zone">
        <h2>Reset progress</h2>
        <p class="muted">Start over on any part of this certification. Exam readiness is computed from
        quiz stats and exam history, so resetting those resets it too. Resets carry over to your
        other synced devices.</p>
        <div class="btn-row">
          <button class="btn danger" id="reset-read">Reset notes read</button>
          <button class="btn danger" id="reset-quiz">Reset quiz stats</button>
          <button class="btn danger" id="reset-exams">Reset exam history</button>
          <button class="btn danger" id="reset-all">Reset everything</button>
        </div>
      </div>`;

    document.getElementById("weak-quiz").onclick = () => {
      startQuiz(certId, null, 0, buildWeakPool(certId, 15));
    };

    app.querySelectorAll(".topic-reset").forEach(btn => {
      btn.onclick = () => { if (resetTopic(certId, btn.dataset.sid)) renderCert(certId); };
    });

    const doReset = (fields, label) => {
      if (!confirm(`Reset ${label} for ${cert.short}? This also applies to your other synced devices.`)) return;
      const live = state[certId]; // re-read: a background sync merge may have replaced `state` since render
      const now = Date.now();
      fields.forEach(f => {
        live[f] = f === "exams" ? [] : {};
        live.resets[f] = now;
      });
      save();
      renderCert(certId);
    };
    document.getElementById("reset-read").onclick = () => doReset(["read"], "the notes-read marks");
    document.getElementById("reset-quiz").onclick = () => doReset(["qstats"], "quiz stats (per-topic percentages and readiness)");
    document.getElementById("reset-exams").onclick = () => doReset(["exams"], "the exam history");
    document.getElementById("reset-all").onclick = () => doReset(["read", "qstats", "exams", "srs"], "ALL progress (notes, quiz stats, exams, flashcards)");
  }

  function renderNotes(certId, sid) {
    setNav(certId);
    const cert = CERTS[certId];
    const sec = sectionById(cert, sid);
    const idx = cert.sections.indexOf(sec);
    const prev = cert.sections[idx - 1], next = cert.sections[idx + 1];
    const isRead = !!state[certId].read[sid];
    const qCount = cert.questions.filter(q => q.section === sid).length;

    app.innerHTML = `
      <p class="muted"><a href="#/cert/${certId}">← ${esc(cert.short)}</a></p>
      <h1>${esc(sec.title)}</h1>
      <p class="subtitle">${sec.weight ? sec.weight + "% of the exam · " : ""}Section ${idx + 1} of ${cert.sections.length} · <span class="muted">📖 next to a topic links to its official documentation</span></p>
      <div class="card">
        <h3>🎯 Exam objectives</h3>
        <ul class="objectives">${sec.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
        <div class="notes-body">${sec.notes}</div>
        <div class="btn-row">
          <button class="btn ${isRead ? "secondary" : ""}" id="mark-read">${isRead ? "✅ Marked as read (click to unmark)" : "Mark as read"}</button>
          <button class="btn secondary" id="quiz-section">Quiz me on this topic (${Math.min(QUIZ_SIZE, qCount)} of ${qCount} questions)</button>
          <button class="btn danger" id="topic-reset">↺ Reset topic progress</button>
        </div>
      </div>
      <div class="btn-row">
        ${prev ? `<a class="btn secondary" href="#/notes/${certId}/${prev.id}">← ${esc(prev.title)}</a>` : ""}
        ${next ? `<a class="btn secondary" href="#/notes/${certId}/${next.id}">${esc(next.title)} →</a>` : ""}
      </div>`;

    if (sec.topicDocs) {
      app.querySelectorAll(".notes-body h3").forEach(h => {
        const url = sec.topicDocs[h.textContent.trim()];
        if (!url) return;
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.className = "h-doc";
        a.textContent = "📖";
        a.title = "Official MuleSoft documentation";
        h.append(" ", a);
      });
    }

    document.getElementById("mark-read").onclick = () => {
      const cs = state[certId];
      if (cs.read[sid]) {
        delete cs.read[sid];
        // tombstone, or the sync merge resurrects the mark from another device
        // (topic stamps only affect read marks in the merge, never quiz stats)
        cs.resets.topics = cs.resets.topics || {};
        cs.resets.topics[sid] = Date.now();
      } else {
        cs.read[sid] = Date.now(); // timestamp lets sync merges honour topic resets
      }
      save();
      renderNotes(certId, sid);
    };
    document.getElementById("quiz-section").onclick = () => startQuiz(certId, sid, QUIZ_SIZE);
    document.getElementById("topic-reset").onclick = () => { if (resetTopic(certId, sid)) renderNotes(certId, sid); };
  }

  /* ---------------- Practice quiz ---------------- */
  function renderQuizSetup(certId) {
    setNav(certId);
    const cert = CERTS[certId];
    const opts = cert.sections.map(s => {
      const n = cert.questions.filter(q => q.section === s.id).length;
      return `<option value="${s.id}">${esc(s.title)} (${n})</option>`;
    }).join("");

    app.innerHTML = `
      <p class="muted"><a href="#/cert/${certId}">← ${esc(cert.short)}</a></p>
      <h1>Practice quiz</h1>
      <p class="subtitle">10 questions per quiz. Instant feedback with explanations after every question. Results feed your per-topic stats.</p>
      <div class="card">
        <div class="setup-field">
          <label for="quiz-topic">Topic</label>
          <select id="quiz-topic">
            <option value="all">All topics (${cert.questions.length} questions)</option>
            ${opts}
          </select>
        </div>
        <div class="setup-field">
          <label for="quiz-level">Difficulty</label>
          <select id="quiz-level">
            <option value="all">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button class="btn" id="quiz-start">Start quiz</button>
      </div>`;

    document.getElementById("quiz-start").onclick = () => {
      const topic = document.getElementById("quiz-topic").value;
      const level = document.getElementById("quiz-level").value;
      startQuiz(certId, topic === "all" ? null : topic, QUIZ_SIZE, null, level === "all" ? null : level);
    };
  }

  function startQuiz(certId, sectionId, count, prebuiltPool, level) {
    const cert = CERTS[certId];
    let pool = prebuiltPool
      ? prebuiltPool.slice()
      : shuffle(sectionId ? cert.questions.filter(q => q.section === sectionId) : cert.questions.slice());
    if (level) pool = pool.filter(q => levelOf(q) === level);
    if (!pool.length) { alert("No questions match that topic/difficulty combination."); return; }
    if (count > 0) pool = pool.slice(0, count);
    session = {
      mode: "quiz", certId, questions: pool, idx: 0,
      answers: new Array(pool.length).fill(null), // chosen original index (or array for multi)
      orders: makeOrders(pool),                   // per-question shuffled display order
      picked: [],                                 // multi: currently toggled original indexes
      revealed: false, correctCount: 0
    };
    go("#/quizrun");
    // if hash unchanged (already on quizrun), force render
    if (location.hash === "#/quizrun") renderQuizQuestion();
  }

  /* Weak-areas pool: unseen questions are unknowns, low-accuracy ones are weaknesses.
     Blend ~1/3 unseen with ~2/3 worst-accuracy attempted questions. */
  function buildWeakPool(certId, size) {
    const cert = CERTS[certId];
    const qs = state[certId].qstats;
    const unseen = shuffle(cert.questions.filter(q => !qs[q.id] || !qs[q.id].a));
    const attempted = cert.questions.filter(q => qs[q.id] && qs[q.id].a > 0)
      .map(q => ({ q, acc: qs[q.id].c / qs[q.id].a, r: Math.random() }))
      .sort((a, b) => (a.acc - b.acc) || (a.r - b.r))
      .map(x => x.q);
    const wantUnseen = Math.min(unseen.length, Math.round(size / 3));
    const pool = attempted.slice(0, size - wantUnseen).concat(unseen.slice(0, wantUnseen));
    // top up from whatever is left if the bank is small
    const chosen = new Set(pool.map(q => q.id));
    const rest = shuffle(cert.questions.filter(q => !chosen.has(q.id)));
    while (pool.length < size && rest.length) pool.push(rest.pop());
    return shuffle(pool);
  }

  function renderQuizQuestion() {
    const s = session;
    const cert = CERTS[s.certId];
    if (s.idx >= s.questions.length) return renderQuizSummary();
    const q = s.questions[s.idx];
    const sec = sectionById(cert, q.section);
    const order = s.orders[s.idx];
    const chosen = s.answers[s.idx]; // original index (single) or array (multi)
    const multi = isMulti(q);
    const correctSet = new Set(answerSet(q));
    const chosenSet = new Set(multi ? (chosen || s.picked) : (chosen === null ? [] : [chosen]));

    const optionsHtml = order.map((origIdx, pos) => {
      let cls = "option";
      let dis = "";
      if (s.revealed) {
        dis = "disabled";
        if (correctSet.has(origIdx)) cls += " correct";
        else if (chosenSet.has(origIdx)) cls += " wrong";
      } else if (multi && s.picked.includes(origIdx)) {
        cls += " selected";
      }
      const note = s.revealed && q.optionNotes && q.optionNotes[origIdx]
        ? `<small class="opt-note">${esc(q.optionNotes[origIdx])}</small>` : "";
      return `<button class="${cls}" data-i="${origIdx}" ${dis}><span class="letter">${letters[pos]}.</span><span>${esc(q.options[origIdx])}${note}</span></button>`;
    }).join("");

    const wasCorrect = multi ? setEq(chosen || [], answerSet(q)) : chosen === q.answer;

    app.innerHTML = `
      <div class="q-progress">
        <span>Question ${s.idx + 1} of ${s.questions.length} · ${esc(cert.short)}</span>
        <span>Score: ${s.correctCount}/${s.idx + (s.revealed ? 1 : 0)}</span>
      </div>
      <div class="card">
        <div class="q-section-tag"><span class="pill info">${esc(sec.title)}</span> ${levelPill(q)}${multi ? ` <span class="pill warn">Select all that apply (${answerSet(q).length})</span>` : ""}</div>
        <div class="q-text">${esc(q.q)}</div>
        ${exhibitHtml(q)}
        <div class="options">${optionsHtml}</div>
        ${s.revealed ? `
          <div class="explanation">
            <strong>${wasCorrect ? "✅ Correct!" : "❌ Incorrect — the answer is " + correctLetters(q, order) + "."}</strong>
            ${esc(q.explanation)}
          </div>
          <div class="btn-row">
            <button class="btn" id="q-next">${s.idx + 1 < s.questions.length ? "Next question →" : "Finish quiz"}</button>
            <button class="btn secondary" id="q-quit">End quiz</button>
          </div>` : `
          <div class="btn-row">
            ${multi ? `<button class="btn" id="q-check">Check answer</button>` : ""}
            <button class="btn secondary" id="q-quit">End quiz</button>
          </div>`}
        <p class="kbd-hint muted">Keys: 1–${order.length} select · Enter ${multi && !s.revealed ? "check" : "next"}</p>
      </div>`;

    function commitAnswer(chosenValue, correct) {
      s.answers[s.idx] = chosenValue;
      s.revealed = true;
      s.picked = [];
      if (correct) s.correctCount++;
      const qs = state[s.certId].qstats;
      if (!qs[q.id]) qs[q.id] = { a: 0, c: 0 };
      qs[q.id].a++;
      if (correct) qs[q.id].c++;
      else enqueueMissedQuestion(s.certId, q.id);
      qs[q.id].t = Date.now();
      save();
      renderQuizQuestion();
    }

    if (!s.revealed) {
      app.querySelectorAll(".option").forEach(btn => {
        btn.onclick = () => {
          const i = parseInt(btn.dataset.i, 10);
          if (multi) {
            s.picked = s.picked.includes(i) ? s.picked.filter(x => x !== i) : s.picked.concat(i);
            renderQuizQuestion();
          } else {
            commitAnswer(i, i === q.answer);
          }
        };
      });
      if (multi) {
        document.getElementById("q-check").onclick = () => {
          if (!s.picked.length) return;
          commitAnswer(s.picked.slice(), setEq(s.picked, answerSet(q)));
        };
      }
    } else {
      document.getElementById("q-next").onclick = () => {
        s.idx++;
        s.revealed = false;
        renderQuizQuestion();
      };
    }
    document.getElementById("q-quit").onclick = () => {
      s.idx = s.questions.length; // jump to summary of what was answered
      renderQuizSummary();
    };
  }

  function renderQuizSummary() {
    const s = session;
    const cert = CERTS[s.certId];
    const answered = s.answers.filter(a => a !== null).length;
    const pct = answered ? Math.round(100 * s.correctCount / answered) : 0;
    app.innerHTML = `
      <div class="card">
        <div class="score-hero">
          ${answered ? `
          <div class="big ${pct >= cert.exam.passPct ? "pass" : "fail"}">${pct}%</div>
          <p class="muted">${s.correctCount} of ${answered} answered correctly</p>` : `
          <div class="big">–</div>
          <p class="muted">No questions answered</p>`}
        </div>
        <div class="btn-row" style="justify-content:center">
          <a class="btn" href="#/quiz/${s.certId}">Another quiz</a>
          <a class="btn secondary" href="#/cert/${s.certId}">Back to ${esc(cert.short)}</a>
        </div>
      </div>`;
    session = null;
  }

  /* ---------------- Exam simulation ---------------- */
  function renderExamIntro(certId) {
    setNav(certId);
    const cert = CERTS[certId];
    const n = Math.min(cert.exam.questions, cert.questions.length);
    app.innerHTML = `
      <p class="muted"><a href="#/cert/${certId}">← ${esc(cert.short)}</a></p>
      <h1>Exam simulation</h1>
      <div class="card">
        <p>This simulates the real <strong>${esc(cert.name)}</strong> exam:</p>
        <ul class="objectives">
          <li><strong>${n} questions</strong>${n < cert.exam.questions ? ` (question bank currently has ${cert.questions.length}; real exam has ${cert.exam.questions})` : ""}, drawn across all topics${cert.sections.some(x => x.weight) ? " according to their exam weightings" : ""}</li>
          <li><strong>${cert.exam.minutes} minutes</strong> countdown — the exam auto-submits when time runs out</li>
          <li><strong>No feedback during the exam</strong>; flag questions and revisit them before submitting</li>
          <li><strong>${cert.exam.passPct}% required to pass</strong>, with a per-topic score report at the end</li>
        </ul>
        <button class="btn" id="exam-start">Start exam</button>
      </div>`;
    document.getElementById("exam-start").onclick = () => startExam(certId);
  }

  function drawExamQuestions(cert) {
    const target = Math.min(cert.exam.questions, cert.questions.length);
    const bySection = {};
    cert.sections.forEach(s => { bySection[s.id] = shuffle(cert.questions.filter(q => q.section === s.id)); });
    const totalWeight = cert.sections.reduce((t, s) => t + (s.weight || 0), 0);
    let picked = [];
    // desired count per section: by weight if defined, else proportional to bank size
    cert.sections.forEach(s => {
      const share = totalWeight
        ? (s.weight || 0) / totalWeight
        : bySection[s.id].length / cert.questions.length;
      const want = Math.round(share * target);
      picked = picked.concat(bySection[s.id].splice(0, want));
    });
    // fix rounding drift: top up or trim
    const leftovers = shuffle(Object.values(bySection).flat());
    while (picked.length < target && leftovers.length) picked.push(leftovers.pop());
    picked = shuffle(picked).slice(0, target);
    return picked;
  }

  let timerHandle = null;
  function stopTimer() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
  }

  function startExam(certId) {
    const cert = CERTS[certId];
    const drawn = drawExamQuestions(cert);
    session = {
      mode: "exam", certId,
      questions: drawn,
      orders: makeOrders(drawn),
      idx: 0,
      answers: {}, flags: {},
      // fixed deadline (not a decremented counter) so time keeps running even
      // if the user navigates away from the exam and comes back
      endAt: Date.now() + cert.exam.minutes * 60 * 1000,
      startedAt: Date.now()
    };
    go("#/examrun");
    if (location.hash === "#/examrun") renderExamQuestion();
  }

  function examSecondsLeft(s) {
    return Math.max(0, Math.ceil((s.endAt - Date.now()) / 1000));
  }

  function renderExamQuestion() {
    const s = session;
    const cert = CERTS[s.certId];
    if (examSecondsLeft(s) <= 0) { // deadline passed while away from the exam
      alert("Time is up! The exam will be submitted.");
      return finishExam();
    }
    const q = s.questions[s.idx];
    const chosen = s.answers[s.idx];
    const order = s.orders[s.idx];
    const multi = isMulti(q);
    const chosenSet = new Set(multi ? (chosen || []) : (chosen === undefined ? [] : [chosen]));

    const optionsHtml = order.map((origIdx, pos) =>
      `<button class="option ${chosenSet.has(origIdx) ? "selected" : ""}" data-i="${origIdx}">
         <span class="letter">${letters[pos]}.</span><span>${esc(q.options[origIdx])}</span>
       </button>`).join("");

    const grid = s.questions.map((_, i) => {
      let cls = [];
      if (s.answers[i] !== undefined) cls.push("answered");
      if (s.flags[i]) cls.push("flagged");
      if (i === s.idx) cls.push("current");
      return `<button class="${cls.join(" ")}" data-n="${i}">${i + 1}</button>`;
    }).join("");

    const answeredCount = Object.keys(s.answers).length;

    app.innerHTML = `
      <div class="exam-header">
        <span class="pill info">${esc(cert.short)} exam · ${answeredCount}/${s.questions.length} answered</span>
        <span class="timer" id="timer">${fmtTime(examSecondsLeft(s))}</span>
      </div>
      <div class="card">
        <div class="q-progress"><span>Question ${s.idx + 1} of ${s.questions.length}</span>
          <button class="btn secondary" id="flag-btn" style="padding:.25rem .7rem">${s.flags[s.idx] ? "🚩 Unflag" : "🏳️ Flag for review"}</button>
        </div>
        <div class="q-text">${multi ? `<span class="pill warn">Select all that apply (${answerSet(q).length})</span> ` : ""}${levelPill(q)}${multi || q.level ? "<br>" : ""}${esc(q.q)}</div>
        ${exhibitHtml(q)}
        <div class="options">${optionsHtml}</div>
        <div class="btn-row">
          <button class="btn secondary" id="prev-btn" ${s.idx === 0 ? "disabled" : ""}>← Previous</button>
          <button class="btn secondary" id="next-btn" ${s.idx === s.questions.length - 1 ? "disabled" : ""}>Next →</button>
          <button class="btn danger" id="submit-btn">Submit exam</button>
        </div>
        <p class="kbd-hint muted">Keys: 1–${order.length} ${multi ? "toggle" : "select"} · ←/→ navigate · F flag</p>
      </div>
      <div class="card">
        <p class="muted">Navigator — blue = answered, yellow = flagged</p>
        <div class="nav-grid">${grid}</div>
      </div>`;

    app.querySelectorAll(".option").forEach(btn => {
      btn.onclick = () => {
        const i = parseInt(btn.dataset.i, 10);
        if (multi) {
          // toggle; no auto-advance for multi-select
          const cur = s.answers[s.idx] || [];
          const next = cur.includes(i) ? cur.filter(x => x !== i) : cur.concat(i);
          if (next.length) s.answers[s.idx] = next; else delete s.answers[s.idx];
        } else {
          s.answers[s.idx] = i;
          // auto-advance except on the last question
          if (s.idx < s.questions.length - 1) s.idx++;
        }
        renderExamQuestion();
      };
    });
    app.querySelectorAll(".nav-grid button").forEach(btn => {
      btn.onclick = () => { s.idx = parseInt(btn.dataset.n, 10); renderExamQuestion(); };
    });
    document.getElementById("prev-btn").onclick = () => { s.idx--; renderExamQuestion(); };
    document.getElementById("next-btn").onclick = () => { s.idx++; renderExamQuestion(); };
    document.getElementById("flag-btn").onclick = () => {
      s.flags[s.idx] = !s.flags[s.idx];
      renderExamQuestion();
    };
    document.getElementById("submit-btn").onclick = () => {
      const unanswered = s.questions.length - Object.keys(s.answers).length;
      const msg = unanswered > 0
        ? `You still have ${unanswered} unanswered question(s). Submit anyway?`
        : "Submit the exam and see your results?";
      if (confirm(msg)) finishExam();
    };

    // (re)start the countdown
    stopTimer();
    timerHandle = setInterval(() => {
      const left = examSecondsLeft(s);
      const el = document.getElementById("timer");
      if (el) {
        el.textContent = fmtTime(left);
        if (left <= 300) el.classList.add("low");
      }
      if (left <= 0) {
        stopTimer();
        alert("Time is up! The exam will be submitted.");
        finishExam();
      }
    }, 1000);
  }

  function finishExam() {
    stopTimer();
    const s = session;
    const cert = CERTS[s.certId];
    const perSection = {};
    cert.sections.forEach(x => { perSection[x.id] = { c: 0, t: 0 }; });
    let correct = 0;
    const review = [];
    s.questions.forEach((q, i) => {
      const chosen = s.answers[i];
      const ok = isMulti(q)
        ? setEq(chosen || [], answerSet(q))
        : chosen === q.answer;
      perSection[q.section].t++;
      if (ok) { correct++; perSection[q.section].c++; }
      else {
        review.push({ q, chosen: chosen === undefined ? null : chosen, order: s.orders[i] });
        enqueueMissedQuestion(s.certId, q.id);
      }
      // exam answers also feed question stats
      const qs = state[s.certId].qstats;
      if (!qs[q.id]) qs[q.id] = { a: 0, c: 0 };
      qs[q.id].a++;
      if (ok) qs[q.id].c++;
      qs[q.id].t = Date.now();
    });
    const total = s.questions.length;
    const pct = Math.round(100 * correct / total);
    const result = {
      date: new Date().toISOString(),
      score: correct, total, pct,
      pass: pct >= cert.exam.passPct,
      perSection,
      durationSec: Math.round((Date.now() - s.startedAt) / 1000)
    };
    state[s.certId].exams.push(result);
    save();
    renderExamResults(result, review);
  }

  function renderExamResults(result, review) {
    const s = session;
    const cert = CERTS[s.certId];

    const sectionRows = cert.sections.map(sec => {
      const p = result.perSection[sec.id];
      if (!p.t) return "";
      const pct = Math.round(100 * p.c / p.t);
      return `<div class="result-row">
        <span class="rr-name">${esc(sec.title)}</span>
        <span class="rr-bar">${bar(pct, pct >= cert.exam.passPct ? "ok" : "bad")}</span>
        <span class="rr-num">${p.c}/${p.t} (${pct}%)</span>
      </div>`;
    }).join("");

    // label with the letters the user actually saw (options were displayed
    // shuffled during the exam, in r.order)
    const reviewHtml = review.length ? review.map(r => {
      const letterOf = origIdx => letters[r.order.indexOf(origIdx)];
      return `
      <div class="review-item">
        <div class="q-text" style="font-size:.98rem">${esc(r.q.q)}</div>
        ${exhibitHtml(r.q)}
        <p>${r.chosen === null
          ? '<span class="pill warn">Not answered</span>'
          : `<span class="pill bad">Your answer: ${(Array.isArray(r.chosen) ? r.chosen : [r.chosen]).map(c => letterOf(c) + ". " + esc(r.q.options[c])).join(" · ")}</span>`}</p>
        <p><span class="pill ok">Correct: ${answerSet(r.q).map(c => letterOf(c) + ". " + esc(r.q.options[c])).join(" · ")}</span></p>
        ${r.q.optionNotes ? `<ul class="opt-note-list">${r.order.map((origIdx, pos) =>
          `<li><strong>${letters[pos]}.</strong> ${esc(r.q.optionNotes[origIdx])}</li>`).join("")}</ul>` : ""}
        <div class="explanation">${esc(r.q.explanation)}</div>
      </div>`;
    }).join("") : "<p class='muted'>Perfect — nothing to review! 🎉</p>";

    app.innerHTML = `
      <div class="card">
        <div class="score-hero">
          <div class="big ${result.pass ? "pass" : "fail"}">${result.pct}%</div>
          <p><strong>${result.pass ? "PASS 🎉" : "FAIL"}</strong> — ${result.score}/${result.total} correct (needed ${cert.exam.passPct}%) · time used: ${fmtTime(result.durationSec)}</p>
        </div>
      </div>
      <div class="card">
        <h2>Score by topic</h2>
        ${sectionRows}
      </div>
      <div class="card">
        <h2>Review incorrect answers (${review.length})</h2>
        ${reviewHtml}
      </div>
      <div class="btn-row">
        <a class="btn" href="#/exam/${s.certId}">Retake exam</a>
        <a class="btn secondary" href="#/cert/${s.certId}">Back to ${esc(cert.short)}</a>
      </div>`;
    session = null;
  }

  function renderHistory(certId) {
    setNav(certId);
    const cert = CERTS[certId];
    const exams = state[certId].exams.slice().reverse();
    const rows = exams.map(e => `
      <tr>
        <td>${new Date(e.date).toLocaleString()}</td>
        <td>${e.score}/${e.total}</td>
        <td>${e.pct}%</td>
        <td><span class="pill ${e.pass ? "ok" : "bad"}">${e.pass ? "PASS" : "FAIL"}</span></td>
        <td>${fmtTime(e.durationSec)}</td>
      </tr>`).join("");

    app.innerHTML = `
      <p class="muted"><a href="#/cert/${certId}">← ${esc(cert.short)}</a></p>
      <h1>Exam history</h1>
      <div class="card">
        ${exams.length ? `<table class="history-table">
          <thead><tr><th>Date</th><th>Score</th><th>%</th><th>Result</th><th>Time</th></tr></thead>
          <tbody>${rows}</tbody></table>`
        : "<p class='muted'>No exam attempts yet. Take your first simulation!</p>"}
        ${exams.length ? `<div class="btn-row"><button class="btn danger" id="clear-history">Clear history</button></div>` : ""}
      </div>`;

    const clearBtn = document.getElementById("clear-history");
    if (clearBtn) clearBtn.onclick = () => {
      if (confirm("Delete all exam attempts for " + cert.short + "?")) {
        const cs = state[certId];
        cs.exams = [];
        cs.resets.exams = Date.now(); // stamp, or the sync merge restores the attempts
        save();
        renderHistory(certId);
      }
    };
  }

  /* ---------------- Flashcards ---------------- */
  let flashSession = null;

  function renderFlash(certId) {
    setNav(certId);
    const cert = CERTS[certId];
    if (!cert) return go("#/");
    // always start a fresh queue on entering the route — mid-session reviews
    // never re-enter it (rateFlash renders directly), and a kept-around session
    // would hide cards that became due since it was built
    flashSession = { certId, queue: buildFlashQueue(certId), revealed: false, done: 0 };
    renderFlashCard();
  }

  function fmtIvl(ivl) {
    if (ivl < 1) return "<10 min";
    if (ivl < 30) return Math.round(ivl) + " d";
    return Math.round(ivl / 30) + " mo";
  }

  function renderFlashCard() {
    const fs = flashSession;
    const cert = CERTS[fs.certId];

    if (!fs.queue.length) {
      const counts = flashCounts(fs.certId);
      const next = counts.nextDue === Infinity ? null : new Date(counts.nextDue);
      app.innerHTML = `
        <p class="muted"><a href="#/cert/${fs.certId}">← ${esc(cert.short)}</a></p>
        <h1>🃏 Flashcards</h1>
        <div class="card flash-done">
          <p class="big-emoji">🎉</p>
          <h2>${fs.done ? `Session complete — ${fs.done} card${fs.done === 1 ? "" : "s"} reviewed` : "All caught up!"}</h2>
          <p class="muted">${next ? "Next review due " + next.toLocaleString() + "." : counts.freshTotal ? "" : "Answer quizzes to add missed questions as cards."}</p>
          <div class="btn-row" style="justify-content:center">
            <a class="btn" href="#/cert/${fs.certId}">Back to ${esc(cert.short)}</a>
          </div>
        </div>`;
      return;
    }

    const cardId = fs.queue[0];
    const card = cardById(cert, cardId);
    if (!card) { fs.queue.shift(); return renderFlashCard(); }
    const sec = sectionById(cert, card.section);
    const entry = state[fs.certId].srs[cardId];
    const preview = r => fmtIvl(srsRate(entry, r).ivl);

    app.innerHTML = `
      <div class="q-progress">
        <span>🃏 ${esc(cert.short)} · ${fs.queue.length} card${fs.queue.length === 1 ? "" : "s"} left</span>
        <span>${fs.done} reviewed</span>
      </div>
      <div class="card flash-card">
        <div class="q-section-tag">
          <span class="pill info">${esc(sec ? sec.title : card.section)}</span>
          ${card.auto ? '<span class="pill warn">from a missed question</span>' : ""}
          ${!entry ? '<span class="pill">new card</span>' : ""}
        </div>
        <div class="flash-face">${esc(card.front)}</div>
        ${fs.revealed ? `
          <hr class="flash-divider">
          <div class="flash-face flash-back">${esc(card.back)}</div>
          <div class="flash-ratings">
            <button class="btn rate-again" data-r="0">Again<br><small>${preview(0)}</small></button>
            <button class="btn rate-hard" data-r="1">Hard<br><small>${preview(1)}</small></button>
            <button class="btn rate-good" data-r="2">Good<br><small>${preview(2)}</small></button>
            <button class="btn rate-easy" data-r="3">Easy<br><small>${preview(3)}</small></button>
          </div>
          <p class="kbd-hint muted">Keys: 1 again · 2 hard · 3 good · 4 easy</p>` : `
          <div class="btn-row" style="justify-content:center">
            <button class="btn" id="flash-reveal">Show answer</button>
          </div>
          <p class="kbd-hint muted">Key: Space/Enter reveals</p>`}
      </div>
      <p class="muted" style="text-align:center"><a href="#/cert/${fs.certId}">End session</a></p>`;

    if (!fs.revealed) {
      document.getElementById("flash-reveal").onclick = () => { fs.revealed = true; renderFlashCard(); };
    } else {
      app.querySelectorAll(".flash-ratings .btn").forEach(btn => {
        btn.onclick = () => rateFlash(parseInt(btn.dataset.r, 10));
      });
    }
  }

  function rateFlash(rating) {
    const fs = flashSession;
    const cardId = fs.queue.shift();
    state[fs.certId].srs[cardId] = srsRate(state[fs.certId].srs[cardId], rating);
    if (rating === 0) fs.queue.push(cardId); // "Again" comes back this session
    else fs.done++;
    fs.revealed = false;
    save();
    renderFlashCard();
  }

  /* ---------------- Sync & backup ---------------- */
  function renderSync() {
    setNav(null);
    const connected = window.SYNC && SYNC.isConnected();
    app.innerHTML = `
      <p class="muted"><a href="#/">← Home</a></p>
      <h1>Sync &amp; backup</h1>
      <p class="subtitle">Keep your study progress in sync across devices using a private GitHub Gist.</p>
      <div class="card">
        <h2>GitHub sync ${connected ? '<span class="pill ok">connected</span>' : '<span class="pill">not connected</span>'}</h2>
        ${connected ? `
          <p class="muted">Progress is stored in a private Gist (<code>${esc(SYNC.gistId() || "")}</code>) and pushed automatically a few seconds after every change. Other devices merge it on load.</p>
          <div class="btn-row">
            <button class="btn" id="sync-now">Sync now</button>
            <button class="btn danger" id="sync-disconnect">Disconnect this device</button>
          </div>
          <p class="muted" id="sync-msg"></p>` : `
          <ol class="objectives">
            <li>Create a GitHub personal access token: <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">fine-grained token</a> with <strong>Account permissions → Gists → Read and write</strong> (nothing else). If Gists isn't available there, use a <a href="https://github.com/settings/tokens/new?scopes=gist&description=integration-study-sync" target="_blank" rel="noopener">classic token</a> with only the <strong>gist</strong> scope.</li>
            <li>Paste it below. The token is stored only in this browser and used only to read/write one private Gist.</li>
            <li>Repeat on each device — the same Gist is found automatically.</li>
          </ol>
          <div class="setup-field">
            <label for="sync-token">GitHub token</label>
            <input type="password" id="sync-token" placeholder="github_pat_… / ghp_…" autocomplete="off">
          </div>
          <div class="btn-row"><button class="btn" id="sync-connect">Connect</button></div>
          <p class="muted" id="sync-msg"></p>`}
      </div>
      <div class="card">
        <h2>Backup file</h2>
        <p class="muted">Export your progress as a JSON file, or import one — for example, from the old local copy of this app. Imports are <strong>merged</strong> into current progress, never overwritten.</p>
        <div class="btn-row">
          <button class="btn secondary" id="export-btn">⬇ Export progress</button>
          <button class="btn secondary" id="import-btn">⬆ Import progress</button>
          <input type="file" id="import-file" accept=".json,application/json" style="display:none">
        </div>
        <p class="muted" id="backup-msg"></p>
      </div>`;

    const msg = (id, text, isError) => {
      const el = document.getElementById(id);
      if (el) { el.textContent = text; el.style.color = isError ? "var(--bad, #c0392b)" : ""; }
    };

    if (connected) {
      document.getElementById("sync-now").onclick = async (ev) => {
        ev.target.disabled = true;
        msg("sync-msg", "Syncing…");
        try {
          await SYNC.syncNow();
          state = loadState();
          msg("sync-msg", "Synced ✓");
        } catch (e) {
          msg("sync-msg", String(e.message || e), true);
        }
        ev.target.disabled = false;
      };
      document.getElementById("sync-disconnect").onclick = () => {
        if (confirm("Disconnect sync on this device? Progress stays here and in the Gist.")) {
          SYNC.disconnect();
          renderSync();
        }
      };
    } else if (window.SYNC) {
      document.getElementById("sync-connect").onclick = async (ev) => {
        const tok = document.getElementById("sync-token").value.trim();
        if (!tok) return msg("sync-msg", "Paste a token first.", true);
        ev.target.disabled = true;
        msg("sync-msg", "Connecting…");
        try {
          await SYNC.connect(tok);
          state = loadState();
          renderSync();
        } catch (e) {
          msg("sync-msg", String(e.message || e), true);
          ev.target.disabled = false;
        }
      };
    }

    document.getElementById("export-btn").onclick = () => {
      const blob = new Blob([JSON.stringify(state, null, 1)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "integration-study-progress-" + new Date().toISOString().slice(0, 10) + ".json";
      a.click();
      URL.revokeObjectURL(a.href);
      msg("backup-msg", "Progress exported.");
    };
    document.getElementById("import-btn").onclick = () => document.getElementById("import-file").click();
    document.getElementById("import-file").onchange = async (ev) => {
      const file = ev.target.files[0];
      if (!file) return;
      try {
        const imported = JSON.parse(await file.text());
        if (typeof imported !== "object" || imported === null) throw new Error("not a progress file");
        state = window.SYNC ? SYNC.merge(state, imported) : Object.assign(state, imported);
        CERT_IDS.forEach(id => { if (!state[id]) state[id] = blankCertState(); });
        save();
        msg("backup-msg", "Imported and merged ✓");
      } catch (e) {
        msg("backup-msg", "Import failed: " + String(e.message || e), true);
      }
    };
  }

  /* ---------------- Theme ---------------- */
  const THEME_KEY = "mulesoft-study-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    // storage may be unavailable (private mode / policy); the theme still
    // applies to this page and a failed write must not kill the app at load
    try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* not persisted */ }
  }
  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* unavailable */ }
  applyTheme(savedTheme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  document.getElementById("theme-toggle").onclick = () => {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  };

  /* ---------------- Keyboard shortcuts ---------------- */
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape") { closeNavMenus(); return; }
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;

    // flashcard session keys
    if (flashSession && location.hash.startsWith("#/flash/") && flashSession.queue.length) {
      if (!flashSession.revealed && (e.key === " " || e.key === "Enter")) {
        flashSession.revealed = true;
        renderFlashCard();
        e.preventDefault();
        return;
      }
      if (flashSession.revealed && /^[1-4]$/.test(e.key)) {
        rateFlash(parseInt(e.key, 10) - 1);
        e.preventDefault();
        return;
      }
      return;
    }

    if (!session) return;

    // 1-9: click the option at that display position (works for quiz and exam)
    if (/^[1-9]$/.test(e.key)) {
      const opts = app.querySelectorAll(".options .option:not([disabled])");
      const btn = opts[parseInt(e.key, 10) - 1];
      if (btn) { btn.click(); e.preventDefault(); }
      return;
    }
    if (session.mode === "quiz" && e.key === "Enter") {
      const next = document.getElementById("q-next") || document.getElementById("q-check");
      if (next) { next.click(); e.preventDefault(); }
      return;
    }
    if (session.mode === "exam") {
      if (e.key === "ArrowLeft") {
        const b = document.getElementById("prev-btn");
        if (b && !b.disabled) { b.click(); e.preventDefault(); }
      } else if (e.key === "ArrowRight") {
        const b = document.getElementById("next-btn");
        if (b && !b.disabled) { b.click(); e.preventDefault(); }
      } else if (e.key === "f" || e.key === "F") {
        const b = document.getElementById("flag-btn");
        if (b) { b.click(); e.preventDefault(); }
      }
    }
  });

  /* ---------------- Boot ---------------- */
  async function boot() {
    try {
      const manifestRes = await fetch("data/certs.json");
      if (!manifestRes.ok) throw new Error("HTTP " + manifestRes.status + " loading data/certs.json");
      const manifest = await manifestRes.json();
      const entries = await Promise.all(manifest.certs.map(async id => {
        const res = await fetch("data/" + id + ".json");
        if (!res.ok) throw new Error("HTTP " + res.status + " loading data/" + id + ".json");
        return [id, await res.json()];
      }));
      CERTS = Object.fromEntries(entries);
      CERT_IDS = Object.keys(CERTS);
    } catch (e) {
      app.innerHTML = `
        <div class="card">
          <h2>⚠ Could not load the study data</h2>
          <p>${esc(String(e.message || e))}</p>
          <p class="muted">If you opened <code>index.html</code> directly from disk, the browser blocks
          <code>fetch()</code> of local files. Serve the folder over HTTP instead — run
          <code>python -m http.server</code> (or <code>npx serve</code>) in the project folder and open
          <code>http://localhost:8000</code> — or use the hosted site.</p>
        </div>`;
      return;
    }
    if (window.SYNC) {
      // background flushes now pull-merge before pushing; refresh in-memory
      // state whenever a merge rewrites localStorage
      SYNC.onMerged = () => { if (state) state = loadState(); };
      SYNC.initStatus();
      if (SYNC.isConnected()) {
        try { await SYNC.pullAndMerge(); } catch (e) { /* status shows the error; app still works locally */ }
      }
    }
    state = loadState();
    route();
  }
  boot();
})();
