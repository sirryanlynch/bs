/** Hash routing for the screens beyond tonight. Core steps keep `#/<step>`; these live at `#/beyond/<route>`, plus the `#/poll/new` alias. */
export const routeFromHash = (h = location.hash): string | undefined => {
  const p = h.replace(/^#\/?/, '').split('?')[0];
  if (p.startsWith('beyond/')) return p.slice(7) || 'explore';
  if (p === 'poll/new' || p.startsWith('poll/new/')) return p;
  return undefined;
};
export const isBeyondHash = (h = location.hash) => routeFromHash(h) != null;
export const hashForRoute = (r: string) => (r.startsWith('poll/new') ? `#/${r}` : `#/beyond/${r}`);
/** Set when a core screen opens a beyond route, so the flow keeps its state instead of loading a preset. */
export const navFlag = { inApp: false, from: '' };
export function goBeyond(route: string) { navFlag.inApp = true; navFlag.from = isBeyondHash() ? navFlag.from : location.hash; location.hash = hashForRoute(route); }
