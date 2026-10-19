import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useFlow, Top, Sheet, crewPeople } from './kit';
import { Button, AvatarStack, Avatar, SegmentedControl } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { SafariFrame, AppBanner, GuestWebView } from '../../components/beyond/guest';
import { RecapCard, PlacesMap, StatTile, Pin } from '../../components/beyond/recap';
import { AppMark, Render3D } from '../../components/Icon';
import { photo } from '../../lib/data';
import { px, placeById, ALBUM } from '../../lib/beyond';

/* ---------------- Invite sheet ---------------- */
export function InviteScreen() {
  const { back, toast, P } = useFlow(); const [tab, setTab] = useState('Link');
  const link = 'tripup.app/j/lisbon-crew-742';
  return (
    <div className="b-scr">
      <div className="b-scroll"><Top title="Lisbon Crew" onBack={back} /></div>
      <Sheet title="Invite to Lisbon Crew" onClose={back}>
        <SegmentedControl options={['Link', 'QR code', 'Contacts']} value={tab} onChange={setTab} />
        {tab === 'Link' && (<div className="b-section">
          <button type="button" className="b-linkbox" onClick={() => toast('Link copied')} aria-label={`Copy invite link, ${link}`}><BIcon name="link" size={20} /><span className="tu-num">{link}</span><BIcon name="copy" size={20} /></button>
          <div className="b-card"><div className="b-tiprow"><span>Guests can</span><b>View and vote</b></div><div className="b-tiprow"><span>Link expires</span><b className="tu-num">Oct 24</b></div></div>
          <p className="b-help">No app needed to open it. People who install keep their votes and photos.</p>
        </div>)}
        {tab === 'QR code' && (<div className="b-qrbig"><QRCodeSVG value={`https://${link}`} size={196} level="M" bgColor="transparent" fgColor="currentColor" /><p className="b-help">Point a phone camera at it. Opens in the browser.</p></div>)}
        {tab === 'Contacts' && (<div className="b-list">{[['Ren Matsuda', 'Porto weekend', 'ren'], ['Renata Lopes', "Mara's friend", ''], ['Kai Brennan', 'In your contacts', '']].map(([n, sub, id]) => (
          <div key={n} className="b-listrow">{id ? <Avatar person={P.ren} size={36} ring="none" /> : <span className="b-review-av">{n[0]}</span>}<span className="b-listrow-text"><b>{n}</b><small>{sub}</small></span><button type="button" className="b-pillbtn" onClick={() => toast(`Invite sent to ${n.split(' ')[0]}`)}>Invite</button></div>))}</div>)}
        <Button label="Share invite" icon="share" fullWidth onClick={() => toast('Share sheet opens here')} />
      </Sheet>
    </div>
  );
}

/* ---------------- Guest web view (Ren, mobile Safari, no install) ---------------- */
const OPTS = [{ id: 'taberna', n: 4 }, { id: 'ramiro', n: 1 }, { id: 'park', n: 1 }];
export function GuestScreen() {
  const { s, d, go, P } = useFlow(); const g = s.guest; const voted = g.voted;
  const crew = crewPeople(P, ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas']);
  return (
    <div className="b-scr">
      <SafariFrame url="tripup.app" banner={g.banner ? <AppBanner onOpen={() => go('guest/install')} onClose={() => d({ t: 'patch', k: 'guest', v: { banner: false } })} /> : undefined}>
        <div className={g.banner ? 'b-guest-pad' : ''}>
          <GuestWebView>
            <div className="b-guest-trip"><img src={photo.roofs} alt="" /><div><p className="tu-num">Oct 12 to 17</p><h1>Lisbon Crew</h1><AvatarStack people={crew} size={24} max={6} /></div></div>
            <section className="b-card">
              <p className="b-overline tu-num">Saturday dinner · closes 7:30 PM</p>
              <h2 className="b-h2">Where should we eat?</h2>
              {OPTS.map((o, i) => { const p = placeById(o.id); const n = o.n + (voted === i ? 1 : 0); return (
                <div key={o.id} className={`b-gopt ${voted === i ? 'is-on' : ''}`}>
                  <button type="button" className="b-gopt-main" disabled={voted != null} onClick={() => { d({ t: 'patch', k: 'guest', v: { voted: i } }); go('guest/voted', true); }} aria-label={`Vote ${p.name}`}>
                    <img src={p.photos[0]} alt="" /><span><b>{p.name}</b><small className="tu-num">{p.type} · {p.price} · {p.walk} min walk</small></span>
                    {voted != null ? <span className="tu-num b-gopt-n">{n}</span> : <span className="b-radio-dot" aria-hidden />}
                  </button>
                  <button type="button" className="b-gopt-info" onClick={() => go(`place/${o.id}`)}>Photos and reviews<BIcon name="chevronRight" size={14} /></button>
                </div>
              ); })}
              {voted != null && <p className="b-ok b-fadein"><BIcon name="checkCircle" size={14} />Your vote is in. The crew sees it now.</p>}
            </section>
            <p className="b-fine">Voting as Ren, from a link Ari shared. Nothing to install.</p>
          </GuestWebView>
        </div>
      </SafariFrame>
    </div>
  );
}
export function InstallScreen() {
  const { go, back } = useFlow();
  return (
    <div className="b-scr">
      <GuestScreen />
      <Sheet title="TripUp" size="medium" onClose={back} footer={<Button label="Get the app" fullWidth onClick={() => go('guest/welcome', true)} />}>
        <div className="b-store"><AppMark size={72} /><div><b>TripUp</b><small>Plan, vote and split with your crew</small><span className="b-pill">Free · 4.8</span></div></div>
        <ul className="b-bullets">
          <li><BIcon name="checkCircle" size={20} />Your vote for Taberna comes with you</li>
          <li><BIcon name="checkCircle" size={20} />Add photos to the crew album</li>
          <li><BIcon name="checkCircle" size={20} />Pay back your share in a tap</li>
        </ul>
      </Sheet>
    </div>
  );
}
export function WelcomeScreen() {
  const { host, P } = useFlow();
  const crew = crewPeople(P);
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta b-centered">
        <div className="b-done anim-rise">
          <div className="b-handoff"><span className="b-handoff-guest">Guest</span><Avatar person={{ ...P.ren, you: false }} size={72} ring="none" /><span className="b-handoff-member">Member</span></div>
          <h1 className="b-title">Welcome in, Ren</h1>
          <p className="b-help">You're a full member of Lisbon Crew. Your vote came with you.</p>
        </div>
        <div className="b-card">
          <div className="b-tiprow"><span>Your vote</span><b>Taberna da Rua das Flores</b></div>
          <div className="b-tiprow"><span>Fado tickets you paid</span><b className="tu-num">$23.40</b></div>
          <div className="b-tiprow"><span>Crew</span><AvatarStack people={crew} size={24} max={7} /></div>
        </div>
      </div>
      <div className="b-bottom"><Button label="Open Lisbon Crew" fullWidth onClick={() => host.exit('trip')} /></div>
    </div>
  );
}

/* ---------------- Trip recap ---------------- */
export const PINS: Pin[] = [
  { n: 1, name: 'Alfama', x: 238, y: 98, day: 'Mon' }, { n: 2, name: 'Cervejaria Ramiro', x: 214, y: 46, day: 'Tue' }, { n: 3, name: 'Torre de Belém', x: 36, y: 160, day: 'Wed' },
  { n: 4, name: 'LX Factory', x: 92, y: 140, day: 'Thu' }, { n: 5, name: 'Manteigaria', x: 198, y: 120, day: 'Fri' }, { n: 6, name: 'Taberna da Rua das Flores', x: 162, y: 148, day: 'Fri' }, { n: 7, name: 'Tasca do Chico', x: 132, y: 102, day: 'Fri' },
];
export function RecapScreen() {
  const { go, back, P, d } = useFlow();
  const hl = [ALBUM[3], ALBUM[0], ALBUM[8], ALBUM[6], ALBUM[5]];
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <div className="b-hero is-tall"><img src={px.sunsetCrew} alt="The crew at sunset over Lisbon" />
          <div className="b-float-top"><Top light onBack={back} /></div>
          <div className="b-hero-text"><p className="tu-num">Oct 12 to 17, 2026 · 7 people</p><h1>Lisbon Crew</h1></div></div>
        <div className="b-grid3"><StatTile icon="pinLine" label="places" value="14" /><StatTile icon="images" label="photos" value="212" /><StatTile icon="poll" label="polls decided" value="4" /></div>
        <section className="b-section"><div className="b-section-head"><h2>Highlights</h2><button type="button" className="b-link" onClick={() => go('album')}>Album</button></div>
          <div className="b-hl">{hl.map(p => <figure key={p.id}><img src={p.src} alt="" /><figcaption>{p.place}</figcaption></figure>)}</div></section>
        <section className="b-section"><div className="b-section-head"><h2>Where you went</h2><button type="button" className="b-link" onClick={() => go('recap/places')}>All 14</button></div>
          <PlacesMap pins={PINS} onOpen={() => go('recap/places')} /></section>
        <section className="b-section"><h2 className="b-h2">Money</h2>
          <div className="b-card"><div className="b-tiprow"><span>Spent together</span><b className="tu-num">$872.20</b></div><div className="b-tiprow"><span>Payments to settle</span><b className="tu-num">3, all done</b></div><div className="b-tiprow"><span>Paid in cash</span><b className="tu-num">1, confirmed by Nic</b></div></div>
          <p className="b-ok"><BIcon name="checkCircle" size={14} />All squared up on Oct 17 at 10:41 PM</p></section>
      </div>
      <div className="b-bottom"><Button label="Share recap" variant="secondary" fullWidth onClick={() => go('recap/card')} /><Button label="Plan the next one" fullWidth onClick={() => { d({ t: 'patch', k: 'create', v: { q: '', dest: undefined, start: undefined, end: undefined, cover: undefined, budget: undefined, crew: ['mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'], name: '', created: false, fromRecap: true } }); go('create/where'); }} /></div>
    </div>
  );
}
export function RecapPlacesScreen() {
  const { back, go } = useFlow(); const [on, setOn] = useState(6);
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <Top title="Where you went" sub="7 pinned · 14 checked in" onBack={back} />
        <PlacesMap pins={PINS} active={on} />
        <ol className="b-list b-placelist">{PINS.map(p => (
          <li key={p.n}><button type="button" className={`b-listrow ${on === p.n ? 'is-on' : ''}`} onClick={() => { setOn(p.n); if (['Taberna da Rua das Flores', 'Manteigaria', 'LX Factory', 'Torre de Belém', 'Cervejaria Ramiro'].includes(p.name)) go(`place/${{ 'Taberna da Rua das Flores': 'taberna', Manteigaria: 'manteigaria', 'LX Factory': 'lxfactory', 'Torre de Belém': 'belem', 'Cervejaria Ramiro': 'ramiro' }[p.name]}`); }}>
            <span className="b-opted-n tu-num">{p.n}</span><span className="b-listrow-text"><b>{p.name}</b><small>{p.day}</small></span><BIcon name="chevronRight" size={20} className="b-muted" /></button></li>))}</ol>
      </div>
    </div>
  );
}
export function RecapCardScreen() {
  const { back, toast, P } = useFlow();
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Share recap" onBack={back} />
        <div className="b-recapwrap anim-rise"><RecapCard title="Lisbon Crew" dates="Oct 12 to 17, 2026" cover={photo.alfama} photos={[px.sunsetCrew, photo.taberna, px.belem, px.natas]} people={crewPeople(P)} stats={[['Days', '6'], ['Places', '14'], ['Photos', '212'], ['Polls', '4']]} /></div>
        <p className="b-fine b-center">Amounts and names of places you marked private stay off the card.</p>
      </div>
      <div className="b-bottom"><Button label="Save image" variant="secondary" fullWidth onClick={() => toast('Saved to Photos')} /><Button label="Share" icon="share" fullWidth onClick={() => toast('Share sheet opens here')} /></div>
    </div>
  );
}
void Render3D;
