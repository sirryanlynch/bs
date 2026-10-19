import React, { useState } from 'react';
import { Icon, AppMark } from '@sb/components/Icon';
import { Button } from '@sb/components/core';
import { PollOption } from '@sb/components/poll';
import { usd } from '@sb/lib/data';
import { useApp, optIds, optName, optDetail, PLACE_NAMES, tally, simplifyOf, haptic } from './store';
import { EXPLORE_PLACES } from './screens1';
import { RenVote } from './renvote';
import './renvote.css';

/** Ren has no app. Everything Ren sees lives at one guest link in mobile Safari, and it follows the trip live. */
export function RenWeb() {
  const { s, d } = useApp();
  const [pick, setPick] = useState<number | null>(null);
  const t = tally(s.votes); const n = Object.keys(s.votes).length;
  const plan = simplifyOf(s);
  const owe = s.dinnerSaved ? plan.find(e => e.from === 'ren') : undefined;
  const owed = owe ? s.paid[`${owe.from}>${owe.to}`] : undefined;
  let body: React.ReactNode;
  // v5.3: the vote is its own inbound and outbound flow, from the Messages link to the confirmation and back.
  if (s.step === 'live' && s.renJoined) return <RenVote />;
  if (!s.renJoined) {
    body = (<>
      <h1 className="pt-web-h1">Join Lisbon Crew</h1>
      <p className="pt-web-p">Ari invited you. No app needed.</p>
      <label className="pt-web-field"><span>Your name</span><input defaultValue="Ren" aria-label="Your name" /></label>
      <Button label="Join as a guest" fullWidth onClick={() => { haptic(14); d({ t: 'join', via: 'qr' }); }} />
    </>);
  } else if (s.pollSent && !s.pollClosed) {
    const mine = s.votes.ren;
    body = (<>
      <h1 className="pt-web-h1">Saturday dinner</h1>
      <p className="pt-web-p tu-num">{n} of 7 voted · closes 7:30 PM</p>
      <div className="pt-poll-opts">{optIds(s).map((id, i) => (
        <PollOption key={id} label={PLACE_NAMES[id][0]} detail={optDetail(s, i)} votes={mine != null ? t[i] : 0} total={Math.max(n, 1)}
          photo={EXPLORE_PLACES.find(p => p.id === id)?.photo} state={(mine ?? pick) === i ? 'yourVote' : 'default'} onVote={() => mine == null && setPick(i)} />
      ))}</div>
      {mine == null ? <Button label="Vote as Ren" fullWidth disabled={pick == null} onClick={() => { haptic(16); d({ t: 'vote', who: 'ren', opt: pick!, via: 'the web as a guest' }); }} />
        : <p className="pt-web-ok"><Icon name="check" size={20} />Voted. Results update live.</p>}
    </>);
  } else if (!s.dinnerSaved) {
    body = (<>
      <h1 className="pt-web-h1">{s.pollClosed ? `Dinner at ${optName(s, s.winner, true)}` : 'Tonight'}</h1>
      <ul className="pt-web-list">
        <li><b>6:00 PM</b>Sunset, Santa Catarina</li>
        <li><b>8:30 PM</b>{s.pollClosed ? optName(s, s.winner) : 'Dinner, poll soon'}</li>
        <li><b>11:00 PM</b>Fado, Tasca do Chico</li>
      </ul>
    </>);
  } else {
    body = (<>
      <h1 className="pt-web-h1 tu-num">{owe && owed !== 'app' && owed !== 'cash' ? `You owe Ari ${usd(owe.amt)}` : 'You are square'}</h1>
      <p className="pt-web-p">Dinner {usd(30.1)}, no wine. Your fado tickets are netted in.</p>
      {owe && !owed && <Button label={`Pay Ari ${usd(owe.amt)} with MB WAY`} fullWidth onClick={() => {
        haptic(18); const k = `${owe.from}>${owe.to}`; d({ t: 'pay', key: k, how: 'pending' }); d({ t: 'done', key: 'settle' });
        setTimeout(() => { d({ t: 'pay', key: k, how: 'app' }); d({ t: 'toast', msg: `Paid Ari ${usd(owe.amt)}`, tone: 'success' }); }, 1000);
        plan.filter(e => e.from !== 'ren').forEach((e, i) => setTimeout(() => d({ t: 'pay', key: `${e.from}>${e.to}`, how: 'app' }), 2000 + i * 900));
      }} />}
      {owed === 'pending' && <p className="pt-web-ok"><span className="p-spinner p-spinner-sm" />Sending</p>}
      {(owed === 'app' || owed === 'cash') && <p className="pt-web-ok"><Icon name="check" size={20} />Paid. Thanks, Ren.</p>}
    </>);
  }
  return (
    <div className="scr pt-web">
      <div className="pt-web-bar"><span className="tu-glass"><Icon name="lock" size={14} />tripup.app/j/lisbon-crew-742</span></div>
      <div className="pt-web-scroll">
        <div className="pt-web-brand"><AppMark size={28} /><b>TripUp</b><span>Guest</span></div>
        {body}
      </div>
    </div>
  );
}
