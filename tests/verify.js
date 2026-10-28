// Run: node tests/verify.js  — independent recalculation of every case + scoring checks
const C = require('../js/cases.js'), S = require('../js/score.js');
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } else console.log('ok  ', m); };
const n = s => { s = String(s).replace(/[$,\s]/g, '').replace('\u2212', '-'); const neg = /^\(.*\)$/.test(s); const v = parseFloat(s.replace(/[()]/g, '')); return neg ? -v : v; };
const ev = (c, id) => c.evidence.find(e => e.id === id).t.rows;
const row = (rows, name) => rows.find(r => r[0].startsWith(name));
const D = (d, m) => new Date(2026, m - 1, d); const days = (a, b) => Math.round((b - a) / 864e5);

// Case 1
{ const r = ev(C[0], 'E-01'); const o = n(r[0][1]);
  ok(o + n(r[1][1]) + n(r[2][1]) === n(r[3][1]), 'C1 forecast closing 240,000');
  ok(o + n(r[1][2]) + n(r[2][2]) === n(r[3][2]), 'C1 actual closing 155,000');
  ok(n(r[1][3]) + n(r[2][3]) === -85000 && n(r[3][3]) === -85000, 'C1 variance -85,000 = -60,000 + -25,000');
  const e2 = ev(C[0], 'E-02'); ok(n(e2[0][2]) + n(e2[1][2]) === 60000 && n(e2[2][2]) === 60000, 'C1 delayed receipts = 60,000'); }
// Case 2
{ const asof = D(15, 10), L = ev(C[1], 'E-01'); const mk = { '7 Aug': D(7, 8), '4 Sep': D(4, 9), '2 Oct': D(2, 10) };
  const exp = { 'INV-2118': 69, 'INV-2133': 41, 'INV-2147': 13 };
  L.forEach(r => { if (exp[r[0]]) ok(days(mk[r[2]], asof) === exp[r[0]] && +r[5] === exp[r[0]], `C2 ${r[0]} days overdue ${exp[r[0]]}`); });
  ok(days(D(8, 7), D(7, 8)) === 30 && days(D(5, 8), D(4, 9)) === 30 && days(D(2, 9), D(2, 10)) === 30 && days(D(3, 6), D(3, 7)) === 30 && days(D(24, 6), D(24, 7)) === 30 && days(D(6, 10), D(5, 11)) === 30, 'C2 all due dates are Net 30');
  const open = L.filter(r => r[4] === 'Open'); const tot = open.reduce((a, r) => a + n(r[3]), 0);
  const overdue = open.filter(r => /^\d+$/.test(r[5])).reduce((a, r) => a + n(r[3]), 0);
  ok(tot === 83350 && overdue === 63250, 'C2 open 83,350 / overdue 63,250');
  const ag = ev(C[1], 'E-02'); ok(ag.slice(0, 4).reduce((a, r) => a + n(r[1]), 0) === 83350, 'C2 aging buckets sum to total');
  ok(n(L[0][3]) + n(L[1][3]) === 36300, 'C2 paid-with-PO 36,300'); }
// Case 3
{ const r = ev(C[2], 'E-01'); ok(r.slice(0, 5).reduce((a, x) => a + n(x[3]), 0) === 30600, 'C3 register total 30,600');
  const p = ev(C[2], 'E-02'); ok(p.slice(0, 3).reduce((a, x) => a + n(x[1]), 0) === 40 && 28 * 240 === 6720 && p.slice(0, 3).reduce((a, x) => a + n(x[2]), 0) === 9600, 'C3 Plano 40 seats = $9,600');
  const idle = (6 + 6) * 240, dv = 450 * 12; ok(idle === 2880 && dv === 5400 && idle + dv === 8280 && 8280 + 3600 === 11880, 'C3 savings 2,880 + 5,400 = 8,280; +3,600 = 11,880');
  ok(7 * 450 === 3150, 'C3 DataVault billed to date 3,150 (Apr–Oct, 7 months)'); }
// Case 4
{ const P = ev(C[3], 'E-02').slice(0, 3); let price = 0, cost = 0, vm = 0, gpB = 0, gpA = 0, revB = 0, revA = 0, cA = 0, cB = 0;
  P.forEach(r => { const [ub, ua, pb, pa, kb, ka] = [1, 2, 3, 4, 5, 6].map(i => n(r[i])); price += (pa - pb) * ua; cost += (kb - ka) * ua; vm += (ua - ub) * (pb - kb);
    gpB += ub * (pb - kb); gpA += ua * (pa - ka); revB += ub * pb; revA += ua * pa; cB += ub * kb; cA += ua * ka;
    ok(ub * pb === n(r[7]) && ua * pa === n(r[8]) && ub * (pb - kb) === n(r[9]) && ua * (pa - ka) === n(r[10]), `C4 ${r[0]} row recomputes`); });
  ok(revB === 2500000 && revA === 2950000 && revA / revB === 1.18, 'C4 revenue +18.0%');
  ok(gpB === 900000 && gpA === 884000 && cB === 1600000 && cA === 2066000, 'C4 GP and COGS');
  ok(price === -160000 && cost === -40000 && vm === 184000 && price + cost + vm === -16000, 'C4 PVM: -160k price, -40k cost, +184k vol/mix = -16k');
  ok(Math.abs(gpA / revA * 100 - 30) < .05 && gpB / revB === .36, 'C4 GM 36.0% -> 30.0%');
  ok(900000 - 600000 === 300000 && 884000 - 640000 === 244000 && 244000 - 300000 === -56000, 'C4 operating profit -56,000');
  ok(118 + 14 + 8 === 140 && 118 + 19 + 8 === 145 && 120000 + 480000 === 600000 && 160000 + 480000 === 640000, 'C4 cost build-up and opex lines'); }
// Case 5
{ const T = ev(C[4], 'E-01'); const wd = s => +s.replace('WD', '');
  T.forEach(r => ok(wd(r[4]) - wd(r[3]) === +r[5], `C5 ${r[0].slice(0, 2)} delay ${r[5]}`));
  ok(T[1][5] === '+3' && T[8][5] === '+3' && wd(T[8][4]) === 8, 'C5 root delay +3 propagates to WD8 close');
  const J = ev(C[4], 'E-02'); const hrs = s => { const [d, t] = s.split(' '); return +t.slice(0, 2) + t.slice(3) / 60; };
  const avg = J.reduce((a, r) => a + (hrs(r[3]) - hrs(r[2])), 0) / J.length; ok(Math.abs(avg - 2.146) < .02 && J.every(r => hrs(r[3]) - hrs(r[2]) < 3), 'C5 avg approval 2.1h, all <3h');
  const A = ev(C[4], 'E-03'); ok(A.reduce((a, r) => a + n(r[2]), 0) === 10, 'C5 waiting hours 10.0'); }
// Structure + scoring
C.forEach(c => { ['d1', 'd2', 'dx', 'd3'].forEach(k => { const q = c[k]; ok(q.opts.length === 4 && q.opts.filter(o => o[1] === 1).length === 1, `${c.ref} ${k}: 4 options, exactly one full-credit`); });
  ok(c.rubric.length === 4 && c.relevant.every(id => c.evidence.some(e => e.id === id)), `${c.ref} rubric + relevant ids valid`);
  const best = {}; ['d1', 'd2', 'dx', 'd3'].forEach(k => best[k] = c[k].opts.findIndex(o => o[1] === 1));
  const allText = c.rubric.flatMap(r => r[1]).join(' ');
  const hi = S.scoreCase(c, best, c.relevant, allText).total, worst = {}; ['d1', 'd2', 'dx', 'd3'].forEach(k => { const cr = c[k].opts.map(o => o[1]); worst[k] = cr.indexOf(Math.min(...cr)); }); const lo = S.scoreCase(c, worst, [], '').total;
  ok(hi === 100, `${c.ref} perfect play = 100 (got ${hi})`); ok(lo < 15 && lo < hi, `${c.ref} lowest-credit play, no citations scores low (<15; got ${lo})`);
  const pen = S.scoreCase(c, best, c.evidence.map(e => e.id), allText).total; ok(pen < 100, `${c.ref} citing everything is penalized (${pen})`); });
console.log(fails ? `\n${fails} FAILED` : '\nALL CHECKS PASSED'); process.exit(fails ? 1 : 0);
