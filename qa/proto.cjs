const { chromium } = require('playwright-core');
const steps = ['home','trip','invite','explore','create','push','live','closed','plan','expense','money','settle','squared'];
const BASE = process.env.BASE || 'http://localhost:8090/site/prototype/';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const errs = [];
  const mk = async (opts) => { const c = await b.newContext(opts); const p = await c.newPage(); p.on('console', m => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', e => errs.push('PAGEERR ' + e.message)); return p; };
  const out = process.argv[2] || 'shots';
  require('fs').mkdirSync(out, { recursive: true });
  const p = await mk({ viewport: { width: 1440, height: 960 } });
  for (const s of steps) {
    await p.goto(BASE + '#/' + s); await p.waitForTimeout(1600);
    await p.screenshot({ path: `${out}/d-${s}.png` });
  }
  const m = await mk({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  for (const s of steps) { await m.goto(BASE + '#/' + s); await m.waitForTimeout(1400); await m.screenshot({ path: `${out}/m-${s}.png` }); }
  console.log('ERRORS', JSON.stringify(errs.slice(0, 20)));
  await b.close();
})();
