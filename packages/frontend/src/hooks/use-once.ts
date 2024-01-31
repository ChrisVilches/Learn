import { useCallback, useEffect, useState } from 'react'

export function useOnce<F extends () => void> (fnRef: F): () => void {
  const [called, setCalled] = useState(false)

  useEffect(() => {
    setCalled(false)
  }, [fnRef])

  return useCallback(() => {
    if (called) {
      return
    }

    setCalled(true)
    fnRef()
  }, [called, fnRef])
}
