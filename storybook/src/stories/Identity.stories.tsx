import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Avatar, AvatarStack, BalanceChip } from '../components/core';
import { people, crewWithRen } from '../lib/data';
import { Label, Row } from './_helpers';

const meta: Meta = { title: 'Components/Identity', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Initials on a quiet tinted pearl. Tints are neutral on purpose so the iris ring can mark you without competing.' } } } };
export default meta;

export const AvatarPlayground: StoryObj<typeof Avatar> = {
  name: 'Avatar',
  render: (a: any) => (
    <>
      <Row><Avatar person={people[a.person as keyof typeof people]} size={a.size} ring={a.ring} status={a.status} /></Row>
      <Label>Everyone</Label>
      <Row gap={14}>{crewWithRen.map(p => <Avatar key={p.id} person={p} size={44} />)}</Row>
      <Label>Sizes</Label>
      <Row gap={14}>{([24, 28, 36, 44, 56, 72] as const).map(s => <Avatar key={s} person={people.mara} size={s} />)}</Row>
      <Label>Rings and status</Label>
      <Row gap={16}><Avatar person={people.ari} size={44} /><Avatar person={people.mara} size={44} ring="leading" /><Avatar person={people.joao} size={44} ring="settled" /><Avatar person={people.nic} size={44} status="voted" /><Avatar person={people.ren} size={44} status="pending" /></Row>
    </>
  ),
  args: { person: 'ari', size: 56, ring: undefined, status: 'none' } as any,
  argTypes: { person: { control: 'select', options: Object.keys(people) }, size: { control: 'select', options: [24, 28, 36, 44, 56, 72] }, ring: { control: 'select', options: [undefined, 'none', 'you', 'leading', 'settled'] }, status: { control: 'inline-radio', options: ['none', 'voted', 'pending'] } } as any,
};

export const Stack: StoryObj<typeof AvatarStack> = {
  name: 'AvatarStack',
  render: (a: any) => (
    <>
      <Row><AvatarStack people={crewWithRen.slice(0, a.count)} max={a.max} size={a.size} /></Row>
      <Label>Sizes</Label>
      <AvatarStack people={crewWithRen} size={24} max={4} />
      <AvatarStack people={crewWithRen} size={28} max={5} />
      <AvatarStack people={crewWithRen} size={36} max={6} />
    </>
  ),
  args: { count: 6, max: 4, size: 28 } as any,
  argTypes: { count: { control: { type: 'range', min: 1, max: 6 } }, max: { control: { type: 'range', min: 1, max: 6 } }, size: { control: 'inline-radio', options: [24, 28, 36] } } as any,
};

export const Balance: StoryObj<typeof BalanceChip> = {
  name: 'BalanceChip',
  render: (a) => (
    <>
      <Row><BalanceChip {...a} /></Row>
      <Label>States</Label>
      <Row><BalanceChip amount={42.1} /><BalanceChip amount={-18.4} /><BalanceChip amount={0} /></Row>
      <Label>Small, on cards</Label>
      <Row><BalanceChip amount={42.1} size="small" /><BalanceChip amount={-18.4} size="small" /><BalanceChip amount={0} size="small" /></Row>
    </>
  ),
  args: { amount: 42.1, size: 'medium' },
};
