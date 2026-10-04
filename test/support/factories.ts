import type { Pet } from '@/lib/api';

/** テスト用の Pet を作る。必要な項目だけ上書きできる。 */
export function makePet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: 'pet_test',
    ownerId: 'owner',
    enclosureId: null,
    name: 'テスト個体',
    morph: null,
    sex: 'unknown',
    hatchedOn: null,
    photoPath: null,
    feedingIntervalDays: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
