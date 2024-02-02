import { type LoaderFunctionArgs, redirect } from 'react-router-dom'
import { isAccessTokenSet, removeAccessToken } from './auth'

export const loginLoader = (): Response | null => {
  if (isAccessTokenSet()) {
    return redirect('/')
  }
  return null
}

export function authProtectedLoader (_args: LoaderFunctionArgs): Response | null {
  if (!isAccessTokenSet()) {
    return redirect('login?auth_error')
  }

  return null
}

export function logoutLoader (): Response | null {
  removeAccessToken()
  return redirect('/login')
}
