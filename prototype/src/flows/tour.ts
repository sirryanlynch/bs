import type { Target } from './cursor';

/** Where the cursor taps for each scripted action of the core Lisbon tour. Missing targets simply skip the tap. */
export function coreTarget(step: string, a: any, s: any): Target | null {
  if (a === 'next') {
    if (step === 'home') return { sel: '.pt-cardbtn' };
    if (step === 'invite') return { sel: '.pt-sheet-cta button' };
    if (step === 'explore') return { sel: '.scr-bottombar button' };
    if (step === 'plan') return { sel: 'button', text: 'Add the dinner bill' };
    if (step === 'money') return { sel: 'button', text: 'Settle up' };
    return null;
  }
  const x = Array.isArray(a) ? a[0] : a;
  switch (x?.t) {
    case 'go': return x.step === 'invite' ? { sel: '[aria-label="Add people"]' } : null;
    case 'join': return { sel: '.pt-qr' };
    case 'set':
      if (x.patch?.exploreStage) return { sel: '.pt-qopt', nth: [0, 1, 0, 1][x.patch.exploreStage - 1] ?? 0 };
      if (x.patch?.shortlist) return { sel: '.pt-place' };
      if (x.patch?.pollSent) return { sel: 'button', text: 'Send to' };
      if (x.patch?.simplified) return { sel: 'button', text: 'Simplify' };
      if (x.patch?.planAdded) return { sel: 'button', text: 'Add to' };
      if (x.patch?.recap) return { sel: 'button', text: 'recap' };
      if (x.patch?.shared) return { sel: 'button', text: 'Share' };
      return null;
    case 'vote': return x.who === 'nic' ? { sel: '.pt-notifbtn' } : x.who === 'ari' ? { sel: 'button', aria: /^Vote|Ramiro/ } : null;
    case 'toggleLine': return { sel: '.pt-whobtn', aria: new RegExp(`^${x.who === 'ren' ? 'Ren' : 'Nic'}\\b.*${x.line}`, 'i') };
    case 'saveDinner': return { sel: 'button', text: 'Save expense' };
    case 'view': return x.v === 'cash' ? { sel: 'button', text: 'Cash' } : null;
    case 'mark': return { sel: 'button', text: 'Mark' };
    case 'confirm': return { sel: 'button', text: 'Confirm' };
    case 'pick': return { sel: 'button', text: 'Pick' };
    case 'pay': return null;
  }
  return null;
}

/** The "Beyond tonight" chapter: real taps on real screens, with a few slow scrolls between them. */
export type TourStep =
  | { hash: string; wait?: number; say: string }
  | { tap: Target; wait?: number; say?: string; optional?: boolean }
  | { scroll: number; wait?: number }
  | { wait: number; say?: string };
export const CHAPTER: TourStep[] = [
  { hash: '#/home', wait: 1400, say: 'Trips home. Explore has its own tab now.' },
  { tap: { sel: '.p-tab', text: 'Explore' }, wait: 1500, say: 'Places other crews booked, reviewed and photographed.' },
  { scroll: 380, wait: 700 },
  { tap: { sel: '.b-fchip', text: 'Active' }, wait: 1300, say: 'One row of type filters. The list fades instead of jumping.' },
  { tap: { sel: '.b-fchip', text: 'All' }, wait: 700 },
  { scroll: -380, wait: 500 },
  { tap: { sel: '[aria-label="Start a poll"]' }, wait: 900, say: 'A new poll from anywhere: any day, any time, any kind of plan.' },
  { hash: '#/poll/new', wait: 1600, say: 'Seeded: scuba diving, Tuesday at 6:00 AM.' },
  { scroll: 420, wait: 700 },
  { tap: { sel: '.b-bottom button', text: 'Send to crew' }, wait: 1500 },
  { tap: { sel: '.b-pollopt.is-link' }, wait: 1600, say: 'Each poll option opens its place card: photos, ratings, been-here count.' },
  { scroll: 520, wait: 1200 },
  { hash: '#/beyond/expense/scan', wait: 4400, say: 'Add expense: scan the receipt, then check the lines.' },
  { tap: { sel: '.b-bottom button', text: 'Review 6 lines' }, wait: 1200 },
  { tap: { sel: '.b-bottom button', text: 'Assign items' }, wait: 1100, say: 'Assign lines to people. Ren and Nic skip the wine.' },
  { tap: { sel: '.b-assign-p', aria: /^Ren shares Vinho/ }, wait: 600, optional: true },
  { tap: { sel: '.b-assign-p', aria: /^Nic shares Vinho/ }, wait: 1300, optional: true },
  { tap: { sel: '.b-assign-head', text: 'Polvo' }, wait: 1300, optional: true, say: 'Expand any line to see who shares it.' },
  { tap: { sel: '.b-bottom button', text: 'Choose a split' }, wait: 1400, say: 'Five short steps. Skip any optional one and it takes the default.' },
  { hash: '#/beyond/plan/day', wait: 1600, say: 'The day plan. Dinner landed as a booked item at 8:30 PM.' },
  { tap: { sel: '.b-fchip', text: 'Culture' }, wait: 1300 },
  { tap: { sel: '.b-fchip', text: 'All' }, wait: 900 },
  { hash: '#/beyond/album', wait: 1300, say: 'The shared album, by day or by place.' },
  { scroll: 320, wait: 600 },
  { tap: { sel: '.b-pcell' }, wait: 1600, say: 'Who took it, when and where.' },
  { hash: '#/beyond/guest', wait: 1500, say: 'Ren votes from Safari, no install needed.' },
  { tap: { sel: '.b-gopt-info' }, wait: 1600 },
  { hash: '#/beyond/recap', wait: 1600, say: 'The trip recap, and the money all settled.' },
  { scroll: 400, wait: 800 },
  { tap: { sel: '.b-bottom button', text: 'Plan the next one' }, wait: 1600, say: 'Plan the next one: the crew carries over.' },
  { wait: 1200 },
];
