import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from 'react-query'
import { loginService } from '../api-client/login'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  email: z.string().email()
})

type FormData = z.infer<typeof formSchema>

export function Login (): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const navigate = useNavigate()

  const { mutateAsync } = useMutation(
    loginService,
    {
      onSuccess: ({ accessToken }) => {
        localStorage.setItem('accessToken', accessToken)
        navigate('/categories')
        console.log('Does this work')
      }
    }
  )

  const onSubmit = async (data: FormData): Promise<void> => {
    await mutateAsync(data.email)
  }

  return (
    <div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('email')} />
        <p>{errors.email?.message}</p>

        <button type="submit">
          {isSubmitting ? 'Loading...' : 'Submit'}
        </button>
      </form>

    </div>
  )
}
