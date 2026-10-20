import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ExpenseRow, ReceiptSplit, DebtSimplify, PaymentRow, SettleContent } from '../components/money';
import { DebtUntangle } from '../components/untangle';
import '../components/untangle-solver';
import { ReceiptStacksLive } from '../components/untangle-receipt';
import { SettleActions, SettleAllSheet, SettleAction } from '../components/settle-actions';
import { MoneyBalance, IouLog, NetLog, PairRows } from '../components/settle';
import { rawDebts, simplifiedDebts } from '../components/money';
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
  args: { title: 'Vinho Verde (bottle) × 2', amount: 38, share: 7.6, date: 'Fri', category: 'wine', state: 'default', splitCount: 5 },
  argTypes: { state: { control: 'inline-radio', options: ['default', 'youExcluded', 'pending', 'settled'] }, category: { control: 'select', options: ['fork', 'wine', 'bed', 'tram', 'plane', 'receipt'] } },
  render: (a) => (<>
    <ListGroup><ExpenseRow {...a} payer={P.ari} excluded={[P.ren, P.nic]} /></ListGroup>
    <Label>States</Label>
    <ListGroup>
      <ExpenseRow title="Dinner, Taberna da Rua das Flores" payer={P.ari} amount={248.7} share={37.7} date="Fri" category="fork" />
      <ExpenseRow title="Vinho Verde (bottle) × 2" payer={P.mara} amount={38} share={7.6} date="Sat" category="wine" excluded={[P.ren, P.nic]} splitCount={5} />
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
  name: 'DebtUntangle (v5.6 Receipt to stacks, default)',
  args: { solved: false, controls: 'steps', startButton: true, skin: 'receipt' },
  argTypes: { controls: { control: 'inline-radio', options: ['steps', 'full', 'inline', 'none'] }, skin: { control: 'inline-radio', options: ['receipt', 'solver', 'instrument'] } },
  render: (a) => <div style={{ maxWidth: 362 }}><DebtUntangle {...a} /></div>,
  parameters: { docs: { description: { story: 'The Money screen skin. Same model, timeline and controls as v4; only the visual layer changes. Photo medallions in glass, one graphite thread color with two weights (1.25 under $40, 2 from $40), no amounts on threads in Tangled (the IOU log carries them), the 4 crossings as soft dots. Netting: ghost dashes, spokes into a small still solver core, Σ 0.00. Solved: 3 Iris arcs with amounts and one glint, played once per solve and never while scrubbing. No source chips, tokens, gauge rings or grid. Reduce Motion: 200 ms cross-fades, no drawing, a still core and a static star.' } } },
};

export const UntangleInline: StoryObj<typeof DebtUntangle> = {
  name: 'DebtUntangle, inline controls (Money screen)',
  args: { solved: false, controls: 'inline', startButton: false, skin: 'receipt' },
  render: (a) => <div style={{ maxWidth: 362 }}><DebtUntangle {...a} /></div>,
};

export const UntangleSolved: StoryObj<typeof DebtUntangle> = {
  name: 'DebtUntangle, solved',
  args: { solved: true, controls: 'inline', skin: 'receipt' },
  render: (a) => <div style={{ maxWidth: 362 }}><DebtUntangle {...a} /></div>,
};

export const MoneyLogs: StoryObj = {
  name: 'Money v4 logs and rows',
  render: () => (<div style={{ maxWidth: 362, display: 'grid', gap: 12 }}>
    <MoneyBalance net={-23.7} caption="2 IOUs: you owe Tomás $42.10. Ren owes you $18.40." />
    <IouLog raw={rawDebts} people={P} />
    <NetLog nets={{ nic: 42.1, joao: 64, sofia: 0, tomas: 0, ren: -18.4, ari: -23.7, mara: -64 }} people={P} />
    <PairRows plan={simplifiedDebts} people={P} />
  </div>),
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

export const UntangleLegacyInstrument: StoryObj<typeof DebtUntangle> = {
  name: 'DebtUntangle, legacy v4 Instrument skin',
  args: { solved: false, controls: 'full', startButton: true, skin: 'instrument' },
  argTypes: { controls: { control: 'inline-radio', options: ['full', 'inline', 'none'] }, skin: { control: 'inline-radio', options: ['solver', 'instrument'], description: 'Visual layer. The model, timeline and controls stay the same; register another skin with registerUntangleSkin().' } },
  render: (a) => <div style={{ maxWidth: 362 }}><DebtUntangle {...a} /></div>,
  parameters: { docs: { description: { story: 'Figma set 121:4174, card 362 × 268. Three steps: 01 Tangled (6 graphite IOUs, 4 computed crossings marked as knots, $190.60 of flow), 02 Netting (each person becomes one balance ring; Σ net 0.00 ✓), 03 Solved (3 Iris arcs, $124.50, 50% fewer payments). The nets-unchanged check is computed, never hard-coded. Untangle plays 600 ms steps with a 900 ms hold; Replay restarts; the scrubber or the stepper labels move by hand. Reduce Motion: 200 ms cross-fades, scrubber snaps per step.' } } },
};

/* v5.6 Receipt to stacks: the settle path. Each paid hop moves a chip across and both stacks shrink to the zero line. */
const liveDoc = { docs: { description: { story: 'ReceiptStacksLive sits above the plan rows on Money once a payment exists. Stacks only move when a payment is paid (app or cash), never while pending. Transform and opacity only; Reduce Motion cross-fades.' } } };
export const StacksOpen: StoryObj = { name: 'Receipt stacks · 0 of 3 paid', parameters: liveDoc,
  render: () => <div style={{ maxWidth: 362 }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={[false, false, false]} /></div> };
export const StacksOne: StoryObj = { name: 'Receipt stacks · 1 of 3 paid', parameters: liveDoc,
  render: () => <div style={{ maxWidth: 362 }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={simplifiedDebts.map(e => e.from === 'ari')} /></div> };
export const StacksSquared: StoryObj = { name: 'Receipt stacks · all squared', parameters: liveDoc,
  render: () => <div style={{ maxWidth: 362 }}><ReceiptStacksLive raw={rawDebts} simple={simplifiedDebts} people={P} me="ari" paid={[true, true, true]} /></div> };

// v5.6.1: many IOUs fit the card (two columns, clamped rows) and the settle action list that replaces per-payment connectors.
const manyRaw = [{ from: 'mara', to: 'joao', amt: 12 }, { from: 'mara', to: 'nic', amt: 9.5 }, { from: 'ari', to: 'nic', amt: 21 }, { from: 'ari', to: 'tomas', amt: 6 }, { from: 'sofia', to: 'joao', amt: 14 }, { from: 'tomas', to: 'mara', amt: 8.2 }, { from: 'nic', to: 'sofia', amt: 5 }, { from: 'joao', to: 'ari', amt: 7.75 }, { from: 'ari', to: 'sofia', amt: 11 }, { from: 'tomas', to: 'nic', amt: 4.4 }];
const manySimple = [{ from: 'ari', to: 'nic', amt: 29.9 }, { from: 'mara', to: 'joao', amt: 13.3 }, { from: 'tomas', to: 'joao', amt: 4.95 }, { from: 'tomas', to: 'sofia', amt: 1.65 }, { from: 'ari', to: 'sofia', amt: 0.35 }];
export const ManyIous: StoryObj = { name: 'Receipt · 10 IOUs fit the card', parameters: liveDoc,
  render: () => <div style={{ maxWidth: 362 }}><DebtUntangle raw={manyRaw} simple={manySimple} people={P} controls="inline" startButton={false} skin="receipt" /></div> };
const sa = (key: string, kind: SettleAction['kind'], who: any, amt: number, status: SettleAction['status'], to?: any): SettleAction => ({ key, kind, who, amt, status, to });
const myActs = [sa('ari>nic', 'pay', P.nic, 42.1, 'open'), sa('ari>tomas', 'pay', P.tomas, 12.4, 'open'), sa('ren>ari', 'request', crewWithRen.find(p => p.id === 'ren') ?? P.ren, 18.4, 'open')];
const others = [sa('mara>joao', 'other', P.mara, 64, 'open', P.joao)];
export const ActionList: StoryObj = { name: 'SettleActions · your actions', render: () => {
  const [mine, setMine] = React.useState(myActs);
  return <div style={{ maxWidth: 370 }}><SettleActions mine={mine} others={others} onAct={a => setMine(m => m.map(x => x.key === a.key ? { ...x, status: a.kind === 'pay' ? 'paid' : 'sent' } : x))} /></div>; } };
export const ActionStatuses: StoryObj = { name: 'SettleActions · statuses', render: () =>
  <div style={{ maxWidth: 370 }}><SettleActions mine={[sa('a', 'pay', P.nic, 42.1, 'pending'), sa('b', 'request', P.ren, 18.4, 'sent'), sa('c', 'pay', P.tomas, 12.4, 'paid')]} others={[{ ...others[0], nudged: true }]} /></div> };
export const SettleAll: StoryObj = { name: 'SettleAllSheet · confirm batch', render: () => <SettleAllSheet actions={myActs} onApprove={() => {}} onClose={() => {}} /> };
