import Cookies from 'js-cookie'

export function removeAccessToken (): void {
  Cookies.set('accessToken', '')
}

export function isAccessTokenSet (): boolean {
  const accessToken = Cookies.get('accessToken') ?? ''
  return accessToken.length > 0
}
