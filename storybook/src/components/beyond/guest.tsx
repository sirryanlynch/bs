import React from 'react';
import './beyond.css';
import { BIcon } from './icons';
import { AppMark } from '../Icon';

/** Mobile Safari chrome around a web page: compact address pill at the bottom, the way iOS 26 draws it. */
export function SafariFrame({ url, children, banner }: { url: string; children: React.ReactNode; banner?: React.ReactNode }) {
  return (
    <div className="b-safari">
      {banner}
      <div className="b-safari-page">{children}</div>
      <div className="b-safari-bar tu-glass" aria-label="Safari toolbar">
        <BIcon name="chevronLeft" size={20} />
        <span className="b-safari-url"><BIcon name="lockX" size={12} />{url}</span>
        <BIcon name="more" size={20} />
      </div>
    </div>
  );
}

/** Smart App Banner: the quiet install prompt Safari shows at the top of a page. */
export function AppBanner({ onOpen, onClose }: { onOpen?: () => void; onClose?: () => void }) {
  return (
    <div className="b-appbanner">
      <button type="button" className="b-appbanner-x" onClick={onClose} aria-label="Dismiss"><BIcon name="close" size={14} /></button>
      <AppMark size={36} />
      <span><b>TripUp</b><small>Keep your vote, photos and costs</small></span>
      <button type="button" className="b-pillbtn" onClick={onOpen}>Get</button>
    </div>
  );
}

/** Guest web view: a trip page anyone with the link can open and vote on. */
export function GuestWebView({ children, who = 'Ren' }: { children: React.ReactNode; who?: string }) {
  return (
    <div className="b-guest">
      <header className="b-guest-head"><AppMark size={24} /><b>TripUp</b><span className="b-pill">Viewing as {who}, guest</span></header>
      {children}
    </div>
  );
}
