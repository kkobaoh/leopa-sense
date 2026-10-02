import { render } from '@testing-library/react-native';

import { GeckoListView } from '@/components/gecko-list-view';
import { makeGecko } from '../support/factories';

describe('GeckoListView', () => {
  it('読込中はローディングを表示する', async () => {
    const { getByTestId } = await render(
      <GeckoListView isLoading isError={false} geckos={[]} />,
    );
    expect(getByTestId('gecko-list-loading')).toBeTruthy();
  });

  it('エラー時はエラーメッセージを表示する', async () => {
    const { getByText } = await render(
      <GeckoListView isLoading={false} isError geckos={[]} />,
    );
    expect(getByText('読み込みに失敗しました')).toBeTruthy();
  });

  it('個体がいないとき空状態を表示する', async () => {
    const { getByText } = await render(
      <GeckoListView isLoading={false} isError={false} geckos={[]} />,
    );
    expect(getByText('個体がいません')).toBeTruthy();
  });

  it('個体一覧を表示する', async () => {
    const geckos = [
      makeGecko({ id: '1', name: 'レオ' }),
      makeGecko({ id: '2', name: 'ナナ' }),
    ];
    const { getByText } = await render(
      <GeckoListView isLoading={false} isError={false} geckos={geckos} />,
    );
    expect(getByText('レオ')).toBeTruthy();
    expect(getByText('ナナ')).toBeTruthy();
  });
});
