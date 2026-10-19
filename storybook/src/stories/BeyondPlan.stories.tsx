import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { DayTabs, TimelineItem, DayTimeline } from '../components/beyond/plan';
import { FilterChips } from '../components/beyond/filterchips';
import { DAYS, DAY_PLAN, PlanItem } from '../lib/beyond';
import { ExperienceType } from '../data/experienceTypes';

const meta: Meta = { title: 'Components/Full JTBD analysis/Day plan', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Morning, afternoon and evening. Drag the grip to reorder, or focus it and use the up and down arrow keys. The poll winner lands as a booked item at 8:30 PM.' } } } };
export default meta;
type St = StoryObj;
const fri = DAY_PLAN.oct17;

function Tabs() { const [v, setV] = useState('oct16'); return <DayTabs days={DAYS} value={v} today="oct16" onChange={setV} />; }
export const Days: St = { name: 'DayTabs', render: () => <Tabs /> };
export const Item: St = { name: 'TimelineItem', render: () => <>{fri.slice(0, 3).map(i => <TimelineItem key={i.id} item={i} />)}</> };
export const ItemBooked: St = { name: 'TimelineItem, poll winner landed', render: () => <TimelineItem item={fri.find(i => i.id === 'p5')!} landed /> };
function Timeline() {
  const [items, setItems] = useState<PlanItem[]>(fri); const [xt, setXt] = useState<ExperienceType>('all');
  const counts: Partial<Record<ExperienceType, number>> = {}; items.forEach(i => (counts[i.xt] = (counts[i.xt] ?? 0) + 1));
  return <><FilterChips value={xt} onChange={setXt} surface="itinerary" counts={counts} showCounts /><DayTimeline items={xt === 'all' ? items : items.filter(i => i.xt === xt)} onReorder={n => xt === 'all' && setItems(n)} landedId="p5" /></>;
}
export const Timeline_: St = { name: 'DayTimeline with FilterChips', render: () => <Timeline /> };
export const TimelineReduce: St = { name: 'DayTimeline, Reduce Motion', globals: { motion: 'reduce' }, render: () => <Timeline /> };
export const TimelineTue: St = { name: 'DayTimeline, Tuesday scuba at 6:00 AM', render: () => <DayTimeline items={DAY_PLAN.oct13} /> };
