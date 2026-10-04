import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useCreatePet, usePets } from '@/lib/hooks/use-pets';
import { createTestWrapper } from '../../support/query-wrapper';

describe('usePets', () => {
  it('owner の個体一覧を返す', async () => {
    const { wrapper, pets, ownerId } = createTestWrapper();
    await pets.create(ownerId, { name: 'レオ' });
    await pets.create(ownerId, { name: 'ナナ' });

    const { result } = await renderHook(() => usePets(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((g) => g.name)).toEqual(['レオ', 'ナナ']);
  });

  it('個体がいなければ空配列', async () => {
    const { wrapper } = createTestWrapper();

    const { result } = await renderHook(() => usePets(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});

describe('useCreatePet', () => {
  it('リポジトリに個体を作成する', async () => {
    const { wrapper, pets, ownerId } = createTestWrapper();

    const { result } = await renderHook(() => useCreatePet(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ name: 'ポチ' });
    });

    const list = await pets.list(ownerId);
    expect(list.map((g) => g.name)).toEqual(['ポチ']);
  });
});
