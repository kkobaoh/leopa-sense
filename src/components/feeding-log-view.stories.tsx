import type { Meta, StoryObj } from '@storybook/react-native-web-vite';

import type { FeedingLogEntry } from '@/lib/feeding-log';
import { FeedingLogView } from './feeding-log-view';

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

const entries: FeedingLogEntry[] = [
  { id: '1', petId: 'g1', petName: 'レオ', foodType: 'コオロギ', quantity: 3, result: 'eaten', supplement: true, fedAt: hoursAgo(2) },
  { id: '2', petId: 'g2', petName: 'ナナ', foodType: 'デュビア', quantity: 2, result: 'left', supplement: false, fedAt: hoursAgo(26) },
  { id: '3', petId: 'g3', petName: 'まめ', foodType: '人工フード', quantity: 1, result: 'refused', supplement: false, fedAt: hoursAgo(50) },
];

const meta = {
  title: 'Feeding/FeedingLogView',
  component: FeedingLogView,
  args: { isLoading: false, isError: false, entries },
} satisfies Meta<typeof FeedingLogView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const List: Story = {};
export const Loading: Story = { args: { isLoading: true, entries: [] } };
export const ErrorState: Story = { args: { isError: true, entries: [] } };
export const Empty: Story = { args: { entries: [] } };
