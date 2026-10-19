const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const errs = [];
  for (const [n, vp, mob] of [['desk', { width: 1440, height: 900 }, false], ['mob', { width: 402, height: 874 }, true]]) {
    const c = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob, deviceScaleFactor: mob ? 2 : 1 }); const p = await c.newPage();
    p.on('console', m => m.type() === 'error' && errs.push(n + ' ' + m.text())); p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
    p.on('response', r => r.status() >= 400 && errs.push(n + ' ' + r.status() + ' ' + r.url()));
    await p.goto('http://localhost:8090/site/'); await p.waitForTimeout(4000);
    await p.screenshot({ path: `shots/l-${n}-hero.png` });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `shots/l-${n}-full.png`, fullPage: true });
  }
  console.log('ERRORS', JSON.stringify(errs)); await b.close();
})();
