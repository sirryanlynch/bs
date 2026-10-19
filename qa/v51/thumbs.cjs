// Regenerates deck nav thumbnails (site/deck/thumbs/NN.jpg, 640x400) from the live deck.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  for (let n = 1; n <= 10; n++) { await p.goto('http://localhost:8080/?v=' + Date.now() + '#' + n); await p.waitForTimeout(3500);
    await p.screenshot({ path: `/workspace/tripup/qa/v51/thumbs/${String(n).padStart(2, '0')}.png` }); console.log('thumb', n); }
  await b.close(); })();
