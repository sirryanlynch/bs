import React from 'react';
import './elevate.css';
/** NextSteps: a quiet three-beat strip that says what happens after a confirmation, so the screen ends on progress, not empty space. */
export function NextSteps({ steps, at = 0, label = 'What happens next' }: { steps: string[]; at?: number; label?: string }) {
  return (
    <ol className="b-next" aria-label={label}>
      {steps.map((t, i) => <li key={t} className={i <= at ? 'is-on' : ''}><span className="b-next-dot" aria-hidden /><span className="tu-num">{t}</span></li>)}
    </ol>
  );
}
