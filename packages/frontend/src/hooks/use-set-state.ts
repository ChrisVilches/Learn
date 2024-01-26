import { useCallback, useState } from 'react'

type UseSetStateReturn<T> = [(value: T) => boolean, (value: T, present: boolean | undefined) => void, (value: T[]) => void]

export function useSetState<T> (): UseSetStateReturn<T> {
  const [state, setState] = useState(new Set<T>())

  const has = useCallback((value: T) => {
    return state.has(value)
  }, [state])

  const setValues = useCallback((values: T[]) => {
    setState(new Set(values))
  }, [])

  const removeValue = useCallback((value: T): void => {
    setState(state => new Set([...state].filter(v => v !== value)))
  }, [])

  const addValue = useCallback((value: T): void => {
    setState(state => new Set([...state, value]))
  }, [])

  const toggle = useCallback((value: T, present: boolean | undefined) => {
    if (typeof present === 'boolean') {
      if (present) {
        addValue(value)
      } else {
        removeValue(value)
      }
    } else {
      if (state.has(value)) {
        removeValue(value)
      } else {
        addValue(value)
      }
    }
  }, [state, addValue, removeValue])

  return [has, toggle, setValues]
}
