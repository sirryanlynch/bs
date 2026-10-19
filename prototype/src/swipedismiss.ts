import { useEffect } from 'react';

/**
 * v5.3.1 Swipe down to dismiss on in-flow screens (no tab bar). In-flow screens have no menu: Back and a swipe down
 * are the two ways out. The drag starts in the header, or anywhere while the page is scrolled to the top. The screen
 * follows the finger with resistance; past 110 pt (or a quick flick) it slides away and the screen's own Back runs,
 * so a swipe always goes exactly where Back goes. Sheets, dialogs and horizontal drags (swipe-to-remove, carousels)
 * are left alone. Reduce Motion: no follow, a short fade, then Back.
 */
const BACK = 'button[aria-label^="Back"], a[aria-label^="Back"], [data-flow-back]';
const SKIP = '.b-sheet, .p-sheet, .b-cs, .p-sq, [role="dialog"], [aria-modal="true"], input, textarea, select, [contenteditable="true"], .pt-tour, .pt-help';

function scrolledDown(el: Element | null, stop: Element) {
  for (let n = el; n && n !== stop; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1 && n.scrollTop > 0) return true;
  }
  return false;
}
const visible = (e: Element) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest('[aria-hidden="true"],[inert],[hidden]'); };

export function useSwipeDismiss(root: React.RefObject<HTMLElement>, reduce: boolean) {
  useEffect(() => {
    const el = root.current; if (!el) return;
    let st: null | { x: number; y: number; t: number; id: number; back: HTMLElement; layer: HTMLElement; on: boolean } = null;
    const layerOf = () => el.querySelector<HTMLElement>(':scope > .pt-anim:last-of-type') || el;
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || !e.isPrimary) return;
      const t = e.target as Element;
      if (t.closest(SKIP) || document.querySelector('.b-sheet.is-open, .p-sheet.is-open, [aria-modal="true"]')) return;
      const tab = el.querySelector('.p-tabbar'); if (tab && visible(tab)) return;          // tab screens: nothing to dismiss to
      const hm = el.querySelector('.b-hm-btn'); if (hm && visible(hm)) return;              // top-level screens (header menu): not a flow
      const back = Array.from(el.querySelectorAll<HTMLElement>(BACK)).find(visible); if (!back) return;
      const r = el.getBoundingClientRect(); const inHeader = e.clientY - r.top < 130;
      if (!inHeader && scrolledDown(t, el)) return;
      st = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, back, layer: layerOf(), on: false };
    };
    const move = (e: PointerEvent) => {
      if (!st || e.pointerId !== st.id) return;
      const dx = e.clientX - st.x, dy = e.clientY - st.y;
      if (!st.on) {
        if (Math.abs(dx) > 10 && Math.abs(dx) > dy) { st = null; return; }               // horizontal: leave it to the screen
        if (dy < 10) return;
        st.on = true; el.classList.add('is-swiping'); st.layer.style.transition = 'none';
      }
      if (!reduce) { const y = Math.max(0, dy) * 0.55; st.layer.style.transform = `translateY(${y}px) scale(${1 - Math.min(0.06, y / 4000)})`; st.layer.style.borderRadius = `${Math.min(44, y / 3)}px`; }
      e.preventDefault();
    };
    const up = (e: PointerEvent) => {
      if (!st || e.pointerId !== st.id) return;
      const s = st; st = null; el.classList.remove('is-swiping');
      if (!s.on) return;
      // a drag is not a tap: swallow the click that follows
      const eat = (c: Event) => { c.stopPropagation(); c.preventDefault(); }; window.addEventListener('click', eat, { capture: true, once: true }); setTimeout(() => window.removeEventListener('click', eat, true), 50);
      const dy = e.clientY - s.y, v = dy / Math.max(1, performance.now() - s.t);
      const L = s.layer;
      if (dy > 110 || (dy > 40 && v > 0.6)) {
        L.style.transition = reduce ? 'opacity 160ms linear' : 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1), opacity 220ms ease 40ms';
        if (reduce) L.style.opacity = '0'; else { L.style.transform = 'translateY(70%) scale(.94)'; L.style.opacity = '0'; }
        setTimeout(() => { s.back.click(); requestAnimationFrame(() => { L.style.cssText = L.style.cssText.replace(/(transform|transition|opacity|border-radius)[^;]*;?/g, ''); }); }, reduce ? 160 : 240);
      } else {
        L.style.transition = 'transform 380ms cubic-bezier(0.34, 1.3, 0.64, 1), border-radius 380ms ease';
        L.style.transform = ''; L.style.borderRadius = '';
        setTimeout(() => { L.style.transition = ''; }, 400);
      }
    };
    el.addEventListener('pointerdown', down); window.addEventListener('pointermove', move, { passive: false }); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { el.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, [root, reduce]);
}
