// v5.4.1 Find a place: new order, Price point, chip jump-back with prefilled Next. node qa/v541/find.cjs [base]
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.argv[2] || 'http://localhost:8080/prototype/'; const O = '/workspace/tripup/qa/v541/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const q = () => p.evaluate(() => document.querySelector('.b-fp-title')?.textContent);
  const shot = n => p.locator('.phone').screenshot({ path: O + n + '.png' });
  for (const root of ['#/beyond/explore/curate', 'core']) {
    if (root === 'core') { await p.goto(B + '?mode=self&v=' + Date.now() + '#/explore'); await p.waitForTimeout(1500); await p.click('.b-findhero'); }
    else await p.goto(B + '?mode=self&v=' + Date.now() + root);
    await p.waitForTimeout(1400); const tag = root === 'core' ? 'core-' : '';
    console.log(tag + 'Q1', await q()); await shot(tag + 'q1-kind');
    await p.click('.b-fp-photo >> nth=0'); await p.waitForTimeout(900); console.log(tag + 'Q2', await q()); await shot(tag + 'q2-price');
    await p.click('.b-fp-glass >> nth=1'); await p.waitForTimeout(900); console.log(tag + 'Q3', await q());
    await p.click('.b-fp-photo >> nth=0'); await p.waitForTimeout(900); console.log(tag + 'Q4', await q());
    await p.click('.b-fp-glass >> nth=0'); await p.waitForTimeout(1300);
    const chips = await p.locator('.b-fp-chip').allInnerTexts(); console.log(tag + 'chips', JSON.stringify(chips)); await shot(tag + 'picks');
    await p.click('.b-fp-chip >> nth=1'); await p.waitForTimeout(900); console.log(tag + 'jump ->', await q(), 'on:', await p.locator('.is-on').count(), 'next:', await p.locator('.b-fp-next').count()); await shot(tag + 'jump-price');
    await p.click('.b-fp-glass >> nth=2'); await p.waitForTimeout(900); console.log(tag + 'then', await q(), 'on:', await p.locator('.is-on').count()); await shot(tag + 'jump-next');
    await p.click('.b-fp-next'); await p.waitForTimeout(900); console.log(tag + 'then', await q());
    await p.click('.b-fp-next'); await p.waitForTimeout(1300); console.log(tag + 'refreshed chips', JSON.stringify(await p.locator('.b-fp-chip').allInnerTexts()));
  }
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
