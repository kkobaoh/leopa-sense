import type { GeckoRepository } from './gecko';
import { InMemoryGeckoRepository } from './gecko.memory';

// Supabase 未接続のため、オンメモリ実装をアプリ全体のデフォルトにする。
// Supabase 接続時はこの 1 行を差し替えるだけでよい（lib/api の外は実装を知らない）。
export const geckoRepo: GeckoRepository = new InMemoryGeckoRepository();

export * from './gecko';
export { InMemoryGeckoRepository } from './gecko.memory';
export type { InMemoryGeckoRepositoryOptions } from './gecko.memory';
