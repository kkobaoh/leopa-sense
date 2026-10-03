import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { GeckoForm } from '@/components/gecko-form';

// 注意: RNTL v14 では render / fireEvent はすべて async。必ず await すること
// （await しないと act スコープが重なり、後続テストのレンダラが壊れる）。
describe('GeckoForm', () => {
  it('name が空のまま送信するとエラーを表示し onSubmit を呼ばない', async () => {
    const onSubmit = jest.fn();
    const { getByText } = await render(<GeckoForm onSubmit={onSubmit} />);

    await fireEvent.press(getByText('保存'));

    await waitFor(() => expect(getByText('名前は必須です')).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('給餌間隔が 0 以下だと送信をブロックする', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = await render(<GeckoForm onSubmit={onSubmit} />);

    await fireEvent.changeText(getByTestId('gecko-form-name'), 'レオ');
    await fireEvent.changeText(getByTestId('gecko-form-feedingIntervalDays'), '0');
    await fireEvent.press(getByText('保存'));

    await waitFor(() =>
      expect(getByTestId('gecko-form-feedingIntervalDays-error')).toBeTruthy(),
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('有効入力で onSubmit が整形済みの値で呼ばれる', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = await render(<GeckoForm onSubmit={onSubmit} />);

    await fireEvent.changeText(getByTestId('gecko-form-name'), '  レオ  ');
    await fireEvent.changeText(getByTestId('gecko-form-morph'), 'ノーマル');
    await fireEvent.changeText(getByTestId('gecko-form-feedingIntervalDays'), '7');
    await fireEvent.press(getByText('保存'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      name: 'レオ',
      morph: 'ノーマル',
      sex: 'unknown',
      feedingIntervalDays: 7,
    });
  });

  it('性別チップを選ぶと onSubmit にその値が渡る', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = await render(<GeckoForm onSubmit={onSubmit} />);

    await fireEvent.changeText(getByTestId('gecko-form-name'), 'ナナ');
    await fireEvent.press(getByText('メス'));
    await fireEvent.press(getByText('保存'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ name: 'ナナ', sex: 'female' });
  });
});
