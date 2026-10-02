import { fireEvent, render, waitFor } from '@testing-library/react-native';

let mockParams: { id?: string } = {};
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ back: mockBack, push: jest.fn(), navigate: jest.fn() }),
}));

import EditGeckoScreen from '../../src/app/geckos/edit/[id]';
import { createTestWrapper } from '../support/query-wrapper';

// 成功 submit を含むため、このファイルにはテストを 1 本だけ置く
// （RHF の成功 handleSubmit が React 19 の test-renderer をテスト間で壊すため）。
describe('EditGeckoScreen', () => {
  it('既存の個体を更新して前の画面に戻る', async () => {
    const { wrapper, geckos, ownerId } = createTestWrapper();
    const g = await geckos.create(ownerId, { name: 'レオ', morph: 'ノーマル' });
    mockParams = { id: g.id };

    const { getByTestId, getByText } = await render(<EditGeckoScreen />, { wrapper });

    // useGecko のロード完了を待ってからフォームを操作する
    await waitFor(() => expect(getByTestId('gecko-form-name')).toBeTruthy());
    fireEvent.changeText(getByTestId('gecko-form-name'), 'レオ改');
    fireEvent.press(getByText('更新'));

    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));

    const updated = await geckos.getById(ownerId, g.id);
    expect(updated?.name).toBe('レオ改');
    expect(updated?.morph).toBe('ノーマル'); // 変更していない項目は保持
  });
});
