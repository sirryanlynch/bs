import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef } from 'react';
import { track } from './analytics';
import { people as BASE, Person, USD } from '@sb/lib/data';
import { baseExpenses, crewIds, dinnerLines, Expense, Line, linesToShares, pairwise, simplify, nets, total, Transfer } from './ledger';
import { Settlement, SettleMethod, DisputeFix, roundCash, NIC_PROVENANCE } from '@sb/components/settle';
export { linesToShares as linesToSharesExport };

export type StepId = 'home' | 'trip' | 'invite' | 'explore' | 'create' | 'push' | 'live' | 'closed' | 'plan' | 'expense' | 'money' | 'settle' | 'squared';
export type Me = 'ari' | 'nic' | 'ren';
/** Views inside step 12, each reachable by #/settle/<view>. */
export type SettleView = 'choose' | 'cash' | 'partial' | 'pending' | 'handoff' | 'confirm' | 'confirmed' | 'receipt' | 'dispute' | 'offline';
export const SETTLE_VIEWS: { id: SettleView; label: string; time: string; hifi: string; as?: Me }[] = [
  { id: 'choose', label: 'Choose how', time: '10:38 PM', hifi: 'S1' },
  { id: 'cash', label: 'Count and round', time: '10:39 PM', hifi: 'S2' },
  { id: 'partial', label: 'Partial cash', time: '10:39 PM', hifi: 'X1' },
  { id: 'pending', label: 'Pending, with undo', time: '10:39 PM', hifi: 'S4' },
  { id: 'handoff', label: 'MB WAY hand-off', time: '10:39 PM', hifi: 'S1' },
  { id: 'confirm', label: 'Nic confirms', time: '10:39 PM', hifi: 'S5', as: 'nic' },
  { id: 'confirmed', label: 'Confirmed, 1 of 3', time: '10:40 PM', hifi: 'S6' },
  { id: 'receipt', label: 'Receipt', time: '10:40 PM', hifi: 'S7' },
  { id: 'dispute', label: 'Dispute', time: '10:41 PM', hifi: 'X2' },
  { id: 'offline', label: 'Offline', time: '10:39 PM', hifi: 'X3' },
];
export const isSettleView = (v: string | undefined): v is SettleView => SETTLE_VIEWS.some(x => x.id === v);
export const PLACE_NAMES: Record<string, [string, string, string]> = {
  taberna: ['Taberna da Rua das Flores', 'Taberna', '$$ · 6 min walk'], ramiro: ['Cervejaria Ramiro', 'Ramiro', '$$$ · 14 min walk'],
  park: ['Park Rooftop', 'Park Rooftop', '$$ · 9 min walk'], eurico: ['O Velho Eurico', 'Eurico', '$$ · 12 min walk'],
  cevi: ['A Cevicheria', 'Cevicheria', '$$ · 11 min walk'], esquina: ['Tasca da Esquina', 'Esquina', '$$ · 13 min walk'],
};
const CANON = ['taberna', 'ramiro', 'park'];
export const optIds = (s: { shortlist: string[] }) => (s.shortlist.length === 3 ? s.shortlist : CANON);
export const optName = (s: { shortlist: string[] }, i = 0, short = false) => PLACE_NAMES[optIds(s)[i]][short ? 1 : 0];
export const optDetail = (s: { shortlist: string[] }, i: number) => PLACE_NAMES[optIds(s)[i]][2];

export type State = {
  step: StepId;
  me: Me;
  renJoined: boolean; renVia?: 'qr' | 'tripup';
  exploreStage: number; shortlist: string[];
  pollSent: boolean; votes: Record<string, number>; voteVia: Record<string, string>;
  pollClosed?: 'all' | 'timer' | 'pick'; tie: boolean; tiePath: boolean; winner?: number; clock: number; // minutes after 7:00 PM
  planAdded: boolean;
  lines: Line[]; dinnerSaved: boolean;
  simplified: boolean; settleOpen: boolean; method: string;
  paid: Record<string, 'app' | 'cash' | 'pending'>; transfers: Transfer[];
  recap: boolean; shared: boolean;
  /* settle-up v3 */
  settleView: SettleView; pick: SettleMethod; round: boolean; partial: boolean; partialAmt: number; stl?: Settlement; offline: boolean; fix: DisputeFix; notYet: boolean; undoAt?: number;
  toast?: { msg: string; id: number; tone?: 'success' | 'neutral' };
  done: Record<string, boolean>;
};

export const initial = (me: Me = 'ari'): State => ({
  step: 'home', me, renJoined: false, exploreStage: 0, shortlist: [],
  pollSent: false, votes: {}, voteVia: {}, tie: false, tiePath: false, clock: 2,
  planAdded: false,
  lines: dinnerLines(crewIds), dinnerSaved: false,
  simplified: false, settleOpen: false, method: 'MB WAY', paid: {}, transfers: [],
  recap: false, shared: false, done: { home: true },
  settleView: 'choose', pick: 'cash', round: true, partial: false, partialAmt: 20, offline: false, fix: 'coin', notYet: false,
});

export type Action =
  | { t: 'go'; step: StepId } | { t: 'set'; patch: Partial<State> } | { t: 'join'; via: 'qr' | 'tripup' }
  | { t: 'vote'; who: string; opt: number; via?: string } | { t: 'close'; by: 'all' | 'timer' } | { t: 'pick'; opt: number }
  | { t: 'toggleLine'; line: string; who: string } | { t: 'saveDinner' } | { t: 'pay'; key: string; how: 'app' | 'cash' | 'pending' }
  | { t: 'toast'; msg: string; tone?: 'success' | 'neutral' } | { t: 'done'; key: string } | { t: 'reset'; me?: Me } | { t: 'load'; s: State }
  | { t: 'view'; v: SettleView } | { t: 'payApp' } | { t: 'mark' } | { t: 'undo' } | { t: 'confirm' } | { t: 'dispute'; counted: number; note: string }
  | { t: 'resolve' } | { t: 'reconnect' } | { t: 'cancelMark' } | { t: 'handoff'; sent: boolean };

/** Canonical vote stream. Ari already voted Ramiro when sending. In the tie path João and Ren go Ramiro. */
export const STREAM = (tiePath: boolean) => [
  { who: 'ari', opt: 1, at: 1 }, { who: 'nic', opt: 0, via: 'the push', at: 2 }, { who: 'mara', opt: 0, at: 6 }, { who: 'sofia', opt: 0, at: 9 },
  { who: 'tomas', opt: 2, at: 13 }, { who: 'joao', opt: tiePath ? 1 : 0, at: 21 }, { who: 'ren', opt: tiePath ? 1 : 0, via: 'the web as a guest', at: 24 },
];

const tally = (v: Record<string, number>) => [0, 1, 2].map(i => Object.values(v).filter(x => x === i).length);

function finishPoll(s: State, by: 'all' | 'timer'): State {
  const t = tally(s.votes); const max = Math.max(...t); const top = t.map((x, i) => x === max ? i : -1).filter(i => i >= 0);
  if (top.length > 1) return { ...s, tie: true, pollClosed: by, clock: 30 };
  return { ...s, pollClosed: by, winner: top[0], tie: false, clock: by === 'timer' ? 30 : s.clock, done: { ...s.done, closed: true } };
}

export function reducer(s: State, a: Action): State {
  switch (a.t) {
    case 'go': return { ...s, step: a.step, settleOpen: a.step === 'settle', done: { ...s.done, [a.step]: true } };
    case 'view': return { ...s, step: 'settle', settleView: a.v, notYet: false, done: { ...s.done, settle: true, [`v-${a.v}`]: true } };
    case 'payApp': {
      const e = myEdge(s); const due = dueOf(s); const key = `${e.from}>${e.to}`;
      const stl: Settlement = { ...stlBase(s), due, paid: due, carry: 0, method: 'tripup', status: 'confirmed', markedAt: '10:39:12 PM', confirmedAt: '10:39:12 PM' };
      return { ...s, stl, paid: { ...s.paid, [key]: 'app' }, transfers: [...s.transfers, { from: e.from, to: e.to, amt: due }], settleView: 'confirmed', done: { ...s.done, 'v-confirmed': true } };
    }
    case 'mark': {
      const due = dueOf(s); const r = roundCash(due);
      const paidAmt = s.partial ? Math.min(s.partialAmt, due) : s.round ? r.paid : due;
      const carry = s.partial || !s.round ? 0 : r.carry;
      const stl: Settlement = { ...stlBase(s), due, paid: paidAmt, carry, method: 'cash', status: s.offline ? 'queued' : 'pending', partial: s.partial && paidAmt < due - 0.004, markedAt: '10:39:04 PM' };
      const key = keyOf(s);
      return { ...s, stl, paid: { ...s.paid, [key]: 'pending' }, settleView: s.offline ? 'offline' : 'pending', undoAt: s.offline ? undefined : Date.now(),
        done: { ...s.done, settle: true, cash: carry > 0 || !!s.done.cash, [`v-${s.offline ? 'offline' : 'pending'}`]: true, ...(stl.partial ? { 'v-partial': true } : {}) } };
    }
    case 'undo': case 'cancelMark': { const paid = { ...s.paid }; delete paid[keyOf(s)]; return { ...s, stl: undefined, paid, undoAt: undefined, offline: a.t === 'cancelMark' ? false : s.offline, settleView: 'cash', partial: false }; }
    case 'confirm': {
      if (!s.stl) return s; const st = s.stl; const e = myEdge(s);
      const stl: Settlement = { ...st, status: 'confirmed', confirmedAt: '10:40:12 PM', dispute: undefined };
      const paid = { ...s.paid }; if (st.partial) delete paid[keyOf(s)]; else paid[keyOf(s)] = st.method === 'cash' ? 'cash' : 'app';
      return { ...s, me: 'ari', stl, paid, transfers: [...s.transfers, { from: e.from, to: e.to, amt: st.paid }], settleView: 'confirmed', undoAt: undefined, notYet: false,
        done: { ...s.done, nicconfirm: true, 'v-confirmed': true }, toast: undefined };
    }
    case 'dispute': return s.stl ? { ...s, me: 'ari', notYet: false, undoAt: undefined, stl: { ...s.stl, status: 'disputed', dispute: { counted: a.counted, note: a.note, at: '10:41 PM' } }, settleView: 'dispute', done: { ...s.done, 'v-dispute': true } } : s;
    case 'resolve': {
      if (!s.stl) return s;
      if (s.fix === 'cancel') return reducer(s, { t: 'cancelMark' });
      const counted = s.stl.dispute?.counted ?? s.stl.paid;
      const stl: Settlement = s.fix === 'change' ? { ...s.stl, paid: counted, carry: 0, partial: true, status: 'pending', dispute: undefined } : { ...s.stl, status: 'pending', dispute: undefined };
      return { ...s, stl, settleView: 'pending', toast: { msg: s.fix === 'change' ? `Sent to Nic: ${USD.format(counted)} in cash` : 'Sent to Nic: the missing $2.00 is on its way', id: Date.now(), tone: 'neutral' } };
    }
    case 'reconnect': return s.stl ? { ...s, offline: false, stl: { ...s.stl, status: s.stl.status === 'queued' ? 'pending' : s.stl.status }, settleView: s.settleView === 'offline' ? 'pending' : s.settleView, toast: { msg: 'Back online. Sent to Nic.', id: Date.now(), tone: 'success' } } : { ...s, offline: false };
    case 'handoff': {
      if (!a.sent) return { ...s, settleView: 'choose' };
      const due = dueOf(s);
      const stl: Settlement = { ...stlBase(s), due, paid: due, carry: 0, method: s.pick, status: 'pending', markedAt: '10:39:40 PM' };
      return { ...s, stl, paid: { ...s.paid, [keyOf(s)]: 'pending' }, settleView: 'pending', undoAt: undefined };
    }
    case 'set': return { ...s, ...a.patch };
    case 'done': return { ...s, done: { ...s.done, [a.key]: true } };
    case 'join': return s.renJoined ? s : { ...s, renJoined: true, renVia: a.via, done: { ...s.done, invite: true }, toast: { msg: 'Ren joined as a guest just now', id: Date.now(), tone: 'success' } };
    case 'vote': {
      if (s.pollClosed || s.votes[a.who] != null && a.who !== s.me) return s;
      const votes = { ...s.votes, [a.who]: a.opt };
      const step = STREAM(s.tiePath).find(x => x.who === a.who);
      let n: State = { ...s, votes, voteVia: a.via ? { ...s.voteVia, [a.who]: a.via } : s.voteVia, clock: Math.max(s.clock, step?.at ?? s.clock) };
      if (Object.keys(votes).length >= 7) n = finishPoll(n, 'all');
      return n;
    }
    case 'close': return s.pollClosed ? s : finishPoll(s, a.by);
    case 'pick': return { ...s, winner: a.opt, tie: true, pollClosed: 'pick', done: { ...s.done, closed: true, tie: true } };
    case 'toggleLine': return { ...s, lines: s.lines.map(l => l.id !== a.line ? l : { ...l, who: l.who.includes(a.who) ? (l.who.length > 1 ? l.who.filter(x => x !== a.who) : l.who) : [...l.who, a.who] }) };
    case 'saveDinner': return { ...s, dinnerSaved: true, done: { ...s.done, expense: true }, toast: { msg: 'Dinner saved. Balances updated.', id: Date.now(), tone: 'success' } };
    case 'pay': {
      const [from, to] = a.key.split('>');
      const edge = simplifyOf(s).find(e => e.from === from && e.to === to);
      const paid = { ...s.paid, [a.key]: a.how };
      const left = edge ? edge.amt - s.transfers.filter(t => t.from === from && t.to === to).reduce((x, t) => x + t.amt, 0) : 0;
      const transfers = a.how === 'pending' || !edge || left < 0.005 ? s.transfers : [...s.transfers, { from, to, amt: Math.round(left * 100) / 100 }];
      return { ...s, paid, transfers };
    }
    case 'toast': return { ...s, toast: { msg: a.msg, id: Date.now(), tone: a.tone } };
    case 'reset': return initial(a.me ?? s.me);
    case 'load': return a.s;
  }
}

export function expensesOf(s: State): Expense[] {
  const ex = baseExpenses.filter(e => !e.needsRen || s.renJoined);
  if (s.dinnerSaved) ex.push({ id: 'e7', title: `Dinner at ${optName(s, s.winner ?? 0, true)}`, payer: 'ari', amount: 248.7, shares: linesToShares(s.lines), category: 'fork', date: 'Tonight' });
  return ex;
}
/** The payment this phone is settling: Ari pays Nic in the canonical story. */
export const myEdge = (s: State) => { const plan = simplifyOf(s); return plan.find(e => e.from === 'ari') ?? plan[0]; };
export const keyOf = (s: State) => { const e = myEdge(s); return `${e.from}>${e.to}`; };
/** What is still open on that pair after any partial cash. */
export const dueOf = (s: State) => { const e = myEdge(s); const done = s.transfers.filter(t => t.from === e.from && t.to === e.to).reduce((a, t) => a + t.amt, 0); return Math.round((e.amt - done) * 100) / 100; };
const stlBase = (s: State): Settlement => { const e = myEdge(s); const n = s.transfers.some(t => t.from === e.from && t.to === e.to); return { id: n ? 'stl_7Q2K-0042-b' : 'stl_7Q2K-0042', clientId: 'c_ari_7Q2K_0042' + (n ? 'b' : ''), from: e.from, to: e.to, due: e.amt, paid: e.amt, carry: 0, method: s.pick, status: 'draft', provenance: NIC_PROVENANCE }; };
/** Deep-link presets: every settle view built from the same canonical state. */
export function settlePreset(v: SettleView, base: State): State {
  let s: State = { ...base, step: 'settle', settleView: 'choose', pick: 'cash', round: true, partial: false, partialAmt: 20, stl: undefined, offline: false, fix: 'coin', notYet: false, undoAt: undefined, me: 'ari' };
  const at = (x: State, view: SettleView) => ({ ...x, settleView: view, done: { ...x.done, settle: true, [`v-${view}`]: true } });
  switch (v) {
    case 'choose': case 'cash': return at(s, v);
    case 'partial': return at({ ...s, partial: true }, 'partial');
    case 'handoff': return at({ ...s, pick: 'mbway' }, 'handoff');
    case 'pending': return reducer(s, { t: 'mark' });
    case 'offline': return reducer({ ...s, offline: true }, { t: 'mark' });
    case 'confirm': return { ...at(reducer(s, { t: 'mark' }), 'confirm'), me: 'nic', undoAt: undefined };
    case 'confirmed': case 'receipt': return at(reducer(reducer(s, { t: 'mark' }), { t: 'confirm' }), v);
    case 'dispute': return reducer(reducer(s, { t: 'mark' }), { t: 'dispute', counted: 40, note: 'Got two twenties, nothing else.' });
  }
}

/** The six IOUs before any settling, from expenses only. */
export const rawOf = (s: State) => pairwise(expensesOf(s));
/** The simplified plan before payments, so paid rows stay visible as done. */
export const simplifyOf = (s: State) => simplify(rawOf(s));
/** Live balances after payments. */
export const liveNets = (s: State) => nets(pairwise(expensesOf(s), s.transfers));
export { total, tally };

/* ---------- Steps: titles, tour captions, Figma frame, and how to fast-forward past each ---------- */
export type StepMeta = { id: StepId; n: string; title: string; caption: string; time: string; hifi: (s: State) => string; req: string; complete: (s: State) => State };
const ff = (s: State, a: Action[]) => a.reduce(reducer, s);
export const STEPS: StepMeta[] = [
  { id: 'home', n: '01', title: 'All trips', time: '6:52 PM', req: 'Home shows every trip, with the live one first',
    caption: 'Last night in Lisbon. The live trip sits on top.', hifi: () => '01', complete: s => s },
  { id: 'trip', n: '02', title: 'Lisbon Crew', time: '6:53 PM', req: 'Trip group view with tonight, people and money',
    caption: 'Tonight has one gap: dinner at 8:30 PM.', hifi: () => '02', complete: s => s },
  { id: 'invite', n: '03', title: 'Add Ren', time: '6:54 PM', req: 'Add a person by invite sheet, QR or TripUp contacts',
    caption: 'Ren landed today with no app. He joins from a QR code.', hifi: s => s.renVia === 'tripup' ? 'E03' : '03', complete: s => ff(s, [{ t: 'join', via: 'qr' }, { t: 'set', patch: { toast: undefined } }]) },
  { id: 'explore', n: '04', title: 'Explore', time: '6:56 PM', req: 'Explore narrows the city with a progress ring',
    caption: 'Four quick questions, starting with how you get there, take 120 spots down to 6.', hifi: () => 'E05', complete: s => ({ ...s, exploreStage: 4, shortlist: ['taberna', 'ramiro', 'park'], done: { ...s.done, explore: true } }) },
  { id: 'create', n: '05', title: 'New poll', time: '6:58 PM', req: 'Create a poll with 3 restaurants',
    caption: 'Three picks become a poll that closes at 7:30 PM.', hifi: () => '04', complete: s => ({ ...s, pollSent: true, done: { ...s.done, create: true } }) },
  { id: 'push', n: '06', title: 'Push', time: '7:02 PM', req: 'Push notification with an answer right from the lock screen',
    caption: 'Nic votes from the Lock Screen in one tap.', hifi: () => '05', complete: s => ff(s, [{ t: 'vote', who: 'nic', opt: 0, via: 'the push' }, { t: 'done', key: 'push' }]) },
  { id: 'live', n: '07', title: 'Live poll', time: '7:17 PM', req: 'Votes stream in with a live leading option',
    caption: 'Votes stream in and the leader updates live.', hifi: s => s.me === 'ren' ? 'E04' : '06',
    complete: s => ff(s, [...STREAM(s.tiePath).filter(v => s.votes[v.who] == null).map(v => ({ t: 'vote', who: v.who, opt: v.opt, via: v.via }) as Action), { t: 'done', key: 'live' }]) },
  { id: 'closed', n: '08', title: 'Poll closes', time: '7:30 PM', req: 'Poll closes on timer or when all voted, with a tie-break',
    caption: 'All 7 voted, so it closed early. On a tie, Ari picks.', hifi: s => s.tie && s.pollClosed !== 'pick' ? 'E01' : '07', complete: s => s.tie && s.winner == null ? ff(s, [{ t: 'pick', opt: 0 }]) : s },
  { id: 'plan', n: '09', title: 'Tonight', time: '7:31 PM', req: 'Winner added to the itinerary',
    caption: 'The winner lands in tonight, picked by poll.', hifi: () => '07', complete: s => ({ ...s, planAdded: true, done: { ...s.done, plan: true } }) },
  { id: 'expense', n: '10', title: 'Split dinner', time: '10:36 PM', req: 'Itemize dinner and take Ren and Nic off the wine',
    caption: 'Ren and Nic skip the wine, so they pay $30.10.', hifi: () => '08',
    complete: s => { const t = { ...s, lines: s.lines.map(l => l.id === 'wine' ? { ...l, who: crewIds.filter(x => x !== 'ren' && x !== 'nic') } : l) }; return reducer(reducer(t, { t: 'saveDinner' }), { t: 'set', patch: { toast: undefined } }); } },
  { id: 'money', n: '11', title: 'Balances', time: '10:38 PM', req: 'Balances update and debts simplify from 6 to 3',
    caption: 'Six IOUs simplify to three payments.', hifi: s => s.simplified ? '09' : '09a', complete: s => ({ ...s, simplified: true, done: { ...s.done, money: true, simplify: true } }) },
  { id: 'settle', n: '12', title: 'Settle up', time: '10:39 PM', req: 'Settle in the app or mark as cash',
    caption: 'Pay in the app, or count out cash, slide, and Nic confirms.', hifi: s => SETTLE_VIEWS.find(v => v.id === s.settleView)?.hifi ?? 'S1',
    complete: s => ff(s, simplifyOf(s).filter(e => !s.paid[`${e.from}>${e.to}`] || s.paid[`${e.from}>${e.to}`] === 'pending').map(e => ({ t: 'pay', key: `${e.from}>${e.to}`, how: e.from === 'mara' ? 'cash' : 'app' }) as Action).concat([{ t: 'done', key: 'settle' }])) },
  { id: 'squared', n: '13', title: 'All squared up', time: '10:41 PM', req: 'All squared up, with a shareable recap',
    caption: 'Zero owed, and a recap to share.', hifi: s => s.recap ? 'E10' : '10', complete: s => s },
];
export const stepIndex = (id: StepId) => STEPS.findIndex(x => x.id === id);

/** Jump: replay the canonical path up to a step, so every screen shows real, consistent state. */
export function stateAt(id: StepId, base: State): State {
  let s = initial(base.me); s.tiePath = base.tiePath;
  const k = stepIndex(id);
  for (let i = 0; i < k; i++) { s = reducer(s, { t: 'go', step: STEPS[i].id }); s = STEPS[i].complete(s); }
  s = reducer(s, { t: 'go', step: id });
  return { ...s, toast: undefined };
}

export const CHECKS: { key: string; label: string; test: (s: State) => boolean }[] = [
  { key: 'home', label: 'Home with all trips', test: s => !!s.done.home },
  { key: 'trip', label: 'Trip group view', test: s => !!s.done.trip },
  { key: 'invite', label: 'Ren added by QR or TripUp', test: s => s.renJoined },
  { key: 'explore', label: 'Explore with progress ring', test: s => s.shortlist.length === 3 },
  { key: 'create', label: 'Poll with 3 restaurants', test: s => s.pollSent },
  { key: 'push', label: 'Push notification answered', test: s => s.votes.nic != null },
  { key: 'live', label: 'Votes stream, live leader', test: s => Object.keys(s.votes).length >= 5 },
  { key: 'closed', label: 'Poll closed (all voted or timer)', test: s => !!s.pollClosed },
  { key: 'tie', label: 'Tie-break path', test: s => !!s.done.tie },
  { key: 'plan', label: 'Winner in itinerary', test: s => s.planAdded },
  { key: 'expense', label: 'Dinner itemized, Ren and Nic off wine', test: s => s.dinnerSaved && wineOff(s) },
  { key: 'money', label: 'Balances updated live', test: s => s.dinnerSaved && !!s.done.money },
  { key: 'simplify', label: 'Debts simplified 6 to 3', test: s => s.simplified },
  { key: 'settle', label: 'Settled in app or cash', test: s => Object.values(s.paid).some(v => v === 'app' || v === 'cash') },
  { key: 'cashround', label: 'Cash counted, rounded, carry kept', test: s => !!s.done.cash },
  { key: 'nicconfirm', label: 'Nic confirmed the cash', test: s => !!s.done.nicconfirm },
  { key: 'edges', label: 'Cash edges: partial, dispute, offline', test: s => !!(s.done['v-partial'] && s.done['v-dispute'] && s.done['v-offline']) },
  { key: 'squared', label: 'All squared up', test: s => s.dinnerSaved && Object.keys(s.paid).filter(k => s.paid[k] !== 'pending').length >= 3 },
  { key: 'recap', label: 'Recap shared', test: s => s.shared },
];
export const wineOff = (s: State) => { const w = s.lines.find(l => l.id === 'wine')!; return !w.who.includes('ren') && !w.who.includes('nic') && w.who.length === 5; };

/* ---------- Context ---------- */
type Ctx = { s: State; d: React.Dispatch<Action>; P: Record<string, Person>; nm: (id: string, cap?: boolean) => string };
const C = createContext<Ctx>(null as any);
export const useApp = () => useContext(C);
export function AppProvider({ s, d, children }: { s: State; d: React.Dispatch<Action>; children: React.ReactNode }) {
  const P = useMemo(() => {
    const o: Record<string, Person> = {};
    Object.values(BASE).forEach(p => (o[p.id] = { ...p, you: p.id === s.me }));
    o.ren = { ...o.ren, name: 'Ren' };
    return o;
  }, [s.me]);
  const nm = (id: string, cap = true) => (id === s.me ? (cap ? 'You' : 'you') : P[id].name);
  return <C.Provider value={{ s, d, P, nm }}>{children}</C.Provider>;
}
export function useStore() {
  const [s, dispatch] = useReducer(reducer, undefined as any, () => initial());
  const sRef = useRef(s);
  sRef.current = s;
  const d = useCallback((a: Action) => {
    const before = sRef.current;
    const after = reducer(before, a);
    if (a.t === 'vote' && before.votes[a.who] == null && after.votes[a.who] != null) {
      track('poll_vote', { who: a.who, option_index: a.opt, via: a.via || 'in_app' });
    } else if (a.t === 'saveDinner' && !before.dinnerSaved && after.dinnerSaved) {
      track('expense_added', { amount: 248.7 });
    } else if (a.t === 'pay' || a.t === 'confirm') {
      const plan = simplifyOf(before);
      const settled = (st: State) => plan.length > 0 && plan.every(e => {
        const v = st.paid[`${e.from}>${e.to}`];
        return !!v && v !== 'pending';
      });
      if (settled(after) && !settled(before)) track('settle_complete', { payments: plan.length });
    }
    sRef.current = after;
    dispatch(a);
  }, []);
  return [s, d] as const;
}
export const clockStr = (m: number) => `7:${String(Math.min(30, m)).padStart(2, '0')} PM`;
/** Status bars use the 12-hour clock without AM or PM, the way iOS shows it. */
export const statusTime = (t: string) => t.replace(/ ?[AP]M$/, '');
/** 10:39:04 PM becomes 10:39 PM. */
export const hm = (t: string) => t.replace(/^(\d{1,2}:\d\d):\d\d/, '$1');
export const haptic = (ms = 8) => { try { (navigator as any).vibrate?.(ms); } catch { /* not supported */ } };
