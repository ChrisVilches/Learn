import { Outlet } from 'react-router-dom'
import { AuthLayout } from './auth-layout'
import { isAccessTokenSetSignal } from '../../util/auth'
import { useSignals } from '@preact/signals-react/runtime'
import { LuUser2 } from 'react-icons/lu'
import { ThemeToggle } from '../theme-toggle'
import { LogoLink } from '../logo-link'

export function Layout (): JSX.Element {
  useSignals()

  if (isAccessTokenSetSignal.value) {
    return <AuthLayout/>
  } else {
    return (
      <div className="mx-10 my-6 lg:max-w-5xl lg:mx-auto">
        <nav className="flex mb-10">
          <LogoLink to='/'/>
          <div className="flex items-center space-x-4 grow justify-end">
            <span><i>Guest</i></span>
            <LuUser2 />
            <div>
              <ThemeToggle/>
            </div>
          </div>
        </nav>
        <main>
          <Outlet/>
        </main>
      </div>
    )
  }
}
