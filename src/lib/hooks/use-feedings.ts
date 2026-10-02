import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { FeedingCreateInput } from '../api';
import { useFeedingRepository } from '../repository';
import { useOwnerId } from '../session';

export const feedingKeys = {
  all: (ownerId: string) => ['feedings', ownerId, 'all'] as const,
  byGecko: (ownerId: string, geckoId: string) =>
    ['feedings', ownerId, 'gecko', geckoId] as const,
  latest: (ownerId: string, geckoId: string) =>
    ['feedings', ownerId, 'latest', geckoId] as const,
};

/** owner の全餌やり記録（新しい順）。一覧の給餌バッジ算出などに使う。 */
export function useFeedings() {
  const repo = useFeedingRepository();
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: feedingKeys.all(ownerId),
    queryFn: () => repo.list(ownerId),
  });
}

/** 指定個体の餌やり記録（新しい順）。 */
export function useFeedingsByGecko(geckoId: string) {
  const repo = useFeedingRepository();
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: feedingKeys.byGecko(ownerId, geckoId),
    queryFn: () => repo.listByGecko(ownerId, geckoId),
    enabled: geckoId.length > 0,
  });
}

/** 指定個体の最新の餌やり記録（なければ null）。 */
export function useLatestFeeding(geckoId: string) {
  const repo = useFeedingRepository();
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: feedingKeys.latest(ownerId, geckoId),
    queryFn: () => repo.latestForGecko(ownerId, geckoId),
    enabled: geckoId.length > 0,
  });
}

/** 餌やりを記録する。 */
export function useCreateFeeding() {
  const repo = useFeedingRepository();
  const ownerId = useOwnerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FeedingCreateInput) => repo.create(ownerId, input),
    onSuccess: (feeding) => {
      queryClient.invalidateQueries({ queryKey: feedingKeys.all(ownerId) });
      queryClient.invalidateQueries({
        queryKey: feedingKeys.byGecko(ownerId, feeding.geckoId),
      });
      queryClient.invalidateQueries({
        queryKey: feedingKeys.latest(ownerId, feeding.geckoId),
      });
    },
  });
}
