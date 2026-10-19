const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/poll/new/sent'); await p.waitForTimeout(1400);
  await p.locator('button:has-text("Done")').first().click(); await p.waitForTimeout(1200);
  console.log(await p.evaluate(() => location.hash)); await p.locator('.phone').screenshot({ path: 'qa/v531/sent-done.png' }); console.log(errs); await b.close(); })();
