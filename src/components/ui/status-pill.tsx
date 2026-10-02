import { StyleSheet, Text, View } from 'react-native';

export type HealthStatus = 'normal' | 'warning' | 'danger';

const STATUS: Record<HealthStatus, { color: string; icon: string; label: string }> = {
  normal: { color: '#2E9E6B', icon: '●', label: '正常' },
  warning: { color: '#D9901A', icon: '▲', label: '注意' },
  danger: { color: '#D64545', icon: '■', label: '危険' },
};

export interface StatusPillProps {
  status: HealthStatus;
  /** 既定の文言を上書きしたい場合に指定（例: 「受信遅れ」）。 */
  label?: string;
}

/**
 * 状態を「色・アイコン・文言」の3要素で示す小さなバッジ。
 * 設計原則「色だけに頼らない」に沿い、色覚の個人差に配慮する。
 */
export function StatusPill({ status, label }: StatusPillProps) {
  const s = STATUS[status];
  return (
    <View style={[styles.pill, { borderColor: s.color }]}>
      <Text style={[styles.icon, { color: s.color }]}>{s.icon}</Text>
      <Text style={[styles.label, { color: s.color }]}>{label ?? s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 999,
  },
  icon: { fontSize: 12 },
  label: { fontSize: 14, fontWeight: '600' },
});
