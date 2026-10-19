import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon } from '@sb/components/Icon';
import { Avatar, AvatarStack, Button, IconButton, ListRow, ListGroup, SegmentedControl } from '@sb/components/core';
import { TripCard, ItineraryItem, ItinItem } from '@sb/components/trip';
import { TabBar } from '@sb/components/nav';
import { BottomSheet } from '@sb/components/overlays';
import { photo, places } from '@sb/lib/data';
import { useApp, liveNets, optName, StepId, haptic } from './store';

export const crewOf = (renJoined: boolean) => ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas', ...(renJoined ? ['ren'] : [])];

export function Tabs({ active }: { active: string }) {
  const { s, d } = useApp();
  const map: Record<string, StepId[]> = { trips: ['home'], plan: ['plan', 'trip'], polls: ['closed', 'live'], money: ['money'] };
  return (
    <TabBar active={active} accessory="none" tabs={[{ id: 'trips', label: 'Trips', icon: 'home' }, { id: 'plan', label: 'Plan', icon: 'calendar' }, { id: 'polls', label: 'Polls', icon: 'poll' }, { id: 'money', label: 'Money', icon: 'wallet' }]}
      onChange={id => { haptic(); const t = map[id].find(x => s.done[x]); if (t) d({ t: 'go', step: t }); else d({ t: 'toast', msg: id === 'money' ? 'Money opens after dinner' : 'Nothing here yet' }); }} />
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
  const next = s.planAdded ? `${optName(s, s.winner, true)} at 20:30` : 'Dinner 20:30 · undecided';
  return (
    <div className="scr">
      <div className="scr-scroll">
        <h1 className="pt-largetitle">Trips</h1>
        <button type="button" className="pt-cardbtn" onClick={() => { haptic(); d({ t: 'go', step: 'trip' }); }}>
          <TripCard name="Lisbon" dates="12 to 17 Oct" photo={photo.alfama} people={crew} status="live" nextUp={next} balance={s.dinnerSaved ? bal : undefined} />
        </button>
        <ListGroup header="Later">
          <ListRow title="Lisbon, New Year" subtitle="In 74 days" leading={<img className="pt-thumb" src={photo.augusta} alt="" />} chevron />
          <ListRow title="Lisbon, spring" subtitle="Apr 2025 · settled" leading={<img className="pt-thumb" src={photo.tiles} alt="" />} chevron />
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
          <div className="scr-hero-text"><p>12 to 17 Oct · last night</p><h1>Lisbon Crew</h1></div>
        </div>
        <div className="pt-people">
          <AvatarStack people={crew} size={28} max={7} />
          <span>{crew.length} people</span>
          <button type="button" className="pt-addbtn" onClick={() => { haptic(); d({ t: 'go', step: 'invite' }); }} aria-label="Add people"><Icon name="personAdd" size={20} /></button>
        </div>
        <section className="scr-section">
          <h2 className="pt-h2">Tonight</h2>
          <ol className="pt-itin">
            <ItinBlock it={{ time: '18:00', title: 'Sunset, Santa Catarina', icon: 'sun', kind: 'plan' }} />
            <ItinBlock it={{ time: '19:15', title: 'Pastéis at Manteigaria', icon: 'fork', kind: 'now' }} />
            {s.planAdded
              ? <ItinBlock it={{ time: '20:30', title: optName(s, s.winner), place: 'Table for 7', icon: 'fork', kind: 'decided' }} />
              : (
                <li className="p-itin is-plan">
                  <span className="p-itin-time tu-num">20:30</span>
                  <span className="p-itin-rail" aria-hidden><span className="p-itin-node"><Icon name="fork" size={14} /></span><span className="p-itin-line" /></span>
                  <div className="p-itin-card pt-gapcard">
                    <div><h4>Dinner</h4><p>Not decided</p></div>
                    {s.pollSent ? <Button label="See poll" size="small" variant="secondary" onClick={() => d({ t: 'go', step: s.pollClosed ? 'closed' : 'live' })} />
                      : <Button label="Start a poll" size="small" onClick={start} />}
                  </div>
                </li>
              )}
            <ItinBlock it={{ time: '23:00', title: 'Fado at Tasca do Chico', icon: 'music', kind: 'plan' }} last />
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
  const contacts = [{ id: 'ren', name: 'Ren Matsuda', sub: 'Porto weekend' }, { id: 'renata', name: 'Renata Lopes', sub: "Mara's friend" }];
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
const QUESTIONS = [
  { q: 'What are we after?', opts: [['Dinner', 38], ['Drinks', 54], ['A view', 21]] },
  { q: 'How far will you walk?', opts: [['Under 10 min', 14], ['Under 15 min', 22], ['Any distance', 38]] },
  { q: 'Budget each?', opts: [['€ to €€', 6], ['€€ to €€€', 9], ['Anything', 14]] },
] as const;
export const EXPLORE_PLACES = [
  { id: 'taberna', ...places.taberna, walk: '6 min', price: '€€' },
  { id: 'ramiro', ...places.ramiro, walk: '14 min', price: '€€' },
  { id: 'park', ...places.park, walk: '9 min' },
  { id: 'eurico', ...places.eurico, walk: '12 min' },
  { id: 'cevi', name: 'A Cevicheria', area: 'Príncipe Real', kind: 'Seafood', price: '€€', rating: 4.5, photo: photo.facade, walk: '11 min', note: '' },
  { id: 'esquina', name: 'Tasca da Esquina', area: 'Campo de Ourique', kind: 'Petiscos', price: '€€', rating: 4.6, photo: photo.azulejo, walk: '13 min', note: '' },
];
const pickLabel: string[] = [];
export function Explore() {
  const { s, d } = useApp();
  const [picks, setPicks] = useState<string[]>([]);
  const st = s.exploreStage;
  const spots = st === 0 ? 120 : (QUESTIONS[st - 1].opts.find(o => o[0] === pickLabel[st - 1]) ?? QUESTIONS[st - 1].opts[0])[1];
  const r = 52, c = 2 * Math.PI * r;
  const shortlist = s.shortlist.length ? s.shortlist : picks;
  const toggle = (id: string) => { haptic(); setPicks(p => p.includes(id) ? p.filter(x => x !== id) : p.length >= 3 ? p : [...p, id]); };
  return (
    <div className="scr">
      <div className={`scr-scroll pt-explore ${st >= 3 ? 'has-cta' : ''}`}>
        <TopBar back="Lisbon Crew" onBack={() => d({ t: 'go', step: 'trip' })} title="Explore" sub={st < 3 ? `Step ${st + 1} of 3` : 'Pick 3'} />
        {st < 3 ? (
          <>
            <div className="pt-ring" role="img" aria-label={`${spots} spots match`}>
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r={r} className="p-ring-track" />
                <circle cx="64" cy="64" r={r} className="p-ring-fill pt-ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - st / 3)} transform="rotate(-90 64 64)" />
              </svg>
              <div className="pt-ring-n"><b className="tu-num" key={spots}>{spots}</b><span>spots</span></div>
            </div>
            <section className="pt-q anim-rise" key={st}>
              <h2>{QUESTIONS[st].q}</h2>
              <div className="pt-qopts">
                {QUESTIONS[st].opts.map(([l, n]) => (
                  <button type="button" key={l} className="pt-qopt" onClick={() => { haptic(10); pickLabel[st] = l; d({ t: 'set', patch: { exploreStage: st + 1 } }); }}>
                    <span>{l}</span><small className="tu-num">{n}</small>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : (
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
        )}
      </div>
      {st >= 3 && (
        <div className="scr-bottombar">
          <Button label={shortlist.length === 3 ? 'Start a poll with these 3' : `Pick ${3 - shortlist.length} more`} disabled={shortlist.length !== 3} fullWidth
            onClick={() => { haptic(14); d({ t: 'set', patch: { shortlist } }); d({ t: 'go', step: 'create' }); }} />
        </div>
      )}
    </div>
  );
}
