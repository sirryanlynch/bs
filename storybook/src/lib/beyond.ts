/* Story data for the flows beyond tonight: create a trip, Explore, place cards, the album, the day plan,
   receipt scan, invites, the recap, activity and settings. Same crew, same numbers as the Lisbon scenario. */
import { people, photo, places } from './data';
import type { ExperienceType } from '../data/experienceTypes';

/** New Pexels photos (credited in storybook/src/docs and the site credits). */
export const px = {
  natas: './photos/px_12232125.jpg', // Joan Costa
  nataView: './photos/px_12221772.jpg', // Pexels contributor
  belem: './photos/px_16335878.jpg', // Marcelo Verfe
  belemLawn: './photos/px_11717754.jpg', // Joan Costa
  crewTable: './photos/px_12955617.jpg', // Atlantic Ambience
  candleDinner: './photos/px_3755084.jpg', // Sebastian Coman Photography
  gardenDinner: './photos/px_8841431.jpg', // Julia M Cameron
  bellas: './photos/px_17359340.jpg', // Hazel Montero
  bellasDome: './photos/px_33745931.jpg', // Arthur Brognoli
  coyoacan: './photos/px_37739301.jpg', // Pexels contributor
  cdmxDoor: './photos/px_29696337.jpg', // Pexels contributor
  porto: './photos/px_35340134.jpg', // Travel Photographer
  portoBoats: './photos/px_35349860.jpg', // maria Chaile
  portoRibeira: './photos/px_35716780.jpg', // Pedro Soares
  sesimbra: './photos/px_29693824.jpg', // Abdulmomen Bsruki
  diver: './photos/px_3113225.jpg', // Pexels contributor
  lxFactory: './photos/px_10805104.jpg', // Jo Kassis
  sardines: './photos/px_32561233.jpg', // Jose Cruz
  selfie: './photos/px_8720138.jpg', // Kampus Production
  sunsetCrew: './photos/px_35999359.jpg', // Niklas Jeromin
  sunsetCrowd: './photos/px_37442559.jpg', // Pexels contributor
  riverside: './photos/px_37296507.jpg', // Pexels contributor
};
export const ALL = { ...photo, ...px };

export const PHOTO_CREDITS: [string, string, string][] = [
  ['px_12232125', 'Joan Costa', 'Pastel de nata on the table'],
  ['px_12221772', 'Pexels contributor', 'Hand holding a pastry, Lisbon'],
  ['px_16335878', 'Marcelo Verfe', 'Belém Tower'],
  ['px_11717754', 'Joan Costa', 'Tower of Belém with visitors'],
  ['px_12955617', 'Atlantic Ambience', 'Friends at a restaurant'],
  ['px_3755084', 'Sebastian Coman Photography', 'Dinner table toast'],
  ['px_8841431', 'Julia M Cameron', 'Toast at dinner with friends'],
  ['px_17359340', 'Hazel Montero', 'Palacio de Bellas Artes facade'],
  ['px_33745931', 'Arthur Brognoli', 'Palacio de Bellas Artes'],
  ['px_37739301', 'Pexels contributor', 'Street in Coyoacán'],
  ['px_29696337', 'Pexels contributor', 'Doorway in Coyoacán'],
  ['px_35340134', 'Travel Photographer', 'Ribeira, Porto'],
  ['px_35349860', 'maria Chaile', 'Boats on the Douro'],
  ['px_35716780', 'Pedro Soares', 'Ribeira and the Douro, Porto'],
  ['px_29693824', 'Abdulmomen Bsruki', 'Coast at Sesimbra'],
  ['px_3113225', 'Pexels contributor', 'Scuba diver'],
  ['px_10805104', 'Jo Kassis', 'LX Factory from above'],
  ['px_32561233', 'Jose Cruz', 'Grilled sardines, Lisbon'],
  ['px_8720138', 'Kampus Production', 'Friends under the 25 de Abril bridge'],
  ['px_35999359', 'Niklas Jeromin', 'Friends at sunset over Lisbon'],
  ['px_37442559', 'Pexels contributor', 'Sunset crowd over Lisbon'],
  ['px_37296507', 'Pexels contributor', 'Riverside at golden hour'],
];

export const P = people;
export const CREW = ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'];

/* ---------- Trip days (Lisbon Crew, Oct 12 to 17, 2026; tonight is Saturday Oct 17, the last night) ---------- */
export const DAYS = [
  { id: 'oct12', dow: 'Mon', n: 12, label: 'Monday, Oct 12' },
  { id: 'oct13', dow: 'Tue', n: 13, label: 'Tuesday, Oct 13' },
  { id: 'oct14', dow: 'Wed', n: 14, label: 'Wednesday, Oct 14' },
  { id: 'oct15', dow: 'Thu', n: 15, label: 'Thursday, Oct 15' },
  { id: 'oct16', dow: 'Fri', n: 16, label: 'Friday, Oct 16' },
  { id: 'oct17', dow: 'Sat', n: 17, label: 'Saturday, Oct 17' },
];

/* ---------- Community places (Explore + place cards) ---------- */
export type Kind = Exclude<ExperienceType, 'all' | 'travel'>;
export type CommunityPlace = {
  id: string; name: string; area: string; type: string; kind: Kind; price: string; rating: number; reviews: number;
  beenHere: number; crews: number; saves: number; walk: number; drive: number; photos: string[]; tags: string[];
  snippet: { who: string; text: string }; signal: 'booked' | 'been' | 'saves';
};
export const COMMUNITY: CommunityPlace[] = [
  { id: 'taberna', name: places.taberna.name, area: 'Chiado', type: 'Petiscos', kind: 'food', price: '$$', rating: 4.7, reviews: 128, beenHere: 342, crews: 12, saves: 860, walk: 6, drive: 4,
    photos: [photo.taberna, px.candleDinner, px.sardines, px.crewTable, px.gardenDinner], tags: ['Small plates', 'No bookings', 'Groups of 8 max'],
    snippet: { who: 'Lena, Berlin', text: 'Queue at 6:45 PM and you sit by 7:15 PM. Order the tuna.' }, signal: 'booked' },
  { id: 'ramiro', name: places.ramiro.name, area: 'Intendente', type: 'Seafood', kind: 'food', price: '$$$', rating: 4.6, reviews: 211, beenHere: 516, crews: 19, saves: 1240, walk: 14, drive: 8,
    photos: [photo.ramiro, px.sardines, px.crewTable], tags: ['Seafood', 'Loud, in a good way', 'Prego for dessert'],
    snippet: { who: 'Dev, Toronto', text: 'Garlic prawns, then a prego. Lines move fast after 10:00 PM.' }, signal: 'booked' },
  { id: 'park', name: places.park.name, area: 'Bairro Alto', type: 'Rooftop bar', kind: 'drinks', price: '$$', rating: 4.5, reviews: 96, beenHere: 288, crews: 7, saves: 640, walk: 9, drive: 6,
    photos: [photo.bridge, px.sunsetCrowd, px.riverside], tags: ['Sunset', 'Top of a car park', 'Cocktails'],
    snippet: { who: 'Mara, your crew', text: 'Go up before 7:00 PM. The elevator is slow, the view is worth it.' }, signal: 'been' },
  { id: 'manteigaria', name: 'Manteigaria', area: 'Chiado', type: 'Bakery', kind: 'food', price: '$', rating: 4.8, reviews: 402, beenHere: 1180, crews: 31, saves: 2210, walk: 4, drive: 3,
    photos: [px.natas, px.nataView], tags: ['Pastéis de nata', 'Standing only', 'Warm from the oven'],
    snippet: { who: 'Sam, Austin', text: 'Two each is the right number. Eat them on the curb, still warm.' }, signal: 'saves' },
  { id: 'belem', name: 'Torre de Belém', area: 'Belém', type: 'Landmark', kind: 'culture', price: '$', rating: 4.6, reviews: 318, beenHere: 940, crews: 22, saves: 1520, walk: 52, drive: 18,
    photos: [px.belem, px.belemLawn], tags: ['River views', 'Go early', 'Combine with Jerónimos'],
    snippet: { who: 'Ines, Porto', text: 'Skip the climb if the line is long. The lawn at 9:00 AM is the best part.' }, signal: 'booked' },
  { id: 'lxfactory', name: 'LX Factory', area: 'Alcântara', type: 'Market and shops', kind: 'culture', price: '$$', rating: 4.5, reviews: 187, beenHere: 610, crews: 14, saves: 980, walk: 38, drive: 12,
    photos: [px.lxFactory, px.crewTable], tags: ['Sunday market', 'Bookshop', 'Lunch spots'],
    snippet: { who: 'Tomás, your crew', text: 'Ler Devagar bookshop, then lunch upstairs. Easy half day.' }, signal: 'been' },
  { id: 'graca', name: places.graca.name, area: 'Graça', type: 'Viewpoint', kind: 'culture', price: 'Free', rating: 4.7, reviews: 154, beenHere: 720, crews: 16, saves: 1300, walk: 18, drive: 9,
    photos: [photo.roofs, px.sunsetCrew], tags: ['Sunset', 'Kiosk drinks', 'Uphill walk'],
    snippet: { who: 'Aiko, Osaka', text: 'Best light at 7:20 PM. Grab a ginjinha from the kiosk.' }, signal: 'saves' },
  { id: 'pink', name: places.pink.name, area: 'Cais do Sodré', type: 'Bar street', kind: 'drinks', price: '$', rating: 4.3, reviews: 233, beenHere: 870, crews: 18, saves: 760, walk: 11, drive: 7,
    photos: [photo.pinkStreet, photo.bar], tags: ['Late', 'Loud after 11:00 PM', 'Cheap drinks'],
    snippet: { who: 'Jo, London', text: 'Start at Pensão Amor, end wherever the music is.' }, signal: 'been' },
  { id: 'sailing', name: 'Tejo sunset sail', area: 'Doca de Alcântara', type: 'Boat tour', kind: 'active', price: '$$', rating: 4.8, reviews: 142, beenHere: 410, crews: 11, saves: 890, walk: 40, drive: 14,
    photos: [photo.bridge, px.riverside], tags: ['2 hours', 'Under the bridge', 'Drinks on board'],
    snippet: { who: 'Nic, your crew', text: 'Book the 5:30 PM sail. You pass under the bridge right at golden hour.' }, signal: 'booked' },
  { id: 'dive', name: 'Dive Point Sesimbra', area: 'Sesimbra', type: 'Scuba diving', kind: 'active', price: '$$$', rating: 4.9, reviews: 64, beenHere: 120, crews: 5, saves: 310, walk: 400, drive: 45,
    photos: [px.diver, px.riverside, photo.bridge], tags: ['Beginner dives', 'Gear included', 'Leaves 6:00 AM'],
    snippet: { who: 'Kai, Sydney', text: 'Calm water inside the bay. Octopus on the first dive.' }, signal: 'been' },
];
export const placeById = (id: string) => COMMUNITY.find(p => p.id === id) ?? COMMUNITY[0];

export type Review = { id: string; who: string; from: string; rating: number; when: string; text: string; crew?: boolean; photos?: string[] };
export const REVIEWS: Record<string, Review[]> = {
  taberna: [
    { id: 'r1', who: 'Lena K.', from: 'Berlin', rating: 5, when: 'Visited Oct 2026', text: 'Queue at 6:45 PM and you sit by 7:15 PM. Order the tuna and whatever is on the chalkboard.', photos: [px.candleDinner] },
    { id: 'r2', who: 'Dev P.', from: 'Toronto', rating: 4, when: 'Visited Sep 2026', text: 'Tiny room, big flavor. Our crew of 6 fit at the back table.' },
    { id: 'r3', who: 'Aiko M.', from: 'Osaka', rating: 5, when: 'Visited Aug 2026', text: 'Cash or card, both fine. The waiter picked our wine and nailed it.' },
  ],
};
export const reviewsOf = (id: string): Review[] => REVIEWS[id] ?? [
  { id: id + 'a', who: 'Sam R.', from: 'Austin', rating: 5, when: 'Visited Oct 2026', text: placeById(id).snippet.text },
  { id: id + 'b', who: 'Ines F.', from: 'Porto', rating: 4, when: 'Visited Sep 2026', text: 'Worth the detour. Go on a weekday if you can.' },
];

/* ---------- Progressive filters: how you get there, then how long, then the rest ---------- */
export type Mode = 'walk' | 'drive' | 'destination';
export const MODES: { id: Mode; label: string; sub: string; range: string }[] = [
  { id: 'walk', label: 'Walk', sub: 'Close by, on foot', range: 'Up to 1.5 mi' },
  { id: 'drive', label: 'Drive', sub: 'Car, taxi or ride share', range: 'Up to 25 mi' },
  { id: 'destination', label: 'Destination', sub: 'Worth a trip', range: 'Up to 100 mi' },
];
export const DURATIONS: Record<Mode, { label: string; n: number }[]> = {
  walk: [{ label: '5 min', n: 9 }, { label: '10 min', n: 22 }, { label: '20 min', n: 41 }],
  drive: [{ label: '10 min', n: 34 }, { label: '20 min', n: 58 }, { label: '40 min', n: 77 }],
  destination: [{ label: 'Under 1 hr', n: 12 }, { label: 'Half day', n: 19 }, { label: 'Day trip', n: 26 }],
};
export const CURATE_STEPS = ['How are you getting there?', 'How long is OK?', 'What are you in the mood for?', 'Price per person'];
/** Step 3 type options: the experience types Explore offers (no All, no Travel). */
export const AFTER = [{ label: 'Food', id: 'food', f: 0.42 }, { label: 'Drinks', id: 'drinks', f: 0.6 }, { label: 'Culture', id: 'culture', f: 0.34 }, { label: 'Activity', id: 'active', f: 0.22 }] as const;
export const BUDGET = [{ label: '$', f: 0.45 }, { label: '$$', f: 0.7 }, { label: '$$$', f: 0.5 }, { label: 'Any', f: 1 }];

/* ---------- Trips ---------- */
export const DESTINATIONS = [
  { id: 'porto', name: 'Porto', country: 'Portugal', sub: 'City · 3 hr by train from Lisbon', trip: 'Porto, wine weekend', photos: [px.portoRibeira, px.porto, px.portoBoats] },
  { id: 'portocovo', name: 'Porto Covo', country: 'Portugal', sub: 'Coastal village · Alentejo', photos: [] },
  { id: 'portosanto', name: 'Porto Santo', country: 'Madeira', sub: 'Island · 1 hr 30 min flight', photos: [] },
  { id: 'sesimbra', name: 'Sesimbra', country: 'Portugal', sub: 'Your crews went · day trip', photos: [px.sesimbra] },
  { id: 'cdmx', name: 'Mexico City', country: 'Mexico', sub: '14 TripUp crews went this year', photos: [px.bellas, px.coyoacan, px.bellasDome, px.cdmxDoor] },
  { id: 'kyoto', name: 'Kyoto', country: 'Japan', sub: 'Popular in spring', photos: [] },
  { id: 'marrakech', name: 'Marrakech', country: 'Morocco', sub: '3 hr flight from Lisbon', photos: [] },
];
export const FUTURE_TRIPS = [
  { id: 'ny', name: 'Lisbon, New Year', dates: 'Dec 31 to Jan 3', sub: 'In 75 days · 5 in', photo: photo.augusta, crew: CREW },
  { id: 'azores', name: 'Azores, dive week', dates: 'Jun 2027', sub: 'Idea · poll open on dates', photo: px.diver, crew: CREW },
];
export const PAST_TRIPS = [{ id: 'spring', name: 'Lisbon, spring', dates: 'Apr 2026', sub: 'Settled', photo: photo.tiles }];

/* ---------- Album ---------- */
export type AlbumPhoto = { id: string; src: string; who: string; day: string; time: string; place: string; publicShared?: boolean };
export const ALBUM: AlbumPhoto[] = [
  { id: 'a1', src: photo.taberna, who: 'mara', day: 'oct17', time: '8:52 PM', place: 'Taberna da Rua das Flores' },
  { id: 'a2', src: px.candleDinner, who: 'ari', day: 'oct17', time: '9:14 PM', place: 'Taberna da Rua das Flores' },
  { id: 'a3', src: px.natas, who: 'sofia', day: 'oct17', time: '7:18 PM', place: 'Manteigaria' },
  { id: 'a4', src: px.sunsetCrew, who: 'joao', day: 'oct17', time: '6:21 PM', place: 'Miradouro de Santa Catarina' },
  { id: 'a5', src: px.sunsetCrowd, who: 'nic', day: 'oct17', time: '6:33 PM', place: 'Miradouro de Santa Catarina' },
  { id: 'a6', src: px.lxFactory, who: 'tomas', day: 'oct15', time: '1:05 PM', place: 'LX Factory' },
  { id: 'a7', src: px.selfie, who: 'ari', day: 'oct15', time: '4:40 PM', place: '25 de Abril Bridge' },
  { id: 'a8', src: photo.tram, who: 'mara', day: 'oct15', time: '10:02 AM', place: 'Tram 28' },
  { id: 'a9', src: px.belem, who: 'sofia', day: 'oct14', time: '9:12 AM', place: 'Torre de Belém' },
  { id: 'a10', src: px.belemLawn, who: 'joao', day: 'oct14', time: '9:40 AM', place: 'Torre de Belém' },
  { id: 'a11', src: photo.bridge, who: 'nic', day: 'oct14', time: '5:55 PM', place: 'Tejo boat tour' },
  { id: 'a12', src: px.riverside, who: 'ari', day: 'oct14', time: '6:48 PM', place: 'Cais do Sodré' },
  { id: 'a13', src: photo.alfama, who: 'tomas', day: 'oct12', time: '5:10 PM', place: 'Alfama' },
  { id: 'a14', src: photo.azulejo, who: 'mara', day: 'oct12', time: '6:02 PM', place: 'Alfama' },
  { id: 'a15', src: photo.roofs, who: 'sofia', day: 'oct13', time: '7:30 PM', place: 'Miradouro da Graça' },
  { id: 'a16', src: px.sardines, who: 'joao', day: 'oct13', time: '1:20 PM', place: 'Cervejaria Ramiro' },
];
/** Photos on Ari's phone that are not in the album yet. */
export const CAMERA_ROLL = [
  { id: 'c1', src: px.crewTable, time: '9:31 PM' }, { id: 'c2', src: px.gardenDinner, time: '9:40 PM' },
  { id: 'c3', src: px.nataView, time: '7:22 PM' }, { id: 'c4', src: photo.chiado, time: '10:12 PM' },
  { id: 'c5', src: photo.pinkStreet, time: '10:31 PM' }, { id: 'c6', src: photo.facade, time: '5:48 PM' },
];

/* ---------- Day plan ---------- */
export type PlanItem = { id: string; xt: ExperienceType; time: string; title: string; place?: string; icon: string; part: 'morning' | 'afternoon' | 'evening'; kind?: 'booked' | 'plan' | 'idea'; note?: string; placeId?: string; by?: string };
export const DAY_PLAN: Record<string, PlanItem[]> = {
  oct12: [
    { id: 'm1', xt: 'travel', time: '10:40 AM', title: 'Fly SFO to LIS, TP 238', place: 'Lands 2:10 PM, Terminal 1', icon: 'plane', part: 'morning', kind: 'booked' },
    { id: 'm2', xt: 'travel', time: '4:00 PM', title: 'Check in, Alfama flat', place: 'Rua de São Miguel 14', icon: 'bed', part: 'afternoon', kind: 'booked' },
    { id: 'm3', xt: 'food', time: '8:00 PM', title: 'Dinner at O Velho Eurico', place: 'Alfama', icon: 'fork', part: 'evening', kind: 'booked', placeId: 'eurico' },
  ],
  oct13: [
    { id: 'w0', xt: 'active', time: '6:00 AM', title: 'Scuba diving, Sesimbra', place: 'Dive Point · 4 of 7 went', icon: 'waves', part: 'morning', kind: 'booked', placeId: 'dive' },
    { id: 't1', xt: 'food', time: '1:30 PM', title: 'Grilled sardines at the harbor', place: 'Sesimbra · $18 each', icon: 'fork', part: 'afternoon', kind: 'plan' },
  ],
  oct14: [
    { id: 'w1', xt: 'culture', time: '9:00 AM', title: 'Torre de Belém', place: 'Belém', icon: 'pin', part: 'morning', kind: 'plan', placeId: 'belem' },
    { id: 'w2', xt: 'food', time: '2:00 PM', title: 'Lunch at Zé da Mouraria', place: 'Mouraria · paid by you', icon: 'fork', part: 'afternoon', kind: 'plan' },
  ],
  oct16: [
    { id: 'f1', xt: 'travel', time: '9:10 AM', title: 'Train to Sintra', place: 'Rossio station · 40 min', icon: 'tram', part: 'morning', kind: 'booked' },
    { id: 'f2', xt: 'culture', time: '11:00 AM', title: 'Pena Palace', place: 'Sintra · tickets for 7', icon: 'bank', part: 'morning', kind: 'booked' },
    { id: 'f3', xt: 'food', time: '8:00 PM', title: 'Cervejaria Ramiro', place: 'Intendente · walk-in', icon: 'fork', part: 'evening', placeId: 'ramiro', kind: 'plan' },
  ],
  oct17: [
    { id: 'p1', xt: 'active', time: '10:30 AM', title: 'Tejo boat tour', place: 'From Cais do Sodré · 2 hr · $38 each', icon: 'waves', part: 'morning', kind: 'booked', placeId: 'sailing' },
    { id: 'p2', xt: 'food', time: '1:00 PM', title: 'Pastéis de Belém', place: 'After the boat · $1.50 each', icon: 'fork', part: 'afternoon', kind: 'plan', placeId: 'belem' },
    { id: 'p4', xt: 'drinks', time: '6:30 PM', title: 'Park Rooftop', place: 'Bairro Alto · now · 9 min walk', icon: 'wine', part: 'evening', kind: 'plan', placeId: 'park' },
    { id: 'p5', xt: 'food', time: '8:30 PM', title: 'Dinner · Taberna da Rua das Flores', place: 'Won the poll 5 of 7 · table for 7', icon: 'fork', part: 'evening', placeId: 'taberna', kind: 'booked' },
    { id: 'p6', xt: 'culture', time: '11:00 PM', title: 'Fado at Tasca do Chico', place: 'Rua do Diário de Notícias 39 · $10 each', icon: 'music', part: 'evening', kind: 'booked', note: 'Cash only at the door. Arrive by 10:45 PM.' },
  ],
};

/* ---------- Receipt for Add expense: Lunch at Zé da Mouraria, Wed, Oct 14 ($185.50 + 10% tip = $204.05, IVA included).
   The dinner at Taberna is a separate $248.70 expense in the core story. ---------- */
/** item: the Portuguese name; en: a short plain-English hint; cat: plain-English category; print: the paper receipt line (stays Portuguese).
 *  Mirrors SPEC-extended-flows.md Decisions 7 (Receipt copy). Grouped Starters, Meals, Wine, Drinks, Dessert. */
export type RLine = { id: string; item: string; en: string; cat: string; print: string; qty: number; price: number; conf: number };
export const RECEIPT: RLine[] = [
  { id: 'pao', item: 'Couvert', en: 'bread, butter', cat: 'Starters', print: 'COUVERT', qty: 1, price: 6, conf: 0.93 },
  { id: 'clams', item: 'Amêijoas à Bulhão Pato', en: 'clams', cat: 'Starters', print: 'AMÊIJOAS BULHÃO PATO', qty: 2, price: 34, conf: 0.97 },
  { id: 'polvo', item: 'Polvo à lagareiro', en: 'octopus', cat: 'Meals', print: 'POLVO LAGAREIRO', qty: 1, price: 26, conf: 0.96 },
  { id: 'bac', item: 'Bacalhau à Brás', en: 'cod', cat: 'Meals', print: 'BACALHAU BRÁS', qty: 2, price: 38, conf: 0.95 },
  { id: 'wine', item: 'Vinho Verde', en: 'bottle', cat: 'Wine', print: 'VINHO VERDE', qty: 3, price: 54, conf: 0.82 },
  { id: 'agua', item: 'Água', en: 'water', cat: 'Drinks', print: 'ÁGUA', qty: 4, price: 10, conf: 0.94 },
  { id: 'nata', item: 'Pastéis de nata', en: 'custard tarts', cat: 'Dessert', print: 'PASTEL DE NATA', qty: 7, price: 17.5, conf: 0.92 },
];
export const RECEIPT_CATS = ['Starters', 'Meals', 'Wine', 'Drinks', 'Dessert'];
/** "Bacalhau à Brás (cod)": the name people see on every receipt surface. */
export const lineLabel = (l: { item: string; en?: string }) => (l.en ? `${l.item} (${l.en})` : l.item);
export const RECEIPT_TOTAL = 185.5;
export const RECEIPT_PLACE = 'Zé da Mouraria';
export const RECEIPT_WHEN = 'Wed, Oct 14';

/* ---------- Activity ---------- */
export type Act = { id: string; kind: 'vote' | 'photo' | 'expense' | 'settle' | 'closed' | 'join' | 'poll'; who: string; text: string; time: string; group: 'Now' | 'Tonight' | 'Earlier today' | 'Yesterday'; thumb?: string; action?: string; unread?: boolean };
export const ACTIVITY: Act[] = [
  { id: 'v1', kind: 'settle', who: 'nic', text: 'Nic confirmed your $42.00 in cash', time: '10:40 PM', group: 'Now', unread: true },
  { id: 'v2', kind: 'expense', who: 'ari', text: 'You added Dinner at Taberna, $248.70', time: '10:36 PM', group: 'Now', unread: true },
  { id: 'v3', kind: 'photo', who: 'mara', text: 'Mara added 4 photos to the album', time: '9:58 PM', group: 'Tonight', thumb: photo.taberna, unread: true },
  { id: 'v4', kind: 'poll', who: 'tomas', text: 'Tomás started a poll: Drinks after fado?', time: '9:40 PM', group: 'Tonight', action: 'Vote' },
  { id: 'v5', kind: 'closed', who: 'ari', text: 'Dinner poll closed. Taberna won with 5 of 7.', time: '7:30 PM', group: 'Tonight' },
  { id: 'v6', kind: 'vote', who: 'ren', text: 'Ren voted Taberna from the web', time: '7:24 PM', group: 'Tonight' },
  { id: 'v7', kind: 'join', who: 'ren', text: 'Ren joined Lisbon Crew', time: '6:54 PM', group: 'Earlier today' },
  { id: 'v8', kind: 'photo', who: 'sofia', text: 'Sofia added 12 photos from Belém', time: '8:02 PM', group: 'Yesterday', thumb: px.belem },
  { id: 'v9', kind: 'settle', who: 'mara', text: 'Mara settled $37.70 with Sofia', time: '6:15 PM', group: 'Yesterday' },
];

/* ---------- Polls list ---------- */
export const POLLS = [
  { id: 'drinks', title: 'Drinks after fado?', when: 'Saturday, Oct 17 · 11:30 PM', status: 'open' as const, voted: 3, options: ['Park Rooftop', 'Rua Nova do Carvalho', 'Home, early night'], closes: 'Closes 11:15 PM' },
  { id: 'dinner', title: 'Saturday dinner', when: 'Saturday, Oct 17 · 8:30 PM', status: 'closed' as const, voted: 7, options: ['Taberna da Rua das Flores', 'Cervejaria Ramiro', 'Park Rooftop'], closes: 'Taberna won, 5 of 7' },
  { id: 'scuba', title: 'Scuba diving, Tuesday at 6:00 AM?', when: 'Tuesday, Oct 13 · 6:00 AM', status: 'closed' as const, voted: 7, options: ['Dive Point Sesimbra', 'Arrábida coast dive', 'Sleep in, meet at 11:00 AM'], closes: 'Sesimbra won, 5 of 7' },
  { id: 'boat', title: 'Boat tour or Sintra?', when: 'Wednesday, Oct 14 · 2:00 PM', status: 'closed' as const, voted: 6, options: ['Boat tour on the Tejo', 'Sintra'], closes: 'Boat tour won, 4 of 6' },
];
/** The seeded composer demo: an early dive in Sesimbra, planned on Monday night for Tuesday, Oct 13 (Oct 14, 2026 is a Wednesday). */
export const SCUBA = { day: 'oct13', time: '6:00 AM', category: 'active' as const, what: 'Scuba diving', title: 'Scuba diving, Tuesday at 6:00 AM?', options: ['Dive Point Sesimbra', 'Arrábida coast dive', 'Sleep in, meet at 11:00 AM'] };

/** Album photos inherit a type from where they were taken. */
const PLACE_TYPES: Record<string, ExperienceType> = {
  'Taberna da Rua das Flores': 'food', 'Manteigaria': 'food', 'Cervejaria Ramiro': 'food', 'Miradouro de Santa Catarina': 'culture',
  'LX Factory': 'culture', '25 de Abril Bridge': 'culture', 'Tram 28': 'active', 'Torre de Belém': 'culture', 'Tejo boat tour': 'active',
  'Cais do Sodré': 'drinks', 'Alfama': 'culture', 'Miradouro da Graça': 'culture',
};
export const placeType = (place: string): ExperienceType => PLACE_TYPES[place] ?? 'culture';
