import React, { useRef, useState } from 'react';
import './beyond.css';
import { BIcon } from './icons';
import { CommunityPlace, Review } from '../../lib/beyond';

/* ---------------- RatingStars ---------------- */
export function RatingStars({ value, size = 14, onChange, label = 'Rating' }: { value: number; size?: number; onChange?: (v: number) => void; label?: string }) {
  if (!onChange) return <span className="b-stars" role="img" aria-label={`${value} out of 5`}>{[1, 2, 3, 4, 5].map(i => <BIcon key={i} name="star" size={size} fill={i <= Math.round(value)} className={i <= Math.round(value) ? 'is-on' : ''} />)}</span>;
  return (
    <div className="b-stars is-input" role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" role="radio" aria-checked={value === i} aria-label={`${i} ${i === 1 ? 'star' : 'stars'}`} className={i <= value ? 'is-on' : ''} onClick={() => onChange(i)}>
          <BIcon name="star" size={size} fill={i <= value} />
        </button>
      ))}
    </div>
  );
}

/* ---------------- PlaceGallery ---------------- */
export function PlaceGallery({ photos, credits }: { photos: string[]; credits?: string[] }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const go = (k: number) => { const el = ref.current; if (!el) return; const n = Math.max(0, Math.min(photos.length - 1, k)); el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' }); setI(n); };
  return (
    <div className="b-gallery" aria-roledescription="carousel" aria-label="Photos from TripUp visitors">
      <div className="b-gallery-track" ref={ref} onScroll={e => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} tabIndex={0}
        onKeyDown={e => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1); }}>
        {photos.map((p, k) => <img key={p + k} src={p} alt={`Visitor photo ${k + 1} of ${photos.length}`} />)}
      </div>
      <span className="b-gallery-count tu-glass tu-num" aria-live="polite">{i + 1} of {photos.length}</span>
      {credits?.[i] && <span className="b-gallery-credit tu-glass">{credits[i]}</span>}
      <div className="b-gallery-dots" aria-hidden>{photos.map((_, k) => <span key={k} className={k === i ? 'is-on' : ''} />)}</div>
    </div>
  );
}

/* ---------------- ReviewItem ---------------- */
export function ReviewItem({ r, mine }: { r: Review; mine?: boolean }) {
  return (
    <article className={`b-review ${mine ? 'is-mine b-fadein' : ''}`}>
      <header><span className="b-review-av" aria-hidden>{r.who[0]}</span><span className="b-review-who"><b>{r.who}</b><small>{r.from} · {r.when}</small></span><RatingStars value={r.rating} /></header>
      <p>{r.text}</p>
      {r.photos && <div className="b-review-photos">{r.photos.map(p => <img key={p} src={p} alt="" />)}</div>}
      {mine && <p className="b-review-flag"><BIcon name="globeX" size={14} />Public on this card · you can edit or remove it</p>}
    </article>
  );
}

/* ---------------- PlaceCommunityCard ---------------- */
export function PlaceCommunityCard({ place, reviews, mine, beenThere, onContribute }:
  { place: CommunityPlace; reviews: Review[]; mine?: Review; beenThere?: string; onContribute?: () => void }) {
  return (
    <div className="b-pcc">
      <header className="b-pcc-head">
        <p className="b-overline">{place.type} · {place.area}</p>
        <h1 className="b-display">{place.name}</h1>
        <div className="b-pcc-stats tu-num">
          <div><b><BIcon name="star" size={14} fill />{place.rating.toFixed(1)}</b><small>{place.reviews} reviews</small></div>
          <div><b>{place.beenHere.toLocaleString('en-US')}</b><small>been here</small></div>
          <div><b>{place.crews}</b><small>crews booked</small></div>
          <div><b>{place.price}</b><small>price</small></div>
        </div>
      </header>
      <ul className="b-tags" aria-label="Tags">{place.tags.map(t => <li key={t}>{t}</li>)}</ul>
      {beenThere && (
        <div className="b-been">
          <span className="b-ico is-accent"><BIcon name="pinLine" size={20} /></span>
          <span><b>You were here {beenThere}</b><small>Add photos or a short review for the next crew.</small></span>
          <button type="button" className="b-pillbtn" onClick={onContribute} aria-label="Add photos or a review">Add</button>
        </div>
      )}
      <section className="b-pcc-reviews" aria-label="Reviews">
        <h2 className="b-h2">What people said</h2>
        {mine && <ReviewItem r={mine} mine />}
        {reviews.map(r => <ReviewItem key={r.id} r={r} />)}
      </section>
      <p className="b-fine">Reviews come from people who checked in with TripUp. No followers, no likes.</p>
    </div>
  );
}

/* ---------------- ContributeForm ---------------- */
export type Privacy = 'crew' | 'public';
export function ContributeForm({ photos, picked, onPick, rating, onRating, text, onText, privacy, onPrivacy }:
  { photos: string[]; picked: string[]; onPick?: (p: string) => void; rating: number; onRating?: (n: number) => void; text: string; onText?: (t: string) => void; privacy: Privacy; onPrivacy?: (p: Privacy) => void }) {
  return (
    <div className="b-contrib">
      <p className="b-overline">From your album</p>
      <div className="b-contrib-photos">
        {photos.map(p => { const on = picked.includes(p); return (
          <button key={p} type="button" className={`b-thumbpick ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={on ? 'Photo selected' : 'Select photo'} onClick={() => onPick?.(p)}>
            <img src={p} alt="" /><span className="b-thumbpick-ring">{on && <BIcon name="check" size={14} />}</span>
          </button>
        ); })}
      </div>
      <p className="b-overline">Your rating</p>
      <RatingStars value={rating} onChange={onRating} size={28} />
      <label className="b-textarea"><span className="sr-only">Short review</span>
        <textarea rows={3} maxLength={240} value={text} onChange={e => onText?.(e.target.value)} placeholder="One or two lines for the next crew" />
        <small className="tu-num">{text.length} of 240</small>
      </label>
      <p className="b-overline">Who sees this</p>
      <div className="b-privacy" role="radiogroup" aria-label="Who sees this">
        {([['crew', 'Crew only', 'Stays in the Lisbon Crew album', 'lockX'], ['public', 'Public on the place card', 'Shown as Ari L. Your trip and crew stay private', 'globeX']] as const).map(([id, t, s, ic]) => (
          <button key={id} type="button" role="radio" aria-checked={privacy === id} className={`b-radio ${privacy === id ? 'is-on' : ''}`} onClick={() => onPrivacy?.(id)}>
            <span className="b-ico"><BIcon name={ic} size={20} /></span><span className="b-radio-text"><b>{t}</b><small>{s}</small></span><span className="b-radio-dot" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
