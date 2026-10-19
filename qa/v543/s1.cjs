const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#1'); await p.waitForTimeout(3500);
  console.log('device on', await p.evaluate(() => !!document.querySelector('.device.on, #device.on')), 'iframes visible', await p.evaluate(() => [...document.querySelectorAll('iframe')].filter(f => f.getBoundingClientRect().width > 0 && getComputedStyle(f.closest('.on')||f).visibility!=='hidden' && f.closest('.slide.is-cur, .slide.on')).length));
  await p.screenshot({ path: '/workspace/tripup/qa/v543/slide1.png' }); await b.close(); })();
