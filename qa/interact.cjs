const { chromium } = require('playwright-core');
const OUT = '/workspace/tripup/qa/deck/';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=swiftshader', '--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8471/#1'); await p.waitForTimeout(1500);
  // keyboard nav
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(400);
  console.log('after right:', await p.evaluate(() => location.hash));
  await p.keyboard.press('Space'); await p.waitForTimeout(400);
  console.log('after space:', await p.evaluate(() => location.hash));
  await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(1500);
  // matrix hover
  const cells = await p.$$('.mcell'); await cells[2].hover(); await p.waitForTimeout(400);
  console.log('detail:', await p.textContent('#mdTitle'));
  // wheel
  await p.mouse.move(700, 450); await p.mouse.wheel(0, 120); await p.waitForTimeout(1200);
  console.log('after wheel:', await p.evaluate(() => location.hash));
  // overview
  await p.keyboard.press('o'); await p.waitForTimeout(700); await p.screenshot({ path: OUT + 'desk-overview.png' });
  await p.keyboard.press('Escape'); await p.waitForTimeout(400);
  // tokens
  await p.evaluate(() => TripUpDeck.go(4)); await p.waitForTimeout(2200);
  await p.keyboard.press('t'); await p.waitForTimeout(300); await p.screenshot({ path: OUT + 'desk-05-tokens.png' }); await p.keyboard.press('t');
  // poll hidden mode
  await p.evaluate(() => TripUpDeck.go(6)); await p.waitForTimeout(2500);
  await p.click('.pc-head [data-mode="hidden"]'); await p.waitForTimeout(500); await p.screenshot({ path: OUT + 'desk-07-hidden.png' });
  await p.click('.opt >> nth=0'); await p.waitForTimeout(800);
  await p.click('#closePoll'); await p.waitForTimeout(900); await p.screenshot({ path: OUT + 'desk-07-closed.png' });
  console.log('poll:', await p.textContent('.pc-as'), '|', await p.textContent('#pcSub'));
  await p.click('.add-list button >> nth=1'); await p.waitForTimeout(2500); await p.screenshot({ path: OUT + 'desk-07-ren.png' });
  console.log('proto hash:', await p.evaluate(() => document.getElementById('protoFrame').contentWindow.location.hash));
  // money netting
  await p.evaluate(() => TripUpDeck.go(7)); await p.waitForTimeout(2200); await p.screenshot({ path: OUT + 'desk-08-netting.png' });
  await p.waitForTimeout(500); await p.screenshot({ path: OUT + 'desk-08-tangled-or.png' });
  // storybook iframe scroll does not change slide
  await p.evaluate(() => TripUpDeck.go(5)); await p.waitForTimeout(4000);
  const box = await (await p.$('#sbFrame')).boundingBox();
  await p.mouse.move(box.x + box.width * .6, box.y + box.height * .6); await p.mouse.wheel(0, 600); await p.waitForTimeout(1200);
  console.log('after wheel in storybook:', await p.evaluate(() => location.hash));
  const sbOk = await p.evaluate(() => { try { const d = document.getElementById('sbFrame').contentDocument; return !!d.querySelector('#storybook-preview-iframe'); } catch (e) { return 'x ' + e.message; } });
  console.log('storybook loaded:', sbOk);
  // reduce motion
  await p.emulateMedia({ reducedMotion: 'reduce' }); await p.reload(); await p.waitForTimeout(800);
  console.log('motion attr:', await p.evaluate(() => document.documentElement.dataset.motion));
  await p.evaluate(() => TripUpDeck.go(3)); await p.waitForTimeout(600); await p.screenshot({ path: OUT + 'desk-04-reduced.png' });
  console.log('errors:', errs.length ? errs : 'none');
  await b.close();
})();
