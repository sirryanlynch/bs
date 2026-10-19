/**
 * Guided tour pacing. Every number the tour waits on lives here so it can be tuned in one place.
 * A tap is: glide to the target, hover, press, hold, then the screen changes, then dwell before the next move.
 * Reduce Motion keeps the order but drops the glides and holds to short fixed pauses.
 */
export const PACE = {
  glideBase: 420,        // ms, minimum glide
  glidePerPx: 1.5,       // ms added per px travelled
  glideMax: 1150,        // ms, longest glide
  settleBeforeGlide: 260,// ms after scrolling a target into view
  hover: 320,            // ms the cursor rests on the target before pressing
  press: 200,            // ms of the press-in
  hold: 360,             // ms between press and the screen changing
  dwellScale: 1.3,       // multiplies every scripted wait (time spent on the new screen)
  coreScale: 1.3,        // multiplies the core Lisbon tour timeline
  coreLead: 1500,        // ms before an action that the cursor starts moving to its control
  scrollMs: 1500,        // ms for one demonstrative scroll
  scrollPause: 260,      // ms the finger rests before and after a scroll
  caption: true,         // small "Tap ..." bubble next to the cursor
  reduce: { hover: 0, press: 120, hold: 120, dwellScale: 1, coreScale: 0.8, scrollMs: 0 },
};
export const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
/** Eased, slow scroll used by the tour instead of the browser's quick smooth scroll. */
export function easedScroll(el: HTMLElement, dy: number, ms: number) {
  if (ms <= 0) { el.scrollBy({ top: dy }); return Promise.resolve(); }
  const y0 = el.scrollTop, max = el.scrollHeight - el.clientHeight, y1 = Math.max(0, Math.min(max, y0 + dy)); const t0 = performance.now();
  return new Promise<void>(r => { const f = (t: number) => { const u = Math.min(1, (t - t0) / ms); el.scrollTop = y0 + (y1 - y0) * ease(u); u < 1 ? requestAnimationFrame(f) : r(); }; requestAnimationFrame(f); });
}
/** Short label for the caption bubble: "Tap Add to poll". */
export function tapLabel(el: Element): string {
  const raw = el.getAttribute('aria-label') || ((el as HTMLElement).innerText || '').trim().split('\n')[0] || '';
  const t = raw.split(' · ')[0].replace(/\s+/g, ' ').trim();
  return t && t.length <= 26 ? `Tap ${t}` : 'Tap';
}
