const { chromium } = require('playwright-core');
const fs = require('fs');
const OUT = '/workspace/tripup/qa/deck-figma/src/';
const waits = { 1: 3200, 4: 7800, 6: 6000, 7: 3500, 8: 4600, 9: 3500 };
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=swiftshader', '--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8471/#1', { waitUntil: 'load' });
  const css = async (id, txt) => p.evaluate(([id, txt]) => { let s = document.getElementById(id); if (!s) { s = document.createElement('style'); s.id = id; document.head.appendChild(s); } s.textContent = txt; }, [id, txt]);
  const HIDE_CHROME = '.bar,.dock,.hint,.cursor{visibility:hidden!important}';
  const ISOLATE = 'html,body{background:transparent!important}.field,.bar,.dock,.hint,.cursor,.slide{visibility:hidden!important}';
  const shotEl = async (sel, file, pad = 0, extra = '') => {
    const r = await p.evaluate(s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }, sel);
    await p.screenshot({ path: OUT + file, omitBackground: true, clip: { x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.w + pad * 2, height: r.h + pad * 2 } });
    return r;
  };
  const meta = {};
  for (let i = 1; i <= 9; i++) {
    await css('x', '');
    await p.evaluate(n => window.TripUpDeck.go(n - 1), i);
    await p.waitForTimeout(waits[i] || 2500);
    const nn = String(i).padStart(2, '0');
    if ([1, 7, 9].includes(i)) {
      await css('x', ISOLATE + '#device{visibility:visible!important}');
      await p.waitForTimeout(60);
      meta['device' + nn] = await shotEl('#device', `device-${nn}.png`, 40);
      await css('x', '');
    }
    // background
    await css('x', HIDE_CHROME + '#device{visibility:hidden!important}.slide.is-active .in,.slide.is-active .credit{visibility:hidden!important}');
    await p.waitForTimeout(150);
    await p.screenshot({ path: `${OUT}bg-${nn}.jpg`, type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: 1440, height: 900 } });
    await css('x', '');
    if (i === 4) {
      await css('x', ISOLATE + '.slide.is-active svg.curve, .slide.is-active svg.curve *{visibility:visible!important}');
      meta.curve = await shotEl('.slide.is-active svg.curve', 'curve-04.png', 12);
      await css('x', '');
    }
    if (i === 5) {
      await css('x', ISOLATE + '.slide.is-active .glow-wrap, .slide.is-active .glow-wrap *{visibility:visible!important}');
      meta.glow = await shotEl('.slide.is-active .glow-wrap', 'glow-05.png', 30);
      await css('x', '');
    }
    if (i === 6) {
      meta.sb = await shotEl('#sbFrame', 'storybook-06.png', 0);
    }
    if (i === 8) {
      const views = [0, 1, 2];
      for (const v of views) {
        await css('x', '');
        await p.click(`.stepper button[data-view="${v}"]`);
        await p.waitForTimeout(3500);
        const texts = await p.evaluate(() => {
          const svg = document.querySelector('#graph'); const out = [];
          svg.querySelectorAll('text').forEach(t => { const r = t.getBoundingClientRect(); const cs = getComputedStyle(t); if (!r.width || cs.visibility === 'hidden' || +cs.opacity === 0) return; out.push({ t: t.textContent, cls: t.getAttribute('class'), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), f: cs.fontFamily.split(',')[0] + ' ' + cs.fontSize + ' ' + cs.fontWeight, fill: cs.fill, op: cs.opacity, anchor: t.getAttribute('text-anchor') }); });
          return { texts: out, ro: [document.querySelector('#ro1').textContent, document.querySelector('#ro2').textContent] };
        });
        meta['graph' + v] = texts;
        await css('x', ISOLATE + '.slide.is-active #graph, .slide.is-active #graph *{visibility:visible!important} html body .slide.is-active #graph text{visibility:hidden!important}');
        await p.waitForTimeout(150);
        meta['graphRect'] = await shotEl('#graph', `graph-08-${v}.png`, 0);
      }
      await css('x', '');
    }
  }
  fs.writeFileSync(OUT + 'meta.json', JSON.stringify(meta, null, 1));
  await b.close();
})();
