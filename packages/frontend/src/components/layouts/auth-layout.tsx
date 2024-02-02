import { Link, Outlet } from 'react-router-dom'

export function AuthLayout (): JSX.Element {
  return (
    <>
      <Link to='/logout'>Log-out</Link>
      <Outlet/>
    </>
  )
}
