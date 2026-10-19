// node shots.cjs <outdir> [base] : every v3 screen, light and dark, 402x874 @2x
const { chromium } = require('playwright-core');
const fs = require('fs'); const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const BASE = process.argv[3] || 'http://localhost:8090/prototype/dist/';
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const SHOTS = [
  ['money-tangled', '#/money', 1600], ['money-solved', '#/money', 0, 'solve'],
  ['settle-01-choose', '#/settle/choose', 900], ['settle-02-cash', '#/settle/cash', 900], ['settle-03-slide', '#/settle/cash', 900, 'hold'],
  ['settle-04-pending', '#/settle/pending', 1300], ['settle-05-nic-confirm', '#/settle/confirm?as=nic', 900], ['settle-06-confirmed', '#/settle/confirmed', 1500],
  ['settle-07-receipt', '#/settle/receipt', 900], ['settle-08-partial', '#/settle/partial', 900], ['settle-09-dispute', '#/settle/dispute', 900],
  ['settle-10-offline', '#/settle/offline', 900], ['settle-handoff', '#/settle/handoff', 900], ['squared', '#/squared', 2200],
];
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  for (const scheme of (process.env.SCHEMES || 'light,dark').split(',')) {
    const c = await b.newContext({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2, colorScheme: scheme });
    const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    for (const [name, hash, wait, act] of SHOTS) {
      if (ONLY && !ONLY.includes(name)) continue;
      await p.goto('about:blank'); await p.goto(BASE + (scheme === 'dark' ? '?theme=dark' : '') + hash); await p.waitForTimeout(wait || 600);
      if (act === 'solve') { await p.getByRole('button', { name: /^Simplify/ }).click(); await p.waitForTimeout(3200); }
      if (act === 'hold') { const k = p.locator('.p-slide-knob'); const bb = await k.boundingBox(); const sc = bb.width / 56; await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x + bb.width / 2 + 0.78 * 298 * sc, bb.y + bb.height / 2, { steps: 8 }); await p.waitForTimeout(300); }
      await p.locator('.phone-screen').screenshot({ path: `${OUT}/${name}-${scheme}.png` });
      if (act === 'hold') await p.mouse.up();
    }
    console.log(scheme, errs.slice(0, 5));
    await c.close();
  }
  await b.close();
})();
