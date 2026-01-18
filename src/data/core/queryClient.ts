// Konfigurasi React Query
// Setup query client terpusat dengan konfigurasi optimal

import { QueryClient } from '@tanstack/react-query';
import {
    DEFAULT_STALE_TIME,
    DEFAULT_GC_TIME,
    DEFAULT_QUERY_RETRY,
    DEFAULT_MUTATION_RETRY,
} from './constants';

// Re-export query keys untuk backward compatibility
export { queryKeys } from './queryKeys';

// Buat query client dengan konfigurasi optimal
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data dianggap fresh selama waktu yang ditentukan
            staleTime: DEFAULT_STALE_TIME,
            // Cache dihapus setelah waktu yang ditentukan jika tidak dipakai
            gcTime: DEFAULT_GC_TIME,
            // Retry dengan exponential backoff
            retry: DEFAULT_QUERY_RETRY,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Jangan refetch otomatis saat focus window
            refetchOnWindowFocus: false,
            // Jangan refetch saat reconnect
            refetchOnReconnect: false,
        },
        mutations: {
            // Retry untuk mutations
            retry: DEFAULT_MUTATION_RETRY,
        },
    },
});
