import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TripCreateStepper, DestinationSearch, DateRangePicker, CoverPicker, BudgetInput, CrewPicker, MilestoneMoment, YMD } from '../components/beyond/create';
import { DESTINATIONS, CREW, P } from '../lib/beyond';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Beyond tonight/Create trip', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'The pieces of Create trip: a five-step stepper, destination search with crew-aware suggestions, a date range calendar that blocks past days, cover photos, an optional per-person budget, crew picker and the milestone moment.' } } } };
export default meta;
type St = StoryObj;
const crew = CREW.map(id => ({ ...P[id], you: id === 'ari' }));
const STEPS = ['Where', 'When', 'Cover', 'Budget', 'Crew'];

export const Stepper: St = { name: 'TripCreateStepper', render: () => <><Label>Step 1</Label><TripCreateStepper steps={STEPS} current={0} /><Label>Step 4</Label><TripCreateStepper steps={STEPS} current={3} /></> };
function Search() { const [q, setQ] = useState('Mex'); const [sel, setSel] = useState<string>(); return <DestinationSearch query={q} onQuery={setQ} results={DESTINATIONS} selected={sel} onPick={setSel} />; }
export const Destination: St = { name: 'DestinationSearch', render: () => <Search /> };
export const DestinationEmpty: St = { name: 'DestinationSearch, suggestions', render: () => <DestinationSearch query="" results={DESTINATIONS} /> };
function Range() { const [s, setS] = useState<YMD | undefined>({ y: 2027, m: 2, d: 11 }); const [e, setE] = useState<YMD | undefined>({ y: 2027, m: 2, d: 15 }); return <DateRangePicker start={s} end={e} onChange={(a, b) => { setS(a); setE(b); }} />; }
export const DateRange: St = { name: 'DateRangePicker', render: () => <Range /> };
export const DateRangeToday: St = { name: 'DateRangePicker, past days off', render: () => <DateRangePicker /> };
function Cover() { const [v, setV] = useState(DESTINATIONS[0].photos[0]); return <CoverPicker photos={DESTINATIONS[0].photos} value={v} onChange={setV} credit="Photo: Hazel Montero, Pexels" />; }
export const CoverPhoto: St = { name: 'CoverPicker', render: () => <Cover /> };
function Budget() { const [v, setV] = useState<number | undefined>(900); return <BudgetInput value={v} onChange={setV} />; }
export const Budget_: St = { name: 'BudgetInput', render: () => <Budget /> };
export const BudgetNone: St = { name: 'BudgetInput, no budget', render: () => <BudgetInput value={undefined} /> };
function Crew() { const [sel, setSel] = useState(['mara', 'nic']); return <CrewPicker crews={[{ id: 'lisbon', name: 'Lisbon Crew', members: crew, last: 'Oct 2026' }]} people={crew.filter(p => p.id !== 'ari')} selected={sel} onToggle={id => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])} onCrew={() => setSel(CREW.filter(x => x !== 'ari'))} />; }
export const CrewPicker_: St = { name: 'CrewPicker', render: () => <Crew /> };
export const Milestone: St = { name: 'MilestoneMoment', render: () => <MilestoneMoment title="Mexico City is on" sub="Mar 11 to 15, 2027 · 7 people" /> };
export const MilestoneReduce: St = { name: 'MilestoneMoment, Reduce Motion', globals: { motion: 'reduce' }, render: () => <MilestoneMoment title="Mexico City is on" sub="Mar 11 to 15, 2027 · 7 people" /> };
