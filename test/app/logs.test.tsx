import { fireEvent, render, waitFor } from '@testing-library/react-native';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn(), navigate: jest.fn() }),
}));

import LogsScreen from '../../src/app/(tabs)/logs';
import { createTestWrapper } from '../support/query-wrapper';

describe('LogsScreen (route)', () => {
  it('全個体の餌やり記録を個体名付きで新しい順に表示する', async () => {
    const { wrapper, pets, feedings, ownerId } = createTestWrapper();
    const leo = await pets.create(ownerId, { name: 'レオ' });
    const nana = await pets.create(ownerId, { name: 'ナナ' });
    await feedings.create(ownerId, {
      petId: leo.id,
      foodType: 'コオロギ',
      occurredAt: '2026-01-01T00:00:00.000Z',
    });
    await feedings.create(ownerId, {
      petId: nana.id,
      foodType: 'デュビア',
      occurredAt: '2026-01-02T00:00:00.000Z',
    });

    const { getAllByText, getByText } = await render(<LogsScreen />, { wrapper });

    await waitFor(() => expect(getByText('レオ')).toBeTruthy());
    expect(getByText('ナナ')).toBeTruthy();
    // 新しい順: デュビア(1/2) → コオロギ(1/1)
    const summaries = getAllByText(/×1$/).map((n) => n.props.children);
    expect(summaries).toEqual(['デュビア ×1', 'コオロギ ×1']);
  });

  it('記録がなければ空状態を表示する', async () => {
    const { wrapper } = createTestWrapper();
    const { getByText } = await render(<LogsScreen />, { wrapper });
    await waitFor(() => expect(getByText('まだ記録がありません')).toBeTruthy());
  });

  it('行を押すと個体詳細へ遷移する', async () => {
    const { wrapper, pets, feedings, ownerId } = createTestWrapper();
    const leo = await pets.create(ownerId, { name: 'レオ' });
    await feedings.create(ownerId, { petId: leo.id, foodType: 'コオロギ' });

    const { getByText } = await render(<LogsScreen />, { wrapper });
    await waitFor(() => expect(getByText('レオ')).toBeTruthy());

    await fireEvent.press(getByText('レオ'));

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/pets/[id]', params: { id: leo.id } });
  });
});
