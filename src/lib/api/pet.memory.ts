import {
  Pet,
  PetCreateInput,
  PetNotFoundError,
  PetRepository,
  PetUpdateInput,
  petCreateInputSchema,
  petUpdateInputSchema,
} from './pet';

export interface InMemoryPetRepositoryOptions {
  /** ID 生成器（テストで決定的にするため差し替え可能）。 */
  idFactory?: () => string;
  /** 現在時刻（ISO 文字列）生成器。 */
  now?: () => string;
  /** 初期データ。 */
  seed?: Pet[];
}

/**
 * オンメモリの個体リポジトリ。Supabase 未接続の間の実装。
 * ownerId で絞り込むことで RLS 相当の分離を再現する。
 */
export class InMemoryPetRepository implements PetRepository {
  private readonly store = new Map<string, Pet>();
  private readonly idFactory: () => string;
  private readonly now: () => string;

  constructor(options: InMemoryPetRepositoryOptions = {}) {
    let counter = 0;
    this.idFactory = options.idFactory ?? (() => `pet_${++counter}`);
    this.now = options.now ?? (() => new Date().toISOString());
    options.seed?.forEach((g) => this.store.set(g.id, g));
  }

  async list(ownerId: string): Promise<Pet[]> {
    return [...this.store.values()]
      .filter((g) => g.ownerId === ownerId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async getById(ownerId: string, id: string): Promise<Pet | null> {
    const pet = this.store.get(id);
    return pet && pet.ownerId === ownerId ? pet : null;
  }

  async create(ownerId: string, input: PetCreateInput): Promise<Pet> {
    const parsed = petCreateInputSchema.parse(input);
    const ts = this.now();
    const pet: Pet = {
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
    this.store.set(pet.id, pet);
    return pet;
  }

  async update(ownerId: string, id: string, input: PetUpdateInput): Promise<Pet> {
    const existing = await this.getById(ownerId, id);
    if (!existing) throw new PetNotFoundError(id);

    const patch = petUpdateInputSchema.parse(input);
    const next: Pet = { ...existing };
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
    if (!existing) throw new PetNotFoundError(id);
    this.store.delete(id);
  }
}
