import React, { useEffect, useState } from 'react';
import './beyond.css';
import { BIcon, BIconName } from './icons';
import { useReducedMotion } from '../../lib/PrismRoot';
import { FilterChips } from './filterchips';
import { ExperienceType } from '../../data/experienceTypes';
import { CommunityPlace, Mode, MODES, DURATIONS, CURATE_STEPS, AFTER, BUDGET } from '../../lib/beyond';

const signalText = (p: CommunityPlace) => p.signal === 'booked' ? `Booked by ${p.crews} crews this month` : p.signal === 'been' ? `${p.beenHere.toLocaleString('en-US')} been here` : `${p.saves.toLocaleString('en-US')} saves`;
const signalIcon = (p: CommunityPlace): BIconName => p.signal === 'booked' ? 'ticket' : p.signal === 'been' ? 'pinLine' : 'bookmark';
export const distanceText = (p: CommunityPlace, mode: Mode = 'walk') => mode === 'walk' && p.walk <= 25 ? `${p.walk} min walk` : `${p.drive} min drive`;

/* ---------------- ExploreCard ---------------- */
export function ExploreCard({ place, saved, inPoll, mode = 'walk', onSave, onAddToPoll, onOpen }:
  { place: CommunityPlace; saved?: boolean; inPoll?: boolean; mode?: Mode; onSave?: () => void; onAddToPoll?: () => void; onOpen?: () => void }) {
  return (
    <article className="b-xcard" aria-label={place.name}>
      <button type="button" className="b-xcard-media" onClick={onOpen} aria-label={`Open ${place.name}: photos and reviews`}>
        <img src={place.photos[0]} alt="" loading="lazy" />
        <span className="b-xcard-count tu-glass"><BIcon name="images" size={14} />{place.photos.length + 20}</span>
      </button>
      <div className="b-xcard-body">
        <button type="button" className="b-xcard-title" onClick={onOpen}>
          <b>{place.name}</b>
          <span className="b-xcard-meta tu-num"><span>{place.type}</span><span>{place.price}</span><span>{distanceText(place, mode)}</span></span>
        </button>
        <p className="b-xcard-signal tu-num"><BIcon name={signalIcon(place)} size={14} />{signalText(place)}<span className="b-dot" aria-hidden />
          <BIcon name="star" size={14} fill />{place.rating.toFixed(1)}</p>
        <p className="b-xcard-quote">“{place.snippet.text}” <span>{place.snippet.who}</span></p>
        <div className="b-xcard-actions">
          <button type="button" className={`b-act ${saved ? 'is-on' : ''}`} aria-pressed={!!saved} onClick={onSave}><BIcon name="bookmark" size={20} fill={saved} />{saved ? 'Saved to trip' : 'Save to trip'}</button>
          <button type="button" className={`b-act is-accent ${inPoll ? 'is-on' : ''}`} onClick={onAddToPoll} disabled={inPoll}><BIcon name={inPoll ? 'check' : 'poll'} size={20} />{inPoll ? 'In the poll' : 'Add to poll'}</button>
        </div>
      </div>
    </article>
  );
}

/* ---------------- ExploreFilters: the shared experience-type chips (no Travel in Explore) ---------------- */
export { FilterChips as ExploreFilters } from './filterchips';

/* ---------------- ExploreFeed ---------------- */
export function ExploreFeed({ places, saved = [], inPoll = [], mode, onSave, onAddToPoll, onOpen }:
  { places: CommunityPlace[]; saved?: string[]; inPoll?: string[]; mode?: Mode; onSave?: (id: string) => void; onAddToPoll?: (id: string) => void; onOpen?: (id: string) => void }) {
  if (!places.length) return <p className="b-empty-line">Nothing matches all of these. Turn one filter off.</p>;
  return (
    <div className="b-feed">
      {places.map((p, i) => (
        <div key={p.id} className="b-feed-item" style={{ ['--i' as any]: i }}>
          <ExploreCard place={p} mode={mode} saved={saved.includes(p.id)} inPoll={inPoll.includes(p.id)} onSave={() => onSave?.(p.id)} onAddToPoll={() => onAddToPoll?.(p.id)} onOpen={() => onOpen?.(p.id)} />
        </div>
      ))}
    </div>
  );
}

/* ---------------- CurateRing ---------------- */
export function CurateRing({ done, total, count, size = 128 }: { done: number; total: number; count: number; size?: number }) {
  const reduce = useReducedMotion();
  const r = size / 2 - 8, c = 2 * Math.PI * r;
  const [shown, setShown] = useState(count);
  useEffect(() => {
    if (reduce) { setShown(count); return; }
    let raf = 0; const from = shown, t0 = performance.now();
    const tick = (t: number) => { const k = Math.min(1, (t - t0) / 520); setShown(Math.round(from + (count - from) * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [count, reduce]);
  return (
    <div className="b-ring" style={{ width: size, height: size }} role="img" aria-label={`${count} places match, ${done} of ${total} questions answered`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="b-ring-track" />
        <circle cx={size / 2} cy={size / 2} r={r} className="b-ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - done / total)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="b-ring-n"><b className="tu-num">{shown}</b><span>{shown === 1 ? 'place' : 'places'}</span></div>
    </div>
  );
}

/* ---------------- CurateFlow: progressive disclosure ---------------- */
/** mode 'any' and -1 values mean the step was skipped (Skip applies the default: any). */
export type CurateAnswers = { mode?: Mode | 'any'; dur?: number; after?: number; budget?: number };
export const curateMode = (a: CurateAnswers): Mode | undefined => (a.mode && a.mode !== 'any' ? a.mode : undefined);
export const curateCount = (a: CurateAnswers, total = 120) => {
  if (!a.mode) return total;
  if (a.dur == null || a.dur < 0 || a.mode === 'any') { if (a.after == null) return a.mode === 'walk' ? 48 : a.mode === 'drive' ? 96 : a.mode === 'any' ? total : 31; }
  let n = a.mode !== 'any' && a.dur != null && a.dur >= 0 ? DURATIONS[a.mode][a.dur].n : a.mode === 'walk' ? 48 : a.mode === 'drive' ? 96 : a.mode === 'any' ? 61 : 31;
  if (a.after != null && a.after >= 0) n = Math.max(4, Math.round(n * AFTER[a.after].f));
  if (a.budget != null) n = Math.max(6, Math.round(n * (a.budget >= 0 ? BUDGET[a.budget].f : 1) * 0.5));
  return n;
};
/** Keep only the first i answers, for jumping back to step i. */
export const curateUpTo = (a: CurateAnswers, i: number): CurateAnswers => ({ ...(i > 0 ? { mode: a.mode } : {}), ...(i > 1 ? { dur: a.dur } : {}), ...(i > 1 && a.after != null ? { after: a.after } : {}) });
/** The four Stepper steps. Step 3 holds two short questions (type, then price); step 4 is Picks ready. */
export const CURATE_LABELS = ['Getting there', 'How long', 'What kind', 'Picks ready'];
/** Question stage (0 to 4) to Stepper step (0 to 3). */
export const curateStep = (st: number) => (st <= 1 ? st : st < 4 ? 2 : 3);
/** Skip applies the default (any) and advances one Stepper step. */
export const curateSkip = (a: CurateAnswers): CurateAnswers => { const st = curateStage(a); return st === 0 ? { mode: 'any', dur: -1 } : st === 1 ? { ...a, dur: -1 } : { ...a, after: a.after ?? -1, budget: -1 }; };
export const curateStage = (a: CurateAnswers) => (a.mode == null ? 0 : a.dur == null ? 1 : a.after == null ? 2 : a.budget == null ? 3 : 4);
export const curateSummary = (a: CurateAnswers) => [a.mode && (a.mode === 'any' ? 'Any way' : MODES.find(m => m.id === a.mode)!.label), a.mode && a.mode !== 'any' && a.dur != null && a.dur >= 0 && DURATIONS[a.mode][a.dur].label, a.after != null && a.after >= 0 && AFTER[a.after].label, a.budget != null && a.budget >= 0 && BUDGET[a.budget].label].filter(Boolean) as string[];

/** The questions, one step at a time. Step 1 sets how you travel, step 2 tightens time to match (nobody is assumed to walk),
 * step 3 asks type and price on one screen. Picks ready is the result. */
export function CurateFlow({ answers, onAnswer }: { answers: CurateAnswers; onAnswer: (a: CurateAnswers) => void }) {
  const st = curateStage(answers);
  const [xt, setXt] = useState<ExperienceType>(answers.after != null && answers.after >= 0 ? AFTER[answers.after].id : 'food');
  const [price, setPrice] = useState(answers.budget != null && answers.budget >= 0 ? answers.budget : 1);
  if (st >= 4) return null;
  if (st >= 2) {
    const after = AFTER.findIndex(x => x.id === xt); const next = { ...answers, after, budget: price };
    return (
      <section className="b-curate anim-rise" key="kind" aria-labelledby="b-curate-q">
        <div className="b-curate-head"><h2 id="b-curate-q">{CURATE_STEPS[2]}</h2></div>
        <p className="b-help">Pick one, then set a price.</p>
        <FilterChips value={xt} onChange={setXt} surface="explore" noAll label="Type" />
        <h3 className="b-overline">{CURATE_STEPS[3]}</h3>
        <div className="b-seg4" role="radiogroup" aria-label="Price per person">
          {BUDGET.map((b, i) => <button key={b.label} type="button" role="radio" aria-checked={price === i} className={`b-fchip ${price === i ? 'is-on' : ''}`} onClick={() => setPrice(i)}><span className="tu-num">{b.label}</span></button>)}
        </div>
        <button type="button" className="b-curate-go" onClick={() => onAnswer(next)}>Show {curateCount(next)} places</button>
      </section>
    );
  }
  const opts: { label: string; sub?: string; n?: number; icon?: BIconName }[] =
    st === 0 ? MODES.map(m => ({ label: m.label, sub: `${m.sub} · ${m.range}`, icon: (m.id === 'walk' ? 'walk' : m.id === 'drive' ? 'car' : 'mountains') as BIconName }))
    : DURATIONS[curateMode(answers) ?? 'walk'].map(d => ({ label: d.label, n: d.n }));
  const q = st === 1 ? (answers.mode === 'walk' ? 'How far are you happy to walk?' : answers.mode === 'drive' ? 'How long a drive?' : 'How much of the day?') : CURATE_STEPS[0];
  const pick = (i: number) => onAnswer(st === 0 ? { mode: MODES[i].id } : { ...answers, dur: i });
  return (
    <section className="b-curate anim-rise" key={st} aria-labelledby="b-curate-q">
      <div className="b-curate-head"><h2 id="b-curate-q">{q}</h2></div>
      <p className="b-help">{st === 0 ? 'This sets how far we look.' : answers.mode === 'drive' ? 'Door to door, at this time of day.' : answers.mode === 'walk' ? 'From Rua da Rosa, where you are now.' : 'Includes getting there and back.'}</p>
      <div className={`b-curate-opts ${st === 0 ? 'is-modes' : ''}`}>
        {opts.map((o, i) => (
          <button key={o.label} type="button" className="b-curate-opt" onClick={() => pick(i)}>
            {o.icon && <span className="b-curate-ico"><BIcon name={o.icon} size={24} /></span>}
            <span className="b-curate-txt"><b>{o.label}</b>{o.sub && <small>{o.sub}</small>}</span>
            {o.n != null && <small className="b-curate-n tu-num">{o.n} places</small>}
          </button>
        ))}
      </div>
    </section>
  );
}

/** Live count pill under the stepper: the count updates with each answer. */
export function CurateCount({ answers }: { answers: CurateAnswers }) {
  const n = curateCount(answers); const m = curateMode(answers);
  const txt = !answers.mode || answers.mode === 'any' ? `${n} places in Lisbon so far` : answers.dur != null && answers.dur >= 0 && answers.after == null && m ? (m === 'destination' ? `${n} places, ${DURATIONS[m][answers.dur].label.toLowerCase()}` : `${n} places within a ${DURATIONS[m][answers.dur].label} ${m}`) : `${n} places so far`;
  return <p className="b-countpill tu-num" aria-live="polite">{txt}</p>;
}

/* ---------------- AddToPoll (sheet content) ---------------- */
export function AddToPoll({ place, polls, onPick, onNew }: { place: string; polls: { id: string; title: string; when: string; voted: number; options: string[] }[]; onPick?: (id: string) => void; onNew?: () => void }) {
  return (
    <div className="b-atp">
      <p className="b-help">Add <b>{place}</b> as an option. Everyone gets a nudge to look.</p>
      <ul className="b-list">
        {polls.map(p => (
          <li key={p.id}><button type="button" className="b-listrow" onClick={() => onPick?.(p.id)}>
            <span className="b-ico is-accent"><BIcon name="poll" size={20} /></span>
            <span className="b-listrow-text"><b>{p.title}</b><small className="tu-num">{p.options.length} options · {p.voted} of 7 voted · {p.when}</small></span>
            <BIcon name="add" size={20} className="b-accent" />
          </button></li>
        ))}
        <li><button type="button" className="b-listrow" onClick={onNew}>
          <span className="b-ico"><BIcon name="add" size={20} /></span>
          <span className="b-listrow-text"><b>Start a new poll</b><small>With {place} as the first option</small></span>
          <BIcon name="chevronRight" size={20} className="b-muted" />
        </button></li>
      </ul>
    </div>
  );
}
