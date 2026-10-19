const { chromium } = require('playwright-core');
const BASE = process.env.BASE || 'http://localhost:8471/';
const OUT = '/workspace/tripup/qa/deck/';
const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : null;
const waits = { 1: 3200, 4: 7800, 6: 5000, 7: 3500, 8: 4600, 9: 3500 };
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=swiftshader', '--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const report = [];
  for (const [tag, vp, mob] of [['desk', { width: 1440, height: 900 }, false], ['mob', { width: 390, height: 844 }, true]]) {
    if (process.env.VP && process.env.VP !== tag) continue;
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: mob ? 2 : 1, isMobile: mob, hasTouch: mob });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push('pageerror ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/vibrate/.test(m.text())) errs.push('console ' + m.text()); });
    p.on('requestfailed', r => errs.push('failed ' + r.url()));
    p.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
    await p.goto(BASE + '#1', { waitUntil: 'load' });
    for (let i = 1; i <= 9; i++) {
      if (only && !only.includes(i)) continue;
      await p.evaluate(n => window.TripUpDeck.go(n - 1), i);
      await p.waitForTimeout(waits[i] || 2000);
      const nn = String(i).padStart(2, '0');
      await p.screenshot({ path: `${OUT}${tag}-${nn}.png` });
      const issues = await p.evaluate((mob) => {
        const s = document.querySelector('.slide.is-active'); const out = [];
        const H = innerHeight, W = innerWidth;
        s.querySelectorAll('h1,h2,h3,p,li,a,button,.mcell,dl,blockquote,figure,.sb-frame,.graph,.pollcard,.bill').forEach(el => {
          const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
          const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || el.closest('[hidden]')) return;
          if (!mob && (r.bottom > H - 82 && !el.closest('.credit')) && r.top < H) out.push('below fold/dock: ' + el.tagName + '.' + el.className + ' "' + (el.textContent || '').trim().slice(0, 40) + '" bottom=' + Math.round(r.bottom));
          if (r.right > W + 1 || r.left < -1) out.push('x overflow: ' + el.tagName + '.' + el.className + ' "' + (el.textContent || '').trim().slice(0, 40) + '" ' + Math.round(r.left) + '..' + Math.round(r.right));
          if (el.scrollWidth > el.clientWidth + 2 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll' && !['A','BUTTON'].includes(el.tagName) && el.clientWidth) out.push('text clipped x: ' + el.tagName + '.' + el.className);
        });
        return out.slice(0, 12);
      }, mob);
      if (issues.length) report.push(`[${tag} ${i}] ` + issues.join('\n   '));
      if (mob && process.env.FULL) {
        const h = await p.evaluate(() => document.querySelector('.slide.is-active').scrollHeight);
        if (h > 844) { await p.evaluate(() => { const s = document.querySelector('.slide.is-active'); s.scrollTop = s.scrollHeight; }); await p.waitForTimeout(500); await p.screenshot({ path: `${OUT}${tag}-${nn}-end.png` }); }
      }
    }
    report.push(`[${tag}] errors: ` + (errs.length ? [...new Set(errs)].join('\n   ') : 'none'));
    await ctx.close();
  }
  console.log(report.join('\n'));
  await b.close();
})();
