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
      <div className="m-10 lg:max-w-5xl lg:mx-auto">
        <main>
          <Outlet/>
        </main>
      </div>
    )
  }
}
