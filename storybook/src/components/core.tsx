import React, { useEffect, useRef, useState } from 'react';
import { Icon, IconName } from './Icon';
import type { Person } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';

/* ---------------- Button ---------------- */
export type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'plain' | 'destructive' | 'surface';
  size?: 'large' | 'medium' | 'small';
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
};
export function Button({ label, variant = 'primary', size = 'large', icon, loading, disabled, fullWidth, onClick }: ButtonProps) {
  return (
    <button type="button" className={`p-btn p-btn-${variant} p-btn-${size} ${fullWidth ? 'p-btn-full' : ''}`}
      disabled={disabled || loading} aria-busy={loading || undefined} onClick={onClick}>
      {loading ? <span className="p-spinner" aria-hidden /> : icon && <Icon name={icon} size={size === 'small' ? 16 : 20} />}
      <span>{loading ? 'Saving' : label}</span>
    </button>
  );
}

/* ---------------- IconButton ---------------- */
export function IconButton({ icon, label, variant = 'glass', size = 44, badge, disabled, onClick }:
  { icon: IconName; label: string; variant?: 'glass' | 'tinted' | 'filled' | 'plain'; size?: 36 | 44 | 52; badge?: number; disabled?: boolean; onClick?: () => void }) {
  return (
    <button type="button" aria-label={label} className={`p-iconbtn p-iconbtn-${variant}`} style={{ width: size, height: size }} disabled={disabled} onClick={onClick}>
      <Icon name={icon} size={size >= 52 ? 24 : size === 36 ? 18 : 21} stroke={1.9} />
      {badge ? <span className="p-badge" aria-label={`${badge} new`}>{badge}</span> : null}
    </button>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({ person, size = 36, ring, status }:
  { person: Person; size?: 24 | 28 | 36 | 44 | 56 | 72; ring?: 'none' | 'you' | 'leading' | 'settled'; status?: 'none' | 'voted' | 'pending' }) {
  const r = ring ?? (person.you ? 'you' : 'none');
  return (
    <span className={`p-avatar p-avatar-t${person.tone} p-avatar-ring-${r}`} style={{ width: size, height: size, fontSize: size * 0.4 }}
      role="img" aria-label={person.you ? `${person.name} (you)` : person.name}>
      <span aria-hidden>{person.initials}</span>
      {status && status !== 'none' && <span className={`p-avatar-status p-avatar-status-${status}`} aria-hidden>{status === 'voted' && <Icon name="check" size={14} />}</span>}
    </span>
  );
}

export function AvatarStack({ people, max = 4, size = 28, label }: { people: Person[]; max?: number; size?: 24 | 28 | 36; label?: string }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span className="p-avstack" role="group" aria-label={label ?? `${people.length} people: ${people.map(p => p.name).join(', ')}`}>
      {shown.map(p => <span key={p.id} className="p-avstack-item"><Avatar person={p} size={size} ring="none" /></span>)}
      {rest > 0 && <span className="p-avstack-item p-avstack-more" style={{ width: size, height: size, fontSize: size * 0.38 }}>+{rest}</span>}
    </span>
  );
}

/* ---------------- BalanceChip ---------------- */
export function BalanceChip({ amount, size = 'medium' }: { amount: number; size?: 'small' | 'medium' }) {
  const state = Math.abs(amount) < 0.005 ? 'settled' : amount > 0 ? 'owed' : 'owe';
  const text = state === 'settled' ? 'Settled' : `${state === 'owed' ? 'Owed' : 'You owe'} $${Math.abs(amount).toFixed(2)}`;
  return (
    <span className={`p-balance p-balance-${state} p-balance-${size} tu-num`}>
      {state === 'settled' ? <Icon name="check" size={14} /> : <span className="p-balance-dot" aria-hidden />}
      {text}
    </span>
  );
}

/* ---------------- SegmentedControl ---------------- */
export function SegmentedControl({ options, value, onChange, glass }: { options: string[]; value?: string; onChange?: (v: string) => void; glass?: boolean }) {
  const [v, setV] = useState(value ?? options[0]);
  useEffect(() => { if (value) setV(value); }, [value]);
  const i = Math.max(0, options.indexOf(v));
  return (
    <div className={`p-seg ${glass ? 'p-seg-glass' : ''}`} role="tablist" style={{ ['--n' as any]: options.length, ['--i' as any]: i }}>
      <span className="p-seg-thumb" aria-hidden />
      {options.map(o => (
        <button key={o} role="tab" aria-selected={o === v} className="p-seg-opt" onClick={() => { setV(o); onChange?.(o); }}>{o}</button>
      ))}
    </div>
  );
}

/* ---------------- FilterChip ---------------- */
export function FilterChip({ label, selected, count, icon, onToggle, dismissible }:
  { label: string; selected?: boolean; count?: number; icon?: IconName; onToggle?: () => void; dismissible?: boolean }) {
  const [s, setS] = useState(!!selected);
  useEffect(() => setS(!!selected), [selected]);
  return (
    <button type="button" className={`p-chip ${s ? 'is-on' : ''}`} aria-pressed={s} onClick={() => { setS(!s); onToggle?.(); }}>
      {icon && <Icon name={icon} size={20} />}
      <span>{label}</span>
      {count != null && <span className="p-chip-count tu-num">{count}</span>}
      {dismissible && s && <Icon name="close" size={14} />}
    </button>
  );
}

/* ---------------- TextField / Search ---------------- */
export function TextField({ label, placeholder, value, helper, error, prefix, suffix, kind = 'text', disabled }:
  { label?: string; placeholder?: string; value?: string; helper?: string; error?: string; prefix?: string; suffix?: string; kind?: 'text' | 'search' | 'amount'; disabled?: boolean }) {
  const [v, setV] = useState(value ?? '');
  useEffect(() => setV(value ?? ''), [value]);
  const id = useRef('f' + Math.random().toString(36).slice(2, 7)).current;
  if (kind === 'search') {
    return (
      <label className="p-search">
        <Icon name="search" size={20} />
        <input aria-label={placeholder ?? 'Search'} placeholder={placeholder ?? 'Search'} value={v} onChange={e => setV(e.target.value)} disabled={disabled} />
        {v && <button type="button" className="p-search-clear" aria-label="Clear" onClick={() => setV('')}><span className="p-search-clear-dot"><Icon name="close" size={14} /></span></button>}
      </label>
    );
  }
  return (
    <div className={`p-field ${error ? 'is-error' : ''} ${kind === 'amount' ? 'p-field-amount' : ''} ${disabled ? 'is-disabled' : ''}`}>
      {label && <label htmlFor={id} className="p-field-label">{label}</label>}
      <div className="p-field-box">
        {prefix && <span className="p-field-affix">{prefix}</span>}
        <input id={id} inputMode={kind === 'amount' ? 'decimal' : undefined} placeholder={placeholder} value={v} onChange={e => setV(e.target.value)} disabled={disabled}
          aria-invalid={!!error} aria-describedby={helper || error ? id + 'h' : undefined} className={kind === 'amount' ? 'tu-num' : ''} />
        {suffix && <span className="p-field-affix">{suffix}</span>}
      </div>
      {(error || helper) && <p id={id + 'h'} className="p-field-help">{error ? <><Icon name="warning" size={14} />{error}</> : helper}</p>}
    </div>
  );
}

/* ---------------- Toggle ---------------- */
export function Toggle({ checked, label, disabled, onChange }: { checked?: boolean; label?: string; disabled?: boolean; onChange?: (v: boolean) => void }) {
  const [c, setC] = useState(!!checked);
  useEffect(() => setC(!!checked), [checked]);
  return (
    <button type="button" role="switch" aria-checked={c} aria-label={label} disabled={disabled} className={`p-toggle ${c ? 'is-on' : ''}`}
      onClick={() => { setC(!c); onChange?.(!c); }}>
      <span className="p-toggle-knob" />
    </button>
  );
}

/* ---------------- Stepper ---------------- */
export function Stepper({ value = 1, min = 0, max = 99, label = 'Quantity', format }: { value?: number; min?: number; max?: number; label?: string; format?: (n: number) => string }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <div className="p-stepper" role="group" aria-label={label}>
      <button type="button" aria-label="Decrease" disabled={v <= min} onClick={() => setV(v - 1)}><Icon name="minus" size={20} /></button>
      <span className="p-stepper-val tu-num" aria-live="polite">{format ? format(v) : v}</span>
      <button type="button" aria-label="Increase" disabled={v >= max} onClick={() => setV(v + 1)}><Icon name="plus" size={20} /></button>
    </div>
  );
}

/* ---------------- ListRow ---------------- */
export function ListRow({ title, subtitle, leading, trailing, value, chevron, destructive, onClick }:
  { title: string; subtitle?: string; leading?: React.ReactNode; trailing?: React.ReactNode; value?: string; chevron?: boolean; destructive?: boolean; onClick?: () => void }) {
  const Tag: any = onClick || chevron ? 'button' : 'div';
  return (
    <Tag className={`p-row ${destructive ? 'is-destructive' : ''}`} onClick={onClick} type={Tag === 'button' ? 'button' : undefined}>
      {leading && <span className="p-row-lead">{leading}</span>}
      <span className="p-row-text"><span className="p-row-title">{title}</span>{subtitle && <span className="p-row-sub">{subtitle}</span>}</span>
      {value && <span className="p-row-value tu-num">{value}</span>}
      {trailing}
      {chevron && <Icon name="chevronRight" size={20} className="p-row-chev" />}
    </Tag>
  );
}
export function ListGroup({ header, footer, children, inset = true }: { header?: string; footer?: string; children: React.ReactNode; inset?: boolean }) {
  return (
    <section className={`p-group ${inset ? 'p-group-inset' : ''}`}>
      {header && <h3 className="p-group-header">{header}</h3>}
      <div className="p-group-body">{children}</div>
      {footer && <p className="p-group-footer">{footer}</p>}
    </section>
  );
}

/* ---------------- RowIcon (tinted square) ---------------- */
export function RowIcon({ icon, tone = 'neutral' }: { icon: IconName; tone?: 'neutral' | 'accent' | 'owed' | 'owe' }) {
  return <span className={`p-rowicon p-rowicon-${tone}`}><Icon name={icon} size={20} /></span>;
}

/* ---------------- Count up (amount) ---------------- */
export function useCountUp(target: number, ms = 700) {
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) { setV(target); return; }
    let raf = 0; const t0 = performance.now(); const from = 0;
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / ms); const e = 1 - Math.pow(1 - k, 3); setV(from + (target - from) * e); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [target, reduce]);
  return v;
}
