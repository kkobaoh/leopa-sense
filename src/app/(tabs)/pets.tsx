import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { PetListView } from '@/components/pet-list-view';
import { usePets } from '@/lib/hooks/use-pets';
import { useFeedings } from '@/lib/hooks/use-feedings';

export default function PetsScreen() {
  const router = useRouter();
  const { data, isPending, isError } = usePets();
  const { data: feedings } = useFeedings();

  // 全餌やり（fedAt 降順）から個体ごとの「最新の給餌日時」を引く。
  const latestByPet = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of feedings ?? []) {
      if (!map.has(f.petId)) map.set(f.petId, f.fedAt);
    }
    return map;
  }, [feedings]);

  return (
    <PetListView
      isLoading={isPending}
      isError={isError}
      pets={data ?? []}
      onSelectPet={(id) => router.push({ pathname: '/pets/[id]', params: { id } })}
      lastFedAtOf={feedings ? (id) => latestByPet.get(id) ?? null : undefined}
    />
  );
}
