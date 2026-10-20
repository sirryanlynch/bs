// node desk.cjs <base> <tag>: every slide at 1440x900 and 1024x640, animations settled.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const [B, tag] = [process.argv[2], process.argv[3]];
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[1440, 900], [1024, 640]]) { const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    for (let i = 1; i <= 10; i++) { await p.goto(B + '?v=' + Date.now() + '#' + i); await p.waitForTimeout(3500);
      await p.addStyleTag({ content: 'iframe{visibility:hidden!important} *{caret-color:transparent!important}' });
      await p.screenshot({ path: `/workspace/tripup/qa/v55/desk/${tag}-${w}-${String(i).padStart(2, '0')}.png` }); } await p.close(); }
  await b.close(); })();
