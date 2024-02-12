import { GiBrain } from 'react-icons/gi'
import { Link } from 'react-router-dom'

interface LogoLinkProps {
  to: string
}

export function LogoLink ({ to }: LogoLinkProps): JSX.Element {
  return (
    <Link className="flex space-x-4 items-center p-4 rounded-md hover:text-yellow-500 dark:hover:text-yellow-300 transition-colors duration-500" to={to}>
      <GiBrain className="w-8 h-8"/>
      <b>Learn</b>
    </Link>
  )
}
