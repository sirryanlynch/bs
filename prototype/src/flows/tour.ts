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
  // Same order as Part 2 of the step list: each flow once, never revisited.
  { hash: '#/beyond/create/where', wait: 1600, say: 'Create a trip: Porto, in six short steps.' },
  { hash: '#/beyond/create/review', wait: 1500, say: 'Review the trip before it is created.' },
  { hash: '#/beyond/explore', wait: 1500, say: 'Explore: places other crews booked, reviewed and photographed.' },
  { scroll: 380, wait: 700 },
  { tap: { sel: '.b-fchip', text: 'Active' }, wait: 1300, say: 'One row of type filters. The list fades instead of jumping.' },
  { tap: { sel: '.b-fchip', text: 'All' }, wait: 700 },
  { scroll: -380, wait: 500 },
  { hash: '#/beyond/explore/curate', wait: 1800, say: 'Four quick questions: how you get there, how long, what kind of place.' },
  { hash: '#/beyond/explore/addpoll', wait: 1500, say: 'Add a pick straight to a poll.' },
  { hash: '#/beyond/place/taberna', wait: 1500, say: 'The place card: photos, ratings, been-here count.' },
  { scroll: 520, wait: 1200 },
  { hash: '#/poll/new', wait: 1600, say: 'A new poll from the + button. Seeded: scuba diving, Tuesday, Oct 13 at 6:00 AM.' },
  { scroll: 420, wait: 700 },
  { tap: { sel: '.b-bottom button', text: 'Send to crew' }, wait: 1500 },
  { hash: '#/beyond/plan/day', wait: 1600, say: 'The day plan for Saturday, Oct 17. Dinner landed as a booked item at 8:30 PM.' },
  { tap: { sel: '.b-fchip', text: 'Culture' }, wait: 1300 },
  { tap: { sel: '.b-fchip', text: 'All' }, wait: 900 },
  { hash: '#/beyond/expense/scan', wait: 4400, say: 'Add expense: scan the lunch receipt, then check the lines.' },
  { tap: { sel: '.b-bottom button', text: 'Review 6 lines' }, wait: 1200, optional: true },
  { tap: { sel: '.b-bottom button', text: 'Assign items' }, wait: 1300, optional: true, say: 'Assign lines to people.' },
  { tap: { sel: '.b-bottom button', text: 'Choose a split' }, wait: 1400, optional: true, say: 'Five short steps. Skip any optional one and it takes the default.' },
  { hash: '#/beyond/album', wait: 1300, say: 'The shared album, by day or by place.' },
  { scroll: 320, wait: 600 },
  { tap: { sel: '.b-pcell' }, wait: 1600, say: 'Who took it, when and where.' },
  { hash: '#/beyond/invite', wait: 1400, say: 'Invite by link or QR code.' },
  { hash: '#/beyond/guest', wait: 1500, say: 'A guest votes from Safari, no install needed.' },
  { tap: { sel: '.b-gopt-info' }, wait: 1600, optional: true },
  { hash: '#/beyond/activity', wait: 1500, say: 'Activity: every vote, expense and payment in one feed.' },
  { hash: '#/beyond/recap', wait: 1600, say: 'The trip recap, and the money all settled.' },
  { scroll: 400, wait: 800 },
  { hash: '#/beyond/profile', wait: 1400, say: 'Profile and settings: payments, appearance, privacy.' },
  { hash: '#/beyond/expense/failed', wait: 1500, say: 'States: a receipt that could not be read.' },
  { hash: '#/beyond/poll/novotes', wait: 1300, say: 'A poll nobody has voted on yet.' },
  { hash: '#/beyond/explore/offline', wait: 1500, say: 'Explore with no connection.' },
  { wait: 1200 },
];
