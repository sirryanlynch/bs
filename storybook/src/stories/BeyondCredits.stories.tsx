import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { PHOTO_CREDITS } from '../lib/beyond';

const meta: Meta = { title: 'Patterns/Full JTBD analysis/Photo credits', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Every photo in the Full JTBD analysis flows is from Pexels (free license). The list is the single source used by the code.' } } } };
export default meta;
export const Credits: StoryObj = { name: 'Photo credits', render: () => (
  <table style={{ font: '13px/1.5 Inter, system-ui, sans-serif', borderCollapse: 'collapse' }}>
    <thead><tr><th style={{ textAlign: 'left', padding: 6 }}>Photo</th><th style={{ textAlign: 'left', padding: 6 }}>Photographer</th><th style={{ textAlign: 'left', padding: 6 }}>Subject</th></tr></thead>
    <tbody>{PHOTO_CREDITS.map(([id, who, what]) => (
      <tr key={id}><td style={{ padding: 6 }}><img src={`./photos/${id}.jpg`} alt="" width={56} height={40} style={{ objectFit: 'cover', borderRadius: 6 }} /></td>
        <td style={{ padding: 6 }}>{who}, Pexels #{id.replace('px_', '')}</td><td style={{ padding: 6 }}>{what}</td></tr>
    ))}</tbody>
  </table>
) };
