const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = 'http://localhost:8093/prototype/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  const go = async h => { await p.goto(B + '?mode=self&v=' + Date.now() + h); await p.waitForTimeout(1500); };
  const shot = async n => { await p.locator('.phone').screenshot({ path: '/workspace/tripup/qa/v54/before/' + n + '.png' }); console.log(n); };
  for (const [h, n] of [['#/home', 'home'], ['#/trip', 'trip'], ['#/beyond/album', 'photos'], ['#/beyond/explore', 'explore-beyond'], ['#/beyond/poll/new/sent', 'poll-sent'], ['#/beyond/create/done', 'create-done']]) { await go(h); await shot(n); }
  await go('#/trip'); await p.locator('.b-hm-btn').first().click(); await p.waitForTimeout(900); await shot('trip-menu-open');
  await b.close(); })();
