import type { FeedingRepository } from './feeding';
import { InMemoryFeedingRepository } from './feeding.memory';
import type { PetRepository } from './pet';
import { InMemoryPetRepository } from './pet.memory';

// Supabase 未接続のため、オンメモリ実装をアプリ全体のデフォルトにする。
// Supabase 接続時はこの行を差し替えるだけでよい（lib/api の外は実装を知らない）。
export const petRepo: PetRepository = new InMemoryPetRepository();
export const feedingRepo: FeedingRepository = new InMemoryFeedingRepository();

export * from './pet';
export { InMemoryPetRepository } from './pet.memory';
export type { InMemoryPetRepositoryOptions } from './pet.memory';

export * from './feeding';
export { InMemoryFeedingRepository } from './feeding.memory';
export type { InMemoryFeedingRepositoryOptions } from './feeding.memory';
