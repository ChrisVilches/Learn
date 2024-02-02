import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from 'react-query'
import { loginService } from '../api-client/login'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import Cookies from 'js-cookie'
import toast, { Toaster } from 'react-hot-toast'
import { setAccessToken } from '../util/auth'

const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' })
})

type FormData = z.infer<typeof formSchema>

export function Login (): JSX.Element {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const [searchParams] = useSearchParams()
  const authError = searchParams.has('auth_error')

  useEffect(() => {
    if (authError) {
      toast.error('Please login')
    }
  }, [authError])

  const navigate = useNavigate()

  const { mutateAsync } = useMutation(
    async ({ username, password }: { username: string, password: string }) => await loginService(username, password),
    {
      onSuccess: ({ accessToken }) => {
        setAccessToken(accessToken)
        navigate('/categories')
      }
    }
  )

  const submit = useCallback(async (data: FormData) => {
    try {
      await mutateAsync(data)
    } catch (e: unknown) {
      setError('root', {
        message: (e as Error).message
      })
    }
  }, [mutateAsync, setError])

  return (
    <div>
      <Toaster/>

      <div className='bg-slate-700 p-5 rounded-md mb-10'>
        <p className='text-lg font-bold mb-4'>Hint</p>
        Login using <span className='bg-slate-300 text-slate-600 p-1 rounded-md mx-2'>DefaultDummy</span>
        with password <span className='bg-slate-300 text-slate-600 p-1 rounded-md mx-2'>pass</span>.
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(submit)}>
        <div className='mb-4'>
          <input {...register('username')} name='username' className='block p-2 rounded-md'/>
          <p className='text-red-500 text-sm'>{errors.username?.message}</p>
        </div>

        <div className='mb-4'>
          <input {...register('password')} type='password' name='password' className='block p-2 rounded-md'/>
          <p className='text-red-500 text-sm'>{errors.password?.message}</p>
        </div>

        <p className='bg-red-500 rounded-md p-5 empty:hidden'>{errors.root?.message}</p>

        <button type="submit">
          {isSubmitting ? 'Loading...' : 'Login'}
        </button>
      </form>

    </div>
  )
}
