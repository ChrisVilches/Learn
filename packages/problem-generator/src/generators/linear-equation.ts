import { type MathNode, parse } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { z } from 'zod'
import { equalClose, implicitMultiplication } from '../util/misc'
import { parseMathOrThrow } from '../util/parse'
import _ from 'lodash'
import { formatSumTerms } from '../util/algebra'

const solutionSchema = z.literal('multiple').or(z.literal('none')).or(z.string().transform(parseMathOrThrow))

const isSolution = (leftSide: MathNode, rightSide: MathNode, x: number): boolean => {
  return equalClose(dist(leftSide, rightSide, x), 0)
}

const dist = (leftSide: MathNode, rightSide: MathNode, x: number): number => {
  return Math.abs(leftSide.evaluate({ x }) - rightSide.evaluate({ x }))
}

const hasInfiniteSolutions = (leftSide: MathNode, rightSide: MathNode): boolean => {
  return isSolution(leftSide, rightSide, -1) && isSolution(leftSide, rightSide, 1)
}

const hasNoSolution = (leftSide: MathNode, rightSide: MathNode): boolean => {
  const dist1 = dist(leftSide, rightSide, -1)
  const dist2 = dist(leftSide, rightSide, 1)
  return equalClose(dist1, dist2)
}

const problemSchema = z.object({
  solutionType: z.literal('multiple').or(z.literal('none')).or(z.literal('single')),
  leftSide: z.string().transform(s => parse(s)),
  rightSide: z.string().transform(s => parse(s))
})

export const linearEquation: ProblemGenerator = {
  fromDifficulty: function (difficulty: number): Problem | Promise<Problem> {
    return linearEquationProblemFromParameters(_.random(-3, 3), _.random(-3, 3), _.random(-3, 3), _.random(-3, 3))
  },
  // TODO: Is there a way to pass a non-string object here? It's a bit trash
  //       It (the change) has to be applied for all problems.
  // Yes, I can modify the API so that givenSolution is parsed by the driver (similar to the problem content)
  // and the interface can be "any", therefore the solution simply gets parsed, and I can set any type here.
  checkSolution: (givenSolution: string, { solutionType, leftSide, rightSide }: z.infer<typeof problemSchema>) => {
    const solution = solutionSchema.parse(givenSolution)

    if (solutionType === 'multiple') {
      return solution === 'multiple' ? 'ok' : 'incorrect'
    }

    if (solutionType === 'none') {
      return solution === 'none' ? 'ok' : 'incorrect'
    }

    if (solution === 'multiple' || solution === 'none') return 'incorrect'

    return isSolution(leftSide, rightSide, z.number().parse(solution.evaluate())) ? 'ok' : 'incorrect'
  },

  freeInput: true,
  choiceAnswers: [
    {
      label: 'Infinite solutions',
      result: 'multiple'
    },
    {
      label: 'No solutions',
      result: 'none'
    }
  ],

  problemContentParser: problemSchema
}

function getSolutionType (leftSide: MathNode, rightSide: MathNode): z.infer<typeof problemSchema>['solutionType'] {
  if (hasInfiniteSolutions(leftSide, rightSide)) {
    return 'multiple'
  } else if (hasNoSolution(leftSide, rightSide)) {
    return 'none'
  } else {
    return 'single'
  }
}

export function linearEquationProblemFromParameters (m0: number, b0: number, m1: number, b1: number): Problem {
  const leftTerms = _.shuffle([{ coef: m0, mult: 'x' }, { coef: b0, mult: '' }])
  const rightTerms = _.shuffle([{ coef: m1, mult: 'x' }, { coef: b1, mult: '' }])

  const leftSide = parse(formatSumTerms(leftTerms))
  const rightSide = parse(formatSumTerms(rightTerms))

  return {
    tex: `${implicitMultiplication(leftSide).toTex()} = ${implicitMultiplication(rightSide).toTex()}`,
    debugInformation: `${leftSide.toString()} = ${rightSide.toString()}`,
    content: {
      leftSide: leftSide.toString(),
      rightSide: rightSide.toString(),
      solutionType: getSolutionType(leftSide, rightSide)
    }
  }
}
