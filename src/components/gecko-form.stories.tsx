import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { GeckoForm } from './gecko-form';

const meta = {
  title: 'Forms/GeckoForm',
  component: GeckoForm,
  args: {
    // Storybook 上では送信値をコンソールに出すだけ
    onSubmit: (values) => console.log('GeckoForm submit:', values),
  },
} satisfies Meta<typeof GeckoForm>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 新規登録（空フォーム）。 */
export const Create: Story = {};

/** 編集（初期値あり）。 */
export const Edit: Story = {
  args: {
    submitLabel: '更新',
    defaultValues: {
      name: 'レオ',
      morph: 'ハイイエロー',
      sex: 'male',
      hatchedOn: '2024-06-01',
      feedingIntervalDays: 5,
    },
  },
};
