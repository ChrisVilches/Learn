import { formatSumTerms } from './algebra'

describe(formatSumTerms.name, () => {
  test('zero', () => {
    expect(formatSumTerms([])).toBe('0')
    expect(formatSumTerms([{ mult: '', coef: 0 }])).toBe('0')
    expect(formatSumTerms([{ mult: '', coef: 0 }, { mult: 'x', coef: 0 }])).toBe('0')
  })

  test('polynomial', () => {
    expect(formatSumTerms([{ mult: '', coef: -4 }])).toBe('-4')
    expect(formatSumTerms([{ mult: 'x', coef: 5 }])).toBe('5 * x')
    expect(formatSumTerms([{ mult: 'x', coef: 1 }, { mult: 'x^2', coef: -2 }])).toBe('x - 2 * x^2')
    expect(formatSumTerms([{ mult: '', coef: -1 }, { mult: 'x^2', coef: -1 }])).toBe('-1 - x^2')
    expect(formatSumTerms([{ mult: '', coef: -1 }, { mult: 'x^2', coef: 1 }])).toBe('-1 + x^2')
  })

  test('sin, cos, log', () => {
    expect(formatSumTerms([{ mult: 'log(x)', coef: -4 }])).toBe('-4 * log(x)')
    expect(formatSumTerms([{ mult: 'sin(x)', coef: 1 }, { mult: 'cos(x)', coef: -1 }])).toBe('sin(x) - cos(x)')
    expect(formatSumTerms([{ mult: 'log(x)', coef: 0 }, { mult: 'log(x)', coef: -2 }])).toBe('-2 * log(x)')
  })

  test('factored expression', () => {
    const squared = `(${formatSumTerms([{ mult: 'x', coef: -1 }, { mult: '', coef: -4 }])})^2`
    const firstTerm = { coef: 4, mult: squared }
    const secondTerm = { coef: -1, mult: '' }
    expect(formatSumTerms([firstTerm, secondTerm])).toBe('4 * (-x - 4)^2 - 1')
  })

  test('with parenthesis', () => {
    expect(formatSumTerms([{ coef: 1, mult: '' }, { coef: 2, mult: 'a' }], { parenthesis: true })).toBe('(1 + 2 * a)')
    expect(formatSumTerms([{ coef: 0, mult: '' }, { coef: 2, mult: 'a' }], { parenthesis: true })).toBe('2 * a')
    expect(formatSumTerms([{ coef: 0, mult: '' }, { coef: 0, mult: 'a' }], { parenthesis: true })).toBe('0')
    expect(formatSumTerms([{ coef: 1, mult: '' }, { coef: 2, mult: 'a' }], { parenthesis: true })).toBe('(1 + 2 * a)')
    expect(formatSumTerms([{ coef: 1, mult: 'x' }], { parenthesis: true })).toBe('x')
    expect(formatSumTerms([{ coef: 2, mult: 'x' }], { parenthesis: true })).toBe('2 * x')
  })
})
