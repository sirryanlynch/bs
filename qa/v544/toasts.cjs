const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const O = '/workspace/tripup/qa/v544/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  const ov = async (sel) => p.evaluate((sel) => { const t = document.querySelector(sel); if (!t) return 'none'; const r = t.getBoundingClientRect(); const hits = [...document.querySelectorAll('.phone-screen button, .phone-screen [role=radio]')].filter(e => e !== t && !t.contains(e) && !e.closest('.pt-itoast,.p-undo')).filter(e => { const q = e.getBoundingClientRect(); return q.width && q.left < r.right && q.right > r.left && q.top < r.bottom && q.bottom > r.top; }).map(e => (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30)); return hits.length ? 'OVERLAP ' + hits.join(' | ') : 'clear'; }, sel);
  await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/money'); await p.waitForTimeout(1800);
  await p.locator('.pt-mseg button:has-text("You")').click(); await p.waitForTimeout(400); await p.locator('.pt-myrow-btn:has-text("Request")').first().click(); await p.waitForTimeout(500);
  console.log('money request toast', await ov('.pt-itoast')); await p.locator('.phone').screenshot({ path: O + 'money-request.png' });
  // cash pay -> pending with undo
  await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + '#/settle/choose'); await p.waitForTimeout(1500);
  await p.locator('button:has-text("Continue with cash")').click().catch(() => {}); await p.waitForTimeout(1200);
  const sl = p.locator('.p-slide, [role=slider]').first(); if (await sl.count()) { const bb = await sl.boundingBox(); await p.mouse.move(bb.x + 20, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x + bb.width - 5, bb.y + bb.height / 2, { steps: 12 }); await p.mouse.up(); }
  await p.waitForTimeout(1200); console.log('hash', await p.evaluate(() => location.hash), 'undo', await ov('.p-undo'));
  await p.locator('.phone').screenshot({ path: O + 'pending.png' });
  await p.locator('button:has-text("Nudge")').click().catch(() => console.log('nudge noclick')); await p.waitForTimeout(500); console.log('nudge toast', await ov('.pt-itoast'));
  for (const [h, btn] of [['#/money', 'Simplify'], ['#/trip', null], ['#/plan', null]]) { await p.goto('http://localhost:8080/prototype/?mode=self&v=' + Date.now() + h); await p.waitForTimeout(1500); await p.evaluate(() => {}); }
  await b.close(); })();
