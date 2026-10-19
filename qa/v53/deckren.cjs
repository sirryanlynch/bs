// node qa/v53/deckren.cjs  Slide 8 stage 2, Ren on the web: shoots the embed autoplay at intervals.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#8'); await p.waitForTimeout(3000);
  await p.click('#st2'); await p.waitForTimeout(800); await p.click('button[data-hash="/live?as=ren"]');
  for (const t of [2500, 3500, 3500, 4000]) { await p.waitForTimeout(t); const i = [2500,3500,3500,4000].indexOf(t);
    await p.screenshot({ path: `qa/v53/deck-after/deck-s8-ren${Date.now()%100000}.png` }); }
  console.log('src', await p.evaluate(() => [...document.querySelectorAll('iframe')].map(f => f.src).filter(s => s.includes('ren')).join(' ')));
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
