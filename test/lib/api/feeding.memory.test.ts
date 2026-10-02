import { FeedingNotFoundError } from '@/lib/api/feeding';
import { InMemoryFeedingRepository } from '@/lib/api/feeding.memory';

const OWNER = 'owner-a';
const OTHER = 'owner-b';

function makeRepo() {
  let ids = 0;
  let ms = Date.parse('2026-01-01T00:00:00.000Z');
  return new InMemoryFeedingRepository({
    idFactory: () => `fd_${++ids}`,
    now: () => {
      const iso = new Date(ms).toISOString();
      ms += 1000;
      return iso;
    },
  });
}

describe('InMemoryFeedingRepository', () => {
  describe('create', () => {
    it('owner・生成ID・既定値付きで保存する', async () => {
      const repo = makeRepo();
      const f = await repo.create(OWNER, { geckoId: 'g1', foodType: 'コオロギ' });

      expect(f.id).toBe('fd_1');
      expect(f.ownerId).toBe(OWNER);
      expect(f.geckoId).toBe('g1');
      expect(f.foodType).toBe('コオロギ');
      expect(f.quantity).toBe(1); // 既定
      expect(f.result).toBe('eaten'); // 既定
      expect(f.supplement).toBe(false); // 既定
      expect(f.note).toBeNull();
      expect(f.fedAt).toBe('2026-01-01T00:00:00.000Z'); // 省略時は now()
    });

    it('fedAt を指定できる', async () => {
      const repo = makeRepo();
      const f = await repo.create(OWNER, {
        geckoId: 'g1',
        foodType: 'コオロギ',
        fedAt: '2025-12-24T10:00:00.000Z',
      });
      expect(f.fedAt).toBe('2025-12-24T10:00:00.000Z');
    });

    it('foodType が空ならバリデーションエラー', async () => {
      const repo = makeRepo();
      await expect(repo.create(OWNER, { geckoId: 'g1', foodType: '  ' })).rejects.toThrow();
    });

    it('quantity が 0 以下ならエラー', async () => {
      const repo = makeRepo();
      await expect(
        repo.create(OWNER, { geckoId: 'g1', foodType: 'コオロギ', quantity: 0 }),
      ).rejects.toThrow();
    });
  });

  describe('listByGecko', () => {
    it('指定個体の記録だけを fedAt 降順で返す', async () => {
      const repo = makeRepo();
      await repo.create(OWNER, { geckoId: 'g1', foodType: 'A', fedAt: '2026-01-01T00:00:00.000Z' });
      await repo.create(OWNER, { geckoId: 'g2', foodType: 'B', fedAt: '2026-01-02T00:00:00.000Z' });
      await repo.create(OWNER, { geckoId: 'g1', foodType: 'C', fedAt: '2026-01-03T00:00:00.000Z' });

      const list = await repo.listByGecko(OWNER, 'g1');
      expect(list.map((f) => f.foodType)).toEqual(['C', 'A']); // 新しい順
    });

    it('他 owner の記録は含まない', async () => {
      const repo = makeRepo();
      await repo.create(OWNER, { geckoId: 'g1', foodType: 'A' });
      await repo.create(OTHER, { geckoId: 'g1', foodType: 'B' });
      const list = await repo.listByGecko(OWNER, 'g1');
      expect(list.map((f) => f.foodType)).toEqual(['A']);
    });
  });

  describe('latestForGecko', () => {
    it('最新の記録を返す', async () => {
      const repo = makeRepo();
      await repo.create(OWNER, { geckoId: 'g1', foodType: 'A', fedAt: '2026-01-01T00:00:00.000Z' });
      await repo.create(OWNER, { geckoId: 'g1', foodType: 'C', fedAt: '2026-01-05T00:00:00.000Z' });

      const latest = await repo.latestForGecko(OWNER, 'g1');
      expect(latest?.foodType).toBe('C');
    });

    it('記録が無ければ null', async () => {
      const repo = makeRepo();
      expect(await repo.latestForGecko(OWNER, 'g1')).toBeNull();
    });
  });

  describe('update / remove', () => {
    it('更新できる（指定項目のみ）', async () => {
      const repo = makeRepo();
      const f = await repo.create(OWNER, { geckoId: 'g1', foodType: 'コオロギ', quantity: 2 });
      const u = await repo.update(OWNER, f.id, { result: 'left' });
      expect(u.result).toBe('left');
      expect(u.quantity).toBe(2); // 未変更
      expect(u.foodType).toBe('コオロギ');
    });

    it('他 owner は更新・削除できない', async () => {
      const repo = makeRepo();
      const f = await repo.create(OWNER, { geckoId: 'g1', foodType: 'A' });
      await expect(repo.update(OTHER, f.id, { result: 'left' })).rejects.toBeInstanceOf(
        FeedingNotFoundError,
      );
      await expect(repo.remove(OTHER, f.id)).rejects.toBeInstanceOf(FeedingNotFoundError);
    });

    it('削除すると取得できなくなる', async () => {
      const repo = makeRepo();
      const f = await repo.create(OWNER, { geckoId: 'g1', foodType: 'A' });
      await repo.remove(OWNER, f.id);
      expect(await repo.getById(OWNER, f.id)).toBeNull();
    });
  });
});
