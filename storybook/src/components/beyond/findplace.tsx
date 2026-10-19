import React from 'react';
import './beyond.css';
import './composer.css';
import './findplace.css';
import { BIcon } from './icons';
import { CommunityPlace, MODES, DURATIONS, CURATE_STEPS, AFTER, BUDGET, px } from '../../lib/beyond';
import { photo } from '../../lib/data';
import { CurateAnswers, curateCount, curateMode, curateStage, curateSummary, distanceText, CurateRing } from './explore';

/*
 * FindPlace: one question per screen, answered with one tap.
 *   1 How are you getting there?  2 How long?  3 What kind?  4 Price per person.  Then the picks.
 *   Tapping a tile answers and moves on. Skip takes the default (any). Progress is four quiet dots in the header.
 */
const MODE_PHOTO: Record<string, string> = { walk: photo.alfama, drive: photo.bridge, destination: px.sesimbra };
const KIND_PHOTO: Record<string, string> = { food: px.candleDinner, drinks: px.sunsetCrowd, culture: px.belem, active: px.diver };
const PRICE_NOTE = ['Cheap and quick', 'Most places', 'A splurge', 'No limit'];
const HELP = (a: CurateAnswers, st: number) => st === 0 ? 'This sets how far we look.' : st === 1 ? (a.mode === 'drive' ? 'Door to door, at this time of day.' : a.mode === 'walk' ? 'From Rua da Rosa, where you are now.' : 'Includes getting there and back.') : st === 2 ? 'Pick one. You can change it later.' : 'Per person, before tip.';
export const findQuestion = (a: CurateAnswers, st: number) => st === 1 ? (a.mode === 'walk' ? 'How far are you happy to walk?' : a.mode === 'drive' ? 'How long a drive?' : 'How much of the day?') : CURATE_STEPS[Math.min(st, 3)];
/** Back one question, keeping the earlier answers. */
export const findBack = (a: CurateAnswers): CurateAnswers => { const st = curateStage(a); return st <= 1 ? {} : st === 2 ? { mode: a.mode } : st === 3 ? { mode: a.mode, dur: a.dur } : { mode: a.mode, dur: a.dur, after: a.after }; };
/** Skip one question, taking the default (any). */
export const findSkip = (a: CurateAnswers): CurateAnswers => { const st = curateStage(a); return st === 0 ? { mode: 'any', dur: -1 } : st === 1 ? { ...a, dur: -1 } : st === 2 ? { ...a, after: -1 } : { ...a, budget: -1 }; };

export function FindDots({ at, total = 4 }: { at: number; total?: number }) {
  return <span className="b-fp-dots" role="img" aria-label={`Question ${Math.min(at + 1, total)} of ${total}`}>{Array.from({ length: total }, (_, i) => <i key={i} className={i < at ? 'is-done' : i === at ? 'is-on' : ''} />)}</span>;
}

export function FindHeader({ answers, onBack, onSkip }: { answers: CurateAnswers; onBack?: () => void; onSkip?: () => void }) {
  const st = curateStage(answers);
  return (
    <header className="b-cmp-head b-fp-head">
      <button type="button" className="b-cmp-round tu-glass" onClick={onBack} aria-label="Back"><BIcon name="chevronLeft" size={20} /></button>
      <div className="b-cmp-headt"><b>Find a place</b><small>For 7 · tonight</small>{st < 4 && <FindDots at={st} />}</div>
      {st < 4 && onSkip ? <button type="button" className="b-fp-skip" onClick={onSkip}>Skip</button> : <span className="b-cmp-sp" />}
    </header>
  );
}

/** The current question. Each tile answers and advances. */
export function FindQuestion({ answers, onAnswer }: { answers: CurateAnswers; onAnswer: (a: CurateAnswers) => void }) {
  const st = curateStage(answers); if (st >= 4) return null;
  const n = curateCount(answers); const m = curateMode(answers);
  let tiles: React.ReactNode;
  if (st === 0) tiles = <div className="b-fp-stack">{MODES.map((md, i) => (
    <button key={md.id} type="button" className="b-fp-photo" style={{ ['--i' as any]: i }} onClick={() => onAnswer({ mode: md.id })}>
      <img src={MODE_PHOTO[md.id]} alt="" /><span className="b-fp-ico" aria-hidden><BIcon name={md.id === 'walk' ? 'walk' : md.id === 'drive' ? 'car' : 'mountains'} size={20} /></span>
      <span className="b-fp-pt"><b>{md.label}</b><small className="tu-num">{md.sub} · {md.range}</small></span></button>))}</div>;
  else if (st === 1) tiles = <div className="b-fp-list">{DURATIONS[m ?? 'walk'].map((d, i) => (
    <button key={d.label} type="button" className="b-fp-glass" style={{ ['--i' as any]: i }} onClick={() => onAnswer({ ...answers, dur: i })}>
      <b className="tu-num">{d.label}</b><small className="tu-num">{d.n} places</small><BIcon name="chevronRight" size={18} /></button>))}</div>;
  else if (st === 2) tiles = <div className="b-fp-grid">{AFTER.map((k, i) => (
    <button key={k.id} type="button" className="b-fp-photo is-sq" style={{ ['--i' as any]: i }} onClick={() => onAnswer({ ...answers, after: i })}>
      <img src={KIND_PHOTO[k.id]} alt="" /><span className="b-fp-pt"><b>{k.label}</b><small className="tu-num">{curateCount({ ...answers, after: i })} places</small></span></button>))}</div>;
  else tiles = <div className="b-fp-grid">{BUDGET.map((b, i) => (
    <button key={b.label} type="button" className="b-fp-glass is-sq" style={{ ['--i' as any]: i }} onClick={() => onAnswer({ ...answers, budget: i })}>
      <b className="tu-num">{b.label}</b><small>{PRICE_NOTE[i]}</small></button>))}</div>;
  return (
    <section className="b-fp-q" key={st} aria-labelledby="b-fp-q">
      <h1 id="b-fp-q" className="b-fp-title">{findQuestion(answers, st)}</h1>
      <p className="b-fp-help">{HELP(answers, st)}</p>
      {tiles}
      <p className="b-fp-count tu-num" aria-live="polite"><b>{n}</b> {st === 0 ? 'places in Lisbon so far' : 'places match so far'}</p>
    </section>
  );
}

/** Picks ready: a calm hero, the answers as a trail, then photo tiles. */
export function FindPicks({ answers, list, onOpen }: { answers: CurateAnswers; list: CommunityPlace[]; onOpen: (id: string) => void }) {
  const m = curateMode(answers);
  return (
    <section className="b-fp-picks">
      <div className="b-fp-ph">
        <CurateRing done={4} total={4} count={list.length} size={84} />
        <div><h1 className="b-fp-title is-s">{list.length} picks for tonight</h1><p className="b-fp-help">Sorted by how often crews like yours booked</p></div>
      </div>
      <p className="b-fp-trail">{curateSummary(answers).map(t => <span key={t}>{t}</span>)}</p>
      <ol className="b-ot-list">{list.map((p, i) => (
        <li key={p.id} className="b-ot" style={{ ['--i' as any]: i }}>
          <button type="button" className="b-ot-card has-photo b-fp-pick" onClick={() => onOpen(p.id)}>
            <img src={p.photos[0]} alt="" /><span className="b-ot-text"><b>{p.name}</b><small className="tu-num">{p.type} · {p.price} · {distanceText(p, m)}</small></span>
            <span className="b-fp-rank tu-num" aria-hidden>{i + 1}</span></button></li>))}</ol>
    </section>
  );
}
