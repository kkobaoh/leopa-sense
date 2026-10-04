import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { PetDetailView } from '@/components/pet-detail-view';
import { usePet, useRemovePet } from '@/lib/hooks/use-pets';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isPending, isError } = usePet(id ?? '');
  const removePet = useRemovePet();

  const petId = data?.id;

  function confirmDelete(targetId: string) {
    Alert.alert('削除しますか？', 'この個体を削除します。元に戻せません。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await removePet.mutateAsync(targetId);
          router.back();
        },
      },
    ]);
  }

  return (
    <PetDetailView
      isLoading={isPending}
      isError={isError}
      pet={data}
      onRecordFeeding={
        petId
          ? () => router.push({ pathname: '/feedings/new', params: { petId } })
          : undefined
      }
      onEdit={
        petId
          ? () => router.push({ pathname: '/pets/edit/[id]', params: { id: petId } })
          : undefined
      }
      onDelete={petId ? () => confirmDelete(petId) : undefined}
    />
  );
}
