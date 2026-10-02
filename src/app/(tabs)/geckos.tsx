import { useRouter } from 'expo-router';

import { GeckoListView } from '@/components/gecko-list-view';
import { useGeckos } from '@/lib/hooks/use-geckos';

export default function GeckosScreen() {
  const router = useRouter();
  const { data, isPending, isError } = useGeckos();

  return (
    <GeckoListView
      isLoading={isPending}
      isError={isError}
      geckos={data ?? []}
      onSelectGecko={(id) => router.push({ pathname: '/geckos/[id]', params: { id } })}
    />
  );
}
