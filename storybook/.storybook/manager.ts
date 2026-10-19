import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'TripUp · Prism',
    colorPrimary: '#6E5BFF',
    colorSecondary: '#6E5BFF',
    appBg: '#F5F4F8',
    appContentBg: '#FFFFFF',
    appBorderColor: 'rgba(22,22,29,0.09)',
    fontBase: "'Inter', -apple-system, system-ui, sans-serif",
    textColor: '#16161D',
    barSelectedColor: '#6E5BFF',
  }),
  sidebar: { showRoots: true },
});
