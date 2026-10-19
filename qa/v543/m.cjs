const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#1'); await p.waitForTimeout(2500);
  console.log(await p.evaluate(() => { const e = document.querySelector('.hero-show'); const c = getComputedStyle(e); const r = e.getBoundingClientRect(); const i = document.querySelector('.hs-2').getBoundingClientRect(); return JSON.stringify({ r, i, op: c.opacity, vis: c.visibility, disp: c.display, img: document.querySelector('.hs-2 img').naturalWidth }); }));
  await b.close(); })();
