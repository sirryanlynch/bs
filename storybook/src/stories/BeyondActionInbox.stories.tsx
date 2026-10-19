import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ActionInbox, ActionList, UpNextPill } from '../components/beyond/actioninbox';
import { EmptyState } from '../components/beyond/emptystate';
import { AVATAR } from '../assets/solver-assets';
import { px } from '../lib/beyond';

const meta: Meta = { title: 'Components/Full JTBD analysis/Up next and empty states', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Up next holds only things that need you: a vote, a payment. Each card taps straight into the action. Updates stay in the bell. EmptyState: one clear action, plain copy.' } } } };
export default meta;
type St = StoryObj;
const ITEMS = [{ id: 'vote', kind: 'vote' as const, title: 'Vote: Dinner tonight', meta: 'Lisbon Crew · Closes 7:30 PM · 3 places', cta: 'Vote' },
  { id: 'pay', kind: 'pay' as const, title: 'Pay Nic $42.10', meta: 'Lisbon Crew · Your one payment', cta: 'Pay', avatar: AVATAR.nic }];
export const Pill: St = { name: 'UpNextPill', render: () => <div style={{ display: 'flex', gap: 12 }}><UpNextPill count={2} /><span className="b-un is-zero"><UpNextPill count={0} /></span></div> };
export const List: St = { name: 'ActionList', render: () => <div style={{ maxWidth: 380 }}><ActionList items={ITEMS} inline /></div> };
export const Empty: St = { name: 'ActionList, all caught up', render: () => <div style={{ maxWidth: 380 }}><ActionList items={[]} inline /></div> };
export const Inbox: St = { name: 'ActionInbox (interactive)', render: () => <ActionInbox items={ITEMS} /> };
export const EmptyPhotos: St = { name: 'EmptyState, photos', render: () => <EmptyState art="photos" photos={[px.portoBoats, px.portoRibeira, px.porto]} title="No photos yet" body="Everyone’s shots land here, sorted by day and place." action="Add photos" /> };
export const EmptyMoney: St = { name: 'EmptyState, render', render: () => <EmptyState render="settle" title="No expenses yet" body="Log a bill once and TripUp keeps everyone’s balance." action="Add expense" /> };
