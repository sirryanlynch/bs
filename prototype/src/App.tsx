import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PrismRoot } from '@sb/lib/PrismRoot';
import { Icon } from '@sb/components/Icon';
import { AppProvider, useApp, useStore, STEPS, stepIndex, stateAt, CHECKS, StepId, Me, State, Action, STREAM, clockStr, simplifyOf, initial } from './store';
import { Home, Trip, InviteSheet, Explore } from './screens1';
import { Create, Push, PollView, Closed, Plan, usePollStream } from './screens2';
import { Expense, Money, Squared } from './screens3';
import { RenWeb } from './renweb';
import { track } from './analytics';

const params = new URLSearchParams(location.search);
const EMBED = params.has('embed');
const isPhone = () => window.matchMedia('(max-width: 560px)').matches;

function parseHash(): { step?: StepId; me?: Me; tie?: boolean } {
  const [p, q] = location.hash.replace(/^#\/?/, '').split('?');
  const sp = new URLSearchParams(q ?? '');
  const step = STEPS.find(x => x.id === p)?.id;
  return { step, me: (['ari', 'nic', 'ren'].includes(sp.get('as') ?? '') ? sp.get('as') : undefined) as Me | undefined, tie: sp.get('tie') === '1' };
}

function PhoneScreen({ s }: { s: State }) {
  usePollStream();
  const { d } = useApp();
  const plan = simplifyOf(s);
  const allPaid = s.dinnerSaved && plan.length > 0 && plan.every(e => s.paid[`${e.from}>${e.to}`] && s.paid[`${e.from}>${e.to}`] !== 'pending');
  useEffect(() => { if (allPaid && (s.step === 'money' || s.step === 'settle')) { const t = setTimeout(() => d({ t: 'go', step: 'squared' }), 1100); return () => clearTimeout(t); } }, [allPaid, s.step]);
  if (s.me === 'ren' && s.step !== 'push') return <RenWeb />;
  switch (s.step) {
    case 'home': return <Home />;
    case 'trip': return <Trip />;
    case 'invite': return <><Trip /><InviteSheet /></>;
    case 'explore': return <Explore />;
    case 'create': return <Create />;
    case 'push': return <Push />;
    case 'live': return <PollView />;
    case 'closed': return <Closed />;
    case 'plan': return <Plan />;
    case 'expense': return <Expense />;
    case 'money': case 'settle': return <Money />;
    case 'squared': return <Squared />;
  }
}

/** Tour scripts: each step plays its own interactions, then moves on. Times are in ms from step start. */
function tourScript(s: State): [number, Action | Action[] | 'next'][] {
  const canon: [number, Action | Action[] | 'next'][] = [];
  switch (s.step) {
    case 'home': return [[2600, 'next']];
    case 'trip': return [[2800, s.me === 'ren' ? { t: 'join', via: 'qr' } : { t: 'go', step: 'invite' }], ...(s.me === 'ren' ? [[2400, 'next']] as any : [])];
    case 'invite': return [[1800, { t: 'join', via: 'qr' }], [2200, 'next']];
    case 'explore': return [[1300, { t: 'set', patch: { exploreStage: 1 } }], [1300, { t: 'set', patch: { exploreStage: 2 } }], [1300, { t: 'set', patch: { exploreStage: 3 } }], [1400, { t: 'set', patch: { shortlist: ['taberna', 'ramiro', 'park'] } }], [1600, 'next']];
    case 'create': return [[2600, [{ t: 'set', patch: { pollSent: true } }, { t: 'done', key: 'create' }, { t: 'vote', who: 'ari', opt: 1 }, { t: 'go', step: 'push' }]]];
    case 'push': return [[2200, [{ t: 'vote', who: 'nic', opt: 0, via: 'the push' }, { t: 'done', key: 'push' }]], [1400, 'next']];
    case 'live': return s.me === 'ren' ? [[5200, { t: 'vote', who: 'ren', opt: s.tiePath ? 1 : 0, via: 'the web as a guest' }]] : s.me === 'ari' ? [[1400, { t: 'vote', who: 'ari', opt: 1 }]] : [];
    case 'closed': return s.tie && s.winner == null ? [[2600, { t: 'pick', opt: 0 }]] : [[3000, [{ t: 'set', patch: { planAdded: true } }, { t: 'go', step: 'plan' }, { t: 'toast', msg: 'Taberna added to tonight', tone: 'success' }]]];
    case 'plan': return [[2400, [{ t: 'set', patch: { howOpen: true } }, { t: 'done', key: 'how' }]], [3600, { t: 'set', patch: { howOpen: false } }], [900, 'next']];
    case 'expense': return [[1600, { t: 'toggleLine', line: 'wine', who: 'ren' }], [800, { t: 'toggleLine', line: 'wine', who: 'nic' }], [2200, { t: 'saveDinner' }], [700, 'next']];
    case 'money': return [[1400, { t: 'set', patch: { simplified: true } }], [4600, { t: 'done', key: 'simplify' }], [2000, 'next']];
    case 'settle': {
      const plan = simplifyOf(s);
      const seq: [number, Action | Action[] | 'next'][] = [];
      seq.push([1600, [{ t: 'pay', key: `${plan[0].from}>${plan[0].to}`, how: 'pending' }, { t: 'done', key: 'settle' }]]);
      plan.forEach((e, i) => seq.push([i === 0 ? 1100 : 900, { t: 'pay', key: `${e.from}>${e.to}`, how: 'app' }]));
      seq.push([400, { t: 'set', patch: { settleOpen: false } }]);
      return seq;
    }
    case 'squared': return s.recap ? [[2400, { t: 'set', patch: { shared: true } }], [3000, 'next']] : [[3400, { t: 'set', patch: { recap: true } }]];
  }
  return canon;
}

export function App() {
  const [s, d] = useStore();
  const [tour, setTour] = useState(EMBED);
  const [theme, setTheme] = useState<'light' | 'dark'>(params.get('theme') === 'dark' ? 'dark' : 'light');
  const [motion, setMotion] = useState<'full' | 'reduce'>(matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduce' : 'full');
  const [compare, setCompare] = useState<'off' | 'side' | 'overlay'>('off');
  const [opacity, setOpacity] = useState(50);
  const [phone, setPhone] = useState(isPhone());
  const [panelOpen, setPanelOpen] = useState(false);
  const [help, setHelp] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  useEffect(() => {
    if (!settingsOpen) return;
    const down = (e: Event) => { const t = e.target as HTMLElement; if (!t.closest('.pt-pop, .pt-gear')) setSettingsOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setSettingsOpen(false); };
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [settingsOpen]);
  const meta = STEPS[stepIndex(s.step)];
  const idx = stepIndex(s.step);
  const sRef = useRef(s); sRef.current = s;

  const jump = (id: StepId, over: Partial<State> = {}) => d({ t: 'load', s: { ...stateAt(id, { ...sRef.current, ...over } as State), ...over } as State });
  const next = () => {
    const n = STEPS[idx + 1];
    if (n) {
      const cur = sRef.current;
      if (!tour) track('step_jump', { from: cur.step, to: n.id, method: 'next' });
      const x = STEPS[idx].complete(cur);
      d({ t: 'load', s: { ...x, step: n.id, settleOpen: n.id === 'settle', howOpen: false, done: { ...x.done, [n.id]: true } } });
    } else if (EMBED || tour) {
      if (tour) {
        track('guided_tour_complete', { embed: EMBED });
        track('guided_tour_start', { step: 'home', embed: EMBED });
      }
      d({ t: 'reset' });
    }
  };
  const prev = () => {
    const p = STEPS[idx - 1];
    if (!p) return;
    if (!tour) track('step_jump', { from: sRef.current.step, to: p.id, method: 'prev' });
    jump(p.id);
  };

  // Deep links: #/step?as=nic&tie=1
  useEffect(() => {
    let first = true;
    const apply = () => {
      const h = parseHash();
      const cur = sRef.current;
      if (h.step && (h.step !== cur.step || (h.me ?? 'ari') !== cur.me)) {
        if (!first && h.step !== cur.step) track('step_jump', { from: cur.step, to: h.step, method: 'list' });
        jump(h.step, { me: h.me ?? 'ari', tiePath: h.tie });
      }
      first = false;
    };
    apply(); window.addEventListener('hashchange', apply); return () => window.removeEventListener('hashchange', apply);
  }, []);
  // The first paint is always home. A deep link is applied in an effect, and the hash
  // sync effect rewrites the hash to match home before that update commits. Remember the
  // link from the first render so the home paint is not recorded as a page view.
  const deepLink = useRef(parseHash().step);
  useEffect(() => {
    if (deepLink.current && s.step !== deepLink.current) return;
    deepLink.current = undefined;
    const hash = `#/${s.step}`;
    track('page_view', {
      page_location: `${location.origin}${location.pathname}${location.search}${hash}`,
      page_path: `${location.pathname}${hash}`,
      page_title: meta.title,
      step: s.step,
      play_as: s.me,
      embed: EMBED,
    });
  }, [s.step]);
  const tourSeen = useRef(false);
  useEffect(() => {
    if (tour && !tourSeen.current) track('guided_tour_start', { step: sRef.current.step, embed: EMBED });
    tourSeen.current = tour;
  }, [tour]);
  const themeSeen = useRef(false);
  useEffect(() => {
    if (!themeSeen.current) { themeSeen.current = true; return; }
    track('theme_toggle', { theme, surface: 'prototype' });
  }, [theme]);
  const motionSeen = useRef(false);
  useEffect(() => {
    if (!motionSeen.current) { motionSeen.current = true; return; }
    track('reduce_motion_toggle', { motion, surface: 'prototype' });
  }, [motion]);
  const compareSeen = useRef(false);
  useEffect(() => {
    if (!compareSeen.current) { compareSeen.current = true; return; }
    track('compare_hifi', { mode: compare });
  }, [compare]);
  useEffect(() => {
    if (EMBED) return;
    const h = `#/${s.step}${s.me !== 'ari' || s.tiePath ? `?${[s.me !== 'ari' ? `as=${s.me}` : '', s.tiePath ? 'tie=1' : ''].filter(Boolean).join('&')}` : ''}`;
    if (location.hash !== h) history.replaceState(null, '', h);
  }, [s.step, s.me, s.tiePath]);
  useEffect(() => { const m = matchMedia('(max-width: 560px)'); const f = () => setPhone(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);

  // Toast auto dismiss
  useEffect(() => { if (!s.toast) return; const t = setTimeout(() => d({ t: 'set', patch: { toast: undefined } }), 2600); return () => clearTimeout(t); }, [s.toast?.id]);

  // Guided tour
  const tourKey = `${s.step}|${s.tie && s.winner == null}|${s.recap}|${s.me}`;
  useEffect(() => {
    if (!tour) return;
    const script = tourScript(s);
    const timers: number[] = []; let at = 0;
    script.forEach(([ms, a]) => { at += motion === 'reduce' ? ms * 0.8 : ms; timers.push(window.setTimeout(() => {
      if (a === 'next') next(); else (Array.isArray(a) ? a : [a]).forEach(x => d(x));
    }, at)); });
    return () => timers.forEach(clearTimeout);
  }, [tour, tourKey]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'arrowright' || k === 'n') next();
      else if (k === 'arrowleft' || k === 'p') prev();
      else if (k === ' ') { e.preventDefault(); setTour(t => !t); }
      else if (k === 'd') setTheme(t => (t === 'dark' ? 'light' : 'dark'));
      else if (k === 'm') setMotion(m => (m === 'reduce' ? 'full' : 'reduce'));
      else if (k === 'c') setCompare(c => (c === 'off' ? 'side' : c === 'side' ? 'overlay' : 'off'));
      else if (k === 'r') { setTour(false); d({ t: 'reset' }); }
      else if (k === '?') setHelp(h => !h);
      else if (k === '1' || k === '2' || k === '3') {
        const me = (['ari', 'nic', 'ren'] as Me[])[+k - 1];
        if (me !== sRef.current.me) track('play_as', { play_as: me, from: sRef.current.me });
        d({ t: 'load', s: { ...stateAt(sRef.current.step, { ...sRef.current, me }), me } });
      }
      else return;
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  });

  // Touch ripple so taps read on desktop, and a little press feedback everywhere
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const onDown = (e: React.PointerEvent) => {
    if (motion === 'reduce') return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples(x => [...x.slice(-3), { x: e.clientX - r.left, y: e.clientY - r.top, id }]);
    setTimeout(() => setRipples(x => x.filter(y => y.id !== id)), 600);
  };

  const hifi = meta.hifi(s);
  const time = s.step === 'live' ? clockStr(Math.max(17, Math.min(29, 17 + Object.keys(s.votes).length))) : meta.time;
  const dark = theme === 'dark';
  const statusLight = s.step === 'push' || (s.step === 'trip' && s.me !== 'ren') || s.step === 'invite' && false;

  const screen = (
    <div className="pt-screen-inner" onPointerDown={onDown}>
      <div className="pt-anim" key={`${s.step}-${s.me}-${s.recap}`}><PhoneScreen s={s} /></div>
      {s.toast && <div className={`pt-itoast ${s.toast.tone === 'success' ? 'is-success' : ''}`} key={s.toast.id} role="status"><Icon name={s.toast.tone === 'success' ? 'check' : 'info'} size={20} /><span>{s.toast.msg}</span></div>}
      {ripples.map(r => <span key={r.id} className="pt-ripple" style={{ left: r.x, top: r.y }} aria-hidden />)}
      {compare === 'overlay' && <img className="pt-overlay" src={`./hifi/${hifi}.png`} alt="" style={{ opacity: opacity / 100 }} />}
    </div>
  );

  const frame = (
    <div className={`phone ${dark ? 'phone-dark' : ''} ${statusLight ? 'status-light' : ''}`} aria-label="iPhone 17, 402 by 874 points">
      <div className="phone-btn phone-btn-action" /><div className="phone-btn phone-btn-vu" /><div className="phone-btn phone-btn-vd" /><div className="phone-btn phone-btn-power" />
      <div className="phone-screen">
        <div className="phone-content">{screen}</div>
        <div className="phone-status" aria-hidden>
          <span className="phone-time tu-num">{s.step === 'push' ? '' : time}</span><span className="phone-island" />
          <span className="phone-glyphs"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg><span className="phone-batt"><span /></span></span>
        </div>
        <div className="phone-home" aria-hidden />
      </div>
    </div>
  );

  if (EMBED) return (
    <PrismRoot theme={theme} motion={motion}><AppProvider s={s} d={d}><div className="pt-embed">{frame}</div></AppProvider></PrismRoot>
  );

  const shareUrl = location.href.split('#')[0].replace(/[?&]embed=1/, '') + `#/${s.step}`;
  const doneCount = CHECKS.filter(c => c.test(s)).length;
  const stepDone = (id: StepId) => { const keys: Record<string, string[]> = { closed: ['closed'], plan: ['plan', 'how'], money: ['money', 'simplify'], squared: ['squared', 'recap'] }; return (keys[id] ?? [id]).every(k => CHECKS.find(c => c.key === k)?.test(s)); };
  const settings = (
    <div className="pt-pop" role="dialog" aria-label="Settings">
      <div className="pt-pop-row"><span>Play as</span>
        <div className="pt-seg" role="radiogroup" aria-label="Play as">
          {([['ari', 'Ari'], ['nic', 'Nic'], ['ren', 'Ren (web)']] as [Me, string][]).map(([id, l]) => (
            <button key={id} type="button" role="radio" aria-checked={s.me === id} className={s.me === id ? 'is-on' : ''} onClick={() => { if (s.me !== id) track('play_as', { play_as: id, from: s.me }); d({ t: 'load', s: { ...stateAt(s.step, { ...s, me: id }), me: id } }); }}>{l}</button>
          ))}
        </div></div>
      <div className="pt-pop-row"><span>Compare with Figma <small className="tu-num">{hifi}</small></span>
        <div className="pt-seg" role="radiogroup" aria-label="Compare with hi-fi">
          {(['off', 'side', 'overlay'] as const).map(c => <button key={c} type="button" role="radio" aria-checked={compare === c} className={compare === c ? 'is-on' : ''} onClick={() => setCompare(c)}>{c === 'off' ? 'Off' : c === 'side' ? 'Side' : 'Overlay'}</button>)}
        </div>
        {compare === 'overlay' && <input className="pt-range" type="range" min={0} max={100} value={opacity} onChange={e => setOpacity(+e.target.value)} aria-label="Overlay opacity" />}</div>
      <label className="pt-check"><input type="checkbox" checked={s.tiePath} onChange={e => { const tie = e.target.checked; track('tie_break', { enabled: tie }); const at = stepIndex(s.step) > stepIndex('live') ? 'live' : s.step; d({ t: 'load', s: { ...stateAt(at, { ...s, tiePath: tie }), tiePath: tie } }); }} />Tie-break path</label>
      <label className="pt-check"><input type="checkbox" checked={dark} onChange={e => setTheme(e.target.checked ? 'dark' : 'light')} />Dark mode</label>
      <label className="pt-check"><input type="checkbox" checked={motion === 'reduce'} onChange={e => setMotion(e.target.checked ? 'reduce' : 'full')} />Reduce Motion</label>
      <details className="pt-more"><summary>Open on a phone</summary><div className="pt-qrcard"><QRCodeSVG value={shareUrl} size={96} level="M" bgColor="transparent" fgColor="currentColor" /><p>Scan to open this step full screen.</p></div></details>
      <details className="pt-more"><summary>Keyboard shortcuts</summary>
        <dl className="pt-keys"><dt>← →</dt><dd>Step</dd><dt>Space</dt><dd>Tour</dd><dt>1 2 3</dt><dd>Ari, Nic, Ren</dd><dt>C</dt><dd>Compare</dd><dt>D</dt><dd>Dark</dd><dt>M</dt><dd>Motion</dd><dt>R</dt><dd>Reset</dd></dl></details>
      <button type="button" className="pt-btn is-wide" onClick={() => { setTour(false); d({ t: 'reset' }); setSettingsOpen(false); }}>Reset demo</button>
    </div>
  );
  const panel = (
    <aside className="pt-panel" aria-label="Reviewer panel">
      <header className="pt-panel-head">
        <div><p className="pt-eyebrow">Reviewer</p><h1>TripUp prototype</h1></div>
        <div className="pt-panel-tools">
          <button type="button" className={`pt-iconbtn pt-gear ${settingsOpen ? 'is-on' : ''}`} onClick={() => setSettingsOpen(o => !o)} aria-expanded={settingsOpen} aria-label="Settings"><Icon name="gear" size={20} /></button>
          {phone && <button type="button" className="pt-iconbtn" onClick={() => setPanelOpen(false)} aria-label="Close panel"><Icon name="close" size={20} /></button>}
        </div>
        {settingsOpen && settings}
      </header>
      <section className="pt-stepcard" aria-live="polite">
        <p className="pt-stepline tu-num">{meta.n} of 13</p>
        <h2>{meta.title}</h2>
        <p>{meta.caption}</p>
        <div className="pt-row">
          <button type="button" className="pt-btn" onClick={prev} disabled={idx === 0} aria-label="Previous step"><Icon name="chevronLeft" size={20} /></button>
          <button type="button" className={`pt-btn is-primary ${tour ? 'is-on' : ''}`} onClick={() => setTour(t => !t)}>{tour ? 'Pause tour' : 'Play guided tour'}</button>
          <button type="button" className="pt-btn" onClick={next} disabled={idx === STEPS.length - 1 && !tour} aria-label="Next step"><Icon name="chevronRight" size={20} /></button>
        </div>
        {s.step === 'live' && !s.pollClosed && <button type="button" className="pt-link" onClick={() => d({ t: 'close', by: 'timer' })}>Skip to 19:30</button>}
      </section>
      <nav aria-label="Steps"><ol className="pt-jumps">{STEPS.map(x => { const ok = stepDone(x.id); return (
        <li key={x.id}><a href={`#/${x.id}`} className={x.id === s.step ? 'is-on' : ''} aria-current={x.id === s.step ? 'step' : undefined}>
          <span className={`pt-dot ${ok ? 'is-ok' : ''}`} aria-hidden>{ok ? <Icon name="check" size={14} /> : <span className="tu-num">{+x.n}</span>}</span>{x.title}<span className="sr-only">{ok ? ', done' : ''}</span></a></li>
      ); })}</ol></nav>
      <details className="pt-more pt-checks"><summary>Brief checklist <span className="tu-num">{doneCount} of {CHECKS.length}</span></summary>
        <ul className="pt-checklist">{CHECKS.map(c => { const ok = c.test(s); return <li key={c.key} className={ok ? 'is-ok' : ''}><span aria-hidden>{ok && <Icon name="check" size={14} />}</span>{c.label}</li>; })}</ul>
      </details>
      <p className="pt-foot"><a href="../">Deck</a><a href="../case-study/">Case study</a><a href="../storybook/">Storybook</a><a href="https://www.figma.com/design/z4TesJNPe6UfvgwmWtIA4y/TripUp-Working" target="_blank" rel="noreferrer">Figma</a></p>
    </aside>
  );

  return (
    <PrismRoot theme={theme} motion={motion}>
      <AppProvider s={s} d={d}>
        {phone ? (
          <div className={`pt-mobile ${dark ? 'is-dark' : ''}`}>
            <div className="phone-content pt-mobile-screen">{screen}</div>
            <button type="button" className="pt-fab" onClick={() => setPanelOpen(true)}><Icon name="more" size={24} /><span className="sr-only">Reviewer panel</span></button>
            
            {panelOpen && <div className="pt-drawer" role="dialog" aria-modal="true" aria-label="Reviewer panel"><div className="pt-drawer-scrim" onClick={() => setPanelOpen(false)} />{panel}</div>}
          </div>
        ) : (
          <div className={`pt-desk ${dark ? 'is-dark' : ''}`}>
            <main className="pt-stage">
              <div className="pt-devices">
                <div className="pt-device">{frame}</div>
                {compare === 'side' && <figure className="pt-hifi"><img src={`./hifi/${hifi}.png`} alt={`Figma hi-fi frame ${hifi}`} width={402} height={874} /><figcaption>Figma hi-fi · {hifi}</figcaption></figure>}
              </div>
            </main>
            {panel}
          </div>
        )}
        {help && <div className="pt-help" onClick={() => setHelp(false)}>Shortcuts: arrows, Space, 1 2 3, C, D, M, R</div>}
      </AppProvider>
    </PrismRoot>
  );
}
void initial; void STREAM;
