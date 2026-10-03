import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { FeedingLogView } from '@/components/feeding-log-view';
import { buildFeedingLog } from '@/lib/feeding-log';
import { useFeedings } from '@/lib/hooks/use-feedings';
import { useGeckos } from '@/lib/hooks/use-geckos';

export default function LogsScreen() {
  const router = useRouter();
  const feedings = useFeedings();
  const geckos = useGeckos();

  const entries = useMemo(
    () => buildFeedingLog(feedings.data ?? [], geckos.data ?? []),
    [feedings.data, geckos.data],
  );

  return (
    <FeedingLogView
      isLoading={feedings.isPending || geckos.isPending}
      isError={feedings.isError || geckos.isError}
      entries={entries}
      onSelectGecko={(id) => router.push({ pathname: '/geckos/[id]', params: { id } })}
    />
  );
}
