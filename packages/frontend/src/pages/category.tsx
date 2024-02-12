import { useParams } from 'react-router-dom'
import { ProblemGeneratorsConfiguration } from '../components/problem-generators-configuration'
import { CategoryInformation } from '../components/category-information'
import { useCallback, useState } from 'react'
import { isArray, isUndefined } from 'lodash'
import { fetchCategory, saveDifficultyPreference } from '../api-client/category'
import { useQuery } from 'react-query'
import { delayExecutionOnlyLast } from '../util/delay'
import ConfettiExplosion from 'react-confetti-explosion'
import { ProblemSolver } from '../components/problem-solver'
import { CategoryNotFoundError } from '../errors'
import { Toaster } from 'react-hot-toast'
import { DifficultyText } from '../components/difficulty-text'
import { TextSkeleton } from '../components/loaders/text-skeleton'
import { HorizontalSlider } from '../components/slider'
import { toastSuccess } from '../util/toast'
import { Helmet } from 'react-helmet'
import { getFullTitle } from '../util/dom'
import { CategoryInfoCard } from '../components/cards/category-info-card'

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

const CategoryPageSkeleton = (): JSX.Element => (
  <div className="flex justify-center">
    <div className="grid grid-cols-10 gap-4 w-full">
      <CategoryInfoCard className="col-span-10 md:col-span-6 animate-pulse">
        <TextSkeleton variant="small" lines={8}/>
      </CategoryInfoCard>

      <CategoryInfoCard className="col-span-10 md:col-span-4 w-full animate-pulse">
        <TextSkeleton variant="medium" lines={4}/>
      </CategoryInfoCard>
    </div>
  </div>
)

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
    toastSuccess('Correct answer!')
    setIsExploding(true)
  }, [])

  if (isError) {
    throw new CategoryNotFoundError(slug)
  }

  if (isLoading || isUndefined(difficulty) || isUndefined(category)) {
    // TODO: Sadly helmet has to be added here as well, otherwise the title would
    //       temporarily become something random. For example if there was an error before,
    //       the title will, for a split second, become "Unexpected Error" or "category not found",
    //       or whatever the error was.
    //       There are probably other corner cases where the same thing happens.
    //       The problem seems to happen when there's a loading guard that doesn't render the
    //       full loaded page with the Helmet element.
    //       How to reproduce: Open a category with incorrect slug, then open one with correct slug,
    //                         and check the tab title.
    //       I have already fixed (patched) it by adding the "Loading..." title below, but if you
    //       remove that helmet element, the wrong title will appear.
    return (
      <>
        <Helmet>
          <title>{getFullTitle('Loading...')}</title>
        </Helmet>
        <CategoryPageSkeleton/>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{getFullTitle(category.name)}</title>
      </Helmet>
      <div className="grid grid-cols-10 gap-4">
        <CategoryInfoCard className="col-span-10 md:col-span-6">
          <CategoryInformation
            name={category.name}
            description={category.description}
            slug={slug}
            className='mb-10'/>
        </CategoryInfoCard>

        <CategoryInfoCard className="col-span-10 md:col-span-4">
          <DifficultyText className="mb-6 float-end" difficulty={difficulty}/>
          <HorizontalSlider
            value={difficulty}
            min={1}
            max={100}
            onChange={onChangeDifficulty}
            onChangeCommitted={onChangeCommittedDifficulty}
          />

          <ProblemGeneratorsConfiguration categorySlug={slug ?? ''}/>
        </CategoryInfoCard>
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
