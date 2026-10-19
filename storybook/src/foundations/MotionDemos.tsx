import React, { useEffect, useState } from 'react';
import { PrismRoot, usePrism, useReducedMotion } from '../lib/PrismRoot';
import { Button, BalanceChip, SegmentedControl, Toggle } from '../components/core';
import { PollOption } from '../components/poll';
import { ExploreRing } from '../components/trip';
import { people } from '../lib/data';
import './motion-demos.css';

/* Motion tokens shown through real TripUp components. Each card replays its own demo, follows the
   Motion toolbar by default, and can be flipped between Rich and Reduced locally. */
type Mode = 'full' | 'reduce';
type Bez = [number, number, number, number];
type DemoProps = { run: number; reduce: boolean };

function useSeq(run: number, times: number[]) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    setPh(0);
    const ts = times.map((t, i) => setTimeout(() => setPh(i + 1), t));
    return () => ts.forEach(clearTimeout);
  }, [run]);
  return ph;
}

export function CurvePlot({ b }: { b: Bez }) {
  const X = (x: number) => 6 + x * 52, Y = (y: number) => 38 - y * 22;
  return (
    <svg className="md-curve" width="64" height="46" viewBox="0 0 64 46" aria-hidden>
      <line x1="6" x2="58" y1={Y(0)} y2={Y(0)} className="md-curve-axis" />
      <line x1="6" x2="58" y1={Y(1)} y2={Y(1)} className="md-curve-axis" />
      <path d={`M${X(0)} ${Y(0)} C${X(b[0])} ${Y(b[1])} ${X(b[2])} ${Y(b[3])} ${X(1)} ${Y(1)}`} className="md-curve-line" />
    </svg>
  );
}

/* spring.ui: a sheet presents, then its segmented control and toggle respond */
function SheetDemo({ run, reduce }: DemoProps) {
  const ph = useSeq(run, reduce ? [0, 0] : [60, 700]);
  return (
    <div className="md-sheet-stage">
      <div className={`md-sheet tu-glass-thick ${ph >= 1 ? 'is-up' : ''}`}>
        <span className="md-grabber" aria-hidden />
        <b className="md-sheet-t">Split dinner</b>
        <SegmentedControl key={run} options={['Evenly', 'By item']} value={ph >= 2 ? 'By item' : 'Evenly'} />
        <span className="md-row"><span>Ren and Nic skip the wine</span><Toggle key={run} checked={ph >= 2} label="Ren and Nic skip the wine" /></span>
      </div>
    </div>
  );
}

/* spring.live: a live poll bar gains a vote and the leader gets one glint */
function LiveDemo({ run, reduce }: DemoProps) {
  const ph = useSeq(run, [900]);
  return (
    <div className="md-live" key={run}>
      <div className="md-glint-wrap">
        <PollOption label="Taberna da Rua das Flores" detail="Alfama · $$" votes={ph >= 1 ? 4 : 3} total={7} state="leading" voters={[people.ari, people.mara, people.nic]} />
        {ph >= 1 && !reduce && <span className="md-glint" aria-hidden />}
      </div>
      <PollOption label="Cervejaria Ramiro" detail="Anjos · $$" votes={2} total={7} />
    </div>
  );
}

/* spring.moment: the All squared up check mark */
function MomentDemo({ run }: DemoProps) {
  const ph = useSeq(run, [80]);
  return (
    <div className={`md-moment ${ph >= 1 ? 'is-on' : ''}`} key={run}>
      <span className="md-moment-glow" aria-hidden />
      <span className="md-disc"><svg viewBox="0 0 24 24" aria-hidden><path d="M6 12.5l4 4 8-9" /></svg></span>
      <span className="md-moment-t">All squared up.</span>
    </div>
  );
}

/* ease.standard: a balance chip changes color and value once Nic pays */
function ChipDemo({ run }: DemoProps) {
  const ph = useSeq(run, [600]);
  return (
    <div className="md-chip" key={run}>
      <span className="md-chip-who">Ari and Nic</span>
      <BalanceChip amount={ph >= 1 ? 0 : -42.1} />
    </div>
  );
}

/* ease.enter: poll option cards arriving */
function EnterDemo({ run }: DemoProps) {
  return (
    <div className="md-enter-list" key={run}>
      <div className="md-enter" style={{ animationDelay: '0ms' }}><PollOption label="Park Rooftop" detail="Bairro Alto · $$$" votes={0} total={7} /></div>
      <div className="md-enter" style={{ animationDelay: '90ms' }}><PollOption label="Taberna da Rua das Flores" detail="Alfama · $$" votes={0} total={7} /></div>
    </div>
  );
}

/* duration.merge: two IOU threads become one payment */
function MergeDemo({ run }: DemoProps) {
  const ph = useSeq(run, [450]);
  const on = ph >= 1;
  return (
    <div className={`md-merge ${on ? 'is-merged' : ''}`} key={run}>
      <svg viewBox="0 0 300 128" role="img" aria-label={on ? 'Ari pays Nic $42.10 directly. One payment.' : 'Ari owes Sofia $42.10 and Sofia owes Nic $42.10. Two IOUs.'}>
        <path className="md-iou" d="M44 92 Q96 26 150 34" />
        <path className="md-iou" d="M150 34 Q204 26 256 92" />
        <path className="md-pay" d="M44 92 Q150 118 256 92" pathLength={1} />
        <g className="md-node"><circle cx="44" cy="92" r="17" /><text x="44" y="97">A</text></g>
        <g className="md-node md-mid"><circle cx="150" cy="34" r="17" /><text x="150" y="39">S</text></g>
        <g className="md-node"><circle cx="256" cy="92" r="17" /><text x="256" y="97">N</text></g>
      </svg>
      <span className="md-merge-count tu-num">{on ? '1 payment · Ari pays Nic $42.10' : '2 IOUs · $42.10 each, via Sofia'}</span>
    </div>
  );
}

/* explore-ring-advance pattern */
function RingDemo({ run }: DemoProps) {
  const ph = useSeq(run, [1300]);
  return <div className="md-ring" key={run}><ExploreRing visited={ph >= 1 ? 8 : 7} total={12} size={112} /></div>;
}

function DemoCard({ name, line, b, note, Demo, label }: { name: string; line?: string; b?: Bez; note: string; Demo: React.ComponentType<DemoProps>; label?: string }) {
  const { theme, transparency } = usePrism();
  const globalReduce = useReducedMotion();
  const [ovr, setOvr] = useState<Mode | null>(null);
  const mode: Mode = ovr ?? (globalReduce ? 'reduce' : 'full');
  const [run, setRun] = useState(1);
  useEffect(() => setRun(r => r + 1), [mode]);
  const pick = (m: Mode) => setOvr(m);
  return (
    <div className="md-card">
      <div className="md-head">
        <div className="md-id"><b>{name}</b>{line && <code>{line}</code>}</div>
        {b && <CurvePlot b={b} />}
      </div>
      <PrismRoot theme={theme} motion={mode} transparency={transparency}>
        <div className={`md-stage ${mode === 'reduce' ? 'md-fade' : ''}`} key={`${run}-${mode}`} aria-live="polite">
          <Demo run={run} reduce={mode === 'reduce'} />
        </div>
      </PrismRoot>
      <p className="md-note">{note}</p>
      <div className="md-foot">
        <div className="md-mode" role="group" aria-label={`${label ?? name} motion variant`}>
          <button type="button" aria-pressed={mode === 'full'} onClick={() => pick('full')}>Rich</button>
          <button type="button" aria-pressed={mode === 'reduce'} onClick={() => pick('reduce')}>Reduced</button>
        </div>
        <Button label="Replay" size="small" variant="secondary" onClick={() => setRun(r => r + 1)} />
      </div>
    </div>
  );
}

export function MotionTokenDemos() {
  return (
    <div className="md-grid">
      <DemoCard name="spring.ui" line="cubic-bezier(0.32, 0.72, 0, 1) · 350ms" b={[0.32, 0.72, 0, 1]} Demo={SheetDemo} note="Sheets, presses, toggles. The split sheet presents, then its control and toggle respond." />
      <DemoCard name="spring.live" line="cubic-bezier(0.34, 1.32, 0.64, 1) · 450ms" b={[0.34, 1.32, 0.64, 1]} Demo={LiveDemo} note="Live poll fills. Taberna gains a vote and the leader gets one glint." />
      <DemoCard name="spring.moment" line="cubic-bezier(0.34, 1.56, 0.64, 1) · 550ms" b={[0.34, 1.56, 0.64, 1]} Demo={MomentDemo} note="Celebration entrances only. Plays once, never loops." />
      <DemoCard name="ease.standard" line="cubic-bezier(0.2, 0, 0, 1) · 240ms" b={[0.2, 0, 0, 1]} Demo={ChipDemo} note="Color, opacity and layout shifts. The balance chip turns settled when Nic pays." />
      <DemoCard name="ease.enter" line="cubic-bezier(0.05, 0.7, 0.1, 1) · 400ms" b={[0.05, 0.7, 0.1, 1]} Demo={EnterDemo} note="Elements arriving on screen, like new poll options." />
      <DemoCard name="duration.merge" line="cubic-bezier(0.32, 0.72, 0, 1) · 700ms" b={[0.32, 0.72, 0, 1]} Demo={MergeDemo} note="Debt simplify. Two IOU threads through Sofia become one payment." />
    </div>
  );
}

const PATTERN_DEMOS: Record<string, React.ComponentType<DemoProps>> = {
  'poll-bar-fill': LiveDemo,
  'debt-simplify-merge': MergeDemo,
  'settle-celebration': MomentDemo,
  'sheet-present': SheetDemo,
  'explore-ring-advance': RingDemo,
};

export function MotionPatterns({ patterns }: { patterns: Record<string, { rich: string; reduced: string }> }) {
  return (
    <div className="md-grid md-grid-patterns">
      {Object.entries(patterns).map(([k, v]) => {
        const Demo = PATTERN_DEMOS[k];
        const text = <><p className="md-pat"><b>Rich</b> {v.rich}</p><p className="md-pat md-pat-r"><b>Reduced</b> {v.reduced}</p></>;
        if (!Demo) return (
          <div className="md-card md-static" key={k}>
            <div className="md-head"><div className="md-id"><b>{k}</b><span className="md-ref">Reference only · needs device tilt</span></div></div>
            {text}
          </div>
        );
        return (
          <div className="md-pattern" key={k}>
            <DemoCard name={k} label={k} Demo={Demo} note="" />
            <div className="md-pattern-text">{text}</div>
          </div>
        );
      })}
    </div>
  );
}

/* Haptics are device-only, so they render as a static reference table with no card affordance. */
export function HapticsTable({ haptics }: { haptics: Record<string, string> }) {
  return (
    <div className="md-haptics">
      <p className="md-ref">Reference only. Haptics play on device, not in the browser.</p>
      <dl>{Object.entries(haptics).map(([k, v]) => <div key={k}><dt><code>{k}</code></dt><dd>{v}</dd></div>)}</dl>
    </div>
  );
}
