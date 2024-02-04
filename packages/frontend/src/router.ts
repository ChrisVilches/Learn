import { createBrowserRouter } from 'react-router-dom'
import { GlobalError } from './components/errors/global-error'
import { CategoryPage } from './pages/category'
import { LoginPage } from './pages/login'
import { loginLoader, authProtectedLoader, logoutLoader } from './util/routing'
import { NotFoundPage } from './pages/not-found'
import { Layout } from './components/layouts/layout'
import { HomePage } from './pages/home'

const protectedRoutes = [
  { path: '/', Component: HomePage },
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
