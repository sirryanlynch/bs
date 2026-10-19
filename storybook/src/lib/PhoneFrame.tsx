import React from 'react';

/** iPhone 17 frame: 402 x 874 pt screen, 62 pt corner radius, Dynamic Island, status bar, home indicator. */
export function PhoneFrame({ children, theme = 'light', screen = 'component', statusLight }:
  { children: React.ReactNode; theme?: string; screen?: 'component' | 'full' | 'lock'; statusLight?: boolean }) {
  return (
    <div className={`phone ${theme === 'dark' ? 'phone-dark' : ''} ${statusLight ? 'status-light' : ''}`} aria-label="iPhone 17 preview, 402 by 874 points">
      <div className="phone-btn phone-btn-action" />
      <div className="phone-btn phone-btn-vu" />
      <div className="phone-btn phone-btn-vd" />
      <div className="phone-btn phone-btn-power" />
      <div className="phone-screen">
        <div className={`phone-content ${screen === 'component' ? 'phone-content-pad' : ''}`}>{children}</div>
        <div className="phone-status" aria-hidden>
          <span className="phone-time">9:41</span>
          <span className="phone-island" />
          <span className="phone-glyphs">
            <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.3A10.6 10.6 0 0 0 8 .4C5.1.4 2.5 1.5.5 3.4l1.2 1.3A8.9 8.9 0 0 1 8 2.2Zm0 3.6c1.4 0 2.7.5 3.7 1.4l1.2-1.3A7.2 7.2 0 0 0 8 4c-1.9 0-3.6.7-4.9 1.9l1.2 1.3c1-.9 2.3-1.4 3.7-1.4Zm0 3.6c-.5 0-1 .2-1.3.5L8 11.6l1.3-1.7c-.4-.3-.8-.5-1.3-.5Z"/></svg>
            <span className="phone-batt"><span /></span>
          </span>
        </div>
        <div className="phone-home" aria-hidden />
      </div>
    </div>
  );
}
