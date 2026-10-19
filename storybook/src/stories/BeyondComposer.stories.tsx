import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PollComposer, ComposerValue, ComposerPick } from '../components/beyond/composer';
import { FindHeader, FindQuestion, FindPicks, findStage } from '../components/beyond/findplace';
import { CurateAnswers } from '../components/beyond/explore';
import { COMMUNITY, DAYS } from '../lib/beyond';

const meta: Meta = { title: 'Components/Full JTBD analysis/Poll composer and Find a place', tags: ['autodocs'],
  parameters: { screen: 'phone', docs: { description: { component: 'New poll is one sentence with tappable tokens (type, when, closes). Options are photo tiles; swipe one left to remove it. One + Add option sheet takes a typed idea or an Explore pick. Find a place asks one question per screen with big tiles that answer and advance.' } } } };
export default meta;
type St = StoryObj;
const picks: ComposerPick[] = COMMUNITY.map(c => ({ id: c.id, name: c.name, kind: c.kind, photo: c.photos[0], meta: `${c.type} · ${c.price}` }));
const seed = (n: number): ComposerValue => ({ title: '', category: 'food', day: 'oct17', time: '8:30 PM', closes: '7:30 PM', options: COMMUNITY.slice(0, n).map(c => ({ label: c.name, from: `From Explore · ${c.price}`, photo: c.photos[0] })) });
function Composer({ n = 3 }: { n?: number }) {
  const [v, setV] = useState(seed(n));
  return <div className="b-scr" style={{ position: 'relative', height: 874 }}><PollComposer value={v} onChange={x => setV(o => ({ ...o, ...x }))} days={DAYS} today="oct17" picks={picks} onSend={() => {}} onBack={() => {}} /></div>;
}
function Find({ start = {} }: { start?: CurateAnswers }) {
  const [a, setA] = useState<CurateAnswers>(start);
  const [picked, setPicked] = useState<string[]>([]);
  return <div className="b-scr b-cmp" style={{ position: 'relative', height: 874 }}><div className="b-cmp-amb" aria-hidden /><FindHeader answers={a} onBack={() => setA({})} />
    <div className="b-scroll b-cmp-scroll is-q"><FindQuestion answers={a} onAnswer={setA} />{findStage(a) >= 4 && <FindPicks answers={a} list={COMMUNITY.slice(0, 6)} onOpen={() => {}} picked={picked} onToggle={id => setPicked(x => x.includes(id) ? x.filter(y => y !== id) : [...x, id])} />}</div></div>;
}
export const ThreeOptions: St = { name: 'Composer · Saturday dinner, 3 options', render: () => <Composer /> };
export const OneOption: St = { name: 'Composer · from the feed, 1 option', render: () => <Composer n={1} /> };
export const FindFirst: St = { name: 'Find a place · first question: what kind', render: () => <Find /> };
export const FindPrice: St = { name: 'Find a place · price point', render: () => <Find start={{ after: 0 } as CurateAnswers} /> };
export const FindGetting: St = { name: 'Find a place · getting there', render: () => <Find start={{ after: 0, budget: 1 } as CurateAnswers} /> };
export const FindPicksDone: St = { name: 'Find a place · picks', render: () => <Find start={{ mode: 'walk', dur: 1, after: 0, budget: 1 } as CurateAnswers} /> };
export const Dark: St = { name: 'Composer · dark', globals: { theme: 'dark' }, render: () => <Composer /> };
