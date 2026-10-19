import React, { useEffect, useState } from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { DocsContainer } from '@storybook/blocks';
import { addons } from '@storybook/preview-api';
import { GLOBALS_UPDATED, SET_GLOBALS } from 'storybook/internal/core-events';
import '../src/tokens/tokens.css';
import '../src/lib/fonts.css';
import '../src/components/prism.css';
import './docs-theme.css';
import tokensRaw from '../src/tokens/tokens.css?raw';
import { PrismRoot } from '../src/lib/PrismRoot';
import { PhoneFrame } from '../src/lib/PhoneFrame';
import { prismLight, prismDark, preferredTheme } from './prismThemes';

let lastTheme: string | undefined;
let lastMotion: string | undefined;
function noteGlobals(theme?: string, motion?: string) {
  const track = (window as Window & { tripupTrack?: (name: string, params?: Record<string, unknown>) => void }).tripupTrack;
  if (typeof track !== 'function') {
    lastTheme = theme;
    lastMotion = motion;
    return;
  }
  if (lastTheme !== undefined && theme !== lastTheme) track('theme_toggle', { theme, surface: 'storybook' });
  if (lastMotion !== undefined && motion !== lastMotion) track('reduce_motion_toggle', { motion, surface: 'storybook' });
  lastTheme = theme;
  lastMotion = motion;
}

type G = { theme?: string; motion?: string; transparency?: string };

/* Light tokens live on :root. When the docs root is dark, a nested light PrismRoot (for example the
   light column on the Color page) needs them re-declared, so copy the :root block onto light roots. */
(() => {
  const m = tokensRaw.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!m || typeof document === 'undefined') return;
  const s = document.createElement('style');
  s.dataset.prism = 'light-scope';
  s.textContent = `.prism[data-theme="light"], [data-theme="light"] .prism:not(.theme-dark) {${m[1]}\n}`;
  document.head.appendChild(s);
})();

/* Globals restyle the whole preview document, docs pages included, not only the story inside a frame. */
function applyRoot(g: G) {
  const r = document.documentElement;
  const theme = g.theme === 'dark' ? 'dark' : 'light';
  r.dataset.theme = theme;
  r.dataset.motion = g.motion === 'reduce' ? 'reduce' : 'full';
  r.dataset.transparency = g.transparency === 'reduce' ? 'reduce' : 'full';
  r.style.colorScheme = theme;
}
const channel = addons.getChannel();
const onGlobals = (p: any) => p?.globals && applyRoot(p.globals);
channel.on(SET_GLOBALS, onGlobals);
channel.on(GLOBALS_UPDATED, onGlobals);

/* Docs pages switch their Storybook theme (headings, tables, code blocks, ArgsTable) with the Theme global. */
function PrismDocsContainer(props: any) {
  const read = () => props.context?.store?.userGlobals?.globals?.theme ?? props.context?.store?.globals?.get?.()?.theme;
  const [theme, setTheme] = useState<string>(read() ?? preferredTheme());
  useEffect(() => {
    const on = (p: any) => p?.globals?.theme && setTheme(p.globals.theme);
    channel.on(GLOBALS_UPDATED, on); channel.on(SET_GLOBALS, on);
    return () => { channel.off(GLOBALS_UPDATED, on); channel.off(SET_GLOBALS, on); };
  }, []);
  return <DocsContainer {...props} theme={theme === 'dark' ? prismDark : prismLight} />;
}

const withPrism: Decorator = (Story, ctx) => {
  const { theme, motion, transparency } = ctx.globals;
  noteGlobals(theme, motion);
  applyRoot(ctx.globals);
  const frame = ctx.parameters.frame ?? 'phone';
  const inDocs = ctx.viewMode === 'docs';
  const content = (
    <PrismRoot theme={theme} motion={motion} transparency={transparency} fill={frame === 'phone'}>
      <Story />
    </PrismRoot>
  );
  if (frame === 'phone') {
    return (
      <div className={`sb-stage ${theme === 'dark' ? 'sb-stage-dark' : ''} ${inDocs ? 'sb-stage-docs' : ''}`}>
        <PhoneFrame theme={theme} screen={ctx.parameters.screen ?? 'component'} statusLight={!!ctx.parameters.statusLight}>{content}</PhoneFrame>
      </div>
    );
  }
  return <div className={`sb-plain ${theme === 'dark' ? 'sb-stage-dark' : ''}`}>{content}</div>;
};

const startTheme = preferredTheme();
if (typeof document !== 'undefined') applyRoot({ theme: startTheme });

const preview: Preview = {
  decorators: [withPrism],
  globalTypes: {
    theme: {
      description: 'Theme: switch all of Storybook between Pearl (light) and Graphite Pearl (dark)',
      toolbar: { title: 'Theme', icon: 'mirror', dynamicTitle: true, items: [
        { value: 'light', title: 'Pearl (light)', icon: 'sun' },
        { value: 'dark', title: 'Graphite Pearl (dark)', icon: 'moon' },
      ] },
    },
    motion: {
      description: 'Motion: preview Rich motion or the Reduce Motion fallbacks',
      toolbar: { title: 'Motion', icon: 'play', dynamicTitle: true, items: [
        { value: 'full', title: 'Rich motion' },
        { value: 'reduce', title: 'Reduce Motion' },
      ] },
    },
    transparency: {
      description: 'Glass: preview Liquid Glass or Reduce Transparency (opaque surfaces)',
      toolbar: { title: 'Glass', icon: 'contrast', dynamicTitle: true, items: [
        { value: 'full', title: 'Liquid Glass' },
        { value: 'reduce', title: 'Reduce Transparency' },
      ] },
    },
  },
  initialGlobals: { theme: startTheme, motion: 'full', transparency: 'full' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { config: { rules: [] } },
    options: { storySort: { order: ['Introduction', 'Foundations', ['Color', 'Typography', 'Spacing & Radius', 'Glass', 'Elevation', 'Motion', 'Iconography & Imagery'], 'Components', 'Patterns'] } },
    docs: { story: { inline: true }, container: PrismDocsContainer },
  },
};
export default preview;
