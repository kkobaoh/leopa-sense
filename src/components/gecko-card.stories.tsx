import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import type { Gecko } from '@/lib/api';
import { GeckoCard } from './gecko-card';

function sample(overrides: Partial<Gecko> = {}): Gecko {
  return {
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
    ...overrides,
  };
}

const meta = {
  title: 'Gecko/GeckoCard',
  component: GeckoCard,
  args: { gecko: sample(), onPress: (id) => console.log('press', id) },
} satisfies Meta<typeof GeckoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Male: Story = {};
export const Female: Story = { args: { gecko: sample({ name: 'ナナ', sex: 'female', morph: 'タンジェリン' }) } };
export const Unknown: Story = { args: { gecko: sample({ name: 'まめ', sex: 'unknown', morph: null }) } };
