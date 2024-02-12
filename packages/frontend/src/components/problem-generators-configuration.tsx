import { useQuery } from 'react-query'
import { fetchCategoryGenerators } from '../api-client/category'
import { type MouseEventHandler, useCallback, useMemo } from 'react'
import { useGeneratorToggleMutation } from '../hooks/use-generator-toggle-mutation'

interface GeneratorButtonProps {
  children: string
  className?: string
  generatorEnabled: boolean
  generatorId: number
  onClick: MouseEventHandler
  loading: boolean
}

function GeneratorButton ({ children, onClick, generatorId, loading, generatorEnabled, className = '' }: GeneratorButtonProps): JSX.Element {
  const enabled = 'bg-black border-black text-gray-100'
  const disabled = 'bg-gray-700 border-gray-800 text-gray-400'
  const style = generatorEnabled ? enabled : disabled

  return (
    <>
      <button
        onClick={onClick}
        data-generator-id={generatorId}
        disabled={loading}
        className={`text-sm p-2 h-10 my-1 rounded-md transition-colors duration-300 border-[1px] hover:border-yellow-300 ${style} ${className}`}
      >
        {children}
      </button>
      {loading
        ? (
          <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          )
        : ''}
    </>
  )
}

const generatorsSkeleton = (
  <>
    {['w-[70px]', 'w-[60px]', 'w-[95px]'].map((width, idx) => (
      <span key={idx} className="relative inline-flex mr-2">
        <GeneratorButton
          className={`animate-pulse ${width}`}
          onClick={() => {}}
          generatorId={0}
          generatorEnabled={false}
          loading={false}
        >
          {''}
        </GeneratorButton>
      </span>
    ))}
  </>
)

interface ProblemGeneratorsConfigurationProps {
  categorySlug: string
}

export const ProblemGeneratorsConfiguration = ({ categorySlug }: ProblemGeneratorsConfigurationProps): JSX.Element => {
  const { isLoading, data } = useQuery(
    [fetchCategoryGenerators.name, categorySlug],
    async () => await fetchCategoryGenerators(categorySlug)
  )

  const initEnabled = useMemo(() => data?.filter(g => g.enabled).map(g => g.id) ?? [], [data])

  const { toggleGeneratorAsync, isGeneratorEnabled, isGeneratorLoading } = useGeneratorToggleMutation(initEnabled)

  const enableToggle = useCallback((ev: React.MouseEvent<HTMLElement>) => {
    const id = Number(ev.currentTarget.getAttribute('data-generator-id'))
    toggleGeneratorAsync({ id, enable: !isGeneratorEnabled(id) }).catch(console.error)
  }, [toggleGeneratorAsync, isGeneratorEnabled])

  if (isLoading) {
    return generatorsSkeleton
  }

  return (
    <div>
      {data?.map(gen => (
        <span key={gen.id} className="relative inline-flex mr-2">
          <GeneratorButton
            onClick={enableToggle}
            generatorId={gen.id}
            generatorEnabled={isGeneratorEnabled(gen.id)}
            loading={isGeneratorLoading(gen.id)}
          >
            {gen.name}
          </GeneratorButton>
        </span>
      ))}
    </div>
  )
}
