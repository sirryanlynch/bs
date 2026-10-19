import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';
import { people as P, Person, eur } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';
import { rawDebts, simplifiedDebts } from './money';

type Edge = { from: string; to: string; amt: number };
const W = 362, H = 318, CX = 181, CY = 150, RAD = 104, NODE = 19;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (v: number) => { const x = clamp(v); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const r2 = (n: number) => Math.round(n * 100) / 100;
const money = (n: number) => (n > 0.004 ? '+' : n < -0.004 ? '−' : '') + Math.abs(n).toFixed(2);

const STEPS = ['Tangled', 'Netting balances', 'Matching debtors to creditors', 'Solved'];

/** Layout for the solved graph: each chain of payments becomes a row, people who net to zero sit on their own row. */
function solvedLayout(ids: string[], simple: Edge[], net: Record<string, number>) {
  const pos: Record<string, [number, number]> = {};
  const used = new Set<string>();
  const chains: string[][] = [];
  simple.forEach(e => {
    if (used.has(e.from) || used.has(e.to)) return;
    let start = e.from; const seen = new Set([start]);
    for (let g = 0; g < 9; g++) { const back = simple.find(x => x.to === start && !seen.has(x.from)); if (!back) break; start = back.from; seen.add(start); }
    const chain = [start]; let cur = start;
    for (let g = 0; g < 9; g++) { const nx = simple.find(x => x.from === cur && !chain.includes(x.to)); if (!nx) break; chain.push(nx.to); cur = nx.to; }
    chain.forEach(id => used.add(id)); chains.push(chain);
  });
  chains.sort((a, b) => b.length - a.length);
  const rowY = [58, 154];
  chains.forEach((c, r) => c.forEach((id, i) => { pos[id] = [c.length === 1 ? CX : lerp(54, 308, i / (c.length - 1)), rowY[r] ?? 154 + r * 80]; }));
  const zeros = ids.filter(id => !used.has(id));
  zeros.forEach((id, i) => { pos[id] = [zeros.length === 1 ? CX : lerp(126, 236, i / (zeros.length - 1)), 250]; });
  return pos;
}

/**
 * The settle-up visualization. Six IOUs start as crossing threads between seven people.
 * The solve nets everyone's balance, matches debtors to creditors and redraws the money as three straight payments.
 * Scrub it, replay it, or with Reduce Motion step through it.
 */
export function DebtUntangle({ raw = rawDebts, simple = simplifiedDebts, people = P, solved = false, onSolved, compact, startButton = true }:
  { raw?: Edge[]; simple?: Edge[]; people?: Record<string, Person>; solved?: boolean; onSolved?: () => void; compact?: boolean;
    /** Off when the screen already has its own primary CTA to start the solve; Replay still appears once solved. */ startButton?: boolean }) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(solved ? 3 : 0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0); const fired = useRef(solved);
  const ids = useMemo(() => {
    const s = new Set<string>(); raw.forEach(e => { s.add(e.from); s.add(e.to); }); return [...s].filter(id => people[id]);
  }, [raw, people]);
  const net = useMemo(() => { const n: Record<string, number> = {}; raw.forEach(e => { n[e.from] = r2((n[e.from] ?? 0) - e.amt); n[e.to] = r2((n[e.to] ?? 0) + e.amt); }); return n; }, [raw]);
  const netSimple = useMemo(() => { const n: Record<string, number> = {}; simple.forEach(e => { n[e.from] = r2((n[e.from] ?? 0) - e.amt); n[e.to] = r2((n[e.to] ?? 0) + e.amt); }); return n; }, [simple]);
  const netsHold = ids.every(id => Math.abs((net[id] ?? 0) - (netSimple[id] ?? 0)) < 0.01);
  const sum = (l: Edge[]) => r2(l.reduce((a, e) => a + e.amt, 0));
  // Tangled layout: interleave people around a circle so the IOUs cross in the middle.
  const tangled = useMemo(() => {
    const order = [...ids.filter((_, i) => i % 2 === 0), ...ids.filter((_, i) => i % 2 === 1)];
    const p: Record<string, [number, number]> = {};
    order.forEach((id, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / order.length; p[id] = [CX + Math.cos(a) * RAD * 1.38, CY + Math.sin(a) * RAD]; });
    return p;
  }, [ids.join()]);
  const solvedPos = useMemo(() => solvedLayout(ids, simple, net), [ids.join(), simple, net]);

  const play = (from = 0) => {
    cancelAnimationFrame(raf.current);
    if (reduce) { setT(3); finish(); return; }
    setPlaying(true);
    const start = performance.now(); const dur = 3600 * (3 - from) / 3;
    const tick = (now: number) => {
      const k = clamp((now - start) / dur);
      setT(from + (3 - from) * k);
      if (k < 1) raf.current = requestAnimationFrame(tick); else { setPlaying(false); finish(); }
    };
    raf.current = requestAnimationFrame(tick);
  };
  const finish = () => { if (!fired.current) { fired.current = true; onSolved?.(); } };
  useEffect(() => { if (solved && t < 3 && !playing) play(t); }, [solved]);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const phase = t >= 2.999 ? 3 : t < 0.02 ? 0 : Math.min(2, Math.floor(t) + (t >= 1 ? 0 : 1));
  const kNet = ease(t), kMove = ease(t - 1), kDraw = ease((t - 2.1) / 0.9), kFade = clamp((t - 1.9) * 1.1);
  const pos = (id: string): [number, number] => [lerp(tangled[id][0], solvedPos[id][0], kMove), lerp(tangled[id][1], solvedPos[id][1], kMove)];
  const isZero = (id: string) => Math.abs(net[id] ?? 0) < 0.005;

  const thread = (e: Edge, i: number) => {
    const [x1, y1] = pos(e.from), [x2, y2] = pos(e.to);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const off = [[-26, 18], [22, -20], [-14, -30], [30, 24], [8, 34], [-34, -6]][i % 6];
    const cx = lerp(CX + off[0], mx + off[0] * 0.35, kMove), cy = lerp(CY + off[1], my + off[1] * 0.35, kMove);
    const zeroLink = isZero(e.from) || isZero(e.to);
    const op = (1 - kFade) * (zeroLink ? lerp(1, 0.35, ease((t - 1) * 1.5)) : 1);
    const lx = 0.25 * x1 + 0.5 * cx + 0.25 * x2, ly = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
    return (
      <g key={`r${i}`} className="p-untangle-thread" style={{ opacity: op }}>
        <path d={`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`} />
        {op > 0.2 && <text x={lx} y={ly - 4} textAnchor="middle" className="p-untangle-iou">{e.amt.toFixed(2)}</text>}
      </g>
    );
  };
  const pay = (e: Edge) => {
    const [x1, y1] = solvedPos[e.from], [x2, y2] = solvedPos[e.to];
    const a = Math.atan2(y2 - y1, x2 - x1);
    const sx = x1 + Math.cos(a) * (NODE + 3), sy = y1 + Math.sin(a) * (NODE + 3), ex = x2 - Math.cos(a) * (NODE + 7), ey = y2 - Math.sin(a) * (NODE + 7);
    const len = Math.hypot(ex - sx, ey - sy);
    return (
      <g key={`s${e.from}${e.to}`} className="p-untangle-pay" style={{ opacity: kDraw > 0 ? 1 : 0 }}>
        <line x1={sx} y1={sy} x2={ex} y2={ey} strokeDasharray={len} strokeDashoffset={len * (1 - kDraw)} markerEnd={kDraw > .9 ? 'url(#untangle-arrow)' : undefined} />
        <g transform={`translate(${(sx + ex) / 2} ${(sy + ey) / 2})`} style={{ opacity: clamp((kDraw - .5) * 2) }}>
          <rect x={-31} y={-11} width={62} height={22} rx={11} /><text textAnchor="middle" dy="4">€{e.amt.toFixed(2)}</text>
        </g>
      </g>
    );
  };
  const count = t < 2.6 ? raw.length : simple.length;
  const steps = [
    { label: 'Net each balance', done: t >= 1 },
    { label: 'Match debtors to creditors', done: t >= 2 },
    { label: `Redraw as ${simple.length} payments`, done: t >= 2.999 },
  ];
  return (
    <div className={`p-untangle ${compact ? 'is-compact' : ''} ${t >= 2.999 ? 'is-solved' : ''}`}>
      <div className="p-untangle-head" aria-live="polite">
        <span className="p-untangle-step">{phase === 3 ? 'SOLVED' : phase === 0 ? 'TANGLED' : `STEP ${phase}/3`}</span>
        <span className="p-untangle-phase">{phase === 0 ? `${raw.length} IOUs across ${ids.length} people` : phase === 3 ? `${raw.length} IOUs → ${simple.length} payments` : `${STEPS[phase]}…`}</span>
        <span className="p-untangle-count tu-num" aria-label={`${count} transfers`}>{count}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
        aria-label={t >= 2.999 ? `Solved: ${simple.map(e => `${people[e.from].name} pays ${people[e.to].name} ${eur(e.amt)}`).join(', ')}` : `${raw.length} IOUs between ${ids.length} people, ${eur(sum(raw))} in total`}>
        <defs><marker id="untangle-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1.5 7 5 1 8.5" className="p-untangle-arrowhead" /></marker></defs>
        {raw.map(thread)}
        {simple.map(pay)}
        {ids.map(id => {
          const [x, y] = pos(id); const n = net[id] ?? 0; const z = isZero(id);
          const cls = z ? 'is-zero' : n > 0 ? 'is-cred' : 'is-debt';
          return (
            <g key={id} transform={`translate(${x} ${y})`} className={`p-untangle-node ${t >= 1 ? cls : ''}`} style={{ opacity: z ? lerp(1, .55, kMove) : 1 }}>
              <circle r={NODE} className={`p-untangle-dot p-avatar-t${people[id].tone}`} />
              <circle r={NODE + 3.5} className="p-untangle-ring" style={{ opacity: kNet }} />
              <text dy="5" textAnchor="middle" className="p-untangle-init">{people[id].initials}</text>
              <text y={NODE + 14} textAnchor="middle" className="p-untangle-name">{people[id].you ? 'You' : people[id].name}</text>
              <text y={NODE + 27} textAnchor="middle" className="p-untangle-net" style={{ opacity: kNet }}>{money(n * kNet)}</text>
            </g>
          );
        })}
      </svg>
      <div className="p-untangle-readout tu-num" aria-hidden={t < 2.999}>
        <div><span>transfers</span><b>{raw.length} → {t >= 2.999 ? simple.length : '?'}</b></div>
        <div><span>money moved</span><b>{sum(raw).toFixed(2)} → {t >= 2.999 ? sum(simple).toFixed(2) : '?'}</b></div>
        <div><span>every net</span><b className={t >= 2.999 && netsHold ? 'is-ok' : ''}>{t >= 2.999 ? (netsHold ? 'unchanged' : 'changed') : 'checking'}</b></div>
      </div>
      {!compact && <ol className="p-untangle-steps">{steps.map((s, i) => <li key={i} className={s.done ? 'is-done' : ''}><span aria-hidden>{s.done ? <Icon name="check" size={12} /> : i + 1}</span>{s.label}</li>)}</ol>}
      <div className="p-untangle-ctrl">
        {(startButton || t >= 2.999) && <button type="button" className="p-untangle-btn" onClick={() => play(t >= 2.999 ? 0 : t)} disabled={playing} aria-label={t >= 2.999 ? 'Replay the untangle' : 'Untangle'}>
          <Icon name={t >= 2.999 ? 'replay' : 'play'} size={16} fill={t < 2.999} />{t >= 2.999 ? 'Replay' : 'Untangle'}
        </button>}
        <input type="range" min={0} max={300} step={reduce ? 100 : 1} value={Math.round(t * 100)} aria-label="Scrub the solve"
          aria-valuetext={phase === 3 ? 'Solved' : STEPS[phase]}
          onChange={e => { cancelAnimationFrame(raf.current); setPlaying(false); const v = +e.target.value / 100; setT(v); if (v >= 2.999) finish(); }} />
      </div>
    </div>
  );
}
