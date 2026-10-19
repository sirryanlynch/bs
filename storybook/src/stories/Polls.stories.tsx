import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';
import { PollOption, PollCard, PollBuilder, Countdown } from '../components/poll';
import { people as P, places } from '../lib/data';
import { dinnerPoll, dinnerPollClosed, voters } from '../lib/scenario';
import { Label } from './_helpers';

const meta: Meta = { title: 'Components/Polls', tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Group decisions. Fills spring to the vote share on every change. Iris marks your vote and the leader. The spectrum only appears once a poll closes on a winner.' } } } };
export default meta;

export const Option: StoryObj<typeof PollOption> = {
  name: 'PollOption',
  args: { label: 'Taberna da Rua das Flores', detail: 'Chiado · petiscos · $$', votes: 3, total: 6, state: 'leading', photo: places.taberna.photo },
  argTypes: { state: { control: 'inline-radio', options: ['default', 'yourVote', 'leading', 'winner'] }, votes: { control: { type: 'range', min: 0, max: 6 } } },
  render: (a) => (<>
    <PollOption {...a} voters={[P.mara, P.joao, P.sofia].slice(0, a.votes)} />
    <Label>Default</Label><PollOption label="O Velho Eurico" detail="Alfama · tasca · $$" votes={1} total={6} />
    <Label>Your vote</Label><PollOption label="Cervejaria Ramiro" detail="Intendente · seafood · $$$" votes={2} total={6} state="yourVote" voters={[P.ari, P.nic]} />
    <Label>Leading</Label><PollOption label="Taberna da Rua das Flores" detail="Chiado · petiscos · $$" votes={3} total={6} state="leading" voters={[P.mara, P.joao, P.sofia]} />
    <Label>Winner, after close</Label><PollOption label="Taberna da Rua das Flores" detail="Booked Fri 8:30 PM" votes={5} total={7} state="winner" closed voters={[P.mara, P.joao, P.sofia, P.nic, P.ren]} />
  </>),
};

function LiveFill() {
  const [v, setV] = useState([1, 0, 0]);
  useEffect(() => { const seq = [[1,0,0],[2,0,0],[2,1,0],[2,1,1],[3,1,1],[3,2,1],[4,2,0]]; let i = 0; const t = setInterval(() => { i = (i + 1) % seq.length; setV(seq[i]); }, 1100); return () => clearInterval(t); }, []);
  const total = v.reduce((a, b) => a + b, 0);
  const max = Math.max(...v);
  return (<>
    {dinnerPoll.options.map((o, i) => <PollOption key={o.label} label={o.label} detail={o.detail} photo={o.photo} votes={v[i]} total={total} state={i === 1 ? 'yourVote' : v[i] === max && v.filter(x => x === max).length === 1 ? 'leading' : 'default'} />)}
    <p className="scr-hint tu-num">{total} votes in. Fills use spring.live; Reduce Motion swaps to a 200 ms ease.</p>
  </>);
}
export const LiveAnimatedFill: StoryObj = { name: 'PollOption · live fill', render: () => <LiveFill /> };

export const Card: StoryObj<typeof PollCard> = {
  name: 'PollCard',
  args: { status: 'open', live: false, anonymous: false, endsInMinutes: 135 },
  argTypes: { status: { control: 'inline-radio', options: ['open', 'closed'] } },
  render: (a) => <PollCard {...a} {...(a.status === 'closed' ? dinnerPollClosed : dinnerPoll)} voters={voters} author={P.mara} yourVote={a.status === 'closed' ? undefined : 1} />,
};
export const CardLive: StoryObj = { name: 'PollCard · live votes', render: () => <PollCard {...dinnerPoll} voters={voters} author={P.mara} live endsInMinutes={18} /> };
export const CardUrgent: StoryObj = { name: 'PollCard · closing soon, anonymous', render: () => <PollCard question="Sintra on Sunday or a beach day?" options={[{ label: 'Sintra, Pena Palace', detail: '40 min train from Rossio', votes: 2 }, { label: 'Costa da Caparica', detail: '35 min by bus', votes: 2 }]} voters={voters} anonymous endsInMinutes={42} /> };
export const CardClosed: StoryObj = { name: 'PollCard · winner', render: () => <PollCard {...dinnerPollClosed} voters={voters} author={P.mara} status="closed" /> };

export const Builder: StoryObj<typeof PollBuilder> = {
  name: 'PollBuilder',
  args: { question: 'Saturday dinner', anonymous: false, multi: false, closesIn: '6 hours' },
  render: (a) => <PollBuilder {...a} />,
};

export const Timer: StoryObj<typeof Countdown> = {
  name: 'Countdown',
  args: { endsInMinutes: 135, variant: 'pill' },
  argTypes: { variant: { control: 'inline-radio', options: ['pill', 'large', 'inline'] } },
  render: (a) => (<>
    <Countdown {...a} />
    <Label>Pill</Label><div><Countdown endsInMinutes={135} /></div>
    <Label>Urgent, under an hour</Label><div><Countdown endsInMinutes={18} /></div>
    <Label>Large</Label><Countdown endsInMinutes={135} variant="large" />
    <Label>Large, urgent</Label><Countdown endsInMinutes={18} variant="large" />
    <Label>Closed</Label><div><Countdown endsInMinutes={0} /></div>
  </>),
};
