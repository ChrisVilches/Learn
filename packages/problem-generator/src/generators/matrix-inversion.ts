import { det, inv } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { createMatrix, matrixEqual, matrixToTex, parseMatrix } from '../util/matrix'
import { z } from 'zod'
import { type SolutionVerdict } from '../types/solution'

interface InvertibleMatrixSolution {
  type: 'invertible'
  value: number[][]
}

type MatrixInversionSolution = InvertibleMatrixSolution | { type: 'non-invertible' }

const problemSchema = z.object({
  correctAnswer: z.string().transform(parseMatrix),
  invertible: z.boolean()
})

// TODO: parseMatrix should throw error, I think. Ensure it happens.
// TODO: I can parse this with zod as well.
// TODO: I can parse other solutions with zod as well (other files). But maybe not matrices.
function parseSolution (s: string): MatrixInversionSolution {
  if (s === 'non-invertible') {
    return { type: 'non-invertible' }
  }

  return {
    type: 'invertible',
    value: parseMatrix(s)
  }
}

function isInvertible (A: number[][]): boolean {
  // TODO: This EPS might be a bit too small. Or no??
  return Math.abs(det(A)) > 1e-6
}

export const matrixInversion: ProblemGenerator = {
  fromDifficulty: function (difficulty: number): Problem | Promise<Problem> {
    const A = createMatrix(2, 2)
    const invertible = isInvertible(A)
    const correctAnswer = invertible ? inv(A) : null

    return {
      tex: `${matrixToTex(A)}^{-1}`,
      debugInformation: A.toString(),
      content: {
        correctAnswer: correctAnswer?.toString(),
        invertible
      }
    }
  },
  checkSolution: function (givenSolution: string, { invertible, correctAnswer }: z.infer<typeof problemSchema>): SolutionVerdict {
    const solution = parseSolution(givenSolution)

    if (solution.type === 'non-invertible' && !invertible) {
      return 'ok'
    }

    if (solution.type === 'invertible' && invertible && matrixEqual(solution.value, correctAnswer ?? [])) {
      return 'ok'
    }

    return 'incorrect'
  },

  problemContentParser: problemSchema
}
