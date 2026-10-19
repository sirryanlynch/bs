import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '../components/core';
import {
  GlassHeader, PairHero, SPill, Overline, MethodPicker, CashCount, SlideToSettle, LongPressSettle, PendingMark, UndoToast, ReceiverConfirm,
  PaymentSuccess, SettleProgress, PlanRows, ReceiptView, PartialCash, DisputeView, OfflineView, demoSettlement, METHODS, SettleMethod, DisputeFix, usd2,
} from '../components/settle';
import { people as P } from '../lib/data';

const meta: Meta = {
  title: 'Patterns/Settle up (cash)', tags: ['autodocs'], parameters: { screen: 'full',
    docs: { description: { component: 'The cash path from Figma section 09 (S1 to S7, E1 to E3). Every frame uses the glass nav card, a content column at x 20, y 214, width 362, and a CTA at y 788 (or 724 when two stack). Amounts are stored in cents and shown in US dollars with tabular figures; negatives use U+2212. Balances only move when the receiver confirms.' } } },
};
export default meta;

/** Phone frame scaffold: glass header, the content column and the bottom CTA area. */
function Frame({ back, title, sub, children, bottom, slide, two }: { back: string; title: string; sub: string; children: React.ReactNode; bottom?: React.ReactNode; slide?: boolean; two?: boolean }) {
  return (
    <div className="scr" style={{ background: 'var(--color-bg-canvas)' }}>
      <div className={`p-sscroll ${two ? 'has-two' : ''}`}>{children}</div>
      <GlassHeader back={back} title={title} subtitle={sub} />
      {bottom && <div className={`p-sbottom ${slide ? 'is-slide' : ''}`}>{bottom}</div>}
    </div>
  );
}

export const ChooseMethod: StoryObj = {
  name: 'S1 Method picker',
  parameters: { docs: { description: { story: 'Five methods in one list card. The CTA label follows the selection. MB WAY and Revolut hand off by deep link with the amount and reference prefilled; on return the app asks "Did it go through?" because those apps do not confirm back.' } } },
  render: () => { const [m, setM] = useState<SettleMethod>('cash'); return (
    <Frame back="Money" title="Pay Nic" sub="Payment 1 of 3 · simplified" bottom={<Button label={METHODS.find(x => x.id === m)!.cta('$42.10')} fullWidth />}>
      <PairHero amount={42.1} caption="For the Tejo boat tour, routed through Tomás." pill={<SPill tone="accent">1 OF 3</SPill>} link="Why $42.10" />
      <Overline>HOW YOU'LL PAY</Overline>
      <MethodPicker value={m} onChange={setM} />
    </Frame>); },
};

export const CashCountRound: StoryObj = {
  name: 'S2 Cash count, round and carry',
  parameters: { docs: { description: { story: 'Cash rounds to the nearest $1.00, so the change is never more than $0.50 either way. $42.10 becomes $42.00 and the $0.10 is carried on the same pair into the next split. Bills come from a greedy split over US denominations. Toggle off to hand over the exact amount, coins included.' } } },
  render: () => { const [round, setRound] = useState(true); const [held, setHeld] = useState(false); return (
    <Frame back="Pay Nic" title="Cash for Nic" sub="Count it out, then slide" slide bottom={<SlideToSettle amount={round ? 42 : 42.1} onHold={setHeld} />}>
      <div style={{ display: 'contents', opacity: held ? 0.55 : 1 }}><CashCount due={42.1} round={round} onRound={setRound} /></div>
    </Frame>); },
};

export const Slide: StoryObj<typeof SlideToSettle> = {
  name: 'SlideToSettle',
  args: { amount: 42, initial: 0, forceButton: false },
  argTypes: { initial: { control: { type: 'range', min: 0, max: 1, step: 0.01 } } },
  parameters: { screen: 'component', docs: { description: { story: 'Track 362 × 64. Haptic ticks at 25, 50 and 75 percent; past 50 percent "Release to confirm" shows; past 92 percent the knob turns into a check. Release early and it springs back. Keyboard: press Enter twice. With Reduce Motion (or forceButton) it becomes a 600 ms press-and-hold button with a circular fill.' } } },
  render: (a) => <div style={{ width: 362 }}><SlideToSettle {...a} key={`${a.initial}-${a.forceButton}`} /></div>,
};

export const LongPress: StoryObj<typeof LongPressSettle> = {
  name: 'SlideToSettle, Reduce Motion',
  args: { amount: 42 }, parameters: { screen: 'component' },
  render: (a) => <div style={{ width: 362 }}><LongPressSettle {...a} /></div>,
};

export const SlideHeld: StoryObj = {
  name: 'S3 Slider held at 78%',
  render: () => (
    <Frame back="Pay Nic" title="Cash for Nic" sub="Count it out, then slide" slide bottom={<SlideToSettle amount={42} initial={0.78} />}>
      <div style={{ display: 'contents' }}><CashCount due={42.1} /></div>
    </Frame>),
};

export const Pending: StoryObj = {
  name: 'S4 Pending with undo',
  parameters: { docs: { description: { story: 'The mark is pending until Nic confirms; your balance does not move yet. Undo stays open for 5 s with a countdown ring (a plain number under Reduce Motion). After that, cancel lives in the receipt until Nic confirms.' } } },
  render: () => { const [k, setK] = useState(0); return (
    <Frame back="Money" title="Cash for Nic" sub="Waiting for Nic" bottom={<Button label="Back to balances" variant="plain" fullWidth />}>
      <PendingMark s={demoSettlement()} />
      <UndoToast key={k} amount={42} onUndo={() => setK(k + 1)} onExpire={() => setTimeout(() => setK(x => x + 1), 1200)} />
    </Frame>); },
};

export const Undo: StoryObj<typeof UndoToast> = {
  name: 'UndoToast', args: { amount: 42, seconds: 5 }, parameters: { screen: 'component' },
  render: (a) => <div style={{ position: 'relative', width: 402, height: 120 }}><UndoToast {...a} /></div>,
};

export const ReceiverConfirmStory: StoryObj = {
  name: 'S5 Receiver confirm (Nic)',
  parameters: { docs: { description: { story: "Nic's phone. Yes confirms the cash and both balances update. Not yet opens a sheet with the amount he counted and a note, which becomes the dispute on Ari's phone." } } },
  render: () => (
    <Frame back="Lisbon Crew" title="Did Ari pay you?" sub="Nic's phone · cash · 10:39 PM" two bottom={<><Button label="Yes, I got $42.00" fullWidth /><Button label="Not yet" variant="secondary" fullWidth /></>}>
      <ReceiverConfirm s={demoSettlement()} />
    </Frame>),
};

export const Success: StoryObj = {
  name: 'S6 Payment success, 1 of 3',
  parameters: { docs: { description: { story: 'On arrival the check disc springs from 0.8 to 1, a success haptic fires and the first progress segment fills in 400 ms. Reduce Motion: a 200 ms fade, no scale.' } } },
  render: () => (
    <Frame back="Lisbon Crew" title="Money" sub="Whole trip · 7 people" bottom={<Button label="Ask Ren for $18.40" fullWidth />}>
      <section className="p-mbal is-compact"><p className="p-overline-s">YOUR BALANCE</p><p className="p-mbal-amt tu-num is-owed">+$18.30</p><p className="p-mbal-cap">Ren pays you $18.40. $0.10 carried to your next split.</p></section>
      <PaymentSuccess title="Nic confirmed $42.00" meta="cash · 10:40:12 PM · stl_7Q2K-0042" />
      <SettleProgress done={1} total={3} paid={42} sum={124.5} />
      <PlanRows rows={[
        { from: P.ari, to: P.nic, amount: 42.1, reason: 'Cash · confirmed 10:40 PM', state: 'paid', paidLabel: '$42.00 ✓', perspective: 'out' },
        { from: P.ren, to: P.ari, amount: 18.4, reason: 'Dinner minus Fado tickets', state: 'due', perspective: 'in' },
        { from: P.mara, to: P.joao, amount: 64, reason: 'Flat deposit, via Sofia', state: 'due', perspective: 'other' },
      ]} />
    </Frame>),
};

export const Receipt: StoryObj = {
  name: 'S7 Receipt and provenance',
  render: () => (
    <Frame back="Money" title="Receipt" sub="You → Nic · cash" bottom={<Button label="Share receipt" icon="share" variant="surface" fullWidth />}>
      <ReceiptView s={demoSettlement({ status: 'confirmed', confirmedAt: '10:40:12 PM' })} />
    </Frame>),
};

export const Partial: StoryObj = {
  name: 'E1 Partial cash',
  parameters: { docs: { description: { story: 'Rounding is off for partial payments. The rest stays open on the plan and keeps the original reference with the suffix -b.' } } },
  render: () => { const [amt, setAmt] = useState(20); return (
    <Frame back="Pay Nic" title="Cash for Nic" sub="Paying part now" slide bottom={<SlideToSettle key={amt} amount={amt} />}>
      <PartialCash due={42.1} amount={amt} onAmount={setAmt} />
    </Frame>); },
};

export const Dispute: StoryObj = {
  name: 'E2 Dispute',
  parameters: { docs: { description: { story: 'Balances stay as they were until both phones agree. Pick a fix and send it to Nic.' } } },
  render: () => { const [fix, setFix] = useState<DisputeFix>('coin'); const s = demoSettlement({ status: 'disputed', dispute: { counted: 40, note: 'Got two twenties, nothing else.', at: '10:41 PM' } }); return (
    <Frame back="Money" title="Pay Nic" sub="Cash · needs a look" bottom={<Button label={fix === 'cancel' ? 'Cancel the cash mark' : 'Send to Nic'} fullWidth />}>
      <DisputeView s={s} fix={fix} onFix={setFix} />
    </Frame>); },
};

export const Offline: StoryObj = {
  name: 'E3 Offline',
  parameters: { docs: { description: { story: 'The mark is saved on the phone with a client id, so a retry cannot post it twice. It goes to Nic on reconnect.' } } },
  render: () => (
    <Frame back="Money" title="Pay Nic" sub="Cash · offline" bottom={<Button label="Cancel the cash mark" variant="plain" fullWidth />}>
      <OfflineView s={demoSettlement({ status: 'queued' })} />
    </Frame>),
};

export const Amounts: StoryObj = {
  name: 'Formatting', parameters: { screen: 'component' },
  render: () => <p className="tu-num" style={{ font: 'var(--type-mono-readout)' }}>{[42.1, -23.7, 0.1, 1234.5].map(usd2).join(' · ')}</p>,
};
