import { fireEvent, render } from '@testing-library/react-native';

import { GeckoCard } from '@/components/gecko-card';
import { makeGecko } from '../support/factories';

describe('GeckoCard', () => {
  it('名前とモルフを表示する', async () => {
    const { getByText } = await render(
      <GeckoCard gecko={makeGecko({ name: 'レオ', morph: 'ノーマル' })} />,
    );
    expect(getByText('レオ')).toBeTruthy();
    expect(getByText('ノーマル')).toBeTruthy();
  });

  it('性別ラベルを表示する', async () => {
    const { getByText } = await render(
      <GeckoCard gecko={makeGecko({ name: 'ナナ', sex: 'female' })} />,
    );
    expect(getByText('メス')).toBeTruthy();
  });

  it('押すと id を渡して onPress を呼ぶ', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <GeckoCard gecko={makeGecko({ id: 'g1', name: 'ポチ' })} onPress={onPress} />,
    );
    fireEvent.press(getByText('ポチ'));
    expect(onPress).toHaveBeenCalledWith('g1');
  });
});
