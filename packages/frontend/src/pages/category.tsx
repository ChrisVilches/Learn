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
import { CategoryNotFoundError } from '../errors'
import toast, { Toaster } from 'react-hot-toast'
import { DifficultyText } from '../components/difficulty-text'
import { Spinner } from '../components/loaders/spinner'

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
      },
      retry: false
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
    toast.success('Correct answer!')
    setIsExploding(true)
  }, [])

  if (isError) {
    throw new CategoryNotFoundError(slug)
  }

  if (isLoading || isUndefined(difficulty) || isUndefined(category)) {
    return (
      <div className="flex justify-center">
        <Spinner/>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-6 bg-gray-900 p-4 rounded-lg">
          <CategoryInformation
            name={category.name}
            description={category.description}
            slug={slug}
            className='mb-10'/>
        </div>

        <div className="col-span-4 bg-gray-900 p-4 rounded-lg">
          <DifficultyText className="mb-6 float-end" difficulty={difficulty}/>
          <Slider
            className="mb-8"
            min={1}
            max={100}
            onChange={onChangeDifficulty}
            onChangeCommitted={onChangeCommittedDifficulty}
            value={difficulty}
            slotProps={slotProps}
          />

          <ProblemGeneratorsConfiguration slug={slug ?? ''}/>
        </div>
      </div>
      <Toaster/>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {isExploding && <ConfettiExplosion onComplete={() => { setIsExploding(false) }} duration={2500} force={0.8} particleCount={70} particleSize={6}/>}
      </div>

      <div className="my-10">
        <ProblemSolver onProblemAccepted={onProblemAccepted} slug={slug} difficulty={difficulty}/>
      </div>
    </>
  )
}
