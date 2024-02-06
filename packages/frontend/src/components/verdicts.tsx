export function AcceptedVerdict (): JSX.Element {
  return <div className="font-semibold text-green-700">Accepted</div>
}

export function WrongAnswerVerdict (): JSX.Element {
  return <div className="font-semibold text-red-700">Wrong Answer</div>
}

export function SolutionError ({ children }: { children: string }): JSX.Element {
  return (
    <div className="font-semibold text-orange-700">
      {children}
    </div>
  )
}
