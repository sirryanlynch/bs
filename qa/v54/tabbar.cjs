const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 600, height: 300 }, deviceScaleFactor: 2 });
  for (const [id, n] of [[process.argv[2] + '--home-level', 'home'], [process.argv[2] + '--trip-level', 'trip']]) {
    await p.goto('http://localhost:8080/storybook/iframe.html?viewMode=story&id=' + id); await p.waitForTimeout(2500); await p.addStyleTag({ content: 'html,body,#storybook-root,#storybook-root > *, nav.p-tabbar{background:transparent!important;box-shadow:none!important}' });
    await p.locator('.p-tabbar').first().screenshot({ path: '/workspace/tripup/qa/v54/tabbar-' + n + '.png', omitBackground: true }); console.log(n); }
  await b.close(); })();
