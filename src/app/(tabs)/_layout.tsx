import { Link, Tabs } from 'expo-router';

import { makeThemedStyles, useTheme } from '@/lib/theme';

export default function TabsLayout() {
  const c = useTheme();
  const styles = useStyles();

  // 背景・ヘッダー・タブバーの色はルートのナビゲーションテーマ（navigationTheme）から適用される
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textMuted,
      }}>
      <Tabs.Screen name="index" options={{ title: 'ホーム' }} />
      <Tabs.Screen
        name="geckos"
        options={{
          title: '個体',
          headerRight: () => (
            <Link href="/geckos/new" style={styles.addButton}>
              追加
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="logs" options={{ title: '記録' }} />
    </Tabs>
  );
}

const useStyles = makeThemedStyles((c) => ({
  addButton: {
    color: c.primary,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
  },
}));
