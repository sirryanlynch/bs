type Params = Record<string, string | number | boolean | undefined>;

/** Sends a GA4 event when analytics is on. No-op when the measurement id is empty or Do Not Track is set. */
export function track(name: string, params?: Params) {
  const fn = (window as Window & { tripupTrack?: (name: string, params?: Params) => void }).tripupTrack;
  if (typeof fn === "function") fn(name, params);
}
