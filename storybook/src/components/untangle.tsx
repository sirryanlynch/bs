import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Icon } from './Icon';
import { people as P, Person } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';
import { rawDebts, simplifiedDebts } from './money';

/**
 * DebtUntangle v4 "Instrument" (Figma set 121:4174, card 362 x 268).
 * Graphite threads for the mess, Iris reserved for the answer: in Solved the three payment arcs are the only purple lines.
 * The value t runs 0 (Tangled) to 1 (Netting) to 2 (Solved). Each step is 600 ms; Reduce Motion cross-fades at 200 ms.
 */
type Edge = { from: string; to: string; amt: number };
type Pt = [number, number];
export const UNTANGLE_W = 362, UNTANGLE_H = 268;
const W = UNTANGLE_W, H = UNTANGLE_H, CX = 181, CY = 112;
/** Node centers from the Figma card. Anyone else is placed on the orbit. */
export const NODE_POS: Record<string, Pt> = { ari: [181, 58], sofia: [278, 80], nic: [306, 126], mara: [236, 166], tomas: [126, 166], joao: [56, 126], ren: [84, 80] };
const BENDS: Record<string, number> = {
  'ari>tomas': 0.12, 'ren>ari': 0.25, 'mara>joao': 0.15, 'mara>sofia': 0.10, 'sofia>joao': 0.10, 'tomas>nic': 0.28,
};
const BENDS_SOLVED: Record<string, number> = { 'ari>nic': 0.42, 'ren>ari': 0.85, 'mara>joao': 0.40 };
const STEP_MS = 600, HOLD_MS = 900, RM_MS = 200;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const r2 = (n: number) => Math.round(n * 100) / 100;
/** cubic-bezier(0.2, 0, 0, 1), the Prism standard curve */
function easeStd(x: number) {
  x = clamp(x); const p1x = 0.2, p1y = 0, p2x = 0, p2y = 1;
  const bx = (t: number) => 3 * (1 - t) * (1 - t) * t * p1x + 3 * (1 - t) * t * t * p2x + t * t * t;
  const by = (t: number) => 3 * (1 - t) * (1 - t) * t * p1y + 3 * (1 - t) * t * t * p2y + t * t * t;
  let lo = 0, hi = 1; for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (bx(m) < x) lo = m; else hi = m; }
  return by((lo + hi) / 2);
}
const sgn = (n: number) => (n > 0.004 ? '+' : n < -0.004 ? '−' : '');
const fmt = (n: number) => sgn(n) + Math.abs(n).toFixed(2);
const vib = (p: number | number[]) => { try { (navigator as any).vibrate?.(p); } catch { /* no haptics */ } };

/* ---------- geometry ---------- */
const qAt = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
const qD = (p0: Pt, p1: Pt, p2: Pt, t: number): Pt => [2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])];
/** Exact quadratic between parameters a and b (blossoming). */
function subQ(p0: Pt, p1: Pt, p2: Pt, a: number, b: number): [Pt, Pt, Pt] {
  const s = qAt(p0, p1, p2, a), e = qAt(p0, p1, p2, b);
  const blossom = (u: number, v: number): Pt => [(1 - u) * (1 - v) * p0[0] + ((1 - u) * v + u * (1 - v)) * p1[0] + u * v * p2[0], (1 - u) * (1 - v) * p0[1] + ((1 - u) * v + u * (1 - v)) * p1[1] + u * v * p2[1]];
  return [s, blossom(a, b), e];
}
const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
/** Parameter where the curve is d away from an endpoint center. */
function tAtDist(p0: Pt, p1: Pt, p2: Pt, d: number, fromEnd: boolean) {
  const c = fromEnd ? p2 : p0; let lo = 0, hi = 0.5;
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; const pt = qAt(p0, p1, p2, fromEnd ? 1 - m : m); if (dist(pt, c) < d) lo = m; else hi = m; }
  return fromEnd ? 1 - (lo + hi) / 2 : (lo + hi) / 2;
}
/** Param that moves an arc length back from t (small steps). */
function backBy(p0: Pt, p1: Pt, p2: Pt, t: number, len: number) {
  let acc = 0, u = t, prev = qAt(p0, p1, p2, t);
  while (acc < len && u > 0) { u -= 0.002; const p = qAt(p0, p1, p2, u); acc += dist(p, prev); prev = p; }
  return u;
}
type Geo = { d: string; c: [Pt, Pt, Pt]; s: Pt; e: Pt; tip: Pt; dir: Pt; poly: Pt[]; len: number; w: number; bend: number };
function control(a: Pt, b: Pt, bend: number): Pt { const m: Pt = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; return [m[0] + (CX - m[0]) * bend, m[1] + (CY - m[1]) * bend]; }
function clears(a: Pt, b: Pt, bend: number, others: Pt[]) {
  const c = control(a, b, bend);
  for (let i = 1; i < 40; i++) { const p = qAt(a, c, b, i / 40); if (others.some(o => dist(o, p) < 27)) return false; }
  return true;
}
function geo(a: Pt, b: Pt, bend: number, w: number, arrow: boolean): Geo {
  const p1 = control(a, b, bend);
  const ta = tAtDist(a, p1, b, 24, false), tb = tAtDist(a, p1, b, 23, true);
  const tip = qAt(a, p1, b, tb);
  const tEnd = arrow ? backBy(a, p1, b, tb, 5.5) : tb;
  const c = subQ(a, p1, b, ta, tEnd);
  const dv = qD(a, p1, b, tb); const dl = Math.hypot(dv[0], dv[1]) || 1;
  const poly: Pt[] = []; for (let i = 0; i <= 48; i++) poly.push(qAt(a, p1, b, ta + (tb - ta) * (i / 48)));
  let len = 0; for (let i = 1; i < poly.length; i++) len += dist(poly[i - 1], poly[i]);
  return { d: `M${c[0][0].toFixed(2)} ${c[0][1].toFixed(2)} Q${c[1][0].toFixed(2)} ${c[1][1].toFixed(2)} ${c[2][0].toFixed(2)} ${c[2][1].toFixed(2)}`, c, s: c[0], e: c[2], tip, dir: [dv[0] / dl, dv[1] / dl], poly, len, w, bend };
}
export function arrowPath(tip: Pt, dir: Pt, w: number) {
  const hw = Math.max(3, 1.35 * w); const bx = tip[0] - dir[0] * 7, by = tip[1] - dir[1] * 7; const nx = -dir[1], ny = dir[0];
  return `M${tip[0].toFixed(2)} ${tip[1].toFixed(2)} L${(bx + nx * hw).toFixed(2)} ${(by + ny * hw).toFixed(2)} L${(bx - nx * hw).toFixed(2)} ${(by - ny * hw).toFixed(2)} Z`;
}
function segX(a: Pt, b: Pt, c: Pt, d: Pt): Pt | null {
  const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]); if (Math.abs(den) < 1e-9) return null;
  const u = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / den, v = ((c[0] - a[0]) * (b[1] - a[1]) - (c[1] - a[1]) * (b[0] - a[0])) / den;
  return u >= 0 && u <= 1 && v >= 0 && v <= 1 ? [a[0] + u * (b[0] - a[0]), a[1] + u * (b[1] - a[1])] : null;
}
type Rect = { x: number; y: number; w: number; h: number };
const overlap = (a: Rect, b: Rect) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
const tagW = (s: string) => s.length * 6 + 10;

/* ---------- labels ---------- */
type Label = { id: string; x: number; y: number; w: number; h: number; stacked: boolean; name: string; net?: string; tone: 'owe' | 'owed' | 'zero' };
function labelsFor(ids: string[], pos: Record<string, Pt>, people: Record<string, Person>, net: Record<string, number>, withNet: boolean): Label[] {
  return ids.map(id => {
    const [x, y] = pos[id]; const name = people[id].you ? 'You' : people[id].name; const n = net[id] ?? 0;
    const netS = withNet ? fmt(n) : undefined; const tone = Math.abs(n) < 0.005 ? 'zero' : n > 0 ? 'owed' : 'owe';
    if (id === 'ari' || people[id].you && pos[id] === NODE_POS.ari) {
      const stacked = withNet; const w = Math.max(name.length, stacked ? (netS?.length ?? 0) : 0) * 6 + 8;
      const h = stacked ? 26 : 14;
      return { id, x: x + 25, y: y - h / 2, w, h, stacked, name, net: netS, tone };
    }
    const w = (name.length + (netS ? netS.length + 1 : 0)) * 6 + 8 - (netS ? 2 : 0); const h = 14;
    let lx = x - w / 2; const ly = y < CY - 20 ? y - 20 - 3 - h : y + 20 + 3;
    if (id === 'sofia' && withNet) lx = clamp(lx, 256, 354 - w);
    lx = clamp(lx, 4, W - 4 - w);
    return { id, x: lx, y: ly, w, h, stacked: false, name, net: netS, tone };
  });
}

/* ---------- tag placement ---------- */
function placeTags(edges: { g: Geo; label: string }[], nodes: Pt[], labels: Label[], allPolys: Pt[][]) {
  const placed: Rect[] = []; const out: { x: number; y: number; w: number; label: string }[] = [];
  edges.forEach(({ g, label }, ei) => {
    const w = tagW(label), h = 14; let best: Rect | null = null, bestScore = Infinity;
    for (let ti = 0; ti <= 14; ti++) {
      const t = 0.22 + (0.56 * ti) / 14; const [px, py] = qAt(g.c[0], g.c[1], g.c[2], t); const dv = qD(g.c[0], g.c[1], g.c[2], t); const dl = Math.hypot(dv[0], dv[1]) || 1; const nx = -dv[1] / dl, ny = dv[0] / dl;
      for (const off of [0, 6, -6, 11, -11, 14, -14]) {
        const r: Rect = { x: px + nx * off - w / 2, y: py + ny * off - h / 2, w, h };
        let s = Math.abs(t - 0.5) * 2 + Math.abs(off) * 0.08;
        nodes.forEach(n => { const o = overlap(r, { x: n[0] - 21, y: n[1] - 21, w: 42, h: 42 }); s += o * 4; });
        labels.forEach(l => (s += overlap(r, { x: l.x - 1, y: l.y - 1, w: l.w + 2, h: l.h + 2 }) * 4));
        placed.forEach(p => (s += overlap(r, { x: p.x - 2, y: p.y - 2, w: p.w + 4, h: p.h + 4 }) * 6));
        allPolys.forEach((pl, pi) => { if (pi === ei) return; pl.forEach(p => { if (p[0] > r.x - 1 && p[0] < r.x + w + 1 && p[1] > r.y - 1 && p[1] < r.y + h + 1) s += 6; }); });
        if (r.x < 6 || r.x + w > W - 6 || r.y < 28 || r.y + h > 202) s += 400;
        if (s < bestScore) { bestScore = s; best = r; }
      }
    }
    placed.push(best!); out.push({ x: best!.x, y: best!.y, w, label });
  });
  return out;
}

export type UntanglePhase = 0 | 1 | 2;

/**
 * The visual layer is swappable. DebtUntangle owns the model (positions, nets, threads, knots, tags), the timeline (t from 0 to 2),
 * the controls, the nets-unchanged check and the screen-reader summary. A skin only draws one frame from that data.
 * 'instrument' (v4) is built in; 'solver' (v5.1 restraint pass) lives in untangle-solver.tsx and registers itself on import.
 */
export type UntangleFrame = {
  /** v5.3: numbers only in the metric panel (steps mode). */ minimal?: boolean;
  t: number; intro: number; phase: UntanglePhase; reduce: boolean; playing: boolean; uid: string; W: number; H: number; CX: number; CY: number;
  ids: string[]; pos: Record<string, Pt>; people: Record<string, Person>; net: Record<string, number>; maxNet: number;
  raw: Edge[]; simple: Edge[]; graph: { tangled: { e: Edge; g: any }[]; solvedG: { e: Edge; g: any }[]; knots: Pt[]; lab0: any; lab1: any; tags0: any; tags2: any };
  stats: { ious: number; people: number; crossings: number; flowRaw: number; flowSimple: number; sigma: number; owed: number; saved: number; netsHold: boolean };
  summary: string;
};
export const UNTANGLE_SKINS: Record<string, React.ComponentType<{ frame: UntangleFrame }>> = {};
export function registerUntangleSkin(name: string, C: React.ComponentType<{ frame: UntangleFrame }>) { UNTANGLE_SKINS[name] = C; }

export function DebtUntangle({ raw = rawDebts, simple = simplifiedDebts, people = P, solved = false, onSolved, onPhase, controls = 'full', startButton = true, compact, skin = 'solver' }:
  { raw?: Edge[]; simple?: Edge[]; people?: Record<string, Person>; solved?: boolean; onSolved?: () => void; onPhase?: (p: UntanglePhase) => void;
    /** Visual layer: 'solver' (v5.1, default once untangle-solver is imported) or 'instrument' (legacy v4, built in). Unknown names fall back to instrument. */ skin?: string;
    /** full: Untangle or Replay button, scrubber and the nets check under the card. inline: a replay control and scrubbable stepper inside the card. none: static. */
    /** steps (v5.3): Tangled by default, Next walks Tangled → Netting → Solved, then a quiet Start over. */
    controls?: 'full' | 'inline' | 'none' | 'steps' | boolean;
    /** Off when the screen already has its own primary CTA; Replay still appears once solved. */ startButton?: boolean; compact?: boolean }) {
  void compact;
  const ctl = controls === true ? 'full' : controls === false ? 'none' : controls;
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const [t, setT] = useState(solved ? 2 : 0);
  const [intro, setIntro] = useState(solved || reduce ? 1 : 0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0); const timers = useRef<number[]>([]); const fired = useRef(solved); const tRef = useRef(t); tRef.current = t;
  const ids = useMemo(() => { const s = new Set<string>(); raw.forEach(e => { s.add(e.from); s.add(e.to); }); return [...s].filter(id => people[id]); }, [raw, people]);
  const pos = useMemo(() => {
    const p: Record<string, Pt> = {}; const extra = ids.filter(id => !NODE_POS[id]);
    ids.forEach(id => { if (NODE_POS[id]) p[id] = NODE_POS[id]; });
    extra.forEach((id, i) => { const a = Math.PI / 2 + ((i + 0.5) * 2 * Math.PI) / Math.max(1, extra.length); p[id] = [CX + Math.cos(a) * 125, CY + Math.sin(a) * 54]; });
    return p;
  }, [ids.join()]);
  const netOf = (l: Edge[]) => { const n: Record<string, number> = {}; l.forEach(e => { n[e.from] = r2((n[e.from] ?? 0) - e.amt); n[e.to] = r2((n[e.to] ?? 0) + e.amt); }); return n; };
  const net = useMemo(() => netOf(raw), [raw]);
  const netSimple = useMemo(() => netOf(simple), [simple]);
  const netsHold = ids.every(id => Math.abs((net[id] ?? 0) - (netSimple[id] ?? 0)) < 0.005);
  const sum = (l: Edge[]) => r2(l.reduce((a, e) => a + e.amt, 0));
  const sigma = r2(ids.reduce((a, id) => a + (net[id] ?? 0), 0));
  const owed = r2(ids.reduce((a, id) => a + Math.max(0, net[id] ?? 0), 0));
  const maxNet = Math.max(64, ...ids.map(id => Math.abs(net[id] ?? 0)));

  const G = useMemo(() => {
    const nodes = ids.map(id => pos[id]);
    const mk = (l: Edge[], table: Record<string, number>, weight: (a: number) => number) => l.map(e => {
      const a = pos[e.from], b = pos[e.to]; const others = ids.filter(x => x !== e.from && x !== e.to).map(x => pos[x]);
      let bend = table[`${e.from}>${e.to}`];
      if (bend == null) { bend = 0.06; outer: for (const sign of [1, -1]) for (let m = 0.46; m >= 0.06; m -= 0.04) if (clears(a, b, sign * m, others)) { bend = sign * m; break outer; } }
      return { e, g: geo(a, b, bend, weight(e.amt), true) };
    });
    const tangled = mk(raw, BENDS, a => 1 + (1.5 * Math.min(a, 42.1)) / 42.1);
    const solvedG = mk(simple, BENDS_SOLVED, a => (a >= 40 ? 3 : 2.25));
    const knots: Pt[] = [];
    for (let i = 0; i < tangled.length; i++) for (let j = i + 1; j < tangled.length; j++) {
      const A = tangled[i].g.poly, B = tangled[j].g.poly;
      for (let a = 1; a < A.length; a++) for (let b = 1; b < B.length; b++) {
        const x = segX(A[a - 1], A[a], B[b - 1], B[b]);
        if (x && !nodes.some(n => dist(n, x) < 26) && !knots.some(k => dist(k, x) < 4)) knots.push(x);
      }
    }
    const lab0 = labelsFor(ids, pos, people, net, false), lab1 = labelsFor(ids, pos, people, net, true);
    const tags0 = placeTags(tangled.map(x => ({ g: x.g, label: x.e.amt.toFixed(2) })), nodes, lab0, tangled.map(x => x.g.poly));
    const tags2 = placeTags(solvedG.map(x => ({ g: x.g, label: `$${x.e.amt.toFixed(2)}` })), nodes, lab1, solvedG.map(x => x.g.poly));
    return { tangled, solvedG, knots, lab0, lab1, tags0, tags2 };
  }, [raw, simple, pos, people, net]);

  const phase: UntanglePhase = t < 0.5 ? 0 : t < 1.5 ? 1 : 2;
  const lastPhase = useRef(phase);
  useEffect(() => { if (phase !== lastPhase.current) { lastPhase.current = phase; onPhase?.(phase); } }, [phase]);
  useEffect(() => { onPhase?.(phase); }, []);

  const stop = () => { cancelAnimationFrame(raf.current); timers.current.forEach(clearTimeout); timers.current = []; setPlaying(false); };
  const finish = () => { if (!fired.current) { fired.current = true; onSolved?.(); } };
  /** Linear time tween of t, with haptics as payment arcs land. */
  const tween = (from: number, to: number, ms: number, done?: () => void) => {
    const start = performance.now(); let landed = 0;
    const tick = (now: number) => {
      const k = clamp((now - start) / ms); const v = from + (to - from) * k; setT(v);
      if (to === 2 && !reduce) { const n = [0, 1, 2].filter(i => v >= 1.25 + i * 0.133 + 0.45).length; if (n > landed) { landed = n; vib(8); } }
      if (k < 1) raf.current = requestAnimationFrame(tick); else done?.();
    };
    raf.current = requestAnimationFrame(tick);
  };
  const runIntro = (done?: () => void) => {
    if (reduce) { setIntro(1); done?.(); return; }
    const start = performance.now(); const ms = 400 + 5 * 40 + 240;
    const tick = (now: number) => { const k = clamp((now - start) / ms); setIntro(k); if (k < 1) raf.current = requestAnimationFrame(tick); else done?.(); };
    raf.current = requestAnimationFrame(tick);
  };
  const toSolved = (from: number) => {
    const step = reduce ? RM_MS : STEP_MS; setPlaying(true);
    const second = (f: number) => tween(f, 2, step * (2 - f), () => { setPlaying(false); vib([12, 40, 18]); finish(); });
    if (from < 1) tween(from, 1, step * (1 - from), () => { timers.current.push(window.setTimeout(() => second(1), reduce ? 500 : HOLD_MS)); });
    else second(from);
  };
  const play = () => {
    stop();
    if (tRef.current >= 1.999) { setT(0); setIntro(reduce ? 1 : 0); setPlaying(true); runIntro(() => timers.current.push(window.setTimeout(() => toSolved(0), 450))); }
    else toSolved(tRef.current);
  };
  const goTo = (target: number) => { stop(); const from = tRef.current; if (Math.abs(target - from) < 0.001) return; setPlaying(true); tween(from, target, (reduce ? RM_MS : STEP_MS) * Math.abs(target - from), () => { setPlaying(false); if (target >= 2) finish(); }); };
  useEffect(() => { if (!solved && tRef.current < 0.001 && intro < 1) runIntro(); return () => stop(); }, []);
  useEffect(() => { if (solved && tRef.current < 1.999 && !playing) toSolved(tRef.current); }, [solved]);

  /* ---------- per-frame values ---------- */
  const a01 = clamp(t / 0.333);            // solid to dashed
  const b12 = clamp((t - 1) / 0.333);      // dashed out
  const sweep = reduce ? (t >= 0.001 ? 1 : 0) : easeStd(clamp(t));
  const netShown = reduce ? 1 : sweep;
  const ringOp = reduce ? clamp(t / 1) : 1;
  const zeroK = clamp(t - 1);
  const drawK = (i: number) => (reduce ? 1 : easeStd(clamp((t - (1.25 + i * 0.133)) / 0.45)));
  const arcOp = (i: number) => (reduce ? clamp(t - 1) : t > 1.25 + i * 0.133 ? 1 : 0);
  const landK = (i: number) => (reduce ? clamp(t - 1) : clamp((t - (1.25 + i * 0.133 + 0.45)) / 0.08));
  const introK = (i: number) => (reduce ? 1 : easeStd(clamp((intro * 840 - i * 40) / 400)));
  const knotK = reduce ? 1 : clamp((intro * 840 - 600) / 240);
  const panelW = [1 - clamp((t - 0.3) / 0.4), clamp((t - 0.3) / 0.4) * (1 - clamp((t - 1.3) / 0.4)), clamp((t - 1.3) / 0.4)];
  const lab0Op = 1 - clamp(t / 0.4), lab1Op = clamp(t / 0.4);

  // v5.3: steps mode (deck slide 9 mirror) keeps metric labels minimal, numbers only.
  const panels: [string, React.ReactNode][][] = [
    [['IOUS', <><tspan>{raw.length}</tspan>{ctl !== 'steps' && <tspan className="p-ut-sub" dx="6">{ids.length} people</tspan>}</>], ['CROSSINGS', <tspan>{G.knots.length}</tspan>], ['FLOW', <tspan>${sum(raw).toFixed(2)}</tspan>]],
    [['Σ NET', <><tspan>{Math.abs(sigma).toFixed(2)}</tspan><tspan className="p-ut-ok" dx="5">{Math.abs(sigma) < 0.005 ? '✓' : '!'}</tspan></>], ['OWED', <tspan className="p-ut-owed">+{owed.toFixed(2)}</tspan>], ['OWE', <tspan className="p-ut-owe">−{owed.toFixed(2)}</tspan>]],
    [['PAYMENTS', <><tspan>{simple.length}</tspan>{ctl !== 'steps' && <tspan className="p-ut-sub" dx="6">was {raw.length}</tspan>}</>], ['FLOW', <tspan>${sum(simple).toFixed(2)}</tspan>],
      ['SAVED', <><tspan className="p-ut-acc">{Math.round((1 - simple.length / Math.max(1, raw.length)) * 100)}%</tspan>{ctl !== 'steps' && <tspan className="p-ut-sub" dx="6">{raw.length - simple.length} fewer</tspan>}</>]],
  ];
  const stepNames = ['TANGLED', 'NETTING', 'SOLVED'];
  const stepX = [16, 125, 236];
  const summary = phase === 2 ? `Solved: ${simple.map(e => `${people[e.from].name} pays ${people[e.to].name} $${e.amt.toFixed(2)}`).join(', ')}. ${simple.length} payments instead of ${raw.length}, $${sum(simple).toFixed(2)} moves instead of $${sum(raw).toFixed(2)}. Every net balance ${netsHold ? 'is unchanged' : 'changed'}.`
    : phase === 1 ? `Netting: ${ids.map(id => `${people[id].name} ${fmt(net[id] ?? 0)}`).join(', ')}. The nets sum to ${Math.abs(sigma).toFixed(2)}.`
    : `Tangled: ${raw.length} IOUs between ${ids.length} people, $${sum(raw).toFixed(2)} in total, ${G.knots.length} crossings.`;

  // Dot grid with a radial falloff.
  const dots = useMemo(() => { const o: { x: number; y: number; k: number }[] = []; for (let x = 13; x <= 349; x += 12) for (let y = 34; y <= 194; y += 12) { const d = Math.hypot((x - CX) / 170, (y - CY) / 82); if (d < 1) o.push({ x, y, k: d }); } return o; }, []);
  const arcPath = (n: number, frac: number) => {
    const r = 19; const ang = (Math.abs(n) / maxNet) * 2 * Math.PI * frac; if (ang < 0.01) return '';
    const dir = n > 0 ? 1 : -1; const sw = dir > 0 ? 1 : 0;
    // A full turn cannot be one SVG arc (start equals end), so draw it as two halves.
    if (ang > 2 * Math.PI - 0.01) return `M0 ${-r} A${r} ${r} 0 1 ${sw} 0 ${r} A${r} ${r} 0 1 ${sw} 0 ${-r}`;
    const ex = Math.sin(ang) * r * dir, ey = -Math.cos(ang) * r;
    return `M0 ${-r} A${r} ${r} 0 ${ang > Math.PI ? 1 : 0} ${sw} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
  };

  const Skin = skin !== 'instrument' ? UNTANGLE_SKINS[skin] : undefined;
  const frame: UntangleFrame | null = Skin ? { minimal: ctl === 'steps', t, intro, phase, reduce, playing, uid, W, H, CX, CY, ids, pos, people, net, maxNet, raw, simple, graph: G,
    stats: { ious: raw.length, people: ids.length, crossings: G.knots.length, flowRaw: sum(raw), flowSimple: sum(simple), sigma, owed, saved: Math.round((1 - simple.length / Math.max(1, raw.length)) * 100), netsHold }, summary } : null;
  return (
    <div className={`p-ut ${ctl === 'full' ? 'has-ctl' : ''} is-skin-${Skin ? skin : 'instrument'}`}>
      <div className="p-ut-card">
        {Skin && frame ? <Skin frame={frame} /> : <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="p-ut-svg" role="img" aria-label={summary}>
          <defs>
            <radialGradient id={`dg${uid}`} cx="50%" cy="50%" r="50%"><stop offset="0" className="p-ut-dg0" /><stop offset="0.6" className="p-ut-dg1" /><stop offset="1" className="p-ut-dg2" /></radialGradient>
            <filter id={`gl${uid}`} x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="2" /></filter>
            {G.tangled.map(({ g }, i) => <linearGradient key={i} id={`tg${uid}${i}`} gradientUnits="userSpaceOnUse" x1={g.s[0]} y1={g.s[1]} x2={g.tip[0]} y2={g.tip[1]}><stop offset="0" className="p-ut-t0" /><stop offset="0.22" className="p-ut-t1" /><stop offset="1" className="p-ut-t2" /></linearGradient>)}
            {G.solvedG.map(({ g }, i) => <linearGradient key={i} id={`sg${uid}${i}`} gradientUnits="userSpaceOnUse" x1={g.s[0]} y1={g.s[1]} x2={g.tip[0]} y2={g.tip[1]}><stop offset="0" className="p-ut-s0" /><stop offset="0.35" className="p-ut-s1" /><stop offset="1" className="p-ut-s1" /></linearGradient>)}
          </defs>
          {/* technical layer */}
          <g aria-hidden>
            {dots.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={0.625} className={p.k < 0.6 ? 'p-ut-dot is-strong' : 'p-ut-dot'} style={{ opacity: p.k < 0.6 ? 1 - p.k * 0.6 : (1 - p.k) * 1.6 }} />)}
            <ellipse cx={CX} cy={CY} rx={125} ry={54} className="p-ut-orbit" />
            {Array.from({ length: 15 }, (_, i) => 34 + i * 12).map((y, i) => <g key={y} className="p-ut-tick"><line x1={4} x2={i % 4 === 0 ? 10 : 7} y1={y} y2={y} /><line x1={W - 4} x2={W - (i % 4 === 0 ? 10 : 7)} y1={y} y2={y} /></g>)}
            <g className="p-ut-cross" style={{ opacity: zeroK }}><line x1={CX - 5} x2={CX + 5} y1={CY} y2={CY} /><line x1={CX} x2={CX} y1={CY - 5} y2={CY + 5} /></g>
          </g>
          {/* tangled threads: solid, then dashed during netting */}
          {G.tangled.map(({ g }, i) => {
            const k = introK(i); const solidOp = 1 - a01; const dashOp = 0.35 * a01 * (1 - b12);
            return (
              <g key={`t${i}`}>
                {solidOp > 0.001 && <path d={g.d} fill="none" stroke={`url(#tg${uid}${i})`} strokeWidth={g.w} strokeLinecap="round" opacity={solidOp} strokeDasharray={k < 1 ? `${g.len * k} ${g.len}` : undefined} />}
                {solidOp > 0.001 && k >= 0.98 && <path d={arrowPath(g.tip, g.dir, g.w)} className="p-ut-head" opacity={solidOp} />}
                {dashOp > 0.001 && <path d={g.d} className="p-ut-dash" opacity={dashOp / 0.35} />}
              </g>
            );
          })}
          {/* netting endpoint dots */}
          {a01 * (1 - b12) > 0.01 && G.tangled.map(({ g }, i) => <g key={`ep${i}`} opacity={a01 * (1 - b12)}><circle cx={g.s[0]} cy={g.s[1]} r={2.5} className="p-ut-ep-owe" /><circle cx={g.tip[0]} cy={g.tip[1]} r={2.5} className="p-ut-ep-owed" /></g>)}
          {/* knots */}
          {(1 - a01) > 0.01 && G.knots.map((k, i) => <g key={`k${i}`} transform={`translate(${k[0]} ${k[1]}) scale(${lerp(0.6, 1, knotK)})`} opacity={(1 - a01) * knotK}>
            <circle r={6} className="p-ut-glow" filter={`url(#gl${uid})`} /><circle r={2.5} className="p-ut-knot" /></g>)}
          {/* solved arcs */}
          {G.solvedG.map(({ g }, i) => arcOp(i) > 0 && (
            <g key={`s${i}`} opacity={arcOp(i)}>
              <path d={g.d} fill="none" stroke={`url(#sg${uid}${i})`} strokeWidth={g.w} strokeLinecap="round" strokeDasharray={drawK(i) < 1 ? `${g.len * drawK(i)} ${g.len}` : undefined} />
              <path d={arrowPath(g.tip, g.dir, g.w)} className="p-ut-head-acc" opacity={landK(i)} />
            </g>
          ))}
          {/* nodes */}
          {ids.map(id => {
            const [x, y] = pos[id]; const n = net[id] ?? 0; const z = Math.abs(n) < 0.005; const me = id === 'ari';
            return (
              <g key={id} transform={`translate(${x} ${y})`} opacity={z ? lerp(1, 0.38, zeroK) : 1}>
                <circle r={19.3} className="p-ut-track" />
                {!z && t > 0.001 && <path d={arcPath(n, sweep)} className={n > 0 ? 'p-ut-arc is-owed' : 'p-ut-arc is-owe'} opacity={ringOp} />}
                <circle r={16} className={me ? 'p-ut-chip is-me' : 'p-ut-chip'} />
                <text dy="4.3" textAnchor="middle" className={me ? 'p-ut-mono is-me' : 'p-ut-mono'}>{people[id].initials}</text>
              </g>
            );
          })}
          {/* labels: names in Tangled, names with nets after */}
          {[[G.lab0, lab0Op], [G.lab1, lab1Op]].map(([L, op], li) => (op as number) > 0.01 && (
            <g key={`L${li}`} opacity={op as number}>
              {(L as Label[]).map(l => {
                const z = l.tone === 'zero'; const dim = z ? lerp(1, 0.45, zeroK) : 1; const cls = `p-ut-net is-${l.tone}`;
                const shownNet = l.net ? fmt((net[l.id] ?? 0) * netShown) : '';
                return (
                  <g key={l.id} opacity={dim}>
                    <rect x={l.x} y={l.y} width={l.w} height={l.h} rx={4} className="p-ut-labbg" />
                    {l.stacked ? <>
                      <text x={l.x + 4} y={l.y + 11} className={li ? 'p-ut-name is-on' : 'p-ut-name'}>{l.name}</text>
                      <text x={l.x + 4} y={l.y + 23} className={cls}>{shownNet}</text>
                    </> : <text x={l.x + 4} y={l.y + 10.5} className={li ? 'p-ut-name is-on' : 'p-ut-name'}>{l.name}{l.net && <tspan dx="6" className={cls}>{shownNet}</tspan>}</text>}
                  </g>
                );
              })}
            </g>
          ))}
          {/* tags */}
          {(1 - a01) > 0.01 && G.tags0.map((tg, i) => <g key={`tg${i}`} opacity={(1 - a01) * introK(i)}><rect x={tg.x} y={tg.y} width={tg.w} height={14} rx={7} className="p-ut-tag" /><text x={tg.x + tg.w / 2} y={tg.y + 10.3} textAnchor="middle" className="p-ut-tagtx">{tg.label}</text></g>)}
          {G.tags2.map((tg, i) => landK(i) > 0.01 && <g key={`tg2${i}`} opacity={landK(i)}><rect x={tg.x} y={tg.y} width={tg.w} height={14} rx={7} className="p-ut-tag is-acc" /><text x={tg.x + tg.w / 2} y={tg.y + 10.3} textAnchor="middle" className="p-ut-tagtx is-acc">{tg.label}</text></g>)}
          {/* Σ pill */}
          {(() => { const op = (reduce ? clamp(t) : clamp((t - 0.667) / 0.2)) * (1 - b12); return op > 0.01 && <g opacity={op}><rect x={CX - 27} y={CY - 8} width={54} height={16} rx={5} className="p-ut-tag" /><text x={CX} y={CY + 3.6} textAnchor="middle" className="p-ut-tagtx">Σ {Math.abs(sigma).toFixed(2)}</text></g>; })()}
          {/* stepper */}
          <g className="p-ut-stepper">
            {stepNames.map((s, i) => (
              <g key={s} className={phase === i ? 'is-on' : ''} transform={`translate(${stepX[i]} 18)`}>
                <circle cx={3} cy={0} r={2.5} className="p-ut-stepdot" />
                <text x={10} y={3.6} className="p-ut-steptx">{`0${i + 1} ${s}`}</text>
                {i < 2 && <line x1={stepX[i + 1] - stepX[i] - 20} x2={stepX[i + 1] - stepX[i] - 8} y1={0} y2={0} className="p-ut-hair" />}
              </g>
            ))}
          </g>
          {/* instrument panel */}
          <g transform="translate(16 206)">
            <rect width={330} height={50} rx={12} className="p-ut-panel" />
            <line x1={110} x2={110} y1={8} y2={42} className="p-ut-div" /><line x1={220} x2={220} y1={8} y2={42} className="p-ut-div" />
            {panels.map((cells, pi) => panelW[pi] > 0.01 && (
              <g key={pi} opacity={panelW[pi]}>
                {cells.map(([cap, val], ci) => <g key={ci} transform={`translate(${ci * 110 + 17} 0)`}><text y={20} className="p-ut-cap">{cap}</text><text y={38} className="p-ut-val">{val}</text></g>)}
              </g>
            ))}
          </g>
        </svg>}
        {ctl === 'inline' && <>
          <div className="p-ut-stepbtns">
            {stepNames.map((s, i) => <button key={s} type="button" style={{ left: `${(stepX[i] - 6) / W * 100}%`, width: `${(i < 2 ? stepX[i + 1] - stepX[i] - 18 : 96) / W * 100}%` }} aria-label={`Show step ${i + 1}, ${s.toLowerCase()}`} aria-current={phase === i ? 'step' : undefined} onClick={() => goTo(i)} />)}
          </div>
          <button type="button" className="p-ut-replay" onClick={play} disabled={playing} aria-label={t >= 1.999 ? 'Replay the untangle' : 'Play the untangle'}><Icon name={t >= 1.999 ? 'replay' : 'play'} size={16} fill={t < 1.999} /></button>
          <input type="range" className="p-ut-scrub-inline" min={0} max={200} step={reduce ? 100 : 1} value={Math.round(t * 100)} aria-label="Scrub the solve" aria-valuetext={stepNames[phase]}
            onChange={e => { stop(); setIntro(1); const v = +e.target.value / 100; setT(v); if (v >= 1.999) finish(); }} />
        </>}
      </div>
      {ctl === 'full' && (
        <div className="p-ut-ctl">
          {(startButton || t >= 1.999) && <button type="button" className="p-ut-btn" onClick={play} disabled={playing} aria-label={t >= 1.999 ? 'Replay the untangle' : 'Untangle'}>
            <Icon name={t >= 1.999 ? 'replay' : 'play'} size={16} fill={t < 1.999} />{t >= 1.999 ? 'Replay' : 'Untangle'}</button>}
          <input type="range" min={0} max={200} step={reduce ? 100 : 1} value={Math.round(t * 100)} aria-label="Scrub the solve" aria-valuetext={stepNames[phase]}
            onChange={e => { stop(); setIntro(1); const v = +e.target.value / 100; setT(v); if (v >= 1.999) finish(); }} />
          <span className={`p-ut-check ${t >= 1.999 && netsHold ? 'is-ok' : ''}`}>{t >= 1.999 ? (netsHold ? 'nets unchanged ✓' : 'nets changed') : 'nets ·'}</span>
        </div>
      )}
      {ctl === 'steps' && (
        <div className="p-ut-steps">
          <ol className="p-ut-steps-l" aria-label="Untangle step">{['Tangled', 'Netting', 'Solved'].map((s, i) => (
            <li key={s}><button type="button" className={phase === i ? 'is-on' : ''} aria-current={phase === i ? 'step' : undefined} onClick={() => { setIntro(1); goTo(i); }}><i className="tu-num">{i + 1}</i>{s}</button></li>))}</ol>
          {phase < 2 || playing ? <button type="button" className="p-ut-next" onClick={() => { setIntro(1); goTo(Math.min(2, phase + 1)); }} disabled={playing}>Next<Icon name="chevronRight" size={16} /></button>
            : <button type="button" className="p-ut-restart" onClick={() => goTo(0)}>Start over</button>}
        </div>
      )}
      <p className="sr-only" aria-live="polite">{summary}</p>
    </div>
  );
}
