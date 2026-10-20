// Dense diagram/matrix labels (svg, .mcell, .mapp, .matrix, .ds-states, .board, .stage) are allowed at 13px.
// node a11y-size.cjs [base] [width]: lists visible tap targets <44px and visible text <15px on every deck slide at phone width. Exit 1 if any.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const B = process.argv[2] || 'http://localhost:8080/', W = +(process.argv[3] || 390);
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const c = await b.newContext({ viewport: { width: W, height: 844 }, isMobile: true, hasTouch: true }); const p = await c.newPage(); let bad = 0;
  for (let i = 1; i <= 10; i++) { await p.goto(B + '?v=' + Date.now() + '#' + i); await p.waitForTimeout(2200);
    const r = await p.evaluate(() => {
      const vis = e => { const q = e.getBoundingClientRect(); if (!q.width || !q.height) return false; for (let x = e; x; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; } return !e.closest('[aria-hidden=true],.sr-only,.skip,.hero-grid'); };
      const inScope = e => e.closest('.slide.is-active') || !e.closest('.slide');
      const name = e => (e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '') + ' "' + (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 24) + '"');
      const taps = [...document.querySelectorAll('a[href],button,[role=tab],input,label,summary')].filter(e => vis(e) && inScope(e)).filter(e => { const q = e.getBoundingClientRect(); return q.width < 44 - .5 || q.height < 44 - .5; }).map(e => { const q = e.getBoundingClientRect(); return name(e) + ' ' + Math.round(q.width) + 'x' + Math.round(q.height); });
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); const small = new Set(); let n; const d13 = new Set();
      while (n = tw.nextNode()) { const e = n.parentElement; if (!n.textContent.trim() || !e || !vis(e) || !inScope(e)) continue; const fs = parseFloat(getComputedStyle(e).fontSize); const dense = e.closest('svg, .mcell, .mapp, .matrix, .ds-states, .board, .stage'); if (fs < (dense ? 13 : 15) - .01) small.add(name(e) + ' ' + fs + 'px'); else if (fs < 15 - .01) d13.add(name(e)); }
      return { taps, small: [...small], d13: d13.size }; });
    bad += r.taps.length + r.small.length;
    console.log('#' + i, 'taps<44:', r.taps.length, 'text<15:', r.small.length, 'dense@13 (allowed):', r.d13); r.taps.forEach(t => console.log('  TAP ', t)); r.small.forEach(t => console.log('  TEXT', t)); }
  console.log('TOTAL', bad); await b.close(); process.exit(bad ? 1 : 0); })();
