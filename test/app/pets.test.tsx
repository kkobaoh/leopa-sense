import { render, waitFor } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), navigate: jest.fn() }),
}));

import PetsScreen from '../../src/app/(tabs)/pets';
import { createTestWrapper } from '../support/query-wrapper';

describe('PetsScreen (route)', () => {
  it('usePets 経由でオンメモリの個体を表示する', async () => {
    const { wrapper, pets, ownerId } = createTestWrapper();
    await pets.create(ownerId, { name: 'レオ' });
    await pets.create(ownerId, { name: 'ナナ' });

    const { getByText } = await render(<PetsScreen />, { wrapper });

    await waitFor(() => expect(getByText('レオ')).toBeTruthy());
    expect(getByText('ナナ')).toBeTruthy();
  });

  it('個体がいなければ空状態を表示する', async () => {
    const { wrapper } = createTestWrapper();

    const { getByText } = await render(<PetsScreen />, { wrapper });

    await waitFor(() => expect(getByText('個体がいません')).toBeTruthy());
  });

  it('給餌記録があればカードに前回給餌バッジを表示する', async () => {
    const { wrapper, pets, feedings, ownerId } = createTestWrapper();
    const g = await pets.create(ownerId, { name: 'レオ' });
    await feedings.create(ownerId, {
      petId: g.id,
      foodType: 'コオロギ',
      occurredAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    });

    const { getByText } = await render(<PetsScreen />, { wrapper });

    await waitFor(() => expect(getByText('前回給餌 2日前')).toBeTruthy());
  });
});
