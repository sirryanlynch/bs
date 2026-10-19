import { useLayoutEffect, useRef } from 'react';
/**
 * Exit motion for screen changes (v5.1). React swaps screens by key, so the outgoing screen is gone before it can animate.
 * During render we clone the outgoing screen's DOM (it is still mounted), then on commit insert the clone as an inert,
 * aria-hidden "ghost" that plays the exit half of the transition and removes itself:
 *   push  -> outgoing parallaxes 30% left and dims under the incoming screen
 *   pop   -> outgoing slides off to the right above the returning screen
 *   tab, fade -> outgoing fades out; sheet -> outgoing settles back under the rising sheet
 * Reduce Motion turns every exit into a short fade (motion.css).
 */
const DUR: Record<string, number> = { push: 460, pop: 420, tab: 220, fade: 220, sheet: 540 };
export function useNavGhost<T extends HTMLElement = HTMLDivElement>(id: string, cls: string) {
  const el = useRef<T | null>(null);
  const prev = useRef(id);
  const pend = useRef<{ node: HTMLElement; scrolls: [number, number][] } | null>(null);
  if (prev.current !== id && el.current && !pend.current && el.current.isConnected) {
    const old = el.current; const scrolls: [number, number][] = [];
    old.querySelectorAll('*').forEach((n, i) => { const t = (n as HTMLElement).scrollTop; if (t) scrolls.push([i, t]); });
    pend.current = { node: old.cloneNode(true) as HTMLElement, scrolls };
  }
  useLayoutEffect(() => {
    if (prev.current === id) return; prev.current = id;
    const p = pend.current; pend.current = null; const cur = el.current;
    if (!p || !cur || !cur.parentElement) return;
    const kind = (cls.match(/mo-(push|pop|tab|fade|sheet)/) ?? [])[1]; if (!kind) return;
    const g = p.node; g.className = g.className.replace(/\bmo-[a-z]+\b/g, '').trim() + ` mo-ghost mo-out-${kind}`;
    g.setAttribute('aria-hidden', 'true'); (g as any).inert = true; g.removeAttribute('id');
    if (kind === 'pop') cur.after(g); else cur.before(g);
    const all = g.querySelectorAll('*'); p.scrolls.forEach(([i, t]) => { const n = all[i] as HTMLElement | undefined; if (n) n.scrollTop = t; });
    const t = window.setTimeout(() => g.remove(), DUR[kind] ?? 400);
    return () => { window.clearTimeout(t); g.remove(); };
  }, [id]);
  return el;
}

/** Photo to hero (v5.1): the tapped photo's rect is remembered; the next hero image that lands with the same src FLIPs from it. */
let flip: { src: string; rect: DOMRect; at: number } | null = null;
export const heroFlip = {
  mark(img: Element | null | undefined) { if (img instanceof HTMLImageElement) flip = { src: img.currentSrc || img.src, rect: img.getBoundingClientRect(), at: Date.now() }; },
  land(img: HTMLImageElement | null) {
    const f = flip;
    if (!img || !f || Date.now() - f.at > 1200 || img.dataset.flipped) return;
    if ((img.currentSrc || img.src) !== f.src && !img.src.endsWith(f.src.split('/').pop() ?? '#')) return;
    const reduce = document.querySelector('.prism[data-motion="reduce"]') || matchMedia('(prefers-reduced-motion: reduce)').matches; if (reduce) return;
    const host = img.closest('.mo-push'); if (host) host.classList.replace('mo-push', 'mo-fade'); // the photo carries the motion, the screen just fades
    const r = img.getBoundingClientRect(); if (!r.width || !r.height) return;
    img.dataset.flipped = '1'; flip = null;
    const sx = f.rect.width / r.width, sy = f.rect.height / r.height;
    img.animate([
      { transformOrigin: '0 0', transform: `translate(${f.rect.left - r.left}px, ${f.rect.top - r.top}px) scale(${sx}, ${sy})`, borderRadius: '24px' },
      { transformOrigin: '0 0', transform: 'none', borderRadius: '0px' },
    ], { duration: 460, easing: 'cubic-bezier(.32,.72,0,1)' });
  },
};
