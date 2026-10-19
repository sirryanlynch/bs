import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Toast, Banner, Notification, LiveActivity, EmptyState, Skeleton } from '../components/feedback';
import { people as P, photo } from '../lib/data';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Feedback', tags: ['autodocs'] };
export default meta;

export const Toasts: StoryObj<typeof Toast> = {
  name: 'Toast',
  args: { message: 'Vote changed to Cervejaria Ramiro', tone: 'neutral', action: 'Undo' },
  argTypes: { tone: { control: 'inline-radio', options: ['neutral', 'success', 'error'] } },
  render: (a) => (<>
    <Toast {...a} />
    <Label>Tones</Label>
    <Toast message="Ren joined Lisbon Crew" tone="success" />
    <Toast message="Expense saved. Ren and Nic skip the wine." tone="success" action="View" />
    <Toast message="Could not reach MB WAY. Try again." tone="error" action="Retry" />
  </>),
};

export const Banners: StoryObj<typeof Banner> = {
  name: 'Banner',
  args: { title: 'Nic and Ren have not voted', body: 'Dinner poll closes at 7:30 PM.', tone: 'accent', action: 'Nudge them', onDismiss: true },
  argTypes: { tone: { control: 'inline-radio', options: ['info', 'accent', 'warning', 'success'] } },
  render: (a) => (<>
    <Banner {...a} />
    <Label>Tones</Label>
    <Banner tone="info" title="Ramiro does not take bookings" body="Arrive before 7:00 PM or expect a 40 minute queue." />
    <Banner tone="warning" title="Receipt total does not match" body="Items add up to $248.70. You entered $284.70." action="Review items" />
    <Banner tone="success" title="João marked $64.00 received" body="Mara is all paid up." />
  </>),
};

export const Notifications: StoryObj<typeof Notification> = {
  name: 'Notification',
  parameters: { screen: 'full', statusLight: true },
  args: { title: 'Lisbon Crew', body: 'Mara: Taberna is winning 3 to 1. Poll closes in 2 hours.', time: 'now', stacked: 2 },
  render: (a) => (
    <div className="scr">
      <div className="p-lock" style={{ backgroundImage: `url(${photo.alfama})` }} />
      <div className="p-lock-inner">
        <p className="p-lock-date">Friday October 16</p>
        <p className="p-lock-time">9:41</p>
        <Notification {...a} person={P.mara} />
      </div>
    </div>
  ),
};

export const Live: StoryObj<typeof LiveActivity> = {
  name: 'LiveActivity',
  parameters: { screen: 'full', statusLight: true },
  args: { kind: 'poll' },
  argTypes: { kind: { control: 'inline-radio', options: ['poll', 'trip', 'settle'] } },
  render: (a) => (
    <div className="scr">
      <div className="p-lock" style={{ backgroundImage: `url(${photo.bridge})` }} />
      <div className="p-lock-inner">
        <p className="p-lock-date">Friday October 16</p>
        <p className="p-lock-time" style={{ marginBottom: 200 }}>7:02 PM</p>
        <LiveActivity {...a} />
        {a.kind !== 'trip' && <LiveActivity kind="trip" />}
      </div>
    </div>
  ),
};

export const Empty: StoryObj<typeof EmptyState> = {
  name: 'EmptyState',
  args: { render: 'itinerary', title: 'Nothing planned yet', body: 'Add a place, or start a poll and let the group pick the first dinner.', action: 'Add to plan', secondary: 'Start a poll' },
  argTypes: { render: { control: 'inline-radio', options: ['celebrate', 'dining', 'itinerary', 'pin', 'poll', 'settle'] } },
  render: (a) => <EmptyState {...a} />,
};
export const EmptyVariants: StoryObj = { name: 'EmptyState · variants', render: () => (<>
  <EmptyState render="poll" title="No open polls" body="When someone asks the group, it shows up here." />
  <EmptyState render="settle" title="No expenses yet" body="Log the first one and TripUp keeps the running balance." action="Add expense" />
</>) };

export const Skeletons: StoryObj<typeof Skeleton> = {
  name: 'Skeleton',
  args: { variant: 'tripCard' },
  argTypes: { variant: { control: 'inline-radio', options: ['tripCard', 'row', 'poll', 'text'] } },
  render: (a) => (<><Skeleton {...a} /><Label>Poll</Label><Skeleton variant="poll" /><Label>Rows</Label><Skeleton variant="row" /></>),
};

export const Island: StoryObj = {
  name: 'LiveActivity · Dynamic Island',
  parameters: { screen: 'full', statusLight: true },
  render: () => (
    <div className="scr" style={{ background: '#111' }}>
      <div className="p-lock" style={{ backgroundImage: `url(${photo.alfama})` }} />
      <div style={{ position: 'absolute', top: 11, left: 0, right: 0, zIndex: 60 }}><LiveActivity compact /></div>
      <p style={{ position: 'absolute', zIndex: 3, left: 24, right: 24, bottom: 120, color: '#fff', font: 'var(--type-ui-footnote)', textAlign: 'center' }}>Compact Live Activity: the poll stays in the Dynamic Island while you use other apps.</p>
    </div>
  ),
};
