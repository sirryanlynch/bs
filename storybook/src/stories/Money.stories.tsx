import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ExpenseRow, ReceiptSplit, DebtSimplify, PaymentRow, SettleContent } from '../components/money';
import { DebtUntangle } from '../components/untangle';
import { BottomSheet } from '../components/overlays';
import { ListGroup } from '../components/core';
import { people as P, crewWithRen } from '../lib/data';
import { wineReceipt } from '../lib/scenario';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Money', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Jade means money coming to you, rose means you owe. Neither is used for decoration. Amounts are tabular so columns line up.' } } } };
export default meta;

export const Expense: StoryObj<typeof ExpenseRow> = {
  name: 'ExpenseRow',
  args: { title: 'Douro tinto, 2 bottles', amount: 38, share: 7.6, date: 'Fri', category: 'wine', state: 'default', splitCount: 5 },
  argTypes: { state: { control: 'inline-radio', options: ['default', 'youExcluded', 'pending', 'settled'] }, category: { control: 'select', options: ['fork', 'wine', 'bed', 'tram', 'plane', 'receipt'] } },
  render: (a) => (<>
    <ListGroup><ExpenseRow {...a} payer={P.ari} excluded={[P.ren, P.nic]} /></ListGroup>
    <Label>States</Label>
    <ListGroup>
      <ExpenseRow title="Dinner, Taberna da Rua das Flores" payer={P.ari} amount={248.7} share={37.7} date="Fri" category="fork" />
      <ExpenseRow title="Douro tinto, 2 bottles" payer={P.mara} amount={38} share={7.6} date="Sat" category="wine" excluded={[P.ren, P.nic]} splitCount={5} />
      <ExpenseRow title="Ginjinha round" payer={P.joao} amount={14} date="Fri" category="wine" state="youExcluded" excluded={[P.ari]} />
      <ExpenseRow title="Alfama flat, 3 nights" payer={P.sofia} amount={612} share={102} date="Oct 2" category="bed" />
      <ExpenseRow title="Uber from LIS" payer={P.nic} amount={22.4} date="Just now" category="tram" state="pending" />
      <ExpenseRow title="Tram 28 day passes" payer={P.ren} amount={38.4} share={6.4} date="Settled" category="tram" state="settled" />
    </ListGroup>
  </>),
};

export const Receipt: StoryObj<typeof ReceiptSplit> = {
  name: 'ReceiptSplit',
  args: { venue: 'Taberna da Rua das Flores', tip: 0 },
  render: (a) => <ReceiptSplit {...a} lines={wineReceipt} members={crewWithRen} />,
};

export const Simplify: StoryObj<typeof DebtSimplify> = {
  name: 'DebtSimplify',
  args: { simplified: false, autoplay: true },
  render: (a) => <DebtSimplify {...a} />,
  parameters: { docs: { description: { story: 'Six IOUs become three payments. Raw debts fade out as the iris lines draw in over 700 ms (motion.merge). With Reduce Motion the lines swap with a crossfade only.' } } },
};

export const Untangle: StoryObj<typeof DebtUntangle> = {
  name: 'DebtUntangle',
  args: { solved: false, compact: false, startButton: true },
  render: (a) => <div style={{ maxWidth: 402 }}><DebtUntangle {...a} /></div>,
  parameters: { docs: { description: { story: 'The settle-up solve, shown as a graph. Six IOUs between seven people start as crossing threads. Step 1 nets each balance, step 2 matches debtors to creditors and the people who net to zero drop out, step 3 redraws the money as three payments: €190.60 of IOUs becomes €124.50 of payments, and every net balance is unchanged. Untangle plays it in 3.6 s, Replay runs it again, and the scrubber moves through it by hand. With Reduce Motion, Untangle jumps to the result and the scrubber steps through the three stages.' } } },
};

export const UntangleSolved: StoryObj<typeof DebtUntangle> = {
  name: 'DebtUntangle, solved',
  args: { solved: true, compact: true },
  render: (a) => <div style={{ maxWidth: 402 }}><DebtUntangle {...a} /></div>,
};

export const Payments: StoryObj<typeof PaymentRow> = {
  name: 'PaymentRow',
  args: { amount: 42.1, state: 'due', method: 'MB WAY' },
  argTypes: { state: { control: 'inline-radio', options: ['due', 'sending', 'paid', 'requested'] } },
  render: (a) => (<>
    <ListGroup><PaymentRow {...a} from={P.nic} to={P.ari} /></ListGroup>
    <Label>States</Label>
    <ListGroup>
      <PaymentRow from={P.nic} to={P.ari} amount={42.1} state="due" />
      <PaymentRow from={P.ari} to={P.joao} amount={12.5} state="due" method="Sintra train tickets" />
      <PaymentRow from={P.mara} to={P.joao} amount={64} state="sending" />
      <PaymentRow from={P.ren} to={P.ari} amount={18.4} state="paid" method="Revolut" />
      <PaymentRow from={P.nic} to={P.ari} amount={42.1} state="requested" />
    </ListGroup>
  </>),
};

export const Settle: StoryObj<typeof SettleContent> = {
  name: 'SettleSheet',
  parameters: { screen: 'full' },
  args: { amount: 42.1, method: 'MB WAY', state: 'review' },
  argTypes: { method: { control: 'inline-radio', options: ['MB WAY', 'Apple Pay', 'Revolut', 'Cash'] }, state: { control: 'inline-radio', options: ['review', 'sent'] } },
  render: (a) => <div className="scr"><BottomSheet title="Settle up" detent="compact"><SettleContent {...a} from={P.nic} to={P.ari} /></BottomSheet></div>,
};
