import { type Matrix, evaluate } from 'mathjs'
import { SolutionParseError } from '../types/errors'
import { randInt } from './random'
import { parseNumberOrThrow } from './misc'

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
  let result = ''

  // TODO: Make it more functional style.
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (j !== 0) result += ' & '
      result += matrix[i][j]
    }
    // TODO: a trailing one is being added. Not very good but works probably???
    result += '\\\\'
  }

  return `\\begin{pmatrix}${result}\\end{pmatrix}`
}

// TODO: This function is dangerous. It may not evaluate to a matrix.
//       I think I have to do a second check myself.
function parseMatrixMathJS (matrix: string): Matrix {
  return evaluate(matrix)
}

const oneOrMultipleSpaces = /\s+/

export function parseMatrix (matrix: string): number[][] {
  if (matrix.includes('[')) {
    return parseMatrixMathJS(matrix).toJSON().data
  }

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

// TODO: Too long
export function matrixEqual (matrix1: number[][], matrix2: number[][], eps = 0): boolean {
  if (matrix1.length !== matrix2.length) {
    return false
  }

  for (let i = 0; i < matrix1.length; i++) {
    if (matrix1[i].length !== matrix2[i].length) {
      return false
    }

    for (let j = 0; j < matrix1[i].length; j++) {
      const diff = matrix1[i][j] - matrix2[i][j]
      if (Math.abs(diff) > eps) {
        return false
      }
    }
  }
  return true
}
