// Layered screens: shoot, then try their own exit (Close / Done / viewer close / swipe on the sheet).
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  for (const [h, sel] of [['#/poll/new/sent', 'button:has-text("Done")'], ['#/beyond/album/viewer', '[role="dialog"] button[aria-label^="Close"], [role="dialog"] button[aria-label^="Back"], .b-viewer button'], ['#/beyond/invite', 'button[aria-label="Close"]']]) {
    await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + h); await p.waitForTimeout(1400);
    const n = h.replace(/[#/]+/g, '_'); await p.locator('.phone').screenshot({ path: `qa/v531/lay${n}.png` });
    const btns = await p.evaluate(() => [...document.querySelectorAll('.pt-screen-inner [role="dialog"] button, .pt-screen-inner .b-sheet button')].slice(0, 6).map(e => (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 24)).join(' ; '));
    await p.locator(sel).first().click({ timeout: 3000 }).catch(e => console.log('noclick', sel)); await p.waitForTimeout(900);
    console.log(h, '->', await p.evaluate(() => location.hash), '| dialog buttons:', btns); }
  await b.close(); })();
