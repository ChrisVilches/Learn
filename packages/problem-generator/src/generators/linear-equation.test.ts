import { type SolutionVerdict } from '../types/solution'
import { linearEquation, linearEquationProblemFromParameters } from './linear-equation'

function checkSolutionFromParameters (m0: number, b0: number, m1: number, b1: number, sol: string): SolutionVerdict {
  const problem = linearEquationProblemFromParameters(m0, b0, m1, b1)
  return linearEquation.checkSolution(sol, linearEquation.problemContentParser.parse(problem.content))
}

describe('checkSolution', () => {
  test('no solution', () => {
    expect(checkSolutionFromParameters(1, 1, 1, 2, 'none')).toBe('ok')
  })

  test('one solution', () => {
    expect(checkSolutionFromParameters(2, 1, 4, 5, '-2')).toBe('ok')
    expect(checkSolutionFromParameters(-1, 0, 0, -3, '3')).toBe('ok')
    expect(checkSolutionFromParameters(3, Math.sqrt(56), 99, 111111, '(1/96) (2*sqrt(14) - 111111)')).toBe('ok')
  })

  test('infinite solutions', () => {
    expect(checkSolutionFromParameters(20000, 10000, 20000, 10000, 'multiple')).toBe('ok')
    expect(checkSolutionFromParameters(20000, 10000, 20000, 200, 'multiple')).toBe('incorrect')
  })
})
