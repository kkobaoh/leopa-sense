import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { GeckoForm } from '@/components/gecko-form';
import { useCreateGecko } from '@/lib/hooks/use-geckos';

export default function NewGeckoScreen() {
  const router = useRouter();
  const createGecko = useCreateGecko();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <GeckoForm
        submitLabel="登録"
        onSubmit={async (values) => {
          await createGecko.mutateAsync(values);
          router.back();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#14161A' },
  content: { paddingBottom: 24 },
});
