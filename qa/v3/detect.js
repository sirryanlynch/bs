// Overlap detector. Runs in the page. root: element whose box is "the screen".
window.__detect = function (rootSel, opts = {}) {
  const root = document.querySelector(rootSel) || document.body;
  const R = root.getBoundingClientRect();
  const hits = [];
  const OVERLAY = '.p-sheet-layer, .p-modal-layer, .p-celebrate, .pt-drawer, .p-scrim, .pt-overlay';
  const CHROME = '.p-tabbar, .scr-bottombar, .pt-web-bar';
  const TOPCHROME = 'header.top, .pt-fab'; // sticky top chrome: scrolled content passing under it is expected
  const name = el => {
    if (!el || !el.tagName) return '?';
    const t = (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 28);
    const c = (typeof el.className === 'string' ? el.className.split(' ').filter(Boolean)[0] : '') || el.tagName.toLowerCase();
    return `${c}"${t}"`;
  };
  const vis = el => {
    for (let e = el; e && e !== document.documentElement; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.05) return false;
    }
    return true;
  };
  const inRoot = r => r.right > R.left + 1 && r.left < R.right - 1 && r.bottom > R.top + 1 && r.top < R.bottom - 1;
  // text items: union of text-node rects per parent element
  const items = [];
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const map = new Map();
  while (tw.nextNode()) {
    const n = tw.currentNode; if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || el.closest('svg, .phone-status, [aria-hidden="true"], .sr-only')) continue;
    if (!vis(el)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const eb = el.getBoundingClientRect();
    for (const r0 of rg.getClientRects()) {
      // clamp the font content box to the element's line box, so tall display glyph boxes do not count as overlap
      const t = Math.max(r0.top, eb.top), btm = Math.min(r0.bottom, eb.bottom);
      const r = { left: r0.left, right: r0.right, top: t, bottom: btm, width: r0.width, height: btm - t }; if (r.width < 2 || r.height < 2 || !inRoot(r)) continue; if (!map.has(el)) map.set(el, []); map.get(el).push(r); }
  }
  map.forEach((rects, el) => items.push({ el, rects, kind: 'text' }));
  root.querySelectorAll('button, a[href], input, [role="radio"], [role="button"]').forEach(el => {
    if (!vis(el) || el.closest('[aria-hidden="true"]')) return; const r = el.getBoundingClientRect(); if (r.width < 2 || !inRoot(r)) return;
    items.push({ el, rects: [r], kind: 'ctl' });
  });
  const rel = (a, b) => a === b || a.contains(b) || b.contains(a);
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const layer = el => el.closest(OVERLAY);
  // 1) pairwise overlaps among visible items in the same layer
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const A = items[i], B = items[j]; if (rel(A.el, B.el)) continue;
    if (A.kind === 'ctl' && B.kind === 'ctl' && (A.el.closest('[role="radiogroup"], .p-seg, .pt-seg') && A.el.parentElement === B.el.parentElement)) continue;
    if (layer(A.el) !== layer(B.el)) continue; // modal over content is intended
    const ch = e => e.closest(CHROME);
    const tc = e => e.closest(TOPCHROME);
    if (!!tc(A.el) !== !!tc(B.el)) continue;
    if (!opts.scrolledEnd && (!!ch(A.el) !== !!ch(B.el))) continue; // content scrolling under floating chrome at rest
    let area = 0; for (const a of A.rects) for (const b of B.rects) area += inter(a, b);
    if (area > 6) hits.push({ type: 'overlap', a: name(A.el), b: name(B.el), area: Math.round(area) });
  }
  // 2) occlusion of text by something unrelated, excluding intended overlays and resting scroll-under-chrome
  for (const it of items) {
    if (it.kind !== 'text') continue;
    const r = it.rects[0]; const pts = [[r.left + r.width / 2, r.top + r.height / 2]];
    for (const [x, y] of pts) {
      if (x < R.left || x > R.right || y < R.top || y > R.bottom) continue;
      const top = document.elementFromPoint(x, y); if (!top || rel(top, it.el)) continue;
      if (layer(top) && !layer(it.el)) continue;
      if (top.closest(CHROME) && !it.el.closest(CHROME) && !opts.scrolledEnd) continue;
      if (top.closest(TOPCHROME) && !it.el.closest(TOPCHROME)) continue;
      if (top.closest('.pt-ripple, .pt-hifi')) continue;
      if (top.contains(it.el) || it.el.contains(top)) continue;
      if (getComputedStyle(top).pointerEvents === 'none' && !top.closest('.pt-toast, .p-toast, .pt-itoast')) continue;
      hits.push({ type: top.closest(CHROME) ? 'under-chrome' : 'occluded', a: name(it.el), b: name(top) });
    }
  }
  // 3) clipped / truncated text
  root.querySelectorAll('*').forEach(el => {
    if (el.closest('svg, .sr-only') || !vis(el) || !el.firstChild) return;
    const s = getComputedStyle(el); const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasText) return;
    const clipX = (s.overflow !== 'visible' || s.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1;
    const clipY = (s.webkitLineClamp && s.webkitLineClamp !== 'none') && el.scrollHeight > el.clientHeight + 2;
    const r = el.getBoundingClientRect(); if (!inRoot(r)) return;
    if (clipX || clipY) hits.push({ type: 'clipped', a: name(el) });
  });
  // 4) safe areas (phone only)
  if (opts.phone) {
    const top = R.top + 54, bot = R.bottom - 21;
    items.forEach(it => { if (it.el.closest('.phone-status, .p-lock-inner, .scr-hero, .p-trip, .p-island') ) return; const r = it.rects[0];
      if (r.top < top && r.bottom > R.top + 2 && !it.el.closest(OVERLAY)) { const s = it.el.closest('.scr-scroll, .pt-web-scroll'); if (!s || s.scrollTop < 4) hits.push({ type: 'status-bar', a: name(it.el) }); }
      const modalOpen = !!document.querySelector('.p-sheet-layer, .p-modal-layer, .p-celebrate');
      if (it.kind === 'ctl' && r.bottom > bot && !(modalOpen && !layer(it.el))) hits.push({ type: 'home-indicator', a: name(it.el) }); }); // inert content behind a modal is skipped
    // tap targets
    root.querySelectorAll('button, a[href], [role="radio"]').forEach(el => { if (!vis(el) || el.closest('[aria-hidden="true"]')) return; const r = el.getBoundingClientRect(); if (!inRoot(r) || r.width < 2) return;
      if (r.width < 43.5 && r.height < 43.5 || Math.min(r.width, r.height) < 28) hits.push({ type: 'small-target', a: name(el), size: `${Math.round(r.width)}x${Math.round(r.height)}` }); });
  }
  // dedupe
  const seen = new Set(); return hits.filter(h => { const k = JSON.stringify(h); if (seen.has(k)) return false; seen.add(k); return true; });
};
