const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto('http://localhost:8090/site/'); await p.waitForTimeout(2500);
  const f = p.frames()[1];
  console.log(await f.evaluate(() => [document.documentElement.className, ...['html','body','#root','.prism','.pt-embed'].map(s => s + ':' + getComputedStyle(document.querySelector(s)).backgroundColor + ' ' + getComputedStyle(document.querySelector(s)).backgroundImage.slice(0,40))]));
  await b.close();
})();
