import { CreateMenu, CreateKind } from '../../components/beyond/createmenu';
import { tabMemory } from '../../lib/motion';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import '../../components/beyond/beyond.css';
import './screens.css';
import { BIcon } from '../../components/beyond/icons';
import { TabBar } from '../../components/nav';
import { people, Person } from '../../lib/data';
import { ALBUM, AlbumPhoto, DAY_PLAN, PlanItem, Review, CREW, DESTINATIONS } from '../../lib/beyond';
import type { CurateAnswers } from '../../components/beyond/explore';
import type { SplitMode } from '../../components/beyond/expense';
import type { ExperienceType } from '../../data/experienceTypes';
import type { YMD } from '../../components/beyond/create';

/* ---------- State ---------- */
export type FlowState = {
  route: string; history: string[];
  create: { q: string; dest?: string; start?: YMD; end?: YMD; cover?: string; budget?: number; crew: string[]; name: string; created: boolean; fromRecap?: boolean };
  saved: string[]; inPoll: string[]; exploreXt: ExperienceType; curate: CurateAnswers; sheetPlace?: string;
  place: { mine?: Review; picked: string[]; rating: number; text: string; privacy: 'crew' | 'public' };
  album: { photos: AlbumPhoto[]; fresh: string[]; groupBy: 'day' | 'place'; xt: ExperienceType; viewer: number; sel: string[]; tagPlace: string; pub: string[]; who?: string };
  plan: { day: string; items: Record<string, PlanItem[]>; xt: ExperienceType; editId?: string; addPart: PlanItem['part']; landed?: string; addTab: string };
  expense: { assign: Record<string, string[]>; mode: SplitMode; open: string; shares: Record<string, number>; excluded: string[]; tip: number; saved: boolean };
  guest: { voted?: number; banner: boolean };
  notif: { expanded?: string; done: string[]; prefs: Record<string, boolean> };
  settings: { appearance: 'light' | 'dark' | 'system'; reduceMotion: boolean; albumDefault: 'crew' | 'public'; publicName: 'initial' | 'anon'; method: string };
  poll: { day: string; time: string; closes: string; today: string; category: ExperienceType; what: string; title: string; options: { label: string; from?: string; photo?: string }[]; draft: string; sent: boolean; seeded: boolean };
  toast?: { msg: string; id: number };
};
export const LINES_ALL = ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'];
export const flowInitial = (): FlowState => ({
  route: 'explore', history: [],
  create: { q: '', crew: [], name: '', created: false },
  saved: ['park'], inPoll: [], exploreXt: 'all', curate: {},
  place: { picked: [], rating: 0, text: '', privacy: 'public' },
  album: { photos: ALBUM, fresh: [], groupBy: 'day', xt: 'all', viewer: 0, sel: [], tagPlace: 'Taberna da Rua das Flores', pub: [] },
  plan: { day: 'oct17', items: JSON.parse(JSON.stringify(DAY_PLAN)), xt: 'all', addPart: 'afternoon', addTab: 'Explore' },
  expense: { assign: { clams: LINES_ALL, polvo: ['mara', 'joao'], bac: LINES_ALL, pao: LINES_ALL, wine: LINES_ALL, agua: LINES_ALL, nata: LINES_ALL }, mode: 'item', open: 'wine', shares: {}, excluded: [], tip: 10, saved: false },
  guest: { banner: true },
  notif: { done: [], prefs: { polls: true, votes: false, photos: true, money: true, reminders: true, quiet: true } },
  settings: { appearance: 'system', reduceMotion: false, albumDefault: 'crew', publicName: 'initial', method: 'Apple Pay' },
  poll: { day: 'oct17', time: '8:30 PM', closes: '7:30 PM', today: 'oct17', category: 'food', what: '', title: '', options: [], draft: '', sent: false, seeded: false },
});
export type FlowAction =
  | { t: 'go'; route: string; replace?: boolean } | { t: 'back' } | { t: 'toast'; msg: string }
  | { t: 'patch'; k: keyof FlowState; v: any } | { t: 'set'; v: Partial<FlowState> } | { t: 'reset' } | { t: 'load'; s: FlowState };
/** Screens cut in the scope pass. Old deep links and in-app buttons land on the nearest kept screen. */
export const REDIRECT: Record<string, string> = {
  'create/cover': 'create/crew', 'create/budget': 'create/crew', 'create/review': 'create/done',
  'place/park/add': 'place/park', 'place/taberna/add': 'place/taberna', 'polls': 'poll/new/sent', 'plan/edit': 'plan/day',
  'expense/items': 'expense/assign', 'expense/split': 'expense/done', 'expense/tip': 'expense/done', 'expense/review': 'expense/done',
  'album/upload': 'album', 'album/tag': 'album', 'guest/install': 'guest/welcome',
  'activity/lock': 'activity', 'activity/settings': 'activity', 'recap/places': 'recap',
  'profile/payments': 'profile', 'profile/appearance': 'profile', 'profile/privacy': 'profile',
  'expense/failed': 'expense/scan', 'poll/novotes': 'poll/new/sent', 'explore/offline': 'explore',
};
export const resolveRoute = (r: string) => REDIRECT[r] ?? r;

export function flowReducer(s: FlowState, a: FlowAction): FlowState {
  if (a.t === 'go') a = { ...a, route: resolveRoute(a.route) };
  switch (a.t) {
    case 'go': return a.route === s.route ? s : { ...s, route: a.route, history: a.replace ? s.history : [...s.history.slice(-30), s.route] };
    case 'back': { const h = [...s.history]; const r = h.pop(); return r ? { ...s, route: r, history: h } : s; }
    case 'toast': return { ...s, toast: { msg: a.msg, id: Date.now() } };
    case 'patch': return { ...s, [a.k]: { ...(s[a.k] as any), ...a.v } };
    case 'set': return { ...s, ...a.v };
    case 'reset': return { ...flowInitial(), route: s.route };
    case 'load': return a.s;
  }
}

/** Deep-link presets: each route lands with the state that makes it meaningful. */
export function presetFor(route: string, base: FlowState = flowInitial()): FlowState {
  route = resolveRoute(route);
  let s: FlowState = { ...base, route, history: [] };
  const P = (k: keyof FlowState, v: any) => { s = { ...s, [k]: { ...(s[k] as any), ...v } }; };
  const porto = DESTINATIONS[0];
  const filled = { q: 'Port', dest: 'porto', start: { y: 2027, m: 1, d: 12 }, end: { y: 2027, m: 1, d: 15 }, cover: porto.photos[0], budget: 600, crew: ['mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'], name: 'Porto, wine weekend' };
  if (route === 'create/where') P('create', { q: 'Port' });
  if (route === 'create/when') P('create', { q: 'Port', dest: 'porto', name: 'Porto, wine weekend', cover: porto.photos[0] });
  if (route === 'create/cover') P('create', { ...filled, budget: undefined, crew: [] });
  if (route === 'create/budget') P('create', { ...filled, budget: undefined, crew: [] });
  if (route === 'create/crew') P('create', { ...filled, crew: [] });
  if (route === 'create/review') P('create', filled);
  if (route === 'create/done') P('create', { ...filled, created: true });
  if (route === 'explore/curate') s = { ...s, curate: {} };
  if (route === 'explore/addpoll') s = { ...s, sheetPlace: 'park' };
  if (route.startsWith('place/') && route.endsWith('/add')) P('place', { picked: [ALBUM[0].src, ALBUM[1].src], rating: 5, text: 'Got there at 6:40 PM and sat by 7:10 PM. The tuna tataki and the bacalhau were the table favorites.' });
  if (route === 'album/viewer') P('album', { viewer: 1 });
  if (route === 'album/tag') P('album', { sel: ['c1', 'c2', 'c3'], pub: ['c1'] });
  if (route === 'plan/edit') P('plan', { editId: 'p6' });
  if (route === 'plan/day') P('plan', { landed: 'p5' });
  if (['expense/split', 'expense/tip', 'expense/review', 'expense/done'].includes(route)) P('expense', { assign: { ...s.expense.assign, wine: ['ari', 'mara', 'joao', 'sofia', 'tomas'] }, saved: route === 'expense/done' });
  if (route === 'guest/voted' || route === 'guest/install' || route === 'guest/welcome') P('guest', { voted: 0 });
  if (route === 'activity/lock') P('notif', { expanded: 'vote' });
  if (route === 'poll/new') P('poll', { day: 'oct13', time: '6:00 AM', closes: '10:00 PM', today: 'oct12', category: 'active', what: 'Scuba diving', title: '', options: [{ label: 'Dive Point Sesimbra', from: '2 dives · $95 each · 50 min drive', photo: './photos/px_3113225.jpg' }, { label: 'Arrábida coast dive', from: '1 dive · $70 each · 45 min drive', photo: './photos/px_29693824.jpg' }, { label: 'Sleep in, meet at 11:00 AM', from: 'Typed by you' }], draft: '', seeded: true });
  if (route === 'poll/new/dinner') P('poll', { day: 'oct17', time: '8:30 PM', closes: '7:30 PM', today: 'oct17', category: 'food', what: '', title: '', options: [{ label: 'Taberna da Rua das Flores', from: 'Petiscos · $$ · 6 min walk', photo: './photos/px_34110274.jpg' }, { label: 'Cervejaria Ramiro', from: 'Seafood · $$$ · 14 min walk', photo: './photos/px_6314564.jpg' }, { label: 'Park Rooftop', from: 'Rooftop bar · $$ · 9 min walk', photo: './photos/px_33659321.jpg' }], draft: '', seeded: true });
  if (route === 'poll/new/sent') P('poll', { day: 'oct13', time: '6:00 AM', closes: '10:00 PM', today: 'oct12', category: 'active', what: 'Scuba diving', title: '', options: [{ label: 'Dive Point Sesimbra' }, { label: 'Arrábida coast dive' }], sent: true, seeded: true });
  return s;
}

/* ---------- Host (prototype or Storybook) ---------- */
export type FlowHost = { exit: (step?: string) => void; me?: string; theme?: 'light' | 'dark'; setAppearance?: (a: 'light' | 'dark' | 'system') => void; setReduceMotion?: (v: boolean) => void; embedded?: boolean };
type Ctx = { s: FlowState; d: React.Dispatch<FlowAction>; host: FlowHost; P: Record<string, Person>; go: (r: string, replace?: boolean) => void; back: () => void; toast: (m: string) => void; nm: (id: string) => string };
const C = createContext<Ctx>(null as any);
export const useFlow = () => useContext(C);
export const useFlowMaybe = () => useContext(C) as Ctx | null;
export function FlowProvider({ s, d, host, children }: { s: FlowState; d: React.Dispatch<FlowAction>; host: FlowHost; children: React.ReactNode }) {
  const P = useMemo(() => { const o: Record<string, Person> = {}; Object.values(people).forEach(p => (o[p.id] = { ...p, you: p.id === 'ari' })); return o; }, []);
  const v: Ctx = { s, d, host, P, go: (r, replace) => d({ t: 'go', route: r, replace }), back: () => (s.history.length ? d({ t: 'back' }) : host.exit()), toast: m => d({ t: 'toast', msg: m }), nm: id => (id === 'ari' ? 'You' : P[id].name) };
  return <C.Provider value={v}>{children}</C.Provider>;
}
/** Self-contained store for Storybook: the flow runs on its own, starting at any route. */
export function useFlowStore(start: string) { return useReducer(flowReducer, start, r => presetFor(r)); }

/* ---------- Shared chrome ---------- */
/** v5.4 two nav levels. Trip level (inside a trip): Plan, Explore, Photos, Money. You leave the trip with Back to Trips. */
export const TABS_TRIP = [
  { id: 'plan', label: 'Plan', icon: 'calendar' as const }, { id: 'explore', label: 'Explore', icon: 'compass' as const },
  { id: 'photos', label: 'Photos', icon: 'images' as const }, { id: 'money', label: 'Money', icon: 'wallet' as const },
];
/** Home level (no trip open): Trips, Explore (ideas for the next trip), You. */
export const TABS_HOME = [
  { id: 'trips', label: 'Trips', icon: 'home' as const }, { id: 'discover', label: 'Explore', icon: 'compass' as const }, { id: 'you', label: 'You', icon: 'person' as const },
];
export const TABS = TABS_TRIP;
export type NavLevel = 'home' | 'trip';
let lastLevel: NavLevel | null = null;
/** Where each item in the global create menu lands. */
export const CREATE_ROUTES: Record<CreateKind, string> = { poll: 'explore/curate', expense: 'expense/scan', photos: 'album', plan: 'plan/add', trip: 'create/where' };
/** The 5-tab bar plus the global + (create menu) that sits next to it on every tab. */
export function GlobalTabs({ active, onTab, onCreate, level = 'trip' }: { active: string; onTab: (id: string) => void; onCreate: (k: CreateKind) => void; level?: NavLevel }) {
  const [open, setOpen] = useState(false);
  // Crossfade the bar when the level changes (pushing into a trip, or Back to Trips); the lens starts fresh.
  const [swap] = useState(() => { const x = lastLevel !== null && lastLevel !== level; if (x) tabMemory.i = -1; lastLevel = level; return x; });
  return <div className={`p-tabset is-${level} ${swap ? 'is-swap' : ''}`}>
    <TabBar active={active} accessory="plus" accessoryLabel="Create" accessoryExpanded={open} onAccessory={() => setOpen(o => !o)} tabs={level === 'home' ? TABS_HOME : TABS_TRIP} onChange={onTab} />
    {open && <CreateMenu first={level === 'home' ? 'trip' : undefined} onClose={() => setOpen(false)} onPick={k => { setOpen(false); onCreate(k); }} />}
  </div>;
}
export function FlowTabs({ active, level = 'trip' }: { active: string; level?: NavLevel }) {
  const { go, host } = useFlow();
  return <GlobalTabs level={level} active={active} onCreate={k => go(CREATE_ROUTES[k])} onTab={id => {
    if (id === 'explore') go('explore'); else if (id === 'photos') go('album'); else if (id === 'discover') go('discover'); else if (id === 'you') go('profile');
    else host.exit(id === 'trips' ? 'home' : id === 'plan' ? 'trip' : 'money');
  }} />;
}
export function Top({ title, sub, right, onBack, back = true, light }: { title?: string; sub?: string; right?: React.ReactNode; onBack?: () => void; back?: boolean; light?: boolean }) {
  const f = useFlow();
  return (
    <div className={`b-top ${light ? 'is-light' : ''}`}>
      {back ? <button type="button" className="b-top-btn" onClick={onBack ?? f.back} aria-label="Back"><BIcon name="chevronLeft" size={20} /></button> : <span className="b-top-sp" />}
      <div className="b-top-title">{title && <b>{title}</b>}{sub && <small>{sub}</small>}</div>
      <div className="b-top-right">{right ?? <span className="b-top-sp" />}</div>
    </div>
  );
}
export function TopBtn({ icon, label, onClick, accent }: { icon: React.ComponentProps<typeof BIcon>['name']; label: string; onClick?: () => void; accent?: boolean }) {
  return <button type="button" className={`b-top-btn ${accent ? 'is-accent' : ''}`} onClick={onClick} aria-label={label}><BIcon name={icon} size={20} /></button>;
}
export function Sheet({ title, onClose, children, size = 'large', footer }: { title: string; onClose: () => void; children: React.ReactNode; size?: 'large' | 'medium'; footer?: React.ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, []);
  return (
    <div className="b-sheet-layer">
      <div className="b-scrim" onClick={onClose} />
      <div className={`b-sheet is-${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <span className="b-sheet-grab" aria-hidden />
        <div className="b-sheet-bar"><button type="button" className="b-top-btn" onClick={onClose} aria-label="Close"><BIcon name="close" size={20} /></button><b>{title}</b><span className="b-top-sp" /></div>
        <div className="b-sheet-body">{children}</div>
        {footer && <div className="b-sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}
export function FlowToast() {
  const { s, d } = useFlow();
  useEffect(() => { if (!s.toast) return; const t = setTimeout(() => d({ t: 'set', v: { toast: undefined } }), 2400); return () => clearTimeout(t); }, [s.toast?.id]);
  if (!s.toast) return null;
  return <div className="b-toast" role="status" key={s.toast.id}><BIcon name="check" size={20} /><span>{s.toast.msg}</span></div>;
}
export const crewPeople = (P: Record<string, Person>, ids = CREW) => ids.map(id => P[id]);
