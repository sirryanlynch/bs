const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 1440, height: 960 } })).newPage();
  p.on('console', m => console.log('C', m.type(), m.text())); p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto('http://localhost:8090/site/prototype/#/settle?as=ren'); await p.waitForTimeout(1000);
  console.log(await p.locator('.pt-web-scroll').innerText());
  await p.getByRole('button', { name: 'Guided tour' }).click(); await p.waitForTimeout(7000);
  console.log(await p.evaluate(() => location.hash)); console.log(await p.locator('.pt-web-scroll').innerText());
  await b.close();
})();
