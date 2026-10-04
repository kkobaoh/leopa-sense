import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import type { Pet } from '@/lib/api';
import { sexLabel } from '@/lib/pet-display';
import { makeThemedStyles } from '@/lib/theme';
import { LoadingState, MessageState } from './ui/screen-state';

export interface PetDetailViewProps {
  isLoading: boolean;
  isError: boolean;
  pet: Pet | null | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
  onRecordFeeding?: () => void;
}

/**
 * 個体詳細の見た目（props のみ）。読込中・エラー・not found・詳細の 4 状態を描画する。
 * 給餌履歴・体重グラフは餌やり/体重機能の実装後に追加する。
 */
export function PetDetailView({
  isLoading,
  isError,
  pet,
  onEdit,
  onDelete,
  onRecordFeeding,
}: PetDetailViewProps) {
  const styles = useStyles();

  if (isLoading) return <LoadingState testID="pet-detail-loading" />;
  if (isError) return <MessageState tone="error" title="読み込みに失敗しました" />;
  if (!pet) return <MessageState testID="pet-detail-notfound" title="個体が見つかりません" />;

  const initial = pet.name.slice(0, 1);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{pet.name}</Text>
      </View>

      <View style={styles.rows}>
        <Row label="モルフ" value={pet.morph ?? '—'} />
        <Row label="性別" value={sexLabel(pet.sex)} />
        <Row label="生年月日" value={pet.hatchedOn ?? '—'} />
        <Row
          label="給餌間隔"
          value={pet.feedingIntervalDays != null ? `${pet.feedingIntervalDays}日` : '—'}
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
  const styles = useStyles();
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const useStyles = makeThemedStyles((c) => ({
  container: { flex: 1, backgroundColor: c.background },
  content: { padding: 16, gap: 16 },
  header: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: c.accentSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: c.primary, fontSize: 28, fontWeight: '700' },
  name: { color: c.text, fontSize: 20, fontWeight: '700' },
  rows: { gap: 1, borderRadius: 12, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: c.surface,
  },
  rowLabel: { color: c.textMuted, fontSize: 14 },
  rowValue: { color: c.text, fontSize: 14, fontWeight: '600' },
  actions: { gap: 12, marginTop: 8 },
  btn: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  recordBtn: { backgroundColor: c.primary },
  recordText: { color: c.onPrimary, fontSize: 16, fontWeight: '700' },
  editBtn: { borderWidth: 1, borderColor: c.primary },
  editText: { color: c.primary, fontSize: 16, fontWeight: '700' },
  deleteBtn: { borderWidth: 1, borderColor: c.danger },
  deleteText: { color: c.danger, fontSize: 16, fontWeight: '700' },
}));
