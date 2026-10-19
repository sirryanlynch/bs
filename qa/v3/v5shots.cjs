// node v5shots.cjs [base] : Money graph, solver skin, three states, light and dark, plus Reduce Motion
const { chromium } = require('playwright-core');
const BASE = process.argv[2] || 'http://localhost:8090/prototype/dist/'; const OUT = __dirname + '/v5';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const errs = [];
  for (const [scheme, rm] of [['light', false], ['dark', false], ['light', true]]) {
    const c = await b.newContext({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2, reducedMotion: rm ? 'reduce' : 'no-preference' }); const p = await c.newPage();
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(BASE + (scheme === 'dark' ? '?theme=dark' : '') + '#/money'); await p.waitForTimeout(1500);
    const tag = scheme + (rm ? '-rm' : '');
    await p.locator('.phone-screen').screenshot({ path: `${OUT}/money-a-tangled-${tag}.png` });
    await p.locator('.phone-screen').getByRole('button', { name: /Simplify 6 IOUs/ }).click();
    await p.waitForTimeout(rm ? 400 : 760); await p.locator('.phone-screen').screenshot({ path: `${OUT}/money-b-netting-${tag}.png` });
    await p.waitForTimeout(rm ? 1300 : 2050); await p.locator('.phone-screen').screenshot({ path: `${OUT}/money-c-solved-glint-${tag}.png` });
    await p.waitForTimeout(2000); await p.locator('.phone-screen').screenshot({ path: `${OUT}/money-d-solved-${tag}.png` });
    await c.close();
  }
  console.log('errors', JSON.stringify(errs)); await b.close();
})();
