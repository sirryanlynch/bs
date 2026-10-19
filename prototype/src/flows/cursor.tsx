import React, { useEffect, useRef } from 'react';
import { PACE, easedScroll, tapLabel } from './pacing';

/** A finger-sized touch indicator that glides to a target inside the phone and taps it. It never takes pointer input. */
export type Target = { sel: string; text?: string; aria?: RegExp; nth?: number };
type Api = { moveTo: (t: Target | Element, ms?: number) => Promise<Element | null>; tap: (el?: Element | null, click?: boolean) => Promise<void>; drag: (dy: number, ms?: number) => Promise<void>; hide: () => void; root: () => HTMLElement | null };
export const cursor: Api & { _impl?: Api } = {
  moveTo: (t, ms) => cursor._impl?.moveTo(t, ms) ?? Promise.resolve(null),
  tap: (el, click) => cursor._impl?.tap(el, click) ?? Promise.resolve(),
  drag: (dy, ms) => cursor._impl?.drag(dy, ms) ?? Promise.resolve(),
  hide: () => cursor._impl?.hide(),
  root: () => cursor._impl?.root() ?? null,
};

const visible = (el: Element) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.closest('[inert],[aria-hidden="true"]'); };
export function findTarget(root: ParentNode, t: Target): HTMLElement | null {
  const all = Array.from(root.querySelectorAll(t.sel)).filter(visible) as HTMLElement[];
  const hit = all.filter(el => (!t.text || (el.textContent ?? '').includes(t.text) || (el.getAttribute('aria-label') ?? '').includes(t.text)) && (!t.aria || t.aria.test(el.getAttribute('aria-label') ?? '')));
  return hit[t.nth ?? 0] ?? null;
}
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export function TourCursor({ on, reduce }: { on: boolean; reduce: boolean }) {
  const dot = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const pos = useRef<{ x: number; y: number } | null>(null);
  const R = useRef(reduce); R.current = reduce;
  const lab = useRef<HTMLSpanElement>(null); const d0 = () => dot.current;
  useEffect(() => {
    const root = () => host.current?.parentElement ?? null;
    const local = (el: Element) => {
      const box = root()!.getBoundingClientRect(); const sc = box.width / (root()!.offsetWidth || box.width);
      const r = el.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - box.left) / sc, y: (r.top + Math.min(r.height / 2, 26) - box.top) / sc };
    };
    const place = (p: { x: number; y: number }) => { dot.current?.getAnimations().forEach(a => a.cancel()); if (dot.current) dot.current.style.transform = `translate(${p.x}px, ${p.y}px)`; };
    const glide = async (to: { x: number; y: number }, ms = PACE.glideMax) => {
      const d = dot.current!; const from = pos.current ?? { x: to.x + 60, y: to.y + 140 };
      d.classList.add('is-shown');
      if (R.current) { place(to); pos.current = to; return; }
      // A gentle arc: the midpoint lifts away from the straight line, then eases in.
      const mx = (from.x + to.x) / 2 + (to.y - from.y) * 0.12, my = (from.y + to.y) / 2 - Math.abs(to.x - from.x) * 0.12 - 10;
      const pts = Array.from({ length: 13 }, (_, i) => { const u = i / 12; const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u; return { transform: `translate(${a * from.x + b * mx + c * to.x}px, ${a * from.y + b * my + c * to.y}px)` }; });
      const dur = Math.min(ms, PACE.glideBase + Math.hypot(to.x - from.x, to.y - from.y) * PACE.glidePerPx);
      await d.animate(pts, { duration: dur, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'forwards' }).finished.catch(() => {});
      place(to); pos.current = to;
    };
    const impl: Api = {
      root,
      moveTo: async (t, ms = PACE.glideMax) => {
        const r = root(); if (!r || !dot.current) return null;
        const el = t instanceof Element ? t : findTarget(r, t);
        if (!el) return null;
        el.scrollIntoView?.({ block: 'nearest', behavior: R.current ? 'auto' : 'smooth' });
        if (!R.current) await sleep(PACE.settleBeforeGlide);
        const to = local(el);
        if (lab.current) lab.current.textContent = PACE.caption ? tapLabel(el) : '';
        await glide(to, ms);
        d0()?.classList.add('is-hover'); if (!R.current) await sleep(PACE.hover);
        return el;
      },
      tap: async (el, click = true) => {
        const d = dot.current; if (!d) return;
        const P = R.current ? PACE.reduce : PACE;
        d.classList.remove('is-tap'); void d.offsetWidth; d.classList.add('is-tap', 'is-hover');
        if (el instanceof HTMLElement) { el.classList.add('fl-press'); setTimeout(() => el.classList.remove('fl-press'), P.press + 120); }
        await sleep(P.press + P.hold);
        if (click && el instanceof HTMLElement && el.isConnected) el.click();
        setTimeout(() => d.classList.remove('is-tap', 'is-hover'), 520);
      },
      drag: async (dy, ms = 900) => {
        const d = dot.current, r = root(); if (!d || !r) return;
        const sc = Array.from(r.querySelectorAll('.b-scroll, .scr-scroll')).filter(visible).pop() as HTMLElement | undefined;
        if (!sc) return;
        const box = sc.getBoundingClientRect(), rb = r.getBoundingClientRect(); const s = rb.width / (r.offsetWidth || rb.width);
        const start = { x: (box.left + box.width * 0.62 - rb.left) / s, y: (box.top + box.height * (dy > 0 ? 0.7 : 0.35) - rb.top) / s };
        await glide(start, 500);
        if (lab.current) lab.current.textContent = PACE.caption && !R.current ? 'Scroll' : '';
        d.classList.add('is-down', 'is-hover'); await sleep(R.current ? 0 : PACE.scrollPause);
        const scroll = easedScroll(sc, dy, R.current ? 0 : PACE.scrollMs); ms = R.current ? 0 : PACE.scrollMs;
        if (!R.current) { const end = { x: start.x, y: start.y - Math.sign(dy) * Math.min(220, Math.abs(dy) * 0.5) }; await d.animate([{ transform: `translate(${start.x}px, ${start.y}px)` }, { transform: `translate(${end.x}px, ${end.y}px)` }], { duration: ms, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished.catch(() => {}); place(end); pos.current = end; await sleep(ms * 0.3); }
        await scroll; if (!R.current) await sleep(PACE.scrollPause);
        d.classList.remove('is-down', 'is-hover');
      },
      hide: () => { dot.current?.classList.remove('is-shown', 'is-tap', 'is-down', 'is-hover'); },
    };
    cursor._impl = impl;
    return () => { if (cursor._impl === impl) cursor._impl = undefined; };
  }, []);
  useEffect(() => { if (!on) cursor.hide(); }, [on]);
  return <div ref={host} className={`fl-cursor-host ${on ? '' : 'is-off'}`} aria-hidden><div ref={dot} className="fl-cursor"><span className="fl-cursor-ring" /><span ref={lab} className="fl-cursor-say" /></div></div>;
}
