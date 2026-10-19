import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { HeaderMenu } from '../components/beyond/headermenu';
import { AVATAR } from '../assets/solver-assets';
import { photo } from '../lib/data';

const meta: Meta = { title: 'Components/Full JTBD analysis/Header menu', tags: ['autodocs'],
  parameters: { screen: 'full', docs: { description: { component: 'One-row header for top-level screens: avatar or Back, the page title, and one glass menu button. The button grows leftward into a capsule of five shortcuts (Notifications, Album, Add expense, Invite, Settings) while the title steps aside. Inset 12px from the screen edges with glass elevation, never full bleed. Escape, tap outside or scroll closes it; arrow keys move between shortcuts. Reduce Motion: crossfade only.' } } } };
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
