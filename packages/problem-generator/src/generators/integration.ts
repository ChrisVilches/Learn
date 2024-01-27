import { parse, derivative, type MathNode, simplify } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { implicitMultiplication, multipleEvalEqual, symbolicEqual } from '../util/misc'
import { z } from 'zod'
import { createPolynomial } from '../util/algebra'

const problemSchema = z.object({
  correctAnswer: z.string().transform(s => parse(s))
})

export const integration: ProblemGenerator = {
  fromDifficulty: async function (difficulty: number): Promise<Problem> {
    return integrationProblemFromResultExpression(createPolynomial(3, { omitDegrees: [0] }))
  },

  checkSolution: (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>) => {
    const constants = { c: 0, C: 0 }
    const correct = symbolicEqual(givenSolution, correctAnswer) || multipleEvalEqual(givenSolution, correctAnswer, constants)
    return correct ? 'ok' : 'incorrect'
  },

  freeInput: true,
  choiceAnswers: [],

  problemContentParser: problemSchema
}

export function integrationProblemFromResultExpression (resultExpression: string): Problem {
  const result: MathNode = parse(resultExpression)

  const statement = derivative(result, 'x', { simplify: true })
  const correctAnswer = simplify(result)

  return {
    tex: `\\int{${implicitMultiplication(statement).toTex()}~ dx}`,
    content: { correctAnswer: correctAnswer.toString() },
    debugInformation: statement.toString()
  }
}
