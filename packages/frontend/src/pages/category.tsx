import { useParams } from 'react-router-dom'
import { ProblemGeneratorsConfiguration } from '../components/problem-generators-configuration'
import { ProblemSolve } from '../components/problem-solve'
import { CategoryInformation } from '../components/category-information'
import { useState } from 'react'
import { isArray, isUndefined } from 'lodash'
import { Slider } from '@mui/base/Slider'
import { fetchCategory } from '../api-client/category'
import { useQuery } from 'react-query'

export const CategoryPage = (): JSX.Element => {
  const { slug = '' } = useParams()

  const [difficulty, setDifficulty] = useState(10)

  const { isLoading, isError, data: category } = useQuery(
    [fetchCategory.name, slug],
    async () => await fetchCategory(slug)
  )

  if (isLoading) {
    return <div>Loading category data...</div>
  }

  if (isError || isUndefined(category)) {
    // TODO: Handle later. How can I handle all these globally?
    throw new Error('Unhandled error')
  }

  return (
    <>
      <div>
        <CategoryInformation
          name={category.name}
          description={category.description}
          slug={slug}
          className='mb-10'/>
      </div>
      <div>
        Difficulty:
        <Slider
          min={1}
          max={100}
          onChange={(_ev, value) => { setDifficulty(isArray(value) ? value[0] : value) }}
          value={difficulty}
          slotProps={{
            root: { className: 'w-full relative inline-block h-2 cursor-pointer' },
            rail: { className: 'bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full block absolute' },
            track: { className: 'bg-slate-500 dark:bg-slate-400 h-2 absolute rounded-full' },
            thumb: { className: 'ring-slate-500 dark:ring-slate-400 ring-2 w-4 h-4 -mt-1 -ml-2 flex items-center justify-center bg-white rounded-full shadow absolute' }
          }}
        />
      </div>
      <div>
        <ProblemGeneratorsConfiguration slug={slug ?? ''}/>
      </div>

      {/* TODO: This component also fetches (generates) a new problem, so rename accordingly (so it
        explains the responsabilities this component has in detail) */}
      <ProblemSolve slug={slug} difficulty={difficulty}/>
    </>
  )
}
