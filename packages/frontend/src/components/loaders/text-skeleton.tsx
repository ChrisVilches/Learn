import { sample, range } from 'lodash'
import { useMemo } from 'react'

interface TextSkeletonProps {
  lines?: number
  variant?: 'small' | 'medium'
}

const sizes = ['w-1/2', 'w-3/4', '', 'w-2/5']

export function TextSkeleton ({ lines = 3, variant = 'medium' }: TextSkeletonProps): JSX.Element {
  const sizeValues = useMemo(() => range(lines).map(() => sample(sizes)), [lines])
  const height = variant === 'medium' ? 'h-4' : 'h-2'
  const spaceY = variant === 'medium' ? 'space-y-5' : 'space-y-2'

  return (
    <div className="max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className={`flex-1 py-1 ${spaceY}`}>
          {sizeValues.map((size, i) => (
            <div key={i} className={`${height} bg-slate-700 rounded ${size}`}></div>
          ))}
        </div>
      </div>
    </div>
  )
}
