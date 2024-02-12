import { Helmet } from 'react-helmet'
import { getFullTitle } from '../../util/dom'

interface CategoryErrorProps {
  slug: string
}

export function CategoryError ({ slug }: CategoryErrorProps): JSX.Element {
  return (
    <div>
      <Helmet>
        <title>{getFullTitle('Category not found')}</title>
      </Helmet>

      <h1 className="text-2xl font-bold mb-8">Category not found!</h1>
      Category <b>{slug}</b> couldn&apos;t be found!
    </div>
  )
}
