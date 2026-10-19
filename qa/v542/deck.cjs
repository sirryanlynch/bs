// v5.4.2 deck: no Reduce motion toggle, slide 8 stage 3 flow, slide 9 netting engine to Solved, slide 10 corners, tap stops autoplay.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const O = '/workspace/tripup/qa/v542/';
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  const fh = () => p.evaluate(() => { try { return document.querySelector('#protoFrame').contentWindow.location.hash; } catch (e) { return '?'; } });
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#8'); await p.waitForTimeout(2500);
  console.log('motion toggle', await p.locator('#motionBtn').count());
  await p.click('#st3'); await p.waitForTimeout(1500); await p.screenshot({ path: O + 'd8-s3-closed.png' }); console.log('s3', await fh(), 'views', await p.locator('#sp3 .sp-views').count());
  await p.waitForTimeout(4200); console.log('s3 +4s', await fh()); await p.screenshot({ path: O + 'd8-s3-plan.png' });
  // tap stops autoplay
  await p.click('#st1'); await p.waitForTimeout(2600); const box = await p.locator('#protoFrame').boundingBox(); await p.mouse.click(box.x + box.width / 2, box.y + box.height * 0.45); const h1 = await fh(); await p.waitForTimeout(6000); const h2 = await fh();
  console.log('after user tap', h1, '-> 6s later', h2);
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#9'); await p.waitForTimeout(2500);
  const st = p.locator('.stepper button'); console.log('steppers', await st.count()); await st.nth(1).click(); await p.waitForTimeout(900); await p.screenshot({ path: O + 'd9-netting.png' });
  await p.waitForTimeout(2600); console.log('d9 step after', await p.evaluate(() => document.querySelector('[data-step]')?.dataset.step)); await p.screenshot({ path: O + 'd9-solved.png' });
  await p.goto('http://localhost:8080/?v=' + Date.now() + '#10'); await p.waitForTimeout(4000); await p.screenshot({ path: O + 'd10.png' });
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
