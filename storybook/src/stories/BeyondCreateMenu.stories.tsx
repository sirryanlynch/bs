import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { CreateMenu, CreateKind } from '../components/beyond/createmenu';
import { TabBar } from '../components/nav';
import { TABS } from '../patterns/beyond/kit';

const meta: Meta = { title: 'Components/Full JTBD analysis/Create menu', tags: ['autodocs'],
  parameters: { screen: 'full', docs: { description: { component: 'The global + sits next to the 5-tab bar (Trips, Plan, Explore, Polls, Money) on every tab. It opens a glass menu: New poll, Add expense, Add to plan, New trip. Escape or the scrim closes it. Reduce Motion drops the scale-in.' } } } };
export default meta;
type St = StoryObj;
function Demo({ open: o = true }: { open?: boolean }) {
  const [open, setOpen] = useState(o); const [last, setLast] = useState<CreateKind | ''>('');
  return <div style={{ position: 'relative', height: 520 }}>
    <p style={{ padding: 16 }}>{last ? `Picked: ${last}` : 'Tap + to open'}</p>
    <TabBar active="polls" tabs={TABS} accessory="plus" accessoryLabel="Create" accessoryExpanded={open} onAccessory={() => setOpen(x => !x)} />
    {open && <CreateMenu onClose={() => setOpen(false)} onPick={k => { setLast(k); setOpen(false); }} />}
  </div>;
}
export const Open: St = { name: 'Open', render: () => <Demo /> };
export const Closed: St = { name: 'Closed', render: () => <Demo open={false} /> };
export const Dark: St = { name: 'Dark', globals: { theme: 'dark' }, render: () => <Demo /> };
export const Reduce: St = { name: 'Reduce Motion', globals: { motion: 'reduce' }, render: () => <Demo /> };
