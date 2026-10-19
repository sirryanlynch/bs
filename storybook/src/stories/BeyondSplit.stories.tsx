import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SplitEditor, applyEven, applyAudience, type SplitLine, type SplitMode } from '../components/beyond/spliteditor';
import { people } from '../lib/data';

const meta: Meta = { title: 'Components/Full JTBD analysis/Split editor', tags: ['autodocs'],
  parameters: { screen: 'phone', docs: { description: { component: 'Who had what. Even split or By item, one "Who was there" audience for the whole bill, and only exceptions get edited. Lisbon dinner: $248.70, Ren and Nic skip the wine.' } } } };
export default meta;
type St = StoryObj;
const CREW = ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'];
const BASE: SplitLine[] = [
  { id: 'clams', label: 'Amêijoas à Bulhão Pato', qty: 2, price: 34, who: CREW }, { id: 'polvo', label: 'Polvo à lagareiro', price: 52, who: CREW },
  { id: 'bac', label: 'Bacalhau à Brás', qty: 2, price: 38, who: CREW }, { id: 'wine', label: 'Vinho Verde', qty: 2, price: 38, who: CREW },
  { id: 'agua', label: 'Água', qty: 3, price: 9, who: CREW }, { id: 'nata', label: 'Pastéis de nata', qty: 7, price: 17.5, who: CREW }, { id: 'pao', label: 'Couvert', price: 22.2, who: CREW }];
function Demo({ mode: m0 = 'even', wineOff, open }: { mode?: SplitMode; wineOff?: boolean; open?: string }) {
  const [mode, setMode] = useState<SplitMode>(m0); const [aud, setAud] = useState(CREW);
  const [lines, setLines] = useState(BASE.map(l => l.id === 'wine' && wineOff ? { ...l, who: CREW.filter(x => x !== 'ren' && x !== 'nic') } : l));
  return <div className="b-scr" style={{ height: 874, overflow: 'auto', paddingTop: 16 }}><SplitEditor title="Dinner at Taberna · Sat, Oct 17" total={248.7} lines={lines} people={CREW.map(id => (people as any)[id])} audience={aud} mode={mode} defaultOpen={open}
    onMode={x => { setMode(x); if (x === 'even') setLines(applyEven(lines, aud)); }} onAudience={ids => { setLines(mode === 'even' ? applyEven(lines, ids) : applyAudience(lines, aud, ids)); setAud(ids); }}
    onLine={(id, who) => setLines(lines.map(l => l.id === id ? { ...l, who } : l))} /></div>;
}
export const Even: St = { name: 'Even split', render: () => <Demo /> };
export const ByItem: St = { name: 'By item, wine without Ren and Nic', render: () => <Demo mode="item" wineOff open="wine" /> };
export const Reduce: St = { name: 'Reduce Motion', globals: { motion: 'reduce' }, render: () => <Demo mode="item" wineOff /> };
