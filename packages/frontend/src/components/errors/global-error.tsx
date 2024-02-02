import { useRouteError } from 'react-router-dom'
import { CategoryError } from './category-error'
import { CategoryNotFoundError } from '../../errors'
import { UnexpectedError } from './unexpected-error'

export function GlobalError (): JSX.Element {
  const error = useRouteError()

  if (error instanceof CategoryNotFoundError) {
    return <CategoryError slug={error.categorySlug}/>
  }

  return <UnexpectedError/>
}
