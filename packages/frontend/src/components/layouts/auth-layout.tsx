import { Await, Link, Outlet, useLoaderData } from 'react-router-dom'
import { LuUser2 } from 'react-icons/lu'
import { RiLogoutBoxRLine, RiHome2Line } from 'react-icons/ri'
import { Tooltip } from '../tooltip'
import React from 'react'
import { Spinner } from '../loaders/spinner'

function AuthLayoutSuspense (): JSX.Element {
  return (
    // TODO: Maybe show skeleton of navbar?
    <div className="flex justify-center">
      <Spinner/>
    </div>
  )
}

export function AuthLayout (): JSX.Element {
  const data = useLoaderData() as { user: Promise<{ username: string }> }

  // TODO: Does this render props make things slow??
  //       It's the solution explained here:
  //       https://reactrouter.com/en/main/guides/deferred

  return (
    <React.Suspense fallback={<AuthLayoutSuspense/>}>
      <Await resolve={data?.user}>
        {({ username }) => (
          <div className="m-10 lg:max-w-5xl lg:mx-auto">
            <nav className="flex mb-10">
              <div className="flex grow">
                <Link className="bg-black text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-4 rounded-md transition-colors" to='/'><RiHome2Line /></Link>
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <span className="mr-2">{username}</span>
                  <LuUser2 />
                </div>
                <div className="flex">
                  <Tooltip label="Log out">
                    {(props) => (
                      <Link
                        {...props}
                        className="bg-black text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-4 rounded-md transition-colors"
                        to='/logout'
                      >
                        <RiLogoutBoxRLine />
                      </Link>
                    )}
                  </Tooltip>
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
