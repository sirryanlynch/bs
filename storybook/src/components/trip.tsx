import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Icon, IconName, AppMark } from './Icon';
import { Avatar, AvatarStack, BalanceChip, Button, IconButton, TextField } from './core';
import type { Person } from '../lib/data';
import { useReducedMotion } from '../lib/PrismRoot';

/* ---------------- TripCard ---------------- */
export function TripCard({ name, dates, photo, people, balance, status = 'upcoming', nextUp, size = 'hero' }:
  { name: string; dates: string; photo: string; people: Person[]; balance?: number; status?: 'upcoming' | 'live' | 'past' | 'planning'; nextUp?: string; size?: 'hero' | 'compact' }) {
  const statusText = { upcoming: 'In 12 days', live: 'Happening now', past: 'Wrapped', planning: 'Planning' }[status];
  if (size === 'compact') {
    return (
      <article className="p-tripc tu-surface">
        <img src={photo} alt="" className="p-tripc-img" />
        <div className="p-tripc-body">
          <h3 className="p-tripc-name">{name}</h3>
          <p className="p-tripc-dates">{dates}</p>
          <div className="p-tripc-foot"><AvatarStack people={people} size={24} max={4} />{balance != null && <BalanceChip amount={balance} size="small" />}</div>
        </div>
      </article>
    );
  }
  return (
    <article className={`p-trip is-${status}`} aria-label={`${name}, ${dates}`}>
      <img src={photo} alt="" className="p-trip-img" />
      <div className="p-trip-shade" aria-hidden />
      <div className="p-trip-top">
        <span className={`p-trip-status tu-glass ${status === 'live' ? 'is-live' : ''}`}>{status === 'live' && <span className="p-live-dot anim-move" />}{statusText}</span>
        <AvatarStack people={people} size={28} max={4} />
      </div>
      <div className="p-trip-bottom">
        <p className="p-trip-dates">{dates}</p>
        <h2 className="p-trip-name">{name}</h2>
        {(nextUp || balance != null) && (
          <div className="p-trip-strip tu-glass">
            {nextUp && <span className="p-trip-next"><Icon name="clock" size={14} />{nextUp}</span>}
            {balance != null && <BalanceChip amount={balance} size="small" />}
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------------- PlaceCard ---------------- */
export function PlaceCard({ name, area, kind, price, rating, photo, note, saved, layout = 'tall', inPoll }:
  { name: string; area: string; kind: string; price: string; rating: number; photo: string; note?: string; saved?: boolean; layout?: 'tall' | 'row'; inPoll?: boolean }) {
  const [s, setS] = useState(!!saved);
  if (layout === 'row') {
    return (
      <article className="p-placerow">
        <img src={photo} alt="" />
        <div className="p-placerow-text"><h4>{name}</h4><p>{kind} · {area} · {price}</p>{note && <p className="p-placerow-note">{note}</p>}</div>
        <span className="p-placerow-rating tu-num">{rating.toFixed(1)}</span>
      </article>
    );
  }
  return (
    <article className="p-place tu-surface">
      <div className="p-place-media">
        <img src={photo} alt="" />
        <button type="button" className={`p-place-save tu-glass ${s ? 'is-on' : ''}`} aria-pressed={s} aria-label={s ? 'Saved to trip' : 'Save to trip'} onClick={() => setS(!s)}>
          <Icon name={s ? 'check' : 'plus'} size={20} />
        </button>
        {inPoll && <span className="p-place-flag tu-glass"><Icon name="poll" size={14} />In poll</span>}
      </div>
      <div className="p-place-body">
        <h4 className="p-place-name">{name}</h4>
        <p className="p-place-meta"><span>{kind}</span><span>{area}</span><span className="tu-num">{price}</span><span className="tu-num">★ {rating.toFixed(1)}</span></p>
        {note && <p className="p-place-note">{note}</p>}
      </div>
    </article>
  );
}

/* ---------------- ItineraryItem + Timeline ---------------- */
export type ItinItem = { time: string; title: string; place?: string; icon: IconName; kind?: 'plan' | 'decided' | 'tentative' | 'now'; photo?: string; decidedBy?: string; people?: Person[]; cost?: string };
export function ItineraryItem({ time, title, place, icon, kind = 'plan', photo, decidedBy, people, cost, last }: ItinItem & { last?: boolean }) {
  return (
    <li className={`p-itin is-${kind}`}>
      <span className="p-itin-time tu-num">{time}</span>
      <span className="p-itin-rail" aria-hidden><span className="p-itin-node"><Icon name={icon} size={14} /></span>{!last && <span className="p-itin-line" />}</span>
      <div className={`p-itin-card ${kind === 'decided' ? 'tu-surface' : ''}`}>
        {kind === 'decided' && <span className="p-itin-won"><Icon name="sparkle" size={14} />Won the poll{decidedBy ? ` · ${decidedBy}` : ''}</span>}
        {kind === 'now' && <span className="p-itin-nowtag"><span className="p-live-dot anim-move" />Now</span>}
        {kind === 'tentative' && <span className="p-itin-tent">Not booked</span>}
        <div className="p-itin-main">
          <div className="p-itin-text"><h4>{title}</h4>{place && <p><Icon name="pin" size={14} />{place}</p>}</div>
          {photo && <img src={photo} alt="" className="p-itin-photo" />}
        </div>
        {(people || cost) && <div className="p-itin-foot">{people && <AvatarStack people={people} size={24} max={6} />}{cost && <span className="tu-num">{cost}</span>}</div>}
      </div>
    </li>
  );
}
export function Timeline({ day, date, items }: { day: string; date: string; items: ItinItem[] }) {
  return (
    <section className="p-timeline">
      <header className="p-timeline-head"><h3>{day}</h3><span>{date}</span></header>
      <ol>{items.map((it, i) => <ItineraryItem key={i} {...it} last={i === items.length - 1} />)}</ol>
    </section>
  );
}

/* ---------------- MemberPicker ---------------- */
export function MemberPicker({ people, selected, mode = 'split', onChange }: { people: Person[]; selected?: string[]; mode?: 'split' | 'invite' | 'payer'; onChange?: (ids: string[]) => void }) {
  const [sel, setSel] = useState<string[]>(selected ?? people.map(p => p.id));
  useEffect(() => { if (selected) setSel(selected); }, [selected?.join()]);
  const toggle = (id: string) => {
    const next = mode === 'payer' ? [id] : sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id];
    setSel(next); onChange?.(next);
  };
  return (
    <div className="p-mpick" role="group" aria-label={mode === 'payer' ? 'Who paid' : 'Split between'}>
      {people.map(p => {
        const on = sel.includes(p.id);
        return (
          <button type="button" key={p.id} className={`p-mpick-item ${on ? 'is-on' : 'is-off'}`} aria-pressed={on} onClick={() => toggle(p.id)}>
            <span className="p-mpick-av"><Avatar person={p} size={44} ring="none" /><span className="p-mpick-tick" aria-hidden>{on ? <Icon name="check" size={14} /> : <Icon name="minus" size={14} />}</span></span>
            <span className="p-mpick-name">{p.you ? 'You' : p.name}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- InviteSheet body ---------------- */
export function InviteContent({ trip = 'Lisbon Crew', link = 'tripup.app/j/lisbon-crew-742', invited }: { trip?: string; link?: string; invited?: Person }) {
  return (
    <div className="p-invite">
      <h2 className="p-sheet-title">Invite to <span className="p-display-inline">{trip}</span></h2>
      <p className="p-sheet-sub">Scan or share. No app needed.</p>
      <div className="p-invite-qr tu-surface">
        <QRCodeSVG value={`https://${link}`} size={176} level="M" bgColor="transparent" fgColor="currentColor" />
        <span className="p-invite-qr-mark"><AppMark size={36} /></span>
      </div>
      <div className="p-invite-link tu-surface"><Icon name="link" size={20} /><span className="tu-num">{link}</span><button type="button" className="p-invite-copy">Copy</button></div>
      <div className="p-invite-actions">
        <Button label="Share link" icon="share" variant="primary" fullWidth />
      </div>
      {invited && (
        <div className="p-invite-joined anim-fade">
          <Avatar person={invited} size={36} ring="none" />
          <span><b>{invited.name} joined</b><small>Added to splits from today</small></span>
          <Icon name="check" size={20} />
        </div>
      )}
    </div>
  );
}

/* ---------------- ExploreRing ---------------- */
export function ExploreRing({ visited = 7, total = 12, label = 'Lisbon explored', size = 132 }: { visited?: number; total?: number; label?: string; size?: number }) {
  const reduce = useReducedMotion();
  const pct = total ? visited / total : 0;
  const r = size / 2 - 9, c = 2 * Math.PI * r;
  const [p, setP] = useState(reduce ? pct : 0);
  useEffect(() => { const t = setTimeout(() => setP(pct), reduce ? 0 : 80); return () => clearTimeout(t); }, [pct, reduce]);
  const done = visited >= total;
  return (
    <div className={`p-ring ${done ? 'is-done' : ''}`} style={{ width: size }} role="img" aria-label={`${label}: ${visited} of ${total} places`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="ringSpectrum" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-celebration-text-blush)" /><stop offset=".35" stopColor="var(--color-celebration-text-apricot)" />
            <stop offset=".65" stopColor="var(--color-celebration-text-mint)" /><stop offset="1" stopColor="var(--color-celebration-text-sky)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} className="p-ring-track" />
        <circle cx={size / 2} cy={size / 2} r={r} className="p-ring-fill" stroke={done ? 'url(#ringSpectrum)' : undefined}
          strokeDasharray={c} strokeDashoffset={c * (1 - p)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div className="p-ring-center"><span className="p-ring-num tu-num">{visited}<small>/{total}</small></span><span className="p-ring-label">{done ? 'All seen' : 'places'}</span></div>
      <p className="p-ring-caption">{label}</p>
    </div>
  );
}
