import { render } from '@testing-library/react-native';

import { PetListView } from '@/components/pet-list-view';
import { makePet } from '../support/factories';

describe('PetListView', () => {
  it('読込中はローディングを表示する', async () => {
    const { getByTestId } = await render(
      <PetListView isLoading isError={false} pets={[]} />,
    );
    expect(getByTestId('pet-list-loading')).toBeTruthy();
  });

  it('エラー時はエラーメッセージを表示する', async () => {
    const { getByText } = await render(
      <PetListView isLoading={false} isError pets={[]} />,
    );
    expect(getByText('読み込みに失敗しました')).toBeTruthy();
  });

  it('個体がいないとき空状態を表示する', async () => {
    const { getByText } = await render(
      <PetListView isLoading={false} isError={false} pets={[]} />,
    );
    expect(getByText('個体がいません')).toBeTruthy();
  });

  it('個体一覧を表示する', async () => {
    const pets = [
      makePet({ id: '1', name: 'レオ' }),
      makePet({ id: '2', name: 'ナナ' }),
    ];
    const { getByText } = await render(
      <PetListView isLoading={false} isError={false} pets={pets} />,
    );
    expect(getByText('レオ')).toBeTruthy();
    expect(getByText('ナナ')).toBeTruthy();
  });
});
