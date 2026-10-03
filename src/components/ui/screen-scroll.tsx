import type { ReactNode } from 'react';
import { ScrollView } from 'react-native';

import { makeThemedStyles } from '@/lib/theme';

/** テーマ背景のスクロール画面（フォーム画面などで使う）。 */
export function ScreenScroll({ children }: { children: ReactNode }) {
  const styles = useStyles();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

const useStyles = makeThemedStyles((c) => ({
  container: { flex: 1, backgroundColor: c.background },
  content: { paddingBottom: 24 },
}));
