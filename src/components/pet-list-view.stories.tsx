import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import type { Pet } from '@/lib/api';
import { PetListView } from './pet-list-view';

function sample(id: string, name: string, overrides: Partial<Pet> = {}): Pet {
  return {
    id,
    ownerId: 'owner',
    enclosureId: null,
    name,
    morph: 'ハイイエロー',
    sex: 'unknown',
    hatchedOn: null,
    photoPath: null,
    feedingIntervalDays: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const meta = {
  title: 'Pet/PetListView',
  component: PetListView,
  args: { isLoading: false, isError: false, pets: [] },
} satisfies Meta<typeof PetListView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { isLoading: true } };
export const ErrorState: Story = { args: { isError: true } };
export const Empty: Story = {};
export const List: Story = {
  args: {
    pets: [
      sample('1', 'レオ', { sex: 'male', morph: 'ハイイエロー' }),
      sample('2', 'ナナ', { sex: 'female', morph: 'タンジェリン' }),
      sample('3', 'まめ', { sex: 'unknown', morph: null }),
    ],
  },
};
