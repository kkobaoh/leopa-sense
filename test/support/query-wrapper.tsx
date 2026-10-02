import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import type { FeedingRepository, GeckoRepository } from '@/lib/api';
import { InMemoryFeedingRepository } from '@/lib/api/feeding.memory';
import { InMemoryGeckoRepository } from '@/lib/api/gecko.memory';
import { RepositoryProvider } from '@/lib/repository';
import { SessionProvider } from '@/lib/session';

export const TEST_OWNER_ID = 'test-owner';

/**
 * テスト用 QueryClient。TanStack Query 公式の推奨に従う:
 * - retry: false       … リトライのバックオフでテストがタイムアウトしないように
 * - gcTime: Infinity   … GC タイマーを張らず「Jest did not exit」を防ぐ
 * https://tanstack.com/query/latest/docs/framework/react/guides/testing
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
}

export interface TestWrapperOptions {
  ownerId?: string;
  geckos?: GeckoRepository;
  feedings?: FeedingRepository;
  queryClient?: QueryClient;
}

/**
 * フック/コンポーネントテスト用の Provider ラッパーを生成する。
 * テストごとに新しい QueryClient とリポジトリを作り、テスト間を分離する。
 */
export function createTestWrapper(options: TestWrapperOptions = {}) {
  const ownerId = options.ownerId ?? TEST_OWNER_ID;
  const geckos = options.geckos ?? new InMemoryGeckoRepository();
  const feedings = options.feedings ?? new InMemoryFeedingRepository();
  const queryClient = options.queryClient ?? createTestQueryClient();

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <RepositoryProvider value={{ geckos, feedings }}>
          <SessionProvider ownerId={ownerId}>{children}</SessionProvider>
        </RepositoryProvider>
      </QueryClientProvider>
    );
  }

  return { wrapper, ownerId, geckos, feedings, queryClient };
}
