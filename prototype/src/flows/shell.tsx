import React, { useEffect, useRef, useState } from 'react';
import { cursor } from './cursor';
import { CHAPTER, TourStep } from './tour';
import { Render3D } from '@sb/components/Icon';

export type Mode = 'self' | 'tour';
const KEY = 'tripup.mode';
export function initialMode(): Mode | null {
  const p = new URLSearchParams(location.search).get('mode');
  if (p === 'self' || p === 'tour') return p;
  try { const m = localStorage.getItem(KEY); if (m === 'self' || m === 'tour') return m; } catch {}
  return null;
}
/** The entry choice shows on a first visit to the bare prototype URL. Deep links and automated runs skip it unless ?chooser=1. */
export function showChooserAtStart(): boolean {
  const q = new URLSearchParams(location.search);
  if (q.has('chooser')) return true;
  if (q.has('mode') || q.has('embed') || (navigator as any).webdriver) return false;
  if (location.hash && location.hash !== '#/' && location.hash !== '#/home') return false;
  return initialMode() == null;
}
export function trackMode(mode: Mode) {
  try { localStorage.setItem(KEY, mode); } catch {}
  const w = window as Window & { tripupTrack?: (name: string, params?: Record<string, unknown>) => void; gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (typeof w.tripupTrack === 'function') w.tripupTrack('guided_mode_select', { mode });
  else if (typeof w.gtag === 'function') w.gtag('event', 'guided_mode_select', { mode });
  else (w.dataLayer = w.dataLayer || []).push({ event: 'guided_mode_select', mode });
  const u = new URL(location.href); u.searchParams.set('mode', mode); history.replaceState(null, '', u.toString());
}

export function ModeChooser({ onPick }: { onPick: (m: Mode) => void }) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  return (
    <div className="fl-choose" role="dialog" aria-modal="true" aria-labelledby="fl-choose-t">
      <div className="fl-choose-card">
        <p className="pt-eyebrow">TripUp prototype</p>
        <h1 id="fl-choose-t">How would you like to see it?</h1>
        <p className="fl-choose-sub">One crew, one last night in Lisbon, and everything after. You can switch any time.</p>
        <div className="fl-choose-opts">
          <button ref={first} type="button" className="fl-opt" onClick={() => onPick('tour')}>
            <span className="fl-opt-art"><Render3D name="itinerary" size={72} /></span>
            <b>Guided tour</b><span>Sit back for about four minutes. A cursor taps through tonight, then beyond. Pause or take over whenever you like.</span>
            <i className="fl-opt-go">Start the tour</i>
          </button>
          <button type="button" className="fl-opt" onClick={() => onPick('self')}>
            <span className="fl-opt-art"><Render3D name="pin" size={72} /></span>
            <b>Self guided</b><span>Just the phone. Tap around at your own pace, with the step list tucked away until you want it.</span>
            <i className="fl-opt-go">Explore on my own</i>
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small control that stays on screen in both modes. */
export function ModeSwitch({ mode, onMode, onSteps, compact }: { mode: Mode; onMode: (m: Mode) => void; onSteps?: () => void; compact?: boolean }) {
  return (
    <div className={`fl-switch ${compact ? 'is-compact' : ''}`}>
      <div className="fl-seg" role="radiogroup" aria-label="Prototype mode">
        {(['self', 'tour'] as Mode[]).map(m => <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? 'is-on' : ''} onClick={() => onMode(m)}>{m === 'self' ? 'Self guided' : 'Guided tour'}</button>)}
      </div>
      {onSteps && <button type="button" className="fl-steps" onClick={onSteps} aria-label="Open the steps panel"><svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><path d="M3 5h12M3 9h12M3 13h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>Steps</button>}
    </div>
  );
}

const sleep = (ms: number, gen: { id: number }, id: number) => new Promise<boolean>(r => setTimeout(() => r(gen.id === id), ms));
/** Runs the Beyond tonight chapter while `on`. Pausing stops at the current step; playing again resumes there. */
export function useChapter({ on, reduce, onCaption, onEnd }: { on: boolean; reduce: boolean; onCaption: (s: string) => void; onEnd: () => void }) {
  const [i, setI] = useState(0);
  const gen = useRef({ id: 0 });
  const iRef = useRef(0); iRef.current = i;
  useEffect(() => {
    if (!on) { gen.current.id++; cursor.hide(); return; }
    const id = ++gen.current.id;
    (async () => {
      for (let k = iRef.current; k < CHAPTER.length; k++) {
        const st = CHAPTER[k] as TourStep & Record<string, any>;
        setI(k);
        if (st.say) onCaption(st.say);
        if ('hash' in st && st.hash) { cursor.hide(); location.hash = st.hash; if (!(await sleep(st.wait ?? 1200, gen.current, id))) return; continue; }
        if ('scroll' in st && st.scroll) { await cursor.drag(st.scroll); if (gen.current.id !== id) return; if (!(await sleep(st.wait ?? 600, gen.current, id))) return; continue; }
        if ('tap' in st && st.tap) {
          const el = await cursor.moveTo(st.tap); if (gen.current.id !== id) return;
          if (el) { await sleep(reduce ? 80 : 140, gen.current, id); if (gen.current.id !== id) return; await cursor.tap(el); }
          if (!(await sleep(st.wait ?? 900, gen.current, id))) return; continue;
        }
        if (!(await sleep(st.wait ?? 800, gen.current, id))) return;
      }
      setI(0); cursor.hide(); onEnd();
    })();
    return () => { gen.current.id++; };
  }, [on]);
  return { index: i, total: CHAPTER.length, restart: () => setI(0) };
}
