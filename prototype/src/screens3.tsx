import { SplitEditor, applyEven, applyAudience, type SplitLine } from '@sb/components/beyond/spliteditor';
import { ReceiptScanner } from '@sb/components/beyond/expense';
import type { RLine } from '@sb/lib/beyond';
import { useReducedMotion } from '@sb/lib/PrismRoot';
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@sb/components/Icon';
import { Avatar, AvatarStack, Button, useCountUp } from '@sb/components/core';
import { PaymentRow } from '@sb/components/money';
import { DebtUntangle } from '@sb/components/untangle';
import { BottomSheet, CelebrationOverlay } from '@sb/components/overlays';
import { Face } from '@sb/components/settle';
import { usd, photo } from '@sb/lib/data';
import { useApp, rawOf, simplifyOf, liveNets, expensesOf, total, linesToSharesExport, optName, tally, haptic, wineOff } from './store';
import { TopBar, Tabs, crewOf } from './screens1';
import { MoneyScreen, SquaredOverlay } from './settleflow';

/* ---------------- 10 Split dinner ---------------- */
/* v5.4.2: the receipt photo comes first, then the itemized split. */
function ReceiptStep() {
  const { s, d } = useApp(); const reduce = useReducedMotion();
  const [phase, setPhase] = useState<'aim' | 'scanning' | 'done'>('aim');
  useEffect(() => { const a = setTimeout(() => setPhase('scanning'), reduce ? 300 : 700); const b = setTimeout(() => setPhase('done'), reduce ? 700 : 2200); return () => { clearTimeout(a); clearTimeout(b); }; }, []);
  const lines: RLine[] = s.lines.map(l => ({ id: l.id, item: l.item, en: '', cat: '', print: l.item.toUpperCase(), qty: l.qty, price: l.price, conf: 0.96 }));
  return (
    <div className="b-scr b-scr-dark">
      <div className="b-scroll has-cta">
        <TopBar back="Tonight" onBack={() => d({ t: 'go', step: 'plan' })} title="Dinner bill" sub="Taberna da Rua das Flores" />
        <ReceiptScanner phase={phase} lines={lines} total={248.7} place="Taberna da Rua das Flores" stamp="R. das Flores 103, Lisboa · Oct 17, 2026 · 10:42 PM" />
        <p className="b-help b-center">{phase === 'done' ? `All ${lines.length} lines read. Next, who had what.` : 'Hold the receipt inside the frame.'}</p>
      </div>
      <div className="b-bottom"><Button label={phase === 'done' ? 'Split the items' : 'Reading…'} disabled={phase !== 'done'} fullWidth onClick={() => { haptic(); d({ t: 'set', patch: { receiptOk: true } }); }} /></div>
    </div>
  );
}
export function Expense() {
  const { s: s0 } = useApp();
  if (!s0.receiptOk) return <ReceiptStep />;
  return <ExpenseItems />;
}
function ExpenseItems() {
  const { s, d, P } = useApp();
  const crew = crewOf(true); const people = crew.map(id => P[id]);
  const lines: SplitLine[] = s.lines.map(l => ({ id: l.id, label: l.item, qty: l.qty, price: l.price, who: l.who }));
  const audience = crew.filter(id => s.lines.some(l => l.who.includes(id)));
  const mode = s.splitMode ?? 'even';
  const put = (ls: SplitLine[]) => d({ t: 'set', patch: { lines: s.lines.map(l => ({ ...l, who: ls.find(x => x.id === l.id)!.who })) } });
  return (
    <div className="scr">
      <div className="scr-scroll has-cta">
        <TopBar back="Receipt" onBack={() => d({ t: 'set', patch: { receiptOk: false } })} title="Who had what" sub="Paid by you · Taberna da Rua das Flores" />
        <SplitEditor title="Dinner at Taberna · Sat, Oct 17" total={248.7} lines={lines} people={people} audience={audience} mode={mode}
          open={s.splitOpen} onOpen={v => d({ t: 'set', patch: { splitOpen: v } })}
          onMode={m => { haptic(); d({ t: 'set', patch: { splitMode: m } }); if (m === 'even') put(applyEven(lines, audience)); }}
          onAudience={ids => { haptic(); put(mode === 'even' ? applyEven(lines, ids) : applyAudience(lines, audience, ids)); }}
          onLine={(id, who) => { haptic(); d({ t: 'set', patch: { lines: s.lines.map(l => l.id === id ? { ...l, who } : l) } }); }} />
      </div>
      <div className="scr-bottombar">
        <Button label="Save expense" fullWidth onClick={() => { haptic(18); d({ t: 'saveDinner' }); setTimeout(() => d({ t: 'go', step: 'money' }), 500); }} />
      </div>
    </div>
  );
}

/* ---------------- 11 Money + 12 Settle ---------------- */
export function Money() {
  const { s, d, P } = useApp();
  const raw = rawOf(s), plan = simplifyOf(s);
  const net = liveNets(s)[s.me] ?? 0;
  const shown = useCountUp(Math.abs(net), 700);
  const mine = plan.filter(e => e.from === s.me || e.to === s.me);
  const myOut = plan.find(e => e.from === s.me);
  const allPaid = plan.length > 0 && plan.every(e => s.paid[`${e.from}>${e.to}`] && s.paid[`${e.from}>${e.to}`] !== 'pending');
  const [rowsShown, setShown] = useState(s.simplified);
  const sentence = mine.map(e => e.from === s.me ? `You pay ${P[e.to].name} ${usd(e.amt)}` : `${P[e.from].name} pays you ${usd(e.amt)}`).join(' · ') || 'You are square';
  return (
    <div className="scr">
      <div className="scr-scroll has-cta-tabs">
        <TopBar title="Money" sub="Whole trip" />
        <div className="pt-balance">
          <span className={`pt-balance-amt tu-num ${net < -0.004 ? 'is-owe' : net > 0.004 ? 'is-owed' : ''}`}>{`${net < -0.004 ? '−' : net > 0.004 ? '+' : ''}$${shown.toFixed(2)}`}</span>
          <span className="pt-balance-sub">{Math.abs(net) < 0.005 ? 'All settled' : sentence}</span>
        </div>
        <div className="pt-graph"><DebtUntangle raw={raw} simple={plan} people={P} solved={s.simplified} startButton={false}
          onSolved={() => { haptic(16); setShown(true); if (!s.simplified) d({ t: 'set', patch: { simplified: true } }); d({ t: 'done', key: 'simplify' }); }} /></div>
        {s.simplified && rowsShown && (
          <div className="pt-payrows anim-rise">{plan.map(e => { const k = `${e.from}>${e.to}`; const st = s.paid[k]; return (
            <PaymentRow key={k} from={P[e.from]} to={P[e.to]} amount={e.amt} state={!st ? 'due' : st === 'pending' ? 'sending' : 'paid'} method={st === 'cash' ? 'cash' : st === 'app' ? (e.from === 'ari' ? s.method : 'MB WAY') : undefined} quiet />
          ); })}</div>
        )}
      </div>
      {!allPaid && (
        <div className="scr-bottombar pt-above-tabs">
          {!s.simplified ? <Button label={`Untangle into ${plan.length} payments`} icon="arrowsMerge" fullWidth onClick={() => { haptic(16); d({ t: 'set', patch: { simplified: true } }); }} />
            : !rowsShown ? <Button label="Untangling…" disabled fullWidth />
            : myOut ? <Button label={s.paid[`${myOut.from}>${myOut.to}`] ? 'Waiting for the others' : `Pay ${P[myOut.to].name} ${usd(myOut.amt)}`} disabled={!!s.paid[`${myOut.from}>${myOut.to}`]} fullWidth onClick={() => { haptic(); d({ t: 'go', step: 'settle' }); }} />
            : <Button label="Settle up" fullWidth onClick={() => d({ t: 'go', step: 'settle' })} />}
        </div>
      )}
      <Tabs active="money" />
      {s.settleOpen && <Settle />}
    </div>
  );
}

function Settle() {
  const { s, d, P, nm } = useApp();
  const plan = simplifyOf(s);
  const mine = plan.find(e => e.from === s.me) ?? plan.find(e => e.to === s.me)!;
  const k = `${mine.from}>${mine.to}`;
  const iPay = mine.from === s.me;
  const v = useCountUp(mine.amt);
  const st = s.paid[k];
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (ms: number, f: () => void) => timers.current.push(window.setTimeout(f, ms));
  const others = () => plan.filter(e => `${e.from}>${e.to}` !== k).forEach((e, i) => later(1500 + i * 1100, () => {
    haptic(10); d({ t: 'pay', key: `${e.from}>${e.to}`, how: 'app' });
    d({ t: 'toast', msg: `${nm(e.from)} paid ${e.to === s.me ? 'you' : P[e.to].name}`, tone: 'success' });
  }));
  const cash = s.method === 'Cash';
  const go = () => {
    haptic(20); d({ t: 'pay', key: k, how: 'pending' }); d({ t: 'done', key: 'settle' });
    later(cash ? 1500 : 1100, () => { d({ t: 'pay', key: k, how: cash ? 'cash' : 'app' }); d({ t: 'toast', msg: cash ? `${iPay ? P[mine.to].name : 'You'} confirmed the cash` : `Paid ${iPay ? P[mine.to].name : 'you'}`, tone: 'success' }); others(); });
  };
  return (
    <BottomSheet title={cash ? 'Mark as paid' : 'Settle up'} detent="medium" onClose={() => d({ t: 'go', step: 'money' })}>
      <div className="p-settle pt-settle">
        <div className="p-settle-pair"><Avatar person={P[mine.from]} size={44} ring="none" /><span className="p-settle-line"><Icon name="arrowRight" size={20} /></span><Avatar person={P[mine.to]} size={44} ring="none" /></div>
        <p className="p-settle-amt tu-num">${v.toFixed(2)}</p>
        <p className="p-settle-who">{nm(mine.from)} to {nm(mine.to, false)}</p>
        <div className="pt-methods" role="radiogroup" aria-label="Payment method">
          {['MB WAY', 'Apple Pay', 'Cash'].map(x => <button type="button" role="radio" aria-checked={s.method === x} key={x} className={s.method === x ? 'is-on' : ''} onClick={() => { haptic(); d({ t: 'set', patch: { method: x } }); }} disabled={!!st}>{x}</button>)}
        </div>
        {!st ? <Button label={cash ? `Mark ${usd(mine.amt)} as paid` : iPay ? `Pay ${usd(mine.amt)}` : `Request ${usd(mine.amt)}`} fullWidth onClick={go} />
          : st === 'pending' ? <div className="p-settle-sent anim-fade"><span className="p-spinner p-spinner-sm" />{cash ? `Waiting for ${iPay ? P[mine.to].name : 'you'}` : 'Sending'}</div>
          : <div className="p-settle-sent anim-fade"><Icon name="check" size={20} />Done</div>}
        {cash && !st && <p className="pt-center-note">{iPay ? P[mine.to].name : 'You'} confirms before it clears.</p>}
      </div>
    </BottomSheet>
  );
}

/* ---------------- 13 All squared up + recap ---------------- */
export function Squared() {
  const { s, d } = useApp();
  const plan = simplifyOf(s);
  const t = tally(s.votes); const n = Object.keys(s.votes).length; const w = s.winner ?? 0;
  if (!s.recap) return (
    <div className="scr pt-squared">
      <MoneyScreen />
      <SquaredOverlay onAction={() => { haptic(14); d({ t: 'set', patch: { recap: true, shared: true } }); d({ t: 'toast', msg: 'Recap ready to share', tone: 'success' }); }} />
    </div>
  );
  void CelebrationOverlay; void t; void n; void w;
  const share = async () => {
    haptic(16); d({ t: 'set', patch: { shared: true } });
    const text = `Lisbon Crew, all squared up. ${usd(total(plan))} settled in ${plan.length} payments.`;
    try { if ((navigator as any).share && matchMedia('(pointer: coarse)').matches) await (navigator as any).share({ title: 'Lisbon Crew recap', text }); else d({ t: 'toast', msg: 'Recap shared', tone: 'success' }); } catch { /* sheet closed */ }
  };
  void AvatarStack; void expensesOf;
  return (
    <div className="scr">
      <div className="scr-scroll has-cta">
        <TopBar back="Money" onBack={() => d({ t: 'set', patch: { recap: false } })} title="Recap" />
        <article className="pt-recap anim-pop">
          <img src={photo.alfama} alt="" />
          <div className="pt-recap-body">
            <h2>Lisbon Crew</h2>
            <p className="pt-recap-sq">All squared up.</p>
            <div className="pt-recap-stats">
              <div><b className="tu-num">{usd(total(plan))}</b><span>in {plan.length} payments</span></div>
              <div><b className="tu-num">{t[w]} of {n}</b><span>picked {optName(s, w, true)}</span></div>
            </div>
          </div>
        </article>
      </div>
      <div className="scr-bottombar">
        <Button label={s.shared ? 'Shared' : 'Share recap'} icon={s.shared ? 'check' : 'share'} fullWidth onClick={share} />
      </div>
    </div>
  );
}
