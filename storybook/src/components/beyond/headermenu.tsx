import React, { useEffect, useRef, useState } from 'react';
import './beyond.css';
import './headermenu.css';
import { UpNextPill, ActionList, type ActionItem } from './actioninbox';
import { BIcon, BIconName } from './icons';

/*
 * HeaderMenu: the one-row header on every top-level screen.
 *   An inset glass bar: avatar (or Back) on the left, the page title, and one round menu button on the right.
 *   The menu button grows leftward into a glass capsule of two shortcuts (Notifications, Settings); Up next sits beside it while the title steps aside.
 *   Tap again, tap outside, press Escape or scroll to close. Arrow keys move between shortcuts.
 */
export type HeaderMenuItem = { id: string; label: string; icon: BIconName; dot?: boolean };
export const HEADER_MENU_ITEMS: HeaderMenuItem[] = [
  { id: 'notifications', label: 'Notifications', icon: 'bellX', dot: true },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

export function HeaderMenu({ title, sub, avatar, onAvatar, onBack, backLabel = 'Back', items = HEADER_MENU_ITEMS, dot = true, onPick, light, defaultOpen = false, menu = true, actions = [], onAction, defaultUpNext = false }: {
  title?: string; sub?: string; avatar?: string; onAvatar?: () => void; onBack?: () => void; backLabel?: string;
  items?: HeaderMenuItem[]; dot?: boolean; onPick?: (id: string) => void; light?: boolean; defaultOpen?: boolean;
  /** v5.3.1: false on in-flow screens (Pay, Cash). Those leave with Back or a swipe down, never the menu. */ menu?: boolean;
  /** v5.4 Up next: things that need you (vote, pay). Shown as an Iris pill next to the menu; the bell keeps updates. */ actions?: ActionItem[]; onAction?: (id: string) => void; defaultUpNext?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [un, setUn] = useState(defaultUpNext);
  useEffect(() => { if (open) setUn(false); }, [open]);
  useEffect(() => {
    if (!un) return;
    const down = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setUn(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setUn(false); };
    const t = setTimeout(() => (ref.current?.querySelector('.b-un-card') as HTMLElement | null)?.focus({ preventScroll: true }), 80);
    document.addEventListener('pointerdown', down, true); document.addEventListener('keydown', key);
    return () => { clearTimeout(t); document.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key); };
  }, [un]);
  const ref = useRef<HTMLDivElement>(null); const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => (ref.current?.querySelector('.b-hm-item') as HTMLElement | null)?.focus({ preventScroll: true }), 60);
    const down = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const scroll = (e: Event) => { const root = ref.current?.parentElement; if (root && e.target instanceof Node && root.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', down, true); document.addEventListener('keydown', key); document.addEventListener('scroll', scroll, true);
    return () => { clearTimeout(t); document.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key); document.removeEventListener('scroll', scroll, true); };
  }, [open]);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const els = Array.from(ref.current?.querySelectorAll<HTMLElement>('.b-hm-item') ?? []); const i = els.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return; e.preventDefault(); els[(i + (e.key === 'ArrowRight' ? 1 : els.length - 1)) % els.length].focus();
  };
  return (
    <div className={`b-hm ${open ? 'is-open' : ''} ${light ? 'is-light' : ''}`} ref={ref}>
      <div className="b-hm-bar tu-glass">
        {onBack ? <button type="button" className="b-hm-lead is-back" onClick={onBack} aria-label={backLabel}><BIcon name="chevronLeft" size={20} /></button>
          : avatar ? <button type="button" className="b-hm-lead" onClick={onAvatar} aria-label="Profile"><img src={avatar} alt="" /></button> : null}
        <div className="b-hm-title" aria-hidden={open}>{title && <h1>{title}</h1>}{sub && <small className="tu-num">{sub}</small>}</div>
        {menu && <span className={`b-un ${actions.length ? '' : 'is-zero'}`}><UpNextPill count={actions.length} open={un} light={light} onClick={() => setUn(o => !o)} /></span>}
        {menu ? <><div className="b-hm-menu" style={{ ['--n' as any]: items.length }} role="menu" aria-label="Shortcuts" aria-hidden={!open} onKeyDown={onKey}>
          {items.map((it, i) => (
            <button key={it.id} type="button" role="menuitem" className="b-hm-item" style={{ ['--i' as any]: i }} tabIndex={open ? 0 : -1} aria-label={it.label} title={it.label}
              onClick={() => { setOpen(false); onPick?.(it.id); }}><BIcon name={it.icon} size={20} />{it.dot && dot && <span className="b-hm-dot" aria-hidden />}</button>
          ))}
        </div>
        <button type="button" ref={btn} className="b-hm-btn" aria-expanded={open} aria-haspopup="menu" aria-label={open ? 'Close shortcuts' : `Shortcuts${dot ? ', new activity' : ''}`} onClick={() => setOpen(o => !o)}>
          <span className="b-hm-ico is-grid"><BIcon name="grid" size={20} /></span><span className="b-hm-ico is-x"><BIcon name="close" size={18} /></span>
          {dot && !open && <span className="b-hm-dot" aria-hidden />}
        </button></> : <span className="b-hm-sp" aria-hidden />}
      </div>
      {un && <div className="b-un-drop is-on"><ActionList items={actions} onClose={() => setUn(false)} onAct={id => { setUn(false); onAction?.(id); }} /></div>}
    </div>
  );
}
