import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Gecko } from '@/lib/api';
import { SEX_LABEL } from '@/lib/gecko-display';

export interface GeckoCardProps {
  gecko: Gecko;
  onPress?: (id: string) => void;
}

/** 個体一覧で使うカード。丸アバター・名前・モルフ・性別を表示する。 */
export function GeckoCard({ gecko, onPress }: GeckoCardProps) {
  // TODO(photo): photoPath があれば画像を表示する（現状は頭文字アバター）
  const initial = gecko.name.slice(0, 1);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress?.(gecko.id)}
      style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name}>{gecko.name}</Text>
        <View style={styles.metaRow}>
          {gecko.morph ? <Text style={styles.morph}>{gecko.morph}</Text> : null}
          <Text style={styles.sex}>{SEX_LABEL[gecko.sex]}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#1E2127',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A3B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#F0B65A', fontSize: 20, fontWeight: '700' },
  body: { flex: 1, gap: 4 },
  name: { color: '#F5F5F5', fontSize: 16, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  morph: { color: '#CBB89D', fontSize: 13 },
  sex: { color: '#8A8F98', fontSize: 13 },
});
