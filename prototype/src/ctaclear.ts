// v5.6.1: every scroll region that sits behind a bottom CTA gets padding-bottom = CTA block height (incl. tab bar) + 24px,
// so the last row can always scroll fully clear of the CTA. Measured live, so one or two buttons and every width are covered.
export function installCtaClear() {
  let raf = 0;
  const run = () => { raf = 0;
    document.querySelectorAll<HTMLElement>('.p-sscroll').forEach(sc => {
      const bt = Array.from(sc.parentElement?.children ?? []).find(e => e !== sc && e.classList.contains('p-sbottom')) as HTMLElement | undefined;
      if (!bt) return;
      const r = sc.getBoundingClientRect(), b = bt.getBoundingClientRect(); if (!r.height) return;
      const k = sc.offsetHeight / r.height; // the phone frame may be CSS-scaled on desktop
      const pad = Math.ceil(Math.max(0, r.bottom - b.top) * k + 24) + 'px';
      if (sc.style.getPropertyValue('padding-bottom') !== pad) sc.style.setProperty('padding-bottom', pad, 'important');
    });
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(run); };
  new MutationObserver(kick).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', kick); kick();
}
