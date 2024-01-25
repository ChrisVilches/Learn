import { type MathNode, parse } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { randInt } from '../util/random'
import { z } from 'zod'

type LinearEquationSolution = { type: 'multiple' } | { type: 'none' } | { type: 'single', value: number }

function parseSolution (s: string): LinearEquationSolution {
  if (s === 'multiple' || s === 'none') {
    return { type: s }
  }

  // TODO: Should be a parseInt that throws error if it's invalid. UPDATE: I use parse/evaluate now.
  return {
    type: 'single',
    value: parse(s).evaluate()
  }
}

// TODO: Insane boilerplate. At least move it to an equation util file for linear equations.
//       (it doesn't work for quadratic or other types, specifically the 'noSolution' one)
const isSolution = (leftSide: MathNode, rightSide: MathNode, x: number): boolean => {
  const eps = 1e-6 // TODO: Set a correct EPS
  return dist(leftSide, rightSide, x) < eps
}

const dist = (leftSide: MathNode, rightSide: MathNode, x: number): number => {
  return Math.abs(leftSide.evaluate({ x }) - rightSide.evaluate({ x }))
}

const hasInfiniteSolutions = (leftSide: MathNode, rightSide: MathNode): boolean => {
  return isSolution(leftSide, rightSide, -1) && isSolution(leftSide, rightSide, 1)
}

const hasNoSolution = (leftSide: MathNode, rightSide: MathNode): boolean => {
  // TODO: Refactor. Create an "isApproximate" function, set a correct EPS, etc.
  return Math.abs(dist(leftSide, rightSide, -1) - dist(leftSide, rightSide, 1)) < 1e-6
}

const problemSchema = z.object({
  solutionType: z.string(), // TODO: Should be multiple|none|single
  leftSide: z.string().transform(s => parse(s)),
  rightSide: z.string().transform(s => parse(s))
})

export const linearEquation: ProblemGenerator = {
  fromDifficulty: function (difficulty: number): Problem | Promise<Problem> {
    return linearEquationProblemFromParameters(randInt(-3, 3), randInt(-3, 3), randInt(-3, 3), randInt(-3, 3))
  },
  // TODO: Is there a way to pass a non-string object here? It's a bit trash
  //       It (the change) has to be applied for all problems.
  checkSolution: (givenSolution: string, { solutionType, leftSide, rightSide }: z.infer<typeof problemSchema>) => {
    const solution = parseSolution(givenSolution)

    if (solutionType !== solution.type) return 'incorrect'

    if (solution.type === 'single' && !isSolution(leftSide, rightSide, solution.value)) {
      return 'incorrect'
    }

    return 'ok'
  },

  problemContentParser: problemSchema
}

export function linearEquationProblemFromParameters (m0: number, b0: number, m1: number, b1: number): Problem {
  const leftSide = parse(`${m0}x + ${b0}`)
  const rightSide = parse(`${m1}x + ${b1}`)

  let solutionType: string
  if (hasInfiniteSolutions(leftSide, rightSide)) {
    solutionType = 'multiple'
  } else if (hasNoSolution(leftSide, rightSide)) {
    solutionType = 'none'
  } else {
    solutionType = 'single'
  }

  return {
    tex: `${leftSide.toTex()} = ${rightSide.toTex()}`,
    debugInformation: `${leftSide.toString()} = ${rightSide.toString()}`,
    content: {
      // TODO: Not sure if it's actually necessary to use toString() here.
      leftSide: leftSide.toString(),
      rightSide: rightSide.toString(),
      solutionType
    }
  }
}

export function linearEquationProblemFromDifficulty (difficulty: number): Problem {
  return linearEquationProblemFromParameters(randInt(-3, 3), randInt(-3, 3), randInt(-3, 3), randInt(-3, 3))
}
