import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { GeckoListView } from '@/components/gecko-list-view';
import { useGeckos } from '@/lib/hooks/use-geckos';
import { useFeedings } from '@/lib/hooks/use-feedings';

export default function GeckosScreen() {
  const router = useRouter();
  const { data, isPending, isError } = useGeckos();
  const { data: feedings } = useFeedings();

  // 全餌やり（fedAt 降順）から個体ごとの「最新の給餌日時」を引く。
  const latestByGecko = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of feedings ?? []) {
      if (!map.has(f.geckoId)) map.set(f.geckoId, f.fedAt);
    }
    return map;
  }, [feedings]);

  return (
    <GeckoListView
      isLoading={isPending}
      isError={isError}
      geckos={data ?? []}
      onSelectGecko={(id) => router.push({ pathname: '/geckos/[id]', params: { id } })}
      lastFedAtOf={feedings ? (id) => latestByGecko.get(id) ?? null : undefined}
    />
  );
}
