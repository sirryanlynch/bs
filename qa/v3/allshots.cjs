// node allshots.cjs <base> <outdir> : every step plus key sub-states, light and dark, phone-screen clip
const { chromium } = require('playwright-core'); const fs = require('fs');
const [BASE, OUT] = process.argv.slice(2); fs.mkdirSync(OUT, { recursive: true });
const L = ['home', 'trip', 'invite', 'explore', 'create', 'push', 'live', 'closed', 'plan', 'expense', 'money', 'squared', 'settle/choose', 'settle/cash', 'settle/partial', 'settle/pending', 'settle/handoff', 'settle/confirm?as=nic', 'settle/confirmed', 'settle/receipt', 'settle/dispute', 'settle/offline', 'live?as=ren', 'money?as=nic'];
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  for (const scheme of ['light', 'dark']) {
    const c = await b.newContext({ viewport: { width: 1300, height: 1000 }, deviceScaleFactor: 2, colorScheme: scheme }); const p = await c.newPage();
    for (const h of L) { await p.goto('about:blank'); await p.goto(BASE + (scheme === 'dark' ? '?theme=dark' : '') + '#/' + h); await p.waitForTimeout(1300);
      await p.locator('.phone-screen').screenshot({ path: `${OUT}/${h.replace(/[\/?=]/g, '_')}-${scheme}.png` }); }
    await c.close();
  }
  await b.close();
})();
