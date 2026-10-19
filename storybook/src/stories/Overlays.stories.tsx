import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BottomSheet, Modal, CelebrationOverlay } from '../components/overlays';
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
  args: { title: 'Remove Ren from Lisbon?', body: 'Ren owes you €18.40. Settle that first or it stays on your balance.', primary: 'Remove', secondary: 'Cancel', destructive: true },
  render: (a) => <div className="scr"><HomeScreen /><Modal {...a} /></div>,
};

export const Celebration: StoryObj<typeof CelebrationOverlay> = {
  name: 'CelebrationOverlay',
  args: { kind: 'squared', replayKey: 0, secondaryLabel: 'Share the recap' },
  argTypes: { kind: { control: 'inline-radio', options: ['squared', 'pollWon', 'milestone'] }, replayKey: { control: { type: 'number' }, description: 'Change to replay the moment' } },
  parameters: { docs: { description: { story: 'Pearl glass card with a crafted mark: the seven threads let go, the ring closes, a check draws in. The celebration spectrum appears once, as light sweeping the card edge, then settles to a faint rim. Plays once in about 1.4 s and never blocks input. Reduce Motion shows the settled state with no movement.' } } },
  render: (a) => <div className="scr"><HomeScreen /><CelebrationOverlay {...a} /></div>,
};
