import { useQuery } from 'react-query'
import { fetchCategories } from '../api-client/category'
import { Link } from 'react-router-dom'
import { TbMathIntegralX, TbMathPi, TbVector } from 'react-icons/tb'
import { Spinner } from './loaders/spinner'
import { TextSkeleton } from './loaders/text-skeleton'
import { type ComponentType } from 'react'
import { isUndefined } from 'lodash'

const iconMapping: Record<string, ComponentType> = {
  calculus: TbMathIntegralX,
  algebra: TbMathPi,
  linalg: TbVector
}

function getIconForCategory (slug: string): JSX.Element {
  const Icon = iconMapping[slug]
  if (isUndefined(Icon)) {
    throw new Error('Icon not found')
  }

  return <Icon/>
}

const CategoryListSkeleton = (): JSX.Element => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
    {[0, 1, 2].map((idx) => (
      <div key={idx} className="p-4 bg-violet-900 text-gray-300 rounded-xl">
        <div className="font-bold text-xl mb-6"><Spinner /></div>
        <div className="flex space-x-8">
          <div>
            <div className="bg-gray-800 rounded-lg w-12 h-12"></div>
          </div>
          <TextSkeleton lines={6} variant="small" />
        </div>
      </div>
    ))}
  </div>
)

export const CategoryList = (): JSX.Element => {
  const { isLoading, data } = useQuery(fetchCategories.name, fetchCategories)

  if (isLoading) {
    return <CategoryListSkeleton/>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data?.map(({ id, slug, name, description }) => (
        <Link key={id} className="p-4 bg-violet-900 text-gray-300 rounded-xl" to={`/category/${slug}/solve`}>
          <p className="font-bold text-xl mb-6">{name}</p>
          <div className="flex space-x-8">
            <div>
              <div className="bg-gray-800 rounded-lg w-12 h-12 flex items-center justify-center">
                {getIconForCategory(slug)}
              </div>
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
