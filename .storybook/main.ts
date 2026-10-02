import { resolve } from 'node:path';

import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [],
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {},
  },
  async viteFinal(viteConfig) {
    // tsconfig の "@/*" -> src/* エイリアスを Storybook(Vite) でも解決する。
    // 注: @/assets を使う場合は別途エイリアスを足すこと。
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias ?? {}),
      '@': resolve(process.cwd(), 'src'),
    };
    return viteConfig;
  },
};

export default config;
