import { type Complex, evaluate, type MathNode, parse } from 'mathjs'
import { SolutionParseError } from '../main'
import { parseMatrixNumeric } from './matrix'
import { evaluateComplexOrThrow } from './misc'

export const parseComplexNumbers = (s: string): Complex[] => {
  return s.split(',')
    .map(z => parseMathOrThrow(`${z} + 0i`))
    .map(z => evaluateComplexOrThrow(z))
}

export function parseMatrixAuto (s: string): number[][] {
  if (s.includes('[') || s.includes(',')) {
    return parseMatrixSymbolic(s)
  }
  return parseMatrixNumeric(s)
}

// TODO: This function is dangerous. It may not evaluate to a matrix.
//       I think I have to do a second check myself.
export function parseMatrixSymbolic (matrix: string): number[][] {
  try {
    return evaluate(matrix).toJSON().data
  } catch (e) {
    // TODO: This try and catch is a bit fragile. There are many other functions that parse stuff, but
    //       but how can I make sure all those exceptions are translated to SolutionParseError?
    // I should create a universal catcher that picks the SyntaxError thrown by mathjs.
    throw new SolutionParseError()
  }
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
