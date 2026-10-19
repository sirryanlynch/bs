import React, { useEffect, useRef } from 'react';
import './beyond.css';
import { BIcon } from './icons';
import { Avatar } from '../core';
import { Toggle } from '../core';
import type { Person } from '../../lib/data';
import { AlbumPhoto, DAYS } from '../../lib/beyond';
import { AVATAR } from '../../assets/solver-assets';

/* ---------------- PhotoGrid ---------------- */
/** v5.3: each photo carries a small face for who took it. Tapping the face shows only that person's photos. */
export function PhotoGrid({ photos, groupBy = 'day', onOpen, fresh = [], onPerson, names = {} }: { photos: AlbumPhoto[]; groupBy?: 'day' | 'place'; onOpen?: (id: string) => void; fresh?: string[]; onPerson?: (who: string) => void; names?: Record<string, string> }) {
  const groups: [string, string, AlbumPhoto[]][] = [];
  if (groupBy === 'day') [...DAYS].reverse().forEach(d => { const ps = photos.filter(p => p.day === d.id); if (ps.length) groups.push([d.id, d.label, ps]); });
  else Array.from(new Set(photos.map(p => p.place))).forEach(pl => groups.push([pl, pl, photos.filter(p => p.place === pl)]));
  return (
    <div className="b-pgrid">
      {groups.map(([k, label, ps]) => (
        <section key={k} aria-label={label}>
          <h3 className="b-pgrid-head"><span>{label}</span><small className="tu-num">{ps.length} {ps.length === 1 ? 'photo' : 'photos'}{groupBy === 'day' ? (n => ` · ${n} ${n === 1 ? 'place' : 'places'}`)(new Set(ps.map(p => p.place)).size) : ''}</small></h3>
          <div className="b-pgrid-cells">
            {ps.map((p, i) => (
              <div key={p.id} className={`b-pcell ${i === 0 && ps.length > 2 ? 'is-big' : ''} ${fresh.includes(p.id) ? 'is-fresh' : ''}`} style={{ ['--i' as any]: i }}>
                <button type="button" className="b-pcell-open" onClick={() => onOpen?.(p.id)} aria-label={`Photo at ${p.place}, ${p.time}${names[p.who] ? `, by ${names[p.who]}` : ''}`}>
                  <img src={p.src} alt="" loading="lazy" /></button>
                {p.publicShared && <span className="b-pcell-flag tu-glass"><BIcon name="globeX" size={12} /></span>}
                {onPerson && AVATAR[p.who] && <button type="button" className="b-pcell-who" onClick={() => onPerson(p.who)} aria-label={`Show ${names[p.who] ?? p.who}'s photos`}><img src={AVATAR[p.who]} alt="" /></button>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------------- PhotoViewer ---------------- */
export function PhotoViewer({ photos, index, onIndex, onClose, people }: { photos: AlbumPhoto[]; index: number; onIndex?: (i: number) => void; onClose?: () => void; people: Record<string, Person> }) {
  const p = photos[index]; const day = DAYS.find(d => d.id === p.day);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  const go = (k: number) => onIndex?.(Math.max(0, Math.min(photos.length - 1, k)));
  return (
    <div className="b-viewer" role="dialog" aria-modal="true" aria-label="Photo" tabIndex={-1} ref={ref}
      onKeyDown={e => { if (e.key === 'ArrowRight') go(index + 1); if (e.key === 'ArrowLeft') go(index - 1); if (e.key === 'Escape') onClose?.(); }}>
      <div className="b-viewer-top">
        <button type="button" className="b-round is-dark" onClick={onClose} aria-label="Close photo"><BIcon name="close" size={20} /></button>
        <span className="tu-num">{index + 1} of {photos.length}</span>
        <button type="button" className="b-round is-dark" aria-label="Share photo"><BIcon name="share" size={20} /></button>
      </div>
      <img key={p.id} src={p.src} alt={`At ${p.place}`} className="b-viewer-img b-fadein" />
      <button type="button" className="b-viewer-nav is-prev" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous photo"><BIcon name="chevronLeft" size={24} /></button>
      <button type="button" className="b-viewer-nav is-next" onClick={() => go(index + 1)} disabled={index === photos.length - 1} aria-label="Next photo"><BIcon name="chevronRight" size={24} /></button>
      <div className="b-viewer-meta">
        <Avatar person={people[p.who]} size={36} ring="none" />
        <div><b>{people[p.who].you ? 'You' : people[p.who].name}</b><small className="tu-num">{day?.label} · {p.time}</small><small><BIcon name="pin" size={14} />{p.place}</small></div>
        {p.publicShared && <span className="b-pill is-glass"><BIcon name="globeX" size={14} />On place card</span>}
      </div>
    </div>
  );
}

/* ---------------- UploadSheet pieces ---------------- */
export function UploadPicker({ roll, selected, onToggle }: { roll: { id: string; src: string; time: string }[]; selected: string[]; onToggle?: (id: string) => void }) {
  return (
    <div className="b-roll" role="group" aria-label="Recent photos on this phone">
      {roll.map(r => { const n = selected.indexOf(r.id); const on = n >= 0; return (
        <button key={r.id} type="button" className={`b-rollcell ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={`Photo taken ${r.time}${on ? ', selected' : ''}`} onClick={() => onToggle?.(r.id)}>
          <img src={r.src} alt="" /><span className="b-rollcell-n tu-num">{on ? n + 1 : ''}</span><small className="tu-num">{r.time}</small>
        </button>
      ); })}
    </div>
  );
}
export function UploadTagger({ items, place, places, onPlace, day, publicIds, onPublic }:
  { items: { id: string; src: string }[]; place: string; places: string[]; onPlace?: (p: string) => void; day: string; publicIds: string[]; onPublic?: (id: string) => void }) {
  return (
    <div className="b-tagger">
      <div className="b-tagger-row"><span className="b-ico"><BIcon name="calendar" size={20} /></span><span><small>Day</small><b>{day}</b></span></div>
      <div className="b-tagger-places" role="radiogroup" aria-label="Place">
        {places.map(p => <button key={p} type="button" role="radio" aria-checked={place === p} className={`b-chip ${place === p ? 'is-on' : ''}`} onClick={() => onPlace?.(p)}><BIcon name="pin" size={20} />{p}</button>)}
      </div>
      <p className="b-overline">Also share to the place's public card</p>
      <ul className="b-tagger-list">
        {items.map((it, i) => (
          <li key={it.id}><img src={it.src} alt="" /><span><b>Photo {i + 1}</b><small>{publicIds.includes(it.id) ? 'Album and public card' : 'Album only'}</small></span>
            <Toggle checked={publicIds.includes(it.id)} label={`Share photo ${i + 1} to the public card`} onChange={() => onPublic?.(it.id)} /></li>
        ))}
      </ul>
      <p className="b-fine">Public photos show your first name and last initial..</p>
    </div>
  );
}
