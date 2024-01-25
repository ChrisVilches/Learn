import { parse } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { randInt } from '../util/random'
import { equalClose, parseComplexNumbers } from '../util/misc'
import { isSolution, parabolaHasRepeatedSolutions } from '../util/equations'
import { z } from 'zod'

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

// TODO: I don't know where these TODOs belong to.
// TODO: How to check when a linear equation has no solution????
//       Maybe I should just generate the equation using my own methods (not math.js)
// TODO: Constructor has to be expanded. Add "Standard Form" and "Factored Form", and create
//       constructor that uses the difficulty value.
export function quadraticEquationProblemFromVertex (a: number, h: number, k: number): Problem {
  if (a === 0) {
    // TODO: Is this rule OK? Remember that this is the vertex form, not the standard form,
    //       so maybe it's different. (In standard form, it also cannot be 0)
    throw new Error('Parameter a cannot be 0')
  }
  // TODO: The display of the statement is a bit buggy (e.g. multiplication by 1)
  const equation = parse(`${(ensureSign(a))} (x${ensureSign(-h)})^2 ${ensureSign(k)}`)

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

export const quadraticEquation: ProblemGenerator = {
  fromDifficulty: (difficulty: number) => {
    const a = randInt(-5, 5) // TODO: This cannot be 0!!!!
    const h = randInt(-5, 5) // TODO: Maybe other numbers also cannot be zero? Check
    const k = randInt(-5, 5)
    return quadraticEquationProblemFromVertex(a, h, k)
  },
  checkSolution: (givenSolution: string, { equation, solutionsRepeated }: z.infer<typeof problemSchema>) => {
    // TODO: This should throw parse error.
    //       Hopefully make the UI have two inputs.
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

  problemContentParser: problemSchema
}
