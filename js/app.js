(function () {
  'use strict';
  const CASES = window.FD_CASES, SC = window.FD_SCORE, KEY = 'fd_state_v1';
  const app = document.getElementById('app');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const $ = (s, r) => (r || document).querySelector(s);

  /* ---------- state (localStorage with in-memory fallback) ---------- */
  let S, storageOK = true;
  try { S = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { storageOK = false; }
  if (!S || !S.cases) S = { cases: {} };
  const save = () => { if (!storageOK) return; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { storageOK = false; } };
  const cs = id => {
    const s = S.cases[id] || (S.cases[id] = {});
    s.a = s.a || {};
    s.sel = s.sel || {};
    s.cited = s.cited || [];
    s.notes = s.notes || {};
    if (s.revealed == null) s.revealed = false;
    if (s.score == null) s.score = null;
    return s;
  };
  const status = id => { const s = S.cases[id]; if (!s) return 'OPEN'; if (s.revealed) return 'SOLVED'; const any = Object.keys(s.a || {}).length || (s.cited || []).length || Object.values(s.notes || {}).some(Boolean); return any ? 'INVESTIGATING' : 'OPEN'; };
  const progress = id => { const s = S.cases[id]; if (!s) return 0; if (s.revealed) return 100; return Math.round(Object.keys(s.a || {}).length / 4 * 90); };
  const tagCls = st => st === 'SOLVED' ? 'solved' : st === 'OPEN' ? 'open' : 'inv';

  /* ---------- helpers ---------- */
  const isNum = v => /^[\u2212\-+(]?\$?[\d,.]+\)?%?(\s?pts\))?$/.test(String(v).trim()) || /^\(?[\d.]+ pts\)$/.test(String(v));
  function tableHTML(t) {
    const nums = t.cols.map((_, i) => t.rows.length && t.rows.every(r => r[i] === '' || isNum(r[i]) || r[i] === '\u2013'));
    return `<div class="tbl" tabindex="0" role="region" aria-label="Evidence table (scrolls horizontally)"><table><thead><tr>${t.cols.map((c, i) => `<th scope="col" class="${nums[i] ? 'num' : ''}">${esc(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r, ri) => `<tr class="${t.total === ri ? 'tot' : ''}">${r.map((v, i) => `<td class="${nums[i] ? 'num' : ''}">${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  const setNav = k => document.querySelectorAll('nav a[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === k));
  const go = (el) => { app.focus({ preventScroll: true }); window.scrollTo(0, el ? el.offsetTop - 70 : 0); };

  /* ---------- views ---------- */
  function home() {
    setNav('home'); document.title = 'The Finance Detective: Find the Leak | Friends of Finance';
    app.innerHTML = `
    <section class="hero"><div class="ghostdoc glass" aria-hidden="true"><i></i><i></i><i class="r"></i><i></i><i></i><i></i><i class="r"></i><i></i></div><div class="ghostdoc b glass" aria-hidden="true"><i></i><i></i><i></i><i class="r"></i><i></i><i></i></div>
      <div class="wrap"><p class="eyebrow">Friends of Finance &middot; Interactive investigation</p>
      <h1>THE NUMBERS<br>DON&rsquo;T ADD UP.</h1>
      <p class="lead">Every discrepancy leaves a clue. Can you find the leak?</p>
      <p class="sub">Investigate five fictional financial cases. Examine the evidence, challenge your assumptions, and uncover the root cause.</p>
      <div class="cta"><a class="btn" href="#cases" data-scroll="cases">Enter the case room</a><a class="btn ghost" href="guide/Finance_Detective_Quick-Start_Guide.pdf" target="_blank" rel="noopener noreferrer">View investigation guide</a></div></div></section>
    <section class="blk" id="how"><div class="wrap">${howHTML()}</div></section>
    <section class="blk" id="cases"><div class="wrap"><p class="eyebrow">Case room</p><h2>Five financial mysteries</h2><div class="grid">${CASES.map(cardHTML).join('')}</div></div></section>
    <section class="blk"><div class="wrap"><div class="glass panel"><h2>Take the field guide with you</h2><p class="muted">A 4-page Quick-Start Investigation Guide with the method, the scoring rubric and a reusable notes sheet.</p><div class="row-actions"><a class="btn" href="guide/Finance_Detective_Quick-Start_Guide.pdf" target="_blank" rel="noopener noreferrer">Download the Quick-Start Guide</a><a class="btn ghost" href="#/case/1">Investigate a case</a></div></div></div></section>`;
    const scBtn = app.querySelector('[data-scroll]');
    if (scBtn) scBtn.addEventListener('click', e => { e.preventDefault(); const cEl = $('#cases'); if (cEl) cEl.scrollIntoView({ behavior: 'smooth' }); });
  }
  function howHTML() {
    return `<p class="eyebrow">How it works</p><h2>Investigate like a finance detective</h2>
    <ol class="steps"><li class="glass"><b>Read the brief</b><br><span class="muted">Understand the business and the anomaly.</span></li><li class="glass"><b>Inspect the evidence</b><br><span class="muted">Open tables, notes and timelines. Cite what matters.</span></li><li class="glass"><b>Form a hypothesis</b><br><span class="muted">Record cause, support, alternatives and confidence.</span></li><li class="glass"><b>Make decisions</b><br><span class="muted">Test alternatives and choose your diagnosis and action.</span></li><li class="glass"><b>Reveal and compare</b><br><span class="muted">See the root cause, the calculation and your score.</span></li></ol>
    <p class="muted">Scoring is a transparent 100-point rubric per case: evidence selection 25, testing alternatives 25, evidence-backed diagnosis 30, practical corrective action 20. Your written hypothesis is checked against predefined keyword groups only. It is not AI evaluation.</p>`;
  }
  function cardHTML(c) {
    const st = status(c.id), p = progress(c.id);
    return `<article class="card glass"><div class="row"><span class="tag mono">${c.ref}</span><span class="tag ${tagCls(st)}">${st}</span></div>
    <h3>${esc(c.title)}</h3><div class="meta"><span>${esc(c.cat)}</span><span>${esc(c.diff)}</span><span>~${c.mins} min</span></div>
    <p style="margin:0">${esc(c.summary)}</p>
    <div class="bar ${p === 100 ? 'sage' : ''}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Investigation progress"><i style="width:${p}%"></i></div>
    <a class="btn ${st === 'SOLVED' ? 'ghost' : ''}" href="#/case/${c.id}">${st === 'OPEN' ? 'Investigate case' : st === 'SOLVED' ? 'Review case' : 'Continue case'}</a></article>`;
  }
  function how() { setNav('how'); app.innerHTML = `<section class="blk"><div class="wrap">${howHTML()}<div class="cta"><a class="btn" href="#/">Enter the case room</a></div></div></section>`; window.scrollTo(0, 0); }

  /* ---------- case view ---------- */
  function caseView(id) {
    const c = CASES.find(x => x.id === id); if (!c) return home();
    setNav('home'); document.title = `${c.ref}: ${c.title} | Finance Detective`;
    const s = cs(id);
    app.innerHTML = `<div class="wrap">
    <p class="crumb"><a href="#/">&larr; All cases</a></p>
    <header class="case-head"><div id="hd"></div><h1 style="font-size:clamp(2rem,4.5vw,3rem)">${esc(c.title)}</h1><p class="muted">${esc(c.company)}</p><p style="max-width:760px">${esc(c.brief)}</p>
    <div class="kpis">${c.kpis.map(k => `<div class="kpi glass"><small>${esc(k[0])}</small><b>${esc(k[1])}</b></div>`).join('')}</div></header>
    <div class="layout"><div>
      <section class="panel glass"><h2>Event timeline</h2><ul class="tl">${c.timeline.map(t => `<li><b>${esc(t[0])}</b>${esc(t[1])}</li>`).join('')}</ul></section>
      <section class="panel glass" id="evroom"><p class="eyebrow">Step 1 &middot; Evidence room</p><h2>Evidence index</h2><p class="hint">Open each item. Tick &ldquo;Cite&rdquo; on items that support your reasoning. Citing irrelevant items costs points.</p>
      ${c.evidence.map(e => `<div class="ev"><details><summary><span class="id">${e.id}</span><strong>${esc(e.title)}</strong><span class="ty">${esc(e.type)}</span></summary><div class="body">${tableHTML(e.t)}${e.note ? `<p class="hint" style="margin-bottom:0">${esc(e.note)}</p>` : ''}</div></details><div class="body" style="padding:0 14px 12px"><label class="cite"><input type="checkbox" data-cite="${e.id}" ${s.cited.includes(e.id) ? 'checked' : ''}> Cite ${e.id} in my hypothesis</label></div></div>`).join('')}</section>
      <section id="inv"></section>
      <section id="reveal"></section>
    </div>
    <aside class="side glass" aria-label="Notes and hypothesis"><h3>Notes &amp; hypothesis</h3>
      <label for="n-cause">Suspected cause</label><textarea id="n-cause" data-note="cause" placeholder="What do you think is happening?"></textarea>
      <label>Supporting evidence</label><div id="n-cited" class="hint">None cited yet. Tick items in the Evidence index.</div>
      <label for="n-alt">Alternative explanation</label><textarea id="n-alt" data-note="alt" placeholder="What else could explain it?"></textarea>
      <label for="n-conf">Confidence</label><select id="n-conf" data-note="conf"><option value="">Select</option><option>Low</option><option>Medium</option><option>High</option></select>
      <label for="n-next">Next action</label><textarea id="n-next" data-note="next" placeholder="What would you do or verify next?"></textarea>
      <p class="hint">Saved in this browser as you type.</p></aside></div></div>`;
    ['cause', 'alt', 'conf', 'next'].forEach(k => { const el = $(`[data-note=${k}]`); el.value = s.notes[k] || ''; });
    app.querySelectorAll('[data-note]').forEach(el => el.addEventListener('input', () => { if (s.revealed) return; s.notes[el.dataset.note] = el.value; save(); header(c); $('#cause-err') && ($('#cause-err').textContent = ''); }));
    app.querySelectorAll('[data-note]').forEach(el => { if (s.revealed) el.disabled = true; });
    app.querySelectorAll('[data-cite]').forEach(el => { if (s.revealed) el.disabled = true; el.addEventListener('change', () => { s.cited = [...app.querySelectorAll('[data-cite]')].filter(x => x.checked).map(x => x.dataset.cite); save(); citedList(c); header(c); }); });
    header(c); citedList(c); invest(c); if (s.revealed) revealPanel(c);
    window.scrollTo(0, 0);
  }
  function header(c) { const st = status(c.id); $('#hd').innerHTML = `<span class="tag mono">${c.ref}</span> <span class="tag ${tagCls(st)}">${st}</span> <span class="tag">${esc(c.cat)}</span> <span class="tag">${esc(c.diff)}</span> <span class="tag">~${c.mins} min</span>`; }
  function citedList(c) { const s = cs(c.id); $('#n-cited').innerHTML = s.cited.length ? s.cited.map(i => `<span class="tag mono">${i}</span>`).join(' ') : 'None cited yet. Tick items in the Evidence index.'; }

  const STEPS = [['d1', 'Step 2 \u00b7 Which evidence first?'], ['d2', 'Step 3 \u00b7 Test alternatives'], ['dx', 'Step 4 \u00b7 Final diagnosis'], ['d3', 'Step 5 \u00b7 Corrective action']];
  function invest(c) {
    const s = cs(c.id), box = $('#inv');
    let html = '';
    STEPS.forEach(([k, label], idx) => {
      const q = c[k], done = s.a[k] != null, prev = idx === 0 || s.a[STEPS[idx - 1][0]] != null, sel = s.sel[k];
      html += `<div class="q glass ${!prev ? 'locked' : ''}"><p class="eyebrow">${label}</p><h3>${esc(q.q)}</h3>${q.ctx ? `<p class="hint">${esc(q.ctx)}</p>` : ''}${q.refs ? `<p class="hint mono">Evidence: ${esc(q.refs)}</p>` : ''}
      <fieldset style="border:0;padding:0;margin:0" ${(!prev || done || s.revealed) ? 'disabled' : ''}><legend class="hint">${prev ? (done ? 'Answer locked in' : 'Choose one') : 'Complete the previous step to unlock'}</legend>
      ${q.opts.map((o, i) => `<label class="opt"><input type="radio" name="${k}" value="${i}" ${(done ? s.a[k] === i : sel === i) ? 'checked' : ''}><span>${esc(o[0])}</span></label>`).join('')}</fieldset>
      ${(prev && !done && !s.revealed) ? `<button class="btn sm" data-lock="${k}">Lock in answer</button>` : ''}
      ${done && k !== 'dx' ? fbHTML(q.opts[s.a[k]]) : ''}${done && k === 'dx' ? '<div class="fb"><b>Diagnosis recorded.</b> The solution stays hidden until you reveal it.</div>' : ''}</div>`;
    });
    const ready = ['d1', 'd2', 'dx', 'd3'].every(k => s.a[k] != null);
    html += s.revealed ? '' : `<div class="panel glass"><p class="eyebrow">Step 6 &middot; Solution reveal</p><h3>Ready to reveal?</h3><p class="hint">Requires all four decisions locked in and a suspected cause (at least 10 characters) in the notes panel. You cannot change answers after revealing.</p><button class="btn" id="rv" ${ready ? '' : 'disabled'}>Reveal the root cause</button><div class="err" id="cause-err" role="alert"></div></div>`;
    box.innerHTML = html;
    box.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', () => {
      s.sel[r.name] = +r.value;
      save();
      const err = r.closest('.q') ? r.closest('.q').querySelector('.lock-err') : null;
      if (err) err.remove();
    }));
    box.querySelectorAll('[data-lock]').forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.lock;
      const parent = b.parentElement;
      const existingErr = parent ? parent.querySelector('.lock-err') : null;
      if (s.sel[k] == null) {
        if (!existingErr) b.insertAdjacentHTML('afterend', '<div class="err lock-err" role="alert">Select an option first.</div>');
        return;
      }
      if (existingErr) existingErr.remove();
      s.a[k] = s.sel[k];
      save();
      header(c);
      invest(c);
    }));
    const rv = $('#rv'); rv && rv.addEventListener('click', () => {
      if ((s.notes.cause || '').trim().length < 10) { $('#cause-err').textContent = 'Write your suspected cause (at least 10 characters) in the Notes & hypothesis panel first.'; $('#n-cause').focus(); return; }
      const text = [s.notes.cause, s.notes.alt, s.notes.next].join(' ');
      s.score = SC.scoreCase(c, s.a, s.cited, text); s.revealed = true; save(); header(c); invest(c); revealPanel(c);
      app.querySelectorAll('[data-note],[data-cite]').forEach(el => el.disabled = true);
      $('#reveal').scrollIntoView({ behavior: 'smooth' });
    });
  }
  function fbHTML(o) { const cls = o[1] >= 1 ? 'strong' : o[1] <= .2 ? 'risk' : ''; const lab = o[1] >= 1 ? 'Strong' : o[1] <= .2 ? 'Risky' : 'Incomplete'; return `<div class="fb ${cls}"><b>${lab} approach.</b> ${esc(o[2])} <span class="mono hint">(${Math.round(o[1] * 100)}% credit)</span></div>`; }

  function revealPanel(c) {
    const s = cs(c.id), r = c.reveal, sc = s.score, dxo = c.dx.opts[s.a.dx];
    const pts = [['Evidence selection and relevance', sc.parts.evidence, 25], ['Testing alternative explanations', sc.parts.alternatives, 25], ['Evidence-backed diagnosis', sc.parts.diagnosis, 30], ['Practical corrective action', sc.parts.action, 20]];
    const strengths = pts.filter(p => p[1] / p[2] >= .8).map(p => p[0]);
    $('#reveal').innerHTML = `<div class="panel glass reveal"><span class="stamp">SOLVED</span><p class="eyebrow" style="margin-top:14px">Root cause identified</p><h2>${esc(r.cause)}</h2>
    ${dxo[2] ? `<div class="fb"><b>Your diagnosis:</b> ${esc(dxo[2])}</div>` : (dxo[1] >= 1 ? '<div class="fb strong"><b>Your diagnosis matched the evidence.</b></div>' : '')}
    <h3>Evidence that establishes it</h3><ul class="clean">${r.support.map(x => `<li class="verified">${esc(x)}</li>`).join('')}</ul>
    <h3>Calculation / reconciliation</h3><div class="tbl"><table><tbody>${r.calc.map(x => `<tr><td>${esc(x[0])}</td><td class="num"><b>${esc(x[1])}</b></td></tr>`).join('')}</tbody></table></div>
    <h3 style="margin-top:20px">Why alternatives do not fit</h3><div class="tbl"><table><tbody>${r.alts.map(x => `<tr><td><b>${esc(x[0])}</b></td><td>${esc(x[1])}</td></tr>`).join('')}</tbody></table></div>
    <div class="two"><div><h3 style="margin-top:20px">Immediate corrective action</h3><p>${esc(r.action)}</p><h3>KPIs to monitor</h3><ul class="clean">${r.kpis.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><h3 style="margin-top:20px">Preventive controls</h3><ul class="clean">${r.controls.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div>
    <h3>Executive summary</h3><p>${esc(r.exec)}</p></div>
    <div class="panel glass"><p class="eyebrow">Investigation score</p><div class="score-big">${sc.total}<span class="muted" style="font-size:1.2rem"> / 100</span></div>
    <div class="bars">${pts.map(p => `<div><div class="lab"><span>${p[0]}</span><span class="mono">${p[1]} / ${p[2]}</span></div><div class="bar"><i style="width:${p[1] / p[2] * 100}%"></i></div></div>`).join('')}</div>
    <h3 style="margin-top:18px">Strengths</h3><p>${strengths.length ? esc(strengths.join(', ')) : 'No category reached 80% yet. Compare your reasoning with the solution above.'}</p>
    <h3>Missed clues</h3><p>${sc.missed.length ? sc.missed.map(i => `<span class="tag mono">${i}</span>`).join(' ') + ' <span class="hint">relevant items you did not cite</span>' : 'You cited every relevant evidence item.'}</p>
    <h3>Hypothesis keyword check</h3><p class="hint">Deterministic keyword groups only; this is not AI evaluation.</p><ul class="clean">${sc.hits.map(h => `<li>${h.hit ? '\u2713' : '\u2013'} ${esc(h.label)}</li>`).join('')}</ul>
    <h3>One practical lesson</h3><p>${esc(r.controls[0])}</p>
    <div class="row-actions"><a class="btn" href="#evroom" id="rev-ev">Revisit the evidence</a><button class="btn ghost" id="pr">Print case summary</button><button class="btn ghost" id="dl">Download summary (.txt)</button>${nextLink(c)}<button class="btn ghost" id="rs">Reset this case</button></div></div>`;
    $('#rev-ev').addEventListener('click', e => { e.preventDefault(); $('#evroom').scrollIntoView(); });
    $('#pr').addEventListener('click', () => window.print());
    $('#dl').addEventListener('click', () => download(`${c.ref}-summary.txt`, summaryText([c])));
    $('#rs').addEventListener('click', () => { if (confirm('Reset this case and clear your answers?')) { delete S.cases[c.id]; save(); caseView(c.id); } });
  }
  function nextLink(c) { const n = CASES.find(x => x.id === c.id + 1); return n ? `<a class="btn" href="#/case/${n.id}">Next case</a>` : '<a class="btn" href="#/score">View scorecard</a>'; }

  /* ---------- scorecard ---------- */
  function scoreView() {
    setNav('score'); document.title = 'Detective Scorecard | Finance Detective';
    const done = CASES.filter(c => S.cases[c.id] && S.cases[c.id].revealed && S.cases[c.id].score && S.cases[c.id].score.parts);
    const tot = done.reduce((a, c) => a + S.cases[c.id].score.total, 0), avg = done.length ? tot / done.length : 0;
    const dims = [['Evidence quality', 'evidence', 25], ['Hypothesis accuracy', 'diagnosis', 30], ['Decision quality', null, 45]];
    const pct = (key, max) => { if (!done.length) return 0; if (key) return done.reduce((a, c) => a + S.cases[c.id].score.parts[key], 0) / (done.length * max) * 100; return done.reduce((a, c) => a + S.cases[c.id].score.parts.alternatives + S.cases[c.id].score.parts.action, 0) / (done.length * 45) * 100; };
    const vals = dims.map(d => pct(d[1], d[2]));
    const allD = [['Evidence selection', 'evidence', 25], ['Testing alternatives', 'alternatives', 25], ['Evidence-backed diagnosis', 'diagnosis', 30], ['Corrective action', 'action', 20]].map(d => [d[0], done.length ? done.reduce((a, c) => a + S.cases[c.id].score.parts[d[1]], 0) / (done.length * d[2]) * 100 : 0]);
    const weakest = done.length ? allD.slice().sort((a, b) => a[1] - b[1])[0] : null;
    const missed = done.flatMap(c => (S.cases[c.id].score.missed || []).map(m => `${c.ref} ${m}`));
    app.innerHTML = `<div class="wrap"><section class="blk"><p class="eyebrow">Detective scorecard</p><h1 style="font-size:clamp(2rem,4.5vw,3rem)">Your investigation record</h1>
    ${!done.length ? '<div class="panel glass"><h3>No cases solved yet</h3><p class="muted">Reveal a case solution to build your scorecard. Scores come only from your recorded decisions.</p><a class="btn" href="#/">Enter the case room</a></div>' : `
    <div class="kpis"><div class="kpi glass"><small>Cases completed</small><b>${done.length} / 5</b></div><div class="kpi glass"><small>Total points</small><b>${Math.round(tot * 10) / 10} / ${done.length * 100}</b></div><div class="kpi glass"><small>Average per case</small><b>${Math.round(avg * 10) / 10}</b></div><div class="kpi glass"><small>Learning label</small><b style="font-size:1.1rem">${SC.profile(avg)}</b></div></div>
    <div class="panel glass bars"><h3>Dimensions</h3>${dims.map((d, i) => `<div><div class="lab"><span>${d[0]}</span><span class="mono">${Math.round(vals[i])}%</span></div><div class="bar"><i style="width:${vals[i]}%"></i></div></div>`).join('')}
      <p class="hint">Evidence quality = evidence selection points. Hypothesis accuracy = diagnosis points. Decision quality = alternatives tested plus corrective action.</p></div>
    <div class="two"><div class="panel glass"><h3>Areas to improve</h3><p>${weakest && weakest[1] < 80 ? `Lowest area: <b>${weakest[0]}</b> (${Math.round(weakest[1])}% of available points).` : 'All areas at 80% or above.'}</p><h3>Missed clues</h3><p>${missed.length ? missed.map(m => `<span class="tag mono">${esc(m)}</span>`).join(' ') : 'None.'}</p></div>
    <div class="panel glass"><h3>Lessons learned</h3><ul class="clean">${done.map(c => `<li><b>${c.ref}:</b> ${esc(c.reveal.controls[0])}</li>`).join('')}</ul></div></div>
    <div class="panel glass"><h3>Cases</h3><div class="tbl"><table><thead><tr><th>Case</th><th class="num">Evidence /25</th><th class="num">Alternatives /25</th><th class="num">Diagnosis /30</th><th class="num">Action /20</th><th class="num">Total</th></tr></thead><tbody>${CASES.map(c => { const s = S.cases[c.id]; return s && s.revealed && s.score && s.score.parts ? `<tr><td>${c.ref} ${esc(c.title)}</td><td class="num">${s.score.parts.evidence}</td><td class="num">${s.score.parts.alternatives}</td><td class="num">${s.score.parts.diagnosis}</td><td class="num">${s.score.parts.action}</td><td class="num"><b>${s.score.total}</b></td></tr>` : `<tr><td>${c.ref} ${esc(c.title)}</td><td colspan="5"><a href="#/case/${c.id}">${status(c.id) === 'OPEN' ? 'Not started' : 'In progress'}</a></td></tr>`; }).join('')}</tbody></table></div>
    <div class="row-actions"><button class="btn" id="pr">Print scorecard</button><button class="btn ghost" id="dl">Download summary (.txt)</button><button class="btn ghost" id="rs">Reset all progress</button></div></div>`}
    <div class="panel glass"><h3>Scoring rubric (100 points per case)</h3><ul class="clean"><li>Evidence selection and relevance: 25 (60% your first-step choice, 40% citation of relevant evidence; wrong citations subtract half credit)</li><li>Testing alternative explanations: 25</li><li>Evidence-backed diagnosis: 30 (24 for diagnosis choice, 6 for a keyword check of your written hypothesis)</li><li>Practical corrective action: 20</li></ul><p class="hint">Labels (Pattern Spotter under 40, Evidence Analyst 40&ndash;64, Root-Cause Investigator 65&ndash;84, Finance Strategist 85+) are playful learning labels, not a professional assessment or certification.</p></div></section></div>`;
    const pr = $('#pr'), dl = $('#dl'), rs = $('#rs');
    pr && pr.addEventListener('click', () => window.print());
    dl && dl.addEventListener('click', () => download('finance-detective-summary.txt', summaryText(done)));
    rs && rs.addEventListener('click', () => { if (confirm('Clear all saved progress in this browser?')) { S = { cases: {} }; save(); scoreView(); } });
    window.scrollTo(0, 0);
  }

  function summaryText(list) {
    const out = ['THE FINANCE DETECTIVE: investigation summary', 'Friends of Finance. Fictional learning scenarios; scores are not a certification.', ''];
    list.forEach(c => { const s = S.cases[c.id]; if (!s || !s.revealed) return; const r = c.reveal;
      out.push(`${c.ref} ${c.title}`, `Score: ${s.score.total}/100 (evidence ${s.score.parts.evidence}/25, alternatives ${s.score.parts.alternatives}/25, diagnosis ${s.score.parts.diagnosis}/30, action ${s.score.parts.action}/20)`,
        `Your suspected cause: ${s.notes.cause || ''}`, `Evidence cited: ${s.cited.join(', ') || 'none'}`, `Alternative considered: ${s.notes.alt || ''}`, `Confidence: ${s.notes.conf || ''}`, `Next action: ${s.notes.next || ''}`,
        `Root cause: ${r.cause}`, `Corrective action: ${r.action}`, `Preventive controls: ${r.controls.join('; ')}`, `KPIs: ${r.kpis.join('; ')}`, `Missed clues: ${s.score.missed.join(', ') || 'none'}`, '');
    });
    if (out.length < 5) out.push('No solved cases yet.');
    return out.join('\n');
  }
  function download(name, text) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

  /* ---------- router ---------- */
  function route() {
    const h = location.hash || '#/'; let m;
    if ((m = h.match(/^#\/case\/(\d+)/))) return caseView(+m[1]);
    if (h.startsWith('#/score')) return scoreView();
    if (h.startsWith('#/how') || h === '#how') return how();
    if (h === '#cases') {
      if (!$('#cases')) home();
      const el = $('#cases');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    home(); window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route); route();
})();
