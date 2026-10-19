import React from 'react';
import { Render3D, type RenderName } from '../Icon';
import { Button } from '../core';
import './emptystate.css';

/**
 * v5.4 EmptyStates: one clear action, plain copy, photo-led or glass. Used where a screen has nothing yet:
 * a new trip's Plan, Photos and Money, Notifications, Up next and Trips with no trips.
 *   art="photos": a fanned stack of the trip's cover shots with a glass "+" frame on top (Photos, Trips).
 *   art="render": a Prism 3D render floating over a soft Iris glow (Plan, Money, Notifications).
 */
export function EmptyState({ art = 'render', photos = [], render = 'itinerary', title, body, action, onAction, secondary, onSecondary, compact }: {
  art?: 'photos' | 'render'; photos?: string[]; render?: RenderName; title: string; body: string;
  action?: string; onAction?: () => void; secondary?: string; onSecondary?: () => void; compact?: boolean;
}) {
  return (
    <div className={`b-empty ${compact ? 'is-compact' : ''}`}>
      {art === 'photos'
        ? <div className="b-empty-fan" aria-hidden>{photos.slice(0, 3).map((p, i) => <img key={i} src={p} alt="" style={{ ['--k' as any]: i - 1 }} />)}<span className="b-empty-plus">+</span></div>
        : <div className="b-empty-art" aria-hidden><span className="b-empty-glow" /><Render3D name={render} size={compact ? 96 : 132} /></div>}
      <h2 className="b-empty-title">{title}</h2>
      <p className="b-empty-body">{body}</p>
      {action && <div className="b-empty-act"><Button label={action} onClick={onAction} /></div>}
      {secondary && <button type="button" className="b-empty-sec" onClick={onSecondary}>{secondary}</button>}
    </div>
  );
}
