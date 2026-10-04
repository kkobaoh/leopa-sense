import { fireEvent, render, waitFor } from '@testing-library/react-native';

// expo-router の useRouter をモック（back の呼び出しを検証する）
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ back: mockBack, push: jest.fn(), navigate: jest.fn() }),
}));

import NewPetScreen from '../../src/app/pets/new';
import { createTestWrapper } from '../support/query-wrapper';

describe('NewPetScreen', () => {
  it('フォーム送信で個体を作成し、前の画面に戻る', async () => {
    const { wrapper, pets, ownerId } = createTestWrapper();
    const { getByTestId, getByText } = await render(<NewPetScreen />, { wrapper });

    await fireEvent.changeText(getByTestId('pet-form-name'), 'レオ');
    await fireEvent.press(getByText('登録'));

    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));

    const list = await pets.list(ownerId);
    expect(list.map((g) => g.name)).toContain('レオ');
  });
});
