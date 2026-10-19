import React from 'react';
import './beyond.css';
import { BIcon, BIconName } from './icons';
import { Avatar } from '../core';
import { AppMark } from '../Icon';
import type { Person } from '../../lib/data';
import { Act } from '../../lib/beyond';

const KIND_ICON: Record<Act['kind'], BIconName> = { vote: 'poll', photo: 'images', expense: 'receipt', settle: 'cash', closed: 'checkCircle', join: 'personAdd', poll: 'poll' };

/* ---------------- ActivityItem ---------------- */
export function ActivityItem({ act, person, onAction, onOpen }: { act: Act; person: Person; onAction?: () => void; onOpen?: () => void }) {
  return (
    <li className={`b-act-item ${act.unread ? 'is-unread' : ''}`}>
      <button type="button" className="b-act-main" onClick={onOpen}>
        <span className="b-act-av"><Avatar person={person} size={36} ring="none" /><span className={`b-act-kind is-${act.kind}`}><BIcon name={KIND_ICON[act.kind]} size={12} /></span></span>
        <span className="b-act-text"><span>{act.text}</span><small className="tu-num">{act.time}</small></span>
        {act.thumb && <img src={act.thumb} alt="" className="b-act-thumb" />}
      </button>
      {act.action && <button type="button" className="b-pillbtn" onClick={onAction}>{act.action}</button>}
      {act.unread && <span className="b-unread" aria-label="Unread" />}
    </li>
  );
}

/* ---------------- NotificationBanner (lock screen, actionable) ---------------- */
export function NotificationBanner({ title, body, time, actions, expanded, onAction, onToggle, thumb }:
  { title: string; body: string; time: string; actions?: string[]; expanded?: boolean; onAction?: (a: string) => void; onToggle?: () => void; thumb?: string }) {
  return (
    <div className={`b-notif ${expanded ? 'is-open' : ''}`}>
      <button type="button" className="b-notif-main" onClick={onToggle} aria-expanded={expanded}>
        <AppMark size={36} />
        <span className="b-notif-text"><span className="b-notif-top"><b>{title}</b><small className="tu-num">{time}</small></span><span>{body}</span></span>
        {thumb && <img src={thumb} alt="" />}
      </button>
      {expanded && actions && <div className="b-notif-actions">{actions.map(a => <button key={a} type="button" onClick={() => onAction?.(a)}>{a}</button>)}</div>}
    </div>
  );
}

/* ---------------- LockScreen ---------------- */
export function LockScreen({ time, date, wallpaper, children }: { time: string; date: string; wallpaper: string; children: React.ReactNode }) {
  return (
    <div className="b-lock">
      <img src={wallpaper} alt="" className="b-lock-bg" />
      <div className="b-lock-clock"><small>{date}</small><b className="tu-num">{time}</b></div>
      <div className="b-lock-stack">{children}</div>
      <div className="b-lock-foot" aria-hidden><span><BIcon name="sparkleX" size={20} /></span><span><BIcon name="cameraX" size={20} /></span></div>
    </div>
  );
}
