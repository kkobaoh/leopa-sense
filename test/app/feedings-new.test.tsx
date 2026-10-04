import { fireEvent, render, waitFor } from '@testing-library/react-native';

let mockParams: { petId?: string } = {};
const mockBack = jest.fn();
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockParams,
  useRouter: () => ({ back: mockBack, push: jest.fn(), navigate: jest.fn() }),
}));

import NewFeedingScreen from '../../src/app/feedings/new';
import { createTestWrapper } from '../support/query-wrapper';

describe('NewFeedingScreen', () => {
  it('前回内容を初期値に表示し、記録すると保存して前の画面に戻る', async () => {
    const { wrapper, feedings, ownerId } = createTestWrapper();
    await feedings.create(ownerId, {
      petId: 'g1',
      foodType: 'デュビア',
      quantity: 2,
      occurredAt: '2026-01-01T00:00:00.000Z',
    });
    mockParams = { petId: 'g1' };

    const { getByTestId, getByText } = await render(<NewFeedingScreen />, { wrapper });

    // 最新記録のロード後、前回の餌が初期値として入っている
    await waitFor(() =>
      expect(getByTestId('feeding-form-foodType').props.value).toBe('デュビア'),
    );
    expect(getByTestId('feeding-form-quantity').props.children).toBe(2);

    await fireEvent.press(getByText('記録する'));

    await waitFor(() => expect(mockBack).toHaveBeenCalledTimes(1));

    const list = await feedings.listByPet(ownerId, 'g1');
    expect(list).toHaveLength(2);
    expect(list[0].foodType).toBe('デュビア');
    expect(list[0].quantity).toBe(2);
  });
});
