import { type MathNode, parse } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { randInt } from '../util/random'
import { z } from 'zod'
import { equalClose } from '../util/misc'

const solutionSchema = z.literal('multiple').or(z.literal('none')).or(z.number())

// TODO: Insane boilerplate. At least move it to an equation util file for linear equations.
//       (it doesn't work for quadratic or other types, specifically the 'noSolution' one)
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
    return linearEquationProblemFromParameters(randInt(-3, 3), randInt(-3, 3), randInt(-3, 3), randInt(-3, 3))
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

    return isSolution(leftSide, rightSide, solution) ? 'ok' : 'incorrect'
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
  const leftSide = parse(`${m0}x + ${b0}`)
  const rightSide = parse(`${m1}x + ${b1}`)

  return {
    tex: `${leftSide.toTex()} = ${rightSide.toTex()}`,
    debugInformation: `${leftSide.toString()} = ${rightSide.toString()}`,
    content: {
      leftSide: leftSide.toString(),
      rightSide: rightSide.toString(),
      solutionType: getSolutionType(leftSide, rightSide)
    }
  }
}

export function linearEquationProblemFromDifficulty (difficulty: number): Problem {
  return linearEquationProblemFromParameters(randInt(-3, 3), randInt(-3, 3), randInt(-3, 3), randInt(-3, 3))
}
