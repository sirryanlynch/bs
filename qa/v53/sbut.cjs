// node qa/v53/sbut.cjs  DebtUntangle steps story: Tangled, Next x2, Start over.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 520, height: 820 } }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8080/storybook/iframe.html?id=components-money--untangle&viewMode=story'); await p.waitForTimeout(2500);
  for (let i = 0; i < 3; i++) { await p.screenshot({ path: `qa/v53/after2/sb-untangle-${i}.png` });
    const n = p.locator('.p-ut-next'); if (await n.count()) { await n.first().click(); await p.waitForTimeout(1600); } }
  console.log('restart', await p.locator('.p-ut-restart').count(), 'grab', await p.locator('.p-ut-steps').count());
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
