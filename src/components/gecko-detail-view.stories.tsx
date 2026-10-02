import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import type { Gecko } from '@/lib/api';
import { GeckoDetailView } from './gecko-detail-view';

const gecko: Gecko = {
  id: 'gk_1',
  ownerId: 'owner',
  enclosureId: null,
  name: 'レオ',
  morph: 'ハイイエロー',
  sex: 'male',
  hatchedOn: '2024-06-01',
  photoPath: null,
  feedingIntervalDays: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const meta = {
  title: 'Gecko/GeckoDetailView',
  component: GeckoDetailView,
  args: {
    isLoading: false,
    isError: false,
    gecko,
    onEdit: () => console.log('edit'),
    onDelete: () => console.log('delete'),
  },
} satisfies Meta<typeof GeckoDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Detail: Story = {};
export const Loading: Story = { args: { isLoading: true, gecko: undefined } };
export const ErrorState: Story = { args: { isError: true, gecko: undefined } };
export const NotFound: Story = { args: { gecko: null } };
