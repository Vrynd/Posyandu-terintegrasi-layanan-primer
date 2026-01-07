
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from './presentation/routes/router'
import { AuthProvider } from './presentation/hooks/useAuth'
import { DataCacheProvider } from '@/presentation/contexts/RealtimeDataContext'
import { queryClient } from './data/core/queryClient'
import { Toaster } from 'react-hot-toast'

import './index.css'

// Expose database and cache utilities to window for easy console access
declare global {
  interface Window {
    posyanduDB: {
      clearAll: () => Promise<void>;
      getStats: () => Promise<{ peserta: number; kunjungan: number; activities: number }>;
      clearCache: () => void;
      getCacheInfo: () => { used: string; keys: string[] };
    };
  }
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataCacheProvider>
          <Toaster position="top-right" />
          <RouterProvider router={router} />
        </DataCacheProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
