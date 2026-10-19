/* The trip ledger. Every balance and every arrow in the prototype is computed from these rows. */
export type Expense = {
  id: string; title: string; payer: string; amount: number;
  shares: Record<string, number>; category: 'fork' | 'wine' | 'bed' | 'tram' | 'plane' | 'receipt'; date: string; needsRen?: boolean;
};
export type Transfer = { from: string; to: string; amt: number };
export type Line = { id: string; item: string; qty: number; price: number; who: string[]; group?: boolean };

export const baseExpenses: Expense[] = [
  { id: 'e1', title: 'Alfama flat deposit', payer: 'joao', amount: 163.4, shares: { ari: 37.7, mara: 40, sofia: 24, joao: 61.7 }, category: 'bed', date: 'Mon' },
  { id: 'e2', title: 'Sintra train and Pena tickets', payer: 'sofia', amount: 99.4, shares: { ari: 37.7, mara: 24, sofia: 37.7 }, category: 'tram', date: 'Tue' },
  { id: 'e3', title: 'Boat tour on the Tejo', payer: 'nic', amount: 102.3, shares: { ari: 30.1, tomas: 42.1, nic: 30.1 }, category: 'receipt', date: 'Wed' },
  { id: 'e4', title: 'LX Factory lunch and tram passes', payer: 'tomas', amount: 159.6, shares: { ari: 79.8, tomas: 79.8 }, category: 'tram', date: 'Thu' },
  { id: 'e5', title: 'Pastéis and ginjinha', payer: 'mara', amount: 75.4, shares: { ari: 37.7, mara: 37.7 }, category: 'fork', date: 'Today' },
  { id: 'e6', title: 'Fado tickets, Tasca do Chico', payer: 'ren', amount: 23.4, shares: { ari: 11.7, ren: 11.7 }, category: 'receipt', date: 'Today', needsRen: true },
];

export const crewIds = ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'];

export const dinnerLines = (members: string[]): Line[] => [
  { id: 'pet', item: 'Petiscos (small plates to share)', qty: 6, price: 62.4, who: members },
  { id: 'bac', item: 'Bacalhau à Brás (cod)', qty: 3, price: 51, who: members },
  { id: 'wine', item: 'Vinho Verde (bottle), Quinta da Aveleda', qty: 2, price: 38, who: members },
  { id: 'more', item: '3 more lines', qty: 1, price: 97.3, who: members, group: true },
];

const r2 = (n: number) => Math.round(n * 100) / 100;

export function linesToShares(lines: Line[]) {
  const s: Record<string, number> = {};
  lines.forEach(l => l.who.forEach(id => (s[id] = (s[id] ?? 0) + l.price / l.who.length)));
  Object.keys(s).forEach(k => (s[k] = r2(s[k])));
  return s;
}

/** Pairwise IOUs: for each expense, every sharer owes the payer their share. Opposite directions net out. */
export function pairwise(expenses: Expense[], transfers: Transfer[] = []) {
  const m: Record<string, Record<string, number>> = {};
  const add = (a: string, b: string, v: number) => { if (a === b) return; m[a] ??= {}; m[a][b] = (m[a][b] ?? 0) + v; };
  expenses.forEach(e => Object.entries(e.shares).forEach(([id, v]) => add(id, e.payer, v)));
  transfers.forEach(t => add(t.to, t.from, t.amt));
  const out: Transfer[] = [];
  const seen = new Set<string>();
  Object.keys(m).forEach(a => Object.keys(m[a]).forEach(b => {
    const k = [a, b].sort().join('|'); if (seen.has(k)) return; seen.add(k);
    const v = r2((m[a]?.[b] ?? 0) - (m[b]?.[a] ?? 0));
    if (v > 0.004) out.push({ from: a, to: b, amt: v }); else if (v < -0.004) out.push({ from: b, to: a, amt: -v });
  }));
  return out;
}

export function nets(edges: Transfer[]) {
  const n: Record<string, number> = {};
  edges.forEach(e => { n[e.from] = r2((n[e.from] ?? 0) - e.amt); n[e.to] = r2((n[e.to] ?? 0) + e.amt); });
  return n;
}

/** Simplify: route every chain A to X to B through people who net to zero, then merge parallel edges.
 *  Nobody ends up paying someone they had no money story with unless a zero-net friend sat in the middle. */
export function simplify(edges: Transfer[]) {
  let E = edges.map(e => ({ ...e }));
  const n = nets(E);
  for (let guard = 0; guard < 50; guard++) {
    const x = Object.keys(n).find(id => Math.abs(n[id]) < 0.005 && E.some(e => e.to === id) && E.some(e => e.from === id));
    if (!x) break;
    const ins = E.find(e => e.to === x)!, outs = E.find(e => e.from === x)!;
    const v = r2(Math.min(ins.amt, outs.amt));
    ins.amt = r2(ins.amt - v); outs.amt = r2(outs.amt - v);
    E.push({ from: ins.from, to: outs.to, amt: v });
    E = merge(E);
  }
  return merge(E);
}

function merge(E: Transfer[]) {
  const m = new Map<string, number>();
  E.forEach(e => { if (e.from === e.to || e.amt < 0.005) return; const k = `${e.from}>${e.to}`, rk = `${e.to}>${e.from}`;
    if (m.has(rk)) m.set(rk, r2(m.get(rk)! - e.amt)); else m.set(k, r2((m.get(k) ?? 0) + e.amt)); });
  const out: Transfer[] = [];
  m.forEach((v, k) => { const [a, b] = k.split('>'); if (v > 0.004) out.push({ from: a, to: b, amt: v }); else if (v < -0.004) out.push({ from: b, to: a, amt: -v }); });
  return out;
}

export const total = (E: Transfer[]) => r2(E.reduce((a, e) => a + e.amt, 0));
