import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from 'react-query'
import { loginService } from '../api-client/login'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { setAccessToken } from '../util/auth'
import { ButtonPrimary } from './buttons'
import { toastError } from '../util/toast'

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
    formState: { isSubmitting, errors, isValid }
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      username: 'DefaultDummy',
      password: 'pass'
    },
    resolver: zodResolver(formSchema)
  })

  const [searchParams] = useSearchParams()
  const authError = searchParams.has('auth_error')

  useEffect(() => {
    if (authError) {
      toastError('Please login')
    }
  }, [authError])

  const navigate = useNavigate()

  const { mutateAsync } = useMutation(
    async ({ username, password }: { username: string, password: string }) => await loginService(username, password),
    {
      onSuccess: ({ accessToken }) => {
        setAccessToken(accessToken)
        navigate('/')
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

  const isSubmitDisabled = isSubmitting || !isValid

  return (
    <>
      <Toaster/>

      <div className='bg-slate-700 p-5 rounded-md mb-10'>
        <p className='text-lg font-bold mb-4'>Hint</p>
        Login with the default form values.
      </div>
      <div className="flex items-center justify-center">
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

          <ButtonPrimary type="submit" disabled={isSubmitDisabled}>
            {isSubmitting ? 'Wait...' : 'Login'}
          </ButtonPrimary>
        </form>
      </div>
    </>
  )
}
