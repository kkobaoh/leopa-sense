import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { FeedingForm } from '@/components/feeding-form';

describe('FeedingForm', () => {
  it('餌の種類が空だと送信をブロックする', async () => {
    const onSubmit = jest.fn();
    const { getByText } = await render(<FeedingForm onSubmit={onSubmit} />);

    await fireEvent.press(getByText('記録する'));

    await waitFor(() => expect(getByText('餌の種類は必須です')).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('数のステッパーで増減でき、1 未満にはならない', async () => {
    const { getByTestId } = await render(<FeedingForm onSubmit={jest.fn()} />);

    await fireEvent.press(getByTestId('feeding-form-quantity-inc'));
    await fireEvent.press(getByTestId('feeding-form-quantity-inc'));
    expect(getByTestId('feeding-form-quantity').props.children).toBe(3);

    await fireEvent.press(getByTestId('feeding-form-quantity-dec'));
    await fireEvent.press(getByTestId('feeding-form-quantity-dec'));
    await fireEvent.press(getByTestId('feeding-form-quantity-dec'));
    expect(getByTestId('feeding-form-quantity').props.children).toBe(1);
  });

  it('餌のプリセットを押すと餌の種類に入る', async () => {
    const { getByTestId, getByText } = await render(<FeedingForm onSubmit={jest.fn()} />);

    await fireEvent.press(getByText('デュビア'));

    expect(getByTestId('feeding-form-foodType').props.value).toBe('デュビア');
  });

  it('入力して記録すると onSubmit に整形済みの値が渡る', async () => {
    const onSubmit = jest.fn();
    const { getByTestId, getByText } = await render(<FeedingForm onSubmit={onSubmit} />);

    await fireEvent.changeText(getByTestId('feeding-form-foodType'), '  コオロギ  ');
    await fireEvent.press(getByTestId('feeding-form-quantity-inc'));
    await fireEvent.press(getByText('残し'));
    await fireEvent.press(getByText('記録する'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      foodType: 'コオロギ',
      quantity: 2,
      result: 'left',
      supplement: false,
    });
  });

  it('初期値（前回内容）を反映して送信できる', async () => {
    const onSubmit = jest.fn();
    const { getByText } = await render(
      <FeedingForm
        onSubmit={onSubmit}
        defaultValues={{ foodType: 'ミルワーム', quantity: 4, result: 'refused', supplement: true }}
      />,
    );

    await fireEvent.press(getByText('記録する'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      foodType: 'ミルワーム',
      quantity: 4,
      result: 'refused',
      supplement: true,
    });
  });
});
