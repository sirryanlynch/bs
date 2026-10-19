// Deck slide 1 at 1440x900 plus a crop of the hero phone (Add people sheet) and the JTBD dialog title.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8080/#1'); await p.waitForTimeout(5000);
  await p.screenshot({ path: 'qa/v52/after/deck-slide1.png' });
  const f = p.frames().find(f => f.url().includes('/prototype/'));
  if (f) { const r = await f.evaluate(() => { const g = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; }; return { header: g('.b-hm'), sheet: g('.p-sheet'), title: g('.p-sheet-title, .p-sheet h2') }; }); console.log('embed', f.url(), JSON.stringify(r)); }
  console.log('title', await p.title(), '|', await p.$eval('h1.display', e => e.innerText.replace(/\n/g, ' / ')));
  const jb = await p.$('#jtbdBtn'); if (jb) console.log('jtbd btn', await jb.innerText());
  await b.close(); })();
