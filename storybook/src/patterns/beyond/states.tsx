import React from 'react';
import { useFlow, Top, FlowTabs } from './kit';
import { Button } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { Render3D } from '../../components/Icon';
import { COMMUNITY } from '../../lib/beyond';
import { typeLabel } from '../../data/experienceTypes';

/* Flow 12 · Empty and error states. One calm layout each: a 3D render, a short line, one clear way forward. */

function StateBlock({ render, title, body, children }: { render: React.ComponentProps<typeof Render3D>['name']; title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className="b-state anim-rise" role="status">
      <Render3D name={render} size={112} />
      <h1 className="b-title">{title}</h1>
      <p className="b-help">{body}</p>
      {children}
    </div>
  );
}

/** Receipt not read: retake or type it. Nothing is lost. */
export function ReceiptFailedScreen() {
  const { go, back } = useFlow();
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Scan receipt" sub="Add expense" onBack={back} />
        <StateBlock render="settle" title="We couldn’t read this one" body="The photo is too dark to find a total. Retake it in better light, or type the amount.">
          <dl className="b-readout tu-num" aria-label="What we got">
            <dt>Merchant</dt><dd>Not found</dd><dt>Total</dt><dd>Not found</dd><dt>Items</dt><dd>0 read</dd>
          </dl>
          <p className="b-fine">Tip: lay the receipt flat and fill the frame.</p>
        </StateBlock>
      </div>
      <div className="b-bottom"><Button label="Type it in" variant="secondary" fullWidth onClick={() => go('expense/items', true)} /><Button label="Retake photo" fullWidth onClick={() => go('expense/scan', true)} /></div>
    </div>
  );
}

/** A poll nobody has voted on yet: nudge, or share the link. */
export function PollNoVotesScreen() {
  const { go, toast } = useFlow();
  const opts = [{ label: 'Dive Point Sesimbra', sub: '2 dives · $95 each' }, { label: 'Arrábida coast dive', sub: '1 dive · $70 each' }];
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Scuba diving" sub="Tuesday, Oct 13, 6:00 AM" onBack={() => go('polls')} />
        <StateBlock render="poll" title="No votes yet" body="You sent this 20 minutes ago. A nudge usually gets the first vote in." />
        <div className="b-card b-pollcard">
          {opts.map((o, i) => <div key={o.label} className="b-pollopt"><span className="b-opted-n tu-num">{String.fromCharCode(65 + i)}</span><span className="b-listrow-text"><b>{o.label}</b><small className="tu-num">{o.sub}</small></span><span className="tu-num b-muted">0</span></div>)}
          <dl className="b-readout tu-num" aria-label="Status"><dt>Voted</dt><dd>0 of 7</dd><dt>Closes</dt><dd>10:00 PM</dd></dl>
        </div>
      </div>
      <div className="b-bottom"><Button label="Share link" variant="secondary" fullWidth onClick={() => go('invite')} /><Button label="Nudge the crew" fullWidth onClick={() => toast('Nudged 6 people')} /></div>
    </div>
  );
}

/** Explore with no connection: saved places and the plan still work. */
export function ExploreOfflineScreen() {
  const { go, toast, s } = useFlow();
  const saved = (s.saved.length ? COMMUNITY.filter(p => s.saved.includes(p.id)) : COMMUNITY.filter(p => ['taberna', 'manteigaria', 'lxfactory'].includes(p.id))).slice(0, 3);
  return (
    <div className="b-scr">
      <div className="b-scroll has-tabs">
        <div className="b-head"><div><p className="b-overline">Lisbon · from TripUp travelers</p><h1 className="b-title-xl">Explore</h1></div></div>
        <p className="b-offline" role="status"><BIcon name="globeX" size={16} />You’re offline. Showing what’s saved on this phone.</p>
        <StateBlock render="pin" title="New places need a connection" body="Your saved places and the plan still work. We’ll refresh when you’re back online.">
          <button type="button" className="b-textbtn" onClick={() => toast('Still offline. We’ll keep trying.')}>Try again</button>
        </StateBlock>
        <section className="b-section"><h2 className="b-overline">Saved · available offline</h2>
          <div className="b-list">{saved.map(p => (
            <button key={p.id} type="button" className="b-listrow" onClick={() => go(`place/${p.id}`)}><img className="b-thumb" src={p.photos[0]} alt="" /><span className="b-listrow-text"><b>{p.name}</b><small className="tu-num">{typeLabel(p.kind)} · {p.type} · {p.walk <= 25 ? `${p.walk} min walk` : `${p.drive} min drive`}</small></span><BIcon name="chevronRight" size={20} className="b-muted" /></button>
          ))}</div>
        </section>
      </div>
      <FlowTabs active="explore" />
    </div>
  );
}
