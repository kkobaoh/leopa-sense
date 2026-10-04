import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { createQueryClient } from '@/lib/query-client';
import { RepositoryProvider } from '@/lib/repository';
import { SessionProvider } from '@/lib/session';
import { navigationTheme, useColorSchemeName } from '@/lib/theme';

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);
  const scheme = useColorSchemeName();

  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryProvider>
        <SessionProvider>
          {/* ヘッダー・タブ・画面背景をアプリのパレットに合わせる */}
          <ThemeProvider value={navigationTheme(scheme)}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="pets/new" options={{ title: '個体を登録' }} />
              <Stack.Screen name="pets/[id]" options={{ title: '個体の詳細' }} />
              <Stack.Screen name="pets/edit/[id]" options={{ title: '個体を編集' }} />
              <Stack.Screen
                name="feedings/new"
                options={{ title: '餌やりを記録', presentation: 'modal' }}
              />
            </Stack>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </SessionProvider>
      </RepositoryProvider>
    </QueryClientProvider>
  );
}
