import { fireEvent, render } from '@testing-library/react-native';

import { PetCard } from '@/components/pet-card';
import { makePet } from '../support/factories';

describe('PetCard', () => {
  it('名前とモルフを表示する', async () => {
    const { getByText } = await render(
      <PetCard pet={makePet({ name: 'レオ', morph: 'ノーマル' })} />,
    );
    expect(getByText('レオ')).toBeTruthy();
    expect(getByText('ノーマル')).toBeTruthy();
  });

  it('性別ラベルを表示する', async () => {
    const { getByText } = await render(
      <PetCard pet={makePet({ name: 'ナナ', sex: 'female' })} />,
    );
    expect(getByText('メス')).toBeTruthy();
  });

  it('押すと id を渡して onPress を呼ぶ', async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <PetCard pet={makePet({ id: 'g1', name: 'ポチ' })} onPress={onPress} />,
    );
    await fireEvent.press(getByText('ポチ'));
    expect(onPress).toHaveBeenCalledWith('g1');
  });

  it('lastFedAt が null なら「給餌記録なし」バッジを表示する', async () => {
    const { getByText } = await render(
      <PetCard pet={makePet({ name: 'レオ' })} lastFedAt={null} />,
    );
    expect(getByText('給餌記録なし')).toBeTruthy();
  });

  it('lastFedAt があれば「前回給餌 ◯日前」を表示する', async () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86_400_000).toISOString();
    const { getByText } = await render(
      <PetCard pet={makePet({ name: 'レオ' })} lastFedAt={twoDaysAgo} />,
    );
    expect(getByText('前回給餌 2日前')).toBeTruthy();
  });

  it('lastFedAt を渡さなければバッジを表示しない', async () => {
    const { queryByText } = await render(<PetCard pet={makePet({ name: 'レオ' })} />);
    expect(queryByText('給餌記録なし')).toBeNull();
  });
});
