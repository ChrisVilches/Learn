import { Helmet } from 'react-helmet'
import { Login } from '../components/login-form'
import { getFullTitle } from '../util/dom'

export const LoginPage = (): JSX.Element => (
  <>
    <Helmet>
      <title>{getFullTitle()}</title>
    </Helmet>
    <Login/>
  </>
)
