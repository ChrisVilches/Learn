import { det, inv } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { createMatrix, matrixEqual, matrixToSimpleText, matrixToTex, parseMatrixNumeric } from '../util/matrix'
import { z } from 'zod'
import { type SolutionVerdict } from '../types/solution'
import { equalClose } from '../util/misc'
import { parseMatrixAuto } from '../util/parse'

const problemSchema = z.object({
  correctAnswer: z.string().transform(parseMatrixNumeric),
  invertible: z.boolean()
})

const solutionSchema = z.literal('non-invertible').or(
  z.string().transform(parseMatrixAuto)
)

function isInvertible (A: number[][]): boolean {
  return !equalClose(det(A), 0)
}

export function buildMatrixProblem (A: number[][]): Problem {
  const invertible = isInvertible(A)
  const correctAnswer = invertible ? inv(A) : null

  return {
    tex: `${matrixToTex(A)}^{-1}`,
    debugInformation: matrixToSimpleText(A),
    content: {
      correctAnswer: correctAnswer !== null ? matrixToSimpleText(correctAnswer) : '0',
      invertible
    }
  }
}

export const matrixInversion: ProblemGenerator = {
  fromDifficulty: function (difficulty: number): Problem {
    const A = createMatrix(2, 2)
    return buildMatrixProblem(A)
  },
  checkSolution: function (givenSolution: string, { invertible, correctAnswer }: z.infer<typeof problemSchema>): SolutionVerdict {
    const solution = solutionSchema.parse(givenSolution)

    if (solution === 'non-invertible') {
      return invertible ? 'incorrect' : 'ok'
    }

    if (invertible && matrixEqual(solution, correctAnswer ?? [])) {
      return 'ok'
    }

    return 'incorrect'
  },
  freeInput: true,
  choiceAnswers: [{
    label: 'Non-invertible',
    result: 'non-invertible'
  }],
  problemContentParser: problemSchema
}
