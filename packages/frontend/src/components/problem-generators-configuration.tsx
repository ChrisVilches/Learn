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
    <div>
      <button onClick={toggle} data-generator-id={id} disabled={toggleDisabled} className={enabled ? '' : 'opacity-50'}>
        {name}
        {toggleDisabled ? 'Updating...' : ''}
      </button>
    </div>
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
