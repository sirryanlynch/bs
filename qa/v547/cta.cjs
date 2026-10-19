const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const O = '/workspace/tripup/qa/v547/'; const B = process.argv[2] || 'http://localhost:8080/prototype/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const go = async h => { await p.goto(B + '?mode=self&v=' + Date.now() + h); await p.waitForTimeout(1600); };
  const H = () => p.evaluate(() => location.hash); const sh = n => p.locator('.phone-screen').first().screenshot({ path: O + n + '.png' });
  const has = async () => ({ hdr: await p.locator('.phone-screen .b-hm-bar').count(), tabs: await p.locator('.phone-screen .p-tabbar, .phone-screen .b-tabbar, .phone-screen [role=tablist]').count() });
  await go('#/trip'); await p.locator('button:has-text("Start a poll")').first().click(); await p.waitForTimeout(1200); console.log('trip Start a poll ->', await H(), 'findplace hdr', JSON.stringify(await has()), 'invite sheet', await p.locator('text=/QR|Invite/i').count()); await sh('trip-startpoll');
  await go('#/beyond/explore/curate'); for (const sel of ['.b-fp-photo', '.b-fp-glass >> nth=1']) { await p.locator(sel).first().click(); await p.waitForTimeout(900); }
  await sh('price'); await p.locator('.b-fp-photo').first().click(); await p.waitForTimeout(900); await p.locator('.b-fp-glass >> nth=1').click(); await p.waitForTimeout(1500);
  console.log('picks hdr', JSON.stringify(await has())); await sh('picks'); await p.locator('.b-cmp-cta').click(); await p.waitForTimeout(1500); console.log('Start a poll ->', await H());
  await p.locator('.b-cmp-cta').first().click().catch(() => console.log('  no send cta')); await p.waitForTimeout(1800); console.log('Send ->', await H()); await sh('sent');
  for (const h of ['#/explore', '#/beyond/explore', '#/money', '#/plan', '#/home']) { await go(h); console.log(h, JSON.stringify(await has())); }
  await go('#/beyond/explore'); await p.locator('.phone-screen .b-scroll, .phone-screen .scr-scroll').first().evaluate(e => e.scrollTop = 1500).catch(() => {}); await p.waitForTimeout(600); console.log('beyond explore after scroll', JSON.stringify(await has())); await sh('explore-scrolled');
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
