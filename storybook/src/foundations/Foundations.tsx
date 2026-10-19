import React, { useState } from 'react';
import tokens from '../tokens/tokens.json';
import { PrismRoot, useReducedMotion, usePrism } from '../lib/PrismRoot';
import { photo } from '../lib/data';
import { Icon, iconNames, Render3D } from '../components/Icon';
import { Button, Toggle } from '../components/core';

const T: any = tokens;
const sem = T.color.semantic as Record<string, any>;
const roles = T.color.roles as Record<string, string>;
const cssVar = (k: string) => `--color-${k.replace('/', '-')}`;

function ModeColumn({ mode }: { mode: 'light' | 'dark' }) {
  return (
    <PrismRoot theme={mode}>
      <div className="doc-mode">
        <h3>{mode === 'light' ? 'Pearl · light' : 'Graphite Pearl · dark'}</h3>
        {Object.entries(sem).filter(([k]) => !k.startsWith('celebration')).map(([k, v]) => (
          <div className="doc-role" key={k}>
            <i style={{ background: `var(${cssVar(k)})` }} />
            <span><b style={{ fontWeight: 600 }}>{k}</b><br /><code>var({cssVar(k)})</code></span>
            <code>{v[mode]?.hex}</code>
          </div>
        ))}
      </div>
    </PrismRoot>
  );
}

export function ColorRoles() {
  return (
    <div className="doc">
      <p className="doc-lead">38 semantic colours alias 66 primitives. Components only read semantic tokens, so the dark mode swap is a single attribute on the root. Iris is the only acting colour.</p>
      <div className="doc-grid">
        {Object.entries(roles).filter(([k]) => !k.startsWith('_')).map(([k, v]) => (
          <div className="doc-swatch" key={k}>
            <div className="doc-swatch-chip" style={{ background: k.startsWith('celebration') ? 'var(--celebration-gradient)' : k.startsWith('glass') ? `url(${photo.tram}) center/cover` : `var(${cssVar(k)})` }} />
            <div className="doc-swatch-meta"><b>{k}</b><span>{v}</span></div>
          </div>
        ))}
      </div>
      <h2>Light and dark, side by side</h2>
      <div className="doc-modes"><ModeColumn mode="light" /><ModeColumn mode="dark" /></div>
      <h2>Celebration spectrum</h2>
      <p className="doc-lead">Reserved for three moments: a poll is won, the group is all squared up, a trip milestone. It appears as light, once: a sweep along the edge of the glass card. Never as a fill, a background or text color.</p>
      <div style={{ height: 8, borderRadius: 4, background: 'var(--celebration-gradient)', maxWidth: 360 }} />
      <div style={{ position: 'relative', maxWidth: 360, padding: '22px 24px', borderRadius: 28, background: 'var(--color-bg-surface)', border: '1px solid var(--color-border-subtle)' }}>
        <span className="p-celebrate-edge" style={{ animation: 'none', ['--p-sweep' as any]: '320deg', opacity: .6 }} aria-hidden />
        <p style={{ font: '400 40px/44px var(--font-display)', color: 'var(--color-text-primary)' }}>All squared up.</p>
        <p style={{ font: 'var(--type-ui-footnote)', color: 'var(--color-text-secondary)' }}>Title in ink. The spectrum is only the light on the edge.</p>
      </div>
      <p style={{ font: 'var(--type-ui-footnote)', color: 'var(--color-text-tertiary)' }}>{roles._contrast}</p>
    </div>
  );
}

export function TypeScale() {
  const type = T.type as Record<string, any>;
  const sample = (k: string) => k.startsWith('display/xl') ? 'Lisbon' : k.startsWith('display/l') ? '€248.70' : k.startsWith('display/m') ? 'Taberna da Rua das Flores' : k.includes('celebrate') ? 'All squared up' : k.includes('amount') ? '€42.10' : k.includes('title') ? 'Dinner on Friday?' : 'Mara paid for the Alfama flat, split seven ways.';
  return (
    <div className="doc">
      <p className="doc-lead">SF Pro carries the interface. Instrument Serif is the display face, used for trip names, big amounts and celebration lines only. On the web the UI face falls back to Inter.</p>
      <div>
        {Object.entries(type).map(([k, v]) => (
          <div className="doc-type" key={k}>
            <div className="doc-type-meta"><b>{k}</b><span className="tu-num">{v.family} · {v.weight} · {v.size}/{v.lineHeight} · {v.tracking}</span>{v.use && <span>{v.use}</span>}</div>
            <div style={{ font: `var(--type-${k.replace('/', '-')})`, letterSpacing: `var(--type-${k.replace('/', '-')}-tracking)` }} className={k.includes('amount') || k.startsWith('display/l') ? 'tu-num' : ''}>{sample(k)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SpacingRadius() {
  return (
    <div className="doc">
      <h2>Spacing · 4 pt grid</h2>
      <p className="doc-lead">Screen margin is 20. Cards pad 16. Related items sit 8 apart, groups 20 apart.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(T.spacing).map(([k, v]: any) => (
          <div className="doc-row" key={k}><code>--space-{k.replace('.', '_')}</code><span className="tu-num" style={{ width: 40 }}>{v.$value}</span><span className="doc-bar" style={{ width: Math.max(2, v.$value * 4) }} /></div>
        ))}
      </div>
      <h2>Radius</h2>
      <p className="doc-lead">Concentric: an inner radius equals the outer radius minus the padding. Sheets 38 inside the 62 pt device corner.</p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {Object.entries(T.radius).map(([k, v]: any) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', font: 'var(--type-ui-caption-1)', color: 'var(--color-text-secondary)' }}>
            <div className="doc-radius" style={{ borderRadius: Math.min(v.$value, 48) }} /><b style={{ color: 'var(--color-text-primary)' }}>{k}</b><span className="tu-num">{v.$value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GlassLayers() {
  const { transparency } = usePrism();
  const g = T.glass;
  return (
    <div className="doc">
      <p className="doc-lead">Four layers. Glass belongs to chrome (L2) only: nav bars, tab bars, sheets and floating actions. Content cards are solid surfaces so text over photos stays readable. Current setting: {transparency === 'reduce' ? 'Reduce Transparency, glass swaps to an opaque raised surface' : 'Liquid Glass'}.</p>
      <div className="doc-glass-stage" style={{ backgroundImage: `url(${photo.tram})` }}>
        <div className="doc-glass-tile" style={{ background: 'transparent', color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,.4)' }}><b>L0 Canvas</b><span>{g['L0-canvas'].what}</span></div>
        <div className="doc-glass-tile tu-surface"><b>L1 Content</b><span>{g['L1-content'].fill}</span></div>
        <div className="doc-glass-tile tu-glass"><b>L2 Chrome</b><span>{g['L2-chrome'].blur}</span></div>
        <div className="doc-glass-tile tu-glass-thick" style={{ position: 'relative', overflow: 'hidden' }}><span style={{ position: 'absolute', inset: 0, background: 'var(--celebration-gradient)', opacity: .55 }} /><b style={{ position: 'relative' }}>L3 Moment</b><span style={{ position: 'relative' }}>Celebration only</span></div>
      </div>
      <div className="doc-grid">
        {Object.entries(g).map(([k, v]: any) => (
          <div className="doc-card" key={k}><b style={{ font: 'var(--type-ui-headline)' }}>{k}</b>
            <div style={{ font: 'var(--type-ui-footnote)', color: 'var(--color-text-secondary)', marginTop: 6 }}>{typeof v === 'string' ? v : Object.entries(v).map(([a, b]) => <div key={a}><b>{a}</b> {String(b)}</div>)}</div></div>
        ))}
      </div>
    </div>
  );
}

export function Elevation() {
  return (
    <div className="doc">
      <p className="doc-lead">Shadows are tinted with the iris hue at low strength and carry a 1 pt inner highlight. Dark mode drops the tint and deepens the falloff.</p>
      <div className="doc-elev">
        <div style={{ background: 'var(--color-bg-sunken)' }}><b>Sunken</b>bg/sunken, no shadow</div>
        <div className="tu-surface"><b>Card</b>shadow/card</div>
        <div className="tu-glass"><b>Float</b>shadow/float + glass</div>
        <div style={{ background: 'var(--color-accent-primary)', color: 'var(--color-text-on-accent)', boxShadow: 'var(--shadow-accent)' }}><b>Accent</b>shadow/accent, primary button only</div>
      </div>
    </div>
  );
}

function MotionCard({ name, curve, dur, note }: { name: string; curve: string; dur: number; note: string }) {
  const reduce = useReducedMotion();
  const [go, setGo] = useState(false);
  const transition = reduce ? 'left 0ms, opacity 240ms' : `left ${dur}ms ${curve}`;
  return (
    <div className="doc-motion-card">
      <b style={{ font: 'var(--type-ui-headline)' }}>{name}</b>
      <code>{curve} · {dur}ms</code>
      <div className={`doc-motion-track ${go ? 'is-go' : ''}`} onClick={() => setGo(!go)}><span className="doc-motion-dot" style={{ transition }} /></div>
      <span style={{ font: 'var(--type-ui-footnote)', color: 'var(--color-text-secondary)' }}>{note}</span>
      <Button label={go ? 'Back' : 'Play'} size="small" variant="secondary" onClick={() => setGo(!go)} />
    </div>
  );
}
export function Motion() {
  const reduce = useReducedMotion();
  const m = T.motion;
  return (
    <div className="doc">
      <p className="doc-lead">Springs for anything you touch, easing curves for things the system does. Use the Motion toolbar control to preview Reduce Motion: movement collapses to fades and celebrations drop their particles. Now: <b>{reduce ? 'Reduce Motion' : 'Rich motion'}</b>.</p>
      <div className="doc-motion">
        <MotionCard name="spring.ui" curve="cubic-bezier(0.32, 0.72, 0, 1)" dur={350} note="Sheets, presses, toggles. response 0.35, damping 0.85" />
        <MotionCard name="spring.live" curve="cubic-bezier(0.34, 1.32, 0.64, 1)" dur={450} note="Poll fills, tab lens, segmented thumb. Slight overshoot." />
        <MotionCard name="spring.moment" curve="cubic-bezier(0.34, 1.56, 0.64, 1)" dur={550} note="Celebration entrances only." />
        <MotionCard name="ease.standard" curve="cubic-bezier(0.2, 0, 0, 1)" dur={240} note="Colour, opacity, layout shifts." />
        <MotionCard name="ease.enter" curve="cubic-bezier(0.05, 0.7, 0.1, 1)" dur={400} note="Elements arriving on screen." />
        <MotionCard name="duration.merge" curve="cubic-bezier(0.32, 0.72, 0, 1)" dur={700} note="Debt simplify: 6 IOUs into 3 payments." />
      </div>
      <h2>Patterns, rich and reduced</h2>
      <div className="doc-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {Object.entries(m.patterns).map(([k, v]: any) => (
          <div className="doc-card" key={k}><b style={{ font: 'var(--type-ui-headline)' }}>{k}</b>
            <p style={{ font: 'var(--type-ui-footnote)', marginTop: 8 }}><b>Rich</b> {v.rich}</p>
            <p style={{ font: 'var(--type-ui-footnote)', color: 'var(--color-text-secondary)', marginTop: 4 }}><b>Reduced</b> {v.reduced}</p></div>
        ))}
      </div>
      <h2>Rules</h2>
      <ul style={{ font: 'var(--type-ui-subhead)', color: 'var(--color-text-secondary)', margin: 0 }}>{m.rules.map((r: string) => <li key={r}>{r}</li>)}</ul>
      <h2>Haptics</h2>
      <div className="doc-grid">{Object.entries(m.haptics).map(([k, v]: any) => <div className="doc-card" key={k}><b>{k}</b><div style={{ font: 'var(--type-ui-footnote)', color: 'var(--color-text-secondary)' }}>{v}</div></div>)}</div>
    </div>
  );
}

export function Iconography() {
  const renders = ['poll', 'dining', 'itinerary', 'pin', 'settle', 'celebrate'] as const;
  return (
    <div className="doc">
      <h2>3D renders</h2>
      <p className="doc-lead">Isometric pearl and iris renders for empty states, onboarding and milestones. Never inside dense lists, never as buttons.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {renders.map(r => <div key={r} className="doc-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><Render3D name={r} size={120} /><code style={{ font: '500 12px ui-monospace, Menlo, monospace' }}>{r}</code></div>)}
      </div>
      <h2>Line icons</h2>
      <p className="doc-lead">Phosphor, regular weight. 24 pt in navigation, 20 pt inline, fill for selected states. The native app maps each name to the closest SF Symbol.</p>
      <div className="doc-card" style={{ display: 'flex', gap: 28, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        {(['home', 'calendar', 'poll', 'wallet'] as const).map(n => <span key={n} style={{ display: 'flex', gap: 10, alignItems: 'center' }}><Icon name={n} size={24} /><Icon name={n} size={24} fill /><Icon name={n} size={20} /></span>)}
        <code style={{ font: '500 11px ui-monospace, Menlo, monospace', color: 'var(--color-text-tertiary)' }}>regular 24 · fill 24 · regular 20</code>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(92px, 1fr))', gap: 8 }}>
        {iconNames.map(n => <div key={n} className="doc-card" style={{ padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}><Icon name={n} size={24} /><code style={{ font: '500 10px ui-monospace, Menlo, monospace', color: 'var(--color-text-tertiary)' }}>{n}</code></div>)}
      </div>
      <h2>Photography</h2>
      <p className="doc-lead">Real places, warm light, people optional. Photos sit on L0 only, with a bottom scrim before any text.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {Object.entries(photo).map(([k, v]) => <img key={k} src={v} alt={k} style={{ width: '100%', aspectRatio: '3 / 4', objectFit: 'cover', borderRadius: 14 }} />)}
      </div>
    </div>
  );
}
