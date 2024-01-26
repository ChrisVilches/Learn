import { parse } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { randInt } from '../util/random'
import { equalClose } from '../util/misc'
import { isFunctionLinear, isSolution, parabolaHasRepeatedSolutions } from '../util/equations'
import { z } from 'zod'
import { parseComplexNumbers } from '../util/parse'

// TODO: This doesn't work properly. It still multiplies by 1 xd
function ensureSign (x: number): string {
  if (x < 0) {
    return String(x)
  }

  if (x === 0) {
    return ''
  }

  return `+${x}`
}

const problemSchema = z.object({
  solutionsRepeated: z.boolean(),
  equation: z.string().transform(s => parse(s))
})

export function quadraticEquationProblemFromVertex (a: number, h: number, k: number): Problem {
  // TODO: The display of the statement is a bit buggy (e.g. multiplication by 1)
  const equation = parse(`${(ensureSign(a))} (x${ensureSign(-h)})^2 ${ensureSign(k)}`)

  const compiled = equation.compile()

  // TODO: This never throws, but the reason is because the 0 gets removed by the `ensureSign`,
  //       which is buggy anyway. So this will throw one day.
  //       Equations have to be built by avoiding making them linear.
  //       Also, all generation methods have to test this, and avoid creating linear equations.
  if (isFunctionLinear((x: number) => compiled.evaluate({ x }))) {
    throw new Error('Quadratic equation ended up being linear')
  }

  return {
    tex: `f(x) = ${equation.toTex()}`,
    content: {
      solutionsRepeated: parabolaHasRepeatedSolutions(equation),
      equation: equation.toString()
    },
    debugInformation: equation.toString()
  }
}

function ensureAtLeastTwo<T> (arr: T[]): T[] {
  if (arr.length === 1) return [arr[0], arr[0]]
  return arr
}

const convertZeroToOne = (value: number): number => value === 0 ? 1 : value

export const quadraticEquation: ProblemGenerator = {
  fromDifficulty: (difficulty: number) => {
    const a = convertZeroToOne(randInt(-5, 5))
    const h = randInt(-5, 5)
    const k = randInt(-5, 5)
    return quadraticEquationProblemFromVertex(a, h, k)
  },
  checkSolution: (givenSolution: string, { equation, solutionsRepeated }: z.infer<typeof problemSchema>) => {
    const solutions = ensureAtLeastTwo(parseComplexNumbers(givenSolution))

    if (solutions.length !== 2) return 'incorrect'

    const [x0, x1] = solutions

    if (!solutionsRepeated && equalClose(x0, x1)) {
      return 'incorrect'
    }

    if (isSolution(equation, x0) && isSolution(equation, x1)) {
      return 'ok'
    }

    return 'incorrect'
  },

  freeInput: true,
  choiceAnswers: [],
  problemContentParser: problemSchema
}
