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
    <NavBar title="Dinner tonight?" subtitle="5 of 7 voted" large={false} back="Polls" actions={[{ icon: 'share', label: 'Share' }]} />
  </>),
};

export const Tabs: StoryObj<typeof TabBar> = {
  name: 'TabBar (glass)',
  parameters: { screen: 'full', statusLight: true },
  args: { active: 'polls', accessory: 'plus', floating: true },
  argTypes: { active: { control: 'inline-radio', options: ['trips', 'polls', 'plan', 'money'] }, accessory: { control: 'inline-radio', options: ['plus', 'search', 'none'] } },
  render: (a) => (
    <div className="scr">
      <img src={photo.tram} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', left: 20, right: 20, top: 72, color: '#fff', font: 'var(--type-ui-footnote)', textShadow: '0 1px 8px rgba(0,0,0,.4)' }}>Glass refracts the photo underneath. Toggle Glass in the toolbar to see the Reduce Transparency fill.</div>
      <TabBar {...a} />
    </div>
  ),
};
