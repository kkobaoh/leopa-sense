import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import { StatusPill } from './status-pill';

const meta = {
  title: 'UI/StatusPill',
  component: StatusPill,
  args: { status: 'normal' },
} satisfies Meta<typeof StatusPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = { args: { status: 'normal' } };
export const Warning: Story = { args: { status: 'warning' } };
export const Danger: Story = { args: { status: 'danger' } };
export const CustomLabel: Story = { args: { status: 'warning', label: '受信遅れ' } };
