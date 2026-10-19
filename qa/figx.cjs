const { chromium } = require('playwright-core');
const fs = require('fs');
const OUT = '/workspace/tripup/qa/deck-figma/src/';
const waits = { 1: 3200, 4: 7800, 6: 5000, 7: 3500, 8: 4600, 9: 3500 };
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=swiftshader', '--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto('http://localhost:8471/#1', { waitUntil: 'load' });
  const only = process.env.ONLY ? process.env.ONLY.split(',').map(Number) : [1,2,3,4,5,6,7,8,9];
  for (const i of only) {
    await p.evaluate(n => window.TripUpDeck.go(n - 1), i);
    await p.waitForTimeout(waits[i] || 2500);
    const nn = String(i).padStart(2, '0');
    const data = await p.evaluate(() => {
      const s = document.querySelector('.slide.is-active');
      const roots = [s, document.querySelector('.bar'), document.querySelector('.dock'), document.querySelector('#device')];
      const out = [];
      const desc = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '');
      roots.forEach(root => root && root.querySelectorAll('*').forEach(el => {
        if (el.closest('svg') && el.tagName !== 'svg') return;
        const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return;
        if (r.right < 0 || r.left > 1440 || r.bottom < 0 || r.top > 900) return;
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s+/g, ' ').trim();
        const box = (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none');
        if (!own && !box && el.tagName !== 'IMG' && el.tagName !== 'svg' && el.tagName !== 'IFRAME') return;
        const depth = (() => { let d = 0, e = el; while (e && e !== root) { d++; e = e.parentElement; } return d; })();
        const o = { d: depth, el: desc(el), x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
        if (own) { o.t = (el.innerText || '').replace(/\n+/g, ' | ').slice(0, 400); o.f = [cs.fontFamily.split(',')[0], cs.fontSize, cs.fontWeight, cs.fontStyle === 'italic' ? 'i' : '', cs.lineHeight, cs.letterSpacing, cs.color, cs.textTransform !== 'none' ? cs.textTransform : ''].join(' '); }
        if (box) o.b = [cs.backgroundColor, cs.backgroundImage.slice(0, 120), cs.borderTopWidth + ' ' + cs.borderTopColor, 'r=' + cs.borderTopLeftRadius, cs.boxShadow.slice(0, 80), cs.backdropFilter !== 'none' ? 'bf=' + cs.backdropFilter : '', 'op=' + cs.opacity, 'pad=' + cs.padding].join(' ; ');
        if (el.tagName === 'IMG') o.src = el.getAttribute('src');
        out.push(o);
      }));
      return out;
    });
    fs.writeFileSync(`${OUT}dom-${nn}.json`, JSON.stringify(data, null, 0).replace(/\},\{/g, '},\n{'));
    await p.screenshot({ path: `${OUT}ref-${nn}.png` });
  }
  await b.close();
})();
