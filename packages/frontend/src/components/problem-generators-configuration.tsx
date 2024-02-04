import { useQuery } from 'react-query'
import { fetchCategoryGenerators } from '../api-client/category'
import { type MouseEventHandler, useCallback, useMemo } from 'react'
import { useGeneratorToggleMutation } from '../hooks/use-generator-toggle-mutation'

interface ProblemGeneratorItemConfigProps {
  id: number
  name: string
  enabled: boolean
  toggle: MouseEventHandler
  toggleDisabled: boolean
}

const ProblemGeneratorItemConfig = ({ id, name, enabled, toggle, toggleDisabled }: ProblemGeneratorItemConfigProps): JSX.Element => {
  return (
    <span className="relative inline-flex mr-2">
      <button
        onClick={toggle}
        data-generator-id={id}
        disabled={toggleDisabled}
        className={`text-sm p-2 my-1 rounded-md transition-colors duration-300 bg-black border-[1px] border-black hover:border-yellow-300 ${enabled ? '' : 'bg-gray-800 border-gray-800 text-gray-400'}`}
      >
        {name}
      </button>
      {toggleDisabled
        ? (
          <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          )
        : ''}
    </span>
  )
}

interface ProblemGeneratorsConfigurationProps {
  slug: string
}

export const ProblemGeneratorsConfiguration = ({ slug }: ProblemGeneratorsConfigurationProps): JSX.Element => {
  const { isLoading, isError, data } = useQuery(
    [fetchCategoryGenerators.name, slug],
    async () => await fetchCategoryGenerators(slug)
  )

  const initEnabled = useMemo(() => data?.filter(g => g.enabled).map(g => g.id) ?? [], [data])

  const { toggleGeneratorAsync, isGeneratorEnabled, isGeneratorLoading } = useGeneratorToggleMutation(initEnabled)

  const enableToggle = useCallback((ev: React.MouseEvent<HTMLElement>) => {
    const id = Number(ev.currentTarget.getAttribute('data-generator-id'))
    toggleGeneratorAsync({ id, enable: !isGeneratorEnabled(id) }).catch(console.error)
  }, [toggleGeneratorAsync, isGeneratorEnabled])

  if (isLoading) {
    // TODO: Improve loader.
    return <span>Loading generators...</span>
  }

  if (isError) {
    throw new Error('TODO: Handle later')
  }

  return (
    <div>
      {data?.map(gen => (
        <ProblemGeneratorItemConfig
          key={gen.id}
          {...gen}
          enabled={isGeneratorEnabled(gen.id)}
          toggle={enableToggle}
          toggleDisabled={isGeneratorLoading(gen.id)}
        />
      ))}
    </div>
  )
}
