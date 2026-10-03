import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

// デザインシステムの色。設計書「カラーパレット」をセマンティックトークンとして集約する。
// コンポーネントは hex を直接書かず、useTheme() / makeThemedStyles() 経由で参照する。

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  /** 画面全体の背景 */
  background: string;
  /** カード */
  surface: string;
  /** 入力欄・チップ・バーのトラック等の一段沈んだ面 */
  surfaceAlt: string;
  /** ボタン・選択中（レオパイエロー） */
  primary: string;
  /** primary の上に載せる文字色 */
  onPrimary: string;
  /** 見出し・ラベル（スポットブラウン） */
  accent: string;
  /** アバター等のアクセント面 */
  accentSurface: string;
  text: string;
  textMuted: string;
  border: string;
  /** 正常（適正範囲内） */
  normal: string;
  /** 注意（範囲の端・受信遅れ・給餌予定超過） */
  warning: string;
  /** 危険（範囲外・受信途絶） */
  danger: string;
  /** 注意バッジの面 */
  warningSurface: string;
}

export const palettes: Record<ColorScheme, ThemeColors> = {
  light: {
    background: '#F7F3EC', // サンド
    surface: '#FFFFFF',
    surfaceAlt: '#EFE7DA',
    primary: '#E8A33D', // レオパイエロー
    onPrimary: '#14161A',
    accent: '#4A3B2C', // スポットブラウン
    accentSurface: '#EADFCB',
    text: '#1F1A14',
    textMuted: '#6B6358',
    border: '#E3DACB',
    normal: '#2E9E6B',
    warning: '#D9901A',
    danger: '#D64545',
    warningSurface: '#FBEBD0',
  },
  dark: {
    background: '#14161A', // ナイト
    surface: '#1E2127',
    surfaceAlt: '#2A2E35',
    primary: '#F0B65A',
    onPrimary: '#14161A',
    accent: '#CBB89D',
    accentSurface: '#4A3B2C',
    text: '#F5F5F5',
    textMuted: '#8A8F98',
    border: '#2A2E35',
    normal: '#4CC38A',
    warning: '#F2B44A',
    danger: '#F07070',
    warningSurface: '#3A2E12',
  },
};

/** OS の設定値をスキームに解決する。light 以外（dark・不明）はダーク（ダークモード基本）。 */
export function resolveScheme(raw: string | null | undefined): ColorScheme {
  return raw === 'light' ? 'light' : 'dark';
}

// Storybook やテストでスキームを固定するための上書き用 Context。未指定なら OS 設定に追従。
const SchemeOverrideContext = createContext<ColorScheme | null>(null);

export function ColorSchemeProvider({
  scheme,
  children,
}: {
  scheme?: ColorScheme;
  children: ReactNode;
}) {
  return (
    <SchemeOverrideContext.Provider value={scheme ?? null}>{children}</SchemeOverrideContext.Provider>
  );
}

export function useColorSchemeName(): ColorScheme {
  const override = useContext(SchemeOverrideContext);
  const system = useColorScheme();
  return override ?? resolveScheme(system);
}

/** 現在のスキームの色トークン。 */
export function useTheme(): ThemeColors {
  return palettes[useColorSchemeName()];
}

/**
 * テーマ色を使うスタイルシートのフックを作る。
 * 使い方: const useStyles = makeThemedStyles((c) => ({ card: { backgroundColor: c.surface } }));
 *        function C() { const styles = useStyles(); ... }
 */
export function makeThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (c: ThemeColors) => T,
) {
  return function useThemedStyles(): T {
    const c = useTheme();
    return useMemo(() => StyleSheet.create(factory(c)), [c]);
  };
}

/** expo-router（React Navigation）のヘッダー/タブ用テーマ。 */
export function navigationTheme(scheme: ColorScheme): Theme {
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const c = palettes[scheme];
  return {
    ...base,
    dark: scheme === 'dark',
    colors: {
      primary: c.primary,
      background: c.background,
      card: c.surface,
      text: c.text,
      border: c.border,
      notification: c.danger,
    },
  };
}
