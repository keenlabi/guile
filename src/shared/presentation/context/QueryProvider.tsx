import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  // Ensure QueryClient is created once per app lifecycle
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Global defaults
        staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
        retry: 1, // Retry failed requests once
        refetchOnWindowFocus: false, // Prevent refetching when clicking back to tab (optional)
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}