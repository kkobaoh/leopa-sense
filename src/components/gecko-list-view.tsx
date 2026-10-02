import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import type { Gecko } from '@/lib/api';
import { GeckoCard } from './gecko-card';

export interface GeckoListViewProps {
  isLoading: boolean;
  isError: boolean;
  geckos: Gecko[];
  onSelectGecko?: (id: string) => void;
}

/**
 * 個体一覧の見た目（props のみ）。読込中・エラー・空・一覧の 4 状態を描画する。
 * データ取得は呼び出し側（ルート）で useGeckos から渡す。
 */
export function GeckoListView({ isLoading, isError, geckos, onSelectGecko }: GeckoListViewProps) {
  if (isLoading) {
    return (
      <View testID="gecko-list-loading" style={styles.center}>
        <ActivityIndicator color="#F0B65A" />
      </View>
    );
  }

  if (isError) {
    return (
      <View testID="gecko-list-error" style={styles.center}>
        <Text style={styles.errorText}>読み込みに失敗しました</Text>
        <Text style={styles.hint}>通信環境を確認してもう一度お試しください</Text>
      </View>
    );
  }

  if (geckos.length === 0) {
    return (
      <View testID="gecko-list-empty" style={styles.center}>
        <Text style={styles.emptyTitle}>個体がいません</Text>
        <Text style={styles.hint}>個体を登録するとここに表示されます</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={geckos}
      keyExtractor={(g) => g.id}
      renderItem={({ item }) => <GeckoCard gecko={item} onPress={onSelectGecko} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 24,
    backgroundColor: '#14161A',
  },
  errorText: { color: '#F07070', fontSize: 16, fontWeight: '700' },
  emptyTitle: { color: '#F5F5F5', fontSize: 16, fontWeight: '700' },
  hint: { color: '#8A8F98', fontSize: 13, textAlign: 'center' },
  list: { flex: 1, backgroundColor: '#14161A' },
  listContent: { padding: 16 },
  separator: { height: 12 },
});
