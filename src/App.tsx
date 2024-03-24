import './App.css'

import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'

// Create a new router instance
const queryClient = new QueryClient()

const theme = createTheme({
  components:{
    MuiButton:{
      styleOverrides:{
        root:{
          paddingTop:"20px",
          paddingBottom:"20px",
        }
      }
    }
  }
})

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
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
