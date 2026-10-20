/**
 * Navigation motion tokens. One place for how screens arrive, iOS style:
 *   tab   - switching tabs: a quick crossfade; header and tab bar stay put, the tab lens glides.
 *   push  - drilling in: the new screen slides in from the right over a soft edge shadow.
 *   pop   - going back: the parent slides back in from a little to the left (parallax).
 *   sheet - opening a task (new poll, create trip, scan a receipt): rises from the bottom on a spring.
 *   fade  - anything else.
 * Reduce Motion turns all of them into a 160ms crossfade (see motion.css).
 */
export const MOTION = {
  tab: { ms: 220, easing: 'ease-out' },
  push: { ms: 440, easing: 'cubic-bezier(.32,.72,0,1)', parallax: 0.3 },
  sheet: { ms: 520, easing: 'cubic-bezier(.2,.9,.25,1.04)' },
  fade: { ms: 200, easing: 'ease' },
  reduce: { ms: 160 },
};
export type NavKind = 'tab' | 'push' | 'pop' | 'sheet' | 'fade';

/** Screens reached from the tab bar. Moving between two of these is a tab switch. */
// v5.5 navjank: every tab-bar destination (Plan lands on core 'trip', Photos on 'b:album', home level on discover/profile), so tab taps crossfade instead of pushing.
const TABS = new Set(['home', 'trip', 'plan', 'money', 'b:explore', 'b:polls', 'b:poll/new/sent', 'b:plan/day', 'b:album', 'b:discover', 'b:profile']);
/** Task starts that open as sheets. */
const SHEETS = ['b:poll/new', 'b:create/where', 'b:expense/scan', 'b:album/upload', 'invite', 'create', 'expense'];
const CORE_DEPTH: Record<string, number> = { home: 0, trip: 1, plan: 1, money: 1, invite: 2, explore: 2, create: 3, push: 3, live: 3, closed: 3, expense: 2, settle: 2, squared: 3 };
const depth = (id: string) => (id.startsWith('b:') ? (TABS.has(id) ? 0 : id.slice(2).split('/').length) : CORE_DEPTH[id.split('-')[0]] ?? 1);
/** Home-level tabs (no trip open). Moving between levels (open a trip, Back to Trips) stays a push/pop. */
const HOME_LVL = new Set(['home', 'b:discover', 'b:profile']);
const flowOf = (id: string) => (id.startsWith('b:') ? id.slice(2).split('/')[0] : 'core');

export function navKind(from: string | null, to: string): NavKind {
  if (!from || from === to) return 'fade';
  if (TABS.has(to) && (TABS.has(from) && HOME_LVL.has(from) === HOME_LVL.has(to) || flowOf(from) !== flowOf(to) && (from.startsWith('b:') !== to.startsWith('b:')))) return 'tab';
  if (SHEETS.some(s => to === s || to.startsWith(s + '-')) && (!to.startsWith('b:') || flowOf(from) !== flowOf(to))) return 'sheet';
  const a = depth(from), b = depth(to);
  if (b > a) return 'push';
  if (b < a) return 'pop';
  return flowOf(from) === flowOf(to) ? 'push' : 'fade';
}
let cur: string | null = null; let curCls = 'mo-fade';
/** Class for the screen that is mounting now. Stable across double renders of the same screen. */
export function navClass(id: string): string {
  if (id === cur) return curCls;
  curCls = 'mo-' + navKind(cur, id); if (typeof window !== 'undefined') ((window as any).__nav ||= []).push(`${cur} > ${id}: ${curCls}`); cur = id; return curCls;
}
/** Tab lens: where it was on the last screen, so the new tab bar can glide from there. */
export const tabMemory = { i: -1 };
