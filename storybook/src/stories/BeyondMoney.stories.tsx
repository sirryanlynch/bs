import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { ReceiptScanner, ParsedLines, SplitModeControl, LineItemAssigner, SharesEditor, TipTax, PerPerson, SplitMode } from '../components/beyond/expense';
import { RECEIPT, RECEIPT_TOTAL, CREW, P } from '../lib/beyond';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Full JTBD analysis/Add expense', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Receipt scan, parsed lines, assignment and split modes. Lunch at Zé da Mouraria is $185.50 plus a 10% tip ($204.05), and Ren and Nic skip the wine, so with Polvo for Mara and João they pay $16.58, and the crew owes Ari $175.60.' } } } };
export default meta;
type St = StoryObj;
const ppl = CREW.map(id => ({ ...P[id], you: id === 'ari' }));
const ALLP = CREW;

function Scan() { const [ph, setPh] = useState<'aim' | 'scanning' | 'done'>('aim'); useEffect(() => { const a = setTimeout(() => setPh('scanning'), 900); const b = setTimeout(() => setPh('done'), 3400); return () => { clearTimeout(a); clearTimeout(b); }; }, []); return <ReceiptScanner phase={ph} lines={RECEIPT} total={RECEIPT_TOTAL} />; }
export const Scanner: St = { name: 'ReceiptScanner, scanning', parameters: { screen: 'full', statusLight: true }, render: () => <div style={{ position: 'absolute', inset: 0, background: '#0E0E12' }}><Scan /></div> };
export const ScannerReduce: St = { name: 'ReceiptScanner, Reduce Motion', globals: { motion: 'reduce' }, parameters: { screen: 'full', statusLight: true }, render: () => <div style={{ position: 'absolute', inset: 0, background: '#0E0E12' }}><ReceiptScanner phase="scanning" lines={RECEIPT} total={RECEIPT_TOTAL} /></div> };
export const Lines: St = { name: 'ParsedLines', render: () => <ParsedLines lines={RECEIPT} total={RECEIPT_TOTAL} /> };
function Mode() { const [m, setM] = useState<SplitMode>('item'); return <SplitModeControl value={m} onChange={setM} />; }
export const Modes: St = { name: 'SplitModeControl', render: () => <Mode /> };
function Assign() { const [a, setA] = useState<Record<string, string[]>>(Object.fromEntries(RECEIPT.map(l => [l.id, l.id === 'wine' ? ALLP.filter(x => x !== 'ren' && x !== 'nic') : ALLP]))); const [open, setOpen] = useState('wine');
  return <LineItemAssigner lines={RECEIPT} assign={a} people={ppl} open={open} onOpen={setOpen} onToggle={(l, w) => setA(x => ({ ...x, [l]: x[l].includes(w) ? x[l].filter(y => y !== w) : [...x[l], w] }))} />; }
export const Assigner: St = { name: 'LineItemAssigner, wine without Ren and Nic', render: () => <Assign /> };
function Shares() { const [s, setS] = useState<Record<string, number>>({ ari: 1, mara: 2, nic: 1, joao: 1, sofia: 1, tomas: 1, ren: 1 }); return <SharesEditor people={ppl} shares={s} onChange={(id, n) => setS(x => ({ ...x, [id]: n }))} />; }
export const SharesEd: St = { name: 'SharesEditor', render: () => <Shares /> };
function Tip() { const [t, setT] = useState(10); return <TipTax subtotal={RECEIPT_TOTAL} tip={t} onTip={setT} />; }
export const TipAndTax: St = { name: 'TipTax', render: () => <Tip /> };
export const People: St = { name: 'PerPerson', render: () => <><Label>By item, wine excluded for Ren and Nic</Label><PerPerson people={ppl} amounts={{ ari: 28.45, mara: 42.76, nic: 16.58, joao: 42.76, sofia: 28.46, tomas: 28.46, ren: 16.58 }} highlight={['nic', 'ren']} /></> };
