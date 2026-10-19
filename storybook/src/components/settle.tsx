import { AVATAR } from '../assets/solver-assets';
import React, { useEffect, useRef, useState } from 'react';
import { Icon, IconName } from './Icon';
import { Toggle } from './core';
import { people as P, Person, USD } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';

/* ============================================================
   Settle-up v3: cash settlement flow (Figma section 09, S1 to S7, E1 to E3)
   Money is handled in cents internally; display uses tabular figures and U+2212 for minus.
   ============================================================ */

export type SettleMethod = 'tripup' | 'mbway' | 'revolut' | 'bank' | 'cash';
export type SettleStatus = 'draft' | 'queued' | 'pending' | 'confirmed' | 'disputed' | 'canceled';
export interface Settlement {
  id: string;            // 'stl_7Q2K-0042'
  clientId: string;      // idempotency key for offline retries
  from: string; to: string;
  due: number;           // 42.10, from simplify()
  paid: number;          // 42.00
  carry: number;         // due - paid when rounded, 0.10
  method: SettleMethod;
  status: SettleStatus;
  partial?: boolean;
  markedAt?: string; confirmedAt?: string;
  dispute?: { counted: number; note: string; at: string };
  provenance: { label: string; amount: number }[];
}

const cents = (n: number) => Math.round(n * 100);
const fromCents = (c: number) => c / 100;
export const usd2 = (n: number) => `${n < 0 ? '−' : ''}${USD.format(Math.abs(n))}`;
const num = (n: number) => `${n < 0 ? '−' : ''}${Math.abs(n).toFixed(2)}`;
/** Cash rounds to the nearest dollar, so the change is never more than $0.50 either way. */
export function roundCash(due: number) { const paid = fromCents(Math.round(cents(due) / 100) * 100); return { paid, carry: fromCents(cents(due) - cents(paid)) }; }
/** Greedy split over US bills and coins, largest first: $100, 50, 20, 10, 5, 1, then 25, 10, 5 and 1 cent. */
export function cashNotes(amount: number) {
  const units = [10000, 5000, 2000, 1000, 500, 100, 25, 10, 5, 1]; let c = cents(amount); const out: { v: number; n: number }[] = [];
  units.forEach(u => { const n = Math.floor(c / u); if (n > 0) { out.push({ v: u / 100, n }); c -= n * u; } });
  return out;
}
const noteLabel = (v: number) => (v >= 1 ? `$${v}` : `${Math.round(v * 100)}¢`);
export const METHODS: { id: SettleMethod; title: string; meta: string; tile: IconName | string; cta: (amt: string) => string }[] = [
  { id: 'tripup', title: 'TripUp Pay', meta: 'Visa •• 4821 · arrives now', tile: 'card', cta: a => `Pay ${a} with TripUp Pay` },
  { id: 'mbway', title: 'MB WAY', meta: '+351 912 ••• 214 · opens MB WAY', tile: 'MB', cta: () => 'Open MB WAY' },
  { id: 'revolut', title: 'Revolut', meta: '@nicmendes · opens Revolut', tile: 'R', cta: () => 'Open Revolut' },
  { id: 'bank', title: 'Bank transfer', meta: 'PT50 •••• 0457 · 1 business day', tile: 'wallet', cta: () => 'Copy bank details' },
  { id: 'cash', title: 'Cash', meta: 'Hand it over in person', tile: 'cash', cta: () => 'Continue with cash' },
];
const vib = (p: number | number[]) => { try { (navigator as any).vibrate?.(p); } catch { /* no haptics */ } };

/* ---------- shared parts ---------- */
/** Glass navigation card: back label, serif title, subtitle. Content starts at y 214. */
export function GlassHeader({ back, title, subtitle, onBack }: { back?: string; title: string; subtitle?: string; onBack?: () => void }) {
  return (
    <header className="p-gh">
      {back && <button type="button" className="p-gh-back" onClick={onBack} aria-label={`Back to ${back}`}><Icon name="chevronLeft" size={20} stroke={2.2} /><span aria-hidden>{back}</span></button>}
      <h1 className="p-gh-title">{title}</h1>
      {subtitle && <p className="p-gh-sub">{subtitle}</p>}
    </header>
  );
}
export function SPill({ tone = 'neutral', children }: { tone?: 'owed' | 'owe' | 'accent' | 'neutral'; children: React.ReactNode }) {
  return <span className={`p-spill is-${tone}`}>{children}</span>;
}
export function Overline({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return <div className="p-overline"><span>{children}</span>{right && <span>{right}</span>}</div>;
}
export type ReadoutRow = [React.ReactNode, React.ReactNode, ('carry' | 'gap' | 'ok' | 'muted' | 'strong')?];
export function Readout({ title, pill, rows, cols }: { title: React.ReactNode; pill?: React.ReactNode; rows: ReadoutRow[]; cols?: 3 }) {
  return (
    <div className={`p-readout ${cols === 3 ? 'is-3col' : ''}`}>
      <div className="p-readout-head"><span>{title}</span>{pill}</div>
      <dl>{rows.map(([l, v, tone], i) => <div key={i} className={tone ? `is-${tone}` : ''}><dt>{l}</dt><dd>{v}</dd></div>)}</dl>
    </div>
  );
}
function Chip({ person, filled }: { person: Person; filled?: boolean }) {
  return <span className={`p-pchip ${filled ? 'is-me' : ''}`} aria-hidden>{person.initials}</span>;
}
/** Pair hero: payer and receiver joined by an Iris arrow, the amount in display type, a caption and a pill. */
export function PairHero({ from = P.ari, to = P.nic, amount, caption, pill, link, onLink, compact }:
  { from?: Person; to?: Person; amount: number; caption?: React.ReactNode; pill?: React.ReactNode; link?: string; onLink?: () => void; compact?: boolean }) {
  return (
    <section className={`p-scard p-pairhero ${compact ? 'is-compact' : ''}`} aria-label={`${from.name} pays ${to.name} ${usd2(amount)}`}>
      {!compact && <div className="p-pairhero-top">
        <Chip person={from} filled={from.id === 'ari'} />
        <svg className="p-pairhero-arrow" width="62" height="14" viewBox="0 0 62 14" aria-hidden><defs><linearGradient id="phg" x1="0" x2="1"><stop offset="0" className="p-ut-s0" /><stop offset=".55" className="p-ut-s1" /></linearGradient></defs><path d="M1 7H58M52 1.5 58 7l-6 5.5" fill="none" stroke="url(#phg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <Chip person={to} />
        <span className="p-pairhero-pill">{pill}</span>
      </div>}
      {compact && <span className="p-pairhero-pill is-abs">{pill}</span>}
      <p className="p-pairhero-amt tu-num">{usd2(amount)}</p>
      {caption && <p className="p-pairhero-cap">{caption}</p>}
      {link && <button type="button" className="p-pairhero-link" onClick={onLink}>{link}<Icon name="chevronRight" size={14} /></button>}
    </section>
  );
}

/* ---------- S1 method picker ---------- */
export function MethodPicker({ value = 'cash', onChange }: { value?: SettleMethod; onChange?: (m: SettleMethod) => void }) {
  return (
    <div className="p-scard p-methods" role="radiogroup" aria-label="How you'll pay">
      {METHODS.map(m => (
        <button key={m.id} type="button" role="radio" aria-checked={value === m.id} className={`p-method ${value === m.id ? 'is-on' : ''}`} onClick={() => { vib(6); onChange?.(m.id); }}>
          <span className="p-method-tile" aria-hidden>{m.tile.length <= 2 ? <b>{m.tile}</b> : <Icon name={m.tile as IconName} size={20} />}</span>
          <span className="p-method-txt"><span className="p-method-title">{m.title}</span><span className="p-method-meta">{m.meta}</span></span>
          <span className="p-radio" aria-hidden />
        </button>
      ))}
    </div>
  );
}

/* ---------- S2 cash count with round and carry ---------- */
export function CashCount({ due = 42.1, round = true, onRound, onPartial, from = P.ari, to = P.nic }:
  { due?: number; round?: boolean; onRound?: (v: boolean) => void; onPartial?: () => void; from?: Person; to?: Person }) {
  const r = roundCash(due); const hand = round ? r.paid : due; const carry = round ? r.carry : 0; const notes = cashNotes(hand);
  return (
    <>
      <section className="p-scard p-hand">
        <p className="p-overline-s">HAND OVER</p>
        <p className="p-hand-amt tu-num">{usd2(hand)}</p>
        {round && Math.abs(carry) > 0.004 && <div className="p-pills"><SPill>rounded from {usd2(due)}</SPill><SPill tone="accent">{usd2(Math.abs(carry))} carried</SPill></div>}
      </section>
      <section className="p-scard p-round">
        <div><p className="p-round-title">Round to {usd2(r.paid)}</p><p className="p-round-body">The {usd2(Math.abs(r.carry))} moves to the next split, so nobody counts coins tonight.</p></div>
        <Toggle checked={round} label={`Round to ${usd2(r.paid)}`} onChange={onRound} />
      </section>
      <section className="p-scard p-cashcount" aria-label={`Count it out: ${notes.map(n => `${n.n} times ${noteLabel(n.v)}`).join(', ')}`}>
        <p className="p-overline-s">COUNT IT OUT</p>
        <div className="p-cashcount-row"><div className="p-pills">{notes.map(n => <SPill key={n.v}>{noteLabel(n.v)} × {n.n}</SPill>)}</div><span className="p-cashcount-total tu-num">= {usd2(hand)}</span></div>
      </section>
      <Readout title={<>CASH · {from.you ? 'YOU' : from.name.toUpperCase()} → {to.name.toUpperCase()}</>} rows={[['due', num(due)], ['hand over', num(hand)], ...(carry ? [['carry → next split', num(carry), 'carry'] as ReadoutRow] : [])]} />
      <button type="button" className="p-scard p-rowlink" onClick={onPartial}><span>Paying part of it?</span><Icon name="chevronRight" size={20} /></button>
    </>
  );
}

/* ---------- Slide to settle ---------- */
const TICKS = [0.25, 0.5, 0.75];
/**
 * Track 362 x 64. Haptic ticks at 25, 50 and 75 percent of travel, confirm past 92 percent.
 * Reduce Motion (or forceButton) swaps it for a 600 ms long-press button with a circular fill.
 */
export function SlideToSettle({ amount = 42, label, onConfirm, onHold, initial = 0, forceButton }:
  { amount?: number; label?: string; onConfirm?: () => void; onHold?: (held: boolean) => void; initial?: number; forceButton?: boolean }) {
  const reduce = useReducedMotion();
  const text = label ?? `Slide to mark ${usd2(amount)} paid`;
  const trackRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(initial); const [drag, setDrag] = useState(false); const [snap, setSnap] = useState<'back' | 'end' | null>(null);
  const [armed, setArmed] = useState(false);
  const st = useRef({ x0: 0, p0: 0, passed: new Set<number>(), med: false });
  const travel = () => (trackRef.current ? trackRef.current.clientWidth - 64 : 298);
  const down = (e: React.PointerEvent) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); st.current = { x0: e.clientX, p0: p, passed: new Set(), med: false }; setDrag(true); setSnap(null); onHold?.(true); };
  const move = (e: React.PointerEvent) => {
    if (!drag) return; const v = Math.min(1, Math.max(0, st.current.p0 + (e.clientX - st.current.x0) / travel())); setP(v);
    TICKS.forEach(tk => { if (v >= tk && !st.current.passed.has(tk)) { st.current.passed.add(tk); vib(4); } });
    if (v >= 0.92 && !st.current.med) { st.current.med = true; vib(14); }
  };
  const up = () => {
    if (!drag) return; setDrag(false); onHold?.(false);
    if (p >= 0.92) { setSnap('end'); setP(1); vib([10, 40, 16]); window.setTimeout(() => onConfirm?.(), 200); }
    else { setSnap('back'); setP(0); }
  };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (armed) { setP(1); setSnap('end'); vib([10, 40, 16]); onConfirm?.(); } else setArmed(true); }
    if (e.key === 'Escape') setArmed(false);
  };
  if (reduce || forceButton) return <LongPressSettle amount={amount} onConfirm={onConfirm} />;
  const knobX = p * 100;
  return (
    <div className={`p-slide ${drag ? 'is-drag' : ''} ${p >= 0.5 ? 'is-half' : ''} ${p >= 0.92 ? 'is-ready' : ''} ${snap ? `is-snap-${snap}` : ''}`} ref={trackRef} style={{ ['--p' as any]: p }}>
      <span className="p-slide-fill" aria-hidden />
      {TICKS.map(tk => <span key={tk} className={`p-slide-tick ${p >= tk ? 'is-on' : ''}`} style={{ left: `calc(32px + (100% - 64px) * ${tk})` }} aria-hidden />)}
      <span className="p-slide-label" aria-hidden>{text}<span className="p-slide-chev">›››</span></span>
      <span className="p-slide-release" aria-hidden>Release to confirm</span>
      <button type="button" className="p-slide-knob" style={{ left: `calc(4px + (100% - 64px) * ${knobX / 100})` }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onKeyDown={key} onBlur={() => setArmed(false)}
        aria-label={armed ? `Press again to mark ${usd2(amount)} paid` : `Mark ${usd2(amount)} paid. Slide right, or press twice.`}>
        <Icon name={p >= 0.92 ? 'check' : 'arrowRight'} size={24} />
      </button>
      {armed && <span className="p-slide-armed" role="status">Press again to confirm</span>}
    </div>
  );
}
/** The Reduce Motion and assistive alternative: hold for 600 ms; the ring fills as you hold. */
export function LongPressSettle({ amount = 42, onConfirm }: { amount?: number; onConfirm?: () => void }) {
  const [k, setK] = useState(0); const raf = useRef(0); const t0 = useRef(0); const done = useRef(false);
  const start = () => { done.current = false; t0.current = performance.now(); const tick = (n: number) => { const v = Math.min(1, (n - t0.current) / 600); setK(v); if (v < 1) raf.current = requestAnimationFrame(tick); else if (!done.current) { done.current = true; vib([10, 40, 16]); onConfirm?.(); } }; raf.current = requestAnimationFrame(tick); };
  const stop = () => { cancelAnimationFrame(raf.current); if (!done.current) setK(0); };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const C = 2 * Math.PI * 11;
  return (
    <button type="button" className="p-longpress" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); start(); } }} onKeyUp={stop} aria-label={`Mark ${usd2(amount)} paid. Press and hold.`}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden><circle cx="14" cy="14" r="11" className="p-lp-track" /><circle cx="14" cy="14" r="11" className="p-lp-fill" strokeDasharray={C} strokeDashoffset={C * (1 - k)} transform="rotate(-90 14 14)" /></svg>
      <span>Mark {usd2(amount)} paid</span><small>Hold</small>
    </button>
  );
}

/* ---------- S4 pending with undo ---------- */
export function PendingMark({ s, to = P.nic, title = 'Marked as paid', body, timeline = true }: { s: Settlement; to?: Person; title?: string; body?: React.ReactNode; timeline?: boolean }) {
  const confirmed = s.status === 'confirmed';
  return (
    <>
      <div className="p-pend-hero">
        <span className="p-pend-disc" aria-hidden><Icon name="check" size={28} /></span>
        <h2 className="p-pend-title">{title}</h2>
        <p className="p-pend-body">{body ?? <>{to.name} gets a request to confirm {usd2(s.paid)} in cash. Your balance moves when he does.</>}</p>
      </div>
      {timeline && <Readout title="TIMELINE" pill={<span className="p-readout-pill">{confirmed ? 'CONFIRMED' : 'PENDING'}</span>} cols={3}
        rows={[
          [<><span className="p-tl-t">{s.markedAt ?? '10:39:04 PM'}</span>you marked {s.method === 'cash' ? 'cash' : s.method}</>, <>{usd2(s.paid)} ✓</>, 'strong'],
          [<><span className="p-tl-t">{s.markedAt ?? '10:39:04 PM'}</span>request sent to {to.name}</>, <span className="p-ok">✓</span>],
          [<><span className="p-tl-t">{s.confirmedAt ?? '--:--:--'}</span>{to.name} confirms</>, confirmed ? <span className="p-ok">✓</span> : 'pending', confirmed ? undefined : 'muted'],
        ]} />}
      <p className="p-sumchip tu-num">due {num(s.due)} · paid {num(s.paid)}{s.carry ? ` · carried ${num(s.carry)}` : ''}{s.partial ? ` · open ${num(s.due - s.paid)}` : ''}</p>
    </>
  );
}
/** Dark undo toast with a 20 px countdown ring. The window is 5 s. Reduce Motion shows a plain number. */
export function UndoToast({ amount = 42, seconds = 5, onUndo, onExpire, startAt }: { amount?: number; seconds?: number; onUndo?: () => void; onExpire?: () => void; startAt?: number }) {
  const reduce = useReducedMotion();
  const [left, setLeft] = useState(seconds * 1000); const t0 = useRef(startAt ?? performance.now()); const raf = useRef(0);
  useEffect(() => {
    const tick = (n: number) => { const v = Math.max(0, seconds * 1000 - (n - t0.current)); setLeft(v); if (v > 0) raf.current = requestAnimationFrame(tick); else onExpire?.(); };
    raf.current = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf.current);
  }, []);
  const s = Math.max(1, Math.ceil(left / 1000)); const C = 2 * Math.PI * 8;
  return (
    <div className="p-undo" role="status">
      {reduce ? <span className="p-undo-num tu-num" aria-hidden>{s}s</span>
        : <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden><circle cx="10" cy="10" r="8" className="p-undo-track" /><circle cx="10" cy="10" r="8" className="p-undo-ring" strokeDasharray={C} strokeDashoffset={C * (1 - left / (seconds * 1000))} transform="rotate(-90 10 10)" /></svg>}
      <span className="p-undo-msg tu-num">Marked {usd2(amount)} paid · {s}s</span>
      <button type="button" className="p-undo-btn" onClick={onUndo}>Undo</button>
    </div>
  );
}

/* ---------- S5 receiver confirm ---------- */
export function ReceiverConfirm({ s, from = P.ari, to = P.nic, reason = 'Tejo boat tour, via Tomás' }: { s: Settlement; from?: Person; to?: Person; reason?: string }) {
  return (
    <>
      <PairHero from={from} to={to} amount={s.paid} caption={`${from.name} marked this as cash, handed over in person.`} pill={<SPill tone="accent">NEEDS YOU</SPill>} />
      <Readout title={<>RECEIPT · {s.id.toUpperCase()}</>} rows={[['due', num(s.due)], [`${from.name} gave`, num(s.paid)], ...(s.carry ? [['carried → next split', num(s.carry), 'carry'] as ReadoutRow] : []), ['for', reason]]} />
      <p className="p-note">Your balance updates when you confirm. If the count is off, tap Not yet and say what you got.</p>
    </>
  );
}

/* ---------- S6 payment success, progress and rows ---------- */
export type PlanRow = { from: Person; to: Person; amount: number; reason: string; state: 'due' | 'pending' | 'paid'; paidLabel?: string; perspective?: 'out' | 'in' | 'other' };
export function PaymentSuccess({ title = 'Nic confirmed $42.00', meta = 'cash · 10:40:12 PM · stl_7Q2K-0042', animate = true }: { title?: string; meta?: string; animate?: boolean }) {
  const reduce = useReducedMotion();
  useEffect(() => { if (animate) vib([10, 40, 16]); }, []);
  return (
    <section className={`p-scard p-success ${animate && !reduce ? 'is-anim' : ''} ${reduce ? 'is-reduced' : ''}`} role="status">
      <span className="p-success-disc" aria-hidden><Icon name="check" size={20} /></span>
      <div><p className="p-success-title">{title}</p><p className="p-success-meta">{meta}</p></div>
    </section>
  );
}
export function SettleProgress({ done, total, paid, sum, animate = true }: { done: number; total: number; paid: number; sum: number; animate?: boolean }) {
  return (
    <div className="p-sprog" role="img" aria-label={`${done} of ${total} settled, ${usd2(paid)} of ${usd2(sum)}`}>
      <div className="p-sprog-head"><span>{done} OF {total} SETTLED</span><span className="tu-num">{usd2(paid)} of {usd2(sum)}</span></div>
      <div className="p-sprog-bar">{Array.from({ length: total }, (_, i) => <span key={i} className={i < done ? `is-on ${animate && i === done - 1 ? 'is-new' : ''}` : ''} />)}</div>
    </div>
  );
}
export function PlanRows({ rows }: { rows: PlanRow[] }) {
  return (
    <div className="p-scard p-planrows">
      {rows.map((r, i) => (
        <div key={i} className="p-planrow">
          <span className="p-pchip is-row" aria-hidden>{(r.perspective === 'in' ? r.from : r.perspective === 'out' ? r.to : r.from).initials}</span>
          <div className="p-planrow-txt"><p>{r.from.you ? 'You' : r.from.name} → {r.to.you ? 'You' : r.to.name}</p><span>{r.reason}</span></div>
          {r.state === 'paid' ? <SPill tone="owed">{r.paidLabel ?? `${usd2(r.amount)} ✓`}</SPill>
            : r.state === 'pending' ? <SPill tone="accent">PENDING</SPill>
            : <span className={`p-planrow-amt tu-num ${r.perspective === 'in' ? 'is-owed' : ''}`}>{usd2(r.amount)}</span>}
        </div>
      ))}
    </div>
  );
}

/* ---------- S7 receipt and provenance ---------- */
export function ReceiptView({ s, from = P.ari, to = P.nic, reason = 'Tejo boat tour, routed through Tomás' }: { s: Settlement; from?: Person; to?: Person; reason?: string }) {
  const methodLabel = s.method === 'cash' ? 'cash · in person' : METHODS.find(m => m.id === s.method)!.title;
  return (
    <>
      <PairHero compact from={from} to={to} amount={s.paid} caption={reason} pill={<SPill tone={s.status === 'confirmed' ? 'owed' : 'accent'}>{s.status === 'confirmed' ? 'CONFIRMED' : s.status.toUpperCase()}</SPill>} />
      <Readout title="PAYMENT" rows={[
        ['id', s.id], ['from', `${from.name}${from.you ? ' (you)' : ''}`], ['to', to.name], ['method', methodLabel], ['due', usd2(s.due)], ['paid', usd2(s.paid)],
        ...(s.carry ? [['carried', `${usd2(s.carry)} → next split`, 'carry'] as ReadoutRow] : []),
        ['marked', `${s.markedAt ?? '10:39:04 PM'} · ${from.name}`],
        ['confirmed', s.confirmedAt ? `${s.confirmedAt} · ${to.name}` : 'waiting', s.confirmedAt ? 'ok' : 'muted'],
        ['sync', s.status === 'queued' ? 'queued on this phone' : 'both phones ✓'],
      ]} />
      <Readout title="WHERE IT CAME FROM" rows={s.provenance.map((p, i) => [p.label, i === s.provenance.length - 1 ? <span className="p-carry">{num(p.amount)}</span> : (p.amount > 0 && i === 0 ? '+' : '') + num(p.amount)] as ReadoutRow)} />
    </>
  );
}
export const NIC_PROVENANCE = [
  { label: 'LX Factory lunch · Tomás paid', amount: 79.8 }, { label: 'Dinner · you paid', amount: -37.7 }, { label: 'you owe Tomás', amount: 42.1 },
  { label: 'Tomás owes Nic · boat tour', amount: 42.1 }, { label: 'simplified: you → Nic', amount: 42.1 },
];

/* ---------- E1 partial cash ---------- */
export function PartialCash({ due = 42.1, amount = 20, onAmount }: { due?: number; amount?: number; onAmount?: (v: number) => void }) {
  const left = fromCents(cents(due) - cents(amount));
  const opts: [string, number][] = [['$10', 10], ['$20', 20], ['$40', 40], [`All ${usd2(due)}`, due]];
  return (
    <>
      <section className="p-scard p-hand">
        <p className="p-overline-s">HAND OVER NOW</p>
        <p className="p-hand-amt tu-num">{usd2(amount)}</p>
        <p className="p-hand-of">of {usd2(due)} due</p>
      </section>
      <div className="p-quick" role="radiogroup" aria-label="Amount to hand over">
        {opts.map(([l, v]) => <button key={l} type="button" role="radio" aria-checked={Math.abs(v - amount) < 0.005} className={Math.abs(v - amount) < 0.005 ? 'is-on' : ''} onClick={() => { vib(6); onAmount?.(v); }}>{l}</button>)}
      </div>
      <section className="p-scard p-pbar" aria-label={`${usd2(amount)} now, ${usd2(left)} left`}>
        <div className="p-pbar-track"><span style={{ width: `${(amount / due) * 100}%` }} /></div>
        <div className="p-pbar-lbl tu-num"><span>now {num(amount)}</span><span>left {num(left)}</span></div>
      </section>
      <Readout title="PARTIAL · YOU → NIC" rows={[['due', num(due)], ['hand over now', num(amount)], ['stays open on the plan', num(left)]]} />
      <p className="p-note">The other {usd2(left)} stays on your plan. Pay it in cash or in the app later.</p>
    </>
  );
}

/* ---------- E2 dispute ---------- */
export type DisputeFix = 'coin' | 'change' | 'cancel';
export function DisputeView({ s, to = P.nic, fix = 'coin', onFix }: { s: Settlement; to?: Person; fix?: DisputeFix; onFix?: (f: DisputeFix) => void }) {
  const d = s.dispute ?? { counted: 40, note: 'Got two twenties, nothing else.', at: '10:41 PM' };
  const gap = fromCents(cents(s.paid) - cents(d.counted));
  const opts: [DisputeFix, string, string][] = [
    ['coin', `Hand over the missing ${usd2(gap)}`, `${to.name} confirms ${usd2(s.paid)}, same as before`],
    ['change', `Change it to ${usd2(d.counted)}`, `${usd2(fromCents(cents(s.due) - cents(d.counted)))} stays open on your plan`],
    ['cancel', 'Cancel the cash mark', `Back to ${usd2(s.due)} open`],
  ];
  return (
    <>
      <section className="p-scard is-rose p-dispute" role="status">
        <div className="p-dispute-head"><Icon name="warning" size={20} /><b>{to.name} counted {usd2(d.counted)}</b><SPill tone="owe">DISPUTED</SPill></div>
        <p>{to.name} tapped Not yet at {d.at}: “{d.note}”</p>
      </section>
      <Readout title="COUNT CHECK" rows={[['you marked', num(s.paid)], [`${to.name} counted`, num(d.counted)], ['gap', num(gap), 'gap']]} />
      <Overline>WHAT NOW</Overline>
      <div className="p-scard p-fixes" role="radiogroup" aria-label="What now">
        {opts.map(([id, t, m]) => (
          <button key={id} type="button" role="radio" aria-checked={fix === id} className={`p-fix ${fix === id ? 'is-on' : ''}`} onClick={() => { vib(6); onFix?.(id); }}>
            <span className="p-radio" aria-hidden /><span className="p-method-txt"><span className="p-method-title">{t}</span><span className="p-method-meta">{m}</span></span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------- E3 offline ---------- */
export function OfflineView({ s, from = P.ari, to = P.nic }: { s: Settlement; from?: Person; to?: Person }) {
  return (
    <>
      <section className="p-scard is-sunken p-offline" role="status">
        <div className="p-dispute-head"><Icon name="globe" size={20} /><b>No connection</b></div>
        <p>Saved on this phone. It goes to {to.name} as soon as you’re back online.</p>
      </section>
      <PairHero from={from} to={to} amount={s.paid} caption={`Marked ${(s.markedAt ?? '10:39 PM').replace(/^(\d{1,2}:\d\d):\d\d/, '$1')}, not sent yet.`} pill={<SPill>QUEUED</SPill>} />
      <Readout title="SYNC" rows={[['queue', '1 payment'], ['last sync', '10:31:48 PM'], ['retry', 'on reconnect, then every 30 s'], ['balances', `pending until ${to.name} confirms`]]} />
    </>
  );
}

/** A complete settlement record for stories and deep links. */
export function demoSettlement(over: Partial<Settlement> = {}): Settlement {
  return { id: 'stl_7Q2K-0042', clientId: 'c_ari_7Q2K_0042', from: 'ari', to: 'nic', due: 42.1, paid: 42, carry: 0.1, method: 'cash', status: 'pending', markedAt: '10:39:04 PM', provenance: NIC_PROVENANCE, ...over };
}

/* ---------- Money v4 parts (Figma 09a, 09b, 09) ---------- */
type E = { from: string; to: string; amt: number };
/** YOUR BALANCE overline, the serif amount in owe or owed, and one sentence. */
export function MoneyBalance({ net, caption, compact }: { net: number; caption: React.ReactNode; compact?: boolean }) {
  const tone = net < -0.004 ? 'is-owe' : net > 0.004 ? 'is-owed' : '';
  return (
    <section className={`p-mbal ${compact ? 'is-compact' : ''}`} aria-live="polite">
      <p className="p-overline-s p-mbal-over">YOUR BALANCE</p>
      <p className={`p-mbal-amt tu-num ${tone}`}>{net > 0.004 ? '+' : ''}{usd2(Math.abs(net) < 0.005 ? 0 : net)}</p>
      <p className="p-mbal-cap">{caption}</p>
    </section>
  );
}
const IOU_ORDER = ['ari>tomas', 'tomas>nic', 'ren>ari', 'mara>joao', 'mara>sofia', 'sofia>joao'];
const iouRank = (e: E) => { const i = IOU_ORDER.indexOf(`${e.from}>${e.to}`); return i < 0 ? 99 : i; };
/** The six IOUs as a mono log. Rows that involve you read in text/primary. */
export function IouLog({ raw, people, me = 'ari' }: { raw: E[]; people: Record<string, Person>; me?: string }) {
  const sum = raw.reduce((a, e) => a + e.amt, 0);
  return (
    <section className="p-mlog" aria-label={`${raw.length} IOUs, ${usd2(sum)} moved`}>
      <p className="p-mlog-head tu-num">IOUS · {raw.length} · {usd2(sum)} MOVED</p>
      <table><tbody>{[...raw].sort((a, b) => iouRank(a) - iouRank(b)).map(e => <tr key={e.from + e.to} className={e.from === me || e.to === me ? 'is-me' : ''}><td>{people[e.from].name}{e.from === me ? ' (you)' : ''}</td><td className="p-mlog-ar">→</td><td>{people[e.to].name}{e.to === me ? ' (you)' : ''}</td><td className="tu-num">{usd2(e.amt)}</td></tr>)}</tbody></table>
    </section>
  );
}
/** NET = PAID − SHARE, sorted from most owed to most owing. */
export function NetLog({ nets, people, me = 'ari' }: { nets: Record<string, number>; people: Record<string, Person>; me?: string }) {
  const grp = (v: number) => (v > 0.004 ? 0 : v < -0.004 ? 2 : 1);
  const ids = Object.keys(nets).sort((a, b) => grp(nets[a]) - grp(nets[b]) || Math.abs(nets[a]) - Math.abs(nets[b]));
  const sigma = Object.values(nets).reduce((a, v) => a + v, 0);
  return (
    <section className="p-mlog is-net">
      <p className="p-mlog-head tu-num">NET = PAID − SHARE · Σ {Math.abs(sigma).toFixed(2)}</p>
      <table><tbody>{ids.map(id => { const v = nets[id]; const tone = v > 0.004 ? 'is-owed' : v < -0.004 ? 'is-owe' : 'is-zero'; return (
        <tr key={id} className={tone}><td>{people[id].name}{id === me ? ' (you)' : ''}</td><td className="tu-num p-mlog-net">{v > 0.004 ? '+' : ''}{num(Math.abs(v) < 0.005 ? 0 : v)}</td></tr>); })}</tbody></table>
    </section>
  );
}
/** Pair chip: the person's photo when we have one (v5.1 hi-fi 09 rows), initials otherwise. */
function PChip({ p, id }: { p: Person; id: string }) {
  return AVATAR[id] ? <img className="p-prow-chip is-photo" src={AVATAR[id]} alt="" width={32} height={32} /> : <span className="p-prow-chip">{p.initials}</span>;
}
export const PLAN_REASON: Record<string, string> = { 'ari>nic': 'Tejo boat tour, via Tomás', 'ren>ari': 'Dinner minus Fado tickets', 'mara>joao': 'Flat deposit, via Sofia' };
/** Your payment first, then money coming to you, then everyone else. */
export const planRank = (e: E, me: string) => (e.from === me ? 0 : e.to === me ? 1 : 2);
/** Solved plan rows on the canvas: two chips with a small arrow, who pays whom, the reason, and the amount. */
export function PairRows({ plan, people, me = 'ari', onRow }: { plan: E[]; people: Record<string, Person>; me?: string; onRow?: (e: E) => void }) {
  return (
    <div className="p-prows">{[...plan].sort((a, b) => planRank(a, me) - planRank(b, me)).map(e => { const tone = e.from === me ? 'is-owe' : e.to === me ? 'is-owed' : ''; const nm = (id: string) => (id === me ? 'You' : people[id].name); return (
      <button key={e.from + e.to} type="button" className="p-prow" onClick={() => onRow?.(e)} disabled={!onRow}>
        <span className="p-prow-pair" aria-hidden><PChip p={people[e.from]} id={e.from} /><svg width="12" height="8" viewBox="0 0 12 8"><path d="M1 4h9M7.5 1.5 10 4 7.5 6.5" /></svg><PChip p={people[e.to]} id={e.to} /></span>
        <span className="p-prow-txt"><b>{nm(e.from)} → {nm(e.to)}</b><span>{PLAN_REASON[`${e.from}>${e.to}`] ?? ''}</span></span>
        <span className={`p-prow-amt tu-num ${tone}`}>{usd2(e.amt)}</span>
      </button>); })}</div>
  );
}
