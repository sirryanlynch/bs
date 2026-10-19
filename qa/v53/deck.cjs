// node qa/v53/deck.cjs outdir [slides...]  Screenshots deck slides at 1440x900 after their entrance settles.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const out = process.argv[2] || 'qa/v53/after'; const list = (process.argv[3] || '5,6,7,8,9').split(',');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  for (const n of list) { await p.goto('http://localhost:8080/?v=' + Date.now() + '#' + n); await p.waitForTimeout(n === '7' ? 7000 : 4500);
    await p.screenshot({ path: `${out}/deck-s${n}.png` }); console.log('shot', n); }
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
