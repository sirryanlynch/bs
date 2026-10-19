// node qa/v531/swipe.cjs  Swipe down mid-drag and after release on in-flow screens (2x shots).
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  for (const [n, h, from] of [['composer', '#/poll/new/dinner', '#/trip'], ['cash', '#/settle/cash', ''], ['picks', '#/beyond/place/taberna', '']]) {
    await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + (from || h)); await p.waitForTimeout(1200);
    if (from) { await p.evaluate(h => { location.hash = h; }, h); await p.waitForTimeout(1200); }
    const r = await p.evaluate(() => { const e = document.querySelector('.pt-screen-inner').getBoundingClientRect(); return [e.left, e.top, e.width]; });
    const x = r[0] + r[2] / 2, y = r[1] + 90; await p.mouse.move(x, y); await p.mouse.down();
    for (let k = 1; k <= 14; k++) { await p.mouse.move(x, y + k * 20); await p.waitForTimeout(16); }
    await p.waitForTimeout(150); await p.locator('.phone').screenshot({ path: `qa/v531/after/swipe-${n}-mid.png` });
    await p.mouse.up(); await p.waitForTimeout(1100); await p.locator('.phone').screenshot({ path: `qa/v531/after/swipe-${n}-done.png` });
    console.log(n, h, '->', await p.evaluate(() => location.hash)); }
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
