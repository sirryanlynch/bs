import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { NextSteps } from '../components/beyond/elevate';
import { PairHero, MethodPicker, CashCount, SettleMethod } from '../components/settle';
import { people as P } from '../lib/data';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Full JTBD analysis/Hero patterns (v5.1)', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'v5.1 elevation pass. Each confirmation or decision screen gets one hero element (photo or glass, display-type number) instead of a stack of rows. NextSteps ends a confirmation on what happens next instead of empty space.' } } } };
export default meta;
type St = StoryObj;

export const Next: St = { name: 'NextSteps', render: () => <div style={{ maxWidth: 362 }}>
  <Label>Poll sent</Label><NextSteps steps={['Crew votes from the notification', 'Closes 10:00 PM', 'Winner lands on Tuesday']} />
  <Label>Balances updated</Label><NextSteps steps={['Logged to Money', 'On the plan for Wed, Oct 14', 'Settle up any time']} /></div> };
export const PayHero: St = { name: 'PairHero (pay hero)', render: () => <div style={{ maxWidth: 362 }}><PairHero from={{ ...P.ari, you: true }} to={P.nic} amount={42.1} caption="For the Tejo boat tour, routed through Tomás." link="Why $42.10" /></div> };
function Methods() { const [m, setM] = useState<SettleMethod>('cash'); return <div style={{ maxWidth: 362 }}><MethodPicker value={m} onChange={setM} /></div>; }
export const Method: St = { name: 'MethodPicker (featured tiles + other apps)', render: () => <Methods /> };
function Cash() { const [r, setR] = useState(true); return <div style={{ maxWidth: 362, display: 'flex', flexDirection: 'column', gap: 12 }}><CashCount due={42.1} round={r} onRound={setR} from={{ ...P.ari, you: true }} to={P.nic} /></div>; }
export const CashHero: St = { name: 'CashCount (bills hero)', render: () => <Cash /> };
