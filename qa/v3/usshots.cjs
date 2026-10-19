// node usshots.cjs : US-English captures of the built prototype for the deck and the case study
const { chromium } = require('playwright-core'); const fs = require('fs');
const BASE = process.argv[2] || 'http://localhost:8090/prototype/dist/'; const OUT = '/workspace/tripup/qa/v3/us'; fs.mkdirSync(OUT, { recursive: true });
const SHOTS = [['hifi-04-create-poll', '#/create'], ['hifi-05-vote-from-push', '#/push'], ['hifi-07-poll-closed', '#/closed', 2600], ['hifi-08-wine-split', '#/expense'], ['hifi-10-squared-up', '#/squared', 2400],
  ['cash-1-count', '#/settle/cash'], ['cash-2-pending', '#/settle/pending', 1400], ['cash-3-confirm', '#/settle/confirm?as=nic'], ['cash-4-confirmed', '#/settle/confirmed', 1600],
  ['app-home', '#/home'], ['app-trip', '#/trip'], ['app-push', '#/push'], ['app-live', '#/live', 1800], ['app-plan', '#/plan'], ['app-expense', '#/expense'], ['app-money', '#/money', 0, 'solve'], ['app-squared', '#/squared', 2400],
  ['ba-poll-after', '#/live', 1800], ['ba-money-after', '#/money', 0, 'solve']];
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const c = await b.newContext({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2 }); const p = await c.newPage();
  for (const [n, h, w, act] of SHOTS) {
    await p.goto('about:blank'); await p.goto(BASE + h); await p.waitForTimeout(w || 1000);
    if (act === 'solve') { await p.getByRole('button', { name: /^Simplify/ }).click(); await p.waitForTimeout(3400); }
    await p.locator('.phone-screen').screenshot({ path: `${OUT}/${n}.png` });
  }
  await b.close();
})();
