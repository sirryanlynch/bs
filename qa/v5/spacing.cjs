// node qa/v5/spacing.cjs [outdir]  : automated padding/spacing audit of every kept prototype screen (light, 2x).
// Checks: CTA height/radius, icon-in-container centering (>1px), card insets vs gutter, gaps off the 4px grid,
// text clipping/overflow, tap targets < 44px, collisions with status bar / home indicator / tab bar, chip row alignment.
const { chromium } = require('/workspace/tripup/qa/v3/node_modules/playwright-core');
const fs = require('fs');
const B = process.env.BASE || 'http://localhost:8080/prototype/';
const OUT = process.argv[2] || '/workspace/tripup/qa/v5/spacing';
const CORE = ['home', 'trip', 'invite', 'explore', 'create', 'push', 'live', 'closed', 'plan', 'expense', 'money', 'settle/choose', 'settle/cash', 'settle/pending', 'settle/confirm', 'squared'];
const BEYOND = ['create/where', 'create/when', 'create/crew', 'create/done', 'explore', 'explore/curate', 'place/taberna', 'explore/addpoll', 'poll/new', 'poll/new/sent', 'plan/day', 'plan/add',
  'expense/scan', 'expense/assign', 'expense/done', 'album', 'album/viewer', 'invite', 'guest', 'guest/welcome', 'activity', 'recap', 'recap/card', 'profile'];
const ROUTES = [...CORE.map(r => ['core:' + r, '#/' + r]), ...BEYOND.map(r => ['beyond:' + r, r.startsWith('poll/new') ? '#/' + r : '#/beyond/' + r])];

function audit() {
  const scr = document.querySelector('.pt-screen-inner'); const S = scr.getBoundingClientRect();
  const out = []; const add = (kind, el, msg) => { const r = el.getBoundingClientRect(); out.push({ kind, msg, sel: (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : el.tagName.toLowerCase()), box: [r.left - S.left, r.top - S.top, r.width, r.height].map(Math.round) }); };
  const vis = el => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; if (el.closest('[aria-hidden="true"],[inert],[hidden]')) return false; const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    // ignore things scrolled out of the phone
    return r.bottom > S.top && r.top < S.bottom && r.right > S.left && r.left < S.right; };
  const all = [...scr.querySelectorAll('*')].filter(vis);
  const tabbar = scr.querySelector('.p-tabbar'); const TB = tabbar && vis(tabbar) ? tabbar.getBoundingClientRect() : null;
  // 1 CTAs: primary full-width buttons
  const ctas = all.filter(e => e.matches('button, a') && /cta|p-btn-primary|p-btn(?!-)/.test(e.className) && e.getBoundingClientRect().width > S.width * 0.6);
  ctas.forEach(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); if (![48, 50, 52, 56].includes(Math.round(r.height))) add('cta', e, `CTA height ${Math.round(r.height)}px (expected 52)`);
    const rad = parseFloat(cs.borderTopLeftRadius); if (rad < 20 && rad < r.height / 2 - 1) add('cta', e, `CTA radius ${rad}px (expected pill)`); });
  // 2 icon centering: small round/square containers holding a single svg
  all.filter(e => { const r = e.getBoundingClientRect(); return r.width <= 64 && r.height <= 64 && r.width >= 20 && e.children.length === 1 && e.firstElementChild.tagName === 'svg' && !(e.textContent || '').trim(); })
    .forEach(e => { const r = e.getBoundingClientRect(), i = e.firstElementChild.getBoundingClientRect(); const dx = (i.left + i.width / 2) - (r.left + r.width / 2), dy = (i.top + i.height / 2) - (r.top + r.height / 2); if (Math.abs(dx) > 1 || Math.abs(dy) > 1) add('icon', e, `icon off-center ${dx.toFixed(1)},${dy.toFixed(1)}px`); });
  // 3 card insets: rounded, filled boxes wider than 70% of the screen
  all.filter(e => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return parseFloat(cs.borderTopLeftRadius) >= 12 && r.width > S.width * 0.7 && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || cs.backdropFilter !== 'none') && !e.matches('button') && !e.closest('.p-tabbar, .pt-device > *:not(.pt-screen-inner)'); })
    .forEach(e => { const r = e.getBoundingClientRect(); const l = r.left - S.left, rr = S.right - r.right; if (l < 0.5 && rr < 0.5 && !e.matches('.scr, .b-scr, .pt-anim, .b-screen-anim, .p-sq-scrim')) { if (r.height < S.height * 0.9) add('inset', e, 'full-bleed rounded card'); }
      else if ((l > 0.5 && l < 11.5) || (rr > 0.5 && rr < 11.5)) add('inset', e, `card inset ${Math.round(l)}/${Math.round(rr)}px (< 12px gutter)`); });
  // 4 gaps off the 4px grid
  all.filter(e => { const cs = getComputedStyle(e); return /flex|grid/.test(cs.display); }).forEach(e => { const g = parseFloat(getComputedStyle(e).rowGap) || 0, c = parseFloat(getComputedStyle(e).columnGap) || 0;
    [g, c].forEach(v => { if (v > 0 && v % 2 !== 0 && v !== 1 && v !== 3) add('grid', e, `gap ${v}px off grid`); }); });
  // 5 text clipping / overflow
  all.filter(e => e.children.length === 0 && (e.textContent || '').trim().length > 1 && !e.closest('.sr-only, .visually-hidden')).forEach(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (r.right > S.right + 0.5 || r.left < S.left - 0.5) { if (!e.closest('.b-chips, .p-chips, [class*="scroll-x"], [class*="chiprow"], [class*="rail"], .b-fchips, .b-ot-list, [class*="strip"], [class*="carousel"]') && getComputedStyle(e.closest('*:not(figcaption)') || e).overflowX !== 'auto') add('clip', e, `text runs off screen: "${e.textContent.trim().slice(0, 24)}"`); }
    else if (e.scrollWidth > e.clientWidth + 1 && cs.overflow !== 'visible' && e.clientWidth > 0) add('clip', e, `${cs.textOverflow === 'ellipsis' ? 'truncated' : 'clipped'}: "${e.textContent.trim().slice(0, 24)}"`); });
  // 6 tap targets
  all.filter(e => e.matches('button, a[href], [role="button"], input[type="checkbox"], [role="radio"], [role="tab"]') && !e.disabled).forEach(e => { const r = e.getBoundingClientRect(); const b = getComputedStyle(e, '::before'); const exp = b.content !== 'none' && b.position === 'absolute';
    if (r.width < 44 && r.height < 44 && !exp && !e.closest('.p-tabbar')) add('tap', e, `tap target ${Math.round(r.width)}x${Math.round(r.height)}`); else if ((r.height < 32 || r.width < 32) && !exp && !e.closest('.p-tabbar')) add('tap', e, `thin tap target ${Math.round(r.width)}x${Math.round(r.height)}`); });
  // 7 collisions
  const statusB = S.top + 50, homeT = S.bottom - 28;
  all.filter(e => e.matches('button, a[href], h1, h2, input')).forEach(e => { const r = e.getBoundingClientRect(); if (e.closest('.pt-status, .p-statusbar, [class*="status"]')) return;
    const sc = e.closest('.scr-scroll, .b-scroll, .p-sscroll'); const inScroll = !!sc;
    if (!inScroll && r.top < statusB && r.bottom > S.top + 8) add('collide', e, 'under the status bar');
    if (!inScroll && r.bottom > homeT && !e.closest('.p-tabbar')) add('collide', e, 'over the home indicator');
    if (TB && !e.closest('.p-tabbar') && !inScroll && r.bottom > TB.top + 2 && r.top < TB.bottom && r.right > TB.left && r.left < TB.right) add('collide', e, 'overlaps the tab bar'); });
  // 8 chip rows: chips sharing a row should share a top
  scr.querySelectorAll('.b-fchips, .b-chips, .p-chips, [class*="chiprow"]').forEach(row => { if (!vis(row)) return; const tops = [...row.querySelectorAll('button')].filter(vis).map(b => Math.round(b.getBoundingClientRect().top)); const set = [...new Set(tops)];
    if (set.length > 1 && Math.max(...set) - Math.min(...set) < 20) add('chips', row, `chip tops differ by ${Math.max(...set) - Math.min(...set)}px`); });
  return out;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const p = await br.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 2 });
  const res = {};
  for (const [name, hash] of ROUTES) {
    await p.goto(B + '?mode=self&v=' + Date.now() + hash); await p.waitForTimeout(1500);
    res[name] = await p.evaluate(audit);
    await p.locator('.pt-device').screenshot({ path: `${OUT}/${name.replace(/[:/]/g, '_')}.png` });
  }
  await br.close();
  fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(res, null, 1));
  const tally = {}; let n = 0; for (const k in res) for (const f of res[k]) { tally[f.kind] = (tally[f.kind] || 0) + 1; n++; }
  console.log('findings', n, JSON.stringify(tally));
  for (const k in res) if (res[k].length) console.log(k, res[k].map(f => `${f.kind}:${f.msg} ${f.sel} [${f.box}]`).join('\n   '));
})();
