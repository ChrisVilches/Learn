import { parse, derivative, type MathNode, simplify } from 'mathjs'
import { multipleEvalEqual, symbolicEqual } from '../util/misc'
import { z } from 'zod'
import { type ProblemGenerator } from '../types/problem'
import { createPolynomial } from '../util/algebra'

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
    const correct = symbolicEqual(givenSolution, correctAnswer) || multipleEvalEqual(givenSolution, correctAnswer)
    return correct ? 'ok' : 'incorrect'
  },

  freeInput: true,
  choiceAnswers: [],

  problemContentParser: problemSchema
}
