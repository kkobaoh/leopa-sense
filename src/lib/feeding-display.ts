import type { FeedingResult } from './api';

const DAY_MS = 86_400_000;

/** 食いつきの表示ラベル。 */
export const RESULT_LABEL: Record<FeedingResult, string> = {
  eaten: '完食',
  left: '残し',
  refused: '拒食',
};

/** iso から now までの経過日数（切り捨て、未来なら 0）。 */
export function daysSince(iso: string, now: Date = new Date()): number {
  const diff = now.getTime() - Date.parse(iso);
  return diff <= 0 ? 0 : Math.floor(diff / DAY_MS);
}

export interface FeedingBadge {
  text: string;
  /** 給餌間隔を過ぎている（注意色で出す）。 */
  overdue: boolean;
}

/**
 * 個体カード用の給餌バッジ文言と状態を返す。
 * - 記録なし: 「給餌記録なし」
 * - それ以外: 「前回給餌 ◯日前」（当日は「今日」）
 * - 経過日数 >= 給餌間隔: overdue
 */
export function feedingBadge(
  lastFedAt: string | null,
  intervalDays: number | null,
  now: Date = new Date(),
): FeedingBadge {
  if (!lastFedAt) return { text: '給餌記録なし', overdue: false };
  const d = daysSince(lastFedAt, now);
  const text = d === 0 ? '前回給餌 今日' : `前回給餌 ${d}日前`;
  const overdue = intervalDays != null && d >= intervalDays;
  return { text, overdue };
}
