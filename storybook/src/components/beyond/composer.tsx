import React, { useEffect, useRef, useState } from 'react';
import './beyond.css';
import './composer.css';
import { BIcon, BIconName } from './icons';
import { EXPERIENCE_TYPES, ExperienceType } from '../../data/experienceTypes';

/*
 * PollComposer: the new poll as one sentence.
 *   A big editable title, then "A [Food] poll for [Sat, Oct 17 · 8:30 PM], closes [7:30 PM]."
 *   Each bracket is a token; tapping it opens one small glass sheet. Options are a stack of photo tiles.
 *   One "+ Add option" sheet takes a typed option or an Explore pick. One primary action.
 */
export type ComposerDay = { id: string; dow: string; n: number; label: string };
export type ComposerOption = { label: string; from?: string; photo?: string };
export type ComposerPick = { id: string; name: string; meta: string; photo?: string; kind: ExperienceType };
export type ComposerValue = { title: string; category: ExperienceType; day: string; time: string; closes: string; options: ComposerOption[] };

export const COMPOSER_TIMES = ['6:00 AM', '7:30 AM', '9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '6:00 PM', '7:30 PM', '8:30 PM', '10:00 PM', '11:30 PM'];
const TYPE_ICON: Record<string, BIconName> = { food: 'food', drinks: 'martini', culture: 'bank', active: 'waves' };
const TYPES = EXPERIENCE_TYPES.filter(t => t.id !== 'all' && !t.itineraryOnly);
const mins = (t: string) => { const m = t.match(/(\d+):(\d+) (AM|PM)/); if (!m) return 0; return ((+m[1] % 12) + (m[3] === 'PM' ? 12 : 0)) * 60 + +m[2]; };
const LONG: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };

/** "Saturday dinner", "Tuesday drinks": the title the composer suggests until you type your own. */
export function defaultTitle(dow: string, category: ExperienceType, time: string) {
  const m = mins(time); const day = LONG[dow] ?? dow;
  const noun = category === 'food' ? (m < 11 * 60 ? 'breakfast' : m < 16 * 60 ? 'lunch' : 'dinner') : category === 'drinks' ? 'drinks' : category === 'culture' ? 'outing' : 'plans';
  return `${day} ${noun}`;
}

/** Suggested times, relative to "today" in the story. */
function suggestions(days: ComposerDay[], today: string) {
  const i = Math.max(0, days.findIndex(d => d.id === today)); const t = days[i]; const n = days[i + 1];
  const out: { k: string; label: string; sub: string; day: string; time: string }[] = [{ k: 'tonight', label: 'Tonight', sub: `${t.dow}, Oct ${t.n} · 8:30 PM`, day: t.id, time: '8:30 PM' }];
  if (n) out.push({ k: 'am', label: 'Tomorrow morning', sub: `${n.dow}, Oct ${n.n} · 9:00 AM`, day: n.id, time: '9:00 AM' }, { k: 'sun', label: 'Tomorrow at sunrise', sub: `${n.dow}, Oct ${n.n} · 6:00 AM`, day: n.id, time: '6:00 AM' });
  else out.push({ k: 'late', label: 'Later tonight', sub: `${t.dow}, Oct ${t.n} · 10:00 PM`, day: t.id, time: '10:00 PM' }, { k: 'lunch', label: 'Lunch today', sub: `${t.dow}, Oct ${t.n} · 1:00 PM`, day: t.id, time: '1:00 PM' });
  return out;
}

/** Small glass sheet that rises from the bottom of the phone. */
function CSheet({ title, onClose, children, foot }: { title: string; onClose: () => void; children: React.ReactNode; foot?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (ref.current?.querySelector('button, input') as HTMLElement | null)?.focus();
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  return (
    <div className="b-cs-layer">
      <div className="b-cs-scrim" onClick={onClose} />
      <div className="b-cs tu-glass-thick" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <span className="b-cs-grab" aria-hidden />
        <div className="b-cs-head"><h2>{title}</h2><button type="button" className="b-cs-x" onClick={onClose} aria-label="Close"><BIcon name="close" size={16} /></button></div>
        <div className="b-cs-body">{children}</div>
        {foot && <div className="b-cs-foot">{foot}</div>}
      </div>
    </div>
  );
}

/** A photo tile you can swipe left to remove. Delete or Backspace removes it from the keyboard. */
function OptionTile({ o, onRemove, i }: { o: ComposerOption; onRemove: () => void; i: number }) {
  const [dx, setDx] = useState(0); const [gone, setGone] = useState(false); const start = useRef<number | null>(null);
  const end = () => { if (start.current == null) return; start.current = null; if (dx < -96) { setGone(true); setTimeout(onRemove, 220); } else setDx(0); };
  return (
    <li className={`b-ot ${gone ? 'is-gone' : ''} ${dx < -4 || gone ? 'is-open' : ''}`} style={{ ['--i' as any]: i }}>
      <span className="b-ot-under" aria-hidden><BIcon name="close" size={16} />Remove</span>
      <div className={`b-ot-card ${o.photo ? 'has-photo' : 'is-typed'} ${start.current != null ? 'is-drag' : ''}`} tabIndex={0} role="group"
        aria-label={`${o.label}${o.from ? `, ${o.from}` : ''}. Swipe left or press Delete to remove.`}
        style={{ transform: `translateX(${gone ? -420 : dx}px)` }}
        onKeyDown={e => { if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); setGone(true); setTimeout(onRemove, 220); } }}
        onPointerDown={e => { start.current = e.clientX; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
        onPointerMove={e => { if (start.current != null) setDx(Math.min(0, e.clientX - start.current)); }}
        onPointerUp={end} onPointerCancel={end}>
        {o.photo && <img src={o.photo} alt="" draggable={false} />}
        {!o.photo && <span className="b-ot-ico" aria-hidden><BIcon name="edit" size={18} /></span>}
        <span className="b-ot-text"><b>{o.label}</b>{o.from && <small className="tu-num">{o.from}</small>}</span>
      </div>
    </li>
  );
}

export function PollComposer({ value, onChange, days, today, picks, crew = 7, onSend, onBack }: {
  value: ComposerValue; onChange: (v: Partial<ComposerValue>) => void; days: ComposerDay[]; today: string; picks: ComposerPick[]; crew?: number; onSend: () => void; onBack?: () => void;
}) {
  const [sheet, setSheet] = useState<'' | 'type' | 'when' | 'closes' | 'add'>('');
  const [draft, setDraft] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const day = days.find(d => d.id === value.day) ?? days[0];
  const auto = defaultTitle(day.dow, value.category, value.time);
  const typeDef = TYPES.find(t => t.id === value.category) ?? TYPES[0];
  const close = () => setSheet('');
  const added = new Set(value.options.map(o => o.label));
  const addOpt = (o: ComposerOption) => { onChange({ options: [...value.options, o] }); };
  const need = Math.max(0, 2 - value.options.length);
  const ambient = value.options.find(o => o.photo)?.photo;
  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const t = taRef.current; if (t) { t.style.height = '0px'; t.style.height = t.scrollHeight + 'px'; } }, [value.title, auto]);
  const sorted = [...picks].sort((a, b) => (b.kind === value.category ? 1 : 0) - (a.kind === value.category ? 1 : 0)).filter(p => !added.has(p.name)).slice(0, 4);

  return (
    <div className="b-scr b-cmp">
      <div className="b-cmp-amb" aria-hidden>{ambient && <img src={ambient} alt="" />}</div>
      <header className={`b-cmp-head ${scrolled ? 'is-scrolled' : ''}`}>
        <button type="button" className="b-cmp-round tu-glass" onClick={onBack} aria-label="Back"><BIcon name="chevronLeft" size={20} /></button>
        <div className="b-cmp-headt"><b>New poll</b><small>Lisbon Crew · {crew} people</small></div>
        <span className="b-cmp-sp" />
      </header>
      <div className="b-scroll has-cta b-cmp-scroll" onScroll={e => setScrolled((e.currentTarget as HTMLElement).scrollTop > 8)}>
        <section className="b-cmp-hero" aria-label="Poll">
          <label className="b-cmp-title"><span className="sr-only">Poll title</span>
            <textarea ref={taRef} rows={1} value={value.title} placeholder={auto} onChange={e => onChange({ title: e.target.value.replace(/\n/g, ' ') })} />
          </label>
          <p className="b-cmp-sentence">
            <span className="b-nw">A <button type="button" className="b-tok" onClick={() => setSheet('type')} aria-haspopup="dialog" aria-label={`Type: ${typeDef.label}. Change`}><BIcon name={TYPE_ICON[typeDef.id] ?? 'food'} size={16} />{typeDef.label}</button> poll</span>{' '}
            <span className="b-nw">for <button type="button" className="b-tok tu-num" onClick={() => setSheet('when')} aria-haspopup="dialog" aria-label={`When: ${day.label}, ${value.time}. Change`}>{day.dow}, Oct {day.n} · {value.time}</button>,</span>{' '}
            <span className="b-nw">closes <button type="button" className="b-tok tu-num" onClick={() => setSheet('closes')} aria-haspopup="dialog" aria-label={`Closes at ${value.closes}. Change`}>{value.closes}</button>.</span>
          </p>
        </section>

        <section className="b-cmp-opts" aria-label={`${value.options.length} options`}>
          {(value.options.length > 0 || sorted.length === 0) && <p className="b-cmp-k tu-num">{value.options.length ? `${value.options.length} ${value.options.length === 1 ? 'option' : 'options'} · swipe one left to remove it` : 'No options yet'}</p>}
          <ol className="b-ot-list">{value.options.map((o, i) => <OptionTile key={o.label} o={o} i={i} onRemove={() => onChange({ options: value.options.filter(x => x.label !== o.label) })} />)}</ol>
          {value.options.length < 2 && sorted.length > 0 && <div className="b-cmp-sugg"><p className="b-cmp-k">Suggested from Explore</p>
            <ul className="b-cs-picks">{sorted.slice(0, 3).map(p => (
              <li key={p.id}><button type="button" className="b-cs-pick" onClick={() => addOpt({ label: p.name, from: p.meta, photo: p.photo })}>
                {p.photo ? <img src={p.photo} alt="" /> : <span className="b-cs-well" aria-hidden><BIcon name="explore" size={20} /></span>}
                <span className="b-cs-pickt"><b>{p.name}</b><small className="tu-num">{p.meta}</small></span><span className="b-cs-addc" aria-hidden><BIcon name="add" size={16} /></span><span className="sr-only">Add</span></button></li>))}</ul></div>}
          <button type="button" className="b-cmp-add tu-glass" onClick={() => setSheet('add')} aria-haspopup="dialog"><span className="b-cmp-plus" aria-hidden><BIcon name="add" size={18} /></span>Add option</button>
        </section>
      </div>
      <div className="b-cmp-bottom">
        <button type="button" className="b-cmp-cta" disabled={need > 0} onClick={onSend}>{need ? `Add ${need} more ${need === 1 ? 'option' : 'options'}` : 'Send to crew'}</button>
        <p className="b-cmp-rule tu-num">Closes at {value.closes}, or when all {crew} vote. Ties go to you.</p>
      </div>

      {sheet === 'type' && <CSheet title="What kind of plan?" onClose={close}>
        <div className="b-cs-types" role="radiogroup" aria-label="Type">{TYPES.map(t => (
          <button key={t.id} type="button" role="radio" aria-checked={t.id === value.category} className={`b-cs-type ${t.id === value.category ? 'is-on' : ''}`} onClick={() => { onChange({ category: t.id }); close(); }}>
            <span className="b-cs-well" aria-hidden><BIcon name={TYPE_ICON[t.id] ?? 'food'} size={22} /></span><b>{t.label}</b><small>{t.covers}</small></button>))}</div>
      </CSheet>}

      {sheet === 'when' && <CSheet title="When?" onClose={close} foot={<button type="button" className="b-cmp-cta" onClick={close}>Done</button>}>
        <div className="b-cs-sugs">{suggestions(days, today).map(sg => { const on = sg.day === value.day && sg.time === value.time; return (
          <button key={sg.k} type="button" className={`b-cs-sug ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => { onChange({ day: sg.day, time: sg.time }); close(); }}><b>{sg.label}</b><small className="tu-num">{sg.sub}</small>{on && <BIcon name="check" size={18} />}</button>); })}</div>
        <p className="b-cs-k">Or pick a day and time</p>
        <div className="b-cs-days" role="radiogroup" aria-label="Day">{days.map(d => (
          <button key={d.id} type="button" role="radio" aria-checked={d.id === value.day} className={`b-cs-day ${d.id === value.day ? 'is-on' : ''} ${d.id === today ? 'is-today' : ''}`} onClick={() => onChange({ day: d.id })}><small>{d.dow}</small><b className="tu-num">{d.n}</b></button>))}</div>
        <div className="b-cs-times" role="radiogroup" aria-label="Time">{COMPOSER_TIMES.map(t => (
          <button key={t} type="button" role="radio" aria-checked={t === value.time} className={`b-cs-time tu-num ${t === value.time ? 'is-on' : ''}`} onClick={() => onChange({ time: t })}>{t}</button>))}</div>
      </CSheet>}

      {sheet === 'closes' && <CSheet title="Close the poll at" onClose={close}>
        <div className="b-cs-sugs">{['6:00 PM', '7:30 PM', '10:00 PM'].map(t => { const on = t === value.closes; return (
          <button key={t} type="button" className={`b-cs-sug ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => { onChange({ closes: t }); close(); }}><b className="tu-num">{t}</b><small>{t === '7:30 PM' ? 'An hour before dinner' : t === '10:00 PM' ? 'Gives night owls a say' : 'Early, so you can book'}</small>{on && <BIcon name="check" size={18} />}</button>); })}</div>
        <p className="b-cs-note">It also closes as soon as all {crew} have voted.</p>
      </CSheet>}

      {sheet === 'add' && <CSheet title="Add an option" onClose={close}>
        <form className="b-cs-type-in" onSubmit={e => { e.preventDefault(); if (!draft.trim()) return; addOpt({ label: draft.trim(), from: 'Typed by you' }); setDraft(''); close(); }}>
          <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type an option" aria-label="Type an option" />
          <button type="submit" disabled={!draft.trim()}>Add</button>
        </form>
        {sorted.length > 0 && <p className="b-cs-k">From Explore</p>}
        <ul className="b-cs-picks">{sorted.map(p => (
          <li key={p.id}><button type="button" className="b-cs-pick" onClick={() => { addOpt({ label: p.name, from: p.meta, photo: p.photo }); close(); }}>
            {p.photo ? <img src={p.photo} alt="" /> : <span className="b-cs-well" aria-hidden><BIcon name="explore" size={20} /></span>}
            <span className="b-cs-pickt"><b>{p.name}</b><small className="tu-num">{p.meta}</small></span><span className="b-cs-addc" aria-hidden><BIcon name="add" size={16} /></span><span className="sr-only">Add</span></button></li>))}</ul>
      </CSheet>}
    </div>
  );
}
