import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import type { Pet } from '@/lib/api';
import { PetCard } from './pet-card';

function sample(overrides: Partial<Pet> = {}): Pet {
  return {
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
    ...overrides,
  };
}

const meta = {
  title: 'Pet/PetCard',
  component: PetCard,
  args: { pet: sample(), onPress: (id) => console.log('press', id) },
} satisfies Meta<typeof PetCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const Male: Story = {};
export const Female: Story = { args: { pet: sample({ name: 'ナナ', sex: 'female', morph: 'タンジェリン' }) } };
export const Unknown: Story = { args: { pet: sample({ name: 'まめ', sex: 'unknown', morph: null }) } };

export const RecentlyFed: Story = { args: { lastFedAt: daysAgo(2) } };
export const Overdue: Story = { args: { pet: sample({ feedingIntervalDays: 5 }), lastFedAt: daysAgo(10) } };
export const NoFeeding: Story = { args: { lastFedAt: null } };
