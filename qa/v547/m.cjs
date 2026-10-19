const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  for (const h of ['home', 'trip']) { await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/' + h); await p.waitForTimeout(1500);
  console.log(h, await p.evaluate(() => { const a = document.querySelector('.b-hm-bar').getBoundingClientRect(); const s = document.querySelector('.phone-screen').getBoundingClientRect(); const c = document.querySelector('.pt-hero, .scr-hero, .b-hero, main img, .scr-scroll > *'); const r = c.getBoundingClientRect(); return { hdrBottom: a.bottom - s.top, heroTop: r.top - s.top, cls: c.className }; })); }
  await b.close(); })();
