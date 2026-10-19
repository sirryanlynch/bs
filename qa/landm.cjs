const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'] });
  const vp = process.argv[2] === 'desk' ? { width: 1440, height: 900 } : { width: 402, height: 874 };
  const c = await b.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 }); const p = await c.newPage();
  await p.goto('http://localhost:8090/site/'); await p.waitForTimeout(2500);
  const H = await p.evaluate(() => document.body.scrollHeight); let i = 0;
  for (let y = 0; y < H; y += vp.height) { await p.evaluate(y => window.scrollTo(0, y), y); await p.waitForTimeout(500); await p.screenshot({ path: `shots/lv-${process.argv[2]}-${String(i++).padStart(2, '0')}.png` }); }
  console.log(H, i); await b.close();
})();
