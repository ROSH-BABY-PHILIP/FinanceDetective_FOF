// Run: npx playwright test not required. node tests/ui-test.js  (needs playwright + chromium)
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const url = 'file://' + path.resolve(__dirname, '../index.html'); let fails = 0;
  const ok = (c, m) => { if (!c) fails++; console.log(c ? 'ok  ' : 'FAIL', m); };
  for (const vp of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const p = await (await b.newContext({ viewport: vp })).newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(url); ok(await p.locator('.card').count() === 5, `${vp.width}px: 5 case cards`);
    ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${vp.width}px: no horizontal page scroll`);
    if (vp.width === 1280) {
      await p.goto(url + '#/case/1'); ok(!(await p.content()).includes('ROOT CAUSE IDENTIFIED'.toLowerCase()) && !(await p.locator('#reveal').innerText()), 'C1: reveal hidden initially');
      ok(await p.locator('#rv').isDisabled(), 'C1: reveal button disabled until steps complete');
      await p.locator('[data-cite="E-01"]').check(); await p.locator('[data-cite="E-02"]').check();
      for (const k of ['d1', 'd2', 'dx', 'd3']) { await p.locator(`input[name=${k}]`).first().check(); await p.locator(`[data-lock=${k}]`).click(); }
      ok(await p.locator('.fb').count() >= 3, 'C1: feedback after each decision');
      await p.locator('#rv').click(); ok((await p.locator('#err, #cause-err').innerText()).length > 0, 'C1: validation blocks reveal without cause');
      await p.fill('#n-cause', 'Timing: delayed customer receipts and an early supplier payment'); await p.locator('#rv').click();
      ok(await p.locator('.reveal h2').count() > 0, 'C1: reveal shown after submit'); const sc = await p.locator('.score-big').innerText(); console.log('     score text:', sc.replace(/\s+/g, ' '));
      await p.reload(); ok(await p.locator('.reveal').count() === 1, 'C1: progress persisted across reload');
      await p.goto(url + '#/score'); ok((await p.locator('body').innerText()).includes('1 / 5'), 'Scorecard shows 1 / 5 cases');
      const [d] = await Promise.all([p.waitForEvent('download'), p.locator('#dl').click()]); ok(d.suggestedFilename().endsWith('.txt'), 'Summary download works');
      for (let i = 2; i <= 5; i++) { await p.goto(url + '#/case/' + i); ok(await p.locator('.ev').count() >= 5 && !(await p.locator('#reveal').innerText()), `C${i}: evidence rendered, reveal hidden`); }
    } else { await p.goto(url + '#/case/4'); ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '390px: case 4 page no horizontal scroll (tables scroll in container)'); }
    ok(errs.length === 0, `${vp.width}px: no JS errors ${errs.join('|')}`);
  }
  await b.close(); console.log(fails ? fails + ' FAILED' : 'UI CHECKS PASSED'); process.exit(fails ? 1 : 0);
})();
