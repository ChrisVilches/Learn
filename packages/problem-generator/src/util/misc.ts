import { type MathNode, parse, simplify, type EvalFunction, type Complex, complex, OperatorNode } from 'mathjs'
import { SolutionParseError } from '../types/errors'
import { randInt } from './random'
import { type SolutionVerdict } from '../types/solution'

// TODO: Split this file by topic.

function createSequenceNumbers (length: number, low = -1000, high = 1000): number[] {
  const result: number[] = []
  const step = (high - low) / length
  for (let i = low; i <= high; i += step) {
    result.push(i)
  }
  return result
}

// TODO: I think this doesn't validate if the result will be a proper complex
function evaluateComplexOrThrow (fn: EvalFunction): Complex {
  try {
    return fn.evaluate({ i: complex('i') })
  } catch {
    throw new SolutionParseError('Cannot evaluate expression')
  }
}

export const parseComplexNumbers = (s: string): Complex[] => {
  return s.split(',')
    .map(z => parseMathOrThrow(`${z} + 0i`))
    .map(z => evaluateComplexOrThrow(z))
}

// TODO: I think this doesn't validate if the result will be a proper number
function evaluateOrThrow (fn: EvalFunction, args: Record<string, number>): number {
  try {
    return fn.evaluate(args)
  } catch {
    throw new SolutionParseError('Cannot evaluate expression')
  }
}

function isComplex (value: unknown): value is Complex {
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

  const eps = 1e-6

  args ??= {}

  const compiled1 = exp1.compile()
  const compiled2 = exp2.compile()

  for (const x of values) {
    const result1 = evaluateOrThrow(compiled1, Object.assign(args, { x }))
    const result2 = evaluateOrThrow(compiled2, Object.assign(args, { x }))

    // TODO: Must handle infinity and NaN cases. (I think this TODO is OK)
    // TODO: use equalClose
    if (Math.abs(result1 - result2) > eps) {
      return false
    }
  }

  return true
}

export function parseNumberOrThrow (s: string): number {
  const result = parseFloat(s)
  if (isNaN(result)) {
    throw new SolutionParseError(`Cannot convert '${s}' to number`)
  }
  return result
}

export function parseMathOrThrow (s: string): MathNode {
  if (s.trim().length === 0) {
    throw new SolutionParseError()
  }

  try {
    return parse(s)
  } catch {
    throw new SolutionParseError(`Cannot parse: ${s}`)
  }
}

// TODO: I think I should change the name.
//       Simply change it to something like "are two equations equal, tested using many values"
//       Then it can be moved to "equations" I guess.
//       I guess the problem is the "OR" in the name. It does perform a symbolic check first
//       so I guess I could divide the methods and then join both into another function.
export function checkProblemSolutionSymbolicOrValues (givenSolution: string, simplifiedCorrectAnswer: MathNode, evalArgs?: Record<string, number>): SolutionVerdict {
  // TODO: The "cannot-parse" verdict can be divided into other error types. Maybe explain error type, etc.
  const parsed = parseMathOrThrow(givenSolution)

  if (simplify(parsed).equals(simplifiedCorrectAnswer)) {
    return 'ok'
  }

  if (testMultipleValues(parsed, simplifiedCorrectAnswer, evalArgs)) {
    return 'ok'
  }

  return 'incorrect'
}

// TODO: Create a function that takes a math node and shuffles it to make it harder to understand.

// TODO: It'd be nice to create a polynomial using math.js builder methods.
//       https://mathjs.org/docs/reference/functions/chain.html
// TODO: This function can be tested by passing coefficients as array, and if it's undefined, generate it using
//       random numbers in the function body.
// TODO: This function is huge.
export function createPolynomial (degree = 3): string {
  let result = ''

  for (let i = degree; i >= 0; i--) {
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
