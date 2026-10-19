import React, { useEffect, useState } from 'react';
import { Icon, IconName, Render3D, RenderName, AppMark } from './Icon';
import { Avatar, AvatarStack, Button } from './core';
import type { Person } from '../lib/data';
import { people as P } from '../lib/data';

/* ---------------- Toast ---------------- */
export function Toast({ message, tone = 'neutral', action, icon }: { message: string; tone?: 'neutral' | 'success' | 'error'; action?: string; icon?: IconName }) {
  const ic = icon ?? (tone === 'success' ? 'check' : tone === 'error' ? 'warning' : 'info');
  return (
    <div className={`p-toast tu-glass-thick is-${tone} anim-rise`} role="status">
      <span className="p-toast-icon"><Icon name={ic} size={20} /></span>
      <span className="p-toast-msg">{message}</span>
      {action && <button type="button" className="p-toast-action">{action}</button>}
    </div>
  );
}

/* ---------------- Banner ---------------- */
export function Banner({ title, body, tone = 'info', action, onDismiss }: { title: string; body?: string; tone?: 'info' | 'accent' | 'warning' | 'success'; action?: string; onDismiss?: boolean }) {
  const ic: IconName = tone === 'warning' ? 'warning' : tone === 'success' ? 'check' : tone === 'accent' ? 'poll' : 'info';
  return (
    <div className={`p-banner is-${tone}`} role={tone === 'warning' ? 'alert' : 'status'}>
      <span className="p-banner-icon"><Icon name={ic} size={20} /></span>
      <div className="p-banner-text"><b>{title}</b>{body && <span>{body}</span>}{action && <button type="button" className="p-banner-action">{action}</button>}</div>
      {onDismiss && <button type="button" className="p-banner-x" aria-label="Dismiss"><Icon name="close" size={14} /></button>}
    </div>
  );
}

/* ---------------- Notification (iOS lock screen / banner) ---------------- */
export function Notification({ title, body, time = 'now', person, stacked = 0 }: { title: string; body: string; time?: string; person?: Person; stacked?: number }) {
  return (
    <div className="p-notif-wrap">
      <div className="p-notif tu-glass-thick anim-rise" role="status">
        <span className="p-notif-app"><AppMark size={38} /></span>
        <div className="p-notif-text">
          <div className="p-notif-l1"><b>{title}</b><span>{time}</span></div>
          <p>{body}</p>
        </div>
        {person && <span className="p-notif-av"><Avatar person={person} size={28} ring="none" /></span>}
      </div>
      {stacked > 0 && <div className="p-notif-stack" aria-hidden />}
      {stacked > 1 && <div className="p-notif-stack p-notif-stack-2" aria-hidden />}
    </div>
  );
}

/* ---------------- LiveActivity ---------------- */
export function LiveActivity({ kind = 'poll', compact }: { kind?: 'poll' | 'trip' | 'settle'; compact?: boolean }) {
  if (compact) {
    return (
      <div className="p-island" role="status" aria-label="Dinner poll, 5 of 7 voted, closes 19:30">
        <span className="p-island-l"><AppMark size={26} /></span>
        <span className="p-island-cam" aria-hidden />
        <span className="p-island-r tu-num">5/7 · 19:30</span>
      </div>
    );
  }
  return (
    <div className="p-live" role="status">
      {kind === 'poll' && <>
        <div className="p-live-head"><AppMark size={24} /><b>Dinner tonight?</b><span className="p-live-time tu-num">to 19:30</span></div>
        <div className="p-live-bars">
          {[['Taberna da Rua das Flores', 3], ['Cervejaria Ramiro', 2], ['Park Rooftop', 0]].map(([l, v], i) => (
            <div key={l as string} className={`p-live-bar ${i === 0 ? 'is-lead' : ''}`}><span className="p-live-fill" style={{ width: `${((v as number) / 5) * 100}%` }} /><span>{l}</span><b className="tu-num">{v}</b></div>
          ))}
        </div>
        <div className="p-live-foot"><span className="tu-num">5 of 7 voted</span><span>Nic and Ren still to vote</span></div>
      </>}
      {kind === 'trip' && <>
        <div className="p-live-head"><AppMark size={24} /><b>Next: Tram 28 from Martim Moniz</b><span className="p-live-time tu-num">in 25 min</span></div>
        <div className="p-live-progress"><span style={{ width: '62%' }} /><i style={{ left: '62%' }} /></div>
        <div className="p-live-foot"><span>Day 2 of 4</span><span className="tu-num">5 of 8 stops done</span></div>
      </>}
      {kind === 'settle' && <>
        <div className="p-live-head"><AppMark size={24} /><b>Settling Lisbon</b><span className="p-live-time tu-num">2 of 3 paid</span></div>
        <div className="p-live-progress is-owed"><span style={{ width: '66%' }} /></div>
        <div className="p-live-foot"><span>Mara pays João next</span><span className="tu-num">€64.00</span></div>
      </>}
    </div>
  );
}

/* ---------------- EmptyState ---------------- */
export function EmptyState({ render = 'itinerary', title, body, action, secondary }: { render?: RenderName; title: string; body: string; action?: string; secondary?: string }) {
  return (
    <div className="p-empty">
      <div className="p-empty-art anim-float"><Render3D name={render} size={148} /></div>
      <h3 className="p-empty-title">{title}</h3>
      <p className="p-empty-body">{body}</p>
      {action && <Button label={action} icon="plus" />}
      {secondary && <Button label={secondary} variant="plain" size="medium" />}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ variant = 'tripCard' }: { variant?: 'tripCard' | 'row' | 'poll' | 'text' }) {
  if (variant === 'text') return <div className="p-skel-stack" aria-busy aria-label="Loading"><span className="p-skel" style={{ width: '70%' }} /><span className="p-skel" style={{ width: '92%' }} /><span className="p-skel" style={{ width: '48%' }} /></div>;
  if (variant === 'row') return (
    <div className="p-skel-rows" aria-busy aria-label="Loading">
      {[0, 1, 2].map(i => <div key={i} className="p-skel-row"><span className="p-skel p-skel-sq" /><span className="p-skel-col"><span className="p-skel" style={{ width: '60%' }} /><span className="p-skel p-skel-sm" style={{ width: '38%' }} /></span><span className="p-skel" style={{ width: 54 }} /></div>)}
    </div>
  );
  if (variant === 'poll') return (
    <div className="p-skel-card tu-surface" aria-busy aria-label="Loading poll">
      <span className="p-skel p-skel-sm" style={{ width: '40%' }} /><span className="p-skel p-skel-lg" style={{ width: '75%' }} />
      {[0, 1, 2].map(i => <span key={i} className="p-skel p-skel-opt" />)}
    </div>
  );
  return <div className="p-skel p-skel-trip" aria-busy aria-label="Loading trip"><span className="p-skel-trip-line" /><span className="p-skel-trip-line p-skel-trip-line-2" /></div>;
}
