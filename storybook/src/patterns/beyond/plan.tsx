import React from 'react';
import { useFlow, Top, TopBtn, Sheet, FlowTabs } from './kit';
import { Button, SegmentedControl } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { DayTabs, DayTimeline } from '../../components/beyond/plan';
import { FilterChips } from '../../components/beyond/filterchips';
import { DAYS, COMMUNITY, PlanItem } from '../../lib/beyond';
import { TIMES } from '../../components/beyond/pollnew';

export function PlanDayScreen() {
  const { s, d, go } = useFlow(); const pl = s.plan;
  const items = pl.items[pl.day] ?? [];
  const counts = { food: 0, drinks: 0, culture: 0, active: 0, travel: 0 } as Record<string, number>; items.forEach(i => counts[i.xt]++);
  const xt = (pl.xt !== 'all' && !counts[pl.xt]) ? 'all' : pl.xt;
  const shown = items.filter(i => xt === 'all' || i.xt === xt);
  const day = DAYS.find(x => x.id === pl.day)!;
  return (
    <div className="b-scr">
      <div className="b-scroll has-tabs">
        <div className="b-head"><div><p className="b-overline tu-num">{day.dow}, Oct {day.n} · Day {DAYS.indexOf(day) + 1} of {DAYS.length}</p><h1 className="b-title-xl">Plan</h1></div>
          <div className="b-head-tools"><TopBtn icon="poll" label="Start a poll" onClick={() => go('poll/new')} /><TopBtn icon="add" label="Add to the day" accent onClick={() => { d({ t: 'patch', k: 'plan', v: { addPart: 'afternoon' } }); go('plan/add'); }} /></div></div>
        <DayTabs days={DAYS} value={pl.day} today="oct17" onChange={id => d({ t: 'patch', k: 'plan', v: { day: id, landed: undefined } })} />
        <FilterChips value={xt} surface="itinerary" counts={counts} showCounts onChange={t => d({ t: 'patch', k: 'plan', v: { xt: t } })} />
        {items.length ? (
          <DayTimeline items={shown} landedId={pl.landed} onOpen={id => { const it = items.find(i => i.id === id)!; if (it.placeId) go(`place/${it.placeId}`); else { d({ t: 'patch', k: 'plan', v: { editId: id } }); go('plan/edit'); } }}
            onEdit={id => { d({ t: 'patch', k: 'plan', v: { editId: id } }); go('plan/edit'); }}
            onAdd={part => { d({ t: 'patch', k: 'plan', v: { addPart: part } }); go('plan/add'); }}
            onReorder={next => { const hidden = items.filter(i => !next.some(n => n.id === i.id)); d({ t: 'patch', k: 'plan', v: { items: { ...pl.items, [pl.day]: [...next, ...hidden] }, landed: undefined } }); }} />
        ) : <p className="b-empty-line">Nothing planned yet for {day.label}.</p>}
        <p className="b-fine">Drag the grip to reorder, or focus it and press the arrow keys.</p>
      </div>
      <FlowTabs active="plan" />
    </div>
  );
}
export function PlanAddScreen() {
  const { s, d, back, toast } = useFlow(); const pl = s.plan;
  const [custom, setCustom] = React.useState('Ginjinha at A Ginjinha');
  const [ctype, setCtype] = React.useState<import('../../data/experienceTypes').ExperienceType>('drinks');
  const add = (it: Omit<PlanItem, 'id' | 'part'>) => {
    const n: PlanItem = { ...it, id: 'n' + Date.now(), part: pl.addPart } as PlanItem;
    const list = [...(pl.items[pl.day] ?? []), n];
    d({ t: 'patch', k: 'plan', v: { items: { ...pl.items, [pl.day]: list }, landed: n.id, xt: 'all' } }); toast(`Added to the ${pl.addPart}`); back();
  };
  const saved = COMMUNITY.filter(p => s.saved.includes(p.id));
  const src = pl.addTab === 'Saved' ? saved : COMMUNITY.slice(0, 6);
  const time = pl.addPart === 'morning' ? '10:30 AM' : pl.addPart === 'afternoon' ? '3:00 PM' : '10:00 PM';
  return (<>
    <PlanDayScreen />
    <Sheet title={`Add to the ${pl.addPart}`} onClose={back}>
      <SegmentedControl options={['Explore', 'Saved', 'Custom']} value={pl.addTab} onChange={v => d({ t: 'patch', k: 'plan', v: { addTab: v } })} />
      {pl.addTab === 'Custom' ? (
        <div className="b-section">
          <label className="b-search"><BIcon name="edit" size={20} /><input value={custom} onChange={e => setCustom(e.target.value)} aria-label="What's the plan" /></label>
          <FilterChips value={ctype} onChange={setCtype} surface="itinerary" noAll label="Type" />
          <Button label={`Add at ${time}`} fullWidth disabled={!custom.trim()} onClick={() => add({ xt: ctype, time, title: custom, place: 'Added by you', icon: ({ food: 'fork', drinks: 'wine', culture: 'bank', active: 'waves', travel: 'plane' } as const)[ctype as 'food'] ?? 'pin', kind: 'plan' })} />
        </div>
      ) : (
        <div className="b-list">{src.length ? src.map(p => (
          <button key={p.id} type="button" className="b-listrow" onClick={() => add({ xt: p.kind, time, title: p.name, place: `${p.type} · ${p.area}`, icon: p.kind === 'food' ? 'fork' : p.kind === 'drinks' ? 'wine' : 'pin', kind: 'plan', placeId: p.id })}>
            <img className="b-thumb" src={p.photos[0]} alt="" /><span className="b-listrow-text"><b>{p.name}</b><small className="tu-num">{p.type} · {p.walk <= 25 ? `${p.walk} min walk` : `${p.drive} min drive`}</small></span><BIcon name="add" size={20} className="b-accent" />
          </button>)) : <p className="b-empty-line">Nothing saved yet. Save places from Explore.</p>}</div>
      )}
    </Sheet>
  </>);
}
export function PlanEditScreen() {
  const { s, d, back, toast } = useFlow(); const pl = s.plan;
  const items = pl.items[pl.day] ?? []; const it = items.find(i => i.id === pl.editId) ?? items[0];
  const [title, setTitle] = React.useState(it.title); const [time, setTime] = React.useState(it.time);
  const save = (list: PlanItem[], msg: string) => { d({ t: 'patch', k: 'plan', v: { items: { ...pl.items, [pl.day]: list } } }); toast(msg); back(); };
  const i = items.indexOf(it);
  const moveTo = (j: number) => { const n = [...items]; n.splice(i, 1); n.splice(j, 0, { ...it, part: items[j].part }); save(n, 'Moved'); };
  return (<>
    <PlanDayScreen />
    <Sheet title="Edit" size="large" onClose={back} footer={<Button label="Save" fullWidth onClick={() => save(items.map(x => x.id === it.id ? { ...x, title, time } : x), 'Saved')} />}>
      <label className="b-field"><small>Title</small><input value={title} onChange={e => setTitle(e.target.value)} /></label>
      <div className="b-section"><h3 className="b-overline">Time</h3><div className="b-times">{TIMES.map(t => <button key={t} type="button" className={`b-chip is-sm tu-num ${time === t ? 'is-on' : ''}`} aria-pressed={time === t} onClick={() => setTime(t)}>{t}</button>)}</div></div>
      <div className="b-section"><h3 className="b-overline">Order</h3>
        <div className="b-grid2"><Button label="Move up" variant="secondary" size="medium" disabled={i === 0} onClick={() => moveTo(i - 1)} /><Button label="Move down" variant="secondary" size="medium" disabled={i === items.length - 1} onClick={() => moveTo(i + 1)} /></div></div>
      {it.kind === 'booked' && <p className="b-help">This one is booked. Changing the time sends the crew a heads-up.</p>}
      <Button label="Remove from the day" variant="destructive" size="medium" fullWidth onClick={() => save(items.filter(x => x.id !== it.id), 'Removed')} />
    </Sheet>
  </>);
}
