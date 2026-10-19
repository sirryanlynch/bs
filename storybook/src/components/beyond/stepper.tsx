import React from 'react';
import './beyond.css';

/**
 * Stepper: one component for every multi-step flow (Explore's finder, Create trip, Add expense).
 * Anatomy: a top row with a fixed Back slot, a centered mono caption "Step n of N" and a fixed Skip slot,
 * then a thin segmented bar. Iris fills completed and current segments; the fill animates over 200 ms
 * (instant with Reduce Motion). Completed segments are buttons when onStep is set, so you can jump back.
 * Rules: pass onBack only when the nav bar has no back of its own; pass onSkip only on optional steps.
 * The slots are fixed width, so the caption stays centered when Back or Skip is hidden.
 */
export function Stepper({ steps, current, onStep, onBack, onSkip, label }:
  { steps: string[]; current: number; onStep?: (i: number) => void; onBack?: () => void; onSkip?: () => void; label?: string; doneLabel?: string }) {
  const n = steps.length; const cur = Math.min(current, n - 1);
  const caption = `Step ${cur + 1} of ${n}`;
  return (
    <div className="b-stepper" role="group" aria-label={label ?? 'Progress'}>
      <div className="b-stepper-row">
        {onBack && cur > 0 ? <button type="button" className="b-stepper-act is-back" onClick={onBack}>Back</button> : <span className="b-stepper-sp" />}
        <p className="b-stepper-count" aria-hidden>{caption}</p>
        {onSkip ? <button type="button" className="b-stepper-act is-skip" onClick={onSkip} aria-label={`Skip ${steps[cur]}`}>Skip</button> : <span className="b-stepper-sp" />}
      </div>
      <div className="b-stepper-bars" role="progressbar" aria-valuemin={1} aria-valuemax={n} aria-valuenow={cur + 1} aria-valuetext={`${caption}, ${steps[cur]}`} aria-label={`${caption}, ${steps[cur]}`}>
        {steps.map((s, i) => {
          const cls = i < cur ? 'is-done' : i === cur ? 'is-on' : '';
          return i < cur && onStep
            ? <button key={s} type="button" className={`b-stepper-seg ${cls}`} onClick={() => onStep(i)} aria-label={`Back to step ${i + 1}, ${s}`}><span /></button>
            : <span key={s} className={`b-stepper-seg ${cls}`} aria-hidden><span /></span>;
        })}
      </div>
    </div>
  );
}
