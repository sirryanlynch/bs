// Part 1 tour from the live step: Ari's phone hands over to Ren's link vote, then back. Logs the state each second.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.env.BASE || 'http://localhost:8080/prototype/';
(async () => { const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(B + '?mode=tour&v=' + Date.now() + '#/live');
  for (let i = 0; i < 26; i++) { await p.waitForTimeout(1000);
    const r = await p.evaluate(() => ({ h: location.hash, rv: document.querySelector('.rv')?.className.replace('scr rv ', '') ?? '-', ok: !!document.querySelector('.rv.is-done') }));
    console.log(i + 1, r.h, r.rv); if (i === 9) await p.locator('.pt-device').screenshot({ path: 'qa/v53/after/tour-ren.png' }); }
  console.log('errors', JSON.stringify(errs)); await br.close(); })();
