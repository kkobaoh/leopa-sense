import { GeckoListView } from '@/components/gecko-list-view';
import { useGeckos } from '@/lib/hooks/use-geckos';

export default function GeckosScreen() {
  const { data, isPending, isError } = useGeckos();

  // TODO(detail): geckos/[id] を作ったら onSelectGecko でルーティングする
  return <GeckoListView isLoading={isPending} isError={isError} geckos={data ?? []} />;
}
