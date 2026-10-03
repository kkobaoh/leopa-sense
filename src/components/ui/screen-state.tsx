import { ActivityIndicator, Text, View } from 'react-native';

import { makeThemedStyles, useTheme } from '@/lib/theme';

/** 画面中央のローディング表示。 */
export function LoadingState({ testID }: { testID?: string }) {
  const styles = useStyles();
  const c = useTheme();
  return (
    <View testID={testID} style={styles.center}>
      <ActivityIndicator color={c.primary} />
    </View>
  );
}

/** 画面中央のメッセージ表示（空状態・not found・エラー）。tone="error" で危険色。 */
export function MessageState({
  testID,
  title,
  hint,
  tone = 'default',
}: {
  testID?: string;
  title: string;
  hint?: string;
  tone?: 'default' | 'error';
}) {
  const styles = useStyles();
  return (
    <View testID={testID} style={styles.center}>
      <Text style={[styles.title, tone === 'error' && styles.titleError]}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const useStyles = makeThemedStyles((c) => ({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: c.background,
  },
  title: { color: c.text, fontSize: 16, fontWeight: '700' },
  titleError: { color: c.danger },
  hint: { color: c.textMuted, fontSize: 13, textAlign: 'center' },
}));
