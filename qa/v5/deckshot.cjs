// node deckshot.cjs out.png '#7' [js-to-run-after-load]
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => {
  const [out, hash, js, w, h] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: +(w || 1440), height: +(h || 900) }, deviceScaleFactor: 2 });
  await p.goto('http://localhost:8080/?v=' + Date.now() + hash); await p.waitForTimeout(2500);
  if (js) { await p.evaluate(js); await p.waitForTimeout(2500); }
  await p.screenshot({ path: out }); await b.close();
})();
