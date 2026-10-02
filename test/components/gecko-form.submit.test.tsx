import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { GeckoForm } from '@/components/gecko-form';

// 「成功 submit（onSubmit 呼び出し）」は React 19 の react-native test-renderer を
// 壊し、同一ファイル内の後続テストの render を空にする既知の環境問題がある。
// そのためこのファイルには成功 submit のテストを 1 本だけ置く（他を追加しないこと）。
describe('GeckoForm (成功 submit)', () => {
  it('有効入力で onSubmit が整形済みの値で呼ばれる（性別チップ含む）', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = await render(<GeckoForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByTestId('gecko-form-name'), '  レオ  ');
    fireEvent.changeText(getByTestId('gecko-form-morph'), 'ノーマル');
    fireEvent.changeText(getByTestId('gecko-form-feedingIntervalDays'), '7');
    fireEvent.press(getByText('メス'));
    fireEvent.press(getByText('保存'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: 'レオ',
      morph: 'ノーマル',
      sex: 'female',
      feedingIntervalDays: 7,
    });
  });
});
