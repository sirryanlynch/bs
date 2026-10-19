import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SegmentedControl, FilterChip, TextField, Toggle, Stepper, ListRow, ListGroup, RowIcon, Avatar } from '../components/core';
import { people } from '../lib/data';
import { Label, Row } from './_helpers';

const meta: Meta = { title: 'Components/Inputs', tags: ['autodocs'] };
export default meta;

export const Segmented: StoryObj<typeof SegmentedControl> = {
  name: 'SegmentedControl',
  args: { options: ['Balances', 'Activity', 'Settle'], glass: false },
  render: (a) => (<>
    <SegmentedControl {...a} />
    <Label>Two options</Label><SegmentedControl options={['Upcoming', 'Past']} />
    <Label>Glass, over content</Label><SegmentedControl options={['List', 'Map', 'Day']} value="Map" glass />
  </>),
};

export const Chips: StoryObj<typeof FilterChip> = {
  name: 'FilterChip',
  args: { label: 'Food', selected: true, count: 8, dismissible: false },
  render: (a) => (<>
    <Row><FilterChip {...a} /></Row>
    <Label>Filter row</Label>
    <div className="p-chips"><FilterChip label="All" selected /><FilterChip label="Food" icon="fork" count={8} /><FilterChip label="Drinks" icon="wine" count={3} /><FilterChip label="Stay" icon="bed" /><FilterChip label="Getting around" icon="tram" /></div>
    <Label>Selected, dismissible</Label>
    <Row><FilterChip label="Paid by Mara" selected dismissible /><FilterChip label="Excludes me" selected dismissible /></Row>
  </>),
};

export const Fields: StoryObj<typeof TextField> = {
  name: 'TextField & Search',
  args: { label: 'What was it for?', placeholder: 'Dinner, taxi, tickets', kind: 'text' },
  argTypes: { kind: { control: 'inline-radio', options: ['text', 'search', 'amount'] } },
  render: (a) => (<>
    <TextField {...a} />
    <Label>Search</Label>
    <TextField kind="search" placeholder="Search Lisbon places" />
    <TextField kind="search" value="Ramiro" />
    <Label>States</Label>
    <TextField label="Trip name" value="Lisbon Crew" helper="Everyone sees this name" />
    <TextField label="Amount" prefix="€" value="186,40" error="That is more than the receipt total of €162.40" />
    <TextField label="Booking ref" value="TP-4471" disabled />
    <Label>Amount entry</Label>
    <TextField kind="amount" prefix="€" value="186.40" helper="Dinner at O Velho Eurico" />
  </>),
};

export const Switches: StoryObj<typeof Toggle> = {
  name: 'Toggle & Stepper',
  args: { checked: true, label: 'Anonymous votes' },
  render: (a) => (<>
    <Row><Toggle {...a} /></Row>
    <ListGroup header="Poll settings">
      <ListRow title="Anonymous votes" subtitle="Hide who picked what" trailing={<Toggle checked label="Anonymous votes" />} />
      <ListRow title="Allow several picks" trailing={<Toggle label="Allow several picks" />} />
      <ListRow title="Lock after close" trailing={<Toggle checked disabled label="Lock after close" />} />
    </ListGroup>
    <ListGroup header="Split by shares">
      <ListRow leading={<Avatar person={people.mara} size={36} ring="none" />} title="Mara" subtitle="Brought her sister" trailing={<Stepper value={2} label="Mara shares" />} />
      <ListRow leading={<Avatar person={people.joao} size={36} ring="none" />} title="João" trailing={<Stepper value={1} min={0} label="João shares" />} />
      <ListRow leading={<Avatar person={people.nic} size={36} ring="none" />} title="Nic" subtitle="Skipping this one" trailing={<Stepper value={0} label="Nic shares" />} />
    </ListGroup>
  </>),
};

export const Rows: StoryObj<typeof ListRow> = {
  name: 'ListRow',
  args: { title: 'Notifications', subtitle: 'Polls, payments and plan changes', chevron: true },
  render: (a) => (<>
    <ListGroup><ListRow {...a} leading={<RowIcon icon="bell" />} /></ListGroup>
    <ListGroup header="Trip" footer="Members can add plans and expenses. Only Ari can remove people.">
      <ListRow leading={<RowIcon icon="calendar" tone="accent" />} title="Dates" value="12 to 17 Oct" chevron />
      <ListRow leading={<RowIcon icon="pin" />} title="Base" value="Alfama" chevron />
      <ListRow leading={<RowIcon icon="wallet" tone="owed" />} title="Currency" value="EUR" chevron />
      <ListRow leading={<RowIcon icon="personAdd" />} title="Invite people" chevron />
    </ListGroup>
    <ListGroup>
      <ListRow title="Leave trip" destructive onClick={() => {}} />
    </ListGroup>
  </>),
};
