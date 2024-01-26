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

const queryClient = new QueryClient()

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
