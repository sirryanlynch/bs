import React, { useState } from 'react';
import { Avatar, useCountUp } from '../core';
import type { Person } from '../../lib/data';
import { AVATAR } from '../../assets/solver-assets';
import './spliteditor.css';

/*
 * v5.4.2 SplitEditor: Who had what, rebuilt.
 *   Hero: the bill total, what each person pays, who was there.
 *   Even split / By item. "Who was there" is picked once and applies to every line.
 *   By item starts from that same audience, so you only touch the exceptions (the wine without Ren and Nic).
 *   Each line is a glass row with a tappable avatar stack; tap it to open the faces inline. A live per-person strip sits underneath.
 */
export type SplitLine = { id: string; label: string; hint?: string; qty?: number; price: number; who: string[] };
export type SplitMode = 'even' | 'item';
const money = (n: number) => `$${n.toFixed(2)}`;
/** Photo faces (Lisbon crew), falling back to initials. */
function Face({ p, size }: { p: Person; size: number }) { const src = AVATAR[p.id]; return src ? <img className="b-se-img" src={src} alt="" width={size} height={size} style={{ width: size, height: size }} /> : <Avatar person={p} size={size as any} ring="none" />; }
function Stack({ ps, size = 24, max = 4 }: { ps: Person[]; size?: number; max?: number }) { const sh = ps.slice(0, max); return <span className="b-se-stk">{sh.map(p => <Face key={p.id} p={p} size={size} />)}{ps.length > max && <span className="b-se-more tu-num" style={{ width: size, height: size }}>+{ps.length - max}</span>}</span>; }

export function sharesOf(lines: SplitLine[], audience: string[], mode: SplitMode, total?: number) {
  const sum = lines.reduce((a, l) => a + l.price, 0); const k = total != null && sum > 0 ? total / sum : 1; const out: Record<string, number> = {};
  if (mode === 'even') { audience.forEach(id => { out[id] = (total ?? sum) / Math.max(1, audience.length); }); return out; }
  lines.forEach(l => { const w = l.who.filter(x => audience.includes(x)); w.forEach(id => { out[id] = (out[id] ?? 0) + (l.price * k) / w.length; }); });
  return out;
}

function Amt({ v }: { v: number }) { const n = useCountUp(Math.round(v * 100), 420); return <span className="tu-num">{money(n / 100)}</span>; }

export function SplitEditor({ title, sub, total, lines, people, audience, mode, onMode, onAudience, onLine, defaultOpen, open: openP, onOpen }: {
  title: string; sub?: string; total: number; lines: SplitLine[]; people: Person[]; audience: string[]; mode: SplitMode;
  onMode: (m: SplitMode) => void; onAudience: (ids: string[]) => void; onLine: (id: string, who: string[]) => void; defaultOpen?: string; open?: string; onOpen?: (id?: string) => void;
}) {
  const [openS, setOpenS] = useState<string | undefined>(defaultOpen); const open = openP !== undefined ? openP : openS; const setOpen = (v?: string) => { setOpenS(v); onOpen?.(v); };
  const P = Object.fromEntries(people.map(p => [p.id, p])); const there = people.filter(p => audience.includes(p.id));
  const sh = sharesOf(lines, audience, mode, total); const vals = there.map(p => sh[p.id] ?? 0);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const toggleAud = (id: string) => { const on = audience.includes(id); if (on && audience.length <= 1) return; onAudience(on ? audience.filter(x => x !== id) : [...audience, id]); };
  const exceptions = lines.filter(l => audience.some(id => !l.who.includes(id))).length;
  return (
    <div className="b-se">
      <section className="b-se-hero" aria-label={`${title}, ${money(total)}`}>
        <p className="b-se-k">{title}</p>
        <p className="b-se-total tu-num">{money(total)}</p>
        <p className="b-se-per tu-num">{mode === 'even' || hi - lo < 0.01 ? <><Amt v={hi} /> each</> : <><Amt v={lo} /> to <Amt v={hi} /> each</>}{sub ? ` · ${sub}` : ''}</p>
        <span className="b-se-stack"><Stack ps={there} size={28} max={7} /><small className="tu-num">{there.length} of {people.length} there</small></span>
      </section>
      <div className="b-se-seg" role="radiogroup" aria-label="How to split">
        {(['even', 'item'] as SplitMode[]).map(m => <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? 'is-on' : ''} onClick={() => onMode(m)}>{m === 'even' ? 'Even split' : 'By item'}</button>)}
        <span className="b-se-seg-lens" style={{ ['--x' as any]: mode === 'even' ? 0 : 1 }} aria-hidden />
      </div>
      <section className="b-se-aud">
        <p className="b-se-h">Who was there <small>{mode === 'even' ? 'Applies to the whole bill' : 'Every line starts with these people'}</small></p>
        <div className="b-se-faces">{people.map(p => { const on = audience.includes(p.id); return (
          <button key={p.id} type="button" className={`b-se-face ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={`${p.name} ${on ? 'was there' : 'was not there'}`} onClick={() => toggleAud(p.id)}>
            <span className="b-se-fav"><Face p={p} size={44} /></span><span>{p.you ? 'You' : p.name}</span></button>); })}</div>
      </section>
      {mode === 'item' ? (
        <section className="b-se-lines" aria-label="Items">
          <p className="b-se-h">Items <small>{exceptions ? `${exceptions} ${exceptions === 1 ? 'line has' : 'lines have'} exceptions` : 'Tap faces on a line to change it'}</small></p>
          {lines.map((l, i) => { const w = l.who.filter(x => audience.includes(x)); const ex = w.length < audience.length; const isOpen = open === l.id; return (
            <div key={l.id} className={`b-se-line ${ex ? 'is-ex' : ''} ${isOpen ? 'is-open' : ''}`} style={{ ['--i' as any]: i }}>
              <div className="b-se-row">
                <span className="b-se-lt"><b>{l.qty && l.qty > 1 ? <span className="tu-num">{l.qty}× </span> : null}{l.label}</b><small className="tu-num">{ex ? `${w.length} of ${audience.length}` : 'Everyone'} · {money(l.price / Math.max(1, w.length))} each{l.hint ? ` · ${l.hint}` : ''}</small></span>
                <button type="button" className="b-se-who" aria-expanded={isOpen} aria-label={`${l.label}: ${w.length} people. Change who had it`} onClick={() => setOpen(isOpen ? undefined : l.id)}>
                  <Stack ps={w.map(id => P[id])} size={24} max={4} /></button>
                <b className="b-se-price tu-num">{money(l.price)}</b>
              </div>
              {isOpen && <div className="b-se-pick">{there.map(p => { const on = l.who.includes(p.id); return (
                <button key={p.id} type="button" className={`b-se-chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => { if (on && w.length <= 1) return; onLine(l.id, on ? l.who.filter(x => x !== p.id) : [...l.who, p.id]); }}>
                  <Face p={p} size={28} />{p.you ? 'You' : p.name}</button>); })}</div>}
            </div>); })}
        </section>
      ) : (
        <section className="b-se-lines is-even" aria-label="Items">
          <p className="b-se-h">On the bill <small>{lines.length} items, split {there.length} ways</small></p>
          {lines.map((l, i) => <div key={l.id} className="b-se-line is-quiet" style={{ ['--i' as any]: i }}><div className="b-se-row"><span className="b-se-lt"><b>{l.label}</b></span><b className="b-se-price tu-num">{money(l.price)}</b></div></div>)}
        </section>
      )}
      <section className="b-se-totals" aria-label="Each person pays" aria-live="polite">
        <p className="b-se-h">Each person pays</p>
        <div className="b-se-strip">{there.map(p => <span key={p.id} className="b-se-pp"><Face p={p} size={36} /><small>{p.you ? 'You' : p.name}</small><b><Amt v={sh[p.id] ?? 0} /></b></span>)}</div>
      </section>
    </div>
  );
}

/** Helpers for hosts that store per-line people: Even split makes every line the audience; an audience change adds or removes that person everywhere. */
export const applyEven = (lines: SplitLine[], audience: string[]) => lines.map(l => ({ ...l, who: [...audience] }));
export const applyAudience = (lines: SplitLine[], prev: string[], next: string[]) => {
  const added = next.filter(x => !prev.includes(x)), gone = prev.filter(x => !next.includes(x));
  return lines.map(l => { let w = l.who.filter(x => !gone.includes(x)); w = [...w, ...added.filter(x => !w.includes(x))]; return { ...l, who: w.length ? w : [...next] }; });
};
