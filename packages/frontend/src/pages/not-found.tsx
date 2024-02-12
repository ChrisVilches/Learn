import { Helmet } from 'react-helmet'
import { getFullTitle } from '../util/dom'

export function NotFoundPage (): JSX.Element {
  return (
    <>
      <Helmet>
        <title>{getFullTitle('Not found')}</title>
      </Helmet>
      404 Not found
    </>
  )
}
