import React from 'react';
import { useFlow, Top, crewPeople } from './kit';
import { Button, AvatarStack } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { TripCreateStepper, DestinationSearch, DateRangePicker, CoverPicker, BudgetInput, CrewPicker, MilestoneMoment, fmtRange, nights } from '../../components/beyond/create';
import { DESTINATIONS, CREW, px } from '../../lib/beyond';
import { QRCodeSVG } from 'qrcode.react';

export const CREATE_STEPS = ['Where to', 'Dates', 'Cover photo', 'Starter budget', 'Invite crew'];
/** v5 scope cut: the happy path keeps Where, Dates and Crew. Cover and budget get smart defaults. */
const KEPT = [0, 1, 4];
const prevKept = (step: number) => [...KEPT].reverse().find(i => i < step) ?? 0;
const ROUTES = ['create/where', 'create/when', 'create/cover', 'create/budget', 'create/crew', 'create/review'];
/** Days from the story's today (Sat, Oct 17, 2026) to a trip start. */
const daysUntil = (y: number, m: number, dd: number) => Math.round((Date.UTC(y, m, dd) - Date.UTC(2026, 9, 17)) / 864e5);

/** One layout for the five steps: nav (Cancel on step 1, Back after), the Stepper (Skip on optional steps), one main button. */
function Shell({ step, title, lead, children, cta, ctaDisabled, onCta, onSkip }: { step: number; title: string; lead?: string; children: React.ReactNode; cta: string; ctaDisabled?: boolean; onCta: () => void; onSkip?: () => void }) {
  const { host, go } = useFlow();
  const cancel = <button type="button" className="b-textbtn" data-flow-back onClick={() => host.exit('home')}>Cancel</button>;
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="New trip" sub={step < 5 ? undefined : 'Check it, then create'} back={step > 0} onBack={step > 0 ? () => go(ROUTES[prevKept(step)]) : undefined} right={cancel} />
        {step < 5 && <TripCreateStepper steps={KEPT.map(i => CREATE_STEPS[i])} current={Math.max(0, KEPT.indexOf(step))} onStep={i => go(ROUTES[KEPT[i]])} onSkip={onSkip} />}
        <div className="b-section"><h1 className="b-title">{title}</h1>{lead && <p className="b-help">{lead}</p>}</div>
        {children}
      </div>
      <div className="b-bottom"><Button label={cta} fullWidth disabled={ctaDisabled} onClick={onCta} /></div>
    </div>
  );
}
const dest = (id?: string) => DESTINATIONS.find(d => d.id === id);

export function CreateWhere() {
  const { s, d, go } = useFlow(); const c = s.create; const ds = dest(c.dest);
  return (
    <Shell step={0} title="Where to?" lead={c.fromRecap ? 'Same crew as Lisbon. Pick the next city.' : 'Places first, then where your crews have been.'} cta={ds ? `Continue with ${ds.name}` : 'Pick a place'} ctaDisabled={!c.dest} onCta={() => go('create/when')}>
      <DestinationSearch query={c.q} onQuery={q => d({ t: 'patch', k: 'create', v: { q } })} results={DESTINATIONS} selected={c.dest}
        onPick={id => d({ t: 'patch', k: 'create', v: { dest: id, name: dest(id)!.trip ?? dest(id)!.name, cover: dest(id)!.photos[0] } })} />
    </Shell>
  );
}
export function CreateWhen() {
  const { s, d, go } = useFlow(); const c = s.create; const ds = dest(c.dest);
  return (
    <Shell step={1} title={`When in ${ds?.name ?? 'Porto'}?`} cta={c.start && c.end ? `Continue · ${nights(c.start, c.end)} nights` : 'Pick the last day'} ctaDisabled={!c.end} onCta={() => go('create/cover')}>
      <DateRangePicker start={c.start} end={c.end} initialMonth={{ y: 2027, m: 1 }} onChange={(a, b) => d({ t: 'patch', k: 'create', v: { start: a, end: b } })} />
      <p className="b-fine">{c.start?.y === 2027 && c.start.m === 1 && c.end?.m === 1 && c.end.d >= 15 && c.start.d <= 15 ? 'Monday, Feb 15 is Presidents’ Day, so the US crew keeps the long weekend.' : 'Dates stay flexible. A date poll is one tap from the trip home.'}</p>
    </Shell>
  );
}
export function CreateCover() {
  const { s, d, go } = useFlow(); const c = s.create; const ph = dest(c.dest)?.photos.length ? dest(c.dest)!.photos : DESTINATIONS[0].photos;
  return (
    <Shell step={2} title="Make it yours" lead="Name it and pick a cover. Your crew sees this on the trip card." cta="Continue" onCta={() => go('create/budget')}
      onSkip={() => { d({ t: 'patch', k: 'create', v: { cover: undefined } }); go('create/budget'); }}>
      <label className="b-search is-flat"><BIcon name="edit" size={20} /><input value={c.name} onChange={e => d({ t: 'patch', k: 'create', v: { name: e.target.value } })} aria-label="Trip name" /></label>
      <CoverPicker photos={ph} value={c.cover ?? ph[0]} onChange={p => d({ t: 'patch', k: 'create', v: { cover: p } })} credit="Photos via Pexels: Pedro Soares, Travel Photographer and maria Chaile" />
    </Shell>
  );
}
export function CreateBudget() {
  const { s, d, go } = useFlow(); const c = s.create;
  return (
    <Shell step={3} title="A starter budget?" lead="A guide, not a limit. Only your crew sees it." cta="Continue" onCta={() => go('create/crew')}
      onSkip={() => { d({ t: 'patch', k: 'create', v: { budget: undefined } }); go('create/crew'); }}>
      <BudgetInput value={c.budget} crewSize={Math.max(c.crew.length + 1, 7)} onChange={v => d({ t: 'patch', k: 'create', v: { budget: v } })} />
    </Shell>
  );
}
export function CreateCrew() {
  const { s, d, go, P, toast } = useFlow(); const c = s.create;
  const lisbon = crewPeople(P);
  const toggle = (id: string) => d({ t: 'patch', k: 'create', v: { crew: c.crew.includes(id) ? c.crew.filter(x => x !== id) : [...c.crew, id] } });
  return (
    <Shell step={4} title="Invite your crew" lead="Link, QR or contacts." cta={c.crew.length ? `Review · ${c.crew.length} invited` : 'Review'} onCta={() => go('create/review')}
      onSkip={() => { d({ t: 'patch', k: 'create', v: { crew: [] } }); go('create/review'); }}>
      <CrewPicker crews={[{ id: 'lisbon', name: 'Lisbon Crew', members: lisbon, last: 'Oct 2026', photo: px.sunsetCrew }]}
        people={lisbon} selected={c.crew} onToggle={toggle}
        onCrew={id => { const ids = CREW.filter(x => x !== 'ari'); const all = ids.every(x => c.crew.includes(x)); d({ t: 'patch', k: 'create', v: { crew: all ? [] : ids } }); }} />
      <div className="b-sharerow" role="group" aria-label="Other ways to invite">
        <button type="button" onClick={() => toast('Link copied')}><span><BIcon name="link" size={20} /></span>Copy link</button>
        <button type="button" onClick={() => go('invite')}><span><BIcon name="qr" size={20} /></span>QR code</button>
        <button type="button" onClick={() => toast('Contacts open here')}><span><BIcon name="contacts" size={20} /></span>Contacts</button>
      </div>
    </Shell>
  );
}
export function CreateReview() {
  const { s, d, go, P } = useFlow(); const c = s.create; const ds = dest(c.dest) ?? DESTINATIONS[0];
  const crew = [P.ari, ...c.crew.map(id => P[id])];
  const rows: [string, string, string][] = [
    ['pin', 'Where', `${ds.name}, ${ds.country}`, ], ['calendar', 'When', c.start && c.end ? `${fmtRange(c.start, c.end)}, ${c.end.y} · ${nights(c.start, c.end)} nights` : 'Dates to decide'],
    ['dollar', 'Budget', c.budget ? `$${c.budget.toLocaleString('en-US')} per person` : 'No budget'], ['people', 'Crew', crew.length > 1 ? `You and ${crew.length - 1} invited · Lisbon Crew` : 'Just you · invite later'],
  ];
  const step = (i: number) => go(ROUTES[i]);
  return (
    <Shell step={5} title="Review" cta="Create trip" onCta={() => { d({ t: 'patch', k: 'create', v: { created: true } }); go('create/done', true); }}>
      <div className="b-review-card">
        <div className="b-review-cover"><img src={c.cover ?? ds.photos[0]} alt="" /><div><p className="tu-num">{c.start && c.end ? `${fmtRange(c.start, c.end)}, ${c.end.y}` : 'Dates to decide'}</p><h2>{c.name || ds.name}</h2></div></div>
        <ul className="b-review-rows">
          {rows.map(([ic, k, v], i) => (
            <li key={k}><span className="b-ico"><BIcon name={ic as any} size={20} /></span><span><small>{k}</small><b className="tu-num">{v}</b></span>
              <button type="button" className="b-textbtn" onClick={() => step(i === 0 ? 0 : i === 1 ? 1 : i === 2 ? 3 : 4)} aria-label={`Edit ${k.toLowerCase()}`}>Edit</button></li>
          ))}
        </ul>
        <div className="b-review-crew"><AvatarStack people={crew} size={28} max={7} /></div>
      </div>
    </Shell>
  );
}
export function CreateDone() {
  const { s, go, P, host } = useFlow(); const c = s.create; const ds = dest(c.dest) ?? DESTINATIONS[0];
  const crew = [P.ari, ...c.crew.map(id => P[id])];
  const [moment, setMoment] = React.useState(true);
  return (
    <div className="b-scr">
      <div className="b-scroll">
        <div className="b-hero">
          <img src={c.cover ?? ds.photos[0]} alt={`${ds.name} cover`} />
          <div className="b-float-top"><Top light onBack={() => host.exit('home')} right={<button type="button" className="b-top-btn" aria-label="Share trip" onClick={() => go('invite')}><BIcon name="share" size={20} /></button>} /></div>
          <div className="b-hero-text"><p className="tu-num">{c.start && c.end ? `${fmtRange(c.start, c.end)}, ${c.end.y} · in ${daysUntil(c.start.y, c.start.m, c.start.d)} days` : 'Dates to decide'}</p><h1>{c.name || ds.name}</h1></div>
        </div>
        {moment ? <MilestoneMoment title="Your trip is on the map" sub={crew.length > 1 ? `${crew.length - 1} invites sent. Mara and Nic are already in.` : 'Invite your crew any time from the trip home.'} onDone={() => setMoment(false)} />
          : <div className="b-card b-fadein"><div className="b-row"><AvatarStack people={crew} size={28} max={7} /><span className="b-help tu-num">{crew.length > 2 ? 3 : 1} of {crew.length} in · invites sent</span></div></div>}
        <section className="b-section">
          <h2 className="b-h2">Start planning</h2>
          <div className="b-list">
            <button type="button" className="b-listrow" data-open-trip onClick={() => go('trip/porto')}><span className="b-ico is-accent"><BIcon name="arrowRight" size={20} /></span><span className="b-listrow-text"><b>Open the trip</b><small>Plan, Photos and Money start empty</small></span></button>
            <button type="button" className="b-listrow" onClick={() => go('explore/curate')}><span className="b-ico is-accent"><BIcon name="poll" size={20} /></span><span className="b-listrow-text"><b>Start a poll for Friday dinner</b><small>Any day, time and activity</small></span><BIcon name="chevronRight" size={20} className="b-muted" /></button>
            <button type="button" className="b-listrow" onClick={() => go('explore')}><span className="b-ico is-accent"><BIcon name="explore" size={20} /></span><span className="b-listrow-text"><b>Explore {ds.name}</b><small>Places other crews booked and reviewed</small></span><BIcon name="chevronRight" size={20} className="b-muted" /></button>
            <button type="button" className="b-listrow" onClick={() => go('invite')}><span className="b-ico is-accent"><BIcon name="qr" size={20} /></span><span className="b-listrow-text"><b>Invite more people</b><small>Link, QR code or contacts</small></span><BIcon name="chevronRight" size={20} className="b-muted" /></button>
          </div>
        </section>
        <div className="b-qrline"><QRCodeSVG value="https://tripup.app/j/porto-7KQ2" size={56} level="M" bgColor="transparent" fgColor="currentColor" /><span><b>tripup.app/j/porto-7KQ2</b><small>Anyone with the link can view and vote</small></span></div>
      </div>
    </div>
  );
}
