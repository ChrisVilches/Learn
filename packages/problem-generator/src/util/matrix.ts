import { SolutionParseError } from '../types/errors'
import { randInt } from './random'
import { equalClose } from './misc'
import { parseNumberOrThrow } from './parse'

export function createMatrix (n: number, m: number, fn?: () => number): number[][] {
  fn ??= () => randInt(-5, 5)
  const result: number[][] = []

  for (let i = 0; i < n; i++) {
    const row: number[] = []
    for (let j = 0; j < m; j++) {
      row.push(fn())
    }
    result.push(row)
  }

  return result
}

export function matrixToTex (matrix: number[][]): string {
  const result = matrix.map(row => row.join(' & ')).join('\\\\')
  return `\\begin{pmatrix}${result}\\end{pmatrix}`
}

export function matrixToSimpleText (matrix: number[][]): string {
  return matrix.map(row => row.join(' ')).join('\n')
}

const oneOrMultipleSpaces = /\s+/

export function parseMatrixNumeric (matrix: string): number[][] {
  matrix = matrix.trim()
  const rows = matrix.split('\n')
  const result: number[][] = []
  let m: number | null = null

  for (const row of rows) {
    const cells = row.split(oneOrMultipleSpaces)
    m ??= cells.length
    if (cells.length !== m) {
      throw new SolutionParseError('Matrix column count does not match')
    }

    result.push(cells.map(parseNumberOrThrow))
  }

  return result
}

export function matrixEqual (matrix1: number[][], matrix2: number[][]): boolean {
  if (matrix1.length !== matrix2.length) return false

  for (let i = 0; i < matrix1.length; i++) {
    if (matrix1[i].length !== matrix2[i].length) return false

    for (let j = 0; j < matrix1[i].length; j++) {
      if (!equalClose(matrix1[i][j], matrix2[i][j])) return false
    }
  }

  return true
}
