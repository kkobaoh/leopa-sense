import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import type { Pet } from '@/lib/api';
import { PetDetailView } from './pet-detail-view';

const pet: Pet = {
  id: 'pet_1',
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
  title: 'Pet/PetDetailView',
  component: PetDetailView,
  args: {
    isLoading: false,
    isError: false,
    pet,
    onRecordFeeding: () => console.log('record feeding'),
    onEdit: () => console.log('edit'),
    onDelete: () => console.log('delete'),
  },
} satisfies Meta<typeof PetDetailView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Detail: Story = {};
export const Loading: Story = { args: { isLoading: true, pet: undefined } };
export const ErrorState: Story = { args: { isError: true, pet: undefined } };
export const NotFound: Story = { args: { pet: null } };
