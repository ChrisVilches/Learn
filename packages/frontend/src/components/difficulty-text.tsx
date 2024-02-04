import { type ReactNode } from 'react'

interface DifficultyTextProps {
  difficulty: number
  className?: string
}

function getText (difficulty: number): ReactNode {
  if (difficulty <= 25) {
    return <span className="text-green-600">Easy</span>
  }

  if (difficulty <= 50) {
    return <span className="text-yellow-600">Medium</span>
  }

  if (difficulty <= 75) {
    return <span className="text-orange-600">Hard</span>
  }

  return <span className="text-red-600">Very hard</span>
}

export function DifficultyText ({ difficulty, className = '' }: DifficultyTextProps): JSX.Element {
  return (
    <div className={className}>
      <div className="p-2 bg-gray-800 inline rounded-md">
        {getText(difficulty)}
      </div>
    </div>
  )
}
