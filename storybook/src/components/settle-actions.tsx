import React from 'react';
import './settle-actions.css';
import { Avatar, Button } from './core';
import { BottomSheet } from './overlays';
import { Person } from '../lib/data';

/**
 * v5.6.1 Settle actions: every action YOU need to settle the trip, one fixed-height row (60px) each, approved one by one or all at once.
 * Other people's payments sit below as read-only rows with a quiet Nudge. No accordions; nothing changes height when a status changes.
 */
export type SettleStatus = 'open' | 'pending' | 'sent' | 'paid';
export type SettleAction = { key: string; kind: 'pay' | 'request' | 'other'; who: Person; to?: Person; amt: number; status: SettleStatus; nudged?: boolean };
const usd = (n: number) => `$${n.toFixed(2)}`;
const STATUS: Record<SettleStatus, string> = { open: '', pending: 'Pending', sent: 'Sent', paid: 'Paid' };

function Row({ a, onAct, onNudge }: { a: SettleAction; onAct?: (a: SettleAction) => void; onNudge?: (a: SettleAction) => void }) {
  const title = a.kind === 'pay' ? `Pay ${a.who.name}` : a.kind === 'request' ? `Request from ${a.who.name}` : `${a.who.name} → ${a.to?.name}`;
  const sub = a.kind === 'pay' ? 'You owe' : a.kind === 'request' ? 'Owes you' : 'Not you';
  const btn = a.status === 'open' ? (a.kind === 'pay' ? 'Pay' : a.kind === 'request' ? 'Request' : a.nudged ? '' : 'Nudge') : '';
  return (
    <li className={`p-sa-row is-${a.kind} is-${a.status}`} data-key={a.key}>
      <Avatar person={a.who} size={36} ring="none" />
      <span className="p-sa-t"><b>{title}</b><small><span className="tu-num">{usd(a.amt)}</span> · {sub}</small></span>
      {btn ? <button type="button" className={`p-sa-btn pt-myrow-btn ${a.kind === 'pay' ? 'is-pay' : a.kind === 'other' ? 'is-quiet' : ''}`} aria-label={`${btn} ${a.kind === 'other' ? `${a.who.name}, ${usd(a.amt)} to ${a.to?.name}` : `${a.who.name} ${usd(a.amt)}`}`}
        onClick={() => (a.kind === 'other' ? onNudge?.(a) : onAct?.(a))}>{btn}</button>
        : <span className={`p-sa-st is-${a.status}`} role="status">{a.status === 'paid' && <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M2.5 7.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}{a.status === 'open' ? 'Nudged' : STATUS[a.status]}</span>}
    </li>
  );
}

export function SettleActions({ mine, others = [], onAct, onNudge, title = 'Your actions' }:
  { mine: SettleAction[]; others?: SettleAction[]; onAct?: (a: SettleAction) => void; onNudge?: (a: SettleAction) => void; title?: string }) {
  const left = mine.filter(a => a.status === 'open' || a.status === 'sent' || a.status === 'pending').length;
  return (
    <section className="p-sa" aria-label="Settle actions">
      <p className="p-sa-h"><span>{title}</span><span className="tu-num">{mine.length ? (left ? `${mine.length - left} of ${mine.length} done` : 'All done') : 'Nothing for you'}</span></p>
      {mine.length > 0 && <ul className="p-sa-list">{mine.map(a => <Row key={a.key} a={a} onAct={onAct} />)}</ul>}
      {others.length > 0 && <>
        <p className="p-sa-h is-sub"><span>Between others</span></p>
        <ul className="p-sa-list is-others">{others.map(a => <Row key={a.key} a={a} onNudge={onNudge} />)}</ul>
      </>}
    </section>
  );
}

/** Batch approve: one sheet with the totals out and in, then Approve all. */
export function SettleAllSheet({ actions, onApprove, onClose }: { actions: SettleAction[]; onApprove: () => void; onClose: () => void }) {
  const pays = actions.filter(a => a.kind === 'pay'), reqs = actions.filter(a => a.kind === 'request');
  const out = pays.reduce((s, a) => s + a.amt, 0), inn = reqs.reduce((s, a) => s + a.amt, 0);
  return (
    <BottomSheet title="Settle all" detent="medium" onClose={onClose}>
      <div className="p-sa-sheet">
        <div className="p-sa-tot">
          <div><small>You pay</small><b className="tu-num">{usd(out)}</b><span>{pays.length} {pays.length === 1 ? 'person' : 'people'}</span></div>
          <div><small>You request</small><b className="tu-num is-in">{usd(inn)}</b><span>{reqs.length} {reqs.length === 1 ? 'person' : 'people'}</span></div>
        </div>
        <ul className="p-sa-mini">{actions.map(a => <li key={a.key}><span>{a.kind === 'pay' ? `Pay ${a.who.name}` : `Request from ${a.who.name}`}</span><span className="tu-num">{usd(a.amt)}</span></li>)}</ul>
        <p className="p-sa-note">Payments go with TripUp Pay. Requests send a notification.</p>
        <Button label={`Approve all (${actions.length})`} fullWidth onClick={onApprove} />
        <Button label="Not now" variant="plain" fullWidth onClick={onClose} />
      </div>
    </BottomSheet>
  );
}
