import type { StorybookConfig } from '@storybook/react-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    /* Backgrounds (and its grid), Measure, Outline and Viewport are off: stories already sit on Prism
       surfaces inside a device frame, so those toolbar buttons only confused the embed on slide 6. */
    { name: '@storybook/addon-essentials', options: { backgrounds: false, measure: false, outline: false, viewport: false } },
    '@storybook/addon-a11y',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  staticDirs: ['../public'],
  docs: { defaultName: 'Docs' },
  core: { disableTelemetry: true },
  async viteFinal(config, { configType }) {
    if (configType === 'PRODUCTION') config.base = './';
    return config;
  },
};
export default config;
