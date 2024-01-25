import { type Matrix, add, matrix, multiply, subtract } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { createMatrix, matrixEqual, matrixToTex, parseMatrix } from '../util/matrix'
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
  correctAnswer: z.string().transform(parseMatrix)
})

export const matrixBasic: ProblemGenerator = {
  fromDifficulty: async function (difficulty: number): Promise<Problem> {
    // TODO: Note, when matrix is multiplied, dimensions have to be specified carefully.
    const A = createMatrix(2, 2)
    const B = createMatrix(2, 2)
    const op = arraySample(binaryMatrixOperator)

    // TODO: I should compute the correct answer using the MathJS functions.
    // TODO: This is trash:
    const correctAnswer: number[][] = computeResult(A, B, op).toJSON().data

    const opFormat = op === '*' ? '' : ` ${op} `

    return {
      tex: `${matrixToTex(A)}${opFormat}${matrixToTex(B)}`,
      debugInformation: `A ${op} B`, // TODO: a bit too simple.
      content: {
        // TODO: Does this work?
        correctAnswer: correctAnswer.toString()
      }
    }
  },

  checkSolution: (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>) => {
    const givenMatrix = parseMatrix(givenSolution)
    if (matrixEqual(givenMatrix, correctAnswer)) {
      return 'ok'
    }

    return 'incorrect'
  },

  problemContentParser: problemSchema
}
