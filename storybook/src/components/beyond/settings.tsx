import { Face } from '../settle';
import { AVATAR } from '../../assets/solver-assets';
import React from 'react';
import './beyond.css';
import { BIcon, BIconName } from './icons';
import { Avatar, Toggle } from '../core';
import type { Person } from '../../lib/data';

/* ---------------- SettingsRow ---------------- */
export function SettingsRow({ icon, tone = 'neutral', title, sub, value, toggle, onToggle, chevron, onClick, destructive }:
  { icon?: BIconName; tone?: 'neutral' | 'accent' | 'owed' | 'owe' | 'sky' | 'apricot'; title: string; sub?: string; value?: string; toggle?: boolean; onToggle?: (v: boolean) => void; chevron?: boolean; onClick?: () => void; destructive?: boolean }) {
  const body = (<>
    {icon && <span className={`b-set-ico is-${tone}`}><BIcon name={icon} size={20} /></span>}
    <span className="b-set-text"><b className={destructive ? 'is-destructive' : ''}>{title}</b>{sub && <small>{sub}</small>}</span>
    {value && <span className="b-set-value tu-num">{value}</span>}
    {chevron && <BIcon name="chevronRight" size={20} className="b-muted" />}
  </>);
  if (toggle != null) return <div className="b-set-row">{body}<Toggle checked={toggle} label={title} onChange={onToggle} /></div>;
  if (onClick || chevron) return <button type="button" className="b-set-row" onClick={onClick}>{body}</button>;
  return <div className="b-set-row">{body}</div>;
}
export function SettingsGroup({ title, footer, children }: { title?: string; footer?: string; children: React.ReactNode }) {
  return <section className="b-set-group">{title && <h3>{title}</h3>}<div className="b-set-body">{children}</div>{footer && <p>{footer}</p>}</section>;
}

/* ---------------- ProfileHeader ---------------- */
export function ProfileHeader({ person, full, sub, stats, cover }: { person: Person; full: string; sub: string; stats: [string, string][]; cover?: string }) {
  return (
    <header className={`b-profile ${cover ? 'has-cover' : ''}`}>
      {cover && <div className="b-profile-cover" aria-hidden><img src={cover} alt="" /></div>}
      <span className="b-profile-face">{AVATAR[person.id] ? <Face person={person} size={88} /> : <Avatar person={{ ...person, you: false }} size={72} ring="none" />}</span>
      <h1 className="b-display">{full}</h1>
      <p>{sub}</p>
      <dl className="b-profile-stats">{stats.map(([k, v]) => <div key={k}><dd className="tu-num">{v}</dd><dt>{k}</dt></div>)}</dl>
    </header>
  );
}

/* ---------------- ChoiceList (radio rows) ---------------- */
export function ChoiceList({ options, value, onChange, label }: { options: { id: string; title: string; sub?: string; icon?: BIconName }[]; value: string; onChange?: (id: string) => void; label: string }) {
  return (
    <div className="b-set-body" role="radiogroup" aria-label={label}>
      {options.map(o => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} className="b-set-row" onClick={() => onChange?.(o.id)}>
          {o.icon && <span className="b-set-ico"><BIcon name={o.icon} size={20} /></span>}
          <span className="b-set-text"><b>{o.title}</b>{o.sub && <small>{o.sub}</small>}</span>
          {value === o.id && <BIcon name="check" size={20} className="b-accent" />}
        </button>
      ))}
    </div>
  );
}
