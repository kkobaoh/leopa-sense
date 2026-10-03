import { Text, View } from 'react-native';

import { formatHumidity, formatTemp } from '@/lib/format';
import type { HealthStatus } from '@/lib/health-status';
import { readingStatus, worstStatus, type Range } from '@/lib/reading-status';
import { makeThemedStyles, useTheme } from '@/lib/theme';
import { StatusPill } from './ui/status-pill';

export interface ReadingCardProps {
  label: string;
  temp: number | null;
  humidity: number | null;
  tempRange: Range;
  humidityRange: Range;
}

/**
 * 温湿度カード。温度（大）・湿度（小）と、適正範囲に対する状態（正常/注意/危険）を表示する。
 * 温度には適正範囲バーと現在値マーカーを重ねる（マーカーは温度の状態色）。値が無い場合はプレースホルダのみ。
 */
export function ReadingCard({ label, temp, humidity, tempRange, humidityRange }: ReadingCardProps) {
  const styles = useStyles();
  const tempStatus = temp != null ? readingStatus(temp, tempRange) : null;
  const statuses: HealthStatus[] = [];
  if (tempStatus) statuses.push(tempStatus);
  if (humidity != null) statuses.push(readingStatus(humidity, humidityRange));
  const status = statuses.length > 0 ? worstStatus(...statuses) : null;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {status ? <StatusPill status={status} /> : null}
      </View>

      <Text style={styles.temp}>{formatTemp(temp)}</Text>
      <View style={styles.humidityRow}>
        <Text style={styles.humidityLabel}>湿度</Text>
        <Text style={styles.humidity}>{formatHumidity(humidity)}</Text>
      </View>

      <RangeBar value={temp} range={tempRange} status={tempStatus} />
    </View>
  );
}

/** 適正範囲（帯）と現在値マーカーを表す簡易バー。 */
function RangeBar({
  value,
  range,
  status,
}: {
  value: number | null;
  range: Range;
  status: HealthStatus | null;
}) {
  const styles = useStyles();
  const c = useTheme();
  // マーカー位置（0〜100%）。範囲外はクランプする。
  const ratio = value == null ? null : (value - range.min) / (range.max - range.min);
  const clamped = ratio == null ? null : Math.max(0, Math.min(1, ratio));

  return (
    <View style={styles.barTrack}>
      {clamped != null ? (
        <View
          style={[
            styles.barMarker,
            { left: `${clamped * 100}%`, backgroundColor: status ? c[status] : c.primary },
          ]}
        />
      ) : null}
    </View>
  );
}

const useStyles = makeThemedStyles((c) => ({
  card: {
    gap: 6,
    padding: 16,
    borderRadius: 12,
    backgroundColor: c.surface,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: c.accent, fontSize: 14, fontWeight: '600' },
  temp: { color: c.text, fontSize: 40, fontWeight: '700' },
  humidityRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  humidityLabel: { color: c.textMuted, fontSize: 14 },
  humidity: { color: c.textMuted, fontSize: 16 },
  barTrack: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    backgroundColor: c.surfaceAlt,
    justifyContent: 'center',
  },
  barMarker: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: -5,
  },
}));
