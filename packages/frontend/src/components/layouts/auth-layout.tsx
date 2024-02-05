import { Link, Outlet } from 'react-router-dom'
import { getUserProfile } from '../../api-client/user'
import { useQuery } from 'react-query'
import { LuUser2 } from 'react-icons/lu'
import { RiLogoutBoxRLine, RiHome2Line } from 'react-icons/ri'

export function AuthLayout (): JSX.Element {
  const { isLoading, isError, error, data } = useQuery(
    [getUserProfile.name],
    async () => await getUserProfile()
  )

  if (isError) {
    // TODO: Handle later
    console.error(error)
  }

  // TODO: add tooltip to logout button
  return (
    <div className="m-10 lg:max-w-5xl lg:mx-auto">
      <nav className="flex mb-10">
        <div className="flex grow">
          <Link className="bg-black text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-4 rounded-md transition-colors" to='/'><RiHome2Line /></Link>
        </div>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="mr-2">
              {isLoading ? 'User' : data?.username}
            </span>
            <LuUser2 />
          </div>
          <div className="flex">
            <Link className="bg-black text-violet-800 hover:text-violet-200 duration-100 hover:bg-violet-950 p-4 rounded-md transition-colors" to='/logout'><RiLogoutBoxRLine /></Link>
          </div>
        </div>
      </nav>
      <main>
        <Outlet/>
      </main>
    </div>
  )
}
