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
});
