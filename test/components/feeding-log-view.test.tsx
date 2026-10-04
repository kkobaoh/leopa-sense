import { fireEvent, render } from '@testing-library/react-native';

import { FeedingLogView } from '@/components/feeding-log-view';
import type { FeedingLogEntry } from '@/lib/feeding-log';

const entry = (overrides: Partial<FeedingLogEntry>): FeedingLogEntry => ({
  id: 'fd',
  petId: 'g1',
  petName: 'レオ',
  foodType: 'コオロギ',
  quantity: 1,
  result: 'eaten',
  supplement: false,
  fedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('FeedingLogView', () => {
  it('読込中はローディングを表示する', async () => {
    const { getByTestId } = await render(
      <FeedingLogView isLoading isError={false} entries={[]} />,
    );
    expect(getByTestId('feeding-log-loading')).toBeTruthy();
  });

  it('エラー時はエラーメッセージを表示する', async () => {
    const { getByText } = await render(
      <FeedingLogView isLoading={false} isError entries={[]} />,
    );
    expect(getByText('読み込みに失敗しました')).toBeTruthy();
  });

  it('記録がなければ空状態を表示する', async () => {
    const { getByText } = await render(
      <FeedingLogView isLoading={false} isError={false} entries={[]} />,
    );
    expect(getByText('まだ記録がありません')).toBeTruthy();
  });

  it('記録の個体名・餌と数・食いつき・サプリを表示する', async () => {
    const { getByText } = await render(
      <FeedingLogView
        isLoading={false}
        isError={false}
        entries={[
          entry({ id: '1', petName: 'レオ', foodType: 'コオロギ', quantity: 3, supplement: true }),
          entry({ id: '2', petName: 'ナナ', foodType: 'デュビア', result: 'refused' }),
        ]}
      />,
    );
    expect(getByText('レオ')).toBeTruthy();
    expect(getByText('コオロギ ×3')).toBeTruthy();
    expect(getByText('サプリ')).toBeTruthy();
    expect(getByText('完食')).toBeTruthy();
    expect(getByText('ナナ')).toBeTruthy();
    expect(getByText('拒食')).toBeTruthy();
  });

  it('行を押すと個体 id を渡して onSelectPet を呼ぶ', async () => {
    const onSelectPet = jest.fn();
    const { getByText } = await render(
      <FeedingLogView
        isLoading={false}
        isError={false}
        entries={[entry({ petId: 'g9', petName: 'ポチ' })]}
        onSelectPet={onSelectPet}
      />,
    );
    await fireEvent.press(getByText('ポチ'));
    expect(onSelectPet).toHaveBeenCalledWith('g9');
  });
});
