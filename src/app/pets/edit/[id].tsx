import { useLocalSearchParams, useRouter } from 'expo-router';

import { PetForm } from '@/components/pet-form';
import { LoadingState, MessageState } from '@/components/ui/screen-state';
import { ScreenScroll } from '@/components/ui/screen-scroll';
import { usePet, useUpdatePet } from '@/lib/hooks/use-pets';

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: pet, isPending } = usePet(id ?? '');
  const updatePet = useUpdatePet();

  if (isPending) return <LoadingState />;
  if (!pet) return <MessageState title="個体が見つかりません" />;

  return (
    <ScreenScroll>
      <PetForm
        submitLabel="更新"
        defaultValues={{
          name: pet.name,
          morph: pet.morph,
          sex: pet.sex,
          hatchedOn: pet.hatchedOn,
          photoPath: pet.photoPath,
          feedingIntervalDays: pet.feedingIntervalDays,
          enclosureId: pet.enclosureId,
        }}
        onSubmit={async (values) => {
          await updatePet.mutateAsync({ id: pet.id, input: values });
          router.back();
        }}
      />
    </ScreenScroll>
  );
}
