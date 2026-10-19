// Frames of exit + photo-to-hero motion
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.env.BASE || 'http://localhost:5190/';
(async () => {
  const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  const out = '/workspace/tripup/qa/v51/motion';
  require('fs').mkdirSync(out, { recursive: true });
  await p.goto(B + '?mode=self#/beyond/explore'); await p.waitForTimeout(1500);
  await p.locator('.b-xcard-media').first().click();
  for (const t of [60, 180, 320, 600]) { await p.waitForTimeout(t === 60 ? 60 : t - [60, 180, 320, 600][[60, 180, 320, 600].indexOf(t) - 1]); await p.locator('.pt-device').screenshot({ path: `${out}/hero-${t}.png` }); }
  console.log('ghosts after 600ms:', await p.locator('.mo-ghost').count());
  // push / pop on core
  await p.goto(B + '?mode=self#/trip'); await p.waitForTimeout(1500);
  await p.evaluate(() => { location.hash = '#/money'; }); await p.waitForTimeout(140); await p.locator('.pt-device').screenshot({ path: `${out}/push-140.png` });
  console.log('ghost during push:', await p.locator('.mo-ghost').count());
  await p.waitForTimeout(800); console.log('ghost after:', await p.locator('.mo-ghost').count());
  console.log('errors', errs);
  await br.close();
})();
