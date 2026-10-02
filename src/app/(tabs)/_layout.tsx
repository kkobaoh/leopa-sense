import { Tabs } from 'expo-router';

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
      <Tabs.Screen name="geckos" options={{ title: '個体' }} />
    </Tabs>
  );
}
