import { useLocalSearchParams, useRouter } from 'expo-router';

import { GeckoForm } from '@/components/gecko-form';
import { LoadingState, MessageState } from '@/components/ui/screen-state';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { useGecko, useUpdateGecko } from '@/lib/hooks/use-geckos';

export default function EditGeckoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: gecko, isPending } = useGecko(id ?? '');
  const updateGecko = useUpdateGecko();

  if (isPending) return <LoadingState />;
  if (!gecko) return <MessageState title="個体が見つかりません" />;

  return (
    <ScreenScroll>
      <GeckoForm
        submitLabel="更新"
        defaultValues={{
          name: gecko.name,
          morph: gecko.morph,
          sex: gecko.sex,
          hatchedOn: gecko.hatchedOn,
          photoPath: gecko.photoPath,
          feedingIntervalDays: gecko.feedingIntervalDays,
          enclosureId: gecko.enclosureId,
        }}
        onSubmit={async (values) => {
          await updateGecko.mutateAsync({ id: gecko.id, input: values });
          router.back();
        }}
      />
    </ScreenScroll>
  );
}
