const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const O = '/workspace/tripup/qa/v547/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  for (const h of ['trip']) { await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/' + h); await p.waitForTimeout(1800);
    await p.locator('.phone-screen').first().screenshot({ path: O + `nav-${h.replace(/\//g,'_')}.png` }); await p.locator('.b-hm-btn').first().click(); await p.waitForTimeout(700); await p.locator('.phone-screen').first().screenshot({ path: O + `nav-${h.replace(/\//g,'_')}-open.png` }); }
  await b.close(); })();
