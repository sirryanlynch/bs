import React, { useRef, useState } from 'react';
import './beyond.css';
import { BIcon, BIconName } from './icons';
import { PlanItem } from '../../lib/beyond';
import { useReducedMotion } from '../../lib/PrismRoot';

const PARTS: { id: PlanItem['part']; label: string; icon: BIconName }[] = [
  { id: 'morning', label: 'Morning', icon: 'sunny' }, { id: 'afternoon', label: 'Afternoon', icon: 'sun' }, { id: 'evening', label: 'Evening', icon: 'moon' },
];

/* ---------------- DayTabs ---------------- */
export function DayTabs({ days, value, today, onChange }: { days: { id: string; dow: string; n: number }[]; value: string; today?: string; onChange?: (id: string) => void }) {
  return (
    <div className="b-days" role="tablist" aria-label="Trip days">
      {days.map(d => (
        <button key={d.id} type="button" role="tab" aria-selected={value === d.id} className={`b-day ${value === d.id ? 'is-on' : ''}`} onClick={() => onChange?.(d.id)}>
          <small>{d.dow}</small><b className="tu-num">{d.n}</b>{today === d.id && <span className="b-day-dot" aria-label="today" />}
        </button>
      ))}
    </div>
  );
}

/* ---------------- TimelineItem ---------------- */
export function TimelineItem({ item, dragging, landed, onEdit, onOpen, handle }:
  { item: PlanItem; dragging?: boolean; landed?: boolean; onEdit?: () => void; onOpen?: () => void; handle?: React.ReactNode }) {
  return (
    <div className={`b-tli is-${item.kind ?? 'plan'} ${dragging ? 'is-drag' : ''} ${landed ? 'is-landed' : ''}`}>
      <span className="b-tli-time tu-num">{item.time.replace(' ', '\u00a0')}</span>
      <span className="b-tli-node" aria-hidden><BIcon name={item.icon as BIconName} size={14} /></span>
      <div className="b-tli-card">
        <button type="button" className="b-tli-main" onClick={onOpen ?? onEdit}>
          {item.kind === 'booked' && <span className="b-tli-badge"><BIcon name="check" size={12} />Booked</span>}
          {item.kind === 'idea' && <span className="b-tli-badge is-idea">Idea from {item.by}</span>}
          <b>{item.title}</b>{item.place && <small>{item.place}</small>}
        </button>
        <button type="button" className="b-tli-edit" onClick={onEdit} aria-label={`Edit ${item.title}`}><BIcon name="edit" size={20} /></button>
        {handle}
      </div>
    </div>
  );
}

/* ---------------- DayTimeline ---------------- */
/** Morning, afternoon, evening. Drag by the grip, or focus the grip and use the arrow keys; every move is announced. */
export function DayTimeline({ items, onReorder, onEdit, onOpen, onAdd, landedId }:
  { items: PlanItem[]; onReorder?: (items: PlanItem[], moved: PlanItem) => void; onEdit?: (id: string) => void; onOpen?: (id: string) => void; onAdd?: (part: PlanItem['part']) => void; landedId?: string }) {
  const reduce = useReducedMotion();
  const [drag, setDrag] = useState<{ id: string; dy: number; startY: number } | null>(null);
  const [msg, setMsg] = useState('');
  const refs = useRef<Record<string, HTMLLIElement | null>>({});
  const move = (id: string, dir: -1 | 1) => {
    const i = items.findIndex(x => x.id === id); const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items]; const [it] = next.splice(i, 1); next.splice(j, 0, it);
    const part = items[j].part; const moved = { ...it, part };
    next[j] = moved;
    onReorder?.(next, moved);
    setMsg(`${it.title} moved ${dir < 0 ? 'up' : 'down'}, now ${j + 1} of ${items.length}${part !== it.part ? `, in the ${part}` : ''}`);
  };
  const onDown = (e: React.PointerEvent, id: string) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); setDrag({ id, dy: 0, startY: e.clientY }); };
  const onMove = (e: React.PointerEvent) => {
    if (!drag) return; const dy = e.clientY - drag.startY; const el = refs.current[drag.id]; const h = (el?.offsetHeight ?? 64) + 8;
    if (Math.abs(dy) > h * 0.6) { move(drag.id, dy > 0 ? 1 : -1); setDrag({ ...drag, startY: drag.startY + (dy > 0 ? h : -h), dy: dy - (dy > 0 ? h : -h) }); }
    else setDrag({ ...drag, dy });
  };
  const onUp = () => setDrag(null);
  return (
    <div className="b-dtl">
      {PARTS.map(part => {
        const list = items.filter(i => i.part === part.id);
        return (
          <section key={part.id} className="b-dtl-part" aria-label={part.label}>
            <h3 className="b-dtl-head"><BIcon name={part.icon} size={20} />{part.label}<button type="button" className="b-dtl-add" onClick={() => onAdd?.(part.id)} aria-label={`Add to ${part.label.toLowerCase()}`}><BIcon name="add" size={20} /></button></h3>
            <ol className="b-dtl-list">
              {list.map(it => (
                <li key={it.id} ref={el => (refs.current[it.id] = el)} style={drag?.id === it.id && !reduce ? { transform: `translateY(${drag.dy}px)` } : undefined}>
                  <TimelineItem item={it} dragging={drag?.id === it.id} landed={landedId === it.id} onEdit={() => onEdit?.(it.id)} onOpen={onOpen ? () => onOpen(it.id) : undefined}
                    handle={<button type="button" className="b-grip" aria-label={`Reorder ${it.title}. Use arrow up and down.`}
                      onPointerDown={e => onDown(e, it.id)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
                      onKeyDown={e => { if (e.key === 'ArrowUp') { e.preventDefault(); move(it.id, -1); } if (e.key === 'ArrowDown') { e.preventDefault(); move(it.id, 1); } }}>
                      <BIcon name="grip" size={20} /></button>} />
                </li>
              ))}
              {!list.length && <li className="b-dtl-empty"><button type="button" onClick={() => onAdd?.(part.id)}><BIcon name="add" size={20} />Add something for the {part.label.toLowerCase()}</button></li>}
            </ol>
          </section>
        );
      })}
      <p className="sr-only" aria-live="assertive">{msg}</p>
    </div>
  );
}
