import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSwipeDismiss } from './swipedismiss';
import { QRCodeSVG } from 'qrcode.react';
import { PrismRoot } from '@sb/lib/PrismRoot';
import { Icon } from '@sb/components/Icon';
import { AppProvider, useApp, useStore, STEPS, stepIndex, stateAt, CHECKS, StepId, Me, State, Action, STREAM, clockStr, statusTime, simplifyOf, initial, SETTLE_VIEWS, SettleView, isSettleView, settlePreset } from './store';
import { MoneyScreen, SettleFlow } from './settleflow';
import { Home, Trip, InviteSheet, Explore } from './screens1';
import { Create, Push, PollView, Closed, Plan, usePollStream } from './screens2';
import { Expense, Squared } from './screens3';
import { RenWeb } from './renweb';
import { useBeyond, BeyondLayer, BeyondPanel, BeyondBridge } from './flows';
import { isBeyondHash, routeFromHash, hashForRoute } from './flows/nav';
import { FLOWS, ALL_ROUTES, baseOf } from '@sb/patterns/beyond/router';
import { TourCursor, cursor } from './flows/cursor';
import { coreTarget } from './flows/tour';
import { PACE } from './flows/pacing';
import { navClass } from '@sb/lib/motion';
import { useNavGhost } from '@sb/lib/navghost';
import { ModeChooser, ModeSwitch, initialMode, showChooserAtStart, trackMode, useChapter, Mode } from './flows/shell';
import { track } from './analytics';

const params = new URLSearchParams(location.search);
const EMBED = params.has('embed');
/** The deck sits one level up. Opened from the deck (?from=deck&slide=7), Back returns to that slide. */
const DECK_SLIDE = (() => {
  const n = parseInt(params.get('slide') ?? '', 10);
  if (params.get('from') === 'deck') return n >= 1 && n <= 10 ? n : 0;
  try { const r = new URL(document.referrer); if (r.origin === location.origin && !/\/(prototype|case-study|storybook)\//.test(r.pathname)) return parseInt(r.hash.slice(1), 10) || 0; } catch {}
  return 0;
})();
/** Relative when served next to the deck; the single-file build points at the live deck instead. */
const DECK_HREF = (location.pathname.includes('/prototype/') ? '../' : 'https://sirryanlynch.github.io/bs/') + (DECK_SLIDE ? `#${DECK_SLIDE}` : '');
const BackToDeck = ({ cls = '' }: { cls?: string }) => EMBED ? null : <a className={`fl-back ${cls}`} href={DECK_HREF}><Icon name="chevronLeft" size={16} />Back to deck</a>;
const isPhone = () => window.matchMedia('(max-width: 700px)').matches;

function parseHash(): { step?: StepId; view?: SettleView; me?: Me; tie?: boolean; open?: string } {
  const [p, q] = location.hash.replace(/^#\/?/, '').split('?');
  const [seg, sub] = (p ?? '').split('/');
  const sp = new URLSearchParams(q ?? '');
  const step = STEPS.find(x => x.id === seg)?.id;
  const me = (['ari', 'nic', 'ren'].includes(sp.get('as') ?? '') ? sp.get('as') : undefined) as Me | undefined;
  const view = step === 'settle' ? (isSettleView(sub) ? sub : me === 'nic' ? 'confirm' : 'choose') : undefined;
  return { step, view, me, tie: sp.get('tie') === '1', open: sp.get('open') ?? undefined };
}
const hashOf = (s: State) => {
  const q = [s.me !== 'ari' ? `as=${s.me}` : '', s.tiePath ? 'tie=1' : ''].filter(Boolean).join('&');
  return `#/${s.step}${s.step === 'settle' ? `/${s.settleView}` : ''}${q ? `?${q}` : ''}`;
};

function PhoneScreen({ s }: { s: State }) {
  usePollStream();
  const { d } = useApp();
  const plan = simplifyOf(s);
  const allPaid = s.dinnerSaved && plan.length > 0 && plan.every(e => s.paid[`${e.from}>${e.to}`] && s.paid[`${e.from}>${e.to}`] !== 'pending');
  useEffect(() => { if (allPaid && (s.step === 'money' || s.step === 'settle')) { const t = setTimeout(() => d({ t: 'go', step: 'squared' }), 1100); return () => clearTimeout(t); } }, [allPaid, s.step]);
  if (s.me === 'ren' && s.step !== 'push') return <RenWeb />;
  switch (s.step) {
    case 'home': return <Home />;
    case 'trip': return <Trip />;
    case 'invite': return <><Trip /><InviteSheet /></>;
    case 'explore': return <Explore />;
    case 'create': return <Create />;
    case 'push': return <Push />;
    case 'live': return <PollView />;
    case 'closed': return <Closed />;
    case 'plan': return <Plan />;
    case 'expense': return <Expense />;
    case 'money': return <MoneyScreen />;
    case 'settle': return <SettleFlow />;
    case 'squared': return <Squared />;
  }
}

/** Tour scripts: each step plays its own interactions, then moves on. Times are in ms from step start. */
function tourScript(s: State): [number, Action | Action[] | 'next'][] {
  const canon: [number, Action | Action[] | 'next'][] = [];
  switch (s.step) {
    case 'home': return [[2600, 'next']];
    case 'trip': return [[2800, s.me === 'ren' ? { t: 'join', via: 'qr' } : { t: 'go', step: 'invite' }], ...(s.me === 'ren' ? [[2400, 'next']] as any : [])];
    case 'invite': return [[1800, { t: 'join', via: 'qr' }], [2200, 'next']];
    case 'explore': if (s.exploreStage === 0 && s.exploreFeed !== false) return [[1500, { t: '__scroll', dy: 420 } as any], [2000, { t: '__scroll', dy: -420 } as any], [1500, { t: 'set', patch: { exploreFeed: false } }]];
      return [[1300, { t: 'set', patch: { exploreStage: 1 } }], [1300, { t: 'set', patch: { exploreStage: 2 } }], [1300, { t: 'set', patch: { exploreStage: 3 } }], [1300, { t: 'set', patch: { exploreStage: 4 } }], [1400, { t: 'set', patch: { shortlist: ['taberna', 'ramiro', 'park'] } }], [1600, 'next']];
    case 'create': return [[2600, [{ t: 'set', patch: { pollSent: true } }, { t: 'done', key: 'create' }, { t: 'vote', who: 'ari', opt: 1 }, { t: 'go', step: 'push' }]]];
    case 'push': return [[2200, [{ t: 'vote', who: 'nic', opt: 0, via: 'the push' }, { t: 'done', key: 'push' }]], [1400, 'next']];
    // v5.3: in the tour, Ari's poll goes out and the phone turns into Ren's: the link arrives in Messages, Ren votes on the web, then back to Ari.
    case 'live': return s.me === 'ren' ? (s.votes.ren != null ? [[1800, { t: 'set', patch: { me: 'ari', renStage: undefined } }]] : [[2400, { t: 'set', patch: { renStage: 'web' } }], [2200, { t: 'vote', who: 'ren', opt: s.tiePath ? 1 : 0, via: 'the web as a guest' }], [2600, { t: 'set', patch: { renStage: 'back' } }], [2600, { t: 'set', patch: { me: 'ari', renStage: undefined } }]])
      : s.me === 'ari' ? (s.votes.ren == null ? [[1400, { t: 'vote', who: 'ari', opt: 1 }], [1800, { t: 'set', patch: { me: 'ren' } }]] : []) : [];
    case 'closed': return s.tie && s.winner == null ? [[2600, { t: 'pick', opt: 0 }]] : [[3000, [{ t: 'set', patch: { planAdded: true } }, { t: 'go', step: 'plan' }, { t: 'toast', msg: 'Taberna added to tonight', tone: 'success' }]]];
    case 'plan': return [[3200, 'next']];
    case 'expense': if (!s.receiptOk) return [[3200, { t: 'set', patch: { receiptOk: true } }]];
      return [[1600, { t: 'set', patch: { splitMode: 'item' } }], [1300, { t: 'set', patch: { splitOpen: 'wine' } }], [1100, { t: 'toggleLine', line: 'wine', who: 'ren' }], [800, { t: 'toggleLine', line: 'wine', who: 'nic' }], [2200, { t: 'saveDinner' }], [700, 'next']];
    case 'money': return [[1400, { t: 'set', patch: { simplified: true } }], [4600, { t: 'done', key: 'simplify' }], [2000, 'next']];
    case 'settle': {
      const v = s.settleView;
      if (v === 'choose') return [[1800, { t: 'view', v: 'cash' }]];
      if (v === 'cash') return [[2600, { t: 'mark' }]];
      if (v === 'pending') return [[3000, [{ t: 'set', patch: { undoAt: undefined, me: 'nic' } }, { t: 'view', v: 'confirm' }]]];
      if (v === 'confirm') return [[2800, { t: 'confirm' }]];
      if (v === 'confirmed') { const plan = simplifyOf(s); const seq: [number, Action | Action[] | 'next'][] = []; plan.filter(e => !s.paid[`${e.from}>${e.to}`]).forEach((e, i) => seq.push([i === 0 ? 2600 : 1100, { t: 'pay', key: `${e.from}>${e.to}`, how: e.from === 'mara' ? 'cash' : 'app' }])); return seq; }
      return [[2400, { t: 'view', v: 'choose' }]];
    }
    case 'squared': return s.recap ? [[2400, { t: 'set', patch: { shared: true } }], [3000, 'next']] : [[3400, { t: 'set', patch: { recap: true } }]];
  }
  return canon;
}

export function App() {
  const [s, d] = useStore();
  const [tour, setTour] = useState(EMBED || params.get('mode') === 'tour');
  const [theme, setTheme] = useState<'light' | 'dark'>(params.get('theme') === 'dark' ? 'dark' : 'light');
  const [motion, setMotion] = useState<'full' | 'reduce'>(matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'full');
  const [phone, setPhone] = useState(isPhone());
  const [panelOpen, setPanelOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  // Shell modes: self guided (panel tucked away) or guided tour (cursor taps through, then the Full JTBD analysis chapter).
  const [mode, setMode] = useState<Mode | null>(initialMode);
  const [chooser, setChooser] = useState(() => !EMBED && showChooserAtStart());
  const [drawer, setDrawer] = useState(false);
  const [chapter, setChapter] = useState(false);
  const [caption, setCaption] = useState('');
  const bz = useBeyond({ coreHash: () => hashOf(sRef.current), setTheme, setMotion, theme });
  useEffect(() => { if (tour && bz.active && !EMBED) setChapter(true); }, [tour, bz.active]);
  useChapter({ on: tour && chapter && !EMBED, reduce: motion === 'reduce', onCaption: setCaption, onEnd: () => { track('guided_tour_complete', { embed: EMBED }); setChapter(false); setCaption(''); d({ t: 'reset' }); location.hash = '#/home'; } });
  const pickMode = (m: Mode, fresh = false) => { setMode(m); trackMode(m); setChooser(false); setDrawer(false); if (m === 'tour') { if (fresh) { d({ t: 'reset' }); if (location.hash !== '#/home') location.hash = '#/home'; } setTour(true); } else setTour(false); };
  useEffect(() => {
    if (!settingsOpen) return;
    const down = (e: Event) => { const t = e.target as HTMLElement; if (!t.closest('.pt-pop, .pt-gear')) setSettingsOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setSettingsOpen(false); };
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [settingsOpen]);
  const meta = STEPS[stepIndex(s.step)];
  const idx = stepIndex(s.step);
  const sRef = useRef(s); sRef.current = s;

  const asMe = (me: Me) => { const c = sRef.current; if (me !== c.me) track('play_as', { play_as: me, from: c.me }); if (c.step === 'settle' && me !== 'ren') { d({ t: 'load', s: settlePreset(me === 'nic' ? 'confirm' : c.settleView === 'confirm' ? 'pending' : c.settleView, { ...stateAt('settle', { ...c, me: 'ari' }), me: 'ari' }) }); return; } d({ t: 'load', s: { ...stateAt(c.step, { ...c, me }), me } }); };
  const jump = (id: StepId, over: Partial<State> = {}, view?: SettleView) => {
    const base = { ...stateAt(id, { ...sRef.current, ...over } as State), ...over } as State;
    d({ t: 'load', s: id === 'settle' ? settlePreset(view ?? 'choose', base) : base });
  };
  // One story: Part 1 (the 13 Lisbon steps), then Part 2 (Full JTBD analysis, flow by flow). Next and Back walk straight through both.
  const beyondIdx = () => { const r = routeFromHash(); return r == null ? -1 : Math.max(0, ALL_ROUTES.findIndex(x => x.route === r)); };
  const next = () => { const bi = beyondIdx(); if (bi >= 0) { if (bi < ALL_ROUTES.length - 1) location.hash = hashForRoute(ALL_ROUTES[bi + 1].route); return; } if (idx === STEPS.length - 1 && !tour) { location.hash = hashForRoute(ALL_ROUTES[0].route); return; } nextCore(); };
  const nextCore = () => { const n = STEPS[idx + 1]; if (n) { const cur = sRef.current; if (!tour) track('step_jump', { from: cur.step, to: n.id, method: 'next' }); let x = STEPS[idx].complete(cur); if (n.id === 'squared') x = { ...x, me: 'ari' }; d({ t: 'load', s: { ...x, step: n.id, settleView: n.id === 'settle' ? 'choose' : x.settleView, settleOpen: false, done: { ...x.done, [n.id]: true } } }); } else if (EMBED) d({ t: 'reset' }); else if (tour) setChapter(true); };
  const prev = () => { const bi = beyondIdx(); if (bi > 0) { location.hash = hashForRoute(ALL_ROUTES[bi - 1].route); return; } if (bi === 0) { location.hash = `#/${STEPS[STEPS.length - 1].id}`; return; } const p = STEPS[idx - 1]; if (p) { if (!tour) track('step_jump', { from: sRef.current.step, to: p.id, method: 'prev' }); jump(p.id); } };

  // Deep links: #/step?as=nic&tie=1
  useEffect(() => {
    let first = true;
    const apply = () => {
      const h = parseHash(); const c = sRef.current;
      // v5.4.2: #/live?open=trip starts one screen earlier, on Trip home with the open-poll card highlighted.
      if (h.step === 'live' && h.open === 'trip') {
        if (!first && c.step !== 'trip') track('step_jump', { from: c.step, to: 'trip', method: 'list' });
        d({ t: 'load', s: { ...stateAt('live', { ...c, me: 'ari' } as State), me: 'ari', step: 'trip', cue: true } as State });
        first = false;
        return;
      }
      if (h.step && (h.step !== c.step || (h.me ?? 'ari') !== c.me || (h.view && h.view !== c.settleView))) {
        if (!first && h.step !== c.step) track('step_jump', { from: c.step, to: h.step, method: 'list' });
        jump(h.step, { me: h.view ? 'ari' : h.me ?? 'ari', tiePath: h.tie }, h.view);
      }
      first = false;
    };
    apply(); window.addEventListener('hashchange', apply); return () => window.removeEventListener('hashchange', apply);
  }, []);
  const deepLink = useRef(parseHash().open === 'trip' ? 'trip' as StepId : parseHash().step);
  useEffect(() => {
    if (bz.active) {
      const hash = hashForRoute(bz.route);
      track('page_view', {
        page_location: `${location.origin}${location.pathname}${location.search}${hash}`,
        page_path: `${location.pathname}${hash}`,
        page_title: bz.meta.label,
        step: bz.route,
        play_as: s.me,
        embed: EMBED,
      });
      return;
    }
    if (deepLink.current && s.step !== deepLink.current) return;
    deepLink.current = undefined;
    const hash = s.step === 'settle' ? `#/settle/${s.settleView}` : `#/${s.step}`;
    track('page_view', {
      page_location: `${location.origin}${location.pathname}${location.search}${hash}`,
      page_path: `${location.pathname}${hash}`,
      page_title: meta.title,
      step: s.step === 'settle' ? `settle/${s.settleView}` : s.step,
      play_as: s.me,
      embed: EMBED,
    });
  }, [s.step, s.settleView, bz.active, bz.route]);
  const tourSeen = useRef(false);
  useEffect(() => {
    if (tour && !tourSeen.current) track('guided_tour_start', { step: sRef.current.step, embed: EMBED });
    tourSeen.current = tour;
  }, [tour]);
  const themeSeen = useRef(false);
  useEffect(() => {
    if (!themeSeen.current) { themeSeen.current = true; return; }
    track('theme_toggle', { theme, surface: 'prototype' });
  }, [theme]);
  const motionSeen = useRef(false);
  useEffect(() => {
    if (!motionSeen.current) { motionSeen.current = true; return; }
    track('reduce_motion_toggle', { motion, surface: 'prototype' });
  }, [motion]);
  useEffect(() => {
    if (EMBED || isBeyondHash()) return;
    const h = hashOf(s);
    if (location.hash !== h) history.replaceState(null, '', h);
  }, [s.step, s.me, s.tiePath, s.settleView]);
  useEffect(() => { const m = matchMedia('(max-width: 700px)'); const f = () => setPhone(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);

  // Toast auto dismiss
  useEffect(() => { if (!s.toast) return; const t = setTimeout(() => d({ t: 'set', patch: { toast: undefined } }), 2600); return () => clearTimeout(t); }, [s.toast?.id]);

  // Guided tour
  const tourKey = `${s.step}|${s.tie && s.winner == null}|${s.recap}|${s.me}|${s.settleView}`;
  useEffect(() => {
    if (!tour || chapter || bz.active) return;
    // In the deck the last slide holds on the All squared up moment instead of looping.
    if (EMBED && (s.step === 'squared' || /[?&]hold=1/.test(location.hash))) return;
    const script = tourScript(s);
    const timers: number[] = []; let at = 0;
    const rm = motion === 'reduce'; const P = rm ? PACE.reduce : PACE;
    script.forEach(([ms, a]) => { at += ms * (rm ? PACE.reduce.coreScale : PACE.coreScale);
      // Glide to the control, hover, press, hold, then the action lands (pacing lives in flows/pacing.ts).
      const tg = EMBED ? null : coreTarget(s.step, a, s); let el: Element | null = null;
      if (tg) timers.push(window.setTimeout(() => { cursor.moveTo(tg).then(x => { el = x; }); }, Math.max(0, at - PACE.coreLead)));
      if (tg) timers.push(window.setTimeout(() => { if (el) cursor.tap(el, false); }, Math.max(0, at - P.press - P.hold)));
      timers.push(window.setTimeout(() => {
        if (a === 'next') next(); else if ((a as any).t === '__scroll') { if (!EMBED) cursor.drag((a as any).dy); } else (Array.isArray(a) ? a : [a]).forEach(x => d(x));
      }, at)); });
    return () => timers.forEach(clearTimeout);
  }, [tour, tourKey, chapter, bz.active]);

  // v5.4.2: any deck autoplay stops the moment someone taps into the embed; they drive from there.
  const [took, setTook] = useState(false); const tookRef = useRef(false); tookRef.current = took;
  useEffect(() => { if (!EMBED) return; const on = (e: Event) => { if ((e as any).isTrusted) { setTook(true); setTour(false); } };
    document.addEventListener('pointerdown', on, true); document.addEventListener('keydown', on, true);
    const re = () => { if (/hold=1/.test(location.hash)) { setTook(false); setTour(true); } }; window.addEventListener('hashchange', re);
    return () => { document.removeEventListener('pointerdown', on, true); document.removeEventListener('keydown', on, true); window.removeEventListener('hashchange', re); }; }, []);
  // v5.4.2 deck slide 8, stage 3: poll closes, the winner shows, then it lands on the plan; loops.
  useEffect(() => { if (!(EMBED && !took && /flow=1/.test(location.hash))) return;
    if (s.step === 'closed' && !s.planAdded) { const t = window.setTimeout(() => { d({ t: 'set', patch: { planAdded: true } }); d({ t: 'go', step: 'plan' }); }, 3600); return () => clearTimeout(t); }
    if (s.step === 'plan') { const t = window.setTimeout(() => d({ t: 'load', s: { ...stateAt('closed', { ...sRef.current, me: 'ari' } as State), me: 'ari', step: 'closed', planAdded: false } as State }), 5200); return () => clearTimeout(t); }
  }, [s.step, s.planAdded, took]);
  // v5.4.2 deck slide 8, stage 2: Trip home with the open-poll card highlighted, then the tap into the vote.
  useEffect(() => { if (took || !(s.cue && s.step === 'trip' && s.pollSent)) return; const t = window.setTimeout(() => { d({ t: 'set', patch: { cue: false } }); d({ t: 'go', step: 'live' }); }, motion === 'reduce' ? 3200 : 2800); return () => clearTimeout(t); }, [s.cue, s.step, took]);
  useEffect(() => { if (took || !(EMBED && s.step === 'live' && !s.cue && /open=trip/.test(location.hash))) return;
    const t = window.setTimeout(() => d({ t: 'load', s: { ...stateAt('live', { ...sRef.current, me: 'ari' } as State), me: 'ari', step: 'trip', cue: true } as State }), 6500); return () => clearTimeout(t); }, [s.step, s.cue, took]);
  // v5.4.2 deck slide 8, stage 1: Find a place plays itself (questions, picks, Start a poll, Send, Poll sent), then loops.
  useEffect(() => {
    if (!EMBED) return;
    const FLOW = ['#/beyond/explore/curate', '#/poll/new', '#/poll/new/sent'];
    const STEPS_: [number, string][] = [[2400, '.b-fp-photo'], [1600, '.b-fp-glass >> 1'], [1600, '.b-fp-photo'], [1600, '.b-fp-glass >> 1'], [2200, '.b-fp-add'], [900, '.b-fp-add >> 2'],
      [1300, '.b-cmp-cta'], [2600, '.b-cmp-cta'], [4200, '__loop']];
    let timers: number[] = [];
    const run = () => { timers.forEach(clearTimeout); timers = []; if (location.hash.split('?')[0] !== FLOW[0]) return; let at = 0;
      STEPS_.forEach(([ms, sel]) => { at += motion === 'reduce' ? ms * 1.2 : ms; timers.push(window.setTimeout(() => {
        if (tookRef.current || !FLOW.some(h => location.hash.split('?')[0] === h)) return;
        if (sel === '__loop') { const q = location.hash.includes('hold=1') ? '?hold=1' : ''; location.hash = '#/beyond/explore' + q; window.setTimeout(() => { location.hash = FLOW[0] + q; }, 60); return; }
        const [q, n] = sel.split(' >> '); const el = document.querySelectorAll<HTMLElement>(`.pt-screen-inner ${q}, .phone-screen ${q}`)[+(n ?? 0)] ?? document.querySelectorAll<HTMLElement>(q)[+(n ?? 0)];
        if (el) embedTap(el, () => !tookRef.current); }, at)); }); };
    run(); const on = () => { if (location.hash.split('?')[0] === FLOW[0]) window.setTimeout(run, 50); else if (!FLOW.includes(location.hash.split('?')[0])) { timers.forEach(clearTimeout); timers = []; } };
    window.addEventListener('hashchange', on); return () => { window.removeEventListener('hashchange', on); timers.forEach(clearTimeout); };
  }, [motion]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowright' || k === 'n') next();
      else if (k === 'arrowleft' || k === 'p') prev();
      else if (k === ' ') { e.preventDefault(); setTour(t => !t); }
      else if (k === 'd') setTheme(t => (t === 'dark' ? 'light' : 'dark'));
      else if (k === 'm') setMotion(m => (m === 'reduce' ? 'full' : 'reduce'));
      else if (k === 'r') { setTour(false); d({ t: 'reset' }); }
      else if (k === '?') setHelp(h => !h);
      else if (k === '1' || k === '2' || k === '3') asMe((['ari', 'nic', 'ren'] as Me[])[+k - 1]);
      else return;
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });

  // v5.3.1: in-flow screens dismiss with a swipe down (same destination as Back)
  const swipeRoot = useRef<HTMLDivElement>(null);
  useSwipeDismiss(swipeRoot, motion === 'reduce');

  // Touch ripple so taps read on desktop, and a little press feedback everywhere
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const onDown = (e: React.PointerEvent) => {
    if (tour && !EMBED && e.isTrusted) { setTour(false); cursor.hide(); }
    if (motion === 'reduce') return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples(x => [...x.slice(-3), { x: e.clientX - r.left, y: e.clientY - r.top, id }]);
    setTimeout(() => setRipples(x => x.filter(y => y.id !== id)), 600);
  };

  const time = bz.active ? bz.meta.time : s.step === 'live' ? clockStr(Math.max(17, Math.min(29, 17 + Object.keys(s.votes).length))) : s.step === 'settle' ? SETTLE_VIEWS.find(v => v.id === s.settleView)!.time : s.step === 'money' && (s.stl || Object.keys(s.paid).length) ? '10:40 PM' : meta.time;
  const dark = theme === 'dark';
  const statusLight = bz.active ? !!bz.meta.light : s.step === 'push' || (s.step === 'trip' && s.me !== 'ren') || s.step === 'invite' && false;

  const coreId = `${s.step === 'settle' && s.settleView === 'confirmed' ? 'money' : s.step}-${s.me}-${s.recap}-${s.step === 'settle' ? s.settleView : ''}`;
  const coreCls = bz.active ? '' : navClass(coreId.replace(/-ari-false-$/, ''));
  // v5.5 navjank: one ghost for both layers, so crossing core <> beyond (Plan/Money <> Explore/Photos) crossfades instead of blanking.
  const beyondCls = bz.active ? navClass('b:' + baseOf(bz.route)) : '';
  const coreGhost = useNavGhost(bz.active ? 'beyond' : coreId, bz.active ? beyondCls : coreCls);
  const screen = (
    <div className="pt-screen-inner" onPointerDown={onDown} ref={swipeRoot}>
      {bz.active ? <div className="pt-anim mo-none" key="beyond" ref={coreGhost}><BeyondLayer bz={bz} /></div>
        : <div className={`pt-anim ${coreCls}`} key={coreId} ref={coreGhost}><PhoneScreen s={s} /></div>}
      {s.toast && <div className={`pt-itoast ${s.toast.tone === 'success' ? 'is-success' : ''}`} key={s.toast.id} role="status"><Icon name={s.toast.tone === 'success' ? 'check' : 'info'} size={20} /><span>{s.toast.msg}</span></div>}
      {ripples.map(r => <span key={r.id} className="pt-ripple" style={{ left: r.x, top: r.y }} aria-hidden />)}
      {!EMBED && <TourCursor on={tour} reduce={motion === 'reduce'} />}
    </div>
  );

  const frame = (
    <div className={`phone ${dark ? 'phone-dark' : ''} ${statusLight ? 'status-light' : ''}`} aria-label="iPhone 17, 402 by 874 points">
      <div className="phone-btn phone-btn-action" /><div className="phone-btn phone-btn-vu" /><div className="phone-btn phone-btn-vd" /><div className="phone-btn phone-btn-power" />
      <div className="phone-screen">
        <div className="phone-content">{screen}</div>
        <div className="phone-status" aria-hidden>
          <span className="phone-time tu-num">{(bz.active ? !time : s.step === 'push') ? '' : statusTime(time)}</span><span className="phone-island" />
          <span className="phone-glyphs"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg><span className="phone-batt"><span /></span></span>
        </div>
        <div className="phone-home" aria-hidden />
      </div>
    </div>
  );

  if (EMBED) return (
    <PrismRoot theme={theme} motion={motion}><AppProvider s={s} d={d}><BeyondBridge bz={bz}><div className="pt-embed">{frame}</div></BeyondBridge></AppProvider></PrismRoot>
  );

  const shareUrl = location.href.split('#')[0].replace(/[?&]embed=1/, '') + hashOf(s);
  const stepDone = (id: StepId) => { const keys: Record<string, string[]> = { closed: ['closed'], plan: ['plan'], money: ['money', 'simplify'], settle: ['settle', 'cashround', 'nicconfirm'], squared: ['squared', 'recap'] }; return (keys[id] ?? [id]).every(k => CHECKS.find(c => c.key === k)?.test(s)); };
  const settings = (
    <div className="pt-pop" role="dialog" aria-label="Settings">
      <div className="pt-pop-row"><span>Play as</span>
        <div className="pt-seg" role="radiogroup" aria-label="Play as">
          {([['ari', 'Ari'], ['nic', 'Nic'], ['ren', 'Ren (web)']] as [Me, string][]).map(([id, l]) => (
            <button key={id} type="button" role="radio" aria-checked={s.me === id} className={s.me === id ? 'is-on' : ''} onClick={() => asMe(id)}>{l}</button>
          ))}
        </div></div>
      <label className="pt-check"><input type="checkbox" checked={s.tiePath} onChange={e => { const tie = e.target.checked; track('tie_break', { enabled: tie }); const at = stepIndex(s.step) > stepIndex('live') ? 'live' : s.step; d({ t: 'load', s: { ...stateAt(at, { ...s, tiePath: tie }), tiePath: tie } }); }} />Tie-break path</label>
      <label className="pt-check"><input type="checkbox" checked={dark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />Dark mode</label>
      <label className="pt-check"><input type="checkbox" checked={motion === 'reduce'} onChange={e => setMotion(e.target.checked ? 'reduce' : 'full')} />Reduce Motion</label>
      <details className="pt-more"><summary>Open on a phone</summary><div className="pt-qrcard"><QRCodeSVG value={shareUrl} size={96} level="M" bgColor="transparent" fgColor="currentColor" /><p>Scan to open this step full screen.</p></div></details>
      <details className="pt-more"><summary>Keyboard shortcuts</summary>
        <dl className="pt-keys"><dt>← →</dt><dd>Step</dd><dt>Space</dt><dd>Tour</dd><dt>1 2 3</dt><dd>Ari, Nic, Ren</dd><dt>D</dt><dd>Dark</dd><dt>M</dt><dd>Motion</dd><dt>R</dt><dd>Reset</dd></dl></details>
      <button type="button" className="pt-btn is-wide" onClick={() => { setTour(false); d({ t: 'reset' }); setSettingsOpen(false); }}>Reset demo</button>
    </div>
  );
  const panel = (
    <aside className="pt-panel" aria-label="Reviewer panel">
      <header className="pt-panel-head">
        <div><p className="pt-eyebrow">Reviewer</p><h1>TripUp prototype</h1></div>
        <div className="pt-panel-tools">
          <button type="button" className={`pt-iconbtn pt-gear ${settingsOpen ? 'is-on' : ''}`} onClick={() => setSettingsOpen(o => !o)} aria-expanded={settingsOpen} aria-label="Settings"><Icon name="gear" size={20} /></button>
          {(phone || drawer) && <button type="button" className="pt-iconbtn" onClick={() => { setPanelOpen(false); setDrawer(false); }} aria-label="Close panel"><Icon name="close" size={20} /></button>}
        </div>
        {settingsOpen && settings}
      </header>
      <div className="fl-panelmode"><ModeSwitch mode={mode ?? 'self'} onMode={m => pickMode(m)} /></div>
      <section className="pt-stepcard" aria-live="polite">
        <p className="pt-stepline tu-num">{bz.active ? `Part 2 · Full JTBD analysis · ${String.fromCharCode(65 + Math.max(0, FLOWS.findIndex(f => f.id === bz.meta.flow)))} of ${String.fromCharCode(64 + FLOWS.length)}` : `Part 1 · The Lisbon evening · ${+meta.n} of 13`}</p>
        <h2>{bz.active ? FLOWS.find(f => f.id === bz.meta.flow)?.title ?? 'Full JTBD analysis' : meta.title}</h2>
        <p>{tour && chapter && caption ? caption : bz.active ? bz.meta.label : meta.caption}</p>
        <div className="pt-row">
          <button type="button" className="pt-btn" onClick={prev} disabled={idx === 0 && !bz.active} aria-label="Previous step"><Icon name="chevronLeft" size={20} /></button>
          <button type="button" className={`pt-btn is-primary ${tour ? 'is-on' : ''}`} onClick={() => setTour(t => !t)}>{tour ? 'Pause tour' : 'Play guided tour'}</button>
          <button type="button" className="pt-btn" onClick={next} disabled={bz.active && bz.route === ALL_ROUTES[ALL_ROUTES.length - 1].route} aria-label="Next step"><Icon name="chevronRight" size={20} /></button>
        </div>
        {s.step === 'live' && !s.pollClosed && <button type="button" className="pt-link" onClick={() => d({ t: 'close', by: 'timer' })}>Skip to 7:30 PM</button>}
        {s.step === 'settle' && <div className="pt-actions">
          {s.stl?.status === 'pending' && s.me === 'ari' && <button type="button" className="pt-btn is-wide" onClick={() => { d({ t: 'set', patch: { me: 'nic', undoAt: undefined } }); d({ t: 'view', v: 'confirm' }); }}>Switch to Nic's phone</button>}
          {s.stl?.status === 'pending' && s.me === 'ari' && <button type="button" className="pt-link" onClick={() => d({ t: 'confirm' })}>Nic confirms (simulate)</button>}
          {s.me === 'nic' && <button type="button" className="pt-link" onClick={() => { d({ t: 'set', patch: { me: 'ari' } }); d({ t: 'view', v: s.stl ? 'pending' : 'choose' }); }}>Back to Ari's phone</button>}
          {s.offline && <button type="button" className="pt-btn is-wide" onClick={() => d({ t: 'reconnect' })}>Reconnect</button>}
          {!s.stl && (s.settleView === 'cash' || s.settleView === 'partial') && <label className="pt-check"><input type="checkbox" checked={s.offline} onChange={e => d({ t: 'set', patch: { offline: e.target.checked } })} />Simulate offline</label>}
        </div>}
      </section>
      <p className="pt-eyebrow fl-part">Part 1 · The Lisbon evening</p>
      <nav aria-label="Part 1, the Lisbon evening" onClickCapture={() => setChapter(false)}><ol className="pt-jumps">{STEPS.map(x => { const ok = stepDone(x.id); return (
        <li key={x.id}><a href={`#/${x.id}`} className={x.id === s.step ? 'is-on' : ''} aria-current={x.id === s.step ? 'step' : undefined}>
          <span className={`pt-dot ${ok ? 'is-ok' : ''}`} aria-hidden>{ok ? <Icon name="check" size={14} /> : <span className="tu-num">{+x.n}</span>}</span>{x.title}<span className="sr-only">{ok ? ', done' : ''}</span></a>
          {x.id === 'settle' && <ol className="pt-subjumps" aria-label="Settle up screens">{SETTLE_VIEWS.map(v => { const on = s.step === 'settle' && s.settleView === v.id; const seen = !!s.done[`v-${v.id}`]; return (
            <li key={v.id}><a href={`#/settle/${v.id}${v.as ? `?as=${v.as}` : ''}`} className={on ? 'is-on' : ''} aria-current={on ? 'page' : undefined}><span className={`pt-subdot ${seen ? 'is-ok' : ''}`} aria-hidden />{v.label}<span className="sr-only">{seen ? ', seen' : ''}</span></a></li>); })}</ol>}</li>
      ); })}</ol></nav>
      <BeyondPanel bz={bz} playing={tour && chapter} onPlay={() => { if (tour && chapter) setTour(false); else { setChapter(true); setTour(true); if (mode !== 'tour') { setMode('tour'); trackMode('tour'); } } }} />
      {phone && <BackToDeck cls="is-panel" />}
      <p className="pt-foot"><a href={DECK_HREF}>Deck</a><a href="../storybook/">Storybook</a><a href="https://www.figma.com/design/z4TesJNPe6UfvgwmWtIA4y/TripUp-Working" target="_blank" rel="noreferrer">Figma</a></p>
    </aside>
  );

  return (
    <PrismRoot theme={theme} motion={motion}>
      <AppProvider s={s} d={d}><BeyondBridge bz={bz}>
        {phone ? (
          <div className={`pt-mobile ${dark ? 'is-dark' : ''}`}>
            <div className="phone-content pt-mobile-screen">{screen}</div>
            <button type="button" className="pt-fab" onClick={() => setPanelOpen(true)}><Icon name="more" size={24} /><span className="sr-only">Reviewer panel</span></button>
            
            {panelOpen && <div className="pt-drawer" role="dialog" aria-modal="true" aria-label="Reviewer panel"><div className="pt-drawer-scrim" onClick={() => setPanelOpen(false)} />{panel}</div>}
          </div>
        ) : (
          <div className={`pt-desk ${dark ? 'is-dark' : ''} ${mode === 'self' ? 'fl-self' : ''} ${drawer ? 'fl-drawer' : ''}`}>
            {!EMBED && <div className="fl-backwrap"><BackToDeck /></div>}
            {mode === 'self' && !drawer && <div className="fl-float"><ModeSwitch mode="self" onMode={m => pickMode(m)} onSteps={() => setDrawer(true)} /></div>}
            {drawer && <div className="fl-scrim" onClick={() => setDrawer(false)} />}
            <main className="pt-stage">
              <div className="pt-devices">
                <div className="pt-device">{frame}</div>
              </div>
            </main>
            {panel}
          </div>
        )}
        {help && <div className="pt-help" onClick={() => setHelp(false)}>Shortcuts: arrows, Space, 1 2 3, D, M, R</div>}
        {chooser && <ModeChooser onPick={m => pickMode(m, true)} />}
      </BeyondBridge></AppProvider>
    </PrismRoot>
  );
}
void initial; void STREAM;

/* v5.4.7: deck embeds show a small pointer that glides to each tap target, presses, then taps. It hides once the user taps in. */
function embedTap(el: HTMLElement, ok: () => boolean) {
  let c = document.getElementById('emb-cur');
  if (!c) { c = document.createElement('div'); c.id = 'emb-cur'; c.setAttribute('aria-hidden', 'true'); document.body.appendChild(c);
    window.addEventListener('pointerdown', e => { if (e.isTrusted) document.getElementById('emb-cur')?.classList.add('is-gone'); }, true); }
  if (c.classList.contains('is-gone')) { el.click(); return; }
  const r = el.getBoundingClientRect(); c.classList.add('is-on'); c.classList.remove('is-press');
  c.style.transform = `translate(${r.left + r.width / 2 - 4}px, ${r.top + r.height / 2 - 2}px)`;
  window.setTimeout(() => { if (!ok()) return; c!.classList.add('is-press'); window.setTimeout(() => { if (ok()) el.click(); c!.classList.remove('is-press'); }, 160); }, 560);
}
