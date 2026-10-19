import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Stepper } from '../components/beyond/stepper';
import { Label } from './_helpers';
import { Button } from '../components/core';

const meta: Meta = { title: 'Components/Full JTBD analysis/Stepper', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'One progress stepper for every multi-step flow: Explore (Find a place), Create trip and Add expense. A top row with a fixed Back slot, a centered "Step n of N" mono caption and a fixed Skip slot, then a thin segmented bar (4 px, 2 px radius, 4 px gaps). Iris fills completed and current steps over 200 ms, instantly with Reduce Motion. Completed segments are tappable to go back. In the app the nav bar already has Back, so screens pass Skip only, and only on optional steps. Back in the stepper is for hosts without a nav back.' } } } };
export default meta;
type St = StoryObj;
const EXPLORE = ['Getting there', 'How long', 'What kind', 'Picks ready'];
const CREATE = ['Where to', 'Dates', 'Cover photo', 'Starter budget', 'Invite crew'];
const EXPENSE = ['Line items', 'Assign to people', 'Split mode', 'Tip and tax', 'Review'];

function Live({ steps, optional, withBack }: { steps: string[]; optional: number[]; withBack?: boolean }) {
  const [c, setC] = useState(1);
  return <>
    <Stepper steps={steps} current={c} onStep={setC} onBack={withBack ? () => setC(x => Math.max(0, x - 1)) : undefined} onSkip={optional.includes(c) ? () => setC(x => Math.min(steps.length - 1, x + 1)) : undefined} />
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
      <Button label="Next step" size="small" variant="secondary" onClick={() => setC(x => Math.min(steps.length - 1, x + 1))} />
      <Button label="Reset" size="small" variant="plain" onClick={() => setC(0)} />
    </div>
  </>;
}
export const Explore: St = { name: 'Explore: 4 steps, Skip on 1 to 3', render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} /> };
export const States: St = { name: 'States', render: () => <>
  <Label>Step 1 of 4, Skip</Label><Stepper steps={EXPLORE} current={0} onSkip={() => {}} />
  <Label>Step 2 of 4, Skip (nav bar has Back)</Label><Stepper steps={EXPLORE} current={1} onSkip={() => {}} onStep={() => {}} />
  <Label>Step 3 of 4, Back and Skip (host without nav back)</Label><Stepper steps={EXPLORE} current={2} onBack={() => {}} onSkip={() => {}} onStep={() => {}} />
  <Label>Step 4 of 4, Picks ready</Label><Stepper steps={EXPLORE} current={3} onStep={() => {}} />
</> };
export const CreateTrip: St = { name: 'Create trip: 5 steps, Skip on 3 to 5', render: () => <Live steps={CREATE} optional={[2, 3, 4]} /> };
export const AddExpense: St = { name: 'Add expense: 5 steps, Skip on 2 to 4', render: () => <Live steps={EXPENSE} optional={[1, 2, 3]} /> };
export const WithBack: St = { name: 'With Back (no nav bar)', render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} withBack /> };
export const Reduce: St = { name: 'Reduce Motion: instant fill', globals: { motion: 'reduce' }, render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} /> };
export const Dark: St = { name: 'Dark', globals: { theme: 'dark' }, render: () => <Live steps={EXPLORE} optional={[0, 1, 2]} /> };
