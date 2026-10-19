const { chromium } = require('playwright-core');
const fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=swiftshader', '--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: '/tmp/vid', size: { width: 1440, height: 900 } } });
  const p = await ctx.newPage();
  const w = ms => p.waitForTimeout(ms);
  await p.goto('http://localhost:8471/#1'); await w(4000);
  await p.mouse.move(400, 300, { steps: 12 }); await w(800);
  await p.keyboard.press('ArrowRight'); await w(2400);
  const cells = await p.$$('.mcell');
  for (const k of [2, 6, 13, 21]) { const bb = await cells[k].boundingBox(); await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2, { steps: 10 }); await w(1100); }
  await p.keyboard.press('ArrowRight'); await w(2000);
  for (const k of [0, 2]) { const bb = await (await p.$$('.persona'))[k].boundingBox(); await p.mouse.move(bb.x + 60, bb.y + 30, { steps: 10 }); await w(1300); }
  await p.keyboard.press('ArrowRight'); await w(8500);
  await p.click('.stage >> nth=1'); await w(1500);
  for (let i = 0; i < 3; i++) { await p.keyboard.press('ArrowRight'); await w(1100); }
  await p.keyboard.press('ArrowRight'); await w(2500);
  await p.click('.board-tabs button >> nth=1'); await w(1500); await p.click('.board-tabs button >> nth=2'); await w(1500); await p.click('.board-tabs button >> nth=0'); await w(1200);
  await p.keyboard.press('t'); await w(1800); await p.keyboard.press('t');
  await p.keyboard.press('ArrowRight'); await w(4500);
  const bb = await (await p.$('#sbFrame')).boundingBox(); await p.mouse.move(bb.x + bb.width * .6, bb.y + bb.height * .5, { steps: 10 });
  for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 220); await w(350); }
  await w(800); await p.click('.sb-tabs button >> nth=2'); await w(3500);
  await p.keyboard.press('ArrowRight'); await w(3000);
  await p.click('.pc-head [data-mode="hidden"]'); await w(1200);
  await p.click('.opt >> nth=0'); await w(1500); await p.click('#closePoll'); await w(1800);
  await p.click('.add-list button >> nth=1'); await w(3500);
  await p.keyboard.press('ArrowRight'); await w(5200);
  await p.click('.stepper button >> nth=1'); await w(1600); await p.click('#replay'); await w(4200);
  await p.keyboard.press('ArrowRight'); await w(3500);
  const hb = await (await p.$('.btn-hero')).boundingBox(); await p.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2, { steps: 14 }); await w(1500);
  await p.keyboard.press('o'); await w(2500); await p.keyboard.press('Escape'); await w(1000);
  const v = p.video(); await ctx.close(); const path = await v.path();
  fs.copyFileSync(path, '/workspace/tripup/qa/deck/walkthrough.webm'); console.log('saved', fs.statSync('/workspace/tripup/qa/deck/walkthrough.webm').size);
  await b.close();
})();
