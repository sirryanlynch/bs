import { people as P, crewWithRen, photo, places } from './data';
import type { ItinItem } from '../components/trip';
export const friday: ItinItem[] = [
  { time: '14:10', title: 'Land at LIS, T1', place: 'Metro red line to Saldanha', icon: 'plane', kind: 'plan', people: crewWithRen },
  { time: '16:00', title: 'Check in, Alfama flat', place: 'Rua de São Miguel 14', icon: 'bed', kind: 'plan', cost: '€612 split 7 ways' },
  { time: '20:30', title: 'Dinner at Taberna da Rua das Flores', place: 'Chiado · booked for 7', icon: 'fork', kind: 'decided', decidedBy: '71%', photo: places.taberna.photo },
  { time: '21:30', title: 'Miradouro da Graça', place: 'Graça · 12 min walk uphill', icon: 'pin', kind: 'plan', photo: photo.roofs },
  { time: '23:00', title: 'Drinks on Pink Street', place: 'Cais do Sodré', icon: 'wine', kind: 'tentative' },
];
export const saturday: ItinItem[] = [
  { time: '09:30', title: 'Tram 28 from Martim Moniz', place: 'Board at the first stop to sit', icon: 'tram', kind: 'now', photo: photo.tram },
  { time: '13:00', title: 'Lunch at Cervejaria Ramiro', place: 'Intendente', icon: 'fork', kind: 'plan', photo: places.ramiro.photo },
  { time: '20:30', title: 'Dinner at O Velho Eurico', place: 'Alfama · booked by phone', icon: 'fork', kind: 'plan', photo: places.eurico.photo },
];
