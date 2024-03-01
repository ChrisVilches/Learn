import { type ProblemGenerator, type Problem } from '../types/problem'
import { z } from 'zod'
import { BoolSymbol } from './boolean-algebra/bool-symbol'
import { AndOp, IffOp, ImplyOp, OrOp, XorOp } from './boolean-algebra/binary-op'
import { NotOp } from './boolean-algebra/unary-op'
import { sample, entries, sortBy } from 'lodash'
import { type BoolNode } from './boolean-algebra/bool-node'

const problemSchema = z.object({
  correctAnswer: z.boolean()
})

const solutionSchema = z.literal('f').or(z.literal('t')).transform(c => c === 't')

function formatInitialValues (values: Record<string, boolean>): string[] {
  return sortBy(entries(values)).map(([name, value]) => `${name} = ${value ? 'true' : 'false'}`)
}

function randomNegate (node: BoolNode): BoolNode {
  if (Math.random() > 0.9) {
    return new NotOp(node)
  }
  return node
}

function randomBinaryOperator (left: BoolNode, right: BoolNode): BoolNode {
  const classes = [AndOp, OrOp, XorOp, IffOp, ImplyOp]
  const RandomClass = sample(classes) ?? classes[0]

  return new RandomClass(left, right)
}

// TODO: (low priority) Maybe I should only use easy operators (and, or) for low difficulty values.
function randomize (depth: number): { root: BoolNode, symbolsUsed: string[] } {
  const symbolsUsed = new Set<string>()
  const availableSymbols = ['p', 'q', 'r']

  const build = (n: number): BoolNode => {
    if (n === 0) {
      const sym = sample(availableSymbols) ?? availableSymbols[0]
      symbolsUsed.add(sym)
      return randomNegate(new BoolSymbol(sym))
    }

    return randomBinaryOperator(build(n - 1), build(n - 1))
  }

  return {
    root: build(depth),
    symbolsUsed: [...symbolsUsed]
  }
}

function depthFromDifficulty (difficulty: number): number {
  if (difficulty < 10) return 1
  if (difficulty < 40) return 2
  if (difficulty < 60) return 3
  return 4
}

export const booleanAlgebra: ProblemGenerator = {
  fromDifficulty: async function (difficulty: number): Promise<Problem> {
    const { root, symbolsUsed } = randomize(depthFromDifficulty(difficulty))
    const values = symbolsUsed.reduce((accum, elem) => ({ ...accum, [elem]: sample([false, true]) }), {})

    const lines = [root.toTex(), ...formatInitialValues(values)]
    const finalTex = `\\begin{gather}${lines.join('\\\\')}\\end{gather}`

    const correctAnswer = root.compute(values)

    return {
      content: { correctAnswer },
      tex: finalTex,
      debugInformation: finalTex
    }
  },

  checkSolution: (givenSolution: string, { correctAnswer }: z.infer<typeof problemSchema>) => {
    const solution = solutionSchema.parse(givenSolution)
    return solution === correctAnswer ? 'ok' : 'incorrect'
  },

  freeInput: false,
  choiceAnswers: [
    {
      label: 'True',
      result: 't'
    },
    {
      label: 'False',
      result: 'f'
    }
  ],

  problemContentParser: problemSchema
}
