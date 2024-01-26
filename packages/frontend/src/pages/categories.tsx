import { useQuery } from 'react-query'
import { fetchCategories } from '../api-client/category'
import { CategoryItem } from '../components/category-item'

// TODO: Login guards are missing.

export const CategoriesPage = (): JSX.Element => {
  const { isLoading, isError, data } = useQuery(fetchCategories.name, fetchCategories)

  if (isLoading) {
    return <span>Loading categories...</span>
  }

  if (isError) {
    throw new Error('Handle later')
  }

  return (
    <div>
      {data?.map(category => <CategoryItem key={category.id} {...category}/>)}
    </div>
  )
}
