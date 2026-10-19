import React from 'react';
export const Label = ({ children }: { children: React.ReactNode }) => (
  <p style={{ font: 'var(--type-ui-caption-2)', textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--color-text-tertiary)', margin: '6px 0 -6px 4px' }}>{children}</p>
);
export const Row = ({ children, gap = 10, wrap = true, align = 'center' }: { children: React.ReactNode; gap?: number; wrap?: boolean; align?: string }) => (
  <div style={{ display: 'flex', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: align }}>{children}</div>
);
export const Card = ({ children, pad = 0 }: { children: React.ReactNode; pad?: number }) => (
  <div className="p-group-body" style={{ padding: pad }}>{children}</div>
);
