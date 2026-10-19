import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../Icon';
import './actioninbox.css';

/**
 * v5.4 Up next: the action inbox in the top nav. It holds only things that need you (a poll to vote on, a request
 * to pay); the bell keeps everything informational. A small Iris pill with a stack glyph and a count sits next to
 * the menu button; it opens a short glass list of action cards, and each card goes straight into the action.
 * Hidden when there is nothing to do. Reduce Motion: fade only.
 */
export type ActionItem = { id: string; kind: 'vote' | 'pay' | 'confirm'; title: string; meta: string; cta: string; avatar?: string; due?: string };

export function UpNextPill({ count, open, onClick, light }: { count: number; open?: boolean; onClick?: () => void; light?: boolean }) {
  return (
    <button type="button" className={`b-un-pill ${open ? 'is-open' : ''} ${light ? 'is-light' : ''}`} onClick={onClick} aria-expanded={open} aria-haspopup="dialog"
      aria-label={count === 0 ? 'Up next, nothing needs you' : `Up next, ${count} ${count === 1 ? 'thing needs' : 'things need'} you`}>
      <Icon name="stack" size={18} fill={count > 0} />{count > 0 && <span className="b-un-n tu-num">{count}</span>}
    </button>
  );
}

export function ActionCard({ a, onAct, i = 0 }: { a: ActionItem; onAct?: (id: string) => void; i?: number }) {
  return (
    <button type="button" className={`b-un-card is-${a.kind}`} style={{ ['--i' as any]: i }} onClick={() => onAct?.(a.id)} aria-label={`${a.title}. ${a.meta}. ${a.cta}`}>
      <span className="b-un-lead" aria-hidden>{a.avatar ? <img src={a.avatar} alt="" /> : <Icon name={a.kind === 'vote' ? 'poll' : 'cash'} size={20} />}
        {a.avatar && <i className="b-un-badge"><Icon name={a.kind === 'vote' ? 'poll' : 'cash'} size={12} /></i>}</span>
      <span className="b-un-t"><b>{a.title}</b><small className="tu-num">{a.meta}</small></span>
      <span className="b-un-cta">{a.cta}</span>
    </button>
  );
}

/** The list panel. `inline` renders it in place (Storybook); in the header it drops under the bar. */
export function ActionList({ items, onAct, onClose, inline }: { items: ActionItem[]; onAct?: (id: string) => void; onClose?: () => void; inline?: boolean }) {
  return (
    <div className={`b-un-panel ${inline ? 'is-inline' : ''}`} role="dialog" aria-label="Up next">
      <div className="b-un-head"><b>Up next</b><small className="tu-num">{items.length ? `${items.length} ${items.length === 1 ? 'thing needs' : 'things need'} you` : 'Nothing needs you'}</small>
        {onClose && <button type="button" className="b-un-x" onClick={onClose} aria-label="Close Up next"><Icon name="close" size={16} /></button>}</div>
      {items.length === 0 && <div className="b-un-zero"><span className="b-un-zero-ico"><Icon name="check" size={22} /></span><b>You’re all caught up</b><small>Votes and payment requests land here when your crew needs you.</small></div>}
      <div className="b-un-list">{items.map((a, i) => <ActionCard key={a.id} a={a} i={i} onAct={onAct} />)}</div>
      <p className="b-un-foot">Updates live in the bell.</p>
    </div>
  );
}

/** Pill + panel, self-contained. Closes on an outside tap or Escape. */
export function ActionInbox({ items, onAct, light, onOpenChange, defaultOpen = false }: { items: ActionItem[]; onAct?: (id: string) => void; light?: boolean; onOpenChange?: (o: boolean) => void; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { onOpenChange?.(open); if (!open) return;
    const down = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const t = setTimeout(() => (ref.current?.querySelector('.b-un-card') as HTMLElement | null)?.focus({ preventScroll: true }), 80);
    document.addEventListener('pointerdown', down, true); document.addEventListener('keydown', key);
    return () => { clearTimeout(t); document.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key); };
  }, [open]);
  if (!items.length) return null;
  return (
    <div className={`b-un ${open ? 'is-open' : ''}`} ref={ref}>
      <UpNextPill count={items.length} open={open} light={light} onClick={() => setOpen(o => !o)} />
      <div className="b-un-drop" aria-hidden={!open}>{open && <ActionList items={items} onClose={() => setOpen(false)} onAct={id => { setOpen(false); onAct?.(id); }} />}</div>
    </div>
  );
}
