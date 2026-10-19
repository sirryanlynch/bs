// node deck-captures.cjs : real component crops and the Storybook preview for deck slides 6 and 7. Rerun after any Storybook or prototype rebuild.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 3 });
  await p.goto('http://localhost:8080/prototype/?mode=self&embed=1#/trip'); await p.waitForTimeout(1500);
  const tb = p.locator('.p-tabbar-wrap, .p-tabbar').first();
  await tb.screenshot({ path: '/workspace/tripup/site/deck/img/ds-tabbar.png', omitBackground: true });
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
  await s.goto('http://localhost:8080/storybook/?path=/story/patterns-settle-up-cash--choose-method'); await s.waitForTimeout(6000);
  await s.screenshot({ path: '/tmp/sb.png' });
  await b.close();
  const idx = JSON.parse(fs.readFileSync('/workspace/tripup/site/storybook/index.json', 'utf8')).entries;
  const st = Object.values(idx).filter(e => e.type === 'story'), docs = Object.values(idx).filter(e => e.type === 'docs');
  const comps = new Set(st.map(e => e.title)).size;
  fs.writeFileSync('/workspace/tripup/site/deck/sb-counts.js', `window.SB_COUNTS = ${JSON.stringify({ stories: st.length, components: comps, docs: docs.length })};\n`);
  console.log('counts', st.length, comps, docs.length);
})();
