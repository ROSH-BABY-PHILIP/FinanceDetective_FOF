/* Deterministic scoring. 100 points per case:
   Evidence selection 25 | Alternatives tested 25 | Evidence-backed diagnosis 30 | Corrective action 20
   Free text is checked ONLY by keyword groups defined in cases.js. It is not AI evaluation. */
(function (root) {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function keywordHits(c, text) {
    const t = (text || '').toLowerCase();
    return c.rubric.map(([label, kws]) => ({ label, hit: kws.some(k => t.includes(k)) }));
  }

  function citationFraction(c, cited) {
    const rel = new Set(c.relevant);
    const right = cited.filter(id => rel.has(id)).length;
    const wrong = cited.length - right;
    return clamp((right - 0.5 * wrong) / rel.size, 0, 1);
  }

  // a = {d1, d2, dx, d3} option indices; cited = evidence ids; text = cause + recommendation text
  function scoreCase(c, a, cited, text) {
    const cr = (q, i) => (i != null && q && q.opts && q.opts[i] ? q.opts[i][1] : 0);
    const hits = keywordHits(c, text);
    const kw = hits.filter(h => h.hit).length / hits.length;
    const cit = citationFraction(c, cited || []);
    const parts = {
      evidence: round1(25 * (0.6 * cr(c.d1, a.d1) + 0.4 * cit)),
      alternatives: round1(25 * cr(c.d2, a.d2)),
      diagnosis: round1(24 * cr(c.dx, a.dx) + 6 * kw),
      action: round1(20 * cr(c.d3, a.d3))
    };
    const total = round1(parts.evidence + parts.alternatives + parts.diagnosis + parts.action);
    const missed = c.relevant.filter(id => !(cited || []).includes(id));
    return { parts, total, missed, hits, cit };
  }
  const round1 = x => Math.round(x * 10) / 10;

  function profile(avg) {
    if (avg >= 85) return 'Finance Strategist';
    if (avg >= 65) return 'Root-Cause Investigator';
    if (avg >= 40) return 'Evidence Analyst';
    return 'Pattern Spotter';
  }

  const API = { scoreCase, profile, keywordHits, citationFraction, MAX: { evidence: 25, alternatives: 25, diagnosis: 30, action: 20 } };
  root.FD_SCORE = API;
  if (typeof module !== 'undefined') module.exports = API;
})(typeof window !== 'undefined' ? window : globalThis);
