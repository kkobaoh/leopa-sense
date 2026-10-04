import { fireEvent, render } from '@testing-library/react-native';

import { PetDetailView } from '@/components/pet-detail-view';
import { makePet } from '../support/factories';

describe('PetDetailView', () => {
  it('読込中はローディングを表示する', async () => {
    const { getByTestId } = await render(
      <PetDetailView isLoading isError={false} pet={undefined} />,
    );
    expect(getByTestId('pet-detail-loading')).toBeTruthy();
  });

  it('エラー時はエラーメッセージを表示する', async () => {
    const { getByText } = await render(
      <PetDetailView isLoading={false} isError pet={undefined} />,
    );
    expect(getByText('読み込みに失敗しました')).toBeTruthy();
  });

  it('個体が見つからないとき not found を表示する', async () => {
    const { getByText } = await render(
      <PetDetailView isLoading={false} isError={false} pet={null} />,
    );
    expect(getByText('個体が見つかりません')).toBeTruthy();
  });

  it('個体のプロフィールを表示する', async () => {
    const pet = makePet({
      name: 'レオ',
      morph: 'ノーマル',
      sex: 'male',
      hatchedOn: '2024-06-01',
      feedingIntervalDays: 7,
    });
    const { getByText } = await render(
      <PetDetailView isLoading={false} isError={false} pet={pet} />,
    );
    expect(getByText('レオ')).toBeTruthy();
    expect(getByText('ノーマル')).toBeTruthy();
    expect(getByText('オス')).toBeTruthy();
    expect(getByText('2024-06-01')).toBeTruthy();
    expect(getByText('7日')).toBeTruthy();
  });

  it('onEdit / onDelete を渡すとボタンが押せる', async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const { getByText } = await render(
      <PetDetailView
        isLoading={false}
        isError={false}
        pet={makePet({ name: 'レオ' })}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    await fireEvent.press(getByText('編集'));
    expect(onEdit).toHaveBeenCalledTimes(1);

    await fireEvent.press(getByText('削除'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('onRecordFeeding を渡すと「餌やりを記録」ボタンが押せる', async () => {
    const onRecordFeeding = jest.fn();
    const { getByText } = await render(
      <PetDetailView
        isLoading={false}
        isError={false}
        pet={makePet()}
        onRecordFeeding={onRecordFeeding}
      />,
    );

    await fireEvent.press(getByText('餌やりを記録'));
    expect(onRecordFeeding).toHaveBeenCalledTimes(1);
  });

  it('onEdit / onDelete を渡さなければボタンを表示しない', async () => {
    const { queryByText } = await render(
      <PetDetailView isLoading={false} isError={false} pet={makePet()} />,
    );
    expect(queryByText('編集')).toBeNull();
    expect(queryByText('削除')).toBeNull();
  });
});
