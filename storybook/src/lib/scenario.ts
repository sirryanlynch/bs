import { people as P, crewWithRen, places, photo } from './data';
// Numbers match the Figma hi-fi story: 7 people, Taberna wins 5 of 7 (71%), booked 8:30 PM, poll closes 7:30 PM.
export const dinnerPoll = {
  question: 'Dinner tonight?',
  options: [
    { label: 'Taberna da Rua das Flores', detail: 'Chiado · petiscos · $$', votes: 3, voters: [P.mara, P.joao, P.sofia], photo: places.taberna.photo },
    { label: 'Cervejaria Ramiro', detail: 'Intendente · seafood · $$$', votes: 2, voters: [P.ari, P.tomas], photo: places.ramiro.photo },
    { label: 'Park Rooftop', detail: 'Bairro Alto · drinks and bites · $$', votes: 0, voters: [], photo: places.park.photo },
  ],
};
export const dinnerPollClosed = {
  question: 'Dinner tonight?',
  options: [
    { label: 'Taberna da Rua das Flores', detail: 'Booked 8:30 PM · Chiado', votes: 5, voters: [P.mara, P.joao, P.sofia, P.nic, P.ren], photo: places.taberna.photo },
    { label: 'Cervejaria Ramiro', detail: 'Intendente · seafood · $$$', votes: 2, voters: [P.ari, P.tomas], photo: places.ramiro.photo },
    { label: 'Park Rooftop', detail: 'Bairro Alto · drinks and bites · $$', votes: 0, voters: [], photo: places.park.photo },
  ],
};
export const voters = crewWithRen;
const all = ['ari', 'mara', 'nic', 'joao', 'sofia', 'tomas', 'ren'];
const drinkers = ['ari', 'mara', 'joao', 'sofia', 'tomas'];
// Dinner $248.70: food $210.70 split 7 ($30.10 each), wine $38.00 split 5 ($7.60 each). Ren and Nic $30.10, everyone else $37.70.
export const wineReceipt = [
  { item: 'Petiscos (small plates to share)', price: 96.6, qty: 7, who: all },
  { item: 'Polvo à lagareiro (octopus)', price: 58.8, qty: 2, who: all },
  { item: 'Bacalhau à Brás (cod)', price: 34.3, qty: 2, who: all },
  { item: 'Pastéis de nata (custard tarts)', price: 12.6, qty: 7, who: all },
  { item: 'Água das Pedras (sparkling water)', price: 8.4, qty: 4, who: all },
  { item: 'Vinho Verde (bottle) × 2', price: 38.0, qty: 2, who: drinkers },
];
export const dinner = { total: 248.7, wine: 38, wineEach: 7.6, nonDrinker: 30.1, drinker: 37.7 };
export const tripPhotos = photo;
