import { booleanAlgebra } from './generators/boolean-algebra'
import { integration } from './generators/integration'
import { linearEquation } from './generators/linear-equation'
import { matrixBasic } from './generators/matrix-basic'
import { matrixInversion } from './generators/matrix-inversion'
import { matrixRank } from './generators/matrix-rank'
import { quadraticEquation } from './generators/quadratic-equation'
import { singleVariableDerivative } from './generators/single-variable-derivative'
import { objectKebabKeys } from './util/misc'
export { type SolutionVerdict } from './types/solution'
export { type ProblemSolutionOptions } from './types/problem'

// TODO: One way to improve parsing safety is to make the generators simple, but add protection here
//       (transform the checkSolution functions). That way we can catch all kinds of errors (other syntax
//       errors that currently may not be handled). Mind the typing may become a bit unsafe, so check
//       carefully if it's doable or not.
export const problemGenerators = objectKebabKeys({
  matrixRank,
  matrixBasic,
  matrixInversion,
  integration,
  quadraticEquation,
  linearEquation,
  singleVariableDerivative,
  booleanAlgebra
})
