import { Helmet } from 'react-helmet'
import { getFullTitle } from '../../util/dom'

export function UnexpectedError (): JSX.Element {
  return (
    <>
      <Helmet>
        <title>{getFullTitle('Unexpected error')}</title>
      </Helmet>

      <h1>Uh oh, something went terribly wrong 😩</h1>
    </>
  )
}
