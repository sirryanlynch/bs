const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const O = '/workspace/tripup/qa/v55/poster/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  for (const [n, h, w] of [['s8-curate', '/beyond/explore/curate', 2000], ['s8-push', '/push', 2500], ['s8-live', '/live', 2000], ['s8-ren', '/live?as=ren', 2500], ['s8-closed', '/closed', 2200], ['s10-squared', '/squared', 3500]]) {
    await p.goto('http://localhost:8080/prototype/?embed=1&v=' + Date.now() + '#' + h + (h.includes('?') ? '&' : '?') + 'hold=1'); await p.waitForTimeout(w);
    await p.locator('.phone-screen').first().screenshot({ path: O + n + '.png' }); console.log(n, await p.evaluate(() => location.hash)); }
  await p.setViewportSize({ width: 800, height: 1000 }); await p.goto('http://localhost:8080/storybook/iframe.html?id=introduction--docs&viewMode=docs'); await p.waitForTimeout(3500); await p.screenshot({ path: O + 's7-storybook.png' });
  await b.close(); })();
