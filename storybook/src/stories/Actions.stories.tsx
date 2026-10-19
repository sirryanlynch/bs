import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, IconButton } from '../components/core';
import { iconNames } from '../components/Icon';
import { Label, Row } from './_helpers';

const meta: Meta<typeof Button> = {
  title: 'Components/Actions',
  component: Button,
  tags: ['autodocs'],
  args: { label: 'Send to group', variant: 'primary', size: 'large' },
  argTypes: { icon: { control: 'select', options: [undefined, ...iconNames] } },
  parameters: { docs: { description: { component: 'Pill buttons. One primary per screen. Glass is for buttons that float over photos or the celebration wash.' } } },
};
export default meta;
type S = StoryObj<typeof Button>;
export const ButtonPlayground: S = { name: 'Button' };
export const ButtonVariants: S = {
  render: () => (
    <>
      <Label>Variants</Label>
      <Button label="Send to group" fullWidth />
      <Button label="Add expense" variant="secondary" icon="plus" fullWidth />
      <Button label="Share the recap" variant="glass" icon="share" fullWidth />
      <Button label="Remove from trip" variant="destructive" fullWidth />
      <Button label="Pay a different amount" variant="plain" fullWidth />
      <Label>Sizes</Label>
      <Row><Button label="Large" /><Button label="Medium" size="medium" /><Button label="Small" size="small" /></Row>
      <Label>States</Label>
      <Row><Button label="Disabled" disabled size="medium" /><Button label="Save" loading size="medium" /><Button label="Vote" icon="check" size="medium" variant="secondary" /></Row>
    </>
  ),
};

export const IconButtons: StoryObj<typeof IconButton> = {
  render: (a) => (
    <>
      <Label>Playground</Label>
      <Row><IconButton {...a} /></Row>
      <Label>Variants</Label>
      <Row><IconButton icon="share" label="Share" variant="glass" /><IconButton icon="more" label="More" variant="tinted" /><IconButton icon="plus" label="Add" variant="filled" /><IconButton icon="close" label="Close" variant="plain" /></Row>
      <Label>Sizes and badge</Label>
      <Row><IconButton icon="bell" label="Activity" variant="tinted" /><IconButton icon="bell" label="Activity" badge={3} /><IconButton icon="camera" label="Scan receipt" size={52} variant="filled" /><IconButton icon="trash" label="Delete" disabled variant="tinted" /></Row>
    </>
  ),
  args: { icon: 'personAdd', label: 'Invite', variant: 'glass', size: 44 } as any,
  argTypes: { icon: { control: 'select', options: iconNames }, variant: { control: 'inline-radio', options: ['glass', 'tinted', 'filled', 'plain'] }, size: { control: 'inline-radio', options: [36, 44, 52] } } as any,
};
