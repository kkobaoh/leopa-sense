import { useRouter } from 'expo-router';

import { GeckoForm } from '@/components/gecko-form';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { useCreateGecko } from '@/lib/hooks/use-geckos';

export default function NewGeckoScreen() {
  const router = useRouter();
  const createGecko = useCreateGecko();

  return (
    <ScreenScroll>
      <GeckoForm
        submitLabel="登録"
        onSubmit={async (values) => {
          await createGecko.mutateAsync(values);
          router.back();
        }}
      />
    </ScreenScroll>
  );
}
