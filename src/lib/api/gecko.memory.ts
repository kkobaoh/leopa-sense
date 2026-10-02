import {
  Gecko,
  GeckoCreateInput,
  GeckoNotFoundError,
  GeckoRepository,
  GeckoUpdateInput,
  geckoCreateInputSchema,
  geckoUpdateInputSchema,
} from './gecko';

export interface InMemoryGeckoRepositoryOptions {
  /** ID 生成器（テストで決定的にするため差し替え可能）。 */
  idFactory?: () => string;
  /** 現在時刻（ISO 文字列）生成器。 */
  now?: () => string;
  /** 初期データ。 */
  seed?: Gecko[];
}

/**
 * オンメモリの個体リポジトリ。Supabase 未接続の間の実装。
 * ownerId で絞り込むことで RLS 相当の分離を再現する。
 */
export class InMemoryGeckoRepository implements GeckoRepository {
  private readonly store = new Map<string, Gecko>();
  private readonly idFactory: () => string;
  private readonly now: () => string;

  constructor(options: InMemoryGeckoRepositoryOptions = {}) {
    let counter = 0;
    this.idFactory = options.idFactory ?? (() => `gk_${++counter}`);
    this.now = options.now ?? (() => new Date().toISOString());
    options.seed?.forEach((g) => this.store.set(g.id, g));
  }

  async list(ownerId: string): Promise<Gecko[]> {
    return [...this.store.values()]
      .filter((g) => g.ownerId === ownerId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async getById(ownerId: string, id: string): Promise<Gecko | null> {
    const gecko = this.store.get(id);
    return gecko && gecko.ownerId === ownerId ? gecko : null;
  }

  async create(ownerId: string, input: GeckoCreateInput): Promise<Gecko> {
    const parsed = geckoCreateInputSchema.parse(input);
    const ts = this.now();
    const gecko: Gecko = {
      id: this.idFactory(),
      ownerId,
      enclosureId: parsed.enclosureId ?? null,
      name: parsed.name,
      morph: parsed.morph ?? null,
      sex: parsed.sex,
      hatchedOn: parsed.hatchedOn ?? null,
      photoPath: parsed.photoPath ?? null,
      feedingIntervalDays: parsed.feedingIntervalDays ?? null,
      createdAt: ts,
      updatedAt: ts,
    };
    this.store.set(gecko.id, gecko);
    return gecko;
  }

  async update(ownerId: string, id: string, input: GeckoUpdateInput): Promise<Gecko> {
    const existing = await this.getById(ownerId, id);
    if (!existing) throw new GeckoNotFoundError(id);

    const patch = geckoUpdateInputSchema.parse(input);
    const next: Gecko = { ...existing };
    if (patch.name !== undefined) next.name = patch.name;
    if (patch.enclosureId !== undefined) next.enclosureId = patch.enclosureId ?? null;
    if (patch.morph !== undefined) next.morph = patch.morph ?? null;
    if (patch.sex !== undefined) next.sex = patch.sex;
    if (patch.hatchedOn !== undefined) next.hatchedOn = patch.hatchedOn ?? null;
    if (patch.photoPath !== undefined) next.photoPath = patch.photoPath ?? null;
    if (patch.feedingIntervalDays !== undefined) {
      next.feedingIntervalDays = patch.feedingIntervalDays ?? null;
    }
    next.updatedAt = this.now();

    this.store.set(id, next);
    return next;
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const existing = await this.getById(ownerId, id);
    if (!existing) throw new GeckoNotFoundError(id);
    this.store.delete(id);
  }
}
