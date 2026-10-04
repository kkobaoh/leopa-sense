import { Pressable, Text, View } from 'react-native';

import type { Pet } from '@/lib/api';
import { feedingBadge } from '@/lib/feeding-display';
import { SEX_LABEL } from '@/lib/pet-display';
import { makeThemedStyles } from '@/lib/theme';

export interface PetCardProps {
  pet: Pet;
  onPress?: (id: string) => void;
  /**
   * 前回給餌日時（ISO）。
   * - undefined: バッジを表示しない（給餌データ未取得）
   * - null: 「給餌記録なし」バッジ
   * - string: 「前回給餌 ◯日前」バッジ
   */
  lastFedAt?: string | null;
}

/** 個体一覧で使うカード。丸アバター・名前・モルフ・性別・給餌バッジを表示する。 */
export function PetCard({ pet, onPress, lastFedAt }: PetCardProps) {
  const styles = useStyles();
  // TODO(photo): photoPath があれば画像を表示する（現状は頭文字アバター）
  const initial = pet.name.slice(0, 1);
  const badge =
    lastFedAt !== undefined ? feedingBadge(lastFedAt, pet.feedingIntervalDays) : null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(pet.id)}
      style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{pet.name}</Text>
        <View style={styles.metaRow}>
          {pet.morph ? <Text style={styles.morph}>{pet.morph}</Text> : null}
          <Text style={styles.sex}>{SEX_LABEL[pet.sex]}</Text>
        </View>
        {badge ? (
          <View style={[styles.badge, badge.overdue && styles.badgeOverdue]}>
            <Text style={[styles.badgeText, badge.overdue && styles.badgeOverdueText]}>
              {badge.text}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const useStyles = makeThemedStyles((c) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: c.surface,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.accentSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: c.primary, fontSize: 20, fontWeight: '700' },
  body: { flex: 1, gap: 4 },
  name: { color: c.text, fontSize: 16, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  morph: { color: c.accent, fontSize: 13 },
  sex: { color: c.textMuted, fontSize: 13 },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: c.surfaceAlt,
  },
  badgeText: { color: c.textMuted, fontSize: 12 },
  badgeOverdue: { backgroundColor: c.warningSurface },
  badgeOverdueText: { color: c.warning, fontWeight: '700' },
}));
