import axios from 'axios'
import { z } from 'zod'

const loginServiceResultSchema = z.object({
  accessToken: z.string()
})

export async function loginService (email: string): Promise<z.infer<typeof loginServiceResultSchema>> {
  const result = await axios.post('http://localhost:3000/login', {
    email
  })

  return loginServiceResultSchema.parse(result.data)
}
