const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 1000, height: 960 } })).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => r.status() >= 400 && errs.push(r.status() + ' ' + r.url()));
  for (const id of ['components-money--simplify', 'components-feedback--live', 'components-feedback--island', 'components-polls--card-live', 'patterns-lisbon-scenario--live-poll', 'patterns-lisbon-scenario--balances']) {
    await p.goto(`http://localhost:8090/site/storybook/iframe.html?id=${id}&viewMode=story`); await p.waitForTimeout(id.includes('live') ? 4500 : 2500);
    await p.screenshot({ path: `shots/sb-${id}.png` });
  }
  await p.goto('http://localhost:8090/site/storybook/'); await p.waitForTimeout(3000); await p.screenshot({ path: 'shots/sb-home.png' });
  console.log('ERRORS', JSON.stringify(errs)); await b.close();
})();
