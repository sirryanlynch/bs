import { create } from '@storybook/theming/create';

/* Prism manager + docs themes. Values mirror tokens.css (Pearl light, Graphite Pearl dark). */
const font = "'Inter', -apple-system, system-ui, sans-serif";
const mono = "'JetBrains Mono', ui-monospace, Menlo, monospace";

export const prismLight = create({
  base: 'light',
  brandTitle: 'TripUp · Prism',
  colorPrimary: '#6E5BFF',
  colorSecondary: '#6E5BFF',
  appBg: '#F5F4F8',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#F5F4F8',
  appBorderColor: 'rgba(22,22,29,0.09)',
  appBorderRadius: 12,
  fontBase: font,
  fontCode: mono,
  textColor: '#16161D',
  textMutedColor: '#5C5B6A',
  textInverseColor: '#FFFFFF',
  barBg: '#FFFFFF',
  barTextColor: '#5C5B6A',
  barHoverColor: '#6E5BFF',
  barSelectedColor: '#6E5BFF',
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(22,22,29,0.14)',
  inputTextColor: '#16161D',
});

export const prismDark = create({
  base: 'dark',
  brandTitle: 'TripUp · Prism',
  colorPrimary: '#8F80FF',
  colorSecondary: '#8F80FF',
  appBg: '#131318',
  appContentBg: '#1A1A20',
  appPreviewBg: '#0D0D11',
  appBorderColor: 'rgba(255,255,255,0.12)',
  appBorderRadius: 12,
  fontBase: font,
  fontCode: mono,
  textColor: '#F5F4F8',
  textMutedColor: '#B4B2C0',
  textInverseColor: '#16161D',
  barBg: '#1A1A20',
  barTextColor: '#B4B2C0',
  barHoverColor: '#A99CFF',
  barSelectedColor: '#A99CFF',
  inputBg: '#212128',
  inputBorder: 'rgba(255,255,255,0.18)',
  inputTextColor: '#F5F4F8',
});

export const preferredTheme = (): 'light' | 'dark' =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
