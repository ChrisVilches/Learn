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
import { ButtonPrimary, ButtonSecondary } from './buttons'
import { AcceptedVerdict, SolutionError, WrongAnswerVerdict } from './verdicts'

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

  const submitButtonDisabled = verdict !== null || solution.trim().length === 0 || isSubmittingSolution
  const choiceButtonsDisabled = verdict !== null || isSubmittingSolution

  return (
    <div>
      <div className="text-center mb-4">
        <MathJax inline={true}>
          {`\\(${problem.tex}\\)`}
        </MathJax>

        <div className="my-4 empty:hidden">
          {verdict === 'ok' && <AcceptedVerdict/>}
          {verdict === 'incorrect' && <WrongAnswerVerdict/>}
          {isJudgeProblemError && <SolutionError>{apiErrorSchema.parse(judgeProblemError).message}</SolutionError>}
        </div>
      </div>

      {problem.freeInput && <SolutionInput placeholder={problem.freeInputHelp} disabled={verdict !== null} className="my-4" onChange={setSolution} value={solution}/>}

      <div className="flex place-items-center">
        <div className="flex space-x-4">
          {problem.freeInput
            ? (
              <ButtonPrimary onClick={() => { submitSolution(solution) }} disabled={submitButtonDisabled}>
                Submit
              </ButtonPrimary>
              )
            : ''}

          {problem.choiceAnswers.map(({ label, result }, idx) => (
            <ButtonPrimary key={idx} onClick={() => { submitSolution(result) }} disabled={choiceButtonsDisabled}>
              {label}
            </ButtonPrimary>
          ))}

          {verdict === null && <ButtonSecondary onClick={getNextProblem}>Skip</ButtonSecondary>}
          {verdict !== null && <ButtonPrimary onClick={getNextProblem}>Next problem</ButtonPrimary>}
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
