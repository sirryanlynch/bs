import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { FlowProvider, FlowState, FlowAction, flowReducer, presetFor, FlowHost } from '@sb/patterns/beyond/kit';
import { BeyondScreen, FLOWS, metaOf, isBeyondRoute } from '@sb/patterns/beyond/router';
import { Icon } from '@sb/components/Icon';
import { routeFromHash, hashForRoute, navFlag, goBeyond } from './nav';
import './flows.css';
export { goBeyond } from './nav';

/** Keeps what a reviewer did across deep links: the trip they created, saves, settings. */
const carry = (c: FlowState, next: FlowState): FlowState => ({ ...next, create: c.create.created ? c.create : next.create, saved: c.saved, settings: c.settings, poll: next.poll.seeded ? next.poll : c.poll.sent ? c.poll : next.poll });

export type Beyond = { active: boolean; route: string; s: FlowState; d: React.Dispatch<FlowAction>; host: FlowHost; meta: ReturnType<typeof metaOf> };
export function useBeyond(opts: { coreHash: () => string; setTheme: (t: 'light' | 'dark') => void; setMotion: (m: 'full' | 'reduce') => void; theme: 'light' | 'dark' }): Beyond {
  const first = routeFromHash();
  const [s, d] = useReducer(flowReducer, undefined, () => presetFor(first && isBeyondRoute(first) ? first : 'explore'));
  const [active, setActive] = useState(!!first);
  const sRef = useRef(s); sRef.current = s;
  const ret = useRef<string>('');
  useEffect(() => {
    const apply = () => {
      const r = routeFromHash();
      if (r == null) { setActive(false); return; }
      const route = isBeyondRoute(r) ? r : 'explore';
      if (navFlag.inApp) { navFlag.inApp = false; ret.current = navFlag.from || ret.current; d({ t: 'go', route }); }
      else if (route !== sRef.current.route) d({ t: 'load', s: carry(sRef.current, presetFor(route)) });
      setActive(true);
    };
    apply(); window.addEventListener('hashchange', apply); return () => window.removeEventListener('hashchange', apply);
  }, []);
  // Keep the address bar on the current beyond screen, without adding history entries.
  useEffect(() => { if (!active) return; const h = hashForRoute(s.route); if (routeFromHash() !== s.route) history.replaceState(null, '', h); }, [s.route, active]);
  const host: FlowHost = {
    exit: step => { const h = step ? `#/${step}` : ret.current && !routeFromHash(ret.current) ? ret.current : opts.coreHash(); ret.current = ''; location.hash = h; },
    theme: opts.theme,
    setAppearance: a => opts.setTheme(a === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : a),
    setReduceMotion: v => opts.setMotion(v ? 'reduce' : 'full'),
  };
  return { active, route: s.route, s, d, host, meta: metaOf(s.route) };
}

/** Lets core screens (Trips home, Trip, tab bar) read the beyond state and open its routes. */
const Bridge = createContext<{ s: FlowState; go: (r: string) => void } | null>(null);
export const useBridge = () => useContext(Bridge) ?? { s: undefined as FlowState | undefined, go: goBeyond };
export function BeyondBridge({ bz, children }: { bz: Beyond; children: React.ReactNode }) {
  return <Bridge.Provider value={{ s: bz.s, go: goBeyond }}>{children}</Bridge.Provider>;
}

export function BeyondLayer({ bz }: { bz: Beyond }) {
  return <FlowProvider s={bz.s} d={bz.d} host={bz.host}><BeyondScreen /></FlowProvider>;
}

/** Reviewer panel section: every flow beyond tonight, each with its screens. */
export function BeyondPanel({ bz, onPlay, playing }: { bz: Beyond; onPlay: () => void; playing: boolean }) {
  const cur = bz.active ? bz.meta.flow : '';
  return (
    <nav aria-label="Beyond tonight" className="fl-panel">
      <div className="fl-panel-head"><p className="pt-eyebrow">Beyond tonight</p>
        <button type="button" className={`fl-chapter ${playing ? 'is-on' : ''}`} onClick={onPlay}>{playing ? <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor" /><rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor" /></svg> : <Icon name="play" size={14} />}{playing ? 'Playing' : 'Tour this chapter'}</button></div>
      <ol className="pt-jumps">{FLOWS.map((f, i) => { const on = f.id === cur; return (
        <li key={f.id}><a href={hashForRoute(f.start)} className={on ? 'is-on' : ''} aria-current={on ? 'step' : undefined}>
          <span className="pt-dot" aria-hidden><span className="tu-num">{String.fromCharCode(65 + i)}</span></span>{f.title}</a>
          {on && <ol className="pt-subjumps" aria-label={`${f.title} screens`}>{f.routes.map(r => { const ro = r.route === bz.route; return (
            <li key={r.route}><a href={hashForRoute(r.route)} className={ro ? 'is-on' : ''} aria-current={ro ? 'page' : undefined}><span className="pt-subdot" aria-hidden />{r.label}</a></li>); })}</ol>}
        </li>); })}</ol>
    </nav>
  );
}
