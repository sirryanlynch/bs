import React, { useState } from 'react';
import { useFlow, Top, TopBtn, FlowTabs, Sheet } from './kit';
import { Button } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { ExploreFeed, CurateRing, CurateFlow, CurateCount, curateCount, curateStage, curateStep, curateSkip, curateMode, curateSummary, AddToPoll, distanceText, curateUpTo, CURATE_LABELS, CurateAnswers } from '../../components/beyond/explore';
import { Stepper } from '../../components/beyond/stepper';
import { FilterChips, FilterItem } from '../../components/beyond/filterchips';
import { PlaceGallery, PlaceCommunityCard, ContributeForm } from '../../components/beyond/place';
import { DayTimePicker, CategoryPicker, OptionEditor } from '../../components/beyond/pollnew';
import { COMMUNITY, placeById, reviewsOf, POLLS, DAYS, ALBUM } from '../../lib/beyond';
import { typeLabel } from '../../data/experienceTypes';

/* ---------------- Explore feed (its own tab) ---------------- */
export function ExploreFeedScreen() {
  const { s, d, go, toast } = useFlow();
  const xt = s.exploreXt; const st = curateStage(s.curate);
  const counts = { food: 0, drinks: 0, culture: 0, active: 0 } as Record<string, number>;
  COMMUNITY.forEach(p => counts[p.kind]++);
  const save = (id: string) => { const on = s.saved.includes(id); d({ t: 'set', v: { saved: on ? s.saved.filter(x => x !== id) : [...s.saved, id] } }); toast(on ? 'Removed from Lisbon Crew' : 'Saved to Lisbon Crew'); };
  return (
    <div className="b-scr">
      <div className="b-scroll has-tabs">
        <div className="b-head">
          <div><p className="b-overline">Lisbon · from TripUp travelers</p><h1 className="b-title-xl">Explore</h1></div>
          <div className="b-head-tools"><TopBtn icon="add" label="Start a poll" accent onClick={() => go('poll/new')} /></div>
        </div>
        <button type="button" className="b-curate-card" onClick={() => go('explore/curate')}>
          {st >= 4 ? <CurateRing done={4} total={4} count={6} size={64} /> : <span className="b-curate-ico"><BIcon name="explore" size={24} /></span>}
          <span><b>{st >= 4 ? '6 picks for tonight' : st ? 'Keep going' : 'Find a place for tonight'}</b><small>{st ? curateSummary(s.curate).join(' · ') || 'Any way' : '4 quick steps, 6 picks for the crew'}</small></span>
          <BIcon name="chevronRight" size={20} className="b-muted" />
        </button>
        <FilterChips value={xt} surface="explore" counts={counts} onChange={t => d({ t: 'set', v: { exploreXt: t } })} />
        <div className="b-feed">
          {COMMUNITY.map((p, i) => (
            <FilterItem key={p.id} show={xt === 'all' || p.kind === xt}>
              <div className="b-feed-item" style={{ ['--i' as any]: i }}>
                <ExploreFeed places={[p]} saved={s.saved} inPoll={s.inPoll} mode={curateMode(s.curate)} onSave={save} onOpen={id => go(`place/${id}`)} onAddToPoll={id => { d({ t: 'set', v: { sheetPlace: id } }); go('explore/addpoll'); }} />
              </div>
            </FilterItem>
          ))}
        </div>
        <p className="b-fine">Places appear here when TripUp crews book, review or photograph them. No likes, no followers.</p>
      </div>
      <FlowTabs active="explore" />
    </div>
  );
}
export function AddPollSheetScreen() {
  const { s, d, go, back, toast } = useFlow(); const pl = placeById(s.sheetPlace ?? 'park');
  const open = POLLS.filter(p => p.status === 'open');
  return (<>
    <ExploreFeedScreen />
    <Sheet title="Add to a poll" size="medium" onClose={back}>
      <AddToPoll place={pl.name} polls={open} onPick={id => { d({ t: 'set', v: { inPoll: [...s.inPoll, pl.id] } }); toast(`Added to ${POLLS.find(p => p.id === id)!.title}`); back(); }}
        onNew={() => { d({ t: 'patch', k: 'poll', v: { options: [{ label: pl.name, from: `From Explore · ${pl.rating.toFixed(1)} · ${distanceText(pl)}`, photo: pl.photos[0] }], category: pl.kind, what: '', title: '', seeded: false, sent: false } }); go('poll/new', true); }} />
    </Sheet>
  </>);
}

/* ---------------- Curate: progressive disclosure, 4 steps ---------------- */
export function CurateScreen() {
  const { s, d, go, back } = useFlow(); const a = s.curate; const st = curateStage(a); const step = curateStep(st);
  const m = curateMode(a);
  const list = st >= 4 ? COMMUNITY.filter(p => (m === 'walk' ? p.walk <= 20 : m === 'drive' ? p.drive <= 40 : true)).slice(0, 6) : [];
  const set = (v: CurateAnswers) => d({ t: 'set', v: { curate: v } });
  /* The nav bar's back steps back inside the flow and keeps earlier answers; on step 1 it exits. */
  const navBack = () => (step === 0 ? back() : set(curateUpTo(a, step - 1)));
  return (
    <div className="b-scr">
      <div className={`b-scroll ${st >= 4 ? 'has-cta' : ''}`}>
        <Top title="Find a place" sub={st < 4 ? 'For 7 · tonight' : `${list.length} picks for tonight`} onBack={navBack} />
        <Stepper steps={CURATE_LABELS} current={step} label="Find a place progress" onStep={i => set(curateUpTo(a, i))} onSkip={st < 4 ? () => set(curateSkip(a)) : undefined} />
        {st < 4 ? <><CurateCount answers={a} /><CurateFlow key={step} answers={a} onAnswer={set} /></>
          : (<div className="b-section anim-rise">
              <div className="b-picks-head"><CurateRing done={4} total={4} count={list.length} size={88} /><span><b>All answered</b><small>Sorted by how often crews like yours booked</small><span className="b-curate-trail">{curateSummary(a).join(' · ')}</span></span><button type="button" className="b-textbtn" onClick={() => set({})}>Edit</button></div>
              <div className="b-list">{list.map(p => (
                <button key={p.id} type="button" className="b-listrow" onClick={() => go(`place/${p.id}`)}><img className="b-thumb" src={p.photos[0]} alt="" /><span className="b-listrow-text"><b>{p.name}</b><small className="tu-num">{p.type} · {p.price} · {distanceText(p, m)}</small></span><BIcon name="chevronRight" size={20} className="b-muted" /></button>
              ))}</div>
            </div>)}
      </div>
      {st >= 4 && <div className="b-bottom"><Button label="Start a poll with 3" fullWidth onClick={() => { d({ t: 'patch', k: 'poll', v: { options: list.slice(0, 3).map(p => ({ label: p.name, from: `From Explore · ${distanceText(p, m)}`, photo: p.photos[0] })), category: (['food', 'drinks', 'culture', 'active'] as const)[Math.max(0, a.after ?? 0)], what: '', seeded: false, sent: false, title: '' } }); go('poll/new'); }} /></div>}
    </div>
  );
}

/* ---------------- Place card (community) ---------------- */
export function PlaceScreen({ id }: { id: string }) {
  const { s, d, go, toast, back } = useFlow(); const p = placeById(id);
  const visited = ['taberna', 'park', 'manteigaria', 'lxfactory', 'belem', 'graca'].includes(p.id);
  const saved = s.saved.includes(p.id);
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <PlaceGallery photos={p.photos} credits={p.photos.map((_, i) => `By ${['Lena K.', 'Mara, your crew', 'Dev P.', 'Aiko M.', 'Sam R.'][i % 5]}`)} />
        <div className="b-float-top"><Top light onBack={back} right={<button type="button" className="b-top-btn" aria-label="Share place" onClick={() => toast('Share sheet opens here')}><BIcon name="share" size={20} /></button>} /></div>
        <div className="b-typerow"><span className="b-pill is-on"><BIcon name={p.kind === 'food' ? 'food' : p.kind === 'drinks' ? 'martini' : p.kind === 'active' ? 'waves' : 'bank'} size={14} />{typeLabel(p.kind)}</span><span className="b-help tu-num">{distanceText(p)} · open until 11:00 PM</span></div>
        <PlaceCommunityCard place={p} reviews={reviewsOf(p.id)} mine={s.place.mine && id === 'taberna' ? s.place.mine : undefined} beenThere={visited && !(s.place.mine && id === 'taberna') ? (p.id === 'taberna' ? 'tonight' : 'on Oct 15') : undefined} onContribute={() => go(`place/${p.id}/add`)} />
      </div>
      <div className="b-bottom">
        <Button label={saved ? 'Saved' : 'Save to trip'} icon={saved ? 'check' : undefined} variant="secondary" fullWidth onClick={() => { d({ t: 'set', v: { saved: saved ? s.saved.filter(x => x !== p.id) : [...s.saved, p.id] } }); toast(saved ? 'Removed from Lisbon Crew' : 'Saved to Lisbon Crew'); }} />
        <Button label={s.inPoll.includes(p.id) ? 'In the poll' : 'Add to poll'} fullWidth disabled={s.inPoll.includes(p.id)} onClick={() => { d({ t: 'set', v: { sheetPlace: p.id } }); go('explore/addpoll'); }} />
      </div>
    </div>
  );
}
export function ContributeScreen({ id }: { id: string }) {
  const { s, d, go, toast, back } = useFlow(); const p = placeById(id); const c = s.place;
  const mine = ALBUM.filter(a => a.place === p.name || a.place.startsWith(p.name.split(' ')[0])).map(a => a.src);
  const pool = mine.length >= 4 ? mine.slice(0, 4) : [...mine, ...ALBUM.slice(0, 4 - mine.length).map(a => a.src)];
  const post = () => { d({ t: 'patch', k: 'place', v: { mine: { id: 'mine', who: c.privacy === 'public' ? 'Ari L.' : 'You', from: 'Lisbon Crew', rating: c.rating, when: 'Visited Oct 17, 2026', text: c.text, photos: c.picked } } }); toast(c.privacy === 'public' ? 'Posted to the place card' : 'Saved to your crew album'); go(`place/${id}`, true); };
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title={p.name} sub="Add photos and a review" onBack={back} />
        <ContributeForm photos={pool} picked={c.picked} onPick={ph => d({ t: 'patch', k: 'place', v: { picked: c.picked.includes(ph) ? c.picked.filter(x => x !== ph) : [...c.picked, ph] } })}
          rating={c.rating} onRating={n => d({ t: 'patch', k: 'place', v: { rating: n } })} text={c.text} onText={t => d({ t: 'patch', k: 'place', v: { text: t } })}
          privacy={c.privacy} onPrivacy={v => d({ t: 'patch', k: 'place', v: { privacy: v } })} />
      </div>
      <div className="b-bottom"><Button label={c.privacy === 'public' ? 'Post' : 'Save to album'} fullWidth disabled={!c.rating || (!c.text.trim() && !c.picked.length)} onClick={post} /></div>
    </div>
  );
}

/* ---------------- Polls list (Polls tab) ---------------- */
export function PollsScreen() {
  const { s, go, host } = useFlow();
  const list = s.poll.sent ? [{ id: 'new', title: s.poll.title || `${s.poll.what || typeLabel(s.poll.category)}?`, when: `${DAYS.find(x => x.id === s.poll.day)!.label} · ${s.poll.time}`, status: 'open' as const, voted: 1, options: s.poll.options.map(o => o.label), closes: 'Just sent' }, ...POLLS] : POLLS;
  return (
    <div className="b-scr">
      <div className="b-scroll has-tabs">
        <div className="b-head"><div><p className="b-overline">Lisbon Crew</p><h1 className="b-title-xl">Polls</h1></div><div className="b-head-tools"><TopBtn icon="add" label="Start a poll" accent onClick={() => go('poll/new')} /></div></div>
        {(['open', 'closed'] as const).map(st => (
          <section className="b-section" key={st}>
            <h2 className="b-overline">{st === 'open' ? 'Open' : 'Decided'}</h2>
            <div className="b-list">{list.filter(p => p.status === st).map(p => (
              <button key={p.id} type="button" className="b-listrow" onClick={() => p.id === 'dinner' ? host.exit('closed') : go(p.id === 'new' ? 'poll/new/sent' : 'polls')}>
                <span className={`b-ico ${st === 'open' ? 'is-accent' : ''}`}><BIcon name={st === 'open' ? 'poll' : 'checkCircle'} size={20} /></span>
                <span className="b-listrow-text"><b>{p.title}</b><small className="tu-num">{p.when}</small><small className="tu-num">{st === 'open' ? `${p.voted} of 7 voted · ${p.closes}` : p.closes}</small></span>
                <BIcon name="chevronRight" size={20} className="b-muted" />
              </button>
            ))}</div>
          </section>
        ))}
      </div>
      <FlowTabs active="polls" />
    </div>
  );
}

/* ---------------- Poll composer: any day, any time, any kind of plan ---------------- */
export function PollNewScreen() {
  const { s, d, go, back } = useFlow(); const p = s.poll;
  const day = DAYS.find(x => x.id === p.day)!;
  const auto = `${p.what.trim() || typeLabel(p.category)}, ${day.label.split(',')[0]} at ${p.time}?`;
  const title = p.title || auto;
  const add = () => { if (!p.draft.trim()) return; d({ t: 'patch', k: 'poll', v: { options: [...p.options, { label: p.draft.trim(), from: 'Typed by you' }], draft: '' } }); };
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="New poll" sub="Lisbon Crew" onBack={back} />
        <label className="b-polltitle"><span className="sr-only">Question</span><textarea rows={2} value={title.replace(/ (AM|PM)\b/g, '\u00a0$1')} onChange={e => d({ t: 'patch', k: 'poll', v: { title: e.target.value.replace(/\n/g, ' ').replace(/\u00a0/g, ' ') } })} aria-label="Question" /></label>
        <section className="b-section"><h2 className="b-overline">What</h2><label className="b-search is-flat"><BIcon name="edit" size={20} /><input value={p.what} placeholder="Scuba diving, dinner, a day trip" onChange={e => d({ t: 'patch', k: 'poll', v: { what: e.target.value, title: '' } })} aria-label="What" /></label></section>
        <section className="b-section"><h2 className="b-overline">Type</h2><CategoryPicker value={p.category} onChange={c => d({ t: 'patch', k: 'poll', v: { category: c, title: '' } })} /></section>
        <section className="b-section"><h2 className="b-overline">When</h2><DayTimePicker days={DAYS} day={p.day} time={p.time} onDay={id => d({ t: 'patch', k: 'poll', v: { day: id } })} onTime={t => d({ t: 'patch', k: 'poll', v: { time: t } })} /></section>
        <section className="b-section"><h2 className="b-overline">Options</h2>
          <OptionEditor options={p.options} draft={p.draft} onDraft={t => d({ t: 'patch', k: 'poll', v: { draft: t } })} onAdd={add} onRemove={i => d({ t: 'patch', k: 'poll', v: { options: p.options.filter((_, k) => k !== i) } })} onExplore={() => go('explore')} />
        </section>
        <p className="b-fine tu-num">Closes at 10:00 PM, or when all 7 have voted. Ties go to you.</p>
      </div>
      <div className="b-bottom"><Button label={p.options.length < 2 ? `Add ${2 - p.options.length} more ${p.options.length === 1 ? 'option' : 'options'}` : 'Send to crew · closes 10:00 PM'} fullWidth disabled={p.options.length < 2} onClick={() => { d({ t: 'patch', k: 'poll', v: { sent: true, title } }); go('poll/new/sent', true); }} /></div>
    </div>
  );
}
export function PollSentScreen() {
  const { s, go, P } = useFlow(); const p = s.poll; const day = DAYS.find(x => x.id === p.day)!;
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Poll sent" onBack={() => go('polls')} />
        <div className="b-card b-pollcard anim-rise">
          <p className="b-overline tu-num">{day.label} · {p.time}</p>
          <h2 className="b-h2">{p.title}</h2>
          {p.options.map((o, i) => { const pl = COMMUNITY.find(c => c.name === o.label); const row = <><span className="b-opted-n tu-num">{String.fromCharCode(65 + i)}</span><b>{o.label}</b><span className="tu-num b-muted">{i === 0 ? '1 vote' : '0'}</span>{pl && <BIcon name="chevronRight" size={16} className="b-muted" />}</>;
            return pl ? <button key={o.label} type="button" className="b-pollopt is-link" onClick={() => go(`place/${pl.id}`)} aria-label={`${o.label}, photos and reviews`}>{row}</button> : <div key={o.label} className="b-pollopt">{row}</div>; })}
          <p className="b-help tu-num">You voted A. 6 people got a notification with one-tap voting.</p>
        </div>
      </div>
      <div className="b-bottom"><Button label="See all polls" variant="secondary" fullWidth onClick={() => go('polls')} /><Button label="Done" fullWidth onClick={() => go('polls')} /></div>
    </div>
  );
}
