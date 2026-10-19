const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const p = await (await b.newContext({ viewport: { width: 402, height: 874 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto('http://localhost:8090/site/prototype/#/expense'); await p.waitForTimeout(1200);
  await p.getByRole('button', { name: /Review/ }).tap(); await p.waitForTimeout(700); await p.screenshot({ path: 'shots/m-drawer.png' });
  await p.getByRole('button', { name: 'Guided tour' }).tap(); await p.getByRole('button', { name: 'Close panel' }).tap(); await p.waitForTimeout(2500); await p.screenshot({ path: 'shots/m-tour.png' });
  console.log('ERRORS', JSON.stringify(errs)); await b.close();
})();
