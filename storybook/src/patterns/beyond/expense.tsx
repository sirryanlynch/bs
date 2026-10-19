import { Stepper } from '../../components/beyond/stepper';
import React, { useEffect, useState } from 'react';
import { useFlow, Top, crewPeople, LINES_ALL } from './kit';
import { Button, Avatar } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { ReceiptScanner, ParsedLines, SplitModeControl, LineItemAssigner, SharesEditor, TipTax, PerPerson } from '../../components/beyond/expense';
import { Render3D } from '../../components/Icon';
import { RECEIPT, RECEIPT_TOTAL, RECEIPT_PLACE, RECEIPT_WHEN } from '../../lib/beyond';
const money = (n: number) => '$' + n.toFixed(2);
import { useReducedMotion } from '../../lib/PrismRoot';

const r2 = (n: number) => Math.round(n * 100) / 100;
export function amountsOf(e: ReturnType<typeof useFlow>['s']['expense']) {
  const out: Record<string, number> = {}; const f = 1 + e.tip / 100;
  if (e.mode === 'item') RECEIPT.forEach(l => { const w = e.assign[l.id] ?? []; w.forEach(id => (out[id] = (out[id] ?? 0) + l.price / w.length)); });
  else if (e.mode === 'even') LINES_ALL.forEach(id => (out[id] = RECEIPT_TOTAL / 7));
  else if (e.mode === 'exclude') { const inc = LINES_ALL.filter(id => !e.excluded.includes(id)); inc.forEach(id => (out[id] = RECEIPT_TOTAL / inc.length)); }
  else { const tot = LINES_ALL.reduce((a, id) => a + (e.shares[id] ?? 1), 0); LINES_ALL.forEach(id => (out[id] = (RECEIPT_TOTAL * (e.shares[id] ?? 1)) / tot)); }
  Object.keys(out).forEach(k => (out[k] = r2(out[k] * f)));
  /* Rounding goes to the payer, so shares always add up to the total (spec: 1¢ to you). */
  const diff = r2(r2(RECEIPT_TOTAL * f) - Object.values(out).reduce((x, y) => x + y, 0)); if (out.ari != null && diff) out.ari = r2(out.ari + diff);
  return out;
}

/* Spec: five Stepper steps after the camera. Scan has no stepper; Balances updated is the result. */
const EXP_STEPS = ['Line items', 'Assign to people', 'Split mode', 'Tip and tax', 'Review'];
const EXP_ROUTES = ['expense/items', 'expense/assign', 'expense/split', 'expense/tip', 'expense/review'];
/* v5 scope cut: the happy path is scan, assign, done, so assign needs no stepper. Kept for Storybook stories of the full flow. */
const SHOW_EXP_STEPS = false;
function ExpSteps({ at, onSkip }: { at: number; onSkip?: () => void }) { const { go } = useFlow(); if (!SHOW_EXP_STEPS) return null; return <Stepper steps={EXP_STEPS} current={at} onStep={i => go(EXP_ROUTES[i])} onSkip={onSkip} label="Add expense progress" />; }

export function ScanScreen() {
  const { go, back } = useFlow(); const reduce = useReducedMotion();
  const [phase, setPhase] = useState<'aim' | 'scanning' | 'done'>('aim');
  useEffect(() => { const a = setTimeout(() => setPhase('scanning'), reduce ? 400 : 1100); const b = setTimeout(() => setPhase('done'), reduce ? 900 : 3300); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  return (
    <div className="b-scr b-scr-dark">
      <div className="b-scroll has-cta">
        <Top title="Scan receipt" sub={`${RECEIPT_PLACE} · Lunch`} onBack={back} light />
        <ReceiptScanner phase={phase} lines={RECEIPT} total={RECEIPT_TOTAL} />
        <p className="b-help b-center">{phase === 'done' ? `All ${RECEIPT.length} lines read. Assign them on the next screen.` : 'The camera reads each line and the total. Nothing is uploaded until you save.'}</p>
      </div>
      <div className="b-bottom">{phase === 'done' ? <Button label="Assign items" fullWidth onClick={() => go('expense/assign', true)} /> : <Button label="Type it in instead" variant="secondary" fullWidth onClick={() => go('expense/items', true)} />}</div>
    </div>
  );
}
export function ItemsScreen() {
  const { go, back, P } = useFlow();
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Receipt" sub={`${RECEIPT_PLACE} · Lunch · Oct 14`} onBack={back} />
        <ExpSteps at={0} />
        <div className="b-paidby"><Avatar person={P.ari} size={36} ring="none" /><span><small>Paid by</small><b>You · Visa •• 4821</b></span><span className="tu-num b-paidby-amt">{money(RECEIPT_TOTAL)}</span></div>
        <ParsedLines lines={RECEIPT} total={RECEIPT_TOTAL} />
      </div>
      <div className="b-bottom"><Button label="Assign items" fullWidth onClick={() => go('expense/assign')} /></div>
    </div>
  );
}
function useExp() {
  const f = useFlow(); const e = f.s.expense; const ppl = crewPeople(f.P);
  const wineOff = !(e.assign.wine ?? []).includes('ren') && !(e.assign.wine ?? []).includes('nic');
  const patch = (v: Partial<typeof e>) => f.d({ t: 'patch', k: 'expense', v });
  return { ...f, e, ppl, wineOff, patch, amts: amountsOf(e) };
}
export function AssignScreen() {
  const { e, ppl, wineOff, patch, amts, go, back } = useExp();
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Who had what" sub="Tap people on each line" onBack={back} />
        <ExpSteps at={1} onSkip={() => { patch({ mode: 'even' }); go('expense/split'); }} />
        <LineItemAssigner lines={RECEIPT} assign={e.assign} people={ppl} open={e.open} onOpen={id => patch({ open: id })}
          onToggle={(line, who) => { const w = e.assign[line] ?? []; patch({ assign: { ...e.assign, [line]: w.includes(who) ? w.filter(x => x !== who) : [...w, who] }, mode: 'item' }); }} />
        {wineOff && <p className="b-note"><BIcon name="wine" size={20} />Ren and Nic skipped the wine, so they pay {money(amts.ren ?? 0)} each with the tip.</p>}
      </div>
      <div className="b-bottom"><Button label="Save expense" fullWidth onClick={() => { patch({ saved: true }); go('expense/done'); }} /></div>
    </div>
  );
}
export function SplitScreen() {
  const { e, ppl, wineOff, patch, amts, go, back } = useExp();
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="How should we split it?" sub={`${money(RECEIPT_TOTAL)} · 7 people`} onBack={back} />
        <ExpSteps at={2} onSkip={() => { patch({ mode: 'even' }); go('expense/tip'); }} />
        <SplitModeControl value={e.mode} onChange={m => patch({ mode: m })} />
        {e.mode === 'item' && <p className="b-card b-help tu-num">{wineOff ? 'By item, from the lines you assigned. Ren and Nic skip the wine.' : 'By item, from the lines you assigned.'}</p>}
        {e.mode === 'even' && <p className="b-card b-help tu-num">{money(RECEIPT_TOTAL)} split 7 ways is {money(RECEIPT_TOTAL / 7)} each before tip. Rounding goes to you, so it adds up.</p>}
        {e.mode === 'shares' && <SharesEditor people={ppl} shares={e.shares} onChange={(id, n) => patch({ shares: { ...e.shares, [id]: n } })} />}
        {e.mode === 'exclude' && <div className="b-assign-people is-static" role="group" aria-label="Who is in">{ppl.map(p => { const on = !e.excluded.includes(p.id); return (
          <button key={p.id} type="button" className={`b-assign-p ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => patch({ excluded: on ? [...e.excluded, p.id] : e.excluded.filter(x => x !== p.id) })}><Avatar person={p} size={36} ring="none" /><small>{p.you ? 'You' : p.name}</small></button>); })}</div>}
        <section className="b-section"><h2 className="b-overline">Each person</h2><PerPerson people={ppl} amounts={amts} highlight={e.mode === 'item' && wineOff ? ['ren', 'nic'] : []} /></section>
      </div>
      <div className="b-bottom"><Button label="Add tip and tax" fullWidth onClick={() => go('expense/tip')} /></div>
    </div>
  );
}
export function TipScreen() {
  const { e, ppl, wineOff, patch, amts, go, back } = useExp();
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Tip and tax" sub="Split by what each had" onBack={back} />
        <ExpSteps at={3} onSkip={() => { patch({ tip: 0 }); go('expense/review'); }} />
        <TipTax subtotal={RECEIPT_TOTAL} tip={e.tip} onTip={t => patch({ tip: t })} />
        <section className="b-section"><h2 className="b-overline">Each person</h2><PerPerson people={ppl} amounts={amts} highlight={e.mode === 'item' && wineOff ? ['ren', 'nic'] : []} /></section>
      </div>
      <div className="b-bottom"><Button label="Review split" fullWidth onClick={() => go('expense/review')} /></div>
    </div>
  );
}
export function ReviewScreen() {
  const { s, d, go, back, P } = useFlow(); const e = s.expense; const amts = amountsOf(e);
  const owed = r2(Object.entries(amts).filter(([k]) => k !== 'ari').reduce((a, [, v]) => a + v, 0));
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Review" onBack={back} />
        <ExpSteps at={4} />
        <div className="b-card b-expsum">
          <p className="b-overline">{RECEIPT_PLACE} · Lunch · {RECEIPT_WHEN} · paid by you · by item</p>
          <b className="b-expsum-amt tu-num">${(RECEIPT_TOTAL * (1 + e.tip / 100)).toFixed(2)}</b>
          <p className="b-help tu-num">You paid. The crew owes you ${owed.toFixed(2)}, and your share is ${(amts.ari ?? 0).toFixed(2)}.</p>
        </div>
        <PerPerson people={crewPeople(P)} amounts={amts} highlight={['ren', 'nic']} />
        <div className="b-receipt-thumb"><BIcon name="receiptX" size={20} /><span>Receipt photo attached · 6 lines</span></div>
      </div>
      <div className="b-bottom"><Button label="Save expense" fullWidth onClick={() => { d({ t: 'patch', k: 'expense', v: { saved: true } }); go('expense/done', true); }} /></div>
    </div>
  );
}
export function DoneScreen() {
  const { host, go, s: st, P } = useFlow(); const amts = amountsOf(st.expense);
  const others = Object.entries(amts).filter(([k]) => k !== 'ari').sort((a, b) => b[1] - a[1]);
  const owed = r2(others.reduce((a, [, v]) => a + v, 0));
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta b-centered">
        <div className="b-done anim-rise"><Render3D name="settle" size={120} /><h1 className="b-title">Balances updated</h1><p className="b-help tu-num">{RECEIPT_PLACE} · Lunch, {money(RECEIPT_TOTAL * (1 + st.expense.tip / 100))}. {others.length} people owe you {money(owed)} in total.</p></div>
        <div className="b-card">{others.slice(0, 4).map(([id, v]) => <div key={id} className="b-tiprow"><span>{P[id]?.name ?? id} owes you</span><b className="tu-num">{money(v)}</b></div>)}{others.length > 4 && <div className="b-tiprow"><span>{others.length - 4} more</span><b className="tu-num">{money(r2(others.slice(4).reduce((a, [, v]) => a + v, 0)))}</b></div>}</div>
      </div>
      <div className="b-bottom"><Button label="Done" variant="secondary" fullWidth onClick={() => go('plan/day')} /><Button label="See balances" fullWidth onClick={() => host.exit('money')} /></div>
    </div>
  );
}
