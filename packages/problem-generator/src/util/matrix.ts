import _ from 'lodash'
import { equalClose } from './misc'

export function createMatrix (n: number, m: number, fn?: () => number): number[][] {
  fn ??= () => _.random(-5, 5)
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

export function rowLinearCombination (matrix: number[][], row0: number, row1: number, factor?: number): number[] {
  const result = [...matrix[row0]]
  factor ??= _.random(-2, 2)
  for (let i = 0; i < matrix[row0].length; i++) {
    result[i] += factor * matrix[row1][i]
  }

  return result
}
