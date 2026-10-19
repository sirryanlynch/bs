import React, { useEffect, useState } from 'react';
import { Icon, AppMark } from '@sb/components/Icon';
import { Avatar, Button, Toggle, ListRow, ListGroup } from '@sb/components/core';
import { PollOption } from '@sb/components/poll';
import { Notification, LiveActivity } from '@sb/components/feedback';
import { BottomSheet, CelebrationOverlay } from '@sb/components/overlays';
import { photo } from '@sb/lib/data';
import { useReducedMotion } from '@sb/lib/PrismRoot';
import { useApp, optName, optDetail, optIds, STREAM, tally, haptic, PLACE_NAMES } from './store';
import { TopBar, Tabs, crewOf, ItinBlock, EXPLORE_PLACES } from './screens1';

const photoOf = (id: string) => EXPLORE_PLACES.find(p => p.id === id)?.photo;
void AppMark;

/* ---------------- 05 Create poll ---------------- */
export function Create() {
  const { s, d } = useApp();
  const [closeAll, setCloseAll] = useState(true);
  return (
    <div className="scr">
      <div className="scr-scroll has-cta">
        <TopBar back="Explore" onBack={() => d({ t: 'go', step: 'explore' })} title="New poll" />
        <h1 className="pt-question">Where do we eat tonight?</h1>
        <ListGroup>
          {optIds(s).map(id => <ListRow key={id} title={PLACE_NAMES[id][0]} subtitle={PLACE_NAMES[id][2]} leading={<img className="pt-thumb" src={photoOf(id)} alt="" />} />)}
        </ListGroup>
        <ListGroup footer="On a tie, you pick.">
          <ListRow title="Closes" trailing={<span className="pt-pillval tu-num">19:30</span>} />
          <ListRow title="Close early when all vote" trailing={<Toggle checked={closeAll} label="Close early when everyone has voted" onChange={setCloseAll} />} />
        </ListGroup>
      </div>
      <div className="scr-bottombar">
        <Button label="Send to 7 people" fullWidth onClick={() => { haptic(18); d({ t: 'set', patch: { pollSent: true } }); d({ t: 'done', key: 'create' }); d({ t: 'go', step: 'push' }); }} />
      </div>
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
        <p className="p-lock-date">{s.me === 'nic' ? 'Friday 16 October' : "Nic's iPhone · Friday 16 October"}</p>
        <p className="p-lock-time pt-lock-time">19:02</p>
        <button type="button" className="pt-notifbtn" onClick={() => { haptic(12); setOpen(true); }} aria-expanded={open} aria-label="Ari started a poll. Open to vote">
          <Notification title="Ari started a poll" body={voted ? `You voted ${optName(s, s.votes.nic, true)}` : 'Where do we eat tonight? Closes 19:30.'} person={P.ari} time="now" />
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
    const next = STREAM(s.tiePath).find(v => s.votes[v.who] == null && v.who !== s.me);
    if (!next) return;
    const t = setTimeout(() => { haptic(6); d({ t: 'vote', who: next.who, opt: next.opt, via: next.via }); }, reduce ? 700 : 1300);
    return () => clearTimeout(t);
  }, [live, s.votes, s.pollClosed, s.tiePath, reduce]);
  useEffect(() => { if (live && s.pollClosed) { const t = setTimeout(() => d({ t: 'go', step: 'closed' }), 900); return () => clearTimeout(t); } }, [live, s.pollClosed]);
}

export function PollView() {
  const { s, d, P, nm } = useApp();
  const crew = crewOf(true);
  const t = tally(s.votes); const n = Object.keys(s.votes).length; const max = Math.max(...t);
  const leaders = t.filter(x => x === max).length;
  const waiting = crew.filter(id => s.votes[id] == null);
  const closed = !!s.pollClosed && s.winner != null;
  const mine = s.votes[s.me];
  return (
    <div className="scr">
      <div className="scr-scroll">
        <TopBar back="Lisbon Crew" onBack={() => d({ t: 'go', step: 'trip' })} title="Dinner tonight?" sub={closed ? `Closed · ${n} of 7 voted` : `${n} of 7 voted · closes 19:30`} />
        {!closed && mine == null && <p className="pt-prompt">Tap a place to vote</p>}
        <div className="pt-poll-opts" aria-live="polite">
          {optIds(s).map((id, i) => (
            <PollOption key={id} label={PLACE_NAMES[id][0]} detail={optDetail(s, i)} votes={t[i]} total={Math.max(n, 1)} photo={photoOf(id)}
              state={closed ? (s.winner === i ? 'winner' : mine === i ? 'yourVote' : 'default') : mine === i ? 'yourVote' : t[i] === max && max > 0 && leaders === 1 ? 'leading' : 'default'}
              closed={closed} onVote={() => { if (!closed) { haptic(); d({ t: 'vote', who: s.me, opt: i }); } }} />
          ))}
        </div>
        <div className="pt-voters" aria-label="Who has voted">
          {crew.map(id => <span key={id} className={`pt-voter ${s.votes[id] == null ? 'is-wait' : ''}`}><Avatar person={P[id]} size={28} ring="none" /><small>{nm(id)}</small></span>)}
        </div>
        {!closed && waiting.length > 0 && (
          <button type="button" className="pt-textbtn" onClick={() => d({ t: 'toast', msg: `Reminded ${waiting.map(id => P[id].name).join(' and ')}` })}>
            <Icon name="bell" size={20} />Remind {waiting.length === 1 ? nm(waiting[0]) : `${waiting.length} people`}
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
      {!s.planAdded && <CelebrationOverlay kind="pollWon" eyebrow="Poll closed · 19:30" title={`${optName(s, w, true)} wins`}
        subtitle={s.pollClosed === 'pick' ? `Ari broke the tie. Booked for 20:30.` : `${t[w]} of ${n} votes, ${pct}%. Booked for 20:30.`}
        actionLabel="See tonight" onAction={toPlan} />}
    </div>
  );
}

/* ---------------- 09 Tonight with how we got here ---------------- */
export function Plan() {
  const { s, d } = useApp();
  const t = tally(s.votes); const n = Object.keys(s.votes).length; const w = s.winner ?? 0;
  const pct = Math.round((t[w] / Math.max(n, 1)) * 100);
  const events = [
    ['18:56', 'Ari shortlisted 6 places'],
    ['18:58', 'Poll sent with 3'],
    ['19:02', 'Nic voted from the push'],
    ['19:24', 'Ren voted on the web'],
    ['19:30', `Closed: ${optIds(s).map((id, i) => `${PLACE_NAMES[id][1]} ${t[i]}`).join(', ')}`],
    ...(s.pollClosed === 'pick' ? [['19:30', `Ari broke the tie`]] : []),
    ['19:31', 'Added to tonight'],
  ];
  return (
    <div className="scr">
      <div className="scr-scroll has-cta-tabs">
        <TopBar back="Lisbon Crew" onBack={() => d({ t: 'go', step: 'trip' })} title="Tonight" sub="Friday 16 Oct" />
        <ol className="pt-itin">
          <ItinBlock it={{ time: '18:00', title: 'Sunset, Santa Catarina', icon: 'sun', kind: 'plan' }} />
          <ItinBlock it={{ time: '19:15', title: 'Pastéis at Manteigaria', icon: 'fork', kind: 'now' }} />
          <li className="p-itin is-decided">
            <span className="p-itin-time tu-num">20:30</span>
            <span className="p-itin-rail" aria-hidden><span className="p-itin-node"><Icon name="fork" size={14} /></span><span className="p-itin-line" /></span>
            <div className="p-itin-card tu-surface pt-wincard anim-pop">
              <img src={photoOf(optIds(s)[w])} alt="" className="pt-wincard-img" />
              <div className="pt-wincard-body">
                <span className="p-itin-won"><Icon name="sparkle" size={14} />Won with <span className="tu-num">{pct}%</span></span>
                <h4>{optName(s, w)}</h4>
                <p>Table for 7</p>
                <button type="button" className="pt-textbtn is-inline" onClick={() => { haptic(); d({ t: 'set', patch: { howOpen: true } }); d({ t: 'done', key: 'how' }); }}>How we got here<Icon name="chevronRight" size={14} /></button>
              </div>
            </div>
          </li>
          <ItinBlock it={{ time: '23:00', title: 'Fado at Tasca do Chico', icon: 'music', kind: 'plan' }} last />
        </ol>
      </div>
      <div className="scr-bottombar pt-above-tabs">
        <Button label="Add the dinner bill" icon="receipt" fullWidth onClick={() => { haptic(); d({ t: 'go', step: 'expense' }); }} />
      </div>
      <Tabs active="plan" />
      {s.howOpen && (
        <BottomSheet title="How we got here" detent="large" onClose={() => d({ t: 'set', patch: { howOpen: false } })}>
          <div className="pt-how">
            <ol className="pt-how-list">{events.map(([tm, tx], i) => <li key={i}><span className="tu-num">{tm}</span><i aria-hidden /><p>{tx}</p></li>)}</ol>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
