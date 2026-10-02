import type { HealthStatus } from './health-status';

export interface Range {
  min: number;
  max: number;
}

/**
 * 計測値が適正範囲に対してどの状態かを返す。
 * - 範囲外: danger
 * - 範囲の端 (warnRatio 分の帯) に入っている: warning
 * - それ以外: normal
 */
export function readingStatus(value: number, range: Range, warnRatio = 0.1): HealthStatus {
  if (value < range.min || value > range.max) return 'danger';
  const band = (range.max - range.min) * warnRatio;
  if (value <= range.min + band || value >= range.max - band) return 'warning';
  return 'normal';
}

/** 複数ステータスのうち最も重いものを返す。 */
export function worstStatus(...statuses: HealthStatus[]): HealthStatus {
  const order: Record<HealthStatus, number> = { normal: 0, warning: 1, danger: 2 };
  return statuses.reduce<HealthStatus>(
    (worst, s) => (order[s] > order[worst] ? s : worst),
    'normal',
  );
}
