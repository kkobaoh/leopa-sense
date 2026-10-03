import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';

import { GeckoDetailView } from '@/components/gecko-detail-view';
import { useGecko, useRemoveGecko } from '@/lib/hooks/use-geckos';

export default function GeckoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isPending, isError } = useGecko(id ?? '');
  const removeGecko = useRemoveGecko();

  const geckoId = data?.id;

  function confirmDelete(targetId: string) {
    Alert.alert('削除しますか？', 'この個体を削除します。元に戻せません。', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await removeGecko.mutateAsync(targetId);
          router.back();
        },
      },
    ]);
  }

  return (
    <GeckoDetailView
      isLoading={isPending}
      isError={isError}
      gecko={data}
      onRecordFeeding={
        geckoId
          ? () => router.push({ pathname: '/feedings/new', params: { geckoId } })
          : undefined
      }
      onEdit={
        geckoId
          ? () => router.push({ pathname: '/geckos/edit/[id]', params: { id: geckoId } })
          : undefined
      }
      onDelete={geckoId ? () => confirmDelete(geckoId) : undefined}
    />
  );
}
