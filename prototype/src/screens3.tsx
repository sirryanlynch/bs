import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@sb/components/Icon';
import { Avatar, AvatarStack, Button, useCountUp } from '@sb/components/core';
import { PaymentRow } from '@sb/components/money';
import { DebtUntangle } from '@sb/components/untangle';
import { BottomSheet, CelebrationOverlay } from '@sb/components/overlays';
import { usd, photo } from '@sb/lib/data';
import { useApp, rawOf, simplifyOf, liveNets, expensesOf, total, linesToSharesExport, optName, tally, haptic, wineOff } from './store';
import { TopBar, Tabs, crewOf } from './screens1';
import { MoneyScreen, SquaredOverlay } from './settleflow';

/* ---------------- 10 Split dinner ---------------- */
export function Expense() {
  const { s, d, P, nm } = useApp();
  const crew = crewOf(true);
  const [open, setOpen] = useState<string | null>('wine');
  const shares = linesToSharesExport(s.lines);
  const groups = new Map<number, string[]>();
  crew.forEach(id => groups.set(shares[id] ?? 0, [...(groups.get(shares[id] ?? 0) ?? []), id]));
  const sorted = [...groups.entries()].sort((a, b) => a[1].length - b[1].length);
  const order = (ids: string[]) => [...ids].sort((a, b) => (a === 'ren' ? -1 : b === 'ren' ? 1 : 0));
  const summary = sorted.length === 1 ? [`Everyone pays ${usd(sorted[0][0])}`]
    : [...sorted.slice(0, -1).map(([v, ids]) => `${order(ids).map(id => nm(id)).join(' and ')}: ${usd(v)}${ids.length > 1 ? ' each' : ''}`), `Everyone else: ${usd(sorted[sorted.length - 1][0])}`];
  const ok = wineOff(s);
  return (
    <div className="scr">
      <div className="scr-scroll has-cta">
        <TopBar back="Tonight" onBack={() => d({ t: 'go', step: 'plan' })} title="Split dinner" sub={`Paid by ${nm('ari', false)} · $248.70`} />
        <div className="pt-lines">
          {s.lines.map(l => {
            const isOpen = open === l.id && !l.group;
            const out = crew.filter(x => !l.who.includes(x));
            return (
              <div key={l.id} className={`pt-line ${out.length ? 'is-partial' : ''} ${isOpen ? 'is-open' : ''}`}>
                <button type="button" className="pt-line-head" aria-expanded={isOpen} disabled={l.group} onClick={() => { haptic(); setOpen(isOpen ? null : l.id); }}>
                  <span className="pt-line-name">{l.qty > 1 && <span className="tu-num">{l.qty}× </span>}{l.item}</span>
                  <span className="pt-line-amt tu-num">{usd(l.price)}</span>
                  {out.length > 0 && <span className="pt-line-sub tu-num">{`Skipped by ${out.map(x => nm(x)).join(' and ')}`}</span>}
                </button>
                {isOpen && <div className="p-receipt-who pt-who">{crew.map(id => {
                  const on = l.who.includes(id);
                  return <button key={id} type="button" className={`pt-whobtn ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={`${P[id].name} ${on ? 'shares' : 'skips'} ${l.item}`} onClick={() => { haptic(); d({ t: 'toggleLine', line: l.id, who: id }); }}>
                    <Avatar person={P[id]} size={36} ring="none" /><span>{nm(id)}</span></button>;
                })}</div>}
              </div>
            );
          })}
        </div>
        {!ok && <p className="pt-hint"><Icon name="wine" size={20} />Ren and Nic skipped the wine. Tap them off.</p>}
        <div className="pt-summary" role="status">{summary.map(x => <span key={x} className="tu-num">{x}</span>)}</div>
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
