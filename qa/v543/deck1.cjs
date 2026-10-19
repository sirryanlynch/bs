const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#1'); await p.waitForTimeout(3000);
  const fh = () => p.evaluate(() => document.querySelector('#protoFrame').contentWindow.location.hash);
  const h0 = await fh(); await p.waitForTimeout(6000); const h1 = await fh();
  const pe = await p.evaluate(() => getComputedStyle(document.querySelector('#protoFrame')).pointerEvents);
  console.log('slide1', h0, '->', h1, 'pointer-events', pe); await p.screenshot({ path: '/workspace/tripup/qa/v543/after-slide1.png' });
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#10'); await p.waitForTimeout(4000); await p.screenshot({ path: '/workspace/tripup/qa/v543/after-slide10.png' }); await b.close(); })();
