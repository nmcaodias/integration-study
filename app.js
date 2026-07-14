/* MuleSoft Certification Study App — SPA logic */
(function () {
  "use strict";

  const CERTS = window.CERT_DATA;
  const CERT_IDS = Object.keys(CERTS);
  const STORE_KEY = "mulesoft-study-v1";
  const app = document.getElementById("app");
  const topnav = document.getElementById("topnav");

  /* ---------------- State & persistence ---------------- */
  function blankCertState() {
    return { read: {}, qstats: {}, exams: [] };
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const s = raw ? JSON.parse(raw) : {};
      CERT_IDS.forEach(id => { if (!s[id]) s[id] = blankCertState(); });
      return s;
    } catch (e) {
      const s = {};
      CERT_IDS.forEach(id => { s[id] = blankCertState(); });
      return s;
    }
  }
  const state = loadState();
  function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

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

  function bar(pct, cls) {
    return `<div class="bar"><div class="${cls || ""}" style="width:${Math.max(0, Math.min(100, pct))}%"></div></div>`;
  }

  /* ---------------- Router ---------------- */
  function route() {
    // leaving an unfinished exam? keep session only for its own route
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\//, "").split("/").filter(Boolean);
    stopTimer();
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

  function setNav(certId) {
    let html = "";
    CERT_IDS.forEach(id => {
      html += `<a href="#/cert/${id}" class="${certId === id ? "active" : ""}">${esc(CERTS[id].short)}</a>`;
    });
    topnav.innerHTML = html;
  }

  /* ---------------- Views ---------------- */
  function renderHome() {
    setNav(null);
    let cards = "";
    CERT_IDS.forEach(id => {
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
    app.innerHTML = `
      <h1>Integration Study</h1>
      <p class="subtitle">Pick a certification to study its topics, take practice quizzes, or run a full timed exam simulation.</p>
      <div class="grid-2">${cards}</div>`;
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
        </div>
      </div>`;
    });

    const lastExams = cs.exams.slice(-3).reverse().map(e =>
      `<span class="pill ${e.pass ? "ok" : "bad"}">${e.pct}%</span>`).join(" ");

    app.innerHTML = `
      <h1>${esc(cert.name)}</h1>
      <p class="subtitle">Real exam: ${cert.exam.questions} questions · ${cert.exam.minutes} minutes · ${cert.exam.passPct}% to pass</p>
      <div class="btn-row" style="margin-bottom:1.2rem">
        <a class="btn" href="#/quiz/${certId}">📝 Practice quiz</a>
        <a class="btn" href="#/exam/${certId}">⏱️ Exam simulation</a>
        <a class="btn secondary" href="#/history/${certId}">📈 Exam history ${lastExams ? "· " + lastExams : ""}</a>
      </div>
      <div class="card">
        <h2>Topics</h2>
        ${rows}
      </div>`;
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
      <p class="subtitle">${sec.weight ? sec.weight + "% of the exam · " : ""}Section ${idx + 1} of ${cert.sections.length} · <span class="muted">📖 next to a topic links to its official MuleSoft docs</span></p>
      <div class="card">
        <h3>🎯 Exam objectives</h3>
        <ul class="objectives">${sec.objectives.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
        <div class="notes-body">${sec.notes}</div>
        <div class="btn-row">
          <button class="btn ${isRead ? "secondary" : ""}" id="mark-read">${isRead ? "✅ Marked as read (click to unmark)" : "Mark as read"}</button>
          <button class="btn secondary" id="quiz-section">Quiz me on this topic (${qCount} questions)</button>
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
      if (state[certId].read[sid]) delete state[certId].read[sid];
      else state[certId].read[sid] = true;
      save();
      renderNotes(certId, sid);
    };
    document.getElementById("quiz-section").onclick = () => startQuiz(certId, sid, 0);
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
      <p class="subtitle">Instant feedback with explanations after every question. Results feed your per-topic stats.</p>
      <div class="card">
        <div class="setup-field">
          <label for="quiz-topic">Topic</label>
          <select id="quiz-topic">
            <option value="all">All topics (${cert.questions.length} questions)</option>
            ${opts}
          </select>
        </div>
        <div class="setup-field">
          <label for="quiz-count">Number of questions (0 = all available)</label>
          <input type="number" id="quiz-count" min="0" max="${cert.questions.length}" value="10">
        </div>
        <button class="btn" id="quiz-start">Start quiz</button>
      </div>`;

    document.getElementById("quiz-start").onclick = () => {
      const topic = document.getElementById("quiz-topic").value;
      const count = parseInt(document.getElementById("quiz-count").value, 10) || 0;
      startQuiz(certId, topic === "all" ? null : topic, count);
    };
  }

  function startQuiz(certId, sectionId, count) {
    const cert = CERTS[certId];
    let pool = sectionId ? cert.questions.filter(q => q.section === sectionId) : cert.questions.slice();
    pool = shuffle(pool);
    if (count > 0) pool = pool.slice(0, count);
    session = {
      mode: "quiz", certId, questions: pool, idx: 0,
      answers: new Array(pool.length).fill(null), // chosen option index
      revealed: false, correctCount: 0
    };
    go("#/quizrun");
    // if hash unchanged (already on quizrun), force render
    if (location.hash === "#/quizrun") renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const s = session;
    const cert = CERTS[s.certId];
    if (s.idx >= s.questions.length) return renderQuizSummary();
    const q = s.questions[s.idx];
    const sec = sectionById(cert, q.section);
    const chosen = s.answers[s.idx];

    const optionsHtml = q.options.map((opt, i) => {
      let cls = "option";
      let dis = "";
      if (s.revealed) {
        dis = "disabled";
        if (i === q.answer) cls += " correct";
        else if (i === chosen) cls += " wrong";
      }
      return `<button class="${cls}" data-i="${i}" ${dis}><span class="letter">${letters[i]}.</span><span>${esc(opt)}</span></button>`;
    }).join("");

    app.innerHTML = `
      <div class="q-progress">
        <span>Question ${s.idx + 1} of ${s.questions.length} · ${esc(cert.short)}</span>
        <span>Score: ${s.correctCount}/${s.idx + (s.revealed ? 1 : 0)}</span>
      </div>
      <div class="card">
        <div class="q-section-tag"><span class="pill info">${esc(sec.title)}</span></div>
        <div class="q-text">${esc(q.q)}</div>
        <div class="options">${optionsHtml}</div>
        ${s.revealed ? `
          <div class="explanation">
            <strong>${chosen === q.answer ? "✅ Correct!" : "❌ Incorrect — the answer is " + letters[q.answer] + "."}</strong>
            ${esc(q.explanation)}
          </div>
          <div class="btn-row">
            <button class="btn" id="q-next">${s.idx + 1 < s.questions.length ? "Next question →" : "Finish quiz"}</button>
            <button class="btn secondary" id="q-quit">End quiz</button>
          </div>` : `
          <div class="btn-row">
            <button class="btn secondary" id="q-quit">End quiz</button>
          </div>`}
      </div>`;

    if (!s.revealed) {
      app.querySelectorAll(".option").forEach(btn => {
        btn.onclick = () => {
          const i = parseInt(btn.dataset.i, 10);
          s.answers[s.idx] = i;
          s.revealed = true;
          const correct = i === q.answer;
          if (correct) s.correctCount++;
          // persist per-question stats
          const qs = state[s.certId].qstats;
          if (!qs[q.id]) qs[q.id] = { a: 0, c: 0 };
          qs[q.id].a++;
          if (correct) qs[q.id].c++;
          save();
          renderQuizQuestion();
        };
      });
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
          <div class="big ${pct >= cert.exam.passPct ? "pass" : "fail"}">${pct}%</div>
          <p class="muted">${s.correctCount} of ${answered} answered correctly</p>
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
    session = {
      mode: "exam", certId,
      questions: drawExamQuestions(cert),
      idx: 0,
      answers: {}, flags: {},
      secondsLeft: cert.exam.minutes * 60,
      startedAt: Date.now()
    };
    go("#/examrun");
    if (location.hash === "#/examrun") renderExamQuestion();
  }

  function renderExamQuestion() {
    const s = session;
    const cert = CERTS[s.certId];
    const q = s.questions[s.idx];
    const chosen = s.answers[s.idx];

    const optionsHtml = q.options.map((opt, i) =>
      `<button class="option ${chosen === i ? "selected" : ""}" data-i="${i}">
         <span class="letter">${letters[i]}.</span><span>${esc(opt)}</span>
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
        <span class="timer" id="timer">${fmtTime(s.secondsLeft)}</span>
      </div>
      <div class="card">
        <div class="q-progress"><span>Question ${s.idx + 1} of ${s.questions.length}</span>
          <button class="btn secondary" id="flag-btn" style="padding:.25rem .7rem">${s.flags[s.idx] ? "🚩 Unflag" : "🏳️ Flag for review"}</button>
        </div>
        <div class="q-text">${esc(q.q)}</div>
        <div class="options">${optionsHtml}</div>
        <div class="btn-row">
          <button class="btn secondary" id="prev-btn" ${s.idx === 0 ? "disabled" : ""}>← Previous</button>
          <button class="btn secondary" id="next-btn" ${s.idx === s.questions.length - 1 ? "disabled" : ""}>Next →</button>
          <button class="btn danger" id="submit-btn">Submit exam</button>
        </div>
      </div>
      <div class="card">
        <p class="muted">Navigator — blue = answered, yellow = flagged</p>
        <div class="nav-grid">${grid}</div>
      </div>`;

    app.querySelectorAll(".option").forEach(btn => {
      btn.onclick = () => {
        s.answers[s.idx] = parseInt(btn.dataset.i, 10);
        // auto-advance except on the last question
        if (s.idx < s.questions.length - 1) s.idx++;
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
      s.secondsLeft--;
      const el = document.getElementById("timer");
      if (el) {
        el.textContent = fmtTime(s.secondsLeft);
        if (s.secondsLeft <= 300) el.classList.add("low");
      }
      if (s.secondsLeft <= 0) {
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
      const ok = chosen === q.answer;
      perSection[q.section].t++;
      if (ok) { correct++; perSection[q.section].c++; }
      else review.push({ q, chosen: chosen === undefined ? null : chosen });
      // exam answers also feed question stats
      const qs = state[s.certId].qstats;
      if (!qs[q.id]) qs[q.id] = { a: 0, c: 0 };
      qs[q.id].a++;
      if (ok) qs[q.id].c++;
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

    const reviewHtml = review.length ? review.map(r => `
      <div class="review-item">
        <div class="q-text" style="font-size:.98rem">${esc(r.q.q)}</div>
        <p>${r.chosen === null
          ? '<span class="pill warn">Not answered</span>'
          : `<span class="pill bad">Your answer: ${letters[r.chosen]}. ${esc(r.q.options[r.chosen])}</span>`}</p>
        <p><span class="pill ok">Correct: ${letters[r.q.answer]}. ${esc(r.q.options[r.q.answer])}</span></p>
        <div class="explanation">${esc(r.q.explanation)}</div>
      </div>`).join("") : "<p class='muted'>Perfect — nothing to review! 🎉</p>";

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
        state[certId].exams = [];
        save();
        renderHistory(certId);
      }
    };
  }

  /* ---------------- Theme ---------------- */
  const THEME_KEY = "mulesoft-study-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem(THEME_KEY, t);
  }
  const savedTheme = localStorage.getItem(THEME_KEY) ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);
  document.getElementById("theme-toggle").onclick = () => {
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  };

  /* ---------------- Boot ---------------- */
  route();
})();
