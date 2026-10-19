import React, { createContext, useContext } from 'react';

export type PrismPrefs = { theme: 'light' | 'dark'; motion: 'full' | 'reduce'; transparency: 'full' | 'reduce' };
const Ctx = createContext<PrismPrefs>({ theme: 'light', motion: 'full', transparency: 'full' });
export const usePrism = () => useContext(Ctx);

/** True when motion should collapse to fades and instant state changes. */
export function useReducedMotion() {
  const { motion } = usePrism();
  const media = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return motion === 'reduce' || !!media;
}

export function PrismRoot({ theme = 'light', motion = 'full', transparency = 'full', fill, children }:
  Partial<PrismPrefs> & { fill?: boolean; children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ theme, motion, transparency }}>
      <div
        className={`prism ${theme === 'dark' ? 'theme-dark' : ''} ${fill ? 'prism-fill' : ''}`}
        data-theme={theme}
        data-motion={motion}
        data-transparency={transparency}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}
