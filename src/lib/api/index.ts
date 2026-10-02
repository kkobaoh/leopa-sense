import type { FeedingRepository } from './feeding';
import { InMemoryFeedingRepository } from './feeding.memory';
import type { GeckoRepository } from './gecko';
import { InMemoryGeckoRepository } from './gecko.memory';

// Supabase 未接続のため、オンメモリ実装をアプリ全体のデフォルトにする。
// Supabase 接続時はこの行を差し替えるだけでよい（lib/api の外は実装を知らない）。
export const geckoRepo: GeckoRepository = new InMemoryGeckoRepository();
export const feedingRepo: FeedingRepository = new InMemoryFeedingRepository();

export * from './gecko';
export { InMemoryGeckoRepository } from './gecko.memory';
export type { InMemoryGeckoRepositoryOptions } from './gecko.memory';

export * from './feeding';
export { InMemoryFeedingRepository } from './feeding.memory';
export type { InMemoryFeedingRepositoryOptions } from './feeding.memory';
