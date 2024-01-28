import { MathJax } from 'better-react-mathjax'
import { SolutionInput } from './solution-input'
import { type Problem, generateNewProblem, judgeProblem } from '../api-client/problem'
import { useMutation, useQuery } from 'react-query'
import { useCallback, useState } from 'react'
import { apiErrorSchema } from '../api-client/http-client-auth'
import { isUndefined } from 'lodash'

interface ProblemSolveProps {
  slug: string
  difficulty: number
}

interface ProblemSolveInnerProps {
  problem: Problem
  fetchNextProblem: () => void
}

const ProblemSolveInner = ({ problem, fetchNextProblem }: ProblemSolveInnerProps): JSX.Element => {
  const [verdict, setVerdict] = useState<'ok' | 'incorrect' | null>(null)

  const { isLoading: isSubmittingSolution, mutateAsync: judgeProblemAsync, isError: isJudgeProblemError, error: judgeProblemError } = useMutation(
    {
      mutationFn: async ({ id, solution }: { id: number, solution: string }) => {
        return await judgeProblem(id, solution)
      },
      onSuccess: ({ verdict }) => {
        setVerdict(verdict)
      }
    }
  )

  const [solution, setSolution] = useState('')

  const submitSolution = useCallback((inputSolution: string) => {
    judgeProblemAsync({
      id: problem.id,
      solution: inputSolution
    }).catch(console.error)
  }, [problem.id, judgeProblemAsync])

  const resetForm = useCallback(() => {
    setVerdict(null)
    setSolution('')
  }, [])

  const getNextProblem = useCallback(() => {
    resetForm()
    fetchNextProblem()
  }, [fetchNextProblem, resetForm])

  const submitButtonDisabled = verdict !== null || solution.trim().length === 0
  const choiceButtonsDisabled = verdict !== null

  return (
    <div>
      <MathJax inline={true}>
        {`\\(${problem.tex}\\)`}
      </MathJax>

      <SolutionInput onChange={setSolution} value={solution}/>

      {problem.freeInput
        ? <button onClick={() => { submitSolution(solution) }} disabled={submitButtonDisabled} className="disabled:bg-gray-400">
          Submit
        </button>
        : ''}

      {problem.choiceAnswers.map(({ label, result }, idx) => (
        <button onClick={() => { submitSolution(result) }} key={idx} disabled={choiceButtonsDisabled} className="disabled:bg-gray-400">
          {label}
        </button>
      ))}

      <button onClick={getNextProblem}>
        {verdict === null ? 'Skip' : 'Next problem'}
      </button>

      {isSubmittingSolution ? 'Submitting...' : ''}

      {isJudgeProblemError ? <div className="bg-red-200">{apiErrorSchema.parse(judgeProblemError).message}</div> : ''}

      {verdict === null ? '' : <p>Verdict: {verdict}</p> }
    </div>
  )
}

export const ProblemSolve = ({ slug, difficulty }: ProblemSolveProps): JSX.Element => {
  const { isFetching: isProblemLoading, isError, refetch, data } = useQuery(
    [generateNewProblem.name, slug],
    async () => await generateNewProblem(slug ?? '', difficulty)
  )

  const fetchNextProblem = useCallback(() => {
    refetch().catch(console.error)
  }, [refetch])

  if (isProblemLoading) {
    return <span>Loading problem...</span>
  }

  if (isError || isUndefined(data)) {
    // TODO: Handle later. First I have to reproduce it. Use an ErrorBoundary?
    throw new Error()
  }

  return <ProblemSolveInner problem={data} fetchNextProblem={fetchNextProblem}/>
}
