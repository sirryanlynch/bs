import React, { useEffect, useMemo, useState } from 'react';
import './beyond.css';
import { Stepper } from './stepper';
import { BIcon } from './icons';
import { Avatar, AvatarStack } from '../core';
import { Render3D } from '../Icon';
import { useReducedMotion } from '../../lib/PrismRoot';
import type { Person } from '../../lib/data';

/* ---------------- TripCreateStepper ---------------- */
/** Create trip's progress bar: the shared Stepper with the five Create steps. */
export function TripCreateStepper({ steps, current, onStep, onSkip }: { steps: string[]; current: number; onStep?: (i: number) => void; onSkip?: () => void }) {
  return <Stepper steps={steps} current={current} onStep={onStep} onSkip={onSkip} label="New trip progress" />;
}

/* ---------------- DestinationSearch ---------------- */
export type Destination = { id: string; name: string; country: string; sub: string; photos: string[]; trip?: string };
function Hl({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark>{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}
export function DestinationSearch({ query, onQuery, results, selected, onPick, label = 'Where to?' }:
  { query: string; onQuery?: (q: string) => void; results: Destination[]; selected?: string; onPick?: (id: string) => void; label?: string }) {
  const list = query ? results.filter(r => (r.name + ' ' + r.country).toLowerCase().includes(query.toLowerCase())) : results.slice(0, 4);
  return (
    <div className="b-dest">
      <label className="b-search">
        <BIcon name="search" size={20} />
        <input value={query} onChange={e => onQuery?.(e.target.value)} placeholder="City or country" aria-label={label} autoComplete="off" />
        {query && <button type="button" className="b-search-clear" aria-label="Clear search" onClick={() => onQuery?.('')}><BIcon name="close" size={14} /></button>}
      </label>
      <p className="b-overline">{query ? `${list.length} ${list.length === 1 ? 'match' : 'matches'}` : 'Suggested for your crew'}</p>
      <ul className="b-dest-list" role="listbox" aria-label="Destinations">
        {list.map(r => (
          <li key={r.id}>
            <button type="button" role="option" aria-selected={selected === r.id} className={`b-dest-row ${selected === r.id ? 'is-on' : ''}`} onClick={() => onPick?.(r.id)}>
              {r.photos[0] ? <img src={r.photos[0]} alt="" /> : <span className="b-dest-pin"><BIcon name="pin" size={20} /></span>}
              <span className="b-dest-text"><b><Hl text={r.name} q={query} /></b><small>{r.country} · {r.sub}</small></span>
              {selected === r.id ? <span className="b-check"><BIcon name="check" size={14} /></span> : <BIcon name="chevronRight" size={20} className="b-muted" />}
            </button>
          </li>
        ))}
        {!list.length && <li className="b-empty-line">No city called “{query}” yet. Check the spelling, or type a country.</li>}
      </ul>
    </div>
  );
}

/* ---------------- DateRangePicker ---------------- */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export type YMD = { y: number; m: number; d: number };
const key = (a: YMD) => a.y * 10000 + a.m * 100 + a.d;
export const fmtRange = (s?: YMD, e?: YMD) => !s ? 'Pick dates' : !e ? `${SHORT[s.m]} ${s.d}` : s.m === e.m ? `${SHORT[s.m]} ${s.d} to ${e.d}` : `${SHORT[s.m]} ${s.d} to ${SHORT[e.m]} ${e.d}`;
export const nights = (s?: YMD, e?: YMD) => (s && e ? Math.round((Date.UTC(e.y, e.m, e.d) - Date.UTC(s.y, s.m, s.d)) / 864e5) : 0);
export function DateRangePicker({ start, end, onChange, initialMonth, today = { y: 2026, m: 9, d: 16 } }:
  { start?: YMD; end?: YMD; onChange?: (s?: YMD, e?: YMD) => void; initialMonth?: { y: number; m: number }; today?: YMD }) {
  const [view, setView] = useState(initialMonth ?? { y: start?.y ?? today.y, m: start?.m ?? today.m });
  const first = new Date(Date.UTC(view.y, view.m, 1)).getUTCDay();
  const days = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
  const move = (k: number) => setView(v => { const m = v.m + k; return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 }; });
  const pick = (d: YMD) => {
    if (!start || end || key(d) < key(start)) onChange?.(d, undefined);
    else onChange?.(start, d);
  };
  const n = nights(start, end);
  return (
    <div className="b-cal">
      <div className="b-cal-head">
        <button type="button" className="b-round" onClick={() => move(-1)} aria-label="Previous month" disabled={view.y * 12 + view.m <= today.y * 12 + today.m}><BIcon name="chevronLeft" size={20} /></button>
        <b aria-live="polite">{MONTHS[view.m]} {view.y}</b>
        <button type="button" className="b-round" onClick={() => move(1)} aria-label="Next month"><BIcon name="chevronRight" size={20} /></button>
      </div>
      <div className="b-cal-grid" role="grid" aria-label={`${MONTHS[view.m]} ${view.y}`}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => <span key={i} className="b-cal-dow" aria-hidden>{w}</span>)}
        {Array.from({ length: first }, (_, i) => <span key={'e' + i} />)}
        {Array.from({ length: days }, (_, i) => {
          const d = { y: view.y, m: view.m, d: i + 1 }; const k = key(d);
          const past = k < key(today);
          const isS = start && k === key(start), isE = end && k === key(end);
          const inR = start && end && k > key(start) && k < key(end);
          return (
            <button key={k} type="button" disabled={past} onClick={() => pick(d)}
              className={`b-cal-day tu-num ${isS ? 'is-start' : ''} ${isE ? 'is-end' : ''} ${inR ? 'is-in' : ''} ${start && end && isS ? 'has-range' : ''}`}
              aria-pressed={!!(isS || isE || inR)} aria-label={`${MONTHS[view.m]} ${i + 1}${isS ? ', start' : isE ? ', end' : ''}`}>
              <span>{i + 1}</span>
            </button>
          );
        })}
      </div>
      <p className="b-cal-sum tu-num" aria-live="polite">
        <BIcon name="calendar" size={20} />
        {start && end ? <><b>{fmtRange(start, end)}, {end.y}</b><span>{n} {n === 1 ? 'night' : 'nights'}</span></> : start ? <b>Now pick the last day</b> : <b>Tap the first day, then the last</b>}
      </p>
    </div>
  );
}

/* ---------------- CoverPicker ---------------- */
export function CoverPicker({ photos, value, onChange, credit }: { photos: string[]; value?: string; onChange?: (p: string) => void; credit?: string }) {
  return (
    <div className="b-cover">
      <div className="b-cover-hero"><img src={value ?? photos[0]} alt="Selected cover" key={value} className="b-fadein" /></div>
      <div className="b-cover-grid" role="radiogroup" aria-label="Cover photo">
        {photos.map((p, i) => (
          <button key={p} type="button" role="radio" aria-checked={value === p} aria-label={`Photo ${i + 1}`} className={`b-cover-opt ${value === p ? 'is-on' : ''}`} onClick={() => onChange?.(p)}>
            <img src={p} alt="" />{value === p && <span className="b-check"><BIcon name="check" size={14} /></span>}
          </button>
        ))}
      </div>
      {credit && <p className="b-credit">{credit}</p>}
    </div>
  );
}

/* ---------------- BudgetInput ---------------- */
export function BudgetInput({ value, onChange, crewSize = 7, presets = [600, 900, 1200] }: { value?: number; onChange?: (v?: number) => void; crewSize?: number; presets?: number[] }) {
  const [raw, setRaw] = useState(value ? String(value) : '');
  useEffect(() => setRaw(value ? String(value) : ''), [value]);
  const v = value ?? 0;
  return (
    <div className="b-budget">
      <label className="b-budget-amt">
        <span className="sr-only">Budget per person in US dollars</span>
        <span className="b-budget-cur">$</span>
        <input inputMode="numeric" className="tu-num" value={raw} placeholder="0" aria-describedby="b-budget-help"
          onChange={e => { const t = e.target.value.replace(/[^0-9]/g, '').slice(0, 5); setRaw(t); onChange?.(t ? +t : undefined); }} />
        <span className="b-budget-per">per person</span>
      </label>
      <div className="b-chips" role="group" aria-label="Quick amounts">
        {presets.map(p => <button key={p} type="button" className={`b-chip ${v === p ? 'is-on' : ''}`} aria-pressed={v === p} onClick={() => onChange?.(p)}><span className="tu-num">${p.toLocaleString('en-US')}</span></button>)}
        <button type="button" className={`b-chip ${!value ? 'is-on' : ''}`} aria-pressed={!value} onClick={() => onChange?.(undefined)}>No budget</button>
      </div>
      <p id="b-budget-help" className="b-help tu-num">{value ? <>About <b>${(v * crewSize).toLocaleString('en-US')}</b> for {crewSize} people. Only the crew sees it, and you can change it later.</> : 'Optional. A budget helps Explore suggest places that fit.'}</p>
    </div>
  );
}

/* ---------------- CrewPicker (recent crews + people) ---------------- */
export function CrewPicker({ crews, people, selected, onToggle, onCrew }:
  { crews: { id: string; name: string; members: Person[]; last: string }[]; people: Person[]; selected: string[]; onToggle?: (id: string) => void; onCrew?: (id: string) => void }) {
  return (
    <div className="b-crew">
      <p className="b-overline">Recent crews</p>
      {crews.map(c => {
        const all = c.members.every(m => m.you || selected.includes(m.id));
        return (
          <button key={c.id} type="button" className={`b-crewcard ${all ? 'is-on' : ''}`} aria-pressed={all} onClick={() => onCrew?.(c.id)}>
            <AvatarStack people={c.members} size={28} max={5} />
            <span className="b-crewcard-text"><b>{c.name}</b><small>{c.members.length} people · {c.last}</small></span>
            <span className={`b-pill ${all ? 'is-on' : ''}`}>{all ? <><BIcon name="check" size={14} />Added</> : 'Add all'}</span>
          </button>
        );
      })}
      <p className="b-overline">People</p>
      <div className="b-people">
        {people.filter(p => !p.you).map(p => {
          const on = selected.includes(p.id);
          return (
            <button key={p.id} type="button" className={`b-person ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => onToggle?.(p.id)}>
              <span className="b-person-av"><Avatar person={p} size={44} ring="none" />{on && <span className="b-check is-sm"><BIcon name="check" size={12} /></span>}</span>
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- MilestoneMoment ---------------- */
/** The one spectrum moment in Create trip: a ring of color blooms behind a 3D render, then settles into a quiet card. */
export function MilestoneMoment({ title, sub, render = 'celebrate', onDone }: { title: string; sub: string; render?: 'celebrate' | 'itinerary' | 'pin'; onDone?: () => void }) {
  const reduce = useReducedMotion();
  const dots = useMemo(() => Array.from({ length: 14 }, (_, i) => ({ a: (i / 14) * 360, c: ['blush', 'apricot', 'mint', 'sky', 'lilac'][i % 5], r: 74 + (i % 3) * 12 })), []);
  useEffect(() => { if (!onDone) return; const t = setTimeout(onDone, reduce ? 1200 : 2400); return () => clearTimeout(t); }, [reduce]);
  return (
    <div className={`b-milestone ${reduce ? 'is-reduce' : ''}`} role="status" aria-live="polite">
      <div className="b-milestone-art" aria-hidden>
        <span className="b-milestone-glow" />
        {!reduce && dots.map((d, i) => <span key={i} className={`b-spark is-${d.c}`} style={{ ['--a' as any]: `${d.a}deg`, ['--r' as any]: `${d.r}px`, animationDelay: `${120 + i * 18}ms` }} />)}
        <Render3D name={render} size={112} />
      </div>
      <h2 className="b-milestone-title">{title}</h2>
      <p className="b-milestone-sub">{sub}</p>
    </div>
  );
}
