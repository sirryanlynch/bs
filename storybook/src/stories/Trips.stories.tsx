import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { TripCard, PlaceCard, ItineraryItem, Timeline, MemberPicker, InviteContent, ExploreRing } from '../components/trip';
import { BottomSheet } from '../components/overlays';
import { crew, crewWithRen, people as P, photo, places } from '../lib/data';
import { friday, saturday } from '../lib/itinerary';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Trips & Places', tags: ['autodocs'] };
export default meta;

export const Trip: StoryObj<typeof TripCard> = {
  name: 'TripCard',
  args: { name: 'Lisbon', dates: '12 to 17 Oct', status: 'upcoming', balance: -23.7, nextUp: 'Dinner poll closes 19:30', size: 'hero', photo: photo.alfama },
  argTypes: { status: { control: 'inline-radio', options: ['upcoming', 'live', 'planning', 'past'] }, size: { control: 'inline-radio', options: ['hero', 'compact'] }, photo: { control: 'select', options: Object.values(photo) } },
  render: (a) => (<>
    <TripCard {...a} people={crewWithRen} />
    <Label>Compact</Label>
    <TripCard size="compact" name="Porto" dates="5 to 8 Dec · planning" photo={photo.tiles} people={crew.slice(0, 4)} />
    <TripCard size="compact" name="Sintra day" dates="Sun 25 Oct" photo={photo.facade} people={crew} balance={-12.5} />
    <TripCard size="compact" name="Madrid" dates="March · wrapped" photo={photo.chiado} people={crew.slice(1)} balance={0} />
  </>),
};
export const TripLive: StoryObj = { name: 'TripCard · live', render: () => <TripCard name="Lisbon" dates="Day 2 of 4" status="live" photo={photo.tram} people={crewWithRen} nextUp="Tram 28 in 25 min" balance={-23.7} /> };

export const Place: StoryObj<typeof PlaceCard> = {
  name: 'PlaceCard',
  args: { ...places.taberna, saved: true, inPoll: true, layout: 'tall' },
  argTypes: { layout: { control: 'inline-radio', options: ['tall', 'row'] } },
  render: (a) => (<>
    <PlaceCard {...a} />
    <Label>Grid</Label>
    <div className="p-place-grid"><PlaceCard {...places.ramiro} /><PlaceCard {...places.eurico} saved /></div>
    <Label>Row</Label>
    <PlaceCard {...places.graca} layout="row" /><PlaceCard {...places.pink} layout="row" />
  </>),
};

export const Itinerary: StoryObj<typeof ItineraryItem> = {
  name: 'ItineraryItem',
  args: { time: '20:30', title: 'Dinner at Taberna da Rua das Flores', place: 'Chiado · booked for 7', icon: 'fork', kind: 'decided', decidedBy: '71%', photo: places.taberna.photo },
  argTypes: { kind: { control: 'inline-radio', options: ['plan', 'decided', 'tentative', 'now'] } },
  render: (a) => (<>
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}><ItineraryItem {...a} last /></ol>
    <Label>Kinds</Label>
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      <ItineraryItem time="09:30" title="Tram 28 from Martim Moniz" place="Board at the first stop" icon="tram" kind="now" />
      <ItineraryItem time="13:00" title="Lunch at Cervejaria Ramiro" place="Intendente" icon="fork" kind="plan" />
      <ItineraryItem time="23:00" title="Drinks on Pink Street" place="Cais do Sodré" icon="wine" kind="tentative" last />
    </ol>
  </>),
};
export const Timelines: StoryObj = { name: 'Timeline', render: () => <><Timeline day="Friday" date="16 Oct" items={friday} /><Timeline day="Saturday" date="17 Oct" items={saturday} /></> };

export const Members: StoryObj<typeof MemberPicker> = {
  name: 'MemberPicker',
  args: { mode: 'split' },
  argTypes: { mode: { control: 'inline-radio', options: ['split', 'payer'] } },
  render: (a) => (<>
    <MemberPicker {...a} people={crewWithRen} />
    <Label>Wine excludes Ren and Nic</Label>
    <MemberPicker people={crewWithRen} selected={['ari', 'mara', 'joao', 'sofia', 'tomas']} />
    <Label>Who paid</Label>
    <MemberPicker people={crewWithRen} mode="payer" selected={['ari']} />
  </>),
};

function InviteDemo({ joined }: { joined: boolean }) {
  const [j, setJ] = useState(false);
  useEffect(() => { if (!joined) { setJ(false); return; } const t = setTimeout(() => setJ(true), 1600); return () => clearTimeout(t); }, [joined]);
  return <BottomSheet title="Invite" detent="large"><InviteContent invited={j ? P.ren : undefined} /></BottomSheet>;
}
export const Invite: StoryObj<{ joined: boolean }> = {
  name: 'InviteSheet with QR',
  parameters: { screen: 'full' },
  args: { joined: true },
  render: (a) => <div className="scr"><InviteDemo joined={a.joined} /></div>,
};

export const Ring: StoryObj<typeof ExploreRing> = {
  name: 'ExploreRing',
  args: { visited: 7, total: 12, label: 'Lisbon explored', size: 132 },
  argTypes: { visited: { control: { type: 'range', min: 0, max: 12 } } },
  render: (a) => (<>
    <div style={{ display: 'flex', justifyContent: 'center' }}><ExploreRing {...a} /></div>
    <Label>Progress and the completed milestone</Label>
    <div style={{ display: 'flex', justifyContent: 'space-around' }}><ExploreRing visited={2} total={12} size={100} label="Day 1" /><ExploreRing visited={12} total={12} size={100} label="All of Alfama" /></div>
  </>),
};
