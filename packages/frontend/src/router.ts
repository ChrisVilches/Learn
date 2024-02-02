import { Outlet, createBrowserRouter } from 'react-router-dom'
import { GlobalError } from './components/errors/global-error'
import { AuthLayout } from './components/layouts/auth-layout'
import { CategoriesPage } from './pages/categories'
import { CategoryPage } from './pages/category'
import { HomePage } from './pages/home'
import { LoginPage } from './pages/login'
import { loginLoader, authProtectedLoader, logoutLoader } from './util/routing'
import { isAccessTokenSet } from './util/auth'
import { NotFoundPage } from './pages/not-found'

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
    // TODO: This is wrong... I think the router is executed once at boot time,
    //       so this doesn't change if the user logs out.
    //       How to reproduce: Open a page that shows "log-out" button. Then click
    //       and see how the login page also has the "log-out" button (it shouldn't).
    //       Maybe create a component
    //       That wraps the layout, and update it with a signal or some bullshit.
    //       I don't know if I can use context or useState, etc from here.
    Component: isAccessTokenSet() ? AuthLayout : Outlet,
    children: [
      {
        ErrorBoundary: GlobalError,
        children: routes
      }
    ]
  }
])
