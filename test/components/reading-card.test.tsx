import { render } from '@testing-library/react-native';

import { ReadingCard } from '@/components/reading-card';

const TEMP_RANGE = { min: 28, max: 32 };
const HUM_RANGE = { min: 40, max: 60 };

describe('ReadingCard', () => {
  it('温度・湿度と正常ステータスを表示する', async () => {
    const { getByText } = await render(
      <ReadingCard
        label="ホット側"
        temp={30}
        humidity={50}
        tempRange={TEMP_RANGE}
        humidityRange={HUM_RANGE}
      />,
    );
    expect(getByText('ホット側')).toBeTruthy();
    expect(getByText('30.0°C')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
    expect(getByText('正常')).toBeTruthy();
  });

  it('範囲外は危険ステータスを表示する', async () => {
    const { getByText } = await render(
      <ReadingCard
        label="ホット側"
        temp={36}
        humidity={50}
        tempRange={TEMP_RANGE}
        humidityRange={HUM_RANGE}
      />,
    );
    expect(getByText('危険')).toBeTruthy();
  });

  it('値が無いときはプレースホルダを表示しステータスは出さない', async () => {
    const { getByText, queryByText } = await render(
      <ReadingCard
        label="クール側"
        temp={null}
        humidity={null}
        tempRange={TEMP_RANGE}
        humidityRange={HUM_RANGE}
      />,
    );
    expect(getByText('--°C')).toBeTruthy();
    expect(getByText('--%')).toBeTruthy();
    expect(queryByText('正常')).toBeNull();
    expect(queryByText('危険')).toBeNull();
  });
});
