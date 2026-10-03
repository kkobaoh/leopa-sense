import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import { ColorSchemeProvider, palettes, type ColorScheme } from '../src/lib/theme';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  // ツールバーでライト/ダークを切り替える（アプリはダークが基本）
  globalTypes: {
    theme: {
      description: 'カラースキーム',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'dark', title: 'ダーク' },
          { value: 'light', title: 'ライト' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'dark' },
  decorators: [
    (Story, context) => {
      const scheme = (context.globals.theme ?? 'dark') as ColorScheme;
      return (
        <ColorSchemeProvider scheme={scheme}>
          <View style={{ flex: 1, padding: 16, backgroundColor: palettes[scheme].background }}>
            <Story />
          </View>
        </ColorSchemeProvider>
      );
    },
  ],
};

export default preview;
