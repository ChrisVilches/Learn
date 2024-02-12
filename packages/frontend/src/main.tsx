import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'
import { MathJaxContext } from 'better-react-mathjax'
import { router } from './router.ts'

function getRootElement (): HTMLElement {
  const result = document.getElementById('root')
  if (result === null) throw new Error('No root element')
  return result
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(getRootElement()).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MathJaxContext>
        <RouterProvider router={router} />
      </MathJaxContext>
    </QueryClientProvider>
  </React.StrictMode>
)
