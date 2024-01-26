import { useMutation } from 'react-query'
import { toggleEnabledProblemGenerator } from '../api-client/category'
import { useSetState } from './use-set-state'
import { useEffect } from 'react'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useGeneratorToggleMutation = (initEnabled: number[]) => {
  const [isGeneratorEnabled, toggleEnabled, setInitEnabled] = useSetState<number>()
  const [isGeneratorLoading, toggleGeneratorLoading] = useSetState<number>()

  useEffect(() => {
    setInitEnabled(initEnabled)
  }, [initEnabled, setInitEnabled])

  const { mutateAsync: toggleGeneratorAsync } = useMutation(
    {
      mutationFn: async ({ id, enable }: { id: number, enable: boolean }) => {
        toggleGeneratorLoading(id, true)
        return await toggleEnabledProblemGenerator(id, enable)
      },
      onSuccess: ({ id, enabled }) => {
        toggleGeneratorLoading(id, false)
        toggleEnabled(id, enabled)
      }
    }
  )

  return { toggleGeneratorAsync, isGeneratorEnabled, isGeneratorLoading }
}
