import { SolutionParseError } from '../types/errors'
import { parseComplexOrThrow, parseMatrixAuto, parseMatrixNumbersOnly, parseMatrixSymbolic, parseNumberOrThrow } from './parse'

describe(parseComplexOrThrow.name, () => {
  test('bad syntax', () => {
    expect(() => parseComplexOrThrow('aaa')).toThrow(SolutionParseError)
    expect(() => parseComplexOrThrow('x')).toThrow(SolutionParseError)
    expect(() => parseComplexOrThrow('   ')).toThrow(SolutionParseError)
  })

  test('correct', () => {
    expect(parseComplexOrThrow('4')).toMatchObject({ re: 4, im: 0 })
    expect(parseComplexOrThrow(' 5 - i')).toMatchObject({ re: 5, im: -1 })
    expect(parseComplexOrThrow('   2i ')).toMatchObject({ re: 0, im: 2 })
  })
})

describe(parseMatrixSymbolic.name, () => {
  test('bad syntax', () => {
    expect(() => parseMatrixSymbolic('aaa')).toThrow(SolutionParseError)
    expect(() => parseMatrixSymbolic('x')).toThrow(SolutionParseError)
    expect(() => parseMatrixSymbolic('   ')).toThrow(SolutionParseError)
    expect(() => parseMatrixSymbolic('  [1, 2, 3], [4, 5, 6]  ')).toThrow(SolutionParseError)
  })

  test('correct', () => {
    expect(parseMatrixSymbolic('[[1, 2], [3, 4]]')).toStrictEqual([[1, 2], [3, 4]])
    expect(parseMatrixSymbolic('(1/2) * [[1, 2], [3, 4]]')).toStrictEqual([[0.5, 1], [1.5, 2]])
    expect(parseMatrixSymbolic('  [ [ 0 ] ]  ')).toStrictEqual([[0]])
  })
})

describe(parseMatrixNumbersOnly.name, () => {
  test('bad syntax', () => {
    expect(() => parseMatrixNumbersOnly('1 2 3\n2 3')).toThrow(SolutionParseError)
    expect(() => parseMatrixNumbersOnly('')).toThrow(SolutionParseError)
    expect(() => parseMatrixNumbersOnly('   ')).toThrow(SolutionParseError)
    expect(() => parseMatrixNumbersOnly('1 2 3\n2 3 a')).toThrow(SolutionParseError)
  })

  test('correct', () => {
    expect(parseMatrixNumbersOnly(' 1 2\n3 4 ')).toStrictEqual([[1, 2], [3, 4]])
    expect(parseMatrixNumbersOnly('0.5 1 4\n1.5 2 5')).toStrictEqual([[0.5, 1, 4], [1.5, 2, 5]])
    expect(parseMatrixNumbersOnly(' 0 ')).toStrictEqual([[0]])
  })
})

describe(parseMatrixAuto.name, () => {
  expect(parseMatrixAuto(' 1 2\n3 4 ')).toStrictEqual([[1, 2], [3, 4]])
  expect(parseMatrixAuto('(1/2) * [[1, 2], [3, 4]]')).toStrictEqual([[0.5, 1], [1.5, 2]])
})

describe(parseNumberOrThrow.name, () => {
  test('bad syntax', () => {
    expect(() => parseNumberOrThrow('1 2 3\n2 3')).toThrow(SolutionParseError)
    expect(() => parseNumberOrThrow('')).toThrow(SolutionParseError)
    expect(() => parseNumberOrThrow('   ')).toThrow(SolutionParseError)
    expect(() => parseNumberOrThrow('x')).toThrow(SolutionParseError)
    expect(() => parseNumberOrThrow('sqrt(2)')).toThrow(SolutionParseError)
  })

  test('correct', () => {
    expect(parseNumberOrThrow(' 4 ')).toBe(4)
    expect(parseNumberOrThrow('  4.5')).toBe(4.5)
    expect(parseNumberOrThrow(' -1 ')).toBe(-1)
  })
})
