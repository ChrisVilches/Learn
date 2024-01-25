import { integration } from './generators/integration'
import { linearEquation } from './generators/linear-equation'
import { matrixBasic } from './generators/matrix-basic'
import { matrixInversion } from './generators/matrix-inversion'
import { matrixRank } from './generators/matrix-rank'
import { quadraticEquation } from './generators/quadratic-equation'
import { singleVariableDerivative } from './generators/single-variable-derivative'

// TODO: Unrelated to this file, but should I set a universal linter for the entire
//       monorepo?

// TODO: unit-test
// TODO: Move to util
const camelToKebab = (s: string): string => {
  const result = s.replace(/([A-Z])/g, c => `-${c}`).toLocaleLowerCase()
  if (result.startsWith('-')) return result.substring(1)
  return result
}

function objectKebabKeys<T> (obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([key, value]) => [camelToKebab(key), value])
  )
}

export const problemGenerators = objectKebabKeys({
  matrixRank,
  matrixBasic,
  matrixInversion,
  integration,
  quadraticEquation,
  linearEquation,
  singleVariableDerivative
})
