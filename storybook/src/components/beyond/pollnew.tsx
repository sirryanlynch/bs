import React from 'react';
import './beyond.css';
import { BIcon } from './icons';
import { FilterChips } from './filterchips';
import { ExperienceType } from '../../data/experienceTypes';

/* ---------------- DayTimePicker ---------------- */
export const TIMES = ['6:00 AM', '7:30 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '6:00 PM', '7:30 PM', '8:30 PM', '10:00 PM', '11:30 PM'];
export function DayTimePicker({ days, day, time, onDay, onTime }: { days: { id: string; dow: string; n: number; label: string }[]; day: string; time: string; onDay?: (id: string) => void; onTime?: (t: string) => void }) {
  return (
    <div className="b-dtp">
      <div className="b-days" role="radiogroup" aria-label="Day">
        {days.map(d => <button key={d.id} type="button" role="radio" aria-checked={day === d.id} className={`b-day ${day === d.id ? 'is-on' : ''}`} onClick={() => onDay?.(d.id)}><small>{d.dow}</small><b className="tu-num">{d.n}</b></button>)}
      </div>
      <div className="b-times" role="radiogroup" aria-label="Time">
        {TIMES.map(t => <button key={t} type="button" role="radio" aria-checked={time === t} className={`b-chip is-sm tu-num ${time === t ? 'is-on' : ''}`} onClick={() => onTime?.(t)}>{t}</button>)}
      </div>
    </div>
  );
}

/* ---------------- CategoryPicker ---------------- */
/** The poll composer's type row: the shared experience FilterChips (no All, no Travel). */
export function CategoryPicker({ value, onChange }: { value: ExperienceType; onChange?: (v: ExperienceType) => void }) {
  return <FilterChips value={value} onChange={onChange} surface="poll" noAll label="Type" />;
}

/* ---------------- OptionEditor ---------------- */
export function OptionEditor({ options, onRemove, onAdd, onExplore, draft, onDraft }:
  { options: { label: string; from?: string; photo?: string }[]; onRemove?: (i: number) => void; onAdd?: () => void; onExplore?: () => void; draft: string; onDraft?: (t: string) => void }) {
  return (
    <div className="b-opted">
      <ol className="b-opted-list">
        {options.map((o, i) => (
          <li key={o.label + i} className="b-fadein">
            <span className="b-opted-n tu-num">{String.fromCharCode(65 + i)}</span>
            {o.photo && <img src={o.photo} alt="" />}
            <span className="b-opted-text"><b>{o.label}</b>{o.from && <small>{o.from}</small>}</span>
            <button type="button" className="b-round is-sm" onClick={() => onRemove?.(i)} aria-label={`Remove ${o.label}`}><BIcon name="close" size={14} /></button>
          </li>
        ))}
      </ol>
      <div className="b-opted-add">
        <label className="b-search is-flat"><BIcon name="edit" size={20} /><input value={draft} onChange={e => onDraft?.(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && draft.trim()) onAdd?.(); }} placeholder="Type an option" aria-label="Type an option" /></label>
        <button type="button" className="b-pillbtn" onClick={onAdd} disabled={!draft.trim()}>Add</button>
      </div>
      <button type="button" className="b-listrow is-dashed" onClick={onExplore}><span className="b-ico is-accent"><BIcon name="explore" size={20} /></span><span className="b-listrow-text"><b>Add from Explore</b><small>Places other crews booked and reviewed</small></span><BIcon name="chevronRight" size={20} className="b-muted" /></button>
    </div>
  );
}
