import { render, renderHook } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

import { StatusPill } from '@/components/ui/status-pill';
import {
  ColorSchemeProvider,
  navigationTheme,
  palettes,
  resolveScheme,
  useTheme,
} from '@/lib/theme';

describe('palettes', () => {
  it('設計書のカラーパレット（ライト/ダーク）に一致する', () => {
    expect(palettes.light).toMatchObject({
      background: '#F7F3EC',
      surface: '#FFFFFF',
      primary: '#E8A33D',
      accent: '#4A3B2C',
      normal: '#2E9E6B',
      warning: '#D9901A',
      danger: '#D64545',
    });
    expect(palettes.dark).toMatchObject({
      background: '#14161A',
      surface: '#1E2127',
      primary: '#F0B65A',
      accent: '#CBB89D',
      normal: '#4CC38A',
      warning: '#F2B44A',
      danger: '#F07070',
    });
  });

  it('ライトとダークで同じトークンを持つ', () => {
    expect(Object.keys(palettes.light).sort()).toEqual(Object.keys(palettes.dark).sort());
  });
});

describe('resolveScheme', () => {
  it('light 以外（dark / 不明）はダーク（ダークモード基本）', () => {
    expect(resolveScheme('light')).toBe('light');
    expect(resolveScheme('dark')).toBe('dark');
    expect(resolveScheme(null)).toBe('dark');
    expect(resolveScheme(undefined)).toBe('dark');
    expect(resolveScheme('unspecified')).toBe('dark');
  });
});

describe('useTheme', () => {
  const withScheme =
    (scheme: 'light' | 'dark') =>
    ({ children }: { children: ReactNode }) => (
      <ColorSchemeProvider scheme={scheme}>{children}</ColorSchemeProvider>
    );

  it('ColorSchemeProvider で指定したスキームのパレットを返す', async () => {
    const light = await renderHook(() => useTheme(), { wrapper: withScheme('light') });
    expect(light.result.current).toBe(palettes.light);

    const dark = await renderHook(() => useTheme(), { wrapper: withScheme('dark') });
    expect(dark.result.current).toBe(palettes.dark);
  });
});

describe('テーマのコンポーネント適用', () => {
  it('StatusPill の色がスキームで切り替わる', async () => {
    const colorOf = async (scheme: 'light' | 'dark') => {
      const { getByText } = await render(
        <ColorSchemeProvider scheme={scheme}>
          <StatusPill status="normal" />
        </ColorSchemeProvider>,
      );
      return StyleSheet.flatten(getByText('正常').props.style).color;
    };

    expect(await colorOf('light')).toBe(palettes.light.normal);
    expect(await colorOf('dark')).toBe(palettes.dark.normal);
  });
});

describe('navigationTheme', () => {
  it('ヘッダー/タブ用のナビゲーションテーマにパレットを反映する', () => {
    const dark = navigationTheme('dark');
    expect(dark.dark).toBe(true);
    expect(dark.colors.background).toBe(palettes.dark.background);
    expect(dark.colors.card).toBe(palettes.dark.surface);
    expect(dark.colors.primary).toBe(palettes.dark.primary);

    expect(navigationTheme('light').dark).toBe(false);
  });
});
