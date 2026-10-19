import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FlowProvider, useFlowStore, FlowHost } from '../patterns/beyond/kit';
import { BeyondScreen, FLOWS } from '../patterns/beyond/router';

const meta: Meta = { title: 'Patterns/Beyond tonight', parameters: { screen: 'full', docs: { description: { component: 'Every flow beyond tonight, running live. Each story starts at the first screen of a flow and you can tap through all of it. Leaving the flow (Trips, Money) resets it here; in the prototype it returns to the Lisbon tour.' } } } };
export default meta;
type St = StoryObj;

function Flow({ start }: { start: string }) {
  const [s, d] = useFlowStore(start);
  const host: FlowHost = { exit: () => d({ t: 'load', s: { ...s, route: start, history: [] } }) };
  return <FlowProvider s={s} d={d} host={host}><BeyondScreen /></FlowProvider>;
}
const story = (id: string, extra: Partial<St> = {}): St => { const f = FLOWS.find(x => x.id === id)!; return { name: f.title, parameters: { statusLight: !!f.routes[0].light }, render: () => <Flow start={f.start} />, ...extra }; };
export const CreateTrip = story('create');
export const Explore = story('explore');
export const PlaceCard = story('place');
export const NewPoll: St = { ...story('polls'), name: 'New poll: Tuesday, Oct 13, 6:00 AM, Scuba diving' };
export const Album = story('album');
export const DayPlan = story('plan');
export const AddExpense = story('expense');
export const InviteAndJoin = story('invite');
export const Recap = story('recap');
export const Activity = story('activity');
export const Profile = story('profile');
export const ExploreDark: St = { ...story('explore'), name: 'Explore, dark', globals: { theme: 'dark' } };
export const DayPlanDark: St = { ...story('plan'), name: 'Day plan, dark', globals: { theme: 'dark' } };
export const AddExpenseReduce: St = { ...story('expense'), name: 'Add expense, Reduce Motion', globals: { motion: 'reduce' } };
export const CreateTripReduce: St = { name: 'Trip created, Reduce Motion', globals: { motion: 'reduce' }, parameters: { statusLight: true }, render: () => <Flow start="create/done" /> };
export const Curate: St = { name: 'Explore, narrow it down (Walk, Drive, Destination)', render: () => <Flow start="explore/curate" /> };
export const GuestWeb: St = { name: 'Guest web view, Ren votes in Safari', render: () => <Flow start="guest" /> };
export const LockScreenActions: St = { name: 'Lock Screen, vote and confirm cash', parameters: { statusLight: true }, render: () => <Flow start="activity/lock" /> };
export const ReceiptNotRead: St = { name: 'States: receipt not read', render: () => <Flow start="expense/failed" /> };
export const PollNoVotes: St = { name: 'States: poll with no votes', render: () => <Flow start="poll/novotes" /> };
export const ExploreOffline: St = { name: 'States: Explore offline', render: () => <Flow start="explore/offline" /> };
export const CreateMenuStory: St = { name: 'Global + create menu (tap + next to the tab bar)', render: () => <Flow start="polls" /> };
