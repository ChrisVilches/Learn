import { z } from 'zod'
import { computeMatrixRank } from '../python-binding'
import { createMatrix, matrixToSimpleText, matrixToTex } from '../util/matrix'
import { parseNumberOrThrow } from '../util/parse'
import { randInt } from '../util/random'
import { type SolutionVerdict } from '../types/solution'
import { type Problem, type ProblemGenerator } from '../types/problem'

// TODO: Unit test some examples

// TODO: Almost all examples have full rank.
//       It's necessary to make some vectors linearly dependent to reduce the rank
//       and have some problems with different answers.

const problemSchema = z.object({ correctAnswer: z.number() })

export async function buildMatrixProblem (A: number[][]): Promise<Problem> {
  const correctAnswer = await computeMatrixRank(A)
  return {
    tex: `Rank${matrixToTex(A)}`,
    content: { correctAnswer },
    debugInformation: matrixToSimpleText(A)
  }
}

export const matrixRank: ProblemGenerator = {
  fromDifficulty: async function (difficulty: number): Promise<Problem> {
    const A = createMatrix(10, 10, () => randInt(2, 10))
    return await buildMatrixProblem(A)
  },

  checkSolution: function (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>): SolutionVerdict {
    if (parseNumberOrThrow(givenSolution) === correctAnswer) {
      return 'ok'
    }

    return 'incorrect'
  },
  freeInput: true,
  choiceAnswers: [],
  problemContentParser: problemSchema
}
