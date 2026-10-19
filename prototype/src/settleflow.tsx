import { CoreHeader } from './screens1';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@sb/components/core';
import { DebtUntangle, UntanglePhase } from '@sb/components/untangle';
import '@sb/components/untangle-solver';
import { BottomSheet, SquaredSheet, SquaredRow } from '@sb/components/overlays';
import {
  GlassHeader, PairHero, SPill, Overline, Readout, MethodPicker, CashCount, SlideToSettle, PendingMark, UndoToast, ReceiverConfirm,
  PaymentSuccess, SettleProgress, PlanRows, PlanRow, ReceiptView, PartialCash, DisputeView, OfflineView, METHODS, usd2, roundCash,
  MoneyBalance, IouLog, NetLog, PairRows, PLAN_REASON, NIC_PROVENANCE, planRank,
} from '@sb/components/settle';
import { nets } from './ledger';
import { useApp, rawOf, simplifyOf, liveNets, haptic, myEdge, keyOf, dueOf, SettleView, hm } from './store';

const r2 = (n: number) => Math.round(n * 100) / 100;
function useLater() {
  const t = useRef<number[]>([]);
  useEffect(() => () => t.current.forEach(clearTimeout), []);
  return (ms: number, f: () => void) => { t.current.push(window.setTimeout(f, ms)); };
}

/* ---------------- 11 Money: Tangled, Netting, Solved, then 1 of 3 ---------------- */
export function MoneyScreen() {
  const { s, d, P } = useApp();
  const raw = rawOf(s), plan = simplifyOf(s);
  const later = useLater();
  const live = liveNets(s);
  const net = live[s.me] ?? 0;
  const [phase, setPhase] = useState<UntanglePhase>(s.simplified ? 2 : 0);
  const nm = (id: string) => (id === s.me ? 'you' : P[id].name);
  const st = (e: { from: string; to: string }) => s.paid[`${e.from}>${e.to}`];
  const progressed = !!s.stl || plan.some(e => st(e));

  if (progressed) return <MoneyProgress />;

  const mineRaw = raw.filter(e => e.from === s.me || e.to === s.me);
  const tangledCap = `${mineRaw.length} IOUs: ${mineRaw.map(e => (e.from === s.me ? `you owe ${P[e.to].name} ${usd2(e.amt)}` : `${P[e.from].name} owes you ${usd2(e.amt)}`)).join('. ')}.`;
  const mine = plan.filter(e => e.from === s.me || e.to === s.me).sort((a, b) => planRank(a, s.me) - planRank(b, s.me));
  const solvedCap = mine.length ? `${mine.map(e => (e.from === s.me ? `You pay ${P[e.to].name} ${usd2(e.amt)}` : `${P[e.from].name} pays you ${usd2(e.amt)}`)).join('. ')}.` : 'You are square.';
  const caption = phase === 0 ? tangledCap : phase === 1 ? 'Every IOU becomes one net balance per person.' : solvedCap;
  const myOut = plan.find(e => e.from === s.me);
  const myIn = plan.find(e => e.to === s.me);
  void nm; void later;
  return (
    <div className="scr pt-v3">
      <div className="p-sscroll pt-money has-hm">
        <MoneyBalance net={net} caption={caption} />
        <div className="pt-graph4"><DebtUntangle raw={raw} simple={plan} people={P} solved={s.simplified} controls="inline" startButton={false} skin="solver" onPhase={setPhase}
          onSolved={() => { haptic(16); if (!s.simplified) d({ t: 'set', patch: { simplified: true } }); d({ t: 'done', key: 'simplify' }); }} /></div>
        {phase === 0 && <IouLog raw={raw} people={P} me={s.me} />}
        {phase === 1 && <NetLog nets={nets(raw)} people={P} me={s.me} />}
        {phase === 2 && <PairRows plan={plan} people={P} me={s.me} onRow={e => { if (e.from === 'ari' && s.me === 'ari') { haptic(); d({ t: 'view', v: 'choose' }); } }} />}
      </div>
      <CoreHeader onBack={() => { haptic(); d({ t: 'go', step: 'trip' }); }} backLabel="Back to Lisbon Crew" title="Money" sub={`Whole trip · ${Object.keys(nets(raw)).length} people`} />
      <div className="p-sbottom">
        {phase === 0 && !s.simplified ? <Button label={`Simplify ${raw.length} IOUs`} fullWidth onClick={() => { haptic(16); d({ t: 'set', patch: { simplified: true } }); }} />
          : phase < 2 ? <Button label="Finding the fewest payments" disabled fullWidth />
          : myOut ? <Button label={`Pay ${P[myOut.to].name} ${usd2(myOut.amt)}`} fullWidth onClick={() => { haptic(); d({ t: 'view', v: 'choose' }); }} />
          : myIn ? <Button label={`Ask ${P[myIn.from].name} for ${usd2(myIn.amt)}`} fullWidth onClick={() => d({ t: 'toast', msg: `Reminder sent to ${P[myIn.from].name}`, tone: 'success' })} />
          : <Button label="Back to the trip" variant="secondary" fullWidth onClick={() => d({ t: 'go', step: 'trip' })} />}
      </div>
    </div>
  );
}

/** S6: the Money screen once a payment exists. Balances only move on confirmed. */
function MoneyProgress() {
  const { s, d, P } = useApp();
  const later = useLater();
  const plan = [...simplifyOf(s)].sort((x, y) => planRank(x, s.me) - planRank(y, s.me));
  const net = liveNets(s)[s.me] ?? 0;
  const stl = s.stl;
  const flag = (e: { from: string; to: string }) => s.paid[`${e.from}>${e.to}`];
  const paidOn = (e: { from: string; to: string }) => r2(s.transfers.filter(t => t.from === e.from && t.to === e.to).reduce((a, t) => a + t.amt, 0));
  const done = plan.filter(e => flag(e) === 'app' || flag(e) === 'cash').length;
  const paidSum = r2(plan.reduce((a, e) => a + paidOn(e), 0));
  const sum = r2(plan.reduce((a, e) => a + e.amt, 0));
  const nm = (id: string) => (id === s.me ? 'You' : P[id].name);
  const carry = stl && stl.status === 'confirmed' ? stl.carry : 0;
  const rows: PlanRow[] = plan.map(e => {
    const k = `${e.from}>${e.to}`; const f = flag(e); const got = paidOn(e);
    const isMine = k === keyOf(s);
    const pend = isMine && stl && (stl.status === 'pending' || stl.status === 'queued' || stl.status === 'disputed');
    const part = got > 0 && got < e.amt - 0.004 && !f;
    const how = isMine && stl && stl.status === 'confirmed' && !part ? `${stl.method === 'cash' ? 'Cash' : METHODS.find(m => m.id === stl.method)!.title} · confirmed ${hm(stl.confirmedAt ?? '10:40 PM')}` : null;
    return { from: P[e.from], to: P[e.to], amount: part ? r2(e.amt - got) : e.amt, reason: part ? `${usd2(got)} in cash, ${usd2(r2(e.amt - got))} still open` : how ?? PLAN_REASON[k] ?? '',
      state: f === 'app' || f === 'cash' ? 'paid' : pend ? 'pending' : 'due', paidLabel: f ? `${usd2(got || e.amt)} ✓` : undefined, perspective: e.from === s.me ? 'out' : e.to === s.me ? 'in' : 'other' };
  });
  const openIn = plan.filter(e => e.to === s.me && !flag(e));
  const myOpen = dueOf(s) > 0.004 && !(stl && stl.status !== 'confirmed' && stl.status !== 'canceled') && !flag(myEdge(s));
  const sentence = [
    ...openIn.map(e => `${nm(e.from)} pays you ${usd2(e.amt)}.`),
    ...(myOpen ? [`You pay ${P[myEdge(s).to].name} ${usd2(dueOf(s))}.`] : []),
    ...(carry > 0.004 ? [`${usd2(carry)} carried to your next split.`] : []),
  ].join(' ') || 'Waiting for the last payment.';
  const askRen = () => {
    const e = openIn[0]; if (!e) return; haptic(10);
    d({ t: 'toast', msg: `Asked ${P[e.from].name} for ${usd2(e.amt)}`, tone: 'neutral' });
    later(1300, () => { haptic(10); d({ t: 'pay', key: `${e.from}>${e.to}`, how: 'app' }); d({ t: 'toast', msg: `${P[e.from].name} paid you ${usd2(e.amt)}`, tone: 'success' }); });
    plan.filter(x => x.from !== s.me && x.to !== s.me && !flag(x)).forEach((x, i) => later(2500 + i * 1000, () => { haptic(10); d({ t: 'pay', key: `${x.from}>${x.to}`, how: 'cash' }); d({ t: 'toast', msg: `${P[x.to].name} confirmed ${P[x.from].name}'s cash`, tone: 'success' }); }));
  };
  const cta = myOpen ? <Button label={`Pay ${P[myEdge(s).to].name} ${usd2(dueOf(s))}`} fullWidth onClick={() => d({ t: 'view', v: 'choose' })} />
    : openIn.length ? <Button label={`Ask ${P[openIn[0].from].name} for ${usd2(openIn[0].amt)}`} fullWidth onClick={askRen} />
    : done === plan.length ? null
    : <Button label={stl && stl.status !== 'confirmed' ? `Waiting for ${P[stl.to].name}` : 'Waiting for the last payment'} disabled fullWidth />;
  const success = stl && stl.status === 'confirmed'
    ? <PaymentSuccess title={stl.method === 'cash' ? `${P[stl.to].name} confirmed ${usd2(stl.paid)}` : `Paid ${P[stl.to].name} ${usd2(stl.paid)}`} meta={`${stl.method === 'cash' ? 'cash' : METHODS.find(m => m.id === stl.method)!.title} · ${stl.confirmedAt} · ${stl.id}`} />
    : stl ? <section className="p-scard p-success is-wait" role="status"><span className="p-success-disc is-wait" aria-hidden><span className="p-spinner p-spinner-sm" /></span><div><p className="p-success-title">{stl.status === 'disputed' ? `${P[stl.to].name} counted ${usd2(stl.dispute!.counted)}` : `Waiting for ${P[stl.to].name} to confirm`}</p><p className="p-success-meta">{stl.method} · marked {stl.markedAt} · {stl.id}</p></div></section>
    : null;
  return (
    <div className="scr pt-v3">
      <div className="p-sscroll pt-money is-progress">
        <MoneyBalance net={net} caption={sentence} compact />
        {success}
        <SettleProgress done={done} total={plan.length} paid={paidSum} sum={sum} />
        <PlanRowsClickable rows={rows} onMine={() => d({ t: 'view', v: stl && stl.status === 'disputed' ? 'dispute' : stl && stl.status === 'queued' ? 'offline' : stl ? 'receipt' : 'choose' })} />
      </div>
      <CoreHeader onBack={() => { haptic(); d({ t: 'go', step: 'trip' }); }} backLabel="Back to Lisbon Crew" title="Money" sub="Whole trip · 7 people" />
      {cta && <div className="p-sbottom">{cta}</div>}
    </div>
  );
}
function PlanRowsClickable({ rows, onMine }: { rows: PlanRow[]; onMine: () => void }) {
  return <div className="pt-rowsbtn" onClick={e => { const r = (e.target as HTMLElement).closest('.p-planrow'); if (r && r === r.parentElement?.firstElementChild) { haptic(); onMine(); } }}><PlanRows rows={rows} /></div>;
}

/* ---------------- 12 Settle up, every view ---------------- */
export function SettleFlow() {
  const { s, d, P } = useApp();
  const v = s.settleView;
  if (v === 'confirmed') return <MoneyScreen />;
  return <div className="scr pt-v3" key={v}>{VIEW[v](s, d, P)}</div>;
}
type Ctx = ReturnType<typeof useApp>;
const VIEW: Record<Exclude<SettleView, 'confirmed'>, (s: Ctx['s'], d: Ctx['d'], P: Ctx['P']) => React.ReactNode> = {
  choose: () => <Choose />, cash: () => <Cash />, partial: () => <Partial />, pending: () => <Pending />, handoff: () => <Handoff />,
  confirm: () => <Confirm />, receipt: () => <Receipt />, dispute: () => <Dispute />, offline: () => <Offline />,
};
const toMoney = (d: Ctx['d']) => () => { haptic(); d({ t: 'go', step: 'money' }); };

function Choose() {
  const { s, d, P } = useApp();
  const e = myEdge(s); const due = dueOf(s);
  const [why, setWhy] = useState(false);
  const m = METHODS.find(x => x.id === s.pick)!;
  const go = () => {
    haptic(14);
    if (s.pick === 'tripup') { d({ t: 'payApp' }); d({ t: 'toast', msg: `Paid ${P[e.to].name} ${usd2(due)}`, tone: 'success' }); }
    else if (s.pick === 'cash') d({ t: 'view', v: 'cash' });
    else { if (s.pick === 'bank') d({ t: 'toast', msg: 'Bank details copied', tone: 'success' }); d({ t: 'view', v: 'handoff' }); }
  };
  return (<>
    <div className="p-sscroll">
      <PairHero from={P[e.from]} to={P[e.to]} amount={due} caption={due < e.amt ? `What's left after ${usd2(r2(e.amt - due))} in cash.` : 'For the Tejo boat tour, routed through Tomás.'} pill={<SPill tone="accent">1 OF 3</SPill>} link={`Why ${usd2(e.amt)}`} onLink={() => setWhy(true)} />
      <Overline>HOW YOU'LL PAY</Overline>
      <MethodPicker value={s.pick} onChange={pick => d({ t: 'set', patch: { pick } })} />
    </div>
    <GlassHeader back="Money" onBack={toMoney(d)} title={`Pay ${P[e.to].name}`} subtitle="Payment 1 of 3 · simplified" />
    <div className="p-sbottom"><Button label={m.cta(usd2(due))} fullWidth onClick={go} /></div>
    {why && <BottomSheet title={`Why ${usd2(e.amt)}`} detent="compact" onClose={() => setWhy(false)}>
      <div className="pt-why"><Readout title="WHERE IT CAME FROM" rows={NIC_PROVENANCE.map((p, i) => [p.label, i === 0 ? `+${p.amount.toFixed(2)}` : `${p.amount < 0 ? '−' : ''}${Math.abs(p.amount).toFixed(2)}`, i === NIC_PROVENANCE.length - 1 ? 'carry' : undefined])} />
        <p className="pt-why-note">You owed Tomás for the boat tour, and Tomás owed Nic the same. Simplify drops the middle step, so you pay Nic directly. Every balance stays the same.</p></div>
    </BottomSheet>}
  </>);
}

function Cash() {
  const { s, d, P } = useApp();
  const e = myEdge(s); const due = dueOf(s);
  const [held, setHeld] = useState(false);
  const hand = s.round ? roundCash(due).paid : due;
  return (<>
    <div className={`p-sscroll ${held ? 'is-dim' : ''}`}>
      <CashCount due={due} round={s.round} onRound={round => { haptic(6); d({ t: 'set', patch: { round } }); }} onPartial={() => { haptic(); d({ t: 'set', patch: { partial: true } }); d({ t: 'view', v: 'partial' }); }} from={P[e.from]} to={P[e.to]} />
    </div>
    <GlassHeader back={`Pay ${P[e.to].name}`} onBack={() => { haptic(); d({ t: 'view', v: 'choose' }); }} title={`Cash for ${P[e.to].name}`} subtitle="Count it out, then slide" />
    <div className="p-sbottom is-slide"><SlideToSettle amount={hand} onHold={setHeld} onConfirm={() => { d({ t: 'set', patch: { partial: false } }); d({ t: 'mark' }); }} /></div>
  </>);
}

function Partial() {
  const { s, d, P } = useApp();
  const e = myEdge(s); const due = dueOf(s);
  const [held, setHeld] = useState(false);
  const amt = Math.min(s.partialAmt, due);
  return (<>
    <div className={`p-sscroll ${held ? 'is-dim' : ''}`}><PartialCash due={due} amount={amt} onAmount={partialAmt => d({ t: 'set', patch: { partialAmt } })} /></div>
    <GlassHeader back={`Pay ${P[e.to].name}`} onBack={() => { haptic(); d({ t: 'set', patch: { partial: false } }); d({ t: 'view', v: 'cash' }); }} title={`Cash for ${P[e.to].name}`} subtitle="Paying part now" />
    <div className="p-sbottom is-slide"><SlideToSettle key={amt} amount={amt} onHold={setHeld} onConfirm={() => { d({ t: 'set', patch: { partial: amt < due - 0.004, round: false } }); d({ t: 'mark' }); }} /></div>
  </>);
}

function Pending() {
  const { s, d, P } = useApp();
  const stl = s.stl;
  if (!stl) return <Missing />;
  const to = P[stl.to];
  const left = r2(stl.due - stl.paid);
  const body = stl.method !== 'cash' ? <>{to.name} gets a request to confirm {usd2(stl.paid)} sent with {METHODS.find(m => m.id === stl.method)!.title}. Your balance moves when he does.</>
    : stl.partial ? <>{to.name} gets a request to confirm {usd2(stl.paid)} in cash. The other {usd2(left)} stays on your plan.</> : undefined;
  const live = s.undoAt != null && Date.now() - s.undoAt < 5000;
  return (<>
    <div className="p-sscroll"><PendingMark s={stl} to={to} body={body} /></div>
    <GlassHeader back="Money" onBack={toMoney(d)} title={stl.method === 'cash' ? `Cash for ${to.name}` : `Pay ${to.name}`} subtitle={`Waiting for ${to.name}`} />
    {live && <UndoToast amount={stl.paid} startAt={performance.now() - (Date.now() - s.undoAt!)} onUndo={() => { haptic(12); d({ t: 'undo' }); d({ t: 'toast', msg: `Undone. ${to.name}'s request was withdrawn.`, tone: 'neutral' }); }} onExpire={() => d({ t: 'set', patch: { undoAt: undefined } })} />}
    <div className="p-sbottom"><Button label="Back to balances" variant="plain" fullWidth onClick={toMoney(d)} /></div>
  </>);
}

function Handoff() {
  const { s, d, P } = useApp();
  const e = myEdge(s); const due = dueOf(s);
  const m = METHODS.find(x => x.id === s.pick) ?? METHODS[1];
  const app = m.id === 'bank' ? 'your bank app' : m.title;
  return (<>
    <div className="p-sscroll">
      <div className="p-pend-hero">
        <span className="p-pend-disc is-q" aria-hidden><b>{m.id === 'mbway' ? 'MB' : m.id === 'revolut' ? 'R' : '$'}</b></span>
        <h2 className="p-pend-title">Did it go through?</h2>
        <p className="p-pend-body">{m.id === 'bank' ? 'We copied the details' : `${m.title} opened`} with {usd2(due)} and reference STL_7Q2K-0042. {app} doesn't tell us when it's done, so tap Yes once it has.</p>
      </div>
      <Readout title="HAND-OFF" pill={<span className="p-readout-pill">OPENED 10:39 PM</span>} rows={[['app', m.title], ['to', `${P[e.to].name} · ${m.meta.split(' · ')[0]}`], ['amount', due.toFixed(2)], ['reference', 'STL_7Q2K-0042']]} />
    </div>
    <GlassHeader back={`Pay ${P[e.to].name}`} onBack={() => { haptic(); d({ t: 'view', v: 'choose' }); }} title={m.title} subtitle="Back from the hand-off" />
    <div className="p-sbottom">
      <Button label="Yes, I sent it" fullWidth onClick={() => { haptic(14); d({ t: 'handoff', sent: true }); }} />
      <Button label="Not yet" variant="secondary" fullWidth onClick={() => d({ t: 'handoff', sent: false })} />
    </div>
  </>);
}

function Confirm() {
  const { s, d, P } = useApp();
  const later = useLater();
  const stl = s.stl;
  const [counted, setCounted] = useState('40.00'); const [note, setNote] = useState('Got two twenties, nothing else.');
  const [sent, setSent] = useState(false);
  if (!stl || stl.status === 'confirmed') return <Missing nic />;
  const from = P[stl.from], to = P[stl.to];
  return (<>
    <div className="p-sscroll has-two"><ReceiverConfirm s={stl} from={from} to={to} /></div>
    <GlassHeader back="Lisbon Crew" onBack={() => { haptic(); d({ t: 'set', patch: { me: 'ari' } }); d({ t: 'view', v: 'pending' }); }} title={`Did ${from.name} pay you?`} subtitle={`${to.name}'s phone · ${stl.method === 'cash' ? 'cash' : stl.method} · ${hm(stl.markedAt ?? '10:39 PM')}`} />
    <div className="p-sbottom">
      <Button label={sent ? 'Confirmed' : `Yes, I got ${usd2(stl.paid)}`} icon={sent ? 'check' : undefined} fullWidth disabled={sent} onClick={() => { haptic(18); setSent(true); d({ t: 'toast', msg: `Confirmed. ${from.name}'s balance updates now.`, tone: 'success' }); later(1100, () => d({ t: 'confirm' })); }} />
      <Button label="Not yet" variant="secondary" fullWidth disabled={sent} onClick={() => { haptic(); d({ t: 'set', patch: { notYet: true } }); }} />
    </div>
    {s.notYet && <BottomSheet title="What did you get?" detent="compact" onClose={() => d({ t: 'set', patch: { notYet: false } })}>
      <div className="pt-notyet">
        <label className="pt-field"><span>Amount you counted</span><span className="pt-field-in"><b>$</b><input inputMode="decimal" value={counted} onChange={e => setCounted(e.target.value)} aria-label="Amount you counted" /></span></label>
        <label className="pt-field"><span>Note for {from.name}</span><input value={note} onChange={e => setNote(e.target.value)} aria-label={`Note for ${from.name}`} /></label>
        <Button label={`Send to ${from.name}`} fullWidth onClick={() => { haptic(12); const c = parseFloat(counted.replace(',', '.')); d({ t: 'dispute', counted: isFinite(c) ? r2(c) : 40, note: note.trim() || 'The count is off.' }); }} />
      </div>
    </BottomSheet>}
  </>);
}

function Receipt() {
  const { s, d, P } = useApp();
  const stl = s.stl;
  if (!stl) return <Missing />;
  const from = P[stl.from], to = P[stl.to];
  return (<>
    <div className="p-sscroll"><ReceiptView s={stl} from={from} to={to} /></div>
    <GlassHeader back="Money" onBack={toMoney(d)} title="Receipt" subtitle={`You → ${to.name} · ${stl.method === 'cash' ? 'cash' : METHODS.find(m => m.id === stl.method)!.title}`} />
    <div className="p-sbottom">
      {stl.status !== 'confirmed' && <Button label="Cancel the cash mark" variant="plain" fullWidth onClick={() => { haptic(); d({ t: 'cancelMark' }); }} />}
      <Button label="Share receipt" icon="share" variant="surface" fullWidth onClick={() => { haptic(10); d({ t: 'toast', msg: 'Receipt saved as an image', tone: 'success' }); }} />
    </div>
  </>);
}

function Dispute() {
  const { s, d, P } = useApp();
  const stl = s.stl;
  if (!stl) return <Missing />;
  return (<>
    <div className="p-sscroll"><DisputeView s={stl} to={P[stl.to]} fix={s.fix} onFix={fix => d({ t: 'set', patch: { fix } })} /></div>
    <GlassHeader back="Money" onBack={toMoney(d)} title={`Pay ${P[stl.to].name}`} subtitle="Cash · needs a look" />
    <div className="p-sbottom"><Button label={s.fix === 'cancel' ? 'Cancel the cash mark' : `Send to ${P[stl.to].name}`} fullWidth onClick={() => { haptic(12); d({ t: 'resolve' }); }} /></div>
  </>);
}

function Offline() {
  const { s, d, P } = useApp();
  const stl = s.stl;
  if (!stl) return <Missing />;
  return (<>
    <div className="p-sscroll"><OfflineView s={stl} from={P[stl.from]} to={P[stl.to]} /></div>
    <GlassHeader back="Money" onBack={toMoney(d)} title={`Pay ${P[stl.to].name}`} subtitle="Cash · offline" />
    <div className="p-sbottom"><Button label="Cancel the cash mark" variant="plain" fullWidth onClick={() => { haptic(); d({ t: 'cancelMark' }); }} /></div>
  </>);
}

function Missing({ nic }: { nic?: boolean }) {
  const { d } = useApp();
  return (<>
    <div className="p-sscroll"><p className="p-note">{nic ? 'Nothing to confirm right now. Ari has not marked a payment yet.' : 'No payment yet.'}</p></div>
    <GlassHeader back="Money" onBack={() => { d({ t: 'set', patch: { me: 'ari' } }); d({ t: 'go', step: 'money' }); }} title={nic ? 'Requests' : 'Pay Nic'} />
  </>);
}

/* ---------------- 13 All squared up (hifi-10) ---------------- */
export function SquaredOverlay({ onAction }: { onAction: () => void }) {
  const { s, P } = useApp();
  const plan = [...simplifyOf(s)].sort((x, y) => planRank(x, s.me) - planRank(y, s.me));
  const times = ['10:39 PM', '10:40 PM', '10:41 PM'];
  const rows: SquaredRow[] = plan.map((e, i) => {
    const k = `${e.from}>${e.to}`; const got = r2(s.transfers.filter(t => t.from === e.from && t.to === e.to).reduce((a, t) => a + t.amt, 0)) || e.amt;
    return [P[e.from].name, P[e.to].name, usd2(got), s.paid[k] === 'cash' ? 'cash ✓' : times[i] ?? '10:41 PM'];
  });
  const handed = r2(plan.reduce((a, e) => a + (r2(s.transfers.filter(t => t.from === e.from && t.to === e.to).reduce((x, t) => x + t.amt, 0)) || e.amt), 0));
  const sum = r2(plan.reduce((a, e) => a + e.amt, 0));
  const carry = r2(sum - handed);
  const body = carry > 0.004 ? `${plan.length} payments · ${usd2(handed)} · ${usd2(carry)} rolls over` : `${plan.length} payments · ${usd2(sum)} · everyone at $0.00`;
  const people = [...new Set(plan.flatMap(e => [e.from, e.to]))];
  return <SquaredSheet rows={rows} people={people} body={body} onAction={onAction} />;
}
