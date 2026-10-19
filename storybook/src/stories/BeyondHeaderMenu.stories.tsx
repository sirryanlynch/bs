import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { HeaderMenu } from '../components/beyond/headermenu';
import { AVATAR } from '../assets/solver-assets';
import { photo } from '../lib/data';

const meta: Meta = { title: 'Components/Full JTBD analysis/Header menu', tags: ['autodocs'],
  parameters: { screen: 'full', docs: { description: { component: 'One-row header for top-level screens: avatar or Back, the page title, and one glass menu button. The button grows leftward into a capsule of three shortcuts (Notifications, Album, Settings) while the title steps aside. Inset 12px from the screen edges with glass elevation, never full bleed. Escape, tap outside or scroll closes it; arrow keys move between shortcuts. Reduce Motion: crossfade only.' } } } };
export default meta;
type St = StoryObj;
function Demo({ open, back, hero }: { open?: boolean; back?: boolean; hero?: boolean }) {
  const [last, setLast] = useState('');
  return <div className="scr" style={{ position: 'relative', height: 260, overflow: 'hidden', borderRadius: 24, background: hero ? `center/cover url(${photo.roofs})` : 'var(--color-bg-canvas)' }}>
    <HeaderMenu title={hero ? undefined : back ? 'Money' : 'Trips'} sub={back ? 'Whole trip · 7 people' : undefined} avatar={back || hero ? undefined : AVATAR.ari} onBack={back || hero ? () => {} : undefined} light={hero} defaultOpen={open} onPick={setLast} />
    <p style={{ position: 'absolute', left: 20, bottom: 16, margin: 0, color: hero ? '#fff' : undefined }}>{last ? `Picked: ${last}` : 'Tap the menu button'}</p>
  </div>;
}
export const Closed: St = { name: 'Closed', render: () => <Demo /> };
export const Open: St = { name: 'Open', render: () => <Demo open /> };
export const WithBack: St = { name: 'With Back and subtitle', render: () => <Demo back /> };
export const OverPhoto: St = { name: 'Over a photo hero', render: () => <Demo hero open /> };
export const Dark: St = { name: 'Dark', globals: { theme: 'dark' }, render: () => <Demo open /> };
export const Reduce: St = { name: 'Reduce Motion', globals: { motion: 'reduce' }, render: () => <Demo /> };

/* v5.3.1: in-flow screens (Pay, Cash, New poll, Find a place, Add expense, New trip) have no menu. Back or a swipe down leaves the flow. */
export const InFlow: St = { name: 'In a flow: Back only, no menu', render: () => (
  <div className="scr" style={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: 24, background: 'var(--color-bg-canvas)' }}>
    <HeaderMenu title="Cash for Nic" sub="Count it out, then slide" onBack={() => {}} backLabel="Back to Pay Nic" menu={false} />
    <p style={{ position: 'absolute', left: 20, bottom: 16, margin: 0 }}>Tap Back or swipe down to leave.</p>
  </div>) };

/* v5.4 Up next: things that need you, in an Iris pill beside the menu. The bell keeps updates. */
const UPNEXT = [{ id: 'vote', kind: 'vote' as const, title: 'Vote: Dinner tonight', meta: 'Closes 7:30 PM · 3 places', cta: 'Vote' },
  { id: 'pay', kind: 'pay' as const, title: 'Pay Nic $42.10', meta: 'Your one payment · settles your share', cta: 'Pay', avatar: AVATAR.nic }];
const Box = ({ children }: { children: React.ReactNode }) => <div className="scr" style={{ position: 'relative', height: 420, overflow: 'hidden', borderRadius: 24, background: 'var(--color-bg-canvas)' }}>{children}</div>;
export const UpNext: St = { name: 'Up next: pill with count', render: () => <Box><HeaderMenu title="Lisbon Crew" onBack={() => {}} actions={UPNEXT} /></Box> };
export const UpNextOpen: St = { name: 'Up next: open', render: () => <Box><HeaderMenu title="Lisbon Crew" onBack={() => {}} actions={UPNEXT} defaultUpNext /></Box> };
export const UpNextEmpty: St = { name: 'Up next: all caught up', render: () => <Box><HeaderMenu title="Trips" avatar={AVATAR.ari} actions={[]} defaultUpNext /></Box> };
