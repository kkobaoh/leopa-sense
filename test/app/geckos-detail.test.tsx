import { render, waitFor } from '@testing-library/react-native';

// expo-router の useLocalSearchParams をモック（id を差し替える）
let mockParams: { id?: string } = {};
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
}));

import GeckoDetailScreen from '../../src/app/geckos/[id]';
import { createTestWrapper } from '../support/query-wrapper';

describe('GeckoDetailScreen (route)', () => {
  it('指定 id の個体を表示する', async () => {
    const { wrapper, geckos, ownerId } = createTestWrapper();
    const g = await geckos.create(ownerId, { name: 'レオ', morph: 'ノーマル' });
    mockParams = { id: g.id };

    const { getByText } = await render(<GeckoDetailScreen />, { wrapper });

    await waitFor(() => expect(getByText('レオ')).toBeTruthy());
    expect(getByText('ノーマル')).toBeTruthy();
  });

  it('存在しない id では not found を表示する', async () => {
    const { wrapper } = createTestWrapper();
    mockParams = { id: 'missing' };

    const { getByText } = await render(<GeckoDetailScreen />, { wrapper });

    await waitFor(() => expect(getByText('個体が見つかりません')).toBeTruthy());
  });
});
