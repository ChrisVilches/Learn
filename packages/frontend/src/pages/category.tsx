import { useParams } from 'react-router-dom'
import { ProblemGeneratorsConfiguration } from '../components/problem-generators-configuration'
import { CategoryInformation } from '../components/category-information'
import { useCallback, useState } from 'react'
import { isArray, isUndefined } from 'lodash'
import { Slider } from '@mui/base/Slider'
import { fetchCategory, saveDifficultyPreference } from '../api-client/category'
import { useQuery } from 'react-query'
import { delayExecutionOnlyLast } from '../util/delay'
import ConfettiExplosion from 'react-confetti-explosion'
import { ProblemSolver } from '../components/problem-solver'

interface DifficultyUpdate {
  slug: string
  difficulty: number
}
const { pending$, buffered$ } = delayExecutionOnlyLast(
  2000,
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  ({ slug, difficulty }: DifficultyUpdate) => saveDifficultyPreference(difficulty, slug))

buffered$.subscribe()

const getValue = (value: number | number[]): number => isArray(value) ? value[0] : value

const slotProps = {
  root: { className: 'w-full relative inline-block h-2 cursor-pointer' },
  rail: { className: 'bg-slate-100 dark:bg-slate-700 h-2 w-full rounded-full block absolute' },
  track: { className: 'bg-slate-500 dark:bg-slate-400 h-2 absolute rounded-full' },
  thumb: { className: 'ring-slate-500 dark:ring-slate-400 ring-2 w-4 h-4 -mt-1 -ml-2 flex items-center justify-center bg-white rounded-full shadow absolute' }
}

export const CategoryPage = (): JSX.Element => {
  const { slug = '' } = useParams()

  const [difficulty, setDifficulty] = useState<number | undefined>()

  const { isLoading, isError, data: category } = useQuery(
    [fetchCategory.name, slug],
    async () => await fetchCategory(slug),
    {
      onSuccess: (category) => {
        setDifficulty(category.preferences.difficulty)
      }
    }
  )

  const onChangeDifficulty = useCallback((_ev: unknown, value: number | number[]): void => {
    setDifficulty(getValue(value))
  }, [])

  const onChangeCommittedDifficulty = useCallback((_ev: unknown, value: number | number[]): void => {
    pending$.next({ slug, difficulty: getValue(value) })
  }, [slug])

  const [isExploding, setIsExploding] = useState(false)

  const onProblemAccepted = useCallback(() => {
    setIsExploding(true)
  }, [])

  if (isLoading || isUndefined(difficulty)) {
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
          onChange={onChangeDifficulty}
          onChangeCommitted={onChangeCommittedDifficulty}
          value={difficulty}
          slotProps={slotProps}
        />
      </div>
      <div>
        <ProblemGeneratorsConfiguration slug={slug ?? ''}/>
      </div>

      {isExploding && <ConfettiExplosion onComplete={() => { setIsExploding(false) }} duration={2500} force={0.8} particleCount={70} particleSize={6}/>}

      <ProblemSolver onProblemAccepted={onProblemAccepted} slug={slug} difficulty={difficulty}/>
    </>
  )
}
