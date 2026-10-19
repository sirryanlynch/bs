import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SafariFrame, AppBanner, GuestWebView } from '../components/beyond/guest';
import { RecapCard, PlacesMap, StatTile } from '../components/beyond/recap';
import { ActivityItem, NotificationBanner, LockScreen } from '../components/beyond/activity';
import { SettingsRow, SettingsGroup, ProfileHeader, ChoiceList } from '../components/beyond/settings';
import { PINS } from '../patterns/beyond/social';
import { ACTIVITY, ALBUM, CREW, P } from '../lib/beyond';
import { photo } from '../lib/data';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Beyond tonight/Invite, recap, activity, settings', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Guest web view in a Safari frame, the recap card and map, the activity feed and actionable Lock Screen notifications, and settings rows.' } } } };
export default meta;
type St = StoryObj;
const ppl = CREW.map(id => ({ ...P[id], you: id === 'ari' }));

export const Guest: St = { name: 'GuestWebView in SafariFrame', parameters: { screen: 'full' }, render: () => <SafariFrame url="tripup.app" banner={<AppBanner />}><div style={{ paddingTop: 74 }}><GuestWebView><p style={{ margin: 0, font: 'var(--type-ui-body)' }}>Lisbon Crew · Oct 12 to 17. Vote without installing anything.</p></GuestWebView></div></SafariFrame> };
export const Banner: St = { name: 'AppBanner', render: () => <div style={{ position: 'relative', height: 120 }}><AppBanner /></div> };
export const Recap: St = { name: 'RecapCard', render: () => <RecapCard title="Lisbon Crew" dates="Oct 12 to 17, 2026" cover={photo.alfama} photos={ALBUM.slice(0, 3).map(a => a.src)} stats={[['places', '14'], ['photos', '212'], ['spent together', '$872.20']]} people={ppl} /> };
function Map() { const [a, setA] = useState(5); return <PlacesMap pins={PINS} active={a} onOpen={() => setA(x => (x % PINS.length) + 1)} />; }
export const Map_: St = { name: 'PlacesMap', render: () => <Map /> };
export const Stats: St = { name: 'StatTile', render: () => <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}><StatTile icon="pinLine" label="places" value="14" /><StatTile icon="images" label="photos" value="212" /><StatTile icon="poll" label="polls decided" value="4" /></div> };
export const Activity: St = { name: 'ActivityItem', render: () => <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{ACTIVITY.slice(0, 5).map(a => <ActivityItem key={a.id} act={a} person={P[a.who]} />)}</ul> };
function Notif() { const [open, setOpen] = useState(true); return <NotificationBanner title="Tomás: Drinks after fado?" body="Park Rooftop, Rua Nova do Carvalho, or home early. Closes 11:15 PM." time="9:40 PM" expanded={open} onToggle={() => setOpen(!open)} actions={['Park Rooftop', 'Rua Nova do Carvalho', 'Home, early night']} />; }
export const Notification: St = { name: 'NotificationBanner, vote actions', render: () => <Notif /> };
export const Lock: St = { name: 'LockScreen', parameters: { screen: 'full', statusLight: true }, render: () => <LockScreen time="10:39" date="Saturday, October 17" wallpaper={photo.alfama}><NotificationBanner title="Ari paid you $42.00 in cash" body="Tap to confirm you got it. The last $0.10 carries over to the next split." time="now" expanded actions={['Confirm $42.00', 'Not yet']} /></LockScreen> };
function Toggle() { const [v, setV] = useState(true); return <SettingsRow icon="sparkleX" title="Reduce Motion" sub="Fades instead of movement" toggle={v} onToggle={setV} />; }
export const Row: St = { name: 'SettingsRow', render: () => <SettingsGroup title="App" footer="Settings rows: value, toggle, chevron and destructive."><SettingsRow icon="cardX" tone="accent" title="Payment methods" value="Apple Pay" chevron /><Toggle /><SettingsRow icon="dollar" title="Currency" value="USD, $" /><SettingsRow icon="signOut" title="Sign out" destructive /></SettingsGroup> };
export const Profile: St = { name: 'ProfileHeader', render: () => <ProfileHeader person={P.ari} full="Ari Lindqvist" sub="San Francisco · on TripUp since 2024" stats={[['trips', '6'], ['crews', '3'], ['places reviewed', '11']]} /> };
function Choice() { const [v, setV] = useState('crew'); return <ChoiceList label="Default audience" value={v} onChange={setV} options={[{ id: 'crew', title: 'Crew album only', sub: 'You choose public for each post', icon: 'lockX' }, { id: 'public', title: 'Ask each time', sub: 'A toggle on every upload', icon: 'globeX' }]} />; }
export const Choices: St = { name: 'ChoiceList', render: () => <><Label>Privacy</Label><Choice /></> };
