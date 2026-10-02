import { GeckoNotFoundError } from '@/lib/api/gecko';
import { InMemoryGeckoRepository } from '@/lib/api/gecko.memory';

const OWNER = 'owner-a';
const OTHER = 'owner-b';

/** 決定的な ID とタイムスタンプを持つリポジトリを作る（呼ぶたびに 1 秒進む）。 */
function makeRepo() {
  let ids = 0;
  let ms = Date.parse('2026-01-01T00:00:00.000Z');
  return new InMemoryGeckoRepository({
    idFactory: () => `gk_${++ids}`,
    now: () => {
      const iso = new Date(ms).toISOString();
      ms += 1000;
      return iso;
    },
  });
}

describe('InMemoryGeckoRepository', () => {
  describe('create', () => {
    it('owner・生成ID・タイムスタンプ付きで保存する', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'レオ' });

      expect(g.id).toBe('gk_1');
      expect(g.ownerId).toBe(OWNER);
      expect(g.name).toBe('レオ');
      expect(g.createdAt).toBe('2026-01-01T00:00:00.000Z');
      expect(g.updatedAt).toBe(g.createdAt);
      expect(await repo.getById(OWNER, 'gk_1')).toEqual(g);
    });

    it('省略項目は既定値になる（sex=unknown、その他 null）', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A' });

      expect(g.sex).toBe('unknown');
      expect(g.enclosureId).toBeNull();
      expect(g.morph).toBeNull();
      expect(g.hatchedOn).toBeNull();
      expect(g.photoPath).toBeNull();
      expect(g.feedingIntervalDays).toBeNull();
    });

    it('name の前後空白をトリムする', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: '  ナナ  ' });
      expect(g.name).toBe('ナナ');
    });

    it('name が空ならバリデーションエラー', async () => {
      const repo = makeRepo();
      await expect(repo.create(OWNER, { name: '   ' })).rejects.toThrow();
    });

    it('feedingIntervalDays が 0 以下ならエラー', async () => {
      const repo = makeRepo();
      await expect(
        repo.create(OWNER, { name: 'A', feedingIntervalDays: 0 }),
      ).rejects.toThrow();
    });

    it('hatchedOn が日付形式でないならエラー', async () => {
      const repo = makeRepo();
      await expect(
        repo.create(OWNER, { name: 'A', hatchedOn: '2026/01/01' }),
      ).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('owner 自身の個体だけを返す（分離）', async () => {
      const repo = makeRepo();
      await repo.create(OWNER, { name: 'A' });
      await repo.create(OTHER, { name: 'B' });
      await repo.create(OWNER, { name: 'C' });

      const mine = await repo.list(OWNER);
      expect(mine.map((g) => g.name)).toEqual(['A', 'C']);
    });

    it('createdAt 昇順で返す', async () => {
      const repo = makeRepo();
      await repo.create(OWNER, { name: 'first' });
      await repo.create(OWNER, { name: 'second' });

      const list = await repo.list(OWNER);
      expect(list.map((g) => g.name)).toEqual(['first', 'second']);
    });

    it('該当なしなら空配列', async () => {
      const repo = makeRepo();
      expect(await repo.list('nobody')).toEqual([]);
    });
  });

  describe('getById', () => {
    it('他 owner の個体は取得できない（null）', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A' });
      expect(await repo.getById(OTHER, g.id)).toBeNull();
    });

    it('存在しない id は null', async () => {
      const repo = makeRepo();
      expect(await repo.getById(OWNER, 'missing')).toBeNull();
    });
  });

  describe('update', () => {
    it('指定フィールドだけ更新し、updatedAt を進め、createdAt は保持する', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A', morph: 'ノーマル' });
      const u = await repo.update(OWNER, g.id, { name: 'B' });

      expect(u.name).toBe('B');
      expect(u.morph).toBe('ノーマル'); // 渡していないので変化しない
      expect(u.createdAt).toBe(g.createdAt);
      expect(u.updatedAt > g.updatedAt).toBe(true);
    });

    it('nullable フィールドに null を渡すとクリアできる', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A', morph: 'x' });
      const u = await repo.update(OWNER, g.id, { morph: null });
      expect(u.morph).toBeNull();
    });

    it('他 owner の個体は更新できない', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A' });
      await expect(repo.update(OTHER, g.id, { name: 'X' })).rejects.toBeInstanceOf(
        GeckoNotFoundError,
      );
    });

    it('不正な入力はエラー', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A' });
      await expect(repo.update(OWNER, g.id, { name: '' })).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('削除すると取得できなくなる', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A' });
      await repo.remove(OWNER, g.id);
      expect(await repo.getById(OWNER, g.id)).toBeNull();
    });

    it('他 owner は削除できない', async () => {
      const repo = makeRepo();
      const g = await repo.create(OWNER, { name: 'A' });
      await expect(repo.remove(OTHER, g.id)).rejects.toBeInstanceOf(GeckoNotFoundError);
      expect(await repo.getById(OWNER, g.id)).not.toBeNull();
    });
  });
});
