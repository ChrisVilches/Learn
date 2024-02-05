import { type LoaderFunctionArgs, redirect, defer } from 'react-router-dom'
import { isAccessTokenSet, removeAccessToken } from './auth'
import { getUserProfile } from '../api-client/user'

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

export function authLayoutLoader (): unknown {
  if (!isAccessTokenSet()) {
    // TODO: This has to be returned (a promise that never resolves)
    //       because the layout dynamically select the auth layout or normal layout.
    //       And when it chooses the auth layout, sometimes this result is used.
    //       Not sure if this creates a memory leak.
    return defer({ user: new Promise(() => {}) })
  }

  return defer({ user: getUserProfile() })
}

export function logoutLoader (): Response {
  removeAccessToken()
  return redirect('/login')
}
