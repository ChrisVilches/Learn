import { ParseError } from '../types/errors'
import { type SolutionVerdict } from '../types/solution'
import { quadraticEquation, quadraticEquationProblemFromVertex } from './quadratic-equation'

function checkSolutionFromVertex (a: number, h: number, k: number, sol: string): SolutionVerdict {
  const problem = quadraticEquationProblemFromVertex(a, h, k)
  return quadraticEquation.checkSolution(sol, quadraticEquation.problemContentParser.parse(problem.content))
}

describe('checkSolution', () => {
  test('correct different solutions', () => {
    expect(checkSolutionFromVertex(1, 2, -1, '3, 1')).toBe('ok')
    expect(checkSolutionFromVertex(-1, 2, 9, '-1, 5')).toBe('ok')
    expect(checkSolutionFromVertex(10000, 20000, 90000, '20000-3i, 20000+3i')).toBe('ok')
    expect(checkSolutionFromVertex(3, 5, 7, '5 - i*sqrt(7/3), 5 + i*sqrt(7/3)')).toBe('ok')
  })

  test('correct repeated solutions', () => {
    expect(checkSolutionFromVertex(1, 0, 0, '0, 0')).toBe('ok')
    expect(checkSolutionFromVertex(1, 2, 0, '2, 2')).toBe('ok')
    expect(checkSolutionFromVertex(-1, 2, 0, '2, 2')).toBe('ok')
  })

  test('incorrect', () => {
    expect(checkSolutionFromVertex(1, 2, -1, '2, 0')).toBe('incorrect')
    expect(checkSolutionFromVertex(-1, 2, 9, '-1, 8')).toBe('incorrect')
    expect(checkSolutionFromVertex(3, 5, 7, '4 - i*sqrt(7/3), 5 + i*sqrt(7/3)')).toBe('incorrect')
  })

  test('missing solution', () => {
    expect(checkSolutionFromVertex(1, 2, -1, '3, 3')).toBe('incorrect')
    expect(checkSolutionFromVertex(1, 2, -1, '1, 1')).toBe('incorrect')
  })

  test('complex correct', () => {
    expect(checkSolutionFromVertex(1, 2, 1, '2-i, 2+i')).toBe('ok')
    expect(checkSolutionFromVertex(2, 5, 3, '5 - sqrt(3/2) * i, 5 + sqrt(3/2) * i')).toBe('ok')
  })

  test('bad syntax', () => {
    expect(() => checkSolutionFromVertex(1, 2, 1, '  ')).toThrow(ParseError)
    expect(() => checkSolutionFromVertex(1, 2, 1, ' , , , ')).toThrow(ParseError)
    expect(checkSolutionFromVertex(1, 2, 1, '1, 2, 3, 4, 5')).toBe('incorrect')
    expect(() => checkSolutionFromVertex(1, 2, 1, 'a, b')).toThrow(ParseError)
    expect(() => checkSolutionFromVertex(1, 2, 1, ' , ')).toThrow(ParseError)
  })
})
