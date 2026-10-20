// node mob.cjs <base> <tag>: every slide at 390x844 and 430x932 (full page), checks horizontal overflow, small text and small tap targets.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core'); const [B, tag] = [process.argv[2] || 'http://localhost:8080/', process.argv[3] || 'mobile'];
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  for (const [w, h] of [[390, 844], [430, 932]]) { const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const p = await c.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    for (let i = 1; i <= 10; i++) { await p.goto(B + '?v=' + Date.now() + '#' + i); await p.waitForTimeout(2600);
      const r = await p.evaluate(() => { const s = document.querySelector('.slide.is-active') || document.body; const W = innerWidth;
        const over = [...s.querySelectorAll('*')].filter(e => { const q = e.getBoundingClientRect(); return q.width && (q.right > W + 1 || q.left < -1) && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.hero-grid,.hg-col,[aria-hidden=true]'); }).length;
        const small = [...s.querySelectorAll('p,li,span,small,a')].filter(e => e.childNodes.length && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 12) && parseFloat(getComputedStyle(e).fontSize) < 15 && e.getBoundingClientRect().width).length;
        const taps = [...document.querySelectorAll('a,button')].filter(e => { const q = e.getBoundingClientRect(); return q.width && q.height && getComputedStyle(e).visibility !== 'hidden' && (q.width < 44 || q.height < 44) && q.bottom > 0 && q.top < innerHeight * 3 && (e.closest('.slide.is-active') || !e.closest('.slide')); }).map(e => (e.textContent || e.getAttribute('aria-label') || e.className).trim().slice(0, 18));
        return { sw: document.documentElement.scrollWidth, over, small, taps: taps.slice(0, 6), ntaps: taps.length, iframes: [...document.querySelectorAll('iframe')].filter(f => f.getBoundingClientRect().width > 0 && getComputedStyle(f).display !== 'none' && f.offsetParent).length }; });
      if (w === 390) console.log(i, JSON.stringify(r));
      await p.screenshot({ path: `/workspace/tripup/qa/v55/${tag}-${w}-${String(i).padStart(2, '0')}.png`, fullPage: false });
      // tall capture: scroll the slide in steps and stitch
      const H = await p.evaluate(() => { const s = document.querySelector('.slide.is-active'); return s ? s.scrollHeight : innerHeight; }); const shots = [];
      for (let y = 0, k = 0; y < H && k < 6; y += h - 160, k++) { await p.evaluate(y => { const s = document.querySelector('.slide.is-active'); if (s) s.scrollTop = y; }, y); await p.waitForTimeout(450); const f = `/tmp/m-${w}-${i}-${k}.png`; await p.screenshot({ path: f }); shots.push([f, await p.evaluate(() => document.querySelector('.slide.is-active').scrollTop)]); }
      require('fs').writeFileSync(`/tmp/m-${w}-${i}.json`, JSON.stringify({ H, h, shots })); }
    console.log(w, 'errors', JSON.stringify(errs)); await c.close(); }
  await b.close(); })();
