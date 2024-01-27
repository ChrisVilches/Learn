import { SolutionParseError } from '../types/errors'
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

  test('parse error', async () => {
    await expect(checkSolution(matrix1, '  ')).rejects.toThrow(SolutionParseError)
    await expect(checkSolution(matrix1, 'x  ')).rejects.toThrow(SolutionParseError)
    await expect(checkSolution(matrix1, ' i  ')).rejects.toThrow(SolutionParseError)
  })
})
