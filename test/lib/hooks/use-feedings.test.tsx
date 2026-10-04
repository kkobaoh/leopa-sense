import { act, renderHook, waitFor } from '@testing-library/react-native';

import {
  useCreateFeeding,
  useFeedings,
  useFeedingsByPet,
  useLatestFeeding,
} from '@/lib/hooks/use-feedings';
import { createTestWrapper } from '../../support/query-wrapper';

describe('useFeedings', () => {
  it('owner の全記録を新しい順で返す', async () => {
    const { wrapper, feedings, ownerId } = createTestWrapper();
    await feedings.create(ownerId, {
      petId: 'g1',
      foodType: 'A',
      occurredAt: '2026-01-01T00:00:00.000Z',
    });
    await feedings.create(ownerId, {
      petId: 'g2',
      foodType: 'B',
      occurredAt: '2026-01-02T00:00:00.000Z',
    });

    const { result } = await renderHook(() => useFeedings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((f) => f.foodType)).toEqual(['B', 'A']);
  });
});

describe('useFeedingsByPet', () => {
  it('指定個体の記録を新しい順で返す', async () => {
    const { wrapper, feedings, ownerId } = createTestWrapper();
    await feedings.create(ownerId, {
      petId: 'g1',
      foodType: 'A',
      occurredAt: '2026-01-01T00:00:00.000Z',
    });
    await feedings.create(ownerId, {
      petId: 'g1',
      foodType: 'B',
      occurredAt: '2026-01-03T00:00:00.000Z',
    });

    const { result } = await renderHook(() => useFeedingsByPet('g1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((f) => f.foodType)).toEqual(['B', 'A']);
  });
});

describe('useLatestFeeding', () => {
  it('最新の記録を返す', async () => {
    const { wrapper, feedings, ownerId } = createTestWrapper();
    await feedings.create(ownerId, {
      petId: 'g1',
      foodType: 'A',
      occurredAt: '2026-01-01T00:00:00.000Z',
    });
    await feedings.create(ownerId, {
      petId: 'g1',
      foodType: 'latest',
      occurredAt: '2026-01-05T00:00:00.000Z',
    });

    const { result } = await renderHook(() => useLatestFeeding('g1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.foodType).toBe('latest');
  });
});

describe('useCreateFeeding', () => {
  it('餌やりを記録する', async () => {
    const { wrapper, feedings, ownerId } = createTestWrapper();
    const { result } = await renderHook(() => useCreateFeeding(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ petId: 'g1', foodType: 'コオロギ' });
    });

    const list = await feedings.listByPet(ownerId, 'g1');
    expect(list.map((f) => f.foodType)).toEqual(['コオロギ']);
  });
});
