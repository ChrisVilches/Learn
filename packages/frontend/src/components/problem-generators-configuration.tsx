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

// TODO: I should extract the component of the button, and turn it into another component.
//       Then both the actual button and the skeleton should be made using that component.
//       (low priority)

const ProblemGeneratorItemConfig = ({ id, name, enabled, toggle, toggleDisabled }: ProblemGeneratorItemConfigProps): JSX.Element => {
  return (
    <span className="relative inline-flex mr-2">
      <button
        onClick={toggle}
        data-generator-id={id}
        disabled={toggleDisabled}
        className={`text-sm p-2 h-10 my-1 rounded-md text-gray-100 transition-colors duration-300 bg-black border-[1px] border-black hover:border-yellow-300 ${enabled ? '' : 'bg-gray-800 border-gray-800 text-gray-400'}`}
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
  const { isLoading, data } = useQuery(
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
    return (
      <>
        {['w-[70px]', 'w-[60px]', 'w-[95px]'].map((width, idx) => (
          <span key={idx} className="relative inline-flex mr-2">
            <div className={`p-2 h-10 ${width} my-1 rounded-md transition-colors duration-300 bg-slate-800 border-[1px] border-slate-800 animate-pulse`}/>
          </span>
        ))}
      </>
    )
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
