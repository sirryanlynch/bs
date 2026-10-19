import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NavBar, TabBar } from '../components/nav';
import { photo } from '../lib/data';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Navigation', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Chrome floats as Liquid Glass above content. The large title collapses to the inline bar on scroll.' } } } };
export default meta;

export const Nav: StoryObj<typeof NavBar> = {
  name: 'NavBar',
  args: { title: 'Lisbon Crew', subtitle: 'Oct 12 to 17', large: true, displayTitle: true, back: 'Trips' },
  render: (a) => (<>
    <NavBar {...a} actions={[{ icon: 'personAdd', label: 'Invite' }, { icon: 'more', label: 'More' }]} />
    <Label>Large, UI title</Label>
    <NavBar title="Trips" actions={[{ icon: 'bell', label: 'Activity', badge: 2 }]} />
    <Label>Inline</Label>
    <NavBar title="Saturday dinner" subtitle="5 of 7 voted" large={false} back="Polls" actions={[{ icon: 'share', label: 'Share' }]} />
  </>),
};

export const Tabs: StoryObj<typeof TabBar> = {
  name: 'TabBar (glass)',
  parameters: { screen: 'full', statusLight: true },
  args: { active: 'plan', accessory: 'plus', floating: true },
  argTypes: { active: { control: 'inline-radio', options: ['plan', 'explore', 'photos', 'money'] }, accessory: { control: 'inline-radio', options: ['plus', 'search', 'none'] } },
  render: (a) => (
    <div className="scr">
      <img src={photo.tram} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', left: 20, right: 20, top: 72, color: '#fff', font: 'var(--type-ui-footnote)', textShadow: '0 1px 8px rgba(0,0,0,.4)' }}>Glass refracts the photo underneath. Toggle Glass in the toolbar to see the Reduce Transparency fill.</div>
      <TabBar {...a} />
    </div>
  ),
};

/* v5.4 two levels: Home (no trip open) and Trip (inside a trip). The bar crossfades when you push into a trip. */
import { TABS_HOME, TABS_TRIP } from '../patterns/beyond/kit';
export const HomeLevel: StoryObj = { name: 'Tab bar, Home level: Trips · Explore · You', render: () => <TabBar active="trips" tabs={TABS_HOME as any} accessory="plus" accessoryLabel="Create" /> };
export const TripLevel: StoryObj = { name: 'Tab bar, Trip level: Plan · Explore · Photos · Money', render: () => <TabBar active="plan" tabs={TABS_TRIP as any} accessory="plus" accessoryLabel="Create" /> };
