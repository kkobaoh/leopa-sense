import { Link, Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#14161A' },
        headerTintColor: '#F5F5F5',
        tabBarStyle: { backgroundColor: '#1E2127', borderTopColor: '#2A2E35' },
        tabBarActiveTintColor: '#F0B65A',
        tabBarInactiveTintColor: '#8A8F98',
      }}>
      <Tabs.Screen name="index" options={{ title: 'ホーム' }} />
      <Tabs.Screen
        name="geckos"
        options={{
          title: '個体',
          headerRight: () => (
            <Link href="/geckos/new" style={styles.addButton}>
              追加
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="logs" options={{ title: '記録' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    color: '#F0B65A',
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: 16,
  },
});
