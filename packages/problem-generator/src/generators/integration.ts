import { parse, derivative, type MathNode, simplify } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { checkProblemSolutionSymbolicOrValues, createPolynomial, implicitMultiplication } from '../util/misc'
import { z } from 'zod'

const problemSchema = z.object({
  correctAnswer: z.string().transform(s => parse(s))
})

export const integration: ProblemGenerator = {
  fromDifficulty: async function (difficulty: number): Promise<Problem> {
    return integrationProblemFromResultExpression(createPolynomial(3))
  },

  checkSolution: (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>) => {
    // TODO: For some reason it doesn't work in the CLI app. Test later on the React app
    // The reason is that sometimes the result polynomial has a constant value which
    // shouldn't be in the solution. Polynomials have to be generated without that
    // last coefficient, and then it'd work.

    return checkProblemSolutionSymbolicOrValues(givenSolution, correctAnswer, { c: 0, C: 0 })
  },

  problemContentParser: problemSchema
}

export function integrationProblemFromResultExpression (resultExpression: string): Problem {
  const result: MathNode = parse(resultExpression)

  const statement = derivative(result, 'x')
  const correctAnswer = simplify(result)

  return {
    tex: `\\int{${implicitMultiplication(statement).toTex()}~ dx}`,
    content: { correctAnswer: correctAnswer.toString() },
    debugInformation: statement.toString()
  }
}
