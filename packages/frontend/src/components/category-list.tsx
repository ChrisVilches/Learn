import { useQuery } from 'react-query'
import { fetchCategories } from '../api-client/category'
import { Link } from 'react-router-dom'
import { TbMathIntegralX, TbMathPi, TbVector } from 'react-icons/tb'
import { SiKnowledgebase } from 'react-icons/si'
import { Spinner } from './loaders/spinner'

// TODO: Just a temporary heuristic. Category icons aren't implemented for now.
function guessIcon (slug: string): JSX.Element {
  if (slug === 'calculus') return <TbMathIntegralX/>
  if (slug === 'algebra') return <TbMathPi/>
  if (slug === 'linalg') return <TbVector/>

  return <SiKnowledgebase/>
}

export const CategoryList = (): JSX.Element => {
  const { isLoading, isError, data } = useQuery(fetchCategories.name, fetchCategories)

  if (isLoading) {
    return (
      // TODO: Create skeleton for this.
      <div className="flex justify-center">
        <Spinner/>
      </div>
    )
  }

  if (isError) {
    throw new Error('TODO: Handle later')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data?.map(({ id, slug, name, description }) => (
        <Link key={id} className="p-4 bg-violet-900 text-gray-300 rounded-xl" to={`/category/${slug}/solve`}>
          <p className="font-bold text-xl mb-6">{name}</p>
          <div className="flex space-x-8">
            <div className="p-4 bg-gray-800 rounded-lg">
              {guessIcon(slug)}
            </div>
            <div className="max-h-52">
              <p className="text-sm line-clamp-5">{description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
