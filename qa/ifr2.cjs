const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto('http://localhost:8090/site/'); await p.waitForTimeout(2500);
  await p.addStyleTag({ content: '.x{}' }); await p.waitForTimeout(300);
  await p.screenshot({ path: 'shots/ifr-a.png', clip: { x: 760, y: 60, width: 560, height: 860 } });
  await b.close();
})();
