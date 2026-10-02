import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { GeckoForm } from '@/components/gecko-form';
import { settle } from '../support/settle';

// react-hook-form の submit は React 19 の react-native test-renderer を壊しやすく、
// 特に「成功 submit（onSubmit 呼び出し）」は flush でも回収できず後続 render を壊す。
// そのため成功 submit のテストは別ファイル（gecko-form.submit.test.tsx）に分離し、
// このファイルでは描画とバリデーション（無効 submit）のみを検証する。
// 無効 submit の末尾では settle() を呼んで保留更新を流す。
describe('GeckoForm (描画・バリデーション)', () => {
  it('name が空のまま送信するとエラーを表示し onSubmit を呼ばない', async () => {
    const onSubmit = jest.fn();
    const { getByText } = await render(<GeckoForm onSubmit={onSubmit} />);

    fireEvent.press(getByText('保存'));

    await waitFor(() => expect(getByText('名前は必須です')).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();
    await settle();
  });

  it('給餌間隔が 0 以下だと送信をブロックする', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = await render(<GeckoForm onSubmit={onSubmit} />);

    fireEvent.changeText(getByTestId('gecko-form-name'), 'レオ');
    fireEvent.changeText(getByTestId('gecko-form-feedingIntervalDays'), '0');
    fireEvent.press(getByText('保存'));

    await waitFor(() =>
      expect(getByTestId('gecko-form-feedingIntervalDays-error')).toBeTruthy(),
    );
    expect(onSubmit).not.toHaveBeenCalled();
    await settle();
  });
});
