import { parse, derivative, type MathNode, simplify } from 'mathjs'
import { checkProblemSolutionSymbolicOrValues, createPolynomial } from '../util/misc'
import { z } from 'zod'
import { type ProblemGenerator } from '../types/problem'

// TODO: Maybe I can just use this:
//       https://mathjs.org/docs/core/serialization.html
//       (instead of zod). Does it work with MathNode?
//       Or perhaps I can use both, but I don't know if that's better or worse.
//       i.e. transform(mathjs.revive) (pseudocode)

const problemSchema = z.object({
  correctAnswer: z.string().transform(s => parse(s))
})

export const singleVariableDerivative: ProblemGenerator = {
  fromDifficulty: (difficulty: number) => {
    // TODO: Maybe I can do a Jacobian problem as well (or vectorial function derivative).
    let statement: MathNode
    let correctAnswer: MathNode

    if (difficulty < 50) {
      const statementString = createPolynomial(2)
      statement = parse(statementString)
      correctAnswer = derivative(statement, 'x', { simplify: true })
    } else {
      statement = parse(`sin(${createPolynomial(1)})`)
      correctAnswer = derivative(statement, 'x', { simplify: true })
    }

    statement = simplify(statement)

    return {
      debugInformation: statement.toString(),
      tex: `\\dfrac{d}{dx}~${statement.toTex()}`,
      content: {
        correctAnswer: correctAnswer.toString()
      }
    }
  },

  checkSolution: (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>) => {
    return checkProblemSolutionSymbolicOrValues(givenSolution, correctAnswer)
  },

  problemContentParser: problemSchema
}
