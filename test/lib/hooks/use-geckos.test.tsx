import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useCreateGecko, useGeckos } from '@/lib/hooks/use-geckos';
import { createTestWrapper } from '../../support/query-wrapper';

describe('useGeckos', () => {
  it('owner の個体一覧を返す', async () => {
    const { wrapper, geckos, ownerId } = createTestWrapper();
    await geckos.create(ownerId, { name: 'レオ' });
    await geckos.create(ownerId, { name: 'ナナ' });

    const { result } = await renderHook(() => useGeckos(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((g) => g.name)).toEqual(['レオ', 'ナナ']);
  });

  it('個体がいなければ空配列', async () => {
    const { wrapper } = createTestWrapper();

    const { result } = await renderHook(() => useGeckos(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});

describe('useCreateGecko', () => {
  it('リポジトリに個体を作成する', async () => {
    const { wrapper, geckos, ownerId } = createTestWrapper();

    const { result } = await renderHook(() => useCreateGecko(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ name: 'ポチ' });
    });

    const list = await geckos.list(ownerId);
    expect(list.map((g) => g.name)).toEqual(['ポチ']);
  });
});
