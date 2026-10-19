/**
 * Experience types: the single taxonomy for filter chips across TripUp
 * (Plan and itinerary, Explore, the poll composer, place card tags, the album).
 * Shared with the Figma file. Travel is itinerary only, so Explore omits it.
 */
export type ExperienceType = 'all' | 'food' | 'drinks' | 'culture' | 'active' | 'travel';
export type ExperienceDef = { id: ExperienceType; label: string; covers: string; icon: string; itineraryOnly?: boolean };

export const EXPERIENCE_TYPES: ExperienceDef[] = [
  { id: 'all', label: 'All', covers: 'Everything', icon: 'grid' },
  { id: 'food', label: 'Food', covers: 'Dinner, lunch, cafes', icon: 'food' },
  { id: 'drinks', label: 'Drinks', covers: 'Bars, wine, rooftops', icon: 'martini' },
  { id: 'culture', label: 'Culture', covers: 'Museums, fado, landmarks', icon: 'bank' },
  { id: 'active', label: 'Active', covers: 'Scuba, tours, hikes, beaches', icon: 'waves' },
  { id: 'travel', label: 'Travel', covers: 'Flights, stays, transfers', icon: 'plane', itineraryOnly: true },
];

/** Types offered in a given surface. Explore and place discovery leave Travel out. */
export const typesFor = (surface: 'itinerary' | 'explore' | 'poll' | 'album') =>
  EXPERIENCE_TYPES.filter(t => surface === 'itinerary' || !t.itineraryOnly);

export const typeLabel = (id: ExperienceType) => EXPERIENCE_TYPES.find(t => t.id === id)?.label ?? 'All';

/** Seeded Lisbon items mapped to a type. Keys are place or item ids used across the prototype. */
export const SEEDED_TYPES: Record<string, ExperienceType> = {
  taberna: 'food', ramiro: 'food', manteigaria: 'food', eurico: 'food', cevi: 'food', esquina: 'food',
  park: 'drinks', pink: 'drinks',
  fado: 'culture', belem: 'culture', graca: 'culture', lxfactory: 'culture', santacatarina: 'culture',
  boat: 'active', tram28: 'active', scuba: 'active', sailing: 'active', dive: 'active',
  flight: 'travel', flat: 'travel', transfer: 'travel',
};
