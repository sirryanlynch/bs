import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ExploreCard, ExploreFeed, CurateRing, CurateFlow, CurateCount, CurateAnswers, curateCount, curateStage, curateStep, curateSkip, curateUpTo, CURATE_LABELS, AddToPoll } from '../components/beyond/explore';
import { Stepper } from '../components/beyond/stepper';
import { FilterChips, FilterItem } from '../components/beyond/filterchips';
import { DayTimePicker, CategoryPicker, OptionEditor } from '../components/beyond/pollnew';
import { COMMUNITY, POLLS, DAYS, SCUBA } from '../lib/beyond';
import { ExperienceType } from '../data/experienceTypes';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Beyond tonight/Explore and polls', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Explore shows what other crews booked, reviewed and photographed. No likes, comments or followers. The curated list starts with how you get there (Walk, Drive or Destination), then how long, then the rest. FilterChips use the shared experience-type taxonomy in src/data/experienceTypes.ts.' } } } };
export default meta;
type St = StoryObj;

function Chips({ surface, counts }: { surface: 'itinerary' | 'explore' | 'poll' | 'album'; counts?: Partial<Record<ExperienceType, number>> }) { const [v, setV] = useState<ExperienceType>('all'); return <FilterChips value={v} onChange={setV} surface={surface} counts={counts} showCounts={surface === 'itinerary'} />; }
export const Filter: St = { name: 'FilterChips', render: () => <>
  <Label>Explore: no Travel, no counts</Label><Chips surface="explore" />
  <Label>Itinerary: Travel included, with counts; zero-count types hide</Label><Chips surface="itinerary" counts={{ food: 3, drinks: 1, culture: 3, active: 1, travel: 0 }} />
  <Label>Album</Label><Chips surface="album" />
</> };
function Filtered() {
  const [v, setV] = useState<ExperienceType>('all');
  return <><FilterChips value={v} onChange={setV} surface="explore" />{COMMUNITY.slice(0, 6).map(p => <FilterItem key={p.id} show={v === 'all' || p.kind === v}><p style={{ padding: '10px 4px', margin: 0, font: 'var(--type-ui-body)' }}>{p.name} <small style={{ color: 'var(--color-text-tertiary)' }}>{p.kind}</small></p></FilterItem>)}</>;
}
export const FilterAnimated: St = { name: 'FilterChips with FilterItem', render: () => <Filtered /> };
export const FilterReduce: St = { name: 'FilterChips with FilterItem, Reduce Motion', globals: { motion: 'reduce' }, render: () => <Filtered /> };
export const Card: St = { name: 'ExploreCard', render: () => <ExploreCard place={COMMUNITY[0]} /> };
export const CardSaved: St = { name: 'ExploreCard, saved and in a poll', render: () => <ExploreCard place={COMMUNITY[2]} saved inPoll /> };
export const CardDrive: St = { name: 'ExploreCard, drive distance', render: () => <ExploreCard place={COMMUNITY.find(p => p.id === 'dive')!} mode="drive" /> };
export const Feed: St = { name: 'ExploreFeed', render: () => <ExploreFeed places={COMMUNITY.slice(0, 4)} saved={['park']} /> };
export const FeedEmpty: St = { name: 'ExploreFeed, nothing matches', render: () => <ExploreFeed places={[]} /> };
export const Ring: St = { name: 'CurateRing', render: () => <><CurateRing done={0} total={4} count={120} /><CurateRing done={2} total={4} count={22} /><CurateRing done={4} total={4} count={6} /></> };
function Curate({ start }: { start: CurateAnswers }) { const [a, setA] = useState<CurateAnswers>(start); const st = curateStage(a); return <div style={{ display: 'grid', gap: 12 }}><Stepper steps={CURATE_LABELS} current={curateStep(st)} onStep={i => setA(curateUpTo(a, i))} onSkip={st < 4 ? () => setA(curateSkip(a)) : undefined} />{st < 4 ? <><CurateCount answers={a} /><CurateFlow key={curateStep(st)} answers={a} onAnswer={setA} /></> : <><CurateRing done={4} total={4} count={6} /><button type="button" className="b-textbtn" onClick={() => setA({})}>Start over</button></>}</div>; }
export const CurateQ1: St = { name: 'CurateFlow, how are you getting there', render: () => <Curate start={{}} /> };
export const CurateWalk: St = { name: 'CurateFlow, Walk: 5, 10, 20 min', render: () => <Curate start={{ mode: 'walk' }} /> };
export const CurateDrive: St = { name: 'CurateFlow, Drive: 10, 20, 40 min', render: () => <Curate start={{ mode: 'drive' }} /> };
export const CurateDest: St = { name: 'CurateFlow, Destination: under 1 hr, half day, day trip', render: () => <Curate start={{ mode: 'destination' }} /> };
export const AddPoll: St = { name: 'AddToPoll', render: () => <AddToPoll place="Park Rooftop" polls={POLLS.filter(p => p.status === 'open')} /> };
function DT() { const [d, setD] = useState(SCUBA.day); const [t, setT] = useState(SCUBA.time); return <DayTimePicker days={DAYS} day={d} time={t} onDay={setD} onTime={setT} />; }
export const DayTime: St = { name: 'DayTimePicker, Tuesday 6:00 AM', render: () => <DT /> };
function Cat() { const [v, setV] = useState<ExperienceType>('active'); return <CategoryPicker value={v} onChange={setV} />; }
export const Category: St = { name: 'CategoryPicker', render: () => <Cat /> };
function Opts() { const [o, setO] = useState<{ label: string; from?: string; photo?: string }[]>([{ label: 'Dive Point Sesimbra', from: 'From Explore · 4.9 · 45 min drive', photo: './photos/px_37296507.jpg' }, { label: 'Arrábida coast dive', from: 'Typed by you' }]); const [d, setD] = useState('Sleep in, meet at 11:00 AM'); return <OptionEditor options={o} draft={d} onDraft={setD} onAdd={() => { setO([...o, { label: d, from: 'Typed by you' }]); setD(''); }} onRemove={i => setO(o.filter((_, k) => k !== i))} />; }
export const Options: St = { name: 'OptionEditor', render: () => <Opts /> };
