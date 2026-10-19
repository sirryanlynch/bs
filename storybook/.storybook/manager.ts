import { addons } from '@storybook/manager-api';
import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { prismLight, prismDark, preferredTheme } from './prismThemes';

/* The Theme toolbar global restyles the whole manager (sidebar, toolbar, panels), not only the canvas. */
const themeFor = (t?: string) => (t === 'dark' ? prismDark : prismLight);
let current = preferredTheme();
addons.setConfig({ theme: themeFor(current), sidebar: { showRoots: true }, enableShortcuts: true });

addons.register('tripup/prism-theme', (api) => {
  const apply = (t?: string) => {
    if (!t || t === current) return;
    current = t as 'light' | 'dark';
    addons.setConfig({ theme: themeFor(t) });
    api.setOptions({ theme: themeFor(t) });
    document.documentElement.style.colorScheme = t;
  };
  const ch = addons.getChannel();
  const fromPayload = (p: any) => apply(p?.globals?.theme);
  ch.on(SET_GLOBALS, fromPayload);
  ch.on(GLOBALS_UPDATED, fromPayload);
  ch.on(UPDATE_GLOBALS, fromPayload);
  api.setOptions({ theme: themeFor(current) });
});
