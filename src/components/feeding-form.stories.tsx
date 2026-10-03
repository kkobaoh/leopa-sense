import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { FeedingForm } from './feeding-form';

const meta = {
  title: 'Forms/FeedingForm',
  component: FeedingForm,
  args: {
    onSubmit: (values) => console.log('FeedingForm submit:', values),
  },
} satisfies Meta<typeof FeedingForm>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 新規記録（空）。 */
export const Empty: Story = {};

/** 前回の内容を初期値にした状態。 */
export const PrefilledFromLast: Story = {
  args: {
    defaultValues: { foodType: 'コオロギ', quantity: 3, result: 'eaten', supplement: true },
  },
};
