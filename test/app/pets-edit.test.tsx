import { fireEvent, render, waitFor } from '@testing-library/react-native';

let mockParams: { id?: string } = {};
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ back: mockBack, push: jest.fn(), navigate: jest.fn() }),
}));

import EditPetScreen from '../../src/app/pets/edit/[id]';
import { createTestWrapper } from '../support/query-wrapper';

describe('EditPetScreen', () => {
  it('既存の個体を更新して前の画面に戻る', async () => {
    const { wrapper, pets, ownerId } = createTestWrapper();
    const g = await pets.create(ownerId, { name: 'レオ', morph: 'ノーマル' });
    mockParams = { id: g.id };

    const { getByTestId, getByText } = await render(<EditPetScreen />, { wrapper });

    // usePet のロード完了を待ってからフォームを操作する
    await waitFor(() => expect(getByTestId('pet-form-name')).toBeTruthy());
    await fireEvent.changeText(getByTestId('pet-form-name'), 'レオ改');
    await fireEvent.press(getByText('更新'));

    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));

    const updated = await pets.getById(ownerId, g.id);
    expect(updated?.name).toBe('レオ改');
    expect(updated?.morph).toBe('ノーマル'); // 変更していない項目は保持
  });
});
