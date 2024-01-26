import { type Matrix, add, matrix, multiply, subtract } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { createMatrix, matrixEqual, matrixToSimpleText, matrixToTex, parseMatrixNumeric } from '../util/matrix'
import { arraySample } from '../util/random'
import { z } from 'zod'

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
  correctAnswer: z.string().transform(parseMatrixNumeric)
})

export function buildMatrixProblem (A: number[][], B: number[][], op: BinaryMatrixOperator): Problem {
  const correctAnswer: number[][] = computeResult(A, B, op).toJSON().data
  const opFormat = op === '*' ? '' : ` ${op} `

  return {
    tex: `${matrixToTex(A)}${opFormat}${matrixToTex(B)}`,
    debugInformation: `A ${op} B`,
    content: {
      correctAnswer: matrixToSimpleText(correctAnswer)
    }
  }
}

export const matrixBasic: ProblemGenerator = {
  fromDifficulty: function (difficulty: number): Problem {
    // TODO: Note, when matrix is multiplied, dimensions have to be specified carefully.
    const A = createMatrix(2, 2)
    const B = createMatrix(2, 2)
    const op = arraySample(binaryMatrixOperator)
    return buildMatrixProblem(A, B, op)
  },
  freeInput: true,
  choiceAnswers: [],
  checkSolution: (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>) => {
    const givenMatrix = parseMatrixNumeric(givenSolution)

    if (matrixEqual(givenMatrix, correctAnswer)) {
      return 'ok'
    }

    return 'incorrect'
  },

  problemContentParser: problemSchema
}
