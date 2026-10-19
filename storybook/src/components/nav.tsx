import React, { useState } from 'react';
import { Icon, IconName } from './Icon';
import { IconButton } from './core';

export function NavBar({ title, large = true, back, subtitle, actions = [], displayTitle, glass = true }:
  { title: string; large?: boolean; back?: string; subtitle?: string; actions?: { icon: IconName; label: string; badge?: number }[]; displayTitle?: boolean; glass?: boolean }) {
  return (
    <header className={`p-nav ${large ? 'p-nav-large' : ''}`}>
      <div className="p-nav-bar">
        <div className="p-nav-lead">
          {back && <button type="button" className={`p-nav-back ${glass ? 'tu-glass' : ''}`} aria-label={`Back to ${back}`}><Icon name="chevronLeft" size={20} /></button>}
        </div>
        {!large && <div className="p-nav-inline"><span className="p-nav-inline-title">{title}</span>{subtitle && <span className="p-nav-inline-sub">{subtitle}</span>}</div>}
        <div className="p-nav-actions">{actions.map(a => <IconButton key={a.label} icon={a.icon} label={a.label} badge={a.badge} variant={glass ? 'glass' : 'plain'} />)}</div>
      </div>
      {large && (
        <div className="p-nav-titlewrap">
          {subtitle && <p className="p-nav-eyebrow">{subtitle}</p>}
          <h1 className={displayTitle ? 'p-nav-display' : 'p-nav-title'}>{title}</h1>
        </div>
      )}
    </header>
  );
}

export const defaultTabs: { id: string; label: string; icon: IconName }[] = [
  { id: 'trips', label: 'Trips', icon: 'home' },
  { id: 'polls', label: 'Polls', icon: 'poll' },
  { id: 'plan', label: 'Plan', icon: 'calendar' },
  { id: 'money', label: 'Money', icon: 'wallet' },
];

/** Floating Liquid Glass tab bar with a sliding lens behind the active item, plus a detached search/action bubble. */
export function TabBar({ active = 'trips', tabs = defaultTabs, accessory = 'plus', floating = true, onChange, onAccessory, accessoryLabel, accessoryExpanded }:
  { active?: string; tabs?: typeof defaultTabs; accessory?: 'plus' | 'search' | 'none'; floating?: boolean; onChange?: (id: string) => void; onAccessory?: () => void; accessoryLabel?: string; accessoryExpanded?: boolean }) {
  const [a, setA] = useState(active);
  React.useEffect(() => setA(active), [active]);
  const i = Math.max(0, tabs.findIndex(t => t.id === a));
  return (
    <nav className={`p-tabbar ${floating ? 'p-tabbar-float' : ''}`} aria-label="Main">
      <div className="p-tabbar-pill tu-glass" style={{ ['--n' as any]: tabs.length, ['--i' as any]: i }}>
        <span className="p-tabbar-lens" aria-hidden />
        {tabs.map(t => (
          <button key={t.id} type="button" className={`p-tab ${t.id === a ? 'is-active' : ''}`} aria-current={t.id === a ? 'page' : undefined}
            onClick={() => { setA(t.id); onChange?.(t.id); }}>
            <Icon name={t.icon} size={24} fill={t.id === a} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      {accessory !== 'none' && (
        <button type="button" className={`p-tabbar-acc tu-glass ${accessory === 'plus' ? 'is-accent' : ''}`} aria-label={accessoryLabel ?? (accessory === 'plus' ? 'Add' : 'Search')} aria-haspopup={onAccessory ? 'dialog' : undefined} aria-expanded={onAccessory ? !!accessoryExpanded : undefined} onClick={onAccessory}>
          <Icon name={accessory === 'plus' ? 'plus' : 'search'} size={24} />
        </button>
      )}
    </nav>
  );
}
