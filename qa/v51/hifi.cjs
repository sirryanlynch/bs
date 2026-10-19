// Recaptures the deck journey hi-fi shots (deck-src/shots/hifi-*.jpg) from the current prototype screen.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const SH = [['hifi-04-create-poll', '/create', ''], ['hifi-05-vote-from-push', '/push', ''], ['hifi-07-poll-closed', '/closed', ''],
  ['hifi-08-wine-split', '/expense', "click:.pt-whobtn[aria-label^='Ren'];click:.pt-whobtn[aria-label^='Nic']"], ['hifi-10-squared-up', '/squared', '']];
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2.2 });
  for (const [n, r, act] of SH) { await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#' + r); await p.waitForTimeout(1800);
    for (const a of act.split(';').filter(Boolean)) { await p.locator(a.slice(6)).first().click(); await p.waitForTimeout(500); }
    await p.waitForTimeout(800);
    const el = p.locator('.pt-screen-inner').first(); await el.screenshot({ path: `/workspace/tripup/qa/v51/thumbs/${n}.png` }); console.log('shot', n, await el.boundingBox()); }
  await b.close(); })();
