import type { StorybookConfig } from '@storybook/react-vite';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
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
