import React from 'react';
import './beyond.css';
import { BIcon } from './icons';
import { AvatarStack } from '../core';
import type { Person } from '../../lib/data';

/* ---------------- RecapCard (shareable, 9:16) ---------------- */
export function RecapCard({ title, dates, cover, photos, stats, people }:
  { title: string; dates: string; cover: string; photos: string[]; stats: [string, string][]; people: Person[] }) {
  return (
    <article className="b-recap" aria-label={`${title} recap card`}>
      <img className="b-recap-cover" src={cover} alt="" />
      <div className="b-recap-shade" />
      <div className="b-recap-top"><span className="b-recap-brand">TripUp</span><span className="tu-num">{dates}</span></div>
      <div className="b-recap-body">
        <p className="b-recap-eyebrow">That was</p>
        <h2 className="b-recap-title">{title}</h2>
        <div className="b-recap-strip">{photos.slice(0, 4).map(p => <img key={p} src={p} alt="" />)}</div>
        <dl className="b-recap-stats">{stats.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="tu-num">{v}</dd></div>)}</dl>
        <div className="b-recap-foot"><AvatarStack people={people} size={24} max={7} /><span>All squared up</span></div>
      </div>
    </article>
  );
}

/* ---------------- PlacesMap ---------------- */
/** A drawn map of Lisbon: the river, the hills as soft contours, and a numbered pin for each place the crew went. */
export type Pin = { n: number; name: string; x: number; y: number; day: string };
/** A small illustrated map. Pins are numbered markers, not separate targets (they sit too close to tap); the whole map opens the places list. */
export function PlacesMap({ pins, active, onOpen }: { pins: Pin[]; active?: number; onOpen?: () => void }) {
  return (
    <div className={`b-map ${onOpen ? 'is-link' : ''}`} role={onOpen ? 'button' : 'img'} tabIndex={onOpen ? 0 : undefined} onClick={onOpen} onKeyDown={e => { if (onOpen && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onOpen(); } }} aria-label={`Map of ${pins.length} places visited${onOpen ? ', open the list' : ''}`}>
      <svg viewBox="0 0 362 220" aria-hidden>
        <path className="b-map-land" d="M0 0H362V150C320 160 300 140 250 152C200 165 170 150 120 168C80 182 40 170 0 186Z" />
        <path className="b-map-river" d="M0 186C40 170 80 182 120 168C170 150 200 165 250 152C300 140 320 160 362 150V220H0Z" />
        <path className="b-map-contour" d="M150 40C190 30 230 50 236 80C240 110 200 120 170 110C140 100 120 60 150 40Z" />
        <path className="b-map-contour" d="M60 70C90 60 110 80 104 100C98 120 70 120 56 104C46 92 44 76 60 70Z" />
        <path className="b-map-route" d={`M${pins.map(p => `${p.x} ${p.y}`).join(' L')}`} />
        <text x="300" y="196" className="b-map-label">Tejo</text>
      </svg>
      {pins.map(p => (
        <span key={p.n} aria-hidden className={`b-map-pin tu-num ${active === p.n ? 'is-on' : ''}`} style={{ left: `${(p.x / 362) * 100}%`, top: `${(p.y / 220) * 100}%` }}>{p.n}</span>
      ))}
    </div>
  );
}

export function StatTile({ label, value, icon }: { label: string; value: string; icon: React.ComponentProps<typeof BIcon>['name'] }) {
  return <div className="b-stat"><BIcon name={icon} size={20} /><b className="tu-num">{value}</b><small>{label}</small></div>;
}
