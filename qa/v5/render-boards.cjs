// node render-boards.cjs : re-render the three mood boards at 2x (3840 x 2160) for the slide 5 lightbox, with board text in US English and formats ($, 12-hour times).
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--allow-file-access-from-files'] });
  const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 })).newPage();
  for (const n of ['prism', 'golden', 'night']) {
    await p.goto(`file:///workspace/tripup/moodboards/src/board_${n}.html`); await p.waitForTimeout(1500);
    const left = await p.evaluate(() => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n, c = 0;
      while ((n = w.nextNode())) { const t = n.nodeValue; const u = t.replace(/€\s?(\d)/g, '$$$1').replace(/(\d)\s?€/g, '$$$1').replace(/€/g, '$$').replace(/colour/g, 'color').replace(/Colour/g, 'Color').replace(/travelling/g, 'traveling').replace(/centre/g, 'center').replace(/\bgrey/g, 'gray').replace(/\b20:30\b/g, '8:30 PM').replace(/\b19:30\b/g, '7:30 PM').replace(/\b22:(\d\d)\b/g, '10:$1 PM').replace(/\b21:(\d\d)\b/g, '9:$1 PM'); if (u !== t) { n.nodeValue = u; c++; } } return [c, document.body.innerText.includes('€')]; });
    console.log(n, left);
    await p.screenshot({ path: `/tmp/board_${n}@2x.png` });
  }
  await b.close();
})();
