import { SolutionParseError } from '../main'
import { type SolutionVerdict } from '../types/solution'
import { buildMatrixProblem, matrixInversion } from './matrix-inversion'

function checkSolutionInv (A: number[][], sol: string): SolutionVerdict {
  const problem = buildMatrixProblem(A)
  return matrixInversion.checkSolution(sol, matrixInversion.problemContentParser.parse(problem.content))
}

describe('checkSolution', () => {
  test('accepts symbolic solution', () => {
    const sol = '(1/2) * [[-2, -3], [-4, -5]]'
    expect(checkSolutionInv([[5, -3], [-4, 2]], sol)).toBe('ok')
  })

  test('accepts numeric solution', () => {
    const sol = '-1 -1.5\n-2 -2.5'
    expect(checkSolutionInv([[5, -3], [-4, 2]], sol)).toBe('ok')
  })

  test('rejects incorrect solution', () => {
    const sol = '-1 -1.5\n-2 2.5'
    expect(checkSolutionInv([[5, -3], [-4, 2]], sol)).toBe('incorrect')
  })

  test('rejects wrong non-invertible solution', () => {
    expect(checkSolutionInv([[2, 4], [2, 4]], '1 2\n2 3')).toBe('incorrect')
  })

  test('accepts correct non-invertible solution', () => {
    expect(checkSolutionInv([[2, 4], [2, 4]], 'non-invertible')).toBe('ok')
  })

  // TODO: Move these tests to the parser tests (util/matrix.test.ts)
  //       Write tests for each parser.
  test('symbolic wrong syntax', () => {
    expect(() => checkSolutionInv([[2, 4], [2, 4]], '[[1, 2], [3]')).toThrow(SolutionParseError)
    expect(() => checkSolutionInv([[2, 4], [2, 4]], '4[[1, 2], [3]')).toThrow(SolutionParseError)
  })

  test('numeric wrong syntax', () => {
    expect(() => checkSolutionInv([[2, 4], [2, 4]], '1 2\n3')).toThrow(SolutionParseError)
    expect(() => checkSolutionInv([[2, 4], [2, 4]], '1 2 3\n3 4 5 6')).toThrow(SolutionParseError)
    expect(() => checkSolutionInv([[2, 4], [2, 4]], '1 2 3\n3 4[ 5 6')).toThrow(SolutionParseError)
  })
})
