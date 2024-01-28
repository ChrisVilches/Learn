import { parse } from 'mathjs'
import { type ProblemGenerator, type Problem } from '../types/problem'
import { equalClose, implicitMultiplication } from '../util/misc'
import { isFunctionLinear, isSolution, parabolaHasRepeatedSolutions } from '../util/equations'
import { z } from 'zod'
import { parseComplexOrThrow } from '../util/parse'
import _ from 'lodash'
import { formatSumTerms } from '../util/algebra'

const problemSchema = z.object({
  solutionsRepeated: z.boolean(),
  equation: z.string().transform(s => parse(s))
})

export function quadraticEquationProblemFromVertex (a: number, h: number, k: number): Problem {
  const inner = formatSumTerms([{ mult: 'x', coef: 1 }, { mult: '', coef: -h }], { parenthesis: true })
  const squared = `${inner}^2`
  const firstTerm = { coef: a, mult: squared }
  const secondTerm = { coef: k, mult: '' }
  const equation = parse(formatSumTerms(_.shuffle([firstTerm, secondTerm])))

  const compiled = equation.compile()

  if (isFunctionLinear((x: number) => compiled.evaluate({ x }))) {
    throw new Error('Quadratic equation ended up being linear')
  }

  return {
    tex: `f(x) = ${implicitMultiplication(equation).toTex()}`,
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
    const a = convertZeroToOne(_.random(-5, 5))
    const h = _.random(-5, 5)
    const k = _.random(-5, 5)
    return quadraticEquationProblemFromVertex(a, h, k)
  },
  checkSolution: (givenSolution: string, { equation, solutionsRepeated }: z.infer<typeof problemSchema>) => {
    const solutions = ensureAtLeastTwo(givenSolution.split(',').map(parseComplexOrThrow))

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
