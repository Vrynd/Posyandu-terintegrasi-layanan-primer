
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from './presentation/routes/router'
import { AuthProvider } from './presentation/hooks/useAuth'
import { queryClient } from './data/core/queryClient'
import { Toaster } from 'react-hot-toast'

import './index.css'

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
