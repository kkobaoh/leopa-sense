import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GeckoForm } from '@/components/gecko-form';
import { useGecko, useUpdateGecko } from '@/lib/hooks/use-geckos';

export default function EditGeckoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: gecko, isPending } = useGecko(id ?? '');
  const updateGecko = useUpdateGecko();

  if (isPending) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#F0B65A" />
      </View>
    );
  }

  if (!gecko) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>個体が見つかりません</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14161A',
  },
  notFound: { color: '#F5F5F5', fontSize: 16, fontWeight: '700' },
  container: { flex: 1, backgroundColor: '#14161A' },
  content: { paddingBottom: 24 },
});
