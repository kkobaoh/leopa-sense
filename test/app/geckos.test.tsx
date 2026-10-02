import { render, waitFor } from '@testing-library/react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), navigate: jest.fn() }),
}));

import GeckosScreen from '../../src/app/(tabs)/geckos';
import { createTestWrapper } from '../support/query-wrapper';

describe('GeckosScreen (route)', () => {
  it('useGeckos 経由でオンメモリの個体を表示する', async () => {
    const { wrapper, geckos, ownerId } = createTestWrapper();
    await geckos.create(ownerId, { name: 'レオ' });
    await geckos.create(ownerId, { name: 'ナナ' });

    const { getByText } = await render(<GeckosScreen />, { wrapper });

    await waitFor(() => expect(getByText('レオ')).toBeTruthy());
    expect(getByText('ナナ')).toBeTruthy();
  });

  it('個体がいなければ空状態を表示する', async () => {
    const { wrapper } = createTestWrapper();

    const { getByText } = await render(<GeckosScreen />, { wrapper });

    await waitFor(() => expect(getByText('個体がいません')).toBeTruthy());
  });

  it('給餌記録があればカードに前回給餌バッジを表示する', async () => {
    const { wrapper, geckos, feedings, ownerId } = createTestWrapper();
    const g = await geckos.create(ownerId, { name: 'レオ' });
    await feedings.create(ownerId, {
      geckoId: g.id,
      foodType: 'コオロギ',
      fedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
    });

    const { getByText } = await render(<GeckosScreen />, { wrapper });

    await waitFor(() => expect(getByText('前回給餌 2日前')).toBeTruthy());
  });
});
