import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { FeedingForm } from '@/components/feeding-form';
import { useCreateFeeding, useLatestFeeding } from '@/lib/hooks/use-feedings';

export default function NewFeedingScreen() {
  const { geckoId } = useLocalSearchParams<{ geckoId: string }>();
  const router = useRouter();
  const createFeeding = useCreateFeeding();
  const latest = useLatestFeeding(geckoId ?? '');

  // 前回の内容を初期値にするため、最新記録のロードを待ってからフォームを出す
  if (latest.isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#F0B65A" />
      </View>
    );
  }

  const last = latest.data;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#14161A' },
  container: { flex: 1, backgroundColor: '#14161A' },
  content: { paddingBottom: 24 },
});
