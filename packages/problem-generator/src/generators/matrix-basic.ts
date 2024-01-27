import { type Matrix, add, matrix, multiply, subtract } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { createMatrix, matrixEqual, matrixToTex } from '../util/matrix'
import { z } from 'zod'
import { parseMatrixNumbersOnly } from '../util/parse'
import _ from 'lodash'

const binaryMatrixOperator = ['+', '-', '*'] as const
type BinaryMatrixOperator = typeof binaryMatrixOperator[number]

function computeResult (matrix1: number[][], matrix2: number[][], op: BinaryMatrixOperator): Matrix {
  switch (op) {
    case '*':
      return multiply(matrix(matrix1), matrix(matrix2))
    case '+':
      return add(matrix(matrix1), matrix(matrix2))
    case '-':
      return subtract(matrix(matrix1), matrix(matrix2))
  }
}

const problemSchema = z.object({
  correctAnswer: z.string().transform(m => JSON.parse(m)).pipe(z.array(z.array(z.number())))
})

export function buildMatrixProblem (A: number[][], B: number[][], op: BinaryMatrixOperator): Problem {
  const correctAnswer: number[][] = computeResult(A, B, op).toJSON().data
  const opFormat = op === '*' ? '' : ` ${op} `

  return {
    tex: `${matrixToTex(A)}${opFormat}${matrixToTex(B)}`,
    debugInformation: `A ${op} B`,
    content: {
      correctAnswer: JSON.stringify(correctAnswer)
    }
  }
}

function randomSameSize (): [number, number, number, number] {
  const n = _.random(2, 3)
  const m = _.random(2, 3)
  return [n, m, n, m]
}

function randomMultSize (): [number, number, number, number] {
  const same = _.random(2, 3)
  const a = _.random(2, 3)
  const b = _.random(2, 3)
  return [a, same, same, b]
}

export const matrixBasic: ProblemGenerator = {
  fromDifficulty: function (difficulty: number): Problem {
    const op = _.sample(binaryMatrixOperator)

    const [n0, m0, n1, m1] = op === '*' ? randomMultSize() : randomSameSize()

    const A = createMatrix(n0, m0)
    const B = createMatrix(n1, m1)
    return buildMatrixProblem(A, B, op)
  },
  freeInput: true,
  choiceAnswers: [],
  checkSolution: (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>) => {
    const givenMatrix = parseMatrixNumbersOnly(givenSolution)

    if (matrixEqual(givenMatrix, correctAnswer)) {
      return 'ok'
    }

    return 'incorrect'
  },

  problemContentParser: problemSchema
}
