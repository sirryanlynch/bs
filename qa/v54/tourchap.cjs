// Part 2 tour from Home Explore: logs hash + caption each second; grabs the Find a place tap and the Discover tap.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
(async () => { const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2 }); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8080/prototype/?mode=tour&v=' + Date.now() + '#/beyond/discover'); let got = {}; let last = '';
  for (let t = 0; t < 220; t++) { await p.waitForTimeout(500);
    const st = await p.evaluate(() => ({ h: location.hash, say: (document.querySelector('.pt-stepcard p, .pt-stepcard .pt-say')?.textContent || '').slice(0, 80), tap: !!document.querySelector('.fl-cursor.is-shown'),
      over: (() => { const c = document.querySelector('.fl-cursor'); if (!c) return ''; const r = c.getBoundingClientRect(); const e = document.elementFromPoint(r.x + 4, r.y + 4); return e?.closest('.b-findhero') ? 'findhero' : e?.closest('.b-dsc-cta') ? 'dsc-cta' : ''; })() }));
    const k = st.h + ' | ' + st.say; if (k !== last) { console.log(t / 2, k); last = k; }
    if (st.over && (got[st.over]||0) < 2 && !(st.over in (globalThis.seen||={})) && (globalThis.seen[st.over+t]=1)) { got[st.over] = (got[st.over]||0) + 1; if (got[st.over] < 3) await p.locator('.phone').screenshot({ path: `/workspace/tripup/qa/v54/after/tour-${st.over}-${t}.png` }); console.log('  shot', st.over); }
    if (st.h.includes('plan/day')) break; }
  console.log('errors', JSON.stringify(errs)); await b.close(); })();
