import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Pet, PetCreateInput, PetUpdateInput } from '../api';
import { usePetRepository } from '../repository';
import { useOwnerId } from '../session';

export const petKeys = {
  all: (ownerId: string) => ['pets', ownerId] as const,
  detail: (ownerId: string, id: string) => ['pets', ownerId, id] as const,
};

/** 個体一覧を取得する。 */
export function usePets() {
  const repo = usePetRepository();
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: petKeys.all(ownerId),
    queryFn: () => repo.list(ownerId),
  });
}

/** 個体 1 件を取得する。 */
export function usePet(id: string) {
  const repo = usePetRepository();
  const ownerId = useOwnerId();
  return useQuery({
    queryKey: petKeys.detail(ownerId, id),
    queryFn: () => repo.getById(ownerId, id),
    enabled: id.length > 0,
  });
}

/** 個体を作成する。 */
export function useCreatePet() {
  const repo = usePetRepository();
  const ownerId = useOwnerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PetCreateInput) => repo.create(ownerId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.all(ownerId) });
    },
  });
}

/** 個体を更新する。 */
export function useUpdatePet() {
  const repo = usePetRepository();
  const ownerId = useOwnerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: PetUpdateInput }) =>
      repo.update(ownerId, id, input),
    onSuccess: (pet: Pet) => {
      queryClient.invalidateQueries({ queryKey: petKeys.all(ownerId) });
      queryClient.invalidateQueries({ queryKey: petKeys.detail(ownerId, pet.id) });
    },
  });
}

/** 個体を削除する。 */
export function useRemovePet() {
  const repo = usePetRepository();
  const ownerId = useOwnerId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => repo.remove(ownerId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: petKeys.all(ownerId) });
    },
  });
}
