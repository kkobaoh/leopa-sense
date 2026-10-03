import { StyleSheet, Text, View } from 'react-native';

import type { HealthStatus } from '@/lib/health-status';
import { useTheme } from '@/lib/theme';

export type { HealthStatus };

const STATUS: Record<HealthStatus, { icon: string; label: string }> = {
  normal: { icon: '●', label: '正常' },
  warning: { icon: '▲', label: '注意' },
  danger: { icon: '■', label: '危険' },
};

export interface StatusPillProps {
  status: HealthStatus;
  /** 既定の文言を上書きしたい場合に指定（例: 「受信遅れ」）。 */
  label?: string;
}

/**
 * 状態を「色・アイコン・文言」の3要素で示す小さなバッジ。
 * 設計原則「色だけに頼らない」に沿い、色覚の個人差に配慮する。色はテーマのトークン（normal/warning/danger）。
 */
export function StatusPill({ status, label }: StatusPillProps) {
  const c = useTheme();
  const s = STATUS[status];
  const color = c[status];
  return (
    <View style={[styles.pill, { borderColor: color }]}>
      <Text style={[styles.icon, { color }]}>{s.icon}</Text>
      <Text style={[styles.label, { color }]}>{label ?? s.label}</Text>
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
