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
      if (x.patch?.exploreFeed === false) return { sel: '.b-findhero' };
      if (x.patch?.renStage === 'web') return { sel: '.rv-link' };
      if (x.patch?.renStage === 'back') return { sel: '.rv-ok-btn' };
      if (x.patch?.exploreStage) return { sel: '.b-fp-photo, .b-fp-glass', nth: [0, 1, 0, 1][x.patch.exploreStage - 1] ?? 0 };
      if (x.patch?.shortlist) return { sel: '.pt-place' };
      if (x.patch?.pollSent) return { sel: 'button', text: 'Send to' };
      if (x.patch?.simplified) return { sel: 'button', text: 'Simplify' };
      if (x.patch?.planAdded) return { sel: 'button', text: 'Add to' };
      if (x.patch?.recap) return { sel: 'button', text: 'recap' };
      if (x.patch?.shared) return { sel: 'button', text: 'Share' };
      return null;
    case 'vote': return x.who === 'nic' ? { sel: '.pt-notifbtn' } : x.who === 'ari' ? { sel: 'button', aria: /^Vote|Ramiro/ } : x.who === 'ren' ? { sel: '.rv-tile', nth: x.opt ?? 0 } : null;
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

/** The "Full JTBD analysis" chapter: real taps on real screens, with a few slow scrolls between them. */
export type TourStep =
  | { hash: string; wait?: number; say: string }
  | { tap: Target; wait?: number; say?: string; optional?: boolean }
  | { scroll: number; wait?: number }
  | { wait: number; say?: string };
export const CHAPTER: TourStep[] = [
  // Same order as Part 2 of the step list: each flow once, never revisited.
  { hash: '#/beyond/discover', wait: 1800, say: 'Home level: Trips, Explore, You. Explore is for the next trip: what other crews did.' },
  { tap: { sel: '.b-dsc-cta' }, wait: 1500, say: 'Plan a trip like this opens New trip, already filled in for Porto.' },
  { hash: '#/beyond/trip/porto', wait: 1500, say: 'A brand new trip starts empty: one clear first step on Plan, Photos and Money.' },
  { hash: '#/beyond/create/where', wait: 2000, say: 'Create a trip: Porto, in three short steps. Tap Back or swipe down to leave any flow.' },
  { hash: '#/beyond/explore', wait: 1500, say: 'Explore: places other crews booked, reviewed and photographed.' },
  { scroll: 380, wait: 700 },
  { tap: { sel: '.b-fchip', text: 'Activity' }, wait: 1300, say: 'One row of type filters. The list fades instead of jumping.' },
  { tap: { sel: '.b-fchip', text: 'All' }, wait: 700 },
  { scroll: -380, wait: 500 },
  { hash: '#/beyond/explore/curate', wait: 1400, say: 'Find a place: one question per screen. Tap a tile and it moves on.' },
  { tap: { sel: '.b-fp-photo' }, wait: 1100 },
  { tap: { sel: '.b-fp-glass', nth: 1 }, wait: 1100 },
  { tap: { sel: '.b-fp-photo' }, wait: 1100 },
  { tap: { sel: '.b-fp-glass', nth: 1 }, wait: 1600, say: 'Six picks, sorted by how often crews like yours booked.' },
  { tap: { sel: '.b-fp-add', nth: 0 }, wait: 900, say: 'Tap + to put a pick in the poll without opening it.' },
  { tap: { sel: '.b-fp-add', nth: 2 }, wait: 1400, say: 'The button keeps count: Start a poll with 2.' },
  { hash: '#/beyond/place/taberna', wait: 1500, say: 'The place card: photos, ratings, been-here count.' },
  { scroll: 520, wait: 1200 },
  { hash: '#/beyond/explore', wait: 1300, say: 'Back on the feed: places other crews booked and photographed.' },
  { scroll: 300, wait: 600 },
  { scroll: -300, wait: 500 },
  { tap: { sel: '.b-findhero' }, wait: 1500, say: 'Find a place is the one way in from Explore. The + keeps New poll everywhere else.' },
  { tap: { sel: '.b-cmp-cta', text: 'Start a poll' }, wait: 1500, optional: true },
  { hash: '#/poll/new', wait: 1500, say: 'The picks become the poll. Seeded title: Saturday dinner.' },
  { tap: { sel: '.b-tok', nth: 1 }, wait: 1500, say: 'The poll reads as one sentence. Tap any token to change it.' },
  { tap: { sel: '.b-cs-x' }, wait: 600 },
  { tap: { sel: '.b-cs-pick' }, wait: 1200, optional: true, say: 'Add a second pick from Explore with one tap.' },
  { tap: { sel: '.b-cmp-cta', text: 'Send' }, wait: 1500, say: 'Send to crew. Everyone gets a push and can vote from the Lock Screen.' },
  { hash: '#/beyond/plan/day', wait: 1600, say: 'The day plan for Saturday, Oct 17. Dinner landed as a booked item at 8:30 PM.' },
  { tap: { sel: '.b-fchip', text: 'Culture' }, wait: 1300 },
  { tap: { sel: '.b-fchip', text: 'All' }, wait: 900 },
  { hash: '#/beyond/expense/scan', wait: 4400, say: 'Add expense: scan the lunch receipt, then check the lines.' },
  { tap: { sel: '.b-bottom button', text: 'Assign items' }, wait: 1300, optional: true, say: 'Assign lines to people. Skip the wine if you did not drink it.' },
  { hash: '#/beyond/album', wait: 1300, say: 'Photos is a tab now: the shared album, by day or by place.' },
  { tap: { sel: '.b-pcell-who', nth: 1 }, wait: 1600, say: 'Every photo shows who took it. Tap a face to see only their photos.' },
  { tap: { sel: '.b-album-who-x' }, wait: 800 },
  { scroll: 320, wait: 600 },
  { tap: { sel: '.b-pcell' }, wait: 1600, say: 'Who took it, when and where.' },
  { hash: '#/beyond/invite', wait: 1400, say: 'Invite by link or QR code.' },
  { hash: '#/beyond/guest', wait: 1500, say: 'A guest votes from Safari, no install needed.' },
  { tap: { sel: '.b-gopt-info' }, wait: 1600, optional: true },
  { hash: '#/beyond/activity', wait: 1500, say: 'Activity: every vote, expense and payment in one feed.' },
  { hash: '#/beyond/recap', wait: 1600, say: 'The trip recap, and the money all settled.' },
  { scroll: 400, wait: 800 },
  { hash: '#/beyond/profile', wait: 1400, say: 'You: profile and settings, a Home level tab.' },
  { wait: 1200 },
];
