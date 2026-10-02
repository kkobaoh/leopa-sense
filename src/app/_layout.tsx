import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useState } from 'react';

import { createQueryClient } from '@/lib/query-client';
import { RepositoryProvider } from '@/lib/repository';
import { SessionProvider } from '@/lib/session';

export default function RootLayout() {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryProvider>
        <SessionProvider>
          <Stack />
        </SessionProvider>
      </RepositoryProvider>
    </QueryClientProvider>
  );
}
