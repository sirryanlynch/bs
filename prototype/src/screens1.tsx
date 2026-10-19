import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '@sb/components/Icon';
import { Avatar, AvatarStack, Button, IconButton, ListRow, ListGroup, SegmentedControl } from '@sb/components/core';
import { TripCard, ItineraryItem, ItinItem } from '@sb/components/trip';
import { TabBar } from '@sb/components/nav';
import { BottomSheet } from '@sb/components/overlays';
import { photo, places } from '@sb/lib/data';
import { useApp, liveNets, optName, StepId, haptic } from './store';
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
  const map: Record<string, StepId[]> = { trips: ['home'], plan: ['plan', 'trip'], polls: ['closed', 'live'], money: ['money'] };
  return (
    <GlobalTabs active={active} onCreate={k => { haptic(); go(CREATE_ROUTES[k]); }}
      onTab={id => {
        haptic();
        // Explore is its own tab. Polls opens the live dinner poll while it runs, otherwise the list of every poll.
        if (id === 'explore') return go('explore');
        if (id === 'polls' && !(s.pollSent && !s.pollClosed)) return go('polls');
        const t = map[id].find(x => s.done[x]); if (t) d({ t: 'go', step: t }); else d({ t: 'toast', msg: id === 'money' ? 'Money opens after dinner' : 'Nothing here yet' }); }} />
  );
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
      <div className="scr-scroll">
        <div className="fl-homebar">
          <button type="button" className="fl-avatar" onClick={() => { haptic(); bz.go('profile'); }} aria-label="Profile and settings"><Avatar person={P.ari} size={36} ring="none" /></button>
          <span className="fl-homebar-sp" />
          <button type="button" className="fl-roundbtn tu-glass" onClick={() => { haptic(); bz.go('activity'); }} aria-label="Activity, 3 new"><BIcon name="bell" size={20} /><span className="fl-badge" aria-hidden /></button>
          <button type="button" className="fl-roundbtn tu-glass is-accent" onClick={() => { haptic(); bz.go('create/where'); }} aria-label="New trip"><BIcon name="add" size={20} /></button>
        </div>
        <h1 className="pt-largetitle">Trips</h1>
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
  const start = () => { haptic(); d({ t: 'go', step: s.renJoined ? 'explore' : 'invite' }); };
  return (
    <div className="scr">
      <div className="scr-scroll">
        <div className="scr-hero pt-hero">
          <img src={photo.roofs} alt="" />
          <div className="scr-hero-bar"><button type="button" className="pt-back is-light" onClick={() => d({ t: 'go', step: 'home' })} aria-label="Back to Trips"><Icon name="chevronLeft" size={20} /></button></div>
          <div className="scr-hero-text"><p>Oct 12 to 17 · last night</p><h1>Lisbon Crew</h1></div>
        </div>
        <div className="pt-people">
          <AvatarStack people={crew} size={28} max={7} />
          <span>{crew.length} people</span>
          <button type="button" className="pt-addbtn" onClick={() => { haptic(); d({ t: 'go', step: 'invite' }); }} aria-label="Add people"><Icon name="personAdd" size={20} /></button>
        </div>
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
                    <div><h4>Dinner</h4><p>Not decided</p></div>
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

/* ---------------- 03 Invite sheet ---------------- */
export function InviteSheet() {
  const { s, d, P } = useApp();
  const [tab, setTab] = useState(s.renVia === 'tripup' ? 'From TripUp' : 'QR code');
  const [q, setQ] = useState('');
  const link = 'tripup.app/j/lisbon-crew-742';
  const close = () => d({ t: 'go', step: 'trip' });
  const contacts = [{ id: 'ren', name: 'Ren Matsuda', sub: 'Lisbon, spring' }, { id: 'renata', name: 'Renata Lopes', sub: "Mara's friend" }];
  return (
    <BottomSheet title="Add people" detent="large" onClose={close}>
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
export function Explore() {
  const { s, d } = useApp();
  const [picks, setPicks] = useState<string[]>([]);
  const st = s.exploreStage;
  const QUESTIONS = questionsFor(pickLabel);
  const spots = st === 0 || pickLabel[0] === 'Any way' && st <= 2 ? 120 : (QUESTIONS[st - 1].opts.find(o => o[0] === pickLabel[st - 1]) ?? QUESTIONS[st - 1].opts[QUESTIONS[st - 1].def])[1];
  const shortlist = s.shortlist.length ? s.shortlist : picks;
  const toggle = (id: string) => { haptic(); setPicks(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= 3 ? p : [...p, id]); };
  return (
    <div className="scr">
      <div className={`scr-scroll pt-explore ${st >= QN ? 'has-cta' : ''}`}>
        <TopBar back={st > 0 ? 'previous step' : 'Lisbon Crew'} title="Find a place" sub={st < QN ? 'For 7 · tonight' : 'Pick 3'}
          onBack={() => { if (st === 0) return d({ t: 'go', step: 'trip' }); const to = st >= QN ? 2 : st >= 2 ? 1 : 0; pickLabel.length = to; d({ t: 'set', patch: { exploreStage: to, shortlist: [] } }); }} />
        {/* One Stepper for the whole app. The nav bar has Back, so the stepper shows Skip only. Questions 3 and 4 share step 3. */}
        <Stepper steps={['Getting there', 'How long', 'What kind', 'Picks ready']} current={st <= 1 ? st : st < QN ? 2 : 3} label="Find a place progress"
          onStep={i => { haptic(); pickLabel.length = i; d({ t: 'set', patch: { exploreStage: i, shortlist: [] } }); }}
          onSkip={st < QN ? () => { haptic(); if (st === 0) { pickLabel[0] = 'Any way'; pickLabel[1] = 'Any'; } else if (st === 1) pickLabel[1] = 'Any'; d({ t: 'set', patch: { exploreStage: st < 2 ? 2 : QN } }); } : undefined} />
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
