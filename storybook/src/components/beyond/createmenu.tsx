import React, { useEffect, useRef } from 'react';
import './beyond.css';
import { BIcon, BIconName } from './icons';

export type CreateKind = 'poll' | 'expense' | 'photos' | 'plan' | 'trip';
export const CREATE_ITEMS: { id: CreateKind; title: string; sub: string; icon: BIconName }[] = [
  { id: 'poll', title: 'New poll', sub: 'Any day, time or activity', icon: 'poll' },
  { id: 'expense', title: 'Add expense', sub: 'Scan or type it', icon: 'receiptX' },
  { id: 'photos', title: 'Add photos', sub: 'To the shared album', icon: 'images' },
  { id: 'plan', title: 'Add to plan', sub: 'From Explore or your saves', icon: 'calendarPlus' },
  { id: 'trip', title: 'New trip', sub: 'Start fresh', icon: 'add' },
];

/**
 * CreateMenu: the global + next to the tab bar opens this from every tab.
 * A glass card anchored over the + with five ways to create. Escape or the scrim closes it; focus moves to the first item.
 */
export function CreateMenu({ onPick, onClose, first }: { onPick: (k: CreateKind) => void; onClose: () => void; /** v5.4: at home level New trip comes first */ first?: CreateKind }) {
  const items = first ? [...CREATE_ITEMS.filter(i => i.id === first), ...CREATE_ITEMS.filter(i => i.id !== first)] : CREATE_ITEMS;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    (ref.current?.querySelector('button') as HTMLElement | null)?.focus();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  return (
    <div className="b-cmenu-layer">
      <div className="b-scrim is-soft" onClick={onClose} />
      <div className="b-cmenu tu-glass" role="dialog" aria-modal="true" aria-label="Create" ref={ref}>
        {items.map(it => (
          <button key={it.id} type="button" className="b-cmenu-item" onClick={() => onPick(it.id)}>
            <span className={`b-ico ${it.id === (first ?? 'poll') ? 'is-accent' : ''}`}><BIcon name={it.icon} size={20} /></span>
            <span className="b-listrow-text"><b>{it.title}</b><small>{it.sub}</small></span>
          </button>
        ))}
      </div>
    </div>
  );
}
