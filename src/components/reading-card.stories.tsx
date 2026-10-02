import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { ReadingCard } from './reading-card';

const meta = {
  title: 'Monitoring/ReadingCard',
  component: ReadingCard,
  args: {
    label: 'ホット側',
    temp: 30,
    humidity: 50,
    tempRange: { min: 28, max: 32 },
    humidityRange: { min: 40, max: 60 },
  },
} satisfies Meta<typeof ReadingCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {};
export const Warning: Story = { args: { temp: 31.8 } };
export const Danger: Story = { args: { temp: 36 } };
export const NoData: Story = { args: { label: 'クール側', temp: null, humidity: null } };
