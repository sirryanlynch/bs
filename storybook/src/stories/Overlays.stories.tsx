import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BottomSheet, Modal, CelebrationOverlay, SquaredSheet } from '../components/overlays';
import { ListRow, RowIcon } from '../components/core';
import { HomeScreen } from '../patterns/screens';

const meta: Meta = { title: 'Components/Overlays', tags: ['autodocs'], parameters: { screen: 'full' } };
export default meta;

export const Sheet: StoryObj<typeof BottomSheet> = {
  name: 'BottomSheet',
  args: { detent: 'medium', title: 'Add to Lisbon', scrim: true },
  argTypes: { detent: { control: 'inline-radio', options: ['compact', 'medium', 'large'] } },
  render: (a) => (
    <div className="scr"><HomeScreen />
      <BottomSheet {...a}>
        <div className="p-group-body">
          <ListRow leading={<RowIcon icon="receipt" tone="owed" />} title="Expense" subtitle="Scan a receipt or type it in" chevron />
          <ListRow leading={<RowIcon icon="poll" tone="accent" />} title="Poll" subtitle="Let the group decide" chevron />
          <ListRow leading={<RowIcon icon="calendar" />} title="Plan item" subtitle="Time, place, who is in" chevron />
          <ListRow leading={<RowIcon icon="personAdd" />} title="Person" subtitle="Share a code or link" chevron />
        </div>
      </BottomSheet>
    </div>
  ),
};

export const Alert: StoryObj<typeof Modal> = {
  name: 'Modal',
  args: { title: 'Remove Ren from Lisbon?', body: 'Ren owes you $18.40. Settle that first or it stays on your balance.', primary: 'Remove', secondary: 'Cancel', destructive: true },
  render: (a) => <div className="scr"><HomeScreen /><Modal {...a} /></div>,
};

export const Celebration: StoryObj<typeof CelebrationOverlay> = {
  name: 'CelebrationOverlay',
  args: { kind: 'pollWon', replayKey: 0 },
  argTypes: { kind: { control: 'inline-radio', options: ['squared', 'pollWon', 'milestone'] }, replayKey: { control: { type: 'number' }, description: 'Change to replay the moment' } },
  parameters: { docs: { description: { story: 'Pearl glass card with a crafted mark. kind="squared" renders the SquaredSheet below (hi-fi 10). Plays once and never blocks input. Reduce Motion shows the settled state with no movement.' } } },
  render: (a) => <div className="scr"><HomeScreen /><CelebrationOverlay {...a} /></div>,
};

export const Squared: StoryObj<typeof SquaredSheet> = {
  name: 'SquaredSheet (All squared up)',
  args: { replayKey: 0 },
  parameters: { docs: { description: { story: 'Figma hi-fi 10. A glass sheet at 90% over a blurred scrim. The only color moment is one soft spectrum glow behind the 72 px check disc: it blooms in about 900 ms, then holds still while the check draws in. Mono receipt of the three payments, then "Share the recap". Reduce Motion: the glow is static and the sheet fades in over 200 ms.' } } },
  render: (a) => <div className="scr"><HomeScreen /><SquaredSheet {...a} /></div>,
};

export const SquaredCash: StoryObj<typeof SquaredSheet> = {
  name: 'SquaredSheet, cash rounding',
  args: { body: '3 payments, $124.40 handed over, $0.10 carried to your next split.', rows: [['Ari', 'Nic', '$42.00', 'cash ✓'], ['Ren', 'Ari', '$18.40', '10:40 PM'], ['Mara', 'João', '$64.00', 'cash ✓']], total: ['$124.40', '3 of 3'] },
  render: (a) => <div className="scr"><HomeScreen /><SquaredSheet {...a} /></div>,
};
