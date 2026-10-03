import { buildFeedingLog } from '@/lib/feeding-log';
import type { Feeding } from '@/lib/api';
import { makeGecko } from '../support/factories';

function makeFeeding(overrides: Partial<Feeding>): Feeding {
  return {
    id: 'fd',
    ownerId: 'owner',
    geckoId: 'g1',
    fedAt: '2026-01-01T00:00:00.000Z',
    foodType: 'コオロギ',
    quantity: 1,
    result: 'eaten',
    supplement: false,
    note: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('buildFeedingLog', () => {
  it('個体名を解決し、新しい順に並べる', () => {
    const geckos = [makeGecko({ id: 'g1', name: 'レオ' }), makeGecko({ id: 'g2', name: 'ナナ' })];
    const feedings = [
      makeFeeding({ id: 'a', geckoId: 'g1', fedAt: '2026-01-01T00:00:00.000Z' }),
      makeFeeding({ id: 'b', geckoId: 'g2', fedAt: '2026-01-03T00:00:00.000Z' }),
      makeFeeding({ id: 'c', geckoId: 'g1', fedAt: '2026-01-02T00:00:00.000Z' }),
    ];

    const log = buildFeedingLog(feedings, geckos);

    expect(log.map((e) => e.id)).toEqual(['b', 'c', 'a']);
    expect(log.map((e) => e.geckoName)).toEqual(['ナナ', 'レオ', 'レオ']);
  });

  it('削除済みなどで個体が見つからない記録は「不明な個体」とする', () => {
    const log = buildFeedingLog([makeFeeding({ geckoId: 'gone' })], []);
    expect(log[0].geckoName).toBe('不明な個体');
  });
});
