export type Person = { id: string; name: string; initials: string; you?: boolean; tone: number };
export const people: Record<string, Person> = {
  ari: { id: 'ari', name: 'Ari', initials: 'A', you: true, tone: 0 },
  mara: { id: 'mara', name: 'Mara', initials: 'M', tone: 1 },
  joao: { id: 'joao', name: 'João', initials: 'J', tone: 2 },
  nic: { id: 'nic', name: 'Nic', initials: 'N', tone: 3 },
  sofia: { id: 'sofia', name: 'Sofia', initials: 'S', tone: 4 },
  tomas: { id: 'tomas', name: 'Tomás', initials: 'T', tone: 5 },
  ren: { id: 'ren', name: 'Ren', initials: 'R', tone: 5 },
};
export const crew = [people.ari, people.mara, people.nic, people.joao, people.sofia, people.tomas];
export const crewWithRen = [...crew, people.ren];

export const photo = {
  alfama: './photos/px_20594880.jpg',
  tram: './photos/px_29743109.jpg',
  bridge: './photos/px_33659321.jpg',
  roofs: './photos/px_33794158.jpg',
  tiles: './photos/px_33793961.jpg',
  azulejo: './photos/px_20111905.jpg',
  augusta: './photos/px_12400863.jpg',
  facade: './photos/px_35907807.jpg',
  chiado: './photos/px_31861341.jpg',
  pinkStreet: './photos/px_16742072.jpg',
  bar: './photos/px_35350019.jpg',
  taberna: './photos/px_34110274.jpg',
  ramiro: './photos/px_6314564.jpg',
  eurico: './photos/px_19721743.jpg',
  friends: './photos/px_6760852.jpg',
};

export const places = {
  taberna: { name: 'Taberna da Rua das Flores', area: 'Chiado', kind: 'Petiscos', price: '$$', rating: 4.7, photo: photo.taberna, note: 'No bookings. Queue by 6:45 PM.' },
  ramiro: { name: 'Cervejaria Ramiro', area: 'Intendente', kind: 'Seafood', price: '$$$', rating: 4.6, photo: photo.ramiro, note: 'Prego for dessert, house rule.' },
  eurico: { name: 'O Velho Eurico', area: 'Alfama', kind: 'Tasca', price: '$$', rating: 4.8, photo: photo.eurico, note: 'Book by phone. Cash friendly.' },
  park: { name: 'Park Rooftop', area: 'Bairro Alto', kind: 'Drinks and bites', price: '$$', rating: 4.5, photo: photo.bridge, note: 'Top of a car park. Go up before sunset.' },
  graca: { name: 'Miradouro da Graça', area: 'Graça', kind: 'Viewpoint', price: 'Free', rating: 4.7, photo: photo.roofs, note: 'Best at 7:20 PM for sunset.' },
  pink: { name: 'Rua Nova do Carvalho', area: 'Cais do Sodré', kind: 'Bars', price: '$', rating: 4.3, photo: photo.pinkStreet, note: 'Pink Street. Loud after 11:00 PM.' },
  tram: { name: 'Tram 28', area: 'Martim Moniz', kind: 'Ride', price: '$3', rating: 4.4, photo: photo.tram, note: 'Board at the first stop to sit.' },
};

/** US dollars, en-US. Negative amounts use the U+2212 minus sign: −$23.70. */
export const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const usd = (n: number, sign = false) => (sign && n > 0 ? '+' : n < 0 ? '−' : '') + USD.format(Math.abs(n));
