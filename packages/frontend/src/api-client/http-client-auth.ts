import axios, { type AxiosRequestTransformer } from 'axios'
import { z } from 'zod'

export const httpClientAuth = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
  transformRequest: [
    ...axios.defaults.transformRequest as AxiosRequestTransformer[],
    function (data, headers) {
      // TODO: do this more safely (don't use localstorage)
      const accessToken = localStorage.getItem('accessToken')
      headers.Authorization = `Bearer ${accessToken}`
      return data
    }
  ]
})

export const apiErrorSchema = z.object({
  response: z.object({
    data: z.object({
      message: z.string()
    })
  })
}).transform(obj => obj.response.data)