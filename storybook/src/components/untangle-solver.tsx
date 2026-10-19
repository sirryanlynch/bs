import React, { useEffect, useMemo, useRef, useState } from 'react';
import { registerUntangleSkin, arrowPath, UntangleFrame } from './untangle';
import { AVATAR, CORE_NETTING_LIGHT, CORE_NETTING_DARK } from '../assets/solver-assets';

/**
 * DebtUntangle skin "solver": SPEC-settle-v3.md, "Debt Simplification v5.1 restraint pass" (Figma set 121:4174, card 362 x 268).
 * The mess in Tangled comes from composition alone: six graphite threads through the middle of the card with slightly uneven curves,
 * and a small hollow dot at each computed crossing. Netting shows the solver core with Iris spokes. Solved draws three Iris arcs with
 * their amounts and plays one glint. Iris is the only accent; rose and jade appear only in balance text.
 * Removed in v5.1: source chips, money tokens, gauge rings, HUD grid, on-thread tags in Tangled, knot glyphs, ribbon glow and sheen.
 * Reduce Motion: every state cross-fades over 200 ms (the model's timeline runs at 200 ms per step), no draw-on, a still core,
 * and the glint is a static star for 1.2 s that fades over 200 ms.
 */
type Pt = [number, number];
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x: number) => { x = clamp(x); return 1 - Math.pow(1 - x, 3); };
const sgn = (n: number) => (n > 0.004 ? '+' : n < -0.004 ? '−' : '');
const fmt = (n: number) => sgn(n) + Math.abs(n).toFixed(2);
const d2 = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const cub = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
};
function segX(a: Pt, b: Pt, c: Pt, d: Pt): Pt | null {
  const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]); if (Math.abs(den) < 1e-9) return null;
  const u = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / den, v = ((c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0])) / den;
  return u >= 0 && u <= 1 && v >= 0 && v <= 1 ? [a[0] + u * (b[0] - a[0]), a[1] + u * (b[1] - a[1])] : null;
}

type Rect = { x: number; y: number; w: number; h: number };
const hit = (a: Rect, b: Rect) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
/** Solved amount pills sit beside each arc's midpoint (never on the stroke), clear of medallions, labels, the glint and each other. */
function placePills(f: UntangleFrame) {
  const { graph: G, pos, ids, W, CX, CY } = f; const placed: Rect[] = []; const h = 14;
  const nodes: Rect[] = ids.map(id => ({ x: pos[id][0] - 21, y: pos[id][1] - 21, w: 42, h: 42 }));
  const labels: Rect[] = (G.lab1 as any[]).map(l => ({ x: l.x - 2, y: l.y - 2, w: l.w + 4, h: l.h + 4 }));
  const glint: Rect = { x: CX - 11, y: CY - 17, w: 22, h: 22 };
  const polys: Pt[][] = G.solvedG.map(({ g }: any) => g.poly);
  return G.solvedG.map(({ e, g }: any) => {
    const label = `$${e.amt.toFixed(2)}`; const w = label.length * 6 + 12; let best: Rect | null = null, bestS = Infinity;
    for (let ti = 0; ti <= 8; ti++) {
      const k = Math.round((0.38 + ti * 0.03) * (g.poly.length - 1)); const p = g.poly[k], q = g.poly[Math.min(g.poly.length - 1, k + 1)], o = g.poly[Math.max(0, k - 1)];
      const dx = q[0] - o[0], dy = q[1] - o[1], dl = Math.hypot(dx, dy) || 1; const nx = -dy / dl, ny = dx / dl;
      for (const side of [1, -1]) for (const off of [10, 12, 15, 18]) {
                const ext = Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2;
        const cx = p[0] + nx * side * (off + ext - 6), cy = p[1] + ny * side * (off + ext - 6);
        const r: Rect = { x: cx - w / 2, y: cy - h / 2, w, h };
        let sc = Math.abs(ti - 4) * 0.6 + off * 0.15;
        nodes.forEach(n => (sc += hit(r, n) * 50)); labels.forEach(l => (sc += hit(r, l) * 50)); placed.forEach(pp => (sc += hit(r, { x: pp.x - 3, y: pp.y - 3, w: pp.w + 6, h: pp.h + 6 }) * 50));
        sc += hit(r, glint) * 20;
        polys.forEach(pl => pl.forEach(pt => { if (pt[0] > r.x - 2 && pt[0] < r.x + w + 2 && pt[1] > r.y - 2 && pt[1] < r.y + h + 2) sc += 40; }));
        if (r.x < 6 || r.x + w > W - 6 || r.y < 28 || r.y + h > 202) sc += 1000;
        if (sc < bestS) { bestS = sc; best = r; }
      }
    }
    placed.push(best!); return { x: best!.x, y: best!.y, w, label };
  });
}
const SKEW = [6, -5, 4, -7, 5, -4];
const CORE = 40;

type Thread = { d: string; tip: Pt; dir: Pt; w: number; len: number; poly: Pt[] };
/** Tangled geometry per spec: cubic from 21 pt outside each node, control pulled toward the center (bend 0.45 preferred, searched 0.6 to −0.3),
 *  a small sideways skew per curve, and the path that passes closest to the center wins, so the density sits in the middle of the card. */
function buildThreads(f: UntangleFrame) {
  const { raw, pos, ids, CX, CY } = f; const C: Pt = [CX, CY];
  const threads: Thread[] = raw.map((e, i) => {
    const a = pos[e.from], b = pos[e.to]; const L = d2(a, b) || 1; const u: Pt = [(b[0] - a[0]) / L, (b[1] - a[1]) / L]; const n: Pt = [-u[1], u[0]];
    const s: Pt = [a[0] + u[0] * 21, a[1] + u[1] * 21], tip: Pt = [b[0] - u[0] * 21, b[1] - u[1] * 21];
    const others = ids.filter(x => x !== e.from && x !== e.to).map(x => pos[x]); const sk = SKEW[i % SKEW.length];
    const mk = (bend: number) => {
      const m: Pt = [(s[0] + tip[0]) / 2, (s[1] + tip[1]) / 2]; const c: Pt = [m[0] + (C[0] - m[0]) * bend, m[1] + (C[1] - m[1]) * bend];
      const c1: Pt = [s[0] + (c[0] - s[0]) * 0.667 + n[0] * sk, s[1] + (c[1] - s[1]) * 0.667 + n[1] * sk];
      const c2: Pt = [tip[0] + (c[0] - tip[0]) * 0.667 - n[0] * sk * 0.5, tip[1] + (c[1] - tip[1]) * 0.667 - n[1] * sk * 0.5];
      return [c1, c2] as [Pt, Pt];
    };
    let best: [Pt, Pt] | null = null, bestS = Infinity;
    for (let bend = 0.6; bend >= -0.301; bend -= 0.05) {
      const [c1, c2] = mk(bend); let ok = true, minC = Infinity;
      for (let k = 1; k < 40; k++) { const p = cub(s, c1, c2, tip, k / 40); if (others.some(o => d2(o, p) < 25)) { ok = false; break; } minC = Math.min(minC, d2(p, C)); }
      if (!ok) continue; const sc = minC + Math.abs(bend - 0.45) * 10; if (sc < bestS) { bestS = sc; best = [c1, c2]; }
    }
    const [c1, c2] = best ?? mk(0.1);
    const dv: Pt = [tip[0] - c2[0], tip[1] - c2[1]]; const dl = Math.hypot(dv[0], dv[1]) || 1; const dir: Pt = [dv[0] / dl, dv[1] / dl];
    const end: Pt = [tip[0] - dir[0] * 5, tip[1] - dir[1] * 5]; const c2e: Pt = [c2[0] - dir[0] * 5, c2[1] - dir[1] * 5];
    const poly: Pt[] = []; for (let k = 0; k <= 48; k++) poly.push(cub(s, c1, c2, tip, k / 48));
    let len = 0; for (let k = 1; k < poly.length; k++) len += d2(poly[k - 1], poly[k]);
    const f2 = (p: Pt) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`;
    return { d: `M${f2(s)} C${f2(c1)} ${f2(c2e)} ${f2(end)}`, tip, dir, w: e.amt >= 30 ? 2 : 1.25, len, poly };
  });
  const nodes = ids.map(id => pos[id]); const knots: Pt[] = [];
  for (let i = 0; i < threads.length; i++) for (let j = i + 1; j < threads.length; j++) {
    const A = threads[i].poly, B = threads[j].poly;
    for (let a = 1; a < A.length; a++) for (let b = 1; b < B.length; b++) { const x = segX(A[a - 1], A[a], B[b - 1], B[b]); if (x && !nodes.some(p => d2(p, x) < 24) && !knots.some(k => d2(k, x) < 4)) knots.push(x); }
  }
  return { threads, knots };
}
/** Spec arrowhead: 6 pt deep, half-width 3.2 on 2 pt threads and 2.6 on 1.25 pt threads. */
function head(tip: Pt, dir: Pt, w: number) {
  const hw = w >= 2 ? 3.2 : 2.6; const bx = tip[0] - dir[0] * 6, by = tip[1] - dir[1] * 6; const nx = -dir[1], ny = dir[0];
  return `M${tip[0].toFixed(2)} ${tip[1].toFixed(2)} L${(bx + nx * hw).toFixed(2)} ${(by + ny * hw).toFixed(2)} L${(bx - nx * hw).toFixed(2)} ${(by - ny * hw).toFixed(2)} Z`;
}

function SolverSkin({ frame: f }: { frame: UntangleFrame }) {
  const { t, intro, phase, reduce, playing, uid, W, H, CX, CY, ids, pos, people, net, raw, simple, graph: G, stats } = f;
  const T = useMemo(() => buildThreads(f), [raw, pos]);
  const pills = useMemo(() => placePills(f), [simple, pos]);
  // One glint per solve: it fires when a playing timeline crosses 1.83 (750 ms into Netting to Solved), never while scrubbing.
  const [glint, setGlint] = useState(0); const prevT = useRef(t);
  useEffect(() => { const th = reduce ? 1.99 : 1.83; if (playing && prevT.current < th && t >= th) setGlint(g => g + 1); if (t < 1.5) setGlint(0); prevT.current = t; }, [t, playing, reduce]);
  const [dark, setDark] = useState(false); const ref = useRef<SVGSVGElement>(null);
  useEffect(() => { const d = !!ref.current?.closest('.theme-dark'); if (d !== dark) setDark(d); });

  // Opacity of each state. Full motion follows the spec timeline in t units (600 ms per step); Reduce Motion cross-fades linearly.
  const tangOp = reduce ? 1 - clamp(t) : 1 - ease(t / 0.31);
  const coreOp = reduce ? clamp(t) * (1 - clamp(t - 1)) : ease((t - 0.19) / 0.3) * (1 - ease((t - 1) / 0.22));
  const coreS = reduce ? 1 : 0.9 + 0.1 * ease((t - 0.19) / 0.4);
  const spokeK = (i: number) => (reduce ? 1 : ease((t - 0.31 - i * 0.067) / 0.5));
  const sigmaOp = reduce ? coreOp : clamp((t - 0.81) / 0.15) * (1 - ease((t - 1) / 0.22));
  // 3 arcs from 1.2, staggered 0.1, 0.55 each, so the last lands at 1.95 and every tag is fully in by t = 2.
  const arcK = (i: number) => (reduce ? clamp(t - 1) : t >= 1.999 ? 1 : ease((t - 1.2 - i * 0.1) / 0.55));
  const tagK = (i: number) => (reduce ? clamp(t - 1) : t >= 1.999 ? 1 : clamp((t - 1.2 - i * 0.1 - 0.55) / 0.05));
  const solK = reduce ? clamp(t - 1) : ease((t - 1.2) / 0.6);
  const introK = (i: number) => (reduce ? 1 : ease((intro * 840 - i * 40) / 400));
  const knotK = reduce ? 1 : clamp((intro * 840 - 600) / 200);
  const netK = reduce ? 1 : ease((t - 0.31) / 0.6);
  const zeroDim = (id: string) => (Math.abs(net[id] ?? 0) < 0.005 ? 1 - 0.6 * solK : 1);
  const movers = ids.filter(id => Math.abs(net[id] ?? 0) > 0.004).sort((a, b) => Math.abs(net[b]) - Math.abs(net[a]));
  const coreY = CY - 4;
  const spoke = (id: string) => { const [x, y] = pos[id]; const dx = CX - x, dy = coreY - y; const L = Math.hypot(dx, dy) || 1; const ux = dx / L, uy = dy / L;
    return { x1: x + ux * 22, y1: y + uy * 22, x2: CX - ux * 20, y2: coreY - uy * 20, len: Math.max(1, L - 42) }; };

  const panels: [string, React.ReactNode][][] = [
    [['IOUS', <><tspan>{stats.ious}</tspan><tspan className="p-ut-sub" dx="6">{stats.people} people</tspan></>], ['CROSSINGS', <><tspan>{T.knots.length}</tspan><tspan className="p-ut-sub" dx="6">knots</tspan></>], ['FLOW', <tspan>${stats.flowRaw.toFixed(2)}</tspan>]],
    [['Σ NET', <><tspan>{Math.abs(stats.sigma).toFixed(2)}</tspan><tspan className="p-ut-ok" dx="5">{Math.abs(stats.sigma) < 0.005 ? '✓' : '!'}</tspan></>], ['OWED', <tspan className="p-ut-owed">+{stats.owed.toFixed(2)}</tspan>], ['OWE', <tspan className="p-ut-owe">−{stats.owed.toFixed(2)}</tspan>]],
    [['PAYMENTS', <><tspan>{simple.length}</tspan><tspan className="p-ut-sub" dx="6">was {raw.length}</tspan></>], ['FLOW', <tspan>${stats.flowSimple.toFixed(2)}</tspan>],
      ['SAVED', <><tspan className="p-ut-acc">{stats.saved}%</tspan><tspan className="p-ut-sub" dx="6">{raw.length - simple.length} fewer</tspan></>]],
  ];
  const panelW = [1 - clamp((t - 0.3) / 0.4), clamp((t - 0.3) / 0.4) * (1 - clamp((t - 1.3) / 0.4)), clamp((t - 1.3) / 0.4)];
  const stepNames = ['TANGLED', 'NETTING', 'SOLVED']; const stepX = [16, 125, 236];
  const lab0Op = 1 - clamp(t / 0.4), lab1Op = clamp(t / 0.4);

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} width="100%" className="p-ut-svg p-us" role="img" aria-label={f.summary}>
      <defs>
        <clipPath id={`card${uid}`}><rect width={W} height={H} rx={20} /></clipPath>
        <clipPath id={`cp${uid}`}><circle r={16} /></clipPath>
        <filter id={`b40${uid}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="20" /></filter>
        <filter id={`b16${uid}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
        <filter id={`b50${uid}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="25" /></filter>
        <filter id={`b5${uid}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.5" /></filter>
        <filter id={`md${uid}`} x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#141233" floodOpacity=".10" /></filter>
      </defs>

      {/* 1 light field */}
      <g clipPath={`url(#card${uid})`} className="p-us-field" aria-hidden>
        <ellipse cx={CX} cy={64} rx={110} ry={60} className="p-us-pearl" filter={`url(#b40${uid})`} />
        {coreOp > 0.01 && <circle cx={CX} cy={coreY} r={32} className="p-us-halo" opacity={coreOp} filter={`url(#b16${uid})`} />}
        {solK > 0.01 && <ellipse cx={CX} cy={CY} rx={120} ry={75} className="p-us-solglow" opacity={solK} filter={`url(#b50${uid})`} />}
      </g>

      {/* 2 threads: Tangled */}
      {tangOp > 0.01 && <g opacity={tangOp}>
        {T.threads.map((th, i) => { const k = introK(i); return (
          <g key={`t${i}`}>
            <path d={th.d} className="p-us-thread" strokeWidth={th.w} strokeDasharray={k < 1 ? `${th.len * k} ${th.len}` : undefined} />
            {k >= 0.98 && <path d={head(th.tip, th.dir, th.w)} className="p-us-head" />}
          </g>); })}
        {T.knots.map((k, i) => <circle key={`k${i}`} cx={k[0]} cy={k[1]} r={3} className="p-us-knot" opacity={knotK} />)}
      </g>}
      {/* 2 threads: Netting spokes */}
      {coreOp > 0.01 && <g opacity={coreOp}>{movers.map((id, i) => { const s = spoke(id); const k = spokeK(i); return k > 0.01 && (
        <line key={`sp${id}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} className="p-us-spoke" strokeDasharray={k < 1 ? `${s.len * k} ${s.len}` : undefined} />); })}</g>}
      {/* 2 threads: Solved arcs */}
      {G.solvedG.map(({ g }: any, i: number) => { const k = arcK(i); return k > 0.001 && (
        <g key={`s${i}`} opacity={reduce ? k : 1}>
          <path d={g.d} className="p-us-arc" strokeDasharray={!reduce && k < 1 ? `${g.len * k} ${g.len}` : undefined} />
          {(reduce || k >= 0.99) && <path d={arrowPath(g.tip, g.dir, 2.25)} className="p-us-arrow" />}
        </g>); })}

      {/* 3 core (Netting only) */}
      {coreOp > 0.01 && <g opacity={coreOp} transform={`translate(${CX} ${coreY}) scale(${coreS})`}>
        <image href={dark ? CORE_NETTING_DARK : CORE_NETTING_LIGHT} x={-CORE / 2} y={-CORE / 2} width={CORE} height={CORE} className={reduce ? '' : 'p-us-core'} />
      </g>}

      {/* 4 medallions */}
      {ids.map(id => { const [x, y] = pos[id]; return (
        <g key={id} transform={`translate(${x} ${y})`} opacity={zeroDim(id)}>
          <circle r={18} className="p-us-disc" filter={`url(#md${uid})`} />
          {AVATAR[id] ? <image href={AVATAR[id]} x={-16} y={-16} width={32} height={32} clipPath={`url(#cp${uid})`} preserveAspectRatio="xMidYMid slice" />
            : <text dy="4.3" textAnchor="middle" className="p-ut-mono">{people[id].initials}</text>}
          <circle r={17.5} className="p-us-ring" />
        </g>); })}

      {/* 5 labels, Σ pill, Solved tags */}
      {[[G.lab0, lab0Op], [G.lab1, lab1Op]].map(([L, op]: any, li) => op > 0.01 && (
        <g key={`L${li}`} opacity={op}>
          {L.map((l: any) => { const shown = l.net ? fmt((net[l.id] ?? 0) * netK) : ''; const cls = `p-ut-net is-${l.tone}`; return (
            <g key={l.id} opacity={zeroDim(l.id)}>
              <rect x={l.x} y={l.y} width={l.w} height={l.h} rx={4} className="p-us-plate" />
              {l.stacked ? <><text x={l.x + 4} y={l.y + 11} className="p-us-name">{l.name}</text><text x={l.x + 4} y={l.y + 23} className={cls}>{shown}</text></>
                : <text x={l.x + 4} y={l.y + 10.5} className="p-us-name">{l.name}{l.net && <tspan dx="6" className={cls}>{shown}</tspan>}</text>}
            </g>); })}
        </g>
      ))}
      {sigmaOp > 0.01 && <g opacity={sigmaOp}><rect x={CX - 26} y={CY + 20 - 1} width={52} height={15} rx={7.5} className="p-us-sigbg" /><text x={CX} y={CY + 30} textAnchor="middle" className="p-us-sigma">Σ {Math.abs(stats.sigma).toFixed(2)}</text></g>}
      {pills.map((tg, i) => tagK(i) > 0.01 && <g key={`tg${i}`} opacity={tagK(i)}><rect x={tg.x} y={tg.y} width={tg.w} height={14} rx={7} className="p-us-tag" /><text x={tg.x + tg.w / 2} y={tg.y + 10.3} textAnchor="middle" className="p-us-tagtx">{tg.label}</text></g>)}

      {/* the one glint, the only place the spectrum shows */}
      {glint > 0 && <g key={glint} transform={`translate(${CX} ${CY - 6})`} aria-hidden><g className={reduce ? 'p-us-glint is-static' : 'p-us-glint'}>
        <g filter={`url(#b5${uid})`} opacity=".85"><circle cx={-3} cy={-2} r={6} fill="#FFB8D9" /><circle cx={3} cy={-2} r={6} fill="#FFD6B0" /><circle cx={0} cy={3} r={6} fill="#B8E6FF" /></g>
        <path d="M0 -7 L1.96 -1.96 L7 0 L1.96 1.96 L0 7 L-1.96 1.96 L-7 0 L-1.96 -1.96 Z" className="p-us-star" />
      </g></g>}

      {/* 6 stepper and glass panel */}
      <g className="p-ut-stepper">
        {stepNames.map((s, i) => (
          <g key={s} className={phase === i ? 'is-on' : ''} transform={`translate(${stepX[i]} 18)`}>
            <circle cx={3} cy={0} r={2.5} className="p-ut-stepdot" />
            <text x={10} y={3.6} className="p-ut-steptx">{`0${i + 1} ${s}`}</text>
            {i < 2 && <line x1={stepX[i + 1] - stepX[i] - 20} x2={stepX[i + 1] - stepX[i] - 8} y1={0} y2={0} className="p-ut-hair" />}
          </g>
        ))}
      </g>
      <g transform="translate(16 206)">
        <rect width={330} height={50} rx={12} className="p-ut-panel p-us-panel" />
        <line x1={110} x2={110} y1={8} y2={42} className="p-ut-div" /><line x1={220} x2={220} y1={8} y2={42} className="p-ut-div" />
        {panels.map((cells, pi) => panelW[pi] > 0.01 && (
          <g key={pi} opacity={panelW[pi]}>
            {cells.map(([cap, val], ci) => <g key={ci} transform={`translate(${ci * 110 + 17} 0)`}><text y={20} className="p-ut-cap">{cap}</text><text y={38} className="p-ut-val">{val}</text></g>)}
          </g>
        ))}
      </g>
    </svg>
  );
}

registerUntangleSkin('solver', SolverSkin);
export { SolverSkin };
