const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/trip'); await p.waitForTimeout(2000);
  const plus = p.locator('[aria-label*="Create" i], [aria-label*="New" i], .b-fab, .p-tabplus').last(); console.log('plus', await plus.count()); await plus.click(); await p.waitForTimeout(700);
  console.log('menu', await p.locator('.b-cmenu').count()); await p.screenshot({ path: '/workspace/tripup/qa/v543/plus-menu.png' });
  await p.mouse.click(60, 300); await p.waitForTimeout(500); console.log('after scrim tap', await p.locator('.b-cmenu').count());
  await p.locator('.b-hm-btn').first().click(); await p.waitForTimeout(700); await p.screenshot({ path: '/workspace/tripup/qa/v543/nav-open.png' }); await b.close(); })();
