import { FindHeader, FindQuestion, findBack, findSkip, findStage, findUpTo, findTrail } from '@sb/components/beyond/findplace';
import { curateStage, CurateAnswers, ExploreFeed } from '@sb/components/beyond/explore';
import { COMMUNITY } from '@sb/lib/beyond';
import { HeaderMenu } from '@sb/components/beyond/headermenu';
import { AVATAR } from '@sb/assets/solver-assets';
import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '@sb/components/Icon';
import { Avatar, AvatarStack, Button, IconButton, ListRow, ListGroup, SegmentedControl } from '@sb/components/core';
import { TripCard, ItineraryItem, ItinItem } from '@sb/components/trip';
import { TabBar } from '@sb/components/nav';
import { BottomSheet } from '@sb/components/overlays';
import { photo, places } from '@sb/lib/data';
import { useApp, liveNets, optName, StepId, haptic, myEdge, dueOf, keyOf, State, simplifyOf } from './store';
import type { ActionItem } from '@sb/components/beyond/actioninbox';
import { TABS, GlobalTabs, CREATE_ROUTES } from '@sb/patterns/beyond/kit';
import { FUTURE_TRIPS, DESTINATIONS } from '@sb/lib/beyond';
import { fmtRange } from '@sb/components/beyond/create';
import { BIcon } from '@sb/components/beyond/icons';
import { useBridge } from './flows';
import { Stepper } from '@sb/components/beyond/stepper';
import { CurateRing } from '@sb/components/beyond/explore';

export const crewOf = (renJoined: boolean) => ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas', ...(renJoined ? ['ren'] : [])];

export function Tabs({ active }: { active: string }) {
  const { s, d } = useApp();
  const { go } = useBridge();
  const map: Record<string, StepId[]> = { trips: ['home'], plan: ['trip'], money: ['money'], explore: ['explore'] };
  return (
    <GlobalTabs level={active === 'trips' ? 'home' : 'trip'} active={active} onCreate={k => { haptic(); go(CREATE_ROUTES[k]); }}
      onTab={id => {
        haptic();
        if (id === 'discover') return go('discover');
        if (id === 'you') return go('profile');
        // Explore and Photos are their own tabs. Polls have no tab (v5.4): they live on Trip home, in + and in Up next.
        if (id === 'explore') return go('explore');
        if (id === 'photos') return go('album');
        const t = map[id].find(x => s.done[x]); if (t) d({ t: 'go', step: t }); else d({ t: 'toast', msg: id === 'money' ? 'Money opens after dinner' : 'Nothing here yet' }); }} />
  );
}

/** One-row inset glass header for top-level screens. The menu opens flows in the Full JTBD analysis. */
/** v5.4 Up next: only things that need you right now. Everything informational stays behind the bell. */
export function upNextOf(s: State): ActionItem[] {
  const out: ActionItem[] = [];
  if (s.pollSent && !s.pollClosed && s.votes[s.me] == null) out.push({ id: 'vote', kind: 'vote', title: 'Vote: Dinner tonight', meta: 'Closes 7:30 PM · 3 places', cta: 'Vote' });
  if (s.me === 'ari' && s.dinnerSaved && s.simplified && !s.paid[keyOf(s)]) { const e = myEdge(s); const due = dueOf(s);
    if (due > 0) out.push({ id: 'pay', kind: 'pay', title: `Pay ${e.to[0].toUpperCase() + e.to.slice(1)} $${due.toFixed(2)}`, meta: 'Settles your share', cta: 'Pay', avatar: AVATAR[e.to] }); }
  // v5.4.2 Request payment: once untangled, money owed to you is one tap to ask for.
  if (s.dinnerSaved && s.simplified) simplifyOf(s).filter(e => e.to === s.me && !s.paid[`${e.from}>${e.to}`] && !s.requested?.[`${e.from}>${e.to}`]).slice(0, 1).forEach(e =>
    out.push({ id: `req:${e.from}`, kind: 'pay', title: `${e.from[0].toUpperCase() + e.from.slice(1)} owes you $${e.amt.toFixed(2)}`, meta: 'Ask with one tap', cta: 'Request', avatar: AVATAR[e.from] }));
  // At home level the inbox spans trips, so each card names its trip.
  return s.step === 'home' ? out.map(a => ({ ...a, meta: `Lisbon Crew · ${a.meta}` })) : out;
}
export function CoreHeader(props: { title?: string; sub?: string; onBack?: () => void; backLabel?: string; avatar?: boolean; light?: boolean; menu?: boolean }) {
  const bz = useBridge(); const { s, d } = useApp();
  const actions = upNextOf(s);
  const act = (id: string) => { haptic(); if (id === 'vote') d({ t: 'go', step: 'live' }); else if (id === 'pay') d({ t: 'view', v: 'choose' }); else if (id.startsWith('req:')) { const who = id.slice(4); const e = simplifyOf(s).find(x => x.from === who && x.to === s.me); if (e) { d({ t: 'set', patch: { requested: { ...(s.requested ?? {}), [`${e.from}>${e.to}`]: true } } }); d({ t: 'toast', msg: `Request sent to ${who[0].toUpperCase() + who.slice(1)}`, tone: 'success' }); } } };
  const to: Record<string, string> = { notifications: 'activity', settings: 'profile' };
  return <HeaderMenu title={props.title} sub={props.sub} onBack={props.onBack} backLabel={props.backLabel} light={props.light} menu={props.menu} actions={actions} onAction={act} avatar={props.avatar ? AVATAR.ari : undefined}
    onAvatar={() => { haptic(); bz.go('profile'); }} onPick={id => { haptic(); bz.go(to[id]); }} />;
}

export function TopBar({ back, title, sub, right, onBack }: { back?: string; title?: string; sub?: string; right?: React.ReactNode; onBack?: () => void }) {
  return (
    <div className="pt-top">
      {back ? <button type="button" className="pt-back" onClick={() => { haptic(); onBack?.(); }} aria-label={`Back to ${back}`}><Icon name="chevronLeft" size={20} /></button> : <span className="pt-top-sp" />}
      {title && <div className="pt-top-title"><b>{title}</b>{sub && <small>{sub}</small>}</div>}
      <div className="pt-top-right">{right ?? <span className="pt-top-sp" />}</div>
    </div>
  );
}

export function ItinBlock({ it, last }: { it: ItinItem; last?: boolean }) { return <ItineraryItem {...it} last={last} />; }

/* ---------------- 01 Home ---------------- */
export function Home() {
  const { s, d, P } = useApp();
  const crew = crewOf(s.renJoined).map(id => P[id]);
  const bal = liveNets(s)[s.me] ?? 0;
  const next = s.planAdded ? `${optName(s, s.winner, true)} at 8:30 PM` : 'Dinner 8:30 PM · undecided';
  const bz = useBridge(); const made = bz.s?.create.created ? bz.s.create : undefined;
  const madeDest = made && DESTINATIONS.find(x => x.id === made.dest);
  return (
    <div className="scr">
      <CoreHeader title="Trips" avatar />
      <div className="scr-scroll has-hm">
        <button type="button" className="pt-cardbtn" onClick={() => { haptic(); d({ t: 'go', step: 'trip' }); }}>
          <TripCard name="Lisbon" dates="Oct 12 to 17" photo={photo.alfama} people={crew} status="live" nextUp={next} balance={s.dinnerSaved ? bal : undefined} />
        </button>
        <ListGroup header="Later">
          <ListRow title="Lisbon, New Year" subtitle="Dec 31 to Jan 3 · in 75 days" leading={<img className="pt-thumb" src={photo.augusta} alt="" />} chevron />
          {made && <ListRow title={made.name} subtitle={made.start && made.end ? `${fmtRange(made.start, made.end)}, ${made.end.y} · planning` : 'Dates to decide · planning'} leading={<img className="pt-thumb" src={made.cover ?? madeDest?.photos[0]} alt="" />} chevron onClick={() => bz.go('create/done')} />}
          {FUTURE_TRIPS.filter(t => !t.name.startsWith('Lisbon')).map(t => <ListRow key={t.id} title={t.name} subtitle={`${t.dates} · ${t.sub.split(' · ')[0].toLowerCase()}`} leading={<img className="pt-thumb" src={t.photo} alt="" />} chevron />)}
          <ListRow title="Lisbon, spring" subtitle="Apr 2026 · settled" leading={<img className="pt-thumb" src={photo.tiles} alt="" />} chevron />
        </ListGroup>
      </div>
      <Tabs active="trips" />
    </div>
  );
}

/* ---------------- 02 Trip ---------------- */
export function Trip() {
  const { s, d, P } = useApp();
  const crew = crewOf(s.renJoined).map(id => P[id]);
  const start = () => { haptic(); d({ t: 'set', patch: { exploreFeed: false } }); d({ t: 'go', step: 'explore' }); }; // v5.4.7: Start a poll opens Find a place
  return (
    <div className="scr">
      <CoreHeader onBack={() => d({ t: "go", step: "home" })} backLabel="Back to Trips" />
      <div className="scr-scroll">
        <div className="scr-hero pt-hero pt-hero-card">
          <img src={photo.roofs} alt="" />
          <div className="scr-hero-text"><p>Oct 12 to 17 · last night</p><h1>Lisbon Crew</h1></div>
        </div>
        <div className="pt-people">
          <AvatarStack people={crew} size={28} max={7} />
          <span>{crew.length} people</span>
          <button type="button" className="pt-addbtn" onClick={() => { haptic(); d({ t: 'go', step: 'invite' }); }} aria-label="Add people"><Icon name="personAdd" size={20} /></button>
        </div>
        {s.pollSent && !s.dinnerSaved && <TripPollCard />}
        <section className="scr-section">
          <h2 className="pt-h2">Tonight</h2>
          <ol className="pt-itin">
            <ItinBlock it={{ time: '6:00 PM', title: 'Sunset, Santa Catarina', icon: 'sun', kind: 'plan' }} />
            <ItinBlock it={{ time: '7:15 PM', title: 'Pastéis at Manteigaria', icon: 'fork', kind: 'now' }} />
            {s.planAdded
              ? <ItinBlock it={{ time: '8:30 PM', title: optName(s, s.winner), place: 'Table for 7', icon: 'fork', kind: 'decided' }} />
              : (
                <li className="p-itin is-plan">
                  <span className="p-itin-time tu-num">8:30 PM</span>
                  <span className="p-itin-rail" aria-hidden><span className="p-itin-node"><Icon name="fork" size={14} /></span><span className="p-itin-line" /></span>
                  <div className="p-itin-card pt-gapcard">
                    <div><h4>Dinner</h4><p>{s.pollSent ? (s.pollClosed ? "Poll closed" : "Poll open") : "Not decided"}</p></div>
                    {s.pollSent ? <Button label="See poll" size="small" variant="secondary" onClick={() => d({ t: 'go', step: s.pollClosed ? 'closed' : 'live' })} />
                      : <Button label="Start a poll" size="small" onClick={start} />}
                  </div>
                </li>
              )}
            <ItinBlock it={{ time: '11:00 PM', title: 'Fado at Tasca do Chico', icon: 'music', kind: 'plan' }} last />
          </ol>
        </section>
      </div>
      <Tabs active="plan" />
    </div>
  );
}

/** v5.4: the open poll on Trip home (Polls have no tab). Live: closes when, how many voted, Vote. Closed: the result. */
function TripPollCard() {
  const { s, d } = useApp();
  const n = Object.keys(s.votes).length, total = crewOf(s.renJoined).length, mine = s.votes[s.me] != null;
  const open = () => { haptic(); d({ t: 'go', step: s.pollClosed ? 'closed' : 'live' }); };
  if (s.pollClosed) return (
    <button type="button" className="pt-pollcard is-closed" onClick={open} aria-label={s.tie ? 'Dinner poll tied, pick the winner' : `Dinner poll closed, ${optName(s, s.winner)} won`}>
      <span className="pt-pollcard-ico" aria-hidden><Icon name="check" size={20} /></span>
      <span className="pt-pollcard-t"><small>Dinner poll · closed</small><b>{s.tie ? 'It’s a tie. You pick.' : `${optName(s, s.winner, true)} won`}</b><em className="tu-num">{n} of {total} voted{s.tie ? '' : ' · 8:30 PM'}</em></span>
      <span className="pt-pollcard-cta">{s.tie ? 'Pick' : 'See result'}</span>
    </button>);
  return (
    <button type="button" className={`pt-pollcard${s.cue ? ' is-cue' : ''}`} onClick={open} aria-label={`Dinner tonight poll, closes 7:30 PM, ${n} of ${total} voted. ${mine ? 'See poll' : 'Vote'}`}>
      <span className="pt-pollcard-ico" aria-hidden><Icon name="poll" size={20} /><i className="pt-pollcard-live" /></span>
      <span className="pt-pollcard-t"><small>Open poll</small><b>Dinner tonight</b><em className="tu-num">Closes 7:30 PM · {n} of {total} voted</em></span>
      <span className="pt-pollcard-cta">{mine ? 'See poll' : 'Vote'}</span>
    </button>);
}

/* ---------------- 03 Invite sheet ---------------- */
export function InviteSheet() {
  const { s, d, P } = useApp();
  const [tab, setTab] = useState(s.renVia === 'tripup' ? 'From TripUp' : 'QR code');
  const [q, setQ] = useState('');
  const link = 'tripup.app/j/lisbon-crew-742';
  const close = () => d({ t: 'go', step: 'trip' });
  const contacts = [{ id: 'ren', name: 'Ren Matsuda', sub: 'Lisbon, spring' }, { id: 'renata', name: 'Renata Lopes', sub: "Mara's friend" }];
  return (
    <BottomSheet title="Add people" detent="medium" onClose={close}>
      <div className="pt-invite">
        <SegmentedControl options={['QR code', 'From TripUp']} value={tab} onChange={v => { haptic(); setTab(v); }} />
        {tab === 'QR code' ? (
          <>
            <button type="button" className="pt-qr" onClick={() => { haptic(14); d({ t: 'join', via: 'qr' }); }} aria-label="Simulate Ren scanning the code">
              <QRCodeSVG value={`https://${link}`} size={184} level="M" bgColor="transparent" fgColor="currentColor" />
            </button>
            <p className="pt-center-note">{s.renJoined ? 'Scanned' : 'No app needed. Tap the code to simulate a scan.'}</p>
            <button type="button" className="pt-linkrow" onClick={() => { navigator.clipboard?.writeText(`https://${link}`).catch(() => {}); d({ t: 'toast', msg: 'Link copied' }); }}>
              <Icon name="link" size={20} /><span className="tu-num">{link}</span><Icon name="copy" size={20} />
            </button>
          </>
        ) : (
          <>
            <label className="pt-search"><Icon name="search" size={20} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search TripUp" aria-label="Search people on TripUp" /></label>
            <ListGroup>
              {contacts.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase())).map(c => {
                const added = c.id === 'ren' && s.renJoined;
                return <ListRow key={c.id} title={c.name} subtitle={c.sub} leading={<Avatar person={c.id === 'ren' ? P.ren : { id: c.id, name: c.name, initials: 'R', tone: 2 }} size={36} ring="none" />}
                  trailing={added ? <span className="pt-added"><Icon name="check" size={20} />Added</span> : <Button label="Add" size="small" variant="secondary" onClick={() => { haptic(14); if (c.id === 'ren') d({ t: 'join', via: 'tripup' }); else d({ t: 'toast', msg: 'Renata is not in this trip' }); }} />} />;
              })}
            </ListGroup>
          </>
        )}
        <div className="pt-sheet-cta">
          {s.renJoined ? <Button label="Done" fullWidth onClick={() => d({ t: 'go', step: 'trip' })} />
            : <Button label="Share link" icon="share" fullWidth onClick={() => d({ t: 'toast', msg: 'Share sheet opens here' })} />}
        </div>
      </div>
    </BottomSheet>
  );
}

/* ---------------- 04 Explore ---------------- */
/** Four questions: how you get there, then how long, then what and how much. Counts follow the earlier answers. */
type Q = { q: string; opts: [string, number][]; def: number };
const MODE_N: Record<string, number> = { Walk: 48, Drive: 96, Destination: 31 };
const DUR: Record<string, { q: string; opts: [string, number][] }> = {
  Walk: { q: 'How far on foot?', opts: [['5 min', 9], ['10 min', 22], ['20 min', 41]] },
  Drive: { q: 'How long a drive?', opts: [['10 min', 34], ['20 min', 58], ['40 min', 77]] },
  Destination: { q: 'How far is worth it?', opts: [['Under 1 hr', 12], ['Half day', 19], ['Day trip', 26]] },
};
const questionsFor = (picks: string[]): Q[] => {
  const mode = picks[0] ?? 'Walk'; const dur = DUR[mode] ?? DUR.Walk;
  const dn = (dur.opts.find(o => o[0] === picks[1]) ?? dur.opts[1])[1];
  const after: [string, number][] = [['Dinner', Math.round(dn * 0.42)], ['Drinks', Math.round(dn * 0.6)], ['A view', Math.round(dn * 0.28)]];
  const an = (after.find(o => o[0] === picks[2]) ?? after[0])[1];
  return [
    { q: 'How are you getting there?', opts: [['Walk', MODE_N.Walk], ['Drive', MODE_N.Drive], ['Destination', MODE_N.Destination]], def: 0 },
    { q: dur.q, opts: dur.opts, def: 1 },
    { q: 'What are we after?', opts: after, def: 0 },
    { q: 'Budget each?', opts: [['$ to $$', Math.max(3, Math.round(an * 0.45))], ['$$ to $$$', Math.max(4, Math.round(an * 0.7))], ['Anything', an]], def: 1 },
  ];
};
const QN = 4;
export const EXPLORE_PLACES = [
  { id: 'taberna', ...places.taberna, walk: '6 min', price: '$$' },
  { id: 'ramiro', ...places.ramiro, walk: '14 min', price: '$$' },
  { id: 'park', ...places.park, walk: '9 min' },
  { id: 'eurico', ...places.eurico, walk: '12 min' },
  { id: 'cevi', name: 'A Cevicheria', area: 'Príncipe Real', kind: 'Seafood', price: '$$', rating: 4.5, photo: photo.facade, walk: '11 min', note: '' },
  { id: 'esquina', name: 'Tasca da Esquina', area: 'Campo de Ourique', kind: 'Petiscos', price: '$$', rating: 4.6, photo: photo.azulejo, walk: '13 min', note: '' },
];
const pickLabel: string[] = [];
const ANS_KEYS = ['after', 'budget', 'mode', 'dur'] as const; // v5.4.1 order: kind, price point, getting there, how long
const ANS_DEF: CurateAnswers = { mode: 'walk', dur: 1, after: 0, budget: 1 } as CurateAnswers;
/** Keeps the tile answers in step with exploreStage, which the guided tour can also move. */
function syncAnswers(a: CurateAnswers, st: number): CurateAnswers {
  if (findStage(a) === st) return a;
  const o: any = {}; ANS_KEYS.slice(0, st).forEach(k => { o[k] = (a as any)[k] ?? (ANS_DEF as any)[k]; }); return o;
}
export function Explore() {
  const { s, d } = useApp();
  const ansRef = useRef<CurateAnswers>({});
  const prevRef = useRef<CurateAnswers | undefined>(); // v5.4.1: answers before a chip jump, shown prefilled
  const [picks, setPicks] = useState<string[]>([]);
  const st = s.exploreStage;
  const QUESTIONS = questionsFor(pickLabel);
  const spots = st === 0 || pickLabel[0] === 'Any way' && st <= 2 ? 120 : (QUESTIONS[st - 1].opts.find(o => o[0] === pickLabel[st - 1]) ?? QUESTIONS[st - 1].opts[QUESTIONS[st - 1].def])[1];
  const shortlist = s.shortlist.length ? s.shortlist : picks;
  const toggle = (id: string) => { haptic(); setPicks(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= 3 ? p : [...p, id]); };
  // v5: the questions use the same one-question-per-screen tiles as Find a place in the Full JTBD analysis.
  const A = syncAnswers(ansRef.current, st); ansRef.current = A;
  const setStage = (a: CurateAnswers) => { ansRef.current = a; d({ t: 'set', patch: { exploreStage: findStage(a), shortlist: [] } }); };
  // v5.1: Part 1 lands on the Explore feed first (places other crews booked), then the hero tile starts the questions.
  if (st === 0 && s.exploreFeed !== false) return (
    <div className="b-scr">
      <div className="b-scroll pt-feed has-hm">
        <CoreHeader onBack={() => d({ t: 'go', step: 'trip' })} backLabel="Back to Lisbon Crew" title="Explore" sub="Lisbon · from TripUp travelers" />
        <button type="button" className="b-findhero" onClick={() => { haptic(); d({ t: 'set', patch: { exploreFeed: false } }); }}>
          <img src={photo.roofs} alt="" />
          <span className="b-findhero-t"><b>Find a place for tonight</b><small className="tu-num">4 quick questions · 6 picks for the crew</small></span>
          <span className="b-findhero-go" aria-hidden><BIcon name="arrowRight" size={20} /></span>
        </button>
        <div className="b-feed">
          {COMMUNITY.slice(0, 4).map((p, i) => (
            <div key={p.id} className="b-feed-item" style={{ ['--i' as any]: i }}>
              <ExploreFeed places={[p]} saved={[]} inPoll={[]} onSave={() => d({ t: 'toast', msg: 'Saved to Lisbon Crew', tone: 'success' })}
                onOpen={() => {}} onAddToPoll={() => { haptic(); d({ t: 'set', patch: { exploreFeed: false } }); }} />
            </div>
          ))}
        </div>
      </div>
      <Tabs active="explore" />
    </div>
  );
  if (st < QN) return (
    <div className="b-scr b-cmp">
      <div className="b-cmp-amb" aria-hidden />
      <FindHeader answers={A} onBack={() => (st === 0 ? d({ t: 'set', patch: { exploreFeed: true } }) : (haptic(), setStage(findBack(A))))} onSkip={() => { haptic(); setStage(findSkip(A)); }} />
      <div className="b-scroll b-cmp-scroll is-q"><FindQuestion answers={A} prev={prevRef.current} onAnswer={a => { haptic(10); if (findStage(a) >= 4) prevRef.current = undefined; setStage(a); }} /></div>
    </div>
  );
  return (
    <div className="scr">
      <div className={`scr-scroll pt-explore ${st >= QN ? 'has-cta' : ''}`}>
        <CoreHeader backLabel={st > 0 ? 'Back to previous step' : 'Back to Lisbon Crew'} title="Find a place" sub={st < QN ? 'For 7 · tonight' : 'Pick 3'}
          onBack={() => { if (st === 0) return d({ t: 'go', step: 'trip' }); const to = st >= QN ? 2 : st >= 2 ? 1 : 0; pickLabel.length = to; d({ t: 'set', patch: { exploreStage: to, shortlist: [] } }); }} />
        {/* v5.4.1: the answers as chips, in question order. Tap one to go back to that question; later ones come prefilled with Next. */}
        {st >= QN && <p className="b-fp-trail pt-trail">{findTrail(A).map(t => <button key={t.st} type="button" className="b-fp-chip" aria-label={`Change: ${t.label}`}
          onClick={() => { haptic(); prevRef.current = A; setStage(findUpTo(A, t.st)); }}>{t.label}</button>)}</p>}
        {st < QN ? (
          <>
            <p className="b-countpill tu-num pt-countpill" aria-live="polite">{st === 0 || pickLabel[0] === 'Any way' ? `${spots} places in Lisbon so far` : st === 2 && pickLabel[1] !== 'Any' ? `${spots} places within ${pickLabel[1]}` : `${spots} places so far`}</p>
            <section className="pt-q anim-rise" key={st}>
              <h2>{QUESTIONS[st].q}</h2>
              <div className="pt-qopts">
                {QUESTIONS[st].opts.map(([l, n]) => (
                  <button type="button" key={l} className="pt-qopt" onClick={() => { haptic(10); pickLabel[st] = l; pickLabel.length = st + 1; d({ t: 'set', patch: { exploreStage: st + 1 } }); }}>
                    <span>{l}</span><small className="tu-num">{n}</small>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (<>
          <div className="b-picks-head anim-rise"><CurateRing done={4} total={4} count={EXPLORE_PLACES.length} size={72} /><span><b>All answered</b><small>Sorted by how often crews like yours booked</small></span></div>
          <div className="pt-places anim-rise">
            {EXPLORE_PLACES.map(p => {
              const on = shortlist.includes(p.id);
              return (
                <button type="button" key={p.id} className={`pt-place ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => !s.shortlist.length && toggle(p.id)}>
                  <img src={p.photo} alt="" /><span className="pt-place-check">{on && <Icon name="check" size={14} />}</span>
                  <b>{p.name}</b><small>{p.price} · {p.walk}</small>
                </button>
              );
            })}
          </div>
        </>)}
      </div>
      {st >= QN && (
        <div className="scr-bottombar">
          <Button label={shortlist.length === 3 ? 'Start a poll with these 3' : `Pick ${3 - shortlist.length} more`} disabled={shortlist.length !== 3} fullWidth
            onClick={() => { haptic(14); d({ t: 'set', patch: { shortlist } }); d({ t: 'go', step: 'create' }); }} />
        </div>
      )}
    </div>
  );
}
