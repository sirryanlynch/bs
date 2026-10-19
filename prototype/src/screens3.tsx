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
export function Expense() {
  const { s, d, P, nm } = useApp();
  const crew = crewOf(true);
  const shares = linesToSharesExport(s.lines);
  const groups = new Map<number, string[]>();
  crew.forEach(id => groups.set(shares[id] ?? 0, [...(groups.get(shares[id] ?? 0) ?? []), id]));
  const sorted = [...groups.entries()].sort((a, b) => a[1].length - b[1].length);
  const order = (ids: string[]) => [...ids].sort((a, b) => (a === 'ren' ? -1 : b === 'ren' ? 1 : 0));
  const summary = sorted.length === 1 ? [`Everyone pays ${usd(sorted[0][0])}`]
    : [...sorted.slice(0, -1).map(([v, ids]) => `${order(ids).map(id => nm(id)).join(' and ')}: ${usd(v)}${ids.length > 1 ? ' each' : ''}`), `Everyone else: ${usd(sorted[sorted.length - 1][0])}`];
  const ok = wineOff(s);
  const feat = s.lines.find(l => /vinho|wine/i.test(l.item))?.id ?? 'wine';
  return (
    <div className="scr">
      <div className="scr-scroll has-cta">
        <TopBar back="Tonight" onBack={() => d({ t: 'go', step: 'plan' })} title="Split dinner" sub={`Paid by ${nm('ari', false)} · $248.70`} />
        {/* v5.1: the bill is the hero and shows the live result; the one decision (who had the wine) is its own card; the rest is one quiet list. */}
        <section className="pt-billhero" aria-label="Dinner at Taberna, $248.70">
          <div className="pt-billhero-ph"><img src={photo.taberna} alt="" /><span className="pt-billhero-chip tu-num">Sat, Oct 17 · 8:30 PM · {crew.length} people</span></div>
          <div className="pt-billhero-body">
            <p className="pt-billhero-k">Dinner at Taberna</p>
            <p className="pt-billhero-amt tu-num">$248.70</p>
            <div className="pt-summary" role="status">{summary.map(x => <span key={x} className="tu-num">{x}</span>)}</div>
          </div>
        </section>
        {s.lines.filter(l => l.id === feat).map(l => (
          <section key={l.id} className={`pt-featline ${ok ? 'is-ok' : ''}`}>
            <div className="pt-featline-head"><span className="pt-featline-ico" aria-hidden><Icon name="wine" size={20} /></span>
              <span><b>Who had the wine?</b><small className="tu-num">{l.qty > 1 ? `${l.qty}× ` : ''}{l.item.split(',')[0]} · {usd(l.price)}</small></span></div>
            <div className="pt-who pt-who-faces">{crew.map(id => {
              const on = l.who.includes(id);
              return <button key={id} type="button" className={`pt-whobtn ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={`${P[id].name} ${on ? 'shares' : 'skips'} ${l.item}`} onClick={() => { haptic(); d({ t: 'toggleLine', line: l.id, who: id }); }}>
                <span className="pt-whoface"><Face person={P[id]} size={40} />{!on && <span className="pt-whooff" aria-hidden><Icon name="close" size={12} /></span>}</span><span>{nm(id)}</span></button>;
            })}</div>
            <p className="pt-featline-note">{ok ? 'Ren and Nic are off the wine.' : 'Ren and Nic skipped the wine. Tap them off.'}</p>
          </section>
        ))}
        <section className="pt-restlines" aria-label="Shared by everyone">
          <p className="pt-restlines-k">Shared by everyone</p>
          {s.lines.filter(l => l.id !== feat).map(l => (
            <div key={l.id} className="pt-restline"><span>{l.qty > 1 && <span className="tu-num">{l.qty}× </span>}{l.item}</span><b className="tu-num">{usd(l.price)}</b></div>
          ))}
        </section>
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
