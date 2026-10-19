import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Avatar, AvatarStack, Button, IconButton, Toggle } from './core';
import type { Person } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';

export type PollState = 'default' | 'yourVote' | 'leading' | 'winner';
export type PollOptionProps = {
  label: string; detail?: string; votes: number; total: number; state?: PollState; voters?: Person[]; photo?: string; closed?: boolean; onVote?: () => void;
  /** Counts hidden until you vote: no percent, no fill. */ hidden?: boolean;
};

/** One answer in a poll. The fill width is the vote share and springs on every change. */
export function PollOption({ label, detail, votes, total, state = 'default', voters = [], photo, closed, onVote, hidden }: PollOptionProps) {
  const pct = total && !hidden ? Math.round((votes / total) * 100) : 0;
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? pct : 0);
  useEffect(() => { const t = setTimeout(() => setShown(pct), reduce ? 0 : 60); return () => clearTimeout(t); }, [pct, reduce]);
  const mine = state === 'yourVote';
  return (
    <button type="button" className={`p-pollopt is-${state} ${photo ? 'has-photo' : ''}`} onClick={onVote} disabled={closed}
      aria-pressed={mine} aria-label={`${label}${hidden ? ', counts hidden until you vote' : `, ${votes} of ${total} votes, ${pct} percent`}${state === 'winner' ? ', winner' : state === 'leading' ? ', leading' : ''}${mine ? ', your vote' : ''}`}>
      <span className="p-pollopt-fill" style={{ width: `${shown}%` }} aria-hidden />
      {state === 'winner' && <span className="p-pollopt-sheen anim-move" aria-hidden />}
      {photo && <img className="p-pollopt-photo" src={photo} alt="" />}
      <span className="p-pollopt-text">
        <span className="p-pollopt-label">{label}</span>
        <span className="p-pollopt-detail">
          {state === 'winner' && <span className="p-pollopt-tag is-winner">Winner</span>}
          {state === 'leading' && <span className="p-pollopt-tag">Leading</span>}
          {detail && <span className="p-pollopt-detail-text">{detail}</span>}
        </span>
      </span>
      <span className="p-pollopt-right">
        {voters.length > 0 && !photo && <AvatarStack people={voters} size={24} max={3} />}
        {!hidden && <span className="p-pollopt-pct tu-num">{pct}%</span>}
        <span className={`p-pollopt-check ${mine || state === 'winner' ? 'is-on' : ''}`} aria-hidden>{(mine || state === 'winner') && <Icon name="check" size={14} />}</span>
      </span>
    </button>
  );
}

/** Countdown to poll close. Ticks every second; under an hour it switches to the urgent tone. */
export function Countdown({ endsInMinutes = 135, variant = 'pill', label = 'Closes in' }: { endsInMinutes?: number; variant?: 'pill' | 'large' | 'inline'; label?: string }) {
  const [s, setS] = useState(endsInMinutes * 60);
  useEffect(() => { setS(endsInMinutes * 60); const t = setInterval(() => setS(x => Math.max(0, x - 1)), 1000); return () => clearInterval(t); }, [endsInMinutes]);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const urgent = s < 3600 && s > 0;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (s === 0) return <span className={`p-count p-count-${variant} is-closed`}><Icon name="lock" size={14} />Poll closed</span>;
  if (variant === 'large') {
    return (
      <div className={`p-count-large ${urgent ? 'is-urgent' : ''}`} role="timer" aria-label={`${label} ${h} hours ${m} minutes`}>
        {[[h, 'hr'], [m, 'min'], [sec, 'sec']].map(([v, u]) => (
          <span key={u as string} className="p-count-cell"><span className="p-count-num tu-num">{pad(v as number)}</span><span className="p-count-unit">{u}</span></span>
        ))}
      </div>
    );
  }
  return (
    <span className={`p-count p-count-${variant} ${urgent ? 'is-urgent' : ''}`} role="timer">
      <Icon name="clock" size={14} />{label} <span className="tu-num">{h > 0 ? `${h}h ${pad(m)}m` : `${m}:${pad(sec)}`}</span>
    </span>
  );
}

export type PollData = { question: string; options: { label: string; detail?: string; votes: number; voters?: Person[]; photo?: string }[] };

/** Poll card. "live" streams in the remaining votes so the fills race. */
export function PollCard({ question, options, voters, total: totalProp, yourVote, status = 'open', live, anonymous, endsInMinutes = 135, author }:
  PollData & { voters: Person[]; total?: number; yourVote?: number; status?: 'open' | 'closed'; live?: boolean; anonymous?: boolean; endsInMinutes?: number; author?: Person }) {
  const [opts, setOpts] = useState(options);
  const [mine, setMine] = useState<number | undefined>(yourVote);
  useEffect(() => { setOpts(options); setMine(yourVote); }, [options, yourVote]);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setOpts(o => {
      const sum = o.reduce((a, b) => a + b.votes, 0);
      if (sum >= voters.length - 1) return o;
      const k = 0;
      return o.map((x, j) => j === k ? { ...x, votes: x.votes + 1 } : x);
    }), 700);
    return () => clearInterval(t);
  }, [live]);
  const total = totalProp ?? opts.reduce((a, b) => a + b.votes, 0);
  const max = Math.max(...opts.map(o => o.votes));
  const leaderCount = opts.filter(o => o.votes === max).length;
  const voted = opts.reduce((a, b) => a + b.votes, 0);
  return (
    <article className="p-pollcard tu-surface" aria-label={`Poll: ${question}`}>
      <header className="p-pollcard-head">
        <div className="p-pollcard-meta">
          {author && <Avatar person={author} size={24} ring="none" />}
          <span>{author ? `${author.name} asked` : 'Group poll'}{anonymous ? ' · Anonymous' : ''}</span>
          <span className="p-spacer" />
          {status === 'open' ? <Countdown endsInMinutes={endsInMinutes} /> : <span className="p-count p-count-pill is-closed"><Icon name="lock" size={14} />Closed</span>}
        </div>
        <h3 className="p-pollcard-q">{question}</h3>
      </header>
      <div className="p-pollcard-opts">
        {opts.map((o, i) => {
          const state: PollState = status === 'closed' && o.votes === max ? 'winner' : mine === i ? 'yourVote' : o.votes === max && leaderCount === 1 && voted > 0 ? 'leading' : 'default';
          return <PollOption key={o.label} {...o} voters={anonymous ? [] : o.voters} total={total} state={state} closed={status === 'closed'}
            onVote={() => { if (mine === i) return; setOpts(p => p.map((x, j) => j === i ? { ...x, votes: x.votes + 1 } : j === mine ? { ...x, votes: x.votes - 1 } : x)); setMine(i); }} />;
        })}
      </div>
      <footer className="p-pollcard-foot">
        <AvatarStack people={voters} size={24} max={5} />
        <span className="tu-num">{Math.min(voted, voters.length)} of {voters.length} voted</span>
        <span className="p-spacer" />
        {status === 'open' && mine != null && <span className="p-pollcard-undo">Change vote</span>}
      </footer>
    </article>
  );
}

/** Poll composer. Options can be places from the plan or free text. */
export function PollBuilder({ question = 'Saturday dinner', options = ['Taberna da Rua das Flores', 'Cervejaria Ramiro', 'Park Rooftop'], anonymous = false, multi = false, closesIn = '6 hours' }:
  { question?: string; options?: string[]; anonymous?: boolean; multi?: boolean; closesIn?: string }) {
  const [opts, setOpts] = useState(options);
  const [q, setQ] = useState(question);
  useEffect(() => { setOpts(options); setQ(question); }, [options, question]);
  return (
    <div className="p-builder">
      <div className="p-builder-card tu-surface">
        <label className="p-builder-qlabel" htmlFor="pb-q">Question</label>
        <input id="pb-q" className="p-builder-q" value={q} onChange={e => setQ(e.target.value)} placeholder="Ask the group" />
      </div>
      <div className="p-builder-card tu-surface">
        <div className="p-builder-sec">Options</div>
        {opts.map((o, i) => (
          <div key={i} className="p-builder-opt anim-fade">
            <span className="p-builder-num tu-num">{i + 1}</span>
            <input aria-label={`Option ${i + 1}`} value={o} onChange={e => setOpts(opts.map((x, j) => j === i ? e.target.value : x))} />
            <IconButton icon="close" label={`Remove ${o}`} variant="plain" size={44} onClick={() => setOpts(opts.filter((_, j) => j !== i))} />
          </div>
        ))}
        {opts.length < 6 && (
          <button type="button" className="p-builder-add" onClick={() => setOpts([...opts, ''])}>
            <span className="p-builder-addicon"><Icon name="plus" size={14} /></span>Add option
          </button>
        )}
      </div>
      <div className="p-builder-card tu-surface p-builder-settings">
        <div className="p-builder-setting"><span><b>Closes in</b><small>Everyone gets a nudge 1 hour before</small></span><span className="p-builder-pill">{closesIn}<Icon name="chevronDown" size={14} /></span></div>
        <div className="p-builder-setting"><span><b>Anonymous votes</b><small>Hide who picked what</small></span><Toggle checked={anonymous} label="Anonymous votes" /></div>
        <div className="p-builder-setting"><span><b>Allow several picks</b></span><Toggle checked={multi} label="Allow several picks" /></div>
      </div>
      <Button label="Send to group" fullWidth disabled={opts.filter(Boolean).length < 2 || !q} />
    </div>
  );
}
