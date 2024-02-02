import { signal } from '@preact/signals-react'
import Cookies from 'js-cookie'
import { isEmpty } from 'lodash'

export const isAccessTokenSetSignal = signal(!isEmpty(Cookies.get('accessToken')))

export function setAccessToken (accessToken: string): void {
  isAccessTokenSetSignal.value = !isEmpty(accessToken)
  Cookies.set('accessToken', accessToken)
}

export function removeAccessToken (): void {
  isAccessTokenSetSignal.value = false
  Cookies.set('accessToken', '')
}

export function isAccessTokenSet (): boolean {
  return isAccessTokenSetSignal.value
}
