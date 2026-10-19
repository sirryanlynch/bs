import React, { useRef } from 'react';
import './beyond.css';
import { BIcon, BIconName } from './icons';
import { ExperienceType, typesFor } from '../../data/experienceTypes';

/**
 * FilterChips: one horizontal, single-select row of experience types.
 * Neutral glass chips, Iris only on the selected chip. Chips with zero items hide themselves.
 * Counts are optional and meant for the itinerary only.
 */
export function FilterChips({ value, onChange, surface = 'explore', counts, showCounts, label = 'Filter by type', noAll }:
  { value: ExperienceType; onChange?: (t: ExperienceType) => void; surface?: 'itinerary' | 'explore' | 'poll' | 'album'; counts?: Partial<Record<ExperienceType, number>>; showCounts?: boolean; label?: string; noAll?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const types = typesFor(surface).filter(t => (t.id === 'all' ? !noAll : !counts || (counts[t.id] ?? 0) > 0));
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = types.findIndex(t => t.id === value); const n = types[(i + (e.key === 'ArrowRight' ? 1 : types.length - 1)) % types.length];
    onChange?.(n.id); e.preventDefault();
    requestAnimationFrame(() => (ref.current?.querySelector('[aria-checked="true"]') as HTMLElement | null)?.focus());
  };
  return (
    <div className="b-fchips" role="radiogroup" aria-label={label} ref={ref} onKeyDown={onKey}>
      {types.map(t => {
        const on = value === t.id; const n = t.id === 'all' ? (counts ? Object.entries(counts).filter(([k]) => k !== 'all').reduce((a, [, v]) => a + (v ?? 0), 0) : undefined) : counts?.[t.id];
        return (
          <button key={t.id} type="button" role="radio" aria-checked={on} tabIndex={on ? 0 : -1} className={`b-fchip ${on ? 'is-on' : ''}`} onClick={() => onChange?.(t.id)}>
            {t.id !== 'all' && <BIcon name={t.icon as BIconName} size={20} />}
            <span>{t.label}</span>
            {showCounts && n != null && <small className="tu-num">{n}</small>}
          </button>
        );
      })}
    </div>
  );
}

/** Wraps a filtered list so items fade and collapse instead of jumping. */
export function FilterItem({ show, children }: { show: boolean; children: React.ReactNode }) {
  return <div className={`b-fitem ${show ? '' : 'is-out'}`} {...(show ? {} : { inert: '' as any, 'aria-hidden': true })}><div className="b-fitem-inner">{children}</div></div>;
}
