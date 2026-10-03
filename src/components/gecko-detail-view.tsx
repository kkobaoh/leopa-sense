import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Gecko } from '@/lib/api';
import { sexLabel } from '@/lib/gecko-display';

export interface GeckoDetailViewProps {
  isLoading: boolean;
  isError: boolean;
  gecko: Gecko | null | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
  onRecordFeeding?: () => void;
}

/**
 * 個体詳細の見た目（props のみ）。読込中・エラー・not found・詳細の 4 状態を描画する。
 * 給餌履歴・体重グラフは餌やり/体重機能の実装後に追加する。
 */
export function GeckoDetailView({
  isLoading,
  isError,
  gecko,
  onEdit,
  onDelete,
  onRecordFeeding,
}: GeckoDetailViewProps) {
  if (isLoading) {
    return (
      <View testID="gecko-detail-loading" style={styles.center}>
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

  if (!gecko) {
    return (
      <View testID="gecko-detail-notfound" style={styles.center}>
        <Text style={styles.title}>個体が見つかりません</Text>
      </View>
    );
  }

  const initial = gecko.name.slice(0, 1);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{gecko.name}</Text>
      </View>

      <View style={styles.rows}>
        <Row label="モルフ" value={gecko.morph ?? '—'} />
        <Row label="性別" value={sexLabel(gecko.sex)} />
        <Row label="生年月日" value={gecko.hatchedOn ?? '—'} />
        <Row
          label="給餌間隔"
          value={gecko.feedingIntervalDays != null ? `${gecko.feedingIntervalDays}日` : '—'}
        />
      </View>
      {onRecordFeeding ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRecordFeeding}
          style={[styles.btn, styles.recordBtn]}>
          <Text style={styles.recordText}>餌やりを記録</Text>
        </Pressable>
      ) : null}

      {/* TODO(feedings/weight): 給餌履歴・体重グラフをここに追加 */}

      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              onPress={onEdit}
              style={[styles.btn, styles.editBtn]}>
              <Text style={styles.editText}>編集</Text>
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              onPress={onDelete}
              style={[styles.btn, styles.deleteBtn]}>
              <Text style={styles.deleteText}>削除</Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#14161A',
  },
  errorText: { color: '#F07070', fontSize: 16, fontWeight: '700' },
  title: { color: '#F5F5F5', fontSize: 16, fontWeight: '700' },
  container: { flex: 1, backgroundColor: '#14161A' },
  content: { padding: 16, gap: 16 },
  header: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#4A3B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#F0B65A', fontSize: 28, fontWeight: '700' },
  name: { color: '#F5F5F5', fontSize: 20, fontWeight: '700' },
  rows: { gap: 1, borderRadius: 12, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#1E2127',
  },
  rowLabel: { color: '#8A8F98', fontSize: 14 },
  rowValue: { color: '#F5F5F5', fontSize: 14, fontWeight: '600' },
  actions: { gap: 12, marginTop: 8 },
  recordBtn: { backgroundColor: '#F0B65A' },
  recordText: { color: '#14161A', fontSize: 16, fontWeight: '700' },
  btn: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  editBtn: { borderWidth: 1, borderColor: '#F0B65A' },
  editText: { color: '#F0B65A', fontSize: 16, fontWeight: '700' },
  deleteBtn: { borderWidth: 1, borderColor: '#F07070' },
  deleteText: { color: '#F07070', fontSize: 16, fontWeight: '700' },
});
