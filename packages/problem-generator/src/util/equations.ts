import { type Complex, type EvalFunction, type MathNode, derivative } from 'mathjs'
import { equalClose } from './misc'

export function isSolution (equation: MathNode, x: Complex): boolean {
  const value: Complex = equation.evaluate({ x })
  const magnitude = value.toPolar().r
  return equalClose(magnitude, 0)
}

export function parabolaHasRepeatedSolutions (fn: MathNode): boolean {
  const deriv = derivative(fn, 'x')
  const xVertex = bisection(deriv)
  const yParabolaVertex: number = fn.evaluate({ x: xVertex })
  return Math.abs(yParabolaVertex) < 1e-6
}

export function bisection (fn: EvalFunction, lo = -1000, hi = 1000): number {
  // TODO: Range should be parameterizable
  lo ??= -1000
  hi ??= 1000

  for (let iter = 80; iter >= 0; iter--) {
    const mid = (lo + hi) / 2
    const val: number = fn.evaluate({ x: mid })
    const loVal: number = fn.evaluate({ x: lo })

    if (val === 0) {
      return mid
    }

    if (loVal <= 0) {
      if (val < 0) {
        lo = mid
      } else {
        hi = mid
      }
    } else {
      if (val < 0) {
        hi = mid
      } else {
        lo = mid
      }
    }
  }

  return lo
}
