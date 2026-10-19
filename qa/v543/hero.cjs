const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  for (const [n, h] of [['trip','trip'],['live','live'],['explore','explore'],['plan','plan'],['split','expense'],['squared','settle/done'],['photos','beyond/trip/lisbon/photos']]) {
    await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/' + h); await p.waitForTimeout(2200);
    if (n === 'split') { const r = p.locator('button', { hasText: 'Split the items' }); if (await r.count()) { await r.first().click(); await p.waitForTimeout(900); } const bi = p.locator('.b-se-seg button', { hasText: 'By item' }); if (await bi.count()) { await bi.first().click(); await p.waitForTimeout(900); } }
    console.log(n, await p.evaluate(() => location.hash));
    await p.locator('.phone-screen').first().screenshot({ path: `/workspace/tripup/qa/v543/hero-${n}.png` }); }
  await b.close(); })();
