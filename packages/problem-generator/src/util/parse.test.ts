import { ParseError } from '../types/errors'
import { parseComplexOrThrow, parseMatrixAuto, parseMatrixNumbersOnly, parseMatrixSymbolic, parseNumberOrThrow } from './parse'

describe(parseComplexOrThrow.name, () => {
  test('bad syntax', () => {
    expect(() => parseComplexOrThrow('aaa')).toThrow(ParseError)
    expect(() => parseComplexOrThrow('x')).toThrow(ParseError)
    expect(() => parseComplexOrThrow('   ')).toThrow(ParseError)
  })

  test('correct', () => {
    expect(parseComplexOrThrow('4')).toMatchObject({ re: 4, im: 0 })
    expect(parseComplexOrThrow(' 5 - i')).toMatchObject({ re: 5, im: -1 })
    expect(parseComplexOrThrow('   2i ')).toMatchObject({ re: 0, im: 2 })
  })
})

describe(parseMatrixSymbolic.name, () => {
  test('bad syntax', () => {
    expect(() => parseMatrixSymbolic('aaa')).toThrow(ParseError)
    expect(() => parseMatrixSymbolic('x')).toThrow(ParseError)
    expect(() => parseMatrixSymbolic('   ')).toThrow(ParseError)
    expect(() => parseMatrixSymbolic('  [1, 2, 3], [4, 5, 6]  ')).toThrow(ParseError)
  })

  test('correct', () => {
    expect(parseMatrixSymbolic('[[1, 2], [3, 4]]')).toStrictEqual([[1, 2], [3, 4]])
    expect(parseMatrixSymbolic('(1/2) * [[1, 2], [3, 4]]')).toStrictEqual([[0.5, 1], [1.5, 2]])
    expect(parseMatrixSymbolic('  [ [ 0 ] ]  ')).toStrictEqual([[0]])
  })
})

describe(parseMatrixNumbersOnly.name, () => {
  test('bad syntax', () => {
    expect(() => parseMatrixNumbersOnly('1 2 3\n2 3')).toThrow(ParseError)
    expect(() => parseMatrixNumbersOnly('')).toThrow(ParseError)
    expect(() => parseMatrixNumbersOnly('   ')).toThrow(ParseError)
    expect(() => parseMatrixNumbersOnly('1 2 3\n2 3 a')).toThrow(ParseError)
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
    expect(() => parseNumberOrThrow('1 2 3\n2 3')).toThrow(ParseError)
    expect(() => parseNumberOrThrow('')).toThrow(ParseError)
    expect(() => parseNumberOrThrow('   ')).toThrow(ParseError)
    expect(() => parseNumberOrThrow('x')).toThrow(ParseError)
    expect(() => parseNumberOrThrow('sqrt(2)')).toThrow(ParseError)
  })

  test('correct', () => {
    expect(parseNumberOrThrow(' 4 ')).toBe(4)
    expect(parseNumberOrThrow('  4.5')).toBe(4.5)
    expect(parseNumberOrThrow(' -1 ')).toBe(-1)
  })
})
