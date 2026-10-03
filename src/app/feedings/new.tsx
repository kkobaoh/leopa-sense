import { useLocalSearchParams, useRouter } from 'expo-router';

import { FeedingForm } from '@/components/feeding-form';
import { LoadingState } from '@/components/ui/screen-state';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { useCreateFeeding, useLatestFeeding } from '@/lib/hooks/use-feedings';

export default function NewFeedingScreen() {
  const { geckoId } = useLocalSearchParams<{ geckoId: string }>();
  const router = useRouter();
  const createFeeding = useCreateFeeding();
  const latest = useLatestFeeding(geckoId ?? '');

  // 前回の内容を初期値にするため、最新記録のロードを待ってからフォームを出す
  if (latest.isPending) return <LoadingState />;

  const last = latest.data;
  return (
    <ScreenScroll>
      <FeedingForm
        defaultValues={
          last
            ? {
                foodType: last.foodType,
                quantity: last.quantity,
                result: last.result,
                supplement: last.supplement,
              }
            : undefined
        }
        onSubmit={async (values) => {
          await createFeeding.mutateAsync({ geckoId: geckoId ?? '', ...values });
          router.back();
        }}
      />
    </ScreenScroll>
  );
}
