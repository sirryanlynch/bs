import React, { useState } from 'react';
import { useFlow, Top, TopBtn, FlowTabs, Sheet } from './kit';
import { Button } from '../../components/core';
import { BIcon } from '../../components/beyond/icons';
import { ExploreFeed, CurateRing, CurateFlow, CurateCount, curateCount, curateStage, curateStep, curateSkip, curateMode, curateSummary, AddToPoll, distanceText, curateUpTo, CURATE_LABELS, CurateAnswers } from '../../components/beyond/explore';
import { Stepper } from '../../components/beyond/stepper';
import { FilterChips, FilterItem } from '../../components/beyond/filterchips';
import { PlaceGallery, PlaceCommunityCard, ContributeForm } from '../../components/beyond/place';
import { PollComposer, ComposerPick, defaultTitle } from '../../components/beyond/composer';
import { FindHeader, FindQuestion, FindPicks, findBack, findSkip, findStage, findUpTo } from '../../components/beyond/findplace';
import { COMMUNITY, placeById, reviewsOf, POLLS, DAYS, ALBUM } from '../../lib/beyond';
import { typeLabel } from '../../data/experienceTypes';
import { photo } from '../../lib/data';
import { Face } from '../../components/settle';
import { NextSteps } from '../../components/beyond/elevate';

/** Save on glass. Saved shows a filled Iris bookmark, never a dark fill, so it sits calmly next to the Iris primary. */
export function GlassSave({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  return <button type="button" className={`b-glasssave tu-glass ${saved ? 'is-saved' : ''}`} aria-pressed={saved} onClick={onClick}><BIcon name="bookmark" size={20} fill={saved} />{saved ? 'Saved' : 'Save'}</button>;
}

/* ---------------- Explore feed (its own tab) ---------------- */
export function ExploreFeedScreen() {
  const { s, d, go, toast } = useFlow();
  const xt = s.exploreXt; const st = findStage(s.curate);
  const counts = { food: 0, drinks: 0, culture: 0, active: 0 } as Record<string, number>;
  COMMUNITY.forEach(p => counts[p.kind]++);
  const save = (id: string) => { const on = s.saved.includes(id); d({ t: 'set', v: { saved: on ? s.saved.filter(x => x !== id) : [...s.saved, id] } }); toast(on ? 'Removed from Lisbon Crew' : 'Saved to Lisbon Crew'); };
  return (
    <div className="b-scr">
      <div className="b-scroll has-tabs">
        <div className="b-head">
          {/* v5.4: no + here. Find a place is the one entry on Explore; the floating + keeps New poll everywhere. */}
          <div><p className="b-overline">Lisbon · from TripUp travelers</p><h1 className="b-title-xl">Explore</h1></div>
        </div>
        <button type="button" className="b-findhero" onClick={() => go('explore/curate')}>
          <img src={photo.roofs} alt="" />
          <span className="b-findhero-t"><b>{st >= 4 ? '6 picks for tonight' : st ? 'Keep going' : 'Find a place for tonight'}</b><small className="tu-num">{st ? curateSummary(s.curate).join(' · ') || 'Any way' : '4 quick questions · 6 picks for the crew'}</small></span>
          <span className="b-findhero-go" aria-hidden><BIcon name="arrowRight" size={20} /></span>
        </button>
        <FilterChips value={xt} surface="explore" counts={counts} onChange={t => { d({ t: 'set', v: { exploreXt: t } }); const sc = document.querySelector('.b-scr .b-scroll') as HTMLElement | null; const ch = document.querySelector('.b-scr .b-fchips') as HTMLElement | null; if (sc && ch && sc.scrollTop > ch.offsetTop - 70) sc.scrollTo({ top: ch.offsetTop - 70, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); }} />
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
  const { s, d, go, back } = useFlow(); const a = s.curate; const st = findStage(a);
  const m = curateMode(a);
  const list = st >= 4 ? COMMUNITY.filter(p => (m === 'walk' ? p.walk <= 20 : m === 'drive' ? p.drive <= 40 : true)).slice(0, 6) : [];
  const set = (v: CurateAnswers) => d({ t: 'set', v: { curate: v } });
  // v5.3 quick-add: + on a pick adds it to the poll; with none picked, the top 3 go in.
  const [picked, setPicked] = React.useState<string[]>([]);
  const toggle = (id: string) => setPicked(x => x.includes(id) ? x.filter(y => y !== id) : [...x, id]);
  const chosen = picked.length ? list.filter(p => picked.includes(p.id)) : list.slice(0, 3);
  /* Back steps back one question and keeps earlier answers; on the first question it exits. */
  const navBack = () => (st === 0 ? back() : set(findBack(a)));
  // v5.4.1: a picks chip jumps back to its question; later questions come prefilled with Next.
  const [prev, setPrev] = React.useState<CurateAnswers | undefined>();
  const edit = (k: number) => { setPrev(a); set(findUpTo(a, k)); };
  React.useEffect(() => { if (st >= 4) setPrev(undefined); }, [st]);
  return (
    <div className="b-scr b-cmp">
      <div className="b-cmp-amb" aria-hidden />
      <FindHeader answers={a} onBack={navBack} onSkip={() => set(findSkip(a))} />
      <div className={`b-scroll b-cmp-scroll ${st >= 4 ? 'has-cta' : 'is-q'}`}>
        {st < 4 ? <FindQuestion answers={a} onAnswer={set} prev={prev} /> : <FindPicks answers={a} list={list} onOpen={id => go(`place/${id}`)} picked={picked} onToggle={toggle} onEdit={edit} />}
      </div>
      {st >= 4 && <div className="b-cmp-bottom"><button type="button" className="b-cmp-cta" onClick={() => { d({ t: 'patch', k: 'poll', v: { options: chosen.map(p => ({ label: p.name, from: `${p.type} · ${p.price} · ${distanceText(p, m)}`, photo: p.photos[0] })), category: (['food', 'drinks', 'culture', 'active'] as const)[a.after != null && a.after >= 0 ? a.after : 0], title: '', what: '' } }); go('explore/curate'); }}>{picked.length ? `Start a poll with ${picked.length}` : 'Start a poll with the top 3'}</button>
        <p className="b-cmp-rule" aria-live="polite">{picked.length ? (picked.length === 1 ? 'Add one more, or start with 1 and add more later.' : `Your ${picked.length} picks become the options.`) : 'Tap + to choose, or start with the top 3.'}</p></div>}
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
        <GlassSave saved={saved} onClick={() => { d({ t: 'set', v: { saved: saved ? s.saved.filter(x => x !== p.id) : [...s.saved, p.id] } }); toast(saved ? 'Removed from Lisbon Crew' : 'Saved to Lisbon Crew'); }} />
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
        <div className="b-head"><div><p className="b-overline">Lisbon Crew</p><h1 className="b-title-xl">Polls</h1></div><div className="b-head-tools"><TopBtn icon="add" label="Start a poll" accent onClick={() => go('explore/curate')} /></div></div>
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
  const day = DAYS.find(x => x.id === p.day) ?? DAYS[DAYS.length - 1];
  const title = p.title.trim() || (p.what ? p.what : defaultTitle(day.dow, p.category, p.time));
  const picks: ComposerPick[] = COMMUNITY.map(c => ({ id: c.id, name: c.name, kind: c.kind, photo: c.photos[0], meta: `${c.type} · ${c.price} · ${c.walk ? `${c.walk} min walk` : c.area}` }));
  return (
    <PollComposer value={{ title: p.title || p.what, category: p.category, day: p.day, time: p.time, closes: p.closes, options: p.options }} days={DAYS} today={p.today} picks={picks} onBack={back} onExplore={() => go('explore/curate')}
      onChange={v => d({ t: 'patch', k: 'poll', v: { ...v, ...(v.title !== undefined ? { what: '' } : {}) } })}
      onSend={() => { d({ t: 'patch', k: 'poll', v: { sent: true, title } }); go('poll/new/sent', true); }} />
  );
}
export function PollSentScreen() {
  const { s, go, P, host } = useFlow(); const p = s.poll; const day = DAYS.find(x => x.id === p.day)!;
  const dow = day.label.split(',')[0];
  const title = p.title || (p.what ? `${p.what}, ${dow} at ${p.time}?` : defaultTitle(dow, p.category, p.time));
  const lead = COMMUNITY.find(c => c.name === p.options[0]?.label);
  const cover = p.options[0]?.photo ?? lead?.photos[0];
  const crew = Object.values(P).filter(x => !x.you).slice(0, 6);
  return (
    <div className="b-scr">
      <div className="b-scroll has-cta">
        <Top title="Poll sent" onBack={() => host.exit()} />
        <section className="b-sent anim-rise" aria-label={`Poll sent: ${title}`}>
          <div className="b-sent-photo">{cover && <img src={cover} alt="" />}<span className="b-sent-chip"><BIcon name="check" size={14} />Sent to {crew.length} people</span></div>
          <div className="b-sent-body">
            <p className="b-sent-when tu-num">{day.label} · {p.time}</p>
            <h2 className="b-sent-t">{title}</h2>
            <div className="b-sent-opts">
              {p.options.map((o, i) => { const pl = COMMUNITY.find(c => c.name === o.label); const ph = o.photo ?? pl?.photos[0];
                const inner = <>{ph ? <img src={ph} alt="" /> : <span className="b-sent-ico"><BIcon name="waves" size={20} /></span>}<b>{o.label}</b><span className={`b-sent-v tu-num ${i === 0 ? 'is-you' : ''}`}>{i === 0 ? 'Your vote' : 'No votes yet'}</span></>;
                return pl ? <button key={o.label} type="button" className="b-sent-opt" onClick={() => go(`place/${pl.id}`)} aria-label={`${o.label}, photos and reviews`}>{inner}</button> : <div key={o.label} className="b-sent-opt">{inner}</div>; })}
            </div>
            <div className="b-sent-crew"><span className="b-sent-faces" aria-hidden><Face person={P.ari} size={32} />{crew.map(c => <span key={c.id} className="is-wait"><Face person={c} size={32} /></span>)}</span>
              <span className="tu-num">1 of 7 voted · closes {p.closes}</span></div>
          </div>
        </section>
        <NextSteps steps={['Crew votes from the notification', `Closes ${p.closes}`, `Winner lands on ${dow}`]} />
      </div>
      {/* v5.3.1: the polls list was cut, so Back and Done both leave the flow (they used to loop back to this screen). */}
      <div className="b-bottom"><Button label="Done" fullWidth onClick={() => host.exit()} /></div>
    </div>
  );
}
