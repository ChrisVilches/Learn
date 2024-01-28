import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { HomePage } from './pages/home.tsx'
import { CategoriesPage } from './pages/categories.tsx'
import { CategoryPage } from './pages/category.tsx'
import { MathJaxContext } from 'better-react-mathjax'

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

// TODO: A way to protect routes. Seems simple but it might be enough.
//       Other corner cases include (not sure if the article handles them):
//         * Token expires and user does a API query
//         * Token is set, but user may not exist (should user be fetched every time?)
//         * Etc. Anyway, we can just put an error boundary for the worst case.
// https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage/>
  },
  {
    path: '/categories',
    element: <CategoriesPage/>
  },
  {
    path: '/category/:slug/solve',
    element: <CategoryPage/>
  }
])

ReactDOM.createRoot(getRootElement()).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MathJaxContext>
        <RouterProvider router={router} />
      </MathJaxContext>
    </QueryClientProvider>
  </React.StrictMode>
)
