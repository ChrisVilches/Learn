import { type SolutionVerdict } from '../types/solution'
import { buildMatrixProblem, matrixBasic } from './matrix-basic'
import { SolutionParseError } from '../main'

function checkSolutionSum (A: number[][], B: number[][], sol: string): SolutionVerdict {
  const problem = buildMatrixProblem(A, B, '+')
  return matrixBasic.checkSolution(sol, matrixBasic.problemContentParser.parse(problem.content))
}

describe('checkSolution', () => {
  test('rejects symbolic solution', () => {
    const sol = '[[1, 1], [1, 1]] + [[2, 2], [2, 2]]'
    expect(() => checkSolutionSum([[1, 1], [1, 1]], [[2, 2], [2, 2]], sol)).toThrow(SolutionParseError)
  })

  test('accepts numeric solution', () => {
    const sol = '3 3\n3 3'
    expect(checkSolutionSum([[1, 1], [1, 1]], [[2, 2], [2, 2]], sol)).toBe('ok')
  })

  test('rejects incorrect solution', () => {
    const sol = '3 3\n3 4'
    expect(checkSolutionSum([[1, 1], [1, 1]], [[2, 2], [2, 2]], sol)).toBe('incorrect')
  })
})
