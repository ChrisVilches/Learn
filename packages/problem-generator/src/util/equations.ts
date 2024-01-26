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

function slope (fn: (x: number) => number, x0: number, x1: number): number {
  return (fn(x1) - fn(x0)) / (x1 - x0)
}

export function isFunctionLinear (fn: (x: number) => number): boolean {
  const m = slope(fn, 0, 100)
  for (let i = -4000; i <= 4000; i += 1000) {
    if (!equalClose(m, slope(fn, i, i + 1000))) return false
  }
  return true
}

export function bisection (fn: EvalFunction, lo = -1000, hi = 1000): number {
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
