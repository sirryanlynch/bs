import React, { useEffect, useState } from 'react';
import { NavBar, TabBar } from '../components/nav';
import { TripCard, PlaceCard, Timeline, MemberPicker, InviteContent, ExploreRing } from '../components/trip';
import { PollCard, PollBuilder } from '../components/poll';
import { DebtUntangle } from '../components/untangle';
import '../components/untangle-solver';
import { ExpenseRow, DebtSimplify, PaymentRow, SettleContent } from '../components/money';
import { Avatar, AvatarStack, BalanceChip, Button, IconButton, ListGroup, ListRow, SegmentedControl, FilterChip, TextField, useCountUp } from '../components/core';
import { Banner, Toast, LiveActivity } from '../components/feedback';
import { BottomSheet, CelebrationOverlay } from '../components/overlays';
import { Icon } from '../components/Icon';
import { crew, crewWithRen, people as P, photo, places, usd } from '../lib/data';
import { dinnerPoll, dinnerPollClosed } from '../lib/scenario';
import { friday } from '../lib/itinerary';

export function HomeScreen() {
  return (
    <div className="scr">
      <div className="scr-scroll">
        <NavBar title="Trips" subtitle="Saturday, Oct 17" actions={[{ icon: 'bell', label: 'Activity', badge: 2 }]} />
        <TripCard name="Lisbon" dates="Oct 12 to 17 · 7 friends" status="upcoming" photo={photo.alfama} people={crewWithRen} nextUp="Poll closes 7:30 PM" balance={-23.7} />
        <section className="scr-section">
          <div className="scr-section-head"><h2>Needs you</h2><span className="scr-link">See all</span></div>
          <ListGroup>
            <ListRow leading={<span className="p-rowicon p-rowicon-accent"><Icon name="poll" size={20} /></span>} title="Saturday dinner" subtitle="Mara asked · 5 of 7 voted" chevron />
            <ListRow leading={<span className="p-rowicon p-rowicon-owe"><Icon name="wallet" size={20} /></span>} title="You owe Nic $42.10" subtitle="Ren owes you $18.40 · net −$23.70" trailing={<button className="p-pay-nudge" style={{ height: 30, padding: '0 12px', borderRadius: 15, font: 'var(--type-ui-footnote)', fontWeight: 600 }}>Pay</button>} />
          </ListGroup>
        </section>
        <section className="scr-section">
          <div className="scr-section-head"><h2>Also planning</h2></div>
          <TripCard size="compact" name="Porto" dates="Dec 5 to 8 · planning" photo={photo.tiles} people={crew.slice(0, 4)} />
          <TripCard size="compact" name="Madrid" dates="March · wrapped" photo={photo.chiado} people={crew.slice(1)} balance={0} />
        </section>
      </div>
      <TabBar active="trips" />
    </div>
  );
}

export function TripGroupScreen({ withRen = true }: { withRen?: boolean }) {
  const [joined, setJoined] = useState(false);
  useEffect(() => { if (!withRen) return; const t = setTimeout(() => setJoined(true), 1800); return () => clearTimeout(t); }, [withRen]);
  const members = joined ? crewWithRen : crew;
  return (
    <div className="scr">
      <div className="scr-scroll">
        <div className="scr-hero">
          <img src={photo.alfama} alt="Alfama rooftops at dusk" />
          <div className="scr-hero-bar"><IconButton icon="chevronLeft" label="Back to trips" /><div><IconButton icon="share" label="Share" /><IconButton icon="more" label="More" /></div></div>
          <div className="scr-hero-text">
            <p>Oct 12 to 17</p>
            <div className="scr-hero-meta"><h1>Lisbon</h1><AvatarStack people={members} size={28} max={6} /></div>
          </div>
        </div>
        <div className="scr-stats">
          <div className="scr-stat"><span>Days to go</span><b className="tu-num">7</b></div>
          <div className="scr-stat"><span>Dinner</span><b className="tu-num">$248.70</b></div>
          <div className="scr-stat"><span>You owe, net</span><b className="tu-num is-owe">$23.70</b></div>
        </div>
        <ListGroup header={`Group · ${members.length}`}>
          {members.map(p => (
            <ListRow key={p.id} leading={<Avatar person={p} size={36} />} title={p.you ? 'Ari (you)' : p.name}
              subtitle={p.you ? 'Organizer' : p.id === 'ren' ? 'Joined just now with the code' : p.id === 'nic' ? 'Has not voted on dinner' : 'Member'}
              trailing={p.id === 'ren' ? <span className="p-balance p-balance-small p-balance-settled anim-fade">New</span> : undefined} />
          ))}
          <ListRow leading={<span className="p-rowicon p-rowicon-accent"><Icon name="personAdd" size={20} /></span>} title="Invite someone" chevron />
        </ListGroup>
      </div>
      {!joined && withRen && <BottomSheet title="Invite" detent="large"><InviteContent /></BottomSheet>}
      {joined && <div style={{ position: 'absolute', left: 16, right: 16, bottom: 108, zIndex: 25 }}><Toast message="Ren joined. Splits include Ren from today." tone="success" action="Undo" /></div>}
      <TabBar active="trips" />
    </div>
  );
}

export function PollCreateScreen() {
  return (
    <div className="scr">
      <div className="scr-scroll" style={{ paddingBottom: 60 }}>
        <NavBar title="New poll" large={false} back="Lisbon" actions={[]} />
        <PollBuilder />
        <p className="scr-hint">Tip: options from the Saved list carry their photo and address into the poll.</p>
      </div>
    </div>
  );
}

export function LivePollScreen() {
  return (
    <div className="scr">
      <div className="scr-scroll">
        <NavBar title="Poll" subtitle="Lisbon · closes 7:30 PM" large={false} back="Lisbon" actions={[{ icon: 'share', label: 'Share poll' }]} />
        <PollCard {...dinnerPoll} voters={crewWithRen} author={P.mara} live yourVote={1} endsInMinutes={18} />
        <Banner tone="accent" title="Ren has not voted yet" body="Ren gets a reminder 15 minutes before the poll closes." action="Nudge Ren now" />
        <section className="scr-section">
          <div className="scr-section-head"><h2>Why people picked</h2></div>
          <ListGroup>
            <ListRow leading={<Avatar person={P.mara} size={36} />} title="Taberna has the octopus" subtitle="Mara · 2 min ago" />
            <ListRow leading={<Avatar person={P.ari} size={36} />} title="Ramiro, prego for dessert" subtitle="You · 9 min ago" />
          </ListGroup>
        </section>
      </div>
      <TabBar active="polls" />
    </div>
  );
}

export function ItineraryWinnerScreen() {
  const [seg, setSeg] = useState('Day');
  return (
    <div className="scr">
      <div className="scr-scroll">
        <NavBar title="Plan" subtitle="Lisbon · 4 days" actions={[{ icon: 'search', label: 'Search' }]} />
        <SegmentedControl options={['Day', 'List', 'Map']} value={seg} onChange={setSeg} />
        <Timeline day="Saturday" date="Oct 17" items={friday} />
      </div>
      <TabBar active="plan" />
    </div>
  );
}

export function AddExpenseScreen() {
  const [sel, setSel] = useState(['ari', 'mara', 'joao', 'sofia', 'tomas']);
  const share = 38 / Math.max(1, sel.length);
  const out = crewWithRen.filter(p => !sel.includes(p.id));
  return (
    <div className="scr">
      <div className="scr-scroll" style={{ paddingBottom: 130 }}>
        <NavBar title="Add expense" large={false} back="Money" actions={[{ icon: 'camera', label: 'Scan receipt' }]} />
        <TextField kind="amount" prefix="$" value="38.00" helper="Vinho Verde (bottle) × 2 · Taberna da Rua das Flores" />
        <ListGroup>
          <ListRow leading={<span className="p-rowicon p-rowicon-neutral"><Icon name="wine" size={20} /></span>} title="Category" value="Drinks" chevron />
          <ListRow leading={<Avatar person={P.ari} size={28} />} title="Paid by" value="You" chevron />
        </ListGroup>
        <section className="scr-section">
          <div className="scr-split-head"><b>Split between</b><span className="tu-num">{sel.length} of 7 · tap to exclude</span></div>
          <MemberPicker people={crewWithRen} selected={sel} onChange={setSel} />
          {out.length > 0 && <p className="p-exp-excl" style={{ alignSelf: 'flex-start' }}><Icon name="eyeSlash" size={14} />{out.map(p => p.name).join(' and ')} do not pay for the wine</p>}
          <div className="scr-pershare"><span>Each pays</span><span className="tu-num">{usd(share)}</span></div>
        </section>
        <ListGroup>
          <ListRow title="Split" value="Equally" chevron />
          <ListRow title="Date" value="Sat, Oct 17" chevron />
        </ListGroup>
      </div>
      <div className="scr-bottombar"><Button label="Save expense" fullWidth /></div>
    </div>
  );
}

export function BalancesScreen() {
  const v = useCountUp(23.7);
  return (
    <div className="scr">
      <div className="scr-scroll">
        <NavBar title="Money" subtitle="Lisbon" actions={[{ icon: 'plus', label: 'Add expense' }]} />
        <div className="scr-balance">
          <span className="scr-balance-label">You owe, net</span>
          <span className="scr-balance-amt tu-num is-owe">${v.toFixed(2)}</span>
          <span className="scr-balance-label tu-num">You pay Nic $42.10 · Ren pays you $18.40</span>
          <div className="scr-balance-row"><Button label="Settle up" size="medium" /><Button label="Add expense" size="medium" variant="secondary" icon="plus" /></div>
        </div>
        <DebtUntangle solved compact controls={false} />
        <ListGroup header="Recent">
          <ExpenseRow title="Vinho Verde (bottle) × 2" payer={P.ari} amount={38} share={7.6} date="Sat" category="wine" excluded={[P.ren, P.nic]} splitCount={5} />
          <ExpenseRow title="Dinner, Taberna da Rua das Flores" payer={P.ari} amount={248.7} share={37.7} date="Fri" excluded={[P.ren, P.nic]} />
          <ExpenseRow title="Tram 28 day passes" payer={P.ren} amount={38.4} share={6.4} date="Sat" category="tram" />
        </ListGroup>
      </div>
      <TabBar active="money" />
    </div>
  );
}

export function SettleScreen() {
  return (
    <div className="scr">
      <div className="scr-scroll">
        <NavBar title="Settle up" subtitle="Lisbon · 3 payments" large={true} back="Money" actions={[]} />
        <ListGroup header="3 payments instead of 6 · $124.50" footer="Each person makes at most one payment. Totals match the raw debts to the cent.">
          <PaymentRow from={P.ari} to={P.nic} amount={42.1} state="due" />
          <PaymentRow from={P.ren} to={P.ari} amount={18.4} state="paid" method="MB WAY" />
          <PaymentRow from={P.mara} to={P.joao} amount={64} state="paid" method="Revolut" />
        </ListGroup>
      </div>
      <BottomSheet title="Settle up" detent="compact"><SettleContent from={P.ari} to={P.nic} amount={42.1} /></BottomSheet>
    </div>
  );
}

export function SquaredUpScreen() {
  return (
    <div className="scr">
      <SettleScreenBase />
      <CelebrationOverlay kind="squared" />
    </div>
  );
}
function SettleScreenBase() {
  return (
    <div className="scr-scroll">
      <NavBar title="Settle up" subtitle="Lisbon" back="Money" actions={[]} />
      <ListGroup>
        <PaymentRow from={P.ari} to={P.nic} amount={42.1} state="paid" method="MB WAY" />
        <PaymentRow from={P.ren} to={P.ari} amount={18.4} state="paid" method="MB WAY" />
        <PaymentRow from={P.mara} to={P.joao} amount={64} state="paid" method="Revolut" />
      </ListGroup>
    </div>
  );
}
