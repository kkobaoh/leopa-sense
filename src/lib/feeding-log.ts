import type { Feeding, FeedingResult, Pet } from './api';

/** 記録一覧の 1 行分。個体名を解決済み。 */
export interface FeedingLogEntry {
  id: string;
  petId: string;
  petName: string;
  foodType: string;
  quantity: number;
  result: FeedingResult;
  supplement: boolean;
  occurredAt: string;
}

/** 餌やり記録に個体名を付け、新しい順に並べる。個体が見つからなければ「不明な個体」。 */
export function buildFeedingLog(feedings: Feeding[], pets: Pet[]): FeedingLogEntry[] {
  const names = new Map(pets.map((g) => [g.id, g.name]));
  return [...feedings]
    .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
    .map((f) => ({
      id: f.id,
      petId: f.petId,
      petName: names.get(f.petId) ?? '不明な個体',
      foodType: f.foodType,
      quantity: f.quantity,
      result: f.result,
      supplement: f.supplement,
      occurredAt: f.occurredAt,
    }));
}
