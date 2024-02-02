import { createBrowserRouter } from 'react-router-dom'
import { GlobalError } from './components/errors/global-error'
import { CategoriesPage } from './pages/categories'
import { CategoryPage } from './pages/category'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { loginLoader, authProtectedLoader, logoutLoader } from './util/routing'
import { NotFoundPage } from './pages/not-found'
import { Layout } from './components/layouts/layout'

const protectedRoutes = [
  { path: '/', Component: HomePage },
  { path: '/categories', Component: CategoriesPage },
  { path: '/category/:slug/solve', Component: CategoryPage }
]

const routes = [
  { path: '/login', loader: loginLoader, Component: LoginPage },
  { path: '/logout', loader: logoutLoader },
  { loader: authProtectedLoader, children: protectedRoutes },
  { path: '*', Component: NotFoundPage }
]

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        ErrorBoundary: GlobalError,
        children: routes
      }
    ]
  }
])
