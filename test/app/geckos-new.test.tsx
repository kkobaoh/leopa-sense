import { fireEvent, render, waitFor } from '@testing-library/react-native';

// expo-router の useRouter をモック（back の呼び出しを検証する）
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn(), navigate: jest.fn() }),
}));

import NewGeckoScreen from '../../src/app/geckos/new';
import { createTestWrapper } from '../support/query-wrapper';

// 成功 submit を含むため、このファイルにはテストを 1 本だけ置く
// （RHF の成功 handleSubmit が React 19 の test-renderer をテスト間で壊すため）。
describe('NewGeckoScreen', () => {
  it('フォーム送信で個体を作成し、前の画面に戻る', async () => {
    const { wrapper, geckos, ownerId } = createTestWrapper();
    const { getByTestId, getByText } = await render(<NewGeckoScreen />, { wrapper });

    fireEvent.changeText(getByTestId('gecko-form-name'), 'レオ');
    fireEvent.press(getByText('登録'));

    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));

    const list = await geckos.list(ownerId);
    expect(list.map((g) => g.name)).toContain('レオ');
  });
});
