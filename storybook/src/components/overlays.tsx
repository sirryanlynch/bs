import { AVATAR } from '../assets/solver-assets';
import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from './Icon';
import { Button, IconButton } from './core';
import { useReducedMotion } from '../lib/PrismRoot';

/* ---------------- BottomSheet ---------------- */
export function BottomSheet({ open = true, detent = 'medium', title, children, scrim = true, onClose }:
  { open?: boolean; detent?: 'medium' | 'large' | 'compact'; title?: string; children: React.ReactNode; scrim?: boolean; onClose?: () => void }) {
  if (!open) return null;
  return (
    <div className="p-sheet-layer">
      {scrim && <div className="p-scrim anim-fade" onClick={onClose} />}
      <div className={`p-sheet tu-glass-thick is-${detent} anim-sheet`} role="dialog" aria-modal="true" aria-label={title ?? 'Sheet'}>
        <span className="p-sheet-grabber" aria-hidden />
        {title && <div className="p-sheet-bar"><IconButton icon="close" label="Close" variant="tinted" size={44} onClick={onClose} /><span className="p-sheet-bartitle">{title}</span><span style={{ width: 44 }} /></div>}
        <div className="p-sheet-body">{children}</div>
      </div>
    </div>
  );
}

/* ---------------- Modal (alert) ---------------- */
export function Modal({ title, body, primary = 'Delete', secondary = 'Cancel', destructive = true, open = true }:
  { title: string; body: string; primary?: string; secondary?: string; destructive?: boolean; open?: boolean }) {
  if (!open) return null;
  return (
    <div className="p-modal-layer">
      <div className="p-scrim anim-fade" />
      <div className="p-modal tu-glass-thick anim-pop" role="alertdialog" aria-modal="true" aria-labelledby="m-t" aria-describedby="m-b">
        <h2 id="m-t">{title}</h2>
        <p id="m-b">{body}</p>
        <div className="p-modal-actions">
          <Button label={secondary} variant="secondary" size="medium" fullWidth />
          <Button label={primary} variant={destructive ? 'destructive' : 'primary'} size="medium" fullWidth />
        </div>
      </div>
    </div>
  );
}

/* ---------------- CelebrationOverlay ---------------- */
/** A crafted mark instead of clip-art. Squared: seven people, their threads let go, the ring closes and a check draws in. */
function CelebrateMark({ kind }: { kind: 'squared' | 'pollWon' | 'milestone' }) {
  const pts = Array.from({ length: 7 }, (_, i) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / 7; return [60 + Math.cos(a) * 42, 60 + Math.sin(a) * 42]; });
  const threads = [[0, 3], [1, 5], [2, 6], [4, 0], [6, 2], [5, 1]];
  if (kind === 'pollWon') return (
    <svg className="p-cmark is-poll" viewBox="0 0 120 120" width="112" height="112" aria-hidden>
      <circle cx="60" cy="60" r="54" className="p-cmark-disc" />
      {[[34, 30], [53, 48], [72, 20]].map(([x, h], i) => <rect key={i} x={x} y={90 - h} width="14" height={h} rx="7" className={`p-cmark-bar ${i === 1 ? 'is-win' : ''}`} style={{ animationDelay: `${120 + i * 90}ms` }} />)}
      <path d="M52 26 l6 6 l12 -13" className="p-cmark-check" />
    </svg>
  );
  return (
    <svg className="p-cmark" viewBox="0 0 120 120" width="112" height="112" aria-hidden>
      <circle cx="60" cy="60" r="54" className="p-cmark-disc" />
      {(kind as string) === 'squared' && threads.map(([a, b], i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} className="p-cmark-thread" style={{ animationDelay: `${i * 40}ms` }} />)}
      <circle cx="60" cy="60" r="42" className="p-cmark-ring" pathLength={100} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" className="p-cmark-dot" style={{ animationDelay: `${520 + i * 40}ms` }} />)}
      <path d="M46 61 l10 10 l19 -21" className="p-cmark-check" pathLength={100} />
    </svg>
  );
}

/** Payment rows for the optional detail: [from, to, amount, how]. */
export type SquaredRow = [string, string, string, string];
const SQ_ROWS: SquaredRow[] = [['Ari', 'Nic', '$42.10', '10:39 PM'], ['Ren', 'Ari', '$18.40', '10:40 PM'], ['Mara', 'João', '$64.00', 'cash ✓']];
const SQ_PEOPLE = ['ari', 'nic', 'ren', 'mara', 'joao'];
/**
 * All squared up (Figma hifi-10, v5 simplified). An inset glass sheet over a dimmed Money screen: the check disc with its
 * soft spectrum glow, the title, one summary line, the faces of everyone who paid or got paid, and one action.
 * The payment list stays one tap away behind "See payments". The glow blooms once (about 900 ms), then holds still.
 * Reduce Motion shows it at rest with a 200 ms fade.
 */
export function SquaredSheet({ title = 'All squared up.', body = '3 payments · $124.50 · everyone at $0.00', people = SQ_PEOPLE,
  rows = SQ_ROWS, actionLabel = 'Share the recap', onAction, replayKey = 0, detailsOpen = false }:
  { eyebrow?: string; title?: string; body?: React.ReactNode; people?: string[]; rows?: SquaredRow[]; total?: [string, string]; actionLabel?: string; onAction?: () => void; replayKey?: number; detailsOpen?: boolean }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = React.useState(detailsOpen);
  return (
    <div className={`p-sq ${reduce ? 'is-reduced' : ''}`} key={replayKey} role="status" aria-live="polite">
      <div className="p-sq-scrim" aria-hidden />
      <section className="p-sq-card" aria-label={title}>
        <div className="p-sq-mark" aria-hidden>
          <span className="p-sq-glow" />
          <svg className="p-sq-disc" width="72" height="72" viewBox="0 0 72 72"><circle cx="36" cy="36" r="35.5" /><path d="M23 37.5 32 46.5 50 27" pathLength={100} /></svg>
        </div>
        <h2 className="p-sq-title">{title}</h2>
        <p className="p-sq-body tu-num">{body}</p>
        <ul className="p-sq-faces" aria-label={`${people.length} people settled`}>
          {people.map((id, i) => <li key={id} style={{ ['--i' as any]: i }}>{AVATAR[id] ? <img src={AVATAR[id]} alt="" /> : <span>{id[0].toUpperCase()}</span>}</li>)}
        </ul>
        {open && <ul className="p-sq-list tu-num">{rows.map(r => <li key={r[0] + r[1]}><span>{r[0]} → {r[1]}</span><b>{r[2]}</b><small>{r[3].includes('cash') ? 'Paid in cash' : `Paid in app · ${r[3]}`}</small></li>)}</ul>}
        <Button label={actionLabel} onClick={onAction} />
        <button type="button" className="p-sq-more" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? 'Hide payments' : 'See payments'}</button>
      </section>
    </div>
  );
}

export function CelebrationOverlay({ kind = 'squared', title, subtitle, eyebrow, replayKey = 0, stats, actionLabel, onAction, secondaryLabel, onSecondary }:
  { kind?: 'squared' | 'pollWon' | 'milestone'; title?: string; subtitle?: string; eyebrow?: string; replayKey?: number; stats?: [string, string][]; actionLabel?: string; onAction?: () => void; secondaryLabel?: string; onSecondary?: () => void }) {
  const reduce = useReducedMotion();
  if (kind === 'squared') return <SquaredSheet replayKey={replayKey} title={title} body={subtitle} actionLabel={actionLabel} onAction={onAction} />;
  const t = title ?? { squared: 'All squared up.', pollWon: 'Taberna wins.', milestone: 'Lisbon, booked.' }[kind];
  const s = subtitle ?? { squared: 'Three payments instead of six. Nobody owes anything.', pollWon: '5 of 7 picked Taberna da Rua das Flores. Booked for 8:30 PM.', milestone: 'Flights, the Alfama flat and both dinners are locked in.' }[kind];
  const e = eyebrow ?? { squared: 'Lisbon Crew · settled', pollWon: 'Poll closed', milestone: 'Lisbon Crew' }[kind];
  return (
    <div className={`p-celebrate ${reduce ? 'is-reduced' : ''}`} key={replayKey} role="status" aria-live="polite">
      <div className="p-celebrate-wash" aria-hidden />
      <div className="p-celebrate-card tu-glass-thick">
        <span className="p-celebrate-edge" aria-hidden />
        <CelebrateMark kind={kind} />
        <p className="p-celebrate-eyebrow">{e}</p>
        <h2 className="p-celebrate-title">{t}</h2>
        <p className="p-celebrate-sub">{s}</p>
        {(kind as string) === 'squared' && <dl className="p-celebrate-stats">{(stats ?? [['$124.50', 'settled'], ['3', 'payments'], ['$0.00', 'owed']]).map(([v, l]) => <div key={l}><dt>{l}</dt><dd className="tu-num">{v}</dd></div>)}</dl>}
        <div className="p-celebrate-actions">
          <Button label={actionLabel ?? 'See the plan'} fullWidth onClick={onAction} />
          {secondaryLabel && <Button label={secondaryLabel} variant="plain" fullWidth onClick={onSecondary} />}
        </div>
      </div>
    </div>
  );
}
