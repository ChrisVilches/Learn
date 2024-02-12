import { Await, Link, Outlet, useLoaderData } from 'react-router-dom'
import { LuUser2 } from 'react-icons/lu'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { Tooltip } from '../tooltip'
import React from 'react'
import { Spinner } from '../loaders/spinner'
import { ThemeToggle } from '../theme-toggle'
import { LogoLink } from '../logo-link'

function AuthLayoutSuspense (): JSX.Element {
  return (
    <div className="flex justify-center">
      <Spinner/>
    </div>
  )
}

export function AuthLayout (): JSX.Element {
  const data = useLoaderData() as { user: Promise<{ username: string }> }

  return (
    <React.Suspense fallback={<AuthLayoutSuspense/>}>
      <Await resolve={data?.user}>
        {({ username }) => (
          <div className="mx-10 my-6 lg:max-w-5xl lg:mx-auto">
            <nav className="flex mb-10">
              <LogoLink to='/'/>
              <div className="flex items-center space-x-4 grow justify-end">
                <span>{username}</span>
                <LuUser2 />
                <Tooltip label="Log out">
                  {(props) => (
                    <Link
                      {...props}
                      className="bg-violet-800 text-white dark:bg-black dark:text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-4 rounded-md transition-colors"
                      to='/logout'
                    >
                      <RiLogoutBoxRLine />
                    </Link>
                  )}
                </Tooltip>
                <div>
                  <ThemeToggle/>
                </div>
              </div>
            </nav>
            <main>
              <Outlet/>
            </main>
          </div>
        )}
      </Await>
    </React.Suspense>
  )
}
