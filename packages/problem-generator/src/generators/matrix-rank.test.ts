import { SolutionParseError } from '../main'
import { type SolutionVerdict } from '../types/solution'
import { buildMatrixProblem, matrixRank } from './matrix-rank'

async function checkSolution (A: number[][], sol: string): Promise<SolutionVerdict> {
  const problem = await buildMatrixProblem(A)
  return matrixRank.checkSolution(sol, matrixRank.problemContentParser.parse(problem.content))
}

const matrix1 = [[1, 0, 1], [0, 1, 1], [0, 1, 1]]
const matrix2 = [[1, 1, 0, 2], [-1, -1, 0, -2]]

describe('checkSolution', () => {
  test('checks solution', async () => {
    expect(await checkSolution(matrix1, '2')).toBe('ok')
    expect(await checkSolution(matrix1, '1')).toBe('incorrect')
    expect(await checkSolution(matrix1, '1')).toBe('incorrect')
    expect(await checkSolution(matrix2, '1')).toBe('ok')
    expect(await checkSolution(matrix2, '2')).toBe('incorrect')
  })

  test.skip('parse error', async () => {
    expect(async () => await checkSolution(matrix1, '  ')).toThrow(SolutionParseError)
    expect(async () => await checkSolution(matrix1, 'x  ')).toThrow(SolutionParseError)
    expect(async () => await checkSolution(matrix1, ' i  ')).toThrow(SolutionParseError)
  })
})
