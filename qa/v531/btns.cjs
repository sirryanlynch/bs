const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  for (const h of process.argv.slice(2)) { await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + h); await p.waitForTimeout(1300);
    const r = await p.evaluate(() => [...document.querySelectorAll('.pt-screen-inner button, .pt-screen-inner a')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && !e.closest('[aria-hidden="true"]'); }).map(e => `${e.className.split(' ')[0]}|${(e.getAttribute('aria-label') || e.textContent).trim().slice(0, 28)}`).slice(0, 14).join(' ; '));
    console.log(h, '\n  ', r); } await b.close(); })();
