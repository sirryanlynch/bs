import React, { useEffect, useRef, useState } from 'react';
import './untangle-receipt.css';
import { registerUntangleSkin, UntangleFrame } from './untangle';
import { Person } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';

/**
 * DebtUntangle skin "receipt" (v5.6, replaces the v5.1 solver / math-engine layer on the Money tab).
 * The trip's IOUs print as a receipt. On Simplify each line tears off along its perforation and drops into two stacks
 * (the payer's below the zero line, the payee's above), so the stacks become every person's net balance. Solved draws the
 * three payments as hops between stacks. On the settle path (ReceiptStacksLive) each paid hop moves a chip across and both
 * stacks shrink to the line; when everything is paid every stack sits level at $0.
 * Motion: transform and opacity only, driven by the model's t (0 Tangled, 1 Netting, 2 Solved) so scrubbing works.
 * Iris is the only accent. Reduce Motion: no travel, states cross-fade (the model runs 200 ms per step).
 */
type Edge = { from: string; to: string; amt: number };
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
const easeIO = (x: number) => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const usd = (n: number) => `$${Math.abs(n).toFixed(2)}`;
const r2 = (n: number) => Math.round(n * 100) / 100;

export const RS_W = 362, RS_H = 268;
const ZERO = 128, BAR = 26, MAXH = 54, NAME_Y = 224;
const PAPER = { x: 96, y: 30, w: 170, head: 24, row: 21 };

/** Deterministic torn edge: a perforated zigzag with irregular teeth, so every strip tears a little differently. */
function tornEdge(x0: number, x1: number, y: number, seed: number, dir: 1 | -1) {
  const pts: string[] = []; let x = x0, k = 0;
  while (x < x1) { const w = 3.2 + ((seed * 7 + k * 13) % 5) * 0.55; const a = 1.1 + ((seed * 11 + k * 5) % 4) * 0.45; x = Math.min(x1, x + w);
    pts.push(`${x.toFixed(1)} ${(y + (k % 2 ? 0 : a * dir)).toFixed(1)}`); k++; }
  return pts;
}
function stripPath(i: number, top: number, h: number, first: boolean, last: boolean) {
  const { x, w } = PAPER; const x1 = x + w;
  const topEdge = first ? [`${x1} ${top}`] : tornEdge(x, x1, top, i, -1);
  const bot = last ? [`${x} ${top + h}`] : tornEdge(x, x1, top + h, i + 1, 1).reverse().map(p => p).concat([`${x} ${top + h}`]);
  return `M${x} ${top} L${topEdge.join(' L')} L${x1} ${top + h} L${bot.join(' L')} Z`;
}

export type StacksModel = { order: string[]; colX: Record<string, number>; h: (n: number) => number };
export function stacksModel(ids: string[], net: Record<string, number>, maxNet: number): StacksModel {
  // Debtors on the left (most owed first), even in the middle, creditors on the right: money reads left to right.
  const order = [...ids].sort((a, b) => (net[a] ?? 0) - (net[b] ?? 0));
  const gap = (RS_W - 64) / Math.max(1, order.length - 1); // 32 units of card padding each side, the same inset as the receipt
  const colX = Object.fromEntries(order.map((id, i) => [id, 32 + i * gap])) as Record<string, number>;
  const m = Math.max(1, maxNet);
  return { order, colX, h: n => (Math.abs(n) / m) * MAXH };
}

type DrawProps = { t: number; intro: number; reduce: boolean; uid: string; ids: string[]; people: Record<string, Person>; net: Record<string, number>; maxNet: number;
  raw: Edge[]; simple: Edge[]; summary: string; phase: number; minimal?: boolean; paid?: boolean[]; live?: boolean; stepper?: boolean };

export function ReceiptStacksSvg(p: DrawProps) {
  const { t, intro, reduce, uid, ids, people, net, maxNet, raw, simple, summary, phase, paid = [], live } = p;
  const M = stacksModel(ids, net, maxNet);
  const nm = (id: string) => (people[id]?.you ? 'You' : people[id]?.name ?? id);
  const nP = paid.filter(Boolean).length, squared = live && nP === simple.length && simple.length > 0;
  // Live balances after paid hops.
  const cur: Record<string, number> = { ...net }; simple.forEach((e, i) => { if (paid[i]) { cur[e.from] = r2((cur[e.from] ?? 0) + e.amt); cur[e.to] = r2((cur[e.to] ?? 0) - e.amt); } });
  const paperH = PAPER.head + raw.length * PAPER.row + 24;
  // ---- per-frame values (t units) ----
  const introK = (i: number) => (reduce ? 1 : ease((intro * 900 - i * 55) / 380));
  const tearK = (i: number) => (reduce ? 0 : easeIO((t - 0.08 - i * 0.07) / 0.55));       // strip i leaves the receipt
  const paperOp = reduce ? 1 - clamp(t / 0.5) : 1 - ease((t - 0.1) / 0.5);
  const barK = reduce ? clamp((t - 0.5) / 0.5) : ease((t - 0.42) / 0.55);
  const lineOp = reduce ? clamp((t - 0.5) / 0.5) : ease((t - 0.3) / 0.4);
  const hopK = (i: number) => (reduce ? clamp(t - 1) : ease((t - 1.15 - i * 0.12) / 0.55));
  const evenDim = 1 - 0.5 * clamp(t - 1);
  const capOp = [1 - clamp(t / 0.4), clamp(t / 0.4) * (1 - clamp((t - 1.3) / 0.4)), clamp((t - 1.3) / 0.4)];
  const caps = live
    ? [squared ? 'All squared. Every stack is level at $0.' : `${nP} of ${simple.length} paid · ${usd(simple.reduce((a, e, i) => a + (paid[i] ? 0 : e.amt), 0))} still to move`]
    : [`${raw.length} IOUs · ${usd(raw.reduce((a, e) => a + e.amt, 0))} moving`, `Balances: above the line is owed, below owes`, `${simple.length} payments · ${usd(simple.reduce((a, e) => a + e.amt, 0))} moving`];
  const steps = ['IOUs', 'Balances', 'Payments'], stepX = [16, 125, 236];
  const tr = live && !reduce ? 'transform .7s cubic-bezier(.2,.8,.2,1), opacity .4s' : live ? 'opacity .2s linear' : 'none';

  return (
    <svg viewBox={live ? `0 16 ${RS_W} ${RS_H - 16}` : `0 0 ${RS_W} ${RS_H}`} width="100%" className="p-ut-svg p-rs" role="img" aria-label={live ? `${caps[0]} ${simple.map((e, i) => `${nm(e.from)} to ${nm(e.to)} ${usd(e.amt)} ${paid[i] ? 'paid' : 'open'}`).join(', ')}.` : summary}>
      <defs>
        <filter id={`rsd${uid}`} x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#16161D" floodOpacity=".12" /></filter>
        <linearGradient id={`rsup${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="p-rs-up0" /><stop offset="1" className="p-rs-up1" /></linearGradient>
      </defs>

      {/* zero line */}
      <g opacity={live ? 1 : lineOp} aria-hidden>
        <line x1={8} x2={RS_W - 8} y1={ZERO} y2={ZERO} className={squared ? 'p-rs-zero is-level' : 'p-rs-zero'} />
        <text x={RS_W - 10} y={ZERO - 5} textAnchor="end" className="p-rs-tiny">$0</text>
      </g>

      {/* stacks: one bar per person, scaled from the zero line (transform only) */}
      {M.order.map(id => {
        const n = live ? cur[id] ?? 0 : net[id] ?? 0; const h = M.h(n); const up = n > 0; const zero = Math.abs(net[id] ?? 0) < 0.005;
        const k = live ? 1 : barK; const x = M.colX[id];
        return (
          <g key={id} opacity={!live && zero ? evenDim : 1}>
            <g style={{ transform: `translate(${x - BAR / 2}px, ${ZERO}px) scaleY(${(up ? -1 : 1) * Math.max(0.0001, (h / MAXH) * k)})`, transformOrigin: '0 0', transition: tr }}>
              <rect width={BAR} height={MAXH} rx={0} className={up ? 'p-rs-bar is-owed' : 'p-rs-bar is-owe'} fill={up ? `url(#rsup${uid})` : undefined} />
            </g>
            {/* chip seams on the stack, like torn strips piled up */}
            {!zero && h * k > 10 && <g opacity={k} style={{ transition: tr }} aria-hidden>
              {Array.from({ length: Math.floor((h * k) / 9) }, (_, j) => <line key={j} x1={x - BAR / 2 + 3} x2={x + BAR / 2 - 3} y1={ZERO + (up ? -1 : 1) * (j + 1) * 9} y2={ZERO + (up ? -1 : 1) * (j + 1) * 9} className="p-rs-seam" />)}
            </g>}
            {(zero || Math.abs(n) < 0.005) && <rect x={x - BAR / 2} y={ZERO - 1.5} width={BAR} height={3} rx={1.5} className="p-rs-even" opacity={live ? 1 : lineOp} />}
            <text x={x} y={NAME_Y} textAnchor="middle" className={people[id]?.you ? 'p-rs-name is-me' : 'p-rs-name'} opacity={live ? 1 : lineOp}>{nm(id)}</text>
            <text x={x} y={up ? ZERO - h - 7 : Math.abs(n) < 0.005 ? ZERO - 8 : ZERO + h + 16} textAnchor="middle" className={up ? 'p-rs-amt is-owed' : Math.abs(n) < 0.005 ? 'p-rs-amt is-zero' : 'p-rs-amt'}
              opacity={live ? 1 : clamp((t - 0.75) / 0.25)} style={{ transition: live ? 'opacity .3s' : 'none' }}>{Math.abs(n) < 0.005 ? (squared ? '$0' : 'even') : `${up ? '+' : '−'}${Math.round(Math.abs(n))}`}</text>
          </g>
        );
      })}

      {/* hops: the three payments, debtor stack to creditor stack */}
      {simple.map((e, i) => {
        const a = M.colX[e.from], b = M.colX[e.to]; if (a == null || b == null) return null;
        // Wider hops fly higher, so the amount pills stack at distinct heights and never touch (pill y = ZERO - 0.75 * lift).
        const rank = [...simple].map((x, j) => ({ j, span: Math.abs((M.colX[x.to] ?? 0) - (M.colX[x.from] ?? 0)) })).sort((u, v) => u.span - v.span).findIndex(o => o.j === i);
        const lift = [64, 88, 112, 132][Math.min(3, rank)]; const y0 = ZERO + 6, y1 = ZERO - 6, top = 0;
        const cy = ZERO - lift;
        const d = `M${a} ${y0} C${a} ${cy} ${b} ${cy} ${b} ${y1}`;
        const k = live ? 1 : hopK(i); const done = !!paid[i];
        const mx = (a + b) / 2, my = (y0 + 3 * cy + 3 * cy + y1) / 8;
        void top;
        return k > 0.001 && (
          <g key={`h${i}`} opacity={live ? (done ? 0.28 : 1) : k} style={{ transition: live ? 'opacity .5s' : 'none', transform: live || reduce ? undefined : `translateY(${(1 - k) * 8}px)` }}>
            <path d={d} className="p-rs-hop" />
            <path d={`M${b - 4} ${y1 - 7} L${b} ${y1 - 1} L${b + 4} ${y1 - 7}`} className="p-rs-hophead" />
            <g style={{ transform: `translate(${mx}px, ${my}px)` }}>
              <rect x={-25} y={-9} width={50} height={18} rx={9} className={done ? 'p-rs-pill is-done' : 'p-rs-pill'} filter={done ? undefined : `url(#rsd${uid})`} />
              <text y={4.5} textAnchor="middle" className={done ? 'p-rs-pilltx is-done' : 'p-rs-pilltx'}>{done ? 'Paid' : usd(e.amt)}</text>
            </g>
            {live && done && !reduce && <circle r={6} className="p-rs-chip p-rs-fly" style={{ offsetPath: `path("${d}")` } as React.CSSProperties} />}
          </g>
        );
      })}

      {/* the receipt: each IOU is a perforated strip that tears off and drops into the stacks */}
      {!live && paperOp > 0.001 && <g aria-hidden>
        <g opacity={paperOp}>
          <rect x={PAPER.x} y={PAPER.y} width={PAPER.w} height={PAPER.head} className="p-rs-paper" filter={`url(#rsd${uid})`} opacity={introK(0)} />
          <text x={PAPER.x + PAPER.w / 2} y={PAPER.y + 16} textAnchor="middle" className="p-rs-rhead" opacity={introK(0)}>LISBON CREW · IOUs</text>
        </g>
        {raw.map((e, i) => {
          const top = PAPER.y + PAPER.head + i * PAPER.row; const k = tearK(i); const ik = introK(i + 1);
          const last = i === raw.length - 1;
          // Path of the strip: peel (rotate around its left corner), lift, then shrink toward the payer stack.
          const tx = M.colX[e.from] ?? PAPER.x, peel = clamp(k / 0.3), fly = clamp((k - 0.25) / 0.75);
          const cx = PAPER.x + PAPER.w / 2, cyy = top + PAPER.row / 2;
          const dx = (tx - cx) * fly, dy = (ZERO + 14 - cyy) * fly - Math.sin(fly * Math.PI) * 26 - peel * 4;
          const rot = (i % 2 ? 1 : -1) * (peel * 4 + fly * 8), sc = 1 - fly * 0.82;
          const op = reduce ? paperOp : ik * (1 - clamp((fly - 0.75) / 0.25));
          return (
            <g key={i} opacity={op} style={{ transform: `translate(${dx}px, ${dy + (1 - ik) * -10}px) rotate(${rot}deg) scale(${sc})`, transformOrigin: `${cx}px ${cyy}px` }}>
              <path d={stripPath(i, top, PAPER.row, false, last)} className="p-rs-paper" filter={`url(#rsd${uid})`} />
              {k < 0.05 && i > 0 && <line x1={PAPER.x + 6} x2={PAPER.x + PAPER.w - 6} y1={top} y2={top} className="p-rs-perf" />}
              <text x={PAPER.x + 12} y={top + 14.5} className="p-rs-line">{nm(e.from)} → {nm(e.to)}</text>
              <text x={PAPER.x + PAPER.w - 12} y={top + 14.5} textAnchor="end" className="p-rs-line is-num">{e.amt.toFixed(2)}</text>
            </g>
          );
        })}
        <g opacity={paperOp * introK(raw.length + 1)}>
          <path d={`M${PAPER.x} ${PAPER.y + paperH - 24} L${PAPER.x + PAPER.w} ${PAPER.y + paperH - 24} L${PAPER.x + PAPER.w} ${PAPER.y + paperH - 4} L${tornEdge(PAPER.x, PAPER.x + PAPER.w, PAPER.y + paperH - 2, 9, 1).reverse().join(' L')} L${PAPER.x} ${PAPER.y + paperH - 2} Z`} className="p-rs-paper" style={{ transform: `translateY(${-(raw.length * PAPER.row) * 0}px)` }} />
          <text x={PAPER.x + 12} y={PAPER.y + paperH - 10} className="p-rs-line is-total">Total</text>
          <text x={PAPER.x + PAPER.w - 12} y={PAPER.y + paperH - 10} textAnchor="end" className="p-rs-line is-total">{raw.reduce((a, e) => a + e.amt, 0).toFixed(2)}</text>
        </g>
      </g>}

      {/* squared: a quiet level line and $0 */}
      {squared && <g className={reduce ? '' : 'p-rs-celebrate'}><text x={RS_W / 2} y={ZERO - 30} textAnchor="middle" className="p-rs-zero-big">$0 owed</text></g>}

      {/* stepper (same hit areas as the inline controls) and one-line caption */}
      {!live && <g className="p-ut-stepper">
        {steps.map((s, i) => <g key={s} className={phase === i ? 'is-on' : ''} transform={`translate(${stepX[i]} 18)`}>
          <circle cx={3} cy={0} r={2.5} className="p-ut-stepdot" /><text x={10} y={4} className="p-rs-step">{`${i + 1} ${s}`}</text></g>)}
      </g>}
      <g transform="translate(16 236)">
        {caps.map((c, i) => <text key={i} x={165} y={14} textAnchor="middle" className="p-rs-cap" opacity={live ? 1 : capOp[i]}>{c}</text>)}
      </g>
    </svg>
  );
}

function ReceiptSkin({ frame: f }: { frame: UntangleFrame }) {
  return <ReceiptStacksSvg t={f.t} intro={f.intro} reduce={f.reduce} uid={f.uid} ids={f.ids} people={f.people} net={f.net} maxNet={f.maxNet} raw={f.raw} simple={f.simple} summary={f.summary} phase={f.phase} minimal={f.minimal} />;
}
registerUntangleSkin('receipt', ReceiptSkin);

/** Settle path: the Solved stacks with each paid hop applied. Paid stacks shrink to the line; all paid lands every stack at $0. */
export function ReceiptStacksLive({ raw, simple, people, paid, me }: { raw: Edge[]; simple: Edge[]; people: Record<string, Person>; paid: boolean[]; me?: string }) {
  const reduce = useReducedMotion();
  const uid = useRef('rl' + Math.random().toString(36).slice(2, 7)).current;
  const ids = [...new Set(raw.flatMap(e => [e.from, e.to]))].filter(id => people[id]);
  const net: Record<string, number> = {}; raw.forEach(e => { net[e.from] = r2((net[e.from] ?? 0) - e.amt); net[e.to] = r2((net[e.to] ?? 0) + e.amt); });
  const maxNet = Math.max(64, ...ids.map(id => Math.abs(net[id] ?? 0)));
  const P2 = me ? Object.fromEntries(Object.entries(people).map(([k, v]) => [k, { ...v, you: k === me }])) as Record<string, Person> : people;
  // First paint shows the previous state, then the paid flags land so stacks travel instead of jumping.
  const [shown, setShown] = useState<boolean[]>(() => paid.map((x, i) => x && i !== paid.lastIndexOf(true)));
  useEffect(() => { const id = requestAnimationFrame(() => setShown(paid)); return () => cancelAnimationFrame(id); }, [paid.join()]);
  return <div className="p-ut is-skin-receipt is-live"><div className="p-ut-card">
    <ReceiptStacksSvg live t={2} intro={1} reduce={reduce} uid={uid} ids={ids} people={P2} net={net} maxNet={maxNet} raw={raw} simple={simple} summary="" phase={2} paid={shown} />
  </div></div>;
}
export { ReceiptSkin };
