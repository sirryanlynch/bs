// Waits for the slide 1 hero phone to open Add people, then crops the phone.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8080/#1'); await p.waitForTimeout(3000);
  for (let i = 0; i < 40; i++) { const f = p.frames().find(f => f.url().includes('/prototype/'));
    const r = f && await f.evaluate(() => { const g = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; }; return { hash: location.hash, header: g('.b-hm'), sheet: g('.p-sheet'), toast: g('.pt-itoast') }; }).catch(() => null);
    if (r && (r.sheet || r.toast)) { console.log(i, JSON.stringify(r)); await p.screenshot({ path: `qa/v52/after/deck1-${i}.png`, clip: { x: 955, y: 110, width: 330, height: 670 } }); if (r.toast) break; }
    await p.waitForTimeout(1000); }
  await b.close(); })();
