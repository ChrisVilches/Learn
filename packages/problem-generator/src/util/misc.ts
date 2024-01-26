import { type MathNode, simplify, type EvalFunction, type Complex, OperatorNode, complex } from 'mathjs'
import { SolutionParseError } from '../types/errors'
import { randInt } from './random'
import { type SolutionVerdict } from '../types/solution'
import { parseMathOrThrow } from './parse'

function createSequenceNumbers (length: number, low = -1000, high = 1000): number[] {
  const result: number[] = []
  const step = (high - low) / length
  for (let i = low; i <= high; i += step) {
    result.push(i)
  }
  return result
}

// TODO: I think this doesn't validate if the result will be a proper number
function evaluateOrThrow (fn: EvalFunction, args: Record<string, number>): number {
  try {
    return fn.evaluate(args)
  } catch {
    // TODO: Isn't this error wrong???
    throw new SolutionParseError('Cannot evaluate expression')
  }
}

// TODO: I don't understand the purpose of this function.
export function evaluateComplexOrThrow (fn: EvalFunction): Complex {
  try {
    return fn.evaluate({ i: complex('i') })
  } catch {
    throw new SolutionParseError('Cannot evaluate expression')
  }
}

export function isComplex (value: unknown): value is Complex {
  return typeof value === 'object' && value !== null && 're' in value && 'im' in value
}

export function equalClose <T = number | Complex> (a: T, b: T, eps = 1e-6): boolean {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) < eps
  }

  if (isComplex(a) && isComplex(b)) {
    return equalClose(a.re, b.re, eps) && equalClose(a.im, b.im, eps)
  }

  throw new Error('Bad arguments')
}

export function testMultipleValues (exp1: MathNode, exp2: MathNode, args?: Record<string, number>, values?: number[]): boolean {
  values ??= createSequenceNumbers(100, -2000, 2000)

  args ??= {}

  const compiled1 = exp1.compile()
  const compiled2 = exp2.compile()

  for (const x of values) {
    const result1 = evaluateOrThrow(compiled1, Object.assign(args, { x }))
    const result2 = evaluateOrThrow(compiled2, Object.assign(args, { x }))

    if (equalClose(result1, result2)) {
      return false
    }
  }

  return true
}

// TODO: I think I should change the name.
//       Simply change it to something like "are two equations equal, tested using many values"
//       Then it can be moved to "equations" I guess.
//       I guess the problem is the "OR" in the name. It does perform a symbolic check first
//       so I guess I could divide the methods and then join both into another function.
export function checkProblemSolutionSymbolicOrValues (givenSolution: string, simplifiedCorrectAnswer: MathNode, evalArgs?: Record<string, number>): SolutionVerdict {
  const parsed = parseMathOrThrow(givenSolution)

  if (simplify(parsed).equals(simplifiedCorrectAnswer)) {
    return 'ok'
  }

  if (testMultipleValues(parsed, simplifiedCorrectAnswer, evalArgs)) {
    return 'ok'
  }

  return 'incorrect'
}

interface CreatePolynomialOptions {
  omitDegrees?: number[]
}

// TODO: Create a function that takes a math node and shuffles it to make it harder to understand.

// TODO: It'd be nice to create a polynomial using math.js builder methods.
//       https://mathjs.org/docs/reference/functions/chain.html
// TODO: This function can be tested by passing coefficients as array, and if it's undefined, generate it using
//       random numbers in the function body.
// TODO: This function is huge.
export function createPolynomial (degree: number, { omitDegrees }: CreatePolynomialOptions = {}): string {
  let result = ''
  const omitDegreesSet = new Set(omitDegrees)

  for (let i = degree; i >= 0; i--) {
    if (omitDegreesSet.has(i)) continue

    const coef = randInt(-5, 5)
    if (coef === 0) {
      continue
    }

    const sign = result.length === 0 ? '' : (coef < 0 ? '-' : '+')
    result += sign

    if (Math.abs(coef) !== 1) {
      result += Math.abs(coef)
    }

    if (i === 0) break

    result += 'x'

    if (i !== 1) {
      result += `^${i}`
    }
  }

  if (result.endsWith('-') || result.endsWith('+')) {
    return result.substring(0, result.length - 1)
  }

  if (result.length === 0) {
    return '0'
  }

  return result
}

export function implicitMultiplication (root: MathNode): MathNode {
  const transformedNode = root.transform((node: MathNode) => {
    if (node instanceof OperatorNode && node.op === '*') {
      node.implicit = true
    }
    return node
  })

  return transformedNode
}

export const camelToKebab = (s: string): string => {
  const result = s.replace(/([A-Z])/g, c => `-${c}`).toLocaleLowerCase()
  if (result.startsWith('-')) return result.substring(1)
  return result
}

export function objectKebabKeys<T> (obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [camelToKebab(key), value])
  )
}
