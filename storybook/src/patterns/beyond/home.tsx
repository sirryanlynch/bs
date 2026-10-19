import React from 'react';
import { useFlow, FlowTabs, GlobalTabs, CREATE_ROUTES } from './kit';
import { HeaderMenu } from '../../components/beyond/headermenu';
import { EmptyState } from '../../components/beyond/emptystate';
import { BIcon } from '../../components/beyond/icons';
import { AvatarStack } from '../../components/core';
import { DESTINATIONS, px } from '../../lib/beyond';
import { photo } from '../../lib/data';
import { AVATAR } from '../../assets/solver-assets';
import './home.css';

/* ---------------- v5.4 Home level: Explore for the next trip ---------------- */
type Idea = { id: string; dest: string; trip: string; crew: string; who: string[]; days: string; cost: string; quote: string; by: string; photos: string[] };
const IDEAS: Idea[] = [
  { id: 'porto', dest: 'porto', trip: 'Porto, wine weekend', crew: 'The Ribeira Six', who: ['mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'], days: '3 days', cost: '$410 each', quote: 'Port lodges in the afternoon, francesinha at night. Book the boat early.', by: 'Inês, Lisbon', photos: [px.portoRibeira, px.portoBoats, px.porto] },
  { id: 'cdmx', dest: 'cdmx', trip: 'Mexico City, food week', crew: 'Taco Committee', who: ['sofia', 'tomas', 'mara', 'nic'], days: '5 days', cost: '$1,240 each', quote: 'We voted on every dinner. Coyoacán market won twice.', by: 'Dana, Austin', photos: [px.bellas, px.coyoacan, px.cdmxDoor] },
  { id: 'sesimbra', dest: 'sesimbra', trip: 'Sesimbra, dive day', crew: 'Deep End', who: ['joao', 'ren', 'nic'], days: '1 day', cost: '$95 each', quote: 'Out of Lisbon by 8, in the water by 10, sardines by 2.', by: 'Rui, Lisbon', photos: [px.sesimbra, px.diver, px.sardines] },
];
export function DiscoverScreen() {
  const { d, go, P } = useFlow();
  const like = (it: Idea) => { const ds = DESTINATIONS.find(x => x.id === it.dest)!;
    d({ t: 'patch', k: 'create', v: { q: ds.name, dest: ds.id, name: it.trip, cover: it.photos[0], crew: [] } }); go('create/when'); };
  const [hero, ...rest] = IDEAS;
  return (
    <div className="b-scr">
      <div className="b-scroll has-tabs">
        <div className="b-head"><div><p className="b-overline">Ideas for your next trip</p><h1 className="b-title-xl">Explore</h1></div></div>
        <article className="b-dsc-hero">
          <img src={hero.photos[0]} alt="Porto riverfront at golden hour" />
          <div className="b-dsc-hero-t">
            <p className="tu-num">Crews’ favorite this fall · 38 trips</p>
            <h2>Porto in three days</h2>
            <span className="b-dsc-meta tu-num"><AvatarStack people={hero.who.slice(0, 4).map(id => (P as any)[id]).filter(Boolean)} size={24} max={4} />{hero.days} · {hero.cost}</span>
            <button type="button" className="b-dsc-cta" onClick={() => like(hero)}>Plan a trip like this<BIcon name="arrowRight" size={18} /></button>
          </div>
        </article>
        <section className="b-section"><h2 className="b-h2">Where crews are going</h2>
          <div className="b-dsc-rail">{[{ n: 'Porto', s: '38 crews this fall', p: px.porto }, { n: 'Mexico City', s: '14 crews this year', p: px.bellasDome }, { n: 'Sesimbra', s: 'Day trips from Lisbon', p: px.sesimbra }, { n: 'Lisbon', s: 'Where you are now', p: photo.roofs }].map((x, i) => (
            <button key={x.n} type="button" className="b-dsc-dest" style={{ ['--i' as any]: i }} onClick={() => { const it = IDEAS.find(t => t.trip.startsWith(x.n)); if (it) like(it); else go('create/where'); }}>
              <img src={x.p} alt="" /><span><b>{x.n}</b><small className="tu-num">{x.s}</small></span></button>))}</div>
        </section>
        <section className="b-section"><h2 className="b-h2">Trips crews took</h2>
          <div className="b-dsc-list">{rest.map((it, i) => (
            <article key={it.id} className="b-dsc-trip" style={{ ['--i' as any]: i }}>
              <div className="b-dsc-collage">{it.photos.map((p, k) => <img key={k} src={p} alt="" />)}</div>
              <div className="b-dsc-trip-t">
                <p className="b-overline tu-num">{it.crew} · {it.who.length + 1} friends</p>
                <h3>{it.trip}</h3>
                <p className="b-dsc-q">“{it.quote}” <span>{it.by}</span></p>
                <div className="b-dsc-row"><span className="tu-num">{it.days} · {it.cost}</span><button type="button" className="b-dsc-like" onClick={() => like(it)}>Plan a trip like this</button></div>
              </div>
            </article>))}</div>
        </section>
      </div>
      <FlowTabs level="home" active="discover" />
    </div>
  );
}

/* ---------------- v5.4 Trips home with no trips ---------------- */
export function TripsEmptyScreen() {
  const { go } = useFlow();
  return (
    <div className="b-scr">
      <HeaderMenu title="Trips" avatar={AVATAR.ari} onAvatar={() => go('profile')} actions={[]} onPick={id => go(id === 'notifications' ? 'trip/porto/activity' : 'profile')} />
      <div className="b-scroll has-hm has-tabs b-empty-wrap">
        <EmptyState art="photos" photos={[px.porto, px.portoRibeira, px.sesimbra]} title="No trips yet" body="Start one and invite your crew, or borrow a plan from a trip another crew took."
          action="New trip" onAction={() => go('create/where')} secondary="Get ideas" onSecondary={() => go('discover')} />
      </div>
      <FlowTabs level="home" active="trips" />
    </div>
  );
}

/* ---------------- v5.4 A new trip (Porto): empty Plan, Photos, Money, Notifications ---------------- */
function NewTripChrome({ tab, children }: { tab: 'plan' | 'photos' | 'money' | 'none'; children: React.ReactNode }) {
  const { s, go, host, back } = useFlow(); const name = s.create.name || 'Porto, wine weekend';
  return (
    <div className="b-scr">
      <HeaderMenu title={name} sub="Feb 12 to 15 · 3 people" onBack={tab === 'none' ? back : () => host.exit('home')} backLabel={tab === 'none' ? 'Back to the trip' : 'Back to Trips'} actions={[]}
        onPick={id => go(id === 'notifications' ? 'trip/porto/activity' : 'profile')} />
      <div className="b-scroll has-hm has-tabs b-empty-wrap">{children}</div>
      {tab !== 'none' && <GlobalTabs level="trip" active={tab} onCreate={k => go(k === 'photos' ? 'trip/porto/photos' : k === 'expense' ? 'expense/scan' : CREATE_ROUTES[k])}
        onTab={id => go(id === 'plan' ? 'trip/porto' : id === 'photos' ? 'trip/porto/photos' : id === 'money' ? 'trip/porto/money' : 'explore')} />}
    </div>
  );
}
export function NewTripPlanScreen() {
  const { go } = useFlow();
  return <NewTripChrome tab="plan"><EmptyState render="itinerary" title="Nothing planned yet" body="Add the first thing for Thursday, Feb 12, or let the crew vote on dinner."
    action="Start a poll" onAction={() => go('explore/curate')} secondary="Add to plan" onSecondary={() => go('plan/add')} /></NewTripChrome>;
}
export function NewTripPhotosScreen() {
  const { go } = useFlow();
  return <NewTripChrome tab="photos"><EmptyState art="photos" photos={[px.portoBoats, px.portoRibeira, px.porto]} title="No photos yet" body="Everyone’s shots land here, sorted by day and place. Add the first ones."
    action="Add photos" onAction={() => go('album/upload')} /></NewTripChrome>;
}
export function NewTripMoneyScreen() {
  const { go } = useFlow();
  return <NewTripChrome tab="money"><EmptyState render="settle" title="No expenses yet" body="Log a bill once and TripUp keeps everyone’s balance. Nobody owes anything yet."
    action="Add expense" onAction={() => go('expense/scan')} /></NewTripChrome>;
}
export function NewTripActivityScreen() {
  const { back } = useFlow();
  return <NewTripChrome tab="none"><EmptyState render="poll" title="No updates yet" body="Votes, new photos and payments from your crew show up here." action="Back to the trip" onAction={back} /></NewTripChrome>;
}
