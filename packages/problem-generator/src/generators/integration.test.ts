import { type SolutionVerdict } from '../types/solution'
import { integration, integrationProblemFromResultExpression } from './integration'

function checkSolutionFromResult (result: string, sol: string): SolutionVerdict {
  const problem = integrationProblemFromResultExpression(result)
  return integration.checkSolution(sol, integration.problemContentParser.parse(problem.content))
}

function getDebugInfo (result: string): string {
  return integrationProblemFromResultExpression(result).debugInformation
}

function getTex (result: string): string {
  return integrationProblemFromResultExpression(result).tex
}

describe('problem statement', () => {
  test('debugInformation', () => {
    expect(getDebugInfo('(x^3 - 3cos(x))/3')).toBe('x ^ 2 + sin(x)')
    expect(getDebugInfo('2x^2 - 4x')).toBe('4 x - 4')
    expect(getDebugInfo('3x^2 + 5x')).toBe('6 x + 5')
    expect(getDebugInfo('x^4 + 2x^3')).toBe('4 x ^ 3 + 6 x ^ 2')
    expect(getDebugInfo('(x^2)/2')).toBe('x')
  })

  test('tex', () => {
    expect(getTex('2x^2 - 4x')).toBe('\\int{4~ x-4~ dx}')
    expect(getTex('3x^2 + 5x')).toBe('\\int{6~ x+5~ dx}')
    expect(getTex('x^4 + 2x^3')).toBe('\\int{4~{ x}^{3}+6~{ x}^{2}~ dx}')
    expect(getTex('(x^2)/2')).toBe('\\int{ x~ dx}')
  })
})

describe('checkSolution', () => {
  describe('polynomial integration', () => {
    test('without integration constant', () => {
      expect(checkSolutionFromResult('(x^3)/3 - cos(x)', '(x^3 - 3cos(x))/3')).toBe('ok')
    })

    test('without integration constant 2', () => {
      expect(checkSolutionFromResult('-4x + 2x^2 ', '2x^2 - 4x')).toBe('ok')
    })

    test('without integration constant 3', () => {
      expect(checkSolutionFromResult('3x*x + 5x', '3x^2 + 5x')).toBe('ok')
    })

    test('without integration constant 4', () => {
      expect(checkSolutionFromResult('x^4 + 2x^3', 'x^4 + 2x^3')).toBe('ok')
    })

    test('with integration constant', () => {
      const result = '(x^2)/2'
      expect(checkSolutionFromResult(result, 'x * x * 0.5 + C')).toBe('ok')
      expect(checkSolutionFromResult(result, 'x * x * 0.5 + 3C')).toBe('ok')
      expect(checkSolutionFromResult(result, 'x * x * 0.5 + c')).toBe('ok')
      expect(checkSolutionFromResult(result, '(x^2)/2 + 2c')).toBe('ok')
    })

    test('incorrect', () => {
      expect(checkSolutionFromResult('x^4 + 2x^3.2', 'x^4 + 2x^3')).toBe('incorrect')
    })
  })
})
