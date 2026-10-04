import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { FeedingLogView } from '@/components/feeding-log-view';
import { buildFeedingLog } from '@/lib/feeding-log';
import { useFeedings } from '@/lib/hooks/use-feedings';
import { usePets } from '@/lib/hooks/use-pets';

export default function LogsScreen() {
  const router = useRouter();
  const feedings = useFeedings();
  const pets = usePets();

  const entries = useMemo(
    () => buildFeedingLog(feedings.data ?? [], pets.data ?? []),
    [feedings.data, pets.data],
  );

  return (
    <FeedingLogView
      isLoading={feedings.isPending || pets.isPending}
      isError={feedings.isError || pets.isError}
      entries={entries}
      onSelectPet={(id) => router.push({ pathname: '/pets/[id]', params: { id } })}
    />
  );
}
