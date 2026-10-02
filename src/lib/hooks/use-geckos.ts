import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Gecko, GeckoCreateInput, GeckoUpdateInput } from '../api';
import { useGeckoRepository } from '../repository';
import { useOwnerId } from '../session';

export const geckoKeys = {
  all: (ownerId: string) => ['geckos', ownerId] as const,
  detail: (ownerId: string, id: string) => ['geckos', ownerId, id] as const,
};

/** 個体一覧を取得する。 */
export function useGeckos() {
  const repo = useGeckoRepository();
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: geckoKeys.all(ownerId),
    queryFn: () => repo.list(ownerId),
  });
}

/** 個体 1 件を取得する。 */
export function useGecko(id: string) {
  const repo = useGeckoRepository();
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: geckoKeys.detail(ownerId, id),
    queryFn: () => repo.getById(ownerId, id),
    enabled: id.length > 0,
  });
}

/** 個体を作成する。 */
export function useCreateGecko() {
  const repo = useGeckoRepository();
  const ownerId = useOwnerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GeckoCreateInput) => repo.create(ownerId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geckoKeys.all(ownerId) });
    },
  });
}

/** 個体を更新する。 */
export function useUpdateGecko() {
  const repo = useGeckoRepository();
  const ownerId = useOwnerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GeckoUpdateInput }) =>
      repo.update(ownerId, id, input),
    onSuccess: (gecko: Gecko) => {
      queryClient.invalidateQueries({ queryKey: geckoKeys.all(ownerId) });
      queryClient.invalidateQueries({ queryKey: geckoKeys.detail(ownerId, gecko.id) });
    },
  });
}

/** 個体を削除する。 */
export function useRemoveGecko() {
  const repo = useGeckoRepository();
  const ownerId = useOwnerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repo.remove(ownerId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: geckoKeys.all(ownerId) });
    },
  });
}
