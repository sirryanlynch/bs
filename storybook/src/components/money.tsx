import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Avatar, Button, IconButton, useCountUp } from './core';
import { people as P, Person, usd } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';

/* ---------------- ExpenseRow ---------------- */
export function ExpenseRow({ title, payer, amount, share, date, category = 'fork', excluded = [], state = 'default', splitCount }:
  { title: string; payer: Person; amount: number; share?: number; date?: string; category?: 'fork' | 'wine' | 'bed' | 'tram' | 'plane' | 'receipt'; excluded?: Person[]; state?: 'default' | 'youExcluded' | 'pending' | 'settled'; splitCount?: number }) {
  const youPaid = payer.you;
  return (
    <div className={`p-exp is-${state}`}>
      <span className="p-exp-icon"><Icon name={category} size={20} /></span>
      <div className="p-exp-text">
        <span className="p-exp-title">{title}</span>
        <span className="p-exp-sub">{youPaid ? 'You paid' : `${payer.name} paid`}{date ? ` · ${date}` : ''}{splitCount ? ` · split ${splitCount} ways` : ''}</span>
        {excluded.length > 0 && (
          <span className="p-exp-excl"><Icon name="eyeSlash" size={14} />Not for {excluded.map(p => p.you ? 'you' : p.name).join(' and ')}</span>
        )}
      </div>
      <div className="p-exp-amt">
        <span className="p-exp-total tu-num">{usd(amount)}</span>
        {state === 'youExcluded' ? <span className="p-exp-share is-muted">Not in your split</span>
          : state === 'pending' ? <span className="p-exp-share is-muted">Pending</span>
          : share != null && <span className={`p-exp-share tu-num ${youPaid ? 'is-owed' : 'is-owe'}`}>{youPaid ? `You lent ${usd(amount - share)}` : `Your share ${usd(share)}`}</span>}
      </div>
    </div>
  );
}

/* ---------------- ReceiptSplit ---------------- */
export type ReceiptLine = { item: string; price: number; qty?: number; who: string[] };
export function ReceiptSplit({ venue = 'Taberna da Rua das Flores', lines, members, tip = 0 }: { venue?: string; lines: ReceiptLine[]; members: Person[]; tip?: number }) {
  const [rows, setRows] = useState(lines);
  useEffect(() => setRows(lines), [lines]);
  const subtotal = rows.reduce((a, r) => a + r.price, 0);
  const totals: Record<string, number> = {};
  members.forEach(m => (totals[m.id] = 0));
  rows.forEach(r => r.who.forEach(id => (totals[id] += r.price / r.who.length)));
  const tipK = subtotal ? (subtotal + tip) / subtotal : 1;
  const toggle = (i: number, id: string) => setRows(rs => rs.map((r, j) => j !== i ? r : { ...r, who: r.who.includes(id) ? (r.who.length > 1 ? r.who.filter(x => x !== id) : r.who) : [...r.who, id] }));
  return (
    <div className="p-receipt">
      <div className="p-receipt-paper">
        <header className="p-receipt-head"><span className="p-receipt-venue">{venue}</span><span className="p-receipt-sub">Scanned 10:41 PM · Chiado</span></header>
        {rows.map((r, i) => (
          <div key={r.item} className={`p-receipt-line ${r.who.length < members.length ? 'is-partial' : ''}`}>
            <div className="p-receipt-l1"><span>{r.qty && r.qty > 1 ? <span className="p-receipt-qty tu-num">{r.qty}×</span> : null}{r.item}</span><span className="tu-num">{usd(r.price)}</span></div>
            <div className="p-receipt-who">
              {members.map(m => {
                const on = r.who.includes(m.id);
                return <button key={m.id} type="button" className={`p-receipt-pill ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggle(i, m.id)}>{m.you ? 'You' : m.name}</button>;
              })}
            </div>
          </div>
        ))}
        <div className="p-receipt-sum">
          <div><span>Subtotal</span><span className="tu-num">{usd(subtotal)}</span></div>
          {tip > 0 && <div><span>Service, shared by share</span><span className="tu-num">{usd(tip)}</span></div>}
          <div className="p-receipt-total"><span>Total</span><span className="tu-num">{usd(subtotal + tip)}</span></div>
        </div>
      </div>
      <div className="p-receipt-people">
        {members.map(m => (
          <div key={m.id} className="p-receipt-person"><Avatar person={m} size={28} ring="none" /><span>{m.you ? 'You' : m.name}</span><b className="tu-num">{usd(totals[m.id] * tipK)}</b></div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- DebtSimplify ---------------- */
type Edge = { from: string; to: string; amt: number };
export const rawDebts: Edge[] = [
  { from: 'mara', to: 'joao', amt: 40 }, { from: 'mara', to: 'sofia', amt: 24 }, { from: 'sofia', to: 'joao', amt: 24 },
  { from: 'ari', to: 'tomas', amt: 42.1 }, { from: 'tomas', to: 'nic', amt: 42.1 }, { from: 'ren', to: 'ari', amt: 18.4 },
];
export const simplifiedDebts: Edge[] = [
  { from: 'ari', to: 'nic', amt: 42.1 }, { from: 'ren', to: 'ari', amt: 18.4 }, { from: 'mara', to: 'joao', amt: 64 },
];
const W = 362, H = 310;
const pos: Record<string, [number, number]> = { mara: [70, 44], ari: [70, 160], ren: [70, 266], sofia: [190, 104], tomas: [190, 266], joao: [310, 44], nic: [310, 160] };

/** Six IOUs collapse into three payments: $124.50 moves instead of $190.60. */
export function DebtSimplify({ simplified: simplifiedProp = false, autoplay = true, raw = rawDebts, simple = simplifiedDebts, people = P, onToggle, toggle = true }:
  { simplified?: boolean; autoplay?: boolean; raw?: Edge[]; simple?: Edge[]; people?: Record<string, Person>; onToggle?: (next: boolean) => void; toggle?: boolean }) {
  const net: Record<string, number> = {};
  raw.forEach(e => { net[e.from] = (net[e.from] ?? 0) - e.amt; net[e.to] = (net[e.to] ?? 0) + e.amt; });
  const sum = (l: Edge[]) => l.reduce((a, e) => a + e.amt, 0);
  const ids = Object.keys(pos).filter(id => people[id]);
  const reduce = useReducedMotion();
  const [s, setS] = useState(simplifiedProp);
  useEffect(() => setS(simplifiedProp), [simplifiedProp]);
  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setS(x => !x), 3600);
    return () => clearInterval(t);
  }, [autoplay]);
  const edge = (e: Edge, kind: 'raw' | 'simple') => {
    const [x1, y1] = pos[e.from], [x2, y2] = pos[e.to];
    const a = Math.atan2(y2 - y1, x2 - x1), r = 26;
    const sx = x1 + Math.cos(a) * r, sy = y1 + Math.sin(a) * r, ex = x2 - Math.cos(a) * (r + 6), ey = y2 - Math.sin(a) * (r + 6);
    const len = Math.hypot(ex - sx, ey - sy);
    const visible = kind === 'raw' ? !s : s;
    const mx = (sx + ex) / 2 + (Math.abs(x2 - x1) < 1 ? -36 : 0), my = (sy + ey) / 2;
    return (
      <g key={kind + e.from + e.to} className={`p-debt-edge is-${kind} ${visible ? 'is-on' : ''}`} style={{ ['--len' as any]: len }}>
        <line x1={sx} y1={sy} x2={ex} y2={ey} strokeDasharray={len} strokeDashoffset={visible || reduce ? 0 : len} markerEnd={`url(#arrow-${kind})`} />
        <g transform={`translate(${mx} ${my})`} className="p-debt-label">
          <rect x={-27} y={-11} width={54} height={22} rx={11} />
          <text textAnchor="middle" dy="4" className="tu-num">${e.amt.toFixed(2).replace(/\.00$/, '')}</text>
        </g>
      </g>
    );
  };
  return (
    <div className={`p-debt ${s ? 'is-simple' : ''} ${reduce ? 'is-reduced' : ''}`}>
      <div className="p-debt-head">
        <div><span className="p-debt-count tu-num">{s ? simple.length : raw.length}</span><span className="p-debt-countlabel">{s ? `payments, ${usd(sum(simple))} total` : `IOUs, ${usd(sum(raw))} total`}</span></div>
        {toggle && <button type="button" className="p-debt-switch" onClick={() => (onToggle ? onToggle(!s) : setS(!s))} aria-pressed={s}>{s ? 'Show before' : 'Simplify'}</button>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={(s ? simple : raw).map(e => `${people[e.from].name} pays ${people[e.to].name} ${usd(e.amt)}`).join(', ')}>
        <defs>
          {['raw', 'simple'].map(k => (
            <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M1 1.5 7 5 1 8.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`p-debt-arrow-${k}`} />
            </marker>
          ))}
        </defs>
        {raw.map(e => edge(e, 'raw'))}
        {simple.map(e => edge(e, 'simple'))}
        {ids.map(id => [id, pos[id]] as const).map(([id, [x, y]]) => (
          <g key={id} transform={`translate(${x} ${y})`} className={`p-debt-node ${(net[id] ?? 0) > 0.005 ? 'is-cred' : (net[id] ?? 0) < -0.005 ? 'is-debt' : 'is-zero'}`}>
            <circle r="22" className={`p-debt-node-bg p-avatar-t${people[id].tone}`} />
            <text textAnchor="middle" dy="5">{people[id].initials}</text>
            <text textAnchor="middle" y={y === 160 ? -30 : 38} className="p-debt-name">{people[id].you ? 'You' : people[id].name}</text>
          </g>
        ))}
      </svg>
      <div className="p-debt-legend"><span><i className="is-debt" />Pays</span><span><i className="is-cred" />Gets paid</span></div>
    </div>
  );
}

/* ---------------- PaymentRow ---------------- */
export function PaymentRow({ from, to, amount, state = 'due', method }: { from: Person; to: Person; amount: number; state?: 'due' | 'sending' | 'paid' | 'requested'; method?: string; /** @deprecated actions live in the screen's primary button */ quiet?: boolean }) {
  const youPay = from.you, youGet = to.you;
  return (
    <div className={`p-pay is-${state}`}>
      <span className="p-pay-avs"><Avatar person={from} size={36} ring="none" /><span className="p-pay-arrow"><Icon name="arrowRight" size={14} /></span><Avatar person={to} size={36} ring="none" /></span>
      <div className="p-pay-text">
        <span className="p-pay-title">{youPay ? `You pay ${to.name}` : youGet ? `${from.name} pays you` : `${from.name} pays ${to.name}`}</span>
        <span className="p-pay-sub">{state === 'paid' ? `Paid${method ? ` with ${method}` : ''}` : state === 'sending' ? 'Waiting for confirmation' : state === 'requested' ? 'Reminder sent today' : method ?? 'Not paid yet'}</span>
      </div>
      <div className="p-pay-right">
        <span className={`p-pay-amt tu-num ${youGet ? 'is-owed' : youPay ? 'is-owe' : ''}`}>{usd(amount)}</span>
        {state === 'paid' && <span className="p-pay-done"><Icon name="check" size={14} />Paid</span>}
        {state === 'sending' && <span className="p-spinner p-spinner-sm" aria-label="Sending" />}
      </div>
    </div>
  );
}

/* ---------------- SettleSheet body ---------------- */
export function SettleContent({ from = P.ari, to = P.nic, amount = 42.1, method = 'MB WAY', state = 'review' }:
  { from?: Person; to?: Person; amount?: number; method?: 'MB WAY' | 'Apple Pay' | 'Revolut' | 'Cash'; state?: 'review' | 'sent' }) {
  const v = useCountUp(amount);
  const [m, setM] = useState(method);
  useEffect(() => setM(method), [method]);
  return (
    <div className="p-settle">
      <div className="p-settle-pair">
        <Avatar person={from} size={56} ring="none" />
        <span className="p-settle-line"><Icon name="arrowRight" size={20} /></span>
        <Avatar person={to} size={56} ring="none" />
      </div>
      <p className="p-settle-who">{from.you ? 'You' : from.name} to {to.you ? 'you' : to.name}</p>
      <p className="p-settle-amt tu-num">${v.toFixed(2)}</p>
      <p className="p-settle-note">Your share of Taberna, the Tram 28 passes and the Alfama flat, less the $18.40 Ren owes you</p>
      <div className="p-settle-methods" role="radiogroup" aria-label="Payment method">
        {(['MB WAY', 'Apple Pay', 'Revolut', 'Cash'] as const).map(x => (
          <button type="button" role="radio" aria-checked={m === x} key={x} className={`p-settle-method ${m === x ? 'is-on' : ''}`} onClick={() => setM(x)}>{x}</button>
        ))}
      </div>
      {state === 'review'
        ? <Button label={to.you ? `Mark ${usd(amount)} as received` : `Pay ${usd(amount)} with ${m}`} fullWidth />
        : <div className="p-settle-sent anim-fade"><Icon name="check" size={20} />Sent. {to.you ? 'You' : to.name} will confirm when it lands.</div>}
      <Button label="Pay a different amount" variant="plain" fullWidth />
    </div>
  );
}
