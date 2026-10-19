const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:8090/site/prototype/';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const errs = [];
  const as = process.argv[2] || 'ari';
  const c = await b.newContext({ viewport: { width: 1440, height: 960 } }); const p = await c.newPage();
  p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  await p.goto(BASE + (as === 'ari' ? '' : `#/home?as=${as}`)); await p.waitForTimeout(700);
  await p.getByRole('button', { name: 'Guided tour' }).click();
  const t0 = Date.now(); const seen = []; let last = '';
  while (Date.now() - t0 < 110000) {
    const h = await p.evaluate(() => location.hash);
    if (h !== last) { seen.push(`${((Date.now() - t0) / 1000).toFixed(1)} ${h}`); last = h; await p.screenshot({ path: `shots/t-${as}-${seen.length}.png` }); }
    const ok = await p.locator('.pt-checklist li.is-ok').count();
    if (ok >= 16 && h.includes('squared') && await p.locator('text=Shared with the crew').count()) break;
    await p.waitForTimeout(300);
  }
  console.log(seen.join('\n')); try { console.log(await p.locator('.pt-web-scroll').innerText({ timeout: 1000 })); } catch {} console.log('checks', await p.locator('.pt-checklist li.is-ok').count(), 'ERRORS', JSON.stringify(errs));
  await b.close();
})();
