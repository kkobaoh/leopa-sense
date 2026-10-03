import type { Feeding, FeedingResult, Gecko } from './api';

/** 記録一覧の 1 行分。個体名を解決済み。 */
export interface FeedingLogEntry {
  id: string;
  geckoId: string;
  geckoName: string;
  foodType: string;
  quantity: number;
  result: FeedingResult;
  supplement: boolean;
  fedAt: string;
}

/** 餌やり記録に個体名を付け、新しい順に並べる。個体が見つからなければ「不明な個体」。 */
export function buildFeedingLog(feedings: Feeding[], geckos: Gecko[]): FeedingLogEntry[] {
  const names = new Map(geckos.map((g) => [g.id, g.name]));
  return [...feedings]
    .sort((a, b) => b.fedAt.localeCompare(a.fedAt))
    .map((f) => ({
      id: f.id,
      geckoId: f.geckoId,
      geckoName: names.get(f.geckoId) ?? '不明な個体',
      foodType: f.foodType,
      quantity: f.quantity,
      result: f.result,
      supplement: f.supplement,
      fedAt: f.fedAt,
    }));
}
