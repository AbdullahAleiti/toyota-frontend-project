import './App.css'

import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'

// Create a new router instance
const queryClient = new QueryClient()

const router = createRouter({ 
  routeTree , 
  context:{queryClient,},
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  )
}

export default App
