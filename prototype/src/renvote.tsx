import React, { useEffect, useRef, useState } from 'react';
import { Icon, AppMark } from '@sb/components/Icon';
import { AVATAR } from '@sb/assets/solver-assets';
import { useApp, optIds, optDetail, PLACE_NAMES, tally, haptic } from './store';
import { EXPLORE_PLACES } from './screens1';

/*
 * v5.3 Ren votes from a link, no app.
 *   1 Messages: Ari's link arrives as a rich preview bubble (spring in from the left).
 *   2 Tap it: a light web poll slides up over Messages (inbound). Photo tiles, counts hidden until you vote.
 *   3 Tap a place: the tile takes the vote (check springs in), then the bars fill and the confirmation card rises.
 *   4 Back to Messages: the web view slides down (outbound) and Ren's reply goes out.
 * In the deck embed it plays itself; the guided tour drives it with real taps. Reduce Motion: fades only.
 */
type Phase = 'msg' | 'web' | 'done' | 'back';
const sp = new URLSearchParams(location.search);
// The deck holds this step still (hold=1), so here the vote plays itself; the guided tour drives it through the store instead.
const AUTO = () => sp.get('embed') === '1' && /[?&]hold=1/.test(location.hash);

export function RenVote() {
  const { s, d } = useApp();
  const voted = s.votes.ren;
  const [phase, setPhase] = useState<Phase>(voted != null ? 'back' : 'msg');
  const [pick, setPick] = useState<number | null>(voted ?? null);
  const t = tally(s.votes); const n = Object.keys(s.votes).length;
  const ids = optIds(s);
  const timers = useRef<number[]>([]);
  const later = (f: () => void, ms: number) => { timers.current.push(window.setTimeout(f, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const open = () => { haptic(); setPhase('web'); };
  const vote = (i: number) => {
    if (pick != null) return;
    haptic(16); setPick(i);
    later(() => d({ t: 'vote', who: 'ren', opt: i, via: 'the web as a guest' }), 380);
    later(() => setPhase('done'), 1100);
  };
  const leave = () => { haptic(); setPhase('back'); };
  // The guided tour drives the stages through the store.
  useEffect(() => { if (s.renStage === 'web' && phase === 'msg') setPhase('web'); if (s.renStage === 'back') setPhase('back'); }, [s.renStage]);
  // A vote from elsewhere (the tour script) lands here too.
  useEffect(() => { if (voted != null && pick == null) { setPick(voted); later(() => setPhase('done'), 700); } }, [voted]);
  // Deck embed: play the whole story once, then hold on Messages.
  useEffect(() => {
    if (!AUTO() || voted != null) return;
    later(() => setPhase('web'), 2000);
    later(() => vote(s.tiePath ? 1 : 0), 4200);
    later(() => setPhase('back'), 8200);
  }, []);
  const picked = pick != null ? PLACE_NAMES[ids[pick]][0] : '';
  return (
    <div className={`scr rv is-${phase}`}>
      {/* Messages, underneath */}
      <div className="rv-msgs" aria-hidden={phase === 'web' || phase === 'done'}>
        <header className="rv-mhead"><img src={AVATAR.ari} alt="" /><b>Ari</b><small>iMessage</small></header>
        <div className="rv-thread">
          <p className="rv-stamp tu-num">Today 7:19 PM</p>
          <p className="rv-b is-in">Dinner vote for tonight. Takes 5 seconds, no app.</p>
          <button type="button" className="rv-b is-in rv-link" onClick={open} aria-label="Open Saturday dinner poll, tripup.app">
            <span className="rv-link-ph">{ids.slice(0, 3).map(id => <img key={id} src={EXPLORE_PLACES.find(p => p.id === id)?.photo} alt="" />)}</span>
            <span className="rv-link-t"><b>Saturday dinner · Lisbon Crew</b><small>tripup.app · Vote by 7:30 PM</small></span>
          </button>
          {phase === 'back' && <p className="rv-b is-out">Voted for {picked || 'Taberna'}. See you at 8:30.</p>}
          {phase === 'back' && <p className="rv-read tu-num">Delivered</p>}
        </div>
        <div className="rv-compose" aria-hidden><span>iMessage</span></div>
      </div>

      {/* The guest web poll, over Messages */}
      <section className="rv-web" aria-label="Saturday dinner poll" aria-hidden={phase === 'msg' || phase === 'back'}>
        <div className="rv-sbar"><button type="button" className="rv-done" onClick={leave} tabIndex={phase === 'web' || phase === 'done' ? 0 : -1}>Done</button>
          <span className="rv-url"><Icon name="lock" size={12} />tripup.app</span><span className="rv-sp" /></div>
        <div className="rv-body">
          <div className="rv-brand"><AppMark size={24} /><b>TripUp</b><span>Guest · Ren</span></div>
          <h1 className="rv-h1">Saturday dinner</h1>
          <p className="rv-sub tu-num">Ari asked · closes 7:30 PM</p>
          {/* v5.4.2: no badge; counts still stay hidden until you vote */}{pick != null && <p className="rv-hide is-off">{`${n} of 7 voted`}</p>}
          <div className="rv-tiles">{ids.map((id, i) => {
            const on = pick === i; const pct = n ? Math.round((t[i] / n) * 100) : 0;
            return (
              <button key={id} type="button" className={`rv-tile ${on ? 'is-on' : ''} ${pick != null && !on ? 'is-dim' : ''}`} style={{ ['--i' as any]: i, ['--p' as any]: pick != null && voted != null ? pct / 100 : 0 }}
                onClick={() => vote(i)} aria-pressed={on} disabled={pick != null && !on} tabIndex={phase === 'web' ? 0 : -1}>
                <img src={EXPLORE_PLACES.find(p => p.id === id)?.photo} alt="" />
                <span className="rv-tile-t"><b>{PLACE_NAMES[id][0]}</b><small className="tu-num">{optDetail(s, i)}</small></span>
                <span className="rv-check" aria-hidden><Icon name="check" size={16} /></span>
                <span className="rv-bar" aria-hidden><i /></span>
                {pick != null && voted != null && <span className="rv-pct tu-num">{pct}%</span>}
              </button>);
          })}</div>
        </div>
        <div className="rv-ok" role="status" aria-live="polite">
          <span className="rv-ok-disc" aria-hidden><Icon name="check" size={22} /></span>
          <div><b>Your vote is in.</b><small className="tu-num">Results at 7:30 PM.</small></div>
          <button type="button" className="rv-ok-btn" onClick={leave} tabIndex={phase === 'done' ? 0 : -1}>Back to Messages</button>
        </div>
      </section>
    </div>
  );
}
