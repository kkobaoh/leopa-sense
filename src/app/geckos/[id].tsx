import { useLocalSearchParams } from 'expo-router';

import { GeckoDetailView } from '@/components/gecko-detail-view';
import { useGecko } from '@/lib/hooks/use-geckos';

export default function GeckoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useGecko(id ?? '');

  return <GeckoDetailView isLoading={isPending} isError={isError} gecko={data} />;
}
