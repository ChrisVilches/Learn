import { MathJax } from 'better-react-mathjax'
import { SolutionInput } from './solution-input'
import { type Problem, generateNewProblem, judgeProblem } from '../api-client/problem'
import { useMutation, useQuery } from 'react-query'
import { useCallback, useState } from 'react'
import { apiErrorSchema } from '../api-client/http-client-auth'
import { isUndefined } from 'lodash'
import { ProblemHelp } from './problem-help'
import { ProblemSkeleton } from './loaders/problem-skeleton'
import { Spinner } from './loaders/spinner'

interface ProblemSolverProps {
  slug: string
  difficulty: number
  onProblemAccepted: () => void
}

interface ProblemSolverInnerProps {
  problem: Problem
  fetchNextProblem: () => void
  onProblemAccepted: () => void
}

const ProblemSolverInner = ({ problem, fetchNextProblem, onProblemAccepted }: ProblemSolverInnerProps): JSX.Element => {
  const [verdict, setVerdict] = useState<'ok' | 'incorrect' | null>(null)

  const { isLoading: isSubmittingSolution, mutateAsync: judgeProblemAsync, isError: isJudgeProblemError, error: judgeProblemError } = useMutation(
    {
      mutationFn: async ({ id, solution }: { id: number, solution: string }) => {
        return await judgeProblem(id, solution)
      },
      onSuccess: ({ verdict }) => {
        setVerdict(verdict)

        if (verdict === 'ok') {
          onProblemAccepted()
        }
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

  // TODO: must disable buttons when submitting solution.
  const submitButtonDisabled = verdict !== null || solution.trim().length === 0
  const choiceButtonsDisabled = verdict !== null

  return (
    <div>
      <div className="text-center mb-4">
        <MathJax inline={true}>
          {`\\(${problem.tex}\\)`}
        </MathJax>

        <div className="my-4 empty:hidden">
          {verdict === 'ok' && <p className="font-semibold text-green-700">Accepted</p>}
          {verdict === 'incorrect' && <p className="font-semibold text-red-700">Wrong Answer</p>}
          {isJudgeProblemError && <div className="font-semibold text-orange-700">{apiErrorSchema.parse(judgeProblemError).message}</div>}
        </div>
      </div>

      {problem.freeInput && <SolutionInput disabled={verdict !== null} className="my-4" onChange={setSolution} value={solution}/>}

      <div className="flex place-items-center">
        <div className="flex space-x-4">
          {problem.freeInput
            ? (
              <button
                onClick={() => { submitSolution(solution) }}
                disabled={submitButtonDisabled}
                className="p-4 rounded-md transition-colors duration-200 hover:bg-green-900 bg-green-800 disabled:bg-gray-600 disabled:text-gray-200"
              >
                Submit
              </button>
              )
            : ''}

          {problem.choiceAnswers.map(({ label, result }, idx) => (
            <button
              key={idx}
              className="p-4 rounded-md transition-colors duration-200 hover:bg-green-900 bg-green-800 disabled:bg-gray-600 disabled:text-gray-200"
              onClick={() => { submitSolution(result) }}
              disabled={choiceButtonsDisabled}
            >
              {label}
            </button>
          ))}

          {verdict === null && <button className="p-4 duration-200 transition-colors rounded-md bg-slate-900 hover:bg-purple-900" onClick={getNextProblem}>Skip</button>}
          {verdict !== null && <button className="p-4 rounded-md transition-colors duration-200 hover:bg-green-900 bg-green-800" onClick={getNextProblem}>Next problem</button>}
        </div>

        {isSubmittingSolution ? <Spinner/> : ''}

        <div className="flex place-content-end grow">
          <ProblemHelp problemId={problem.id}/>
        </div>
      </div>
    </div>
  )
}

export const ProblemSolver = ({ slug, difficulty, onProblemAccepted }: ProblemSolverProps): JSX.Element => {
  const { isFetching, refetch, data } = useQuery(
    [generateNewProblem.name, slug],
    async () => await generateNewProblem(slug ?? '', difficulty)
  )

  const fetchNextProblem = useCallback(() => {
    refetch().catch(console.error)
  }, [refetch])

  if (isFetching) {
    return <ProblemSkeleton/>
  }

  if (isUndefined(data)) {
    throw new Error()
  }

  return (
    <ProblemSolverInner onProblemAccepted={onProblemAccepted} problem={data} fetchNextProblem={fetchNextProblem}/>
  )
}
