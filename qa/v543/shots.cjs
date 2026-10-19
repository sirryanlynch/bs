const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const tag = process.argv[2];
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
  for (const [n, h] of [['trip', 'trip'], ['explore', 'explore'], ['money', 'money']]) {
    await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/' + h); await p.waitForTimeout(1800);
    if (n === 'money') { await p.evaluate(() => { location.hash = '#/money'; }); }
    await p.screenshot({ path: `/workspace/tripup/qa/v543/${tag}-${n}.png` });
    if (tag === 'after' && n !== 'explore') { const m = p.locator('.b-hm-btn').first(); if (await m.count()) { await m.click(); await p.waitForTimeout(700); await p.screenshot({ path: `/workspace/tripup/qa/v543/${tag}-${n}-menu.png` }); } }
  } await b.close(); })();
