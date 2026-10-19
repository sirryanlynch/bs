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
  const sheet = open ? lines.find(l => l.id === open) : undefined;
  // v5.4.3 redesign: compact header, one face row, the mode toggle in the Items header, fixed-height rows, a bottom sheet per line.
  return (
    <div className="b-se is-v3">
      <header className="b-se-head" aria-label={`${title}, ${money(total)}`}>
        <p className="b-se-k">{title}{sub ? ` · ${sub}` : ''}</p>
        <p className="b-se-sum"><b className="tu-num">{money(total)}</b><span className="tu-num">{mode === 'even' || hi - lo < 0.01 ? <><Amt v={hi} /> each</> : <><Amt v={lo} />–<Amt v={hi} /> each</>}</span></p>
      </header>
      <section className="b-se-aud" aria-label="Who was there">
        <p className="b-se-h">Who was there <small className="tu-num">{there.length} of {people.length}</small></p>
        <div className="b-se-faces">{people.map(p => { const on = audience.includes(p.id); return (
          <button key={p.id} type="button" className={`b-se-face ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={`${p.name} ${on ? 'was there' : 'was not there'}`} onClick={() => toggleAud(p.id)}>
            <span className="b-se-fav"><Face p={p} size={40} /></span><span>{p.you ? 'You' : p.name}</span></button>); })}</div>
      </section>
      <section className="b-se-lines" aria-label="Items">
        <div className="b-se-ih"><p className="b-se-h">Items <small>{mode === 'item' && exceptions ? `${exceptions} with exceptions` : `${lines.length} on the bill`}</small></p>
          <div className="b-se-seg is-sm" role="radiogroup" aria-label="How to split">
            {(['even', 'item'] as SplitMode[]).map(m => <button key={m} type="button" role="radio" aria-checked={mode === m} className={mode === m ? 'is-on' : ''} onClick={() => onMode(m)}>{m === 'even' ? 'Even' : 'By item'}</button>)}
          </div></div>
        {lines.map(l => { const w = l.who.filter(x => audience.includes(x)); const ex = w.length < audience.length; const Row = mode === 'item' ? 'button' : 'div'; return (
          <Row key={l.id} {...(mode === 'item' ? { type: 'button', onClick: () => setOpen(l.id), 'aria-label': `${l.label}, ${money(l.price)}, ${w.length} people. Change who had it` } : {})} className={`b-se-row2 ${mode === 'item' ? 'b-se-who' : ''} ${ex && mode === 'item' ? 'is-ex' : ''}`}>
            <span className="b-se-lt"><b>{l.qty && l.qty > 1 ? <span className="tu-num">{l.qty}× </span> : null}{l.label}</b>
              {mode === 'item' && <small className="tu-num">{ex ? `${w.length} of ${audience.length}` : 'Everyone'} · {money(l.price / Math.max(1, w.length))} each</small>}</span>
            {mode === 'item' && <span className="b-se-rf"><Stack ps={w.map(id => P[id])} size={22} max={3} />{ex && <i className="b-se-exm" aria-hidden>−{audience.length - w.length}</i>}</span>}
            <b className="b-se-price tu-num">{money(l.price)}</b>
          </Row>); })}
      </section>
      {mode === 'item' && <section className="b-se-totals" aria-label="Each person pays" aria-live="polite">
        <div className="b-se-strip">{there.map(p => <span key={p.id} className="b-se-pp"><Face p={p} size={28} /><b><Amt v={sh[p.id] ?? 0} /></b></span>)}</div>
      </section>}
      {sheet && (() => { const w = sheet.who.filter(x => audience.includes(x)); return (
        <div className="b-se-sheetwrap" role="dialog" aria-modal="true" aria-label={`Who had ${sheet.label}`}>
          <div className="b-se-scrim" onClick={() => setOpen(undefined)} />
          <div className="b-se-sheet">
            <span className="b-se-grab" aria-hidden />
            <p className="b-se-st"><b>{sheet.label}</b><span className="tu-num">{money(sheet.price)} · {money(sheet.price / Math.max(1, w.length))} each</span></p>
            <div className="b-se-pick">{there.map(p => { const on = sheet.who.includes(p.id); return (
              <button key={p.id} type="button" className={`b-se-chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => { if (on && w.length <= 1) return; onLine(sheet.id, on ? sheet.who.filter(x => x !== p.id) : [...sheet.who, p.id]); }}>
                <Face p={p} size={40} /><span>{p.you ? 'You' : p.name}</span></button>); })}</div>
            <button type="button" className="b-se-done" onClick={() => setOpen(undefined)}>Done</button>
          </div>
        </div>); })()}
    </div>
  );
}

/** Helpers for hosts that store per-line people: Even split makes every line the audience; an audience change adds or removes that person everywhere. */
export const applyEven = (lines: SplitLine[], audience: string[]) => lines.map(l => ({ ...l, who: [...audience] }));
export const applyAudience = (lines: SplitLine[], prev: string[], next: string[]) => {
  const added = next.filter(x => !prev.includes(x)), gone = prev.filter(x => !next.includes(x));
  return lines.map(l => { let w = l.who.filter(x => !gone.includes(x)); w = [...w, ...added.filter(x => !w.includes(x))]; return { ...l, who: w.length ? w : [...next] }; });
};
