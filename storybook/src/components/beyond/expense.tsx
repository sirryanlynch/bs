import React, { useEffect, useState } from 'react';
import './beyond.css';
import { BIcon } from './icons';
import { Avatar } from '../core';
import type { Person } from '../../lib/data';
import { RLine, lineLabel, RECEIPT_CATS } from '../../lib/beyond';
import { useReducedMotion } from '../../lib/PrismRoot';

const $ = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ---------------- ReceiptScanner ---------------- */
/** A camera viewfinder over the bill. Corners lock on, a scan line sweeps, then each line lifts out as text. */
export function ReceiptScanner({ phase, lines, total, place = 'Zé da Mouraria', stamp = 'R. João do Outeiro 24, Lisboa · Oct 14, 2026 · 2:12 PM' }: { phase: 'aim' | 'scanning' | 'done'; lines: RLine[]; total: number; place?: string; stamp?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`b-scan is-${phase} ${reduce ? 'is-reduce' : ''}`} aria-label={phase === 'aim' ? 'Camera: hold the receipt inside the frame' : phase === 'scanning' ? 'Reading the receipt' : 'Receipt read'}>
      <div className="b-scan-paper" aria-hidden>
        <p className="b-scan-shop">{place.toUpperCase()}</p>
        <p className="b-scan-addr">{stamp}</p>
        {lines.map((l, i) => <p key={l.id} className="b-scan-line" style={{ ['--i' as any]: i }}><span>{l.print}{l.qty > 1 ? ` × ${l.qty}` : ''}</span><span>{l.price.toFixed(2)}</span></p>)}
        <p className="b-scan-line is-total"><span>SUBTOTAL USD</span><span>{total.toFixed(2)}</span></p>
        <p className="b-scan-addr">Tax included · Thank you</p>
      </div>
      <span className="b-scan-corners" aria-hidden><i /><i /><i /><i /></span>
      {phase === 'scanning' && !reduce && <span className="b-scan-beam" aria-hidden />}
      <p className="b-scan-hint tu-glass" role="status">{phase === 'aim' ? 'Hold steady. Fit the whole receipt.' : phase === 'scanning' ? `Reading ${lines.length} lines` : `Hold steady · ${lines.length} lines, ${$(total)}`}</p>
    </div>
  );
}

/* ---------------- ParsedLines ---------------- */
/** Lines grouped under plain-English category headers. Names keep the Portuguese with a short English hint. */
export function ParsedLines({ lines, total }: { lines: RLine[]; total: number }) {
  const sum = lines.reduce((a, l) => a + l.price, 0);
  const cats = RECEIPT_CATS.filter(c => lines.some(l => l.cat === c)).concat(lines.some(l => !RECEIPT_CATS.includes(l.cat)) ? ['Other'] : []);
  let n = 0;
  return (
    <div className="b-parsed">
      {cats.map(c => (
        <div key={c} className="b-parsed-group" role="group" aria-label={c}>
          <p className="b-overline b-parsed-cat">{c}</p>
          {lines.filter(l => (c === 'Other' ? !RECEIPT_CATS.includes(l.cat) : l.cat === c)).map(l => (
            <div key={l.id} className="b-parsed-row" style={{ ['--i' as any]: n++ }}>
              <span className="b-parsed-qty tu-num">{l.qty}×</span>
              <span className="b-parsed-item">{lineLabel(l)}{l.conf < 0.88 && <small className="b-warnline"><BIcon name="warning" size={12} />{lineLabel(l)} × {l.qty} read as {$(l.price)}. Looks right?</small>}</span>
              <span className="tu-num">{$(l.price)}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="b-parsed-row is-sub"><span /><span className="b-parsed-item">IVA (sales tax), included</span><span className="tu-num">{$(0)}</span></div>
      <div className="b-parsed-row is-total"><span /><span className="b-parsed-item">Subtotal</span><span className="tu-num">{$(total)}</span></div>
      {Math.abs(sum - total) < 0.01 && <p className="b-ok"><BIcon name="checkCircle" size={14} />Lines add up to the subtotal</p>}
    </div>
  );
}

/* ---------------- SplitModeControl ---------------- */
export type SplitMode = 'even' | 'item' | 'shares' | 'exclude';
export const SPLIT_MODES: { id: SplitMode; label: string; help: string }[] = [
  { id: 'even', label: 'Even', help: 'Everyone pays the same' },
  { id: 'item', label: 'By item', help: 'Tap who had what' },
  { id: 'shares', label: 'Shares', help: 'Give some people more' },
  { id: 'exclude', label: 'Exclude', help: 'Leave people out' },
];
export function SplitModeControl({ value, onChange }: { value: SplitMode; onChange?: (m: SplitMode) => void }) {
  const i = SPLIT_MODES.findIndex(m => m.id === value);
  return (
    <div className="b-splitmode">
      <div className="b-seg" role="radiogroup" aria-label="How to split" style={{ ['--n' as any]: 4, ['--i' as any]: i }}>
        <span className="b-seg-thumb" aria-hidden />
        {SPLIT_MODES.map(m => <button key={m.id} type="button" role="radio" aria-checked={value === m.id} className={value === m.id ? 'is-on' : ''} onClick={() => onChange?.(m.id)}>{m.label}</button>)}
      </div>
      <p className="b-help">{SPLIT_MODES[i].help}</p>
    </div>
  );
}

/* ---------------- LineItemAssigner ---------------- */
export function LineItemAssigner({ lines, assign, people, onToggle, open, onOpen }:
  { lines: RLine[]; assign: Record<string, string[]>; people: Person[]; onToggle?: (line: string, who: string) => void; open?: string; onOpen?: (id: string) => void }) {
  return (
    <ul className="b-assign">
      {lines.map(l => {
        const who = assign[l.id] ?? []; const each = who.length ? l.price / who.length : 0; const isOpen = open === l.id;
        return (
          <li key={l.id} className={`b-assign-row ${isOpen ? 'is-open' : ''}`}>
            <button type="button" className="b-assign-head" aria-expanded={isOpen} onClick={() => onOpen?.(isOpen ? '' : l.id)}>
              <span className="b-assign-item"><b>{lineLabel(l)}</b><small className="tu-num">{who.length === people.length ? 'Everyone' : `${who.length} of ${people.length}`} · {$(each)} each</small></span>
              <span className="tu-num b-assign-amt">{$(l.price)}</span><BIcon name="chevronDown" size={20} className="b-assign-chev" />
            </button>
            {isOpen && (
              <div className="b-assign-people" role="group" aria-label={`Who shares ${lineLabel(l)}`}>
                {people.map(p => { const on = who.includes(p.id); return (
                  <button key={p.id} type="button" className={`b-assign-p ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={`${p.name} shares ${l.item}`} onClick={() => onToggle?.(l.id, p.id)}>
                    <Avatar person={p} size={36} ring="none" /><small>{p.you ? 'You' : p.name}</small>
                  </button>
                ); })}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- SharesEditor / ExcludeList ---------------- */
export function SharesEditor({ people, shares, onChange }: { people: Person[]; shares: Record<string, number>; onChange?: (id: string, n: number) => void }) {
  return (
    <ul className="b-shares">
      {people.map(p => (
        <li key={p.id}><Avatar person={p} size={36} ring="none" /><b>{p.you ? 'You' : p.name}</b>
          <span className="b-mini-stepper" role="group" aria-label={`${p.name} shares`}>
            <button type="button" aria-label="Fewer shares" disabled={(shares[p.id] ?? 1) <= 0} onClick={() => onChange?.(p.id, (shares[p.id] ?? 1) - 1)}><BIcon name="minus" size={14} /></button>
            <span className="tu-num">{shares[p.id] ?? 1}</span>
            <button type="button" aria-label="More shares" onClick={() => onChange?.(p.id, (shares[p.id] ?? 1) + 1)}><BIcon name="plus" size={14} /></button>
          </span></li>
      ))}
    </ul>
  );
}

/* ---------------- TipTax ---------------- */
export function TipTax({ subtotal, tip, onTip }: { subtotal: number; tip: number; onTip?: (t: number) => void }) {
  return (
    <div className="b-tiptax">
      <div className="b-tiptax-row"><span>Tax</span><span className="b-muted">Portugal includes IVA (sales tax) in menu prices, so nothing to add.</span></div>
      <div className="b-tiptax-row"><span>TIP</span>
        <div className="b-chips" role="radiogroup" aria-label="Tip">{[0, 5, 10, 15].map(t => <button key={t} type="button" role="radio" aria-checked={tip === t} className={`b-chip is-sm ${tip === t ? 'is-on' : ''}`} onClick={() => onTip?.(t)}>{t === 0 ? 'None' : `${t}%`}</button>)}</div></div>
      {tip > 0 && <div className="b-tiptax-row"><span className="b-muted tu-num">{tip}% of {$(subtotal)}</span><span className="tu-num">{$(Math.round(subtotal * tip) / 100)}</span></div>}
      <div className="b-tiptax-row is-total"><span>Total</span><b className="tu-num">{$(subtotal * (1 + tip / 100))}</b></div>
      {tip === 0 && <p className="b-fine">Tipping is optional in Lisbon. Round up in cash if the service was great.</p>}
    </div>
  );
}

/* ---------------- PerPerson summary ---------------- */
export function PerPerson({ people, amounts, highlight = [] }: { people: Person[]; amounts: Record<string, number>; highlight?: string[] }) {
  const reduce = useReducedMotion();
  const [k, setK] = useState(0); useEffect(() => setK(x => x + 1), [JSON.stringify(amounts)]);
  return (
    <ul className="b-perperson">
      {people.map(p => (
        <li key={p.id} className={highlight.includes(p.id) ? 'is-hl' : ''}><Avatar person={p} size={28} ring="none" /><span>{p.you ? 'You' : p.name}</span>
          <b className={`tu-num ${reduce ? '' : 'b-tick'}`} key={k}>{$(amounts[p.id] ?? 0)}</b></li>
      ))}
    </ul>
  );
}
