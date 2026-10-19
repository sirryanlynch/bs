import { HeaderMenu } from './headermenu';
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
 *   1 What kind?  2 Price point.  3 How are you getting there?  4 How long?  Then the picks. (v5.4.1 order)
 *   Tapping a tile answers and moves on. Skip takes the default (any). Progress is four quiet dots in the header.
 */
const MODE_PHOTO: Record<string, string> = { walk: photo.alfama, drive: photo.bridge, destination: px.sesimbra };
const KIND_PHOTO: Record<string, string> = { food: px.candleDinner, drinks: px.sunsetCrowd, culture: px.belem, active: px.diver };
const PRICE_NOTE = ['Cheap and quick', 'Most places', 'A splurge', 'No limit'];
/** v5.4.1 order: what kind first, then price point, then getting there, then how long. */
export const findStage = (a: CurateAnswers) => (a.after == null ? 0 : a.budget == null ? 1 : a.mode == null ? 2 : a.dur == null ? 3 : 4);
const HELP = (a: CurateAnswers, st: number) => st === 0 ? 'Pick one. You can change it later.' : st === 1 ? 'Per person, before drinks and tip.' : st === 2 ? 'This sets how far we look.'
  : a.mode === 'drive' ? 'Door to door, at this time of day.' : a.mode === 'walk' ? 'From Rua da Rosa, where you are now.' : 'Includes getting there and back.';
export const findQuestion = (a: CurateAnswers, st: number) => st === 0 ? 'What are you in the mood for?' : st === 1 ? 'Price point' : st === 2 ? 'How are you getting there?'
  : a.mode === 'walk' ? 'How far are you happy to walk?' : a.mode === 'drive' ? 'How long a drive?' : 'How much of the day?';
const KEYS = ['after', 'budget', 'mode', 'dur'] as const;
/** v5.4.1: keep the answers before question st (for jumping back from a picks chip). */
export const findUpTo = (a: CurateAnswers, st: number): CurateAnswers => { const o: any = {}; KEYS.slice(0, st).forEach(k => { if ((a as any)[k] != null) o[k] = (a as any)[k]; }); return o; };
/** The picks trail, in question order, each chip naming the question it answers. */
export const findTrail = (a: CurateAnswers): { st: number; label: string }[] => [
  a.after != null && a.after >= 0 && { st: 0, label: AFTER[a.after].label }, a.budget != null && a.budget >= 0 && { st: 1, label: BUDGET[a.budget].label },
  a.mode && { st: 2, label: a.mode === 'any' ? 'Any way' : MODES.find(m => m.id === a.mode)!.label }, a.mode && a.mode !== 'any' && a.dur != null && a.dur >= 0 && { st: 3, label: DURATIONS[a.mode][a.dur].label },
].filter(Boolean) as { st: number; label: string }[];
/** Back one question, keeping the earlier answers. */
export const findBack = (a: CurateAnswers): CurateAnswers => { const st = findStage(a); return st <= 1 ? {} : st === 2 ? { after: a.after } : st === 3 ? { after: a.after, budget: a.budget } : { after: a.after, budget: a.budget, mode: a.mode }; };
/** Skip one question, taking the default (any). */
export const findSkip = (a: CurateAnswers): CurateAnswers => { const st = findStage(a); return st === 0 ? { ...a, after: -1 } : st === 1 ? { ...a, budget: -1 } : st === 2 ? { ...a, mode: 'any', dur: -1 } : { ...a, dur: -1 }; };

export function FindDots({ at, total = 4 }: { at: number; total?: number }) {
  return <span className="b-fp-dots" role="img" aria-label={`Question ${Math.min(at + 1, total)} of ${total}`}>{Array.from({ length: total }, (_, i) => <i key={i} className={i < at ? 'is-done' : i === at ? 'is-on' : ''} />)}</span>;
}

export function FindHeader({ answers, onBack, onSkip }: { answers: CurateAnswers; onBack?: () => void; onSkip?: () => void }) {
  const st = findStage(answers);
  return (
    <>{/* v5.4.7: the master header card on every Find a place step */}
      <HeaderMenu title="Find a place" sub="For 7 · tonight" onBack={onBack} backLabel="Back" actions={[]} />
      {st < 4 && <div className="b-fp-subrow"><FindDots at={st} />{onSkip && <button type="button" className="b-fp-skip" onClick={onSkip}>Skip</button>}</div>}
    </>
  );
}

/** The current question. Each tile answers and advances. */
export function FindQuestion({ answers, onAnswer, prev }: { answers: CurateAnswers; onAnswer: (a: CurateAnswers) => void; /** v5.4.1: answers from before a chip jump; shown preselected with Next. */ prev?: CurateAnswers }) {
  const st = findStage(answers); if (st >= 4) return null;
  const key = (KEYS as readonly string[])[st]; const pv = prev ? (prev as any)[key] : undefined;
  const sel = (v: any) => pv != null && pv === v ? ' is-on' : '';
  const next = () => onAnswer(key === 'mode' && pv === 'any' ? { ...answers, mode: 'any', dur: -1 } : key === 'mode' && prev?.mode === pv && prev?.dur != null ? { ...answers, mode: pv } : { ...answers, [key]: pv });
  const n = curateCount(answers); const m = curateMode(answers);
  let tiles: React.ReactNode;
  if (st === 2) tiles = <div className="b-fp-stack">{MODES.map((md, i) => (
    <button key={md.id} type="button" className={`b-fp-photo${sel(md.id)}`} aria-pressed={pv != null ? pv === md.id : undefined} style={{ ['--i' as any]: i }} onClick={() => onAnswer({ ...answers, mode: md.id })}>
      <img src={MODE_PHOTO[md.id]} alt="" /><span className="b-fp-ico" aria-hidden><BIcon name={md.id === 'walk' ? 'walk' : md.id === 'drive' ? 'car' : 'mountains'} size={20} /></span>
      <span className="b-fp-pt"><b>{md.label}</b><small className="tu-num">{md.sub} · {md.range}</small></span></button>))}</div>;
  else if (st === 3) tiles = <div className="b-fp-list">{DURATIONS[m ?? 'walk'].map((d, i) => (
    <button key={d.label} type="button" className={`b-fp-glass${sel(i)}`} aria-pressed={pv != null ? pv === i : undefined} style={{ ['--i' as any]: i }} onClick={() => onAnswer({ ...answers, dur: i })}>
      <b className="tu-num">{d.label}</b><small className="tu-num">{d.n} places</small><BIcon name="chevronRight" size={18} /></button>))}</div>;
  else if (st === 0) tiles = <div className="b-fp-grid">{AFTER.map((k, i) => (
    <button key={k.id} type="button" className={`b-fp-photo is-sq${sel(i)}`} aria-pressed={pv != null ? pv === i : undefined} style={{ ['--i' as any]: i }} onClick={() => onAnswer({ ...answers, after: i })}>
      <img src={KIND_PHOTO[k.id]} alt="" /><span className="b-fp-pt"><b>{k.label}</b><small className="tu-num">{curateCount({ ...answers, after: i })} places</small></span></button>))}</div>;
  else tiles = <div className="b-fp-grid">{BUDGET.map((b, i) => (
    <button key={b.label} type="button" className={`b-fp-glass is-sq${sel(i)}`} aria-pressed={pv != null ? pv === i : undefined} style={{ ['--i' as any]: i }} onClick={() => onAnswer({ ...answers, budget: i })}>
      <b className="tu-num">{b.label}</b><small>{PRICE_NOTE[i]}</small></button>))}</div>;
  return (
    <section className="b-fp-q" key={st} aria-labelledby="b-fp-q">
      <h1 id="b-fp-q" className="b-fp-title">{findQuestion(answers, st)}</h1>
      <p className="b-fp-help">{HELP(answers, st)}</p>
      {tiles}
      {pv != null && (pv !== -1) && <button type="button" className="b-fp-next" onClick={next}>Next<BIcon name="arrowRight" size={18} /></button>}
      <p className="b-fp-count tu-num" aria-live="polite"><b>{n}</b> {st === 0 ? 'places in Lisbon so far' : 'places match so far'}</p>
    </section>
  );
}

/** Picks ready: a calm hero, the answers as a trail, then photo tiles. */
export function FindPicks({ answers, list, onOpen, picked = [], onToggle, onEdit }: { answers: CurateAnswers; list: CommunityPlace[]; onOpen: (id: string) => void; picked?: string[]; onToggle?: (id: string) => void; /** v5.4.1: tap a chip to go back to that question. */ onEdit?: (st: number) => void }) {
  const m = curateMode(answers);
  return (
    <section className="b-fp-picks">
      <div className="b-fp-ph">
        <CurateRing done={4} total={4} count={list.length} size={84} />
        <div><h1 className="b-fp-title is-s">{list.length} picks for tonight</h1><p className="b-fp-help">Sorted by how often crews like yours booked</p></div>
      </div>
      <p className="b-fp-trail">{findTrail(answers).map(t => onEdit
        ? <button key={t.st} type="button" className="b-fp-chip" onClick={() => onEdit(t.st)} aria-label={`Change: ${t.label}`}>{t.label}</button>
        : <span key={t.st}>{t.label}</span>)}</p>
      <ol className="b-ot-list">{list.map((p, i) => (
        <li key={p.id} className={`b-ot${picked.includes(p.id) ? ' is-picked' : ''}`} style={{ ['--i' as any]: i }}>
          <button type="button" className="b-ot-card has-photo b-fp-pick" onClick={() => onOpen(p.id)} aria-label={`${p.name}, open details`}>
            <img src={p.photos[0]} alt="" /><span className="b-ot-text"><b>{p.name}</b><small className="tu-num">{p.type} · {p.price} · {distanceText(p, m)}</small></span></button>
          {(() => { const on = picked.includes(p.id); return (
            <button type="button" className={`b-fp-add ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={on ? `Remove ${p.name} from the poll` : `Add ${p.name} to the poll`} onClick={() => onToggle?.(p.id)}>
              <span className="b-fp-add-i is-plus"><BIcon name="add" size={18} /></span><span className="b-fp-add-i is-check"><BIcon name="check" size={18} /></span></button>); })()}
        </li>))}</ol>
    </section>
  );
}
