const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  for (const [rm, tag] of [[false, 'full'], [true, 'rm']]) {
    const c = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: rm ? 'reduce' : 'no-preference' }); const p = await c.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://localhost:8090/site/#8'); await p.waitForTimeout(800);
    for (const [ms, n] of [[300, 'a-tangled'], [1500, 'b-netting'], [2200, 'c-solved']]) { await p.waitForTimeout(ms); await p.screenshot({ path: `/workspace/tripup/qa/v3/deck8-${tag}-${n}.png` }); }
    console.log(tag, errs);
    await c.close();
  }
  await b.close();
})();
