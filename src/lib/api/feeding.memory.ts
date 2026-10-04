import {
  Feeding,
  FeedingCreateInput,
  FeedingNotFoundError,
  FeedingRepository,
  FeedingUpdateInput,
  feedingCreateInputSchema,
  feedingUpdateInputSchema,
} from './feeding';

export interface InMemoryFeedingRepositoryOptions {
  idFactory?: () => string;
  now?: () => string;
  seed?: Feeding[];
}

/** オンメモリの餌やりリポジトリ。ownerId で絞り込み RLS 相当の分離を再現する。 */
export class InMemoryFeedingRepository implements FeedingRepository {
  private readonly store = new Map<string, Feeding>();
  private readonly idFactory: () => string;
  private readonly now: () => string;

  constructor(options: InMemoryFeedingRepositoryOptions = {}) {
    let counter = 0;
    this.idFactory = options.idFactory ?? (() => `fd_${++counter}`);
    this.now = options.now ?? (() => new Date().toISOString());
    options.seed?.forEach((f) => this.store.set(f.id, f));
  }

  async list(ownerId: string): Promise<Feeding[]> {
    return [...this.store.values()]
      .filter((f) => f.ownerId === ownerId)
      .sort((a, b) => b.fedAt.localeCompare(a.fedAt));
  }

  async listByPet(ownerId: string, petId: string): Promise<Feeding[]> {
    return (await this.list(ownerId)).filter((f) => f.petId === petId);
  }

  async latestForPet(ownerId: string, petId: string): Promise<Feeding | null> {
    const list = await this.listByPet(ownerId, petId);
    return list[0] ?? null;
  }

  async getById(ownerId: string, id: string): Promise<Feeding | null> {
    const feeding = this.store.get(id);
    return feeding && feeding.ownerId === ownerId ? feeding : null;
  }

  async create(ownerId: string, input: FeedingCreateInput): Promise<Feeding> {
    const parsed = feedingCreateInputSchema.parse(input);
    const ts = this.now();
    const feeding: Feeding = {
      id: this.idFactory(),
      ownerId,
      petId: parsed.petId,
      fedAt: parsed.fedAt ?? ts,
      foodType: parsed.foodType,
      quantity: parsed.quantity,
      result: parsed.result,
      supplement: parsed.supplement,
      note: parsed.note ?? null,
      createdAt: ts,
      updatedAt: ts,
    };
    this.store.set(feeding.id, feeding);
    return feeding;
  }

  async update(ownerId: string, id: string, input: FeedingUpdateInput): Promise<Feeding> {
    const existing = await this.getById(ownerId, id);
    if (!existing) throw new FeedingNotFoundError(id);

    const patch = feedingUpdateInputSchema.parse(input);
    const next: Feeding = { ...existing };
    if (patch.petId !== undefined) next.petId = patch.petId;
    if (patch.fedAt !== undefined) next.fedAt = patch.fedAt ?? existing.fedAt;
    if (patch.foodType !== undefined) next.foodType = patch.foodType;
    if (patch.quantity !== undefined) next.quantity = patch.quantity;
    if (patch.result !== undefined) next.result = patch.result;
    if (patch.supplement !== undefined) next.supplement = patch.supplement;
    if (patch.note !== undefined) next.note = patch.note ?? null;
    next.updatedAt = this.now();

    this.store.set(id, next);
    return next;
  }

  async remove(ownerId: string, id: string): Promise<void> {
    const existing = await this.getById(ownerId, id);
    if (!existing) throw new FeedingNotFoundError(id);
    this.store.delete(id);
  }
}
