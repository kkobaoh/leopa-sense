import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Alert, type AlertButton } from 'react-native';

// expo-router の useLocalSearchParams / useRouter をモック
let mockParams: { id?: string } = {};
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ back: mockBack, push: jest.fn(), navigate: jest.fn() }),
}));

import PetDetailScreen from '../../src/app/pets/[id]';
import { createTestWrapper } from '../support/query-wrapper';

describe('PetDetailScreen (route)', () => {
  it('指定 id の個体を表示する', async () => {
    const { wrapper, pets, ownerId } = createTestWrapper();
    const g = await pets.create(ownerId, { name: 'レオ', morph: 'ノーマル' });
    mockParams = { id: g.id };

    const { getByText } = await render(<PetDetailScreen />, { wrapper });

    await waitFor(() => expect(getByText('レオ')).toBeTruthy());
    expect(getByText('ノーマル')).toBeTruthy();
  });

  it('存在しない id では not found を表示する', async () => {
    const { wrapper } = createTestWrapper();
    mockParams = { id: 'missing' };

    const { getByText } = await render(<PetDetailScreen />, { wrapper });

    await waitFor(() => expect(getByText('個体が見つかりません')).toBeTruthy());
  });

  it('削除を確定すると個体を消して前の画面に戻る', async () => {
    const { wrapper, pets, ownerId } = createTestWrapper();
    const g = await pets.create(ownerId, { name: 'レオ' });
    mockParams = { id: g.id };

    // Alert の確認で「削除」(destructive) を自動で押す
    const alertSpy = jest
      .spyOn(Alert, 'alert')
      .mockImplementation((_title, _message, buttons) => {
        const del = (buttons as AlertButton[] | undefined)?.find(
          (b) => b.style === 'destructive',
        );
        del?.onPress?.();
      });

    const { getByText } = await render(<PetDetailScreen />, { wrapper });
    await waitFor(() => expect(getByText('レオ')).toBeTruthy());

    await fireEvent.press(getByText('削除'));

    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));
    expect(await pets.getById(ownerId, g.id)).toBeNull();

    alertSpy.mockRestore();
  });
});
