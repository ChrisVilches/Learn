import { z } from 'zod'
import { computeMatrixRank } from '../python-binding'
import { createMatrix, matrixToTex, rowLinearCombination } from '../util/matrix'
import { parseNumberOrThrow } from '../util/parse'
import { type SolutionVerdict } from '../types/solution'
import { type Problem, type ProblemGenerator } from '../types/problem'
import _ from 'lodash'

const problemSchema = z.object({ correctAnswer: z.number() })

export async function buildMatrixProblem (A: number[][]): Promise<Problem> {
  const correctAnswer = await computeMatrixRank(A)
  return {
    tex: `Rank${matrixToTex(A)}`,
    content: { correctAnswer },
    debugInformation: JSON.stringify(A)
  }
}

// TODO: Change columns as well (it's a bit harder to implement).
function randomChangeRowToLinearCombination (A: number[][]): void {
  const row0 = _.random(0, A.length - 1)
  const row1 = _.random(0, A.length - 1)
  const targetRow = _.random(0, A.length - 1)
  A[targetRow] = rowLinearCombination(A, row0, row1)
}

function changeRank (A: number[][]): void {
  const changes = _.random(0, 3)
  for (let i = 0; i < changes; i++) {
    randomChangeRowToLinearCombination(A)
  }
}

export const matrixRank: ProblemGenerator = {
  fromDifficulty: async function (difficulty: number): Promise<Problem> {
    const [n, m] = [_.random(2, 4), _.random(2, 4)]
    const A = createMatrix(n, m, () => _.random(-4, 4))
    changeRank(A)

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
