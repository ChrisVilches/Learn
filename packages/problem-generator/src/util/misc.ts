import { type MathNode, simplify, type Complex, OperatorNode } from 'mathjs'
import { parseMathOrThrow } from './parse'

function createSequenceNumbers (length: number, low = -1000, high = 1000): number[] {
  const result: number[] = []
  const step = (high - low) / length
  for (let i = low; i <= high; i += step) {
    result.push(i)
  }
  return result
}

export function isComplex (value: unknown): value is Complex {
  return typeof value === 'object' && value !== null && 're' in value && 'im' in value
}

type ComparableNumber = number | { re: number, im: number }

export function equalClose (a: ComparableNumber, b: ComparableNumber, eps = 1e-6): boolean {
  if (a === Infinity && b === Infinity) return true
  if (a === -Infinity && b === -Infinity) return true

  if (typeof a === 'number' && typeof b === 'number') {
    if (isNaN(a) && isNaN(b)) return true
    if (isNaN(a) !== isNaN(b)) return false
    return Math.abs(a - b) < eps
  }

  const z0 = isComplex(a) ? a : { re: a, im: 0 }
  const z1 = isComplex(b) ? b : { re: b, im: 0 }

  return equalClose(z0.re, z1.re, eps) && equalClose(z0.im, z1.im, eps)
}

export function symbolicEqual (exp1: MathNode | string, exp2: MathNode | string): boolean {
  const a = typeof exp1 === 'string' ? parseMathOrThrow(exp1) : exp1
  const b = typeof exp2 === 'string' ? parseMathOrThrow(exp2) : exp2
  return simplify(a).equals(simplify(b))
}

export function multipleEvalEqual (exp1: MathNode | string, exp2: MathNode | string, args?: Record<string, number>, values?: number[]): boolean {
  const a = typeof exp1 === 'string' ? parseMathOrThrow(exp1) : exp1
  const b = typeof exp2 === 'string' ? parseMathOrThrow(exp2) : exp2

  values ??= createSequenceNumbers(100, -2000, 2000)

  args ??= {}

  const compiled1 = a.compile()
  const compiled2 = b.compile()

  for (const x of values) {
    const opts = Object.assign(args, { x })
    const result1 = compiled1.evaluate(opts) as ComparableNumber
    const result2 = compiled2.evaluate(opts) as ComparableNumber

    if (!equalClose(result1, result2)) return false
  }

  return true
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
