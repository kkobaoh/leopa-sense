import { FlatList, Pressable, Text, View } from 'react-native';

import type { FeedingResult } from '@/lib/api';
import { formatFedAt, RESULT_LABEL } from '@/lib/feeding-display';
import type { FeedingLogEntry } from '@/lib/feeding-log';
import type { HealthStatus } from '@/lib/health-status';
import { makeThemedStyles, useTheme } from '@/lib/theme';
import { LoadingState, MessageState } from './ui/screen-state';

// 食いつきを状態色に対応させる（完食=正常・残し=注意・拒食=危険）
const RESULT_TONE: Record<FeedingResult, HealthStatus> = {
  eaten: 'normal',
  left: 'warning',
  refused: 'danger',
};

export interface FeedingLogViewProps {
  isLoading: boolean;
  isError: boolean;
  entries: FeedingLogEntry[];
  onSelectGecko?: (geckoId: string) => void;
}

/** 全個体の餌やり記録（新しい順）。読込中・エラー・空・一覧の 4 状態を描画する。 */
export function FeedingLogView({ isLoading, isError, entries, onSelectGecko }: FeedingLogViewProps) {
  const styles = useStyles();
  const c = useTheme();

  if (isLoading) return <LoadingState testID="feeding-log-loading" />;
  if (isError) return <MessageState tone="error" title="読み込みに失敗しました" />;
  if (entries.length === 0) {
    return (
      <MessageState
        testID="feeding-log-empty"
        title="まだ記録がありません"
        hint="個体の詳細から餌やりを記録できます"
      />
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
            <Text style={[styles.result, { color: c[RESULT_TONE[item.result]] }]}>
              {RESULT_LABEL[item.result]}
            </Text>
            <Text style={styles.time}>{formatFedAt(item.fedAt)}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

const useStyles = makeThemedStyles((c) => ({
  list: { flex: 1, backgroundColor: c.background },
  listContent: { padding: 16 },
  separator: { height: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: c.surface,
  },
  rowMain: { flex: 1, gap: 4 },
  geckoName: { color: c.text, fontSize: 15, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summary: { color: c.accent, fontSize: 13 },
  supplement: {
    color: c.primary,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: c.primary,
  },
  rowSide: { alignItems: 'flex-end', gap: 4 },
  result: { fontSize: 13, fontWeight: '700' },
  time: { color: c.textMuted, fontSize: 12 },
}));
