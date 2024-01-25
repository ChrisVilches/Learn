import { z } from 'zod'
import { computeMatrixRank } from '../python-binding'
import { createMatrix, matrixToTex } from '../util/matrix'
import { parseNumberOrThrow } from '../util/misc'
import { randInt } from '../util/random'
import { type SolutionVerdict } from '../types/solution'
import { type Problem, type ProblemGenerator } from '../types/problem'

// TODO: Almost all examples have full rank.
//       It's necessary to make some vectors linearly dependent to reduce the rank
//       and have some problems with different answers.

const problemSchema = z.object({ correctAnswer: z.number() })

export const matrixRank: ProblemGenerator = {
  fromDifficulty: async function (difficulty: number): Promise<Problem> {
    const A = createMatrix(10, 10, () => randInt(2, 10))
    const correctAnswer = await computeMatrixRank(A)
    return {
      tex: `Rank${matrixToTex(A)}`,
      content: { correctAnswer },
      debugInformation: A.toString()
    }
  },
  // TODO: A nice way to improve the zod boilerplate would be to pass the schema
  //       to the ProblemGenerator keys. That way, I can parse the solution
  //       from the webapp driver.
  checkSolution: function (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>): SolutionVerdict {
    if (parseNumberOrThrow(givenSolution) === correctAnswer) {
      return 'ok'
    }

    return 'incorrect'
  },

  problemContentParser: problemSchema
}
