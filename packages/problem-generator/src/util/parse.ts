import { type Complex, type MathNode, parse, complex, evaluate } from 'mathjs'
import { ParseError } from '../types/errors'
import { isComplex } from './misc'
import { z } from 'zod'

const complexParseErrorMsg = 'Cannot parse complex number'

export const parseComplexOrThrow = (s: string): Complex => {
  if (s.trim().length === 0) {
    throw new ParseError(complexParseErrorMsg)
  }

  try {
    const z = parseMathOrThrow(`${s} + 0i`).evaluate({ i: complex('i') })
    if (isComplex(z)) {
      return z
    }
  } catch {}

  throw new ParseError(complexParseErrorMsg)
}

export function parseMatrixAuto (s: string): number[][] {
  if (s.includes('[') || s.includes(',')) {
    return parseMatrixSymbolic(s)
  }
  return parseMatrixNumbersOnly(s)
}

export function parseMatrixSymbolic (m: string): number[][] {
  try {
    return z.object({ _data: z.array(z.array(z.number())) }).parse(evaluate(m))._data
  } catch {
    throw new ParseError('Cannot parse matrix')
  }
}

const oneOrMultipleSpaces = /\s+/

export function parseMatrixNumbersOnly (matrix: string): number[][] {
  matrix = matrix.trim()
  const rows = matrix.split('\n')
  const result: number[][] = []
  const n = rows.length
  let m: number | null = null

  for (const row of rows) {
    const cells = row.split(oneOrMultipleSpaces)
    m ??= cells.length
    if (cells.length !== m) {
      throw new ParseError('Matrix column count does not match')
    }

    result.push(cells.map(parseNumberOrThrow))
  }

  if (n === 0 || m === 0) {
    throw new ParseError('Matrix cannot be empty')
  }

  return result
}

export function parseNumberOrThrow (s: string): number {
  try {
    return z.string().trim().min(1).transform(Number).pipe(z.number()).parse(s)
  } catch {
    throw new ParseError(`Cannot convert '${s}' to number`)
  }
}

export function parseMathOrThrow (s: string): MathNode {
  try {
    if (s.trim().length === 0) {
      throw new Error()
    }

    return parse(s)
  } catch {
    throw new ParseError(`Cannot parse (mathjs): ${s}`)
  }
}
