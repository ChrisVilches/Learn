import axios, { type AxiosRequestTransformer } from 'axios'
import Cookies from 'js-cookie'
import { z } from 'zod'
import { removeAccessToken } from '../util/auth'

export const httpClientAuth = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  transformRequest: [
    ...axios.defaults.transformRequest as AxiosRequestTransformer[],
    function (data, headers) {
      // TODO: Do this more safely (don't use localstorage/cookies).
      const accessToken = Cookies.get('accessToken')
      headers.Authorization = `Bearer ${accessToken}`
      return data
    }
  ]
})

httpClientAuth.interceptors.response.use((response) => response, (error) => {
  if (error.response.status === 401) {
    // TODO: Here we should check if the error happened because the user called
    //       an API that's beyond their permissions scope, or because the user has
    //       logged-out completely.
    //       The former case shouldn't redirect to the login page. Only the second
    //       case should.
    //       Perhaps from the server we can return 401 Unauthorized or 403 Forbidden for these
    //       two different cases, and handle them here accordingly.
    //       The redirection would be:
    //       401 -> redirect to login (the user is still logged in).
    //       403 -> don't redirect, just show error message.
    //       https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses

    // TODO: Possible error: It redirects to /login, but /login detects token is set,
    //       therefore it redirects to / (user home), but user home performs some query
    //       (at this moment I haven't done any query) and it errors and redirects again
    //       to login.
    //       How to solve: Remove access token here before redirecting to /login.
    removeAccessToken()
    window.location.assign('/login?auth_error')
  }

  throw error
})

export const apiErrorSchema = z.object({
  response: z.object({
    data: z.object({
      message: z.string()
    })
  })
}).transform(obj => obj.response.data)
