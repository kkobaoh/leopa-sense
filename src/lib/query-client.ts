import { QueryClient } from '@tanstack/react-query';

/** アプリ用の QueryClient を生成する。テストでは独自の設定で作り直せるよう関数化。 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 2,
      },
    },
  });
}
