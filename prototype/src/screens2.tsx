import { PollComposer, ComposerValue, ComposerPick } from '@sb/components/beyond/composer';
import { COMMUNITY, DAYS } from '@sb/lib/beyond';
import { CoreHeader } from './screens1';
import React, { useEffect, useState } from 'react';
import { Icon, AppMark } from '@sb/components/Icon';
import { Avatar, Button, Toggle, ListRow, ListGroup } from '@sb/components/core';
import { PollOption } from '@sb/components/poll';
import { Notification, LiveActivity } from '@sb/components/feedback';
import { CelebrationOverlay } from '@sb/components/overlays';
import { photo } from '@sb/lib/data';
import { useReducedMotion } from '@sb/lib/PrismRoot';
import { useApp, optName, optDetail, optIds, STREAM, tally, haptic, PLACE_NAMES } from './store';
import { TopBar, Tabs, crewOf, ItinBlock, EXPLORE_PLACES } from './screens1';

const photoOf = (id: string) => EXPLORE_PLACES.find(p => p.id === id)?.photo;
void AppMark;

/* ---------------- 05 Create poll ---------------- */
export function Create() {
  const { s, d } = useApp();
  // v5: the same sentence composer as New poll, seeded with the three picks from Explore. The core story keeps these three options.
  const [v, setV] = useState<ComposerValue>(() => ({ title: '', category: 'food', day: 'oct17', time: '8:30 PM', closes: '7:30 PM',
    options: optIds(s).map(id => ({ label: PLACE_NAMES[id][0], from: `From Explore · ${PLACE_NAMES[id][2]}`, photo: photoOf(id) })) }));
  const picks: ComposerPick[] = COMMUNITY.map(c => ({ id: c.id, name: c.name, kind: c.kind, photo: c.photos[0], meta: `${c.type} · ${c.price} · ${c.walk ? `${c.walk} min walk` : c.area}` }));
  return (
    <div className="scr">
      <PollComposer value={v} onChange={x => setV(o => ({ ...o, ...x }))} days={DAYS} today="oct17" picks={picks} crew={7} onBack={() => d({ t: 'go', step: 'explore' })}
        onExplore={() => { haptic(); d({ t: 'set', patch: { exploreFeed: false, exploreStage: 0, shortlist: [] } }); d({ t: 'go', step: 'explore' }); }}
        onSend={() => { haptic(18); d({ t: 'set', patch: { pollSent: true } }); d({ t: 'done', key: 'create' }); d({ t: 'go', step: 'push' }); }} />
    </div>
  );
}

/* ---------------- 06 Push on Nic's Lock Screen ---------------- */
export function Push() {
  const { s, d, P } = useApp();
  const [open, setOpen] = useState(false);
  const voted = s.votes.nic != null;
  const vote = (i: number) => { haptic(18); d({ t: 'vote', who: 'nic', opt: i, via: 'the push' }); d({ t: 'done', key: 'push' }); setTimeout(() => d({ t: 'go', step: 'live' }), 900); };
  return (
    <div className="scr pt-lock">
      <div className="p-lock" style={{ backgroundImage: `url(${photo.tram})` }} />
      <div className="p-lock-inner">
        <p className="p-lock-date">{s.me === 'nic' ? 'Saturday, October 17' : "Nic's iPhone · Saturday, October 17"}</p>
        <p className="p-lock-time pt-lock-time">7:02 PM</p>
        <button type="button" className="pt-notifbtn" onClick={() => { haptic(12); setOpen(true); }} aria-expanded={open} aria-label="Ari started a poll. Open to vote">
          <Notification title="Ari started a poll" body={voted ? `You voted ${optName(s, s.votes.nic, true)}` : 'Where do we eat tonight? Closes 7:30 PM.'} person={P.ari} time="now" />
        </button>
        {open && !voted ? (
          <div className="pt-notif-actions tu-glass-thick anim-pop" role="group" aria-label="Vote from the notification">
            {optIds(s).map((id, i) => <button key={id} type="button" onClick={() => vote(i)}>{PLACE_NAMES[id][0]}</button>)}
          </div>
        ) : <LiveActivity kind="poll" />}
      </div>
    </div>
  );
}

/* ---------------- 07 Live poll ---------------- */
/** Votes stream in while the poll is live, whoever's screen is showing. */
export function usePollStream() {
  const { s, d } = useApp();
  const reduce = useReducedMotion();
  const live = s.step === 'live';
  useEffect(() => {
    if (!live || s.pollClosed) return;
    // v5.3: as Ren, the crew is at 5 of 7 when the link arrives; the rest wait for Ren's own vote.
    if (s.me === 'ren' && s.votes.ren == null && Object.keys(s.votes).length >= 5) return;
    const next = STREAM(s.tiePath).find(v => s.votes[v.who] == null && v.who !== s.me);
    if (!next) return;
    const t = setTimeout(() => { haptic(6); d({ t: 'vote', who: next.who, opt: next.opt, via: next.via }); }, reduce ? 700 : 1300);
    return () => clearTimeout(t);
  }, [live, s.votes, s.pollClosed, s.tiePath, reduce]);
  useEffect(() => { if (live && s.pollClosed && s.me !== 'ren') { const t = setTimeout(() => d({ t: 'go', step: 'closed' }), 900); return () => clearTimeout(t); } }, [live, s.pollClosed]);
}

export function PollView() {
  const { s, d, P, nm } = useApp();
  const crew = crewOf(true);
  const t = tally(s.votes); const n = Object.keys(s.votes).length; const max = Math.max(...t);
  const leaders = t.filter(x => x === max).length;
  const waiting = crew.filter(id => s.votes[id] == null);
  const others = waiting.filter(id => id !== s.me); // you never remind yourself
  const closed = !!s.pollClosed && s.winner != null;
  const mine = s.votes[s.me];
  return (
    <div className="scr">
      <div className="scr-scroll">
        <TopBar back="Lisbon Crew" onBack={() => d({ t: 'go', step: 'trip' })} title="Saturday dinner" sub={closed ? `Closed · ${n} of 7 voted` : `${n} of 7 voted · closes 7:30 PM`} />
        {!closed && mine == null && <p className="pt-prompt">Tap a place to vote. Counts show once you do.</p>}
        <div className="pt-poll-opts" aria-live="polite">
          {optIds(s).map((id, i) => (
            <PollOption key={id} label={PLACE_NAMES[id][0]} detail={optDetail(s, i)} votes={mine == null && !closed ? 0 : t[i]} total={Math.max(n, 1)} photo={photoOf(id)}
              state={closed ? (s.winner === i ? 'winner' : mine === i ? 'yourVote' : 'default') : mine === i ? 'yourVote' : mine != null && t[i] === max && max > 0 && leaders === 1 ? 'leading' : 'default'}
              closed={closed} onVote={() => { if (!closed) { haptic(); d({ t: 'vote', who: s.me, opt: i }); } }} />
          ))}
        </div>
        <div className="pt-voters" aria-label="Who has voted">
          {crew.map(id => <span key={id} className={`pt-voter ${s.votes[id] == null ? 'is-wait' : ''}`}><Avatar person={P[id]} size={28} ring="none" /><small>{nm(id)}</small></span>)}
        </div>
        {!closed && others.length > 0 && (
          <button type="button" className="pt-textbtn" onClick={() => d({ t: 'toast', msg: `Reminded ${new Intl.ListFormat('en').format(others.map(id => P[id].name))}` })}>
            <Icon name="bell" size={20} />Remind {others.length === 1 ? nm(others[0]) : `${others.length} people`}
          </button>
        )}
      </div>
      <Tabs active="polls" />
    </div>
  );
}

/* ---------------- 08 Closed: winner or tie ---------------- */
export function Closed() {
  const { s, d } = useApp();
  const t = tally(s.votes); const n = Object.keys(s.votes).length;
  const tieOpen = s.tie && s.winner == null;
  useEffect(() => { if (tieOpen && s.me !== 'ari') { const x = setTimeout(() => d({ t: 'pick', opt: 0 }), 2200); return () => clearTimeout(x); } }, [tieOpen, s.me]);
  const toPlan = () => { haptic(14); d({ t: 'set', patch: { planAdded: true } }); d({ t: 'go', step: 'plan' }); d({ t: 'toast', msg: `${optName(s, s.winner, true)} added to tonight`, tone: 'success' }); };
  if (tieOpen) {
    const top = [0, 1, 2].filter(i => t[i] === Math.max(...t));
    return (
      <div className="scr">
        <div className="scr-scroll has-cta">
          <TopBar title="It's a tie" sub={`${t[top[0]]} votes each`} />
          <div className="pt-poll-opts">{top.map(i => <PollOption key={i} label={optName(s, i)} detail={optDetail(s, i)} votes={t[i]} total={n} photo={photoOf(optIds(s)[i])} closed state={s.votes[s.me] === i ? 'yourVote' : 'default'} />)}</div>
          <p className="pt-suggest"><Icon name="sparkle" size={20} />{optName(s, 0, true)} is 6 minutes away. {optName(s, 1, true)} is 14.</p>
        </div>
        <div className="scr-bottombar pt-col">
          {s.me === 'ari' ? <>
            <Button label={`Pick ${optName(s, 0, true)}`} fullWidth onClick={() => { haptic(18); d({ t: 'pick', opt: 0 }); }} />
            <Button label={`Pick ${optName(s, 1, true)}`} variant="plain" fullWidth onClick={() => { haptic(18); d({ t: 'pick', opt: 1 }); }} />
          </> : <p className="scr-hint">Ari is picking</p>}
        </div>
      </div>
    );
  }
  const w = s.winner ?? 0;
  const pct = Math.round((t[w] / Math.max(n, 1)) * 100);
  return (
    <div className="scr">
      <PollView />
      {!s.planAdded && <CelebrationOverlay kind="pollWon" eyebrow="Poll closed · 7:30 PM" title={`${optName(s, w, true)} wins`}
        subtitle={s.pollClosed === 'pick' ? `Ari broke the tie. Booked for 8:30 PM.` : `${t[w]} of ${n} votes, ${pct}%. Booked for 8:30 PM.`}
        actionLabel="See tonight" onAction={toPlan} />}
    </div>
  );
}

/* ---------------- 09 Tonight ---------------- */
export function Plan() {
  const { s, d } = useApp();
  const t = tally(s.votes); const n = Object.keys(s.votes).length; const w = s.winner ?? 0;
  const pct = Math.round((t[w] / Math.max(n, 1)) * 100);
  return (
    <div className="scr">
      <CoreHeader onBack={() => d({ t: 'go', step: 'trip' })} backLabel="Back to Lisbon Crew" title="Tonight" sub="Saturday, Oct 17" />
      <div className="scr-scroll has-cta-tabs has-hm">
        <ol className="pt-itin">
          <ItinBlock it={{ time: '6:00 PM', title: 'Sunset, Santa Catarina', icon: 'sun', kind: 'plan' }} />
          <ItinBlock it={{ time: '7:15 PM', title: 'Pastéis at Manteigaria', icon: 'fork', kind: 'now' }} />
          <li className="p-itin is-decided">
            <span className="p-itin-time tu-num">8:30 PM</span>
            <span className="p-itin-rail" aria-hidden><span className="p-itin-node"><Icon name="fork" size={14} /></span><span className="p-itin-line" /></span>
            <div className="p-itin-card tu-surface pt-wincard anim-pop">
              <img src={photoOf(optIds(s)[w])} alt="" className="pt-wincard-img" />
              <div className="pt-wincard-body">
                <span className="p-itin-won"><Icon name="sparkle" size={14} />Won with <span className="tu-num">{pct}%</span></span>
                <h4>{optName(s, w)}</h4>
                <p>Table for 7</p>
                <p className="pt-wincard-note tu-num">Picked by poll, {t[w]} of {n}</p>
              </div>
            </div>
          </li>
          <ItinBlock it={{ time: '11:00 PM', title: 'Fado at Tasca do Chico', icon: 'music', kind: 'plan' }} last />
        </ol>
      </div>
      <div className="scr-bottombar pt-above-tabs">
        <Button label="Add the dinner bill" icon="receipt" fullWidth onClick={() => { haptic(); d({ t: 'go', step: 'expense' }); }} />
      </div>
      <Tabs active="plan" />
    </div>
  );
}
