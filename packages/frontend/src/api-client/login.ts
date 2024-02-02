import axios, { AxiosError } from 'axios'
import { z } from 'zod'

const loginServiceResultSchema = z.object({
  accessToken: z.string()
})

type LoginServiceResult = z.infer<typeof loginServiceResultSchema>

export async function loginService (username: string, password: string): Promise<LoginServiceResult> {
  try {
    const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
      username,
      password
    })

    return loginServiceResultSchema.parse(result.data)
  } catch (e: unknown) {
    if (e instanceof AxiosError && e.response?.status === 401) {
      throw new Error('Incorrect username or password')
    }

    throw new Error('There was an error')
  }
}
