// v5.4.2 deck slide 8: stage 1 autoplays Find a place to Poll sent and loops; stage 2 In the app opens on Trip home.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const O = '/workspace/tripup/qa/v542/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#8'); await p.waitForTimeout(2500);
  const fh = () => p.evaluate(() => { try { return document.querySelector('#protoFrame').contentWindow.location.hash; } catch (e) { return '?'; } });
  const seen = [];
  for (let t = 0; t < 44; t++) { await p.waitForTimeout(500); const h = await fh(); if (seen[seen.length - 1] !== h) { seen.push(h); console.log((t / 2).toFixed(1), h); }
    if (t === 3) await p.screenshot({ path: O + 'stage1-start.png' }); if (t === 22) await p.screenshot({ path: O + 'stage1-picks.png' }); if (h === '#/poll/new/sent' && !seen.includes('shot')) { seen.push('shot'); await p.screenshot({ path: O + 'stage1-sent.png' }); } }
  console.log('badge on slide', await p.locator('.pc-hidden').count(), 'composer toggle', await p.locator('text=The composer').count());
  await p.click('#st2'); await p.waitForTimeout(800); await p.click('button[data-hash="/live?open=trip"]'); await p.waitForTimeout(1500); console.log('stage2', await fh()); await p.screenshot({ path: O + 'stage2-open.png' });
  await p.waitForTimeout(3200); console.log('stage2 +3s', await fh()); await p.screenshot({ path: O + 'stage2-vote.png' });
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
