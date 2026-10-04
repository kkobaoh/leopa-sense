import { useRouter } from 'expo-router';

import { PetForm } from '@/components/pet-form';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { useCreatePet } from '@/lib/hooks/use-pets';

export default function NewPetScreen() {
  const router = useRouter();
  const createPet = useCreatePet();

  return (
    <ScreenScroll>
      <PetForm
        submitLabel="登録"
        onSubmit={async (values) => {
          await createPet.mutateAsync(values);
          router.back();
        }}
      />
    </ScreenScroll>
  );
}
