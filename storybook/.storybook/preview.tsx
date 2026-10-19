import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import '../src/tokens/tokens.css';
import '../src/lib/fonts.css';
import '../src/components/prism.css';
import { PrismRoot } from '../src/lib/PrismRoot';
import { PhoneFrame } from '../src/lib/PhoneFrame';

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

const withPrism: Decorator = (Story, ctx) => {
  const { theme, motion, transparency } = ctx.globals;
  noteGlobals(theme, motion);
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

const preview: Preview = {
  decorators: [withPrism],
  globalTypes: {
    theme: {
      description: 'Colour mode',
      toolbar: { title: 'Theme', icon: 'mirror', dynamicTitle: true, items: [
        { value: 'light', title: 'Pearl (light)', icon: 'sun' },
        { value: 'dark', title: 'Graphite Pearl (dark)', icon: 'moon' },
      ] },
    },
    motion: {
      description: 'Motion preference',
      toolbar: { title: 'Motion', icon: 'play', dynamicTitle: true, items: [
        { value: 'full', title: 'Rich motion' },
        { value: 'reduce', title: 'Reduce Motion' },
      ] },
    },
    transparency: {
      description: 'Transparency preference',
      toolbar: { title: 'Glass', icon: 'contrast', dynamicTitle: true, items: [
        { value: 'full', title: 'Liquid Glass' },
        { value: 'reduce', title: 'Reduce Transparency' },
      ] },
    },
  },
  initialGlobals: { theme: 'light', motion: 'full', transparency: 'full' },
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    a11y: { config: { rules: [] } },
    options: { storySort: { order: ['Introduction', 'Foundations', ['Color', 'Typography', 'Spacing & Radius', 'Glass', 'Elevation', 'Motion', 'Iconography & Imagery'], 'Components', 'Patterns'] } },
    docs: { story: { inline: true } },
  },
};
export default preview;
