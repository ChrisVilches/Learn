import { parse, derivative, type MathNode, simplify } from 'mathjs'
import { checkProblemSolutionSymbolicOrValues, createPolynomial } from '../util/misc'
import { z } from 'zod'
import { type ProblemGenerator } from '../types/problem'

const problemSchema = z.object({
  correctAnswer: z.string().transform(s => parse(s))
})

export const singleVariableDerivative: ProblemGenerator = {
  fromDifficulty: (difficulty: number) => {
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

  freeInput: true,
  choiceAnswers: [],

  problemContentParser: problemSchema
}
