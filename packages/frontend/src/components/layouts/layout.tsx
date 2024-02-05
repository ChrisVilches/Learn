import { Outlet } from 'react-router-dom'
import { AuthLayout } from './auth-layout'
import { isAccessTokenSetSignal } from '../../util/auth'
import { useSignals } from '@preact/signals-react/runtime'

export function Layout (): JSX.Element {
  useSignals()

  if (isAccessTokenSetSignal.value) {
    return <AuthLayout/>
  } else {
    return (
      <main>
        <Outlet/>
      </main>
    )
  }
}
