import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { FeedingResult } from '@/lib/api';
import { formatFedAt, RESULT_LABEL } from '@/lib/feeding-display';
import type { FeedingLogEntry } from '@/lib/feeding-log';

const RESULT_COLOR: Record<FeedingResult, string> = {
  eaten: '#4CC38A',
  left: '#F2B44A',
  refused: '#F07070',
};

export interface FeedingLogViewProps {
  isLoading: boolean;
  isError: boolean;
  entries: FeedingLogEntry[];
  onSelectGecko?: (geckoId: string) => void;
}

/** 全個体の餌やり記録（新しい順）。読込中・エラー・空・一覧の 4 状態を描画する。 */
export function FeedingLogView({ isLoading, isError, entries, onSelectGecko }: FeedingLogViewProps) {
  if (isLoading) {
    return (
      <View testID="feeding-log-loading" style={styles.center}>
        <ActivityIndicator color="#F0B65A" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>読み込みに失敗しました</Text>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View testID="feeding-log-empty" style={styles.center}>
        <Text style={styles.emptyTitle}>まだ記録がありません</Text>
        <Text style={styles.hint}>個体の詳細から餌やりを記録できます</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.listContent}
      data={entries}
      keyExtractor={(e) => e.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          onPress={() => onSelectGecko?.(item.geckoId)}
          style={styles.row}>
          <View style={styles.rowMain}>
            <Text style={styles.geckoName}>{item.geckoName}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summary}>{`${item.foodType} ×${item.quantity}`}</Text>
              {item.supplement ? <Text style={styles.supplement}>サプリ</Text> : null}
            </View>
          </View>
          <View style={styles.rowSide}>
            <Text style={[styles.result, { color: RESULT_COLOR[item.result] }]}>
              {RESULT_LABEL[item.result]}
            </Text>
            <Text style={styles.time}>{formatFedAt(item.fedAt)}</Text>
          </View>
        </Pressable>
      )}
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
  separator: { height: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1E2127',
  },
  rowMain: { flex: 1, gap: 4 },
  geckoName: { color: '#F5F5F5', fontSize: 15, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summary: { color: '#CBB89D', fontSize: 13 },
  supplement: {
    color: '#F0B65A',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F0B65A',
  },
  rowSide: { alignItems: 'flex-end', gap: 4 },
  result: { fontSize: 13, fontWeight: '700' },
  time: { color: '#8A8F98', fontSize: 12 },
});
